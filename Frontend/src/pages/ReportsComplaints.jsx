
import { useState } from "react";
import {
  UserRound,
  Mail,
  BriefcaseBusiness,
  Flag,
} from "lucide-react";

import ConfigForm from "../components/FormLayout";

// Complaint Form Fields
const fields = [
  {
    name: "jobSeekerName",
    label: "Job Seeker Name",
    type: "text",
    icon: UserRound,
    placeholder: "Enter job seeker's full name",
    required: true,
  },
  {
    name: "jobSeekerEmail",
    label: "Job Seeker Email",
    type: "email",
    icon: Mail,
    placeholder: "Enter registered email address",
    required: true,
  },
  {
    name: "jobTitle",
    label: "Related Job Title",
    type: "text",
    icon: BriefcaseBusiness,
    placeholder: "Enter job title",
    required: true,
  },
  {
    name: "category",
    label: "Complaint Category",
    type: "select",
    icon: Flag,
    placeholder: "Select complaint category",
    options: [
      "Fake or Misleading Information",
      "Fraudulent Documents",
      "Unprofessional Behaviour",
      "Harassment or Misconduct",
      "Repeated No-Shows",
      "Spam or Fake Applications",
      "Other",
    ],
    required: true,
  },
  {
    name: "description",
    label: "Complaint Description",
    type: "textarea",
    placeholder: "Explain the issue in detail...",
    rows: 5,
    maxLength: 1000,
    minLength: 20,
    required: true,
  },
  {
    name: "evidence",
    label: "Supporting Evidence",
    type: "file",
    optional: true,
    accept: ".pdf,.png,.jpg,.jpeg",
    typeLabel: "PDF or Image",
    maxSizeMB: 5,
  },
];

export default function ReportsComplaints() {
  const [success, setSuccess] = useState("");

  const handleSubmit = (values) => {
    console.log("Employer Complaint:", values);

    setSuccess("Your complaint has been submitted successfully!");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      <ConfigForm
        title="Submit a Complaint"
        description="Provide the job seeker's details and explain the issue. Our admin team will review your complaint."
        submitLabel="Submit Complaint"
        submitPlacement="header"
        columns={2}
        fields={fields}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
