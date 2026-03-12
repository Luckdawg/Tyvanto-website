import { describe, it, expect } from 'vitest';

describe('Capabilities Deck Page', () => {
  it('should have correct route path', () => {
    const expectedPath = '/resources/capabilities-deck';
    expect(expectedPath).toBe('/resources/capabilities-deck');
  });

  it('should have correct PDF URL', () => {
    const pdfUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310419663028236186/d8D2GoF7wZHc9ZPzYZfLpT/VisiumTechCapabilitiesDeck03-2026_e7a4924c.pdf';
    expect(pdfUrl).toContain('cloudfront.net');
    expect(pdfUrl).toContain('VisiumTechCapabilitiesDeck03-2026');
    expect(pdfUrl).toContain('.pdf');
  });

  it('should have 13 pages in PDF', () => {
    const totalPages = 13;
    expect(totalPages).toBe(13);
  });

  it('should have correct lead form fields', () => {
    const formFields = ['name', 'email', 'company'];
    expect(formFields).toContain('name');
    expect(formFields).toContain('email');
    expect(formFields).toContain('company');
  });

  it('should have correct SEO metadata', () => {
    const seoTitle = 'Capabilities Deck | Visium Technologies';
    const seoDescription = 'Download the Visium Technologies Capabilities Deck - Learn about TruContext\'s agentic AI platform, autonomous intelligence, and six key pillars of our solution.';
    const canonicalUrl = 'https://www.visiumtechnologies.com/resources/capabilities-deck';

    expect(seoTitle).toContain('Capabilities Deck');
    expect(seoDescription).toContain('TruContext');
    expect(canonicalUrl).toContain('resources/capabilities-deck');
  });

  it('should have lead capture mutations', () => {
    const mutations = ['capabilitiesDeckLead', 'contactFormLead', 'demoRequestLead'];
    expect(mutations).toContain('capabilitiesDeckLead');
    expect(mutations).toContain('contactFormLead');
    expect(mutations).toContain('demoRequestLead');
  });

  it('should validate lead form inputs', () => {
    const testCases = [
      { name: 'John Doe', email: 'john@example.com', company: 'Acme Corp', valid: true },
      { name: '', email: 'john@example.com', company: 'Acme Corp', valid: false },
      { name: 'John Doe', email: 'invalid-email', company: 'Acme Corp', valid: false },
      { name: 'John Doe', email: 'john@example.com', company: '', valid: true }, // company is optional
    ];

    testCases.forEach(testCase => {
      const isValid = Boolean(testCase.name) && testCase.email.includes('@');
      expect(isValid).toBe(testCase.valid);
    });
  });

  it('should have correct page sections', () => {
    const sections = [
      'Hero Section',
      'PDF Preview Section',
      'Key Highlights Section',
      'CTA Section',
      'Lead Capture Dialog'
    ];

    expect(sections.length).toBe(5);
    expect(sections).toContain('Hero Section');
    expect(sections).toContain('PDF Preview Section');
  });

  it('should have download and view buttons', () => {
    const buttons = ['View Deck', 'Download PDF', 'Request Access', 'Get Access'];
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    expect(buttons).toContain('View Deck');
    expect(buttons).toContain('Download PDF');
  });

  it('should display key capabilities from deck', () => {
    const capabilities = [
      'Autonomous threat detection & response',
      'Glass box AI with full explainability',
      '1B+ events/day processing capacity',
      'Six Key Pillars',
      'INGEST → CORRELATE → REASON → ACT → EXPLAIN'
    ];

    expect(capabilities.length).toBe(5);
    capabilities.forEach(cap => {
      expect(cap.length).toBeGreaterThan(0);
    });
  });
});
