import { Newspaper, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import FollowUs from "@/components/FollowUs";

export default function News() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="News & Press | Tyvanto"
        description="Stay tuned for the latest news, press releases, and announcements from Tyvanto."
        canonicalUrl="https://tyvanto.com/company/news"
      />

      {/* Hero Section */}
      <section className="gradient-hero py-8">
        <div className="container">
          {/* Tyvanto Logo - Upper Left */}
          <div className="mb-6">
            <img
              src="/tyvanto_logo.png"
              alt="Tyvanto"
              className="h-16 sm:h-20 md:h-24 object-contain"
            />
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <Newspaper className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              News &amp; <span className="text-primary">Press</span>
            </h1>
            <p className="text-xl text-gray-600">
              Latest announcements, partnerships, and developments from Tyvanto
            </p>
          </div>
        </div>
      </section>

      {/* Placeholder Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container max-w-3xl">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
                <Bell className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                News Coming Soon
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                We are preparing our news and press release section. Check back soon for the latest updates, announcements, and developments from Tyvanto.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Follow Us */}
      <FollowUs />
    </div>
  );
}
