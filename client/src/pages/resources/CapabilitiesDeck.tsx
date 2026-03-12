import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { trpc } from '@/lib/trpc';

const PDF_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/VisiumTechCapabilitiesDeck03-2026_e7a4924c.pdf';

// PDF pages converted to images
const DECK_PAGES = [
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-01_39f9677d.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-02_b187113f.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-03_2d5e161e.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-04_225b70dc.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-05_7adc3862.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-06_5b1f932c.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-07_e18cf4fb.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-08_2478131e.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-09_961eeca3.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-10_982a0f77.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-11_d153d165.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-12_fb4ea81b.png',
  'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/deck_page-13_138ac023.png',
];

export default function CapabilitiesDeck() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use tRPC mutation for lead capture
  const submitLeadMutation = trpc.leads.capabilitiesDeckLead.useMutation({
    onSuccess: () => {
      setFormError('');
      setTimeout(() => {
        // Trigger download after successful submission
        const link = document.createElement('a');
        link.href = PDF_URL;
        link.download = 'VisiumTechCapabilitiesDeck03-2026.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setShowDownloadForm(false);
        setFormData({ name: '', email: '', company: '' });
        setIsSubmitting(false);
      }, 1500);
    },
    onError: (error) => {
      setFormError('Failed to submit form. Please try again.');
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setFormError('Please enter your name');
      return;
    }
    
    if (!formData.email.trim()) {
      setFormError('Please enter your email');
      return;
    }

    if (!formData.email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    // Submit lead data using tRPC
    submitLeadMutation.mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim(),
    });
  };

  const handleDirectDownload = () => {
    const link = document.createElement('a');
    link.href = PDF_URL;
    link.download = 'VisiumTechCapabilitiesDeck03-2026.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextPage = () => {
    if (currentPage < DECK_PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <SEOHead
        title="Capabilities Deck | Visium Technologies"
        description="Download the Visium Technologies Capabilities Deck - Learn about TruContext's agentic AI platform, autonomous intelligence, and six key pillars of our solution."
        canonicalUrl="https://www.visiumtechnologies.com/resources/capabilities-deck"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-4">
          <div className="container max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Capabilities Deck
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover how TruContext's agentic AI platform transforms data chaos into decision confidence
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleDirectDownload}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowDownloadForm(true)}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download & Get Updates
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* PDF Viewer Section */}
        <section className="py-12 px-4">
          <div className="container max-w-5xl">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-card-foreground">
                  Visium Technologies - Agentic AI Platform
                </h2>
                <p className="text-muted-foreground mt-2">
                  From Data Chaos to Decision Confidence
                </p>
              </div>

              {/* PDF Pages Display */}
              <div className="w-full bg-background p-6">
                <div className="flex justify-center mb-6">
                  <img 
                    src={DECK_PAGES[currentPage]} 
                    alt={`Capabilities Deck Page ${currentPage + 1}`}
                    className="max-w-full h-auto rounded-lg shadow-md border border-border"
                  />
                </div>

                {/* Page Navigation */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="text-center text-muted-foreground font-medium">
                    Page {currentPage + 1} of {DECK_PAGES.length}
                  </div>

                  <Button
                    variant="outline"
                    onClick={nextPage}
                    disabled={currentPage === DECK_PAGES.length - 1}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Page Thumbnails */}
                <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
                  {DECK_PAGES.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`flex-shrink-0 rounded border-2 transition-all ${
                        currentPage === index 
                          ? 'border-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img 
                        src={page} 
                        alt={`Page ${index + 1}`}
                        className="w-16 h-20 object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer with Actions */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    13-page comprehensive overview of TruContext capabilities
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDirectDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    onClick={() => setShowDownloadForm(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Get Updates
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Highlights Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container max-w-5xl">
            <h2 className="text-3xl font-bold mb-12 text-center">
              What's Inside the Deck
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  The Intelligence Gap Problem
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-bold">•</span>
                    <span>75 minutes average time to breach detection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-bold">•</span>
                    <span>20-50 security tools per enterprise (silos)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 font-bold">•</span>
                    <span>$10.5T annual global cybercrime cost</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4 text-secondary">
                  TruContext Solution
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-secondary mr-3 font-bold">•</span>
                    <span>Autonomous threat detection & response</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3 font-bold">•</span>
                    <span>Glass box AI with full explainability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-secondary mr-3 font-bold">•</span>
                    <span>1B+ events/day processing capacity</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4 text-primary">
                  Six Key Pillars
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Agentic AI Engine</li>
                  <li>✓ Graph-Based Analytics</li>
                  <li>✓ Kafka Streaming</li>
                  <li>✓ Explainable AI</li>
                  <li>✓ Multi-Domain Fusion</li>
                  <li>✓ MITRE ATT&CK Built-In</li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-bold mb-4 text-secondary">
                  Autonomous Intelligence Workflow
                </h3>
                <div className="flex items-center justify-between text-sm font-mono text-muted-foreground">
                  <span>INGEST</span>
                  <span>→</span>
                  <span>CORRELATE</span>
                  <span>→</span>
                  <span>REASON</span>
                  <span>→</span>
                  <span>ACT</span>
                  <span>→</span>
                  <span>EXPLAIN</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container max-w-3xl">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-12 text-center border border-primary/20">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Intelligence Operations?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Review the Capabilities Deck to learn how TruContext's agentic AI platform can help your organization move from reactive alert management to proactive threat prevention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleDirectDownload}
                  variant="outline"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </Button>
                <Button
                  size="lg"
                  onClick={() => setShowDownloadForm(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Download & Get Updates
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Download & Updates Dialog */}
      <Dialog open={showDownloadForm} onOpenChange={setShowDownloadForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {submitLeadMutation.isPending ? 'Processing...' : 'Download & Get Updates'}
            </DialogTitle>
            <DialogDescription>
              {submitLeadMutation.isPending 
                ? 'Please wait while we process your request...'
                : 'Provide your information to receive the PDF and stay updated on TruContext.'}
            </DialogDescription>
          </DialogHeader>

          {submitLeadMutation.isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Success!</p>
              <p className="text-muted-foreground">
                Your download is starting. Check your downloads folder.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your Company"
                  value={formData.company}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-2"
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDownloadForm(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Download & Subscribe'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                We respect your privacy. Your information will only be used to send you the deck and relevant updates.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
