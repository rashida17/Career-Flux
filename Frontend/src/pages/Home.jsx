import { useCallback, useState } from "react";
import {
  Search,
  Layers,
  MapPin,
  ArrowRight,
  PlusCircle,
  PartyPopper,
  BadgeCheck,
  Compass,
  TrendingUp,
  BriefcaseBusiness,
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
} from "lucide-react";

import Header from "../components/Header";
import FeaturedJobs from "../components/FeaturedJobs";
import Footer from "../components/Footer";
import RoleSelectModal from "../components/RoleSelectModal";
import Dropdown from "../components/Dropdown"; // Fixed import path
import { categories } from "../data/jobs";
import { useNavigate } from "react-router-dom";

// ==========================================
// HERO SECTION COMPONENT (Integrated directly)
// ==========================================
const popularSearches = ["Frontend", "Data Analyst", "Remote", "Internship"];

const fieldClass =
  "flex min-h-[50px] items-center gap-3 rounded-xl border border-transparent bg-stone-50 px-3.5 transition focus-within:border-brand-300 focus-within:bg-white sm:rounded-2xl";

function Hero({ onSearch }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: query.trim(), category, location: location.trim() });
  };

  const handlePopular = (term) => {
    setQuery(term);
    setLocation("");
    setCategory("");
    onSearch({ query: term, category: "", location: "" });
  };

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...categories,
  ];

  return (
    <section
      id="home"
      className="hero-bg relative overflow-x-clip border-b border-stone-100"
    >
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

          <h1 className="mx-auto max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-[-0.045em] text-slate-900 sm:text-5xl lg:mx-0 lg:text-[44px] xl:text-[50px]">
            The Right Talent.
            <br className="hidden sm:block" />
            <span className="text-brand-500">The Right Opportunity.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8 lg:mx-0">
            Discover jobs that match your skills and candidates who match your
            needs.
          </p>

          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-stone-200 bg-white p-2 shadow-soft sm:rounded-3xl lg:mx-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              {/* Row 1: title + location */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {/* Job title or skills */}
                <label className={fieldClass}>
                  <Search className="h-5 w-5 shrink-0 text-brand-500" />
                  <span className="sr-only">Job title or skills</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Job title or skills"
                    className="min-w-0 w-full bg-transparent py-2 text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-stone-500"
                  />
                </label>

                {/* Location */}
                <label className={fieldClass}>
                  <MapPin className="h-5 w-5 shrink-0 text-brand-500" />
                  <span className="sr-only">City or remote</span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or Remote"
                    className="min-w-0 w-full bg-transparent py-2 text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-stone-500"
                  />
                </label>
              </div>

              {/* Row 2: category + search icon button */}
              <div className="flex gap-2">
                <Dropdown
                  id="category-dropdown"
                  ariaLabel="Job category"
                  variant="field"
                  icon={Layers}
                  placeholder="Select Category"
                  value={category}
                  onChange={setCategory}
                  options={categoryOptions}
                  className="min-w-0 flex-1"
                />

                {/* Search icon button */}
                <button
                  type="submit"
                  className="flex min-h-[50px] w-[54px] shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 sm:rounded-2xl"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </form>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="text-xs font-semibold text-stone-500">
              Popular:
            </span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handlePopular(term)}
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {term}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <span className="text-sm font-semibold text-stone-600">
              Looking to hire?
            </span>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-bold text-brand-700 transition hover:bg-brand-100 sm:text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Post Your Job
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="relative mx-auto max-w-[380px]">
            <div className="relative overflow-hidden rounded-3xl bg-brand-50 shadow-lg shadow-slate-900/10">
              {!imageFailed ? (
                <img
                  src="/hero_girl.jfif"
                  onError={() => setImageFailed(true)}
                  alt="Candidate celebrating job offer"
                  className="h-auto w-full scale-[1.02] object-cover object-top"
                />
              ) : (
                <div className="flex min-h-[390px] flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-50 via-white to-orange-100 p-8 text-center">
                  <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-brand-500 shadow-lg">
                    <BriefcaseBusiness className="h-12 w-12" />
                  </span>
                  <p className="max-w-xs text-sm font-semibold leading-6 text-stone-600">
                    Image not found. Check the file name inside the{" "}
                    <strong>public</strong> folder.
                  </p>
                </div>
              )}
            </div>

            <div className="glass-overlay floating-card absolute bottom-7 right-7 w-fit max-w-[300px] rounded-xl p-2.5 sm:bottom-8 sm:right-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white shadow-md shadow-brand-500/25">
                  <PartyPopper className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                      Offer accepted
                    </span>
                    <BadgeCheck className="h-3 w-3 text-emerald-600" />
                  </div>
                  <h2 className="whitespace-nowrap text-xs font-extrabold leading-snug text-slate-900">
                    Congratulations! You're Hired.
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Floating: Explore Jobs */}
          <div className="floating-card-delayed absolute -left-1 top-10 hidden max-w-[200px] items-center gap-3 rounded-2xl border border-stone-100 bg-white p-3.5 shadow-xl sm:flex lg:-left-7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-brand-50 text-brand-500">
              <Compass className="h-5 w-5" />
            </span>
            <div className="flex flex-col justify-center leading-tight">
              <strong className="text-xs text-slate-900">Explore Jobs</strong>
              <span className="mt-0.5 text-[11px] text-stone-500">
                Find your next move
              </span>
            </div>
          </div>

          {/* Floating: Build Your Career */}
          <div className="floating-card absolute -right-1 top-[42%] hidden max-w-[200px] items-center gap-3 rounded-2xl border border-stone-100 bg-white p-3.5 shadow-xl sm:flex lg:-right-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div className="flex flex-col justify-center leading-tight">
              <strong className="text-xs text-slate-900">
                Build Your Career
              </strong>
              <span className="mt-0.5 text-[11px] text-stone-500">
                Grow with every step
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// ABOUT SECTION COMPONENT (Integrated directly)
// ==========================================
const audiences = [
  {
    key: "seekers",
    label: "Job Seekers",
    cta: "Create your profile",
    features: [
      {
        icon: Search,
        title: "Find relevant jobs and internships",
        text: "Search by skills, location and category.",
      },
      {
        icon: Sparkles,
        title: "Improve skills with AI guidance",
        text: "See which skills to build for the roles you want.",
      },
      {
        icon: Target,
        title: "Personalized job recommendations",
        text: "Get roles that fit your profile.",
      },
      {
        icon: ClipboardList,
        title: "Apply and track progress",
        text: "Follow every application from sent to decision.",
      },
      {
        icon: User,
        title: "Build a professional profile",
        text: "Keep your skills, experience and CV in one place.",
      },
      {
        icon: Flag,
        title: "Report suspicious activity",
        text: "Flag fake or misleading postings.",
      },
    ],
  },
  {
    key: "providers",
    label: "Job Providers",
    cta: "Post a job",
    features: [
      {
        icon: FilePlus,
        title: "Publish jobs and internships",
        text: "Post opportunities in a few simple steps.",
      },
      {
        icon: Lightbulb,
        title: "AI skill suggestions for postings",
        text: "Describe the role better and attract the right people.",
      },
      {
        icon: Users,
        title: "Discover suitable candidates",
        text: "Find people whose skills match your needs.",
      },
      {
        icon: ListChecks,
        title: "Manage applicants and statuses",
        text: "Review applications and update their status.",
      },
      {
        icon: FileText,
        title: "Review profiles and CVs",
        text: "See each candidate in full before you decide.",
      },
      {
        icon: Flag,
        title: "Report suspicious activity",
        text: "Flag suspicious profiles or applications.",
      },
    ],
  },
];

const sharedPoints = [
  {
    icon: Sparkles,
    title: "AI-assisted guidance",
    text: "Skill suggestions for candidates and for job postings.",
  },
  {
    icon: ShieldCheck,
    title: "Safer hiring",
    text: "Both sides can report suspicious activity.",
  },
];

const tabBase =
  "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

function About() {
  const [active, setActive] = useState("seekers");
  const current = audiences.find((a) => a.key === active);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-white py-16 sm:py-20"
    >
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
            CareerFlux connects job seekers with relevant jobs and internships,
            and helps employers publish roles and find suitable candidates.
            AI-based skill suggestions guide both sides, so every match starts
            from skills, not guesswork.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            {sharedPoints.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-stone-100 bg-cream p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-extrabold text-slate-900">
                  {title}
                </h3>
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
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-stone-600 hover:bg-stone-100 hover:text-slate-900"
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
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {title}
                  </h4>
                  <p className="mt-0.5 text-[13px] leading-5 text-stone-600">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

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

// ==========================================
// HOME PAGE COMPONENT
// ==========================================
const emptySearch = { query: "", category: "", location: "" };

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState(emptySearch);
  const [roleModalOpen, setRoleModalOpen] = useState(false); // NEW

  const handleSearch = (values) => {
    setSearch(values);
    document
      .getElementById("jobs")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClear = () => setSearch(emptySearch);

  // Header buttons call this. Register opens the role choice.
  const handleAuth = (type) => {
    if (type === "Register") {
      setRoleModalOpen(true); // NEW
      return;
    }
    // Sign In belongs to your teammate (Nabi). Connect their page here.
    alert("Sign In: connect this to the Sign In page.");
  };

  const closeRoleModal = useCallback(() => setRoleModalOpen(false), []); // NEW

  // role is 'seeker' or 'provider'
  const handleRoleSelect = (role) => {
    setRoleModalOpen(false);
    const roleToType = { seeker: "jobseeker", provider: "employer" };
    navigate(`/signup?type=${roleToType[role] || "jobseeker"}`);
  };

  const handleSignInFromModal = () => {
    setRoleModalOpen(false); // NEW
    // CONNECT HERE: send the user to the Sign In page.
    alert("Connect this to the Sign In page.");
  };

  return (
    <div className="bg-white text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
      <Header onAuth={handleAuth} />
      <main>
        <Hero onSearch={handleSearch} />
        <FeaturedJobs search={search} onClear={handleClear} />
        <About />
      </main>
      <Footer />

      {/* NEW: role choice window */}
      {roleModalOpen && (
        <RoleSelectModal
          onSelect={handleRoleSelect}
          onSignIn={handleSignInFromModal}
          onClose={closeRoleModal}
        />
      )}
    </div>
  );
}
