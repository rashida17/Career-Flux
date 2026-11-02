import { useEffect, useRef } from "react";
import { X, User, Briefcase, ChevronRight, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
const roles = [
  {
    key: "seeker",
    title: "Job Seeker",
    text: "Find jobs, get AI skill guidance and track your applications.",
    icon: User,
  },
  {
    key: "provider",
    title: "Job Provider",
    text: "Post jobs, review applicants and manage your hiring.",
    icon: Briefcase,
  },
];

export default function RoleSelectModal({ onSelect, onSignIn, onClose }) {
  const navigate = useNavigate();
  // your modal keys -> the values the sign up page and database use
  const roleToType = { seeker: "jobseeker", provider: "employer" };

  const handleSelect = (key) => {
    onClose(); // close the modal
    navigate(`/signup?type=${roleToType[key]}`); // open the sign up page
  };
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Always call the latest onClose without re-running the effect below
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden"; // lock page scroll behind the window
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }

      // Keep Tab focus inside the window
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll("button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.(); // return focus to the Register button
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop: click to close */}
      <div
        className="absolute inset-0 bg-slate-900/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Window: a bottom sheet on phones, a centered card on larger screens */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
        className="relative w-full max-w-md rounded-t-3xl border border-stone-200 bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo badge: slate navy circle inside a soft cream ring */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream ring-1 ring-stone-200">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-md shadow-slate-900/20">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        {/* Welcome heading */}
        <div className="mt-5 text-center">
          <h2
            id="role-modal-title"
            className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl"
          >
            Welcome to Career<span className="text-brand-500">Flux</span>
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Select your role to create your account.
          </p>
        </div>

        {/* Role choices: neutral cards, terracotta only on the arrow when hovered */}
        <ul className="mt-6 space-y-3">
          {roles.map(({ key, title, text, icon: Icon }) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => onSelect(key)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-slate-900 hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream text-slate-700 ring-1 ring-stone-200 transition group-hover:bg-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-900">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-stone-600">
                    {text}
                  </span>
                </span>

                <ChevronRight
                  className="h-5 w-5 shrink-0 text-stone-500 transition group-hover:translate-x-0.5 group-hover:text-brand-500"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>

        {/* Existing users */}
        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSignIn}
            className="rounded font-semibold text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
