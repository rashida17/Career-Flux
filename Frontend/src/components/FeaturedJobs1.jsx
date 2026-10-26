import { useCallback, useMemo, useState } from 'react';
import { ArrowRight, SearchX, Laptop, Zap, GraduationCap, Banknote, ChevronDown } from 'lucide-react';
import JobCard from './JobCard1';
import JobDetailsModal from './JobDetailsModal';
import {
  jobsData,
  categoryKeywords,
  TYPE_LABELS,
  TOTAL_OPEN_ROLES,
  HIGH_SALARY_MONTHLY_PKR,
  maxMonthlyPKR,
} from '../data/jobs';

// Quick-filter chips. Each has an optional Lucide icon and a test for one job.
const QUICK_FILTERS = [
  { label: 'All Jobs', icon: null, test: () => true },
  { label: 'Remote', icon: Laptop, test: (job) => job.workMode === 'Remote' },
  { label: 'Urgent Hiring', icon: Zap, test: (job) => Boolean(job.urgent) },
  { label: 'Internships', icon: GraduationCap, test: (job) => job.type === 'internship' },
  { label: 'High Salary', icon: Banknote, test: (job) => maxMonthlyPKR(job) >= HIGH_SALARY_MONTHLY_PKR },
];

// "Newest" is the default, because "Most Relevant" means little without a search.
const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest' },
  { key: 'relevant', label: 'Most Relevant' },
  { key: 'paid', label: 'Highest Paid' },
  { key: 'paidLow', label: 'Salary: Low to High' },
];

const chipBase =
  'inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream';
const activeChipClass = `${chipBase} bg-brand-500 text-white shadow-sm`;
const inactiveChipClass = `${chipBase} border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100`;

// Base relevance, boosted when the search text matches the title or company.
const scoreJob = (job, query) => {
  const q = query.toLowerCase();
  let score = job.relevance;
  if (q && job.title.toLowerCase().includes(q)) score += 100;
  else if (q && job.company.toLowerCase().includes(q)) score += 50;
  return score;
};

const sorters = {
  newest: () => (a, b) => a.postedDaysAgo - b.postedDaysAgo,
  relevant: (query) => (a, b) => scoreJob(b, query) - scoreJob(a, query),
  paid: () => (a, b) => maxMonthlyPKR(b) - maxMonthlyPKR(a),
  paidLow: () => (a, b) => maxMonthlyPKR(a) - maxMonthlyPKR(b),
};

export default function FeaturedJobs({ search, onClear }) {
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilter, setActiveFilter] = useState('All Jobs');
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // job shown in the details window

  const toggleSaved = (id) => {
    setSavedJobs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleClear = () => {
    setActiveFilter('All Jobs');
    onClear();
  };

  const openJob = (job) => setSelectedJob(job);
  const closeJob = useCallback(() => setSelectedJob(null), []);

  const handleApply = (job) => {
    alert(`Apply for: ${job.title}\n\nConnect this button to your application form or login page.`);
  };

  const visibleJobs = useMemo(() => {
    const chip = QUICK_FILTERS.find((f) => f.label === activeFilter) || QUICK_FILTERS[0];

    const filtered = jobsData.filter((job) => {
      // Skills are not shown on the cards, but search still matches them
      const text =
        `${job.title} ${job.company} ${job.location} ${TYPE_LABELS[job.type]} ${job.workMode} ${job.skills.join(' ')}`.toLowerCase();

      const matchesQuery = !search.query || text.includes(search.query.toLowerCase());

      const keywords = categoryKeywords[search.category] || [];
      const matchesCategory = !search.category || keywords.some((k) => text.includes(k));

      const matchesLocation =
        !search.location || job.location.toLowerCase().includes(search.location.toLowerCase());

      return matchesQuery && matchesCategory && matchesLocation && chip.test(job);
    });

    return [...filtered].sort(sorters[sortBy](search.query));
  }, [sortBy, activeFilter, search]);

  return (
    <section
      id="jobs"
      aria-labelledby="jobs-heading"
      className="border-b border-stone-200 bg-cream py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-6 flex gap-4">
          <span className="w-1 self-stretch rounded-full bg-brand-500" aria-hidden="true" />
          <div>
            <h2
              id="jobs-heading"
              className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
            >
              Latest jobs
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-stone-500">
              Fresh roles where your skills can make a difference.
            </p>
          </div>
        </div>

        {/* Controls row: filter chips on the left, sort dropdown on the right */}
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT: filters. Scrolls sideways on small screens instead of wrapping. */}
          <div
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible lg:pb-0"
            role="group"
            aria-label="Quick filters"
          >
            {QUICK_FILTERS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                aria-pressed={activeFilter === label}
                onClick={() => setActiveFilter(label)}
                className={activeFilter === label ? activeChipClass : inactiveChipClass}
              >
                {Icon && <Icon className="mr-1.5 h-4 w-4" />}
                {label}
              </button>
            ))}
          </div>

          {/* RIGHT: sort */}
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="sort-jobs" className="text-sm font-medium text-slate-500">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-jobs"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/30"
              >
                {SORT_OPTIONS.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Results counter. aria-live announces changes to screen readers. */}
        <p
          aria-live="polite"
          className="mb-4 flex items-center gap-2 text-xs font-medium text-stone-500"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
          Showing {visibleJobs.length} of {TOTAL_OPEN_ROLES} open roles
        </p>

        {/* Grid: a real list. Each <li> stretches so every card has equal height. */}
        {visibleJobs.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <SearchX className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-bold text-slate-900">No matching jobs found</h3>
            <p className="mt-1 text-sm text-stone-500">
              Try a different title, location, category or filter.
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="mt-5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleJobs.map((job) => (
              <li key={job.id} className="flex">
                <JobCard
                  job={job}
                  isSaved={savedJobs.includes(job.id)}
                  onToggleSave={toggleSaved}
                  onView={openJob}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Browse all */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => alert('Connect this button to your complete jobs listing page.')}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Browse all jobs
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Job details window */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isSaved={savedJobs.includes(selectedJob.id)}
          onToggleSave={toggleSaved}
          onApply={handleApply}
          onClose={closeJob}
        />
      )}
    </section>
  );
}