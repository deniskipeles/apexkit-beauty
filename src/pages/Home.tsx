import { Link } from 'react-router-dom';
import { Scissors, Sparkles, Star, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';

export default function Home() {
  const testimonials = [
    {
      name: "Seraphina Knowles",
      role: "Fashion Designer",
      rating: 5,
      comment: "Apex Beauty has completely transformed my hair styling routine. The precision cut tailored by Elena has received countless compliments, and the botanical scalp treatment is sheer heaven.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Victoria Sterling",
      role: "Art Curator",
      rating: 5,
      comment: "Marcus is an absolute wizard with balayage! The color transition is seamless and feels deeply organic. The high-end, relaxed penthouse atmosphere makes it a true luxury escape.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
    },
    {
      name: "Julian De Silva",
      role: "Creative Director",
      rating: 5,
      comment: "The silk press from Sienna is of unbeatable quality. My curls are fully protected, highly hydrated, and have incredible shine. The level of care and expertise here is unparalleled.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      <SEO 
        title="Luxury Salon & Hair Sculpting Lounge"
        description="Welcome to Apex Beauty, a luxury penthouse hair salon. Experience bespoke modern texturizing, precision organic balayage coloring, and restorative botanical hair scalp therapies."
        keywords="luxury hair salon, hair styling New York, balayage hair color, precision haircut, silk press, keratin treatment, beauty appointments, Elena Rostova, Marcus Vance"
        schemaType="LocalBusiness"
        schemaData={{
          review: testimonials.map(t => ({
            '@type': 'Review',
            'author': {
              '@type': 'Person',
              'name': t.name
            },
            'reviewRating': {
              '@type': 'Rating',
              'ratingValue': t.rating,
              'bestRating': '5'
            },
            'reviewBody': t.comment
          }))
        }}
      />

      {/* Hero Section */}
      <Hero />

      {/* Signature Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-500">
            Aesthetic Disciplines
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-charcoal">
            Our Signature Services
          </h2>
          <p className="text-charcoal/70 text-base leading-relaxed">
            We offer bespoke disciplines in modern texturizing, precision organic coloring, and restorative botanical hair therapies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Precision Hair Sculpting",
              desc: "From modern textured pixies to tailored geometric bobs, crafted using razor-detailed mapping techniques.",
              category: "Cuts",
              price: "From $75"
            },
            {
              title: "French Color Painting",
              desc: "Hand-painted organic balayages, deep root melts, and multi-dimensional highlights using bond repair.",
              category: "Color & Balayage",
              price: "From $195"
            },
            {
              title: "High-Hydration Presses",
              desc: "Nanotex hot steam infusions, ceramic silk presses, thermal defensive shields, and protective wraps.",
              category: "Styling & Updos",
              price: "From $110"
            },
            {
              title: "Botanical Scalp Spas",
              desc: "Holistic, sensory-rich scalp exfoliations, lymphatic head massages, and deep cellular botanical cures.",
              category: "Treatments & Care",
              price: "From $120"
            }
          ].map((cat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-gold-200/20 shadow-sm hover:shadow-md hover:border-gold-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="text-[10px] tracking-widest font-bold text-gold-600 bg-gold-100/50 px-3 py-1 rounded-full uppercase inline-block">
                  {cat.category}
                </span>
                <h3 className="font-display font-bold text-lg text-charcoal">{cat.title}</h3>
                <p className="text-xs text-charcoal/60 leading-relaxed">{cat.desc}</p>
              </div>
              <div className="pt-6 border-t border-gold-100/50 flex justify-between items-center mt-6">
                <span className="text-xs text-charcoal/50 font-medium">{cat.price}</span>
                <Link
                  to="/styles"
                  className="text-gold-500 hover:text-gold-600 font-bold text-xs tracking-wide flex items-center gap-1 group"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meet our Experts Teaser */}
      <section className="bg-charcoal text-white py-20 relative overflow-hidden">
        {/* Blur accent */}
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-gold-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-gold-400">
                The Master Craftsmen
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
                Crafted by Internationally <br />
                Trained Virtuosos
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                Our stylists have trained across London, Paris, and Milan. They treat hair as a three-dimensional living sculpture, mapping structures to emphasize your unique natural beauty and facial architecture.
              </p>
              <div className="flex gap-4 pt-4">
                <Link
                  to="/stylists"
                  className="bg-gold-400 text-charcoal hover:bg-gold-500 hover:text-white px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-widest transition-colors duration-300 inline-block shadow-md"
                >
                  Explore Stylist Portfolios
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "Elena R.", role: "Creative Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" },
                { name: "Marcus V.", role: "Colorist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300" },
                { name: "Sienna B.", role: "Curls Specialist", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300" }
              ].map((style, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img
                      src={style.img}
                      alt={style.name}
                      className="w-full h-full object-cover filter brightness-95"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-display font-bold text-sm text-white">{style.name}</h4>
                    <p className="text-[10px] text-gold-400">{style.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-500">
            Guest Testimonials
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-charcoal">
            Reflecting Luxury Care
          </h2>
          <p className="text-charcoal/70 text-base leading-relaxed">
            Read stories of transformation, vibrant color changes, and restorative treatments straight from our clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-gold-200/20 shadow-sm relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-charcoal/70 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-8 pt-4 border-t border-gold-100/50">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-gold-200"
                />
                <div>
                  <h4 className="font-display font-bold text-xs text-charcoal">{t.name}</h4>
                  <p className="text-[10px] text-charcoal/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-charcoal to-neutral-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl border border-gold-400/20">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 p-12 text-gold-500/10 select-none pointer-events-none">
            <Scissors className="w-64 h-64 rotate-45" />
          </div>

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white leading-tight">
              Ready to Manifest Your Perfect Transformation?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Book a bespoke hair sculpting session or balayage color melted design with our award-winning master stylists. Secure your luxury penthouse salon slot today.
            </p>
            <div className="pt-2">
              <Link
                to="/book"
                className="bg-gold-400 text-charcoal hover:bg-white hover:scale-105 font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-all duration-300 shadow-lg inline-block"
              >
                Book Your Experience Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
