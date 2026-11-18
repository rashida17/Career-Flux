import { useCallback, useEffect, useState } from "react";
import { Building2, ExternalLink, FileText, Globe, Search, ShieldCheck } from "lucide-react";
import {
  listVerificationRequests,
  getVerificationRequestCounts,
  approveVerification,
  rejectVerification,
  openVerificationDocument,
} from "../../api/verification";

const FILTERS = [
  { value: "", label: "All", countKey: "all" },
  { value: "pending", label: "Pending", countKey: "pending" },
  { value: "approved", label: "Verified", countKey: "verified" },
  { value: "rejected", label: "Rejected", countKey: "rejected" },
];

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

function StatusBadge({ status }) {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-600">
        <ShieldCheck size={13} /> Verified
      </span>
    );
  if (status === "rejected")
    return (
      <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
        Rejected
      </span>
    );
  return (
    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
      Pending
    </span>
  );
}

export default function CompanyVerification() {
  const [filter, setFilter] = useState("pending");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([listVerificationRequests(filter), getVerificationRequestCounts()])
      .then(([requests, requestCounts]) => {
        setItems(requests);
        setCounts(requestCounts);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(load, [load]);

  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const run = async (id, action, okMessage) => {
    setBusyId(id);
    setError("");
    try {
      await action();
      setMessage(okMessage);
      setRejectingId(null);
      setReason("");
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const viewDocument = async (id) => {
    try {
      await openVerificationDocument(id);
    } catch (e) {
      setError(e.message);
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
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Company Verification</h3>
          <p className="mt-1 text-sm text-slate-500">Review legal documents before verifying a company</p>
        </div>

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

        <div className="flex w-full justify-center border-t border-stone-100 pt-5">
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
        </div>
      </div>

      {message && (
        <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{message}</p>
      )}
      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}

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

                    <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                      <Globe size={16} className="mt-0.5 shrink-0 text-brand-500" />
                      <a href={r.website} target="_blank" rel="noreferrer" className="break-all hover:text-brand-600 hover:underline">
                        {r.website}
                      </a>
                    </p>

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
                      <p className="mt-2 text-sm text-red-700">Reason: {r.rejectionReason}</p>
                    )}
                  </div>
                </div>

                {r.status === "pending" && rejectingId !== r.id && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => run(r.id, () => approveVerification(r.id), "Company verified. The employer was notified.")}
                      className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                    >
                      {busyId === r.id ? "Working..." : "Verify Company"}
                    </button>
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => { setRejectingId(r.id); setReason(""); }}
                      className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-700 disabled:opacity-60"
                    >
                      Reject
                    </button>
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
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      Confirm rejection
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectingId(null)}
                      className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
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
      {!loading && (
        <p className="mt-4 text-xs font-semibold text-slate-500">
          Showing {visibleItems.length} of {items.length} requests
        </p>
      )}
    </section>
  );
}