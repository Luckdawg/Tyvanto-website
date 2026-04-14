/**
 * Pricing.tsx
 *
 * This page has been superseded by the Shop page (/shop), which provides
 * full product listings, the interactive pricing calculator, and Stripe checkout.
 *
 * Visitors who navigate directly to /pricing are immediately redirected to /shop.
 */

import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Pricing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/shop", { replace: true });
  }, [setLocation]);

  // Render nothing — the redirect fires on mount.
  return null;
}
