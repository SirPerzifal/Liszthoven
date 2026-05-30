import { motion } from "motion/react";
import { Users, MapPin, Clock, BookOpen, GraduationCap } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Guitar — Beginner",
    emoji: "🎸",
    branch: "Downtown Branch — Studio B",
    schedule: "Tue & Fri, 2:00 PM",
    duration: "45 minutes",
    students: 3,
    description: "Introduction to guitar: basic chords, strumming patterns, and simple songs.",
    outcomes: ["Open chord shapes (G, C, D, A, E)", "Basic strumming patterns", "Simple popular songs", "Music reading basics", "Proper posture and technique"],
    studentList: ["Sarah Kim", "Emily White", "Olivia Brown"],
    active: true,
  },
  {
    id: 2,
    title: "Guitar — Intermediate",
    emoji: "🎸",
    branch: "Downtown Branch — Studio B",
    schedule: "Mon & Thu, 10:00 AM",
    duration: "60 minutes",
    students: 3,
    description: "Advancing technique: barre chords, scales, fingerpicking, and music theory.",
    outcomes: ["Barre chords mastery", "Major & minor scales", "Fingerpicking patterns", "Intermediate repertoire", "Chord theory and progressions"],
    studentList: ["Alex Thompson", "Noah Garcia", "TBD"],
    active: true,
  },
  {
    id: 3,
    title: "Guitar — Advanced",
    emoji: "🎸",
    branch: "Uptown Branch — Studio C",
    schedule: "Mon & Wed, 2:00 PM",
    duration: "60 minutes",
    students: 2,
    description: "Performance-level techniques: advanced fingerstyle, improvisation, composition.",
    outcomes: ["Advanced fingerstyle techniques", "Improvisation & soloing", "Music composition basics", "Performance repertoire", "Stage presence preparation"],
    studentList: ["David Chen", "James Park"],
    active: true,
  },
];

export default function TeacherCourses() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Courses</h2>
        <p className="text-sm text-muted-foreground">Courses you are currently teaching</p>
      </div>

      <div className="space-y-4">
        {courses.map((course, i) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-2xl">{course.emoji}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.branch}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{course.students}</span>
                </div>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-3 py-1 rounded-full font-medium">Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="px-6 py-5 space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Details</h4>
                {[
                  { icon: MapPin, label: "Location", value: course.branch },
                  { icon: Clock, label: "Schedule", value: course.schedule },
                  { icon: BookOpen, label: "Duration", value: course.duration },
                  { icon: Users, label: "Students", value: `${course.students} enrolled` },
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
                  <p className="text-xs text-muted-foreground leading-relaxed">{course.description}</p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />Learning Objectives
                  </h4>
                  <ul className="space-y-2">
                    {course.outcomes.map((o) => (
                      <li key={o} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Enrolled Students</h4>
                  <div className="space-y-2">
                    {course.studentList.map((name, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                          <span className="text-emerald-400 text-xs font-bold">{name === "TBD" ? "?" : name[0]}</span>
                        </div>
                        <span className="text-xs font-medium">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
