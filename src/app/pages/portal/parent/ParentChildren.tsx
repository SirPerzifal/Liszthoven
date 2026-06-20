import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, X, Archive, Baby, Music2, Calendar } from "lucide-react";

interface Child {
  id: number;
  name: string;
  dob: string;
  gender: string;
  school: string;
  notes: string;
  avatar: string;
  status: "active" | "archived";
  enrolledPrograms: string[];
}

const initialChildren: Child[] = [
  {
    id: 1,
    name: "Emily Johnson",
    dob: "2014-03-12",
    gender: "Female",
    school: "Riverside Elementary",
    notes: "Loves classical music, practices 30 min daily.",
    avatar: "EJ",
    status: "active",
    enrolledPrograms: ["Piano — Beginner"],
  },
  {
    id: 2,
    name: "Lucas Johnson",
    dob: "2017-07-25",
    gender: "Male",
    school: "Riverside Elementary",
    notes: "Energetic and creative, loves rhythm-based activities.",
    avatar: "LJ",
    status: "active",
    enrolledPrograms: ["Drums — Beginner"],
  },
];

const emptyForm = {
  name: "", dob: "", gender: "Female", school: "", notes: "",
};

function getAge(dob: string) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export default function ParentChildren() {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [showModal, setShowModal] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const openAdd = () => { setEditingChild(null); setFormData(emptyForm); setShowModal(true); };
  const openEdit = (child: Child) => {
    setEditingChild(child);
    setFormData({ name: child.name, dob: child.dob, gender: child.gender, school: child.school, notes: child.notes });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    const avatar = formData.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    if (editingChild) {
      setChildren((prev) => prev.map((c) => c.id === editingChild.id ? { ...c, ...formData, avatar } : c));
    } else {
      const id = Math.max(...children.map((c) => c.id), 0) + 1;
      setChildren((prev) => [...prev, { ...formData, id, avatar, status: "active", enrolledPrograms: [] }]);
    }
    setShowModal(false);
  };

  const toggleArchive = (id: number) => {
    setChildren((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "archived" : "active" } : c));
  };

  const active = children.filter((c) => c.status === "active");
  const archived = children.filter((c) => c.status === "archived");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Children</h2>
          <p className="text-sm text-muted-foreground">{active.length} active {active.length === 1 ? "child" : "children"}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-gold text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition-all">
          <Plus className="w-4 h-4" />
          Add Child
        </button>
      </div>

      {/* Active Children */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {active.map((child) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6 hover:border-gold/40 transition-all"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center border-2 border-gold/30">
                  <span className="text-gold text-lg font-bold">{child.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base">{child.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {child.gender} · {getAge(child.dob)} years old
                  </p>
                  {child.school && (
                    <p className="text-xs text-muted-foreground mt-0.5">{child.school}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(child)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => toggleArchive(child.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Archive">
                  <Archive className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  DOB: {new Date(child.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>

              {child.enrolledPrograms.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5" />
                    Enrolled Programs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {child.enrolledPrograms.map((prog) => (
                      <span key={prog} className="bg-gold/10 text-gold border border-gold/20 text-xs px-2.5 py-1 rounded-lg font-medium">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {child.notes && (
                <p className="text-xs text-muted-foreground bg-muted rounded-lg p-3 leading-relaxed" style={{ fontStyle: "normal" }}>
                  {child.notes}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Add Child Card */}
        <motion.button
          onClick={openAdd}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border-2 border-dashed border-border hover:border-gold/50 transition-all p-6 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-gold group min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-gold/10 transition-colors flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">Add Another Child</span>
        </motion.button>
      </div>

      {/* Archived */}
      {archived.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Archive className="w-4 h-4" />
            Archived ({archived.length})
          </h3>
          <div className="space-y-2">
            {archived.map((child) => (
              <div key={child.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-muted-foreground text-xs font-bold">{child.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{child.name}</p>
                    <p className="text-xs text-muted-foreground">{getAge(child.dob)} years old · Archived</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleArchive(child.id)}
                  className="text-xs text-gold hover:text-gold-light transition-colors"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl border border-border w-full max-w-md p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gold/10 rounded-lg flex items-center justify-center">
                      <Baby className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="text-lg">{editingChild ? "Edit Child" : "Add Child"}</h3>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"><X className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "name", label: "Full Name", type: "text" },
                    { key: "dob", label: "Date of Birth", type: "date" },
                    { key: "school", label: "School (Optional)", type: "text" },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <input type={type} value={(formData as any)[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Gender</label>
                    <div className="flex gap-3">
                      {["Female", "Male", "Other"].map((g) => (
                        <button key={g} onClick={() => setFormData({ ...formData, gender: g })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${formData.gender === g ? "bg-gold text-black border-gold" : "bg-muted border-border hover:border-gold/50"}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Notes (Optional)</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none" style={{ fontStyle: "normal" }} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all">{editingChild ? "Save Changes" : "Add Child"}</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
