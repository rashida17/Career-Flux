
import { MessageSquareWarning, ArrowRight } from 'lucide-react';

const complaints = [
  {
    id: 'CF-101',
    subject: 'Fake job posting',
    reporter: 'Ayesha Khan',
    date: 'Oct 24, 2026',
    status: 'Pending',
  },
  {
    id: 'CF-102',
    subject: 'Company not responding',
    reporter: 'Ali Ahmed',
    date: 'Oct 23, 2026',
    status: 'Under Review',
  },
  {
    id: 'CF-103',
    subject: 'Incorrect job information',
    reporter: 'Sara Malik',
    date: 'Oct 22, 2026',
    status: 'Resolved',
  },
];

const statusStyles = {
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  'Under Review': 'border-brand-200 bg-brand-50 text-brand-600',
  Resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export default function RecentComplaints() {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 font-sans shadow-soft">
      {/* Heading */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Reports & Complaints
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Latest issues reported by platform users
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-cream p-4 transition duration-200 hover:border-brand-200 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <MessageSquareWarning size={20} />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  {complaint.subject}
                </p>

                <p className="mt-1 break-words text-sm text-slate-500">
                  {complaint.id} · Reported by {complaint.reporter}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {complaint.date}
                </p>
              </div>
            </div>

            <span
              className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                statusStyles[complaint.status]
              }`}
            >
              {complaint.status}
            </span>
          </div>
        ))}
      </div>

     
    </section>
  );
}
