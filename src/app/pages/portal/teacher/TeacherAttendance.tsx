import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Clock, Plus, Edit2, MessageSquare, X, Save } from "lucide-react";

interface AttendanceRecord {
  id: number;
  student: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late";
  remarks: string;
  classNotes: string;
}

const initialRecords: AttendanceRecord[] = [
  { id: 1, student: "Alex Thompson", date: "2026-05-30", time: "10:00 AM", status: "present", remarks: "Great improvement on barre chords today. Keep practicing the F chord transition.", classNotes: "Covered G-C-D progression, barre chords intro." },
  { id: 2, student: "Maria Santos", date: "2026-05-30", time: "11:30 AM", status: "present", remarks: "Good session. Chord transitions improving. Practice A to E transition.", classNotes: "Reviewed open chords A, D, E. Strumming patterns." },
  { id: 3, student: "David Chen", date: "2026-05-29", time: "2:00 PM", status: "present", remarks: "Excellent fingerpicking work. Ready to move to Travis picking pattern.", classNotes: "Advanced fingerstyle — Travis picking intro." },
  { id: 4, student: "Sarah Kim", date: "2026-05-28", time: "2:00 PM", status: "late", remarks: "Arrived 15 minutes late. Good progress despite shortened session.", classNotes: "Basic chord shapes — G, C, D." },
  { id: 5, student: "James Park", date: "2026-05-27", time: "11:00 AM", status: "present", remarks: "Impressive performance piece progress. Almost recital-ready.", classNotes: "Performance piece run-through, dynamics work." },
  { id: 6, student: "Emily White", date: "2026-05-26", time: "3:00 PM", status: "absent", remarks: "Student was absent. Parent notified.", classNotes: "" },
];

const statusCfg = {
  present: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Present" },
  absent: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "Absent" },
  late: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", label: "Late" },
};

export default function TeacherAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [saved, setSaved] = useState(false);

  const emptyForm: Omit<AttendanceRecord, "id"> = {
    student: "Alex Thompson",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    status: "present",
    remarks: "",
    classNotes: "",
  };

  const [form, setForm] = useState<Omit<AttendanceRecord, "id">>(emptyForm);

  const openAdd = () => {
    setEditRecord(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (record: AttendanceRecord) => {
    setEditRecord(record);
    setForm({ student: record.student, date: record.date, time: record.time, status: record.status, remarks: record.remarks, classNotes: record.classNotes });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editRecord) {
      setRecords((prev) => prev.map((r) => r.id === editRecord.id ? { ...r, ...form } : r));
    } else {
      setRecords((prev) => [{ id: Date.now(), ...form }, ...prev]);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 1000);
  };

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;

  const students = ["Alex Thompson", "Maria Santos", "David Chen", "Sarah Kim", "James Park", "Emily White", "Noah Garcia", "Olivia Brown"];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Attendance</h2>
          <p className="text-sm text-muted-foreground">Record and manage your class attendance</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-xl text-sm font-semibold hover:bg-gold/90 transition-colors flex-shrink-0">
          <Plus className="w-4 h-4" />Record Attendance
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 text-center">
          <div className="text-2xl font-semibold text-green-400">{present}</div>
          <div className="text-xs text-muted-foreground">Present</div>
        </div>
        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 text-center">
          <div className="text-2xl font-semibold text-red-400">{absent}</div>
          <div className="text-xs text-muted-foreground">Absent</div>
        </div>
        <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20 text-center">
          <div className="text-2xl font-semibold text-yellow-400">{late}</div>
          <div className="text-xs text-muted-foreground">Late</div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm">Attendance Records ({records.length})</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Attendance awaits parent approval after recording</p>
        </div>
        <div className="divide-y divide-border">
          {records.map((record) => {
            const s = statusCfg[record.status];
            return (
              <div key={record.id} className="px-5 py-4 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                <s.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-medium">{record.student}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${s.bg} ${s.color}`}>{s.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(record.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {record.time}</p>
                  {record.remarks && (
                    <div className="mt-2 flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed">{record.remarks}</p>
                    </div>
                  )}
                </div>
                <button onClick={() => openEdit(record)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold">{editRecord ? "Edit Attendance" : "Record Attendance"}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Student</label>
                  <select value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold">
                    {students.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Date</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "present" | "absent" | "late" })} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold">
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Lesson Remarks</label>
                  <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} rows={3} placeholder="Notes about student's performance..." className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Class Notes</label>
                  <textarea value={form.classNotes} onChange={(e) => setForm({ ...form, classNotes: e.target.value })} rows={2} placeholder="What was covered in class..." className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-600 text-white" : "bg-gold text-black hover:bg-gold/90"}`}>
                  <Save className="w-4 h-4" />{saved ? "Saved!" : "Save Record"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
