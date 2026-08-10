import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Phone, Mail, ChevronDown, ChevronUp, User, Calendar, Loader2, BookOpen, CreditCard } from "lucide-react";
import { odooCall } from "../../../context/AuthContext";

interface CourseCredit {
  enrollment_id: number;
  course_name: string;
  instrument_name: string;
  buy: number;
  deposit: number;
  remaining: number;
}

interface Student {
  id: number;
  name: string;
  age: number;
  level: string;
  schedule: string;
  parent: string;
  parentPhone: string;
  parentEmail: string;
  enrolled: string;
  credits: number;
  buyCredits: number;
  depositCredits: number;
  courseCredits: CourseCredit[];
  notes: string;
  rawSchedules: any[];
}

const levelBadge: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Advanced: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function formatScheduleSummary(schedules: any[]) {
  if (!schedules || schedules.length === 0) return "No classes scheduled";
  const sorted = [...schedules].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const now = new Date();
  
  const upcoming = sorted.find(s => {
    const schDate = new Date(s.date);
    schDate.setHours(23, 59, 59, 999);
    return schDate >= now;
  }) || sorted[sorted.length - 1];
  
  if (!upcoming) return "No classes scheduled";
  
  const dObj = new Date(upcoming.date);
  const formattedDate = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${upcoming.instrument || 'Lesson'} - ${formattedDate} at ${upcoming.start_time}`;
}

export default function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [levelFilter, setLevelFilter] = useState("All");

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        setError("");
        const res = await odooCall("/liszthoven_custom/teacher/students");
        if (res.success) {
          const mapped = res.students.map((s: any) => ({
            id: s.id,
            name: s.name,
            age: s.age,
            level: s.level,
            schedule: formatScheduleSummary(s.schedules),
            parent: s.parent?.name || "N/A",
            parentPhone: s.parent?.phone || "N/A",
            parentEmail: s.parent?.email || "N/A",
            enrolled: s.enrolled || "N/A",
            credits: s.credits?.total || 0,
            buyCredits: s.credits?.buy || 0,
            depositCredits: s.credits?.deposit || 0,
            courseCredits: s.credits?.courses || [],
            notes: s.notes || "No notes available.",
            rawSchedules: s.schedules || [],
          }));
          setStudents(mapped);
        } else {
          setError(res.error || "Failed to load students.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "All" || s.level === levelFilter;
    return matchSearch && matchLevel;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-sm text-muted-foreground">Loading assigned students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center space-y-3">
        <p className="text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Students</h2>
        <p className="text-sm text-muted-foreground">Students assigned to your classes and their course credit status</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-gold transition-colors" />
        </div>
        <div className="flex gap-2">
          {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
            <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${levelFilter === l ? "bg-gold text-black border-gold" : "bg-card border-border text-muted-foreground hover:border-gold/50"}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p className="text-sm font-semibold">{filtered.length} student{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="divide-y divide-border">
          {filtered.length > 0 ? (
            filtered.map((student) => {
              const isExpanded = expandedId === student.id;
              return (
                <div key={student.id}>
                  <div className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedId(isExpanded ? null : student.id)}>
                    <div className="w-9 h-9 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                      <span className="text-emerald-400 font-bold text-xs">{student.name.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{student.name}</p>
                        <span className={`inline-flex text-xs px-1.5 py-0.5 rounded border ${levelBadge[student.level] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}>{student.level}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{student.schedule}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-gold">{student.credits} course credits</p>
                      <p className="text-xs text-muted-foreground">Age {student.age}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  </div>

                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
                      <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Parent Contact Card */}
                        <div className="bg-muted rounded-xl p-4 space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><User className="w-3.5 h-3.5" />Parent Contact</h4>
                          <div>
                            <p className="text-sm font-medium">{student.parent}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">{student.parentEmail}</p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground">Enrolled: {student.enrolled}</p>
                          </div>
                        </div>

                        {/* Course Credits Breakdown Card */}
                        <div className="bg-muted rounded-xl p-4 space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5" /> Course Credits Left
                          </h4>
                          
                          {student.courseCredits && student.courseCredits.length > 0 ? (
                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                              {student.courseCredits.map((cc, idx) => (
                                <div key={idx} className="bg-card rounded-lg p-2.5 border border-border space-y-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-foreground">{cc.course_name || cc.instrument_name || 'Course'}</p>
                                    <span className="px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 text-[10px] font-bold">
                                      {cc.remaining} credits left
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                    <span>Paid: {cc.buy}</span>
                                    <span>Deposit: {cc.deposit}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              {[{ label: "Available", value: student.credits }, { label: "Paid", value: student.buyCredits }, { label: "Deposit", value: student.depositCredits }].map(({ label, value }) => (
                                <div key={label} className="flex-1 bg-card rounded-lg p-2 text-center border border-border">
                                  <p className="text-sm font-semibold">{value}</p>
                                  <p className="text-[10px] text-muted-foreground">{label}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Teacher Notes / Bio</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{student.notes}</p>
                          </div>
                        </div>

                        {/* Schedule Overview Card */}
                        <div className="bg-muted rounded-xl p-4 space-y-3">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Schedule Overview</h4>
                          {student.rawSchedules && student.rawSchedules.length > 0 ? (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                              {student.rawSchedules.map((sch: any) => {
                                const d = new Date(sch.date);
                                const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                                let statusBadge = (
                                  <span className="px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 text-[9px] font-medium capitalize">
                                    Scheduled
                                  </span>
                                );

                                const isPast = d < new Date();
                                const isBothNoShow = sch.expired_type === 'both' || (sch.teacher_attendance === 'absent' && sch.student_attendance === 'absent') || (isPast && sch.teacher_attendance !== 'present' && sch.student_attendance !== 'present');
                                const isStudentNoShow = sch.expired_type === 'student' || (sch.teacher_attendance === 'present' && sch.student_attendance === 'absent') || (isPast && sch.teacher_attendance === 'present' && sch.student_attendance !== 'present');
                                const isTeacherNoShow = sch.expired_type === 'teacher' || (sch.teacher_attendance === 'absent' && sch.student_attendance === 'present');

                                if (isBothNoShow) {
                                  statusBadge = (
                                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-medium" title="Expired: Both teacher and student were absent/no-show">
                                      Expired (Both No-Show)
                                    </span>
                                  );
                                } else if (isStudentNoShow) {
                                  statusBadge = (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-medium" title="Expired for Student: Teacher was present, student was absent">
                                      Expired (Student No-Show)
                                    </span>
                                  );
                                } else if (isTeacherNoShow) {
                                  statusBadge = (
                                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-medium" title="Teacher No-Show">
                                      Teacher No-Show
                                    </span>
                                  );
                                } else if (sch.student_attendance === 'present' && sch.teacher_attendance === 'present') {
                                  statusBadge = (
                                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-medium">
                                      Completed
                                    </span>
                                  );
                                }

                                return (
                                  <div key={sch.id} className="bg-card rounded-lg p-2.5 border border-border text-xs flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-foreground">{sch.instrument || 'Lesson'}</p>
                                      <p className="text-muted-foreground text-[10px] mt-0.5">{formattedDate} ({sch.start_time} - {sch.end_time})</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      {statusBadge}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">No sessions scheduled.</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No students found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
