import { FaCircle } from "react-icons/fa6";

export default function LiveCount({ children }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap text-[11px] font-bold text-emerald-600">
      <span className="relative me-1.5 flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50 motion-reduce:animate-none" />
        <FaCircle className="relative h-2 w-2 text-emerald-500" />
      </span>
      {children}
    </span>
  );
}
