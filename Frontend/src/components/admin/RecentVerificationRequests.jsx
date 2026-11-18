import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { listVerificationRequests } from "../../api/verification";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const statusLabels = {
  pending: "Pending",
  approved: "Verified",
  rejected: "Rejected",
};

const statusStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-brand-200 bg-brand-50 text-brand-600",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

export default function RecentVerificationRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listVerificationRequests()
      .then((items) => setRequests(items.slice(0, 5)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 font-sans shadow-soft">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Company Verification Requests
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Latest requests submitted by companies
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/company-verification")}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      ) : loading ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Loading verification requests...
        </p>
      ) : requests.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          No company verification requests yet.
        </p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-cream p-4 transition duration-200 hover:border-brand-200 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                {request.company?.logo ? (
                  <img
                    src={request.company.logo}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-xl border border-stone-200 bg-white object-contain p-1"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                    <Building2 size={20} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {request.company?.name || "Unknown company"}
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-500">
                    {request.company?.email || request.accountEmail}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Submitted {formatDate(request.submittedAt)}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                  statusStyles[request.status] || statusStyles.pending
                }`}
              >
                {request.status === "approved" && <ShieldCheck size={13} />}
                {statusLabels[request.status] || "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
