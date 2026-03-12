import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Eye } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

const PDF_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/VisiumTechCapabilitiesDeck03-2026_e7a4924c.pdf';

export default function CapabilitiesDeck() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit lead data to backend
    try {
      const response = await fetch('/api/trpc/leads.capabilitiesDeckLead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormSubmitted(true);
        // Reset form after 2 seconds
        setTimeout(() => {
          setShowLeadForm(false);
          setFormSubmitted(false);
          setFormData({ name: '', email: '', company: '' });
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
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
                  onClick={() => setShowLeadForm(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Deck
                </Button>
                <a href={PDF_URL} download>
                  <Button
                    size="lg"
                    variant="outline"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* PDF Preview Section */}
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

              {/* PDF Embed */}
              <div className="w-full bg-background">
                <iframe
                  src={`${PDF_URL}#toolbar=1&navpanes=0`}
                  width="100%"
                  height="800"
                  style={{ border: 'none' }}
                  title="Visium Technologies Capabilities Deck"
                />
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
                    onClick={() => setShowLeadForm(true)}
                  >
                    Request Access
                  </Button>
                  <a href={PDF_URL} download>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </a>
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
                Download the Capabilities Deck to learn how TruContext's agentic AI platform can help your organization move from reactive alert management to proactive threat prevention.
              </p>
              <Button
                size="lg"
                onClick={() => setShowLeadForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                Get the Deck
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Lead Capture Dialog */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {formSubmitted ? 'Thank You!' : 'Access the Capabilities Deck'}
            </DialogTitle>
            <DialogDescription>
              {formSubmitted 
                ? 'Your information has been received. The PDF will download shortly.'
                : 'Please provide your information to access the full capabilities deck.'}
            </DialogDescription>
          </DialogHeader>

          {formSubmitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <p className="text-muted-foreground">
                Redirecting to PDF download...
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
                  required
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
                  required
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
                  className="mt-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLeadForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Get Access
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                We respect your privacy. Your information will only be used to send you the deck.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
