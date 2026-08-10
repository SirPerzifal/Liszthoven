import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, User, MapPin, Clock, GraduationCap, Loader2, Calendar } from "lucide-react";
import { odooCall } from "../../../context/AuthContext";

interface ScheduleSession {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  schedule_type: string;
  teacher_attendance?: string;
  student_attendance?: string;
  expired_type?: 'both' | 'student' | 'teacher' | 'none';
}

interface Course {
  id: number;
  name: string;
  branch: string;
  room: string;
  teacher: string;
  teacher_avatar: string;
  teacher_bio: string;
  schedule: string;
  schedules: ScheduleSession[];
  credits: {
    spp: number;
    deposit: number;
    remaining: number;
  };
}

interface CreditState {
  total: number;
  buy: number;
  deposit: number;
}

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [credits, setCredits] = useState<CreditState>({ total: 0, buy: 0, deposit: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError("");
        const res = await odooCall("/liszthoven_custom/student/courses");
        if (res.success) {
          setCourses(res.courses);
          setCredits(res.credits);
        } else {
          setError(res.error || "Failed to load course information.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching course data.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your enrolled courses...</p>
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
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Courses</h2>
        <p className="text-sm text-muted-foreground">Your enrolled programs and lesson details</p>
      </div>

      {courses.length > 0 ? (
        courses.map((course) => {
          const now = new Date();
          const completedCount = course.schedules.filter(s => new Date(s.date) < now).length;
          const remainingCount = credits.total;
          const totalPaidCount = remainingCount + completedCount;

          return (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-card rounded-xl border border-border overflow-hidden mb-6"
            >
              <div className="px-6 py-5 border-b border-border flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-2xl border border-gold/20">🎹</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.branch} · Studio: {course.room}</p>
                </div>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-3 py-1 rounded-full font-medium">Active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                {/* Course Details (Left Column) */}
                <div className="px-6 py-5 space-y-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Information</h4>
                  {[
                    { icon: User, label: "Teacher", value: course.teacher },
                    { icon: MapPin, label: "Branch & Room", value: `${course.branch} — Room ${course.room}` },
                    { icon: Clock, label: "Schedule Summary", value: course.schedule },
                    { icon: BookOpen, label: "Duration", value: "60 minutes per session" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-medium">{value}</p>
                      </div>
                    </div>
                  ))}

                  {/* Schedule Overview list */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Schedule Overview
                    </h4>
                    {course.schedules && course.schedules.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                        {course.schedules.map((sch) => {
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
                            <div key={sch.id} className="bg-muted rounded-lg p-2.5 border border-border text-xs flex justify-between items-center">
                              <div>
                                <p className="font-medium text-foreground">{formattedDate}</p>
                                <p className="text-muted-foreground text-[10px] mt-0.5">{sch.start_time} - {sch.end_time}</p>
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

                {/* Credits & Teacher (Right Column) */}
                <div className="px-6 py-5 space-y-5">
                  {/* Credits */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Lesson Credits</h4>
                    <div className="flex gap-3 mb-3">
                      {[
                        { label: "SPP Credits", value: course.credits.spp, color: "text-foreground" },
                        { label: "Deposit Credits", value: course.credits.deposit, color: "text-muted-foreground" },
                        { label: "Total Available", value: course.credits.remaining, color: "text-gold" }
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex-1 bg-muted rounded-lg p-2 text-center">
                          <p className={`text-xl font-semibold ${color}`}>{value}</p>
                          <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Progress Bar showing remaining ratio */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gold rounded-full" 
                        style={{ width: `${course.credits.remaining > 0 ? (course.credits.spp / course.credits.remaining) * 100 : 0}%` }} 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{course.credits.remaining} sessions remaining ({course.credits.spp} SPP + {course.credits.deposit} Deposit)</p>
                  </div>

                  {/* Outcomes */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5" />
                      What You're Learning
                    </h4>
                    <ul className="space-y-2">
                      {["Basic scales and arpeggios", "Simple classical pieces", "Introduction to music theory", "Sight-reading fundamentals", "Proper hand position and posture"].map((outcome) => (
                        <li key={outcome} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Teacher Bio */}
                  <div className="pt-3 border-t border-border">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">About Your Teacher</h4>
                    <div className="flex items-center gap-3">
                      {course.teacher_avatar ? (
                        <img 
                          src={course.teacher_avatar} 
                          alt={course.teacher}
                          className="w-10 h-10 rounded-full object-cover border border-border" 
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center border border-gold/20">
                          <span className="text-gold font-bold text-xs">
                            {course.teacher ? course.teacher.split(" ").map(n => n[0]).join("") : "TBA"}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{course.teacher}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {course.teacher_bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })
      ) : (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">
          You are not currently enrolled in any active courses.
        </div>
      )}
    </div>
  );
}
