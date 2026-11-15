import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Send, X } from "lucide-react";

const OPEN_JOBS = [
  "Frontend Developer (TypeScript)",
  "MERN Stack Engineer",
  "UI/UX Product Designer",
];

const DEFAULT_NOTE =
  "We reviewed your profile on CareerFlux and found a strong match with our team requirements. We invite you to apply!";

export default function CandidateInvitationModal({ candidate, onClose, onSend }) {
  const [job, setJob] = useState(OPEN_JOBS[0]);
  const [deadline, setDeadline] = useState("2026-11-20");
  const [note, setNote] = useState(DEFAULT_NOTE);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const fieldClass =
    "w-full rounded-xl border border-stone-200 bg-cream px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md space-y-4 rounded-2xl border border-stone-200 bg-white p-6 opacity-100 shadow-floating"
      >
        <div className="flex items-start justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <Send size={16} />
            </div>
            <div>
              <h3 id="invite-title" className="text-sm font-bold text-slate-900">
                Send Job Invitation
              </h3>
              <p className="text-[11px] text-slate-400">
                Direct candidate notification via platform &amp; email
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 transition hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1 rounded-xl border border-stone-200 bg-cream p-3">
            <div className="flex justify-between gap-3">
              <span className="font-bold text-slate-400">Candidate:</span>
              <span className="font-bold text-slate-900">{candidate.name}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-bold text-slate-400">Work Email:</span>
              <span className="truncate font-bold text-brand-500">
                {candidate.email}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-slate-700">
              Select Open Job Listing
            </label>
            <select
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className={fieldClass}
            >
              {OPEN_JOBS.map((openJob) => (
                <option key={openJob} value={openJob}>
                  {openJob}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-bold text-slate-700">
              Response Deadline Date
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="mb-1 block font-bold text-slate-700">
              Custom Invitation Note
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${fieldClass} font-medium`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-stone-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-stone-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-stone-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSend({ candidate, job, deadline, note })}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2 text-xs font-bold text-white transition hover:bg-brand-600"
          >
            <Send size={13} />
            Send Invitation
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}