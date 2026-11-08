
import { useState } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  Users,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";

export default function MyPostedJobs({ jobs = [], onDelete, onClose }) {
  const [filter, setFilter] = useState("All");

  const filteredJobs = jobs.filter((job) => {
    if (filter === "All") return true;
    return job.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            My Posted Jobs
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Manage and track all your job opportunities.
          </p>
        </div>

        <span className="rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
          {jobs.length} Total Jobs
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Active", "Closed"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === item
                ? "bg-brand-500 text-white"
                : "border border-stone-200 bg-white text-slate-600 hover:bg-brand-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <BriefcaseBusiness
            size={42}
            className="mx-auto text-stone-300"
          />
          <h3 className="mt-4 text-lg font-bold text-slate-800">
            No jobs found
          </h3>
          <p className="mt-2 text-sm text-stone-500">
            Your posted jobs will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-brand-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {job.jobTitle}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {job.department}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    job.status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5">
                  <BriefcaseBusiness size={16} />
                  {job.jobType}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={16} />
                  Deadline: {job.deadline}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={16} />
                  {job.vacancies} Positions
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(job.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-stone-100 pt-4">
                {job.status === "Active" && (
                  <button
                    onClick={() => onClose?.(job.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-stone-50"
                  >
                    <XCircle size={15} />
                    Close Job
                  </button>
                )}

                <button
                  onClick={() => onDelete?.(job.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
