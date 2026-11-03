import { useState } from "react";
import { ArrowLeft, Clock, Globe, ShieldCheck } from "lucide-react";
import FormLayout from "../components/FormLayout";

const fields = [
  { name: "website", label: "Company Website URL", type: "url", icon: Globe, placeholder: "https://yourcompany.com", full: true },
  {
    name: "document", label: "Business Incorporation Doc / Tax Clearance (PDF)", type: "file",
    accept: "application/pdf", typeLabel: "PDF", maxSizeMB: 5,
    requiredMessage: "Please upload your legal document as a PDF.",
  },
];

const centerWrapper =
  "w-full " +
  // heading + description centred, title block fills the card so the back link stays left
  // "[&_form>div:first-child>div]:w-full [&_h2]:text-center " +
  // "[&_h2+p]:mx-auto [&_h2+p]:max-w-xl [&_h2+p]:text-center " +
  // fields column centred at a moderate width
  "[&_form>div:nth-child(2)]:mx-auto [&_form>div:nth-child(2)]:max-w-xl " +
  // button centred, auto width
  "[&_form>div:last-child]:flex [&_form>div:last-child]:justify-center " +
  "[&_form>div:last-child>button]:w-xl [&_form>div:last-child>button]:px-10";

export default function CompanyVerification({
  initialWebsite = "",
  status = "none", // "none" | "pending" | "verified"
  onSubmit,
  onBack,
}) {
  const [submitted, setSubmitted] = useState(false);
  const isVerified = status === "verified";
  const isPending = submitted || status === "pending";

  if (isVerified || isPending) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Employer Verification</h2>
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-stone-200 bg-stone-50 px-6 py-12 text-center">
          <span className={`flex h-14 w-14 items-center justify-center rounded-full ${isVerified ? "bg-emerald-100 text-emerald-600" : "bg-brand-100 text-brand-600"}`}>
            {isVerified ? <ShieldCheck size={28} /> : <Clock size={28} />}
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            {isVerified ? "Your company is verified" : "Verification request submitted"}
          </h3>
          <p className="mt-1 max-w-md text-sm text-stone-500">
            {isVerified
              ? "The verified badge is now shown on your company profile and job posts."
              : "Our team is reviewing your documents. This usually takes 1 to 3 business days."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={centerWrapper}>
      <FormLayout
        title="Company Verification"
        description="Provide your company legal credentials to earn the official verified badge and join our trusted companies."
        submitLabel="Submit Verification Request"
        submitPlacement="bottom"
         
        fields={fields}
        initialValues={{ website: initialWebsite }}
        onSubmit={(values) => {
          onSubmit?.({ website: values.website.trim(), document: values.document });
          setSubmitted(true);
        }}
        headerTop={
          onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              <ArrowLeft size={16} /> Back to Company Profile
            </button>
          )
        }
      />
    </div>
  );
}