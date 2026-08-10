import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, MessageSquare,
  MapPin, Loader2, AlertCircle, RefreshCw, Calendar, X, Send, Info,
  Upload, FileText, FileCheck, ShieldAlert
} from "lucide-react";
import { odooCall } from "../../../context/AuthContext";

const statusCfg: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  present: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Present" },
  absent:  { icon: XCircle,      color: "text-red-400",   bg: "bg-red-500/10 border-red-500/20",   label: "Absent"  },
  pending: { icon: Clock,         color: "text-yellow-400",bg: "bg-yellow-500/10 border-yellow-500/20", label: "Pending"},
};

interface StudentLine {
  id: number;
  student_id: number;
  student_name: string;
  attendance: string;
  student_attendance: string;
  parent_verification: string;
  latitude: number;
  longitude: number;
  photos: string[];
  remarks: string;
  appeal_status?: "none" | "pending" | "approved" | "rejected";
  appeal_rejection_reason?: string;
  appeal_request_id?: number;
}

interface AttRecord {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  instrument_name: string;
  branch_name: string;
  teacher_name: string;
  teacher_attendance: string;
  teacher_remarks: string;
  reschedule_state?: string;
  can_reschedule?: boolean;
  can_appeal?: boolean;
  reschedule_cutoff_minutes?: number;
  cutoff_reason?: string;
  students: StudentLine[];
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result.includes(",")) {
        res(result.split(",")[1]);
      } else {
        res(result);
      }
    };
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

export default function ParentAttendance() {
  const [records, setRecords] = useState<AttRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<string>("All");
  const [photoModal, setPhotoModal] = useState<{ photos: string[]; idx: number } | null>(null);

  // Normal Reschedule Modal State
  const [rescheduleTarget, setRescheduleTarget] = useState<{ record: AttRecord; student: StudentLine } | null>(null);
  const [reqDate, setReqDate] = useState("");
  const [reqTime, setReqTime] = useState("14:00");
  const [submittingReschedule, setSubmittingReschedule] = useState(false);
  const [rescheduleMessage, setRescheduleMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Appeal Modal State
  const [appealTarget, setAppealTarget] = useState<{ record: AttRecord; student: StudentLine } | null>(null);
  const [reasonCategory, setReasonCategory] = useState<"medical" | "emergency" | "other">("medical");
  const [appealRemarks, setAppealRemarks] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [submittingAppeal, setSubmittingAppeal] = useState(false);
  const [appealMessage, setAppealMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // View Rejection Reason Modal
  const [viewRejection, setViewRejection] = useState<{ studentName: string; reason: string } | null>(null);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await odooCall("/liszthoven_custom/attendance/list");
      if (res?.success) setRecords(res.records || []);
      else setError(res?.error || "Failed to load attendance.");
    } catch (e: any) {
      setError(e.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Handle Photo Upload Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setEvidencePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setEvidencePreview(null);
      }
    }
  };

  // Propose Reschedule Submission (Normal within Cutoff)
  const handleProposeReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget || !reqDate || !reqTime) return;

    try {
      setSubmittingReschedule(true);
      setRescheduleMessage(null);

      const res = await odooCall("/liszthoven_custom/reschedule/create", {
        schedule_id: rescheduleTarget.record.id,
        requested_date: reqDate,
        requested_start_time: reqTime,
      });

      if (res?.success) {
        setRescheduleMessage({
          type: "success",
          text: "Reschedule request submitted successfully! Pending approval from teacher/admin.",
        });
        setTimeout(() => {
          setRescheduleTarget(null);
          setRescheduleMessage(null);
          loadRecords();
        }, 1800);
      } else {
        setRescheduleMessage({
          type: "error",
          text: res?.error || "Failed to submit reschedule request.",
        });
      }
    } catch (err: any) {
      setRescheduleMessage({
        type: "error",
        text: err.message || "An error occurred while submitting reschedule request.",
      });
    } finally {
      setSubmittingReschedule(false);
    }
  };

  // Submit Appeal Handler (When Cutoff Closed)
  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealTarget || !appealRemarks) return;

    try {
      setSubmittingAppeal(true);
      setAppealMessage(null);

      let base64Photo = "";
      if (evidenceFile) {
        base64Photo = await fileToBase64(evidenceFile);
      }

      const res = await odooCall("/liszthoven_custom/credit_recovery/create", {
        attendance_line_id: appealTarget.student.id,
        schedule_id: appealTarget.record.id,
        student_id: appealTarget.student.student_id,
        reason_category: reasonCategory,
        remarks: appealRemarks,
        evidence_file: base64Photo,
        evidence_filename: evidenceFile?.name || "evidence.jpg",
      });

      if (res?.success) {
        setAppealMessage({
          type: "success",
          text: "Appeal request with photo proof submitted to administration successfully!",
        });
        setTimeout(() => {
          setAppealTarget(null);
          setAppealMessage(null);
          setEvidenceFile(null);
          setEvidencePreview(null);
          setAppealRemarks("");
          loadRecords();
        }, 1800);
      } else {
        setAppealMessage({
          type: "error",
          text: res?.error || "Failed to submit appeal request.",
        });
      }
    } catch (err: any) {
      setAppealMessage({
        type: "error",
        text: err.message || "An error occurred while submitting appeal.",
      });
    } finally {
      setSubmittingAppeal(false);
    }
  };

  // Build a flat list of (record, student_line) pairs
  const flatRecords = records.flatMap((r) =>
    r.students.map((s) => ({ record: r, student: s }))
  );

  const childNames = Array.from(new Set(flatRecords.map((f) => f.student.student_name)));

  const filtered = flatRecords.filter(
    ({ student }) => selectedChild === "All" || student.student_name === selectedChild
  );

  const presentCount = filtered.filter((f) => f.student.attendance === "present").length;
  const absentCount  = filtered.filter((f) => f.student.attendance === "absent").length;
  const rate = filtered.length > 0 ? Math.round((presentCount / filtered.length) * 100) : 0;

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontStyle: "italic" }}>
            Children's Attendance & Appeals
          </h2>
          <p className="text-sm text-muted-foreground">
            Track lesson attendance, propose schedule changes, or submit appeals with photo proof when cutoff is closed
          </p>
        </div>
        <button
          onClick={loadRecords}
          className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors flex items-center gap-2 text-xs font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Child filter tabs */}
      {childNames.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {["All", ...childNames].map((name) => (
            <button
              key={name}
              onClick={() => setSelectedChild(name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedChild === name
                  ? "bg-gold text-black border-gold shadow-sm"
                  : "border-border hover:border-gold/50 text-muted-foreground"
              }`}
            >
              {name === "All" ? "All Children" : name}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 rounded-2xl p-4 border border-green-500/20 text-center">
          <div className="text-2xl font-bold text-green-400">{presentCount}</div>
          <div className="text-xs text-muted-foreground">Present Sessions</div>
        </div>
        <div className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20 text-center">
          <div className="text-2xl font-bold text-red-400">{absentCount}</div>
          <div className="text-xs text-muted-foreground">Absent Sessions</div>
        </div>
        <div className="bg-gold/10 rounded-2xl p-4 border border-gold/20 text-center">
          <div className="text-2xl font-bold text-gold">{rate}%</div>
          <div className="text-xs text-muted-foreground">Attendance Rate</div>
        </div>
      </div>

      {/* Records Container */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-sm">Attendance & Class Sessions ({filtered.length})</h3>
          <span className="text-xs text-muted-foreground">
            Normal cutoff: 12 hours before start • Late Cutoff Appeals require photo proof
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading attendance records...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
            <button onClick={loadRecords} className="text-xs bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">No attendance records found.</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(({ record, student }) => {
              const rowKey = `${record.id}-${student.student_id}`;
              const scfg = statusCfg[student.attendance] || statusCfg.pending;
              const tcfg = statusCfg[record.teacher_attendance] || statusCfg.pending;
              const isExpanded = expandedKey === rowKey;

              const resState = record.reschedule_state || "normal";
              const canReschedule = record.can_reschedule ?? false;
              const canAppeal = record.can_appeal ?? false;
              const cutoffReason = record.cutoff_reason || "";
              const appealStatus = student.appeal_status || "none";

              return (
                <div key={rowKey} className="transition-colors hover:bg-muted/20">
                  <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => setExpandedKey(isExpanded ? null : rowKey)}
                    >
                      <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gold text-xs font-bold">{student.student_name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-sm font-semibold">{student.student_name}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-sm text-foreground/90">{record.instrument_name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {record.teacher_name} · {record.start_time}–{record.end_time} · {record.branch_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-semibold">
                          {record.date ? new Date(record.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "—"}
                        </p>
                        <div className="flex items-center gap-1.5 justify-end mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${scfg.bg} ${scfg.color}`}>
                            {scfg.label}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${tcfg.bg} ${tcfg.color}`}>
                            T: {tcfg.label}
                          </span>
                        </div>
                      </div>

                      {/* Appeal / Reschedule Action Badges & Buttons */}
                      {appealStatus === "pending" ? (
                        <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Appeal Pending Review
                        </span>
                      ) : appealStatus === "approved" ? (
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <span className="text-xs px-2.5 py-1 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Appeal Approved
                          </span>
                          {resState === "pending_reschedule" ? (
                            <span className="text-xs px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Pending: {record.proposed_date || "New Slot"} ({record.proposed_start_time || ""})
                            </span>
                          ) : resState === "rescheduled" ? (
                            <span className="text-xs px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Rescheduled to {record.rescheduled_to_date || "New Slot"} ({record.rescheduled_to_time || ""})
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setRescheduleTarget({ record, student });
                                setReqDate("");
                                setReqTime(record.start_time || "14:00");
                              }}
                              className="px-3 py-1 rounded-xl bg-gold hover:bg-gold/90 text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              Propose Reschedule
                            </button>
                          )}
                        </div>
                      ) : appealStatus === "rejected" ? (
                        <button
                          onClick={() => setViewRejection({ studentName: student.student_name, reason: student.appeal_rejection_reason || "Admin declined request." })}
                          className="text-xs px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-medium flex items-center gap-1.5 hover:bg-red-500/20 transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Appeal Rejected (Reason)
                        </button>
                      ) : resState === "pending_reschedule" ? (
                        <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Reschedule Pending: {record.proposed_date ? `${record.proposed_date} @ ${record.proposed_start_time}` : "Proposed"}
                        </span>
                      ) : resState === "rescheduled" ? (
                        <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Rescheduled to {record.rescheduled_to_date ? `${record.rescheduled_to_date} @ ${record.rescheduled_to_time}` : "New Session"}
                        </span>
                      ) : canReschedule ? (
                        <button
                          onClick={() => {
                            setRescheduleTarget({ record, student });
                            setReqDate("");
                            setReqTime(record.start_time || "14:00");
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Propose Reschedule
                        </button>
                      ) : canAppeal ? (
                        /* Cutoff Closed -> Request Appeal Button */
                        <button
                          onClick={() => {
                            setAppealTarget({ record, student });
                            setReasonCategory("medical");
                            setAppealRemarks("");
                            setEvidenceFile(null);
                            setEvidencePreview(null);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Request Appeal
                        </button>
                      ) : null}

                      <button
                        onClick={() => setExpandedKey(isExpanded ? null : rowKey)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Session Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-3 pt-1 border-t border-border/40">
                          {cutoffReason && (
                            <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                                <span>Session Status: {cutoffReason}</span>
                              </div>
                              {canAppeal && (
                                <span className="text-amber-400 font-medium">
                                  Cutoff Closed — Submit proof photo & reason to appeal
                                </span>
                              )}
                            </div>
                          )}

                          {record.teacher_remarks && (
                            <div className="bg-muted rounded-xl p-4 flex gap-3">
                              <MessageSquare className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gold mb-1">Teacher's Remarks</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {record.teacher_remarks}
                                </p>
                              </div>
                            </div>
                          )}

                          {student.remarks && (
                            <div className="bg-muted/40 rounded-xl p-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Class Notes</p>
                              <p className="text-sm text-muted-foreground">{student.remarks}</p>
                            </div>
                          )}

                          {(student.latitude !== 0 || student.longitude !== 0) && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 text-gold" />
                              Location recorded: {student.latitude.toFixed(5)}, {student.longitude.toFixed(5)}
                            </div>
                          )}

                          {student.photos?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Attendance Photos</p>
                              <div className="flex gap-2 flex-wrap">
                                {student.photos.map((photo, pi) => (
                                  <button
                                    key={pi}
                                    onClick={() => setPhotoModal({ photos: student.photos, idx: pi })}
                                    className="w-20 h-20 rounded-lg overflow-hidden border border-border hover:border-gold/50 transition-colors"
                                  >
                                    <img
                                      src={`data:image/jpeg;base64,${photo}`}
                                      alt={`Photo ${pi + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
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

      {/* REQUEST APPEAL MODAL FORM (Photo & Reason Upload) */}
      <AnimatePresence>
        {appealTarget && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setAppealTarget(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" /> Submit Cutoff Appeal Request
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Standard reschedule window is closed. Submit medical/emergency proof for admin review and approval.
                </p>
              </div>

              {/* Target Session Details */}
              <div className="bg-muted/40 border border-border rounded-xl p-3.5 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student Name:</span>
                  <span className="font-semibold">{appealTarget.student.student_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course Instrument:</span>
                  <span className="font-semibold">{appealTarget.record.instrument_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teacher:</span>
                  <span className="font-semibold">{appealTarget.record.teacher_name}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border/40 text-amber-400 font-semibold">
                  <span>Class Session:</span>
                  <span>
                    {appealTarget.record.date} at {appealTarget.record.start_time}
                  </span>
                </div>
              </div>

              {appealMessage && (
                <div
                  className={`p-3 rounded-xl text-xs border ${
                    appealMessage.type === "success"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {appealMessage.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmitAppeal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Reason Category *
                  </label>
                  <select
                    value={reasonCategory}
                    onChange={(e) => setReasonCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="medical">Medical / Illness (Doctor's Note)</option>
                    <option value="emergency">Family Emergency / Urgent Incident</option>
                    <option value="other">Other Special Circumstance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Detailed Reason & Explanation *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a detailed explanation of why the session was missed or needs late rescheduling..."
                    value={appealRemarks}
                    onChange={(e) => setAppealRemarks(e.target.value)}
                    className="w-full px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                {/* Photo / Evidence Upload */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Attach Proof Photo / Document (Medical Note, Emergency Letter)
                  </label>
                  <div className="border-2 border-dashed border-border hover:border-amber-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors relative bg-muted/20">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {evidenceFile ? (
                      <div className="flex items-center justify-center gap-3">
                        {evidencePreview ? (
                          <img
                            src={evidencePreview}
                            alt="Proof Preview"
                            className="w-12 h-12 object-cover rounded-lg border border-border"
                          />
                        ) : (
                          <FileCheck className="w-8 h-8 text-amber-400" />
                        )}
                        <div className="text-left text-xs">
                          <p className="font-semibold text-foreground truncate max-w-[200px]">
                            {evidenceFile.name}
                          </p>
                          <p className="text-muted-foreground">
                            {(evidenceFile.size / 1024).toFixed(1)} KB • Click to change
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-6 h-6 text-muted-foreground mx-auto" />
                        <p className="text-xs font-medium">Click or drag image photo proof here</p>
                        <p className="text-[11px] text-muted-foreground">Supports JPG, PNG, PDF</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAppealTarget(null)}
                    className="w-full py-2.5 bg-muted text-muted-foreground hover:text-foreground rounded-xl text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAppeal || !appealRemarks}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {submittingAppeal ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Submit Appeal Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Normal Reschedule Modal */}
      <AnimatePresence>
        {rescheduleTarget && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setRescheduleTarget(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" /> Propose Lesson Reschedule
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Request a replacement date and time for {rescheduleTarget.student.student_name}'s lesson
                </p>
              </div>

              {/* Current Session Summary */}
              <div className="bg-muted/40 border border-border rounded-xl p-3.5 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student:</span>
                  <span className="font-semibold">{rescheduleTarget.student.student_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course:</span>
                  <span className="font-semibold">{rescheduleTarget.record.instrument_name}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border/40 text-gold">
                  <span>Current Schedule:</span>
                  <span className="font-bold">
                    {rescheduleTarget.record.date} at {rescheduleTarget.record.start_time}
                  </span>
                </div>
              </div>

              {rescheduleMessage && (
                <div
                  className={`p-3 rounded-xl text-xs border ${
                    rescheduleMessage.type === "success"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {rescheduleMessage.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleProposeReschedule} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Proposed New Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={tomorrowStr}
                    value={reqDate}
                    onChange={(e) => setReqDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Proposed Start Time *
                  </label>
                  <select
                    value={reqTime}
                    onChange={(e) => setReqTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleTarget(null)}
                    className="w-full py-2.5 bg-muted text-muted-foreground hover:text-foreground rounded-xl text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReschedule || !reqDate}
                    className="w-full py-2.5 bg-gold hover:bg-gold/90 text-black font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {submittingReschedule ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Rejection Reason Modal */}
      <AnimatePresence>
        {viewRejection && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setViewRejection(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 text-red-400">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="font-bold text-lg">Appeal Rejection Notice</h3>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl space-y-1.5 text-xs">
                <p className="font-semibold text-sm">Student: {viewRejection.studentName}</p>
                <p className="text-muted-foreground mt-1">Admin Rejection Reason:</p>
                <p className="font-mono bg-black/30 p-2 rounded text-foreground/90">{viewRejection.reason}</p>
              </div>

              <button
                onClick={() => setViewRejection(null)}
                className="w-full py-2 bg-muted text-muted-foreground hover:text-foreground rounded-xl text-xs font-medium transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {photoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setPhotoModal(null)}
          >
            <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={`data:image/jpeg;base64,${photoModal.photos[photoModal.idx]}`}
                alt="Attendance photo"
                className="w-full rounded-xl"
              />
              {photoModal.photos.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {photoModal.photos.map((_, pi) => (
                    <button
                      key={pi}
                      onClick={() => setPhotoModal({ ...photoModal, idx: pi })}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        pi === photoModal.idx ? "bg-gold" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setPhotoModal(null)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
              >
                <span className="text-white text-lg leading-none">×</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
