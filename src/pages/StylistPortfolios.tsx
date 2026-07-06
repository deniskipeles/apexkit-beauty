import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Star, ThumbsUp, Calendar, Scissors, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { beautyService } from '../lib/client';
import { Stylist } from '../data/mockData';
import SEO from '../components/SEO';

export default function StylistPortfolios() {
  const navigate = useNavigate();
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);

  // Active portfolio image indices for each stylist id
  const [galleryIndices, setGalleryIndices] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadStylists() {
      try {
        const data = await beautyService.getStylists();
        setStylists(data);
        
        // Initialize active image index
        const indices: Record<string, number> = {};
        data.forEach(s => {
          indices[s.id] = 0;
        });
        setGalleryIndices(indices);
      } catch (e) {
        console.error('Failed to load stylists', e);
      } finally {
        setLoading(false);
      }
    }
    loadStylists();
  }, []);

  const handleNextPhoto = (stylistId: string, max: number) => {
    setGalleryIndices(prev => ({
      ...prev,
      [stylistId]: (prev[stylistId] + 1) % max
    }));
  };

  const handlePrevPhoto = (stylistId: string, max: number) => {
    setGalleryIndices(prev => ({
      ...prev,
      [stylistId]: (prev[stylistId] - 1 + max) % max
    }));
  };

  const handleBookWithStylist = (stylistId: string) => {
    // Redirect to wizard scheduler, pre-selecting this stylist
    navigate('/book', { state: { stylistId, startStep: 1 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SEO 
        title="Our Award-Winning Elite Stylists"
        description="Meet the internationally trained master hair craftsmen of Apex Beauty. Browse the portfolio files and specialties of Elena Rostova, Marcus Vance, and Sienna Brooks."
        keywords="master hair stylist New York, hair coloring artist, balayage designer, curls specialist, silk press architect, salon portfolio"
        schemaType="ProfilePage"
        schemaData={{
          mainEntity: stylists.map(s => ({
            '@type': 'Person',
            'name': s.name,
            'jobTitle': s.role,
            'description': s.bio,
            'image': s.avatar,
            'knowsAbout': s.specialties,
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': s.rating,
              'reviewCount': s.reviewCount,
              'bestRating': '5'
            }
          }))
        }}
      />

      {/* Header Summary */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-gold-500">
          The Salon Virtuosos
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-charcoal leading-tight">
          Our Master Stylists &amp; Portfolios
        </h1>
        <p className="text-charcoal/70 text-base leading-relaxed">
          Meet our world-class, Beverly Hills-trained creative directors and master colorists. Browse through actual styled client portfolio lookbooks.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-semibold text-charcoal/60">Loading stylist lookbooks &amp; portfolios...</p>
        </div>
      ) : (
        /* Stylist Display Columns */
        <div className="space-y-16">
          {stylists.map((stylist) => {
            const activePhotoIdx = galleryIndices[stylist.id] || 0;
            const currentPhoto = stylist.portfolio[activePhotoIdx];

            return (
              <div
                key={stylist.id}
                className="bg-white rounded-3xl overflow-hidden border border-gold-200/20 shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left Col: Stylist Biography Profile */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={stylist.avatar}
                      alt={stylist.name}
                      className="w-20 h-20 object-cover rounded-full border-2 border-gold-400 shadow-sm"
                    />
                    <div>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-charcoal">
                        {stylist.name}
                      </h2>
                      <p className="text-xs text-gold-600 font-bold uppercase tracking-wider">
                        {stylist.role}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-charcoal/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-charcoal/80">{stylist.rating}</span>
                        <span>({stylist.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal/70 leading-relaxed italic">
                    "{stylist.bio}"
                  </p>

                  {/* Experience & Specialties */}
                  <div className="space-y-3 pt-3 border-t border-gold-100/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-charcoal/50">Experience:</span>
                      <span className="font-bold text-charcoal">{stylist.experience} in High-End Salons</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-charcoal/50 block mb-2">
                        Core Specialties &amp; Masteries
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {stylist.specialties.map((spec, idx) => (
                          <span
                            key={idx}
                            className="bg-gold-100/55 text-gold-800 text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full border border-gold-200/20"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Book direct action */}
                  <div className="pt-4">
                    <button
                      onClick={() => handleBookWithStylist(stylist.id)}
                      className="w-full sm:w-auto bg-charcoal text-gold-300 hover:bg-gold-500 hover:text-charcoal py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book with {stylist.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>

                {/* Right Col: Interactive client portfolio slider lookbook */}
                <div className="lg:col-span-7">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-charcoal/70 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-gold-500" />
                        <span>Style Lookbook &amp; Portfolios</span>
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gold-600">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        <span>Interactive Showroom</span>
                      </div>
                    </div>

                    <div className="relative aspect-[16/10] bg-cream rounded-2xl overflow-hidden shadow-inner group/slider">
                      <img
                        src={currentPhoto}
                        alt="Portfolio style capture"
                        className="w-full h-full object-cover transition-all duration-300 filter brightness-95"
                      />

                      {/* Slider Navigation overlays */}
                      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                        <button
                          onClick={() => handlePrevPhoto(stylist.id, stylist.portfolio.length)}
                          className="bg-white/80 hover:bg-white text-charcoal p-2.5 rounded-full shadow-lg pointer-events-auto transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleNextPhoto(stylist.id, stylist.portfolio.length)}
                          className="bg-white/80 hover:bg-white text-charcoal p-2.5 rounded-full shadow-lg pointer-events-auto transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Photo counter dot indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-charcoal/70 backdrop-blur px-3 py-1 rounded-full flex gap-1.5 items-center">
                        {stylist.portfolio.map((_, dotIdx) => (
                          <div
                            key={dotIdx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              dotIdx === activePhotoIdx ? 'bg-gold-300 w-3' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-center text-charcoal/40 italic">
                      Client capture showing creative balayage gloss blend and custom structural mapping.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
