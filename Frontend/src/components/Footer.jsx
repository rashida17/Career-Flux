import { ArrowUp } from 'lucide-react';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-8 text-center sm:px-6 md:flex-row md:justify-between md:text-left lg:px-8">
        {/* Brand and one-line description */}
        <div>
          <a
            href="#home"
            className={`inline-block rounded text-xl font-extrabold tracking-tight text-slate-900 ${focusRing}`}
          >
            Career<span className="text-brand-500">Flux</span>
          </a>
          <p className="mt-1 text-sm text-stone-600">
            Skills-first hiring for job seekers and employers.
          </p>
        </div>

        {/* Copyright and back to top */}
        <div className="flex items-center gap-4">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} CareerFlux. All rights reserved.
          </p>
          <a
            href="#home"
            aria-label="Back to top"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:border-brand-500 hover:text-brand-600 ${focusRing}`}
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}