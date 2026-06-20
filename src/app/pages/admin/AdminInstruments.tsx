import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Edit2, Trash2, X, Check, Music2, Package, AlertTriangle } from "lucide-react";

interface Instrument {
  id: number;
  name: string;
  brand: string;
  category: string;
  serialNumber: string;
  quantity: number;
  available: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  location: string;
  purchaseDate: string;
  notes: string;
}

const initialInstruments: Instrument[] = [
  { id: 1, name: "Yamaha P-125 Digital Piano", brand: "Yamaha", category: "Keyboards", serialNumber: "SN-YP125-001", quantity: 5, available: 3, condition: "Good", location: "Studio A", purchaseDate: "2023-01-15", notes: "2 currently on loan to students" },
  { id: 2, name: "Fender Stratocaster", brand: "Fender", category: "Guitars", serialNumber: "SN-FSTR-002", quantity: 3, available: 2, condition: "Excellent", location: "Studio B", purchaseDate: "2022-06-20", notes: "" },
  { id: 3, name: "Student Violin 4/4", brand: "Cecilio", category: "Strings", serialNumber: "SN-VN44-003", quantity: 8, available: 6, condition: "Good", location: "Storage Room 1", purchaseDate: "2021-09-01", notes: "2 in repair" },
  { id: 4, name: "Pearl Export Drum Kit", brand: "Pearl", category: "Percussion", serialNumber: "SN-PEDK-004", quantity: 2, available: 1, condition: "Excellent", location: "Drum Room", purchaseDate: "2023-03-10", notes: "1 in use in Drum Room" },
  { id: 5, name: "Alhambra Classical Guitar", brand: "Alhambra", category: "Guitars", serialNumber: "SN-ACG-005", quantity: 4, available: 4, condition: "Good", location: "Studio B", purchaseDate: "2022-11-05", notes: "" },
  { id: 6, name: "Roland FP-90 Digital Piano", brand: "Roland", category: "Keyboards", serialNumber: "SN-RFP90-006", quantity: 2, available: 2, condition: "Excellent", location: "Studio A", purchaseDate: "2024-01-20", notes: "" },
  { id: 7, name: "Eastman Cello 4/4", brand: "Eastman", category: "Strings", serialNumber: "SN-EC44-007", quantity: 3, available: 2, condition: "Fair", location: "Studio C", purchaseDate: "2020-05-15", notes: "1 needs re-stringing" },
  { id: 8, name: "Yamaha 4-String Bass", brand: "Yamaha", category: "Guitars", serialNumber: "SN-YBG4-008", quantity: 2, available: 2, condition: "Good", location: "Studio B", purchaseDate: "2023-08-01", notes: "" },
];

const conditionColors = {
  Excellent: "bg-green-500/10 text-green-400 border-green-500/20",
  Good: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Fair: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Poor: "bg-red-500/10 text-red-400 border-red-500/20",
};

const emptyForm: Omit<Instrument, "id"> = {
  name: "", brand: "", category: "Keyboards", serialNumber: "",
  quantity: 1, available: 1, condition: "Good", location: "",
  purchaseDate: "", notes: "",
};

export default function AdminInstruments() {
  const [instruments, setInstruments] = useState<Instrument[]>(initialInstruments);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<Instrument | null>(null);
  const [formData, setFormData] = useState<Omit<Instrument, "id">>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const filtered = instruments.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.brand.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || i.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalInventory = instruments.reduce((sum, i) => sum + i.quantity, 0);
  const totalAvailable = instruments.reduce((sum, i) => sum + i.available, 0);
  const needsAttention = instruments.filter((i) => i.condition === "Fair" || i.condition === "Poor").length;

  const openAdd = () => {
    setEditingInstrument(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (instrument: Instrument) => {
    setEditingInstrument(instrument);
    setFormData({ ...instrument });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.brand) return;
    if (editingInstrument) {
      setInstruments((prev) => prev.map((i) => i.id === editingInstrument.id ? { ...formData, id: i.id } : i));
    } else {
      const id = Math.max(...instruments.map((i) => i.id)) + 1;
      setInstruments((prev) => [...prev, { ...formData, id }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setInstruments((prev) => prev.filter((i) => i.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Instrument Inventory</h2>
          <p className="text-sm text-muted-foreground">Manage school instruments and equipment</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gold text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Instrument
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Instruments", value: instruments.length, sub: "unique models", color: "text-foreground" },
          { label: "Total Units", value: totalInventory, sub: "in inventory", color: "text-blue-400" },
          { label: "Available", value: totalAvailable, sub: "ready to use", color: "text-green-400" },
          { label: "Needs Attention", value: needsAttention, sub: "fair/poor condition", color: needsAttention > 0 ? "text-yellow-400" : "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 border border-border">
            <div className={`text-2xl font-semibold mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs font-medium">{s.label}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instruments..."
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
        >
          {["All", "Keyboards", "Guitars", "Strings", "Percussion", "Wind"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((instrument) => (
          <motion.div
            key={instrument.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-5 hover:border-gold/50 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                <Music2 className="w-5 h-5 text-gold" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(instrument)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {deleteConfirmId === instrument.id ? (
                  <>
                    <button onClick={() => handleDelete(instrument.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirmId(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setDeleteConfirmId(instrument.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <h3 className="font-semibold text-sm mb-1 leading-tight">{instrument.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{instrument.brand} · {instrument.category}</p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-muted rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-sm">{instrument.quantity} units</p>
              </div>
              <div className="bg-muted rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Available</p>
                <p className={`font-semibold text-sm ${instrument.available === 0 ? "text-red-400" : "text-green-400"}`}>
                  {instrument.available} units
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${conditionColors[instrument.condition]}`}>
                {instrument.condition}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Package className="w-3 h-3" />
                {instrument.location}
              </div>
            </div>

            {instrument.notes && (
              <div className="mt-3 flex items-start gap-1.5 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-2">
                <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span>{instrument.notes}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg">{editingInstrument ? "Edit Instrument" : "Add Instrument"}</h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Instrument Name", col: 2 },
                    { key: "brand", label: "Brand", col: 1 },
                    { key: "serialNumber", label: "Serial Number", col: 1 },
                  ].map(({ key, label, col }) => (
                    <div key={key} className={col === 2 ? "col-span-2" : ""}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <input type="text" value={(formData as any)[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  ))}

                  {[
                    { key: "category", label: "Category", options: ["Keyboards", "Guitars", "Strings", "Percussion", "Wind"] },
                    { key: "condition", label: "Condition", options: ["Excellent", "Good", "Fair", "Poor"] },
                  ].map(({ key, label, options }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <select value={(formData as any)[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors">
                        {options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}

                  {[
                    { key: "quantity", label: "Total Quantity" },
                    { key: "available", label: "Available" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <input type="number" value={(formData as any)[key]} onChange={(e) => setFormData({ ...formData, [key]: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Location</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Purchase Date</label>
                    <input type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Notes</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all">{editingInstrument ? "Save Changes" : "Add Instrument"}</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
