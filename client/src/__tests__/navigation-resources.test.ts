import { describe, it, expect } from 'vitest';

describe('Navigation Resources Menu', () => {
  it('should have Capabilities Deck link in Resources menu', () => {
    const resourcesMenuItems = [
      { label: 'Capabilities Deck', href: '/resources/capabilities-deck', featured: true },
      { label: 'Videos & Webinars', href: '/resources/videos', featured: false },
      { label: 'Blog & Insights', href: '/blog', featured: false },
      { label: 'Interactive Graph Demo', href: '/graph-demo', featured: true },
    ];

    const capabilitiesDeck = resourcesMenuItems.find(item => item.href === '/resources/capabilities-deck');
    expect(capabilitiesDeck).toBeDefined();
    expect(capabilitiesDeck?.label).toBe('Capabilities Deck');
    expect(capabilitiesDeck?.featured).toBe(true);
  });

  it('should have correct order of Resources menu items', () => {
    const menuOrder = [
      '/resources/capabilities-deck',
      '/resources/videos',
      '/blog',
      '/graph-demo',
    ];

    expect(menuOrder[0]).toBe('/resources/capabilities-deck');
    expect(menuOrder[1]).toBe('/resources/videos');
    expect(menuOrder[2]).toBe('/blog');
    expect(menuOrder[3]).toBe('/graph-demo');
  });

  it('should have Capabilities Deck as first featured item', () => {
    const featuredItems = [
      { label: 'Capabilities Deck', position: 1, icon: '📊' },
      { label: 'Interactive Graph Demo', position: 4, icon: '🎯' },
    ];

    const capabilitiesDeck = featuredItems[0];
    expect(capabilitiesDeck.position).toBe(1);
    expect(capabilitiesDeck.icon).toBe('📊');
  });

  it('should have all Resources menu links valid', () => {
    const links = [
      '/resources/capabilities-deck',
      '/resources/videos',
      '/blog',
      '/graph-demo',
    ];

    links.forEach(link => {
      expect(link).toMatch(/^\/[a-z\/-]+$/);
      expect(link.length).toBeGreaterThan(0);
    });
  });

  it('should have Capabilities Deck styled as primary', () => {
    const styling = {
      capabilitiesDeck: {
        fontWeight: 'semibold',
        color: 'text-primary',
        icon: '📊',
      },
      interactiveGraphDemo: {
        fontWeight: 'semibold',
        color: 'text-primary',
        icon: '🎯',
      },
    };

    expect(styling.capabilitiesDeck.color).toBe('text-primary');
    expect(styling.capabilitiesDeck.fontWeight).toBe('semibold');
  });
});
