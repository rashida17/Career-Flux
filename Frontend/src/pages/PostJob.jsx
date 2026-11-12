
import { useState } from "react";
import {
  BriefcaseBusiness,
  Monitor,
  MapPin,
  Users,
  Clock3,
  GraduationCap,
  Banknote,
  CalendarDays,
  Code2,
  Plus,
  X,
} from "lucide-react";

import ConfigForm, {
  FieldShell,
} from "../components/FormLayout";

const inputBase =
  "w-full rounded-2xl border bg-stone-50 py-3.5 text-sm font-medium text-slate-800 " +
  "placeholder:text-stone-400 outline-none shadow-none transition-colors focus:bg-white";

const inputOk = "border-stone-200 focus:border-brand-400";
const inputError = "border-brand-300 bg-white focus:border-brand-400";

export default function PostJob({ onPostJob }) {
  const [skillInput, setSkillInput] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = [
    {
      name: "jobTitle",
      label: "Job Title",
      type: "text",
      icon: BriefcaseBusiness,
      placeholder: "e.g. Frontend Developer",
      required: true,
    },
    {
      name: "jobType",
      label: "Job Type",
      type: "select",
      icon: BriefcaseBusiness,
      placeholder: "Select job type",
      options: ["Full-time", "Part-time", "Internship"],
      required: true,
    },
    {
      name: "workMode",
      label: "Work Mode",
      type: "select",
      icon: Monitor,
      placeholder: "Select work mode",
      options: ["On-site", "Remote", "Hybrid"],
      required: true,
    },
    {
      name: "location",
      label: "Job Location",
      type: "text",
      icon: MapPin,
      placeholder: "e.g. Lahore, Pakistan",
      required: true,
    },
    {
      name: "vacancies",
      label: "Number of Positions",
      type: "number",
      icon: Users,
      placeholder: "e.g. 2",
      required: true,
    },
    {
      name: "experience",
      label: "Experience Required",
      type: "select",
      icon: Clock3,
      placeholder: "Select experience level",
      options: [
        "Fresh Graduate",
        "Entry Level (0-1 years)",
        "1-2 years",
        "2-4 years",
        "4-6 years",
        "6+ years",
      ],
      required: true,
    },
    {
      name: "qualification",
      label: "Required Qualification",
      type: "select",
      icon: GraduationCap,
      placeholder: "Select qualification",
      options: [
        "Intermediate",
        "Bachelor's",
        "Master's",
        "MPhil",
        "PhD",
        "Any Qualification",
      ],
      required: true,
    },
    {
      name: "salary",
      label: "Salary Range",
      type: "text",
      icon: Banknote,
      placeholder: "e.g. 50,000 - 80,000 PKR",
      optional: true,
    },

    // Application Deadline
    // Custom render avoids shared FormLayout's future-date restriction.
    {
      name: "deadline",
      label: "Application Deadline",
      type: "text",
      required: true,

      render: ({ label, error, value, setValue }) => (
        <FieldShell label={label} error={error}>
          <span className="relative block">
            <CalendarDays
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500"
            />

            <input
              type="date"
              value={value || ""}
              onChange={(e) => setValue(e.target.value)}
              aria-invalid={Boolean(error)}
              className={`${inputBase} pl-11 pr-4 ${
                error ? inputError : inputOk
              }`}
            />
          </span>
        </FieldShell>
      ),
    },

    // Required Skills
    {
      name: "skills",
      label: "Required Skills",
      required: true,

      validate: (value) =>
        Array.isArray(value) && value.length > 0
          ? ""
          : "Please add at least one required skill.",

      render: ({ label, error, value = [], setValue }) => {
        const addSkill = () => {
          const newSkill = skillInput.trim();

          // Empty skill add nahi hogi
          if (!newSkill) return;

          // Duplicate skills allow nahi hongi
          const alreadyExists = value.some(
            (skill) =>
              skill.toLowerCase() === newSkill.toLowerCase()
          );

          if (alreadyExists) {
            setSkillInput("");
            return;
          }

          setValue([...value, newSkill]);
          setSkillInput("");
        };

        const removeSkill = (skillToRemove) => {
          setValue(
            value.filter((skill) => skill !== skillToRemove)
          );
        };

        return (
          <FieldShell label={label} error={error}>
            <div className="w-full space-y-3">

              {/* Same shared input styling */}
              <div className="relative block">
                <Code2
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500"
                />

                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. React, JavaScript, Node.js"
                  className={`${inputBase} pl-11 pr-24 ${
                    error ? inputError : inputOk
                  }`}
                />

                {/* Add button inside input */}
                <button
                  type="button"
                  onClick={addSkill}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>

              {/* Added skill chips */}
              {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {value.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700"
                    >
                      {skill}

                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-brand-600 transition-colors hover:text-brand-800"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={15} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FieldShell>
        );
      },
    },

    {
      name: "description",
      label: "Job Description",
      type: "textarea",
      placeholder:
        "Describe the job responsibilities and requirements...",
      rows: 5,
      minLength: 20,
      required: true,
      full: true,
    },
  ];

  // Submit job to backend
  const handleSubmit = async (values) => {
    if (isSubmitting) return;

    setSuccess("");
    setError("");

    const token =
      localStorage.getItem("careerFluxToken") ||
      sessionStorage.getItem("careerFluxToken");

    if (!token) {
      setError(
        "Please login as an employer before publishing a job."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to publish job."
        );
      }

      setSuccess(
        data.message || "Job published successfully!"
      );

      console.log("Saved Job:", data.job);

      onPostJob?.(data.job);
    } catch (err) {
      console.error("Job Publishing Error:", err);

      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <ConfigForm
        title="Job Details"
        description="Fill in the information below to publish a new job opportunity."
        submitLabel="Publish Job"
        submitPlacement="header"
        fields={fields}
        initialValues={{ skills: [] }}
        onSubmit={handleSubmit}
        columns={2}
      />

    </div>
  );
}
