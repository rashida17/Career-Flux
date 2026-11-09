
import {
  LayoutDashboard,
  ChartNoAxesColumn,
  Users,
  MessageSquareWarning,
  ShieldCheck,
  Settings,
  BriefcaseBusiness,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Analytics', icon: ChartNoAxesColumn, id: 'analytics' },
  { label: 'Manage Accounts', icon: Users, id: 'accounts' },
  {
    label: 'Reports & Complaints',
    icon: MessageSquareWarning,
    id: 'complaints',
  },
  {
    label: 'Company Verification',
    icon: ShieldCheck,
    id: 'verification',
  },
];

export default function AdminSidebar({ activeSection, onNavigate }) {
  return (
    <aside className="sticky top-24 flex h-[calc(100vh-7rem)] w-64 shrink-0 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-brand-500 font-sans text-white shadow-soft">


      {/* Navigation Label */}
      <p className="mb-2 mt-3 px-6 text-[11px] font-bold uppercase tracking-wider text-white/80">
        Admin Workspace
      </p>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-white transition duration-200 ${
                active
                  ? 'bg-white/20 font-semibold after:absolute after:bottom-2 after:right-2 after:top-2 after:w-1 after:rounded-full after:bg-white'
                  : 'font-medium hover:bg-white/10'
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-white transition duration-200 ${
            activeSection === 'settings'
              ? 'bg-white/20 font-semibold after:absolute after:bottom-2 after:right-2 after:top-2 after:w-1 after:rounded-full after:bg-white'
              : 'font-medium hover:bg-white/10'
          }`}
        >
          <Settings size={19} />
          Settings
        </button>
      </div>


    </aside>
  );
}
