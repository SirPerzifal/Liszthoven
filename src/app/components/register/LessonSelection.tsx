import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Users, Check, ChevronDown } from "lucide-react";

interface LessonSelectionProps {
  selected: any;
  onSelect: (lesson: any) => void;
}

const lessons = [
  {
    id: "classical-piano",
    category: "Piano",
    title: "Classical Piano",
    description: "Master the timeless repertoire of Bach, Mozart, Beethoven, and beyond with expert classical piano instruction.",
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $45/session",
    schedule: ["Monday-Friday: 2:00 PM - 8:00 PM", "Saturday: 9:00 AM - 5:00 PM"],
    features: ["Technique Development", "Music Theory", "Performance Preparation"]
  },
  {
    id: "jazz-piano",
    category: "Piano",
    title: "Jazz Piano",
    description: "Explore improvisation, chord voicings, and jazz standards with our contemporary jazz piano program.",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "45-60 min",
    level: "Intermediate to Advanced",
    price: "From $50/session",
    schedule: ["Monday-Friday: 3:00 PM - 9:00 PM", "Saturday: 10:00 AM - 6:00 PM"],
    features: ["Improvisation", "Jazz Theory", "Rhythm & Groove"]
  },
  {
    id: "acoustic-guitar",
    category: "Guitar",
    title: "Acoustic Guitar",
    description: "Develop fingerpicking, strumming patterns, and acoustic guitar mastery.",
    image: "https://images.unsplash.com/photo-1758524944402-1903b38f848f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $40/session",
    schedule: ["Monday-Friday: 2:00 PM - 8:00 PM", "Saturday: 9:00 AM - 5:00 PM"],
    features: ["Fingerstyle", "Strumming", "Song Accompaniment"]
  },
  {
    id: "electric-guitar",
    category: "Guitar",
    title: "Electric Guitar",
    description: "Rock, blues, and metal guitar techniques with professional electric guitar instruction.",
    image: "https://images.unsplash.com/photo-1563357989-f6cdbbae76cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "Beginner to Advanced",
    price: "From $40/session",
    schedule: ["Monday-Friday: 3:00 PM - 9:00 PM", "Saturday: 1:00 PM - 7:00 PM"],
    features: ["Lead Guitar", "Rhythm Guitar", "Effects & Tone"]
  },
  {
    id: "classical-voice",
    category: "Vocals",
    title: "Classical Voice",
    description: "Professional classical vocal training including opera, art songs, and choral repertoire.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "45-60 min",
    level: "Intermediate to Advanced",
    price: "From $55/session",
    schedule: ["Tuesday-Friday: 2:00 PM - 8:00 PM", "Saturday: 11:00 AM - 5:00 PM"],
    features: ["Vocal Technique", "Opera", "Art Songs"]
  },
  {
    id: "violin",
    category: "Strings",
    title: "Violin",
    description: "Classical and contemporary violin instruction for all skill levels.",
    image: "https://images.unsplash.com/photo-1566913485242-694e995731b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $48/session",
    schedule: ["Monday-Friday: 2:00 PM - 8:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
    features: ["Bowing Technique", "Intonation", "Repertoire"]
  }
];

export default function LessonSelection({ selected, onSelect }: LessonSelectionProps) {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const handleSelect = (lesson: any) => {
    onSelect(lesson);
    setExpandedLesson(lesson.id);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => {
          const isSelected = selected?.id === lesson.id;
          const isExpanded = expandedLesson === lesson.id;

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <button
                onClick={() => handleSelect(lesson)}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all text-left w-full ${
                  isSelected
                    ? "border-gold bg-gold/5"
                    : "border-border hover:border-gold/50 bg-card/50 backdrop-blur-sm"
                }`}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {isSelected && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-gold text-primary px-2 py-1 rounded text-xs font-semibold">
                    {lesson.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-semibold mb-2 group-hover:text-gold transition-colors" style={{ fontStyle: 'italic' }}>
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {lesson.description}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>{lesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-3 h-3 text-gold" />
                      <span>{lesson.level}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="text-gold font-semibold text-sm">{lesson.price}</span>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Live Preview Panel */}
      <AnimatePresence>
        {expandedLesson && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 overflow-hidden"
          >
            {lessons.filter(l => l.id === expandedLesson).map(lesson => (
              <div key={lesson.id} className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-gold/20">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl mb-2" style={{ fontStyle: 'italic' }}>{lesson.title}</h3>
                    <p className="text-muted-foreground">{lesson.description}</p>
                  </div>
                  <button
                    onClick={() => setExpandedLesson(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronDown className="w-6 h-6 rotate-180" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">What You'll Learn</h4>
                    <div className="space-y-2">
                      {lesson.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-gold flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Available Schedule</h4>
                    <div className="space-y-2">
                      {lesson.schedule.map((time, i) => (
                        <div key={i} className="text-sm text-muted-foreground">
                          {time}
                        </div>
                      ))}
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
