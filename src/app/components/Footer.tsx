import { Link } from "react-router";
import { Music, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">Harmony Academy</div>
                <div className="text-xs text-gold-light">Music School</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Inspiring musicians and nurturing talent since 1995. Join us on your musical journey.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/lessons" className="text-sm text-muted-foreground hover:text-gold transition-colors">Our Lessons</Link></li>
              <li><Link to="/events" className="text-sm text-muted-foreground hover:text-gold transition-colors">Events</Link></li>
              <li><Link to="/store" className="text-sm text-muted-foreground hover:text-gold transition-colors">Music Store</Link></li>
              <li><Link to="/news" className="text-sm text-muted-foreground hover:text-gold transition-colors">News & Articles</Link></li>
            </ul>
          </div>

          {/* Lessons */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">Popular Lessons</h3>
            <ul className="space-y-3">
              <li><Link to="/lessons/piano" className="text-sm text-muted-foreground hover:text-gold transition-colors">Piano Lessons</Link></li>
              <li><Link to="/lessons/guitar" className="text-sm text-muted-foreground hover:text-gold transition-colors">Guitar Lessons</Link></li>
              <li><Link to="/lessons/vocals" className="text-sm text-muted-foreground hover:text-gold transition-colors">Vocal Training</Link></li>
              <li><Link to="/lessons/drums" className="text-sm text-muted-foreground hover:text-gold transition-colors">Drum Lessons</Link></li>
              <li><Link to="/lessons/strings" className="text-sm text-muted-foreground hover:text-gold transition-colors">String Instruments</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-gold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Music Avenue<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold" />
                <a href="tel:+15551234567" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold" />
                <a href="mailto:info@harmonyacademy.com" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  info@harmonyacademy.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Business Hours</h4>
              <p className="text-sm text-muted-foreground">Mon - Fri: 9:00 AM - 8:00 PM</p>
              <p className="text-sm text-muted-foreground">Sat - Sun: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Harmony Academy Music School. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-gold transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
