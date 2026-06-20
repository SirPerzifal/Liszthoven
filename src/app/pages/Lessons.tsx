import { Link, useParams } from "react-router";
import { Clock, Users, Award, ArrowRight, Filter } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ParallaxHero from "../components/ParallaxHero";

const allLessons = [
  {
    id: "classical-piano",
    category: "piano",
    title: "Classical Piano",
    description:
      "Master the timeless repertoire of Bach, Mozart, Beethoven, and beyond with expert classical piano instruction.",
    image:
      "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $45/session",
    instructor: "Sarah Mitchell",
    features: [
      "Technique Development",
      "Music Theory",
      "Performance Preparation",
    ],
  },
  {
    id: "jazz-piano",
    category: "piano",
    title: "Jazz Piano",
    description:
      "Explore improvisation, chord voicings, and jazz standards with our contemporary jazz piano program.",
    image:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "45-60 min",
    level: "Intermediate to Advanced",
    price: "From $50/session",
    instructor: "Michael Chen",
    features: ["Improvisation", "Jazz Theory", "Rhythm & Groove"],
  },
  {
    id: "contemporary-piano",
    category: "piano",
    title: "Contemporary Piano",
    description:
      "Learn popular music, contemporary compositions, and modern piano techniques.",
    image:
      "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "Beginner to Advanced",
    price: "From $45/session",
    instructor: "Sarah Mitchell",
    features: ["Pop & Rock", "Film Music", "Songwriting"],
  },
  {
    id: "acoustic-guitar",
    category: "guitar",
    title: "Acoustic Guitar",
    description:
      "Develop fingerpicking, strumming patterns, and acoustic guitar mastery.",
    image:
      "https://images.unsplash.com/photo-1758524944402-1903b38f848f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $40/session",
    instructor: "Michael Chen",
    features: ["Fingerstyle", "Strumming", "Song Accompaniment"],
  },
  {
    id: "electric-guitar",
    category: "guitar",
    title: "Electric Guitar",
    description:
      "Rock, blues, and metal guitar techniques with professional electric guitar instruction.",
    image:
      "https://images.unsplash.com/photo-1563357989-f6cdbbae76cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "Beginner to Advanced",
    price: "From $40/session",
    instructor: "David Thompson",
    features: ["Lead Guitar", "Rhythm Guitar", "Effects & Tone"],
  },
  {
    id: "bass-guitar",
    category: "guitar",
    title: "Bass Guitar",
    description:
      "Learn the foundation of rhythm with bass guitar lessons covering all styles.",
    image:
      "https://images.unsplash.com/photo-1519508234439-4f23643125c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $40/session",
    instructor: "Michael Chen",
    features: ["Groove & Rhythm", "Slap Bass", "Music Theory"],
  },
  {
    id: "classical-voice",
    category: "vocals",
    title: "Classical Voice",
    description:
      "Professional classical vocal training including opera, art songs, and choral repertoire.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "45-60 min",
    level: "Intermediate to Advanced",
    price: "From $55/session",
    instructor: "Emily Rodriguez",
    features: ["Vocal Technique", "Opera", "Art Songs"],
  },
  {
    id: "pop-vocals",
    category: "vocals",
    title: "Pop & Rock Vocals",
    description:
      "Contemporary vocal training for pop, rock, R&B, and modern music styles.",
    image:
      "https://images.unsplash.com/photo-1520872024865-3ff2805d8bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $50/session",
    instructor: "Emily Rodriguez",
    features: ["Breath Control", "Tone & Style", "Performance"],
  },
  {
    id: "violin",
    category: "strings",
    title: "Violin",
    description:
      "Classical and contemporary violin instruction for all skill levels.",
    image:
      "https://images.unsplash.com/photo-1566913485242-694e995731b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $48/session",
    instructor: "Lisa Anderson",
    features: ["Bowing Technique", "Intonation", "Repertoire"],
  },
  {
    id: "cello",
    category: "strings",
    title: "Cello",
    description:
      "Explore the rich, warm tones of the cello with professional instruction.",
    image:
      "https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $48/session",
    instructor: "Lisa Anderson",
    features: ["Technique", "Chamber Music", "Solo Performance"],
  },
  {
    id: "drum-set",
    category: "drums",
    title: "Drum Set",
    description:
      "Comprehensive drum lessons covering all styles from rock to jazz.",
    image:
      "https://images.unsplash.com/photo-1571327073757-71d13c24de30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "All Levels",
    price: "From $42/session",
    instructor: "David Thompson",
    features: ["Rudiments", "Groove & Timing", "Independence"],
  },
  {
    id: "percussion",
    category: "drums",
    title: "Percussion",
    description:
      "Orchestral and contemporary percussion including timpani, marimba, and more.",
    image:
      "https://images.unsplash.com/photo-1618609378039-b572f64c5b42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    duration: "30-60 min",
    level: "Intermediate to Advanced",
    price: "From $45/session",
    instructor: "David Thompson",
    features: ["Orchestral Percussion", "Mallet Instruments", "Rhythm"],
  },
];

const categories = [
  { id: "all", name: "All Lessons", count: allLessons.length },
  {
    id: "piano",
    name: "Piano",
    count: allLessons.filter((l) => l.category === "piano").length,
  },
  {
    id: "guitar",
    name: "Guitar",
    count: allLessons.filter((l) => l.category === "guitar").length,
  },
  {
    id: "vocals",
    name: "Vocals",
    count: allLessons.filter((l) => l.category === "vocals").length,
  },
  {
    id: "strings",
    name: "Strings",
    count: allLessons.filter((l) => l.category === "strings").length,
  },
  {
    id: "drums",
    name: "Drums",
    count: allLessons.filter((l) => l.category === "drums").length,
  },
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function Lessons() {
  const { category } = useParams();
  const [selectedLevel, setSelectedLevel] = useState<string>("All Levels");

  const filteredLessons = allLessons.filter((lesson) => {
    const categoryMatch =
      !category || category === "all" || lesson.category === category;
    const levelMatch =
      selectedLevel === "All Levels" || lesson.level.includes(selectedLevel);
    return categoryMatch && levelMatch;
  });

  const activeCategory = category || "all";
  const categoryData = categories.find((c) => c.id === activeCategory);

  return (
    <div className="bg-background">
      {/* Hero */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1513883049090-d0b7439799bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
        imageAlt="Music Lessons"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block mb-8 px-6 py-2.5 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-sm tracking-wide">
              Professional Instruction
            </div>
            <h1
              className="text-6xl md:text-8xl mb-6 tracking-tight"
              style={{ fontStyle: "italic" }}
            >
              {categoryData ? categoryData.name : "Music Lessons"}
            </h1>
            <p
              className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed"
              style={{ fontStyle: "normal" }}
            >
              Discover the perfect lesson for your musical journey
            </p>
          </motion.div>
        </div>
      </ParallaxHero>

      {/* Filters */}
      <section className="py-8 bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.id === "all" ? "/lessons" : `/lessons/${cat.id}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-gold text-primary"
                      : "bg-card text-foreground border border-border hover:border-gold"
                  }`}
                >
                  {cat.name} ({cat.count})
                </Link>
              ))}
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 rounded-lg bg-card text-foreground border border-border focus:outline-none focus:border-gold transition-colors"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredLessons.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No lessons found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/lessons/${lesson.category}/${lesson.id}`}>
                    <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={lesson.image}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 rounded-lg text-xs font-semibold uppercase">
                          {lesson.category}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-gold transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {lesson.description}
                        </p>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gold" />
                            <span>{lesson.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold" />
                            <span>{lesson.level}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gold" />
                            <span>{lesson.instructor}</span>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {lesson.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-gold/10 text-gold text-xs rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-border">
                            <span className="text-gold font-semibold">
                              {lesson.price}
                            </span>
                            <span className="text-gold text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                              Learn More
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Musical Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Book a free trial lesson and experience the Liszthoven Academy
              difference
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all"
            >
              Book Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
