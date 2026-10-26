import { useState } from 'react';
import {
  Search,
  Sparkles,
  Target,
  ClipboardList,
  User,
  Flag,
  FilePlus,
  Lightbulb,
  Users,
  ListChecks,
  FileText,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const audiences = [
  {
    key: 'seekers',
    label: 'Job Seekers',
    cta: 'Create your profile',
    features: [
      { icon: Search, title: 'Find relevant jobs and internships', text: 'Search by skills, location and category.' },
      { icon: Sparkles, title: 'Improve skills with AI guidance', text: 'See which skills to build for the roles you want.' },
      { icon: Target, title: 'Personalized job recommendations', text: 'Get roles that fit your profile.' },
      { icon: ClipboardList, title: 'Apply and track progress', text: 'Follow every application from sent to decision.' },
      { icon: User, title: 'Build a professional profile', text: 'Keep your skills, experience and CV in one place.' },
      { icon: Flag, title: 'Report suspicious activity', text: 'Flag fake or misleading postings.' },
    ],
  },
  {
    key: 'providers',
    label: 'Job Providers',
    cta: 'Post a job',
    features: [
      { icon: FilePlus, title: 'Publish jobs and internships', text: 'Post opportunities in a few simple steps.' },
      { icon: Lightbulb, title: 'AI skill suggestions for postings', text: 'Describe the role better and attract the right people.' },
      { icon: Users, title: 'Discover suitable candidates', text: 'Find people whose skills match your needs.' },
      { icon: ListChecks, title: 'Manage applicants and statuses', text: 'Review applications and update their status.' },
      { icon: FileText, title: 'Review profiles and CVs', text: 'See each candidate in full before you decide.' },
      { icon: Flag, title: 'Report suspicious activity', text: 'Flag suspicious profiles or applications.' },
    ],
  },
];

const sharedPoints = [
  {
    icon: Sparkles,
    title: 'AI-assisted guidance',
    text: 'Skill suggestions for candidates and for job postings.',
  },
  {
    icon: ShieldCheck,
    title: 'Safer hiring',
    text: 'Both sides can report suspicious activity.',
  },
];

const tabBase =
  'flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

export default function About() {
  const [active, setActive] = useState('seekers');
  const current = audiences.find((a) => a.key === active);

  return (
    <section id="about" aria-labelledby="about-heading" className="bg-white py-16 sm:py-20">
      {/* items-center: the left column sits level with the right card */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left: heading, paragraph and shared strengths */}
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
            About CareerFlux
          </span>

          <h2
            id="about-heading"
            className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl"
          >
            Bringing the right talent and the right opportunities together.
          </h2>

          <p className="text-sm leading-7 text-stone-600 sm:text-base">
            CareerFlux connects job seekers with relevant jobs and internships, and helps employers
            publish roles and find suitable candidates. AI-based skill suggestions guide both sides,
            so every match starts from skills, not guesswork.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            {sharedPoints.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-stone-100 bg-cream p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-extrabold text-slate-900">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-stone-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: one card, two audiences */}
        <div className="rounded-3xl border border-stone-200 bg-cream p-6 sm:p-8">
          <h3 className="text-2xl font-extrabold text-slate-900">
            Built for both sides of hiring.
          </h3>

          {/* Switch */}
          <div
            className="mt-5 flex gap-1 rounded-xl border border-stone-200 bg-white p-1"
            role="group"
            aria-label="Choose audience"
          >
            {audiences.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                aria-pressed={active === key}
                onClick={() => setActive(key)}
                className={`${tabBase} ${
                  active === key
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Features for the selected audience */}
          <ul aria-live="polite" className="mt-6 space-y-5">
            {current.features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500 shadow-sm">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
                  <p className="mt-0.5 text-[13px] leading-5 text-stone-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Next step: the label changes with the selected tab */}
          <button
            type="button"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {current.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}