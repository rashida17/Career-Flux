import { useRef, useState } from "react";
import {
  FaCircleCheck, FaLocationDot, FaUsers, FaCalendarDays, FaBriefcase, FaCircle,
  FaEnvelope, FaPhone, FaGlobe, FaIndustry, FaCalendar, FaBuilding, FaLandmark, FaUser, // [CHANGE 15] FaGithub removed, FaLandmark added  [CHANGE 16] FaUser added
  FaMoneyBillWave, FaRegClock, FaArrowRight, FaArrowLeft,                                // [CHANGE 16] FaArrowLeft added
} from "react-icons/fa6";
/* ---------- Company logo (real image) ---------- */
const SkylineMark = ({ className = "" }) => (
  <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Skyline Digital logo">
    <rect width="64" height="64" rx="14" className="fill-slate-900" />
    <rect x="12" y="34" width="8" height="18" rx="1.5" className="fill-brand-50" opacity=".55" />
    <rect x="23" y="24" width="8" height="28" rx="1.5" className="fill-brand-50" opacity=".8" />
    <rect x="34" y="16" width="8" height="36" rx="1.5" className="fill-brand-50" />
    <rect x="45" y="28" width="8" height="24" rx="1.5" className="fill-brand-500" />
    <rect x="10" y="52" width="44" height="3" rx="1.5" className="fill-brand-500" />
  </svg>
);

function CompanyLogo({ logoUrl, name = "Company", className = "w-10 h-10" }) {
  const [failed, setFailed] = useState(false);
  if (logoUrl && !failed) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`${className} rounded-xl object-contain bg-white border border-stone-200 p-1 shrink-0`}
      />
    );
  }
  return <SkylineMark className={`${className} rounded-xl shrink-0`} />;
}

/* ---------- Job card ---------- */
const badgeStyles = {
  red: "bg-red-50 text-red-700 border border-red-200",
  amber: "bg-amber-50 text-amber-800 border border-amber-200",
  blue: "bg-blue-50 text-blue-700 border border-blue-200",
  slate: "bg-slate-100 text-slate-700",
  green: "bg-emerald-50 text-emerald-800",
};

function JobCard({ job, company, onView }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-brand-500/40 transition flex flex-col justify-between space-y-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <CompanyLogo logoUrl={company.logoUrl} name={company.name} className="w-10 h-10" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 hover:text-brand-500 transition cursor-pointer">{job.title}</h4>
            <p className="text-[11px] text-slate-400">{company.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {job.badges.map((b) => (
            <span key={b.label} className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${badgeStyles[b.tone]}`}>{b.label}</span>
          ))}
        </div>

        <div className="space-y-1 text-xs">
          <div className="font-black text-slate-900 flex items-center space-x-1">
            <FaMoneyBillWave className="text-emerald-600 text-xs" />
            <span>{job.salary}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center space-x-3">
            <span className="flex items-center gap-1"><FaBriefcase className="text-slate-400" /> {job.level}</span>
            <span className="flex items-center gap-1"><FaRegClock className="text-slate-400" /> {job.posted}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
          <FaLocationDot className="text-brand-500" /> {job.location}
        </span>
        <button
          onClick={() => onView?.(job)}
          className="px-3.5 py-1.5 border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
        >
          <span>View</span>
          <FaArrowRight className="text-[10px]" />
        </button>
      </div>
    </div>
  );
}

/*  Data (replace with  API response)  */
const sampleCompany = {
  name: "Skyline Digital",
  logoUrl: "", // e.g. "https://cdn.yoursite.com/logos/skyline.png"
  coverUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80",
  location: "Karachi, Pakistan",
  size: "180+ team members",
  since: "Since 2014",
  website: "skylinedigital.com",
  sector: "Product Design & Engineering",
  hq: "Suite 400, Karachi Lahore",
  employees: "180+ Employees",
  address: "Market Street, Suite 400, Karachi Lahore",
  totalOpenRoles: 142,
  // [CHANGE 14/15 START] new fields
  isVerified: true,
  ownership: "Private Limited",
  contactEmail: "hr@skylinedigital.com",
  contactPhone: "+92 300 7654321",
  // [CHANGE 14/15 END]
  about: [
    "Skyline Digital is a multidisciplinary digital experience studio building immersive product experiences for finance, ecommerce, and emerging technology brands. We combine research-led design with battle-tested engineering to launch products that scale across millions of global users.",
    "Our teams operate with a maker-first culture: weekly design critiques, shared ownership of product roadmaps, and dedicated space to iterate rapidly so we can keep pushing what digital experiences can be.",
  ],
  recruiter: {
    name: "Ahmed Ali",
    role: "Lead Technical Recruiter",
    email: "ahmed@skylinedigital.com",
    phone: "+92 300 1234567",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
};

const sampleJobs = [
  { id: 1, title: "Frontend Developer", salary: "$80k - $100k/yr", level: "Mid-Senior", posted: "1d ago", location: "Remote • USA",
    badges: [{ label: "Urgent", tone: "red" }, { label: "Full time", tone: "slate" }, { label: "Remote", tone: "green" }] },
  { id: 2, title: "Digital Marketing Intern", salary: "PKR 25k - 40k/mo", level: "Entry Level", posted: "1d ago", location: "Karachi, PK",
    badges: [{ label: "Urgent", tone: "red" }, { label: "Internship", tone: "slate" }, { label: "On-site", tone: "blue" }] },
  { id: 3, title: "UI/UX Product Designer", salary: "PKR 150k - 200k/mo", level: "Mid Level", posted: "2d ago", location: "Lahore, PK",
    badges: [{ label: "Featured", tone: "amber" }, { label: "Full time", tone: "slate" }, { label: "On-site", tone: "blue" }] },
  { id: 4, title: "Web Development Intern", salary: "PKR 30k - 45k/mo", level: "Entry Level", posted: "2d ago", location: "Remote • Pakistan",
    badges: [{ label: "New", tone: "blue" }, { label: "Internship", tone: "slate" }, { label: "Remote", tone: "green" }] },
];

/*  Turns the saved form values from the dashboard into the shape this page renders */
export const buildCompanyProfile = (c = {}, e = {}, isVerified = false) => ({
  name: c.companyName || "Your Company",
  category: c.industry || "",
  logoUrl: c.logo || "",
  coverUrl: c.cover || "",
  location: c.location || "",
  size: c.size || "",
  employees: c.size || "",
  since: c.establishedDate ? `Since ${c.establishedDate.slice(0, 4)}` : "",
  website: (c.website || "").replace(/^https?:\/\//i, "").replace(/\/$/, ""),
  sector: c.industry || "",
  ownership: c.ownership || "",
  hq: c.location || "",
  address: c.address || "",
  contactEmail: c.contactEmail || "",
  contactPhone: c.contactPhone || "",
  isVerified,
  about: (c.bio || "").split(/\n+/).filter(Boolean),
  recruiter: {
    name: e.fullName || "Hiring Manager",
    role: e.jobTitle || "Employer",
    email: e.email || "",
    phone: e.phone || "",
    avatar: e.photo || "",
  },
});
const Pill = ({ icon: Icon, children }) => (
  <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-stone-200 bg-cream px-3 py-1">
    <Icon className="text-brand-500 text-xs" />
    <span>{children}</span>
  </span>
);

const SnapshotRow = ({ icon: Icon, label, children, first }) => (
  <div className={`${first ? "pt-1" : "pt-3"} flex items-start space-x-3`}>
    <Icon className="text-brand-500 mt-0.5 text-sm w-4 shrink-0" />
    <div className="space-y-0.5">
      <span className="font-bold text-slate-900 block">{label}</span>
      {children}
    </div>
  </div>
);

const Val = ({ children }) => <span className="text-slate-600 font-medium">{children}</span>; 

/* Hero: cover + diamond logo + info */
function CompanyHero({ company, onViewJobs }) {
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <section className="bg-white rounded-3xl border border-stone-200 shadow-sm">
      {/* Cover + diamond logo */}
      <div className="relative">
        <div className="relative h-36 sm:h-44 md:h-52 rounded-t-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-brand-800 to-brand-500">
          {company.coverUrl && !coverFailed && (
            <img src={company.coverUrl} alt="" onError={() => setCoverFailed(true)} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-10 w-28 h-28 flex items-center justify-center">
          <div className="absolute w-20 h-20 sm:w-[88px] sm:h-[88px] rotate-45 rounded-2xl bg-stone-50 border border-stone-200 shadow-md" />
          <CompanyLogo logoUrl={company.logoUrl} name={company.name} className="relative w-14 h-14 sm:w-16 sm:h-16 !rounded-full" />
        </div>
      </div>
      <div className="px-6 md:px-10 pt-16 md:pt-7 pb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-center md:text-left">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-nowrap items-center justify-center gap-2 md:justify-start">
           
            {/*badge only when the company is verified */}
             {company.name && (
              <h1 className="min-w-0 truncate text-xl font-black uppercase tracking-wider">{company.name}</h1>
            )}
            {company.isVerified && (
              <span
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-800"
                title="Legal verification approved by CareerFlux Admin"
              >
                <FaCircleCheck className="text-emerald-600" /> Verified Company
              </span>
            )}
           
          </div>
          <div className="flex flex-nowrap items-center justify-center gap-2 overflow-x-auto pt-1 text-xs font-medium text-slate-600 md:justify-start">
            {company.location && <Pill icon={FaLocationDot}>{company.location}</Pill>}
            {company.size && <Pill icon={FaUsers}>{company.size}</Pill>}
            {company.since && <Pill icon={FaCalendarDays}>{company.since}</Pill>}
          </div>
        </div>

        <button
          onClick={onViewJobs}
          className="self-center px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl transition shadow-sm inline-flex items-center gap-2"
        >
          <FaBriefcase /> View Open Roles
        </button>
      </div>
    </section>
  );
}
export default function CompanyProfile({ company = sampleCompany, jobs = sampleJobs, onViewJob, onBack }) { // [CHANGE 16]
  const jobsRef = useRef(null);

  return (
    <div className="space-y-6 text-slate-900">
      <CompanyHero company={company} onViewJobs={() => jobsRef.current?.scrollIntoView({ behavior: "smooth" })} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-xl font-black tracking-tight">Who We Are</h2>
            {company.about.map((p, i) => (
              <p key={i} className="text-xs md:text-sm text-slate-600 leading-relaxed">{p}</p>
            ))}
          </div>

          <div ref={jobsRef} className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6 scroll-mt-24">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black">Latest Job Openings</h3>
              <span className="inline-flex items-center whitespace-nowrap text-[11px] font-bold text-emerald-600">
                <span className="relative me-1.5 flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50 motion-reduce:animate-none" />
                  <FaCircle className="relative h-2 w-2 text-emerald-500" />
                </span>
                Showing {jobs.length} of {company.totalOpenRoles ?? jobs.length} open roles
              </span>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} company={company} onView={onViewJob} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: sticky */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Employer Contact</h4>
            <div className="flex items-center space-x-3.5">
              {company.recruiter.avatar ? (
                <img src={company.recruiter.avatar} alt={company.recruiter.name} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-brand-50" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center ring-4 ring-brand-50"><FaUser className="text-brand-400 text-xl" /></div>
              )}
              <div>
                <h5 className="text-base font-bold">{company.recruiter.name}</h5>
                <p className="text-xs font-bold text-brand-500">{company.recruiter.role}</p>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-3 bg-cream rounded-xl border border-slate-100 flex items-center space-x-2.5">
                <FaEnvelope className="text-brand-500" />
                <div className="truncate">
                  <span className="text-[10px] font-bold text-slate-400 block">Work Email</span>
                  <a href={`mailto:${company.recruiter.email}`} className="font-bold text-slate-800 hover:text-brand-500 truncate">{company.recruiter.email}</a>
                </div>
              </div>
              <div className="p-3 bg-cream rounded-xl border border-slate-100 flex items-center space-x-2.5">
                <FaPhone className="text-brand-500" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Direct Phone No</span>
                  <span className="font-bold text-slate-800">{company.recruiter.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-sm font-black">Company Snapshot</h4>
            <div className="divide-y divide-slate-100 text-xs space-y-3">
               <SnapshotRow icon={FaCalendar} label="Member Since / Established"><Val>{company.since}</Val></SnapshotRow>
              <SnapshotRow icon={FaIndustry} label="Industry Sector"><Val>{company.sector}</Val></SnapshotRow>
              <SnapshotRow icon={FaLandmark} label="Ownership Type"><Val>{company.ownership}</Val></SnapshotRow>
               <SnapshotRow icon={FaUsers} label="Company Size"><Val>{company.employees}</Val></SnapshotRow>
              <SnapshotRow icon={FaLocationDot} label="Location"><Val>{company.hq}</Val></SnapshotRow> 
              <SnapshotRow icon={FaBuilding} label="Offices Address"><Val>{company.address || "Not provided"}</Val></SnapshotRow>
               <SnapshotRow first icon={FaGlobe} label="Website">
                {company.website
                  ? <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-brand-500 font-bold hover:underline">{company.website}</a>
                  : <Val>Not provided</Val>}
              </SnapshotRow>
              <SnapshotRow icon={FaEnvelope} label="Company Contact Email">
                <a href={`mailto:${company.contactEmail}`} className="text-brand-500 font-bold hover:underline break-all">{company.contactEmail}</a>
              </SnapshotRow>
               <SnapshotRow icon={FaPhone} label="Company Phone Number"><Val>{company.contactPhone}</Val></SnapshotRow>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}