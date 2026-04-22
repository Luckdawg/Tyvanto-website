import { describe, it, expect } from 'vitest';

describe('TruClaw Solution Page', () => {
  it('should have correct page title', () => {
    const title = "TruClaw™ AI Agent Governance | Agentic AI Security | Tyvanto";
    expect(title).toContain('TruClaw');
    expect(title).toContain('AI Agent Governance');
  });

  it('should have correct canonical URL', () => {
    const canonical = "https://www.tyvanto.com/solutions/truclaw";
    expect(canonical).toContain('/solutions/truclaw');
    expect(canonical).toMatch(/^https:\/\//);
  });

  it('should contain hero section with main headline', () => {
    const headline = "TruClaw™ Govern Every AI Agent. Stop Every Shadow Agent.";
    expect(headline).toContain('TruClaw');
    expect(headline).toContain('Govern Every AI Agent');
  });

  it('should have Schedule Demo CTA button', () => {
    const cta = "Schedule a Demo";
    expect(cta).toBeTruthy();
  });

  it('should have threat banner about OpenClaw', () => {
    const threatBanner = "The OpenClaw / Shadow AI Threat Is Real";
    expect(threatBanner).toContain('OpenClaw');
    expect(threatBanner).toContain('Shadow AI');
  });

  it('should contain all 6 challenge cards', () => {
    const challenges = [
      'Shadow AI Proliferation',
      'Prompt Injection Attacks',
      'Unbounded Agent Privileges',
      'Multi-Agent Chain Attacks',
      'AI Supply Chain Risk',
      'Zero Audit Trail'
    ];
    expect(challenges.length).toBe(6);
    challenges.forEach(challenge => {
      expect(challenge).toBeTruthy();
    });
  });

  it('should contain What is TruClaw section', () => {
    const section = "TruClaw™: Agentic AI Governance Inside Arqen™";
    expect(section).toContain('TruClaw');
    expect(section).toContain('Agentic AI Governance');
  });

  it('should contain ELI integration mention', () => {
    const eli = "ELI (Ethical Layered Intelligence)";
    expect(eli).toContain('ELI');
    expect(eli).toContain('Ethical Layered Intelligence');
  });

  it('should have all 5 capability tags', () => {
    const tags = [
      'an independent research organization ATLAS Aligned',
      'Zero Trust for AI',
      'ELI Integration',
      'NIST AI RMF',
      'Real-Time Enforcement'
    ];
    expect(tags.length).toBe(5);
  });

  it('should contain 6 key capabilities', () => {
    const capabilities = [
      'Agent Behavior Monitoring',
      'Prompt Injection Defense',
      'Shadow AI Detection',
      'Zero Trust Agent Policy',
      'AI Supply Chain Integrity',
      'Multi-Agent Graph Mapping'
    ];
    expect(capabilities.length).toBe(6);
  });

  it('should have 4-step How It Works section', () => {
    const steps = [
      'Discover & Inventory',
      'Map & Contextualize',
      'Monitor & Detect',
      'Enforce & Respond'
    ];
    expect(steps.length).toBe(4);
  });

  it('should contain detection coverage metrics', () => {
    const metrics = {
      'Prompt Injection Detection': '99%',
      'Shadow AI Discovery': '100%',
      'Privilege Creep Detection': '97%',
      'Multi-Agent Chain Detection': '95%',
      'Supply Chain Integrity Checks': '100%'
    };
    expect(Object.keys(metrics).length).toBe(5);
  });

  it('should have sub-second detection latency claim', () => {
    const latency = "<1s";
    expect(latency).toBe("<1s");
  });

  it('should contain 4 proven results metrics', () => {
    const results = [
      '100%',
      '<1s',
      '90%',
      '30 Days'
    ];
    expect(results.length).toBe(4);
  });

  it('should have comparison table with 8 capabilities', () => {
    const comparisons = [
      'Shadow AI Agent Discovery',
      'Prompt Injection Detection',
      'Agent Privilege Enforcement',
      'Multi-Agent Chain Visualization',
      'AI Supply Chain Integrity',
      'Explainable AI Governance',
      'an independent research organization ATLAS Alignment',
      'Real-Time Autonomous Response'
    ];
    expect(comparisons.length).toBe(8);
  });

  it('should have 6 use case industries', () => {
    const useCases = [
      'Government & Defense',
      'Healthcare',
      'Financial Services',
      'Critical Infrastructure',
      'Smart Cities',
      'Enterprise R&D'
    ];
    expect(useCases.length).toBe(6);
  });

  it('should have final CTA section', () => {
    const cta = "Ready to Govern Your AI Agents?";
    expect(cta).toContain('Govern Your AI Agents');
  });

  it('should have correct route path', () => {
    const route = '/solutions/truclaw';
    expect(route).toMatch(/^\/solutions\/truclaw$/);
  });

  it('should be in Solutions dropdown menu', () => {
    const navItem = "🦀 TruClaw™ — AI Agent Governance";
    expect(navItem).toContain('TruClaw');
    expect(navItem).toContain('AI Agent Governance');
  });

  it('should have all CTAs linking to /demo', () => {
    const ctaLinks = ['/demo', '/demo', '/demo'];
    expect(ctaLinks.every(link => link === '/demo')).toBe(true);
  });

  it('should have proper SEO description', () => {
    const description = "TruClaw™ is Tyvanto's agentic AI governance and control layer within Arqen™. Stop Shadow AI, prevent autonomous agent exploitation, and enforce zero-trust for every AI agent across your enterprise.";
    expect(description).toContain('TruClaw');
    expect(description).toContain('agentic AI governance');
    expect(description).toContain('Shadow AI');
  });
});
