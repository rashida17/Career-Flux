import { useState } from "react";
import {
  FaBriefcase,
  FaCalendarDays,
  FaCircleCheck,
  FaLocationDot,
  FaUsers,
} from "react-icons/fa6";

const SkylineMark = ({ className = "" }) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    role="img"
    aria-label="Skyline Digital logo"
  >
    <rect width="64" height="64" rx="14" className="fill-slate-900" />
    <rect
      x="12"
      y="34"
      width="8"
      height="18"
      rx="1.5"
      className="fill-brand-50"
      opacity=".55"
    />
    <rect
      x="23"
      y="24"
      width="8"
      height="28"
      rx="1.5"
      className="fill-brand-50"
      opacity=".8"
    />
    <rect
      x="34"
      y="16"
      width="8"
      height="36"
      rx="1.5"
      className="fill-brand-50"
    />
    <rect
      x="45"
      y="28"
      width="8"
      height="24"
      rx="1.5"
      className="fill-brand-500"
    />
    <rect
      x="10"
      y="52"
      width="44"
      height="3"
      rx="1.5"
      className="fill-brand-500"
    />
  </svg>
);

export function CompanyLogo({
  logoUrl,
  name = "Company",
  className = "w-10 h-10",
}) {
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

const Pill = ({ icon: Icon, children }) => (
  <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-stone-200 bg-cream px-3 py-1">
    <Icon className="text-brand-500 text-xs" />
    <span>{children}</span>
  </span>
);

export default function CompanyProfileHero({ company, onViewJobs }) {
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <section className="bg-white rounded-3xl border border-stone-200 shadow-sm">
      <div className="relative">
        <div className="relative h-36 sm:h-44 md:h-52 rounded-t-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-brand-800 to-brand-500">
          {company.coverUrl && !coverFailed && (
            <img
              src={company.coverUrl}
              alt=""
              onError={() => setCoverFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-10 w-28 h-28 flex items-center justify-center">
          <div className="absolute w-20 h-20 sm:w-[88px] sm:h-[88px] rotate-45 rounded-2xl bg-stone-50 border border-stone-200 shadow-md" />
          <CompanyLogo
            logoUrl={company.logoUrl}
            name={company.name}
            className="relative w-14 h-14 sm:w-16 sm:h-16 !rounded-full"
          />
        </div>
      </div>

      <div className="px-6 md:px-10 pt-16 md:pt-7 pb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-center md:text-left">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-nowrap items-center justify-center gap-2 md:justify-start">
            {company.name && (
              <h1 className="min-w-0 truncate text-xl font-black uppercase tracking-wider">
                {company.name}
              </h1>
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
            {company.location && (
              <Pill icon={FaLocationDot}>{company.location}</Pill>
            )}
            {company.size && <Pill icon={FaUsers}>{company.size}</Pill>}
            {company.since && (
              <Pill icon={FaCalendarDays}>{company.since}</Pill>
            )}
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
