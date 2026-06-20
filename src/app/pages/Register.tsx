import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, CheckCircle, Music, Mail, Lock, User, Phone, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router";
import FloatingNodes from "../components/FloatingNodes";

const steps = [
  { id: 1, name: "Your Info", title: "Create Your Account" },
  { id: 2, name: "Verify", title: "Verify Your Email" },
  { id: 3, name: "Done", title: "Account Created!" },
];

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState("");
  const [resent, setResent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{8,}$/.test(formData.phone)) newErrors.phone = "Enter a valid phone number";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleVerify = () => {
    const code = otp.join("");
    if (code === "123456") {
      setCurrentStep(3);
    } else {
      setOtpError("Invalid code. Use 123456 for demo.");
    }
  };

  const handleResend = () => {
    setResent(true);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setTimeout(() => setResent(false), 3000);
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
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
            {steps[currentStep - 1].title}
          </h1>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-semibold transition-all ${
                currentStep > step.id ? "bg-gold border-gold text-black" :
                currentStep === step.id ? "border-gold text-gold" :
                "border-white/20 text-white/40"
              }`}>
                {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
              </div>
              <span className={`text-xs hidden sm:block ${currentStep >= step.id ? "text-white/80" : "text-white/30"}`}>{step.name}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${currentStep > step.id ? "bg-gold" : "bg-white/20"}`} />}
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
                <p className="text-sm text-white/60 mb-6">Fill in your details to create a parent account</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2"><User className="w-4 h-4 text-gold" />Full Name</label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Your full name"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 focus:outline-none transition-colors ${errors.name ? "border-red-500" : "border-white/10 focus:border-gold"}`} />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-gold" />Mobile Number</label>
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 focus:outline-none transition-colors ${errors.phone ? "border-red-500" : "border-white/10 focus:border-gold"}`} />
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-gold" />Email Address</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com"
                      className={`w-full px-4 py-3 rounded-lg bg-white/5 border text-white placeholder:text-white/40 focus:outline-none transition-colors ${errors.email ? "border-red-500" : "border-white/10 focus:border-gold"}`} />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2"><Lock className="w-4 h-4 text-gold" />Password</label>
                    <div className="relative">
                      <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Min. 8 characters"
                        className={`w-full px-4 py-3 pr-11 rounded-lg bg-white/5 border text-white placeholder:text-white/40 focus:outline-none transition-colors ${errors.password ? "border-red-500" : "border-white/10 focus:border-gold"}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                  </div>
                </div>
                <button onClick={() => { if (validate()) setCurrentStep(2); }}
                  className="w-full mt-6 bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center justify-center gap-2 shadow-xl">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-sm text-white/50 mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="text-gold hover:text-gold-light transition-colors font-medium">Sign In</Link>
                </p>
              </div>
            )}

            {/* Step 2 — OTP verification */}
            {currentStep === 2 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl text-center">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20 mx-auto mb-4">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <p className="text-sm text-white/60 mb-1">We sent a verification code to</p>
                <p className="font-medium text-gold mb-6">{formData.email || "your email"}</p>

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

                {otpError && <p className="text-xs text-red-400 mb-4">{otpError}</p>}
                <p className="text-xs text-white/40 mb-6">Demo code: <span className="text-gold font-mono">123456</span></p>

                <button onClick={handleVerify}
                  className="w-full bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center justify-center gap-2 shadow-xl mb-4">
                  Verify Email <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-between">
                  <button onClick={() => setCurrentStep(1)} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />Back
                  </button>
                  <button onClick={handleResend} className={`flex items-center gap-1.5 text-sm transition-colors ${resent ? "text-green-400" : "text-white/50 hover:text-gold"}`}>
                    <RefreshCw className={`w-4 h-4 ${resent ? "animate-spin" : ""}`} />
                    {resent ? "Code sent!" : "Resend code"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Success */}
            {currentStep === 3 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/40 mx-auto mb-5">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2" style={{ fontStyle: "italic" }}>Welcome, {formData.name.split(" ")[0]}!</h3>
                <p className="text-sm text-white/60 mb-2">Your parent account has been created successfully.</p>
                <p className="text-xs text-white/40 mb-6">You can now enroll your children, track attendance, and manage your family's music education.</p>

                <div className="bg-white/5 rounded-xl p-4 mb-6 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Name</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Email</span>
                    <span className="font-medium text-gold">{formData.email}</span>
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

                <button onClick={() => navigate("/portal/parent/dashboard")}
                  className="w-full bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center justify-center gap-2 shadow-xl">
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
