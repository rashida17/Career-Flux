
import { useState } from "react";
import { BriefcaseBusiness, CheckCircle2, Plus, X } from "lucide-react";
import ConfigForm from "../components/FormLayout";

// Post Job Form Fields
export default function PostJob({ onPostJob }) {
  const [success, setSuccess] = useState("");
  const [skillInput, setSkillInput] = useState("");

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
      name: "department",
      label: "Department",
      type: "text",
      placeholder: "e.g. Software Development",
      required: true,
    },
    {
      name: "jobType",
      label: "Job Type",
      type: "select",
      placeholder: "Select job type",
      options: [
        "Full-time",
        "Part-time",
        "Internship",
        "Contract",
        "Temporary",
      ],
      required: true,
    },
    {
      name: "workMode",
      label: "Work Mode",
      type: "select",
      placeholder: "Select work mode",
      options: ["On-site", "Remote", "Hybrid"],
      required: true,
    },
    {
      name: "location",
      label: "Job Location",
      type: "text",
      placeholder: "e.g. Lahore, Pakistan",
      required: true,
    },
    {
      name: "vacancies",
      label: "Number of Positions",
      type: "number",
      placeholder: "e.g. 2",
      required: true,
    },
    {
      name: "experience",
      label: "Experience Required",
      type: "select",
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
      placeholder: "e.g. 50,000 - 80,000 PKR",
      optional: true,
    },
    {
      name: "deadline",
      label: "Application Deadline",
      type: "date",
      required: true,
    },

    // Required Skills - Interactive skill chips
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

          if (!newSkill) return;

          const alreadyExists = value.some(
            (skill) => skill.toLowerCase() === newSkill.toLowerCase()
          );

          if (alreadyExists) return;

          setValue([...value, newSkill]);
          setSkillInput("");
        };

        const removeSkill = (skillToRemove) => {
          setValue(value.filter((skill) => skill !== skillToRemove));
        };

        return (
          <div>
            <label
              htmlFor="required-skills"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              {label}
            </label>

            <div className="flex gap-2">
              <input
                id="required-skills"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill, e.g. React"
                className={`w-full rounded-2xl border bg-stone-50 px-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-stone-400 outline-none transition-colors focus:bg-white ${
                  error
                    ? "border-brand-300"
                    : "border-stone-200 focus:border-brand-400"
                }`}
              />

              <button
                type="button"
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {value.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {value.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="rounded-full transition-colors hover:text-red-600"
                    >
                      <X size={15} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {value.length === 0 && (
              <p className="mt-2 text-xs text-stone-400">
                Add all skills required for this job. You can add multiple skills.
              </p>
            )}

            {error && (
              <p className="mt-2 text-sm font-semibold text-brand-700">
                {error}
              </p>
            )}
          </div>
        );
      },
    },

    {
      name: "description",
      label: "Job Description",
      type: "textarea",
      placeholder: "Describe the job responsibilities and requirements...",
      rows: 5,
      minLength: 20,
      required: true,
    },
  ];

  const handleSubmit = (values) => {
  console.log("New Job Details:", values);
  console.log("Required Skills:", values.skills);

  onPostJob?.(values);
};
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={20} />
          {success}
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
      />
    </div>
  );
}
