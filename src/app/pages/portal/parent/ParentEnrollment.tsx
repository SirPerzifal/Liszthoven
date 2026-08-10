import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ChevronRight, Baby, MapPin, Music2, Users, Send, Loader2, X, AlertTriangle, Calendar, Clock, RefreshCw } from "lucide-react";
import { odooCall } from "../../../context/AuthContext";

const steps = ["Select Child", "Select Branch", "Select Program", "Choose Teacher", "Schedule", "Confirm"];

const timeOptions = Array.from({ length: 25 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const min = i % 2 === 0 ? "00" : "30";
  const hourStr = String(hour).padStart(2, "0");
  const displayHour = hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  return {
    value: `${hourStr}:${min}`,
    label: `${displayHour}:${min} ${ampm}`
  };
});

export default function ParentEnrollment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [children, setChildren] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [teachersByProgram, setTeachersByProgram] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [parentBranchId, setParentBranchId] = useState<number | null>(null);
  const [showBranchConfirmModal, setShowBranchConfirmModal] = useState(false);
  const [pendingBranch, setPendingBranch] = useState<any | null>(null);

  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  
  // Teacher availability states
  const [teacherSlots, setTeacherSlots] = useState<any[]>([]);
  const [teacherBookedSlots, setTeacherBookedSlots] = useState<any[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  // Scheduling states
  const [scheduleMode, setScheduleMode] = useState<"auto" | "custom">("auto");
  const [duration, setDuration] = useState<number>(30);
  const [isWeekend, setIsWeekend] = useState<boolean>(false);
  const [firstSessionDate, setFirstSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [firstSessionTime, setFirstSessionTime] = useState("16:00");
  const [week5Override, setWeek5Override] = useState<boolean>(false);

  const [customSessions, setCustomSessions] = useState([
    { date: "", time: "16:00", week5Override: false },
    { date: "", time: "16:00", week5Override: false },
    { date: "", time: "16:00", week5Override: false },
    { date: "", time: "16:00", week5Override: false },
  ]);

  const [submitted, setSubmitted] = useState(false);

  const loadOptions = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await odooCall("/liszthoven_custom/parent/enrollment/options");
      if (res && res.success) {
        setChildren(res.children);
        setBranches(res.branches);
        setPrograms(res.programs);
        setTeachersByProgram(res.teachersByProgram);
        setParentBranchId(res.parent_branch_id);

        if (res.parent_branch_id && res.branches) {
          const defaultBranch = res.branches.find((b: any) => b.id === res.parent_branch_id);
          if (defaultBranch) {
            setSelectedBranch(defaultBranch);
          }
        }
      } else {
        setError(res?.error || "Failed to load enrollment options.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading enrollment details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherAvailability = async (teacherId: number) => {
    try {
      setFetchingSlots(true);
      const res = await odooCall("/liszthoven_custom/teacher/availability", {
        teacher_id: teacherId
      });
      if (res && res.success) {
        setTeacherSlots(res.slots || []);
        setTeacherBookedSlots(res.booked || []);
      }
    } catch (err) {
      console.error("Failed to load teacher availability slots", err);
    } finally {
      setFetchingSlots(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    // When child changes, re-sync level if a program is already selected
    if (selectedProgram) {
      const childLevel = selectedChild?.level;
      if (childLevel && selectedProgram.levels.includes(childLevel)) {
        setSelectedLevel(childLevel);
      } else if (selectedProgram.levels.length > 0) {
        setSelectedLevel(selectedProgram.levels[0]);
      }
    } else {
      setSelectedLevel("Beginner");
    }
  }, [selectedChild]);

  useEffect(() => {
    if (selectedProgram) {
      const childLevel = selectedChild?.level;
      console.log("selectedProgram", selectedProgram.name, "childLevel:", childLevel);
      if (childLevel && selectedProgram.levels.includes(childLevel)) {
        setSelectedLevel(childLevel);
      } else if (selectedProgram.levels.length > 0) {
        setSelectedLevel(selectedProgram.levels[0]);
      }
    }
  }, [selectedProgram, selectedChild]);

  useEffect(() => {
    if (selectedTeacher) {
      fetchTeacherAvailability(selectedTeacher.id);
    } else {
      setTeacherSlots([]);
      setTeacherBookedSlots([]);
    }
  }, [selectedTeacher]);

  const canProceed = [
    !!selectedChild,
    !!selectedBranch,
    !!selectedProgram,
    !!selectedTeacher,
    scheduleMode === "auto" ? !!firstSessionDate : customSessions.every(s => s.date),
    true,
  ][currentStep];

  const handleBranchSelect = (branch: any) => {
    if (parentBranchId && branch.id !== parentBranchId) {
      setPendingBranch(branch);
      setShowBranchConfirmModal(true);
    } else {
      setSelectedBranch(branch);
    }
  };

  const confirmBranchChange = () => {
    if (pendingBranch) {
      setSelectedBranch(pendingBranch);
    }
    setShowBranchConfirmModal(false);
    setPendingBranch(null);
  };

  const handleSubmit = async () => {
    if (!selectedChild || !selectedProgram || !selectedTeacher) return;
    const courseId = selectedProgram.level_product_ids?.[selectedLevel];
    if (!courseId) {
      alert(`No course template found for ${selectedProgram.name} - ${selectedLevel}`);
      return;
    }

    const payload: any = {
      student_id: selectedChild.id,
      course_id: courseId,
      teacher_id: selectedTeacher.id,
      schedule_mode: scheduleMode,
      duration: duration,
      is_weekend: isWeekend,
    };

    if (scheduleMode === "auto") {
      payload.first_session_date = firstSessionDate;
      payload.first_session_time = firstSessionTime;
      payload.session_1_week_5_override = week5Override;
    } else {
      payload.session_1_date = customSessions[0].date;
      payload.session_1_time = customSessions[0].time;
      payload.session_1_week_5_override = customSessions[0].week5Override;

      payload.session_2_date = customSessions[1].date;
      payload.session_2_time = customSessions[1].time;
      payload.session_2_week_5_override = customSessions[1].week5Override;

      payload.session_3_date = customSessions[2].date;
      payload.session_3_time = customSessions[2].time;
      payload.session_3_week_5_override = customSessions[2].week5Override;

      payload.session_4_date = customSessions[3].date;
      payload.session_4_time = customSessions[3].time;
      payload.session_4_week_5_override = customSessions[3].week5Override;
    }

    try {
      setLoading(true);
      const res = await odooCall("/liszthoven_custom/parent/enroll", payload);
      if (res && res.success) {
        setSubmitted(true);
      } else {
        alert(res?.error || "Failed to submit enrollment request.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred during enrollment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-sm text-muted-foreground">Loading enrollment wizard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center space-y-3 max-w-md mx-auto">
        <p className="text-sm">{error}</p>
        <button onClick={loadOptions} className="px-4 py-2 bg-gold text-black rounded-lg text-xs font-semibold hover:bg-gold-light transition-colors">
          Retry
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl mb-3" style={{ fontStyle: "italic" }}>Enrollment Submitted!</h2>
          <p className="text-muted-foreground text-sm mb-2">
            Your enrollment request for <strong className="text-foreground">{selectedChild?.name}</strong> in{" "}
            <strong className="text-foreground">{selectedProgram?.name}</strong> ({selectedLevel}) has been sent.
          </p>
          <p className="text-muted-foreground text-sm mb-6">Teacher: <strong className="text-foreground">{selectedTeacher?.name}</strong></p>
          <p className="text-xs text-muted-foreground mb-8">Your enrollment and schedule selections have been saved inside Odoo's Student Price logs.</p>
          <button
            onClick={() => { setSubmitted(false); setCurrentStep(0); setSelectedChild(null); setSelectedBranch(null); setSelectedProgram(null); setSelectedTeacher(null); }}
            className="bg-gold text-black px-6 py-3 rounded-xl font-semibold hover:bg-gold-light transition-all"
          >
            Enroll Another Child
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>New Enrollment</h2>
        <p className="text-sm text-muted-foreground">Enroll your child in a music program at Liszthoven Academy</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2 flex-shrink-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              i === currentStep ? "bg-gold text-black" :
              i < currentStep ? "bg-green-500/20 text-green-400" :
              "bg-muted text-muted-foreground"
            }`}>
              {i < currentStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-4 text-center">{i + 1}</span>}
              {step}
            </div>
            {i < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          {/* Step 1: Select Child */}
          {currentStep === 0 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><Baby className="w-4 h-4 text-gold" />Select Child</h3>
              <p className="text-sm text-muted-foreground mb-5">Choose which child to enroll</p>
              {children.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={`p-5 rounded-xl border-2 text-left transition-all ${selectedChild?.id === child.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                          <span className="text-gold font-bold">{child.avatar}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{child.name}</p>
                          <p className="text-xs text-muted-foreground">{child.age} years old</p>
                        </div>
                        {selectedChild?.id === child.id && <CheckCircle2 className="w-4 h-4 text-gold ml-auto" />}
                      </div>
                      {child.currentPrograms && child.currentPrograms.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {child.currentPrograms.map((p: string) => (
                            <span key={p} className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">{p}</span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No children found. Please add a child profile first in the "My Children" menu.
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Branch */}
          {currentStep === 1 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><MapPin className="w-4 h-4 text-gold" />Select Branch</h3>
              <p className="text-sm text-muted-foreground mb-5">Choose your preferred branch location</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchSelect(branch)}
                    className={`rounded-xl border-2 overflow-hidden text-left transition-all ${selectedBranch?.id === branch.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}
                  >
                    <div className="h-28 overflow-hidden bg-muted">
                      <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">{branch.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{branch.address}</p>
                        {parentBranchId === branch.id && (
                          <span className="inline-block bg-gold/20 text-gold text-[10px] px-2 py-0.5 rounded-full mt-2 font-medium">Registered Branch</span>
                        )}
                      </div>
                      {selectedBranch?.id === branch.id && <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Program */}
          {currentStep === 2 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><Music2 className="w-4 h-4 text-gold" />Select Program</h3>
              <p className="text-sm text-muted-foreground mb-5">Choose an instrument or program</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {programs.map((prog) => (
                  <button
                    key={prog.id}
                    onClick={() => { setSelectedProgram(prog); setSelectedTeacher(null); }}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${selectedProgram?.id === prog.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}
                  >
                    <div className="text-3xl mb-2">{prog.icon}</div>
                    <p className="text-sm font-semibold">{prog.name}</p>
                    <p className="text-xs text-muted-foreground">Age {prog.ageRange}</p>
                    {selectedProgram?.id === prog.id && <CheckCircle2 className="w-4 h-4 text-gold mx-auto mt-2" />}
                  </button>
                ))}
              </div>
              {selectedProgram && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Select Level</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedProgram.levels.map((level: string) => (
                      <button key={level} onClick={() => setSelectedLevel(level)} className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${selectedLevel === level ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-gold/40"}`}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Choose Teacher */}
          {currentStep === 3 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><Users className="w-4 h-4 text-gold" />Choose Teacher</h3>
              <p className="text-sm text-muted-foreground mb-5">Select a teacher for {selectedProgram?.name}</p>
              {teachersByProgram[selectedProgram?.name || ""]?.[selectedLevel] && teachersByProgram[selectedProgram?.name || ""]?.[selectedLevel].length > 0 ? (
                <div className="space-y-4">
                  {teachersByProgram[selectedProgram?.name || ""]?.[selectedLevel].map((teacher: any) => (
                    <button
                      key={teacher.id}
                      onClick={() => setSelectedTeacher(teacher)}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all ${selectedTeacher?.id === teacher.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gold font-bold text-sm">{teacher.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm">{teacher.name}</p>
                            {selectedTeacher?.id === teacher.id && <CheckCircle2 className="w-4 h-4 text-gold" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{teacher.spec}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">{teacher.exp} exp</span>
                            <span className="text-xs text-muted-foreground">{teacher.schedule}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No teachers are currently assigned to this course. You can select another course or contact support.
                </div>
              )}
            </div>
          )}

          {/* Step 5: Schedule Selection */}
          {currentStep === 4 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><Calendar className="w-4 h-4 text-gold" />Schedule Selection</h3>
              <p className="text-sm text-muted-foreground mb-6">Select the scheduling mode and session details</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Inputs area */}
                <div className="md:col-span-2 space-y-6">
                  {/* General Student Price variables */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Lesson Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      >
                        <option value={30}>30 Minutes</option>
                        <option value={45}>45 Minutes</option>
                        <option value={60}>60 Minutes</option>
                        <option value={90}>90 Minutes</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-3 p-3 bg-muted/40 border border-border rounded-xl w-full cursor-pointer hover:border-gold/30 transition-all">
                        <input
                          type="checkbox"
                          checked={isWeekend}
                          onChange={(e) => setIsWeekend(e.target.checked)}
                          className="w-4 h-4 accent-gold cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-semibold">Weekend Session</p>
                          <p className="text-[10px] text-muted-foreground">Saturday or Sunday schedule</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Scheduling Mode Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scheduling Mode</label>
                    <div className="flex gap-3">
                      {[
                        { mode: "auto", label: "Auto Weekly Recurrence" },
                        { mode: "custom", label: "Custom Date/Time Per Session" },
                      ].map((item) => (
                        <button
                          key={item.mode}
                          onClick={() => setScheduleMode(item.mode as any)}
                          className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold border-2 transition-all ${
                            scheduleMode === item.mode ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-gold/30"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode-specific forms */}
                  {scheduleMode === "auto" ? (
                    <div className="space-y-4 bg-muted/40 p-4 rounded-xl border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Set the starting session. Lessons will automatically recur weekly on this day and time.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1.5">First Session Date</label>
                          <input
                            type="date"
                            value={firstSessionDate}
                            onChange={(e) => setFirstSessionDate(e.target.value)}
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Session Start Time</label>
                          <select
                            value={firstSessionTime}
                            onChange={(e) => setFirstSessionTime(e.target.value)}
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                          >
                            {timeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 pt-2 border-t border-border/50">
                        <input
                          type="checkbox"
                          id="auto_w5_override"
                          checked={week5Override}
                          onChange={(e) => setWeek5Override(e.target.checked)}
                          className="w-4 h-4 accent-gold cursor-pointer"
                        />
                        <label htmlFor="auto_w5_override" className="text-xs text-muted-foreground cursor-pointer select-none">
                          Request **Week 5 Override** (hold lessons on the 5th occurrence in a month)
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 bg-muted/40 p-4 rounded-xl border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Define explicit dates and start times for 4 custom lesson sessions.</p>
                      
                      <div className="space-y-3.5">
                        {customSessions.map((sess, idx) => (
                          <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <span className="sm:col-span-2 text-xs font-semibold text-muted-foreground">Session {idx + 1}</span>
                            <div className="sm:col-span-4">
                              <input
                                type="date"
                                value={sess.date}
                                onChange={(e) => {
                                  const updated = [...customSessions];
                                  updated[idx].date = e.target.value;
                                  setCustomSessions(updated);
                                }}
                                className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs focus:outline-none focus:border-gold transition-colors"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <select
                                value={sess.time}
                                onChange={(e) => {
                                  const updated = [...customSessions];
                                  updated[idx].time = e.target.value;
                                  setCustomSessions(updated);
                                }}
                                className="w-full px-3 py-1.5 bg-muted border border-border rounded-lg text-xs focus:outline-none focus:border-gold transition-colors"
                              >
                                {timeOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="sm:col-span-3 flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`w5_override_${idx}`}
                                checked={sess.week5Override}
                                onChange={(e) => {
                                  const updated = [...customSessions];
                                  updated[idx].week5Override = e.target.checked;
                                  setCustomSessions(updated);
                                }}
                                className="w-3.5 h-3.5 accent-gold cursor-pointer"
                              />
                              <label htmlFor={`w5_override_${idx}`} className="text-[10px] text-muted-foreground cursor-pointer select-none">
                                W5 Override
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Teacher Availability slots reference */}
                <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col space-y-4">
                  {/* Availabilities Section */}
                  <div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-border">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Teacher Open Slots</span>
                      <Clock className="w-3.5 h-3.5 text-gold" />
                    </div>
                    {fetchingSlots ? (
                      <div className="flex flex-col items-center justify-center py-6 space-y-2">
                        <Loader2 className="w-5 h-5 text-gold animate-spin" />
                        <span className="text-[10px] text-muted-foreground">Loading...</span>
                      </div>
                    ) : teacherSlots.length > 0 ? (
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 mt-2">
                        {teacherSlots.map((slot) => (
                          <div key={slot.id} className="bg-card/50 border border-border p-2 rounded-lg text-left">
                            <p className="text-[10px] font-bold text-foreground">{slot.display.split(": ")[0]}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gold-light" />
                              {slot.display.split(": ")[1]}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-[10px] text-muted-foreground leading-relaxed">
                        No availability records listed.
                      </div>
                    )}
                  </div>

                  {/* Booked Classes Section */}
                  <div className="pt-2 border-t border-border/80">
                    <div className="flex items-center justify-between pb-1.5 border-b border-border">
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Booked Schedules</span>
                      <Calendar className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    {fetchingSlots ? (
                      <div className="flex flex-col items-center justify-center py-6 space-y-2">
                        <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                      </div>
                    ) : teacherBookedSlots.length > 0 ? (
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 mt-2">
                        {teacherBookedSlots.map((slot) => (
                          <div key={slot.id} className="bg-red-500/5 border border-red-500/10 p-2 rounded-lg text-left">
                            <p className="text-[10px] font-medium text-red-400/90">{slot.display}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-[10px] text-muted-foreground">
                        No active booked sessions.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Confirm */}
          {currentStep === 5 && (
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2 text-base"><Send className="w-4 h-4 text-gold" />Confirm Enrollment</h3>
              <p className="text-sm text-muted-foreground mb-5">Review your enrollment details before submitting</p>
              <div className="bg-muted rounded-xl p-5 space-y-3">
                {[
                  { label: "Child", value: selectedChild?.name },
                  { label: "Branch", value: selectedBranch?.name },
                  { label: "Program", value: `${selectedProgram?.name} — ${selectedLevel}` },
                  { label: "Teacher", value: selectedTeacher?.name },
                  { label: "Lesson Duration", value: `${duration} Minutes` },
                  { label: "Weekend Surcharge", value: isWeekend ? "Yes (Weekend session toggled)" : "No (Weekday session toggled)" },
                  {
                    label: "Schedule Mode",
                    value: scheduleMode === "auto" ? "Auto Weekly Recurrence" : "Custom Date/Time Per Session"
                  },
                  ...(scheduleMode === "auto"
                    ? [
                        { label: "Start Date", value: firstSessionDate },
                        { label: "Start Time", value: timeOptions.find(o => o.value === firstSessionTime)?.label || firstSessionTime },
                        { label: "Week 5 Override", value: week5Override ? "Toggled (Hold session)" : "Disabled" }
                      ]
                    : customSessions.map((s, idx) => ({
                        label: `Session ${idx + 1}`,
                        value: `${s.date} at ${timeOptions.find(o => o.value === s.time)?.label || s.time} ${s.week5Override ? "[W5 Override]" : ""}`
                      }))
                  )
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <span className="text-xs text-muted-foreground w-28 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4" style={{ fontStyle: "normal" }}>
                By submitting, you agree to our enrollment terms. The student price record will be established in the Odoo database.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || loading}
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed || loading}
            className="px-5 py-2.5 rounded-xl bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Enrollment
              </>
            )}
          </button>
        )}
      </div>

      {/* Branch Confirmation Modal */}
      <AnimatePresence>
        {showBranchConfirmModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBranchConfirmModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="text-base font-semibold">Change Academy Branch?</h3>
                  </div>
                  <button onClick={() => setShowBranchConfirmModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6" style={{ fontStyle: "normal" }}>
                  You are selecting <span className="text-foreground font-semibold">{pendingBranch?.name}</span>, which is different from your registered default branch (<span className="text-foreground font-semibold">{branches.find(b => b.id === parentBranchId)?.name || 'Default'}</span>).
                  <br /><br />
                  Do you want to confirm this change for this student's enrollment?
                </p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => { setShowBranchConfirmModal(false); setPendingBranch(null); }} className="px-4 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={confirmBranchChange} className="px-4 py-2 rounded-lg bg-gold text-black text-xs font-bold hover:bg-gold-light transition-all">Confirm Branch</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
