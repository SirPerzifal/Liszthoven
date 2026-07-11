import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Music2,
  FileText,
  UserCircle,
  LogOut,
  Menu,
  X,
  Music,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/students", icon: Users, label: "Students" },
  { path: "/admin/attendance", icon: ClipboardList, label: "Attendance" },
  { path: "/admin/instruments", icon: Music2, label: "Instruments" },
  { path: "/admin/calendar", icon: CalendarDays, label: "Calendar" },
  { path: "/admin/articles", icon: FileText, label: "Articles" },
];

export default function AdminLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
            <Music className="w-5 h-5 text-black" />
          </div>
          {(sidebarOpen || mobileSidebarOpen) && (
            <div>
              <div className="text-sm font-semibold text-white">
                Liszthoven Academy
              </div>
              <div className="text-xs text-gold/70">Admin Panel</div>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setMobileSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
              isActive(path)
                ? "bg-gold text-black"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {(sidebarOpen || mobileSidebarOpen) && (
              <span className="text-sm font-medium">{label}</span>
            )}
            {isActive(path) && (sidebarOpen || mobileSidebarOpen) && (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          to="/admin/profile"
          onClick={() => setMobileSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            isActive("/admin/profile")
              ? "bg-gold text-black"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <UserCircle className="w-5 h-5 flex-shrink-0" />
          {(sidebarOpen || mobileSidebarOpen) && (
            <span className="text-sm font-medium">Profile</span>
          )}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-destructive/20 hover:text-destructive transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(sidebarOpen || mobileSidebarOpen) && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  const currentPage =
    [...navItems, { path: "/admin/profile", label: "Profile" }].find(
      (item) => item.path === location.pathname,
    )?.label || "Dashboard";

  return (
    <div className="dark flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-[#0d0d0d] border-r border-white/10 overflow-hidden flex-shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-60 bg-[#0d0d0d] border-r border-white/10 z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex w-9 h-9 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg" style={{ fontStyle: "italic" }}>
              {currentPage}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-muted-foreground">
              {user?.name}
            </span>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gold">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
