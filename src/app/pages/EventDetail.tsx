import { useParams, Link } from "react-router";
import { Calendar, MapPin, Clock, Users, DollarSign, CheckCircle, ArrowRight, Share2, Music } from "lucide-react";
import { motion } from "motion/react";

const eventData: Record<string, any> = {
  "spring-recital": {
    title: "Spring Student Recital",
    category: "Concerts",
    description: "Join us for our annual Spring Student Recital featuring performances from students of all levels. This inspiring event showcases the remarkable progress and talent of our students as they perform classical, jazz, and contemporary pieces.",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    date: "15/06/2026",
    time: "7:00 PM",
    endTime: "9:00 PM",
    location: "Main Concert Hall",
    address: "123 Music Avenue, New York, NY 10001",
    price: "Free Admission",
    capacity: "300 seats",
    details: [
      "An evening celebrating student achievement across all instruments",
      "Performances ranging from beginner to advanced levels",
      "Reception following the performance",
      "Open to family, friends, and the public"
    ],
    program: [
      { time: "7:00 PM", item: "Opening Remarks" },
      { time: "7:15 PM", item: "Piano Performances" },
      { time: "7:45 PM", item: "String Ensemble" },
      { time: "8:15 PM", item: "Vocal Performances" },
      { time: "8:45 PM", item: "Closing Performance" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
    ]
  },
  "jazz-workshop": {
    title: "Jazz Improvisation Workshop",
    category: "Workshops",
    description: "Learn the art of jazz improvisation from professional jazz musicians in this hands-on workshop. Perfect for intermediate to advanced students looking to enhance their improvisation skills.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    date: "22/06/2026",
    time: "2:00 PM",
    endTime: "5:00 PM",
    location: "Studio A",
    address: "123 Music Avenue, New York, NY 10001",
    price: "$35",
    capacity: "20 participants",
    details: [
      "Hands-on improvisation exercises",
      "Learn jazz scales, modes, and chord progressions",
      "Small group and individual practice time",
      "Q&A session with professional jazz musicians",
      "Materials and handouts included"
    ],
    program: [
      { time: "2:00 PM", item: "Introduction to Jazz Improvisation" },
      { time: "2:30 PM", item: "Scales and Modes Workshop" },
      { time: "3:15 PM", item: "Break" },
      { time: "3:30 PM", item: "Practical Improvisation Exercises" },
      { time: "4:30 PM", item: "Q&A and Jam Session" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
    ]
  },
  "guest-pianist": {
    title: "Guest Artist: Renowned Pianist",
    category: "Concerts",
    description: "Grammy-winning pianist Maria Santos performs works by Chopin, Liszt, and Rachmaninoff in an unforgettable evening of classical piano mastery.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    date: "05/08/2026",
    time: "7:30 PM",
    endTime: "9:30 PM",
    location: "Grand Theater",
    address: "456 Concert Drive, New York, NY 10002",
    price: "$20 - $35",
    capacity: "500 seats",
    details: [
      "Internationally acclaimed pianist Maria Santos",
      "Grammy Award winner and Julliard graduate",
      "Program featuring Romantic masterworks",
      "Pre-concert lecture at 6:30 PM",
      "Meet and greet following performance"
    ],
    program: [
      { time: "6:30 PM", item: "Pre-Concert Lecture" },
      { time: "7:30 PM", item: "Chopin: Nocturnes" },
      { time: "8:00 PM", item: "Liszt: Hungarian Rhapsody No. 2" },
      { time: "8:30 PM", item: "Intermission" },
      { time: "8:45 PM", item: "Rachmaninoff: Piano Concerto No. 2 (Highlights)" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1552422535-c45813c61732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
    ]
  }
};

// Helper to format date into dd/mm/yyyy
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

export default function EventDetail() {
  const { id } = useParams();
  const event = eventData[id || "spring-recital"];

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Link to="/events" className="text-gold hover:underline">
            View All Events
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
            src={event.image}
            alt={event.title}
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
              {event.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                <span>{event.time} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                <span>{event.location}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">About This Event</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {event.description}
              </p>
              <ul className="space-y-3">
                {event.details.map((detail: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Program */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Program Schedule</h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {event.program.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`p-6 flex items-center gap-4 ${
                      index !== event.program.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="w-24 flex-shrink-0">
                      <div className="text-gold font-semibold">{item.time}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <Music className="w-5 h-5 text-gold flex-shrink-0" />
                      <span className="text-foreground">{item.item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Event Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {event.gallery.map((img: string, index: number) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl p-6 border border-border sticky top-24"
            >
              <h3 className="text-xl font-semibold mb-6">Event Details</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Date</div>
                    <div className="font-medium">{formatDate(event.date)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Time</div>
                    <div className="font-medium">{event.time} - {event.endTime}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Location</div>
                    <div className="font-medium">{event.location}</div>
                    <div className="text-sm text-muted-foreground mt-1">{event.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Capacity</div>
                    <div className="font-medium">{event.capacity}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Price</div>
                    <div className="font-medium text-gold">{event.price}</div>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full bg-gold text-primary px-6 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center justify-center gap-2 mb-3"
              >
                Register Now
                <ArrowRight className="w-5 h-5" />
              </Link>

              <button className="w-full bg-white/5 text-foreground px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2 border border-border">
                <Share2 className="w-4 h-4" />
                Share Event
              </button>
            </motion.div>

            {/* Need Help */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gold/10 rounded-xl p-6 border border-gold/20"
            >
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about this event? Contact us for more information.
              </p>
              <Link
                to="/contact"
                className="text-gold font-medium text-sm inline-flex items-center gap-2 hover:gap-3 transition-all"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
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
            <h2 className="text-3xl font-bold mb-4">Discover More Events</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Explore our full calendar of concerts, workshops, and competitions
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all"
            >
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
