import { motion } from "motion/react";
import { Bell, Pin, Calendar, Tag } from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "Spring Recital — June 15, 2026",
    category: "Event",
    date: "2026-05-28",
    pinned: true,
    body: "The Spring Recital is scheduled for June 15th at 6:00 PM in the Main Hall. All teachers are expected to prepare their advanced and intermediate students for at least one performance piece. Please submit your student performance list to the admin by June 8th. Dress code for students: smart casual.",
    author: "Academy Director",
    categoryColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  {
    id: 2,
    title: "New Attendance Approval System",
    category: "Policy",
    date: "2026-05-25",
    pinned: true,
    body: "Effective immediately, all attendance records submitted by teachers will be sent to parents for approval. Teachers should record attendance and lesson remarks within 24 hours of each class. Parents will receive a notification and must approve the record. This ensures transparency and keeps parents informed of their child's progress.",
    author: "Administration",
    categoryColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: 3,
    title: "School Holiday — June 20, 2026",
    category: "Holiday",
    date: "2026-05-20",
    pinned: false,
    body: "Please note that the school will be closed on June 20, 2026 for a public holiday. All classes scheduled on this day will need to be rescheduled. Teachers are asked to coordinate with their students and parents to find alternative slots during the same week. Please update your schedules in the system accordingly.",
    author: "Administration",
    categoryColor: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    id: 4,
    title: "Guitar Ensemble Opportunity",
    category: "Opportunity",
    date: "2026-05-15",
    pinned: false,
    body: "We are forming a Guitar Ensemble group for intermediate and advanced students who are interested in group performance. If any of your students would like to participate, please have them sign up at the front desk. Rehearsals will be every Saturday at 10:00 AM starting June 7th. This is a great opportunity for students to develop ensemble skills.",
    author: "James Rodriguez",
    categoryColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    id: 5,
    title: "Monthly Staff Meeting",
    category: "Staff",
    date: "2026-05-10",
    pinned: false,
    body: "The monthly staff meeting will be held on June 5th at 5:30 PM in Conference Room A. Agenda includes: mid-year performance reviews, upcoming recital logistics, curriculum updates for Q3, and open discussion. Attendance is mandatory for all teaching staff. Please prepare a brief update on each of your courses.",
    author: "Academy Director",
    categoryColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
];

export default function TeacherNews() {
  const pinned = announcements.filter((a) => a.pinned);
  const regular = announcements.filter((a) => !a.pinned);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>School News</h2>
        <p className="text-sm text-muted-foreground">Announcements and updates from the academy</p>
      </div>

      {pinned.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Pin className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pinned</h3>
          </div>
          <div className="space-y-4">
            {pinned.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-gold/20 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-start gap-3">
                  <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <span className={`inline-flex text-xs px-2 py-0.5 rounded border ${item.categoryColor}`}>{item.category}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                      <span>By {item.author}</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">All Announcements</h3>
        </div>
        <div className="space-y-4">
          {regular.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (pinned.length + i) * 0.08 }}
              className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-start gap-3">
                <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <span className={`inline-flex text-xs px-2 py-0.5 rounded border ${item.categoryColor}`}>{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    <span>By {item.author}</span>
                  </div>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
