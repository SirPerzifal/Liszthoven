import { Link, useLocation } from "react-router";
import { useState } from "react";
import { ChevronDown, Menu, X, Music, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";

const lessonsCategories = [
  {
    name: "Piano",
    subcategories: ["Classical Piano", "Jazz Piano", "Contemporary Piano"]
  },
  {
    name: "Guitar",
    subcategories: ["Acoustic Guitar", "Electric Guitar", "Bass Guitar"]
  },
  {
    name: "Vocals",
    subcategories: ["Classical Voice", "Pop & Rock", "Jazz Vocals"]
  },
  {
    name: "Strings",
    subcategories: ["Violin", "Cello", "Viola"]
  },
  {
    name: "Drums",
    subcategories: ["Drum Set", "Percussion", "World Drums"]
  }
];

const eventsCategories = [
  {
    name: "Concerts",
    subcategories: ["Student Recitals", "Faculty Concerts", "Guest Artists"]
  },
  {
    name: "Workshops",
    subcategories: ["Masterclasses", "Technique Workshops", "Music Theory"]
  },
  {
    name: "Competitions",
    subcategories: ["Solo Competitions", "Ensemble Competitions"]
  }
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const location = useLocation();
  const { totalItems, openCart } = useCart();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight">Harmony Academy</div>
              <div className="text-xs text-gold-light">Music School</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/about"
              className={`text-sm transition-colors hover:text-gold ${
                isActive('/about') ? 'text-gold' : ''
              }`}
            >
              About
            </Link>

            {/* Lessons Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredMenu('lessons')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <button className={`flex items-center gap-1 text-sm transition-colors hover:text-gold ${
                isActive('/lessons') ? 'text-gold' : ''
              }`}>
                Lessons
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {hoveredMenu === 'lessons' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full pt-2 w-[600px]"
                  >
                    <div className="bg-card text-card-foreground rounded-lg shadow-2xl border border-border p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {lessonsCategories.map((category) => (
                          <div key={category.name}>
                            <Link
                              to={`/lessons/${category.name.toLowerCase()}`}
                              className="font-medium text-sm mb-2 block hover:text-gold transition-colors"
                            >
                              {category.name}
                            </Link>
                            <ul className="space-y-1">
                              {category.subcategories.map((sub) => (
                                <li key={sub}>
                                  <Link
                                    to={`/lessons/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-sm text-muted-foreground hover:text-gold transition-colors block py-1"
                                  >
                                    {sub}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Events Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredMenu('events')}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <button className={`flex items-center gap-1 text-sm transition-colors hover:text-gold ${
                isActive('/events') ? 'text-gold' : ''
              }`}>
                Events
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {hoveredMenu === 'events' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full pt-2 w-[400px]"
                  >
                    <div className="bg-card text-card-foreground rounded-lg shadow-2xl border border-border p-6">
                      <div className="space-y-4">
                        {eventsCategories.map((category) => (
                          <div key={category.name}>
                            <Link
                              to={`/events/${category.name.toLowerCase()}`}
                              className="font-medium text-sm mb-2 block hover:text-gold transition-colors"
                            >
                              {category.name}
                            </Link>
                            <ul className="space-y-1">
                              {category.subcategories.map((sub) => (
                                <li key={sub}>
                                  <Link
                                    to={`/events/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-sm text-muted-foreground hover:text-gold transition-colors block py-1"
                                  >
                                    {sub}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/store"
              className={`text-sm transition-colors hover:text-gold ${
                isActive('/store') ? 'text-gold' : ''
              }`}
            >
              Store
            </Link>

            <Link
              to="/news"
              className={`text-sm transition-colors hover:text-gold ${
                isActive('/news') ? 'text-gold' : ''
              }`}
            >
              News
            </Link>

            <Link
              to="/contact"
              className={`text-sm transition-colors hover:text-gold ${
                isActive('/contact') ? 'text-gold' : ''
              }`}
            >
              Contact
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-primary-foreground/70 hover:text-gold transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-primary text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            <Link
              to="/login"
              className="bg-gold text-primary px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gold-light transition-all shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-primary"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/about"
                className="block text-sm py-2 hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/lessons"
                className="block text-sm py-2 hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Lessons
              </Link>
              <Link
                to="/events"
                className="block text-sm py-2 hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/store"
                className="block text-sm py-2 hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Store
              </Link>
              <Link
                to="/news"
                className="block text-sm py-2 hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                to="/contact"
                className="block text-sm py-2 hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/contact"
                className="block bg-gold text-primary px-6 py-2.5 rounded-lg text-sm font-medium text-center hover:bg-gold-light transition-colors mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
