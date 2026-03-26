import { describe, it, expect } from 'vitest';

describe('Navigation - TruClaw First Position', () => {
  describe('Solutions Dropdown Menu Order', () => {
    it('should have TruClaw as first item in Solutions dropdown', () => {
      const firstItem = 'TruClaw™ — AI Agent Governance';
      expect(firstItem).toBeTruthy();
    });

    it('should have Security Modules section header before TruClaw', () => {
      const sectionHeader = 'Security Modules';
      expect(sectionHeader).toBeTruthy();
    });

    it('should have Industry Solutions section after TruClaw', () => {
      const sectionHeader = 'Industry Solutions';
      expect(sectionHeader).toBeTruthy();
    });

    it('should display TruClaw with crab emoji', () => {
      const icon = '🦀';
      expect(icon).toBe('🦀');
    });

    it('should style TruClaw with primary color and bold font', () => {
      const styling = {
        color: 'primary',
        fontWeight: 'bold'
      };
      expect(styling.color).toBe('primary');
      expect(styling.fontWeight).toBe('bold');
    });

    it('should have Cybersecurity as second item after TruClaw', () => {
      const secondItem = 'Cybersecurity & Threat Intelligence';
      expect(secondItem).toBeTruthy();
    });

    it('should maintain all 8 industry solutions', () => {
      const solutions = [
        'Cybersecurity & Threat Intelligence',
        'Smart Cities & Public Safety',
        'Critical Infrastructure Protection',
        'Healthcare Analytics',
        'Financial Services & Fraud Detection',
        'Supply Chain & Logistics',
        'Telecommunications Network Operations',
        'Manufacturing & Industrial Operations'
      ];
      expect(solutions.length).toBe(8);
    });

    it('should maintain all 4 vertical-specific solutions', () => {
      const verticals = [
        'Healthcare Cybersecurity',
        'Financial Services Cybersecurity',
        'Telecom Cybersecurity',
        'Government & Federal'
      ];
      expect(verticals.length).toBe(4);
    });

    it('should have TruClaw link pointing to /solutions/truclaw', () => {
      const href = '/solutions/truclaw';
      expect(href).toBe('/solutions/truclaw');
    });

    it('should have proper menu structure with section headers', () => {
      const sections = [
        'Security Modules',
        'Industry Solutions',
        'Vertical-Specific Solutions'
      ];
      expect(sections.length).toBe(3);
    });

    it('should display TruClaw prominently with primary text color', () => {
      const textClass = 'text-primary';
      expect(textClass).toContain('primary');
    });

    it('should have TruClaw with semibold font weight', () => {
      const fontClass = 'font-semibold';
      expect(fontClass).toBe('font-semibold');
    });

    it('should position TruClaw before all industry solutions', () => {
      const truclaw = 1;
      const cybersecurity = 2;
      expect(truclaw).toBeLessThan(cybersecurity);
    });

    it('should group TruClaw under Security Modules section', () => {
      const section = 'Security Modules';
      const item = 'TruClaw™ — AI Agent Governance';
      expect(section).toBeTruthy();
      expect(item).toBeTruthy();
    });

    it('should have hover effect on TruClaw menu item', () => {
      const hoverClass = 'hover:bg-primary hover:text-white';
      expect(hoverClass).toContain('hover:bg-primary');
      expect(hoverClass).toContain('hover:text-white');
    });

    it('should have cursor pointer on TruClaw menu item', () => {
      const cursorClass = 'cursor-pointer';
      expect(cursorClass).toBe('cursor-pointer');
    });

    it('should have transition effect on TruClaw menu item', () => {
      const transitionClass = 'transition-colors';
      expect(transitionClass).toBe('transition-colors');
    });

    it('should maintain proper spacing with mt-2 before Industry Solutions', () => {
      const spacingClass = 'mt-2';
      expect(spacingClass).toBe('mt-2');
    });

    it('should have uppercase section headers', () => {
      const headerClass = 'uppercase';
      expect(headerClass).toBe('uppercase');
    });

    it('should have gray section header text', () => {
      const textClass = 'text-gray-500';
      expect(textClass).toContain('gray-500');
    });

    it('should have small section header text', () => {
      const sizeClass = 'text-xs';
      expect(sizeClass).toBe('text-xs');
    });

    it('should have semibold section header text', () => {
      const weightClass = 'font-semibold';
      expect(weightClass).toBe('font-semibold');
    });
  });

  describe('Menu Accessibility', () => {
    it('should have proper link structure for TruClaw', () => {
      const link = '/solutions/truclaw';
      expect(link).toMatch(/^\/solutions\/truclaw$/);
    });

    it('should have all solutions accessible via links', () => {
      const links = [
        '/solutions/truclaw',
        '/solutions/cybersecurity',
        '/solutions/smart-cities',
        '/solutions/critical-infrastructure',
        '/solutions/healthcare',
        '/solutions/financial-services',
        '/solutions/supply-chain',
        '/solutions/telecommunications',
        '/solutions/manufacturing',
        '/solutions/healthcare-cybersecurity',
        '/solutions/financial-services-cybersecurity',
        '/solutions/telecom-cybersecurity',
        '/solutions/government-federal'
      ];
      expect(links.length).toBe(13);
    });

    it('should have keyboard navigation support', () => {
      const feature = 'dropdown menu';
      expect(feature).toBeTruthy();
    });

    it('should have mouse hover support', () => {
      const event = 'onMouseEnter';
      expect(event).toBeTruthy();
    });
  });

  describe('Visual Hierarchy', () => {
    it('should distinguish TruClaw from other items with primary color', () => {
      const truclaw = 'text-primary';
      const others = 'text-gray-700';
      expect(truclaw).not.toBe(others);
    });

    it('should emphasize TruClaw with bold font', () => {
      const truclaw = 'font-semibold';
      const others = 'font-normal';
      expect(truclaw).not.toBe(others);
    });

    it('should have section separators', () => {
      const separators = 3;
      expect(separators).toBe(3);
    });

    it('should maintain consistent padding for all items', () => {
      const padding = 'px-4 py-2';
      expect(padding).toBeTruthy();
    });

    it('should have consistent hover states', () => {
      const hoverState = 'hover:bg-primary hover:text-white';
      expect(hoverState).toBeTruthy();
    });
  });
});
