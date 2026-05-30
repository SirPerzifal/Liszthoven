import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Music, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router";
import FloatingNodes from "../components/FloatingNodes";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (authError) setAuthError("");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = login(formData.email, formData.password);
    if (result.success) {
      navigate(result.redirect || "/admin/dashboard");
    } else {
      setAuthError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
          alt="Login Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-black/90" />
        <FloatingNodes />
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
              <Music className="w-7 h-7 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-xl font-semibold">Harmony Academy</div>
              <div className="text-xs text-gold-light">Music School</div>
            </div>
          </Link>

          <h1 className="text-4xl md:text-5xl mb-3 tracking-tight" style={{ fontStyle: "italic" }}>
            Welcome Back
          </h1>
          <p className="text-white/60">Sign in to access your account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          {/* Demo hint */}
          <div className="mb-6 p-3 rounded-xl bg-gold/10 border border-gold/20 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gold/80 space-y-1">
              <span className="font-semibold text-gold block">Demo credentials:</span>
              <span className="block">Parent: parent@example.com / parent123</span>
              <span className="block">Student: student@example.com / student123</span>
              <span className="block">Teacher: teacher@example.com / teacher123</span>
              <span className="block">Admin: admin@harmonyacademy.com / admin123</span>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-colors text-white placeholder:text-white/40 ${
                  errors.email ? "border-destructive" : "border-white/10 focus:border-gold"
                } focus:outline-none`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-white/5 border transition-colors text-white placeholder:text-white/40 ${
                  errors.password ? "border-destructive" : "border-white/10 focus:border-gold"
                } focus:outline-none`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold"
                />
                <span className="text-sm text-white/70">Remember me</span>
              </label>
              <a href="#" className="text-sm text-gold hover:text-gold-light transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:shadow-gold/20"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-white/60">
              Don't have an account?{" "}
              <Link to="/register" className="text-gold hover:text-gold-light transition-colors font-medium">
                Register for a course
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-white/40 mt-8"
        >
          Protected by industry-standard encryption
        </motion.p>
      </div>
    </div>
  );
}
