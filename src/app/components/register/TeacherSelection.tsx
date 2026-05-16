import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Calendar, Check, Star } from "lucide-react";

interface TeacherSelectionProps {
  lesson: any;
  selected: any;
  onSelect: (teacher: any) => void;
}

const teachersData: Record<string, any[]> = {
  "classical-piano": [
    {
      id: "sarah-mitchell",
      name: "Sarah Mitchell",
      credentials: "Juilliard Graduate, 15+ Years Experience",
      specialization: "Classical Repertoire & Performance",
      bio: "Sarah is a renowned concert pianist and pedagogue with extensive experience teaching students from beginner to advanced levels. Her expertise spans Baroque through Romantic period repertoire.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      schedule: ["Mon-Wed: 2PM-8PM", "Sat: 9AM-2PM"],
      achievements: ["Carnegie Hall Performer", "Competition Winner", "Published Pedagogue"],
      rating: 4.9,
      students: 45
    },
    {
      id: "james-harrison",
      name: "Dr. James Harrison",
      credentials: "Ph.D. Music Theory, 20+ Years",
      specialization: "Music Theory & Technique",
      bio: "Dr. Harrison combines rigorous theoretical knowledge with practical technique, helping students develop a deep understanding of the music they perform.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      schedule: ["Tue-Fri: 3PM-8PM", "Sat: 10AM-4PM"],
      achievements: ["Music Theory Professor", "Author of 3 Books", "Master Class Clinician"],
      rating: 4.8,
      students: 38
    }
  ],
  "jazz-piano": [
    {
      id: "michael-chen",
      name: "Michael Chen",
      credentials: "Berklee Alumni, Grammy Nominee",
      specialization: "Jazz Improvisation & Composition",
      bio: "Michael is an accomplished jazz pianist and composer who has performed with internationally renowned artists.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      schedule: ["Mon-Fri: 3PM-9PM", "Sat: 10AM-6PM"],
      achievements: ["Grammy Nomination", "5 Studio Albums", "International Performer"],
      rating: 5.0,
      students: 32
    }
  ],
  "acoustic-guitar": [
    {
      id: "michael-chen-guitar",
      name: "Michael Chen",
      credentials: "Berklee Alumni, Professional Guitarist",
      specialization: "Fingerstyle & Contemporary",
      bio: "Michael specializes in acoustic fingerstyle and has taught hundreds of students to master the guitar.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      schedule: ["Mon-Fri: 2PM-8PM", "Sat: 9AM-5PM"],
      achievements: ["Session Musician", "Published Books", "YouTube Educator"],
      rating: 4.7,
      students: 52
    }
  ],
  "violin": [
    {
      id: "lisa-anderson",
      name: "Lisa Anderson",
      credentials: "Former Symphony Member",
      specialization: "Orchestral & Chamber Music",
      bio: "Lisa brings years of orchestral and chamber music experience to comprehensive violin instruction.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      schedule: ["Mon-Fri: 2PM-8PM", "Sat: 10AM-4PM"],
      achievements: ["20 Years Orchestra", "Chamber Music Specialist", "Suzuki Certified"],
      rating: 4.9,
      students: 41
    },
    {
      id: "maria-santos",
      name: "Maria Santos",
      credentials: "International Soloist",
      specialization: "Solo Performance & Competition",
      bio: "Maria is an internationally acclaimed violinist specializing in solo performance and competition coaching.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      schedule: ["Tue-Thu: 4PM-9PM", "Sun: 12PM-6PM"],
      achievements: ["Competition Winner", "International Tours", "10+ Albums"],
      rating: 5.0,
      students: 28
    }
  ]
};

export default function TeacherSelection({ lesson, selected, onSelect }: TeacherSelectionProps) {
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);

  if (!lesson) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Please select a lesson first</p>
      </div>
    );
  }

  const teachers = teachersData[lesson.id] || [];

  const handleSelect = (teacher: any) => {
    onSelect(teacher);
    setExpandedTeacher(teacher.id);
  };

  if (teachers.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No teachers available for this lesson</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((teacher, index) => {
          const isSelected = selected?.id === teacher.id;

          return (
            <motion.button
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleSelect(teacher)}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-gold bg-gold/5"
                  : "border-border hover:border-gold/50 bg-card/50 backdrop-blur-sm"
              }`}
            >
              <div className="p-6">
                <div className="flex gap-4">
                  {/* Profile Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-24 h-24 rounded-xl object-cover ring-2 ring-gold/20 group-hover:ring-gold/40 transition-all"
                    />
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-gold transition-colors" style={{ fontStyle: 'italic' }}>
                      {teacher.name}
                    </h4>
                    <div className="flex items-center gap-2 text-gold text-xs mb-2">
                      <Award className="w-3 h-3" />
                      <span>{teacher.credentials}</span>
                    </div>
                    <div className="text-sm font-medium text-gold/80 mb-3">
                      {teacher.specialization}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-gold text-gold" />
                        <span className="text-sm font-semibold">{teacher.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {teacher.students} students
                      </span>
                    </div>

                    {/* Achievements Preview */}
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.achievements.slice(0, 2).map((achievement: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gold/10 text-gold text-xs rounded"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Live Preview Panel */}
      <AnimatePresence>
        {expandedTeacher && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 overflow-hidden"
          >
            {teachers.filter(t => t.id === expandedTeacher).map(teacher => (
              <div key={teacher.id} className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-gold/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Profile */}
                  <div className="text-center md:text-left">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-32 h-32 rounded-xl object-cover mx-auto md:mx-0 mb-4 ring-4 ring-gold/20"
                    />
                    <h3 className="text-xl font-semibold mb-1" style={{ fontStyle: 'italic' }}>
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gold mb-2">{teacher.credentials}</p>
                    <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(teacher.rating) ? "fill-gold text-gold" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm ml-1">{teacher.rating}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">About</h4>
                      <p className="text-sm text-muted-foreground">{teacher.bio}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-gold" />
                        Notable Achievements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {teacher.achievements.map((achievement: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-gold/10 text-gold text-sm rounded-lg border border-gold/20"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold" />
                        Available Schedule
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {teacher.schedule.map((time: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-secondary text-sm rounded-lg"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
