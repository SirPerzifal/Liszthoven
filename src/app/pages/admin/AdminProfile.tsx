import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Shield, Camera, Save, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminProfile() {
  const { user, updateProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

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
    if (passwordData.current !== "admin123") {
      setPasswordError("Current password is incorrect");
      return;
    }
    if (passwordData.newPass.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordSaved(true);
    setPasswordData({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const initials = profileData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your account information and security settings</p>
      </div>

      {/* Avatar + Role */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gold"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center">
                <span className="text-gold text-2xl font-bold">{initials}</span>
              </div>
            )}
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-gold rounded-full flex items-center justify-center hover:bg-gold-light transition-colors">
              <Camera className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user?.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-medium">{user?.role}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-4 h-4 text-gold" />
          <h3 className="font-semibold">Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Email Address</span>
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />Phone Number</span>
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Avatar URL</label>
            <input
              type="text"
              value={profileData.avatar}
              onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="https://..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none"
              style={{ fontStyle: "normal" }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleProfileSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              profileSaved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold-light"
            }`}
          >
            {profileSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-4 h-4 text-gold" />
          <h3 className="font-semibold">Security</h3>
        </div>

        <div className="space-y-4 max-w-md">
          {[
            { key: "current", label: "Current Password" },
            { key: "newPass", label: "New Password" },
            { key: "confirm", label: "Confirm New Password" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={showPassword[key as keyof typeof showPassword] ? "text" : "password"}
                  value={passwordData[key as keyof typeof passwordData]}
                  onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                  className="w-full px-3 py-2.5 pr-10 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, [key]: !showPassword[key as keyof typeof showPassword] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword[key as keyof typeof showPassword] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {passwordError && (
            <p className="text-xs text-destructive">{passwordError}</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handlePasswordSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              passwordSaved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold-light"
            }`}
          >
            {passwordSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Password Updated!
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Update Password
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h3 className="font-semibold mb-4">Account Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Account ID", value: user?.id },
            { label: "Role", value: user?.role },
            { label: "Last Login", value: "Today, " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) },
            { label: "Member Since", value: "January 2023" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <p className="text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
