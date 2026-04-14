/**
 * server/routers/__tests__/shop-checkout.test.ts
 *
 * Unit tests for the Stripe products registry and shop checkout router logic.
 * These tests verify the price map, product catalogue, and helper functions
 * without making live Stripe API calls.
 *
 * Pricing sourced from Visium_Pricing_Formulas-02.xlsx (Apr 2026).
 * All annual discounts are uniform 10%.
 */

import { describe, it, expect } from 'vitest';
import {
  VISIUM_PRODUCTS,
  getStripePrice,
  getProductsByCategory,
  type BillingCycle,
} from '../../stripe/products';

// ─── Product Registry Tests ───────────────────────────────────────────────────

describe('VISIUM_PRODUCTS registry', () => {
  it('contains all 16 expected products', () => {
    const expectedIds = [
      'trucontext',
      'truclaw-starter',
      'truclaw-standard',
      'truclaw-enterprise',
      'truinsight',
      'eli',
      'full-suite-bundle',
      'trucontext-oil-gas',
      'smart-city-gov',
      'smart-city-municipal',
      'campus-security',
      'caseforge-legal',
      'aspire-reporting',
      'truaddress',
      'panelpulse',
      'smart-city-demo',
    ];
    // Note: truclaw-enterprise is a contact sales product (no price)
    for (const id of expectedIds) {
      expect(VISIUM_PRODUCTS[id], `Missing product: ${id}`).toBeDefined();
    }
  });

  it('has correct categories for all products', () => {
    const corePlatforms = ['trucontext', 'truclaw-starter', 'truclaw-standard', 'truclaw-enterprise', 'truinsight', 'eli'];
    const bundles = ['full-suite-bundle'];
    const verticals = [
      'trucontext-oil-gas', 'smart-city-gov', 'smart-city-municipal',
      'campus-security', 'caseforge-legal', 'aspire-reporting',
      'truaddress', 'panelpulse', 'smart-city-demo',
    ];

    for (const id of corePlatforms) {
      expect(VISIUM_PRODUCTS[id].category).toBe('Core Platform');
    }
    for (const id of bundles) {
      expect(VISIUM_PRODUCTS[id].category).toBe('Bundle');
    }
    for (const id of verticals) {
      expect(VISIUM_PRODUCTS[id].category).toBe('Vertical Solution');
    }
  });

  it('has correct base prices matching the spreadsheet (v2 Apr 2026)', () => {
    expect(VISIUM_PRODUCTS['trucontext'].monthlyBaseUsd).toBe(7995);
    expect(VISIUM_PRODUCTS['truclaw-starter'].monthlyBaseUsd).toBe(1299);
    expect(VISIUM_PRODUCTS['truclaw-standard'].monthlyBaseUsd).toBe(6995);
    expect(VISIUM_PRODUCTS['truinsight'].monthlyBaseUsd).toBe(7499);
    expect(VISIUM_PRODUCTS['eli'].monthlyBaseUsd).toBe(9499);
    expect(VISIUM_PRODUCTS['full-suite-bundle'].monthlyBaseUsd).toBe(14995);
    expect(VISIUM_PRODUCTS['trucontext-oil-gas'].monthlyBaseUsd).toBe(8000);
    expect(VISIUM_PRODUCTS['smart-city-gov'].monthlyBaseUsd).toBe(16000);
    expect(VISIUM_PRODUCTS['smart-city-municipal'].monthlyBaseUsd).toBe(12495);
    expect(VISIUM_PRODUCTS['campus-security'].monthlyBaseUsd).toBe(7995);
    expect(VISIUM_PRODUCTS['caseforge-legal'].monthlyBaseUsd).toBe(3499);
    expect(VISIUM_PRODUCTS['aspire-reporting'].monthlyBaseUsd).toBe(3499);
    expect(VISIUM_PRODUCTS['truaddress'].monthlyBaseUsd).toBe(19950);
    expect(VISIUM_PRODUCTS['panelpulse'].monthlyBaseUsd).toBe(3995);
    expect(VISIUM_PRODUCTS['smart-city-demo'].monthlyBaseUsd).toBe(4750);
  });

  it('has uniform 10% annual discount for all products', () => {
    const allProducts = [
      'trucontext', 'truclaw-starter', 'truclaw-standard', 'truinsight', 'eli',
      'full-suite-bundle',
      'trucontext-oil-gas', 'smart-city-gov', 'smart-city-municipal',
      'campus-security', 'caseforge-legal', 'aspire-reporting',
      'truaddress', 'panelpulse', 'smart-city-demo',
    ];
    for (const id of allProducts) {
      expect(VISIUM_PRODUCTS[id].annualDiscount).toBe(0.10);
    }
  });

  it('marks truclaw-enterprise as contactSales', () => {
    expect(VISIUM_PRODUCTS['truclaw-enterprise'].contactSales).toBe(true);
  });

  it('all non-contact-sales products have valid Stripe price IDs', () => {
    for (const [id, product] of Object.entries(VISIUM_PRODUCTS)) {
      if (product.contactSales) continue;
      expect(product.prices.monthly).toMatch(/^price_/);
      expect(product.prices.annual).toMatch(/^price_/);
    }
  });

  it('all Stripe product IDs are valid', () => {
    for (const [id, product] of Object.entries(VISIUM_PRODUCTS)) {
      expect(product.productId).toMatch(/^prod_/);
    }
  });
});

// ─── getStripePrice helper tests ──────────────────────────────────────────────

describe('getStripePrice', () => {
  it('returns monthly price ID for monthly billing', () => {
    const priceId = getStripePrice('trucontext', 'monthly');
    expect(priceId).toBe('price_1TLuXD2eZs8bKGLsQW7smUw3');
  });

  it('returns annual price ID for annual billing', () => {
    const priceId = getStripePrice('trucontext', 'annual');
    expect(priceId).toBe('price_1TLuXD2eZs8bKGLs0RBYhAJz');
  });

  it('returns null for unknown product', () => {
    const priceId = getStripePrice('nonexistent-product', 'monthly');
    expect(priceId).toBeNull();
  });

  it('returns null for contact sales product', () => {
    const priceId = getStripePrice('truclaw-enterprise', 'monthly');
    expect(priceId).toBeNull();
  });

  it('returns correct price IDs for all flat-rate vertical products', () => {
    const flatRateProducts: Array<[string, BillingCycle, string]> = [
      ['caseforge-legal',   'monthly', 'price_1TLuXX2eZs8bKGLsrZiRaQVC'],
      ['aspire-reporting',  'monthly', 'price_1TLuXZ2eZs8bKGLs0GbaDSOm'],
      ['panelpulse',        'monthly', 'price_1TLuXd2eZs8bKGLsJLqxbOqf'],
      ['smart-city-demo',   'monthly', 'price_1TLuXe2eZs8bKGLsW9miMMP6'],
    ];
    for (const [productId, cycle, expectedId] of flatRateProducts) {
      expect(getStripePrice(productId, cycle)).toBe(expectedId);
    }
  });

  it('returns correct price IDs for Full Suite Bundle (10% annual discount)', () => {
    expect(getStripePrice('full-suite-bundle', 'monthly')).toBe('price_1TLuXN2eZs8bKGLsyMHPgjcH');
    expect(getStripePrice('full-suite-bundle', 'annual')).toBe('price_1TLuXN2eZs8bKGLsEGh6WuCv');
  });
});

// ─── getProductsByCategory helper tests ──────────────────────────────────────

describe('getProductsByCategory', () => {
  it('returns 6 Core Platform products', () => {
    const corePlatforms = getProductsByCategory('Core Platform');
    expect(corePlatforms).toHaveLength(6);
  });

  it('returns 1 Bundle product', () => {
    const bundles = getProductsByCategory('Bundle');
    expect(bundles).toHaveLength(1);
    expect(bundles[0].id).toBe('full-suite-bundle');
  });

  it('returns 9 Vertical Solution products', () => {
    const verticals = getProductsByCategory('Vertical Solution');
    expect(verticals).toHaveLength(9);
  });

  it('each product in the result includes id and name', () => {
    const verticals = getProductsByCategory('Vertical Solution');
    for (const product of verticals) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
    }
  });
});

// ─── Annual price calculation verification ────────────────────────────────────

describe('Annual price calculations', () => {
  it('TruContext annual price is 10% off monthly * 12', () => {
    const product = VISIUM_PRODUCTS['trucontext'];
    const expectedAnnual = Math.round(product.monthlyBaseUsd * 100 * 12 * (1 - product.annualDiscount));
    // $7,995 * 12 * 0.90 = $86,346 → 8634600 cents
    expect(expectedAnnual).toBe(8634600);
  });

  it('Full Suite Bundle annual price is 10% off monthly * 12', () => {
    const product = VISIUM_PRODUCTS['full-suite-bundle'];
    const expectedAnnual = Math.round(product.monthlyBaseUsd * 100 * 12 * (1 - product.annualDiscount));
    // $14,995 * 12 * 0.90 = $161,946 → 16194600 cents
    expect(expectedAnnual).toBe(16194600);
  });

  it('PanelPulse annual price is 10% off monthly * 12', () => {
    const product = VISIUM_PRODUCTS['panelpulse'];
    const expectedAnnual = Math.round(product.monthlyBaseUsd * 100 * 12 * (1 - product.annualDiscount));
    // $3,995 * 12 * 0.90 = $43,146 → 4314600 cents
    expect(expectedAnnual).toBe(4314600);
  });
});
