import { useState } from "react";
import { Menu, X } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
 
export default function DashboardLayout({
  navigationItems = [],
  activeTab,
  onNavigate,
  workspaceLabel = "Workspace",
  menuTitle = "Menu",
  welcomeTitle,
  welcomeSubtitle,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  function handleSidebarClick(label) {
    onNavigate?.(label);
    setSidebarOpen(false);
  }
 
  return (
    <div className="min-h-screen bg-cream font-sans text-slate-900">
      <Header />
 
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
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
          className={`fixed bottom-0 left-0 top-0 z-40 w-72 overflow-hidden rounded-r-2xl bg-brand-500 shadow-floating transition-transform duration-300 lg:sticky lg:top-24 lg:z-10 lg:h-[calc(100vh-7rem)] lg:w-64 lg:shrink-0 lg:rounded-2xl lg:border lg:border-stone-200 lg:shadow-soft ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          {/* Scrollbar track  */}
          <div className="custom-sidebar-scrollbar h-full overflow-y-auto bg-brand-500 p-4">
            <div className="mb-5 flex items-center justify-between text-white lg:hidden">
              <span className="font-bold">{menuTitle}</span>
 
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-white transition hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
 
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
          {(welcomeTitle || welcomeSubtitle) && (
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="mt-1 rounded-lg border border-stone-200 bg-white
               p-2 text-slate-600 transition hover:bg-stone-50 lg:hidden"
            >
              <Menu size={20} />
            </button>
 
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
          </div>
            )}
          {/* Page-specific content */}
          {children}
        </main>
      </div>
 
      <Footer />
    </div>
  );
}