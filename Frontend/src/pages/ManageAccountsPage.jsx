import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import ManageAccounts from "../components/admin/ManageAccounts";

import {
  LayoutDashboard,
  ChartNoAxesColumn,
  Users,
  MessageSquareWarning,
  ShieldCheck,
  Settings,
} from "lucide-react";

const adminNavigationItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Analytics", icon: ChartNoAxesColumn },
  { label: "Manage Accounts", icon: Users },
  { label: "Reports & Complaints", icon: MessageSquareWarning },
  { label: "Company Verification", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

export default function ManageAccountsPage() {
  const navigate = useNavigate();

  const handleNavigate = (label) => {
    if (label === "Manage Accounts") return;

    navigate("/admin", {
      state: { activeTab: label },
    });
  };

  return (
    <DashboardLayout
      navigationItems={adminNavigationItems}
      activeTab="Manage Accounts"
      onNavigate={handleNavigate}
    >
      <ManageAccounts mode="all" />
    </DashboardLayout>
  );
}
