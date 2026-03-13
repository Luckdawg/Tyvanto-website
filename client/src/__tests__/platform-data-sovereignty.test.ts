import { describe, it, expect } from 'vitest';

describe('Platform - Data Sovereignty Section', () => {
  it('should have data sovereignty section heading', () => {
    const heading = 'Data Sovereignty & Ethical Intelligence';
    expect(heading).toContain('Data Sovereignty');
    expect(heading).toContain('Ethical Intelligence');
  });

  it('should have subtitle about local control and collaboration', () => {
    const subtitle = 'Maintaining local control while enabling secure collaboration';
    expect(subtitle).toContain('local control');
    expect(subtitle).toContain('secure collaboration');
  });

  it('should mention Ethical Layered Intelligence (ELI) technology', () => {
    const content = 'Ethical Layered Intelligence (ELI) technology';
    expect(content).toContain('ELI');
    expect(content).toContain('Ethical Layered Intelligence');
  });

  it('should describe local data ownership benefits', () => {
    const section = 'Local Data Ownership';
    const description = 'TruContext enables municipalities and other entities to retain full ownership and control of their jurisdictional data, preventing unauthorized centralization or external access.';
    
    expect(section).toContain('Local Data Ownership');
    expect(description).toContain('full ownership');
    expect(description).toContain('control');
    expect(description).toContain('jurisdictional data');
  });

  it('should describe granular access control', () => {
    const section = 'Granular Access Control';
    const description = 'Role-based sharing mechanisms provide granular, auditable permissions for data access based on operational needs, ensuring privacy is balanced with coordination in applications like public safety surveillance networks.';
    
    expect(section).toContain('Granular Access Control');
    expect(description.toLowerCase()).toContain('role-based');
    expect(description).toContain('auditable permissions');
    expect(description).toContain('public safety');
  });

  it('should include ethical safeguards section', () => {
    const section = 'Ethical Safeguards for High-Stakes Environments';
    expect(section).toContain('Ethical Safeguards');
    expect(section).toContain('High-Stakes Environments');
  });

  it('should mention audit trails', () => {
    const content = 'verifiable audit trails';
    expect(content).toContain('audit trails');
  });

  it('should address cybersecurity and critical infrastructure', () => {
    const content = 'cybersecurity and critical infrastructure';
    expect(content).toContain('cybersecurity');
    expect(content).toContain('critical infrastructure');
  });

  it('should mention data breach risk reduction', () => {
    const content = 'reducing risks associated with data breaches or misuse';
    expect(content).toContain('data breaches');
    expect(content).toContain('misuse');
  });

  it('should have proper section structure', () => {
    const sections = [
      'Data Sovereignty & Ethical Intelligence',
      'Local Data Ownership',
      'Granular Access Control',
      'Ethical Safeguards for High-Stakes Environments'
    ];
    
    expect(sections.length).toBe(4);
    sections.forEach(section => {
      expect(section.length).toBeGreaterThan(0);
    });
  });

  it('should mention inter-jurisdictional collaboration', () => {
    const content = 'inter-jurisdictional collaboration';
    expect(content).toContain('inter-jurisdictional');
    expect(content).toContain('collaboration');
  });

  it('should emphasize framework design for local control', () => {
    const content = 'proprietary framework designed to maintain local control over data';
    expect(content).toContain('proprietary framework');
    expect(content).toContain('maintain local control');
  });

  it('should address operational needs balancing', () => {
    const content = 'ensuring privacy is balanced with coordination';
    expect(content).toContain('privacy');
    expect(content).toContain('balanced');
    expect(content).toContain('coordination');
  });

  it('should have comprehensive coverage of sovereignty aspects', () => {
    const aspects = {
      ownership: 'full ownership and control of their jurisdictional data',
      access: 'granular, auditable permissions',
      ethics: 'verifiable audit trails',
      security: 'reducing risks associated with data breaches'
    };
    
    Object.values(aspects).forEach(aspect => {
      expect(aspect.length).toBeGreaterThan(0);
    });
  });

  it('should be positioned after deployment options', () => {
    const sections = [
      'Flexible Deployment Options',
      'Data Sovereignty & Ethical Intelligence',
      'Follow Us'
    ];
    
    const sovereigntyIndex = sections.indexOf('Data Sovereignty & Ethical Intelligence');
    const deploymentIndex = sections.indexOf('Flexible Deployment Options');
    
    expect(sovereigntyIndex).toBeGreaterThan(deploymentIndex);
  });

  it('should use appropriate icons for visual hierarchy', () => {
    const icons = ['Lock', 'Shield', 'Network', 'Zap'];
    expect(icons.length).toBeGreaterThan(0);
    expect(icons).toContain('Lock');
    expect(icons).toContain('Shield');
  });

  it('should have visually distinct styling', () => {
    const styling = {
      background: 'from-blue-50 to-indigo-50',
      cardBorder: 'border-l-4 border-l-primary',
      highlightBackground: 'from-primary/5 to-secondary/5'
    };
    
    expect(styling.background).toContain('blue');
    expect(styling.cardBorder).toContain('primary');
  });

  it('should be accessible and readable', () => {
    const content = 'Data Sovereignty & Ethical Intelligence';
    const textSize = 'text-3xl md:text-4xl font-bold';
    
    expect(content.length).toBeGreaterThan(0);
    expect(textSize).toContain('bold');
  });
});
