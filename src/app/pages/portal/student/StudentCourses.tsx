import { motion } from "motion/react";
import { BookOpen, User, MapPin, Clock, GraduationCap } from "lucide-react";

export default function StudentCourses() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Courses</h2>
        <p className="text-sm text-muted-foreground">Your enrolled programs and lesson details</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl">🎹</div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Piano — Beginner</h3>
            <p className="text-sm text-muted-foreground">Downtown Branch · Active Enrollment</p>
          </div>
          <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-3 py-1 rounded-full font-medium">Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="px-6 py-5 space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Information</h4>
            {[
              { icon: User, label: "Teacher", value: "Dr. Sarah Mitchell" },
              { icon: MapPin, label: "Branch", value: "Downtown Branch — Studio A" },
              { icon: Clock, label: "Schedule", value: "Monday & Wednesday, 3:00 PM" },
              { icon: BookOpen, label: "Duration", value: "60 minutes per session" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontStyle: "normal" }}>
                Classical piano foundations covering proper technique, sight-reading, music theory, and performance repertoire for beginners.
              </p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Credits */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Lesson Credits</h4>
              <div className="flex gap-3 mb-3">
                {[{ label: "Total", value: 8, color: "text-foreground" }, { label: "Completed", value: 3, color: "text-muted-foreground" }, { label: "Remaining", value: 5, color: "text-gold" }].map(({ label, value, color }) => (
                  <div key={label} className="flex-1 bg-muted rounded-lg p-2 text-center">
                    <p className={`text-xl font-semibold ${color}`}>{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: "37.5%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">5 sessions remaining</p>
            </div>

            {/* Outcomes */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" />
                What You're Learning
              </h4>
              <ul className="space-y-2">
                {["Basic scales and arpeggios", "Simple classical pieces", "Introduction to music theory", "Sight-reading fundamentals", "Proper hand position and posture"].map((outcome) => (
                  <li key={outcome} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            {/* Teacher Bio */}
            <div className="pt-3 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">About Your Teacher</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20">
                  <span className="text-gold font-bold text-xs">SM</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Dr. Sarah Mitchell</p>
                  <p className="text-xs text-muted-foreground">Classical & Contemporary Piano · 15 years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
