import { Link } from "react-router";
import {
  ArrowRight,
  Award,
  Users,
  Music,
  Star,
  Calendar,
  ShoppingBag,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";
import ParallaxHero from "../components/ParallaxHero";

const featuredLessons = [
  {
    id: "piano",
    title: "Piano Lessons",
    description:
      "Master the piano with our expert instructors. From classical to contemporary.",
    image:
      "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    levels: "Beginner to Advanced",
    duration: "30-60 min",
    price: "From $45/session",
  },
  {
    id: "guitar",
    title: "Guitar Lessons",
    description:
      "Learn acoustic, electric, or bass guitar with personalized instruction.",
    image:
      "https://images.unsplash.com/photo-1758524944402-1903b38f848f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    levels: "All Levels",
    duration: "30-60 min",
    price: "From $40/session",
  },
  {
    id: "vocals",
    title: "Vocal Training",
    description:
      "Develop your voice with professional vocal coaching and technique training.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    levels: "Beginner to Pro",
    duration: "45-60 min",
    price: "From $50/session",
  },
  {
    id: "violin",
    title: "Violin Lessons",
    description:
      "Classical and contemporary violin instruction for all skill levels.",
    image:
      "https://images.unsplash.com/photo-1566913485242-694e995731b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    levels: "All Levels",
    duration: "30-60 min",
    price: "From $48/session",
  },
];

const whyChooseUs = [
  {
    icon: Award,
    title: "Expert Instructors",
    description:
      "Learn from award-winning musicians and certified music educators with decades of experience.",
  },
  {
    icon: Users,
    title: "Personalized Learning",
    description:
      "Customized lesson plans tailored to your goals, skill level, and musical preferences.",
  },
  {
    icon: Music,
    title: "State-of-the-Art Facilities",
    description:
      "Practice in professional studios equipped with premium instruments and technology.",
  },
  {
    icon: Star,
    title: "Proven Results",
    description:
      "Join thousands of successful students who have achieved their musical dreams with us.",
  },
];

const instructors = [
  {
    name: "Sarah Mitchell",
    specialty: "Piano & Music Theory",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    credentials: "Juilliard Graduate, 15+ Years",
  },
  {
    name: "Michael Chen",
    specialty: "Guitar & Composition",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    credentials: "Berklee Alumni, Grammy Nominee",
  },
  {
    name: "Emily Rodriguez",
    specialty: "Vocal Performance",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    credentials: "Opera Singer, Voice Coach",
  },
  {
    name: "David Thompson",
    specialty: "Drums & Percussion",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    credentials: "Studio Musician, 20+ Years",
  },
];

const upcomingEvents = [
  {
    id: "spring-recital",
    title: "Spring Student Recital",
    date: "June 15, 2026",
    time: "7:00 PM",
    location: "Main Concert Hall",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "jazz-workshop",
    title: "Jazz Improvisation Workshop",
    date: "June 22, 2026",
    time: "2:00 PM",
    location: "Studio A",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "guest-concert",
    title: "Guest Artist Concert Series",
    date: "July 5, 2026",
    time: "8:00 PM",
    location: "Grand Theater",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
];

const testimonials = [
  {
    name: "Jessica Parker",
    role: "Adult Piano Student",
    content:
      "Liszthoven Academy transformed my relationship with music. The instructors are patient, knowledgeable, and truly care about your progress.",
    rating: 5,
  },
  {
    name: "Mark Johnson",
    role: "Parent of Student",
    content:
      "My daughter has been taking violin lessons for 2 years. Her confidence and skill have grown tremendously. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amanda Lee",
    role: "Vocal Student",
    content:
      "The vocal coaching here is exceptional. I've learned techniques that have completely changed my performance abilities.",
    rating: 5,
  },
];

const storeProducts = [
  {
    id: "acoustic-guitar",
    name: "Premium Acoustic Guitar",
    category: "Guitars",
    price: "$899",
    image:
      "https://images.unsplash.com/photo-1556379118-7034d926d258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "digital-piano",
    name: "88-Key Digital Piano",
    category: "Keyboards",
    price: "$1,299",
    image:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "violin-set",
    name: "Professional Violin Set",
    category: "Strings",
    price: "$749",
    image:
      "https://images.unsplash.com/photo-1624367171718-14026220ee35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "drum-kit",
    name: "5-Piece Drum Kit",
    category: "Percussion",
    price: "$1,599",
    image:
      "https://images.unsplash.com/photo-1519508234439-4f23643125c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

const latestNews = [
  {
    id: "summer-program",
    title: "Summer Intensive Program Announced",
    excerpt:
      "Join our exclusive 6-week summer program featuring masterclasses and ensemble performances.",
    date: "May 10, 2026",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    category: "Programs",
  },
  {
    id: "competition-winners",
    title: "Students Win Regional Competition",
    excerpt:
      "Three of our talented students took top honors at the Regional Music Competition.",
    date: "May 8, 2026",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    category: "Achievements",
  },
  {
    id: "new-instructor",
    title: "Welcoming Renowned Violinist to Faculty",
    excerpt:
      "We're thrilled to announce the addition of award-winning violinist Maria Santos to our teaching staff.",
    date: "May 5, 2026",
    image:
      "https://images.unsplash.com/photo-1566913485268-1287f67f87fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    category: "Faculty",
  },
];

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1513883049090-d0b7439799bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
        imageAlt="Piano"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block mb-8 px-6 py-2.5 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-sm tracking-wide">
              Inspiring Musicians Since 1995
            </div>
            <h1
              className="text-6xl md:text-8xl lg:text-9xl mb-8 tracking-tight leading-[0.9]"
              style={{ fontStyle: "italic" }}
            >
              Discover Your
              <span className="block text-gold mt-2">Musical Journey</span>
            </h1>
            <p
              className="text-xl md:text-2xl lg:text-3xl text-white/70 mb-14 max-w-4xl mx-auto leading-relaxed"
              style={{ fontStyle: "normal" }}
            >
              World-class music education for all ages and skill levels. Learn
              from expert instructors in our state-of-the-art facilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="bg-gold text-primary px-10 py-5 rounded-lg font-semibold text-lg hover:bg-gold-light transition-all inline-flex items-center justify-center gap-3 group shadow-xl hover:shadow-2xl hover:shadow-gold/20"
              >
                Register a Course
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register?type=trial"
                className="bg-white/5 backdrop-blur-md text-white px-10 py-5 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all border border-white/20 shadow-xl"
              >
                Book a Free Trial
              </Link>
            </div>
          </motion.div>
        </div>
      </ParallaxHero>

      {/* Featured Lessons */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              Our Programs
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured Lessons
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular music lessons, taught by world-class
              instructors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={`/lessons/${lesson.id}`} className="block">
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-2xl">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={lesson.image}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-gold transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {lesson.description}
                      </p>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Level:</span>
                          <span className="font-medium text-foreground">
                            {lesson.levels}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium text-foreground">
                            {lesson.duration}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="text-gold font-semibold text-base">
                            {lesson.price}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/lessons"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors font-medium"
            >
              View All Lessons
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Excellence in Music Education
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover what makes Liszthoven Academy the premier choice for
              music education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gold rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              Our Team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Our Instructors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn from award-winning musicians and certified educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {instructors.map((instructor, index) => (
              <motion.div
                key={instructor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-xl">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={instructor.image}
                      alt={instructor.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-semibold mb-1">
                        {instructor.name}
                      </h3>
                      <p className="text-gold text-sm">
                        {instructor.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-gold/5 to-transparent">
                    <p className="text-sm text-muted-foreground">
                      {instructor.credentials}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors font-medium"
            >
              Meet All Faculty
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/20 border border-gold rounded-full text-gold text-sm font-medium">
              Events
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us for concerts, workshops, and special performances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={`/events/concerts/${event.id}`}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-gold transition-all duration-300 hover:shadow-2xl">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-gold text-primary px-3 py-1.5 rounded-lg text-sm font-semibold">
                        {event.date.split(",")[0]}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gold" />
                          <span>
                            {event.date} at {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4 text-gold" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <span className="text-gold text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                          Learn More
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-medium"
            >
              View All Events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our community of passionate musicians
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-8 border border-border hover:border-gold transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Products */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              Music Store
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Premium instruments and accessories for every musician
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to="/store">
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-xl">
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-gold mb-2">
                        {product.category}
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-gold transition-colors">
                        {product.name}
                      </h3>
                      <div className="text-xl font-bold text-gold">
                        {product.price}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors font-medium"
            >
              Visit Our Store
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
              News & Updates
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest News</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest from Liszthoven Academy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={`/news/${article.id}`}>
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-gold text-primary px-3 py-1 rounded-lg text-xs font-semibold">
                        {article.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-muted-foreground mb-2">
                        {article.date}
                      </div>
                      <h3 className="text-lg font-semibold mb-3 group-hover:text-gold transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {article.excerpt}
                      </p>
                      <span className="text-gold text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors font-medium"
            >
              View All News
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <BookOpen className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in Tune with Us
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest news, events, and
              exclusive offers
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="bg-gold text-primary px-8 py-3.5 rounded-lg font-semibold hover:bg-gold-light transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
