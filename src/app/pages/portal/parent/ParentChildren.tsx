import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, X, Archive, Baby, Music2, Calendar, Loader2, CreditCard, MapPin } from "lucide-react";

import { odooCall } from "../../../context/AuthContext";

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

const emptyForm = {
  name: "", dob: "", gender: "Female", school: "", phone: "", level_id: "", notes: "",
};

function getAge(dob: string) {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

const batamSchools = [
  "Sekolah Indobaru Utama (IPK)",
  "Sekolah Yos Sudarso",
  "Universal School Batam",
  "Mondial School",
  "Djuwita National Plus",
  "Sekolah Kallista",
  "Sekolah Maitreyawira Batam",
  "Sekolah Basic Batam",
  "Global Indo-Asia (GIA)",
  "Sekolah Permata Harapan",
  "Nanyang International School",
  "Sekolah Charis Batam",
  "Sekolah Anugerah Batam",
];

export default function ParentChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formTouched, setFormTouched] = useState(false);

  const [selectedChildForDeposit, setSelectedChildForDeposit] = useState<Child | null>(null);
  const [childDeposits, setChildDeposits] = useState<any[]>([]);
  const [loadingDeposits, setLoadingDeposits] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  const viewDepositDetails = async (child: Child) => {
    setSelectedChildForDeposit(child);
    setShowDepositModal(true);
    setChildDeposits([]);
    try {
      setLoadingDeposits(true);
      const res = await odooCall("/liszthoven_custom/parent/child/deposits", {
        child_id: child.id
      });
      if (res && res.success) {
        setChildDeposits(res.deposits || []);
      }
    } catch (err) {
      console.error("Failed to load child deposits", err);
    } finally {
      setLoadingDeposits(false);
    }
  };

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await odooCall("/liszthoven_custom/parent/children");
      if (res.success) {
        setChildren(res.children);
        if (res.ranks) {
          setRanks(res.ranks);
        }
      } else {
        setError(res.error || "Failed to load children.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching children.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const openAdd = () => { 
    setEditingChild(null); 
    setFormData(emptyForm); 
    setFormTouched(false);
    setShowModal(true); 
  };
  
  const openEdit = (child: Child) => {
    setEditingChild(child);
    setFormData({ 
      name: child.name, 
      dob: child.dob, 
      gender: child.gender, 
      school: child.school, 
      phone: (child as any).phone || "",
      level_id: (child as any).level_id ? String((child as any).level_id) : "",
      notes: child.notes 
    });
    setFormTouched(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormTouched(true);
    if (!formData.name.trim()) return;
    try {
      setLoading(true);
      const res = await odooCall("/liszthoven_custom/parent/children/save", {
        child_id: editingChild ? editingChild.id : undefined,
        name: formData.name,
        dob: formData.dob || undefined,
        gender: formData.gender,
        school: formData.school || undefined,
        phone: formData.phone || undefined,
        level_id: formData.level_id || undefined,
        notes: formData.notes || undefined,
      });
      if (res.success) {
        await fetchChildren();
        setShowModal(false);
      } else {
        alert(res.error || "Failed to save child details.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const toggleArchive = async (id: number) => {
    try {
      setLoading(true);
      const res = await odooCall("/liszthoven_custom/parent/children/archive", {
        child_id: id,
      });
      if (res.success) {
        await fetchChildren();
      } else {
        alert(res.error || "Failed to toggle archive status.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const active = children.filter((c) => c.status === "active");
  const archived = children.filter((c) => c.status === "archived");

  if (loading && children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your children profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center space-y-3">
        <p className="text-sm">{error}</p>
        <button onClick={fetchChildren} className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors">
          Retry
        </button>
      </div>
    );
  }

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
                    {child.gender} · {getAge(child.dob)} years old{(child as any).level_name ? ` · ${(child as any).level_name}` : ""}
                  </p>
                  {child.school && (
                    <p className="text-xs text-muted-foreground mt-0.5">{child.school}</p>
                  )}
                  {/* Address from parent */}
                  {((child as any).street || (child as any).city) ? (
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gold flex-shrink-0" />
                      {[(child as any).street, (child as any).city, (child as any).zip].filter(Boolean).join(", ")}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground/50 mt-0.5 italic">No address — add it in your profile</p>
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
              {/* Deposit Credit Left Balance Display */}
              <button
                onClick={() => viewDepositDetails(child)}
                className="w-full flex items-center justify-between bg-gold/5 border border-gold/15 p-2 rounded-lg hover:bg-gold/10 transition-colors text-left"
              >
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gold" />
                  Deposit Credit Left
                </span>
                <span className="text-xs font-bold text-gold hover:underline">{(child as any).deposit_credit ?? 0} sessions</span>
              </button>

              {child.dob && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    DOB: {new Date(child.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              )}

              {child.enrolledPrograms && child.enrolledPrograms.length > 0 && (
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
                    { key: "name", label: "Full Name", type: "text", required: true },
                    { key: "dob", label: "Date of Birth", type: "date", required: false },
                    { key: "phone", label: "Phone (Optional)", type: "tel", required: false },
                    { key: "school", label: "School (Optional)", type: "text", required: false },
                  ].map(({ key, label, type, required }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <input
                        type={type}
                        list={key === "school" ? "batam-schools" : undefined}
                        value={(formData as any)[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        placeholder={key === "school" ? "Select or type school name" : undefined}
                        className={`w-full px-3 py-2.5 bg-muted border rounded-lg text-sm focus:outline-none transition-colors ${
                          required && formTouched && !(formData as any)[key].trim()
                            ? "border-red-500 text-red-400 focus:border-red-500"
                            : "border-border focus:border-gold"
                        }`}
                      />
                      {key === "school" && (
                        <datalist id="batam-schools">
                          {batamSchools.map((s) => (
                            <option key={s} value={s} />
                          ))}
                        </datalist>
                      )}
                      {required && formTouched && !(formData as any)[key].trim() && (
                        <p className="text-[11px] text-red-400 mt-1">This field is required.</p>
                      )}
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

                  {ranks.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Academic Level (Optional)</label>
                      <select
                        value={formData.level_id}
                        onChange={(e) => setFormData({ ...formData, level_id: e.target.value })}
                        className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                      >
                        <option value="">-- Select Level --</option>
                        {ranks.map((r: any) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Notes (Optional)</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none" style={{ fontStyle: "normal" }} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors" disabled={loading}>Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all flex items-center gap-2" disabled={loading}>
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {editingChild ? "Save Changes" : "Add Child"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Deposit Details Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDepositModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
                <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gold" />
                    <h3 className="text-base font-semibold">Deposit Details - {selectedChildForDeposit?.name}</h3>
                  </div>
                  <button onClick={() => setShowDepositModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"><X className="w-4 h-4" /></button>
                </div>

                {loadingDeposits ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    <p className="text-xs text-muted-foreground">Fetching deposit records...</p>
                  </div>
                ) : childDeposits.length > 0 ? (
                  <div className="space-y-4">
                    {childDeposits.map((dep) => (
                      <div key={dep.id} className="border border-border rounded-xl p-4 space-y-3 bg-muted/20">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <span className="text-sm font-bold text-gold">{dep.course}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                            dep.state === 'active' ? 'bg-green-500/10 text-green-400' :
                            dep.state === 'partially_used' ? 'bg-yellow-500/10 text-yellow-400' :
                            dep.state === 'exhausted' ? 'bg-red-500/10 text-red-400' :
                            dep.state === 'refunded' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {dep.state_label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Paid Amount</p>
                            <p className="font-semibold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(dep.amount)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Date Paid</p>
                            <p className="font-semibold">{dep.date_paid ? new Date(dep.date_paid).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : 'Unpaid'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Initial Credits</p>
                            <p className="font-semibold">{dep.initial_credits} sessions</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Remaining Credits</p>
                            <p className="font-semibold text-gold">{dep.remaining_credits} sessions</p>
                          </div>
                        </div>

                        {/* Topup History */}
                        {dep.topups && dep.topups.length > 0 && (
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Top-up History</p>
                            <div className="space-y-1">
                              {dep.topups.map((tp: any) => (
                                <div key={tp.id} className="flex items-center justify-between text-[11px] bg-card p-1.5 rounded border border-border">
                                  <span>{new Date(tp.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                  <span className="font-semibold">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(tp.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Usage History */}
                        {dep.usages && dep.usages.length > 0 && (
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Deduction Logs</p>
                            <div className="space-y-1">
                              {dep.usages.map((us: any) => (
                                <div key={us.id} className="text-[11px] bg-card p-1.5 rounded border border-border leading-relaxed">
                                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
                                    <span>Usage Entry</span>
                                    <span>{new Date(us.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                  </div>
                                  <p className="text-foreground/90">{us.notes}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    No security deposit records found for this student.
                  </div>
                )}

                <div className="flex justify-end mt-6 pt-3 border-t border-border">
                  <button onClick={() => setShowDepositModal(false)} className="px-5 py-2 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg text-xs transition-colors">Close</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
