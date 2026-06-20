import PortalLayout from "../../../components/PortalLayout";
import { LayoutDashboard, CheckSquare, BookOpen, CalendarDays } from "lucide-react";

const navItems = [
  { path: "/portal/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/portal/student/attendance", icon: CheckSquare, label: "Attendance" },
  { path: "/portal/student/courses", icon: BookOpen, label: "Courses" },
  { path: "/portal/student/calendar", icon: CalendarDays, label: "Calendar" },
];

export default function StudentLayout() {
  return <PortalLayout role="student" navItems={navItems} />;
}
