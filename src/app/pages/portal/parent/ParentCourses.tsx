import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GraduationCap, Clock, MapPin, User, CreditCard, Calendar, Home, Loader2 } from "lucide-react";
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
  child: string;
  childAvatar: string;
  program: string;
  level: string;
  teacher: string;
  teacherAvatar: string;
  branch: string;
  room: string;
  schedule: string;
  schedules?: ScheduleSession[];
  duration: string;
  startDate: string;
  credits: {
    spp: number;
    deposit: number;
    remaining: number;
  };
  status: string;
  nextLesson: string;
  description: string;
  learningOutcomes: string[];
}

export default function ParentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await odooCall("/liszthoven_custom/parent/courses");
      if (res.success) {
        setCourses(res.courses);
      } else {
        setError(res.error || "Failed to load courses.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
        <p className="text-sm text-muted-foreground">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
        <p className="text-red-400 font-medium mb-2">{error}</p>
        <button 
          onClick={fetchCourses} 
          className="text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-3">
        <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto" />
        <div>
          <h3 className="font-semibold text-lg">No Enrolled Courses</h3>
          <p className="text-sm text-muted-foreground">Your children are not currently enrolled in any active courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Courses</h2>
        <p className="text-sm text-muted-foreground">{courses.length} active enrollments</p>
      </div>

      <div className="space-y-6">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold text-sm">{course.childAvatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base">{course.child}</h3>
                  <p className="text-sm text-muted-foreground">{course.program} · {course.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
                  Active
                </span>
                <span className="bg-gold/10 text-gold border border-gold/20 text-xs px-2.5 py-1 rounded-full font-medium">
                  Next: {course.nextLesson}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Course Info */}
              <div className="px-6 py-5 space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Details</h4>

                {[
                  { icon: User, label: "Teacher", value: course.teacher },
                  { icon: MapPin, label: "Branch", value: course.branch },
                  { icon: Home, label: "Room", value: course.room },
                  { icon: Calendar, label: "Schedule", value: course.schedule },
                  { icon: Clock, label: "Duration", value: course.duration },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}

                <p className="text-xs text-muted-foreground pt-2 leading-relaxed" style={{ fontStyle: "normal" }}>
                  {course.description}
                </p>

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

              {/* Credits + Outcomes */}
              <div className="px-6 py-5 space-y-5">
                {/* Credits */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" />
                    Credits
                  </h4>
                  <div className="flex gap-3 mb-3">
                    {[
                      { label: "SPP Credits", value: course.credits.spp, color: "text-foreground" },
                      { label: "Deposit Credits", value: course.credits.deposit, color: "text-muted-foreground" },
                      { label: "Total Available", value: course.credits.remaining, color: "text-gold" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex-1 bg-muted rounded-lg p-2 text-center">
                        <p className={`text-xl font-semibold ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all"
                      style={{ width: `${course.credits.remaining > 0 ? (course.credits.spp / course.credits.remaining) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {course.credits.remaining} sessions remaining ({course.credits.spp} SPP + {course.credits.deposit} Deposit) · Enrolled {course.startDate ? new Date(course.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "N/A"}
                  </p>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Learning Outcomes
                  </h4>
                  <ul className="space-y-2">
                    {course.learningOutcomes.map((outcome) => (
                      <li key={outcome} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
