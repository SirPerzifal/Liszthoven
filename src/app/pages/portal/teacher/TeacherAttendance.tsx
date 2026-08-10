import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2, XCircle, Clock, Plus, X, Save, Camera, Upload,
  MapPin, ChevronDown, ChevronUp, MessageSquare, Loader2,
  Trash2, Music2, RefreshCw, AlertCircle, Search, Filter, RotateCcw,
  UserCheck, Users, ArrowRight, Check, Lock
} from "lucide-react";
import { odooCall } from "../../../context/AuthContext";

const statusCfg: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  present: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Present" },
  absent:  { icon: XCircle,      color: "text-red-400",   bg: "bg-red-500/10 border-red-500/20",   label: "Absent"  },
  pending: { icon: Clock,         color: "text-yellow-400",bg: "bg-yellow-500/10 border-yellow-500/20", label: "Pending"},
};

type AttStatus = "present" | "absent" | "pending";

interface StudentLine {
  student_id: number;
  student_name: string;
  status: AttStatus;
  photos: string[];
  remarks: string;
}

interface ScheduleRecord {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  instrument_name: string;
  branch_name: string;
  teacher_attendance: AttStatus;
  teacher_remarks: string;
  teacher_photos?: string[];
  students: Array<{
    student_id: number;
    student_name: string;
    attendance: AttStatus;
    latitude: number;
    longitude: number;
    photos: string[];
    remarks: string;
  }>;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res((reader.result as string).split(",")[1]);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function isSessionStarted(dateStr?: string, startTimeStr?: string): boolean {
  if (!dateStr) return true;
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    let hours = 0, minutes = 0;
    if (startTimeStr && startTimeStr.includes(":")) {
      const parts = startTimeStr.split(":");
      hours = parseInt(parts[0], 10) || 0;
      minutes = parseInt(parts[1], 10) || 0;
    }
    const sessionStart = new Date(year, month - 1, day, hours, minutes, 0);
    return new Date() >= sessionStart;
  } catch {
    return true;
  }
}

export default function TeacherAttendance() {
  const [records, setRecords] = useState<ScheduleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AttStatus>("all");
  const [instrumentFilter, setInstrumentFilter] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1 = Teacher Room Proof & Presence, 2 = Student Attendance & Proof
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleRecord | null>(null);

  // Teacher Attendance Form
  const [teacherStatus, setTeacherStatus] = useState<"present" | "absent">("present");
  const [teacherRemarks, setTeacherRemarks] = useState("");
  const [teacherPhotos, setTeacherPhotos] = useState<string[]>([]);
  const [gpsLat, setGpsLat] = useState(0);
  const [gpsLng, setGpsLng] = useState(0);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "got" | "error">("idle");
  const [teacherSaved, setTeacherSaved] = useState(false);

  // Student Attendance Form
  const [studentLines, setStudentLines] = useState<StudentLine[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await odooCall("/liszthoven_custom/attendance/list");
      if (res?.success) setRecords(res.records || []);
      else setError(res?.error || "Failed to load attendance records.");
    } catch (e: any) {
      setError(e.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecords(); }, []);

  const captureGPS = () => {
    if (!navigator.geolocation) { setGpsStatus("error"); return; }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(pos.coords.latitude);
        setGpsLng(pos.coords.longitude);
        setGpsStatus("got");
      },
      () => setGpsStatus("error"),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const openModalForSchedule = (record: ScheduleRecord, initialStep: 1 | 2 = 1) => {
    const started = isSessionStarted(record.date, record.start_time);
    if (!started) {
      alert(`Attendance cannot be recorded before session start time.\nSession starts at: ${record.date} ${record.start_time}`);
      return;
    }

    setSelectedSchedule(record);
    setTeacherStatus(record.teacher_attendance === "absent" ? "absent" : "present");
    setTeacherRemarks(record.teacher_remarks || "");
    setTeacherPhotos(record.teacher_photos || []);
    setStudentLines(
      (record.students || []).map((s) => ({
        student_id: s.student_id,
        student_name: s.student_name,
        status: s.attendance || "present",
        photos: s.photos || [],
        remarks: s.remarks || "",
      }))
    );
    setTeacherSaved(record.teacher_attendance !== "pending");
    setSubmitSuccess(false);
    setStep(initialStep);
    setShowModal(true);
    // Capture GPS automatically when teacher fills attendance
    captureGPS();
  };

  const addTeacherPhotos = async (files: FileList) => {
    const b64s: string[] = [];
    for (const file of Array.from(files)) b64s.push(await fileToBase64(file));
    setTeacherPhotos((prev) => [...prev, ...b64s]);
  };

  const removeTeacherPhoto = (idx: number) => {
    setTeacherPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateLine = (studentId: number, updates: Partial<StudentLine>) =>
    setStudentLines((prev) => prev.map((l) => l.student_id === studentId ? { ...l, ...updates } : l));

  const addStudentPhotos = async (studentId: number, files: FileList) => {
    const b64s: string[] = [];
    for (const file of Array.from(files)) b64s.push(await fileToBase64(file));
    setStudentLines((prev) => prev.map((l) =>
      l.student_id === studentId ? { ...l, photos: [...l.photos, ...b64s] } : l
    ));
  };

  const removeStudentPhoto = (studentId: number, idx: number) =>
    setStudentLines((prev) => prev.map((l) =>
      l.student_id === studentId ? { ...l, photos: l.photos.filter((_, i) => i !== idx) } : l
    ));

  // Save Phase 1: Teacher Attendance & Room Proof
  const handleSaveTeacherAttendance = async () => {
    if (!selectedSchedule) return;
    if (!isSessionStarted(selectedSchedule.date, selectedSchedule.start_time)) {
      alert(`Attendance cannot be saved before session start time (${selectedSchedule.date} ${selectedSchedule.start_time}).`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await odooCall("/liszthoven_custom/teacher/attendance/submit", {
        schedule_id: selectedSchedule.id,
        teacher_status: teacherStatus,
        teacher_latitude: gpsLat,
        teacher_longitude: gpsLng,
        teacher_photos: teacherPhotos,
        remarks: teacherRemarks,
      });
      if (res?.success) {
        setTeacherSaved(true);
        loadRecords();
      } else {
        alert(res?.error || "Failed to save teacher attendance.");
      }
    } catch (e: any) {
      alert(e.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  // Save Phase 2: Complete Student Attendance
  const handleSaveStudentAttendance = async () => {
    if (!selectedSchedule) return;
    if (!isSessionStarted(selectedSchedule.date, selectedSchedule.start_time)) {
      alert(`Attendance cannot be saved before session start time (${selectedSchedule.date} ${selectedSchedule.start_time}).`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await odooCall("/liszthoven_custom/teacher/attendance/submit", {
        schedule_id: selectedSchedule.id,
        teacher_status: teacherStatus,
        teacher_latitude: gpsLat,
        teacher_longitude: gpsLng,
        teacher_photos: teacherPhotos,
        remarks: teacherRemarks,
        student_lines: studentLines.map((l) => ({
          student_id: l.student_id,
          status: l.status,
          latitude: gpsLat,
          longitude: gpsLng,
          photos: l.photos,
          remarks: l.remarks,
        })),
      });
      if (res?.success) {
        setSubmitSuccess(true);
        loadRecords();
        setTimeout(() => { setShowModal(false); }, 1200);
      } else {
        alert(res?.error || "Failed to submit student attendance.");
      }
    } catch (e: any) {
      alert(e.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = records.filter((r) => r.teacher_attendance === "present").length;
  const absentCount  = records.filter((r) => r.teacher_attendance === "absent").length;
  const pendingCount = records.filter((r) => r.teacher_attendance === "pending").length;

  const uniqueInstruments = Array.from(
    new Set(records.map((r) => r.instrument_name).filter(Boolean))
  );

  const filteredRecords = records.filter((record) => {
    if (statusFilter !== "all" && record.teacher_attendance !== statusFilter) {
      return false;
    }
    if (instrumentFilter !== "all" && record.instrument_name !== instrumentFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchInst = record.instrument_name?.toLowerCase().includes(q);
      const matchBranch = record.branch_name?.toLowerCase().includes(q);
      const matchDate = record.date?.toLowerCase().includes(q);
      const matchRemarks = record.teacher_remarks?.toLowerCase().includes(q);
      const matchStudents = record.students?.some(
        (s) => s.student_name?.toLowerCase().includes(q) || s.remarks?.toLowerCase().includes(q)
      );
      if (!matchInst && !matchBranch && !matchDate && !matchRemarks && !matchStudents) {
        return false;
      }
    }
    return true;
  });

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all" || instrumentFilter !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setInstrumentFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Attendance</h2>
          <p className="text-sm text-muted-foreground">Record and manage your class attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadRecords} title="Refresh records" className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Interactive Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: "present", count: presentCount, label: "Present", cls: "bg-green-500/10 border-green-500/20 text-green-400 hover:border-green-500/50" },
          { key: "absent",  count: absentCount,  label: "Absent",  cls: "bg-red-500/10 border-red-500/20 text-red-400 hover:border-red-500/50" },
          { key: "pending", count: pendingCount, label: "Pending", cls: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:border-yellow-500/50" },
        ].map(({ key, count, label, cls }) => {
          const isActive = statusFilter === key;
          return (
            <button
              key={label}
              onClick={() => setStatusFilter(isActive ? "all" : (key as AttStatus))}
              className={`rounded-xl p-4 border text-center transition-all cursor-pointer relative ${cls} ${
                isActive ? "ring-2 ring-gold shadow-lg shadow-gold/10" : ""
              }`}
            >
              <div className="text-2xl font-semibold">{count}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              {isActive && (
                <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-gold text-black uppercase tracking-wider">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filtering Toolbar */}
      <div className="bg-card p-4 rounded-xl border border-border space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, instrument, branch, or date..."
              className="w-full pl-9 pr-8 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Instrument Dropdown */}
            <div className="flex items-center gap-1.5 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm text-muted-foreground w-full sm:w-auto">
              <Music2 className="w-4 h-4 text-gold flex-shrink-0" />
              <select
                value={instrumentFilter}
                onChange={(e) => setInstrumentFilter(e.target.value)}
                className="bg-transparent text-foreground text-xs font-medium focus:outline-none cursor-pointer pr-1 w-full"
              >
                <option value="all" className="bg-card text-foreground">All Instruments</option>
                {uniqueInstruments.map((inst) => (
                  <option key={inst} value={inst} className="bg-card text-foreground">
                    {inst}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-muted/50 border border-border rounded-xl px-3 py-2 text-sm text-muted-foreground w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gold flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-foreground text-xs font-medium focus:outline-none cursor-pointer pr-1 w-full"
              >
                <option value="all" className="bg-card text-foreground">All Statuses</option>
                <option value="present" className="bg-card text-foreground">Present</option>
                <option value="absent" className="bg-card text-foreground">Absent</option>
                <option value="pending" className="bg-card text-foreground">Pending</option>
              </select>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground">Active filters:</span>
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gold/10 text-gold border border-gold/20 font-medium">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("all")} className="hover:opacity-75"><X className="w-3 h-3" /></button>
              </span>
            )}
            {instrumentFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gold/10 text-gold border border-gold/20 font-medium">
                Instrument: {instrumentFilter}
                <button onClick={() => setInstrumentFilter("all")} className="hover:opacity-75"><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchQuery.trim() !== "" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gold/10 text-gold border border-gold/20 font-medium">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:opacity-75"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">
              Attendance Records ({filteredRecords.length}
              {filteredRecords.length !== records.length ? ` of ${records.length}` : ""})
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Click a row to expand details or record attendance</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
            <button onClick={loadRecords} className="text-xs bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">Retry</button>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No records yet.</div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
            <Filter className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm">No attendance records match your filter criteria.</p>
            <button
              onClick={resetFilters}
              className="text-xs bg-gold/10 text-gold border border-gold/20 px-3 py-1.5 rounded-lg hover:bg-gold/20 transition-colors font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" /> Clear all filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredRecords.map((record) => {
              const tcfg = statusCfg[record.teacher_attendance] || statusCfg.pending;
              const isExpanded = expandedId === record.id;
              const isPending = record.teacher_attendance === "pending";
              const started = isSessionStarted(record.date, record.start_time);

              return (
                <div key={record.id}>
                  <div
                    className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <tcfg.icon className={`w-5 h-5 flex-shrink-0 ${tcfg.color}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-semibold">{record.instrument_name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${tcfg.bg} ${tcfg.color}`}>
                            Teacher: {tcfg.label}
                          </span>
                          {!started && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Not Started Yet
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {record.date ? new Date(record.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "—"}
                          {" · "}{record.start_time}–{record.end_time} · {record.branch_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{record.students.length} student(s)</p>
                      </div>
                    </div>

                    {/* Per-Schedule Record Attendance Button with Start Time Check */}
                    <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      {!started ? (
                        <button
                          onClick={() => alert(`Attendance cannot be recorded before session start time.\nSession starts at: ${record.date} ${record.start_time}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 text-muted-foreground border border-border rounded-xl text-xs font-medium cursor-not-allowed opacity-80"
                          title={`Session starts at ${record.date} ${record.start_time}`}
                        >
                          <Lock className="w-3.5 h-3.5 text-yellow-500" />
                          Not Started Yet
                        </button>
                      ) : isPending ? (
                        <button
                          onClick={() => openModalForSchedule(record, 1)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-gold text-black rounded-xl text-xs font-semibold hover:bg-gold/90 transition-colors shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Record Attendance
                        </button>
                      ) : (
                        <button
                          onClick={() => openModalForSchedule(record, 2)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/40 text-gold hover:bg-gold/10 rounded-xl text-xs font-medium transition-colors"
                        >
                          <Users className="w-3.5 h-3.5" />
                          Edit / Student Attendance
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : record.id)}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Schedule Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-5 pb-5 space-y-4 pt-1 border-t border-border/50">
                          {!started && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3 rounded-xl text-xs flex items-center gap-2">
                              <Lock className="w-4 h-4 flex-shrink-0" />
                              <span>This session has not started yet. Attendance recording will open on <strong>{record.date} at {record.start_time}</strong>.</span>
                            </div>
                          )}

                          {/* Teacher Remarks & Teacher Room Proof Photos */}
                          <div className="bg-muted/40 rounded-xl p-3.5 border border-border space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-gold flex items-center gap-1.5">
                                <UserCheck className="w-3.5 h-3.5" /> Teacher Room Check-in Proof
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded border ${tcfg.bg} ${tcfg.color}`}>{tcfg.label}</span>
                            </div>

                            {record.teacher_remarks && (
                              <p className="text-xs text-muted-foreground">{record.teacher_remarks}</p>
                            )}

                            {record.teacher_photos && record.teacher_photos.length > 0 ? (
                              <div>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Teacher Proof Photos (Room)</p>
                                <div className="flex gap-2 flex-wrap">
                                  {record.teacher_photos.map((photo, pi) => (
                                    <img key={pi} src={`data:image/jpeg;base64,${photo}`} alt={`Teacher Proof ${pi + 1}`} className="w-16 h-16 rounded-lg object-cover border border-gold/30" />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground/60 italic">No room proof photos uploaded yet.</p>
                            )}
                          </div>

                          {/* Student Attendance & Photos */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student Attendance List</p>
                            {record.students.map((s) => {
                              const scfg = statusCfg[s.attendance] || statusCfg.pending;
                              return (
                                <div key={s.student_id} className="bg-muted/30 rounded-xl p-3 border border-border">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium">{s.student_name}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded border ${scfg.bg} ${scfg.color}`}>{scfg.label}</span>
                                  </div>
                                  {s.remarks && <p className="text-xs text-muted-foreground mb-2" style={{ fontStyle: "normal" }}>{s.remarks}</p>}
                                  {(s.latitude !== 0 || s.longitude !== 0) && (
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-2">
                                      <MapPin className="w-3 h-3 text-gold" /> GPS: {s.latitude.toFixed(5)}, {s.longitude.toFixed(5)}
                                    </p>
                                  )}
                                  {s.photos?.length > 0 && (
                                    <div>
                                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Student Class Photos</p>
                                      <div className="flex gap-2 flex-wrap">
                                        {s.photos.map((photo, pi) => (
                                          <img key={pi} src={`data:image/jpeg;base64,${photo}`} alt={`Student Photo ${pi + 1}`} className="w-16 h-16 rounded-lg object-cover border border-border" />
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two-Phase Record Attendance Modal */}
      <AnimatePresence>
        {showModal && selectedSchedule && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && !submitting && setShowModal(false)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header with Phase Tabs */}
              <div className="px-6 py-4 border-b border-border flex-shrink-0 bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-base">{selectedSchedule.instrument_name} Session</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedSchedule.date ? new Date(selectedSchedule.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "—"}
                      {" · "}{selectedSchedule.start_time}–{selectedSchedule.end_time} · {selectedSchedule.branch_name}
                    </p>
                  </div>
                  <button onClick={() => !submitting && setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Step / Phase Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-muted/60 p-1 rounded-xl">
                  <button
                    onClick={() => setStep(1)}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      step === 1 ? "bg-gold text-black shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" /> 1. Teacher Presence & Room Proof
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                      step === 2 ? "bg-gold text-black shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> 2. Student Attendance
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {!isSessionStarted(selectedSchedule.date, selectedSchedule.start_time) && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5">
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span>Session Not Started Yet — Attendance opens on <strong>{selectedSchedule.date} at {selectedSchedule.start_time}</strong>.</span>
                  </div>
                )}

                {/* STEP 1: Teacher Presence & Room Proof */}
                {step === 1 && (
                  <div className="space-y-5">
                    {/* Geolocation status banner */}
                    <div className="bg-muted/40 p-3.5 rounded-xl border border-border flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className={`w-4 h-4 ${gpsStatus === "loading" ? "animate-bounce text-gold" : gpsStatus === "got" ? "text-green-400" : "text-gold"}`} />
                        <span>
                          {gpsStatus === "got"
                            ? `GPS Captured (${gpsLat.toFixed(5)}, ${gpsLng.toFixed(5)})`
                            : gpsStatus === "loading"
                            ? "Capturing GPS location..."
                            : gpsStatus === "error"
                            ? "Could not capture location"
                            : "Auto capturing location..."}
                        </span>
                      </div>
                      <button
                        onClick={captureGPS}
                        disabled={gpsStatus === "loading"}
                        className="text-[11px] font-semibold text-gold hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${gpsStatus === "loading" ? "animate-spin" : ""}`} /> Refresh GPS
                      </button>
                    </div>

                    {/* Teacher Status Toggle */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Your Presence Status
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["present", "absent"] as const).map((s) => {
                          const cfg = statusCfg[s];
                          return (
                            <button
                              key={s}
                              onClick={() => setTeacherStatus(s)}
                              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                                teacherStatus === s ? `${cfg.bg} ${cfg.color} border-current` : "border-border hover:border-border/60"
                              }`}
                            >
                              <cfg.icon className={`w-4 h-4 ${teacherStatus === s ? cfg.color : "text-muted-foreground"}`} />
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Teacher Room Proof Photos */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Teacher Room Proof Photos <span className="text-gold font-normal">(Required Proof in Room)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {teacherPhotos.map((photo, pi) => (
                          <div key={pi} className="relative group">
                            <img src={`data:image/jpeg;base64,${photo}`} alt={`Teacher Photo ${pi + 1}`} className="w-20 h-20 rounded-xl object-cover border border-gold/40 shadow-sm" />
                            <button
                              onClick={() => removeTeacherPhoto(pi)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-90 hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gold/40 hover:border-gold bg-gold/5 flex flex-col items-center justify-center cursor-pointer transition-colors" title="Upload Photo">
                          <Upload className="w-4 h-4 text-gold mb-0.5" />
                          <span className="text-[10px] font-semibold text-gold">Upload</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && addTeacherPhotos(e.target.files)} />
                        </label>
                        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gold/40 hover:border-gold bg-gold/5 flex flex-col items-center justify-center cursor-pointer transition-colors" title="Camera Photo">
                          <Camera className="w-4 h-4 text-gold mb-0.5" />
                          <span className="text-[10px] font-semibold text-gold">Camera</span>
                          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files && addTeacherPhotos(e.target.files)} />
                        </label>
                      </div>
                    </div>

                    {/* Teacher Remarks */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Teacher Class Remarks <span className="normal-case font-normal">(optional)</span>
                      </label>
                      <textarea
                        value={teacherRemarks}
                        onChange={(e) => setTeacherRemarks(e.target.value)}
                        rows={3}
                        placeholder="General notes about today's session or room state..."
                        className="w-full px-3.5 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:border-gold resize-none"
                        style={{ fontStyle: "normal" }}
                      />
                    </div>

                    {/* Save Teacher Presence Action */}
                    <div className="pt-2">
                      {teacherSaved && (
                        <div className="mb-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-medium"><Check className="w-4 h-4" /> Teacher presence saved!</span>
                          <button onClick={() => setStep(2)} className="font-semibold underline hover:text-green-300">Proceed to Student Attendance →</button>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveTeacherAttendance}
                          disabled={submitting || !isSessionStarted(selectedSchedule.date, selectedSchedule.start_time)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold/90 transition-colors disabled:opacity-40"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          {submitting ? "Saving..." : "Save Teacher Attendance"}
                        </button>
                        <button
                          onClick={() => setStep(2)}
                          className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
                        >
                          Next: Students <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Student Attendance & Class Proof */}
                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">Mark attendance status and upload class proof photos for each student.</p>

                    {studentLines.length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground">No students enrolled in this session.</div>
                    ) : (
                      studentLines.map((line) => (
                        <div key={line.student_id} className="bg-muted/40 rounded-xl border border-border p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                                <span className="text-gold text-xs font-bold">{line.student_name.charAt(0)}</span>
                              </div>
                              <p className="text-sm font-semibold">{line.student_name}</p>
                            </div>
                            <div className="flex gap-2">
                              {(["present", "absent"] as const).map((s) => {
                                const cfg = statusCfg[s];
                                return (
                                  <button
                                    key={s}
                                    onClick={() => updateLine(line.student_id, { status: s })}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                      line.status === s ? `${cfg.bg} ${cfg.color} border-current` : "border-border hover:border-border/60 text-muted-foreground"
                                    }`}
                                  >
                                    <cfg.icon className="w-3.5 h-3.5" />{cfg.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Student Photos */}
                          <div>
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Student Class Proof Photos</p>
                            <div className="flex flex-wrap gap-2">
                              {line.photos.map((photo, pi) => (
                                <div key={pi} className="relative group">
                                  <img src={`data:image/jpeg;base64,${photo}`} alt={`Student Photo ${pi + 1}`} className="w-16 h-16 rounded-lg object-cover border border-border" />
                                  <button
                                    onClick={() => removeStudentPhoto(line.student_id, pi)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <label className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-gold/50 flex flex-col items-center justify-center cursor-pointer transition-colors" title="Upload Photo">
                                <Upload className="w-4 h-4 text-muted-foreground mb-0.5" />
                                <span className="text-[9px] text-muted-foreground">Upload</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && addStudentPhotos(line.student_id, e.target.files)} />
                              </label>
                              <label className="w-16 h-16 rounded-lg border-2 border-dashed border-border hover:border-gold/50 flex flex-col items-center justify-center cursor-pointer transition-colors" title="Camera Photo">
                                <Camera className="w-4 h-4 text-muted-foreground mb-0.5" />
                                <span className="text-[9px] text-muted-foreground">Camera</span>
                                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files && addStudentPhotos(line.student_id, e.target.files)} />
                              </label>
                            </div>
                          </div>

                          {/* Student Remarks */}
                          <textarea
                            value={line.remarks}
                            onChange={(e) => updateLine(line.student_id, { remarks: e.target.value })}
                            rows={2}
                            placeholder={`Remarks for ${line.student_name}...`}
                            className="w-full px-3 py-2 bg-muted/60 border border-border rounded-lg text-xs focus:outline-none focus:border-gold resize-none"
                            style={{ fontStyle: "normal" }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}

                {submitSuccess && (
                  <div className="flex flex-col items-center justify-center py-6 gap-2 bg-green-500/10 rounded-xl border border-green-500/20">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                    <p className="text-sm font-semibold text-green-400">Attendance Fully Saved!</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!submitSuccess && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-border flex-shrink-0 bg-card">
                  <button
                    onClick={() => step === 2 ? setStep(1) : setShowModal(false)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors disabled:opacity-40"
                  >
                    {step === 2 ? "← Back to Teacher Proof" : "Close"}
                  </button>
                  {step === 2 && (
                    <button
                      onClick={handleSaveStudentAttendance}
                      disabled={submitting || !isSessionStarted(selectedSchedule.date, selectedSchedule.start_time)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-black text-xs font-semibold hover:bg-gold/90 transition-all shadow-sm disabled:opacity-40"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {submitting ? "Saving..." : "Save All Attendance"}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
