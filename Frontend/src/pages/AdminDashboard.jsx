
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import DashboardLayout from '../components/DashboardLayout';

import PlatformChart from '../components/admin/PlatformChart';
import UserDistributionChart from '../components/admin/UserDistributionChart';
import RecentComplaints from '../components/admin/RecentComplaints';
import ManageAccounts from '../components/admin/ManageAccounts';
import CompanyVerification from '../components/admin/CompanyVerification';

import {
  Users,
  UserRound,
  Building2,
  BriefcaseBusiness,
  FileText,
  TrendingUp,
  LayoutDashboard,
  ChartNoAxesColumn,
  MessageSquareWarning,
  ShieldCheck,
  Settings,
} from 'lucide-react';

// Admin Sidebar Fields
const adminNavigationItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Analytics', icon: ChartNoAxesColumn },
  { label: 'Manage Accounts', icon: Users },
  { label: 'Reports & Complaints', icon: MessageSquareWarning },
  { label: 'Company Verification', icon: ShieldCheck },
  { label: 'Settings', icon: Settings },
];

// Statistics
const stats = [
  {
    title: 'Total Users',
    value: '1,248',
    growth: '+12%',
    icon: Users,
  },
  {
    title: 'Job Seekers',
    value: '842',
    growth: '+10%',
    icon: UserRound,
  },
  {
    title: 'Companies',
    value: '286',
    growth: '+8%',
    icon: Building2,
  },
  {
    title: 'Total Jobs',
    value: '3,572',
    growth: '+15%',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Total Applications',
    value: '8,946',
    growth: '+18%',
    icon: FileText,
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    () => location.state?.activeTab || 'Dashboard'
  );

  // Sidebar Navigation
  const handleNavigate = (label) => {
    if (label === 'Manage Accounts') {
      navigate('/admin/manage-accounts');
      return;
    }

    setActiveTab(label);
  };

  return (
    <DashboardLayout
      navigationItems={adminNavigationItems}
      activeTab={activeTab}
      onNavigate={handleNavigate}
      workspaceLabel="Admin Workspace"
      menuTitle="Admin Menu"
      welcomeTitle="Welcome back, Admin!"
      welcomeSubtitle="Here's what's happening with your platform today."
    >

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="flex min-w-0 items-center justify-between rounded-2xl border border-stone-200 border-l-4 border-l-brand-500 bg-white p-4 transition hover:border-brand-200 hover:border-l-brand-500 hover:shadow-soft"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  {stat.value}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-1 text-sm">
                  <TrendingUp size={14} className="shrink-0 text-brand-500" />

                  <span className="font-bold text-brand-600">
                    {stat.growth}
                  </span>

                  <span className="text-xs text-slate-500">
                    vs. last week
                  </span>
                </div>
              </div>

              <div className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashboard */}
      {activeTab === 'Dashboard' && (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <PlatformChart />
            <UserDistributionChart />
          </div>

          <RecentComplaints />

          {/* Recently Added Users - Last 24 Hours */}
          <ManageAccounts mode="recent" />

          <CompanyVerification />
        </>
      )}

      {/* Analytics */}
      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <PlatformChart />
          <UserDistributionChart />
        </div>
      )}

      {/* Reports & Complaints */}
      {activeTab === 'Reports & Complaints' && (
        <RecentComplaints />
      )}

      {/* Company Verification */}
      {activeTab === 'Company Verification' && (
        <CompanyVerification />
      )}

      {/* Settings */}
      {activeTab === 'Settings' && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-bold text-slate-900">
            Settings
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Admin settings will be added here later.
          </p>
        </div>
      )}

    </DashboardLayout>
  );
}
