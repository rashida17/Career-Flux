import { useMemo } from 'react';
import { ArrowRight, SearchX } from 'lucide-react';
import JobCard from './JobCard';
import { jobsData, categoryKeywords } from '../data/jobs';

const activeTabClass =
  'rounded-md bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-100 transition';
const inactiveTabClass =
  'rounded-md px-4 py-1.5 text-sm font-semibold text-stone-500 transition hover:text-slate-900';

export default function FeaturedJobs({ activeTab, onTabChange, search, onClear }) {
  const visibleJobs = useMemo(() => {
    const base = activeTab === 'recent' ? jobsData.filter((j) => j.recent) : jobsData;

    return base.filter((job) => {
      const text = `${job.title} ${job.company} ${job.location} ${job.badge}`.toLowerCase();

      const matchesQuery = !search.query || text.includes(search.query.toLowerCase());

      const keywords = categoryKeywords[search.category] || [];
      const matchesCategory = !search.category || keywords.some((k) => text.includes(k));

      const matchesLocation =
        !search.location || job.location.toLowerCase().includes(search.location.toLowerCase());

      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [activeTab, search]);

  const handleView = (title) => {
    alert(
      `You selected: ${title}\n\nConnect this action to your CareerFlux job details and application page.`
    );
  };

  return (
    <section id="jobs" className="border-b border-stone-200 bg-cream py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading row: title on the left, tabs on the right */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Featured opportunities
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
              Roles where your skills can make a difference.
            </p>
          </div>

          <div className="inline-flex w-fit gap-1 rounded-lg border border-stone-200 bg-white p-1">
            <button
              type="button"
              onClick={() => onTabChange('latest')}
              className={activeTab === 'latest' ? activeTabClass : inactiveTabClass}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => onTabChange('recent')}
              className={activeTab === 'recent' ? activeTabClass : inactiveTabClass}
            >
              Recent
            </button>
          </div>
        </div>

        {/* Result count */}
        <p className="mb-4 flex items-center gap-2 text-xs font-medium text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          Showing {visibleJobs.length} {visibleJobs.length === 1 ? 'job' : 'jobs'}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleJobs.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <SearchX className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-900">No matching jobs found</h3>
              <p className="mt-1 text-sm text-stone-500">Try a different title, location or category.</p>
              <button
                type="button"
                onClick={onClear}
                className="mt-5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
              >
                Clear filters
              </button>
            </div>
          ) : (
            visibleJobs.map((job) => <JobCard key={job.id} job={job} onView={handleView} />)
          )}
        </div>

        {/* Browse all */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => alert('Connect this button to your complete jobs listing page.')}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-600"
          >
            Browse all jobs
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}