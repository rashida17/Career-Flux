
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ApplicationStatus from "../components/ApplicationStatus";
import {
  AiSkillSuggestionsCard,
  LearningRoadmapCard,
} from "../components/AiSkillsSuggestionsCard";
import SkillProofCard from "../components/SkillProofCard";
import RecommendedJobs from "../components/RecommendedJobs";
import JobSeekerProfileForm from "./JobSeekerProfileForm";
import JobSeekerSkillsForm from "./JobSeekerSkillsForm";

import {
  LayoutDashboard,
  UserRound,
  Code,
  Search,
  FileText,
  CalendarCheck,
  Map,
  Settings,
  LogOut,
  User,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";

// MOCK DATA FOR EXISTING USER
// Later, replace this object with data from backend APIs.
const mockUser = {
  name: "Ahmed",
  isFirstLogin: false,
  profileStrength: 65,
  profileCompletionProgress: 65,
  totalSkills: 8,
  verifiedSkills: 5,
 skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS"],

skillProofs: [
  { id: 1, name: "React", evidenceCount: 2 },
  { id: 2, name: "JavaScript", evidenceCount: 1 },
  { id: 3, name: "Tailwind CSS", evidenceCount: 0 },
  { id: 4, name: "HTML", evidenceCount: 1 },
  { id: 5, name: "CSS", evidenceCount: 0 },
],
  targetJobTitle: "Frontend Developer",
  hasCv: true,

  totalApplications: 12,
  underReview: 3,
  pendingInvitations: 2,
  upcomingInterviews: 1,

  recommendedJobs: [
    {
      id: 1,
      title: "React Developer",
      company: "TechNova",
      location: "Lahore",
      match: "Strong",
    },
    {
      id: 2,
      title: "Frontend Intern",
      company: "PixelWorks",
      location: "Remote",
      match: "Medium",
    },
    {
      id: 3,
      title: "UI Engineer",
      company: "CodeCraft",
      location: "Karachi",
      match: "Weak",
    },
  ],

  skillSuggestions: [
  {
    name: "TypeScript",
    reason: "Required in 12 jobs for your target role",
  },
  {
    name: "Next.js",
    reason: "Required in 8 jobs for your target role",
  },
  {
    name: "Accessibility (ARIA)",
    reason: "Recommended in 6 jobs for your target role",
  },
],

  applications: [
    {
      id: 1,
      jobTitle: "React Developer",
      company: "TechNova",
      appliedDate: "2026-10-28",
      status: "in_review",
    },
    {
      id: 2,
      jobTitle: "Web Developer",
      company: "SoftEdge",
      appliedDate: "2026-10-25",
      status: "applied",
    },
  ],

  roadmap: {
    targetJobTitle: "Frontend Developer",
    learned: 3,
    total: 7,
    missingSkills: [
      { name: "TypeScript", resourceUrl: "#" },
      { name: "Testing (Jest)", resourceUrl: "#" },
      { name: "Next.js", resourceUrl: "#" },
    ],
  },
};

// TEST DATA SELECTION
const dashboardUser = mockUser;
// SIDEBAR ITEMS
const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Profile", icon: UserRound },
  { label: "My Skills", icon: Code },
  { label: "Find Jobs", icon: Search },
  { label: "My Applications", icon: FileText },
  { label: "Interviews", icon: CalendarCheck },
  { label: "Career Roadmap", icon: Map },
  { label: "Settings", icon: Settings },
  { label: "Logout", icon: LogOut },
];

// NAVIGATION HANDLER
// Supports both sidebar labels and existing component navigation keys.
const navigationMap = {
  dashboard: "Dashboard",
  "my-profile": "My Profile",
  profile: "My Profile",
  "my-skills": "My Skills",
  "find-jobs": "Find Jobs",
  "browse-jobs": "Find Jobs",
  "my-applications": "My Applications",
  interviews: "Interviews",
  "career-roadmap": "Career Roadmap",
  roadmap: "Career Roadmap",
  settings: "Settings",
  logout: "Logout",
};

// DYNAMIC BANNER LOGIC
function getBannerType(data) {
  if (data.pendingInvitations > 0) {
    return "RESPOND_INVITATION";
  }

  if (data.profileStrength < 100) {
    return "COMPLETE_PROFILE";
  }

  if (!data.hasRoadmap) {
    return "GENERATE_ROADMAP";
  }

  return "BROWSE_JOBS";
}

// BANNER CONFIGURATION
const bannerConfig = {
  RESPOND_INVITATION: {
    title: "Respond to Your Invitation",
    badge: "ACTION NEEDED",
    description:
      "An employer has invited you for an interview. Respond soon to confirm your slot.",
    buttonLabel: "Review Invitation",
    icon: CalendarCheck,
    link: "Interviews",
  },

  COMPLETE_PROFILE: {
    title: "Complete Your Profile",
    badge: "PROFILE",
    description:
      "Add your details and skills so employers can find and trust you.",
    buttonLabel: "Complete Profile",
    icon: User,
    link: "My Profile",
  },

  GENERATE_ROADMAP: {
    title: "Plan Your Career Path",
    badge: "NEW",
    description:
      "Get a personalized roadmap of the skills you need for your target job.",
    buttonLabel: "Generate Roadmap",
    icon: Map,
    link: "Career Roadmap",
  },

  BROWSE_JOBS: {
    title: "Explore Matching Jobs",
    badge: "AI MATCH",
    description:
      "Jobs matching your verified skills are waiting for you.",
    buttonLabel: "Browse Jobs",
    icon: Sparkles,
    link: "Find Jobs",
  },
};

// DYNAMIC BANNER
function DynamicBanner({ data, onNavigate }) {
  const bannerType = getBannerType(data);
  const banner = bannerConfig[bannerType];
  const Icon = banner.icon;

  return (
    <section className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 border-l-4 border-l-brand-500 bg-white p-5 shadow-soft transition hover:border-brand-200 hover:border-l-brand-500 md:flex-row md:items-center md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <Icon size={24} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold text-slate-900">
              {banner.title}
            </h2>

            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-800">
              {data.profileStrength === 0 &&
              bannerType === "COMPLETE_PROFILE"
                ? "GET STARTED"
                : banner.badge}
            </span>
          </div>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {banner.description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNavigate(banner.link)}
        className="shrink-0 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600"
      >
        {banner.buttonLabel}
      </button>
    </section>
  );
}

// STATISTIC CARD
// Same design as Employer Dashboard StatCard
function StatsCard({ title, value, note, icon: Icon, onClick, progress }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-stone-200 border-l-4 border-l-brand-500 bg-white p-5 text-left transition hover:border-brand-200 hover:border-l-brand-500 hover:shadow-soft"
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
          {value}
        </h2>

        {typeof progress === "number" && (
          <div className="mt-2 h-1.5 w-full max-w-36 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-[#DC4A1F] transition-all duration-500"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        )}

        <p className="mt-1.5 text-xs font-medium text-slate-500">
          {note}
        </p>
      </div>

      <div className="ml-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <Icon size={23} />
      </div>
    </button>
  );
}

// PROFILE STRENGTH CARD
function ProfileStrengthCard({ data, onNavigate }) {
  return (
    <StatsCard
      title="Profile Strength"
      value={`${data.profileStrength}%`}
      note={
        data.profileStrength === 100
          ? "Profile complete"
          : data.profileStrength === 0
            ? "Complete your profile"
            : "Add evidence to reach 100%"
      }
      icon={UserRound}
      progress={data.profileStrength}
      onClick={() => onNavigate("My Profile")}
    />
  );
}
// VERIFIED SKILLS CARD
function VerifiedSkillsCard({ data, onNavigate }) {
  return (
    <StatsCard
      title="Verified Skills"
      value={`${data.verifiedSkills} / ${data.totalSkills}`}
      note={
        data.verifiedSkills === 0
          ? "Add your first proof"
          : "Keep adding proof"
      }
      icon={ShieldCheck}
      onClick={() => onNavigate("My Skills")}
    />
  );
}

// APPLICATIONS CARD
function ApplicationsCard({ data, onNavigate }) {
  return (
    <StatsCard
      title="Applications Sent"
      value={data.totalApplications}
      note={
        data.totalApplications === 0
          ? "Browse jobs"
          : `${data.underReview} under review`
      }
      icon={Send}
      onClick={() => onNavigate("My Applications")}
    />
  );
}

// INTERVIEW INVITATIONS CARD
function InvitationsCard({ data, onNavigate }) {
  return (
    <StatsCard
      title="Interview Invitations"
      value={data.pendingInvitations}
      note={
        data.pendingInvitations === 0 &&
        data.upcomingInterviews === 0
          ? "Apply to get noticed"
          : `${data.upcomingInterviews} upcoming`
      }
      icon={CalendarCheck}
      onClick={() => onNavigate("Interviews")}
    />
  );
}

// MAIN JOB SEEKER DASHBOARD
export default function JobSeekerDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const data = dashboardUser;

  const handleNavigate = (pageName) => {
    const normalizedPage = String(pageName || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    setActiveTab(navigationMap[normalizedPage] || pageName);
  };

  if (activeTab === "My Profile") {
    return <JobSeekerProfileForm onNavigate={handleNavigate} />;
  }

  if (activeTab === "My Skills") {
    return (
      <JobSeekerSkillsForm
        user={data}
        onNavigate={handleNavigate}
      />
    );
  }

  const welcomeTitle = data.isFirstLogin
    ? `Welcome, ${data.name}`
    : `Welcome back, ${data.name}`;

  const welcomeSubtitle =
    "Let's turn your skills into opportunities.";

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      activeTab={activeTab}
      onNavigate={handleNavigate}
      workspaceLabel="Job Seeker Workspace"
      menuTitle="Job Seeker Menu"
      welcomeTitle={welcomeTitle}
      welcomeSubtitle={welcomeSubtitle}
      role="jobseeker"
      user={data}
    >
      {/* DYNAMIC BANNER */}
      <DynamicBanner
        data={data}
        onNavigate={handleNavigate}
      />

      {/* JOB SEEKER STATISTICS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ProfileStrengthCard
          data={data}
          onNavigate={handleNavigate}
        />

        <VerifiedSkillsCard
          data={data}
          onNavigate={handleNavigate}
        />

        <ApplicationsCard
          data={data}
          onNavigate={handleNavigate}
        />

        <InvitationsCard
          data={data}
          onNavigate={handleNavigate}
        />
      </section>

      {/* BOTTOM SECTION: TWO-COLUMN DASHBOARD GRID */}
     {/* BOTTOM SECTION: THREE-COLUMN DASHBOARD GRID */}
<div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">

  {/* LEFT COLUMN */}
  <div className="order-2 space-y-5 lg:order-1 lg:col-span-2">
    <RecommendedJobs
      user={data}
      onNavigate={handleNavigate}
    />

    <AiSkillSuggestionsCard
      user={data}
      onNavigate={handleNavigate}
    />
  </div>

 {/* RIGHT COLUMN */}
<div className="order-1 space-y-5 lg:order-2 lg:col-span-1">

  <ApplicationStatus
    userApplications={data.applications || []}
    onNavigate={handleNavigate}
  />

  <LearningRoadmapCard
    user={data}
    onNavigate={handleNavigate}
  />

  <SkillProofCard
    skills={data?.skillProofs || []}
    onNavigate={handleNavigate}
  />

</div>
  

</div>
    </DashboardLayout>
  );
}
