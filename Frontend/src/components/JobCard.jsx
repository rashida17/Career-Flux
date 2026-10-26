import { useState } from 'react';
import { Heart, MapPin, ArrowRight } from 'lucide-react';

// Soft tints for the icon tiles. Each job picks one by its id.
const iconTints = [
  'bg-teal-50 text-teal-600 group-hover:bg-teal-100',
  'bg-sky-50 text-sky-600 group-hover:bg-sky-100',
  'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  'bg-brand-50 text-brand-600 group-hover:bg-brand-100',
  'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100',
];

const typeStyles = {
  'full-time': {
    label: 'Full time',
    chip: 'border-teal-100 bg-teal-50 text-teal-700',
    dot: 'bg-teal-500',
  },
  'part-time': {
    label: 'Part time',
    chip: 'border-sky-100 bg-sky-50 text-sky-700',
    dot: 'bg-sky-500',
  },
  internship: {
    label: 'Internship',
    chip: 'border-amber-100 bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
};

export default function JobCard({ job, onView }) {
  const [saved, setSaved] = useState(false);
  const Icon = job.icon;
  const type = typeStyles[job.type] || typeStyles['full-time'];
  const tint = iconTints[(job.id - 1) % iconTints.length];

  return (
    <article className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-md hover:shadow-brand-500/5">
      {/* Top: icon, title, company, save */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${tint}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-bold leading-snug text-slate-900">{job.title}</h3>
            <p className="mt-0.5 text-xs text-stone-500">{job.company}</p>
          </div>
        </div>

        <button
          type="button"
          aria-label={`Save ${job.title}`}
          aria-pressed={saved}
          onClick={() => setSaved((s) => !s)}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-brand-50 hover:text-brand-500 ${
            saved ? 'text-brand-500' : 'text-stone-400'
          }`}
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold ${type.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${type.dot}`} />
          {type.label}
        </span>

        {job.recent && (
          <span className="rounded-md border border-brand-100 bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700">
            New
          </span>
        )}
      </div>

      {/* Footer: location + small button */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <p className="flex min-w-0 items-center gap-1.5 text-xs text-stone-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-teal-500" />
          <span className="truncate">{job.location}</span>
        </p>

        <button
          type="button"
          onClick={() => onView(job.title)}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-brand-500 hover:text-white"
        >
          View
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}