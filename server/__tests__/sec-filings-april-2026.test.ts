/**
 * Tests for the 5 new April 2026 8-K filings inserted into the sec_filings table.
 * These tests validate the data shape and accession numbers without hitting the DB.
 */
import { describe, it, expect } from "vitest";

const APRIL_2026_FILINGS = [
  {
    filingType: "8-K",
    filingDate: "2026-04-07",
    accessionNumber: "0001654954-26-003315",
    description:
      "Current report, items 5.02, 5.03, and 3.03 — Departure of Directors; Amendments to Articles of Incorporation (Certificates of Designation for Series A and Series B Convertible Preferred Stock; adoption of non-waivable Conversion Gates)",
    documentUrl:
      "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003315/vism_8k.htm",
  },
  {
    filingType: "8-K",
    filingDate: "2026-04-10",
    accessionNumber: "0001654954-26-003548",
    description:
      "Current report, item 1.01 — Entry into a Material Definitive Agreement: full settlement and extinguishment of Labrys Notes (~$182,243.75) and 5,112,426 Talos Warrants for a single payment of $150,000, eliminating all conversion overhang and derivative liabilities",
    documentUrl:
      "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003548/vism_8k.htm",
  },
  {
    filingType: "8-K",
    filingDate: "2026-04-14",
    accessionNumber: "0001654954-26-003578",
    description:
      "Current report, items 3.02 and 5.03 — Unregistered issuance of 1,597,868 shares of Series D Callable Convertible Preferred Stock to ~40 accredited investors in exchange for full cancellation of $1,597,868.39 in outstanding indebtedness (promissory notes and accrued officer payables); conversion price fixed at $0.05 per common share",
    documentUrl:
      "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003578/vism_8k.htm",
  },
  {
    filingType: "8-K",
    filingDate: "2026-04-14",
    accessionNumber: "0001654954-26-003579",
    description:
      "Current report, items 5.03, 3.02, and 8.01 — Designation of Series G Governing Preferred Stock (4 shares issued to existing Series AA holders as senior-most class); adoption of 125-day voluntary Remediation Plan for legacy Series A and B Preferred Stock; conclusion that Series A/B conversion probability is remote for EPS purposes",
    documentUrl:
      "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003579/vism_8k.htm",
  },
  {
    filingType: "8-K",
    filingDate: "2026-04-16",
    accessionNumber: "0001654954-26-003620",
    description:
      "Current report, items 3.02, 5.03, and 8.01 — Designation of Series E Convertible Preferred Stock ($750 stated value, 8% cumulative dividend, fixed conversion at $0.05/share representing 40% fully diluted equity) to be issued in connection with the pending acquisition of 100% of ConnexUs AI (DE) pursuant to the LOI dated March 29, 2026",
    documentUrl:
      "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003620/vism_8k.htm",
  },
];

describe("April 2026 8-K SEC Filings", () => {
  it("should have exactly 5 new filings", () => {
    expect(APRIL_2026_FILINGS).toHaveLength(5);
  });

  it("all filings should be of type 8-K", () => {
    for (const filing of APRIL_2026_FILINGS) {
      expect(filing.filingType).toBe("8-K");
    }
  });

  it("all filings should have valid accession numbers matching SEC URL pattern", () => {
    for (const filing of APRIL_2026_FILINGS) {
      // Accession number format: XXXXXXXXXX-YY-ZZZZZZ
      expect(filing.accessionNumber).toMatch(/^\d{10}-\d{2}-\d{6}$/);
      // Accession number digits should appear in the documentUrl (without dashes)
      const urlDigits = filing.accessionNumber.replace(/-/g, "");
      expect(filing.documentUrl).toContain(urlDigits);
    }
  });

  it("all filings should have documentUrl pointing to SEC EDGAR", () => {
    for (const filing of APRIL_2026_FILINGS) {
      expect(filing.documentUrl).toMatch(
        /^https:\/\/www\.sec\.gov\/Archives\/edgar\/data\/1082733\//
      );
      expect(filing.documentUrl).toContain("vism_8k.htm");
    }
  });

  it("all filings should have non-empty descriptions", () => {
    for (const filing of APRIL_2026_FILINGS) {
      expect(filing.description.length).toBeGreaterThan(20);
    }
  });

  it("filings should be dated between April 7 and April 16, 2026", () => {
    const dates = APRIL_2026_FILINGS.map((f) => new Date(f.filingDate).getTime());
    const min = new Date("2026-04-07").getTime();
    const max = new Date("2026-04-16").getTime();
    for (const d of dates) {
      expect(d).toBeGreaterThanOrEqual(min);
      expect(d).toBeLessThanOrEqual(max);
    }
  });

  it("accession numbers should be unique", () => {
    const accessions = APRIL_2026_FILINGS.map((f) => f.accessionNumber);
    const unique = new Set(accessions);
    expect(unique.size).toBe(accessions.length);
  });

  it("filing for Labrys/Talos settlement should reference $182,243.75 and $150,000", () => {
    const labrys = APRIL_2026_FILINGS.find((f) =>
      f.accessionNumber === "0001654954-26-003548"
    );
    expect(labrys).toBeDefined();
    expect(labrys!.description).toContain("$182,243.75");
    expect(labrys!.description).toContain("$150,000");
  });

  it("filing for ConnexUs AI should reference Series E and ConnexUs AI", () => {
    const connexus = APRIL_2026_FILINGS.find((f) =>
      f.accessionNumber === "0001654954-26-003620"
    );
    expect(connexus).toBeDefined();
    expect(connexus!.description).toContain("Series E");
    expect(connexus!.description).toContain("ConnexUs AI");
  });
});
