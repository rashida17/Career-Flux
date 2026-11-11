import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  MapPin,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  UserX,
  X,
  XCircle,
} from "lucide-react";

/* SAMPLE DATA (replace with your API response)*/
const initialCandidates = [
  {
    id: 1,
    name: "Bilal Hassan",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    role: "Frontend Developer (TypeScript)",
    targetRole: "Frontend Developer (TypeScript)",
    exp: "3.8 yrs exp",
    expGroup: "3-5 years",
    location: "Karachi, Pakistan",
    skills: ["React.js", "TypeScript", "Tailwind CSS"],
    email: "bilal.hassan@example.com",
    aiMatchScore: 91,
    status: "none",
  },
  {
    id: 2,
    name: "Zara Daniels",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    role: "Senior React Developer",
    targetRole: "Frontend Developer (TypeScript)",
    exp: "4.5 yrs exp",
    expGroup: "3-5 years",
    location: "Remote",
    skills: ["React.js", "TypeScript", "Node.js"],
    email: "zara.daniels@example.com",
    aiMatchScore: 95,
    status: "pending",
  },
  {
    id: 3,
    name: "Sophia Chen",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    role: "UI/UX Product Designer",
    targetRole: "UI/UX Product Designer",
    exp: "5.5 yrs exp",
    expGroup: "5+ years",
    location: "Lahore, Pakistan",
    skills: ["Figma", "UI/UX", "Prototyping"],
    email: "sophia.chen@example.com",
    aiMatchScore: 88,
    status: "accepted",
  },
  {
    id: 4,
    name: "Hamza Malik",
    image: "", // no photo, default user icon is shown
    role: "Junior Data Analyst",
    targetRole: "Data Analyst",
    exp: "1.0 yrs exp",
    expGroup: "1-2 years",
    location: "Islamabad, Pakistan",
    skills: ["Python", "SQL"],
    email: "hamza.malik@example.com",
    aiMatchScore: 78,
    status: "declined",
  },
];

const ROLE_OPTIONS = [
  "Frontend Developer (TypeScript)",
  "MERN Stack Developer",
  "UI/UX Product Designer",
  "Data Analyst",
];

const EXP_OPTIONS = [
  { value: "Fresh Graduate", label: "Fresh Graduate / Entry Level" },
  { value: "1-2 years", label: "1 - 2 Years" },
  { value: "3-5 years", label: "3 - 5 Years" },
  { value: "5+ years", label: "5+ Years" },
];

const LOCATION_OPTIONS = [
  "Remote",
  "Karachi, Pakistan",
  "Lahore, Pakistan",
  "Islamabad, Pakistan",
];

// Open jobs of this employer (later replace with  API data)
const OPEN_JOBS = [
  "Frontend Developer (TypeScript)",
  "MERN Stack Engineer",
  "UI/UX Product Designer",
];

const DEFAULT_NOTE =
  "We reviewed your profile on CareerFlux and found a strong match with our team requirements. We invite you to apply!";

/* SMALL PIECES */
const statusStyles = {
  none: {
    label: "Not Contacted",
    className: "bg-stone-100 text-slate-500 border-stone-200",
    icon: null,
  },
  pending: {
    label: "Invite Sent (Pending)",
    className: "bg-brand-100 text-brand-800 border-brand-200",
    icon: Clock,
  },
  accepted: {
    label: "Invite Accepted",
    className: "bg-brand-500 text-white border-brand-500",
    icon: CheckCircle2,
  },
  declined: {
    label: "Invite Declined",
    className: "bg-brand-900 text-brand-50 border-brand-900",
    icon: XCircle,
  },
};

/* Real photo, or the default user icon when there is no photo / it fails to load */
function Avatar({ image, name, className = "h-11 w-11" }) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={name}
        onError={() => setFailed(true)}
        className={`${className} shrink-0 rounded-xl border border-brand-100 object-cover`}
      />
    );
  }

  return (
    <div
      aria-label={`${name} (no photo)`}
      className={`${className} flex shrink-0 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-500`}
    >
      <UserRound size={20} />
    </div>
  );
}

function StatusBadge({ status }) {
  const { label, className, icon: Icon } = statusStyles[status] ?? statusStyles.none;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] font-bold ${className}`}
    >
      {Icon && <Icon size={12} />}
      {label}
    </span>
  );
}

function FilterSelect({ label, value, onChange, placeholder, options }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-slate-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-stone-200 bg-cream px-3 py-2.5 pr-9 text-xs font-semibold text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => {
            const o = typeof opt === "string" ? { value: opt, label: opt } : opt;
            return (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}

/* Candidate card: */
function CandidateCard({ candidate, requiredSkills = [], onOpen, onInvite }) {
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(candidate);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(candidate)}
      onKeyDown={handleKey}
      aria-label={`View profile of ${candidate.name}`}
      className="group flex cursor-pointer flex-col justify-between space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm outline-none transition hover:border-brand-500/40 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-100"
    >
      <div className="space-y-3">
        {/* Avatar, name, role, match badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center space-x-3">
            <Avatar image={candidate.image} name={candidate.name} />
            <div className="min-w-0">
              <h4 className="truncate text-sm font-bold text-slate-900 transition group-hover:text-brand-500">
                {candidate.name}
              </h4>
              <p className="truncate text-[11px] text-slate-400">{candidate.role}</p>
            </div>
          </div>

          {candidate.aiMatchScore ? (
            <span className="shrink-0 rounded-lg border border-brand-200 bg-brand-100 px-2.5 py-0.5 text-[10px] font-bold text-brand-800">
              {candidate.aiMatchScore}% Match
            </span>
          ) : null}
        </div>

        {/* Experience + location */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Briefcase size={12} className="text-slate-400" /> {candidate.exp}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-brand-500" /> {candidate.location}
          </span>
        </div>

        {/* Skills: highlighted when they match a skill chosen in the filters */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {candidate.skills.map((skill) => {
              const isMatch = requiredSkills.some(
                (r) => r.toLowerCase() === skill.toLowerCase()
              );
              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${
                    isMatch
                      ? "border-brand-200 bg-brand-50 text-brand-700"
                      : "border-stone-200 bg-stone-50 text-slate-600"
                  }`}
                >
                  {isMatch && <Check size={10} />} {skill}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <StatusBadge status={candidate.status} />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // don't open the profile
            onInvite(candidate);
          }}
          className="flex shrink-0 items-center space-x-1 rounded-xl bg-brand-500 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-600"
        >
          <Send size={12} />
          <span>Invite</span>
          {/* <ArrowRight size={11} /> */}
        </button>
      </div>
    </div>
  );
}

/* INVITATION MODAL*/
function InviteModal({ candidate, onClose, onSend }) {
  const [job, setJob] = useState(OPEN_JOBS[0]);
  const [deadline, setDeadline] = useState("2026-11-20");
  const [note, setNote] = useState(DEFAULT_NOTE);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const fieldClass =
    "w-full rounded-xl border border-stone-200 bg-cream px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  // lock page scroll while the popup is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Rendered in <body> so the dark overlay covers the sidebar and the whole page
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-2xl border border-stone-200 bg-white p-6 opacity-100 shadow-floating"
      >
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <Send size={16} />
            </div>
            <div>
              <h3 id="invite-title" className="text-sm font-bold text-slate-900">
                Send Job Invitation
              </h3>
              <p className="text-[11px] text-slate-400">
                Direct candidate notification via platform & email
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 transition hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1 rounded-xl border border-stone-200 bg-cream p-3">
            <div className="flex justify-between gap-3">
              <span className="font-bold text-slate-400">Candidate:</span>
              <span className="font-bold text-slate-900">{candidate.name}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-bold text-slate-400">Work Email:</span>
              <span className="truncate font-bold text-brand-500">{candidate.email}</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-slate-700">Select Open Job Listing</label>
            <select value={job} onChange={(e) => setJob(e.target.value)} className={fieldClass}>
              {OPEN_JOBS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-bold text-slate-700">Response Deadline Date</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="mb-1 block font-bold text-slate-700">Custom Invitation Note</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${fieldClass} font-medium`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-stone-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-stone-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-stone-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSend({ candidate, job, deadline, note })}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2 text-xs font-bold text-white transition hover:bg-brand-600"
          >
            <Send size={13} />
            Send Invitation
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* MAIN PAGE*/
/**
 * Props
 *  - onViewProfile(candidate): called when a candidate CARD is clicked
 */
export default function SearchCandidates({ onViewProfile }) {
  const [candidates, setCandidates] = useState(initialCandidates);

  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("");
  const [loc, setLoc] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [aiActive, setAiActive] = useState(false);
  const [aiRole, setAiRole] = useState("");
  const [showAiWarning, setShowAiWarning] = useState(false);

  const [inviteTarget, setInviteTarget] = useState(null);
  const [toast, setToast] = useState("");

  const notify = (message) => setToast(message);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  /* Filtering */
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return candidates.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q));

      const matchesRole = !role || c.targetRole === role;
      const matchesExp = !exp || c.expGroup === exp;
      const matchesLoc = !loc || c.location === loc;
      const matchesSkills =
        skills.length === 0 ||
        skills.every((sk) => c.skills.some((s) => s.toLowerCase() === sk.toLowerCase()));

      return matchesQuery && matchesRole && matchesExp && matchesLoc && matchesSkills;
    });
  }, [candidates, query, role, exp, loc, skills]);

  /* Any manual change switches the AI banner off */
  const manual = (setter) => (value) => {
    setter(value);
    setShowAiWarning(false);
    setAiActive(false);
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || skills.some((s) => s.toLowerCase() === value.toLowerCase())) return;
    manual(setSkills)([...skills, value]);
    setSkillInput("");
  };

  const removeSkill = (skill) => manual(setSkills)(skills.filter((s) => s !== skill));

  const resetFilters = () => {
    setQuery("");
    setRole("");
    setExp("");
    setLoc("");
    setSkills([]);
    setSkillInput("");
    setShowAiWarning(false);
    setAiActive(false);
    notify("All search filters were reset.");
  };

  /* AI suggestions – needs role + experience + location */
  const runAiSuggestions = () => {
    if (!role || !exp || !loc) {
      setShowAiWarning(true);
      return;
    }
    setShowAiWarning(false);

    setCandidates((current) =>
      current
        .map((c) => {
          let score = 75;
          if (c.targetRole === role) score += 15;
          if (c.expGroup === exp) score += 5;
          if (c.location === loc) score += 5;
          return { ...c, aiMatchScore: Math.min(score, 98) };
        })
        .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
    );
    setAiRole(role);
    setAiActive(true);
    notify(`AI candidate suggestions calculated for ${role}.`);
  };

  /* Invitations */
  const sendInvitation = ({ candidate, deadline }) => {
    // call your backend API here
    setCandidates((current) =>
      current.map((c) => (c.id === candidate.id ? { ...c, status: "pending" } : c))
    );
    setInviteTarget(null);
    notify(`Invitation sent to ${candidate.email}. Response deadline: ${deadline}.`);
  };

  const openProfile = (candidate) => {
    if (onViewProfile) onViewProfile(candidate);
    else notify("Candidate profile is not attached yet.");
  };

  return (
    <div className="space-y-6">
      {/* Title on the LEFT, search bar in the MIDDLE */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Search Candidates</h1>
          <p className="mt-1 text-sm text-slate-500">
            Find job seekers by skills and experience, or use AI matching for your open jobs.
          </p>
        </div>

        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
            <div className="flex flex-1 items-center rounded-xl border border-stone-200 bg-cream px-4 py-2.5 transition focus-within:border-brand-500 focus-within:bg-white">
              {/* <Search size={16} className="mr-3 shrink-0 text-slate-400" /> */}
              <input
                type="text"
                value={query}
                onChange={(e) => manual(setQuery)(e.target.value)}
                placeholder="Job title, skills, or candidate name..."
                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              title="Search candidates"
              aria-label="Search candidates"
              onClick={() => notify(`Search executed. Found ${results.length} candidates.`)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* AI banner + results header */}
      <div className="space-y-3">
        {aiActive && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-brand-500 p-4 text-white shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span className="text-xs font-bold">AI Recommendation Engine Active</span>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold">
              {aiRole}
            </span>
            <p className="w-full text-[11px] text-brand-50">
              Candidates are sorted by overall AI skill compatibility with your selected criteria.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Candidate Results ({results.length})
          </h2>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-bold text-brand-500 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Candidates (left) + filters (right) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Candidate cards */}
        <div className="lg:col-span-2">
          {results.length === 0 ? (
            <div className="space-y-2 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <UserX size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No candidates match your query</h3>
              <p className="text-xs text-slate-400">
                Try adjusting your keyword search or clearing the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {results.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  requiredSkills={skills}
                  onOpen={openProfile}
                  onInvite={setInviteTarget}
                />
              ))}
            </div>
          )}
        </div>

        {/* Filters card */}
        <aside className="lg:sticky lg:top-4">
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Browse By / Filters</h3>
                <p className="text-[10px] text-slate-400">
                  Optional for search, required for AI engine
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <SlidersHorizontal size={15} />
              </div>
            </div>

            {showAiWarning && (
              <div
                role="alert"
                className="space-y-1 rounded-xl border border-brand-200 bg-brand-50 p-3 text-brand-700"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <AlertCircle size={14} />
                  Selection required for AI matching
                </div>
                <p className="text-[10px] leading-4 text-brand-600">
                  Select a Target Role, Experience and Location to get AI recommendations.
                </p>
              </div>
            )}

            <FilterSelect
              label="Target Role"
              value={role}
              onChange={manual(setRole)}
              placeholder="Select Target Role..."
              options={ROLE_OPTIONS}
            />
            <FilterSelect
              label="Minimum Experience"
              value={exp}
              onChange={manual(setExp)}
              placeholder="Select Minimum Experience..."
              options={EXP_OPTIONS}
            />
            <FilterSelect
              label="Location Preference"
              value={loc}
              onChange={manual(setLoc)}
              placeholder="Select Location..."
              options={LOCATION_OPTIONS}
            />

            {/* Required skills */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold text-slate-700">Required Skills</label>
              <div className="relative">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. Next.js, GraphQL"
                  className="w-full rounded-xl border border-stone-200 bg-cream py-2.5 pl-3 pr-12 text-xs font-medium text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  aria-label="Add skill"
                  title="Add skill"
                  className="group absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center overflow-hidden rounded-lg bg-brand-500 text-white transition-all duration-200 hover:w-[4.25rem] hover:bg-brand-600 focus-visible:w-[4.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  <Plus size={12} />
                  <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold opacity-0 transition-all duration-200 group-hover:ml-1 group-hover:max-w-8 group-hover:opacity-100 group-focus-visible:ml-1 group-focus-visible:max-w-8 group-focus-visible:opacity-100">
                    Add
                  </span>
                </button>
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                        className="text-brand-400 transition hover:text-brand-700"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={runAiSuggestions}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-brand-600"
              >
                <Sparkles size={14} />
                Get AI Candidate Suggestions
              </button>
            </div>
          </div>
        </aside>
      </div>

      {inviteTarget && (
        <InviteModal
          candidate={inviteTarget}
          onClose={() => setInviteTarget(null)}
          onSend={sendInvitation}
        />
      )}

      {/* Toast message */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-3 text-xs text-white shadow-floating"
        >
          <CheckCircle2 size={15} className="text-brand-200" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}