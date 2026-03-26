import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";

export default function BlogPromotionBanner() {
  return (
    <section className="relative py-8 md:py-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-primary/20">
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236366f1\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Icon and text */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">
                Latest Blog Post
              </p>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                The Risks of Autonomous AI Agents
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Explore AI governance, control layers, and security best practices
              </p>
            </div>
          </div>

          {/* Right side - CTA Button */}
          <div className="flex-shrink-0">
            <Link href="/blog/age-of-agentic-ai-arrived">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
              >
                Read Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
