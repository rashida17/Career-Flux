import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  UserRound,
  Code,
  Search,
  FileText,
  CalendarCheck,
  Map,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Sparkles,
  BadgeCheck,
  AlertCircle,
  ExternalLink,
  X,
  ChevronRight,
  Award,
  Folder,
  Target,
  CheckCircle2,
  Loader2,
  Compass,
  Link2,
  UploadCloud,
  Layers,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import FormLayout from "../components/FormLayout";

/* ---------- Sidebar items ---------- */
const seekerNavItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Profile", icon: UserRound },
  { label: "My Skills", icon: Code },
  { label: "Find Jobs", icon: Search },
  { label: "My Applications", icon: FileText },
  { label: "Interviews", icon: CalendarCheck },
  { label: "Career Roadmap", icon: Map },
  { label: "Settings", icon: Settings },
  { label: "Logout", icon: LogOut },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const EVIDENCE_TYPES = ["Project", "Certificate"];
const FILE_ACCEPT = "application/pdf,image/png,image/jpeg";

const ROLE_CATALOG = [
  {
    keys: ["frontend", "front end", "front-end", "react developer", "web developer"],
    title: "Frontend Developer",
    skills: [
      { name: "HTML", reason: "Foundation of every web interface" },
      { name: "CSS", reason: "Layout and responsive design" },
      { name: "JavaScript", reason: "Core language of frontend work" },
      { name: "React", reason: "Most requested frontend library" },
      { name: "Tailwind CSS", reason: "Popular utility-first styling" },
      { name: "TypeScript", reason: "Widely required in frontend listings" },
      { name: "Next.js", reason: "Popular React framework" },
      { name: "Testing (Jest)", reason: "Expected by quality-focused teams" },
      { name: "Git", reason: "Core tool for collaboration" },
    ],
  },
  {
    keys: ["backend", "back end", "back-end", "node", "api developer"],
    title: "Backend Developer",
    skills: [
      { name: "Node.js", reason: "Common runtime for backend services" },
      { name: "Express", reason: "Standard framework for Node APIs" },
      { name: "SQL", reason: "Relational database querying" },
      { name: "PostgreSQL", reason: "Widely used production database" },
      { name: "REST APIs", reason: "Core of backend development" },
      { name: "Authentication (JWT)", reason: "Required for secure apps" },
      { name: "Git", reason: "Core tool for collaboration" },
    ],
  },
  {
    keys: ["full stack", "fullstack", "full-stack"],
    title: "Full Stack Developer",
    skills: [
      { name: "HTML", reason: "Foundation of every web interface" },
      { name: "JavaScript", reason: "Used on frontend and backend" },
      { name: "React", reason: "Most requested frontend library" },
      { name: "Node.js", reason: "Common backend runtime" },
      { name: "SQL", reason: "Relational databases" },
      { name: "REST APIs", reason: "Connects frontend and backend" },
      { name: "Git", reason: "Core tool for collaboration" },
    ],
  },
  {
    keys: ["data analyst", "data analysis", "analyst"],
    title: "Data Analyst",
    skills: [
      { name: "SQL", reason: "Primary tool for querying data" },
      { name: "Excel", reason: "Common for quick analysis" },
      { name: "Python", reason: "Data cleaning and analysis" },
      { name: "Power BI", reason: "Popular dashboard tool" },
      { name: "Statistics", reason: "Interpreting data correctly" },
    ],
  },
  {
    keys: ["ui", "ux", "designer", "design"],
    title: "UI/UX Designer",
    skills: [
      { name: "Figma", reason: "Industry-standard design tool" },
      { name: "Wireframing", reason: "Plans layouts before design" },
      { name: "Prototyping", reason: "Tests ideas before development" },
      { name: "User Research", reason: "Grounds design in real needs" },
      { name: "Design Systems", reason: "Keeps interfaces consistent" },
    ],
  },
];

function mockAiMatch(role) {
  const q = role.trim().toLowerCase();
  const found = ROLE_CATALOG.find((r) => r.keys.some((k) => q.includes(k)));
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          found
            ? { roleTitle: found.title, requiredSkills: found.skills }
            : { roleTitle: null, requiredSkills: [] }
        ),
      1200
    )
  );
}

// Retrieve token from localStorage or sessionStorage depending on "Keep me signed in"
const getAuthToken = () =>
  localStorage.getItem("careerFluxToken") ||
  sessionStorage.getItem("careerFluxToken") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

// Convert uploaded file to Base64 string so it persists in MongoDB
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const isVerified = (s) => (s?.evidence?.length || 0) > 0;

// Convert Base64 proof data URL to a temporary Blob URL when clicked so browser opens it cleanly
const openProofItem = (ev) => {
  const link = ev?.proof_link;
  if (!link) return;

  if (link.startsWith("data:")) {
    try {
      const [header, base64Data] = link.split(",");
      const mimeMatch = header.match(/data:(.*?);base64/);
      const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      return;
    } catch (err) {
      console.error("Failed to open Base64 proof:", err);
    }
  }

  window.open(link, "_blank", "noopener,noreferrer");
};

const BADGE_TONES = {
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  neutral: "bg-stone-100 text-stone-600 border border-stone-200/50",
};

function Badge({ tone = "neutral", icon: Icon, children }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${BADGE_TONES[tone]}`}
    >
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  );
}

function IconButton({ label, children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className="shrink-0 rounded-xl p-2 text-stone-400 transition-all hover:bg-stone-100 hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, children, maxWidth = "max-w-xl" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs transition-all"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-3xl bg-white shadow-2xl`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-xl p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

function ProofModeTabs({ mode, onChange }) {
  const tabs = [
    { key: "link", label: "Web Link", icon: Link2 },
    { key: "file", label: "Upload File", icon: UploadCloud },
  ];
  return (
    <div
      role="tablist"
      aria-label="Proof type"
      className="inline-flex rounded-2xl border border-stone-200/60 bg-stone-100 p-1.5"
    >
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={mode === key}
          onClick={() => onChange(key)}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
            mode === key
              ? "border border-stone-200/60 bg-white font-semibold text-brand-500 shadow-sm"
              : "font-medium text-stone-500 hover:text-slate-800"
          }`}
        >
          <Icon size={15} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}

function Detail({ label, children }) {
  return (
    <div className="min-w-0 rounded-2xl border border-stone-200/60 bg-stone-50/60 p-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-bold text-slate-800">{children}</dd>
    </div>
  );
}

function SkillRow({
  skill,
  expanded,
  onToggle,
  onAddProof,
  onRemoveSkill,
  onRemoveProof,
}) {
  const verified = isVerified(skill);
  const count = skill.evidence?.length || 0;
  const proofText = `${count} ${count === 1 ? "proof" : "proofs"}`;

  return (
    <li className="group/row rounded-2xl border border-stone-200/70 bg-white p-4 transition-all duration-200 hover:border-stone-300 hover:shadow-xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500 transition-transform duration-200 ${
              expanded ? "rotate-90 bg-brand-50 text-brand-500" : ""
            }`}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </div>
          <span
            className="min-w-0 truncate text-base font-bold text-slate-900 transition-colors group-hover/row:text-brand-600"
            title={skill.skill_name}
          >
            {skill.skill_name}
          </span>

          {verified ? (
            <span
              className="inline-flex shrink-0 text-emerald-600"
              title={`Verified: ${proofText}`}
            >
              <BadgeCheck size={20} aria-hidden="true" />
            </span>
          ) : (
            <span
              className="inline-flex shrink-0 text-amber-500"
              title="Needs proof"
            >
              <AlertCircle size={19} aria-hidden="true" />
            </span>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onAddProof}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-xl bg-brand-50 px-3 py-2 text-xs font-bold text-brand-500 transition-all hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Plus size={14} /> Add proof
          </button>
          <IconButton label={`Remove ${skill.skill_name}`} onClick={onRemoveSkill}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-stone-100 pl-2 pt-4">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Detail label="Level">{skill.proficiency_level}</Detail>
            <Detail label="Added">
              {fmtDate(skill.added_date || skill.createdAt)}
            </Detail>
            <Detail label="Proof">
              {verified ? (
                <span className="text-emerald-700">{proofText}</span>
              ) : (
                <span className="text-amber-700">None yet</span>
              )}
            </Detail>
          </dl>

          <div className="mt-4">
            {count === 0 ? (
              <p className="rounded-2xl border border-stone-200/60 bg-stone-50/50 p-4 text-center text-xs font-medium text-stone-500">
                No proof added yet. Link a project or certificate to verify your
                skill.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {skill.evidence.map((ev) => (
                  <li
                    key={ev._id}
                    className="group/item flex items-start justify-between gap-3 rounded-2xl border border-stone-200/80 border-l-4 border-l-brand-500 bg-stone-50/50 p-4 transition-all hover:bg-white hover:shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-2 text-sm font-bold text-slate-900">
                        {ev.evidence_title}
                        <span className="inline-flex items-center gap-1 rounded-md bg-stone-200/60 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                          {ev.evidence_type === "Certificate" ? (
                            <Award size={12} />
                          ) : (
                            <Folder size={12} />
                          )}
                          {ev.evidence_type}
                        </span>
                      </p>
                     {ev.description && (
  <p className="mt-1 text-xs leading-relaxed text-stone-600">
    {ev.description}
  </p>
)}
<button
  type="button"
  onClick={() => openProofItem(ev)}
  className="mt-2 inline-flex max-w-full items-center gap-1.5 text-left text-xs font-semibold text-brand-500 hover:underline"
>
  <ExternalLink size={12} className="shrink-0" />
  <span className="truncate">
    {ev.file_name || ev.proof_link}
  </span>
</button>
                    </div>
                    <IconButton
                      label="Delete proof"
                      onClick={() => onRemoveProof(ev._id)}
                    >
                      <Trash2 size={15} />
                    </IconButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function MySkillsPage({
  user = { name: "Ahmed" },
  initialTargetRole = "",
  focusSkillId = null,
  navigationItems = seekerNavItems,
  onNavigate,
  onTargetRoleChange,
  onGenerateRoadmap,
}) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [proofFor, setProofFor] = useState(focusSkillId);
  const [proofMode, setProofMode] = useState("link");
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");

  const [roleInput, setRoleInput] = useState(initialTargetRole);
  const [roleError, setRoleError] = useState("");
  const [aiStatus, setAiStatus] = useState("idle");
  const [aiResult, setAiResult] = useState({
    roleTitle: null,
    requiredSkills: [],
  });
  const searchId = useRef(0);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const notify = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  // Fetch skills from backend API
  const fetchSkills = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/jobseeker/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSkills(data.skills);
        if (data.skills.length > 0 && !expandedId) {
          setExpandedId(data.skills[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
    if (initialTargetRole) runSearch(initialTargetRole);
  }, []);

  const runSearch = async (role) => {
    const value = role.trim();
    if (value.length < 3) {
      setRoleError("Enter a job role (at least 3 characters).");
      return;
    }
    setRoleError("");
    setAiStatus("loading");
    const myId = ++searchId.current;
    try {
      const res = await mockAiMatch(value);
      if (myId !== searchId.current) return;
      setAiResult(res);
      setAiStatus(res.roleTitle ? "done" : "unknown");
      if (res.roleTitle) onTargetRoleChange?.(res.roleTitle);
    } catch {
      if (myId === searchId.current) setAiStatus("error");
    }
  };

  const clearSearch = () => {
    searchId.current++;
    setRoleInput("");
    setRoleError("");
    setAiStatus("idle");
    setAiResult({ roleTitle: null, requiredSkills: [] });
  };

  const total = skills.length;
  const verifiedCount = skills.filter(isVerified).length;
  const needsProof = total - verifiedCount;

  const haveSet = useMemo(
    () => new Set(skills.map((s) => s.skill_name.toLowerCase())),
    [skills]
  );
  const matched = useMemo(
    () =>
      aiResult.requiredSkills.filter((r) =>
        haveSet.has(r.name.toLowerCase())
      ),
    [aiResult, haveSet]
  );
  const missing = useMemo(
    () =>
      aiResult.requiredSkills.filter(
        (r) => !haveSet.has(r.name.toLowerCase())
      ),
    [aiResult, haveSet]
  );
  const requiredTotal = aiResult.requiredSkills.length;
  const matchPct = requiredTotal
    ? Math.round((matched.length / requiredTotal) * 100)
    : 0;

  const visibleSkills = useMemo(
    () =>
      skills.filter((s) => {
        if (filter === "verified") return isVerified(s);
        if (filter === "needs") return !isVerified(s);
        return true;
      }),
    [skills, filter]
  );

  const proofSkill = skills.find((s) => s._id === proofFor);

  // Add skill API call
  const addSkill = async (values, isAi = false) => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/jobseeker/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skill_name: values.skill_name.trim(),
          proficiency_level: values.proficiency_level || "Beginner",
          is_ai_suggested: isAi,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSkills((prev) => [data.skill, ...prev]);
      notify(`${data.skill.skill_name} added.`);
    } catch (err) {
      notify(err.message || "Failed to add skill.");
    }
  };

  const openProof = (skillId) => {
    setProofMode("link");
    setProofFor(skillId);
  };

  // Add proof API call (stores Base64 file or web link in MongoDB)
  const addProof = async (values) => {
    try {
      const file = proofMode === "file" ? values.proof_file : null;
      const base64File = file ? await fileToBase64(file) : null;

      const payload = {
        evidence_title: values.evidence_title.trim(),
        evidence_type: values.evidence_type,
        description: (values.description || "").trim(),
        proof_link: base64File || values.proof_link.trim(),
        file_name: file ? file.name : null,
      };

      const token = getAuthToken();
      const res = await fetch(
        `http://localhost:5000/api/jobseeker/skills/${proofFor}/evidence`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSkills((prev) =>
        prev.map((s) => (s._id === proofFor ? data.skill : s))
      );
      setExpandedId(proofFor);
      setProofFor(null);
      notify("Proof added. Skill verified.");
    } catch (err) {
      notify(err.message || "Failed to add proof.");
    }
  };

  // Delete skill or evidence API call
  const doConfirm = async () => {
    if (!confirm) return;
    try {
      const token = getAuthToken();
      let url = "";
      if (confirm.type === "skill") {
        url = `http://localhost:5000/api/jobseeker/skills/${confirm.skillId}`;
      } else {
        url = `http://localhost:5000/api/jobseeker/skills/${confirm.skillId}/evidence/${confirm.evidenceId}`;
      }

      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      if (confirm.type === "skill") {
        setSkills((prev) => prev.filter((s) => s._id !== confirm.skillId));
        notify("Skill removed.");
      } else {
        const data = await res.json();
        setSkills((prev) =>
          prev.map((s) => (s._id === confirm.skillId ? data.skill : s))
        );
        notify("Proof deleted.");
      }
    } catch (err) {
      notify("Action failed.");
    } finally {
      setConfirm(null);
    }
  };

  const getRoadmap = (skillName) => {
    if (onGenerateRoadmap) onGenerateRoadmap(skillName, aiResult.roleTitle);
    else notify(`Roadmap for ${skillName} is coming soon.`);
  };

  const skillFields = [
    {
      name: "skill_name",
      label: "Skill Name",
      type: "text",
      icon: Sparkles,
      placeholder: "e.g. React",
      minLength: 2,
      full: true,
      validate: (v) =>
        skills.some(
          (s) => s.skill_name.toLowerCase() === v.trim().toLowerCase()
        )
          ? "You have already added this skill."
          : "",
    },
    {
      name: "proficiency_level",
      label: "Proficiency Level",
      type: "select",
      icon: Award,
      placeholder: "Select your level",
      options: LEVELS,
      full: true,
    },
  ];

  const proofFields = [
    {
      name: "evidence_title",
      label: "Proof Title",
      type: "text",
      icon: FileText,
      placeholder: "e.g. Portfolio Website",
      minLength: 3,
    },
    {
      name: "evidence_type",
      label: "Proof Type",
      type: "select",
      icon: Folder,
      placeholder: "Select type",
      options: EVIDENCE_TYPES,
    },
    proofMode === "link"
      ? {
          name: "proof_link",
          label: "Proof Link",
          type: "url",
          icon: ExternalLink,
          placeholder: "https://github.com/username/repo",
          full: true,
          invalidMessage: "Enter a valid link.",
        }
      : {
          name: "proof_file",
          label: "Certificate or Image",
          type: "file",
          accept: FILE_ACCEPT,
          typeLabel: "PDF, PNG or JPG",
          maxSizeMB: 5,
          requiredMessage: "Please upload a file.",
        },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 3,
      maxLength: 300,
      optional: true,
      placeholder: "What did you build or learn?",
    },
  ];

  const filters = [
    { key: "all", label: "All", count: total },
    { key: "verified", label: "Verified", count: verifiedCount },
    { key: "needs", label: "Needs proof", count: needsProof },
  ];

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      activeTab="My Skills"
      onNavigate={onNavigate}
      workspaceLabel="Job Seeker Workspace"
      menuTitle="Job Seeker Menu"
      user={user}
      role="jobseeker"
    >
      <div className="space-y-6 font-sans">
        {toast && (
          <div
            role="status"
            className="animate-fade-in rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm"
          >
            {toast}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <section className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8 lg:col-span-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  Your Skills
                </h1>
                <p className="mt-1 text-sm text-stone-500">
                  Manage your technical stack and proof of work
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSkill(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-brand-600 hover:shadow-md"
              >
                <Plus size={16} /> Add Skill
              </button>
            </div>

            {total > 0 && (
              <div className="mt-6 flex flex-wrap gap-2" role="tablist">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.key}
                    onClick={() => setFilter(f.key)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      filter === f.key
                        ? "border border-brand-200 bg-brand-50 text-brand-600 shadow-2xs"
                        : "border border-transparent text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4">
              {loading ? (
                <div className="py-12 text-center text-sm text-stone-500">
                  Loading your skills from database...
                </div>
              ) : total === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-stone-200/60 bg-stone-50/50 px-6 py-12 text-center">
                  <span className="rounded-2xl bg-brand-50 p-3.5 text-brand-500 shadow-xs">
                    <Layers size={24} />
                  </span>
                  <p className="mt-3.5 text-sm font-bold text-slate-900">
                    Add your first skill to start building proof
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddSkill(true)}
                    className="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white shadow-xs"
                  >
                    Add Skill
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {visibleSkills.map((s) => (
                    <SkillRow
                      key={s._id}
                      skill={s}
                      expanded={expandedId === s._id}
                      onToggle={() =>
                        setExpandedId(expandedId === s._id ? null : s._id)
                      }
                      onAddProof={() => openProof(s._id)}
                      onRemoveSkill={() =>
                        setConfirm({ type: "skill", skillId: s._id })
                      }
                      onRemoveProof={(evId) =>
                        setConfirm({
                          type: "evidence",
                          skillId: s._id,
                          evidenceId: evId,
                        })
                      }
                    />
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* AI Career Match Section */}
          <aside className="lg:sticky lg:top-24 lg:col-span-5">
            <section className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-xs sm:p-8">
              <div className="flex items-start gap-3">
                <span className="rounded-2xl border border-brand-100 bg-brand-50 p-3 text-brand-500 shadow-xs">
                  <Sparkles size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    AI Career Match
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-stone-500">
                    {aiStatus === "done"
                      ? `Skill gap for ${aiResult.roleTitle}`
                      : "Search a role to see your skill gap"}
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch(roleInput);
                }}
                className="mt-5"
              >
                <div className="flex gap-2">
                  <div
                    className={`flex min-h-[50px] flex-1 items-center gap-2 rounded-2xl border bg-stone-50/80 py-1.5 pl-3.5 pr-1.5 transition-all ${
                      roleError ? "border-brand-500" : "border-stone-200"
                    }`}
                  >
                    <Search size={16} className="shrink-0 text-brand-500" />
                    <input
                      value={roleInput}
                      onChange={(e) => {
                        setRoleInput(e.target.value);
                        setRoleError("");
                      }}
                      placeholder="e.g., Full Stack Developer..."
                      className="min-w-0 flex-1 bg-transparent py-1.5 text-sm font-semibold text-slate-800 outline-none placeholder:text-stone-400"
                    />
                    {roleInput && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="shrink-0 rounded-lg p-1.5 text-stone-400 hover:bg-stone-200/60"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={aiStatus === "loading"}
                    className="flex min-h-[50px] w-[54px] shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md hover:bg-brand-600 disabled:opacity-60"
                  >
                    {aiStatus === "loading" ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {roleError && (
                  <p className="mt-2 text-xs font-bold text-brand-600">
                    {roleError}
                  </p>
                )}
              </form>

              <div className="mt-6">
                {aiStatus === "idle" && (
                  <div className="flex flex-col items-center rounded-2xl border border-stone-200/60 bg-stone-50/50 px-6 py-10 text-center">
                    <span className="rounded-2xl bg-brand-50 p-3.5 text-brand-500 shadow-xs">
                      <Target size={22} />
                    </span>
                    <p className="mt-3.5 text-sm font-bold text-slate-900">
                      No role selected yet
                    </p>
                  </div>
                )}
                {aiStatus === "loading" && (
                  <div className="space-y-2.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 animate-pulse rounded-2xl bg-stone-100"
                      />
                    ))}
                  </div>
                )}
                {aiStatus === "done" && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-stone-200/60 bg-stone-50/50 p-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                          Match overview
                        </p>
                        <p className="text-xs font-bold text-slate-800">
                          {matched.length} of {requiredTotal} matched ({matchPct}
                          %)
                        </p>
                      </div>
                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-stone-200/80">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all duration-500"
                          style={{ width: `${matchPct}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Skills you have ({matched.length})
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {matched.map((m) => (
                          <Badge
                            key={m.name}
                            tone="success"
                            icon={CheckCircle2}
                          >
                            {m.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Skills you need ({missing.length})
                      </p>
                      <ul className="mt-2 space-y-2.5">
                        {missing.map((s) => (
                          <li
                            key={s.name}
                            className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200/60 bg-stone-50/40 p-3.5 hover:bg-white"
                          >
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <p className="text-sm font-bold text-slate-900">
                                {s.name}
                              </p>
                              <p className="text-xs leading-snug text-stone-500">
                                {s.reason}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => getRoadmap(s.name)}
                                className="inline-flex items-center gap-1 rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-500 hover:bg-brand-100"
                              >
                                <Compass size={13} />
                                Roadmap
                              </button>
                              <IconButton
                                label="Add skill"
                                onClick={() =>
                                  addSkill(
                                    {
                                      skill_name: s.name,
                                      proficiency_level: "Beginner",
                                    },
                                    true
                                  )
                                }
                              >
                                <Plus size={16} />
                              </IconButton>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>

      <Modal
        open={showAddSkill}
        onClose={() => setShowAddSkill(false)}
        maxWidth="max-w-lg"
      >
        <FormLayout
          title="Add Skill"
          description="Add a skill to your profile."
          submitLabel="Add Skill"
          submitPlacement="bottom"
          fields={skillFields}
          onSubmit={(values) => {
            addSkill(values, false);
            setShowAddSkill(false);
          }}
        />
      </Modal>

      <Modal open={Boolean(proofSkill)} onClose={() => setProofFor(null)}>
        {proofSkill && (
          <FormLayout
            title="Add Proof"
            description={`Add proof for ${proofSkill.skill_name}.`}
            submitLabel="Save Proof"
            submitPlacement="bottom"
            fields={proofFields}
            onSubmit={addProof}
            before={() => (
              <ProofModeTabs mode={proofMode} onChange={setProofMode} />
            )}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        maxWidth="max-w-md"
      >
        <div className="p-6 sm:p-8">
          <h3 className="text-xl font-extrabold text-slate-900">
            {confirm?.type === "skill"
              ? "Remove this skill?"
              : "Delete this proof?"}
          </h3>
          <p className="mt-2 text-sm text-stone-600">
            This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirm(null)}
              className="rounded-2xl px-5 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={doConfirm}
              className="rounded-2xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-brand-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}