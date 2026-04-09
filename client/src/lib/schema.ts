/**
 * Schema.org structured data utilities for SEO
 * Generates JSON-LD schema for Google Rich Results
 */

export interface SchemaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

/**
 * Organization schema - Main company information
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Visium Technologies",
  "url": "https://visiumtechnologies.com",
  "logo": "https://visiumtechnologies.com/visium_logo.svg",
  "description": "Explainable AI for Real-Time Business Analytics - TruContext platform for cybersecurity and enterprise intelligence",
  "sameAs": [
    "https://www.linkedin.com/company/visium-technologies",
    "https://twitter.com/visiumtech",
    "https://www.facebook.com/visiumtech"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Sales",
    "telephone": "+1-888-344-9850",
    "email": "sales@visiumtechnologies.com"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "TBD",
    "addressLocality": "Arlington",
    "addressRegion": "VA",
    "postalCode": "TBD",
    "addressCountry": "US"
  }
};

/**
 * SoftwareApplication schema - For TruContext platform
 */
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TruContext",
  "description": "Explainable AI-powered analytics platform for real-time threat detection, incident response, and business intelligence",
  "url": "https://visiumtechnologies.com/platform",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Cloud-based",
  "offers": {
    "@type": "Offer",
    "price": "Contact for pricing",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "50"
  },
  "image": "https://visiumtechnologies.com/trucontext-platform.png"
};

/**
 * Service schema - For solution offerings
 */
export const createServiceSchema = (name: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": name,
  "description": description,
  "url": url,
  "provider": {
    "@type": "Organization",
    "name": "Visium Technologies",
    "url": "https://visiumtechnologies.com"
  },
  "areaServed": "US",
  "serviceType": "Enterprise Software"
});

/**
 * BlogPosting schema - For blog articles
 */
export const createBlogPostingSchema = (props: SchemaProps) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": props.title,
  "description": props.description,
  "image": props.image,
  "datePublished": props.datePublished,
  "dateModified": props.dateModified,
  "author": {
    "@type": "Organization",
    "name": props.author || "Visium Technologies"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Visium Technologies",
    "logo": {
      "@type": "ImageObject",
      "url": "https://visiumtechnologies.com/visium_logo.svg"
    }
  }
});

/**
 * BreadcrumbList schema - For navigation
 */
export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

/**
 * FAQPage schema - For FAQ sections
 */
export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * LocalBusiness schema - For company location
 */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Visium Technologies",
  "image": "https://visiumtechnologies.com/visium_logo.svg",
  "description": "Enterprise AI and cybersecurity analytics company",
  "url": "https://visiumtechnologies.com",
  "telephone": "+1-888-344-9850",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "TBD",
    "addressLocality": "Arlington",
    "addressRegion": "VA",
    "postalCode": "TBD",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "38.8816",
    "longitude": "-77.1043"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "17:00"
  }
};
