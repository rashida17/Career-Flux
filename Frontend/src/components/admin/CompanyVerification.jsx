
import { useState } from 'react';
import { Building2, FileText, ShieldCheck } from 'lucide-react';

const initialCompanies = [
  {
    id: 1,
    name: 'Tech Solutions',
    email: 'hr@techsolutions.example',
    document: 'Business Registration Certificate',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Digital Works',
    email: 'contact@digitalworks.example',
    document: 'Company Incorporation Certificate',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Bright Future Ltd.',
    email: 'info@brightfuture.example',
    document: 'Business License',
    status: 'Verified',
  },
];

export default function CompanyVerification() {
  const [companies, setCompanies] = useState(initialCompanies);

  function verifyCompany(id) {
    setCompanies((currentCompanies) =>
      currentCompanies.map((company) =>
        company.id === id
          ? { ...company, status: 'Verified' }
          : company
      )
    );
  }

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 font-sans shadow-soft">
      {/* Heading */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">
          Company Verification
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Review legal documents before verifying a company
        </p>
      </div>

      {/* Companies */}
      <div className="space-y-3">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-cream p-4 transition duration-200 hover:border-brand-200 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <Building2 size={22} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">
                    {company.name}
                  </p>

                  {company.status === 'Verified' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-600">
                      <ShieldCheck size={13} />
                      Verified
                    </span>
                  )}

                  {company.status === 'Pending' && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                      Pending
                    </span>
                  )}
                </div>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {company.email}
                </p>

                <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                  <FileText
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-500"
                  />
                  <span>{company.document}</span>
                </p>
              </div>
            </div>

            {company.status === 'Pending' ? (
              <button
                type="button"
                onClick={() => verifyCompany(company.id)}
                className="shrink-0 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Verify Company
              </button>
            ) : (
              <span className="shrink-0 text-sm font-semibold text-emerald-700">
                <ShieldCheck size={16} className="mr-1 inline" />
                Verification complete
              </span>
            )}
          </div>
        ))}
      </div>

     
    </section>
  );
}
