import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarSync, Clock, CheckCircle2, XCircle, Search, RefreshCw,
  Loader2, AlertCircle, X, Send, User, BookOpen, MapPin, ArrowRight
} from "lucide-react";
import { odooCall } from "../../../context/AuthContext";

interface RescheduleItem {
  id: number;
  schedule_id: number;
  student_names?: string;
  enrolled_student_names?: string;
  instrument_name: string;
  teacher_name: string;
  branch_name: string;
  original_date: string;
  original_start_time: string;
  original_end_time: string;
  requested_date: string;
  requested_start_time: string;
  requested_end_time: string;
  requester_name: string;
  teacher_approved: boolean;
  state: "pending" | "approved" | "rejected" | "expired";
  create_date: string;
}

const formatDateSafe = (dateStr?: string) => {
  if (!dateStr) return "—";
  try {
    const cleanStr = dateStr.replace(" ", "T");
    const d = new Date(cleanStr.includes("T") ? cleanStr : cleanStr + "T00:00:00");
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
};

export default function TeacherRescheduleRequests() {
  const [requests, setRequests] = useState<RescheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "expired" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Reject Modal state
  const [rejectTarget, setRejectTarget] = useState<RescheduleItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await odooCall("/liszthoven_custom/reschedule/list", { status: "all" });
      if (res && res.error) {
        setError(res.error);
      } else if (res && (res.success || Array.isArray(res.requests))) {
        const fetched = res.requests || [];
        setRequests(fetched);
        // If there are no pending requests, auto-switch to "all" tab
        const hasPending = fetched.some((r: RescheduleItem) => r.state === "pending");
        if (!hasPending && fetched.length > 0) {
          setActiveTab("all");
        }
      } else {
        setError("Failed to load reschedule requests.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred while loading reschedule requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle Approve Request
  const handleApprove = async (reqId: number) => {
    try {
      setActionLoading(reqId);
      setActionMessage(null);
      const res = await odooCall("/liszthoven_custom/reschedule/vote", {
        request_id: reqId,
        vote: "approve",
      });

      if (res?.success) {
        setActionMessage({
          type: "success",
          text: "Reschedule request approved! Replacement class session created.",
        });
        setTimeout(() => {
          setActionMessage(null);
          fetchRequests();
        }, 1500);
      } else {
        setActionMessage({
          type: "error",
          text: res?.error || "Failed to approve request.",
        });
      }
    } catch (e: any) {
      setActionMessage({
        type: "error",
        text: e.message || "An error occurred.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Submit Rejection with Reason
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTarget || !rejectionReason.trim()) return;

    try {
      setActionLoading(rejectTarget.id);
      setActionMessage(null);
      const res = await odooCall("/liszthoven_custom/reschedule/vote", {
        request_id: rejectTarget.id,
        vote: "reject",
        reason: rejectionReason.trim(),
      });

      if (res?.success) {
        setActionMessage({
          type: "success",
          text: "Reschedule request declined successfully.",
        });
        setTimeout(() => {
          setRejectTarget(null);
          setRejectionReason("");
          setActionMessage(null);
          fetchRequests();
        }, 1500);
      } else {
        setActionMessage({
          type: "error",
          text: res?.error || "Failed to decline request.",
        });
      }
    } catch (e: any) {
      setActionMessage({
        type: "error",
        text: e.message || "An error occurred.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesTab =
      activeTab === "all" ? true : r.state === activeTab;
    const sName = r.student_names || r.enrolled_student_names || r.requester_name || "";
    const matchesSearch =
      sName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.instrument_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.requester_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.state === "pending").length;
  const approvedCount = requests.filter((r) => r.state === "approved").length;
  const rejectedCount = requests.filter((r) => r.state === "rejected").length;
  const expiredCount = requests.filter((r) => r.state === "expired").length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ fontStyle: "italic" }}>
            <CalendarSync className="w-6 h-6 text-gold" /> Reschedule Requests
          </h2>
          <p className="text-sm text-muted-foreground">
            Review and manage student & parent lesson reschedule proposals
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="p-2.5 rounded-xl bg-card border border-border hover:bg-muted transition-colors flex items-center gap-2 text-xs font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-sm border flex items-center gap-3 ${
            actionMessage.type === "success"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("pending")}
          className={`cursor-pointer bg-amber-500/10 rounded-2xl p-4 border transition-all ${
            activeTab === "pending" ? "border-amber-500 shadow-md scale-[1.02]" : "border-amber-500/20 hover:border-amber-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">{pendingCount}</div>
        </div>

        <div
          onClick={() => setActiveTab("approved")}
          className={`cursor-pointer bg-green-500/10 rounded-2xl p-4 border transition-all ${
            activeTab === "approved" ? "border-green-500 shadow-md scale-[1.02]" : "border-green-500/20 hover:border-green-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-400">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400 mt-2">{approvedCount}</div>
        </div>

        <div
          onClick={() => setActiveTab("rejected")}
          className={`cursor-pointer bg-red-500/10 rounded-2xl p-4 border transition-all ${
            activeTab === "rejected" ? "border-red-500 shadow-md scale-[1.02]" : "border-red-500/20 hover:border-red-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-red-400">Declined</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mt-2">{rejectedCount}</div>
        </div>

        <div
          onClick={() => setActiveTab("expired")}
          className={`cursor-pointer bg-muted/40 rounded-2xl p-4 border transition-all ${
            activeTab === "expired" ? "border-foreground/50 shadow-md scale-[1.02]" : "border-border hover:border-muted-foreground/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Expired</span>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-muted-foreground mt-2">{expiredCount}</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-3 rounded-2xl border border-border">
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          {(["pending", "approved", "rejected", "expired", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeTab === tab
                  ? "bg-gold text-black border-gold shadow-sm"
                  : "border-border hover:border-gold/50 text-muted-foreground"
              }`}
            >
              {tab === "pending"
                ? `Pending (${pendingCount})`
                : tab === "approved"
                ? `Approved (${approvedCount})`
                : tab === "rejected"
                ? `Declined (${rejectedCount})`
                : tab === "expired"
                ? `Expired (${expiredCount})`
                : `All Requests (${requests.length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search student or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading reschedule proposals...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
            <button onClick={fetchRequests} className="text-xs bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
              Retry
            </button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground space-y-2">
            <CalendarSync className="w-8 h-8 mx-auto text-muted-foreground/50" />
            <p className="text-sm font-medium">No reschedule requests found.</p>
            <p className="text-xs text-muted-foreground">
              {activeTab === "pending"
                ? "There are currently no pending reschedule proposals requiring review."
                : "No requests match your current filters."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredRequests.map((req) => {
              const displayName = req.student_names || req.enrolled_student_names || req.requester_name || "Student";
              return (
                <div key={req.id} className="p-5 hover:bg-muted/20 transition-colors space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Student & Course Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base">{displayName}</span>
                        {req.instrument_name && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 font-semibold">
                            {req.instrument_name}
                          </span>
                        )}
                        {req.branch_name && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold" /> {req.branch_name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Requested by: <strong className="text-foreground">{req.requester_name}</strong> • Submitted: {formatDateSafe(req.create_date)}
                      </p>
                    </div>

                    {/* Status Badge or Action Buttons */}
                    <div className="flex items-center gap-3">
                      {req.state === "pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setRejectTarget(req);
                              setRejectionReason("");
                            }}
                            disabled={actionLoading === req.id}
                            className="px-3.5 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Decline
                          </button>
                          <button
                            onClick={() => handleApprove(req.id)}
                            disabled={actionLoading === req.id}
                            className="px-4 py-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                          >
                            {actionLoading === req.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </>
                            )}
                          </button>
                        </div>
                      ) : req.state === "approved" ? (
                        <span className="text-xs px-3 py-1.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved & Rescheduled
                        </span>
                      ) : req.state === "expired" ? (
                        <span className="text-xs px-3 py-1.5 rounded-xl bg-muted text-muted-foreground border border-border font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Expired (Cutoff Passed)
                        </span>
                      ) : (
                        <div className="text-right">
                          <span className="text-xs px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-medium flex items-center gap-1.5 justify-end">
                            <XCircle className="w-3.5 h-3.5" />
                            Declined
                          </span>
                          {req.rejection_reason && (
                            <p className="text-[11px] text-muted-foreground mt-1 italic">
                              Reason: "{req.rejection_reason}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule Comparison Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {/* Original Schedule */}
                    <div className="bg-muted/40 border border-border rounded-xl p-3.5 text-xs space-y-1">
                      <p className="text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">
                        Original Session
                      </p>
                      <p className="font-semibold text-sm">
                        {formatDateSafe(req.original_date)}
                      </p>
                      <p className="text-muted-foreground">
                        Time: <strong className="text-foreground">{req.original_start_time || "—"}{req.original_end_time ? `–${req.original_end_time}` : ""}</strong>
                      </p>
                    </div>

                    {/* Proposed New Schedule */}
                    <div className="bg-gold/10 border border-gold/30 rounded-xl p-3.5 text-xs space-y-1">
                      <div className="flex items-center justify-between text-gold font-semibold text-[11px] uppercase tracking-wider">
                        <span>Proposed Replacement Session</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <p className="font-bold text-sm text-gold">
                        {formatDateSafe(req.requested_date)}
                      </p>
                      <p className="text-foreground/90 font-medium">
                        Requested Time: <strong className="text-gold">{req.requested_start_time || "—"}{req.requested_end_time ? `–${req.requested_end_time}` : ""}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* REJECT MODAL DIALOG */}
      <AnimatePresence>
        {rejectTarget && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setRejectTarget(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="font-bold text-lg flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" /> Decline Reschedule Proposal
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a clear reason for declining {rejectTarget.student_names || rejectTarget.requester_name}'s reschedule request
                </p>
              </div>

              {/* Proposal Summary */}
              <div className="bg-muted/40 border border-border rounded-xl p-3 text-xs space-y-1">
                <p className="font-semibold text-foreground">{rejectTarget.student_names || rejectTarget.requester_name} ({rejectTarget.instrument_name})</p>
                <p className="text-muted-foreground">
                  Proposed: {rejectTarget.requested_date} at {rejectTarget.requested_start_time}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Rejection Reason *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter reason for declining (e.g. Schedule conflict with another class, Outside available teaching hours)..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectTarget(null)}
                    className="w-full py-2.5 bg-muted text-muted-foreground hover:text-foreground rounded-xl text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === rejectTarget.id || !rejectionReason.trim()}
                    className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {actionLoading === rejectTarget.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Decline Request
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
