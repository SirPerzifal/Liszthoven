import { Link, useParams } from "react-router";
import { Calendar, MapPin, Clock, Users, ArrowRight, Filter } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ParallaxHero from "../components/ParallaxHero";

const allEvents = [
  {
    id: "spring-recital",
    category: "concerts",
    title: "Spring Student Recital",
    description: "Join us for our annual Spring Student Recital featuring performances from students of all levels.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    date: "June 15, 2026",
    time: "7:00 PM",
    location: "Main Concert Hall",
    price: "Free Admission",
    capacity: "300 seats"
  },
  {
    id: "summer-concert",
    category: "concerts",
    title: "Faculty Summer Concert",
    description: "Experience an evening of breathtaking performances by our world-class faculty members.",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    date: "July 10, 2026",
    time: "8:00 PM",
    location: "Grand Theater",
    price: "$15 - $25",
    capacity: "500 seats"
  },
  {
    id: "guest-pianist",
    category: "concerts",
    title: "Guest Artist: Renowned Pianist",
    description: "Grammy-winning pianist Maria Santos performs works by Chopin, Liszt, and Rachmaninoff.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    date: "August 5, 2026",
    time: "7:30 PM",
    location: "Grand Theater",
    price: "$20 - $35",
    capacity: "500 seats"
  },
  {
    id: "jazz-workshop",
    category: "workshops",
    title: "Jazz Improvisation Workshop",
    description: "Learn the art of jazz improvisation from professional jazz musicians in this hands-on workshop.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    date: "June 22, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Studio A",
    price: "$35",
    capacity: "20 participants"
  },
  {
    id: "technique-masterclass",
    category: "workshops",
    title: "Advanced Piano Technique Masterclass",
    description: "World-renowned pianist conducts an intensive masterclass on advanced piano technique.",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    date: "July 12, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Recital Hall",
    price: "$50",
    capacity: "15 participants"
  },
  {
    id: "vocal-workshop",
    category: "workshops",
    title: "Vocal Performance Workshop",
    description: "Develop your stage presence and vocal technique in this comprehensive workshop.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    date: "July 20, 2026",
    time: "1:00 PM - 4:00 PM",
    location: "Studio B",
    price: "$40",
    capacity: "18 participants"
  },
  {
    id: "piano-competition",
    category: "competitions",
    title: "Annual Piano Competition",
    description: "Showcase your talent in our prestigious annual piano competition with cash prizes.",
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    date: "September 15, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "Main Concert Hall",
    price: "$25 Entry Fee",
    capacity: "30 competitors"
  },
  {
    id: "strings-competition",
    category: "competitions",
    title: "String Instruments Competition",
    description: "Compete for top honors in our annual string instruments competition for all ages.",
    image: "https://images.unsplash.com/photo-1566913485242-694e995731b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    date: "October 10, 2026",
    time: "10:00 AM - 6:00 PM",
    location: "Recital Hall",
    price: "$20 Entry Fee",
    capacity: "25 competitors"
  },
  {
    id: "ensemble-competition",
    category: "competitions",
    title: "Chamber Ensemble Competition",
    description: "Chamber groups compete for performance opportunities and prizes.",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    date: "November 5, 2026",
    time: "2:00 PM - 7:00 PM",
    location: "Grand Theater",
    price: "$30 Entry Fee per Group",
    capacity: "12 ensembles"
  }
];

const categories = [
  { id: "all", name: "All Events", count: allEvents.length },
  { id: "concerts", name: "Concerts", count: allEvents.filter(e => e.category === "concerts").length },
  { id: "workshops", name: "Workshops", count: allEvents.filter(e => e.category === "workshops").length },
  { id: "competitions", name: "Competitions", count: allEvents.filter(e => e.category === "competitions").length }
];

export default function Events() {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState<string>("date");

  const filteredEvents = allEvents.filter(event => {
    const categoryMatch = !category || category === "all" || event.category === category;
    return categoryMatch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  const activeCategory = category || "all";
  const categoryData = categories.find(c => c.id === activeCategory);

  return (
    <div className="bg-background">
      {/* Hero */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
        imageAlt="Events"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block mb-8 px-6 py-2.5 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-sm tracking-wide">
              Join Us
            </div>
            <h1 className="text-6xl md:text-8xl mb-6 tracking-tight" style={{ fontStyle: 'italic' }}>
              {categoryData ? categoryData.name : "Events"}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed" style={{ fontStyle: 'normal' }}>
              Concerts, workshops, and competitions for music lovers
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
                  to={cat.id === "all" ? "/events" : `/events/${cat.id}`}
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

            {/* Sort */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-card text-foreground border border-border focus:outline-none focus:border-gold transition-colors"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/events/${event.category}/${event.id}`}>
                    <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-gold transition-all duration-300 hover:shadow-2xl h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute top-4 right-4 bg-gold text-primary px-3 py-1.5 rounded-lg text-sm font-semibold">
                          {event.date.split(',')[0]}
                        </div>
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-semibold uppercase">
                          {event.category}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-gold transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gold" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gold" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gold" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold" />
                            <span>{event.capacity}</span>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <div className="flex justify-between items-center pt-4 border-t border-border">
                            <span className="text-gold font-semibold">{event.price}</span>
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
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter to never miss an event
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all"
            >
              Subscribe Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
