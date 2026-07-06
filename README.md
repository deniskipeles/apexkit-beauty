# Apex Beauty | Luxury Hair Salon & Bespoke Styling Lounge

An elegant, fully-featured, and modern web application for a premier luxury penthouse hair salon. Designed with an eye-safe charcoal-and-cream aesthetic, Apex Beauty allows guests to browse signature styling services, view award-winning master stylist portfolios, and book personalized appointments with real-time slot selection and secure cloud/local hybrid state synchronization.

---

## 🌟 Core Features

1. **Bespoke Styling Menu (`/styles`)**
   - Elegant, interactive catalog highlighting premium treatments, hand-painted French balayage, precision cuts, and restorative botanical hair scalp therapies.
   - Live search filter to find desired treatments instantly.
   
2. **Elite Stylist Portfolios (`/stylists`)**
   - Detailed galleries, ratings, and specialties of our world-class, internationally trained hair craftsmen (Elena Rostova, Marcus Vance, Sienna Brooks).
   - High-contrast touch-friendly sliding carousels showcasing genuine professional results.

3. **Dynamic Real-Time Booking Engine (`/book`)**
   - Step-by-step luxury appointment scheduler covering Service Selection, Master Stylist pairing, calendar Date picking, and hourly Time Slot reservations.
   - Form-validation checks ensuring secure and clear communication of styling requests.

4. **Interactive Guest Dashboard (`/appointments`)**
   - Complete personal styling dossier. Allows members to sign in or register instantly.
   - Real-time list of upcoming sessions with a detailed cancellation facility and completed session indicators.

5. **Apex Elite Loyalty Program**
   - Seamlessly integrated loyalty ledger that awards guest points automatically for every completed session.
   - Features dynamic progress tracking towards premium reward milestones (such as free signature treatments) and membership tier progression.
   - Includes an interactive styling simulator allowing guests to test reward progression dynamically.

6. **Robust Local & Cloud Sync Layer**
   - Self-healing storage system that automatically uses secure client-side persistence as a resilient fallback in disconnected states, keeping the guest's booking portfolio always accessible and safe.

---

## 🚀 Advanced SEO & Structured Data Optimization

This application has been meticulously tuned for search engines to achieve maximum organic search visibility:

* **Dynamic Meta Management (`<SEO />` Component)**: A dedicated, reusable React side-effect manager that dynamically updates document titles, descriptions, and tag arrays across route transitions.
* **Semantic Content Architecture**: Structured with industry-standard nested headings (`<h1>`, `<h2>`, `<h3>`), high-contrast body typography, and standard literal buttons targeting explicit user intent.
* **Full Open Graph & Twitter Card Integration**: Ensures gorgeous visual card rendering, complete with Unsplash showcase imagery and custom descriptions, when shared on social networks like LinkedIn, Facebook, and Twitter/X.
* **Canonical URL Enforcement**: Dynamically appends `<link rel="canonical" href="..." />` to the head of each route, preventing duplicate index penalties.
* **Structured JSON-LD Schema Injection**:
  - **`LocalBusiness` (HairSalon)**: Injected directly on the homepage, embedding geographic coordinates, physical address, phone numbers, operation hours, luxury price tier identifiers, and verified testimonials.
  - **`ServiceList` (ItemList)**: Automatically populates structured catalog services and pricing for transparent Google Rich Results formatting.
  - **`ProfilePage`**: Enriches stylist bio pages to highlight professional credentials, job titles, specialized skills, and composite star ratings.

---

## 🛠️ Technology Stack

- **Framework**: React 18+ with Vite
- **Language**: TypeScript (Strict type checks & named imports)
- **Styling**: Tailwind CSS (Sophisticated custom color palettes, fluid grids)
- **Icons**: Lucide React
- **Animations**: Fluid, clean transitions using CSS variables and modern layout flow
- **Build Utilities**: Integrated dev linter (`npm run lint`), TypeScript compiler validation, and Production Bundle optimizations

---

## 💻 Getting Started

### Installation

Install all required NPM packages:
```bash
npm install
```

### Running in Development

Boot the application using Vite's development environment:
```bash
npm run dev
```

### Building for Production

Compile static assets with type checking and minify for distribution:
```bash
npm run build
```

The production assets will be built into the `/dist` directory, fully optimized with dynamic JSON-LD metadata and clean CSS layers.
