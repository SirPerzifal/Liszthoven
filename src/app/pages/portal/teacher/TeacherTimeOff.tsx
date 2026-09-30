import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarOff, Clock, CheckCircle2, XCircle, Search, RefreshCw,
  Loader2, AlertCircle, X, Send, Plus, Calendar, FileText,
  AlertTriangle, UploadCloud, Info
} from "lucide-react";
import { odooCall } from "../../../context/AuthContext";

interface TeacherLeaveItem {
  id: number;
  name: string;
  leave_type: "full_day" | "partial_day";
  date_start: string;
  date_end: string;
  time_start: number;
  time_end: number;
  duration_days: number;
  duration_hours: number;
  reason: string;
  state: "draft" | "pending" | "approved" | "rejected" | "cancelled";
  affected_schedule_count: number;
  approver_name?: string;
  approval_date?: string;
  rejection_reason?: string;
}

const formatFloatTime = (val: number) => {
  const h = Math.floor(val);
  const m = Math.round((val - h) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const formatDateSafe = (dateStr?: string) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
};

export default function TeacherTimeOff() {
  const [leaves, setLeaves] = useState<TeacherLeaveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form State
  const [leaveType, setLeaveType] = useState<"full_day" | "partial_day">("full_day");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("18:00");
  const [timeEnd, setTimeEnd] = useState("20:00");
  const [reason, setReason] = useState("");
  const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string>("");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await odooCall("/liszthoven_custom/teacher/leaves", {});
      if (res && res.error) {
        setError(res.error);
      } else if (res && res.leaves) {
        setLeaves(res.leaves);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1] || result;
      setAttachmentBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenModal = () => {
    setModalError("");
    setLeaveType("full_day");
    const today = new Date().toISOString().split("T")[0];
    setDateStart(today);
    setDateEnd(today);
    setTimeStart("18:00");
    setTimeEnd("20:00");
    setReason("");
    setAttachmentBase64(null);
    setAttachmentName("");
    setIsModalOpen(true);
  };

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateStart || !dateEnd || !reason.trim()) {
      setModalError("Please fill in all required fields.");
      return;
    }
    if (dateStart > dateEnd) {
      setModalError("Start date cannot be after end date.");
      return;
    }

    try {
      setSubmitLoading(true);
      setModalError("");
      const payload: any = {
        leave_type: leaveType,
        date_start: dateStart,
        date_end: dateEnd,
        reason: reason.trim(),
      };
      if (leaveType === "partial_day") {
        payload.time_start = timeStart;
        payload.time_end = timeEnd;
      }
      if (attachmentBase64) {
        payload.attachment = attachmentBase64;
        payload.attachment_filename = attachmentName;
      }

      const res = await odooCall("/liszthoven_custom/teacher/request_leave", payload);
      if (res && res.success) {
        setIsModalOpen(false);
        setSuccessMessage(`Leave request ${res.name} submitted successfully! Awaiting Owner/Admin approval.`);
        setTimeout(() => setSuccessMessage(""), 6000);
        fetchLeaves();
      } else {
        setModalError(res?.error || "Failed to submit leave request.");
      }
    } catch (err: any) {
      setModalError(err?.message || "Failed to submit leave request.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filtered leaves
  const filteredLeaves = leaves.filter((lv) => {
    if (activeTab !== "all" && lv.state !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lv.name.toLowerCase().includes(q);
      const matchReason = lv.reason.toLowerCase().includes(q);
      if (!matchName && !matchReason) return false;
    }
    return true;
  });

  const getStatusBadge = (state: string) => {
    switch (state) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending Approval
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
            {state}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarOff className="w-7 h-7 text-primary" /> Teacher Time Off & Leaves
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Apply for full day or partial time off. Approved leaves will automatically adjust your schedule and queue sessions for rescheduling.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeaves}
            disabled={loading}
            className="p-2.5 bg-muted/60 hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm transition-all flex items-center gap-2 shadow-sm shadow-primary/25"
          >
            <Plus className="w-4 h-4" /> Request Time Off
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-sm flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {/* Search and Tabs Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card border border-border p-3 rounded-2xl shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab === "all" ? "All Requests" : tab}
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-background/20">
                {tab === "all"
                  ? leaves.length
                  : leaves.filter((l) => l.state === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reason or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Loading your leave requests...</p>
        </div>
      ) : error ? (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 bg-card border border-border rounded-2xl p-6">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <p className="text-sm font-semibold text-foreground">Could not load time off requests</p>
          <p className="text-xs text-muted-foreground">{error}</p>
          <button
            onClick={fetchLeaves}
            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-medium rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 bg-card border border-border rounded-2xl p-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <CalendarOff className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Time Off Requests Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            {searchQuery || activeTab !== "all"
              ? "No leave requests match your search or filter criteria."
              : "You haven't submitted any time off requests yet. Need a break or sick leave? Submit a request."}
          </p>
          <button
            onClick={handleOpenModal}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Request Time Off
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLeaves.map((lv) => (
            <motion.div
              key={lv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 hover:border-primary/30 transition-colors"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{lv.name}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase">
                      {lv.leave_type === "partial_day" ? "Partial Day" : "Full Day"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDateSafe(lv.date_start)}
                      {lv.date_start !== lv.date_end && ` — ${formatDateSafe(lv.date_end)}`}
                    </span>
                  </p>
                </div>
                {getStatusBadge(lv.state)}
              </div>

              {/* Hours / Duration details */}
              <div className="bg-muted/40 border border-border/60 rounded-xl p-3 text-xs space-y-1.5">
                {lv.leave_type === "partial_day" ? (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Hours:
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatFloatTime(lv.time_start)} to {formatFloatTime(lv.time_end)} ({lv.duration_hours} hrs)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Duration:</span>
                    <span className="font-semibold text-foreground">{lv.duration_days} day(s)</span>
                  </div>
                )}

                {/* Reason */}
                <div className="pt-1 border-t border-border/40">
                  <span className="text-muted-foreground font-medium">Reason: </span>
                  <span className="text-foreground">{lv.reason}</span>
                </div>
              </div>

              {/* Impact / Reschedule Indicator */}
              {lv.affected_schedule_count > 0 && (
                <div className="flex items-center gap-2 text-xs px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-xl">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <strong>{lv.affected_schedule_count} session(s)</strong> fall during this time off and {lv.state === 'approved' ? 'are queued for rescheduling' : 'will be rescheduled upon approval'}.
                  </span>
                </div>
              )}

              {/* Rejection / Approver note */}
              {lv.state === "rejected" && lv.rejection_reason && (
                <div className="text-xs p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl space-y-1">
                  <p className="font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Rejection Note:
                  </p>
                  <p>{lv.rejection_reason}</p>
                </div>
              )}

              {lv.state === "approved" && lv.approver_name && (
                <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
                  <span>Approved by: {lv.approver_name}</span>
                  {lv.approval_date && (
                    <span>{new Date(lv.approval_date).toLocaleDateString()}</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal: Request Time Off Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative my-8"
            >
              <button
                onClick={() => !submitLoading && setIsModalOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <CalendarOff className="w-5 h-5 text-primary" /> Apply for Time Off / Leave
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Submit a request for full day absence or specific hours. Requests must be approved by Owner/Admin.
                </p>
              </div>

              {modalError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitLeave} className="space-y-4 text-xs">
                {/* Leave Type Toggle */}
                <div>
                  <label className="block font-semibold text-foreground mb-1.5">
                    Leave Duration Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLeaveType("full_day")}
                      className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                        leaveType === "full_day"
                          ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Full Day(s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeaveType("partial_day")}
                      className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                        leaveType === "partial_day"
                          ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Partial / Specific Hours
                    </button>
                  </div>
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={dateStart}
                      onChange={(e) => {
                        setDateStart(e.target.value);
                        if (leaveType === "partial_day") {
                          setDateEnd(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={dateEnd}
                      min={dateStart}
                      disabled={leaveType === "partial_day"}
                      onChange={(e) => setDateEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Hourly Fields (if partial) */}
                {leaveType === "partial_day" && (
                  <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Specific Hours</span>
                      <span className="text-[11px] text-muted-foreground">e.g. Leave for last 2 hours</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">Start Time</label>
                        <input
                          type="time"
                          required
                          value={timeStart}
                          onChange={(e) => setTimeStart(e.target.value)}
                          className="w-full px-3 py-2 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-muted-foreground mb-1">End Time</label>
                        <input
                          type="time"
                          required
                          value={timeEnd}
                          onChange={(e) => setTimeEnd(e.target.value)}
                          className="w-full px-3 py-2 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Reason / Notes *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your reason for taking time off (e.g. Doctor's appointment, urgent personal errand, sick leave)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  />
                </div>

                {/* Supporting Attachment */}
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Supporting Document (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-xl cursor-pointer hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <UploadCloud className="w-4 h-4" />
                      <span>{attachmentName ? "Change File" : "Upload File"}</span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {attachmentName && (
                      <span className="text-muted-foreground truncate max-w-[200px]" title={attachmentName}>
                        {attachmentName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Notice Info */}
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-[11px] text-muted-foreground flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    When approved, your teaching availability will be removed for these hours. Any overlapping student sessions will automatically be marked for rescheduling.
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={submitLoading}
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2.5 bg-muted text-muted-foreground hover:text-foreground rounded-xl text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading || !reason.trim()}
                    className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/25 disabled:opacity-50"
                  >
                    {submitLoading ? (
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
    </div>
  );
}
