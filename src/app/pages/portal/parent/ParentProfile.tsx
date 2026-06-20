import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Save, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function ParentProfile() {
  const { user, updateProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
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
    if (passwordData.current !== "parent123") { setPasswordError("Current password is incorrect"); return; }
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

      {/* Avatar Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6 flex items-center gap-5">
        <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover border-2 border-gold/40" />
        <div>
          <h3 className="font-semibold text-lg">{user?.name}</h3>
          <span className="inline-flex text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-medium mt-1">
            Parent
          </span>
          <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
        </div>
      </motion.div>

      {/* Profile Info */}
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
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={handleProfileSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${profileSaved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold-light"}`}>
            {profileSaved ? <><CheckCircle2 className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Changes</>}
          </button>
        </div>
      </motion.div>

      {/* Security */}
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
          <button onClick={handlePasswordSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${passwordSaved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold-light"}`}>
            {passwordSaved ? <><CheckCircle2 className="w-4 h-4" />Updated!</> : <><Lock className="w-4 h-4" />Update Password</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
