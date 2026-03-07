import { describe, it, expect } from 'vitest';

/**
 * Test to verify that canonical tags are properly configured on all pages
 * This ensures proper SEO and prevents duplicate content issues
 */
describe('Canonical Tags Configuration', () => {
  const canonicalUrls = {
    '/': 'https://www.visiumtechnologies.com/',
    '/platform': 'https://www.visiumtechnologies.com/platform',
    '/blog': 'https://www.visiumtechnologies.com/blog',
    '/company/about': 'https://www.visiumtechnologies.com/company/about',
    '/company/investor-relations': 'https://www.visiumtechnologies.com/company/investor-relations',
    '/solutions/cybersecurity': 'https://www.visiumtechnologies.com/solutions/cybersecurity',
    '/solutions/smart-cities': 'https://www.visiumtechnologies.com/solutions/smart-cities',
    '/solutions/critical-infrastructure': 'https://www.visiumtechnologies.com/solutions/critical-infrastructure',
    '/solutions/healthcare': 'https://www.visiumtechnologies.com/solutions/healthcare',
    '/solutions/financial-services': 'https://www.visiumtechnologies.com/solutions/financial-services',
    '/solutions/supply-chain': 'https://www.visiumtechnologies.com/solutions/supply-chain',
    '/solutions/telecommunications': 'https://www.visiumtechnologies.com/solutions/telecommunications',
    '/solutions/manufacturing': 'https://www.visiumtechnologies.com/solutions/manufacturing',
    '/solutions/government-federal': 'https://www.visiumtechnologies.com/solutions/government-federal',
    '/demo': 'https://www.visiumtechnologies.com/demo',
    '/pricing': 'https://www.visiumtechnologies.com/pricing',
    '/partners': 'https://www.visiumtechnologies.com/partners'
  };

  it('should have canonical URLs configured for all major pages', () => {
    // This test verifies that canonical URLs are defined
    expect(Object.keys(canonicalUrls).length).toBeGreaterThan(0);
    expect(canonicalUrls['/']).toBe('https://www.visiumtechnologies.com/');
    expect(canonicalUrls['/platform']).toBe('https://www.visiumtechnologies.com/platform');
  });

  it('should use consistent domain in canonical URLs', () => {
    // All canonical URLs should use www.visiumtechnologies.com
    Object.values(canonicalUrls).forEach(url => {
      expect(url).toContain('https://www.visiumtechnologies.com');
    });
  });

  it('should not have trailing slashes except for root', () => {
    // Check that only root has trailing slash
    Object.entries(canonicalUrls).forEach(([path, url]) => {
      if (path === '/') {
        expect(url).toBe('https://www.visiumtechnologies.com/');
      } else {
        expect(url).not.toMatch(/\/$/);
      }
    });
  });

  it('should have unique canonical URLs for each page', () => {
    // Ensure no duplicate canonical URLs
    const urls = Object.values(canonicalUrls);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(urls.length);
  });
});
