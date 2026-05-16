import { Link } from "react-router";
import { Home, Search, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <div className="text-9xl font-bold text-gold mb-4">404</div>
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-gold text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gold-light transition-all"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <Link
              to="/lessons"
              className="inline-flex items-center justify-center gap-2 bg-white/5 text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all border border-border"
            >
              <Search className="w-5 h-5" />
              Browse Lessons
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-6">Popular Pages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/about"
                className="p-4 bg-card rounded-lg border border-border hover:border-gold transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">About Us</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link
                to="/events"
                className="p-4 bg-card rounded-lg border border-border hover:border-gold transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Events</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link
                to="/store"
                className="p-4 bg-card rounded-lg border border-border hover:border-gold transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Music Store</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link
                to="/contact"
                className="p-4 bg-card rounded-lg border border-border hover:border-gold transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Contact Us</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
