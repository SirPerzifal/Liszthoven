import { useParams, Link } from "react-router";
import { Clock, Users, Award, DollarSign, CheckCircle, ArrowRight, Calendar, Music } from "lucide-react";
import { motion } from "motion/react";

const lessonData: Record<string, any> = {
  "classical-piano": {
    title: "Classical Piano",
    category: "Piano",
    description: "Master the timeless repertoire of Bach, Mozart, Beethoven, and beyond with expert classical piano instruction. Our comprehensive program develops strong technique, musical interpretation, and performance confidence.",
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    duration: "30-60 minutes",
    level: "All Levels",
    price: "From $45/session",
    instructors: [
      {
        name: "Sarah Mitchell",
        credentials: "Juilliard Graduate, 15+ Years Experience",
        specialization: "Classical Repertoire & Performance",
        bio: "Sarah is a renowned concert pianist and pedagogue with extensive experience teaching students from beginner to advanced levels. Her expertise spans Baroque through Romantic period repertoire.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        schedule: ["Monday-Wednesday: 2:00 PM - 8:00 PM", "Saturday: 9:00 AM - 2:00 PM"],
        achievements: ["Carnegie Hall Performer", "International Piano Competition Winner", "Published Pedagogue"]
      },
      {
        name: "Dr. James Harrison",
        credentials: "Ph.D. Music Theory, 20+ Years Teaching",
        specialization: "Music Theory & Technique",
        bio: "Dr. Harrison combines rigorous theoretical knowledge with practical technique, helping students develop a deep understanding of the music they perform.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        schedule: ["Tuesday-Friday: 3:00 PM - 8:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
        achievements: ["Music Theory Professor", "Author of 3 Books", "Master Class Clinician"]
      }
    ],
    whatYouLearn: [
      "Proper hand position and posture",
      "Reading music notation and theory",
      "Technical exercises and etudes",
      "Classical repertoire from Baroque to Romantic",
      "Performance preparation and stage presence",
      "Musical interpretation and expression"
    ],
    curriculum: [
      {
        level: "Beginner",
        topics: ["Basic hand position", "Reading treble and bass clef", "Simple melodies", "Basic rhythm"]
      },
      {
        level: "Intermediate",
        topics: ["Scale and arpeggio mastery", "Classical sonatinas", "Pedal technique", "Musical phrasing"]
      },
      {
        level: "Advanced",
        topics: ["Major sonatas and concertos", "Advanced repertoire", "Performance coaching", "Competition preparation"]
      }
    ],
    schedule: ["Monday-Friday: 2:00 PM - 8:00 PM", "Saturday: 9:00 AM - 5:00 PM", "Sunday: By Appointment"],
    pricing: [
      { duration: "30 minutes", price: "$45", best: false },
      { duration: "45 minutes", price: "$60", best: true },
      { duration: "60 minutes", price: "$75", best: false }
    ]
  },
  "jazz-piano": {
    title: "Jazz Piano",
    category: "Piano",
    description: "Explore the world of jazz piano with comprehensive training in improvisation, chord voicings, and jazz standards.",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    duration: "45-60 minutes",
    level: "Intermediate to Advanced",
    price: "From $50/session",
    instructors: [
      {
        name: "Michael Chen",
        credentials: "Berklee Alumni, Grammy Nominee",
        specialization: "Jazz Improvisation & Composition",
        bio: "Michael is an accomplished jazz pianist and composer who has performed with internationally renowned artists and recorded multiple albums.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        schedule: ["Monday-Friday: 3:00 PM - 9:00 PM", "Saturday: 10:00 AM - 6:00 PM"],
        achievements: ["Grammy Nomination 2024", "5 Studio Albums", "International Jazz Festival Performer"]
      }
    ],
    whatYouLearn: [
      "Jazz harmony and chord progressions",
      "Improvisation techniques and scales",
      "Comping and accompaniment",
      "Jazz standards repertoire",
      "Rhythm and swing feel",
      "Left-hand voicings and rootless chords"
    ],
    curriculum: [
      {
        level: "Intermediate",
        topics: ["Basic jazz voicings", "Blues scales", "II-V-I progressions", "Simple improvisation"]
      },
      {
        level: "Advanced",
        topics: ["Advanced reharmonization", "Modal jazz", "Bebop lines", "Complex improvisations"]
      }
    ],
    schedule: ["Monday-Friday: 3:00 PM - 9:00 PM", "Saturday: 10:00 AM - 6:00 PM"],
    pricing: [
      { duration: "45 minutes", price: "$60", best: false },
      { duration: "60 minutes", price: "$75", best: true }
    ]
  },
  "acoustic-guitar": {
    title: "Acoustic Guitar",
    category: "Guitar",
    description: "Develop fingerpicking, strumming patterns, and acoustic guitar mastery with personalized instruction.",
    image: "https://images.unsplash.com/photo-1758524944402-1903b38f848f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    duration: "30-60 minutes",
    level: "All Levels",
    price: "From $40/session",
    instructors: [
      {
        name: "Michael Chen",
        credentials: "Berklee Alumni, Professional Guitarist",
        specialization: "Fingerstyle & Contemporary Acoustic",
        bio: "Michael specializes in acoustic fingerstyle and has taught hundreds of students to master the guitar.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        schedule: ["Monday-Friday: 2:00 PM - 8:00 PM", "Saturday: 9:00 AM - 5:00 PM"],
        achievements: ["Session Musician", "Published Instructional Books", "YouTube Education Channel"]
      }
    ],
    whatYouLearn: [
      "Proper guitar holding and posture",
      "Chord progressions and strumming patterns",
      "Fingerpicking techniques",
      "Music theory fundamentals",
      "Song accompaniment",
      "Performance techniques"
    ],
    curriculum: [
      {
        level: "Beginner",
        topics: ["Basic chords", "Simple strumming", "Reading tabs", "Popular songs"]
      },
      {
        level: "Intermediate",
        topics: ["Barre chords", "Fingerpicking patterns", "Music theory", "Genre exploration"]
      },
      {
        level: "Advanced",
        topics: ["Advanced fingerstyle", "Complex arrangements", "Composition", "Performance"]
      }
    ],
    schedule: ["Monday-Friday: 2:00 PM - 8:00 PM", "Saturday: 9:00 AM - 5:00 PM"],
    pricing: [
      { duration: "30 minutes", price: "$40", best: false },
      { duration: "45 minutes", price: "$55", best: true },
      { duration: "60 minutes", price: "$70", best: false }
    ]
  },
  "violin": {
    title: "Violin",
    category: "Strings",
    description: "Classical and contemporary violin instruction for all skill levels with focus on technique and musicality.",
    image: "https://images.unsplash.com/photo-1566913485242-694e995731b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    duration: "30-60 minutes",
    level: "All Levels",
    price: "From $48/session",
    instructors: [
      {
        name: "Lisa Anderson",
        credentials: "Former Symphony Orchestra Member",
        specialization: "Orchestral & Chamber Music",
        bio: "Lisa brings years of orchestral and chamber music experience to her comprehensive violin instruction.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        schedule: ["Monday-Friday: 2:00 PM - 8:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
        achievements: ["20 Years Orchestra Experience", "Chamber Music Specialist", "Suzuki Method Certified"]
      },
      {
        name: "Maria Santos",
        credentials: "International Soloist",
        specialization: "Solo Performance & Competition Preparation",
        bio: "Maria is an internationally acclaimed violinist specializing in solo performance and competition coaching.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        schedule: ["Tuesday-Thursday: 4:00 PM - 9:00 PM", "Sunday: 12:00 PM - 6:00 PM"],
        achievements: ["Paganini Competition Winner", "International Concert Tours", "Recorded 10+ Albums"]
      }
    ],
    whatYouLearn: [
      "Proper bow hold and posture",
      "Intonation and ear training",
      "Bowing techniques and articulation",
      "Classical and contemporary repertoire",
      "Vibrato and tone production",
      "Ensemble and performance skills"
    ],
    curriculum: [
      {
        level: "Beginner",
        topics: ["Basic bow technique", "First position", "Simple melodies", "Reading music"]
      },
      {
        level: "Intermediate",
        topics: ["Position shifts", "Vibrato", "Scales and arpeggios", "Intermediate repertoire"]
      },
      {
        level: "Advanced",
        topics: ["Advanced technique", "Concertos", "Orchestra excerpts", "Performance preparation"]
      }
    ],
    schedule: ["Monday-Friday: 2:00 PM - 8:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
    pricing: [
      { duration: "30 minutes", price: "$48", best: false },
      { duration: "45 minutes", price: "$63", best: true },
      { duration: "60 minutes", price: "$78", best: false }
    ]
  }
};

export default function LessonDetail() {
  const { id } = useParams();
  const lesson = lessonData[id || "classical-piano"];

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Link to="/lessons" className="text-gold hover:underline">
            View All Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={lesson.image}
            alt={lesson.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-gold/20 border border-gold rounded-full text-gold text-sm">
              {lesson.category} Lessons
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{lesson.title}</h1>
            <p className="text-xl text-white/80 max-w-2xl mb-8">
              {lesson.description}
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                <span>{lesson.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                <span>{lesson.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold" />
                <span>{lesson.price}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.whatYouLearn.map((item: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Curriculum */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Curriculum by Level</h2>
              <div className="space-y-6">
                {lesson.curriculum.map((level: any, index: number) => (
                  <div key={index} className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="text-xl font-semibold mb-4 text-gold">{level.level}</h3>
                    <ul className="space-y-2">
                      {level.topics.map((topic: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground">
                          <Music className="w-4 h-4 text-gold flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Instructors */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ fontStyle: 'italic' }}>
                {lesson.instructors.length > 1 ? 'Our Instructors' : 'Your Instructor'}
              </h2>
              <div className="space-y-6">
                {lesson.instructors.map((instructor: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-gold/50 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="relative">
                        <img
                          src={instructor.image}
                          alt={instructor.name}
                          className="w-32 h-32 rounded-xl object-cover ring-2 ring-gold/20 group-hover:ring-gold/40 transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-1" style={{ fontStyle: 'italic' }}>{instructor.name}</h3>
                        <div className="flex items-center gap-2 text-gold mb-2">
                          <Award className="w-4 h-4" />
                          <span className="text-sm">{instructor.credentials}</span>
                        </div>
                        <div className="text-sm font-medium text-gold/80 mb-3">{instructor.specialization}</div>
                        <p className="text-muted-foreground mb-4">{instructor.bio}</p>

                        {/* Achievements */}
                        {instructor.achievements && (
                          <div className="mb-4">
                            <div className="text-sm font-medium mb-2">Notable Achievements:</div>
                            <div className="flex flex-wrap gap-2">
                              {instructor.achievements.map((achievement: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-gold/10 text-gold text-xs rounded-full border border-gold/20"
                                >
                                  {achievement}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Schedule */}
                        {instructor.schedule && (
                          <div>
                            <div className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gold" />
                              Available:
                            </div>
                            <div className="space-y-1">
                              {instructor.schedule.map((time: string, i: number) => (
                                <div key={i} className="text-sm text-muted-foreground">
                                  {time}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl p-6 border border-border sticky top-24"
            >
              <h3 className="text-xl font-semibold mb-6">Pricing Options</h3>
              <div className="space-y-3 mb-6">
                {lesson.pricing.map((option: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      option.best
                        ? "border-gold bg-gold/5"
                        : "border-border hover:border-gold/50"
                    }`}
                  >
                    {option.best && (
                      <div className="text-xs text-gold font-semibold mb-2">MOST POPULAR</div>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{option.duration}</div>
                        <div className="text-sm text-muted-foreground">per session</div>
                      </div>
                      <div className="text-2xl font-bold text-gold">{option.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/contact"
                className="w-full bg-gold text-primary px-6 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center justify-center gap-2 mb-4"
              >
                Book a Lesson
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/contact"
                className="w-full bg-white/5 text-foreground px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2 border border-border"
              >
                Free Trial Lesson
              </Link>
            </motion.div>

            {/* Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card rounded-xl p-6 border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-semibold">Availability</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {lesson.schedule.map((time: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    {time}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gold/10 rounded-xl p-6 border border-gold/20"
            >
              <h3 className="text-lg font-semibold mb-4">Included with Every Lesson</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Personalized lesson plans</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Practice materials</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Performance opportunities</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Progress tracking</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Book your first lesson today and begin your musical journey with Harmony Academy
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all"
            >
              Schedule Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
