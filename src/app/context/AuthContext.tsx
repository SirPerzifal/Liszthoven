import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "admin" | "parent" | "student" | "teacher";

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  bio: string;
}

const DUMMY_USERS: Array<PortalUser & { password: string }> = [
  {
    id: "1",
    email: "admin@liszthovenacademy.com",
    password: "admin123",
    name: "Alexandra Morrison",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    phone: "+1 (555) 234-5678",
    bio: "Music education director with 15 years of experience.",
  },
  {
    id: "2",
    email: "parent@example.com",
    password: "parent123",
    name: "Sarah Johnson",
    role: "parent",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    phone: "+1 (555) 301-2244",
    bio: "Parent of Emily and Lucas, both enrolled at Liszthoven Academy.",
  },
  {
    id: "3",
    email: "student@example.com",
    password: "student123",
    name: "Emily Johnson",
    role: "student",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    phone: "+1 (555) 301-2244",
    bio: "Piano student at Liszthoven Academy, Downtown Branch.",
  },
  {
    id: "4",
    email: "teacher@example.com",
    password: "teacher123",
    name: "James Rodriguez",
    role: "teacher",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
    phone: "+1 (555) 456-7890",
    bio: "Guitar instructor with 10+ years of teaching experience at Liszthoven Academy.",
  },
];

const REDIRECT_MAP: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  parent: "/portal/parent/dashboard",
  student: "/portal/student/dashboard",
  teacher: "/portal/teacher/dashboard",
};

interface AuthContextType {
  user: PortalUser | null;
  login: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string; redirect?: string };
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<PortalUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);

  const login = (email: string, password: string) => {
    const found = DUMMY_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      const { password: _pw, ...userData } = found;
      setUser(userData);
      return { success: true, redirect: REDIRECT_MAP[userData.role] };
    }
    return {
      success: false,
      error:
        "Invalid credentials. Try: parent@example.com / parent123  |  student@example.com / student123  |  teacher@example.com / teacher123",
    };
  };

  const logout = () => setUser(null);
  const updateProfile = (updates: Partial<PortalUser>) => {
    if (user) setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
