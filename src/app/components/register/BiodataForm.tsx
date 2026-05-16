import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Calendar, Users, MessageSquare } from "lucide-react";

interface BiodataFormProps {
  data: any;
  onSubmit: (data: any) => void;
}

export default function BiodataForm({ data, onSubmit }: BiodataFormProps) {
  const [formData, setFormData] = useState(data || {
    fullName: "",
    email: "",
    phone: "",
    age: "",
    experienceLevel: "beginner",
    preferredSchedule: "",
    notes: "",
    isChild: false,
    guardianName: "",
    guardianPhone: "",
    guardianEmail: ""
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    if (!formData.preferredSchedule.trim()) newErrors.preferredSchedule = "Preferred schedule is required";

    if (formData.isChild) {
      if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian name is required";
      if (!formData.guardianPhone.trim()) newErrors.guardianPhone = "Guardian phone is required";
      if (!formData.guardianEmail.trim()) newErrors.guardianEmail = "Guardian email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-xl mb-6 pb-3 border-b border-border" style={{ fontStyle: 'italic' }}>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gold" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-input-background border transition-colors ${
                  errors.fullName ? "border-destructive" : "border-border focus:border-gold"
                } focus:outline-none`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-input-background border transition-colors ${
                  errors.email ? "border-destructive" : "border-border focus:border-gold"
                } focus:outline-none`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-input-background border transition-colors ${
                  errors.phone ? "border-destructive" : "border-border focus:border-gold"
                } focus:outline-none`}
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="5"
                max="100"
                className={`w-full px-4 py-3 rounded-lg bg-input-background border transition-colors ${
                  errors.age ? "border-destructive" : "border-border focus:border-gold"
                } focus:outline-none`}
                placeholder="25"
              />
              {errors.age && (
                <p className="text-xs text-destructive mt-1">{errors.age}</p>
              )}
            </div>
          </div>
        </div>

        {/* Musical Background */}
        <div>
          <h3 className="text-xl mb-6 pb-3 border-t border-border pt-6" style={{ fontStyle: 'italic' }}>
            Musical Background
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-gold" />
                Experience Level *
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:border-gold focus:outline-none transition-colors"
              >
                <option value="beginner">Beginner (No experience)</option>
                <option value="elementary">Elementary (1-2 years)</option>
                <option value="intermediate">Intermediate (3-5 years)</option>
                <option value="advanced">Advanced (5+ years)</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Preferred Schedule *
              </label>
              <input
                type="text"
                name="preferredSchedule"
                value={formData.preferredSchedule}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-input-background border transition-colors ${
                  errors.preferredSchedule ? "border-destructive" : "border-border focus:border-gold"
                } focus:outline-none`}
                placeholder="e.g., Weekday evenings, Saturday mornings"
              />
              {errors.preferredSchedule && (
                <p className="text-xs text-destructive mt-1">{errors.preferredSchedule}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold" />
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:border-gold focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your musical goals, interests, or any special requirements..."
            />
          </div>
        </div>

        {/* Child Student Section */}
        <div className="border-t border-border pt-6">
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              name="isChild"
              checked={formData.isChild}
              onChange={handleChange}
              className="w-5 h-5 rounded border-border text-gold focus:ring-gold"
            />
            <span className="text-sm font-medium">Student is under 18 years old</span>
          </label>

          {formData.isChild && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 mt-4 pl-8 border-l-2 border-gold/20"
            >
              <h4 className="text-sm font-semibold text-gold">Guardian Information</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Guardian Name *</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-input-background border transition-colors ${
                      errors.guardianName ? "border-destructive" : "border-border focus:border-gold"
                    } focus:outline-none`}
                    placeholder="Parent/Guardian Name"
                  />
                  {errors.guardianName && (
                    <p className="text-xs text-destructive mt-1">{errors.guardianName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Guardian Phone *</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-input-background border transition-colors ${
                      errors.guardianPhone ? "border-destructive" : "border-border focus:border-gold"
                    } focus:outline-none`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.guardianPhone && (
                    <p className="text-xs text-destructive mt-1">{errors.guardianPhone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Guardian Email *</label>
                  <input
                    type="email"
                    name="guardianEmail"
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-input-background border transition-colors ${
                      errors.guardianEmail ? "border-destructive" : "border-border focus:border-gold"
                    } focus:outline-none`}
                    placeholder="parent@example.com"
                  />
                  {errors.guardianEmail && (
                    <p className="text-xs text-destructive mt-1">{errors.guardianEmail}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.form>
  );
}
