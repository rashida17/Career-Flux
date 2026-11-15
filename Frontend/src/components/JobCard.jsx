import {
  ArrowRight,
  Banknote,
  Briefcase,
  Bookmark,
  Clock,
  MapPin,
} from "lucide-react";
import { CompanyLogo } from "./CompanyProfileHero";
import {
  formatPosted,
  formatSalary,
  getStatusBadge,
  TYPE_LABELS,
} from "../data/jobs";

const badgeStyles = {
  red: "border-brand-200 bg-brand-50 text-brand-700",
  amber: "border-brand-200 bg-brand-100 text-brand-800",
  blue: "border-brand-200 bg-brand-50 text-brand-700",
  slate: "border-stone-200 bg-stone-50 text-slate-600",
  green: "border-brand-200 bg-brand-100 text-brand-800",
};

export default function JobCard({
  job,
  company,
  isSaved = false,
  onToggleSave,
  onView,
}) {
  const companyInfo = company ?? {
    name: job.company,
    logoUrl: job.logoUrl,
  };
  const badges = job.badges ?? [
    ...(getStatusBadge(job)
      ? [
          {
            label: getStatusBadge(job),
            tone: job.urgent ? "amber" : "blue",
          },
        ]
      : []),
    ...(TYPE_LABELS[job.type]
      ? [{ label: TYPE_LABELS[job.type], tone: "slate" }]
      : []),
    ...(job.workMode ? [{ label: job.workMode, tone: "blue" }] : []),
  ];
  const salaryLabel =
    job.salary && typeof job.salary === "object"
      ? formatSalary(job.salary)
      : job.salary;
  const postedLabel =
    job.posted ??
    (job.postedDaysAgo != null ? formatPosted(job.postedDaysAgo) : "Recently");

  return (
    <div className="group flex h-full min-h-[232px] w-full min-w-0 cursor-pointer flex-col justify-between space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-brand-500/40 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-100">
      <div className="space-y-3">
        <div className="flex min-w-0 items-center space-x-3">
          <CompanyLogo
            logoUrl={companyInfo.logoUrl}
            name={companyInfo.name}
            className="h-11 w-11 rounded-xl border border-brand-100"
          />
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-slate-900 transition group-hover:text-brand-500">
              {job.title}
            </h4>
            <p className="truncate text-[11px] text-slate-400">
              {companyInfo.name}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${
                badgeStyles[badge.tone] ?? badgeStyles.slate
              }`}
            >
              {badge.label}
            </span>
          ))}
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1 font-black text-slate-900">
            <Banknote size={14} className="text-brand-500" />
            <span>{salaryLabel}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Briefcase size={12} className="text-slate-400" />
              {job.level ?? job.experience}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              {postedLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
          <MapPin size={12} className="text-brand-500" />
          {job.location}
        </span>
        <div className="flex items-center gap-1.5">
          {onToggleSave && (
            <button
              type="button"
              aria-label={isSaved ? "Remove saved job" : "Save job"}
              aria-pressed={isSaved}
              onClick={(e) => { e.stopPropagation(); onToggleSave(job.id); }}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Bookmark
                size={15}
                className={isSaved ? "fill-brand-500 text-brand-500" : ""}
              />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onView?.(job); }}
            className="inline-flex items-center gap-1 rounded-xl bg-brand-500 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-600"
          >
            <span>View</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
