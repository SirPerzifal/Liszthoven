import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2,
  MapPin, Loader2, GraduationCap, BookOpen,
} from "lucide-react";
import { useAuth, odooCall } from "../../../context/AuthContext";

interface StudentInfo {
  level: string;
  status: string;
  school: string;
  join_date: string;
  street: string;
  city: string;
  zip: string;
  parent_name: string;
  phone: string;
}

export default function StudentProfile() {
  const { user, changePassword } = useAuth();

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [passwordData, setPasswordData] = useState({ current: "", newPass: "", confirm: "" });
  const [showNew, setShowNew] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const res = await odooCall("/liszthoven_custom/student/courses");
        if (res && res.success && res.courses && res.courses.length > 0) {
          const first = res.courses[0];
          setStudentInfo({
            level: first.level || "Beginner",
            status: "Active",
            school: "",
            join_date: "",
            street: res.street || "",
            city: res.city || "",
            zip: res.zip || "",
            parent_name: res.parent_name || "",
            phone: user?.phone || "",
          });
        } else {
          // Fallback: use session data
          setStudentInfo({
            level: "—",
            status: "Active",
            school: "",
            join_date: "",
            street: (user as any)?.street || "",
            city: (user as any)?.city || "",
            zip: (user as any)?.zip || "",
            parent_name: "",
            phone: user?.phone || "",
          });
        }
      } catch {
        setStudentInfo({
          level: "—",
          status: "Active",
          school: "",
          join_date: "",
          street: (user as any)?.street || "",
          city: (user as any)?.city || "",
          zip: (user as any)?.zip || "",
          parent_name: "",
          phone: user?.phone || "",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStudentData();
  }, [user]);

  const handlePasswordSave = async () => {
    setPasswordError("");
    if (!passwordData.current) { setPasswordError("Current password is required"); return; }
    if (passwordData.newPass.length < 6) { setPasswordError("New password must be at least 6 characters"); return; }
    if (passwordData.newPass !== passwordData.confirm) { setPasswordError("Passwords do not match"); return; }

    const res = await changePassword(passwordData.current, passwordData.newPass);
    if (res.success) {
      setPasswordSaved(true);
      setPasswordData({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setPasswordSaved(false), 2500);
    } else {
      setPasswordError(res.error || "Failed to update password");
    }
  };

  const hasAddress = studentInfo && (studentInfo.street || studentInfo.city || studentInfo.zip);
  const addressLine = [studentInfo?.street, studentInfo?.city, studentInfo?.zip].filter(Boolean).join(", ");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Profile</h2>
        <p className="text-sm text-muted-foreground">Your account information and details</p>
      </div>

      {/* ── Avatar + Identity Card ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-purple-500 via-gold to-purple-400" />

        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-gold/30 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card" />
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="font-bold text-xl leading-tight">{user?.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="inline-flex text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-medium">
                  Student
                </span>
                {studentInfo?.level && studentInfo.level !== "—" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full font-medium">
                    <GraduationCap className="w-3 h-3" />
                    {studentInfo.level}
                  </span>
                )}
              </div>
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" />{user?.email}
              </span>
              {user?.phone && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" />{user.phone}
                </span>
              )}
            </div>

            {/* Address row */}
            {hasAddress && (
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-gold" />
                <span>{addressLine}</span>
              </div>
            )}
            {!hasAddress && !loading && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50 italic">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                No address on file — your parent can add it from their profile
              </div>
            )}
          </div>
        </div>

        {/* Address detail row */}
        {hasAddress && (
          <div className="px-6 pb-5">
            <div className="bg-muted rounded-xl p-4 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-gold" />Home Address
                <span className="text-[10px] normal-case font-normal text-muted-foreground/60 ml-1">(from parent profile)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Street", value: studentInfo?.street },
                  { label: "City", value: studentInfo?.city },
                  { label: "ZIP", value: studentInfo?.zip },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
                    <p className="text-sm font-medium">{value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Info Cards ── */}
      {loading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center justify-center h-24 bg-card rounded-xl border border-border">
          <Loader2 className="w-5 h-5 text-gold animate-spin" />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-gold" />Student Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Level", value: studentInfo?.level || "—" },
              { label: "Status", value: studentInfo?.status || "—" },
              { label: "Email", value: user?.email || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium mt-0.5 truncate">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Change Password ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-5 flex items-center gap-2 text-sm">
          <Lock className="w-4 h-4 text-gold" />Change Password
        </h3>
        <div className="space-y-4 max-w-sm">
          {[
            { key: "current", label: "Current Password" },
            { key: "newPass", label: "New Password" },
            { key: "confirm", label: "Confirm New Password" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={showNew && key !== "current" ? "text" : "password"}
                  value={(passwordData as any)[key]}
                  onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 pr-9 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="••••••••"
                />
                {key !== "current" && (
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
          {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
        </div>
        <div className="flex justify-end mt-5">
          <button
            id="student-update-password-btn"
            onClick={handlePasswordSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${passwordSaved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold/90"}`}
          >
            {passwordSaved ? <><CheckCircle2 className="w-4 h-4" />Updated!</> : <><Lock className="w-4 h-4" />Update Password</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
