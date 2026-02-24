import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  ArrowLeft, 
  Download, 
  Share2, 
  Facebook, 
  Linkedin, 
  Twitter,
  Mail,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { APP_LOGO } from "@/const";
import { blogPosts } from "@/data/blogPosts";
import BlogLeadCaptureDialog from "@/components/BlogLeadCaptureDialog";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/blog")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${id}`;
  const shareTitle = post.title;
  const shareText = post.excerpt;

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
        break;
    }
    if (url) window.open(url, "_blank", "width=600,height=400");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/blog")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>

          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-white text-primary border-primary">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container max-w-4xl">
          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-600">PDF Document</p>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-blue-50 border-l-4 border-primary p-6 rounded mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* CTA Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => setLeadDialogOpen(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Full PDF
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share This Article
            </Button>
          </div>

          {/* Social Sharing */}
          <Card className="mb-12 bg-gray-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Article</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("twitter")}
                  className="flex items-center justify-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="hidden sm:inline">Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("linkedin")}
                  className="flex items-center justify-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("facebook")}
                  className="flex items-center justify-center gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="hidden sm:inline">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("email")}
                  className="flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2"
                >
                  {copiedToClipboard ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card 
                    key={relatedPost.id}
                    className="group hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/blog/${relatedPost.id}`)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden flex items-center justify-center">
                      <div className="text-4xl">📄</div>
                    </div>
                    <CardContent className="p-4">
                      <Badge className="mb-2 text-xs">{relatedPost.category}</Badge>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{relatedPost.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lead Capture Dialog */}
      {leadDialogOpen && (
        <BlogLeadCaptureDialog
          open={leadDialogOpen}
          onOpenChange={setLeadDialogOpen}
          blogTitle={post.title}
          pdfUrl={post.pdfUrl}
        />
      )}

      <Footer />
    </div>
  );
}
