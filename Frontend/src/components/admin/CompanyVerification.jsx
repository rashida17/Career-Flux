import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Building2, CheckCircle2, ExternalLink, FileText, Globe, Search, ShieldCheck, ShieldOff } from "lucide-react";
import {
  listVerificationRequests,
  getVerificationRequestCounts,
  approveVerification,
  rejectVerification,
  openVerificationDocument,
} from "../../api/verification";
import LiveCount from "../LiveCount";

const FILTERS = [
  { value: "", label: "All", countKey: "all" },
  { value: "pending", label: "Pending", countKey: "pending" },
  { value: "approved", label: "Verified", countKey: "verified" },
  { value: "rejected", label: "Rejected", countKey: "rejected" },
  { value: "unverified", label: "Unverified", countKey: "unverified" },
];

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

function StatusBadge({ status }) {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-black uppercase text-emerald-800">
        <ShieldCheck size={13} /> Verified
      </span>
    );
  if (status === "rejected")
    return (
      <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
        Rejected
      </span>
    );
  return (
    <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs font-bold text-stone-700">
      Pending
    </span>
  );
}

export default function CompanyVerification({ recentOnly = false }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(recentOnly ? "" : "pending");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([
      listVerificationRequests(recentOnly ? "" : filter),
      recentOnly ? Promise.resolve(null) : getVerificationRequestCounts(),
    ])
      .then(([requests, requestCounts]) => {
        setItems(recentOnly ? requests.slice(0, 5) : requests);
        if (requestCounts) setCounts(requestCounts);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter, recentOnly]);

  useEffect(load, [load]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const run = async (id, action, okMessage) => {
    setBusyId(id);
    setError("");
    try {
      await action();
      setToast({ message: okMessage, type: "success" });
      setRejectingId(null);
      setReason("");
      load();
    } catch (e) {
      setToast({ message: e.message, type: "error" });
    } finally {
      setBusyId(null);
    }
  };

  const viewDocument = async (id) => {
    try {
      await openVerificationDocument(id);
    } catch (e) {
      setToast({ message: e.message, type: "error" });
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = items.filter((request) =>
    [
      request.company?.name,
      request.company?.email,
      request.accountEmail,
      request.website,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery))
  );

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 font-sans shadow-soft">
      <div className="mb-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className={recentOnly ? "text-lg font-bold text-slate-900" : "text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"}>
              {recentOnly ? "Recent Company Verification Requests" : "Company Verification"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {recentOnly ? "Latest requests submitted by companies" : "Review legal documents before verifying a company"}
            </p>
          </div>
          {recentOnly && (
            <button
              type="button"
              onClick={() => navigate("/admin/company-verification")}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              View All <ArrowRight size={16} />
            </button>
          )}
        </div>

        {!recentOnly && (
          <div
            role="tablist"
            aria-label="Filter verification requests by status"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.value)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                    active
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-stone-200 bg-white text-slate-600 hover:border-brand-500/40 hover:text-brand-600"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      active ? "bg-white/20 text-white" : "bg-brand-50 text-brand-700"
                    }`}
                  >
                    {counts ? counts[f.countKey] : "..."}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {!recentOnly && <div className="flex w-full justify-center border-t border-stone-100 pt-5">
          <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
            <div className="flex flex-1 items-center rounded-xl border border-stone-200 bg-cream px-4 py-2.5 transition focus-within:border-brand-500 focus-within:bg-white">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by company name, email or website..."
                aria-label="Search companies"
                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white"
            >
              <Search size={16} />
            </span>
          </div>
        </div>}
      </div>

      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}

      {!loading && (
        <div className="mb-3">
          <LiveCount>
            Showing {visibleItems.length} of {items.length} requests
          </LiveCount>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Loading requests...</p>
      ) : visibleItems.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          {normalizedQuery ? "No companies match your search." : "No verification requests here."}
        </p>
      ) : (
        <div className="space-y-3">
          {visibleItems.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-stone-200 bg-cream p-4 transition duration-200 hover:border-brand-200 hover:shadow-soft"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  {r.company?.logo ? (
                    <img src={r.company.logo} alt="" className="h-11 w-11 shrink-0 rounded-xl border border-stone-200 bg-white object-contain p-1" />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                      <Building2 size={22} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{r.company?.name || "Unknown company"}</p>
                      <StatusBadge status={r.status} />
                    </div>

                    <p className="mt-1 break-all text-sm text-slate-500">{r.company?.email || r.accountEmail}</p>

                    {r.website && (
                      <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                        <Globe size={16} className="mt-0.5 shrink-0 text-brand-500" />
                        <a href={r.website} target="_blank" rel="noreferrer" className="break-all hover:text-brand-600 hover:underline">
                          {r.website}
                        </a>
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => viewDocument(r.id)}
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                    >
                      <FileText size={16} /> View document <ExternalLink size={13} />
                    </button>

                    <p className="mt-2 text-xs text-slate-400">
                      Submitted {formatDate(r.submittedAt)}
                      {r.reviewedAt && ` · Reviewed ${formatDate(r.reviewedAt)}`}
                    </p>

                    {r.status === "rejected" && r.rejectionReason && (
                      <p className="mt-2 text-sm text-brand-700">Reason: {r.rejectionReason}</p>
                    )}
                  </div>
                </div>

                {(r.status === "pending" ) && rejectingId !== r.id && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => run(r.id, () => approveVerification(r.id), "Company verified. The employer was notified.")}
                      className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                    >
                      {busyId === r.id ? "Working..." : "Verify Company"}
                    </button>
                    {r.status === "pending" && (
                      <button
                        type="button"
                        disabled={busyId === r.id}
                        onClick={() => { setRejectingId(r.id); setReason(""); }}
                        className="rounded-lg border border-slate-700 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-500 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                )}
              </div>

              {r.status === "pending" && rejectingId === r.id && (
                <div className="mt-4 space-y-2 border-t border-stone-200 pt-4">
                  <label className="block text-sm font-semibold text-slate-800">
                    Reason for rejection (sent to the employer)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={300}
                    rows={3}
                    placeholder="e.g. The document is unreadable. Please upload a clear PDF of your registration certificate."
                    className="w-full rounded-xl border border-stone-300 bg-white p-3 text-sm focus:border-brand-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busyId === r.id || reason.trim().length < 5}
                      onClick={() => run(r.id, () => rejectVerification(r.id, reason.trim()), "Request rejected. The employer was notified.")}
                      className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                    >
                      Confirm rejection
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectingId(null)}
                      className="rounded-lg border border-slate-700 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-500 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-xs text-white shadow-floating"
        >
          {toast.type === "error" ? (
            <AlertCircle size={15} className="text-brand-200" />
          ) : (
            <CheckCircle2 size={15} className="text-brand-200" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}