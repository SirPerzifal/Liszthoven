import { createBrowserRouter, Navigate } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Lessons from "./pages/Lessons";
import LessonDetail from "./pages/LessonDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Store from "./pages/Store";
import ProductDetail from "./pages/ProductDetail";
import News from "./pages/News";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ParentLayout from "./pages/portal/parent/ParentLayout";
import ParentDashboard from "./pages/portal/parent/ParentDashboard";
import ParentChildren from "./pages/portal/parent/ParentChildren";
import ParentEnrollment from "./pages/portal/parent/ParentEnrollment";
import ParentAttendance from "./pages/portal/parent/ParentAttendance";
import ParentCourses from "./pages/portal/parent/ParentCourses";
import ParentCalendar from "./pages/portal/parent/ParentCalendar";
import ParentProfile from "./pages/portal/parent/ParentProfile";
import StudentLayout from "./pages/portal/student/StudentLayout";
import StudentDashboard from "./pages/portal/student/StudentDashboard";
import StudentAttendance from "./pages/portal/student/StudentAttendance";
import StudentCourses from "./pages/portal/student/StudentCourses";
import StudentCalendar from "./pages/portal/student/StudentCalendar";
import StudentProfile from "./pages/portal/student/StudentProfile";
import TeacherLayout from "./pages/portal/teacher/TeacherLayout";
import TeacherDashboard from "./pages/portal/teacher/TeacherDashboard";
import TeacherStudents from "./pages/portal/teacher/TeacherStudents";
import TeacherAttendance from "./pages/portal/teacher/TeacherAttendance";
import TeacherCourses from "./pages/portal/teacher/TeacherCourses";
import TeacherRescheduleRequests from "./pages/portal/teacher/TeacherRescheduleRequests";
import TeacherCalendar from "./pages/portal/teacher/TeacherCalendar";
import TeacherNews from "./pages/portal/teacher/TeacherNews";
import TeacherProfile from "./pages/portal/teacher/TeacherProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "lessons", Component: Lessons },
      { path: "lessons/:category", Component: Lessons },
      { path: "lessons/:category/:id", Component: LessonDetail },
      { path: "events", Component: Events },
      { path: "events/:category", Component: Events },
      { path: "events/:category/:id", Component: EventDetail },
      { path: "store", Component: Store },
      { path: "store/:id", Component: ProductDetail },
      { path: "news", Component: News },
      { path: "news/:id", Component: ArticleDetail },
      { path: "contact", Component: Contact },
      { path: "register", Component: Register },
      { path: "login", Component: Login },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/portal/parent",
    Component: ParentLayout,
    children: [
      { index: true, element: <Navigate to="/portal/parent/dashboard" replace /> },
      { path: "dashboard", Component: ParentDashboard },
      { path: "children", Component: ParentChildren },
      { path: "enrollment", Component: ParentEnrollment },
      { path: "attendance", Component: ParentAttendance },
      { path: "courses", Component: ParentCourses },
      { path: "calendar", Component: ParentCalendar },
      { path: "profile", Component: ParentProfile },
    ],
  },
  {
    path: "/portal/student",
    Component: StudentLayout,
    children: [
      { index: true, element: <Navigate to="/portal/student/dashboard" replace /> },
      { path: "dashboard", Component: StudentDashboard },
      { path: "attendance", Component: StudentAttendance },
      { path: "courses", Component: StudentCourses },
      { path: "calendar", Component: StudentCalendar },
      { path: "profile", Component: StudentProfile },
    ],
  },
  {
    path: "/portal/teacher",
    Component: TeacherLayout,
    children: [
      { index: true, element: <Navigate to="/portal/teacher/dashboard" replace /> },
      { path: "dashboard", Component: TeacherDashboard },
      { path: "students", Component: TeacherStudents },
      { path: "attendance", Component: TeacherAttendance },
      { path: "courses", Component: TeacherCourses },
      { path: "reschedules", Component: TeacherRescheduleRequests },
      { path: "calendar", Component: TeacherCalendar },
      { path: "news", Component: TeacherNews },
      { path: "profile", Component: TeacherProfile },
    ],
  },
]);
