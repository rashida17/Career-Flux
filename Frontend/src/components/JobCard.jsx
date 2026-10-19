import { Heart, MapPin, ArrowRight, Banknote, Clock, Briefcase } from 'lucide-react';
import LogoAvatar from './LogoAvatar';
import { TYPE_LABELS, formatSalary, formatPosted, getStatusBadge } from '../data/jobs';

// Every badge has a 1px border (transparent on neutral ones) so all badges
// have the same height and rows line up across cards.
const statusBadgeClass =
  'inline-flex items-center whitespace-nowrap rounded-full border border-brand-200/60 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700';
const neutralBadgeClass =
  'inline-flex items-center whitespace-nowrap rounded-full border border-transparent bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700';

export default function JobCard({ job, isSaved, onToggleSave, onView }) {
  const statusBadge = getStatusBadge(job);

  return (
    <article
      className="group relative flex h-full w-full flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5
                 transition-all duration-300 ease-in-out
                 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/5 md:hover:-translate-y-1
                 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500/30
                 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Body grows so every footer lines up across the grid */}
      <div className="flex-grow">
        {/* Header: reserves two title lines so rows align across cards */}
        <div className="flex min-h-[3.75rem] items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <LogoAvatar job={job} />
            <div className="min-w-0">
              <h3 className="text-sm font-bold leading-snug text-slate-900">
                {/* Real link: keyboard focusable. The ::after layer stretches
                    it over the whole card, so the entire card is clickable. */}
                <a
                  href={`#job-${job.id}`}
                  onClick={(e) => {
                    e.preventDefault(); // remove when your job details page exists
                    onView(job);
                  }}
                  className="line-clamp-2 outline-none after:absolute after:inset-0 after:content-['']"
                >
                  {job.title}
                </a>
              </h3>
              <p className="mt-0.5 truncate text-xs text-stone-500">{job.company}</p>
            </div>
          </div>

          {/* z-10 keeps the heart clickable above the stretched link */}
          <button
            type="button"
            aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
            aria-pressed={isSaved}
            onClick={() => onToggleSave(job.id)}
            className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-125"
          >
            <Heart
              className={`h-4 w-4 transition-colors duration-200 ${
                isSaved ? 'fill-brand-500 text-brand-500' : 'text-slate-400 hover:text-brand-500'
              }`}
            />
          </button>
        </div>

        {/* Max 3 badges in ONE row: status, job type, work mode */}
        <div className="mt-3 flex flex-nowrap items-center gap-1.5 overflow-hidden">
          {statusBadge && <span className={statusBadgeClass}>{statusBadge}</span>}
          <span className={neutralBadgeClass}>{TYPE_LABELS[job.type]}</span>
          <span className={neutralBadgeClass}>{job.workMode}</span>
        </div>

        {/* Salary */}
        <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <Banknote className="h-4 w-4 shrink-0 text-teal-600" />
          {formatSalary(job.salary)}
        </p>

        {/* Experience and posting time, each with its own icon */}
        <div className="mt-3 flex items-center gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            {job.experience}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {formatPosted(job.postedDaysAgo)}
          </span>
        </div>
      </div>

      {/* Footer pinned to the bottom of every card */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <p className="flex min-w-0 items-center gap-1.5 text-xs text-stone-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-teal-500" />
          <span className="truncate">{job.location}</span>
        </p>

        {/* Visual cue only. The title link above is the real, accessible control. */}
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-brand-500 bg-white px-3 py-1.5 text-xs font-semibold text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white"
        >
          View
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </article>
  );
}