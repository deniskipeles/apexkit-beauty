export interface Hairstyle {
  id: string;
  name: string;
  category: 'Cuts' | 'Color & Balayage' | 'Styling & Updos' | 'Treatments & Care';
  price: number;
  duration: string;
  description: string;
  image: string;
  features: string[];
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  experience: string;
  rating: number;
  reviewCount: number;
  bio: string;
  avatar: string;
  portfolio: string[];
  specialties: string[];
}

export interface Appointment {
  id: string;
  serviceId: string;
  stylistId: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  priceAtBooking: number;
}

export const INITIAL_HAIRSTYLES: Hairstyle[] = [
  {
    id: 'hs-1',
    name: 'Precision Signature Cut & Blowout',
    category: 'Cuts',
    price: 85,
    duration: '60 mins',
    description: 'A bespoke haircut tailored to your face shape and hair texture. Includes a luxurious double shampoo, deep conditioning mask, head massage, and signature blowout.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600',
    features: ['Custom structural mapping', 'Deep conditioning treatment', 'Signature blowout & hot tools styling']
  },
  {
    id: 'hs-2',
    name: 'French Balayage & Glaze',
    category: 'Color & Balayage',
    price: 240,
    duration: '180 mins',
    description: 'Hand-painted premium balayage highlights for a seamless, sun-kissed transition. Includes customized root shadow or melt, glossing glaze, and nutrient sealer.',
    image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=600',
    features: ['Individually customized painting', 'Bond-building treatment (Olaplex)', 'All-over moisture glaze', 'Professional tone balancing']
  },
  {
    id: 'hs-3',
    name: 'Luxury Silk Press & Steam Hydro-Infusion',
    category: 'Styling & Updos',
    price: 110,
    duration: '90 mins',
    description: 'Perfect for natural textured hair. Features our hydrating micro-steam treatment to open hair cuticles, intense hydration therapy, silk press straightening, and heat-protective wrap.',
    image: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=600',
    features: ['Nanotex Steam infusion', 'Premium ceramic silk press', 'Thermal defensive shielding', 'Split ends treatment']
  },
  {
    id: 'hs-4',
    name: 'Keratin Smoothing Therapy',
    category: 'Treatments & Care',
    price: 280,
    duration: '150 mins',
    description: 'An advanced smoothing treatment designed to eliminate 95% of frizz, block humidity, and cut styling time in half. Results last up to 4-5 months.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    features: ['Frizz eradication technology', 'Humidity protection barrier', 'High shine sealant', 'After-care advice & consultation']
  },
  {
    id: 'hs-5',
    name: 'Modern Textured Pixie & Taper',
    category: 'Cuts',
    price: 75,
    duration: '50 mins',
    description: 'A chic, bold cut with modern texturizing and tapered edges. Features detailed razor techniques for effortless movement and low-maintenance daily styling.',
    image: 'https://images.unsplash.com/photo-1592647425550-9fa574176cfc?auto=format&fit=crop&q=80&w=600',
    features: ['Precision razor structuring', 'Personal styling product demo', 'Scalp detoxifying cleanse']
  },
  {
    id: 'hs-6',
    name: 'Multi-Dimensional Full Highlights',
    category: 'Color & Balayage',
    price: 195,
    duration: '150 mins',
    description: 'Classic foil highlighting across the entire head to add immense depth, brightness, and contrast. Styled with soft glamorous beach waves.',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600',
    features: ['Full crown foil coverage', 'pH balanced tone correction', 'Soft wave iron styling']
  },
  {
    id: 'hs-7',
    name: 'Hollywood Glam Waves & Updo',
    category: 'Styling & Updos',
    price: 130,
    duration: '75 mins',
    description: 'Stunning vintage waves or a meticulously designed high updo. Perfect for weddings, galas, red carpets, and special celebrations.',
    image: 'https://images.unsplash.com/photo-1481596589541-97b5108abaf4?auto=format&fit=crop&q=80&w=600',
    features: ['Structural pin styling', 'Long-lasting professional hold', 'Shine booster serum finish']
  },
  {
    id: 'hs-8',
    name: 'Japanese Botanical Scalp Spa & Blowout',
    category: 'Treatments & Care',
    price: 120,
    duration: '70 mins',
    description: 'A holistic scalp rejuvenation therapy featuring deep micro-bubble exfoliation, botanical nutrient scalp masks, relaxing lymphatic head massages, and a bouncy blowout.',
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600',
    features: ['Micro-bubble deep pore detox', '15-minute heated scalp massage', 'Follicle strengthening nutrients', 'Blow-dry with volume booster']
  }
];

export const INITIAL_STYLISTS: Stylist[] = [
  {
    id: 'st-1',
    name: 'Elena Rostova',
    role: 'Master Hair Sculptor & Creative Director',
    experience: '12 years',
    rating: 4.95,
    reviewCount: 342,
    bio: 'Elena trained in Paris and London, specializing in geometric cuts and avant-garde transformations. She believes hair is a living canvas and customizes every cut to highlight natural bone structure.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    portfolio: [
      'https://images.unsplash.com/photo-1605497746444-130750faff9f?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1592647425550-9fa574176cfc?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400'
    ],
    specialties: ['Precision Bob Cuts', 'French Shags', 'Avant-Garde Styling', 'Scalp Health Therapies']
  },
  {
    id: 'st-2',
    name: 'Marcus Vance',
    role: 'Senior Balayage Specialist & Color Artist',
    experience: '9 years',
    rating: 4.92,
    reviewCount: 289,
    bio: 'Marcus is renowned for his spectacular custom color-melt work and hand-painted balayages. He focuses on maintaining ultimate hair health using state-of-the-art bond rebuilders.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    portfolio: [
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1481596589541-97b5108abaf4?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400'
    ],
    specialties: ['Custom Balayage', 'Multi-Dimensional Highlights', 'Vivid Fashion Colors', 'Color Correction']
  },
  {
    id: 'st-3',
    name: 'Sienna Brooks',
    role: 'Textured Hair Architect & Smoothing Specialist',
    experience: '8 years',
    rating: 4.89,
    reviewCount: 194,
    bio: 'Sienna is a certified texture specialist. She is incredibly passionate about natural curls, hydro-infusions, silk presses, protective styling, and custom keratin smoothing treatments.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    portfolio: [
      'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400'
    ],
    specialties: ['Natural Curl Mapping', 'Hydro-Steam Pressing', 'Keratin Treatments', 'Coily Hair Cuts']
  }
];

export const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:15 AM',
  '12:30 PM',
  '01:45 PM',
  '03:00 PM',
  '04:15 PM',
  '05:30 PM',
  '06:45 PM'
];
