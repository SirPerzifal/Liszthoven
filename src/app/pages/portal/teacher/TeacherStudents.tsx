import { useState } from "react";
import { motion } from "motion/react";
import { Search, Phone, Mail, ChevronDown, ChevronUp, User } from "lucide-react";

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
  creditsUsed: number;
  notes: string;
}

const students: Student[] = [
  { id: 1, name: "Alex Thompson", age: 16, level: "Intermediate", schedule: "Mon & Thu, 10:00 AM", parent: "Robert Thompson", parentPhone: "+1 (555) 201-1234", parentEmail: "r.thompson@email.com", enrolled: "Jan 2026", credits: 12, creditsUsed: 7, notes: "Making excellent progress on barre chords. Very motivated student." },
  { id: 2, name: "Maria Santos", age: 12, level: "Beginner", schedule: "Mon & Thu, 11:30 AM", parent: "Carlos Santos", parentPhone: "+1 (555) 201-5678", parentEmail: "c.santos@email.com", enrolled: "Mar 2026", credits: 8, creditsUsed: 3, notes: "Still working on basic chord transitions. Practice consistency is improving." },
  { id: 3, name: "David Chen", age: 19, level: "Advanced", schedule: "Mon & Thu, 2:00 PM", parent: "Linda Chen", parentPhone: "+1 (555) 201-9012", parentEmail: "l.chen@email.com", enrolled: "Sep 2025", credits: 16, creditsUsed: 14, notes: "Working on fingerstyle techniques. Ready for performance level pieces." },
  { id: 4, name: "Sarah Kim", age: 14, level: "Beginner", schedule: "Tue & Fri, 2:00 PM", parent: "James Kim", parentPhone: "+1 (555) 201-3456", parentEmail: "j.kim@email.com", enrolled: "Apr 2026", credits: 8, creditsUsed: 2, notes: "Just started. Showing good natural rhythm." },
  { id: 5, name: "James Park", age: 17, level: "Advanced", schedule: "Wed, 11:00 AM", parent: "Susan Park", parentPhone: "+1 (555) 201-7890", parentEmail: "s.park@email.com", enrolled: "Jun 2025", credits: 20, creditsUsed: 18, notes: "Near completion of advanced program. Excellent technique." },
  { id: 6, name: "Emily White", age: 11, level: "Beginner", schedule: "Thu, 3:00 PM", parent: "Michael White", parentPhone: "+1 (555) 201-2345", parentEmail: "m.white@email.com", enrolled: "May 2026", credits: 8, creditsUsed: 1, notes: "First month. Very enthusiastic and eager to learn." },
  { id: 7, name: "Noah Garcia", age: 15, level: "Intermediate", schedule: "Fri, 10:00 AM", parent: "Ana Garcia", parentPhone: "+1 (555) 201-6789", parentEmail: "a.garcia@email.com", enrolled: "Feb 2026", credits: 12, creditsUsed: 9, notes: "Good progress on scales. Working on speed and accuracy." },
  { id: 8, name: "Olivia Brown", age: 13, level: "Beginner", schedule: "Sat, 9:00 AM", parent: "Tom Brown", parentPhone: "+1 (555) 201-0123", parentEmail: "t.brown@email.com", enrolled: "Apr 2026", credits: 8, creditsUsed: 4, notes: "Improving steadily. Enjoys learning popular songs." },
];

const levelBadge: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Advanced: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function TeacherStudents() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [levelFilter, setLevelFilter] = useState("All");

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === "All" || s.level === levelFilter;
    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Students</h2>
        <p className="text-sm text-muted-foreground">Students assigned to your classes</p>
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
          {filtered.map((student) => {
            const isExpanded = expandedId === student.id;
            const remaining = student.credits - student.creditsUsed;
            return (
              <div key={student.id}>
                <div className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setExpandedId(isExpanded ? null : student.id)}>
                  <div className="w-9 h-9 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                    <span className="text-emerald-400 font-bold text-xs">{student.name.split(" ").map((n) => n[0]).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{student.name}</p>
                      <span className={`inline-flex text-xs px-1.5 py-0.5 rounded border ${levelBadge[student.level]}`}>{student.level}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{student.schedule}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium">{remaining} credits left</p>
                    <p className="text-xs text-muted-foreground">Age {student.age}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </div>

                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
                    <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
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

                      <div className="bg-muted rounded-xl p-4 space-y-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</h4>
                        <div className="flex gap-2">
                          {[{ label: "Total", value: student.credits }, { label: "Used", value: student.creditsUsed }, { label: "Left", value: remaining }].map(({ label, value }) => (
                            <div key={label} className="flex-1 bg-card rounded-lg p-2 text-center border border-border">
                              <p className="text-lg font-semibold">{value}</p>
                              <p className="text-xs text-muted-foreground">{label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="h-1.5 bg-card rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(student.creditsUsed / student.credits) * 100}%` }} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Teacher Notes</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{student.notes}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
