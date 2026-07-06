import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Clock, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { beautyService } from '../lib/client';
import { Hairstyle } from '../data/mockData';
import SEO from '../components/SEO';

export default function StylesCatalog() {
  const navigate = useNavigate();
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function loadHairstyles() {
      try {
        const data = await beautyService.getHairstyles();
        setHairstyles(data);
      } catch (e) {
        console.error('Failed to load hairstyles', e);
      } finally {
        setLoading(false);
      }
    }
    loadHairstyles();
  }, []);

  // Unique categories
  const categories = ['All', 'Cuts', 'Color & Balayage', 'Styling & Updos', 'Treatments & Care'];

  // Filter logic
  const filteredStyles = hairstyles.filter((style) => {
    const matchesCategory = activeCategory === 'All' || style.category === activeCategory;
    const matchesSearch = 
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleBookStyle = (styleId: string) => {
    // Navigate to /book and pre-select this service
    navigate('/book', { state: { styleId, startStep: 2 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO 
        title="Luxury Hairstyles Menu & Pricing"
        description="Browse our luxury hair styling menu. View transparent pricing for precision cuts, French balayage hand-coloring, silk presses, and keratin treatments."
        keywords="haircut pricing, balayage cost, silk press near me, keratin treatment New York, luxury hair salon menu, hair care services"
        schemaType="ServiceList"
        schemaData={{
          itemListElement: hairstyles.map((style, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'item': {
              '@type': 'Service',
              'name': style.name,
              'description': style.description,
              'offers': {
                '@type': 'Offer',
                'price': style.price,
                'priceCurrency': 'USD'
              }
            }
          }))
        }}
      />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-gold-500">
          Portfolio &amp; Pricing Directory
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-charcoal leading-tight">
          Hair Styles &amp; Services
        </h1>
        <p className="text-charcoal/70 text-base leading-relaxed">
          Explore our pricing menu of custom tailored haircuts, advanced luxury hair color painting, and organic botanical infusions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-5 rounded-2xl border border-gold-200/20 shadow-sm">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide shrink-0 transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-charcoal text-gold-300 shadow-md'
                  : 'bg-cream/50 text-charcoal/70 hover:bg-gold-100 hover:text-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-charcoal/40 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hairstyles or key features..."
            className="w-full bg-cream/50 text-charcoal pl-10 pr-4 py-2.5 rounded-xl text-xs border border-gold-200/20 focus:outline-none focus:border-gold-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-semibold text-charcoal/60">Retrieving portfolio hair designs...</p>
        </div>
      ) : filteredStyles.length === 0 ? (
        <div className="text-center bg-white rounded-2xl p-12 border border-gold-200/10">
          <Sparkles className="w-12 h-12 text-gold-300 mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-charcoal">No Hair Styles Found</h3>
          <p className="text-sm text-charcoal/60 mt-1 max-w-md mx-auto">
            We couldn't find any hairstyles matching your filters or search keywords. Try adjusting your selections or query.
          </p>
        </div>
      ) : (
        /* Styles Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStyles.map((style) => (
            <div
              key={style.id}
              className="bg-white rounded-3xl overflow-hidden border border-gold-200/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Photo Area */}
              <div className="relative aspect-[3/2] overflow-hidden bg-cream">
                <img
                  src={style.image}
                  alt={style.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] tracking-widest font-bold text-gold-800 bg-white/90 backdrop-blur px-3 py-1 rounded-full uppercase shadow-sm">
                    {style.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-charcoal text-gold-300 px-4 py-1.5 rounded-full shadow-lg font-display font-extrabold text-base">
                  ${style.price}
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 text-xs text-charcoal/50 font-medium">
                    <Clock className="w-3.5 h-3.5 text-gold-500" />
                    <span>Duration: {style.duration}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-charcoal leading-snug group-hover:text-gold-600 transition-colors">
                    {style.name}
                  </h3>

                  <p className="text-xs text-charcoal/65 leading-relaxed">
                    {style.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-1.5 pt-2">
                    {style.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-charcoal/80 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Booking Call to Action */}
                <div className="pt-6 border-t border-gold-100/50 mt-6 flex gap-3">
                  <button
                    onClick={() => handleBookStyle(style.id)}
                    className="w-full bg-cream text-charcoal border border-charcoal/10 hover:bg-charcoal hover:text-gold-300 py-3 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
