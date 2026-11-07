
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import RoleSelectModal from "./RoleSelectModal";

// ==========================================
// DEFAULT NAVIGATION
// ==========================================

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#jobs", label: "Jobs" },
  { href: "/#about", label: "About Us" },
];

const profileLinks = [
  { label: "Dashboard", id: "dashboard", icon: LayoutDashboard },
  { label: "My Profile", id: "profile", icon: User },
  { label: "Account Settings", id: "settings", icon: Settings },
];

// ==========================================
// AUTHENTICATION HELPER
// ==========================================

const getStoredUser = () => {
  try {
    const storedUser =
      localStorage.getItem("careerFluxUser") ||
      sessionStorage.getItem("careerFluxUser");

    if (!storedUser) return null;

    const parsed = JSON.parse(storedUser);

    // Support both direct user objects and wrapped user objects.
    return parsed.user || parsed.data?.user || parsed;
  } catch (error) {
    console.error("Unable to read authenticated user:", error);
    return null;
  }
};

// ==========================================
// MAIN HEADER COMPONENT
// ==========================================

export default function Header({
  onAuth,
  onSearch,
  onNavigate,
  onLogout,
  navItems = navLinks,
  user: userProp,
  role: roleProp,
}) {
  const navigate = useNavigate();

  // UI states
  const [user, setUser] = useState(() => userProp || getStoredUser());

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);

  // ==========================================
  // ROLE DETECTION
  // ==========================================

  const role =
    roleProp ||
    user?.role ||
    user?.userType ||
    user?.type ||
    "jobseeker";

  const normalizedRole =
    role === "provider" ? "employer" : role;

  const isAuthenticated = Boolean(user);

  const isEmployer = normalizedRole === "employer";
  const isJobSeeker = normalizedRole === "jobseeker";

  const dashboardPath = isEmployer
    ? "/employerdashboard"
    : "/jobseekerdashboard";

  const displayName =
    user?.name ||
    user?.firstName ||
    (isEmployer
      ? "Employer"
      : normalizedRole === "admin"
      ? "Admin"
      : "Job Seeker");

  const avatarUrl = user?.avatar || user?.profilePicture;

  // ==========================================
  // LISTEN FOR LOGIN / LOGOUT CHANGES
  // ==========================================

  useEffect(() => {
    const syncAuth = () => {
      setUser(userProp || getStoredUser());
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("careerFluxAuthChange", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("careerFluxAuthChange", syncAuth);
    };
  }, [userProp]);

  // ==========================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ==========================================
  // AUTHENTICATION ACTIONS
  // ==========================================

  const openAuth = (mode) => {
    setMenuOpen(false);

    if (onAuth) {
      onAuth(mode);
      return;
    }

    if (mode === "Login") {
      setRoleOpen(false);
      navigate("/login");
    }

    if (mode === "Register") {
      setRoleOpen(true);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRoleOpen(false);

    const type =
      selectedRole === "provider" ? "employer" : "jobseeker";

    navigate(`/signup?type=${type}`);
  };

 const handleLogout = () => {
  setProfileOpen(false);
  setNotificationsOpen(false);

  // Remove user information
  localStorage.removeItem("careerFluxUser");
  sessionStorage.removeItem("careerFluxUser");

  // Remove authentication tokens
  localStorage.removeItem("careerFluxToken");
  sessionStorage.removeItem("careerFluxToken");

  // Update Header immediately
  setUser(null);

  window.dispatchEvent(
    new Event("careerFluxAuthChange")
  );

  navigate("/");
};

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNavigate = (id) => {
    setProfileOpen(false);
    setNotificationsOpen(false);
    setMenuOpen(false);

    if (id === "dashboard") {
      if (onNavigate) {
        onNavigate(id);
      } else {
        navigate(dashboardPath);
      }
      return;
    }

    // Allow DashboardLayout or parent components
    // to handle their own navigation.
    if (onNavigate) {
      onNavigate(id);
      return;
    }

    if (id === "home") navigate("/#home");
    if (id === "jobs") navigate("/#jobs");
    if (id === "about") navigate("/#about");
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/jobs?search=${encodeURIComponent(query)}`);
    }
  };

  // ==========================================
  // COMMON LOGO
  // ==========================================

  const Logo = () => (
    <button
      type="button"
      onClick={() =>
        isAuthenticated
          ? handleNavigate("dashboard")
          : navigate("/")
      }
      className="group flex shrink-0 items-center gap-2.5 text-left"
      aria-label="CareerFlux home"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-105">
        <Sparkles className="h-5 w-5" />
      </span>

      <span className="flex flex-col">
        <span className="text-[23px] font-extrabold leading-tight tracking-tight text-slate-900">
          Career<span className="text-brand-500">Flux</span>
        </span>

        <span className="-mt-0.5 text-[9px] font-extrabold uppercase tracking-[0.17em] text-stone-400">
          Career &amp; Talent Platform
        </span>
      </span>
    </button>
  );

  // ==========================================
  // GUEST HEADER
  // ==========================================

  if (!isAuthenticated) {
    return (
      <>
        <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-md">

          <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            <Logo />

            {/* Desktop Navigation */}

            <nav className="hidden items-center gap-8 md:flex">
              {navItems.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={
                    index === 0
                      ? "text-sm font-bold text-brand-500"
                      : "text-sm font-semibold text-stone-600 transition hover:text-brand-500"
                  }
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Guest Authentication Buttons */}

            <div className="flex items-center gap-2 sm:gap-3">

              <button
                type="button"
                onClick={() => openAuth("Login")}
                className="rounded-xl px-2.5 py-2 text-sm font-bold text-slate-700 transition hover:text-brand-500 sm:px-4"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => openAuth("Register")}
                className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition hover:-translate-y-0.5 hover:bg-brand-600 sm:px-5"
              >
                Register
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle navigation menu"
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

          {/* Guest Mobile Navigation */}

          {menuOpen && (
            <nav className="border-t border-stone-100 bg-white px-5 py-3 md:hidden">
              {navItems.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-600 hover:bg-brand-50 hover:text-brand-600"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        {/* Registration Role Selection Modal */}

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

  // ==========================================
  // AUTHENTICATED HEADER
  // ==========================================

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-white/95 backdrop-blur-md">

      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        <Logo />

        {/* Authenticated Desktop Navigation */}

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() =>
                handleNavigate(
                  link.label.toLowerCase().replace(" us", "")
                )
              }
              className="text-sm font-semibold text-stone-600 transition hover:text-brand-500"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Authenticated Right Side */}

        <div
          ref={dropdownRef}
          className="flex items-center gap-2 sm:gap-3"
        >

          {/* Search */}

          <form
            onSubmit={handleSearchSubmit}
            className="hidden w-52 items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50/80 px-3.5 py-2 transition-all focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 md:flex lg:w-64"
          >
            <Search className="h-4 w-4 shrink-0 text-brand-500" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={
                isEmployer
                  ? "Search candidates..."
                  : "Search jobs, companies..."
              }
              className="min-w-0 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-stone-400"
              aria-label="Search"
            />
          </form>

          {/* Notifications */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((open) => !open);
                setProfileOpen(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200/80 text-slate-700 transition hover:border-brand-500/40 hover:bg-brand-50 hover:text-brand-500"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white" />
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

          {/* Profile Dropdown */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setProfileOpen((open) => !open);
                setNotificationsOpen(false);
              }}
              className={`flex h-10 items-center gap-2 rounded-full border py-1 pl-1 pr-2 sm:pr-3 ${
                profileOpen
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/15"
                  : "border-stone-200/80 hover:border-stone-300 hover:bg-stone-50"
              }`}
              aria-expanded={profileOpen}
              aria-label="Open user profile menu"
            >

              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${displayName}'s profile`}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-500/20 bg-brand-50 text-brand-500">
                  <User className="h-4 w-4" />
                </span>
              )}

              <span className="hidden text-xs font-bold text-slate-800 sm:inline">
                {displayName}
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 text-stone-400 transition-transform ${
                  profileOpen ? "rotate-180 text-brand-500" : ""
                }`}
              />

            </button>

            {profileOpen && (
              <div className="absolute right-0 z-50 mt-2.5 w-56 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10">

                <div className="border-b border-stone-100 px-3 py-2">

                  <p className="truncate text-xs font-bold text-slate-900">
                    {displayName}
                  </p>

                  <p className="mt-0.5 text-[10px] capitalize text-stone-500">
                    {normalizedRole === "employer"
                      ? "Employer"
                      : normalizedRole === "admin"
                      ? "Admin"
                      : "Job Seeker"}
                  </p>

                </div>

                <div className="space-y-0.5 py-1">

                  {profileLinks.map((link) => {
                    const Icon = link.icon || User;

                    return (
                      <button
                        key={link.id}
                        type="button"
                        onClick={() => handleNavigate(link.id)}
                        className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-500"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-brand-500" />

                        {link.label}
                      </button>
                    );
                  })}

                </div>

                <div className="my-1 border-t border-stone-100" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-brand-500 transition hover:bg-brand-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>

              </div>
            )}
          </div>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-slate-700 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

        </div>
      </div>

      {/* Authenticated Mobile Navigation */}

      {menuOpen && (
        <nav className="border-t border-stone-100 bg-white px-4 py-3 lg:hidden">

          <div className="mx-auto flex max-w-7xl flex-col gap-1">

            {navItems.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() =>
                  handleNavigate(
                    link.label.toLowerCase().replace(" us", "")
                  )
                }
                className="rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-stone-600 transition hover:bg-brand-50 hover:text-brand-500"
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
