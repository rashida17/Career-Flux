import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import CompanyVerification from "../components/admin/CompanyVerification";
import {
  Users,
  LayoutDashboard,
  ChartNoAxesColumn,
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

export default function AdminCompanyVerification() {
  const navigate = useNavigate();

  const handleNavigate = (label) => {
    if (label === "Company Verification") return;
    if (label === "Manage Accounts") return navigate("/admin/manage-accounts");
    navigate("/admin", { state: { activeTab: label } }); // AdminDashboard opens that tab
  };

  // no welcomeTitle / welcomeSubtitle and no stat cards on this page
  return (
    <DashboardLayout
      navigationItems={adminNavigationItems}
      activeTab="Company Verification"
      onNavigate={handleNavigate}
      workspaceLabel="Admin Workspace"
      menuTitle="Admin Menu"
    >
      <CompanyVerification />
    </DashboardLayout>
  );
}