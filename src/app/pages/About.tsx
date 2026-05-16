import { Award, Users, Heart, Target, Music, Calendar } from "lucide-react";
import { motion } from "motion/react";
import ParallaxHero from "../components/ParallaxHero";

const milestones = [
  { year: "1995", event: "Harmony Academy Founded" },
  { year: "2005", event: "Expanded to Three Locations" },
  { year: "2015", event: "10,000th Student Enrolled" },
  { year: "2026", event: "Over 50 Award-Winning Faculty" }
];

const values = [
  {
    icon: Heart,
    title: "Passion for Music",
    description: "We believe music enriches lives and brings joy to communities."
  },
  {
    icon: Users,
    title: "Student-Centered",
    description: "Every lesson is tailored to each student's unique goals and learning style."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in music education and performance."
  },
  {
    icon: Target,
    title: "Accessibility",
    description: "Music education should be accessible to everyone, regardless of background."
  }
];

const teamMembers = [
  {
    name: "Sarah Mitchell",
    role: "Piano & Music Theory",
    bio: "Juilliard graduate with 15+ years of teaching experience",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
  },
  {
    name: "Michael Chen",
    role: "Guitar & Composition",
    bio: "Berklee alumni and Grammy-nominated composer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
  },
  {
    name: "Emily Rodriguez",
    role: "Vocal Performance",
    bio: "Professional opera singer and certified voice coach",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
  },
  {
    name: "David Thompson",
    role: "Drums & Percussion",
    bio: "Studio musician with 20+ years of experience",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
  },
  {
    name: "Lisa Anderson",
    role: "Violin & Strings",
    bio: "Former symphony orchestra member and chamber musician",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
  },
  {
    name: "James Wilson",
    role: "Brass & Woodwinds",
    bio: "Jazz saxophonist and music education specialist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
  }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
];

export default function About() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
        imageAlt="About Harmony Academy"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block mb-8 px-6 py-2.5 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-sm tracking-wide">
              Since 1995
            </div>
            <h1 className="text-6xl md:text-8xl mb-6 tracking-tight leading-tight" style={{ fontStyle: 'italic' }}>
              About Harmony Academy
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed" style={{ fontStyle: 'normal' }}>
              Inspiring musicians and nurturing talent for over three decades
            </p>
          </motion.div>
        </div>
      </ParallaxHero>

      {/* Story */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">A Legacy of Musical Excellence</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Founded in 1995 by renowned pianist and educator Dr. Margaret Harmony, Harmony Academy began as a small studio in downtown New York with just five students and a dream to make world-class music education accessible to everyone.
              </p>
              <p>
                Over the past three decades, we've grown into one of the premier music schools in the region, serving thousands of students from beginners to advanced musicians. Our faculty includes Grammy-nominated artists, symphony orchestra members, and graduates from prestigious institutions like Juilliard, Berklee, and the Manhattan School of Music.
              </p>
              <p>
                Today, Harmony Academy operates three state-of-the-art facilities equipped with professional-grade instruments, recording studios, and performance spaces. But our mission remains the same: to inspire a lifelong love of music and help every student discover their unique musical voice.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <Target className="w-12 h-12 text-gold mb-6" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading music academy that transforms lives through exceptional music education, inspiring the next generation of musicians and music lovers to reach their full potential.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-8 border border-border"
            >
              <Music className="w-12 h-12 text-gold mb-6" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide world-class music education that is accessible, personalized, and inspiring. We nurture talent, build confidence, and foster a lifelong passion for music in students of all ages and abilities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              Our Values
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Drives Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gold rounded-2xl flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/20 border border-gold rounded-full text-gold text-sm font-medium">
              Our Journey
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Milestones</h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gold/20" />

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative mb-12 last:mb-0"
              >
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="inline-block bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                      <div className="text-3xl font-bold text-gold mb-2">{milestone.year}</div>
                      <div className="text-lg">{milestone.event}</div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gold rounded-full border-4 border-primary" />
                  <div className="w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              Our Faculty
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Expert Instructors</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn from award-winning musicians and certified music educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-xl">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-gold text-sm mb-3">{member.role}</p>
                      <p className="text-sm text-white/80">{member.bio}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              Our Facilities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Studio Gallery</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              State-of-the-art facilities designed for optimal learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Studio ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
