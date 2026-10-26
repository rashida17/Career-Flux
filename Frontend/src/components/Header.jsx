
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#jobs', label: 'Jobs' },
  { href: '#about', label: 'About Us' },
];

function getLoggedInUser() {
  try {
    const savedUser =
      localStorage.getItem('careerFluxUser') ||
      sessionStorage.getItem('careerFluxUser');

    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export default function Header({ onAuth }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(getLoggedInUser);

  useEffect(() => {
    const syncAuth = () => {
      setUser(getLoggedInUser());
    };

    window.addEventListener('careerFluxAuthChange', syncAuth);
    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('careerFluxAuthChange', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);

    const sectionId = href.substring(1);

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else if (sectionId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('careerFluxUser');
    sessionStorage.removeItem('careerFluxUser');

    setUser(null);
    setMenuOpen(false);

    window.dispatchEvent(new Event('careerFluxAuthChange'));

    navigate('/');
  };

  const handleAuthClick = (action) => {
    setMenuOpen(false);

    if (onAuth) {
      onAuth(action);
    } else if (action === 'Sign In') {
      navigate('/login');
    } else if (action === 'Register') {
      navigate('/signup');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="group flex shrink-0 items-center gap-2.5"
        >
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={
                i === 0
                  ? 'text-sm font-bold text-brand-500'
                  : 'text-sm font-semibold text-stone-600 transition hover:text-brand-500'
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Authentication Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-brand-500 px-3 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:bg-brand-600 sm:px-5"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleAuthClick('Sign In')}
                className="rounded-xl px-2.5 py-2 text-sm font-bold text-slate-700 transition hover:text-brand-500 sm:px-4"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => handleAuthClick('Register')}
                className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-brand-600 sm:px-5"
              >
                Register
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={
              menuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
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

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-stone-100 bg-white px-5 py-3 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
