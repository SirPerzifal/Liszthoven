import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, MessageSquare, MapPin, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { odooCall } from "../../../context/AuthContext";

const statusCfg: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  present: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Present" },
  absent:  { icon: XCircle,      color: "text-red-400",   bg: "bg-red-500/10 border-red-500/20",   label: "Absent"  },
  pending: { icon: Clock,         color: "text-yellow-400",bg: "bg-yellow-500/10 border-yellow-500/20", label: "Pending"},
};

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
  students: Array<{
    student_id: number;
    attendance: string;
    student_attendance: string;
    parent_verification: string;
    latitude: number;
    longitude: number;
    photos: string[];
    remarks: string;
  }>;
}

export default function StudentAttendance() {
  const [records, setRecords] = useState<AttRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [photoModal, setPhotoModal] = useState<{ photos: string[]; idx: number } | null>(null);

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

  useEffect(() => { loadRecords(); }, []);

  const myLine = (r: AttRecord) => r.students[0];

  const presentCount = records.filter((r) => myLine(r)?.attendance === "present").length;
  const absentCount  = records.filter((r) => myLine(r)?.attendance === "absent").length;
  const rate = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Attendance</h2>
          <p className="text-sm text-muted-foreground">Your lesson attendance history</p>
        </div>
        <button onClick={loadRecords} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20 text-center">
          <div className="text-2xl font-semibold text-green-400">{presentCount}</div>
          <div className="text-xs text-muted-foreground">Present</div>
        </div>
        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 text-center">
          <div className="text-2xl font-semibold text-red-400">{absentCount}</div>
          <div className="text-xs text-muted-foreground">Absent</div>
        </div>
        <div className="bg-gold/10 rounded-xl p-4 border border-gold/20 text-center">
          <div className="text-2xl font-semibold text-gold">{rate}%</div>
          <div className="text-xs text-muted-foreground">Attendance Rate</div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-sm">Attendance History ({records.length} lessons)</h3>
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
          <div className="text-center py-12 text-sm text-muted-foreground">No attendance records yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {records.map((record) => {
              const line = myLine(record);
              const scfg = statusCfg[line?.attendance] || statusCfg.pending;
              const tcfg = statusCfg[record.teacher_attendance] || statusCfg.pending;
              const isExpanded = expandedId === record.id;
              return (
                <div key={record.id}>
                  <div
                    className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  >
                    <scfg.icon className={`w-5 h-5 flex-shrink-0 ${scfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{record.instrument_name}</p>
                      <p className="text-xs text-muted-foreground">{record.teacher_name} · {record.start_time}–{record.end_time}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium">
                        {record.date ? new Date(record.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                      </p>
                      <div className="flex items-center gap-1.5 justify-end mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${scfg.bg} ${scfg.color}`}>{scfg.label}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${tcfg.bg} ${tcfg.color}`}>
                          T: {tcfg.label}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-5 pb-5 space-y-3">
                          {/* Teacher remarks */}
                          {record.teacher_remarks && (
                            <div className="bg-muted rounded-xl p-4 flex gap-3">
                              <MessageSquare className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gold mb-1">Teacher's Remarks</p>
                                <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontStyle: "normal" }}>{record.teacher_remarks}</p>
                              </div>
                            </div>
                          )}
                          {/* Student remarks */}
                          {line?.remarks && (
                            <div className="bg-muted/40 rounded-xl p-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Class Notes</p>
                              <p className="text-sm text-muted-foreground" style={{ fontStyle: "normal" }}>{line.remarks}</p>
                            </div>
                          )}
                          {/* GPS */}
                          {line && (line.latitude !== 0 || line.longitude !== 0) && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 text-gold" />
                              Location: {line.latitude.toFixed(5)}, {line.longitude.toFixed(5)}
                            </div>
                          )}
                          {/* Photos */}
                          {line?.photos?.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Attendance Photos</p>
                              <div className="flex gap-2 flex-wrap">
                                {line.photos.map((photo, pi) => (
                                  <button
                                    key={pi}
                                    onClick={() => setPhotoModal({ photos: line.photos, idx: pi })}
                                    className="w-20 h-20 rounded-lg overflow-hidden border border-border hover:border-gold/50 transition-colors"
                                  >
                                    <img src={`data:image/jpeg;base64,${photo}`} alt={`Photo ${pi + 1}`} className="w-full h-full object-cover" />
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

      {/* Photo lightbox */}
      <AnimatePresence>
        {photoModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                    <button key={pi} onClick={() => setPhotoModal({ ...photoModal, idx: pi })}
                      className={`w-2 h-2 rounded-full transition-colors ${pi === photoModal.idx ? "bg-gold" : "bg-white/30"}`}
                    />
                  ))}
                </div>
              )}
              <button onClick={() => setPhotoModal(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20">
                <span className="text-white text-lg leading-none">×</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
