import { useState } from 'react';
import { getInitials } from '../data/jobs';

// Soft colors for the initials avatar, picked by job id
const avatarTints = [
  'bg-teal-50 text-teal-700',
  'bg-sky-50 text-sky-700',
  'bg-amber-50 text-amber-700',
  'bg-brand-50 text-brand-700',
  'bg-indigo-50 text-indigo-600',
];

// logoUrl first, then unavatar.io from the website. fallback=false makes
// unavatar return an error (instead of a generic image), so onError can fire.
const getLogoSrc = (job) => {
  if (job.logoUrl) return job.logoUrl;
  if (job.companyWebsite) return `https://unavatar.io/${job.companyWebsite}?fallback=false`;
  return null;
};

// Logo and initials fallback share the same rounded square
export default function LogoAvatar({ job, size = 'md' }) {
  const [imageError, setImageError] = useState(false);
  const src = getLogoSrc(job);
  const sizeClass = size === 'lg' ? 'h-14 w-14 text-base' : 'h-10 w-10 text-xs';

  if (!src || imageError) {
    return (
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-xl font-bold ${sizeClass} ${
          avatarTints[(job.id - 1) % avatarTints.length]
        }`}
      >
        {getInitials(job.company)}
      </span>
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white p-1 shadow-sm ${sizeClass}`}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setImageError(true)}
        className="h-full w-full object-contain"
      />
    </span>
  );
}