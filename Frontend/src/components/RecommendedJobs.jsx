
import { useState } from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  ArrowRight,
  FileText,
  X,
  BriefcaseBusiness,
} from "lucide-react";

const defaultJobs = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Tech Solutions",
    location: "Lahore, Pakistan",
    salary: "PKR 25,000 - 35,000",
    postedTime: "2 days ago",
    type: "Internship",
    description:
      "We are looking for a passionate Frontend Developer Intern with basic knowledge of React, JavaScript, HTML, and CSS.",
  },
  {
    id: 2,
    title: "Junior Software Engineer",
    company: "Digital Innovations",
    location: "Remote",
    salary: "PKR 50,000 - 70,000",
    postedTime: "1 day ago",
    type: "Full Time",
    description:
      "Join our development team as a Junior Software Engineer. You will work on web applications and collaborate with experienced developers.",
  },
  {
    id: 3,
    title: "QA Engineering Intern",
    company: "Software House",
    location: "Islamabad, Pakistan",
    salary: "PKR 20,000 - 30,000",
    postedTime: "3 days ago",
    type: "Internship",
    description:
      "Looking for a QA Engineering Intern interested in software testing, test cases, and quality assurance.",
  },
];

export default function RecommendedJobs({
  user,
  jobs = defaultJobs,
  onNavigate,
  onApplyJob,
}) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const hasUserSkills = user?.skills?.length > 0;
  const hasCv = Boolean(user?.cv || user?.resume);

  const handleApplyClick = (e, job) => {
    e.stopPropagation();

    if (!hasCv) {
      setSelectedJob(job);
      setShowCvModal(true);
      return;
    }

    if (appliedJobs.includes(job.id)) return;

    setAppliedJobs((previous) => [...previous, job.id]);
    onApplyJob?.(job);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setShowCvModal(false);
  };

  return (
    <>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6">

        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-800">
              {hasUserSkills ? "Recommended Jobs" : "Explore Opportunities"}
            </h2>

            <p className="mt-1 text-xs text-stone-500">
              {hasUserSkills
                ? "Opportunities based on your profile"
                : "Explore available jobs and internships"}
            </p>
          </div>

          <button
            onClick={() => onNavigate?.("Find Jobs")}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#C84B31] transition hover:text-[#A93823]"
          >
            View All
            <ArrowRight size={14} />
          </button>
        </div>

        {/* JOB LIST */}
        <div className="space-y-2">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const isApplied = appliedJobs.includes(job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => handleViewJob(job)}
                  className="group cursor-pointer rounded-xl border border-stone-100 bg-[#FAF9F7] px-3 py-3 transition-all duration-200 hover:border-orange-200 hover:bg-orange-50/40"
                >
                  <div className="flex items-center gap-3">

                    {/* COMPANY ICON */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF0EC] text-[#C84B31]">
                      <BriefcaseBusiness size={19} />
                    </div>

                    {/* JOB INFORMATION */}
                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      {/* JOB DETAILS */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-stone-800 transition-colors group-hover:text-[#C84B31]">
                          {job.title}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-stone-500">
                          {job.company}
                        </p>

                        {/* JOB META */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {job.location}
                          </span>

                          <span className="flex items-center gap-1">
                            <DollarSign size={12} />
                            {job.salary}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {job.postedTime}
                          </span>
                        </div>
                      </div>

                      {/* CTA GROUP */}
                      <div className="flex shrink-0 items-center justify-between gap-2 sm:flex-col sm:items-end sm:justify-center">

                        {/* JOB TYPE */}
                        <span className="rounded-full bg-[#FDF0EC] px-2.5 py-1 text-[10px] font-semibold text-[#C84B31]">
                          {job.type}
                        </span>

                        {/* APPLY BUTTON */}
                        <button
                          onClick={(e) => handleApplyClick(e, job)}
                          disabled={isApplied}
                          className={`rounded-full px-3.5 py-1.5 text-[10px] font-bold transition-all duration-200 ${
                            isApplied
                              ? "cursor-default border border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "bg-[#C84B31] text-white hover:bg-[#A93823] hover:shadow-sm"
                          }`}
                        >
                          {isApplied ? "Applied ✓" : "Apply Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center">
              <BriefcaseBusiness
                size={30}
                className="mx-auto mb-3 text-stone-300"
              />

              <p className="text-sm font-semibold text-stone-600">
                No jobs available right now
              </p>

              <p className="mt-1 text-xs text-stone-400">
                Check back later for new opportunities.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* JOB DETAILS MODAL */}
      {selectedJob && !showCvModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-stone-800">
                  {selectedJob.title}
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {selectedJob.company}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {selectedJob.location}
              </span>

              <span className="flex items-center gap-1">
                <DollarSign size={14} />
                {selectedJob.salary}
              </span>
            </div>

            <h3 className="mb-2 text-sm font-bold text-stone-800">
              Job Description
            </h3>

            <p className="text-sm leading-6 text-stone-600">
              {selectedJob.description}
            </p>

            <button
              onClick={(e) => handleApplyClick(e, selectedJob)}
              disabled={appliedJobs.includes(selectedJob.id)}
              className="mt-6 w-full rounded-xl bg-[#C84B31] py-3 text-sm font-bold text-white transition hover:bg-[#A93823] disabled:cursor-default disabled:bg-emerald-600"
            >
              {appliedJobs.includes(selectedJob.id)
                ? "Applied ✓"
                : "Apply Now"}
            </button>
          </div>
        </div>
      )}

      {/* CV REQUIRED MODAL */}
      {showCvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FDF0EC] text-[#C84B31]">
              <FileText size={26} />
            </div>

            <h2 className="text-lg font-bold text-stone-800">
              Upload Your CV
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Please upload your CV before applying for this job.
            </p>

            <button
              onClick={() => {
                setShowCvModal(false);
                setSelectedJob(null);
                onNavigate?.("My Profile");
              }}
              className="mt-5 w-full rounded-xl bg-[#C84B31] py-3 text-sm font-bold text-white transition hover:bg-[#A93823]"
            >
              Go to My Profile
            </button>

            <button
              onClick={closeModal}
              className="mt-3 text-xs font-semibold text-stone-500 transition hover:text-stone-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
