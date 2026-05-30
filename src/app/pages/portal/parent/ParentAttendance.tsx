import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Clock, XCircle, ThumbsUp, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

type AttendanceStatus = "pending" | "approved";

interface AttendanceRecord {
  id: number;
  child: string;
  lesson: string;
  teacher: string;
  date: string;
  time: string;
  duration: string;
  status: "present" | "absent" | "late";
  approvalStatus: AttendanceStatus;
  lessonRemarks: string;
  classNotes: string;
}

const initialRecords: AttendanceRecord[] = [
  { id: 1, child: "Emily", lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-28", time: "3:00 PM", duration: "60 min", status: "present", approvalStatus: "pending", lessonRemarks: "Emily showed great improvement on scales today. Her hand position has improved significantly. Recommend practicing Hanon exercises daily for finger independence.", classNotes: "Covered: C Major scale, Twinkle Twinkle variations, Introduction to sight-reading." },
  { id: 2, child: "Lucas", lesson: "Drums — Beginner", teacher: "Marcus Wright", date: "2026-05-27", time: "4:30 PM", duration: "60 min", status: "present", approvalStatus: "pending", lessonRemarks: "Lucas is getting comfortable with basic rhythms. Excellent enthusiasm. Keep practicing the snare roll at home.", classNotes: "Covered: Basic rock beat, Hi-hat patterns, Simple fills introduction." },
  { id: 3, child: "Emily", lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-21", time: "3:00 PM", duration: "60 min", status: "late", approvalStatus: "approved", lessonRemarks: "Arrived 10 minutes late but made good use of the remaining time. Please aim to arrive 5 minutes early.", classNotes: "Covered: Review of previous material, G Major scale introduction." },
  { id: 4, child: "Lucas", lesson: "Drums — Beginner", teacher: "Marcus Wright", date: "2026-05-20", time: "4:30 PM", duration: "60 min", status: "absent", approvalStatus: "approved", lessonRemarks: "Absent — illness noted. No material covered. Will resume next session.", classNotes: "Session cancelled due to student absence." },
  { id: 5, child: "Emily", lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-14", time: "3:00 PM", duration: "60 min", status: "present", approvalStatus: "approved", lessonRemarks: "Excellent session. Emily is progressing ahead of schedule. Her sense of rhythm is natural and impressive.", classNotes: "Covered: F Major scale, Mary Had a Little Lamb (both hands), Basic music theory." },
];

const statusConfig = {
  present: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Present" },
  absent: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Absent" },
  late: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Late" },
};

export default function ParentAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterChild, setFilterChild] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const pending = records.filter((r) => r.approvalStatus === "pending");
  const history = records.filter((r) => r.approvalStatus === "approved");

  const filtered = (list: AttendanceRecord[]) => list.filter((r) => {
    const matchChild = filterChild === "All" || r.child === filterChild;
    const matchStatus = filterStatus === "All" || r.approvalStatus === filterStatus;
    return matchChild && matchStatus;
  });

  const handleApprove = (id: number) => {
    setRecords((prev) => prev.map((r) => r.id === id ? { ...r, approvalStatus: "approved" as AttendanceStatus } : r));
    setExpandedId(null);
  };

  const AttendanceRow = ({ record, showApprove }: { record: AttendanceRecord; showApprove: boolean }) => {
    const cfg = statusConfig[record.status];
    const isExpanded = expandedId === record.id;

    return (
      <div className="border-b border-border last:border-0">
        <div
          className="px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
          onClick={() => setExpandedId(isExpanded ? null : record.id)}
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-xs font-bold">{record.child[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium">{record.child} — {record.lesson}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg}`}>
                  <cfg.icon className={`w-3 h-3 ${cfg.color}`} />
                  <span className={cfg.color}>{cfg.label}</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {record.teacher} · {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {record.time} · {record.duration}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {showApprove && (
                <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full font-medium">
                  Pending
                </span>
              )}
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </div>
        </div>

        <AnimateExpand isOpen={isExpanded}>
          <div className="px-5 pb-5 space-y-4">
            <div className="bg-muted rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gold mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Lesson Remarks from Teacher
                </p>
                <p className="text-sm text-foreground leading-relaxed" style={{ fontStyle: "normal" }}>
                  {record.lessonRemarks}
                </p>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Class Notes</p>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontStyle: "normal" }}>
                  {record.classNotes}
                </p>
              </div>
            </div>
            {showApprove && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleApprove(record.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Approve Attendance
                </button>
              </div>
            )}
          </div>
        </AnimateExpand>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Attendance</h2>
        <p className="text-sm text-muted-foreground">Review lesson remarks and approve attendance records</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
          <div className="text-2xl font-semibold text-yellow-400 mb-0.5">{pending.length}</div>
          <div className="text-xs text-muted-foreground">Pending Approval</div>
        </div>
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
          <div className="text-2xl font-semibold text-green-400 mb-0.5">
            {records.filter((r) => r.status === "present").length}
          </div>
          <div className="text-xs text-muted-foreground">Present</div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="text-2xl font-semibold mb-0.5">{records.length}</div>
          <div className="text-xs text-muted-foreground">Total Lessons</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select value={filterChild} onChange={(e) => setFilterChild(e.target.value)} className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors">
          {["All", "Emily", "Lucas"].map((c) => <option key={c} value={c}>{c === "All" ? "All Children" : c}</option>)}
        </select>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Awaiting Your Approval ({pending.length})
          </h3>
          <div className="bg-card rounded-xl border border-yellow-500/20 overflow-hidden">
            {filtered(pending).map((record) => (
              <AttendanceRow key={record.id} record={record} showApprove={true} />
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Approved History ({history.length})
        </h3>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {filtered(history).length > 0 ? filtered(history).map((record) => (
            <AttendanceRow key={record.id} record={record} showApprove={false} />
          )) : (
            <div className="text-center py-10 text-muted-foreground text-sm">No records found</div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnimateExpand({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
