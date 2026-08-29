import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "parent" | "student" | "teacher";

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  bio: string;
  street: string;
  city: string;
  zip: string;
}

const REDIRECT_MAP: Record<UserRole, string> = {
  parent: "/portal/parent/dashboard",
  student: "/portal/student/dashboard",
  teacher: "/portal/teacher/dashboard",
};

interface AuthContextType {
  user: PortalUser | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; redirect?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<PortalUser>) => void;
  loading: boolean;
  changePassword: (
    current: string,
    newPass: string,
  ) => Promise<{ success: boolean; error?: string }>;
  registerSuccess: (user: PortalUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export async function odooCall(url: string, params: any = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: params,
    }),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message || "Request failed");
  }
  return data.result;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    odooCall("/liszthoven_custom/auth/session")
      .then((res) => {
        if (res && res.success && res.user) {
          setUser(res.user);
        }
      })
      .catch((err) => {
        console.error("Session check failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await odooCall("/liszthoven_custom/auth/login", { email, password });
      if (res && res.success && res.user) {
        setUser(res.user);
        return { success: true, redirect: REDIRECT_MAP[res.user.role] };
      }
      return { success: false, error: res?.error || "Login failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logout = async () => {
    try {
      await odooCall("/liszthoven_custom/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = (updates: Partial<PortalUser>) => {
    if (user) setUser({ ...user, ...updates });
  };

  const changePassword = async (current: string, newPass: string) => {
    try {
      const res = await odooCall("/liszthoven_custom/auth/change_password", {
        current_password: current,
        new_password: newPass,
      });
      if (res && res.success) {
        return { success: true };
      }
      return { success: false, error: res?.error || "Failed to update password" };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const registerSuccess = (u: PortalUser) => {
    setUser(u);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, updateProfile, loading, changePassword, registerSuccess }}
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
