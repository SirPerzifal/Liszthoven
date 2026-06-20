import { motion } from "motion/react";
import { Users, Music2, DollarSign, CalendarDays, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const stats = [
  { label: "Total Students", value: "248", change: "+12 this month", icon: Users, color: "bg-blue-500/10 text-blue-400" },
  { label: "Active Lessons", value: "36", change: "+4 this week", icon: Music2, color: "bg-purple-500/10 text-purple-400" },
  { label: "Monthly Revenue", value: "$24,850", change: "+8.2% vs last month", icon: DollarSign, color: "bg-gold/10 text-gold" },
  { label: "Upcoming Events", value: "9", change: "Next: Spring Recital", icon: CalendarDays, color: "bg-green-500/10 text-green-400" },
];

const recentActivities = [
  { type: "enrollment", text: "Emily Chen enrolled in Piano — Beginner", time: "2 hours ago", icon: CheckCircle2, color: "text-green-400" },
  { type: "attendance", text: "Marcus Johnson was absent from Guitar lesson", time: "4 hours ago", icon: AlertCircle, color: "text-yellow-400" },
  { type: "payment", text: "Payment received from Sofia Rodriguez — $180", time: "Yesterday", icon: DollarSign, color: "text-gold" },
  { type: "enrollment", text: "Liam Thompson enrolled in Drum Kit — Beginner", time: "Yesterday", icon: CheckCircle2, color: "text-green-400" },
  { type: "event", text: "Spring Recital scheduled for June 15, 2026", time: "2 days ago", icon: CalendarDays, color: "text-blue-400" },
  { type: "attendance", text: "Ava Williams completed 10 lessons milestone", time: "3 days ago", icon: TrendingUp, color: "text-purple-400" },
];

const upcomingLessons = [
  { student: "Emily Chen", lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", time: "Today, 10:00 AM", room: "Studio A" },
  { student: "Marcus Johnson", lesson: "Guitar — Intermediate", teacher: "James Rodriguez", time: "Today, 11:30 AM", room: "Studio B" },
  { student: "Sofia Rodriguez", lesson: "Violin — Advanced", teacher: "Elena Vasquez", time: "Today, 2:00 PM", room: "Studio C" },
  { student: "Liam Thompson", lesson: "Drums — Beginner", teacher: "Marcus Wright", time: "Today, 3:30 PM", room: "Drum Room" },
  { student: "Ava Williams", lesson: "Piano — Intermediate", teacher: "Dr. Sarah Mitchell", time: "Tomorrow, 9:00 AM", room: "Studio A" },
];

const lessonDistribution = [
  { name: "Piano", count: 82, percentage: 33, color: "bg-blue-500" },
  { name: "Guitar", count: 71, percentage: 29, color: "bg-purple-500" },
  { name: "Violin", count: 48, percentage: 19, color: "bg-gold" },
  { name: "Drums", count: 30, percentage: 12, color: "bg-green-500" },
  { name: "Vocals", count: 17, percentage: 7, color: "bg-pink-500" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl mb-1" style={{ fontStyle: "italic" }}>
          Welcome back, {user?.name?.split(" ")[0]}
        </h2>
        <p className="text-muted-foreground text-sm">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-semibold mb-1">{stat.value}</div>
            <div className="text-sm font-medium mb-1">{stat.label}</div>
            <div className="text-xs text-muted-foreground">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              Upcoming Lessons
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{upcomingLessons.length} scheduled</span>
          </div>
          <div className="divide-y divide-border">
            {upcomingLessons.map((lesson, i) => (
              <div key={i} className="px-6 py-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center">
                      <span className="text-gold text-sm font-semibold">{lesson.student.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{lesson.student}</p>
                      <p className="text-xs text-muted-foreground">{lesson.lesson} · {lesson.teacher}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gold">{lesson.time}</p>
                    <p className="text-xs text-muted-foreground">{lesson.room}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Lesson Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Music2 className="w-4 h-4 text-gold" />
              Lesson Distribution
            </h3>
            <div className="space-y-3">
              {lessonDistribution.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.count} students</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <activity.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${activity.color}`} />
                  <div>
                    <p className="text-xs leading-relaxed" style={{ fontStyle: "normal" }}>
                      {activity.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
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
