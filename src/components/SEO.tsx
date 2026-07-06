import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  schemaType?: 'LocalBusiness' | 'ServiceList' | 'ProfilePage' | 'Website';
  schemaData?: Record<string, any>;
}

export default function SEO({
  title,
  description,
  keywords = 'luxury hair salon, hair styling, balayage color, precision haircut, silk press, keratin treatment, beauty appointments, elite stylists',
  image = 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1200',
  schemaType,
  schemaData
}: SEOProps) {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}${location.search}`;

  useEffect(() => {
    // 1. Update document title
    const fullTitle = `${title} | Apex Beauty - Luxury Hair Salon`;
    document.title = fullTitle;

    // Helper to find or create meta tags
    const setMetaTag = (attribute: string, attrValue: string, contentValue: string, isProperty = false) => {
      const selector = isProperty 
        ? `meta[property="${attrValue}"]` 
        : `meta[${attribute}="${attrValue}"]`;
      let element = document.head.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', attrValue);
        } else {
          element.setAttribute(attribute, attrValue);
        }
        document.head.appendChild(element);
      }
      element.content = contentValue;
    };

    // 2. Set description meta tag
    setMetaTag('name', 'description', description);

    // 3. Set keywords meta tag
    setMetaTag('name', 'keywords', keywords);

    // 4. Set OpenGraph tags
    setMetaTag('', 'og:title', fullTitle, true);
    setMetaTag('', 'og:description', description, true);
    setMetaTag('', 'og:image', image, true);
    setMetaTag('', 'og:url', currentUrl, true);
    setMetaTag('', 'og:type', 'website', true);
    setMetaTag('', 'og:site_name', 'Apex Beauty Salon & Spa', true);

    // 5. Set Twitter Card tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // 6. Set canonical link
    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = currentUrl;

    // 7. Inject Structured JSON-LD Schema
    const existingScript = document.getElementById('apex-seo-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (schemaType && schemaData) {
      const script = document.createElement('script');
      script.id = 'apex-seo-schema';
      script.type = 'application/ld+json';
      
      // Default website and local business starting block
      let baseSchema: Record<string, any> = {
        '@context': 'https://schema.org'
      };

      if (schemaType === 'LocalBusiness') {
        baseSchema = {
          ...baseSchema,
          '@type': 'HairSalon',
          '@id': `${window.location.origin}/#localbusiness`,
          'name': 'Apex Beauty Salon & Spa',
          'image': image,
          'description': 'Apex Beauty is an elite luxury hair styling salon offering signature bespoke precision hair sculpting, balayage painting, and luxurious organic therapies.',
          'url': window.location.origin,
          'telephone': '+1-800-555-APEX',
          'priceRange': '$$$',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': '742 Luxury Boulevard, Penthouse Level',
            'addressLocality': 'New York',
            'addressRegion': 'NY',
            'postalCode': '10019',
            'addressCountry': 'US'
          },
          'geo': {
            '@type': 'GeoCoordinates',
            'latitude': 40.7644,
            'longitude': -73.9745
          },
          'openingHoursSpecification': [
            {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              'opens': '09:00',
              'closes': '20:00'
            }
          ],
          ...schemaData
        };
      } else if (schemaType === 'ServiceList') {
        baseSchema = {
          ...baseSchema,
          '@type': 'ItemList',
          'name': 'Apex Beauty Luxury Hair Services Menu',
          'description': description,
          ...schemaData
        };
      } else if (schemaType === 'ProfilePage') {
        baseSchema = {
          ...baseSchema,
          '@type': 'ProfilePage',
          'name': title,
          'description': description,
          ...schemaData
        };
      } else {
        baseSchema = {
          ...baseSchema,
          '@type': 'WebSite',
          'name': 'Apex Beauty Salon & Spa',
          'url': window.location.origin,
          'description': description,
          ...schemaData
        };
      }

      script.text = JSON.stringify(baseSchema, null, 2);
      document.head.appendChild(script);
    }

  }, [title, description, keywords, image, schemaType, schemaData, currentUrl]);

  return null; // This component handles side-effects only and renders nothing to the DOM directly
}
