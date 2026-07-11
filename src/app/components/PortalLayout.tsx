import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut, ChevronRight, Music, UserCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth, type UserRole } from "../context/AuthContext";

export interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

interface PortalLayoutProps {
  role: UserRole;
  navItems: NavItem[];
  accentColor?: string;
}

const roleLabels: Record<UserRole, string> = {
  admin: "Admin Panel",
  parent: "Parent Portal",
  student: "Student Portal",
  teacher: "Teacher Portal",
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-gold text-black",
  parent: "bg-blue-500 text-white",
  student: "bg-purple-500 text-white",
  teacher: "bg-emerald-500 text-white",
};

const roleDotColors: Record<UserRole, string> = {
  admin: "bg-gold",
  parent: "bg-blue-400",
  student: "bg-purple-400",
  teacher: "bg-emerald-400",
};

export default function PortalLayout({ role, navItems }: PortalLayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated || user?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const allNavItems = [
    ...navItems,
    {
      path: `${navItems[0].path.split("/").slice(0, -1).join("/")}/profile`,
      icon: UserCircle,
      label: "Profile",
    },
  ];

  const currentLabel =
    allNavItems.find((item) => isActive(item.path))?.label || "Dashboard";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
            <Music className="w-5 h-5 text-black" />
          </div>
          {(sidebarOpen || mobileSidebarOpen) && (
            <div>
              <div className="text-sm font-semibold text-white">
                Liszthoven Academy
              </div>
              <div className="text-xs text-gold/70">{roleLabels[role]}</div>
            </div>
          )}
        </Link>
      </div>

      {/* User Info */}
      {(sidebarOpen || mobileSidebarOpen) && (
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gold/30"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0d0d0d] ${roleDotColors[role]}`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <span
                className={`inline-flex text-xs px-1.5 py-0.5 rounded font-medium mt-0.5 ${roleColors[role]}`}
              >
                {role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
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
            <Icon className="w-4.5 h-4.5 flex-shrink-0 w-5 h-5" />
            {(sidebarOpen || mobileSidebarOpen) && (
              <>
                <span className="text-sm font-medium flex-1">{label}</span>
                {isActive(path) && <ChevronRight className="w-3.5 h-3.5" />}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10 space-y-0.5">
        <Link
          to={`${navItems[0].path.split("/").slice(0, -1).join("/")}/profile`}
          onClick={() => setMobileSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            isActive(
              `${navItems[0].path.split("/").slice(0, -1).join("/")}/profile`,
            )
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
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(sidebarOpen || mobileSidebarOpen) && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="dark flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 68 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-[#0d0d0d] border-r border-white/10 overflow-hidden flex-shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
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

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span
              className="text-base font-medium"
              style={{ fontStyle: "italic" }}
            >
              {currentLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground">
              {user?.email}
            </span>
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-gold/40"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
