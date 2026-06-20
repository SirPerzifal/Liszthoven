import { useState } from "react";
import { motion } from "motion/react";
import { Search, CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  lesson: string;
  teacher: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late";
  notes: string;
}

const initialRecords: AttendanceRecord[] = [
  { id: 1, studentId: 1, studentName: "Emily Chen", lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-30", time: "10:00 AM", status: "present", notes: "" },
  { id: 2, studentId: 2, studentName: "Marcus Johnson", lesson: "Guitar — Intermediate", teacher: "James Rodriguez", date: "2026-05-30", time: "11:30 AM", status: "late", notes: "Arrived 10 minutes late" },
  { id: 3, studentId: 3, studentName: "Sofia Rodriguez", lesson: "Violin — Advanced", teacher: "Elena Vasquez", date: "2026-05-30", time: "2:00 PM", status: "present", notes: "" },
  { id: 4, studentId: 4, studentName: "Liam Thompson", lesson: "Drums — Beginner", teacher: "Marcus Wright", date: "2026-05-30", time: "3:30 PM", status: "absent", notes: "Called in sick" },
  { id: 5, studentId: 5, studentName: "Ava Williams", lesson: "Piano — Intermediate", teacher: "Dr. Sarah Mitchell", date: "2026-05-29", time: "9:00 AM", status: "present", notes: "" },
  { id: 6, studentId: 6, studentName: "Noah Davis", lesson: "Guitar — Advanced", teacher: "James Rodriguez", date: "2026-05-29", time: "11:00 AM", status: "present", notes: "" },
  { id: 7, studentId: 7, studentName: "Isabella Brown", lesson: "Violin — Beginner", teacher: "Elena Vasquez", date: "2026-05-29", time: "1:00 PM", status: "absent", notes: "No notice given" },
  { id: 8, studentId: 8, studentName: "Oliver Wilson", lesson: "Vocals — Intermediate", teacher: "Dr. Sarah Mitchell", date: "2026-05-29", time: "3:00 PM", status: "present", notes: "" },
  { id: 9, studentId: 9, studentName: "Emma Martinez", lesson: "Piano — Advanced", teacher: "Dr. Sarah Mitchell", date: "2026-05-28", time: "10:00 AM", status: "present", notes: "" },
  { id: 10, studentId: 10, studentName: "James Taylor", lesson: "Guitar — Beginner", teacher: "James Rodriguez", date: "2026-05-28", time: "2:00 PM", status: "late", notes: "Traffic delay" },
  { id: 11, studentId: 1, studentName: "Emily Chen", lesson: "Piano — Beginner", teacher: "Dr. Sarah Mitchell", date: "2026-05-27", time: "10:00 AM", status: "present", notes: "" },
  { id: 12, studentId: 3, studentName: "Sofia Rodriguez", lesson: "Violin — Advanced", teacher: "Elena Vasquez", date: "2026-05-27", time: "2:00 PM", status: "present", notes: "" },
];

const statusConfig = {
  present: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Present" },
  absent: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Absent" },
  late: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Late" },
};

export default function AdminAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const filtered = records.filter((r) => {
    const matchSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.lesson.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    const matchDate = !filterDate || r.date === filterDate;
    return matchSearch && matchStatus && matchDate;
  });

  const updateStatus = (id: number, status: AttendanceRecord["status"]) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const presentCount = filtered.filter((r) => r.status === "present").length;
  const absentCount = filtered.filter((r) => r.status === "absent").length;
  const lateCount = filtered.filter((r) => r.status === "late").length;
  const attendanceRate = filtered.length > 0
    ? Math.round(((presentCount + lateCount) / filtered.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Attendance Management</h2>
        <p className="text-sm text-muted-foreground">Track and manage student lesson attendance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Present", count: presentCount, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Absent", count: absentCount, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Late", count: lateCount, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Attendance Rate", count: `${attendanceRate}%`, color: "text-gold", bg: "bg-gold/10" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-border`}>
            <div className={`text-2xl font-semibold ${s.color} mb-1`}>{s.count}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or lesson..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
        >
          {["All", "present", "absent", "late"].map((s) => (
            <option key={s} value={s}>{s === "All" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lesson</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Teacher</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((record) => {
                const cfg = statusConfig[record.status];
                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                          <span className="text-gold text-xs font-bold">
                            {record.studentName.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{record.studentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{record.lesson}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{record.teacher}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      <p className="text-xs text-muted-foreground">{record.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg}`}>
                        <cfg.icon className={`w-3 h-3 ${cfg.color}`} />
                        <span className={cfg.color}>{cfg.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground max-w-[160px] truncate">
                      {record.notes || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {(["present", "late", "absent"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(record.id, s)}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                              record.status === s
                                ? statusConfig[s].bg + " " + statusConfig[s].color + " border"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No attendance records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
