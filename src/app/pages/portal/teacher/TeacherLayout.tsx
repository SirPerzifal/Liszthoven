import PortalLayout from "../../../components/PortalLayout";
import { LayoutDashboard, Users, ClipboardList, BookOpen, CalendarDays, Newspaper, CalendarSync, TrendingUp, CalendarOff } from "lucide-react";

const navItems = [
  { path: "/portal/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/portal/teacher/students", icon: Users, label: "Students" },
  { path: "/portal/teacher/level-upgrade", icon: TrendingUp, label: "Level Upgrade" },
  { path: "/portal/teacher/attendance", icon: ClipboardList, label: "Attendance" },
  { path: "/portal/teacher/courses", icon: BookOpen, label: "Courses" },
  { path: "/portal/teacher/reschedules", icon: CalendarSync, label: "Reschedules" },
  { path: "/portal/teacher/time-off", icon: CalendarOff, label: "Time Off" },
  { path: "/portal/teacher/calendar", icon: CalendarDays, label: "Calendar" },
  { path: "/portal/teacher/news", icon: Newspaper, label: "News" },
];

export default function TeacherLayout() {
  return <PortalLayout role="teacher" navItems={navItems} />;
}
