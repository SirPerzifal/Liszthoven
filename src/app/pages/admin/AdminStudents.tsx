import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Edit2, Trash2, X, Check, Phone, Mail, Music2, MapPin } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  instrument: string;
  level: string;
  branch: string;
  enrolledDate: string;
  status: "active" | "inactive" | "trial";
  avatar: string;
}

const initialStudents: Student[] = [
  { id: 1, name: "Emily Chen", email: "emily.chen@email.com", phone: "+1 555-0101", age: 12, instrument: "Piano", level: "Beginner", branch: "Downtown", enrolledDate: "2024-09-01", status: "active", avatar: "EC" },
  { id: 2, name: "Marcus Johnson", email: "m.johnson@email.com", phone: "+1 555-0102", age: 16, instrument: "Guitar", level: "Intermediate", branch: "Westside", enrolledDate: "2024-08-15", status: "active", avatar: "MJ" },
  { id: 3, name: "Sofia Rodriguez", email: "sofia.r@email.com", phone: "+1 555-0103", age: 14, instrument: "Violin", level: "Advanced", branch: "Downtown", enrolledDate: "2023-01-10", status: "active", avatar: "SR" },
  { id: 4, name: "Liam Thompson", email: "liam.t@email.com", phone: "+1 555-0104", age: 10, instrument: "Drums", level: "Beginner", branch: "Northside", enrolledDate: "2025-01-20", status: "active", avatar: "LT" },
  { id: 5, name: "Ava Williams", email: "ava.w@email.com", phone: "+1 555-0105", age: 18, instrument: "Piano", level: "Intermediate", branch: "Eastside", enrolledDate: "2023-06-05", status: "active", avatar: "AW" },
  { id: 6, name: "Noah Davis", email: "noah.davis@email.com", phone: "+1 555-0106", age: 22, instrument: "Guitar", level: "Advanced", branch: "Downtown", enrolledDate: "2022-03-15", status: "active", avatar: "ND" },
  { id: 7, name: "Isabella Brown", email: "bella.b@email.com", phone: "+1 555-0107", age: 8, instrument: "Violin", level: "Beginner", branch: "Westside", enrolledDate: "2025-02-01", status: "trial", avatar: "IB" },
  { id: 8, name: "Oliver Wilson", email: "oliver.w@email.com", phone: "+1 555-0108", age: 15, instrument: "Vocals", level: "Intermediate", branch: "Northside", enrolledDate: "2024-04-12", status: "active", avatar: "OW" },
  { id: 9, name: "Emma Martinez", email: "emma.m@email.com", phone: "+1 555-0109", age: 20, instrument: "Piano", level: "Advanced", branch: "Downtown", enrolledDate: "2021-09-08", status: "active", avatar: "EM" },
  { id: 10, name: "James Taylor", email: "james.t@email.com", phone: "+1 555-0110", age: 11, instrument: "Guitar", level: "Beginner", branch: "Eastside", enrolledDate: "2025-01-15", status: "trial", avatar: "JT" },
];

const statusColors = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  inactive: "bg-red-500/10 text-red-400 border-red-500/20",
  trial: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const levelColors = {
  Beginner: "bg-blue-500/10 text-blue-400",
  Intermediate: "bg-purple-500/10 text-purple-400",
  Advanced: "bg-gold/10 text-gold",
};

const emptyForm: Omit<Student, "id"> = {
  name: "", email: "", phone: "", age: 0, instrument: "Piano",
  level: "Beginner", branch: "Downtown", enrolledDate: "", status: "active", avatar: "",
};

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterInstrument, setFilterInstrument] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Omit<Student, "id">>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchLevel = filterLevel === "All" || s.level === filterLevel;
    const matchInstrument = filterInstrument === "All" || s.instrument === filterInstrument;
    return matchSearch && matchLevel && matchInstrument;
  });

  const openAdd = () => {
    setEditingStudent(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;
    const avatar = formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    if (editingStudent) {
      setStudents((prev) => prev.map((s) => s.id === editingStudent.id ? { ...formData, id: s.id, avatar } : s));
    } else {
      const id = Math.max(...students.map((s) => s.id)) + 1;
      setStudents((prev) => [...prev, { ...formData, id, avatar }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Student Management</h2>
          <p className="text-sm text-muted-foreground">{students.length} total students enrolled</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gold text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
        >
          {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={filterInstrument}
          onChange={(e) => setFilterInstrument(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
        >
          {["All", "Piano", "Guitar", "Violin", "Drums", "Vocals"].map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Instrument</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Branch</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enrolled</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((student) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gold text-xs font-bold">{student.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-sm">
                      <Music2 className="w-3.5 h-3.5 text-muted-foreground" />
                      {student.instrument}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${levelColors[student.level as keyof typeof levelColors]}`}>
                      {student.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {student.branch}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[student.status]}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(student.enrolledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(student)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {deleteConfirmId === student.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(student.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(student.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No students found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg">{editingStudent ? "Edit Student" : "Add New Student"}</h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", type: "text", col: 2 },
                    { key: "email", label: "Email", type: "email", col: 2 },
                    { key: "phone", label: "Phone", type: "text", col: 1 },
                    { key: "age", label: "Age", type: "number", col: 1 },
                  ].map(({ key, label, type, col }) => (
                    <div key={key} className={col === 2 ? "col-span-2" : ""}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <input
                        type={type}
                        value={(formData as any)[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Instrument</label>
                    <select
                      value={formData.instrument}
                      onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                    >
                      {["Piano", "Guitar", "Violin", "Drums", "Vocals", "Cello"].map((i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                    >
                      {["Beginner", "Intermediate", "Advanced"].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Branch</label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                    >
                      {["Downtown", "Westside", "Northside", "Eastside", "Southside"].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Student["status"] })}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                    >
                      {["active", "inactive", "trial"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Enrollment Date</label>
                    <input
                      type="date"
                      value={formData.enrolledDate}
                      onChange={(e) => setFormData({ ...formData, enrolledDate: e.target.value })}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all">
                    {editingStudent ? "Save Changes" : "Add Student"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
