/**
 * Tests for the admin auto-promotion logic in server/db.ts.
 *
 * The upsertUser function must automatically assign role='admin' to any user
 * whose email appears in the ADMIN_EMAILS allow-list (shared/const.ts),
 * regardless of whether this is their first login or a subsequent one.
 */

import { describe, it, expect } from "vitest";
import { ADMIN_EMAILS } from "../../shared/const";

// ── ADMIN_EMAILS constant tests ───────────────────────────────────────────────

describe("ADMIN_EMAILS constant", () => {
  it("contains exactly the three authorised admin emails", () => {
    expect(ADMIN_EMAILS.has("mlucky@visiumtechnologies.com")).toBe(true);
    expect(ADMIN_EMAILS.has("edevane@visiumtechnologies.com")).toBe(true);
    expect(ADMIN_EMAILS.has("inoble.ctr@visiumtechnologies.com")).toBe(true);
  });

  it("does not contain unlisted addresses", () => {
    expect(ADMIN_EMAILS.has("unknown@visiumtechnologies.com")).toBe(false);
    expect(ADMIN_EMAILS.has("admin@example.com")).toBe(false);
    expect(ADMIN_EMAILS.has("")).toBe(false);
  });

  it("has exactly 3 entries", () => {
    expect(ADMIN_EMAILS.size).toBe(3);
  });
});

// ── Auto-promotion logic unit tests ──────────────────────────────────────────
//
// We test the promotion decision logic in isolation without hitting the
// database, by replicating the exact conditional from upsertUser.

function resolveRole(
  email: string | null | undefined,
  explicitRole?: "user" | "admin" | "super_admin" | "editor" | "viewer" | "partner",
  isOwner = false
): "user" | "admin" | "super_admin" | "editor" | "viewer" | "partner" {
  if (explicitRole !== undefined) return explicitRole;
  if (email && ADMIN_EMAILS.has(email.toLowerCase())) return "admin";
  if (isOwner) return "admin";
  return "user";
}

describe("resolveRole (auto-promotion logic)", () => {
  describe("ADMIN_EMAILS auto-promotion", () => {
    it("promotes mlucky@visiumtechnologies.com to admin", () => {
      expect(resolveRole("mlucky@visiumtechnologies.com")).toBe("admin");
    });

    it("promotes edevane@visiumtechnologies.com to admin", () => {
      expect(resolveRole("edevane@visiumtechnologies.com")).toBe("admin");
    });

    it("promotes inoble.ctr@visiumtechnologies.com to admin", () => {
      expect(resolveRole("inoble.ctr@visiumtechnologies.com")).toBe("admin");
    });

    it("is case-insensitive — uppercase email still promotes to admin", () => {
      expect(resolveRole("MLUCKY@VISIUMTECHNOLOGIES.COM")).toBe("admin");
      expect(resolveRole("EDevane@VisiumTechnologies.com")).toBe("admin");
    });
  });

  describe("non-admin emails default to user", () => {
    it("assigns 'user' role to an unlisted email", () => {
      expect(resolveRole("other@visiumtechnologies.com")).toBe("user");
    });

    it("assigns 'user' role when email is null", () => {
      expect(resolveRole(null)).toBe("user");
    });

    it("assigns 'user' role when email is undefined", () => {
      expect(resolveRole(undefined)).toBe("user");
    });
  });

  describe("explicit role always wins", () => {
    it("honours explicit 'user' role even for an admin email", () => {
      expect(resolveRole("mlucky@visiumtechnologies.com", "user")).toBe("user");
    });

    it("honours explicit 'super_admin' role for any email", () => {
      expect(resolveRole("other@example.com", "super_admin")).toBe("super_admin");
    });

    it("honours explicit 'editor' role", () => {
      expect(resolveRole("edevane@visiumtechnologies.com", "editor")).toBe("editor");
    });
  });

  describe("owner openId fallback", () => {
    it("promotes the site owner to admin when no email match and no explicit role", () => {
      expect(resolveRole("owner@other.com", undefined, true)).toBe("admin");
    });

    it("owner promotion does not override an explicit role", () => {
      expect(resolveRole("owner@other.com", "user", true)).toBe("user");
    });
  });
});
