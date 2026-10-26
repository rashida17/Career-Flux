import { useState } from 'react';
import {
  Search,
  Layers,
  SearchCheck,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  PartyPopper,
  BadgeCheck,
  Compass,
  TrendingUp,

  BriefcaseBusiness,
} from 'lucide-react';
import { categories } from '../data/jobs';

export default function Hero({ onSearch }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: query.trim(), category });
  };

  return (
    <section id="home" className="hero-bg relative overflow-hidden border-b border-stone-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
        {/* LEFT */}
        <div className="relative z-10 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-[11px] font-extrabold tracking-[0.09em] text-brand-700 shadow-sm sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            READY TO FIND YOUR DREAM JOB?
          </div>

          <h1 className="mx-auto max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-[-0.045em] text-slate-900 sm:text-5xl lg:mx-0 lg:text-[58px]">
            The Right Talent.
            <br className="hidden sm:block" />
            <span className="text-brand-500"> The Right Opportunity.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8 lg:mx-0">
            Discover jobs that match your skills and candidates who match your needs.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-stone-200 bg-white p-2 shadow-soft sm:rounded-3xl lg:mx-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex min-h-[50px] flex-1 items-center gap-3 rounded-xl border border-transparent bg-stone-50 px-3.5 transition focus-within:border-brand-300 focus-within:bg-white sm:rounded-2xl">
                <Search className="h-5 w-5 shrink-0 text-brand-500" />
                <span className="sr-only">Job title or skills</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title or skills"
                  className="w-full bg-transparent py-2 text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-stone-400"
                />
              </label>

              <label className="flex min-h-[50px] flex-1 items-center gap-3 rounded-xl border border-transparent bg-stone-50 px-3.5 transition focus-within:border-brand-300 focus-within:bg-white sm:rounded-2xl">
                <Layers className="h-5 w-5 shrink-0 text-brand-500" />
                <span className="sr-only">Select job category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full cursor-pointer bg-transparent py-2 text-sm font-semibold text-stone-600 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>

              {/* CHANGE 4: Search button now has a text label */}
              <button
                type="submit"
                className="flex min-h-[50px] shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 sm:rounded-2xl"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </form>
          </div>

          {/* CHANGE 2: Quick links as pill buttons with arrows */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#jobs"
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-bold text-brand-700 transition hover:bg-brand-100 sm:text-sm"
            >
              <SearchCheck className="h-4 w-4" />
              Search Jobs
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-brand-200 hover:bg-white hover:text-brand-600 sm:text-sm"
            >
              <PlusCircle className="h-4 w-4 text-brand-500" />
              Post Your Job
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 sm:text-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              Skills-first opportunities
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

          {/* RIGHT 
        <div className="relative mx-auto w-full max-w-[570px] lg:max-w-none">*/}
        <div className="relative mx-auto w-full max-w-[450px]">
          <div className="absolute -right-5 top-8 h-28 w-28 rounded-full bg-brand-100/70 blur-2xl sm:h-40 sm:w-40" />
          <div className="absolute -bottom-5 left-0 h-32 w-32 rounded-full bg-orange-100/70 blur-2xl" />

       { /*  <div className="hero-image-frame relative mx-auto max-w-[520px] rounded-[30px] border border-brand-100 p-2.5 shadow-soft sm:rounded-[36px] sm:p-3">
            <div className="relative overflow-hidden rounded-[23px] bg-brand-50 sm:rounded-[29px]"> */}
            <div className="relative mx-auto max-w-[520px]">
  <div className="relative overflow-hidden rounded-3xl bg-brand-50 shadow-lg shadow-slate-900/10">  
              {!imageFailed ? (
                // Place girl1.jfif inside the /public folder
                <img
                  src="/girl2.jfif"
                  onError={() => setImageFailed(true)}
                  alt="Candidate celebrating job offer"
                  className="h-auto w-full transform object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
              ) : (
                <div className="flex min-h-[390px] flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-50 via-white to-orange-100 p-8 text-center sm:min-h-[480px]">
                  <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-brand-500 shadow-lg">
                    <BriefcaseBusiness className="h-12 w-12" />
                  </span>
                  <p className="max-w-xs text-sm font-semibold leading-6 text-stone-600">
                    Place your <strong>girl1.jfif</strong> image inside the <strong>public</strong> folder.
                  </p>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-white/5" />
            </div>

            {/* Success card */}
        {/* <div className="glass-overlay floating-card absolute bottom-5 left-4 right-4 rounded-2xl p-3.5 sm:bottom-7 sm:left-6 sm:right-6 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/25 sm:h-12 sm:w-12">
                  <PartyPopper className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                      Offer accepted
                    </span>
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <h2 className="mt-0.5 text-sm font-extrabold leading-snug text-slate-900 sm:text-base">
                    Congratulations! You're Hired.
                  </h2>
                  <p className="mt-0.5 text-[11px] font-medium text-stone-600 sm:text-xs">
                    Your next chapter starts here.
                  </p>
                </div>

                <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 sm:flex">
                  <Check className="h-5 w-5" />
                </span>
              </div>
            </div> */}
            {/* Success card */}
<div className="glass-overlay floating-card absolute bottom-4 left-4 w-fit max-w-[240px] rounded-xl p-2.5 sm:bottom-5 sm:left-5">
  <div className="flex items-center gap-2.5">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white shadow-md shadow-brand-500/25">
      <PartyPopper className="h-4 w-4" />
    </div>

    <div className="min-w-0">
      <div className="flex items-center gap-1">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600">
          Offer accepted
        </span>
        <BadgeCheck className="h-3 w-3 text-emerald-500" />
      </div>
      <h2 className="text-xs font-extrabold leading-snug text-slate-900">
        Congratulations! You're Hired.
      </h2>
    </div>
  </div>
</div>
          </div>

          {/* Floating: Explore Jobs */}
          <div className="floating-card-delayed absolute -left-1 top-10 hidden max-w-[190px] items-center gap-3 rounded-2xl border border-stone-100 bg-white p-3.5 shadow-xl sm:flex lg:-left-7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <Compass className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-xs text-slate-900">Explore Jobs</strong>
              <span className="mt-0.5 block text-[10px] text-stone-500">Find your next move</span>
            </span>
          </div>

          {/* Floating: Build Your Career */}
          <div className="floating-card absolute -right-1 top-[42%] hidden max-w-[190px] items-center gap-3 rounded-2xl border border-stone-100 bg-white p-3.5 shadow-xl sm:flex lg:-right-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-xs text-slate-900">Build Your Career</strong>
              <span className="mt-0.5 block text-[10px] text-stone-500">Grow with every step</span>
            </span>
          </div>

          {/* Floating: Achieve Your Goals */}
       { /*  <div className="absolute -bottom-4 left-[20%] hidden items-center gap-2 rounded-full border border-stone-100 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-lg sm:flex">
            <Target className="h-4 w-4 text-brand-500" />
            Achieve Your Goals
          </div> */}
        </div>
      </div>
    </section>
  );
}