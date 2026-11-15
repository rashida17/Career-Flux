import { useEffect, useRef, useState } from "react";
import {
  FileField,
  ProfileProgress,
  SelectField,
  TextAreaField,
  TextField,
} from "./FormFields";

const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

// Today's date in YYYY-MM-DD (local time)
const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

/*  validation */
function validateField(field, value, values) {
  const label = (field.label || field.name).toLowerCase();
  const empty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && !value.trim());

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
    return (
      bad || "Please enter a valid website URL (e.g. https://company.com)."
    );
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
      fields.every(
        (field) => !validateField(field, values[field.name], values),
      ),
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
    (field) => !validateField(field, values[field.name], values),
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
    const common = {
      label: f.label,
      optional: f.optional,
      error: errors[f.name],
    };

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
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-stone-500">{description}</p>
            )}
          </div>
          {completedSections && (
            <ProfileProgress completedSections={completedSections} />
          )}
        </div>
        {submitPlacement === "header" && submitBtn("shrink-0 self-start")}
      </div>

      {before && <div className="mt-6">{before(slotProps)}</div>}

      {/* Fields */}
      <div
        className={`mt-6 grid grid-cols-1 gap-5 ${
          columns === 2 ? "md:grid-cols-2" : ""
        }`}
      >
        {fields.map((f) => (
          <div
            key={f.name}
            className={
              columns === 2 &&
              (f.full || f.type === "file" || f.type === "textarea")
                ? "md:col-span-2"
                : ""
            }
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
              : `w-full py-3.5 ${bottomSubmitClassName}`,
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
