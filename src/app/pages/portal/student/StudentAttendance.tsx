import { motion } from "motion/react";
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { useState } from "react";

interface AttendanceRecord {
  id: number;
  lesson: string;
  teacher: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late";
  remarks: string;
  approved: boolean;
}

const records: AttendanceRecord[] = [
  { id: 1, lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-28", time: "3:00 PM", status: "present", remarks: "Emily showed great improvement on scales today. Excellent progress on hand position.", approved: false },
  { id: 2, lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-25", time: "3:00 PM", status: "present", remarks: "Excellent session! Emily is progressing ahead of schedule.", approved: true },
  { id: 3, lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-21", time: "3:00 PM", status: "late", remarks: "Arrived 10 minutes late but made good use of remaining time.", approved: true },
  { id: 4, lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-14", time: "3:00 PM", status: "present", remarks: "Excellent session. Great sense of rhythm. Keep practicing the F Major scale.", approved: true },
  { id: 5, lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-11", time: "3:00 PM", status: "present", remarks: "Good session. Introduced right-hand melody for Für Elise.", approved: true },
];

const cfg = {
  present: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Present" },
  absent: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Absent" },
  late: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Late" },
};

export default function StudentAttendance() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const present = records.filter((r) => r.status === "present").length;
  const rate = Math.round((present / records.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Attendance</h2>
        <p className="text-sm text-muted-foreground">Your lesson attendance history</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 text-center">
          <div className="text-2xl font-semibold text-green-400">{present}</div>
          <div className="text-xs text-muted-foreground">Present</div>
        </div>
        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 text-center">
          <div className="text-2xl font-semibold text-red-400">{records.filter((r) => r.status === "absent").length}</div>
          <div className="text-xs text-muted-foreground">Absent</div>
        </div>
        <div className="bg-gold/10 rounded-xl p-4 border border-gold/20 text-center">
          <div className="text-2xl font-semibold text-gold">{rate}%</div>
          <div className="text-xs text-muted-foreground">Attendance Rate</div>
        </div>
      </div>

      {/* Records */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm">Attendance History ({records.length} lessons)</h3>
        </div>
        <div className="divide-y divide-border">
          {records.map((record) => {
            const s = cfg[record.status];
            const isExpanded = expandedId === record.id;
            return (
              <div key={record.id}>
                <div
                  className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : record.id)}
                >
                  <s.icon className={`w-5 h-5 flex-shrink-0 ${s.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{record.lesson}</p>
                    <p className="text-xs text-muted-foreground">{record.teacher} · {record.time}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium">
                      {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <div className="flex items-center gap-1.5 justify-end mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border ${s.bg}`}>
                        <span className={s.color}>{s.label}</span>
                      </span>
                      {record.approved
                        ? <span className="text-xs text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">Approved</span>
                        : <span className="text-xs text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">Pending</span>
                      }
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </div>

                {isExpanded && record.remarks && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-4"
                  >
                    <div className="bg-muted rounded-xl p-4 flex gap-3">
                      <MessageSquare className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-gold mb-1">Teacher's Remarks</p>
                        <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontStyle: "normal" }}>{record.remarks}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
