import PortalLayout from "../../../components/PortalLayout";
import { LayoutDashboard, Baby, BookOpen, CheckSquare, GraduationCap, CalendarDays } from "lucide-react";

const navItems = [
  { path: "/portal/parent/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/portal/parent/children", icon: Baby, label: "My Children" },
  { path: "/portal/parent/enrollment", icon: BookOpen, label: "Enrollment" },
  { path: "/portal/parent/attendance", icon: CheckSquare, label: "Attendance" },
  { path: "/portal/parent/courses", icon: GraduationCap, label: "Courses" },
  { path: "/portal/parent/calendar", icon: CalendarDays, label: "Calendar" },
];

export default function ParentLayout() {
  return <PortalLayout role="parent" navItems={navItems} />;
}
