
import { useState, useEffect } from "react";

import {
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  Users,
  Trash2,
  XCircle,
} from "lucide-react";

export default function MyPostedJobs({ onDelete, onClose }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch logged-in employer's jobs
  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("careerFluxToken") ||
          sessionStorage.getItem("careerFluxToken");

        if (!token) {
          throw new Error("Please login to view your posted jobs.");
        }

        const response = await fetch(
          "http://localhost:5000/api/jobs/my-jobs",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch posted jobs."
          );
        }

        setJobs(data.jobs || []);
      } catch (err) {
        console.error("Fetch My Jobs Error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  // Convert backend status into frontend status
  const getJobStatus = (status) => {
    if (status === "open") return "Active";
    if (status === "closed") return "Closed";

    return status?.charAt(0).toUpperCase() + status?.slice(1);
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const status = getJobStatus(job.status);

    if (filter === "All") return true;

    return status === filter;
  });

  // Format deadline
  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
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

      {/* Filters */}
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

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-stone-500">
            Loading your posted jobs...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredJobs.length === 0 && (
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
      )}

      {/* Jobs List */}
      {!loading && !error && filteredJobs.length > 0 && (
        <div className="space-y-4">

          {filteredJobs.map((job) => {
            const status = getJobStatus(job.status);

            return (
              <article
                key={job._id}
                className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-brand-200"
              >

                {/* Job Header */}
                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {job.title}
                    </h3>

                    <p className="mt-1 text-sm text-stone-500">
                      {job.workMode}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : status === "Closed"
                        ? "bg-stone-100 text-stone-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {status}
                  </span>

                </div>

                {/* Job Information */}
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
                    Deadline: {formatDate(job.deadline)}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Users size={16} />
                    {job.vacancies} Positions
                  </span>

                </div>

                {/* Required Skills */}
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

                {/* Job Description */}
                {job.description && (
                  <p className="mt-4 text-sm leading-6 text-stone-600">
                    {job.description}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-stone-100 pt-4">

                  {status === "Active" && (
                    <button
                      onClick={() => onClose?.(job._id)}
                      className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-stone-50"
                    >
                      <XCircle size={15} />
                      Close Job
                    </button>
                  )}

                  <button
                    onClick={() => onDelete?.(job._id)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </div>
  );
}
