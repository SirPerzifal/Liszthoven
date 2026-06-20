import { motion } from "motion/react";
import { GraduationCap, Clock, MapPin, User, CreditCard, Calendar } from "lucide-react";

const courses = [
  {
    id: 1,
    child: "Emily Johnson",
    childAvatar: "EJ",
    program: "Piano",
    level: "Beginner",
    teacher: "Dr. Sarah Mitchell",
    teacherAvatar: "SM",
    branch: "Downtown Branch",
    schedule: "Every Monday & Wednesday, 3:00 PM",
    duration: "60 minutes per session",
    startDate: "2026-01-15",
    credits: { total: 8, used: 3, remaining: 5 },
    status: "active",
    nextLesson: "Today, 3:00 PM",
    description: "Classical piano foundations covering proper technique, sight-reading, music theory, and performance repertoire suited for beginners.",
    learningOutcomes: ["Basic scales and arpeggios", "Simple classical pieces", "Introduction to music theory", "Sight-reading fundamentals"],
  },
  {
    id: 2,
    child: "Lucas Johnson",
    childAvatar: "LJ",
    program: "Drums",
    level: "Beginner",
    teacher: "Marcus Wright",
    teacherAvatar: "MW",
    branch: "Downtown Branch",
    schedule: "Every Tuesday & Friday, 4:30 PM",
    duration: "60 minutes per session",
    startDate: "2026-02-01",
    credits: { total: 8, used: 2, remaining: 6 },
    status: "active",
    nextLesson: "Tomorrow, 4:30 PM",
    description: "Beginner drum course covering basic rock rhythms, coordination exercises, reading drum notation, and introduction to fills.",
    learningOutcomes: ["Basic rock beat", "Hi-hat and snare coordination", "Simple drum fills", "Reading drum notation"],
  },
];

export default function ParentCourses() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Courses</h2>
        <p className="text-sm text-muted-foreground">{courses.length} active enrollments</p>
      </div>

      <div className="space-y-6">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold text-sm">{course.childAvatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base">{course.child}</h3>
                  <p className="text-sm text-muted-foreground">{course.program} · {course.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
                  Active
                </span>
                <span className="bg-gold/10 text-gold border border-gold/20 text-xs px-2.5 py-1 rounded-full font-medium">
                  Next: {course.nextLesson}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Course Info */}
              <div className="px-6 py-5 space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Details</h4>

                {[
                  { icon: User, label: "Teacher", value: course.teacher },
                  { icon: MapPin, label: "Branch", value: course.branch },
                  { icon: Calendar, label: "Schedule", value: course.schedule },
                  { icon: Clock, label: "Duration", value: course.duration },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}

                <p className="text-xs text-muted-foreground pt-2 leading-relaxed" style={{ fontStyle: "normal" }}>
                  {course.description}
                </p>
              </div>

              {/* Credits + Outcomes */}
              <div className="px-6 py-5 space-y-5">
                {/* Credits */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" />
                    Credits
                  </h4>
                  <div className="flex gap-3 mb-3">
                    {[
                      { label: "Total", value: course.credits.total, color: "text-foreground" },
                      { label: "Used", value: course.credits.used, color: "text-muted-foreground" },
                      { label: "Remaining", value: course.credits.remaining, color: "text-gold" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex-1 bg-muted rounded-lg p-2 text-center">
                        <p className={`text-xl font-semibold ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all"
                      style={{ width: `${(course.credits.used / course.credits.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {course.credits.remaining} sessions remaining · Enrolled {new Date(course.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Learning Outcomes
                  </h4>
                  <ul className="space-y-2">
                    {course.learningOutcomes.map((outcome) => (
                      <li key={outcome} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
