import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  FileText,
  Sparkles,
  Loader2,
  X,
  Target,
  CheckCircle2,
  BadgeCheck,
  Check,
  Flame,
  TrendingUp,
  Clock,
  BookOpen,
  GraduationCap,
  PlayCircle,
  Code2,
  ExternalLink,
  Plus,
  ArrowRight,
  Rocket,
  Map as MapIcon,

  // Sidebar navigation icons
  LayoutDashboard,
  UserRound,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const MAX_ACTIVE = 5;

const navigationItems = [
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

/* ======================================================================
   MOCK AI & DATA BUILDER
   ====================================================================== */
const build = (name, o) => ({
  skill: name,
  demand: o.demand,
  why: o.why,
  prerequisites: o.pre || [],
  related: o.related || [],
  stages: [
    { name: "Fundamentals", goal: `Understand what ${name} is and get it set up.`,
      weeks: o.w[0], steps: o.fund, resources: o.res.slice(0, 1) },
    { name: "Core concepts", goal: "Learn the ideas you will use every day.",
      weeks: o.w[1], steps: o.core, resources: o.res.slice(1) },
    { name: "Build a project", goal: "Apply it in something real, not just tutorials.",
      weeks: o.w[2], steps: [o.project, "Fix bugs and refactor once it works"], resources: [] },
    { name: "Prove it", goal: "Turn your learning into proof employers can open.",
      weeks: 0, steps: [
        "Publish the project on GitHub with a clear README",
        "Optional: earn a certificate or write a short case study",
        "Add the link as proof on My Skills",
      ], resources: [] },
  ],
});

const SKILL_LIB = {
  TypeScript: build("TypeScript", {
    demand: "High", w: [1, 2, 2], pre: ["JavaScript"], related: ["React", "Node.js", "Next.js"],
    why: "Now expected in most professional frontend and Node.js job listings.",
    fund: ["Install TypeScript and compile your first file", "Learn basic types, interfaces and type aliases"],
    core: ["Practice generics, unions and narrowing", "Type function parameters and return values", "Configure tsconfig for a real project"],
    project: "Convert a small JavaScript app to TypeScript",
    res: [["TypeScript handbook", "Docs", "https://www.typescriptlang.org/docs/handbook/intro.html"],
      ["Total TypeScript tutorials", "Course", "https://www.totaltypescript.com/tutorials"]],
  }),
  "Next.js": build("Next.js", {
    demand: "Rising", w: [1, 2, 2], pre: ["React", "JavaScript"], related: ["React", "TypeScript"],
    why: "The leading React framework for production apps, with growing demand.",
    fund: ["Create an app with create-next-app", "Understand the app router and file-based routing"],
    core: ["Learn server and client components", "Fetch data and handle loading and error states", "Add API routes and metadata"],
    project: "Build a blog or portfolio with dynamic routes",
    res: [["Next.js Learn", "Course", "https://nextjs.org/learn"], ["Next.js docs", "Docs", "https://nextjs.org/docs"]],
  }),
  "Node.js": build("Node.js", {
    demand: "High", w: [1, 2, 2], pre: ["JavaScript"], related: ["Express", "SQL", "REST APIs"],
    why: "A common runtime for backend services and APIs.",
    fund: ["Install Node.js and run scripts", "Learn modules, npm and package.json"],
    core: ["Work with the file system and async code", "Handle HTTP requests", "Manage environment variables and errors"],
    project: "Build a small command-line tool or simple server",
    res: [["Node.js Learn", "Docs", "https://nodejs.org/en/learn"], ["The Odin Project: Node", "Course", "https://www.theodinproject.com"]],
  }),
  SQL: build("SQL", {
    demand: "High", w: [1, 2, 2], related: ["PostgreSQL", "Node.js", "Python"],
    why: "Needed for data analysis and backend roles alike.",
    fund: ["Understand tables, rows and keys", "Write SELECT queries with WHERE and ORDER BY"],
    core: ["Practice JOINs across tables", "Use GROUP BY and aggregate functions", "Design a simple schema"],
    project: "Design and query a small database (for example a library or store)",
    res: [["SQLBolt", "Practice", "https://sqlbolt.com"], ["Mode SQL tutorial", "Course", "https://mode.com/sql-tutorial"]],
  }),
  "REST APIs": build("REST APIs", {
    demand: "High", w: [1, 1, 2], pre: ["JavaScript"], related: ["Node.js", "Express", "Authentication (JWT)"],
    why: "How frontends, mobile apps and services talk to each other.",
    fund: ["Learn HTTP methods and status codes", "Call a public API with fetch or Postman"],
    core: ["Design resource-based endpoints", "Handle validation and errors", "Document your API"],
    project: "Build a CRUD API for a simple app",
    res: [["REST API tutorial", "Docs", "https://restfulapi.net"], ["Postman Learning Center", "Course", "https://learning.postman.com"]],
  }),
  Git: build("Git", {
    demand: "Steady", w: [1, 1, 1], related: ["Docker"],
    why: "Required for every team workflow.",
    fund: ["Install Git and make your first commit", "Learn add, commit, status and log"],
    core: ["Use branches and merge", "Resolve a merge conflict", "Open a pull request on GitHub"],
    project: "Contribute a small change to an open-source repo or a friend's project",
    res: [["Pro Git book", "Docs", "https://git-scm.com/book"], ["Learn Git Branching", "Practice", "https://learngitbranching.js.org"]],
  }),
  Docker: build("Docker", {
    demand: "Rising", w: [1, 1, 2], pre: ["Git"], related: ["Node.js", "SQL"],
    why: "Packaging and deployment are valued across engineering roles.",
    fund: ["Install Docker and run a container", "Understand images versus containers"],
    core: ["Write a Dockerfile", "Use docker compose for an app and a database", "Manage volumes and ports"],
    project: "Containerize one of your own apps",
    res: [["Docker get started", "Docs", "https://docs.docker.com/get-started/"], ["Docker for beginners", "Course", "https://docker-curriculum.com"]],
  }),
  "Testing (Jest)": build("Testing (Jest)", {
    demand: "Steady", w: [1, 1, 1], pre: ["JavaScript"], related: ["React", "TypeScript"],
    why: "Quality-focused teams expect tested code.",
    fund: ["Install Jest and run your first test", "Learn describe, it and expect"],
    core: ["Test pure functions and edge cases", "Mock functions and modules", "Test a React component"],
    project: "Add tests to an existing project and reach good coverage",
    res: [["Jest getting started", "Docs", "https://jestjs.io/docs/getting-started"], ["Testing Library docs", "Docs", "https://testing-library.com/docs/"]],
  }),
  Python: build("Python", {
    demand: "High", w: [2, 3, 3], related: ["SQL", "Statistics"],
    why: "The main language for analysis, automation and AI work.",
    fund: ["Install Python and write simple scripts", "Learn variables, loops and functions"],
    core: ["Work with lists, dictionaries and files", "Use pandas for data", "Write reusable modules"],
    project: "Analyse a public dataset and summarise your findings",
    res: [["Python tutorial", "Docs", "https://docs.python.org/3/tutorial/"], ["Kaggle Learn: Python", "Course", "https://www.kaggle.com/learn/python"]],
  }),
  Figma: build("Figma", {
    demand: "High", w: [1, 2, 2], related: ["Prototyping", "Wireframing", "Design Systems"],
    why: "The industry-standard design and handoff tool.",
    fund: ["Learn frames, shapes and text", "Use layers and alignment"],
    core: ["Build with components and variants", "Use auto layout", "Create an interactive prototype"],
    project: "Design a 4-screen mobile app flow",
    res: [["Figma Help Center", "Docs", "https://help.figma.com"], ["Figma learn design", "Course", "https://www.figma.com/resources/learn-design/"]],
  }),
};

const genericRoadmap = (name) =>
  build(name, {
    demand: "Steady", w: [1, 2, 2], related: [],
    why: `${name} appears in job listings for your target role and strengthens your profile.`,
    fund: [`Read an introduction to ${name}`, "Set up the tools you need and try a first example"],
    core: ["Work through a structured beginner course", "Practice with small exercises", "Note the concepts you find hardest and revisit them"],
    project: `Build a small project that uses ${name}`,
    res: [[`Search: learn ${name}`, "Docs", `https://www.google.com/search?q=${encodeURIComponent("learn " + name)}`],
      [`YouTube: ${name} tutorial`, "Video", `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " tutorial")}`]],
  });

const JOB_COUNTS = { TypeScript: 12, "Next.js": 8, "Node.js": 9, SQL: 11, "REST APIs": 7, Docker: 5 };

function mockGenerateRoadmap(skill) {
  const key = Object.keys(SKILL_LIB).find((s) => s.toLowerCase() === skill.trim().toLowerCase());
  const base = key ? SKILL_LIB[key] : genericRoadmap(skill.trim());
  const result = { ...base, jobCount: JOB_COUNTS[base.skill] || 0, generatedAt: new Date().toISOString().slice(0, 10) };
  return new Promise((resolve) => setTimeout(() => resolve(result), 1100));
}

const POPULAR = ["Next.js", "Node.js", "SQL", "REST APIs", "Git", "Python", "TypeScript", "Docker"];

const mockSkills = [
  { skill_name: "React", evidenceCount: 2 },
  { skill_name: "JavaScript", evidenceCount: 1 },
  { skill_name: "Tailwind CSS", evidenceCount: 0 },
  { skill_name: "HTML", evidenceCount: 0 },
];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const parseSkills = (text) =>
  [...new Set(text.split(/[,\n]/).map((s) => s.trim()).filter(Boolean))];

const DEMAND = {
  High: { label: "High demand", icon: Flame, cls: "bg-brand-50 text-brand-500" },
  Rising: { label: "Rising", icon: TrendingUp, cls: "bg-emerald-50 text-emerald-700" },
  Steady: { label: "Steady", icon: null, cls: "bg-stone-100 text-stone-600" },
};
const RES_ICON = { Docs: BookOpen, Course: GraduationCap, Video: PlayCircle, Practice: Code2 };

function DemandBadge({ demand }) {
  const d = DEMAND[demand] || DEMAND.Steady;
  const Icon = d.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${d.cls}`}>
      {Icon && <Icon size={12} aria-hidden="true" />}
      {d.label}
    </span>
  );
}

/* Circular Progress Ring Component */
function ProgressRing({ pct, size = 100, stroke = 9 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${pct}% of steps done`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-stone-200/70" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
          className="stroke-brand-500 transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-base font-black tracking-tight text-slate-900">{pct}%</span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Done</span>
      </div>
    </div>
  );
}

/* ---------- MAIN PAGE COMPONENT ---------- */
export default function CareerRoadmapPage({
  user = { name: "Ahmed" },
  focusSkills = ["TypeScript", "Docker"],
  roleTitle = "Frontend Developer",
  skills: initialSkills = mockSkills,
  onNavigate,
  onAddSkill,
}) {
  const [skills, setSkills] = useState(initialSkills);
  const [plan, setPlan] = useState([]);
  const [activeSkill, setActiveSkill] = useState(null);
  const [pending, setPending] = useState([]);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [done, setDone] = useState({});
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const notify = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const generateMany = async (names) => {
    const wanted = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
    if (wanted.length === 0) {
      setInputError("Enter at least one skill. Separate several skills with commas.");
      return;
    }
    if (wanted.some((n) => n.length < 2)) {
      setInputError("Each skill needs at least 2 characters.");
      return;
    }

    const inPlan = new Set(plan.map((r) => r.skill.toLowerCase()));
    const inFlight = new Set(pending.map((n) => n.toLowerCase()));
    const fresh = wanted.filter((n) => !inPlan.has(n.toLowerCase()) && !inFlight.has(n.toLowerCase()));

    const existing = plan.find((r) => wanted.some((n) => n.toLowerCase() === r.skill.toLowerCase()));
    if (existing && fresh.length === 0) {
      setActiveSkill(existing.skill);
      setInput("");
      setInputError("");
      return;
    }

    if (plan.length + pending.length + fresh.length > MAX_ACTIVE) {
      setInputError(
        `You can learn up to ${MAX_ACTIVE} skills at once. Remove one from your plan to add more.`
      );
      return;
    }

    setInputError("");
    setInput("");
    setPending((p) => [...p, ...fresh]);

    const results = await Promise.allSettled(fresh.map((n) => mockGenerateRoadmap(n)));
    const ok = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
    const failed = fresh.filter((_, i) => results[i].status === "rejected");

    setPending((p) => p.filter((n) => !fresh.includes(n)));
    setPlan((prev) => {
      const have = new Set(prev.map((r) => r.skill.toLowerCase()));
      return [...prev, ...ok.filter((r) => !have.has(r.skill.toLowerCase()))];
    });
    if (ok[0]) setActiveSkill(ok[0].skill);
    if (failed.length) setInputError(`Could not build: ${failed.join(", ")}. Try again.`);
  };

  useEffect(() => {
    if (focusSkills.length) generateMany(focusSkills);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFromPlan = (skill) => {
    setPlan((prev) => prev.filter((r) => r.skill !== skill));
    setActiveSkill((cur) => {
      if (cur !== skill) return cur;
      const rest = plan.filter((r) => r.skill !== skill);
      return rest[0]?.skill ?? null;
    });
  };

  const evidenceBy = useMemo(
    () => new Map(skills.map((s) => [s.skill_name.toLowerCase(), s.evidenceCount || 0])),
    [skills]
  );
  const has = (name) => evidenceBy.has(name.toLowerCase());
  const verified = (name) => (evidenceBy.get(name.toLowerCase()) || 0) > 0;

  const stepKey = (r, si, i) => `${r.skill}:${si}:${i}`;
  const stats = (r) => {
    const total = r.stages.reduce((n, s) => n + s.steps.length, 0);
    const finished = r.stages.reduce(
      (n, s, si) => n + s.steps.filter((_, i) => done[stepKey(r, si, i)]).length, 0);
    return { total, finished, pct: total ? Math.round((finished / total) * 100) : 0 };
  };
  const nextStep = (r) => {
    for (let si = 0; si < r.stages.length; si++) {
      const i = r.stages[si].steps.findIndex((_, idx) => !done[stepKey(r, si, idx)]);
      if (i !== -1) return { stage: r.stages[si].name, text: r.stages[si].steps[i] };
    }
    return null;
  };

  const active = plan.find((r) => r.skill === activeSkill) || plan[0] || null;
  const activeStats = active ? stats(active) : null;
  const activeWeeks = active ? active.stages.reduce((n, s) => n + s.weeks, 0) : 0;
  const nextStageIdx = active
    ? active.stages.findIndex((s, si) => s.steps.some((_, i) => !done[stepKey(active, si, i)]))
    : -1;

  const all = plan.map(stats);
  const allTotal = all.reduce((n, s) => n + s.total, 0);
  const allDone = all.reduce((n, s) => n + s.finished, 0);
  const allPct = allTotal ? Math.round((allDone / allTotal) * 100) : 0;
  const allWeeks = plan.reduce((n, r) => n + r.stages.reduce((m, s) => m + s.weeks, 0), 0);

  const toggleStep = (si, i) => {
    const key = stepKey(active, si, i);
    setDone((d) => ({ ...d, [key]: !d[key] }));
  };

  const addToSkills = () => {
    setSkills((prev) => [{ skill_name: active.skill, evidenceCount: 0 }, ...prev]);
    onAddSkill?.(active.skill);
    notify(`${active.skill} added to your skills. Add proof on My Skills.`);
  };

  const planNames = new Set([...plan.map((r) => r.skill.toLowerCase()), ...pending.map((n) => n.toLowerCase())]);
  const suggestions = POPULAR.filter((s) => !planNames.has(s.toLowerCase()));
  const used = plan.length + pending.length;
  const isEmpty = plan.length === 0 && pending.length === 0;

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      activeTab="Career Roadmap"
      onNavigate={onNavigate}
      workspaceLabel="Job Seeker Workspace"
      menuTitle="Job Seeker Menu"
    >
      {toast && (
        <div role="status" className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
          {toast}
        </div>
      )}

      {/* ========================================================================
          HERO LAYOUT WITH BENTO CARDS & INTERACTIVE POPULAR SKILLS
         ======================================================================== */}
      <section className="mb-8 pt-4 pb-2">
        <div className="w-full max-w-5xl space-y-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Your learning plan
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Separate several skills with commas to build them together.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              generateMany(parseSkills(input));
            }}
            className="mx-auto w-full max-w-xl"
          >
            <div
              className={`flex w-full items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm ${
                inputError ? "ring-2 ring-red-500" : ""
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-2.5 transition focus-within:border-brand-500 focus-within:bg-white">
                <Search
                  size={16}
                  className="mr-3 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="roadmap-skill"
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setInputError("");
                  }}
                  placeholder="Enter skills... e.g., TypeScript, Docker, SQL"
                  aria-invalid={Boolean(inputError)}
                  className="w-full min-w-0 bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    aria-label="Clear input"
                    className="ml-2 shrink-0 rounded-md p-1 text-stone-400 transition hover:bg-stone-200 hover:text-slate-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                title="Add to plan"
                aria-label="Add skills to learning plan"
                disabled={pending.length > 0}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 shadow-xs"
              >
                {pending.length > 0 ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
              </button>
            </div>

            {inputError && (
              <p className="mt-2 pl-4 text-xs font-semibold text-red-600">
                {inputError}
              </p>
            )}
          </form>

          {/* Interactive Popular Tag Chips Bar with Uniform Card Styling */}
          {suggestions.length > 0 && used < MAX_ACTIVE && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 mr-1">
                <Flame size={14} aria-hidden="true" /> Popular:
              </span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => generateMany([s])}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-white hover:border-brand-500/40 hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <Plus size={12} aria-hidden="true" className="text-brand-500" /> {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Empty State */}
      {isEmpty && (
        <section className="rounded-2xl border border-stone-200 bg-stone-50/50 p-8 text-center shadow-soft sm:p-12 transition-all">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <MapIcon size={26} aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-lg font-extrabold text-slate-900">Your plan is empty</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">
            Add up to {MAX_ACTIVE} skills above, or open roadmaps from the AI Career Match card on My Skills.
          </p>
          <button
            type="button"
            onClick={() => onNavigate?.("My Skills")}
            className="mt-5 text-xs font-bold text-brand-500 hover:underline"
          >
            Go to My Skills
          </button>
        </section>
      )}

      {/* Plan strip: one card per skill with uniform bento borders */}
      {!isEmpty && (
        <div role="tablist" aria-label="Skills in your plan" className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {plan.map((r) => {
            const st = stats(r);
            const selected = active?.skill === r.skill;
            return (
              <div
                key={r.skill}
                className={`relative rounded-2xl border bg-stone-50/50 p-4 shadow-soft transition-all ${
                  selected ? "border-brand-500 bg-white ring-2 ring-brand-500/20 shadow-sm" : "border-stone-200 hover:border-stone-300 hover:bg-white"
                }`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveSkill(r.skill)}
                  className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <span className="block truncate pr-5 text-sm font-extrabold text-slate-900">{r.skill}</span>
                  <span className="mt-0.5 block text-xs text-stone-500">
                    {st.finished}/{st.total} steps
                  </span>
                  <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-stone-200/60">
                    <span
                      className="block h-full rounded-full bg-brand-500 transition-all duration-500"
                      style={{ width: `${st.pct}%` }}
                    />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => removeFromPlan(r.skill)}
                  aria-label={`Remove ${r.skill} from plan`}
                  title="Remove from plan"
                  className="absolute right-2 top-2 rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-200 hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}

          {pending.map((n) => (
            <div key={n} aria-busy="true" className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 shadow-soft">
              <span className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <Loader2 size={14} className="animate-spin text-brand-500" aria-hidden="true" />
                <span className="truncate">{n}</span>
              </span>
              <span className="mt-0.5 block text-xs text-stone-500">Building roadmap...</span>
              <span className="mt-3 block h-1.5 animate-pulse rounded-full bg-stone-200" />
            </div>
          ))}
        </div>
      )}

      {/* Selected roadmap + plan-wide sidebar */}
      {active && activeStats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* LEFT: selected skill */}
          <section className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6 shadow-soft lg:col-span-8 transition-all">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">{active.skill}</h2>
                  <DemandBadge demand={active.demand} />
                </div>
                <p className="mt-1 text-xs text-stone-500">Generated {fmtDate(active.generatedAt)}</p>
              </div>

              {verified(active.skill) ? (
                <p className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700">
                  <BadgeCheck size={16} aria-hidden="true" /> You have this skill, with proof
                </p>
              ) : has(active.skill) ? (
                <button
                  type="button"
                  onClick={() => onNavigate?.("My Skills")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-500 transition-colors hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  In your skills · Add proof <ArrowRight size={13} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={addToSkills}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    activeStats.pct === 100
                      ? "bg-brand-500 text-white hover:bg-brand-600"
                      : "bg-brand-50 text-brand-500 hover:bg-brand-100"
                  }`}
                >
                  <Plus size={14} aria-hidden="true" />
                  {activeStats.pct === 100 ? "Add to My Skills" : "I already know this"}
                </button>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-stone-600">{active.why}</p>

            <dl className="mt-4 grid grid-cols-3 gap-4 border-y border-stone-200/60 py-4">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">Estimated time</dt>
                <dd className="mt-0.5 text-sm font-bold text-slate-900">~{activeWeeks} weeks</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">Progress</dt>
                <dd className="mt-0.5 text-sm font-bold text-slate-900">{activeStats.pct}%</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">On CareerFlux</dt>
                <dd className="mt-0.5 text-sm font-bold text-slate-900">
                  {active.jobCount > 0 ? `${active.jobCount} jobs` : "No data yet"}
                </dd>
              </div>
            </dl>

            {active.prerequisites.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-stone-500">
                  <Target size={13} className="text-brand-500" aria-hidden="true" /> Before you start
                </span>
                {active.prerequisites.map((p) =>
                  has(p) ? (
                    <span key={p} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700">
                      <CheckCircle2 size={12} aria-hidden="true" /> {p}
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => generateMany([p])}
                      className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      <Plus size={11} aria-hidden="true" /> {p} · Learn first
                    </button>
                  )
                )}
              </div>
            )}

            <ol className="mt-7 space-y-9">
              {active.stages.map((stage, si) => {
                const stageDone = stage.steps.filter((_, i) => done[stepKey(active, si, i)]).length;
                const complete = stageDone === stage.steps.length;
                const isCurrent = nextStageIdx === si;
                const isLast = si === active.stages.length - 1;
                return (
                  <li key={stage.name} className="relative pl-12">
                    <span
                      className={`absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${
                        complete ? "bg-emerald-600" : isCurrent ? "bg-brand-500" : "bg-stone-300"
                      }`}
                    >
                      {complete ? <Check size={18} aria-label="Stage complete" /> : si + 1}
                    </span>
                    {!isLast && (
                      <span aria-hidden="true" className="absolute -bottom-9 left-[17px] top-10 w-0.5 bg-stone-200" />
                    )}

                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="flex flex-wrap items-center gap-2 text-base font-extrabold text-slate-900">
                          {stage.name}
                          {isCurrent && (
                            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                              Current
                            </span>
                          )}
                        </h3>
                        <p className="mt-0.5 text-sm text-stone-500">{stage.goal}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {stage.weeks > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500">
                            <Clock size={13} aria-hidden="true" /> ~{stage.weeks} {stage.weeks === 1 ? "week" : "weeks"}
                          </span>
                        )}
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          complete ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"
                        }`}>
                          {stageDone}/{stage.steps.length}
                        </span>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-1.5 rounded-xl border border-stone-200/60 bg-white p-3 shadow-2xs">
                      {stage.steps.map((step, i) => {
                        const checked = Boolean(done[stepKey(active, si, i)]);
                        return (
                          <li key={step}>
                            <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-stone-50">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleStep(si, i)}
                                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-stone-300 accent-brand-500"
                              />
                              <span className={`text-sm ${checked ? "text-stone-400 line-through" : "text-slate-800"}`}>
                                {step}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>

                    {stage.resources.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {stage.resources.map(([title, type, url]) => {
                          const Icon = RES_ICON[type] || BookOpen;
                          return (
                            <li key={title + url}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200/60 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                              >
                                <Icon size={13} className="text-brand-500" aria-hidden="true" />
                                {title}
                                <span className="font-medium text-stone-400">· {type}</span>
                                <ExternalLink size={11} className="text-stone-400" aria-hidden="true" />
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {isLast && (
                      <button
                        type="button"
                        onClick={() => onNavigate?.("My Skills")}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-brand-500 transition-colors hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      >
                        <Rocket size={13} aria-hidden="true" /> Add proof on My Skills
                        <ArrowRight size={13} aria-hidden="true" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

{/* RIGHT: side widgets */}
<aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
  
  {/* Professional Clean Skill Progress Widget */}
 {/* Skill Progress Widget (Clean & Interactive) */}
<section className="group rounded-2xl border border-stone-200 bg-stone-50/50 p-6 shadow-soft transition-all duration-300 hover:border-stone-300 hover:bg-white hover:shadow-md">
  <div className="flex items-start justify-between gap-3">
    <div>
      <h3 className="text-base font-extrabold text-slate-900">
        Skill Progress
      </h3>
      <p className="mt-0.5 text-xs text-stone-500">
        Track your active learning progress
      </p>
    </div>
    <span className="rounded-full bg-brand-50 border border-brand-200/60 px-3 py-1 text-xs font-bold text-brand-500 shadow-2xs transition-transform duration-300 group-hover:scale-105">
      {active.skill}
    </span>
  </div>

  <div className="mt-6 flex items-center justify-between gap-6">
    {/* Circular Progress Ring (Fixed double text issue) */}
    <ProgressRing pct={activeStats.pct} size={96} stroke={9} />

    {/* Right Side Minimal Breakdown List */}
    <div className="flex flex-col justify-center space-y-2.5 flex-1 min-w-0">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-2 text-stone-600 truncate">
          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
          Completed
        </span>
        <span className="font-extrabold text-slate-900">{activeStats.finished}</span>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-2 text-stone-600 truncate">
          <span className="h-2 w-2 shrink-0 rounded-full bg-stone-300" />
          Remaining
        </span>
        <span className="font-extrabold text-slate-900">{activeStats.total - activeStats.finished}</span>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-stone-200/80">
        <span className="text-stone-500 font-medium">Total Steps</span>
        <span className="font-black text-slate-900">{activeStats.total}</span>
      </div>
    </div>
  </div>
</section>

  {/* Next Steps Card */}
  <section className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6 shadow-soft">
    <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-900">
      <Target size={17} className="text-brand-500" aria-hidden="true" /> Next steps
    </h3>
    <p className="mt-0.5 text-xs text-stone-500">One step to move forward on each skill.</p>
    <ul className="mt-3 space-y-2">
      {plan.map((r) => {
        const n = nextStep(r);
        return (
          <li key={r.skill} className="rounded-xl border border-stone-200/60 bg-white p-3 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveSkill(r.skill)}
              className="flex w-full items-start justify-between gap-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-900">{r.skill}</span>
                {n ? (
                  <span className="mt-0.5 block text-xs leading-snug text-stone-600">
                    <span className="font-semibold text-stone-500">{n.stage}:</span> {n.text}
                  </span>
                ) : (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={13} aria-hidden="true" /> All steps done
                  </span>
                )}
              </span>
              <ArrowRight size={14} className="mt-1 shrink-0 text-stone-400" aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ul>
  </section>

  {/* Related Skills Card */}
  {active.related.length > 0 && (
    <section className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6 shadow-soft">
      <h3 className="text-base font-extrabold text-slate-900">Works well with {active.skill}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {active.related
          .filter((r) => !planNames.has(r.toLowerCase()))
          .map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => generateMany([r])}
              className="inline-flex items-center gap-1 rounded-full border border-stone-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-brand-500/40 hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Plus size={11} aria-hidden="true" /> {r}
            </button>
          ))}
      </div>
      <p className="mt-3 text-[11px] leading-snug text-stone-400">
        Demand levels are AI estimates of market trends. Job counts come from CareerFlux listings.
      </p>
    </section>
  )}
</aside>
        </div>
      )}
    </DashboardLayout>
  );
}