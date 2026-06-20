import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ParallaxHero from "../components/ParallaxHero";
import { branches, companies, getBranchesByCompany } from "../data/branches";

const faqs = [
  {
    question: "What age groups do you teach?",
    answer:
      "We teach students of all ages, from young children (age 5+) to adults. Our instructors specialize in age-appropriate teaching methods.",
  },
  {
    question: "Do I need to own an instrument to start lessons?",
    answer:
      "While having your own instrument is ideal for practice at home, we have instruments available for use during lessons. We can also help you select an appropriate instrument to purchase or rent.",
  },
  {
    question: "How long are the lessons?",
    answer:
      "We offer flexible lesson lengths of 30, 45, or 60 minutes. Your instructor will help you determine the best duration based on your age, skill level, and goals.",
  },
  {
    question: "Can I try a lesson before committing?",
    answer:
      "Absolutely! We offer a free trial lesson so you can meet your instructor, explore our facilities, and determine if Liszthoven Academy is the right fit for you.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "We require 24-hour notice for lesson cancellations. Cancellations made with proper notice can be rescheduled. Our full policy is provided upon enrollment.",
  },
  {
    question: "Do you offer group lessons?",
    answer:
      "Yes! We offer group lessons for certain instruments and music theory classes. Group lessons are a great way to learn while building community with fellow musicians.",
  },
];

export default function Contact() {
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instrument: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <ParallaxHero
        imageSrc="https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
        imageAlt="Contact Us"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block mb-8 px-6 py-2.5 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full text-gold text-sm tracking-wide">
              Get in Touch
            </div>
            <h1
              className="text-6xl md:text-8xl mb-6 tracking-tight"
              style={{ fontStyle: "italic" }}
            >
              Contact Us
            </h1>
            <p
              className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed"
              style={{ fontStyle: "normal" }}
            >
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </ParallaxHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:border-gold transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:border-gold transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:border-gold transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="instrument"
                      className="block text-sm font-medium mb-2"
                    >
                      Interested In
                    </label>
                    <select
                      id="instrument"
                      name="instrument"
                      value={formData.instrument}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="piano">Piano Lessons</option>
                      <option value="guitar">Guitar Lessons</option>
                      <option value="vocals">Vocal Training</option>
                      <option value="violin">Violin Lessons</option>
                      <option value="drums">Drum Lessons</option>
                      <option value="other">Other Instrument</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Tell us about your musical goals and any questions you have..."
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all inline-flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>

          {/* Branch Info Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl p-6 border border-border sticky top-24"
            >
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-gold" />
                <h3
                  className="text-xl font-semibold"
                  style={{ fontStyle: "italic" }}
                >
                  Our Locations
                </h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Select a branch to view contact details:
              </p>

              {/* Branch Selector */}
              <div className="space-y-2 mb-6">
                {companies.map((company) => {
                  const companyBranches = getBranchesByCompany(company.id);

                  return (
                    <div key={company.id} className="mb-4">
                      <div className="text-xs font-semibold text-gold mb-2 uppercase tracking-wide">
                        {company.name}
                      </div>
                      <div className="space-y-2">
                        {companyBranches.map((branch) => {
                          const isSelected = selectedBranch.id === branch.id;
                          return (
                            <button
                              key={branch.id}
                              onClick={() => setSelectedBranch(branch)}
                              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                isSelected
                                  ? "bg-gold text-primary font-medium"
                                  : "bg-secondary hover:bg-secondary/80 text-foreground"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{branch.name}</span>
                                {isSelected && <Check className="w-4 h-4" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Branch Info */}
              <div className="pt-6 border-t border-border space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">Address</div>
                    <p className="text-sm text-muted-foreground">
                      {selectedBranch.address}
                      <br />
                      {selectedBranch.city}, {selectedBranch.state}{" "}
                      {selectedBranch.zipCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">Phone</div>
                    <a
                      href={`tel:${selectedBranch.phone.replace(/[^0-9]/g, "")}`}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      {selectedBranch.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">Email</div>
                    <a
                      href={`mailto:${selectedBranch.email}`}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      {selectedBranch.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">Hours</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Weekdays: {selectedBranch.operatingHours.weekdays}</p>
                      <p>Weekends: {selectedBranch.operatingHours.weekends}</p>
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="pt-4 border-t border-border">
                  <div className="font-medium mb-3">Facilities</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedBranch.facilities.map((facility, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gold/10 text-gold text-xs rounded"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Branch Gallery & Map */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-4xl mb-2 text-center"
              style={{ fontStyle: "italic" }}
            >
              {selectedBranch.name}
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              {selectedBranch.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="relative h-80 rounded-xl overflow-hidden">
                <img
                  src={selectedBranch.image}
                  alt={selectedBranch.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-card rounded-xl border border-border h-80 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-12 h-12 text-gold mx-auto mb-4" />
                  <p className="font-medium mb-2">{selectedBranch.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBranch.address}
                    <br />
                    {selectedBranch.city}, {selectedBranch.state}{" "}
                    {selectedBranch.zipCode}
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Interactive map integration
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium">
                FAQ
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our programs
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter for updates, tips, and exclusive
              offers
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
