import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section id="hero-section" className="relative bg-cream overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-gold-200/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-bronze-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-200/40 border border-gold-300/40 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span className="text-xs uppercase tracking-widest font-semibold text-gold-800">
                Luxurious Beverly Hills Salon Experience
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold text-charcoal tracking-tight leading-[1.08]">
              Where Artistic Precision <br className="hidden sm:inline" />
              Meets <span className="text-gold-500 italic">Sophisticated Styling</span>
            </h1>

            <p className="text-charcoal/70 text-lg leading-relaxed max-w-xl">
              Elevate your signature look with our elite master artists. From avant-garde precision cuts to bespoke organic color melts, we design beautiful, customized transformations tailored purely to you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/book"
                className="bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal px-8 py-4 rounded-full font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Appointment</span>
              </Link>
              <Link
                to="/styles"
                className="border border-charcoal/20 hover:border-charcoal hover:bg-charcoal/5 px-8 py-4 rounded-full font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center text-charcoal"
              >
                <span>View Hair Styles &amp; Pricing</span>
              </Link>
            </div>

            {/* Micro Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gold-200/40 max-w-md">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gold-500" />
                <span className="text-xs text-charcoal/80 font-medium">100% Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span className="text-xs text-charcoal/80 font-medium">Premium Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span className="text-xs text-charcoal/80 font-medium">Master Stylists</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase (Staggered Grid) */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 border-2 border-gold-300 rounded-2xl transform translate-x-4 translate-y-4 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600"
                alt="Luxury Salon Experience"
                className="w-full h-full object-cover rounded-2xl shadow-xl relative z-10"
              />
              {/* Floating micro card */}
              <div className="absolute bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20 max-w-[200px] border border-gold-100">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {"★".repeat(5)}
                </div>
                <p className="text-[11px] italic text-charcoal/70 leading-relaxed">
                  "The balayage is incredibly natural. Marcus is a genius colorist!"
                </p>
                <p className="text-[10px] font-bold mt-2 uppercase tracking-wider text-gold-600">— Sophia R., Actress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
