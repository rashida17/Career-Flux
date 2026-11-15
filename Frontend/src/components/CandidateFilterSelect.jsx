import { ChevronDown } from "lucide-react";

export default function CandidateFilterSelect({
  label,
  value,
  onChange,
  placeholder,
  options,
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-slate-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-stone-200 bg-cream px-3 py-2.5 pr-9 text-xs font-semibold text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => {
            const option =
              typeof opt === "string" ? { value: opt, label: opt } : opt;
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}