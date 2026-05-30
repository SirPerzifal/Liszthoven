import { motion } from "motion/react";
import { CalendarDays, CheckSquare, BookOpen, Megaphone, Clock, Baby, AlertCircle, ChevronRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router";

const upcomingClasses = [
  { child: "Emily", lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", day: "Today", time: "3:00 PM", room: "Studio A", status: "confirmed" },
  { child: "Lucas", lesson: "Drums — Beginner", teacher: "Marcus Wright", day: "Tomorrow", time: "4:30 PM", room: "Drum Room", status: "confirmed" },
  { child: "Emily", lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", day: "Thu, Jun 4", time: "3:00 PM", room: "Studio A", status: "confirmed" },
];

const attendancePending = [
  { id: 1, child: "Emily", lesson: "Piano — Beginner", date: "May 28, 2026", teacher: "Dr. Sarah Mitchell", remarks: "Emily showed great improvement on scales today. Recommend practicing Hanon exercises daily." },
  { id: 2, child: "Lucas", lesson: "Drums — Beginner", date: "May 27, 2026", teacher: "Marcus Wright", remarks: "Lucas is getting comfortable with basic rhythms. Keep practicing the snare roll." },
];

const activeCourses = [
  { child: "Emily", program: "Piano", level: "Beginner", teacher: "Dr. Sarah Mitchell", credits: 8, used: 3, branch: "Downtown" },
  { child: "Lucas", program: "Drums", level: "Beginner", teacher: "Marcus Wright", credits: 8, used: 2, branch: "Downtown" },
];

const announcements = [
  { title: "Spring Recital — June 15", body: "All students are invited to perform at our annual Spring Recital in the Main Hall.", date: "May 20" },
  { title: "Studio Closure — June 20", body: "The academy will be closed on June 20 for end-of-term break. Classes resume June 27.", date: "May 18" },
];

export default function ParentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1" style={{ fontStyle: "italic" }}>
            Welcome, {user?.name?.split(" ")[0]}
          </h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          to="/portal/parent/enrollment"
          className="hidden sm:flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light transition-all"
        >
          <BookOpen className="w-4 h-4" />
          Enroll Child
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Children", value: "2", icon: Baby, color: "text-blue-400 bg-blue-500/10" },
          { label: "Active Courses", value: "2", icon: BookOpen, color: "text-purple-400 bg-purple-500/10" },
          { label: "Pending Approvals", value: `${attendancePending.length}`, icon: AlertCircle, color: "text-yellow-400 bg-yellow-500/10" },
          { label: "Classes This Week", value: "3", icon: CalendarDays, color: "text-gold bg-gold/10" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl p-5 border border-border"
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-4.5 h-4.5" />
            </div>
            <div className="text-2xl font-semibold mb-0.5">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gold" />
              Upcoming Classes
            </h3>
            <Link to="/portal/parent/calendar" className="text-xs text-gold hover:text-gold-light transition-colors">
              View Calendar →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {upcomingClasses.map((cls, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gold text-sm font-bold">{cls.child[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{cls.child} — {cls.lesson}</p>
                  <p className="text-xs text-muted-foreground">{cls.teacher} · {cls.room}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-gold">{cls.day}</p>
                  <p className="text-xs text-muted-foreground">{cls.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Attendance Approval */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-yellow-400" />
                Pending Approval
              </h3>
              <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium">
                {attendancePending.length}
              </span>
            </div>
            <div className="divide-y divide-border">
              {attendancePending.map((item) => (
                <div key={item.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{item.child} — {item.lesson}</p>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2" style={{ fontStyle: "normal" }}>{item.remarks}</p>
                  <Link
                    to="/portal/parent/attendance"
                    className="text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1"
                  >
                    Review & Approve <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-gold" />
                Announcements
              </h3>
            </div>
            <div className="divide-y divide-border">
              {announcements.map((ann, i) => (
                <div key={i} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold">{ann.title}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{ann.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed" style={{ fontStyle: "normal" }}>{ann.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Active Courses Overview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold" />
            Active Courses
          </h3>
          <Link to="/portal/parent/courses" className="text-xs text-gold hover:text-gold-light transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          {activeCourses.map((course, i) => (
            <div key={i} className="px-5 py-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold text-sm">{course.child[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{course.child}</p>
                  <p className="text-xs text-muted-foreground">{course.program} · {course.level} · {course.branch}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Teacher: <span className="text-foreground">{course.teacher}</span></p>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Credits Used</span>
                  <span className="font-medium">{course.used} / {course.credits}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{ width: `${(course.used / course.credits) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{course.credits - course.used} credits remaining</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
