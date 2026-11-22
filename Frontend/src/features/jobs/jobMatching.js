/* Mock data and the matching engine (pure functions, no AI needed).
   Backend later: GET /jobs?q=&location=&experience=&industry=&verified=&sort=&mode=recommended&page=
   The server should return the same fields (matchScore, matched, missing, applied). */

const inDays = (n) => new Date(Date.now() + n * 86400000).toISOString();

const J = (id, o) => ({
  id, is_active: true, badges: [{ label: o.mode }, { label: o.typeLabel }], workMode: o.mode, ...o,
  deadline: inDays(o.deadlineDays),
});

/* Salary, job type and "posted X days ago" are not in your ERD yet (see notes), so they are mock only. */
export const MOCK_JOBS = [
  J(1, { title: "Frontend Developer Intern", company: "TechSolutions", industry: "Software", verified: true,
    location: "Lahore", mode: "On-site", type: "internship", typeLabel: "Internship", experience: "0-1 years", experienceMin: 0,
    salary: "PKR 25,000 - 35,000 / mo", postedDaysAgo: 2, deadlineDays: 12, employer_id: 11,
    description: "Build and maintain responsive interfaces with React and Tailwind CSS. You will work with senior engineers and ship features every sprint.",
    requiredSkills: ["React", "JavaScript", "HTML", "CSS", "Git"] }),
  J(2, { title: "React Developer", company: "PixelWorks", industry: "Design & Product", verified: true,
    location: "Remote", mode: "Remote", type: "full_time", typeLabel: "Full time", experience: "1-2 years", experienceMin: 1,
    salary: "PKR 90,000 - 130,000 / mo", postedDaysAgo: 1, deadlineDays: 20, employer_id: 12,
    description: "Own features end to end in a React and TypeScript codebase. Collaborate with designers and write tested, accessible components.",
    requiredSkills: ["React", "TypeScript", "JavaScript", "Testing (Jest)"] }),
  J(3, { title: "Full Stack Developer", company: "CodeCraft", industry: "Software", verified: true,
    location: "Islamabad", mode: "Hybrid", type: "full_time", typeLabel: "Full time", experience: "1-3 years", experienceMin: 1,
    salary: "PKR 120,000 - 170,000 / mo", postedDaysAgo: 4, deadlineDays: 9, employer_id: 13,
    description: "Work across a React frontend and a Node.js API backed by PostgreSQL. Deploy with Docker.",
    requiredSkills: ["React", "Node.js", "SQL", "Docker", "REST APIs"] }),
  J(4, { title: "UI Engineer", company: "Softedge", industry: "Software", verified: false,
    location: "Lahore", mode: "Hybrid", type: "full_time", typeLabel: "Full time", experience: "1-2 years", experienceMin: 1,
    salary: "PKR 70,000 - 100,000 / mo", postedDaysAgo: 6, deadlineDays: 3, employer_id: 15,
    description: "Turn design files into polished, accessible interfaces and maintain a shared component library.",
    requiredSkills: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Figma"] }),
  J(5, { title: "Backend Developer", company: "FinEdge", industry: "Finance Tech", verified: true,
    location: "Karachi", mode: "On-site", type: "full_time", typeLabel: "Full time", experience: "2-4 years", experienceMin: 2,
    salary: "PKR 150,000 - 220,000 / mo", postedDaysAgo: 3, deadlineDays: 15, employer_id: 14,
    description: "Design and maintain REST APIs and data pipelines for a payments platform.",
    requiredSkills: ["Node.js", "PostgreSQL", "REST APIs", "Docker", "Authentication (JWT)"] }),
  J(6, { title: "Data Analyst Intern", company: "DataNest", industry: "Analytics", verified: true,
    location: "Lahore", mode: "Hybrid", type: "internship", typeLabel: "Internship", experience: "0-1 years", experienceMin: 0,
    salary: "PKR 30,000 - 40,000 / mo", postedDaysAgo: 5, deadlineDays: 18, employer_id: 16,
    description: "Clean data, build dashboards and present findings to the product team.",
    requiredSkills: ["SQL", "Excel", "Python", "Power BI"] }),
  J(7, { title: "UI/UX Designer", company: "Studio Nine", industry: "Design", verified: false,
    location: "Remote", mode: "Remote", type: "full_time", typeLabel: "Full time", experience: "1-3 years", experienceMin: 1,
    salary: "PKR 80,000 - 120,000 / mo", postedDaysAgo: 8, deadlineDays: 25, employer_id: 17,
    description: "Run user research, design flows in Figma and test prototypes with real users.",
    requiredSkills: ["Figma", "Wireframing", "Prototyping", "User Research"] }),
  J(8, { title: "QA Engineer Intern", company: "QualityWorks", industry: "Software", verified: true,
    location: "Islamabad", mode: "Hybrid", type: "internship", typeLabel: "Internship", experience: "0-1 years", experienceMin: 0,
    salary: "PKR 30,000 - 45,000 / mo", postedDaysAgo: 3, deadlineDays: 6, employer_id: 18,
    description: "Write test cases, run manual tests and help automate regression checks.",
    requiredSkills: ["Manual Testing", "Postman", "Selenium", "Git"] }),
  J(9, { title: "Frontend Developer", company: "NovaTech", industry: "Software", verified: true,
    location: "Lahore", mode: "Hybrid", type: "full_time", typeLabel: "Full time", experience: "1-3 years", experienceMin: 1,
    salary: "PKR 100,000 - 150,000 / mo", postedDaysAgo: 0, deadlineDays: 30, employer_id: 19,
    description: "Build customer-facing features in React and TypeScript, with a strong focus on performance and accessibility.",
    requiredSkills: ["React", "JavaScript", "CSS", "Tailwind CSS", "TypeScript", "Git"] }),
  J(10, { title: "Mobile App Developer", company: "AppForge", industry: "Software", verified: true, is_active: false,
    location: "Lahore", mode: "On-site", type: "full_time", typeLabel: "Full time", experience: "1-2 years", experienceMin: 1,
    salary: "PKR 100,000 - 140,000 / mo", postedDaysAgo: 10, deadlineDays: 5, employer_id: 20,
    description: "Closed position (kept to show that inactive jobs are never listed).",
    requiredSkills: ["Flutter", "Dart"] }),
];

/* Backend later: built from job_seeker_profile + seeker_skill + skill_evidence */
export const MOCK_PROFILE = {
  targetRole: "Frontend Developer",
  city: "Lahore",
  yearsExperience: 1,
  skills: [
    { name: "React", verified: true },
    { name: "JavaScript", verified: true },
    { name: "Tailwind CSS", verified: false },
    { name: "HTML", verified: false },
    { name: "Git", verified: false },
  ],
};

/* ---------- Matching engine ---------- */
const ALIAS = { reactjs: "react", "react.js": "react", js: "javascript", ts: "typescript", node: "node.js", nodejs: "node.js", postgres: "postgresql", tailwind: "tailwind css" };
const canon = (s) => { const k = s.trim().toLowerCase(); return ALIAS[k] || k; };

const STOP = new Set(["developer", "engineer", "intern", "junior", "senior", "and", "the", "of", "a"]);
const FAMILIES = {
  frontend: ["frontend", "react", "ui", "web", "angular", "vue"],
  backend: ["backend", "node", "api", "django"],
  fullstack: ["fullstack", "mern", "full"],
  data: ["data", "analyst", "ml", "analytics"],
  design: ["design", "designer", "ux"],
  qa: ["qa", "tester", "testing", "quality"],
};
const tokens = (text) =>
  text.toLowerCase()
    .replace(/front[\s-]?end/g, "frontend").replace(/back[\s-]?end/g, "backend").replace(/full[\s-]?stack/g, "fullstack")
    .split(/[^a-z0-9]+/).filter((t) => t && !STOP.has(t));
const familiesOf = (toks) =>
  Object.keys(FAMILIES).filter((f) => toks.some((t) => FAMILIES[f].includes(t)));

export const labelFor = (score) => (score >= 70 ? "Strong" : score >= 40 ? "Medium" : "Weak");

export const daysLeft = (job) => Math.ceil((new Date(job.deadline) - Date.now()) / 86400000);

export const hasProfileData = (p) => p.skills.length > 0 || Boolean(p.targetRole?.trim());

/* Score 0-100. Weights: skills 55, role 25, experience 10, location 10.
   Signals the profile cannot provide are left out and the rest are re-weighted.
   Verified skills count fully, unverified owned skills 0.85. */
export function scoreJob(job, profile) {
  const have = new Map(profile.skills.map((s) => [canon(s.name), s.verified]));
  const req = job.requiredSkills || [];
  const matched = req.filter((s) => have.has(canon(s)));
  const missing = req.filter((s) => !have.has(canon(s)));
  const verifiedMatched = matched.filter((s) => have.get(canon(s)));

  const skillV = req.length
    ? (verifiedMatched.length + (matched.length - verifiedMatched.length) * 0.85) / req.length : 0;

  const roleToks = tokens(profile.targetRole || "");
  const titleToks = tokens(job.title);
  const direct = roleToks.length ? roleToks.filter((t) => titleToks.includes(t)).length / roleToks.length : 0;
  const family = familiesOf(roleToks).some((f) => familiesOf(titleToks).includes(f)) ? 0.8 : 0;
  const roleV = Math.max(direct, family);

  const expV = profile.yearsExperience >= job.experienceMin ? 1
    : job.experienceMin - profile.yearsExperience <= 1 ? 0.5 : 0;
  const locV = !profile.city ? 0
    : job.mode === "Remote" || job.location.toLowerCase().includes(profile.city.toLowerCase()) ? 1 : 0;

  const parts = [
    { w: 55, v: skillV, on: profile.skills.length > 0 && req.length > 0 },
    { w: 25, v: roleV, on: roleToks.length > 0 },
    { w: 10, v: expV, on: true },
    { w: 10, v: locV, on: Boolean(profile.city) },
  ].filter((p) => p.on);
  const totalW = parts.reduce((n, p) => n + p.w, 0) || 1;
  const score = Math.round((parts.reduce((n, p) => n + p.w * p.v, 0) / totalW) * 100);

  const roleFit = roleV >= 0.8;
  const reason =
    `${matched.length} of ${req.length} required skills` +
    (roleFit ? " · fits your target role" : "") +
    (locV ? "" : job.mode === "Remote" ? "" : " · different city");

  return {
    score, label: labelFor(score), matched, missing,
    verifiedMatched, roleFit, reason,
  };
}

/* ---------- SIMULATED AI explanations (top jobs only) ----------
   Backend later: the server sends role + skill names + the short job data of the top 10
   to the AI Service and returns { [jobId]: "one line" }.
   Never send email, phone or the full bio. Ignore any job_id that is not in the request. */
export function mockAiReasons(items, profile, { fail = false } = {}) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (fail) return reject(new Error("AI unavailable"));
      const out = {};
      items.forEach(({ job, m }) => {
        const strong = m.matched.slice(0, 2).join(" and ");
        const gap = m.missing[0];
        out[job.id] = strong
          ? `Your ${strong} skills match the core of this role${m.roleFit ? " and your target role" : ""}.` +
            (gap ? ` Learning ${gap} would close the main gap.` : " You cover every listed skill.")
          : `This role is outside your current skills.${gap ? ` Starting with ${gap} would help.` : ""}`;
      });
      resolve(out);
    }, 900)
  );
}