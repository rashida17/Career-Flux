import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserX,
  X,
} from "lucide-react";
import CandidateCard from "../components/CandidateCard";
import CandidateFilterSelect from "../components/CandidateFilterSelect";
import CandidateInvitationModal from "../components/CandidateInvitationModal";

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
        skills.every((sk) =>
          c.skills.some((s) => s.toLowerCase() === sk.toLowerCase()),
        );

      return (
        matchesQuery && matchesRole && matchesExp && matchesLoc && matchesSkills
      );
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
    if (!value || skills.some((s) => s.toLowerCase() === value.toLowerCase()))
      return;
    manual(setSkills)([...skills, value]);
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    manual(setSkills)(skills.filter((s) => s !== skill));

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
        .sort((a, b) => b.aiMatchScore - a.aiMatchScore),
    );
    setAiRole(role);
    setAiActive(true);
    notify(`AI candidate suggestions calculated for ${role}.`);
  };

  /* Invitations */
  const sendInvitation = ({ candidate, deadline }) => {
    // call your backend API here
    setCandidates((current) =>
      current.map((c) =>
        c.id === candidate.id ? { ...c, status: "pending" } : c,
      ),
    );
    setInviteTarget(null);
    notify(
      `Invitation sent to ${candidate.email}. Response deadline: ${deadline}.`,
    );
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
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Search Candidates
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Find job seekers by skills and experience, or use AI matching for
            your open jobs.
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
              onClick={() =>
                notify(`Search executed. Found ${results.length} candidates.`)
              }
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
              <span className="text-xs font-bold">
                AI Recommendation Engine Active
              </span>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold">
              {aiRole}
            </span>
            <p className="w-full text-[11px] text-brand-50">
              Candidates are sorted by overall AI skill compatibility with your
              selected criteria.
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
              <h3 className="text-sm font-bold text-slate-900">
                No candidates match your query
              </h3>
              <p className="text-xs text-slate-400">
                Try adjusting your keyword search or clearing the filters.
              </p>
            </div>
          ) : (
            // <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),280px))] justify-center gap-4">
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
                <h3 className="text-sm font-bold text-slate-900">
                  Browse By / Filters
                </h3>
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
                  Select a Target Role, Experience and Location to get AI
                  recommendations.
                </p>
              </div>
            )}

            <CandidateFilterSelect
              label="Target Role"
              value={role}
              onChange={manual(setRole)}
              placeholder="Select Target Role..."
              options={ROLE_OPTIONS}
            />
            <CandidateFilterSelect
              label="Minimum Experience"
              value={exp}
              onChange={manual(setExp)}
              placeholder="Select Minimum Experience..."
              options={EXP_OPTIONS}
            />
            <CandidateFilterSelect
              label="Location Preference"
              value={loc}
              onChange={manual(setLoc)}
              placeholder="Select Location..."
              options={LOCATION_OPTIONS}
            />

            {/* Required skills */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold text-slate-700">
                Required Skills
              </label>
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
        <CandidateInvitationModal
          candidate={inviteTarget}
          onClose={() => setInviteTarget(null)}
          onSend={sendInvitation}
        />
      )}

      {/* Toast message */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-3 text-xs text-white shadow-floating"
        >
          <CheckCircle2 size={15} className="text-brand-200" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
