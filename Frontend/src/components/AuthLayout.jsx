import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

// Animation keyframes (kept inside this file, prefixed "auth" so they never clash with other CSS)
const AUTH_KEYFRAMES = `
@keyframes authSpin { to { transform: rotate(360deg); } }
@keyframes authSpinRev { to { transform: rotate(-360deg); } }
@keyframes authPulseSoft { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes authBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
@keyframes authBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
@keyframes authIconIn { from { opacity: 0; transform: scale(0.5) rotate(-25deg); } to { opacity: 1; transform: none; } }
@keyframes authFadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
`;

// Icons
export const Svg = ({
  size = 17,
  color = "currentColor",
  fill = "none",
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
export const MailIcon = () => (
  <Svg>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Svg>
);
export const LockIcon = () => (
  <Svg>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </Svg>
);
export const EyeIcon = () => (
  <Svg>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
export const EyeOffIcon = () => (
  <Svg>
    <path d="M3 3l18 18M10.6 6.1A10 10 0 0122 12a17 17 0 01-3.2 4M6.5 6.6A17 17 0 002 12s3.6 7 10 7a9.6 9.6 0 004.1-.9" />
  </Svg>
);
export const UserIcon = () => (
  <Svg size={16}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </Svg>
);
export const BriefcaseIcon = () => (
  <Svg size={16}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
  </Svg>
);
export const ArrowIcon = () => (
  <Svg size={16}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const BoltIcon = () => (
  <Svg size={16} fill="currentColor">
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </Svg>
);
export const ChartIcon = () => (
  <Svg size={16}>
    <path d="M3 3v18h18" />
    <path d="M7 15l4-4 3 3 5-6" />
  </Svg>
);
// export const GoogleIcon = () => (
//   <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
//     <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.7 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6C12.3 13.5 17.6 9.5 24 9.5z" />
//     <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
//     <path fill="#FBBC05" d="M10.4 28.8A14.5 14.5 0 019.5 24c0-1.7.3-3.3.9-4.8l-7.8-6A24 24 0 000 24c0 3.9.9 7.5 2.6 10.8l7.8-6z" />
//     <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.6l-7.6-5.9c-2.1 1.4-4.8 2.3-7.7 2.3-6.4 0-11.7-4-13.6-9.8l-7.8 6C6.5 42.600 14.6 48 24 48z" />
//   </svg>
// );

// Icons for animated side
export const BIG_ICONS = {
  globe: (
    <Svg size={34}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </Svg>
  ),
  bulb: (
    <Svg size={34}>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0012 3z" />
    </Svg>
  ),
  rocket: (
    <Svg size={34}>
      <path d="M5 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5M12 15l-3-3a15 15 0 015-8c3-1 6-1 6-1s0 3-1 6a15 15 0 01-8 5z" />
      <circle cx="15" cy="9" r="1.5" />
    </Svg>
  ),
  search: (
    <Svg size={34}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </Svg>
  ),
  users: (
    <Svg size={34}>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21c0-4 3-6 7-6s7 2 7 6M17 4a4 4 0 010 8M22 21c0-3-2-5-5-5.7" />
    </Svg>
  ),
};

// Form shared parts
const fieldBox =
  "flex min-h-[44px] items-center gap-3 rounded-xl border border-brand-100 bg-cream px-3.5 transition focus-within:border-brand-300 focus-within:bg-white sm:rounded-2xl";

export function Field({ icon, password = false, ...inputProps }) {
  const [show, setShow] = useState(false);
  const type = password && show ? "text" : inputProps.type; // show = switch password -> text
  return (
    <label className={`${fieldBox} mb-2.5`}>
      <span className="shrink-0 text-brand-500">{icon}</span>
      <input
        {...inputProps}
        type={type}
        required
        className="min-w-0 w-full bg-transparent py-2 text-sm font-semibold text-slate-800 outline-none placeholder:font-medium placeholder:text-stone-500"
      />
      {password && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="shrink-0 text-stone-400 transition hover:text-brand-500"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </label>
  );
}

// export const GoogleButton = () => (
//   <button type="button" className="flex min-h-[44px] w-full items-center justify-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-semibold text-slate-800 transition hover:border-brand-300 hover:bg-white sm:rounded-2xl">
//     <GoogleIcon /> Google
//   </button>
// );

// export const Divider = ({ children }) => (
//   <div className="my-3 flex items-center gap-3 text-xs font-semibold text-stone-500 before:h-px before:flex-1 before:bg-stone-200 after:h-px after:flex-1 after:bg-stone-200">{children}</div>
// );

export const FormError = ({ message }) =>
  message ? (
    <p role="alert" className="mb-2 text-[13px] font-semibold text-brand-700">
      {message}
    </p>
  ) : null;

export const SubmitButton = ({ children }) => (
  <button
    type="submit"
    className="mt-1.5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 sm:rounded-2xl"
  >
    {children} <ArrowIcon />
  </button>
);

// Animated side
function AuthShowcase({ badge, slides }) {
  const [slide, setSlide] = useState(0);
  const current = slides[slide];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setSlide((s) => (s + 1) % slides.length),
      4500,
    );
    return () => clearInterval(id);
  }, [slide, slides.length]);

  const k = `${badge}-${slide}`;

  return (
    <aside className="relative flex flex-col overflow-hidden bg-linear-to-br from-brand-500 via-brand-600 to-brand-800 px-4 py-5 text-white min-[761px]:px-6 min-[761px]:pb-6 min-[761px]:pt-5">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-brand-900/50 to-transparent" />

      {/* Badge */}
      <span className="relative z-10 inline-flex items-center gap-2 self-end rounded-full border border-brand-200 bg-brand-100 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.09em] text-brand-700 shadow-sm sm:text-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-50 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
        </span>
        {badge}
      </span>

      <div className="relative z-10 flex min-h-[210px] flex-1 items-center justify-center py-3">
        <div className="relative h-[200px] w-[200px]">
          <div className="absolute left-0 top-0 h-[250px] w-[250px] origin-top-left scale-[.8]">
            <div className="absolute inset-0 m-auto h-[250px] w-[250px] animate-[authSpin_40s_linear_infinite] rounded-full border border-dashed border-white/35 motion-reduce:animate-none" />
            <div className="absolute inset-0 m-auto h-[200px] w-[200px] animate-[authSpinRev_26s_linear_infinite] rounded-full border border-white/40 motion-reduce:animate-none" />
            <div className="absolute inset-0 m-auto grid h-[164px] w-[164px] animate-[authPulseSoft_4s_ease-in-out_infinite] place-items-center overflow-hidden rounded-full bg-brand-600 shadow-[inset_0_0_0_1px_rgba(255,255,255,.4)] drop-shadow-xl motion-reduce:animate-none">
              {/* spinning glow */}
              <div className="absolute -inset-[30%] animate-[authSpin_9s_linear_infinite] bg-conic from-brand-300 via-brand-600 to-brand-300 motion-reduce:animate-none" />
              <div className="relative z-10 grid h-[92px] w-[92px] animate-[authBreathe_3.2s_ease-in-out_infinite] place-items-center rounded-full border border-white/40 bg-white/20 text-white motion-reduce:animate-none">
                <span
                  key={k}
                  className="grid animate-[authIconIn_0.5s_ease] motion-reduce:animate-none"
                >
                  {BIG_ICONS[current.icon]}
                </span>
              </div>
            </div>
            <span className="absolute -right-2 top-6 grid h-[38px] w-[38px] animate-[authBob_3.4s_ease-in-out_infinite] place-items-center rounded-full border border-white/45 bg-white/20 text-white shadow-lg motion-reduce:animate-none">
              <BoltIcon />
            </span>
            <span className="absolute -left-6 bottom-12 grid h-[38px] w-[38px] animate-[authBob_4.2s_ease-in-out_-1.5s_infinite] place-items-center rounded-full border border-white/45 bg-white/20 text-white shadow-lg motion-reduce:animate-none">
              <ChartIcon />
            </span>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 min-h-[100px] text-center"
        aria-live="polite"
      >
        <div
          key={k}
          className="animate-[authFadeUp_0.4s_ease] motion-reduce:animate-none"
        >
          <h2 className="mb-1.5 text-lg font-extrabold tracking-tight">
            {current.title}
          </h2>
          <p className="mx-auto max-w-[38ch] text-[13px] leading-relaxed text-brand-100">
            {current.text}
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-3 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setSlide(i)}
            className={`h-[7px] rounded-full transition-all ${i === slide ? "w-[26px] bg-white" : "w-[7px] bg-white/50"}`}
          />
        ))}
      </div>
    </aside>
  );
}

// Shared layout
const ROLES = [
  ["seeker", "Job Seeker", <UserIcon />],
  ["employer", "Job Provider", <BriefcaseIcon />],
];

export default function AuthLayout({
  title,
  role,
  onRoleChange,
  showcase,
  footer,
  children,
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <style>{AUTH_KEYFRAMES}</style>
      <Header />

      <main className="hero-bg flex flex-1 items-center justify-center px-5 pb-10 pt-6">
        <div className="grid min-h-[520px] w-full max-w-[840px] grid-cols-1 overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-floating min-[521px]:grid-cols-2">
          <section className="flex flex-col justify-center px-5 py-6 min-[761px]:px-8 min-[761px]:py-7">
            <h1 className="mb-3 text-2xl font-extrabold tracking-[-0.03em] text-slate-900">
              {title}
            </h1>

            {/* Role toggle: shown ONLY if the page passes onRoleChange */}
            {onRoleChange && (
              <div
                role="group"
                aria-label="I am a"
                className="mb-4 flex gap-1 rounded-xl border border-brand-100 bg-cream p-1"
              >
                {ROLES.map(([key, label, icon]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={role === key}
                    onClick={() => onRoleChange(key)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                      role === key
                        ? "bg-brand-500 text-white shadow-sm"
                        : "text-stone-600 hover:bg-brand-50 hover:text-brand-700"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            )}

            {children}
            <p className="mt-4 border-t border-brand-100 pt-3 text-center text-[13px] text-stone-500">
              {footer}
            </p>
          </section>

          {/* key resets the slide to 0 when the role changes */}
          <AuthShowcase
            key={role ?? "single"}
            badge={showcase.badge}
            slides={showcase.slides}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
