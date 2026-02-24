import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { BookOpen, Calendar, ArrowRight, Download } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { APP_LOGO } from "@/const";
import BlogLeadCaptureDialog from "@/components/BlogLeadCaptureDialog";
import { blogPosts } from "@/data/blogPosts";

export default function Blog() {
  const [, navigate] = useLocation();
  const categories = ["All", "CEO Corner", "Cyber Security", "Smart Cities", "Healthcare"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<{ title: string; pdfUrl: string } | null>(null);

  const handleDownloadClick = (title: string, pdfUrl: string) => {
    setSelectedBlog({ title, pdfUrl });
    setLeadDialogOpen(true);
  };

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen">
      
      {/* Hero Section with Logo */}
      <section className="gradient-hero py-8 relative">
        <div className="container">
          {/* Logo in upper-left */}
          <div className="mb-8">
            <img 
              src={APP_LOGO} 
              alt="Visium Technologies" 
              className="h-12 md:h-14 lg:h-16 w-auto"
            />
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Resources & <span className="text-primary">Insights</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              TruContext shows how everything you touch is connected
            </p>
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-6 border-2 border-primary/20">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                "You Can't Secure What You Can't See"
              </p>
              <p className="text-sm text-gray-600 italic">
                Explore our latest insights on agentic AI, graph analytics, and next-generation cybersecurity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="container">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card 
                key={post.id}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4 bg-white text-primary border-primary">
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadClick(post.title, post.pdfUrl);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blog/${post.id}`);
                      }}
                      title="Read full article"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lead Capture Dialog */}
      {selectedBlog && (
        <BlogLeadCaptureDialog
          open={leadDialogOpen}
          onOpenChange={setLeadDialogOpen}
          blogTitle={selectedBlog.title}
          pdfUrl={selectedBlog.pdfUrl}
        />
      )}

      <Footer />
    </div>
  );
}
