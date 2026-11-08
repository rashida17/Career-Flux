import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardOverview from "../components/DashboardOverview";
import EmployerProfileForm from "./EmployerProfileForm"; 
import CompanyProfileForm from "./CompanyProfileForm";
import CompanyVerificationForm from "./CompanyVerificationForm";
import CompanyProfile from "./CompanyProfile";
import PostJob from "./PostJob";
import ReportsComplaints from "./ReportsComplaints";
import MyPostedJobs from "./MyPostedJobs";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  FileCheck2,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Users,
  UserRound,
  X,
} from "lucide-react";
 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
 
import { Line } from "react-chartjs-2";
 
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);
// SAMPLE APPLICATION DATA
const initialApplicants = [
  {
    id: 1,
    name: "William Jackson",
    university: "International Collegiate University",
    appliedOn: "02 April, 2026",
    job: "Teaching Assistant",
    experience: "2+ Years",
    salary: "$800 / month",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    status: "New",
  },
  {
    id: 2,
    name: "Robert Williamson",
    university: "London University",
    appliedOn: "02 April, 2026",
    job: "UI/UX Designer",
    experience: "2+ Years",
    salary: "$800 / month",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    status: "New",
  },
  {
    id: 3,
    name: "Robertson Harry",
    university: "Royals Republic University",
    appliedOn: "05 April, 2026",
    job: "Teaching Assistant",
    experience: "3+ Years",
    salary: "$800 / month",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    status: "New",
  },
];
// SIDEBAR ITEMs
const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Employer Profile", icon: UserRound },
  { label: "Company Profile", icon: Building2 },
  { label: "Verification", icon: ShieldCheck },
  { label: "Post a Job", icon: Plus },
  { label: "My Posted Jobs", icon: BriefcaseBusiness },
  { label: "All Applications", icon: Users },
  { label: "Search Candidates", icon: Search },
  { label: "Reports & Complaints", icon: FileCheck2 },
];
// STATISTIC CARDS DATA (rendered by the shared DashboardOverview)
const employerStats = [
  { title: "Total Open Jobs", value: "5", note: "2 new this week", icon: BriefcaseBusiness },
  { title: "Total Applications", value: "124", note: "+18% vs last month", icon: Users },
  { title: "Total Candidate Invites", value: "18", note: "12 accepted", icon: Send },
  { title: "Total Posted Jobs", value: "12", note: "5 active · 7 closed", icon: FolderOpen },
];
 
// SECTION HEADING
function SectionHeading({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>
 
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
 
      {children}
    </div>
  );
}
// STEP ITEM FOR INFORMATION CARDS
function Step({ number, title, description, last = false }) {
  return (
    <div className="relative flex gap-3">
      {!last && (
        <div className="absolute bottom-0 left-[15px] top-9 w-px bg-stone-200" />
      )}
 
      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-xs font-bold text-brand-600">
        {number}
      </div>
 
      <div className="min-w-0 pb-5">
        <h3 className="text-sm font-bold text-slate-800">
          {title}
        </h3>
 
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
// APPLICATIONS LINE CHART
function ApplicationsChart() {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Applications",
        data: [11, 20, 16, 26, 23, 31, 22],
        borderColor: "#c84b31",
        backgroundColor: "rgba(200, 75, 49, 0.12)",
        fill: true,
        tension: 0.38,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#c84b31",
        pointBorderWidth: 2,
      },
    ],
  };
 
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} applicants`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748B" },
      },
      y: {
        beginAtZero: true,
        max: 35,
        ticks: {
          stepSize: 5,
          color: "#64748B",
        },
        grid: { color: "#F1F5F9" },
      },
    },
  };
 
  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
 
function HiringFunnelCard() {
  const stages = [
    {
      label: "Applied",
      count: 124,
      percentage: 100,
      barColor: "bg-brand-500",
    },
    {
      label: "Shortlisted",
      count: 42,
      percentage: 34,
      barColor: "bg-[#D66C58]",
    },
    {
      label: "Hired",
      count: 6,
      percentage: 5,
      barColor: "bg-emerald-500",
    },
  ];
 
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Hiring Funnel Breakdown
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Conversion stages across open positions
          </p>
        </div>
 
        <span className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-slate-700">
          Hiring Funnel
        </span>
      </div>
 
      <div className="space-y-5">
        {stages.map((stage) => (
          <div key={stage.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-700">
                {stage.label}
              </span>
 
              <span className="text-sm font-bold tabular-nums text-slate-900">
                {stage.count}
                {stage.label !== "Applied" && (
                  <span className="ml-1">({stage.percentage}%)</span>
                )}
              </span>
            </div>
 
            <div className="h-4 overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full ${stage.barColor}`}
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// PLATFORM INFORMATION & CANDIDATE INVITATIONS Cards
function CandidateInvitationGuide() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
          <Send size={21} />
        </div>
 
        <div>
          <h2 className="text-base font-bold text-slate-900">
            How candidate invitations work
          </h2>
 
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Connect with relevant candidates through CareerFlux.
          </p>
        </div>
      </div>
 
      <div className="mt-6 flex-1">
        <Step
          number="1"
          title="Search for candidates"
          description="Explore candidate profiles and review their listed skills and experience."
        />
 
        <Step
          number="2"
          title="Send an invitation"
          description="Notify a suitable candidate about an opportunity at your company."
        />
 
        <Step
          number="3"
          title="Candidate responds"
          description="The candidate can review the opportunity and choose whether to apply."
        />
 
        <Step
          number="4"
          title="Continue the hiring process"
          description="Review the application and invite suitable applicants for an interview."
          last
        />
      </div>
 
      <div className="mt-2 rounded-xl bg-brand-50 p-3">
        <p className="text-xs leading-5 text-slate-600">
          <span className="font-bold text-brand-700">Remember: </span>
          An invitation is not a job application or a guarantee of hiring.
        </p>
      </div>
    </section>
  );
}
// PLATFORM INFORMATION CARD: VERIFICATION
function VerificationGuide() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
          <ShieldCheck size={22} />
        </div>
 
        <div>
          <h2 className="text-base font-bold text-slate-900">
            How company verification works
          </h2>
 
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Learn how employers can build trust with job seekers.
          </p>
        </div>
      </div>
 
      <div className="mt-6 flex-1">
        <Step
          number="1"
          title="Submit company details"
          description="Provide the requested company information and supporting documents, where applicable."
        />
 
        <Step
          number="2"
          title="Admin reviews the submission"
          description="The CareerFlux admin reviews the submitted details before making a decision."
        />
 
        <Step
          number="3"
          title="Receive a decision"
          description="Your verification request can be approved or rejected after review."
        />
 
        <Step
          number="4"
          title="Display your verified badge"
          description="Approved employers can display a verified badge on their company profile."
          last
        />
      </div>
 
      <div className="mt-2 rounded-xl bg-brand-50 p-3">
        <p className="text-xs leading-5 text-slate-600">
          <span className="font-bold text-brand-700">Remember: </span>
          Verification is optional. Employers can use the platform without a verified badge.
        </p>
      </div>
    </section>
  );
}


// APPLICANT CARD
function ApplicantCard({ applicant, onStatusChange }) {
  const isShortlisted = applicant.status === "Shortlisted";
  const isRejected = applicant.status === "Rejected";
 
  return (
    <article className="rounded-xl border border-stone-200 bg-stone-50/60 p-3 transition hover:border-brand-200">
      <div className="grid grid-cols-1 gap-4 
      lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1fr)_auto] 
      lg:items-center lg:gap-5">
        {/* Candidate information */}
        <div className="flex min-w-0 items-start gap-3">
          <img
            src={applicant.image}
            alt={applicant.name}
            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-2 ring-white"
          />
 
          <div className="min-w-0">
            <h3 className="break-words text-sm font-bold text-slate-900">
              {applicant.name}
            </h3>
 
            <p className="mt-1 flex items-start gap-1 text-xs leading-5 text-slate-500">
              <GraduationCap size={14} className="mt-0.5 shrink-0" />
              <span>{applicant.university}</span>
            </p>
 
            <p className="mt-1 text-[11px] text-slate-400">
              Applied: {applicant.appliedOn}
            </p>
          </div>
        </div>
 
        {/* Job information */}
        <div className="min-w-0 lg:border-l lg:border-stone-200 lg:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Applied for
          </p>
 
          <p className="mt-1 break-words text-sm font-bold text-slate-800">
            {applicant.job}
          </p>
 
          <p className="mt-1 text-xs text-slate-500">
            Experience:{" "}
            <span className="font-semibold text-slate-700">
              {applicant.experience}
            </span>
          </p>
        </div>
 
        {/* Salary information */}
        <div className="min-w-0 lg:border-l lg:border-stone-200 lg:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Expected salary
          </p>
 
          <p className="mt-1 break-words text-sm font-bold text-slate-800">
            {applicant.salary}
          </p>
 
          <div className="mt-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                isShortlisted
                  ? "bg-emerald-100 text-emerald-800"
                  : isRejected
                    ? "bg-rose-100 text-rose-800"
                    : "bg-brand-50 text-brand-700"
              }`}
            >
              {applicant.status}
            </span>
          </div>
        </div>  
<div className="flex flex-col gap-2">
  <label
    htmlFor={`status-${applicant.id ?? applicant.name}`}
    className="text-xs font-medium text-slate-500"
  >
    Application status
  </label>
 
  <select
    id={`status-${applicant.id ?? applicant.name}`}
    value={applicant.status}
    onChange={(event) =>
      onStatusChange(applicant, event.target.value)
    }
    className="w-full min-w-[140px] cursor-pointer rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
  >
    <option value="New">New</option>
    <option value="Shortlisted">Shortlist</option>
    <option value="Accepted">Accept</option>
    <option value="Rejected">Reject</option>
  </select>
 
  <span
    className={`text-xs font-medium ${
      applicant.status === "Accepted"
        ? "text-emerald-600"
        : applicant.status === "Rejected"
          ? "text-red-600"
          : applicant.status === "Shortlisted"
            ? "text-brand-600"
            : "text-slate-500"
    }`}
  >
    Current: {applicant.status}
  </span>
</div>
 
      </div>
    </article>
  );
}
// MAIN EMPLOYER DASHBOARD
export default function EmployerDashboard({ initialTab = "Dashboard" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [postedJobs, setPostedJobs] = useState([]);
  const [applicants, setApplicants] = useState(initialApplicants);
  const [notice, setNotice] = useState("");
 

  const handlePostJob = (jobDetails) => {
  const newJob = {
    ...jobDetails,
    id: Date.now(),
    status: "Active",
    postedOn: new Date().toISOString().slice(0, 10),
  };

  setPostedJobs((current) => [newJob, ...current]);
  setNotice("Your job has been posted successfully.");
  setActiveTab("My Posted Jobs");
};
  
 
  const handleApplicantStatusChange = (selectedApplicant, newStatus) => {
    setApplicants((currentApplicants) =>
      currentApplicants.map((applicant) =>
        applicant.name === selectedApplicant.name
          ? { ...applicant, status: newStatus }
          : applicant
      )
    );
 
    setNotice(
      `${selectedApplicant.name}'s application status changed to ${newStatus}.`
    );
  };
const handleProfileSave = (profile) => {
  // call your backend API here
  setNotice("Your profile details were updated successfully.");
};

const [verificationStatus, setVerificationStatus] = useState("none"); // "none" | "pending" | "verified"
const [companyWebsite, setCompanyWebsite] = useState("");

const handleCompanySave = (company) => {
  setCompanyWebsite(company.website);
  // call your backend API here
  setNotice("Your company profile was saved successfully.");
};

const handleVerificationSubmit = ({ website, document }) => {
  // send website + PDF to your backend here, using FormData
  setVerificationStatus("pending");
  setNotice("Verification request submitted. We will review it shortly.");
};

  return (
    <DashboardLayout
      navigationItems={navigationItems}
      activeTab={activeTab}
      onNavigate={setActiveTab}
      workspaceLabel="Employer Workspace"
      menuTitle="Employer Menu"
      // welcomeTitle="Welcome back, Ahmed"
      // welcomeSubtitle="Manage jobs, applications, and candidate suggestions in one place."
      welcomeTitle={activeTab === "Dashboard" ? "Welcome back, Ahmed" : undefined}
  welcomeSubtitle={
    activeTab === "Dashboard"
      ? "Manage jobs, applications, and candidate suggestions in one place."
      : undefined
  }
    >
 
          {/* Action feedback */}
          {notice && (
            <div
              role="status"
              className="flex items-start justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800"
            >
              <p>{notice}</p>
 
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
                className="shrink-0"
              >
                <X size={17} />
              </button>
            </div>
          )}
 
      
      {activeTab === "Employer Profile" && (
  <EmployerProfileForm
    initialValues={{
      fullName: "Ahmed",
      jobTitle: "",
      email: "",
      phone: "",
    }}
    onSave={handleProfileSave}
  />
)}
 {activeTab === "Company Profile" && (
  <CompanyProfileForm
    onSave={handleCompanySave}
    onVerify={() => setActiveTab("Verification")}
    isVerified={verificationStatus === "verified"}
  />
)}

{activeTab === "Verification" && (
  <CompanyVerificationForm
    initialWebsite={companyWebsite}
    status={verificationStatus}
    onSubmit={handleVerificationSubmit}
    onBack={() => setActiveTab("Company Profile")}
  />
)}
{activeTab === "Post a Job" && (
  <PostJob onPostJob={handlePostJob} />
)}

{activeTab === "Reports & Complaints" && <ReportsComplaints />}

{activeTab === "My Posted Jobs" && (
  <MyPostedJobs
    jobs={postedJobs}
    onDelete={(jobId) =>
      setPostedJobs((current) =>
        current.filter((job) => job.id !== jobId)
      )
    }
    onClose={(jobId) =>
      setPostedJobs((current) =>
        current.map((job) =>
          job.id === jobId
            ? { ...job, status: "Closed" }
            : job
        )
      )
    }
  />
)}
{activeTab === "Dashboard" && (
  <>
  {/* Banner card + statistics (shared component) */}
      <DashboardOverview
        banner={{
          icon: ShieldCheck,
          title: "Employer Legal Verification",
          badge: "In review",
          description:
            "Verification is optional. Approved employers can display a verified badge to help build trust with job seekers.",
          buttonLabel: "View Verification",
          onButtonClick: () =>  setActiveTab("Verification"),
        }}
        stats={employerStats}
      />
 
 
          {/* Applications chart and hiring funnel */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-soft sm:p-6 xl:col-span-2">
              <SectionHeading
                title="Applications received"
                subtitle="Last 7 days, across all posted jobs"
              >
                <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <ArrowUpRight size={14} />
                  +18% vs last week
                </span>
              </SectionHeading>
 
              <div className="mt-5">
                <ApplicationsChart />
              </div>
            </div>
 
            <HiringFunnelCard />
          </section>
 
          {/* Platform guides: equal-sized cards with explanatory steps */}
          <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
            <CandidateInvitationGuide />
            <VerificationGuide />
          </section>
 
          {/* Latest applications: no search bar */}
          <section className="space-y-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex flex-col justify-between gap-3 border-b border-stone-100 pb-4 sm:flex-row sm:items-center">
              <SectionHeading
                title="Latest applications"
                subtitle="Review candidates who applied to your jobs"
              />
 
              <span className="self-start rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-600">
                {applicants.filter((item) => item.status === "New").length}{" "}
                new applicants
              </span>
            </div>
              
            <div className="space-y-4">
              {applicants.map((applicant) => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                 onStatusChange={handleApplicantStatusChange}
                />
              ))}
            </div>
            
          </section>
          </>
)}
    </DashboardLayout>
  );
}