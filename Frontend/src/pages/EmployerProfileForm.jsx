import { useRef, useState } from "react";
import { Briefcase, Mail, Phone, User } from "lucide-react";
import FormLayout from "../components/FormLayout";

const fields = [
  { name: "fullName", label: "Full Name", icon: User, placeholder: "Your full name", autoComplete: "name" },
  { name: "jobTitle", label: "Job Title / Designation", icon: Briefcase, placeholder: "e.g. Head of Talent Acquisition" },
  { name: "email", label: "Work Email", type: "email", icon: Mail, placeholder: "you@company.com", autoComplete: "email" },
  { name: "phone", label: "Direct Phone Number", type: "tel", icon: Phone, placeholder: "+92 300 1234567", autoComplete: "tel" },
];

// Page-specific extra: optional profile photo with default user icon
function PhotoUpload({ photo, setPhoto }) {
  const fileRef = useRef(null);
  const [error, setError] = useState("");

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) setError("Please choose a PNG or JPG image.");
      else if (file.size > 2 * 1024 * 1024) setError("Image must be 2MB or smaller.");
      else {
        setError("");
        setPhoto(URL.createObjectURL(file));
      }
    }
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-brand-200 bg-brand-50">
        {photo ? (
          <img src={photo} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <User size={44} strokeWidth={1.75} className="text-brand-400" aria-label="Default profile icon" />
        )}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:bg-brand-50 hover:text-brand-600"
          >
            {photo ? "Change Photo" : "Upload Photo"}
          </button>
          {/* {photo && (
            <button
              type="button"
              onClick={() => { setPhoto(""); setError(""); }}
              className="rounded-xl px-3 py-2.5 
              text-sm font-semibold text-brand-600 transition-colors 
              hover:bg-brand-50"
            >
              Remove
            </button>
          )} */}
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={handlePhoto} className="hidden" />
        <p className="mt-2 text-xs text-stone-400">Optional. PNG, JPG up to 2MB</p>
        {error && <p className="mt-1 text-sm font-semibold text-brand-700">{error}</p>}
      </div>
    </div>
  );
}

export default function EmployerProfileForm({ initialValues, onSave }) {
  return (
    <FormLayout
      title="Employer Personal Profile"
      description="Personal hiring manager contact details for direct candidate outreach."
      submitLabel="Update Details"
      fields={fields}
      initialValues={{ photo: "", ...initialValues }}
      onSubmit={onSave}
      before={({ values, setValue }) => (
        <PhotoUpload photo={values.photo} setPhoto={(p) => setValue("photo", p)} />
      )}
    />
  );
}