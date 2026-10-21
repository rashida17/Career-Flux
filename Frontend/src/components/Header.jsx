import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleSelectModal from "./RoleSelectModal.jsx";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#jobs", label: "Jobs" },
  { href: "/#about", label: "About Us" },
];

export default function Header({ onAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (mode) => {
    if (mode === "Login") {
      setRoleOpen(false);
      navigate("/login");
      return;
    }

    if (mode === "Register") {
      setRoleOpen(true);
    }
  };
  const handleRoleSelect = (role) => {
    setRoleOpen(false);

    const type = role === "provider" ? "employer" : "jobseeker";

    navigate(`/signup?type=${type}`);
  };
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#home" className="group flex shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[23px] font-extrabold tracking-tight text-slate-900">
                Career<span className="text-brand-500">Flux</span>
              </span>
              <span className="-mt-1 text-[9px] font-extrabold uppercase tracking-[0.17em] text-stone-400">
                Career &amp; Talent Platform
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={
                  i === 0
                    ? "text-sm font-bold text-brand-500"
                    : "text-sm font-semibold text-stone-600 transition hover:text-brand-500"
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => handleAuth("Sign In")}
              className="rounded-xl px-2.5 py-2 text-sm font-bold text-slate-700 transition hover:text-brand-500 sm:px-4"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleAuth("Register")}
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-brand-600 sm:px-5"
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-slate-700 md:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="border-t border-stone-100 bg-white px-5 py-3 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
      {roleOpen && (
        <RoleSelectModal
          onSelect={handleRoleSelect}
          onClose={() => setRoleOpen(false)}
          onSignIn={() => {
            setRoleOpen(false);
            navigate("/login");
          }}
        />
      )}
    </>
  );
}
