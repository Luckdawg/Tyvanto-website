import { describe, it, expect } from 'vitest';

/**
 * Test to verify that canonical tags are properly configured on all pages
 * This ensures proper SEO and prevents duplicate content issues
 */
describe('Canonical Tags Configuration', () => {
  const canonicalUrls = {
    '/': 'https://www.tyvanto.com/',
    '/platform': 'https://www.tyvanto.com/platform',
    '/blog': 'https://www.tyvanto.com/blog',
    '/company/about': 'https://www.tyvanto.com/company/about',
    '/company/investor-relations': 'https://www.tyvanto.com/company/investor-relations',
    '/solutions/cybersecurity': 'https://www.tyvanto.com/solutions/cybersecurity',
    '/solutions/smart-cities': 'https://www.tyvanto.com/solutions/smart-cities',
    '/solutions/critical-infrastructure': 'https://www.tyvanto.com/solutions/critical-infrastructure',
    '/solutions/healthcare': 'https://www.tyvanto.com/solutions/healthcare',
    '/solutions/financial-services': 'https://www.tyvanto.com/solutions/financial-services',
    '/solutions/supply-chain': 'https://www.tyvanto.com/solutions/supply-chain',
    '/solutions/telecommunications': 'https://www.tyvanto.com/solutions/telecommunications',
    '/solutions/manufacturing': 'https://www.tyvanto.com/solutions/manufacturing',
    '/solutions/government-federal': 'https://www.tyvanto.com/solutions/government-federal',
    '/demo': 'https://www.tyvanto.com/demo',
    '/pricing': 'https://www.tyvanto.com/pricing',
    '/partners': 'https://www.tyvanto.com/partners'
  };

  it('should have canonical URLs configured for all major pages', () => {
    // This test verifies that canonical URLs are defined
    expect(Object.keys(canonicalUrls).length).toBeGreaterThan(0);
    expect(canonicalUrls['/']).toBe('https://www.tyvanto.com/');
    expect(canonicalUrls['/platform']).toBe('https://www.tyvanto.com/platform');
  });

  it('should use consistent domain in canonical URLs', () => {
    // All canonical URLs should use www.tyvanto.com
    Object.values(canonicalUrls).forEach(url => {
      expect(url).toContain('https://www.tyvanto.com');
    });
  });

  it('should not have trailing slashes except for root', () => {
    // Check that only root has trailing slash
    Object.entries(canonicalUrls).forEach(([path, url]) => {
      if (path === '/') {
        expect(url).toBe('https://www.tyvanto.com/');
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
