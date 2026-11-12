import { useMemo, useState } from "react";
import { FileSearch, Search } from "lucide-react";
import ApplicantCard from "../components/ApplicantCard";
import Dropdown from "../components/Dropdown";

const STATUS_TABS = ["All", "New", "Shortlisted", "Accepted", "Rejected"];

// "02 April, 2026" -> timestamp (0 if the date can't be read)
const toTime = (value) => {
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
};

/**
 * Props
 *  - applicants: array of applicants (same shape the dashboard already uses)
 *  - onStatusChange(applicant, newStatus): same handler the dashboard passes to ApplicantCard
 */
export default function AllApplications({ applicants = [], onStatusChange }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [job, setJob] = useState("All");
  const [sort, setSort] = useState("newest");

  const jobs = useMemo(
    () => [...new Set(applicants.map((a) => a.job))].sort(),
    [applicants]
  );

  const counts = useMemo(() => {
    const result = { All: applicants.length };
    STATUS_TABS.slice(1).forEach((s) => {
      result[s] = applicants.filter((a) => a.status === s).length;
    });
    return result;
  }, [applicants]);

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();

    return applicants
      .filter((a) => {
        const matchesQuery =
          !q ||
          a.name.toLowerCase().includes(q) ||
          a.job.toLowerCase().includes(q) ||
          a.university.toLowerCase().includes(q);
        const matchesStatus = status === "All" || a.status === status;
        const matchesJob = job === "All" || a.job === job;
        return matchesQuery && matchesStatus && matchesJob;
      })
      .sort((a, b) =>
        sort === "newest"
          ? toTime(b.appliedOn) - toTime(a.appliedOn)
          : toTime(a.appliedOn) - toTime(b.appliedOn)
      );
  }, [applicants, query, status, job, sort]);

  const resetFilters = () => {
    setQuery("");
    setStatus("All");
    setJob("All");
  };

  return (
    <div className="space-y-6">
      {/* Title on the left */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">All Applications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review everyone who applied to your jobs and update their status.
        </p>
      </div>
        <div
          role="tablist"
          aria-label="Filter applications by status"
          className="flex flex-wrap gap-2"
        >
          {STATUS_TABS.map((tab) => {
            const active = status === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatus(tab)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                  active
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-stone-200 bg-white text-slate-600 hover:border-brand-500/40 hover:text-brand-600"
                }`}
              >
                {tab}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    active ? "bg-white/20 text-white" : "bg-brand-50 text-brand-700"
                  }`}
                >
                  {counts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + filters */}
        <div className="flex w-full flex-col items-center justify-center gap-3 border-t border-stone-100 pt-5 md:flex-row">
          <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
            <div className="flex flex-1 items-center rounded-xl border border-stone-200 bg-cream px-4 py-2.5 transition focus-within:border-brand-500 focus-within:bg-white">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, job or university..."
                aria-label="Search applications"
                className="w-full  bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white"
            >
              <Search size={16} />
            </span>
          </div>

          <div className="w-full rounded-2xl border border-stone-200 bg-white p-2 shadow-sm sm:w-auto">
            <Dropdown
              id="job-filter"
              ariaLabel="Filter by job"
              value={job}
              onChange={setJob}
              variant="compact"
              className="bg-transparent"
              options={[
                { value: "All", label: "All jobs" },
                ...jobs.map((jobTitle) => ({
                  value: jobTitle,
                  label: jobTitle,
                })),
                
              ]}
            />
          </div>
        </div>

        {/* Result count + reset */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500">
            Showing {visible.length} of {applicants.length} applications
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-bold text-brand-500 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      <section className="space-y-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-soft sm:p-6">
        {/* Status tabs */}
       

        {/* Applications */}
        {visible.length === 0 ? (
          <div className="space-y-2 rounded-2xl   px-6 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <FileSearch size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No applications found</h3>
            <p className="text-xs text-slate-500">
              {applicants.length === 0
                ? "Applications will appear here once candidates apply to your jobs."
                : "Try a different search or clear the filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}