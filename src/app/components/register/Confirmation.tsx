import { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  MapPin,
  Book,
  User,
  Mail,
  Phone,
  Calendar,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ConfirmationProps {
  formData: any;
}

export default function Confirmation({ formData }: ConfirmationProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#F4E4B0", "#B8941F"],
    });
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 bg-gold rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12 text-primary" />
        </motion.div>

        <h2
          className="text-4xl md:text-5xl mb-4"
          style={{ fontStyle: "italic" }}
        >
          Registration Successful!
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for registering with Liszthoven Academy. We've sent a
          confirmation email with all the details.
        </p>

        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-gold/20 mb-8">
          <h3 className="font-semibold mb-4">What's Next?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                Check your email for confirmation and payment instructions
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                Your teacher will contact you within 24 hours to schedule your
                first lesson
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                Visit your selected branch to complete enrollment and payment
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all shadow-xl"
          >
            Back to Home
          </a>
          <a
            href="/lessons"
            className="bg-white/5 backdrop-blur-md text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all border border-border"
          >
            Explore More Lessons
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border space-y-8">
        <div className="text-center pb-6 border-b border-border">
          <h3 className="text-2xl mb-2" style={{ fontStyle: "italic" }}>
            Review Your Registration
          </h3>
          <p className="text-muted-foreground">
            Please review your information before confirming
          </p>
        </div>

        {/* Branch Details */}
        {formData.branch && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gold" />
              <h4 className="font-semibold">Selected Branch</h4>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6">
              <h5
                className="font-semibold mb-2"
                style={{ fontStyle: "italic" }}
              >
                {formData.branch.name}
              </h5>
              <p className="text-sm text-muted-foreground mb-3">
                {formData.branch.address}, {formData.branch.city},{" "}
                {formData.branch.state}
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-gold" />
                  {formData.branch.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-gold" />
                  {formData.branch.email}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Details */}
        {formData.lesson && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Book className="w-5 h-5 text-gold" />
              <h4 className="font-semibold">Selected Lesson</h4>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6">
              <div className="flex gap-4">
                <img
                  src={formData.lesson.image}
                  alt={formData.lesson.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h5
                    className="font-semibold mb-1"
                    style={{ fontStyle: "italic" }}
                  >
                    {formData.lesson.title}
                  </h5>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formData.lesson.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="px-2 py-1 bg-gold/10 text-gold rounded">
                      {formData.lesson.level}
                    </span>
                    <span className="px-2 py-1 bg-gold/10 text-gold rounded">
                      {formData.lesson.duration}
                    </span>
                    <span className="px-2 py-1 bg-gold/10 text-gold rounded font-semibold">
                      {formData.lesson.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teacher Details */}
        {formData.teacher && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gold" />
              <h4 className="font-semibold">Selected Teacher</h4>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6">
              <div className="flex gap-4">
                <img
                  src={formData.teacher.image}
                  alt={formData.teacher.name}
                  className="w-20 h-20 rounded-lg object-cover ring-2 ring-gold/20"
                />
                <div className="flex-1">
                  <h5
                    className="font-semibold mb-1"
                    style={{ fontStyle: "italic" }}
                  >
                    {formData.teacher.name}
                  </h5>
                  <p className="text-sm text-gold mb-2">
                    {formData.teacher.credentials}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formData.teacher.specialization}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Details */}
        {formData.biodata && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gold" />
              <h4 className="font-semibold">Student Information</h4>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Full Name
                  </div>
                  <div className="font-medium">{formData.biodata.fullName}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Email
                  </div>
                  <div className="font-medium">{formData.biodata.email}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Phone
                  </div>
                  <div className="font-medium">{formData.biodata.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Age</div>
                  <div className="font-medium">
                    {formData.biodata.age} years old
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Experience Level
                  </div>
                  <div className="font-medium capitalize">
                    {formData.biodata.experienceLevel}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Preferred Schedule
                  </div>
                  <div className="font-medium">
                    {formData.biodata.preferredSchedule}
                  </div>
                </div>
              </div>

              {formData.biodata.notes && (
                <div className="pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-1">
                    Notes
                  </div>
                  <div className="text-sm">{formData.biodata.notes}</div>
                </div>
              )}

              {formData.biodata.isChild && (
                <div className="pt-3 border-t border-border">
                  <div className="text-xs font-semibold text-gold mb-2">
                    Guardian Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Name
                      </div>
                      <div className="text-sm font-medium">
                        {formData.biodata.guardianName}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Phone
                      </div>
                      <div className="text-sm font-medium">
                        {formData.biodata.guardianPhone}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Email
                      </div>
                      <div className="text-sm font-medium">
                        {formData.biodata.guardianEmail}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <div className="pt-6 border-t border-border text-center">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-gold text-primary px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl inline-flex items-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                Confirm Registration
              </>
            )}
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            By confirming, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
