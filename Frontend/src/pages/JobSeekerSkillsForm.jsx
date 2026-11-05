import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard, User, Layers, Search, FileText, Calendar, Map as MapIcon, Settings,
  Plus, Trash2, Sparkles, BadgeCheck, AlertCircle, ExternalLink, X,
  ChevronRight, Award, Folder, Target, CheckCircle2, Loader2, Compass,
  Link2, UploadCloud,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import FormLayout from "../components/FormLayout";

/* ---------- Sidebar items (use your existing ones if you have them) ---------- */
const seekerNavItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "My Skills", icon: Layers },
  { label: "Find Jobs", icon: Search },
  { label: "My Applications", icon: FileText },
  { label: "Interviews", icon: Calendar },
  { label: "Career Roadmap", icon: MapIcon },
  { label: "Settings", icon: Settings },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const EVIDENCE_TYPES = ["Project", "Certificate"];
const FILE_ACCEPT = "application/pdf,image/png,image/jpeg";

/* ---------- Mock data (backend later: GET /seeker/skills) ---------- */
const mockSkills = [
  {
    id: 1, skill_name: "React", proficiency_level: "Advanced",
    is_ai_suggested: false, added_date: "2026-09-12",
    evidence: [
      { id: 11, evidence_title: "Portfolio Website", evidence_type: "Project",
        description: "Responsive portfolio built with React and Tailwind.",
        proof_link: "https://github.com/ahmed/portfolio", file_name: null, created_at: "2026-09-14" },
      { id: 12, evidence_title: "Meta React Certificate", evidence_type: "Certificate",
        description: "", proof_link: "https://coursera.org/verify/abc123", file_name: null, created_at: "2026-09-20" },
    ],
  },
  { id: 2, skill_name: "JavaScript", proficiency_level: "Intermediate",
    is_ai_suggested: false, added_date: "2026-09-12",
    evidence: [
      { id: 21, evidence_title: "Todo App", evidence_type: "Project",
        description: "Vanilla JS todo app with local storage.",
        proof_link: "https://github.com/ahmed/todo", file_name: null, created_at: "2026-09-15" },
    ] },
  { id: 3, skill_name: "Tailwind CSS", proficiency_level: "Intermediate",
    is_ai_suggested: false, added_date: "2026-09-18", evidence: [] },
  { id: 4, skill_name: "HTML", proficiency_level: "Advanced",
    is_ai_suggested: false, added_date: "2026-09-10", evidence: [] },
];

/* ---------- Mock AI (replace with backend) ----------
   Backend later: POST /seeker/skills/suggestions { targetRole }
   Returns { roleTitle, requiredSkills: [{ name, reason }] }.
   Unrecognized role => { roleTitle: null }.
*/
const ROLE_CATALOG = [
  { keys: ["frontend", "front end", "front-end", "react developer", "web developer"],
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
    ] },
  { keys: ["backend", "back end", "back-end", "node", "api developer"],
    title: "Backend Developer",
    skills: [
      { name: "Node.js", reason: "Common runtime for backend services" },
      { name: "Express", reason: "Standard framework for Node APIs" },
      { name: "SQL", reason: "Relational database querying" },
      { name: "PostgreSQL", reason: "Widely used production database" },
      { name: "REST APIs", reason: "Core of backend development" },
      { name: "Authentication (JWT)", reason: "Required for secure apps" },
      { name: "Git", reason: "Core tool for collaboration" },
    ] },
  { keys: ["full stack", "fullstack", "full-stack"],
    title: "Full Stack Developer",
    skills: [
      { name: "HTML", reason: "Foundation of every web interface" },
      { name: "JavaScript", reason: "Used on frontend and backend" },
      { name: "React", reason: "Most requested frontend library" },
      { name: "Node.js", reason: "Common backend runtime" },
      { name: "SQL", reason: "Relational databases" },
      { name: "REST APIs", reason: "Connects frontend and backend" },
      { name: "Git", reason: "Core tool for collaboration" },
    ] },
  { keys: ["data analyst", "data analysis", "analyst"],
    title: "Data Analyst",
    skills: [
      { name: "SQL", reason: "Primary tool for querying data" },
      { name: "Excel", reason: "Common for quick analysis" },
      { name: "Python", reason: "Data cleaning and analysis" },
      { name: "Power BI", reason: "Popular dashboard tool" },
      { name: "Statistics", reason: "Interpreting data correctly" },
    ] },
  { keys: ["ui", "ux", "designer", "design"],
    title: "UI/UX Designer",
    skills: [
      { name: "Figma", reason: "Industry-standard design tool" },
      { name: "Wireframing", reason: "Plans layouts before design" },
      { name: "Prototyping", reason: "Tests ideas before development" },
      { name: "User Research", reason: "Grounds design in real needs" },
      { name: "Design Systems", reason: "Keeps interfaces consistent" },
    ] },
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

/* ---------- Helpers ---------- */
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const isVerified = (s) => (s?.evidence?.length || 0) > 0;

/* ---------- Small UI pieces ---------- */
const BADGE_TONES = {
  success: "bg-emerald-50 text-emerald-700",
  neutral: "bg-stone-100 text-stone-600",
};
function Badge({ tone = "neutral", icon: Icon, children }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_TONES[tone]}`}
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
      className="shrink-0 rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-3xl bg-white shadow-floating`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* Segmented toggle for the Add Proof modal */
function ProofModeTabs({ mode, onChange }) {
  const tabs = [
    { key: "link", label: "Web Link", icon: Link2 },
    { key: "file", label: "Upload File", icon: UploadCloud },
  ];
  return (
    <div role="tablist" aria-label="Proof type" className="inline-flex rounded-xl bg-stone-100 p-1">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={mode === key}
          onClick={() => onChange(key)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
            mode === key
              ? "bg-white font-semibold text-brand-500 shadow-sm"
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

/* One label/value pair used in the expanded details grid */
function Detail({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-slate-800">{children}</dd>
    </div>
  );
}

/* ---------- Skill row ----------
   Collapsed: arrow + name + status icon | + Add proof, delete
   Expanded:  details grid (Level / Added / Proof), then proof items */
function SkillRow({ skill, expanded, onToggle, onAddProof, onRemoveSkill, onRemoveProof }) {
  const verified = isVerified(skill);
  const count = skill.evidence?.length || 0;
  const proofText = `${count} ${count === 1 ? "proof" : "proofs"}`;

  return (
    <li className="border-b border-stone-100 last:border-b-0">
      <div className="flex items-center gap-3 py-3.5">
        {/* LEFT: arrow + name + status icon */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ChevronRight
            size={18}
            aria-hidden="true"
            className={`shrink-0 text-stone-400 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
          <span className="min-w-0 truncate font-semibold text-slate-900" title={skill.skill_name}>
            {skill.skill_name}
          </span>

          {verified ? (
            <span
              className="inline-flex shrink-0 text-emerald-600"
              title={`Verified: ${proofText}`}
              role="img"
              aria-label={`Verified: ${proofText}`}
            >
              <BadgeCheck size={19} aria-hidden="true" />
            </span>
          ) : (
            <span
              className="inline-flex shrink-0 text-amber-500"
              title="Needs proof"
              role="img"
              aria-label="Needs proof"
            >
              <AlertCircle size={18} aria-hidden="true" />
            </span>
          )}
        </button>

        {/* RIGHT: actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onAddProof}
            className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-semibold text-brand-500 transition-colors hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            + Add proof
          </button>
          <IconButton label={`Remove ${skill.skill_name}`} onClick={onRemoveSkill}>
            <Trash2 size={15} />
          </IconButton>
        </div>
      </div>

      {expanded && (
        <div className="mb-5 ml-7">
          {/* Details grid: each fact has its own label */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-b border-stone-100 pb-4 sm:grid-cols-3">
            <Detail label="Level">{skill.proficiency_level}</Detail>
            <Detail label="Added">{fmtDate(skill.added_date)}</Detail>
            <Detail label="Proof">
              {verified ? (
                <span className="text-emerald-700">{proofText}</span>
              ) : (
                <span className="text-amber-700">None yet</span>
              )}
            </Detail>
            {skill.is_ai_suggested && (
              <Detail label="Source">
                <span className="inline-flex items-center gap-1">
                  <Sparkles size={13} className="text-brand-500" aria-hidden="true" /> AI suggested
                </span>
              </Detail>
            )}
          </dl>

          {/* Proof items */}
          <div className="pt-4">
            {count === 0 ? (
              <p className="rounded-xl bg-stone-50/80 p-3 text-xs text-stone-500">
                No proof yet. Add a link, certificate or image to verify this skill.
              </p>
            ) : (
              <ul className="space-y-2">
                {skill.evidence.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-start justify-between gap-3 rounded-xl border-l-2 border-brand-500 bg-stone-50/80 p-3"
                  >
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-slate-900">
                        {ev.evidence_title}
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500">
                          {ev.file_name ? (
                            <FileText size={12} />
                          ) : ev.evidence_type === "Certificate" ? (
                            <Award size={12} />
                          ) : (
                            <Folder size={12} />
                          )}
                          {ev.evidence_type}
                        </span>
                      </p>
                      {ev.description && (
                        <p className="mt-0.5 text-xs text-stone-600">{ev.description}</p>
                      )}
                      <a
                        href={ev.proof_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex max-w-full items-center gap-1 text-xs font-semibold text-brand-500 hover:underline"
                      >
                        <ExternalLink size={12} className="shrink-0" aria-hidden="true" />
                        <span className="truncate">{ev.file_name || ev.proof_link}</span>
                      </a>
                    </div>
                    <IconButton label={`Delete ${ev.evidence_title}`} onClick={() => onRemoveProof(ev.id)}>
                      <Trash2 size={14} />
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

/* ---------- Page ---------- */
export default function MySkillsPage({
  user = { name: "Ahmed" },
  initialTargetRole = "",     // job_seeker_profile.target_job_title
  initialSkills = mockSkills, // pass [] to test the new-user state
  focusSkillId = null,        // dashboard "Add proof" can open a skill's proof modal
  navigationItems = seekerNavItems,
  onNavigate,
  onTargetRoleChange,
  onGenerateRoadmap,          // (skillName, roleTitle) => void
}) {
  const [skills, setSkills] = useState(initialSkills);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(
    () => initialSkills.find((s) => s.evidence?.length)?.id ?? null
  );
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [proofFor, setProofFor] = useState(focusSkillId);
  const [proofMode, setProofMode] = useState("link"); // "link" | "file"
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState("");

  const [roleInput, setRoleInput] = useState(initialTargetRole);
  const [roleError, setRoleError] = useState("");
  const [aiStatus, setAiStatus] = useState("idle"); // idle | loading | done | unknown | error
  const [aiResult, setAiResult] = useState({ roleTitle: null, requiredSkills: [] });
  const searchId = useRef(0);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const notify = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  /* ----- AI search ----- */
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
      // Backend later: POST /seeker/skills/suggestions { targetRole: value }
      const res = await mockAiMatch(value);
      if (myId !== searchId.current) return;
      setAiResult(res);
      setAiStatus(res.roleTitle ? "done" : "unknown");
      if (res.roleTitle) onTargetRoleChange?.(res.roleTitle);
    } catch {
      if (myId === searchId.current) setAiStatus("error");
    }
  };

  useEffect(() => {
    if (initialTargetRole) runSearch(initialTargetRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearSearch = () => {
    searchId.current++;
    setRoleInput("");
    setRoleError("");
    setAiStatus("idle");
    setAiResult({ roleTitle: null, requiredSkills: [] });
  };

  /* ----- derived ----- */
  const total = skills.length;
  const verifiedCount = skills.filter(isVerified).length;
  const needsProof = total - verifiedCount;

  const haveSet = useMemo(() => new Set(skills.map((s) => s.skill_name.toLowerCase())), [skills]);
  const matched = useMemo(
    () => aiResult.requiredSkills.filter((r) => haveSet.has(r.name.toLowerCase())),
    [aiResult, haveSet]
  );
  const missing = useMemo(
    () => aiResult.requiredSkills.filter((r) => !haveSet.has(r.name.toLowerCase())),
    [aiResult, haveSet]
  );
  const requiredTotal = aiResult.requiredSkills.length;
  const matchPct = requiredTotal ? Math.round((matched.length / requiredTotal) * 100) : 0;

  const visibleSkills = useMemo(
    () =>
      skills.filter((s) => {
        if (filter === "verified") return isVerified(s);
        if (filter === "needs") return !isVerified(s);
        return true;
      }),
    [skills, filter]
  );

  const proofSkill = skills.find((s) => s.id === proofFor);

  /* ----- actions ----- */
  const addSkill = (values, isAi = false) => {
    // Backend later: POST /seeker/skills (UNIQUE seeker_id + skill_name)
    const newSkill = {
      id: Date.now(),
      skill_name: values.skill_name.trim(),
      proficiency_level: values.proficiency_level || "Beginner",
      is_ai_suggested: isAi,
      added_date: new Date().toISOString().slice(0, 10),
      evidence: [],
    };
    setSkills((prev) => [newSkill, ...prev]);
    notify(`${newSkill.skill_name} added.`);
  };

  const openProof = (skillId) => {
    setProofMode("link");
    setProofFor(skillId);
  };

  const addProof = (values) => {
    const file = proofMode === "file" ? values.proof_file : null;
    // Backend later: POST /seeker/skills/:id/evidence
    //   link mode: JSON. file mode: multipart/form-data (field "file");
    //   server stores the file (S3/Cloudinary) and saves the returned URL in proof_link.
    const ev = {
      id: Date.now(),
      evidence_title: values.evidence_title.trim(),
      evidence_type: values.evidence_type,
      description: (values.description || "").trim(),
      // Mock only: temporary local URL so the uploaded file can be opened
      proof_link: file ? URL.createObjectURL(file) : values.proof_link.trim(),
      file_name: file ? file.name : null,
      created_at: new Date().toISOString().slice(0, 10),
    };
    setSkills((prev) =>
      prev.map((s) => (s.id === proofFor ? { ...s, evidence: [...s.evidence, ev] } : s))
    );
    setExpandedId(proofFor);
    setProofFor(null);
    notify("Proof added. Skill verified.");
  };

  const doConfirm = () => {
    if (!confirm) return;
    if (confirm.type === "skill") {
      // Backend later: DELETE /seeker/skills/:id (evidence removed by ON DELETE CASCADE)
      setSkills((prev) => prev.filter((s) => s.id !== confirm.skillId));
      notify("Skill removed.");
    } else {
      // Backend later: DELETE /evidence/:id
      setSkills((prev) =>
        prev.map((s) =>
          s.id === confirm.skillId
            ? { ...s, evidence: s.evidence.filter((e) => e.id !== confirm.evidenceId) }
            : s
        )
      );
      notify("Proof deleted.");
    }
    setConfirm(null);
  };

  const getRoadmap = (skillName) => {
    // Backend later: POST /roadmap/generate { skill, targetRole }
    if (onGenerateRoadmap) onGenerateRoadmap(skillName, aiResult.roleTitle);
    else notify(`Roadmap for ${skillName} is coming soon.`);
  };

  /* ----- FormLayout configs ----- */
  const skillFields = [
    {
      name: "skill_name", label: "Skill Name", type: "text", icon: Sparkles,
      placeholder: "e.g. React", minLength: 2, full: true,
      validate: (v) =>
        skills.some((s) => s.skill_name.toLowerCase() === v.trim().toLowerCase())
          ? "You have already added this skill."
          : "",
    },
    {
      name: "proficiency_level", label: "Proficiency Level", type: "select", icon: Award,
      placeholder: "Select your level", options: LEVELS, full: true,
    },
  ];

  const proofFields = [
    { name: "evidence_title", label: "Proof Title", type: "text", icon: FileText,
      placeholder: "e.g. Portfolio Website", minLength: 3 },
    { name: "evidence_type", label: "Proof Type", type: "select", icon: Folder,
      placeholder: "Select type", options: EVIDENCE_TYPES },
    proofMode === "link"
      ? { name: "proof_link", label: "Proof Link", type: "url", icon: ExternalLink,
          placeholder: "https://github.com/username/repo", full: true,
          invalidMessage: "Enter a valid link (GitHub, Drive, Coursera, etc.)." }
      : { name: "proof_file", label: "Certificate or Image", type: "file",
          accept: FILE_ACCEPT, typeLabel: "PDF, PNG or JPG", maxSizeMB: 5,
          requiredMessage: "Please upload a PDF, PNG or JPG file." },
    { name: "description", label: "Description", type: "textarea", rows: 3, maxLength: 300,
      optional: true, placeholder: "What did you build or learn?" },
  ];

  const filters = [
    { key: "all", label: "All", count: total },
    { key: "verified", label: "Verified", count: verifiedCount },
    { key: "needs", label: "Needs proof", count: needsProof },
  ];

  /* ---------- Render ---------- */
  return (
    <DashboardLayout
      navigationItems={navigationItems}
      activeTab="My Skills"
      onNavigate={onNavigate}
      workspaceLabel="Job Seeker Workspace"
      menuTitle="Menu"
      welcomeTitle="My Skills"
      welcomeSubtitle="Build your skill profile and back it with proof."
      user={user}
      role="jobseeker"
    >
      <div className="space-y-5 font-sans">
        {toast && (
          <div
            role="status"
            className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm"
          >
            {toast}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* LEFT (7): Your Skills */}
          <section className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Your Skills</h2>
                <p className="mt-0.5 text-sm text-stone-500">
                  Manage your technical stack and proof of work
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSkill(true)}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                <Plus size={16} aria-hidden="true" /> Add Skill
              </button>
            </div>

            {total > 0 && (
              <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter skills">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.key}
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full px-3.5 py-1.5 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                      filter === f.key
                        ? "bg-brand-50 font-semibold text-brand-500"
                        : "font-medium text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>
            )}

            <div className="mt-2">
              {total === 0 ? (
                <div className="mt-4 flex flex-col items-center rounded-2xl bg-stone-50 px-6 py-12 text-center">
                  <span className="rounded-full bg-brand-50 p-3 text-brand-500">
                    <Layers size={24} aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-slate-900">
                    Add your first skill to start building proof
                  </p>
                  <p className="mt-1 max-w-xs text-sm text-stone-500">
                    Skills backed by a project or certificate stand out to employers.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddSkill(true)}
                    className="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                  >
                    Add Skill
                  </button>
                </div>
              ) : visibleSkills.length === 0 ? (
                <p className="mt-4 rounded-2xl bg-stone-50 px-5 py-8 text-center text-sm text-stone-500">
                  No skills match this filter.
                </p>
              ) : (
                <ul>
                  {visibleSkills.map((s) => (
                    <SkillRow
                      key={s.id}
                      skill={s}
                      expanded={expandedId === s.id}
                      onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
                      onAddProof={() => openProof(s.id)}
                      onRemoveSkill={() => setConfirm({ type: "skill", skillId: s.id })}
                      onRemoveProof={(evId) =>
                        setConfirm({ type: "evidence", skillId: s.id, evidenceId: evId })
                      }
                    />
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* RIGHT (5): AI Career Match & Skill Gap */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24">
            <section className="rounded-2xl bg-white p-6 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-brand-50 p-2.5 text-brand-500">
                  <Sparkles size={20} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">AI Career Match</h2>
                  <p className="mt-0.5 text-sm text-stone-500">
                    {aiStatus === "done"
                      ? `Skill gap for ${aiResult.roleTitle}`
                      : "Search a role to see your skill gap"}
                  </p>
                </div>
              </div>

              {/* Compact embedded search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runSearch(roleInput);
                }}
                className="mt-4"
              >
                <label htmlFor="target-role" className="sr-only">Target job role</label>
                <div
                  className={`flex items-center gap-2 rounded-xl bg-stone-50 py-1.5 pl-3 pr-1.5 ring-1 ring-inset transition focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500 ${
                    roleError ? "ring-brand-500" : "ring-stone-200"
                  }`}
                >
                  <Search size={16} aria-hidden="true" className="shrink-0 text-brand-500" />
                  <input
                    id="target-role"
                    value={roleInput}
                    onChange={(e) => {
                      setRoleInput(e.target.value);
                      setRoleError("");
                    }}
                    placeholder="e.g., Full Stack Developer..."
                    aria-invalid={Boolean(roleError)}
                    className="min-w-0 flex-1 bg-transparent py-1.5 text-sm font-medium text-slate-800 outline-none placeholder:text-stone-400"
                  />
                  {roleInput && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear role"
                      className="shrink-0 rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-200 hover:text-slate-700"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={aiStatus === "loading"}
                    aria-label="Get AI suggestions"
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 disabled:opacity-60"
                  >
                    {aiStatus === "loading" ? (
                      <>
                        <Loader2 size={13} className="animate-spin" aria-hidden="true" /> Analyzing
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} aria-hidden="true" /> Analyze
                      </>
                    )}
                  </button>
                </div>
                {roleError && (
                  <p className="mt-2 text-xs font-semibold text-brand-600">{roleError}</p>
                )}
              </form>

              {/* Analysis states */}
              <div className="mt-5" aria-live="polite">
                {aiStatus === "idle" && (
                  <div className="flex flex-col items-center rounded-2xl bg-stone-50 px-5 py-8 text-center">
                    <span className="rounded-full bg-brand-50 p-3 text-brand-500">
                      <Target size={22} aria-hidden="true" />
                    </span>
                    <p className="mt-3 text-sm font-bold text-slate-900">No role selected yet</p>
                    <p className="mt-1 max-w-[240px] text-xs text-stone-500">
                      Enter a job role above and AI will compare it with your current skills.
                    </p>
                  </div>
                )}

                {aiStatus === "loading" && (
                  <div className="space-y-2" aria-busy="true">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-12 animate-pulse rounded-xl bg-stone-100" />
                    ))}
                  </div>
                )}

                {aiStatus === "unknown" && (
                  <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
                    <p className="font-semibold">We could not recognize this role.</p>
                    <p className="mt-1 text-xs">
                      Try a common title like Frontend Developer, Backend Developer, Data Analyst or
                      UI/UX Designer.
                    </p>
                  </div>
                )}

                {aiStatus === "error" && (
                  <div className="rounded-2xl bg-brand-50 p-4 text-sm text-brand-600">
                    <p className="font-semibold">Suggestions are unavailable right now.</p>
                    <button
                      type="button"
                      onClick={() => runSearch(roleInput)}
                      className="mt-1 text-xs font-semibold underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {aiStatus === "done" && (
                  <div className="space-y-6">
                    {/* Match overview */}
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">Match overview</p>
                        <p className="text-xs font-medium text-stone-500">
                          {matched.length} of {requiredTotal} skills matched ({matchPct}%)
                        </p>
                      </div>
                      <div
                        className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100"
                        role="progressbar"
                        aria-valuenow={matchPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Role match"
                      >
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all duration-500"
                          style={{ width: `${matchPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills you have */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
                        Skills you have ({matched.length})
                      </p>
                      {matched.length === 0 ? (
                        <p className="mt-2 text-xs text-stone-500">
                          None of your current skills match this role yet.
                        </p>
                      ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {matched.map((m) => (
                            <Badge key={m.name} tone="success" icon={CheckCircle2}>
                              {m.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Skills you need */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
                        Skills you need ({missing.length})
                      </p>
                      {missing.length === 0 ? (
                        <p className="mt-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                          You have every key skill for this role. Add proof to strengthen them.
                        </p>
                      ) : (
                        <ul className="mt-1">
                          {missing.map((s) => (
                            <li
                              key={s.name}
                              className="flex items-start justify-between gap-3 border-b border-stone-100 py-3 last:border-b-0"
                            >
                              <div className="min-w-0 flex-1 space-y-1">
                                <p className="text-sm font-semibold leading-tight text-slate-900">
                                  {s.name}
                                </p>
                                <p className="text-xs leading-snug text-stone-500">{s.reason}</p>
                              </div>
                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => getRoadmap(s.name)}
                                  aria-label={`Get skill roadmap for ${s.name}`}
                                  className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-500 transition-colors hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                                >
                                  <Compass size={13} aria-hidden="true" />
                                  Roadmap
                                </button>
                                <IconButton
                                  label={`Add ${s.name} to my skills`}
                                  onClick={() =>
                                    addSkill({ skill_name: s.name, proficiency_level: "Beginner" }, true)
                                  }
                                >
                                  <Plus size={16} />
                                </IconButton>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Add Skill modal (FormLayout) */}
      <Modal open={showAddSkill} onClose={() => setShowAddSkill(false)} maxWidth="max-w-lg">
        <FormLayout
          title="Add Skill"
          description="Add a skill to your profile. You can add proof after."
          submitLabel="Add Skill"
          submitPlacement="bottom"
          fields={skillFields}
          onSubmit={(values) => {
            addSkill(values, false);
            setShowAddSkill(false);
          }}
        />
      </Modal>

      {/* Add Proof modal: Web Link | Upload File (FormLayout) */}
      <Modal open={Boolean(proofSkill)} onClose={() => setProofFor(null)}>
        {proofSkill && (
          <FormLayout
            title="Add Proof"
            description={`Add proof for ${proofSkill.skill_name}. Employers can open it.`}
            submitLabel="Save Proof"
            submitPlacement="bottom"
            fields={proofFields}
            onSubmit={addProof}
            before={() => <ProofModeTabs mode={proofMode} onChange={setProofMode} />}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal open={Boolean(confirm)} onClose={() => setConfirm(null)} maxWidth="max-w-md">
        <div className="p-6 sm:p-8">
          <h3 className="text-xl font-extrabold text-slate-900">
            {confirm?.type === "skill" ? "Remove this skill?" : "Delete this proof?"}
          </h3>
          <p className="mt-2 text-sm text-stone-600">
            {confirm?.type === "skill"
              ? "The skill and all its proof will be deleted. This cannot be undone."
              : 'If this is the last proof, the skill will go back to "Needs proof".'}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirm(null)}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={doConfirm}
              className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}