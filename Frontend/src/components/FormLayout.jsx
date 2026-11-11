import { useEffect, useRef, useState } from "react";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";
import Dropdown from "./Dropdown";
/*  Shared styles  */
const inputBase =
  "w-full rounded-2xl border bg-stone-50 py-3.5 text-sm font-medium text-slate-800 " +
  "placeholder:text-stone-400 outline-none shadow-none transition-colors focus:bg-white";
const inputOk = "border-stone-200 focus:border-brand-400";
const inputError = "border-brand-300 bg-white focus:border-brand-400";

const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PROFILE_STEPS = ["Employer profile", "Company profile", "Verification (optional)"];

// Today's date in YYYY-MM-DD (local time)
const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
/* pieces */

export function FieldShell({ label, optional, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
        {!optional && <span className="ml-1 text-brand-600" aria-hidden="true">*</span>}
        {optional && (
          <span className="ml-1.5 text-xs font-medium text-stone-400">(Optional)</span>
        )}
      </span>
      {children}
      {error && (
        <span className="mt-2 block text-sm font-semibold text-brand-700">{error}</span>
      )}
    </label>
  );
}

export function TextField({ label, icon: Icon, optional, error, ...inputProps }) {
  return (
    <FieldShell label={label} optional={optional} error={error}>
      <span className="relative block">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500"
          />
        )}
        <input
          {...inputProps}
          aria-invalid={Boolean(error)}
          className={`${inputBase} ${Icon ? "pl-11" : "pl-4"} pr-4 ${
            error ? inputError : inputOk
          }`}
        />
      </span>
    </FieldShell>
  );
}

export function SelectField({
  label, icon, optional, error, options = [], placeholder, value, onChange, id,
}) {
  return (
    <FieldShell label={label} optional={optional} error={error}>
      <Dropdown
        id={id}
        ariaLabel={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon={icon}
        variant="field"
        invalid={Boolean(error)}
        options={[
          { value: "", label: placeholder },
          ...options.map((option) => ({ value: option, label: option })),
        ]}
      />
    </FieldShell>
  );
}

export function TextAreaField({ label, optional, error, maxLength, value = "", rows = 5, ...rest }) {
  return (
    <div>
      <FieldShell label={label} optional={optional} error={error}>
        <div className="relative">
          <textarea
            {...rest}
            rows={rows}
            maxLength={maxLength}
            value={value}
            aria-invalid={Boolean(error)}
            className={`${inputBase} resize-none px-4 pb-8 leading-relaxed ${
              error ? inputError : inputOk
            }`}
          />
          {maxLength && (
            <p className="absolute bottom-2 right-3 text-xs text-stone-400">
              {value.length}/{maxLength}
            </p>
          )}
        </div>
      </FieldShell>
    </div>
  );
}

export function FileField({
  label, optional, error, value, onPick, accept = "application/pdf",
  maxSizeMB = 5, typeLabel = "PDF", onReject,
}) {
  const ref = useRef(null);

  const pick = (file) => {
    if (!file) return;
    if (accept && !accept.split(",").map((a) => a.trim()).includes(file.type)) {
      onReject?.(`Please upload a ${typeLabel} file.`);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      onReject?.(`The file must be ${maxSizeMB}MB or smaller.`);
      return;
    }
    onPick(file);
  };

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
        {!optional && <span className="ml-1 text-brand-600" aria-hidden="true">*</span>}
        {optional && (
          <span className="ml-1.5 text-xs font-medium text-stone-400">(Optional)</span>
        )}
      </span>

      <div
        role="button"
        tabIndex={0}
        onClick={() => ref.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          error
            ? "border-brand-300 bg-white"
            : "border-stone-300 bg-stone-50 hover:border-brand-300 hover:bg-brand-50"
        }`}
      >
        {value ? (
          <>
            <CheckCircle2 size={30} className="text-emerald-600" />
            <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-slate-800">
              <FileText size={16} className="text-stone-400" />
              {value.name}
            </p>
            <p className="mt-1 text-xs text-stone-500">Ready to submit. Click to replace the file.</p>
          </>
        ) : (
          <>
            <UploadCloud size={30} className="text-brand-500" />
            <p className="mt-3 text-sm font-bold text-slate-800">Click to upload or drag and drop</p>
            <p className="mt-1 text-xs text-stone-500">
              {typeLabel} only, up to {maxSizeMB}MB
            </p>
          </>
        )}
      </div>

      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-sm font-semibold text-brand-700">{error}</p>}
    </div>
  );
}

export function ProfileProgress({ completedSections }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const circumference = 2 * Math.PI * 17.5;
  const segmentLength = circumference / PROFILE_STEPS.length;
  const dashLength = segmentLength - 3;

  return (
    <div
      className="group relative shrink-0"
      aria-label={`Profile progress: employer profile ${
        completedSections?.[0] ? "complete" : "incomplete"
      }, company profile ${
        completedSections?.[1] ? "complete" : "incomplete"
      }, verification ${completedSections?.[2] ? "complete" : "optional and incomplete"}.`}
    >
      <svg className="h-[5.5rem] w-[5.5rem] -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
        {PROFILE_STEPS.map((step, index) => {
          const complete = Boolean(completedSections?.[index]);
          const status = complete ? "complete" : index === 2 ? "optional" : "incomplete";
          const color =
            index === 2
              ? complete
                ? "#d97706"
                : "#fcd34d"
              : complete
                ? "#c84b31"
                : "#e7e5e4";

          const segmentProps = {
            cx: "20",
            cy: "20",
            r: "17.5",
            fill: "none",
            strokeDasharray: `${dashLength} ${circumference - dashLength}`,
            strokeDashoffset: -index * segmentLength,
          };

          return (
            <g key={step}>
            <circle
              {...segmentProps}
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              className="transition-[stroke] duration-300"
            />
            <circle
              {...segmentProps}
              stroke="transparent"
              strokeWidth="10"
              strokeLinecap="round"
              pointerEvents="stroke"
              tabIndex={0}
              aria-label={`${step}: ${status}`}
              onMouseEnter={() => setHoveredSegment(`${step}: ${status}`)}
              onMouseLeave={() => setHoveredSegment(null)}
              onFocus={() => setHoveredSegment(`${step}: ${status}`)}
              onBlur={() => setHoveredSegment(null)}
            />
            </g>
          );
        })}
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">
        Progress
      </span>
      {hoveredSegment && (
        <span
          role="tooltip"
          className="absolute right-0 top-full z-30 mt-1 whitespace-nowrap rounded-lg bg-brand-800 px-3 py-2 text-xs font-semibold text-white shadow-lg"
        >
          {hoveredSegment}
        </span>
      )}
    </div>
  );
}

/*  validation */
function validateField(field, value, values) {
  const label = (field.label || field.name).toLowerCase();
  const empty =
    value === null || value === undefined || (typeof value === "string" && !value.trim());

  if (empty) {
    if (field.optional) return "";
    if (field.requiredMessage) return field.requiredMessage;
    if (field.type === "select") return `Please select ${label}.`;
    if (field.type === "file") return `Please upload ${label}.`;
    return `Please enter ${label}.`;
  }

  const bad = field.invalidMessage;
  if (field.type === "email" && !EMAIL_REGEX.test(value))
    return bad || "Please enter a valid email address.";
  if (field.type === "url" && !URL_REGEX.test(value.trim()))
    return bad || "Please enter a valid website URL (e.g. https://company.com).";
  if (field.type === "tel" && value.replace(/\D/g, "").length < 7)
    return bad || "Please enter a valid phone number.";
  if (field.type === "date" && value > todayISO())
  return bad || "The date cannot be in the future.";
  if (field.minLength && value.trim().length < field.minLength)
    return bad || `Please enter at least ${field.minLength} characters.`;

  // Custom rule: return an error string, or "" when fine
  return field.validate ? field.validate(value, values) || "" : "";
}
/*  shared layout. */
export default function FormLayout({
  title,
  description,
  submitLabel = "Save",
  submitPlacement = "header", // "header" | "bottom"
  bottomSubmitClassName = "",
  nextLabel,
  onNext,
  completedSections,
  onCompletionChange,
  fields,
  initialValues = {},
  onSubmit,
  headerTop,
  before,
  after,
  columns = 2,
}) {
  const [values, setValues] = useState(() => {
    const base = {};
    fields.forEach((f) => (base[f.name] = f.type === "file" ? null : ""));
    return { ...base, ...initialValues };
  });
  const [errors, setErrors] = useState({});
  const onCompletionChangeRef = useRef(onCompletionChange);
  onCompletionChangeRef.current = onCompletionChange;

  useEffect(() => {
    onCompletionChangeRef.current?.(
      fields.every((field) => !validateField(field, values[field.name], values))
    );
  }, [fields, values]);

  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    fields.forEach((f) => {
      const msg = validateField(f, values[f.name], values);
      if (msg) next[f.name] = msg;
    });
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit?.(values);
  };

  const isFormValid = fields.every(
    (field) => !validateField(field, values[field.name], values)
  );

  const handleNext = () => {
    const next = {};
    fields.forEach((field) => {
      const message = validateField(field, values[field.name], values);
      if (message) next[field.name] = message;
    });
    setErrors(next);
    if (Object.keys(next).length) return;

    onSubmit?.(values);
    onNext?.(values);
  };

  const slotProps = { values, setValue };

  const renderField = (f) => {
    const common = { label: f.label, optional: f.optional, error: errors[f.name] };

    if (f.render)
      return f.render({
        ...common,
        name: f.name,
        value: values[f.name],
        setValue: (value) => setValue(f.name, value),
      });

    if (f.type === "select")
      return (
        <SelectField
          {...common}
          icon={f.icon}
          name={f.name}
          options={f.options}
          placeholder={f.placeholder || "Select an option"}
          value={values[f.name]}
          onChange={(value) => setValue(f.name, value)}
          id={f.name}
        />
      );

    if (f.type === "textarea")
      return (
        <TextAreaField
          {...common}
          name={f.name}
          rows={f.rows}
          maxLength={f.maxLength}
          placeholder={f.placeholder}
          value={values[f.name]}
          onChange={(e) => setValue(f.name, e.target.value)}
          id={f.name}
        />
      );

    if (f.type === "file")
      return (
        <FileField
          {...common}
          accept={f.accept}
          maxSizeMB={f.maxSizeMB}
          typeLabel={f.typeLabel}
          value={values[f.name]}
          onPick={(file) => setValue(f.name, file)}
          onReject={(msg) => setErrors((p) => ({ ...p, [f.name]: msg }))}
        />
      );

    return (
      <TextField
        {...common}
        icon={f.icon}
        type={f.type || "text"}
        name={f.name}
        placeholder={f.placeholder}
        autoComplete={f.autoComplete}
        max={f.type === "date" ? todayISO() : undefined}
        id={f.name}
        value={values[f.name]}
        onChange={(e) => setValue(f.name, e.target.value)}
        
      />

    );
  };

  const submitBtn = (extra) => (
    <button
      type="submit"
      className={`rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold
         text-white transition-colors hover:bg-brand-600 focus:outline-none 
         focus-visible:ring-2 focus-visible:ring-brand-300 ${extra}`}
    >
      {submitLabel}
    </button>
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-stone-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 items-start justify-between gap-4">
          <div>
          {headerTop}
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
          </div>
          {completedSections && <ProfileProgress completedSections={completedSections} />}
        </div>
        {submitPlacement === "header" && submitBtn("shrink-0 self-start")}
      </div>

      {before && <div className="mt-6">{before(slotProps)}</div>}

      {/* Fields */}
      <div className={`mt-6 grid grid-cols-1 gap-5 ${
        columns === 2 ? "md:grid-cols-2" : ""
      }`}>
        {fields.map((f) => (
          <div
            key={f.name}
            className={columns === 2 && (f.full || f.type === "file" || f.type === "textarea") ? "md:col-span-2" : ""}
          >
            {renderField(f)}
          </div>
        ))}
      </div>

      {submitPlacement === "bottom" && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {submitBtn(
            nextLabel
              ? "min-w-48 px-8"
              : `w-full py-3.5 ${bottomSubmitClassName}`
          )}
          {nextLabel && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid}
              className="min-w-48 rounded-xl bg-brand-500 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
            >
              {nextLabel}
            </button>
          )}
        </div>
      )}

      {after && <div className="mt-8">{after(slotProps)}</div>}
    
    </form>
  );
}