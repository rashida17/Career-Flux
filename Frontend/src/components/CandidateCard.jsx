import { useState } from "react";
import {
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";

const statusStyles = {
  none: {
    label: "Not Contacted",
    className: "bg-stone-100 text-slate-500 border-stone-200",
    icon: null,
  },
  pending: {
    label: "Invite Sent (Pending)",
    className: "bg-brand-100 text-brand-800 border-brand-200",
    icon: Clock,
  },
  accepted: {
    label: "Invite Accepted",
    className: "bg-brand-500 text-white border-brand-500",
    icon: CheckCircle2,
  },
  declined: {
    label: "Invite Declined",
    className: "bg-brand-900 text-brand-50 border-brand-900",
    icon: XCircle,
  },
};

function CandidateAvatar({ image, name, className = "h-11 w-11" }) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={name}
        onError={() => setFailed(true)}
        className={`${className} shrink-0 rounded-xl border border-brand-100 object-cover`}
      />
    );
  }

  return (
    <div
      aria-label={`${name} (no photo)`}
      className={`${className} flex shrink-0 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-500`}
    >
      <UserRound size={20} />
    </div>
  );
}

function StatusBadge({ status }) {
  const {
    label,
    className,
    icon: Icon,
  } = statusStyles[status] ?? statusStyles.none;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] font-bold ${className}`}
    >
      {Icon && <Icon size={12} />}
      {label}
    </span>
  );
}

export default function CandidateCard({
  candidate,
  requiredSkills = [],
  onOpen,
  onInvite,
}) {
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(candidate);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(candidate)}
      onKeyDown={handleKey}
      aria-label={`View profile of ${candidate.name}`}
      // className="group flex cursor-pointer flex-col justify-between space-y-4 
      // rounded-2xl border border-stone-200 bg-white p-5 shadow-sm outline-none 
      // transition hover:border-brand-500/40 focus-visible:border-brand-500 
      // focus-visible:ring-2 focus-visible:ring-brand-100"
      className="group flex h-full min-h-[232px] w-full cursor-pointer flex-col 
      justify-between space-y-4 rounded-2xl border border-stone-200 bg-white 
      p-5 shadow-sm outline-none transition hover:border-brand-500/40
       focus-visible:border-brand-500 focus-visible:ring-2
        focus-visible:ring-brand-100"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center space-x-3">
            <CandidateAvatar image={candidate.image} name={candidate.name} />
            <div className="min-w-0">
              <h4 className="truncate text-sm font-bold text-slate-900 transition group-hover:text-brand-500">
                {candidate.name}
              </h4>
              <p className="truncate text-[11px] text-slate-400">
                {candidate.role}
              </p>
            </div>
          </div>

          {candidate.aiMatchScore ? (
            <span className="shrink-0 rounded-lg border border-brand-200 bg-brand-100 px-2.5 py-0.5 text-[10px] font-bold text-brand-800">
              {candidate.aiMatchScore}% Match
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Briefcase size={12} className="text-slate-400" /> {candidate.exp}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-brand-500" /> {candidate.location}
          </span>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Skills
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {candidate.skills.map((skill) => {
              const isMatch = requiredSkills.some(
                (r) => r.toLowerCase() === skill.toLowerCase(),
              );
              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${
                    isMatch
                      ? "border-brand-200 bg-brand-50 text-brand-700"
                      : "border-stone-200 bg-stone-50 text-slate-600"
                  }`}
                >
                  {isMatch && <Check size={10} />} {skill}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <StatusBadge status={candidate.status} />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInvite(candidate);
          }}
          className="flex shrink-0 items-center space-x-1 rounded-xl bg-brand-500 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-600"
        >
          <Send size={12} />
          <span>Invite</span>
        </button>
      </div>
    </div>
  );
}
