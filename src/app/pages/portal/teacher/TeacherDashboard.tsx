import { motion } from "motion/react";
import { Clock, Users, BookOpen, TrendingUp, CalendarDays, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const todayClasses = [
  { time: "10:00 AM", student: "Alex Thompson", level: "Intermediate", room: "Studio B", status: "upcoming" },
  { time: "11:30 AM", student: "Maria Santos", level: "Beginner", room: "Studio B", status: "upcoming" },
  { time: "2:00 PM", student: "David Chen", level: "Advanced", room: "Studio C", status: "upcoming" },
];

const upcomingLessons = [
  { day: "Tomorrow", time: "10:00 AM", student: "Alex Thompson", lesson: "Guitar — Intermediate" },
  { day: "Tomorrow", time: "2:00 PM", student: "Sarah Kim", lesson: "Guitar — Beginner" },
  { day: "Wednesday", time: "11:00 AM", student: "James Park", lesson: "Guitar — Advanced" },
  { day: "Thursday", time: "3:00 PM", student: "Emily White", lesson: "Guitar — Beginner" },
];

const recentActivity = [
  { action: "Attendance recorded", student: "Alex Thompson", time: "Yesterday, 10:30 AM", icon: CheckCircle2, color: "text-green-400" },
  { action: "Remarks added", student: "Maria Santos", time: "Yesterday, 12:00 PM", icon: BookOpen, color: "text-blue-400" },
  { action: "Attendance recorded", student: "David Chen", time: "2 days ago", icon: CheckCircle2, color: "text-green-400" },
];

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1" style={{ fontStyle: "italic" }}>Hello, {user?.name?.split(" ")[0]}</h2>
        <p className="text-sm text-muted-foreground">Here's your teaching schedule for today</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Students Assigned", value: "8", icon: Users, color: "text-blue-400 bg-blue-500/10" },
          { label: "Classes Today", value: "3", icon: Clock, color: "text-gold bg-gold/10" },
          { label: "Active Courses", value: "3", icon: BookOpen, color: "text-purple-400 bg-purple-500/10" },
          { label: "Attendance Rate", value: "94%", icon: TrendingUp, color: "text-green-400 bg-green-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-xl p-5 border border-border">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <div className="text-2xl font-semibold mb-0.5">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="xl:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <Clock className="w-4 h-4 text-gold" />
            <h3 className="font-semibold text-sm">Today's Classes</h3>
            <span className="ml-auto text-xs text-muted-foreground">Saturday, May 30</span>
          </div>
          <div className="divide-y divide-border">
            {todayClasses.map((cls, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                <div className="text-center w-16 flex-shrink-0">
                  <p className="text-xs font-semibold text-gold">{cls.time}</p>
                </div>
                <div className="w-px h-8 bg-border flex-shrink-0" />
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎸</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cls.student}</p>
                    <p className="text-xs text-muted-foreground">Guitar — {cls.level} · {cls.room}</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">Upcoming</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <CalendarDays className="w-4 h-4 text-gold" />
              <h3 className="font-semibold text-sm">Upcoming Lessons</h3>
            </div>
            <div className="divide-y divide-border">
              {upcomingLessons.map((lesson, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🎸</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{lesson.student}</p>
                    <p className="text-xs text-muted-foreground">{lesson.day} · {lesson.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <TrendingUp className="w-4 h-4 text-gold" />
              <h3 className="font-semibold text-sm">Recent Activity</h3>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.map((act, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3">
                  <act.icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${act.color}`} />
                  <div>
                    <p className="text-xs font-medium">{act.action}</p>
                    <p className="text-xs text-muted-foreground">{act.student}</p>
                    <p className="text-xs text-muted-foreground/60">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
