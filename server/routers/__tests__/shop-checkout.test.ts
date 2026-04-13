/**
 * server/routers/__tests__/shop-checkout.test.ts
 *
 * Unit tests for the Stripe products registry and shop checkout router logic.
 * These tests verify the price map, product catalogue, and helper functions
 * without making live Stripe API calls.
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
  it('contains all 17 expected products', () => {
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

  it('has correct base prices matching the spreadsheet', () => {
    expect(VISIUM_PRODUCTS['trucontext'].monthlyBaseUsd).toBe(12499);
    expect(VISIUM_PRODUCTS['truclaw-starter'].monthlyBaseUsd).toBe(1299);
    expect(VISIUM_PRODUCTS['truclaw-standard'].monthlyBaseUsd).toBe(9999);
    expect(VISIUM_PRODUCTS['truinsight'].monthlyBaseUsd).toBe(7499);
    expect(VISIUM_PRODUCTS['eli'].monthlyBaseUsd).toBe(9499);
    expect(VISIUM_PRODUCTS['full-suite-bundle'].monthlyBaseUsd).toBe(27500);
    expect(VISIUM_PRODUCTS['trucontext-oil-gas'].monthlyBaseUsd).toBe(24995);
    expect(VISIUM_PRODUCTS['smart-city-gov'].monthlyBaseUsd).toBe(28000);
    expect(VISIUM_PRODUCTS['smart-city-municipal'].monthlyBaseUsd).toBe(20000);
    expect(VISIUM_PRODUCTS['campus-security'].monthlyBaseUsd).toBe(9995);
    expect(VISIUM_PRODUCTS['caseforge-legal'].monthlyBaseUsd).toBe(2499);
    expect(VISIUM_PRODUCTS['aspire-reporting'].monthlyBaseUsd).toBe(1499);
    expect(VISIUM_PRODUCTS['truaddress'].monthlyBaseUsd).toBe(19950);
    expect(VISIUM_PRODUCTS['panelpulse'].monthlyBaseUsd).toBe(995);
    expect(VISIUM_PRODUCTS['smart-city-demo'].monthlyBaseUsd).toBe(4750);
  });

  it('has 15% annual discount for all products except Full Suite Bundle', () => {
    const standardProducts = [
      'trucontext', 'truclaw-starter', 'truclaw-standard', 'truinsight', 'eli',
      'trucontext-oil-gas', 'smart-city-gov', 'smart-city-municipal',
      'campus-security', 'caseforge-legal', 'aspire-reporting',
      'truaddress', 'panelpulse', 'smart-city-demo',
    ];
    for (const id of standardProducts) {
      expect(VISIUM_PRODUCTS[id].annualDiscount).toBe(0.15);
    }
  });

  it('has 20% annual discount for Full Suite Bundle', () => {
    expect(VISIUM_PRODUCTS['full-suite-bundle'].annualDiscount).toBe(0.20);
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
    expect(priceId).toBe('price_1TLtG52eZs8bKGLsMAmBZUk4');
  });

  it('returns annual price ID for annual billing', () => {
    const priceId = getStripePrice('trucontext', 'annual');
    expect(priceId).toBe('price_1TLtG62eZs8bKGLsCSYb7Ffn');
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
      ['caseforge-legal', 'monthly', 'price_1TLtGp2eZs8bKGLsJodkqEDi'],
      ['aspire-reporting', 'monthly', 'price_1TLtGt2eZs8bKGLsp3ViKSSk'],
      ['panelpulse', 'monthly', 'price_1TLtH62eZs8bKGLsZrb043Pm'],
      ['smart-city-demo', 'monthly', 'price_1TLtHA2eZs8bKGLsIpiSXAwJ'],
    ];
    for (const [productId, cycle, expectedId] of flatRateProducts) {
      expect(getStripePrice(productId, cycle)).toBe(expectedId);
    }
  });

  it('returns correct price IDs for Full Suite Bundle (20% annual discount)', () => {
    expect(getStripePrice('full-suite-bundle', 'monthly')).toBe('price_1TLtGS2eZs8bKGLsaNhLZazi');
    expect(getStripePrice('full-suite-bundle', 'annual')).toBe('price_1TLtGU2eZs8bKGLsl5mmwC4s');
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
  it('TruContext annual price is 15% off monthly * 12', () => {
    const product = VISIUM_PRODUCTS['trucontext'];
    const expectedAnnual = Math.round(product.monthlyBaseUsd * 100 * 12 * (1 - product.annualDiscount));
    // $12,499 * 12 * 0.85 = $127,489.80 → rounded to $127,490 (in cents: 12749000 - but Stripe rounds)
    // The actual price in Stripe was created as $127,489.80 → 12748980 cents
    expect(expectedAnnual).toBe(12748980);
  });

  it('Full Suite Bundle annual price is 20% off monthly * 12', () => {
    const product = VISIUM_PRODUCTS['full-suite-bundle'];
    const expectedAnnual = Math.round(product.monthlyBaseUsd * 100 * 12 * (1 - product.annualDiscount));
    // $27,500 * 12 * 0.80 = $264,000
    expect(expectedAnnual).toBe(26400000);
  });

  it('PanelPulse annual price is 15% off monthly * 12', () => {
    const product = VISIUM_PRODUCTS['panelpulse'];
    const expectedAnnual = Math.round(product.monthlyBaseUsd * 100 * 12 * (1 - product.annualDiscount));
    // $995 * 12 * 0.85 = $10,149
    expect(expectedAnnual).toBe(1014900);
  });
});
