import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Search,
  ChevronDown,
  CheckCircle,
  XCircle,
  Loader2,
  History,
  ArrowRight,
  User,
} from "lucide-react";
import { odooCall } from "../../../context/AuthContext";

interface Student {
  id: number;
  name: string;
  level: string;
  level_id: number | null;
  age: number;
}

interface Level {
  id: number;
  name: string;
}

type Toast = { type: "success" | "error"; message: string } | null;

export default function TeacherLevelUpgrade() {
  const [students, setStudents] = useState<Student[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Toast>(null);

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDropOpen, setStudentDropOpen] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [levelDropOpen, setLevelDropOpen] = useState(false);

  const [note, setNote] = useState("");

  // Fetch students & levels on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const [studRes, levRes] = await Promise.all([
          odooCall("/liszthoven_custom/teacher/students"),
          odooCall("/liszthoven_custom/teacher/student-levels"),
        ]);

        if (!studRes.success) throw new Error(studRes.error || "Failed to load students.");
        if (!levRes.success) throw new Error(levRes.error || "Failed to load levels.");

        setStudents(
          studRes.students.map((s: any) => ({
            id: s.id,
            name: s.name,
            level: s.level || "No Level",
            level_id: s.level_id ?? null,
            age: s.age || 0,
          }))
        );
        setLevels(levRes.levels);
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const availableLevels = selectedStudent
    ? levels.filter((l) => l.id !== selectedStudent.level_id)
    : levels;

  const handleSubmit = async () => {
    if (!selectedStudent || !selectedLevel) return;
    setSubmitting(true);
    try {
      const res = await odooCall("/liszthoven_custom/teacher/student/upgrade-level", {
        student_id: selectedStudent.id,
        new_level_id: selectedLevel.id,
        note: note.trim() || null,
      });

      if (res.success) {
        showToast("success", res.message || "Level updated successfully!");
        // Update local student state
        setStudents((prev) =>
          prev.map((s) =>
            s.id === selectedStudent.id
              ? { ...s, level: selectedLevel.name, level_id: selectedLevel.id }
              : s
          )
        );
        setSelectedStudent((prev) =>
          prev ? { ...prev, level: selectedLevel.name, level_id: selectedLevel.id } : null
        );
        setSelectedLevel(null);
        setNote("");
      } else {
        showToast("error", res.error || "Failed to update level.");
      }
    } catch (err: any) {
      showToast("error", err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-sm text-muted-foreground">Loading students and levels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center space-y-3">
        <XCircle className="w-8 h-8 mx-auto" />
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>
          Upgrade Student Level
        </h2>
        <p className="text-sm text-muted-foreground">
          Select one of your assigned students and promote them to a new level.
        </p>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Upgrade Form ── */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-semibold">Level Upgrade</h3>
          </div>

          {/* Student Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Student
            </label>
            <div className="relative">
              <button
                id="student-select-btn"
                type="button"
                onClick={() => {
                  setStudentDropOpen((v) => !v);
                  setLevelDropOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-muted border border-border rounded-xl text-sm hover:border-gold/50 transition-colors"
              >
                {selectedStudent ? (
                  <span className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-bold flex-shrink-0">
                      {selectedStudent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                    <span>
                      {selectedStudent.name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        — {selectedStudent.level}
                      </span>
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Select a student...</span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${studentDropOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {studentDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute z-20 w-full mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          autoFocus
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search..."
                          className="w-full pl-8 pr-3 py-2 bg-muted rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gold/50"
                        />
                      </div>
                    </div>
                    <div className="max-h-52 overflow-y-auto divide-y divide-border">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSelectedStudent(s);
                              setSelectedLevel(null);
                              setStudentDropOpen(false);
                              setSearch("");
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors text-left ${
                              selectedStudent?.id === s.id ? "bg-gold/5" : ""
                            }`}
                          >
                            <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px] font-bold flex-shrink-0">
                              {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </span>
                            <span className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{s.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Current: {s.level}
                              </p>
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No students found.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Current → New Level Visual */}
          {selectedStudent && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Current Level</p>
                <p className="text-sm font-semibold">{selectedStudent.level}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gold flex-shrink-0" />
              <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">New Level</p>
                <p className="text-sm font-semibold text-gold">
                  {selectedLevel?.name ?? "—"}
                </p>
              </div>
            </div>
          )}

          {/* Level Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              New Level
            </label>
            <div className="relative">
              <button
                id="level-select-btn"
                type="button"
                disabled={!selectedStudent}
                onClick={() => {
                  setLevelDropOpen((v) => !v);
                  setStudentDropOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-muted border border-border rounded-xl text-sm hover:border-gold/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className={selectedLevel ? "" : "text-muted-foreground"}>
                  {selectedLevel ? selectedLevel.name : "Select new level..."}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${levelDropOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {levelDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute z-20 w-full mt-1 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="max-h-48 overflow-y-auto divide-y divide-border">
                      {availableLevels.length > 0 ? (
                        availableLevels.map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => {
                              setSelectedLevel(l);
                              setLevelDropOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-muted/60 transition-colors flex items-center justify-between ${
                              selectedLevel?.id === l.id ? "text-gold" : ""
                            }`}
                          >
                            {l.name}
                            {selectedLevel?.id === l.id && (
                              <CheckCircle className="w-3.5 h-3.5 text-gold" />
                            )}
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No other levels available.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Note / Reason <span className="normal-case">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Passed ABRSM Grade 3 exam..."
              rows={3}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm resize-none focus:outline-none focus:border-gold/50 transition-colors placeholder:text-muted-foreground"
            />
          </div>

          {/* Submit */}
          <button
            id="confirm-level-upgrade-btn"
            type="button"
            disabled={!selectedStudent || !selectedLevel || submitting}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gold text-black rounded-xl font-semibold text-sm hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Upgrading...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Confirm Upgrade
              </>
            )}
          </button>
        </div>

        {/* ── Student List Summary ── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <History className="w-4 h-4 text-gold" />
            <h3 className="text-sm font-semibold">My Students — Current Levels</h3>
          </div>
          <div className="divide-y divide-border">
            {students.length > 0 ? (
              students.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  onClick={() => {
                    setSelectedStudent(s);
                    setSelectedLevel(null);
                    setNote("");
                  }}
                  className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-muted/30 transition-colors ${
                    selectedStudent?.id === s.id ? "bg-gold/5 border-l-2 border-gold" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">Age {s.age}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium">
                    {s.level}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No students assigned to you.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
