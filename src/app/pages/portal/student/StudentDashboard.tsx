import { motion } from "motion/react";
import { Clock, BookOpen, TrendingUp, Star, User, CalendarDays } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const upcomingLessons = [
  { lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", day: "Today", time: "3:00 PM", room: "Studio A" },
  { lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", day: "Wednesday, Jun 3", time: "3:00 PM", room: "Studio A" },
  { lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", day: "Monday, Jun 8", time: "3:00 PM", room: "Studio A" },
];

const progressItems = [
  { skill: "Scale Technique", progress: 70, color: "bg-blue-500" },
  { skill: "Sight Reading", progress: 45, color: "bg-purple-500" },
  { skill: "Rhythm & Timing", progress: 80, color: "bg-gold" },
  { skill: "Music Theory", progress: 55, color: "bg-green-500" },
];

const recentAchievements = [
  { title: "3 Lessons Complete", icon: "🎹", date: "This Month" },
  { title: "Perfect Attendance", icon: "⭐", date: "May 2026" },
  { title: "C Major Mastered", icon: "🏆", date: "May 14" },
];

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1" style={{ fontStyle: "italic" }}>Hello, {user?.name?.split(" ")[0]}</h2>
        <p className="text-sm text-muted-foreground">Keep up the great practice!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Lessons Completed", value: "3", icon: BookOpen, color: "text-blue-400 bg-blue-500/10" },
          { label: "Attendance Rate", value: "100%", icon: Star, color: "text-gold bg-gold/10" },
          { label: "Current Program", value: "Piano", icon: TrendingUp, color: "text-purple-400 bg-purple-500/10" },
          { label: "My Teacher", value: "Dr. Mitchell", icon: User, color: "text-green-400 bg-green-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-xl p-5 border border-border">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <div className="text-2xl font-semibold mb-0.5">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Lessons */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="xl:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <Clock className="w-4 h-4 text-gold" />
            <h3 className="font-semibold text-sm">Upcoming Lessons</h3>
          </div>
          <div className="divide-y divide-border">
            {upcomingLessons.map((lesson, i) => (
              <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎹</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{lesson.lesson}</p>
                    <p className="text-xs text-muted-foreground">{lesson.teacher} · {lesson.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gold">{lesson.day}</p>
                  <p className="text-xs text-muted-foreground">{lesson.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Progress */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-gold" />My Progress</h3>
            <div className="space-y-3">
              {progressItems.map((item) => (
                <div key={item.skill}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.skill}</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-gold" />Achievements</h3>
            <div className="space-y-3">
              {recentAchievements.map((ach, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center text-lg">{ach.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{ach.title}</p>
                    <p className="text-xs text-muted-foreground">{ach.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Teacher Info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><User className="w-4 h-4 text-gold" />My Teacher</h3>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center border-2 border-gold/30">
            <span className="text-gold font-bold text-lg">SM</span>
          </div>
          <div>
            <h4 className="font-semibold text-base">Dr. Sarah Mitchell</h4>
            <p className="text-sm text-muted-foreground">Classical & Contemporary Piano · 15 years experience</p>
            <p className="text-xs text-muted-foreground mt-1">Mon & Wed, 3:00 PM · Studio A · Downtown Branch</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
