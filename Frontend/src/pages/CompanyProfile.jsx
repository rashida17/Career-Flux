import { useEffect, useRef, useState } from "react";
import { getPublicCompany } from "../api/profile";
import {
  FaLocationDot,
  FaUsers,
  FaCircle,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaIndustry,
  FaCalendar,
  FaBuilding,
  FaLandmark,
  FaUser, 
} from "react-icons/fa6";
import CompanyProfileHero from "../components/CompanyProfileHero";
import JobCard from "../components/JobCard";

/*  Data (replace with  API response)  */
const SnapshotRow = ({ icon: Icon, label, children, first }) => (
  <div className={`${first ? "pt-1" : "pt-3"} flex items-start space-x-3`}>
    <Icon className="text-brand-500 mt-0.5 text-sm w-4 shrink-0" />
    <div className="space-y-0.5">
      <span className="font-bold text-slate-900 block">{label}</span>
      {children}
    </div>
  </div>
);

const Val = ({ children }) => (
  <span className="text-slate-600 font-medium">{children}</span>
);

export default function CompanyProfile({ companyId, onViewJob }) {
  const jobsRef = useRef(null);
  const [state, setState] = useState({ loading: true, error: "", company: null, jobs: [] });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    getPublicCompany(companyId)
      .then((d) => alive && setState({ loading: false, error: "", company: d.company, jobs: d.jobs }))
      .catch((e) => alive && setState({ loading: false, error: e.message, company: null, jobs: [] }));
    return () => { alive = false; };
  }, [companyId]);

  if (state.loading) return <p className="py-20 text-center text-sm text-slate-500">Loading company profile...</p>;
  if (state.error) return <p className="py-20 text-center text-sm font-semibold text-brand-700">{state.error}</p>;

  const { company, jobs } = state;

  return (
    <div className="space-y-6 text-slate-900">
      <CompanyProfileHero
        company={company}
        onViewJobs={() =>
          jobsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-xl font-black tracking-tight">Who We Are</h2>
            {company.about.map((p, i) => (
              <p
                key={i}
                className="text-xs md:text-sm text-slate-600 leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>

          <div
            ref={jobsRef}
            // className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm space-y-6 scroll-mt-24"
            className="space-y-6 scroll-mt-24"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black">Latest Job Openings</h3>
              <span className="inline-flex items-center whitespace-nowrap text-[11px] font-bold text-emerald-600">
                <span
                  className="relative me-1.5 flex h-2 w-2"
                  aria-hidden="true"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50 motion-reduce:animate-none" />
                  <FaCircle className="relative h-2 w-2 text-emerald-500" />
                </span>
                Showing {jobs.length} of {company.totalOpenRoles ?? jobs.length}{" "}
                open roles
              </span>
            </div>

            <div 
            // className="grid grid-cols-1 sm:grid-cols-2 gap-4"
           className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),280px))] justify-center gap-4">
            
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  company={company}
                  onView={onViewJob}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: sticky */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Employer Contact
            </h4>
            <div className="flex items-center space-x-3.5">
              {company.recruiter.avatar ? (
                <img
                  src={company.recruiter.avatar}
                  alt={company.recruiter.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-4 ring-brand-50"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center ring-4 ring-brand-50">
                  <FaUser className="text-brand-400 text-xl" />
                </div>
              )}
              <div>
                <h5 className="text-base font-bold">
                  {company.recruiter.name}
                </h5>
                <p className="text-xs font-bold text-brand-500">
                  {company.recruiter.role}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-3 bg-cream rounded-xl border border-slate-100 flex items-center space-x-2.5">
                <FaEnvelope className="text-brand-500" />
                <div className="truncate">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    Work Email
                  </span>
                  <a
                    href={`mailto:${company.recruiter.email}`}
                    className="font-bold text-slate-800 hover:text-brand-500 truncate"
                  >
                    {company.recruiter.email}
                  </a>
                </div>
              </div>
              <div className="p-3 bg-cream rounded-xl border border-slate-100 flex items-center space-x-2.5">
                <FaPhone className="text-brand-500" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">
                    Direct Phone No
                  </span>
                  <span className="font-bold text-slate-800">
                    {company.recruiter.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-sm font-black">Company Snapshot</h4>
            <div className="divide-y divide-slate-100 text-xs space-y-3">
              <SnapshotRow icon={FaCalendar} label="Member Since / Established">
                <Val>{company.since}</Val>
              </SnapshotRow>
              <SnapshotRow icon={FaIndustry} label="Industry Sector">
                <Val>{company.sector}</Val>
              </SnapshotRow>
              <SnapshotRow icon={FaLandmark} label="Ownership Type">
                <Val>{company.ownership}</Val>
              </SnapshotRow>
              <SnapshotRow icon={FaUsers} label="Company Size">
                <Val>{company.employees}</Val>
              </SnapshotRow>
              <SnapshotRow icon={FaLocationDot} label="Location">
                <Val>{company.hq}</Val>
              </SnapshotRow>
              <SnapshotRow icon={FaBuilding} label="Offices Address">
                <Val>{company.address || "Not provided"}</Val>
              </SnapshotRow>
              <SnapshotRow first icon={FaGlobe} label="Website">
                {company.website ? (
                  <a
                    href={`https://${company.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-500 font-bold hover:underline"
                  >
                    {company.website}
                  </a>
                ) : (
                  <Val>Not provided</Val>
                )}
              </SnapshotRow>
              <SnapshotRow icon={FaEnvelope} label="Company Contact Email">
                <a
                  href={`mailto:${company.contactEmail}`}
                  className="text-brand-500 font-bold hover:underline break-all"
                >
                  {company.contactEmail}
                </a>
              </SnapshotRow>
              <SnapshotRow icon={FaPhone} label="Company Phone Number">
                <Val>{company.contactPhone}</Val>
              </SnapshotRow>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
