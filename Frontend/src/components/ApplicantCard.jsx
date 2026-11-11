import { useEffect, useState } from "react";
import { CheckCircle2, GraduationCap } from "lucide-react";
import Dropdown from "./Dropdown";

export default function ApplicantCard({ applicant, onStatusChange }) {
  const isShortlisted = applicant.status === "Shortlisted";
  const isRejected = applicant.status === "Rejected";
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleStatusChange = (newStatus) => {
    onStatusChange(applicant, newStatus);
    setToast(`${applicant.name}'s application status changed to ${newStatus}.`);
  };

  return (
    <article className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 transition hover:border-brand-200">
      <div
        className="grid grid-cols-1 gap-4 
        lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)_auto] 
        lg:items-center lg:gap-5"
      >
        <div className="flex min-w-0 items-start gap-3">
          <img
            src={applicant.image}
            alt={applicant.name}
            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-2 ring-white"
          />

          <div className="min-w-0">
            <h3 className="break-words text-sm font-bold text-slate-900">
              {applicant.name}
            </h3>

            <p className="mt-1 flex items-start gap-1 text-xs leading-5 text-slate-500">
              <GraduationCap size={14} className="mt-0.5 shrink-0" />
              <span>{applicant.university}</span>
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Applied: {applicant.appliedOn}
            </p>
          </div>
        </div>

        <div className="min-w-0 lg:border-l lg:border-stone-200 lg:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Applied for
          </p>

          <p className="mt-1 break-words text-sm font-bold text-slate-800">
            {applicant.job}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Experience:{" "}
            <span className="font-semibold text-slate-700">
              {applicant.experience}
            </span>
          </p>
        </div>

        <div className="min-w-0 lg:border-l lg:border-stone-200 lg:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Expected salary
          </p>

          <p className="mt-1 break-words text-sm font-bold text-slate-800">
            {applicant.salary}
          </p>

          <div className="mt-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                isShortlisted
                  ? "bg-emerald-100 text-emerald-800"
                  : isRejected
                    ? "bg-rose-100 text-rose-800"
                    : "bg-brand-50 text-brand-700"
              }`}
            >
              {applicant.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-500">
            Application status
          </label>

          <Dropdown
            id={`status-${applicant.id ?? applicant.name}`}
            ariaLabel={`Application status for ${applicant.name}`}
            value={applicant.status}
            onChange={handleStatusChange}
            variant="compact"
            className="w-full"
            options={[
              { value: "New", label: "New" },
              { value: "Shortlisted", label: "Shortlist" },
              { value: "Accepted", label: "Accept" },
              { value: "Rejected", label: "Reject" },
            ]}
          />

          <span
            className={`text-xs font-medium ${
              applicant.status === "Accepted"
                ? "text-emerald-600"
                : applicant.status === "Rejected"
                  ? "text-red-600"
                  : applicant.status === "Shortlisted"
                    ? "text-brand-600"
                    : "text-slate-500"
            }`}
          >
            Current: {applicant.status}
          </span>
        </div>
      </div>
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-xs text-white shadow-floating"
        >
          <CheckCircle2 size={15} className="text-brand-200" />
          <span>{toast}</span>
        </div>
      )}
    </article>
  );
}
