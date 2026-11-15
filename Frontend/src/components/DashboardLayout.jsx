import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
export default function DashboardLayout({
  navigationItems = [],
  activeTab,
  onNavigate,
  workspaceLabel = "Workspace",
  welcomeTitle,
  welcomeSubtitle,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  function handleSidebarClick(label) {
    onNavigate?.(label);
    setSidebarOpen(false);
  }

  return (
    <div className="flex w-full flex-1 flex-col bg-cream font-sans text-slate-900">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
            aria-label="Close sidebar"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed bottom-4 left-4 top-24 z-40 h-[calc(100vh-7rem)] w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-stone-200 bg-brand-500 shadow-floating transition-transform duration-300 lg:sticky lg:bottom-auto lg:left-auto lg:top-24 lg:z-10 lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-soft ${
            sidebarOpen ? "translate-x-0" : "-translate-x-[120%]"
          }`}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="absolute right-3 top-3 z-10 rounded-lg p-2 text-white transition hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
          {/* Scrollbar track  */}
          <div className="custom-sidebar-scrollbar h-full overflow-y-auto bg-brand-500 p-4">
            <p className="mb-3 mt-6 px-2 text-[11px] font-bold uppercase tracking-wider text-white/80">
              {workspaceLabel}
            </p>

            <nav className="space-y-1">
              {navigationItems.map(({ label, icon: Icon }) => {
                const isActive = activeTab === label;

                return (
                  <button
                    type="button"
                    key={label}
                    onClick={() => handleSidebarClick(label)}
                    className={`group relative flex w-full items-center gap-3 
                    rounded-xl border border-l-4 px-3 py-3 text-left text-sm transition duration-200 ${
                      isActive
                        ? "border-white/20 border-l-white bg-white/15 font-semibold text-white"
                        : "border-transparent border-l-transparent font-medium text-white/90 hover:border-white/20 hover:border-l-white hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 space-y-6">
          {/* Welcome heading */}

          {/* Mobile menu button + welcome heading */}
          <div
            className={`flex items-start gap-3 ${
              !(welcomeTitle || welcomeSubtitle) ? "lg:hidden" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="mt-1 rounded-lg border border-stone-200 bg-white p-2 text-slate-600 transition hover:bg-stone-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            {(welcomeTitle || welcomeSubtitle) && (
              <div>
                {welcomeTitle && (
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    {welcomeTitle}
                  </h1>
                )}
                {welcomeSubtitle && (
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {welcomeSubtitle}
                  </p>
                )}
              </div>
            )}
          </div>
          {/* Page-specific content */}
          {children}
        </main>
      </div>
    </div>
  );
}
