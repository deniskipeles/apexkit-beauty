import { Scissors, Mail, Phone, MapPin, Instagram, Facebook, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-16 pb-12 border-t-2 border-gold-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gold-400 text-charcoal p-2 rounded-full">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-white">
                APEX BEAUTY
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the pinnacle of hair care, precision sculpting, and customized botanical treatments designed for modern sophistication.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 bg-white/5 hover:bg-gold-400 hover:text-charcoal rounded-full text-gray-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-gold-400 hover:text-charcoal rounded-full text-gray-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm tracking-widest uppercase text-gold-300">
              Salon Services
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/styles" className="hover:text-gold-400 transition-colors">
                  Precision Women's &amp; Men's Cuts
                </Link>
              </li>
              <li>
                <Link to="/styles" className="hover:text-gold-400 transition-colors">
                  Hand-painted French Balayage
                </Link>
              </li>
              <li>
                <Link to="/styles" className="hover:text-gold-400 transition-colors">
                  Hydro-Steam Silk Presses
                </Link>
              </li>
              <li>
                <Link to="/styles" className="hover:text-gold-400 transition-colors">
                  Botanical Scalp Rejuvenation
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm tracking-widest uppercase text-gold-300">
              Hours of Operation
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white block">Monday – Friday</span>
                  <span>9:00 AM – 8:00 PM</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white block">Saturday</span>
                  <span>9:00 AM – 6:00 PM</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white block">Sunday</span>
                  <span>Closed</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact & Map */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-sm tracking-widest uppercase text-gold-300">
              Contact &amp; Location
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>100 Apex Plaza, Penthouse Level, Beverly Hills, CA 90210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+1 (310) 555-0185</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>concierge@apexbeauty.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/10 my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Apex Beauty Salon &amp; Spa. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
