import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Plus, X, Music2, Star, CalendarDays, Users } from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "lesson" | "event" | "holiday" | "meeting";
  description: string;
  teacher?: string;
  room?: string;
  color: string;
}

const initialEvents: CalendarEvent[] = [
  { id: 1, title: "Piano Lesson — Emily Chen", date: "2026-05-30", startTime: "10:00", endTime: "11:00", type: "lesson", description: "Beginner piano lesson", teacher: "Dr. Sarah Mitchell", room: "Studio A", color: "blue" },
  { id: 2, title: "Guitar Lesson — Marcus J.", date: "2026-05-30", startTime: "11:30", endTime: "12:30", type: "lesson", description: "Intermediate guitar lesson", teacher: "James Rodriguez", room: "Studio B", color: "blue" },
  { id: 3, title: "Spring Recital", date: "2026-06-15", startTime: "18:00", endTime: "20:00", type: "event", description: "Annual spring recital featuring student performances", room: "Main Hall", color: "gold" },
  { id: 4, title: "Violin Masterclass", date: "2026-06-05", startTime: "14:00", endTime: "17:00", type: "event", description: "Workshop with guest violin virtuoso", teacher: "Elena Vasquez", room: "Studio C", color: "purple" },
  { id: 5, title: "Staff Meeting", date: "2026-06-02", startTime: "09:00", endTime: "10:00", type: "meeting", description: "Monthly faculty meeting", room: "Conference Room", color: "gray" },
  { id: 6, title: "Summer Program Registration", date: "2026-06-08", startTime: "09:00", endTime: "17:00", type: "event", description: "Open registration for summer music programs", color: "green" },
  { id: 7, title: "Drum Workshop", date: "2026-06-10", startTime: "13:00", endTime: "16:00", type: "event", description: "Beginner drum workshop", teacher: "Marcus Wright", room: "Drum Room", color: "orange" },
  { id: 8, title: "Piano Lesson — Ava W.", date: "2026-06-01", startTime: "09:00", endTime: "10:00", type: "lesson", description: "Intermediate piano lesson", teacher: "Dr. Sarah Mitchell", room: "Studio A", color: "blue" },
  { id: 9, title: "End of Term Holiday", date: "2026-06-20", startTime: "00:00", endTime: "23:59", type: "holiday", description: "School closed — end of term", color: "red" },
  { id: 10, title: "Guitar Ensemble Practice", date: "2026-06-12", startTime: "15:00", endTime: "17:00", type: "event", description: "Group ensemble practice session", teacher: "James Rodriguez", room: "Studio B", color: "purple" },
];

const typeColors: Record<string, string> = {
  lesson: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  event: "bg-gold/20 text-gold border-gold/30",
  holiday: "bg-red-500/20 text-red-300 border-red-500/30",
  meeting: "bg-muted text-muted-foreground border-border",
};

const dotColors: Record<string, string> = {
  blue: "bg-blue-400",
  gold: "bg-yellow-400",
  purple: "bg-purple-400",
  green: "bg-green-400",
  orange: "bg-orange-400",
  red: "bg-red-400",
  gray: "bg-gray-400",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const emptyForm: Omit<CalendarEvent, "id"> = {
  title: "", date: "", startTime: "09:00", endTime: "10:00",
  type: "lesson", description: "", teacher: "", room: "", color: "blue",
};

export default function AdminCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Omit<CalendarEvent, "id">>(emptyForm);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (dateStr: string) => events.filter((e) => e.date === dateStr);

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const isToday = (day: number) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const openAddEvent = (date?: string) => {
    setFormData({ ...emptyForm, date: date || "" });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.date) return;
    const id = events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
    setEvents((prev) => [...prev, { ...formData, id }]);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setSelectedEvent(null);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>Calendar</h2>
          <p className="text-sm text-muted-foreground">Schedule lessons, events, and holidays</p>
        </div>
        <button
          onClick={() => openAddEvent()}
          className="flex items-center gap-2 bg-gold text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gold-light transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          {/* Month Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-lg">{MONTHS[month]} {year}</h3>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7">
            {/* Empty cells before month start */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 border-b border-r border-border/50" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(day);
              const dayEvents = getEventsForDate(dateStr);
              const isSelected = selectedDate === dateStr;
              const todayDay = isToday(day);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`h-24 border-b border-r border-border/50 p-1.5 cursor-pointer transition-colors ${
                    isSelected ? "bg-gold/5 border-gold/30" : "hover:bg-muted/30"
                  }`}
                >
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-1 ${
                    todayDay ? "bg-gold text-black" : ""
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                        className={`text-xs px-1 py-0.5 rounded truncate ${dotColors[event.color]} bg-opacity-20 text-white`}
                        style={{ fontSize: "10px" }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground" style={{ fontSize: "10px" }}>
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold mb-3">Event Types</h4>
            <div className="space-y-2">
              {Object.entries(typeColors).map(([type, cls]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs border ${cls}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </h4>
                <button
                  onClick={() => openAddEvent(selectedDate)}
                  className="w-6 h-6 flex items-center justify-center rounded bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              {selectedDateEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground">No events scheduled</p>
              ) : (
                <div className="space-y-2">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="p-3 rounded-lg bg-muted border border-border cursor-pointer hover:border-gold/50 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${dotColors[event.color]}`} />
                        <p className="text-xs font-medium">{event.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{event.startTime} – {event.endTime}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-gold" />
              Upcoming Events
            </h4>
            <div className="space-y-2">
              {events
                .filter((e) => e.type !== "lesson" && new Date(e.date) >= new Date())
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 4)
                .map((event) => (
                  <div key={event.id} className="flex gap-3 items-start">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColors[event.color]}`} />
                    <div>
                      <p className="text-xs font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {event.startTime}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEvent(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl border border-border w-full max-w-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dotColors[selectedEvent.color]} bg-opacity-20`}>
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{selectedEvent.title}</h3>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs border mt-0.5 ${typeColors[selectedEvent.type]}`}>
                        {selectedEvent.type}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(selectedEvent.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedEvent.startTime} – {selectedEvent.endTime}
                  </div>
                  {selectedEvent.teacher && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {selectedEvent.teacher}
                    </div>
                  )}
                  {selectedEvent.room && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Music2 className="w-4 h-4" />
                      {selectedEvent.room}
                    </div>
                  )}
                  {selectedEvent.description && (
                    <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3" style={{ fontStyle: "normal" }}>
                      {selectedEvent.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => handleDelete(selectedEvent.id)}
                    className="px-4 py-2 rounded-lg border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors"
                  >
                    Delete Event
                  </button>
                  <button onClick={() => setSelectedEvent(null)} className="px-4 py-2 rounded-lg bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg">Add Event</h3>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Type</label>
                      <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as CalendarEvent["type"] })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors">
                        {["lesson", "event", "holiday", "meeting"].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Color</label>
                      <select value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors">
                        {["blue", "gold", "purple", "green", "orange", "red", "gray"].map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Date</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Start Time</label>
                      <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">End Time</label>
                      <input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  </div>

                  {[
                    { key: "teacher", label: "Teacher (optional)" },
                    { key: "room", label: "Room (optional)" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <input type="text" value={(formData as any)[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors" />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-gold text-black text-sm font-semibold hover:bg-gold-light transition-all">Add Event</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
