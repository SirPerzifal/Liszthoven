import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Music,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  RefreshCw,
  Building2,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import FloatingNodes from "../components/FloatingNodes";
import { odooCall, useAuth } from "../context/AuthContext";

const steps = [
  { id: 1, name: "Your Info", title: "Create Your Account" },
  { id: 2, name: "Verify", title: "Verify Your Phone" },
  { id: 3, name: "Done", title: "Account Created!" },
];

export default function Register() {
  const navigate = useNavigate();
  const { registerSuccess } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState("");
  const [resent, setResent] = useState(false);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+62");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    branchId: "",
    parentRelation: "" as "father" | "mother" | "",
  });

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await odooCall("/liszthoven_custom/branches");
        if (res && res.success) {
          setBranches(res.branches);
        }
      } catch (err) {
        console.error("Failed to load branches:", err);
      }
    }
    loadBranches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (errors.submit) setErrors({ ...errors, submit: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.branchId) newErrors.branchId = "Please select a branch";
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (phoneDigits.length < 5) newErrors.phone = "Enter a valid phone number";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitiate = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setErrors({});

      let localNum = formData.phone.trim();
      // Auto-strip leading '0' or matching country prefix if user accidentally enters it
      if (localNum.startsWith("0")) {
        localNum = localNum.substring(1);
      }
      if (localNum.startsWith(countryCode)) {
        localNum = localNum.substring(countryCode.length);
      }
      localNum = localNum.replace(/\D/g, "");
      const fullPhone = `${countryCode}${localNum}`;

      const res = await odooCall("/liszthoven_custom/auth/register/initiate", {
        name: formData.name,
        phone: fullPhone,
        email: formData.email,
        password: formData.password,
        branch_id: formData.branchId,
        parent_relation: formData.parentRelation || false,
      });
      if (res && res.success) {
        setFormData(prev => ({ ...prev, phone: fullPhone }));
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        setCurrentStep(2);
      } else {
        setErrors({ submit: res?.error || "Registration failed. Please try again." });
      }
    } catch (err: any) {
      setErrors({ submit: err.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter the 6-digit verification code.");
      return;
    }
    try {
      setLoading(true);
      setOtpError("");
      const res = await odooCall("/liszthoven_custom/auth/register/verify", {
        otp: code,
      });
      if (res && res.success) {
        setCurrentStep(3);
      } else {
        setOtpError(res?.error || "Verification failed. Try again.");
      }
    } catch (err: any) {
      setOtpError(err.message || "An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResent(true);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      await odooCall("/liszthoven_custom/auth/register/initiate", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        branch_id: formData.branchId,
      });
      setTimeout(() => setResent(false), 3000);
    } catch (err: any) {
      setOtpError("Failed to resend verification code.");
      setResent(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-primary-foreground flex items-center justify-center relative overflow-hidden py-12 px-4">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
          alt="Register background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-black/90" />
        <FloatingNodes />
      </div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
              <Music className="w-7 h-7 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-xl font-semibold">Liszthoven Academy</div>
              <div className="text-xs text-gold-light">Music School</div>
            </div>
          </Link>
          <h1
            className="text-4xl md:text-5xl mb-3 tracking-tight"
            style={{ fontStyle: "italic" }}
          >
            {steps[currentStep - 1].title}
          </h1>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-semibold transition-all ${
                  currentStep > step.id
                    ? "bg-gold border-gold text-black"
                    : currentStep === step.id
                      ? "border-gold text-gold"
                      : "border-white/20 text-white/40"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-xs hidden sm:block ${currentStep >= step.id ? "text-white/80" : "text-white/30"}`}
              >
                {step.name}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-px ${currentStep > step.id ? "bg-gold" : "bg-white/20"}`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1 — Account info */}
            {currentStep === 1 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                <p className="text-sm text-white/60 mb-6">
                  Select your branch and fill in your details to create a parent account
                </p>

                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs mb-4">
                    {errors.submit}
                  </div>
                )}

                <div className="space-y-4">
                  {/* ── Parent Role Selector ── */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Your Role <span className="text-white/40 text-xs font-normal">(optional — can be set later)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { value: "father", label: "👨 Father" },
                        { value: "mother", label: "👩 Mother" },
                      ] as const).map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, parentRelation: prev.parentRelation === value ? "" : value }))}
                          className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${
                            formData.parentRelation === value
                              ? "border-gold bg-gold/15 text-gold shadow-lg shadow-gold/10"
                              : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/8"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Branch ── */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gold" />
                      Select Branch
                    </label>
                    <select
                      name="branchId"
                      value={formData.branchId}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 focus:outline-none transition-colors appearance-none ${errors.branchId ? "border-red-500" : "border-white/10 focus:border-gold"}`}
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="" className="bg-primary text-white/60">Choose your academy branch</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id} className="bg-primary text-white">
                          {b.name}
                        </option>
                      ))}
                    </select>
                    {errors.branchId && (
                      <p className="text-xs text-red-400 mt-1">{errors.branchId}</p>
                    )}
                  </div>

                  {/* ── Full Name ── */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-gold" />
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 focus:outline-none transition-colors ${errors.name ? "border-red-500" : "border-white/10 focus:border-gold"}`}
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* ── Phone ── */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold" />
                      Mobile Number (WhatsApp)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-3 py-3 rounded-lg bg-[#141517] border border-white/10 text-white focus:outline-none focus:border-gold transition-colors text-sm w-[110px]"
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="+62">+62 🇮🇩</option>
                        <option value="+65">+65 🇸🇬</option>
                        <option value="+60">+60 🇲🇾</option>
                        <option value="+1">+1 🇺🇸</option>
                        <option value="+44">+44 🇬🇧</option>
                        <option value="+61">+61 🇦🇺</option>
                        <option value="+81">+81 🇯🇵</option>
                        <option value="+82">+82 🇰🇷</option>
                        <option value="+86">+86 🇨🇳</option>
                        <option value="+852">+852 🇭🇰</option>
                        <option value="+66">+66 🇹🇭</option>
                        <option value="+63">+63 🇵🇭</option>
                        <option value="+84">+84 🇻🇳</option>
                        <option value="+91">+91 🇮🇳</option>
                      </select>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="812-3456-7890"
                        className={`flex-1 px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 focus:outline-none transition-colors ${errors.phone ? "border-red-500" : "border-white/10 focus:border-gold"}`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  {/* ── Email ── */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold" />
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 focus:outline-none transition-colors ${errors.email ? "border-red-500" : "border-white/10 focus:border-gold"}`}
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  {/* ── Password ── */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gold" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
                        className={`w-full px-4 py-3 pr-11 rounded-lg bg-white/5 border text-white placeholder:text-white/40 focus:outline-none transition-colors ${errors.password ? "border-red-500" : "border-white/10 focus:border-gold"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                  </div>
                </div>
                <button
                  onClick={handleInitiate}
                  className="w-full mt-6 bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center justify-center gap-2 shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-white/50 mt-4">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-gold hover:text-gold-light transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            )}

            {/* Step 2 — OTP verification */}
            {currentStep === 2 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl text-center">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 mx-auto mb-4">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <p className="text-sm text-white/60 mb-1">
                  We sent a verification code via WhatsApp to
                </p>
                <p className="font-medium text-gold mb-6">
                  {formData.phone || "your phone number"}
                </p>

                <div className="flex gap-2 justify-center mb-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-12 text-center text-lg font-semibold rounded-lg bg-white/5 border focus:outline-none transition-colors ${otpError ? "border-red-500" : "border-white/20 focus:border-gold"} text-white`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-xs text-red-400 mb-4">{otpError}</p>
                )}
                <p className="text-xs text-white/40 mb-6">
                  Demo code: <span className="text-gold font-mono">123456</span>
                </p>

                <button
                  onClick={handleVerify}
                  className="w-full bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center justify-center gap-2 shadow-xl mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleResend}
                    className={`flex items-center gap-1.5 text-sm transition-colors ${resent ? "text-green-400" : "text-white/50 hover:text-gold"}`}
                    disabled={resent || loading}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${resent ? "animate-spin" : ""}`}
                    />
                    {resent ? "Code sent!" : "Resend code"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Success */}
            {currentStep === 3 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/40 mx-auto mb-5"
                >
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>
                <h3
                  className="text-2xl font-semibold mb-2"
                  style={{ fontStyle: "italic" }}
                >
                  Welcome, {formData.name.split(" ")[0]}!
                </h3>
                <p className="text-sm text-white/60 mb-2">
                  Your parent account has been created successfully.
                </p>
                <p className="text-xs text-white/40 mb-6">
                  You can now enroll your children, track attendance, and manage
                  your family's music education.
                </p>

                <div className="bg-white/5 rounded-xl p-4 mb-6 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Name</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Email</span>
                    <span className="font-medium text-gold">
                      {formData.email}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Phone</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Role</span>
                    <span className="font-medium text-blue-400">Parent</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center justify-center gap-2 shadow-xl"
                >
                  Go to Login <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
