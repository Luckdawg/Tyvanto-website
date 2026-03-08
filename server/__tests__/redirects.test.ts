import { describe, it, expect } from 'vitest';
import { redirectConfig } from '../middleware/redirects';

/**
 * Test to verify that URL redirects and gone content are properly configured
 * This ensures legacy URLs are handled correctly without breaking SEO
 */
describe('URL Redirects & Gone Content Configuration', () => {
  
  it('should have redirect mappings configured', () => {
    expect(redirectConfig.redirects).toBeDefined();
    expect(Object.keys(redirectConfig.redirects).length).toBeGreaterThan(0);
  });

  it('should have 301 redirects for legacy news URLs', () => {
    const redirects = redirectConfig.redirects;
    expect(redirects['/visium-news/2020/5/13/visium-technologies-obtains-exlusive-license-rights-to-its-cybersecurity-technology'])
      .toBe('/company/news');
  });

  it('should have 301 redirects for old technology solutions page', () => {
    const redirects = redirectConfig.redirects;
    expect(redirects['/technology-solutions/']).toBe('/platform');
  });

  it('should have 301 redirects for old contact page', () => {
    const redirects = redirectConfig.redirects;
    expect(redirects['/contact-us/']).toBe('/company/contact');
  });

  it('should have 301 redirects for legacy date-based URLs', () => {
    const redirects = redirectConfig.redirects;
    expect(redirects['/20230912']).toBe('/blog');
  });

  it('should have patterns for 410 Gone responses', () => {
    expect(redirectConfig.gonePatterns).toBeDefined();
    expect(redirectConfig.gonePatterns.length).toBeGreaterThan(0);
  });

  it('should have documentation for all redirects', () => {
    const docs = redirectConfig.documentation;
    expect(docs.redirects).toBeDefined();
    expect(docs.redirects.length).toBeGreaterThan(0);
    expect(docs.gone).toBeDefined();
    expect(docs.gone.length).toBeGreaterThan(0);
  });

  it('should have subdomain redirect configuration', () => {
    const docs = redirectConfig.documentation;
    expect(docs.subdomainRedirects).toBeDefined();
    expect(docs.subdomainRedirects.length).toBeGreaterThan(0);
    expect(docs.subdomainRedirects[0].from).toContain('tyofbadmin');
  });

  it('should document all 301 redirects with reasons', () => {
    const docs = redirectConfig.documentation;
    docs.redirects.forEach(redirect => {
      expect(redirect.from).toBeDefined();
      expect(redirect.to).toBeDefined();
      expect(redirect.status).toBe(301);
      expect(redirect.reason).toBeDefined();
    });
  });

  it('should document all 410 gone patterns with reasons', () => {
    const docs = redirectConfig.documentation;
    docs.gone.forEach(gone => {
      expect(gone.pattern).toBeDefined();
      expect(gone.status).toBe(410);
      expect(gone.reason).toBeDefined();
    });
  });
});
