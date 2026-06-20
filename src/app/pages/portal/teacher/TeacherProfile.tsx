import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Save, Lock, Eye, EyeOff, CheckCircle2, Music } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function TeacherProfile() {
  const { user, updateProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: "Classical and contemporary guitar instructor with 10+ years of teaching experience. Specializing in beginner to advanced students, with expertise in fingerstyle, classical, and rock techniques.",
  });

  const [passwordData, setPasswordData] = useState({ current: "", newPass: "", confirm: "" });
  const [showNew, setShowNew] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSave = () => {
    updateProfile(profileData);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handlePasswordSave = () => {
    setPasswordError("");
    if (passwordData.current !== "teacher123") { setPasswordError("Current password is incorrect"); return; }
    if (passwordData.newPass.length < 6) { setPasswordError("New password must be at least 6 characters"); return; }
    if (passwordData.newPass !== passwordData.confirm) { setPasswordError("Passwords do not match"); return; }
    setPasswordSaved(true);
    setPasswordData({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your account information</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6 flex items-center gap-5">
        <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover border-2 border-gold/40" />
        <div>
          <h3 className="font-semibold text-lg">{user?.name}</h3>
          <span className="inline-flex text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium mt-1">
            Teacher
          </span>
          <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm"><Music className="w-4 h-4 text-gold" />Teaching Info</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Instrument", value: "Guitar" },
            { label: "Experience", value: "10+ years" },
            { label: "Students", value: "8 assigned" },
            { label: "Branch", value: "Downtown" },
            { label: "Courses", value: "3 active" },
            { label: "Specialization", value: "Classical & Rock" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-5 flex items-center gap-2 text-sm"><User className="w-4 h-4 text-gold" />Profile Information</h3>
        <div className="space-y-4">
          {[
            { key: "name", label: "Full Name", icon: User, type: "text" },
            { key: "email", label: "Email Address", icon: Mail, type: "email" },
            { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
          ].map(({ key, label, icon: Icon, type }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" />{label}</label>
              <input type={type} value={(profileData as any)[key]} onChange={(e) => setProfileData({ ...profileData, [key]: e.target.value })} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Bio</label>
            <textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows={3} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none" />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={handleProfileSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${profileSaved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold/90"}`}>
            {profileSaved ? <><CheckCircle2 className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Changes</>}
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-5 flex items-center gap-2 text-sm"><Lock className="w-4 h-4 text-gold" />Change Password</h3>
        <div className="space-y-4 max-w-sm">
          {[
            { key: "current", label: "Current Password" },
            { key: "newPass", label: "New Password" },
            { key: "confirm", label: "Confirm New Password" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
              <div className="relative">
                <input type={showNew && key !== "current" ? "text" : "password"} value={(passwordData as any)[key]} onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })} className="w-full px-3 py-2.5 pr-9 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" placeholder="••••••••" />
                {key !== "current" && (
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
          {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={handlePasswordSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${passwordSaved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold/90"}`}>
            {passwordSaved ? <><CheckCircle2 className="w-4 h-4" />Updated!</> : <><Lock className="w-4 h-4" />Update Password</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
