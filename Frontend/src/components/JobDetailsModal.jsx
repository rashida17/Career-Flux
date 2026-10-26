import { useEffect, useRef, useState } from 'react';
import { X, Heart, MapPin, Banknote, Briefcase, Clock, Check, Flag } from 'lucide-react';
import LogoAvatar from './LogoAvatar';
import { TYPE_LABELS, formatSalary, formatPosted, getStatusBadge } from '../data/jobs';

const statusBadgeClass =
  'inline-flex items-center whitespace-nowrap rounded-full border border-brand-200/60 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700';
const neutralBadgeClass =
  'inline-flex items-center whitespace-nowrap rounded-full border border-transparent bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700';

const iconButtonClass =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-brand-500';

export default function JobDetailsModal({ job, isSaved, onToggleSave, onApply, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const toastTimerRef = useRef(null);

  const [toast, setToast] = useState('');
  const [reported, setReported] = useState(false);

  // Always call the latest onClose without re-running the effect below
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden'; // lock page scroll behind the window
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      // Keep Tab focus inside the window
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll('button:not([disabled])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(toastTimerRef.current);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.(); // return focus to the card the user opened
    };
  }, []);

  // Small confirmation message that hides itself after 2.5 seconds
  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(''), 2500);
  };

  

  const handleReport = () => {
    if (reported) return;
    setReported(true);
    showToast('Thanks, we will review this job');
  };

  const statusBadge = getStatusBadge(job);

  const infoItems = [
    { icon: Banknote, label: 'Salary', value: formatSalary(job.salary) },
    { icon: MapPin, label: 'Location', value: job.location },
    { icon: Briefcase, label: 'Experience', value: job.experience },
    { icon: Clock, label: 'Posted', value: formatPosted(job.postedDaysAgo) },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop: click to close */}
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />

      {/* Window: a bottom sheet on phones, a centered card on larger screens */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-modal-title"
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-stone-100 p-5 sm:p-6">
          <LogoAvatar job={job} size="lg" />

          <div className="min-w-0 flex-1">
            <h2
              id="job-modal-title"
              className="text-lg font-extrabold leading-snug text-slate-900 sm:text-xl"
            >
              {job.title}
            </h2>
            <p className="mt-0.5 text-sm text-stone-500">{job.company}</p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {statusBadge && <span className={statusBadgeClass}>{statusBadge}</span>}
              <span className={neutralBadgeClass}>{TYPE_LABELS[job.type]}</span>
              <span className={neutralBadgeClass}>{job.workMode}</span>
            </div>
          </div>

          {/* Share, Report and Close */}
          <div className="flex shrink-0 items-center gap-0.5">
            {/*<button
              type="button"
              onClick={handleShare}
              aria-label="Copy link to this job"
              title="Share"
              className={iconButtonClass}
            >
              <Share2 className="h-[18px] w-[18px]" />
            </button> */}

            <button
              type="button"
              onClick={handleReport}
              disabled={reported}
              aria-label={reported ? 'Job reported' : 'Report this job'}
              title={reported ? 'Reported' : 'Report'}
              className={`${iconButtonClass} disabled:cursor-default disabled:hover:bg-transparent ${
                reported ? 'text-brand-500 hover:text-brand-500' : ''
              }`}
            >
              <Flag className={`h-[18px] w-[18px] ${reported ? 'fill-brand-500' : ''}`} />
            </button>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close job details"
              title="Close"
              className={iconButtonClass}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* Key facts */}
          <dl className="grid grid-cols-2 gap-3">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-stone-50 p-3">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>

          {/* About the role */}
          <section className="mt-6">
            <h3 className="text-sm font-bold text-slate-900">About the role</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{job.about}</p>
          </section>

          {/* Requirements */}
          <section className="mt-6">
            <h3 className="text-sm font-bold text-slate-900">Requirements</h3>
            <ul className="mt-3 space-y-2.5">
              {job.requirements.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-stone-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Skills */}
          <section className="mt-6">
            <h3 className="text-sm font-bold text-slate-900">Skills</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3 border-t border-stone-100 bg-white p-4 sm:px-6">
          <button
            type="button"
            aria-pressed={isSaved}
            onClick={() => onToggleSave(job.id)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Heart
              className={`h-4 w-4 ${isSaved ? 'fill-brand-500 text-brand-500' : 'text-slate-500'}`}
            />
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <button
            type="button"
            onClick={() => onApply(job)}
            className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Apply now
          </button>
        </div>

        {/* Confirmation message for Share and Report. aria-live reads it aloud. */}
        <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center px-4">
          {toast && (
            <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg">
              {toast}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}