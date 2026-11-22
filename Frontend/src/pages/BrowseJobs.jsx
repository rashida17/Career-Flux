import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  UserRound,
  Code2,
  Search,
  FileText,
  CalendarDays,
  Map as MapIcon,
  Settings,
  LogOut,
  X,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  BadgeCheck,
  MapPin,
  Briefcase,
  Clock,
  CalendarClock,
  Building2,
  Flag,
  SearchX,
  AlertTriangle,
  Loader2,
  Banknote,
  Info,
  ArrowRight,
  Filter,
  ChevronRight
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import FormLayout from "../components/FormLayout";
import LogoAvatar from "../components/LogoAvatar";
import {
  MOCK_JOBS,
  MOCK_PROFILE,
  scoreJob,
  mockAiReasons,
  hasProfileData,
  daysLeft,
} from "../features/jobs/jobMatching";

const PAGE_SIZE = 9;
const AI_TOP = 10;
const REPORT_REASONS = [
  "Fake or scam job",
  "Asked for payment",
  "Misleading information",
  "Inappropriate behavior",
  "Other"
];

/* Exact Sidebar Navigation Items Matching Career Roadmap & Job Seeker Apps */
const DEFAULT_NAVIGATION_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Profile", icon: UserRound },
  { label: "My Skills", icon: Code2 },
  { label: "Find Jobs", icon: Search },
  { label: "My Applications", icon: FileText },
  { label: "Interviews", icon: CalendarDays },
  { label: "Career Roadmap", icon: MapIcon },
  { label: "Settings", icon: Settings },
  { label: "Logout", icon: LogOut },
];

const controlCls =
  "h-10 w-full rounded-lg bg-white text-sm font-medium text-slate-800 outline-none ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 hover:ring-slate-300 focus:ring-2 focus:ring-brand-500";
const primaryBtn =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const ghostBtn =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

const MATCH_STYLE = {
  Strong: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-800 ring-amber-200",
  Weak: "bg-slate-100 text-slate-700 ring-slate-200",
};

function Pill({ className = "", icon: Icon, children, title }) {
  return (
    <span title={title} className={`inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs font-semibold ring-1 ring-inset ${className}`}>
      {Icon && <Icon size={12} aria-hidden="true" />}
      {children}
    </span>
  );
}

const MatchPill = ({ label }) => (
  <Pill className={MATCH_STYLE[label]} icon={Sparkles} title="Match with your profile">{label} match</Pill>
);

function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-floating">
        <button type="button" onClick={onClose} aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

const closesText = (job) => {
  const d = daysLeft(job);
  return d <= 0 ? "Closes today" : d === 1 ? "Closes tomorrow" : `Closes in ${d} days`;
};

/* ---------- Details Drawer ---------- */
function Section({ title, children }) {
  return (
    <section className="border-t border-slate-100 py-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      {children}
    </section>
  );
}

function JobDrawer({ job, m, applied, applying, reason, aiWritten, profileReady, onClose, onApply, onReport, onNavigate }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!job) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [job, onClose]);
  if (!job) return null;

  const d = daysLeft(job);
  const req = job.requiredSkills || [];
  const pct = req.length ? Math.round((m.matched.length / req.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`${job.title} details`}>
      <button type="button" aria-label="Close details" onClick={onClose} tabIndex={-1} className="absolute inset-0 bg-slate-900/40" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-floating">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-6">
          <div className="flex min-w-0 items-start gap-3">
            <LogoAvatar job={job} />
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold leading-tight text-slate-900">{job.title}</h2>
              <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
                {job.company}
                {job.verified && <BadgeCheck size={15} className="text-emerald-600" aria-label="Verified company" />}
                <span aria-hidden="true">·</span> {job.industry}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profileReady && <MatchPill label={m.label} />}
                {applied && <Pill className="bg-emerald-50 text-emerald-800 ring-emerald-200" icon={CheckCircle2}>Applied</Pill>}
              </div>
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close"
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Section title="Overview">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                [MapPin, "Location", `${job.location} · ${job.mode}`],
                [Briefcase, "Experience", job.experience],
                [Banknote, "Salary", job.salary],
                [CalendarClock, "Deadline", d <= 0 ? "Closes today" : `${closesText(job)}`],
              ].map(([Icon, label, value]) => (
                <div key={label}>
                  <dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <Icon size={12} aria-hidden="true" /> {label}
                  </dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="About the job">
            <p className="text-sm leading-relaxed text-slate-600">{job.description}</p>
          </Section>

          <Section title="Your skill match">
            {!profileReady ? (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                Add your skills and a target role to see how well you match.
                <button type="button" onClick={() => onNavigate?.("My Skills")} className="ml-1 font-bold text-brand-700 hover:underline">Go to My Skills</button>
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{m.matched.length} of {req.length} skills</p>
                  <p className="text-xs font-medium text-slate-500">{pct}%</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Skill match">
                  <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {aiWritten && <Sparkles size={11} className="mr-1 inline text-brand-500" aria-hidden="true" />}
                  {reason}
                  {aiWritten && <span className="ml-1 text-slate-500">(AI estimate)</span>}
                </p>

                {m.matched.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.matched.map((s) => (
                      <Pill key={s} className="bg-emerald-50 text-emerald-800 ring-emerald-200" icon={m.verifiedMatched.includes(s) ? BadgeCheck : CheckCircle2}
                        title={m.verifiedMatched.includes(s) ? "Verified with proof" : "In your skills"}>{s}</Pill>
                    ))}
                  </div>
                )}
                {m.missing.length > 0 && (
                  <ul className="mt-3">
                    {m.missing.map((s) => (
                      <li key={s} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-b-0">
                        <span className="text-sm font-semibold text-slate-900">{s}</span>
                        <button type="button" onClick={() => onNavigate?.("Career Roadmap", { focusSkills: [s] })}
                          className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                          <Compass size={13} aria-hidden="true" /> Roadmap
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </Section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4 sm:px-6">
          <button type="button" onClick={() => onReport(job)} className={ghostBtn}>
            <Flag size={14} aria-hidden="true" /> Report company
          </button>
          <button type="button" onClick={() => onApply(job)} disabled={applied || applying || d < 0} className={primaryBtn}>
            {applying ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Applying...</>
              : applied ? "Applied" : d < 0 ? "Closed" : "Apply now"}
          </button>
        </div>
      </aside>
    </div>
  );
}

/* ---------- Page ---------- */
export default function BrowserJobs({
  user = { name: "Ahmed" },
  profile = MOCK_PROFILE,
  initialJobs = MOCK_JOBS,
  initialApplied = [2, 3],
  simulateAiFailure = false,
  navigationItems = DEFAULT_NAVIGATION_ITEMS,
  onNavigate,
  onReport,
}) {
  const [jobs, setJobs] = useState(null);
  const [loadState, setLoadState] = useState("loading");
  const [mode, setMode] = useState("all");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ location: "", experience: "", industry: "" });
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [applied, setApplied] = useState(() => new Set(initialApplied));
  const [applyingId, setApplyingId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [reportFor, setReportFor] = useState(null);
  const [aiState, setAiState] = useState({ status: "idle", reasons: {} });
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);
  const aiCache = useRef({});

  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const notify = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const load = () => {
    setLoadState("loading");
    setTimeout(() => {
      setJobs(initialJobs);
      setLoadState("ready");
    }, 500);
  };
  useEffect(load, []);

  const profileReady = hasProfileData(profile);
  const hasRole = Boolean(profile.targetRole?.trim());
  const scored = useMemo(
    () =>
      (jobs || [])
        .filter((j) => j.is_active && daysLeft(j) >= 0)
        .map((job) => ({ job, m: scoreJob(job, profile) })),
    [jobs, profile]
  );

  const profileKey = JSON.stringify(profile);
  const runAi = () => {
    if (!profileReady || scored.length === 0) return;
    const top = [...scored].sort((a, b) => b.m.score - a.m.score).slice(0, AI_TOP);
    setAiState((s) => ({ ...s, status: "loading" }));
    mockAiReasons(top, profile, { fail: simulateAiFailure })
      .then((reasons) => {
        aiCache.current[profileKey] = reasons;
        setAiState({ status: "done", reasons });
      })
      .catch(() => setAiState({ status: "failed", reasons: {} }));
  };
  useEffect(() => {
    if (mode !== "ai" || scored.length === 0) return;
    const cached = aiCache.current[profileKey];
    if (cached) setAiState({ status: "done", reasons: cached });
    else runAi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, profileKey, scored.length]);

  const options = useMemo(() => ({
    locations: [...new Set(scored.map(({ job }) => job.location))].sort(),
    industries: [...new Set(scored.map(({ job }) => job.industry))].sort(),
  }), [scored]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const expOk = (j) =>
      !filters.experience ||
      (filters.experience === "entry" && j.experienceMin <= 1) ||
      (filters.experience === "mid" && j.experienceMin >= 1 && j.experienceMin <= 3) ||
      (filters.experience === "senior" && j.experienceMin >= 3);
    const out = scored.filter(({ job: j }) =>
      (!q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) ||
        (j.requiredSkills || []).some((s) => s.toLowerCase().includes(q))) &&
      (!filters.location || j.location === filters.location) &&
      (!filters.industry || j.industry === filters.industry) && expOk(j));

    const by = {
      match: (a, b) => b.m.score - a.m.score,
      newest: (a, b) => a.job.postedDaysAgo - b.job.postedDaysAgo,
      closing: (a, b) => daysLeft(a.job) - daysLeft(b.job),
    }[sort];
    out.sort((a, b) => {
      if (mode === "ai") {
        const aa = applied.has(a.job.id), bb = applied.has(b.job.id);
        if (aa !== bb) return aa ? 1 : -1;
      }
      return by(a, b);
    });
    return out;
  }, [scored, query, filters, sort, mode, applied]);

  useEffect(() => setVisible(PAGE_SIZE), [query, filters, sort, mode]);

  const activeChips = [
    filters.location && { key: "location", label: filters.location },
    filters.experience && { key: "experience", label: { entry: "Entry level", mid: "Mid level", senior: "Senior" }[filters.experience] },
    filters.industry && { key: "industry", label: filters.industry },
  ].filter(Boolean);
  const clearAll = () => { setQuery(""); setFilters({ location: "", experience: "", industry: "" }); };

  const switchMode = (next) => {
    setMode(next);
    setSort(next === "ai" ? "match" : "newest");
  };

  const apply = (job) => {
    if (applied.has(job.id) || applyingId) return;
    setApplyingId(job.id);
    setTimeout(() => {
      setApplied((s) => new Set(s).add(job.id));
      setApplyingId(null);
      notify(`Applied to ${job.title} at ${job.company}. Track it in My Applications.`);
    }, 700);
  };

  const submitReport = (values) => {
    onReport?.({ employer_id: reportFor.employer_id, job_id: reportFor.id, reason: values.reason, description: values.description.trim() });
    notify("Report sent. Our team will review it.");
    setReportFor(null);
  };
  const reportFields = [
    { name: "reason", label: "Reason", type: "select", icon: Flag, placeholder: "Select a reason", options: REPORT_REASONS, full: true },
    { name: "description", label: "What happened?", type: "textarea", rows: 4, maxLength: 500, minLength: 10, placeholder: "Describe the problem so our team can review it." },
  ];

  const open = list.find(({ job }) => job.id === openId) || scored.find(({ job }) => job.id === openId) || null;
  const reasonFor = (id, m) => aiState.reasons[id] || m.reason;
  const aiMode = mode === "ai";
  const allWeak = aiMode && list.length > 0 && list.every(({ m }) => m.label === "Weak");

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      activeTab="Find Jobs"
      onNavigate={onNavigate}
      workspaceLabel="Job Seeker Workspace"
      menuTitle="CareerFlux"
      user={user}
      role="jobseeker"
    >
      <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
        {toast && (
          <div role="status" className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-floating">
            {toast}
          </div>
        )}

        {/* ========================================================================
            HERO SECTION & ROADMAP-INSPIRED SEARCH BAR
           ======================================================================== */}
        <section className="mb-2 pt-4 pb-2">
          <div className="w-full max-w-5xl space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Browse Jobs
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Search open positions, or let AI recommend jobs that fit your profile.
              </p>
            </div>

            {/* Exact Roadmap-Style Search Bar */}
            <form onSubmit={(e) => e.preventDefault()} className="mx-auto w-full max-w-xl">
              <div className="flex w-full items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
                <div className="flex min-w-0 flex-1 items-center rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 transition focus-within:border-brand-500 focus-within:bg-white">
                  <Search size={16} aria-hidden="true" className="mr-3 shrink-0 text-slate-400" />
                  <input
                    id="job-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Job title, skills, or candidate name..."
                    className="w-full min-w-0 bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="ml-2 shrink-0 rounded-md p-1 text-stone-400 transition hover:bg-stone-200 hover:text-slate-700">
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  title="Search jobs"
                  aria-label="Search jobs"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600 shadow-xs"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Mode & Filter Chips Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 mr-1">
                  <Filter size={14} aria-hidden="true" /> View Mode:
                </span>
                {[["all", "All jobs", null], ["ai", "AI recommended", Sparkles]].map(([key, label, Icon]) => {
                  const isActive = mode === key;
                  return (
                    <button key={key} type="button" aria-pressed={isActive} onClick={() => switchMode(key)}
                      className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                        isActive
                          ? "border-brand-500 bg-brand-50 text-brand-700 shadow-xs"
                          : "border-stone-200 bg-stone-50/50 text-slate-700 hover:bg-white hover:border-stone-300"
                      }`}>
                      {Icon && <Icon size={14} aria-hidden="true" />}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort jobs"
                  className="h-9 px-3 appearance-none bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-700 rounded-xl border border-stone-200 outline-hidden transition cursor-pointer pr-8">
                  <option value="newest">Newest</option>
                  <option value="closing">Closing soon</option>
                </select>
                <button type="button" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/50 px-3.5 text-xs font-semibold text-slate-700 transition hover:bg-white hover:border-stone-300">
                  <SlidersHorizontal size={14} aria-hidden="true" /> Filters
                  {activeChips.length > 0 && <span className="rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white">{activeChips.length}</span>}
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3 max-w-5xl">
              {[
                ["location", "Location", [["", "All locations"], ...options.locations.map((l) => [l, l])]],
                ["experience", "Experience", [["", "Any experience"], ["entry", "Entry level (0-1 yr)"], ["mid", "Mid level (1-3 yrs)"], ["senior", "Senior (3+ yrs)"]]],
                ["industry", "Industry", [["", "All industries"], ...options.industries.map((i) => [i, i])]],
              ].map(([key, label, opts]) => (
                <div key={key} className="relative">
                  <label htmlFor={`f-${key}`} className="sr-only">{label}</label>
                  <select id={`f-${key}`} value={filters[key]} onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
                    className={`${controlCls} cursor-pointer appearance-none pl-3 pr-9`}>
                    {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI mode notices */}
        {aiMode && !profileReady && (
          <section className="rounded-2xl border border-stone-200 bg-stone-50/50 p-8 text-center shadow-soft sm:p-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Sparkles size={22} aria-hidden="true" /></span>
            <h3 className="mt-3 text-base font-extrabold text-slate-900">Complete your profile to get recommendations</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">AI matches use your skills and target role. Add them and your best-fit jobs appear here.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => onNavigate?.("My Skills")} className={primaryBtn}>Add skills</button>
              <button type="button" onClick={() => onNavigate?.("My Profile")} className={`${ghostBtn} h-10 text-sm`}>Set target role</button>
            </div>
          </section>
        )}
        {aiMode && profileReady && !hasRole && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="inline-flex items-center gap-2 font-medium"><Info size={16} aria-hidden="true" /> Matching on skills only. Add a target role to improve matches.</span>
            <button type="button" onClick={() => onNavigate?.("My Profile")} className="text-xs font-bold underline">Add target role</button>
          </div>
        )}
        {aiMode && profileReady && aiState.status === "failed" && (
          <div role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 font-medium"><Info size={16} aria-hidden="true" /> Showing basic matches. AI explanations are unavailable right now.</span>
            <button type="button" onClick={runAi} className="text-xs font-bold text-brand-700 underline">Try again</button>
          </div>
        )}
        {allWeak && (
          <div className="rounded-2xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm text-slate-700">
            No strong matches right now. Try <button type="button" onClick={() => switchMode("all")} className="font-bold text-brand-700 underline">All jobs</button>, or{" "}
            <button type="button" onClick={() => onNavigate?.("Career Roadmap")} className="font-bold text-brand-700 underline">learn a new skill</button> to widen your options.
          </div>
        )}

        {/* ========================================================================
            REPLACED CONTAINER FOR JOB CARDS (Clean Table-Like / Minimal Rectangular List)
           ======================================================================== */}
       
          <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-2xs">
            <div className="px-6 py-3 bg-stone-50/70 border-b border-slate-100 text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>Available Positions ({list.length})</span>
              {aiMode && aiState.status === "loading" && (
                <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-normal lowercase">
                  <Loader2 size={12} className="animate-spin" aria-hidden="true" /> Writing AI explanations...
                </span>
              )}
            </div>

            {loadState === "loading" && (
              <div className="py-16 text-center text-sm text-stone-400" aria-busy="true">Loading jobs...</div>
            )}

            {loadState === "error" && (
              <div role="alert" className="py-16 px-6 text-center space-y-3">
                <AlertTriangle size={24} className="text-rose-600 mx-auto" />
                <p className="text-sm font-bold text-slate-900">We could not load jobs</p>
                <button type="button" onClick={load} className={primaryBtn}>Try again</button>
              </div>
            )}

            {loadState === "ready" && list.length === 0 && (
              <div className="py-16 px-6 text-center space-y-3">
                <SearchX size={24} className="text-stone-400 mx-auto" />
                <p className="text-sm font-bold text-slate-900">No jobs found</p>
                <p className="text-xs text-stone-500">Try different keywords or remove some filters.</p>
                <button type="button" onClick={clearAll} className="text-xs font-bold text-brand-700 hover:underline">Clear filters</button>
              </div>
            )}

            {loadState === "ready" && list.length > 0 && (
              <div className="divide-y divide-slate-100">
                {list.slice(0, visible).map(({ job, m }) => {
                  const isApplied = applied.has(job.id);
                  const d = daysLeft(job);
                  return (
                    <button
                      key={job.id}
                      onClick={() => setOpenId(job.id)}
                      aria-label={`View details for ${job.title} at ${job.company}`}
                      className="w-full text-left grid md:grid-cols-[minmax(0,1fr)_160px_180px_20px] items-center gap-4 px-6 py-4 hover:bg-amber-50/40 transition-colors duration-150 cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:ring-inset"
                    >
                      {/* Job & Company Cell */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <LogoAvatar job={job} />
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-stone-900 truncate group-hover:text-brand-600 transition-colors">
                              {job.title}
                            </span>
                            {job.verified && <BadgeCheck size={14} className="text-emerald-600 shrink-0" title="Verified company" />}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 truncate">
                            <Building2 className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                            <span className="truncate">{job.company}</span>
                            <span>·</span>
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                            <span className="truncate">{job.location || "Remote"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Salary / Experience Cell */}
                      <div className="hidden md:block text-xs">
                        <p className="font-medium text-stone-800">{job.salary}</p>
                        <p className="text-stone-400 text-[11px]">{job.experience}</p>
                      </div>

                      {/* Status / Match Cell */}
                      <div className="flex flex-col items-start gap-1">
                        {isApplied ? (
                          <Pill className="bg-emerald-50 text-emerald-800 ring-emerald-200" icon={CheckCircle2}>Applied</Pill>
                        ) : aiMode && profileReady ? (
                          <MatchPill label={m.label} />
                        ) : (
                          <Pill className="bg-stone-100 text-stone-700 ring-stone-200" icon={Briefcase}>{job.mode}</Pill>
                        )}
                        {d <= 7 && (
                          <span className={`text-[10px] font-semibold ${d <= 3 ? "text-rose-600" : "text-stone-500"}`}>
                            {closesText(job)}
                          </span>
                        )}
                      </div>

                      {/* Chevron */}
                      <div className="hidden md:flex justify-end text-stone-400 group-hover:translate-x-0.5 transition-transform">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {visible < list.length && (
            <div className="mt-5 flex justify-center">
              <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="inline-flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-semibold text-stone-700 bg-white border border-stone-200 transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-2xs">
                Load more <span className="text-stone-400">({list.length - visible} left)</span>
              </button>
            </div>
          )}
       
      </div>

      <JobDrawer
        job={open?.job} m={open?.m}
        applied={open ? applied.has(open.job.id) : false}
        applying={open ? applyingId === open.job.id : false}
        reason={open ? reasonFor(open.job.id, open.m) : ""}
        aiWritten={open ? Boolean(aiState.reasons[open.job.id]) : false}
        profileReady={profileReady}
        onClose={() => setOpenId(null)} onApply={apply} onReport={setReportFor} onNavigate={onNavigate}
      />

      <Modal open={Boolean(reportFor)} onClose={() => setReportFor(null)}>
        {reportFor && (
          <FormLayout
            title="Report company"
            description={`Tell us about a problem with ${reportFor.company}. Our team will review it.`}
            submitLabel="Send report" submitPlacement="bottom" fields={reportFields} onSubmit={submitReport}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}