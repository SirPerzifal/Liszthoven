import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const events = [
  { date: "2026-05-30", title: "Piano Lesson", time: "3:00 PM", type: "lesson" },
  { date: "2026-06-01", title: "Piano Lesson", time: "3:00 PM", type: "lesson" },
  { date: "2026-06-03", title: "Piano Lesson", time: "3:00 PM", type: "lesson" },
  { date: "2026-06-05", title: "Violin Masterclass (Open)", time: "2:00 PM", type: "event" },
  { date: "2026-06-08", title: "Piano Lesson", time: "3:00 PM", type: "lesson" },
  { date: "2026-06-10", title: "Piano Lesson", time: "3:00 PM", type: "lesson" },
  { date: "2026-06-15", title: "Spring Recital", time: "6:00 PM", type: "event" },
  { date: "2026-06-17", title: "Piano Lesson", time: "3:00 PM", type: "lesson" },
  { date: "2026-06-20", title: "School Holiday", time: "All Day", type: "holiday" },
];

const typeStyle = {
  lesson: "bg-blue-500",
  event: "bg-yellow-400",
  holiday: "bg-red-500",
};

const typeBadge = {
  lesson: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  event: "bg-gold/10 text-gold border-gold/20",
  holiday: "bg-red-500/10 text-red-300 border-red-500/20",
};

export default function StudentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const formatDate = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const getEventsForDate = (d: string) => events.filter((e) => e.date === d);
  const today = new Date();
  const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl mb-1" style={{ fontStyle: "italic" }}>My Calendar</h2>
        <p className="text-sm text-muted-foreground">Your upcoming classes and events</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold">{MONTHS[month]} {year}</h3>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map((d) => <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="h-20 border-b border-r border-border/40" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(day);
              const dayEvents = getEventsForDate(dateStr);
              const isSelected = selectedDate === dateStr;
              return (
                <div key={day} onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`h-20 border-b border-r border-border/40 p-1 cursor-pointer transition-colors ${isSelected ? "bg-gold/5" : "hover:bg-muted/30"}`}>
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-1 ${isToday(day) ? "bg-gold text-black" : ""}`}>{day}</div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((evt, j) => (
                      <div key={j} className={`h-1.5 rounded-full ${typeStyle[evt.type as keyof typeof typeStyle]}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold mb-3">Legend</h4>
            {(["lesson", "event", "holiday"] as const).map((t) => (
              <div key={t} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border mr-2 mb-2 ${typeBadge[t]}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>

          {selectedDate && (
            <div className="bg-card rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold mb-3">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h4>
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-xs text-muted-foreground">No events this day</p>
              ) : getEventsForDate(selectedDate).map((evt, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted mb-2">
                  <div className={`w-2 h-2 rounded-full ${typeStyle[evt.type as keyof typeof typeStyle]}`} />
                  <div>
                    <p className="text-xs font-medium">{evt.title}</p>
                    <p className="text-xs text-muted-foreground">{evt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-card rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold mb-3">Upcoming</h4>
            <div className="space-y-3">
              {events.filter((e) => new Date(e.date) >= new Date()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5).map((evt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${typeStyle[evt.type as keyof typeof typeStyle]}`} />
                  <div>
                    <p className="text-xs font-medium">{evt.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(evt.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {evt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
