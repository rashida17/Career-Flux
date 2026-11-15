import { useRef, useState } from "react";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";
import Dropdown from "./Dropdown";

const inputBase =
  "w-full rounded-2xl border bg-stone-50 py-3.5 text-sm font-medium text-slate-800 " +
  "placeholder:text-stone-400 outline-none shadow-none transition-colors focus:bg-white";
const inputOk = "border-stone-200 focus:border-brand-400";
const inputError = "border-brand-300 bg-white focus:border-brand-400";
const PROFILE_STEPS = [
  "Employer profile",
  "Company profile",
  "Verification (optional)",
];

export function FieldShell({ label, optional, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
        {!optional && (
          <span className="ml-1 text-brand-600" aria-hidden="true">
            *
          </span>
        )}
        {optional && (
          <span className="ml-1.5 text-xs font-medium text-stone-400">
            (Optional)
          </span>
        )}
      </span>
      {children}
      {error && (
        <span className="mt-2 block text-sm font-semibold text-brand-700">
          {error}
        </span>
      )}
    </label>
  );
}

export function TextField({
  label,
  icon: Icon,
  optional,
  error,
  ...inputProps
}) {
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
  label,
  icon,
  optional,
  error,
  options = [],
  placeholder,
  value,
  onChange,
  id,
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

export function TextAreaField({
  label,
  optional,
  error,
  maxLength,
  value = "",
  rows = 5,
  ...rest
}) {
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
  label,
  optional,
  error,
  value,
  onPick,
  accept = "application/pdf",
  maxSizeMB = 5,
  typeLabel = "PDF",
  onReject,
}) {
  const ref = useRef(null);

  const pick = (file) => {
    if (!file) return;
    if (
      accept &&
      !accept
        .split(",")
        .map((a) => a.trim())
        .includes(file.type)
    ) {
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
        {!optional && (
          <span className="ml-1 text-brand-600" aria-hidden="true">
            *
          </span>
        )}
        {optional && (
          <span className="ml-1.5 text-xs font-medium text-stone-400">
            (Optional)
          </span>
        )}
      </span>

      <div
        role="button"
        tabIndex={0}
        onClick={() => ref.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && ref.current?.click()
        }
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
            <p className="mt-1 text-xs text-stone-500">
              Ready to submit. Click to replace the file.
            </p>
          </>
        ) : (
          <>
            <UploadCloud size={30} className="text-brand-500" />
            <p className="mt-3 text-sm font-bold text-slate-800">
              Click to upload or drag and drop
            </p>
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
      {error && (
        <p className="mt-2 text-sm font-semibold text-brand-700">{error}</p>
      )}
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
      <svg
        className="h-[5.5rem] w-[5.5rem] -rotate-90"
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        {PROFILE_STEPS.map((step, index) => {
          const complete = Boolean(completedSections?.[index]);
          const status = complete
            ? "complete"
            : index === 2
              ? "optional"
              : "incomplete";
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
