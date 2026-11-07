import { useRef, useState } from "react";
import {
  Briefcase, Building2, CalendarDays, Globe, Home, Landmark, Layers, Mail, MapPin, Phone, ShieldCheck, Users,
} from "lucide-react";
import FormLayout from "../components/FormLayout";

const fields = [
  {
    name: "logo", label: "Company Logo", type: "file", full: true,
    render: ({ value, setValue, error }) => (
      <LogoUpload logo={value} setLogo={setValue} error={error} />
    ),
  },
  { name: "companyName", label: "Company Name", icon: Building2, placeholder: "e.g. TechCorp Solutions Inc.", autoComplete: "organization" },
  {
    name: "establishedDate", label: "Date Established", type: "date", icon: CalendarDays,
    requiredMessage: "Please select the date your company was established.",
    invalidMessage: "The established date cannot be in the future.",
  },
  {
    name: "ownership", label: "Ownership Type", type: "select", icon: Landmark, placeholder: "Select ownership type",
    options: ["Private Limited", "Public Limited", "Sole Proprietorship", "Partnership", "Government / Public Sector", "Non-Profit / NGO", "Startup"],
  },
  {
    name: "size", label: "Company Size", type: "select", icon: Users, placeholder: "Select company size",
    options: ["1 - 10 Employees", "11 - 50 Employees", "51 - 200 Employees", "201 - 500 Employees", "501 - 1000 Employees", "1000+ Employees"],
  },
  {
    name: "industry", label: "Industry Sector", type: "select", icon: Briefcase, placeholder: "Select industry",
    options: [
      "Information Technology", "Software & Cloud", "Banking & Finance", "Healthcare", "Education",
      "Manufacturing", "Retail & E-commerce", "Telecommunications", "Construction & Real Estate",
      "Marketing & Advertising", "Other",
    ],
  },
  // { name: "department", label: "Department", icon: Layers, placeholder: "e.g. Human Resources" },
    { name: "website", label: "Company Website URL", type: "url", icon: Globe, placeholder: "https://yourcompany.com", optional: true },
  { name: "location", label: "Location", icon: MapPin, placeholder: "City, Country" },
  { name: "address", label: "Office Address", icon: Home, placeholder: "Street, building, area", optional: true, autoComplete: "street-address" },
  { name: "contactEmail", label: "Company Contact Email", type: "email", icon: Mail, placeholder: "hr@yourcompany.com", autoComplete: "email" },
  { name: "contactPhone", label: "Company Phone Number", type: "tel", icon: Phone, placeholder: "+92 300 1234567", autoComplete: "tel" },
  {
    name: "bio", label: "About Company Bio", type: "textarea", maxLength: 600, minLength: 30,
    placeholder: "Tell candidates what your company does, your culture and what makes it a great place to work.",
    invalidMessage: "Please write at least 30 characters about your company.",
  },
  {
    name: "coverImage", label: "Company Cover Image", type: "file", accept: "image/png,image/jpeg",
    maxSizeMB: 5, typeLabel: "PNG or JPG image",
  },
];

function LogoUpload({ logo, setLogo, error: requiredError }) {
  const fileRef = useRef(null);
  const [error, setError] = useState("");

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) setError("Please choose a PNG or JPG image.");
      else if (file.size > 2 * 1024 * 1024) setError("Image must be 2MB or smaller.");
      else {
        setError("");
        setLogo(URL.createObjectURL(file));
      }
    }
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-5">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-brand-200 bg-brand-50">
        {logo ? (
          <img src={logo} alt="Company logo" className="h-full w-full object-cover" />
        ) : (
          <Building2 size={44} strokeWidth={1.75} className="text-brand-400" aria-label="Default company logo icon" />
        )}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-bold text-slate-800 transition-colors hover:bg-brand-50 hover:text-brand-600"
          >
            {logo ? "Change Logo" : "Upload Logo"}
          </button>
          {/* {logo && (
            <button
              type="button"
              onClick={() => { setLogo(""); setError(""); }}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
            >
              Remove
            </button>
          )} */}
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={handleLogo} className="hidden" />
        <p className="mt-2 text-xs text-stone-400">Required. PNG or JPG, up to 2MB</p>
        {error && <p className="mt-1 text-sm font-semibold text-brand-700">{error}</p>}
        {requiredError && <p className="mt-1 text-sm font-semibold text-brand-700">{requiredError}</p>}
      </div>
    </div>
  );
}

//  extra: the verification prompt at the bottom
function VerifyPrompt({ isVerified, onVerify }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-500">
          <ShieldCheck size={22} />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">
            {isVerified ? "Your company is verified" : "Get listed as a Trusted Company"}
          </p>
          <p className="mt-0.5 text-sm text-stone-600">
            {isVerified
              ? "Candidates can see the verified badge on your company profile and jobs."
              : "Verify your company to appear in our trusted companies list and earn the verified badge that candidates look for."}
          </p>
        </div>
      </div>
      {!isVerified && (
        <button
          type="button"
          onClick={onVerify}
          className="shrink-0 rounded-xl border border-brand-500 bg-white px-6 py-3 text-sm font-bold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
        >
          Verify Your Company
        </button>
      )}
    </div>
  );
}

export default function CompanyProfileForm({ initialValues, onSave, onVerify, isVerified = false }) {
  return (
    <FormLayout
      title="Company Profile"
      description="Company details visible to candidates applying to your jobs."
      submitLabel="Save Company Profile"
      fields={fields}
      initialValues={{ ...initialValues, logo: initialValues?.logo || "" }}
      onSubmit={onSave}
      after={() => <VerifyPrompt isVerified={isVerified} onVerify={onVerify} />}
    />
  );
}