import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, MapPin, Clock, BookOpen, GraduationCap, Calendar, Search,
  Filter, CheckCircle2, ChevronRight, Loader2, ArrowUpRight, Phone,
  Mail, RefreshCw, X, UserCheck, Layers, Info
} from "lucide-react";
import { useNavigate } from "react-router";
import { odooCall } from "../../../context/AuthContext";

interface StudentDetail {
  id: number;
  name: string;
  avatar?: string;
  age?: number;
  level?: string;
  credits?: number;
  parent_name?: string;
  phone?: string;
  email?: string;
}

interface GroupClassDetail {
  id: number;
  name: string;
  year?: number;
  max_students: number;
  student_count: number;
  students: StudentDetail[];
  is_kinderliszt?: boolean;
}

interface ScheduleSession {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  instrument?: string;
  branch?: string;
  students?: string[];
  teacher_attendance?: string;
  status?: string;
  status_label?: string;
  status_color?: string;
}

interface CourseItem {
  id: number;
  title: string;
  emoji: string;
  instrument: string;
  branch: string;
  room: string;
  schedule: string;
  duration: string;
  is_group: boolean;
  capacity_text: string;
  groups?: GroupClassDetail[];
  private_students?: StudentDetail[];
  total_enrolled: number;
  students_count: number;
  studentList?: StudentDetail[];
  schedules?: ScheduleSession[];
  description: string;
  outcomes: string[];
  active: boolean;
}

interface StatsSummary {
  total_courses: number;
  total_students: number;
  classes_this_week: number;
  total_hours: string;
}

// Fallback courses data if backend is offline
const defaultCourses: CourseItem[] = [
  {
    id: 1,
    title: "Guitar — Beginner Group",
    emoji: "🎸",
    instrument: "Guitar",
    branch: "Downtown Branch",
    room: "Studio B",
    schedule: "Tue & Fri, 2:00 PM",
    duration: "45 minutes",
    is_group: true,
    capacity_text: "Max Capacity: 6 Students (Group)",
    total_enrolled: 3,
    students_count: 3,
    groups: [
      {
        id: 10,
        name: "Guitar Group A — 2026",
        year: 2026,
        max_students: 6,
        student_count: 3,
        students: [
          { id: 101, name: "Sarah Kim", age: 10, level: "Beginner", credits: 12, parent_name: "John Kim", phone: "+1 555-0192", email: "john.kim@example.com" },
          { id: 102, name: "Emily White", age: 12, level: "Beginner", credits: 8, parent_name: "Mark White", phone: "+1 555-0144", email: "m.white@example.com" },
          { id: 103, name: "Olivia Brown", age: 9, level: "Beginner", credits: 16, parent_name: "Karen Brown", phone: "+1 555-0188", email: "karen.b@example.com" }
        ]
      }
    ],
    description: "Introduction to guitar in a collaborative group setting: basic chords, strumming, and ensemble playing.",
    outcomes: [
      "Open chord shapes (G, C, D, A, E)",
      "Basic strumming patterns & timing",
      "Group ensemble performance",
      "Music reading basics"
    ],
    schedules: [
      { id: 1, date: "2026-08-11", start_time: "14:00", end_time: "14:45", instrument: "Guitar", branch: "Downtown Branch", students: ["Sarah Kim", "Emily White", "Olivia Brown"], teacher_attendance: "pending" }
    ],
    active: true,
  },
  {
    id: 2,
    title: "Guitar — Private Masterclass",
    emoji: "🎸",
    instrument: "Guitar",
    branch: "Downtown Branch",
    room: "Studio B",
    schedule: "Mon & Thu, 10:00 AM",
    duration: "60 minutes",
    is_group: false,
    capacity_text: "Capacity: 1 Student (Private 1-on-1)",
    total_enrolled: 1,
    students_count: 1,
    private_students: [
      { id: 104, name: "Alex Thompson", age: 14, level: "Intermediate", credits: 10, parent_name: "David Thompson", phone: "+1 555-0122", email: "d.thompson@example.com" }
    ],
    description: "Tailored 1-on-1 private instruction: advanced technique, solo repertoire, and custom rhythm exercises.",
    outcomes: [
      "Barre chords & fingerpicking mastery",
      "Custom repertoire development",
      "Advanced scale work"
    ],
    schedules: [
      { id: 2, date: "2026-08-10", start_time: "10:00", end_time: "11:00", instrument: "Guitar", branch: "Downtown Branch", students: ["Alex Thompson"], teacher_attendance: "present" }
    ],
    active: true,
  }
];

export default function TeacherCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [stats, setStats] = useState<StatsSummary>({
    total_courses: 0,
    total_students: 0,
    classes_this_week: 0,
    total_hours: "0h",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasNoAssignedCourses, setHasNoAssignedCourses] = useState(false);

  // Filters & Tabs state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("all");
  const [activeTabMap, setActiveTabMap] = useState<Record<number, "overview" | "students" | "schedules" | "outcomes">>({});

  // Student Contact Modal State
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      setHasNoAssignedCourses(false);

      const res = await odooCall("/liszthoven_custom/teacher/courses");
      if (res.success) {
        if (res.courses && res.courses.length > 0) {
          setCourses(res.courses);
          setStats(res.stats || calculateStats(res.courses));
        } else {
          // Backend returned empty list -> Teacher has no assigned courses
          setCourses([]);
          setHasNoAssignedCourses(true);
          setStats({
            total_courses: 0,
            total_students: 0,
            classes_this_week: 0,
            total_hours: "0h / week",
          });
        }
      } else {
        // Error from backend API -> use default fallback
        setCourses(defaultCourses);
        setStats(calculateStats(defaultCourses));
      }
    } catch (err: any) {
      console.warn("Failed to fetch teacher courses, using fallback data:", err);
      setCourses(defaultCourses);
      setStats(calculateStats(defaultCourses));
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (courseData: CourseItem[]): StatsSummary => {
    let studentSet = new Set<string>();
    let totalScheduled = 0;

    courseData.forEach((c) => {
      if (c.groups) {
        c.groups.forEach((g) => {
          g.students?.forEach((st) => studentSet.add(st.name));
        });
      }
      if (c.private_students) {
        c.private_students.forEach((st) => studentSet.add(st.name));
      }
      if (c.schedules) {
        totalScheduled += c.schedules.length;
      }
    });

    return {
      total_courses: courseData.length,
      total_students: studentSet.size,
      classes_this_week: totalScheduled || courseData.length * 2,
      total_hours: `${courseData.length * 3}h / week`,
    };
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filtered course list
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.groups &&
        course.groups.some((g) =>
          g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.students?.some((st) => st.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )) ||
      (course.private_students &&
        course.private_students.some((st) => st.name.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesInstrument =
      selectedInstrument === "all" ||
      course.instrument.toLowerCase() === selectedInstrument.toLowerCase() ||
      course.title.toLowerCase().includes(selectedInstrument.toLowerCase());

    return matchesSearch && matchesInstrument;
  });

  const instruments = ["all", ...Array.from(new Set(courses.map((c) => c.instrument || "General")))];

  const getActiveTab = (courseId: number) => activeTabMap[courseId] || "overview";
  const setActiveTab = (courseId: number, tab: "overview" | "students" | "schedules" | "outcomes") => {
    setActiveTabMap((prev) => ({ ...prev, [courseId]: tab }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ fontStyle: "italic" }}>
            My Courses & Curriculum
          </h2>
          <p className="text-sm text-muted-foreground">
            Courses where you are assigned as instructor (Group classes & 1-on-1 private sessions)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCourses}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-medium hover:bg-accent transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/portal/teacher/attendance")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Assigned Courses</p>
            <h3 className="text-2xl font-bold tracking-tight">{stats.total_courses}</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Enrolled Students</p>
            <h3 className="text-2xl font-bold tracking-tight">{stats.total_students}</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Sessions This Week</p>
            <h3 className="text-2xl font-bold tracking-tight">{stats.classes_this_week}</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border/80 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Teaching Workload</p>
            <h3 className="text-2xl font-bold tracking-tight">{stats.total_hours}</h3>
          </div>
        </motion.div>
      </div>

      {/* Filter and Search Bar */}
      {!hasNoAssignedCourses && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by course, group name, or student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-medium text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Instrument:
            </span>
            {instruments.map((inst) => (
              <button
                key={inst}
                onClick={() => setSelectedInstrument(inst)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  selectedInstrument === inst
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 bg-card rounded-2xl border border-border p-8">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your assigned courses & curriculum...</p>
        </div>
      ) : hasNoAssignedCourses ? (
        /* Empty State — No Assigned Courses for logged-in Teacher */
        <div className="bg-card rounded-2xl border border-border p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400">
            <Info className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">No Courses Assigned Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your teacher account is currently not listed under <code className="bg-muted px-1.5 py-0.5 rounded text-xs text-foreground font-mono">teacher_ids</code> for any active course or group class in the system.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={fetchCourses}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors"
            >
              Check Again
            </button>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        /* Filter Empty State */
        <div className="bg-card rounded-2xl border border-border p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold">No courses match your filter criteria</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Try resetting your search query or selecting a different instrument filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedInstrument("all");
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
          >
            Reset Search
          </button>
        </div>
      ) : (
        /* Course Cards List */
        <div className="space-y-6">
          {filteredCourses.map((course, i) => {
            const activeTab = getActiveTab(course.id);
            const isGroup = course.is_group;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header Banner */}
                <div className="px-6 py-5 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                      {course.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-xl">{course.title}</h3>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                            isGroup
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {isGroup ? "Group Course" : "Private 1-on-1"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {course.branch} {course.room ? `• ${course.room}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
                    {/* Capacity Badge */}
                    <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-1.5 text-xs font-semibold">
                      {isGroup ? (
                        <Layers className="w-4 h-4 text-purple-400" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-blue-400" />
                      )}
                      <span>{course.capacity_text}</span>
                    </div>

                    <button
                      onClick={() => navigate("/portal/teacher/attendance")}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-card border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs font-medium transition-colors"
                    >
                      <span>Attendance</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="px-6 pt-3 border-b border-border bg-card flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {[
                    { id: "overview", label: "Overview", icon: BookOpen },
                    {
                      id: "students",
                      label: isGroup
                        ? `Groups (${course.groups?.length || 0})`
                        : `Students (${course.total_enrolled})`,
                      icon: isGroup ? Layers : Users,
                    },
                    { id: "schedules", label: `Schedules (${course.schedules?.length || 0})`, icon: Calendar },
                    { id: "outcomes", label: "Learning Objectives", icon: GraduationCap },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(course.id, id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === id
                          ? "border-emerald-500 text-emerald-400 bg-emerald-500/5 rounded-t-lg"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-t-lg"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab Content Container */}
                <div className="p-6">
                  {/* TAB 1: OVERVIEW */}
                  {activeTab === "overview" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/30 border border-border/60 rounded-xl p-3.5 flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Location & Studio</p>
                            <p className="text-sm font-semibold mt-0.5">{course.branch}</p>
                            <p className="text-xs text-muted-foreground">{course.room}</p>
                          </div>
                        </div>

                        <div className="bg-muted/30 border border-border/60 rounded-xl p-3.5 flex items-start gap-3">
                          <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Recurring Schedule</p>
                            <p className="text-sm font-semibold mt-0.5">{course.schedule}</p>
                          </div>
                        </div>

                        <div className="bg-muted/30 border border-border/60 rounded-xl p-3.5 flex items-start gap-3">
                          <BookOpen className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Session Duration</p>
                            <p className="text-sm font-semibold mt-0.5">{course.duration}</p>
                          </div>
                        </div>

                        <div className="bg-muted/30 border border-border/60 rounded-xl p-3.5 flex items-start gap-3">
                          <Layers className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Course Capacity</p>
                            <p className="text-sm font-semibold mt-0.5">{course.capacity_text}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/20 border border-border/60 rounded-xl p-4 space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Course Description
                        </h4>
                        <p className="text-sm text-foreground/90 leading-relaxed">{course.description}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: GROUPS / STUDENTS */}
                  {activeTab === "students" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      {isGroup ? (
                        /* Group Class Containers */
                        <div className="space-y-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Group Classes Assigned to You
                          </h4>

                          {course.groups && course.groups.length > 0 ? (
                            <div className="space-y-4">
                              {course.groups.map((group) => (
                                <div
                                  key={group.id}
                                  className="bg-muted/30 border border-purple-500/20 rounded-xl p-5 space-y-4"
                                >
                                  <div className="flex items-center justify-between border-b border-border/40 pb-3 flex-wrap gap-2">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                                        GRP
                                      </div>
                                      <div>
                                        <h5 className="font-bold text-base">{group.name}</h5>
                                        <p className="text-xs text-muted-foreground">
                                          Year {group.year || 2026} • {group.is_kinderliszt ? "KinderLiszt Group" : "Standard Group"}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                      Capacity: {group.student_count} / {group.max_students} Students
                                    </span>
                                  </div>

                                  {/* Enrolled Students inside Group */}
                                  <div>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                                      Enrolled Group Members ({group.students?.length || 0})
                                    </p>

                                    {group.students && group.students.length > 0 ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {group.students.map((st) => (
                                          <div
                                            key={st.id}
                                            className="bg-card border border-border rounded-xl p-3.5 flex flex-col justify-between space-y-3"
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className="w-9 h-9 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-xs flex-shrink-0">
                                                {st.name[0]}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h6 className="font-semibold text-sm truncate">{st.name}</h6>
                                                <p className="text-xs text-muted-foreground truncate">
                                                  {st.level || "Beginner"} • {st.credits || 0} Credits
                                                </p>
                                              </div>
                                            </div>

                                            <div className="pt-2 border-t border-border/40 text-xs">
                                              <p className="text-muted-foreground truncate">
                                                <span className="font-medium text-foreground/80">Parent:</span> {st.parent_name}
                                              </p>
                                            </div>

                                            <button
                                              onClick={() => setSelectedStudent(st)}
                                              className="w-full py-1.5 px-3 bg-muted hover:bg-accent rounded-lg text-xs font-medium text-center transition-colors flex items-center justify-center gap-1.5"
                                            >
                                              <Phone className="w-3 h-3 text-emerald-400" />
                                              Contact Info
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-muted-foreground italic">No students enrolled in this group yet.</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">No group classes configured for this course.</p>
                          )}
                        </div>
                      ) : (
                        /* Private 1-on-1 Students */
                        <div className="space-y-4">
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Private 1-on-1 Enrolled Students
                          </h4>

                          {course.private_students && course.private_students.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {course.private_students.map((st) => (
                                <div
                                  key={st.id}
                                  className="bg-muted/30 border border-border/60 hover:border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between transition-colors space-y-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">
                                      {st.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-semibold text-sm truncate">{st.name}</h5>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {st.level || "Private"} • {st.credits || 0} Credits left
                                      </p>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-border/40 text-xs space-y-1">
                                    <p className="text-muted-foreground truncate">
                                      <span className="font-medium text-foreground/80">Parent:</span> {st.parent_name}
                                    </p>
                                  </div>

                                  <button
                                    onClick={() => setSelectedStudent(st)}
                                    className="w-full py-1.5 px-3 bg-card border border-border hover:bg-accent rounded-lg text-xs font-medium text-center transition-colors flex items-center justify-center gap-1.5"
                                  >
                                    <Phone className="w-3 h-3 text-emerald-400" />
                                    Contact Info
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">No private 1-on-1 students enrolled for this course.</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 3: SCHEDULES */}
                  {activeTab === "schedules" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Course Class Sessions & Attendance Log
                        </h4>
                      </div>

                      {course.schedules && course.schedules.length > 0 ? (
                        <div className="divide-y divide-border/60 border border-border/60 rounded-xl overflow-hidden bg-card">
                          {course.schedules.map((sch) => (
                            <div
                              key={sch.id}
                              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                                  <Calendar className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">
                                    {sch.date} ({sch.start_time} - {sch.end_time})
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Students: {sch.students?.join(", ") || "Enrolled session"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-end sm:self-auto">
                                <span
                                  className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                                    sch.status_color ||
                                    (sch.teacher_attendance === "present"
                                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                                      : "bg-blue-500/10 text-blue-400 border-blue-500/20")
                                  }`}
                                >
                                  {sch.status_label || (sch.teacher_attendance === "present" ? "Completed" : "Upcoming")}
                                </span>
                                <button
                                  onClick={() => navigate("/portal/teacher/attendance")}
                                  className="text-xs text-emerald-400 font-medium hover:underline flex items-center gap-1"
                                >
                                  Manage Session <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center bg-muted/20 rounded-xl border border-border/60 text-xs text-muted-foreground">
                          No schedule sessions logged for this course yet.
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 4: OBJECTIVES */}
                  {activeTab === "outcomes" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-emerald-400" /> Key Curriculum Learning Outcomes
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {course.outcomes.map((o, idx) => (
                          <div
                            key={idx}
                            className="bg-muted/30 border border-border/60 rounded-xl p-3.5 flex items-start gap-3"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs font-medium text-foreground/90 leading-relaxed">{o}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Student Contact Info Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-lg">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    Level: {selectedStudent.level || "Student"} • Age: {selectedStudent.age || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-muted/30 border border-border/60 rounded-xl p-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Parent / Guardian</p>
                  <p className="font-semibold text-sm mt-0.5">{selectedStudent.parent_name || "N/A"}</p>
                </div>
                <div className="pt-2 border-t border-border/40 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Phone Number</p>
                    <a
                      href={`tel:${selectedStudent.phone}`}
                      className="font-medium text-emerald-400 hover:underline"
                    >
                      {selectedStudent.phone || "N/A"}
                    </a>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/40 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Email Address</p>
                    <a
                      href={`mailto:${selectedStudent.email}`}
                      className="font-medium text-blue-400 hover:underline truncate block"
                    >
                      {selectedStudent.email || "N/A"}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-full py-2 bg-muted text-muted-foreground hover:text-foreground rounded-xl text-xs font-medium transition-colors"
                >
                  Close
                </button>
                {selectedStudent.phone && selectedStudent.phone !== "N/A" && (
                  <a
                    href={`tel:${selectedStudent.phone}`}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-medium text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Parent
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
