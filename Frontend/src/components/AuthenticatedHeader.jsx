import { useEffect, useRef, useState } from "react";
import {
  Sparkles, Menu, X, Search, Bell, ChevronDown,
  LayoutDashboard, Settings, LogOut, User,
} from "lucide-react";

const defaultNavLinks = [
  { label: "Home", id: "home" },
  { label: "Jobs", id: "jobs" },
  { label: "About Us", id: "about" },
];

const defaultProfileLinks = [
  { label: "Dashboard", id: "dashboard", icon: LayoutDashboard },
  { label: "My Profile", id: "profile", icon: User },
  { label: "Account Settings", id: "settings", icon: Settings },
];

export default function AuthenticatedHeader({
  user = null,
  role = "jobseeker",
  navLinks = defaultNavLinks,
  profileLinks = defaultProfileLinks,
  onLogout,
  onSearch,
  onNavigate,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    user?.name ||
    user?.firstName ||
    (role === "employer" ? "Employer" : role === "admin" ? "Admin" : "Job Seeker");
  const avatarUrl = user?.avatar || user?.profilePicture;

  const handleNavigate = (id) => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    onNavigate?.(id);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch?.(searchQuery.trim());
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("dashboard")}
          className="group flex shrink-0 items-center gap-2.5 text-left"
          aria-label="CareerFlux dashboard"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C84B31] text-white shadow-md shadow-[#C84B31]/20 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="flex flex-col">
            <span className="text-[23px] font-extrabold leading-tight tracking-tight text-slate-900">
              Career<span className="text-[#C84B31]">Flux</span>
            </span>
            <span className="-mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.17em] text-stone-400">
              Career &amp; Talent Platform
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.id || link.label}
              type="button"
              onClick={() => link.id && handleNavigate(link.id)}
              className="text-sm font-semibold text-stone-600 transition hover:text-[#C84B31]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div ref={dropdownRef} className="flex items-center gap-2 sm:gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden w-52 items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50/80 px-3.5 py-2 transition-all focus-within:border-[#C84B31] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C84B31]/20 md:flex lg:w-64"
          >
            <Search className="h-4 w-4 shrink-0 text-[#C84B31]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search jobs, companies..."
              className="min-w-0 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-stone-400"
              aria-label="Search jobs and companies"
            />
          </form>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((open) => !open);
                setProfileOpen(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200/80 text-slate-700 transition hover:border-[#C84B31]/40 hover:bg-[#FDF3F0] hover:text-[#C84B31]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#C84B31] ring-2 ring-white" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 z-50 mt-2.5 w-72 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xl shadow-stone-900/10">
                <h3 className="border-b border-stone-100 pb-2.5 text-xs font-bold text-slate-900">
                  Notifications
                </h3>
                <p className="mt-3 rounded-xl bg-stone-50 p-3 text-xs text-stone-500">
                  You are all caught up. New notifications will appear here.
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((open) => !open);
                setNotificationsOpen(false);
              }}
              className={`flex h-10 items-center gap-2 rounded-full border py-1 pl-1 pr-2 sm:pr-3 ${
                profileOpen
                  ? "border-[#C84B31] bg-[#FDF3F0]/40 ring-2 ring-[#C84B31]/15"
                  : "border-stone-200/80 hover:border-stone-300 hover:bg-stone-50"
              }`}
              aria-expanded={profileOpen}
              aria-label="Open user profile menu"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={`${displayName}'s profile`} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C84B31]/20 bg-[#FDF3F0] text-[#C84B31]">
                  <User className="h-4 w-4" />
                </span>
              )}
              <span className="hidden text-xs font-bold text-slate-800 sm:inline">
                {displayName}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-stone-400 transition-transform ${profileOpen ? "rotate-180 text-[#C84B31]" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-50 mt-2.5 w-52 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10">
                <div className="border-b border-stone-100 px-3 py-2">
                  <p className="truncate text-xs font-bold text-slate-900">{displayName}</p>
                  <p className="mt-0.5 text-[10px] capitalize text-stone-500">{role}</p>
                </div>
                <div className="space-y-0.5 py-1">
                  {profileLinks.map((link) => {
                    const Icon = link.icon || User;
                    return (
                      <button
                        key={link.id || link.label}
                        type="button"
                        onClick={() => handleNavigate(link.id)}
                        className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-[#FDF3F0] hover:text-[#C84B31]"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-[#C84B31]" />
                        {link.label}
                      </button>
                    );
                  })}
                </div>
                <div className="my-1 border-t border-stone-100" />
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#C84B31] transition hover:bg-[#FDF3F0]"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-slate-700 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-stone-100 bg-white px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id || link.label}
                type="button"
                onClick={() => link.id && handleNavigate(link.id)}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-stone-600 transition hover:bg-[#FDF3F0] hover:text-[#C84B31]"
              >
                {link.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
