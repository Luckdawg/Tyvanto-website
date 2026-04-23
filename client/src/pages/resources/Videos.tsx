import { Play } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

export default function Videos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEOHead
        title="Videos & Webinars | Tyvanto"
        description="Watch product demonstrations, industry solutions, webinars, and interviews showcasing the power of the Arqen™ platform by Tyvanto."
        keywords="Arqen videos, Tyvanto webinars, cybersecurity platform demo, AI threat detection video"
        canonicalUrl="https://www.tyvanto.com/resources/videos"
      />

      {/* Hero Section */}
      <section
        className="text-white py-16"
        style={{ background: 'linear-gradient(135deg, #0D1B3E 0%, #1B3A8C 60%, #00A3FF 100%)' }}
      >
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Videos &amp; Webinars</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Product demonstrations, industry solutions, webinars, and interviews showcasing the power of the Arqen™ platform.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-24">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
              style={{ background: 'linear-gradient(135deg, #0D1B3E, #00A3FF)' }}
            >
              <Play className="h-12 w-12 text-white ml-1" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Video Library Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We are currently curating our video library of product demonstrations, webinars, and industry solution showcases. Check back soon for the full collection.
            </p>
            <div
              className="inline-block px-6 py-3 rounded-full text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(90deg, #0D1B3E, #1B3A8C)' }}
            >
              Content arriving shortly
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
