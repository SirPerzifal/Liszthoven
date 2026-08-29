import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  User, Mail, Phone, Save, Lock, Eye, EyeOff,
  CheckCircle2, MapPin, Loader2, AlertCircle,
} from "lucide-react";
import { useAuth, odooCall } from "../../../context/AuthContext";
import { Users, Link2, Link2Off } from "lucide-react";

interface ProfileForm {
  name: string;
  phone: string;
  mobile: string;
  street: string;
  city: string;
  zip: string;
}

export default function ParentProfile() {
  const { user, updateProfile, changePassword } = useAuth();

  const [profileData, setProfileData] = useState<ProfileForm>({
    name: user?.name || "",
    phone: user?.phone || "",
    mobile: "",
    street: user?.street || "",
    city: user?.city || "",
    zip: user?.zip || "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");

  const [passwordData, setPasswordData] = useState({ current: "", newPass: "", confirm: "" });
  const [showNew, setShowNew] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Family state
  const [parentRelation, setParentRelation] = useState<"father" | "mother" | "">("");
  const [spouse, setSpouse] = useState<{ id: number; name: string; email: string; relation: string } | null>(null);
  const [spouseEmail, setSpouseEmail] = useState("");
  const [linkingSpouse, setLinkingSpouse] = useState(false);
  const [spouseLinkError, setSpouseLinkError] = useState("");
  const [savingRelation, setSavingRelation] = useState(false);

  // Load full profile including address from API
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoadingProfile(true);
        const res = await odooCall("/liszthoven_custom/parent/profile");
        if (res.success && res.profile) {
          const p = res.profile;
          setProfileData({
            name: p.name || user?.name || "",
            phone: p.phone || "",
            mobile: p.mobile || "",
            street: p.street || "",
            city: p.city || "",
            zip: p.zip || "",
          });
          setParentRelation(p.parent_relation || "");
          setSpouse(p.spouse || null);
        } else {
          setProfileError(res.error || "Failed to load profile.");
        }
      } catch (err: any) {
        setProfileError(err.message || "An error occurred.");
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  const handleProfileSave = async () => {
    setProfileSaveError("");
    setSavingProfile(true);
    try {
      const res = await odooCall("/liszthoven_custom/parent/profile/save", {
        name: profileData.name,
        phone: profileData.phone,
        mobile: profileData.mobile,
        street: profileData.street,
        city: profileData.city,
        zip: profileData.zip,
      });
      if (res.success) {
        // Update in-memory user context
        updateProfile({
          name: profileData.name,
          phone: profileData.phone,
          street: profileData.street,
          city: profileData.city,
          zip: profileData.zip,
        });
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
      } else {
        setProfileSaveError(res.error || "Failed to save profile.");
      }
    } catch (err: any) {
      setProfileSaveError(err.message || "An error occurred.");
    } finally {
      setSavingProfile(false);
    }
  };

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

  const handleSetRelation = async (rel: "father" | "mother") => {
    if (savingRelation) return;
    setSavingRelation(true);
    try {
      const res = await odooCall("/liszthoven_custom/parent/profile/set-relation", { relation: rel });
      if (res.success) setParentRelation(rel);
    } finally {
      setSavingRelation(false);
    }
  };

  const handleLinkSpouse = async () => {
    if (!spouseEmail.trim()) return;
    setSpouseLinkError("");
    setLinkingSpouse(true);
    try {
      const res = await odooCall("/liszthoven_custom/parent/profile/link-spouse", { spouse_email: spouseEmail.trim() });
      if (res.success) {
        setSpouse(res.spouse);
        setSpouseEmail("");
      } else {
        setSpouseLinkError(res.error || "Failed to link spouse.");
      }
    } catch (err: any) {
      setSpouseLinkError(err.message || "An error occurred.");
    } finally {
      setLinkingSpouse(false);
    }
  };

  const handleUnlinkSpouse = async () => {
    setLinkingSpouse(true);
    try {
      await odooCall("/liszthoven_custom/parent/profile/unlink-spouse");
      setSpouse(null);
    } finally {
      setLinkingSpouse(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center space-y-3 max-w-md">
        <AlertCircle className="w-8 h-8 mx-auto" />
        <p className="text-sm">{profileError}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your account information and address</p>
      </div>

      {/* Avatar Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6 flex items-center gap-5">
        <img src={user?.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover border-2 border-gold/40" />
        <div>
          <h3 className="font-semibold text-lg">{profileData.name || user?.name}</h3>
          <span className="inline-flex text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-medium mt-1">
            Parent
          </span>
          <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
        </div>
      </motion.div>

      {/* Profile Info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6 space-y-5">
        <h3 className="font-semibold flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gold" />Contact Information
        </h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />Email Address
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border ml-1">read-only</span>
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Phone & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />Phone
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />Mobile
              </label>
              <input
                type="tel"
                value={profileData.mobile}
                onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ── Address ── */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gold" />Home Address
            <span className="text-xs font-normal text-muted-foreground">(synced to all your children)</span>
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Street / Address</label>
              <input
                type="text"
                value={profileData.street}
                onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                placeholder="e.g. Jl. Sudirman No. 12"
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">City</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  placeholder="e.g. Batam"
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">ZIP / Postal Code</label>
                <input
                  type="text"
                  value={profileData.zip}
                  onChange={(e) => setProfileData({ ...profileData, zip: e.target.value })}
                  placeholder="e.g. 29432"
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {profileSaveError && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />{profileSaveError}
          </p>
        )}

        <div className="flex justify-end pt-2">
          <button
            id="save-profile-btn"
            onClick={handleProfileSave}
            disabled={savingProfile}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 ${
              profileSaved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold/90"
            }`}
          >
            {savingProfile ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
            ) : profileSaved ? (
              <><CheckCircle2 className="w-4 h-4" />Saved!</>
            ) : (
              <><Save className="w-4 h-4" />Save Changes</>
            )}
          </button>
        </div>
      </motion.div>

      {/* Family */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-5 flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-gold" />Family
        </h3>

        {/* Role selector */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2">Your Role</p>
          <div className="flex gap-3">
            {[
              { value: "father", label: "👨 Father" },
              { value: "mother", label: "👩 Mother" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleSetRelation(value as "father" | "mother")}
                disabled={savingRelation}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  parentRelation === value
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border bg-muted text-muted-foreground hover:border-gold/40"
                }`}
              >
                {label}
              </button>
            ))}
            {!parentRelation && (
              <span className="text-xs text-muted-foreground self-center italic">Not set yet</span>
            )}
          </div>
        </div>

        {/* Spouse link */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5" />Spouse / Other Parent
          </p>
          {spouse ? (
            <div className="flex items-center justify-between bg-muted rounded-xl p-4 border border-border">
              <div>
                <p className="font-medium text-sm">{spouse.name}</p>
                <p className="text-xs text-muted-foreground">{spouse.email}</p>
                {spouse.relation && (
                  <span className="text-xs text-gold capitalize">{spouse.relation}</span>
                )}
              </div>
              <button
                onClick={handleUnlinkSpouse}
                disabled={linkingSpouse}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-500 transition-colors"
              >
                <Link2Off className="w-3.5 h-3.5" />Unlink
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={spouseEmail}
                  onChange={e => setSpouseEmail(e.target.value)}
                  placeholder="Enter spouse's email address"
                  className="flex-1 px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  onClick={handleLinkSpouse}
                  disabled={linkingSpouse || !spouseEmail.trim()}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gold text-black rounded-lg text-sm font-semibold hover:bg-gold/90 transition-all disabled:opacity-50"
                >
                  {linkingSpouse ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                  Link
                </button>
              </div>
              {spouseLinkError && <p className="text-xs text-destructive">{spouseLinkError}</p>}
              <p className="text-xs text-muted-foreground/60 italic">
                The other parent must already have a registered account. When linked, your children will be visible to both parents.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
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
            id="update-password-btn"
            onClick={handlePasswordSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              passwordSaved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold/90"
            }`}
          >
            {passwordSaved ? <><CheckCircle2 className="w-4 h-4" />Updated!</> : <><Lock className="w-4 h-4" />Update Password</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
