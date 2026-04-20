/**
 * Tests for the SEC EDGAR auto-sync job
 *
 * These tests cover:
 * - RSS/Atom XML parsing (fetchSecEdgarFeed)
 * - Description building (buildDescription)
 * - upsertSecFiling helper (insert vs skip)
 * - syncSecEdgarFeed orchestration (mocked fetch + DB)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchSecEdgarFeed,
  buildDescription,
  syncSecEdgarFeed,
  type SecEdgarEntry,
} from "../jobs/secEdgarSync";

// ---------------------------------------------------------------------------
// Minimal valid SEC EDGAR Atom feed XML fixture
// ---------------------------------------------------------------------------
const SAMPLE_ATOM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>EDGAR Filing Search Results</title>
  <entry>
    <category label="form type" scheme="https://www.sec.gov/" term="8-K" />
    <content type="text/xml">
      <accession-number>0001654954-26-003620</accession-number>
      <filing-type>8-K</filing-type>
      <filing-date>2026-04-16</filing-date>
      <filing-href>https://www.sec.gov/Archives/edgar/data/1082733/000165495426003620/0001654954-26-003620-index.htm</filing-href>
      <form-name>Current report</form-name>
      <items-desc>items 3.02, 5.03, 8.01and9.01</items-desc>
      <size>165 KB</size>
    </content>
    <id>urn:tag:sec.gov,2008:accession-number=0001654954-26-003620</id>
    <title>8-K  - Current report</title>
    <updated>2026-04-16T16:31:14-04:00</updated>
  </entry>
  <entry>
    <category label="form type" scheme="https://www.sec.gov/" term="10-K" />
    <content type="text/xml">
      <accession-number>0001654954-25-001234</accession-number>
      <filing-type>10-K</filing-type>
      <filing-date>2025-12-15</filing-date>
      <filing-href>https://www.sec.gov/Archives/edgar/data/1082733/000165495425001234/0001654954-25-001234-index.htm</filing-href>
      <form-name>Annual report</form-name>
      <items-desc></items-desc>
      <size>2.1 MB</size>
    </content>
    <id>urn:tag:sec.gov,2008:accession-number=0001654954-25-001234</id>
    <title>10-K  - Annual report</title>
    <updated>2025-12-15T09:00:00-05:00</updated>
  </entry>
</feed>`;

// ---------------------------------------------------------------------------
// Mock global fetch for feed tests
// ---------------------------------------------------------------------------
function mockFetchOk(body: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: async () => body,
    })
  );
}

function mockFetchError(status: number, statusText: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: false,
      status,
      statusText,
      text: async () => "",
    })
  );
}

// ---------------------------------------------------------------------------
// Mock the db helper so tests don't need a real database
// ---------------------------------------------------------------------------
vi.mock("../db", () => ({
  upsertSecFiling: vi.fn().mockResolvedValue("inserted"),
}));

// ---------------------------------------------------------------------------
// Mock the notification helper
// ---------------------------------------------------------------------------
vi.mock("../_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("buildDescription", () => {
  it("combines formName and itemsDesc with em-dash separator", () => {
    const entry: SecEdgarEntry = {
      accessionNumber: "0001654954-26-003620",
      filingType: "8-K",
      filingDate: "2026-04-16",
      formName: "Current report",
      itemsDesc: "items 3.02, 5.03, 8.01and9.01",
      size: "165 KB",
      filingHref: "https://www.sec.gov/...",
      documentUrl: "https://www.sec.gov/...",
    };
    const desc = buildDescription(entry);
    expect(desc).toContain("Current report");
    expect(desc).toContain("—");
    expect(desc).toContain("items 3.02");
  });

  it("normalises 'Xand Y' → 'X and Y' in itemsDesc", () => {
    const entry: SecEdgarEntry = {
      accessionNumber: "0001654954-26-003620",
      filingType: "8-K",
      filingDate: "2026-04-16",
      formName: "Current report",
      itemsDesc: "items 3.02, 5.03and9.01",
      size: "165 KB",
      filingHref: "",
      documentUrl: "",
    };
    const desc = buildDescription(entry);
    expect(desc).toContain("5.03 and 9.01");
    expect(desc).not.toContain("5.03and9.01");
  });

  it("returns only formName when itemsDesc is empty", () => {
    const entry: SecEdgarEntry = {
      accessionNumber: "0001654954-25-001234",
      filingType: "10-K",
      filingDate: "2025-12-15",
      formName: "Annual report",
      itemsDesc: "",
      size: "2.1 MB",
      filingHref: "",
      documentUrl: "",
    };
    const desc = buildDescription(entry);
    expect(desc).toBe("Annual report");
    expect(desc).not.toContain("—");
  });
});

describe("fetchSecEdgarFeed", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("parses a valid Atom feed and returns the correct number of entries", async () => {
    mockFetchOk(SAMPLE_ATOM_XML);
    const entries = await fetchSecEdgarFeed();
    expect(entries).toHaveLength(2);
  });

  it("correctly extracts accessionNumber, filingType, filingDate from the feed", async () => {
    mockFetchOk(SAMPLE_ATOM_XML);
    const entries = await fetchSecEdgarFeed();
    const first = entries[0];
    expect(first.accessionNumber).toBe("0001654954-26-003620");
    expect(first.filingType).toBe("8-K");
    expect(first.filingDate).toBe("2026-04-16");
  });

  it("extracts size and filingHref correctly", async () => {
    mockFetchOk(SAMPLE_ATOM_XML);
    const entries = await fetchSecEdgarFeed();
    const first = entries[0];
    expect(first.size).toBe("165 KB");
    expect(first.filingHref).toContain("0001654954-26-003620-index.htm");
  });

  it("sets documentUrl equal to filingHref (index page)", async () => {
    mockFetchOk(SAMPLE_ATOM_XML);
    const entries = await fetchSecEdgarFeed();
    expect(entries[0].documentUrl).toBe(entries[0].filingHref);
  });

  it("throws when the HTTP response is not OK", async () => {
    mockFetchError(503, "Service Unavailable");
    await expect(fetchSecEdgarFeed()).rejects.toThrow("HTTP 503");
  });

  it("returns an empty array for a feed with no entries", async () => {
    const emptyFeed = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"></feed>`;
    mockFetchOk(emptyFeed);
    const entries = await fetchSecEdgarFeed();
    expect(entries).toHaveLength(0);
  });

  it("skips entries that have no accession number", async () => {
    const malformedFeed = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
      <entry>
        <content type="text/xml">
          <accession-number></accession-number>
          <filing-type>8-K</filing-type>
          <filing-date>2026-04-16</filing-date>
        </content>
      </entry>
    </feed>`;
    mockFetchOk(malformedFeed);
    const entries = await fetchSecEdgarFeed();
    expect(entries).toHaveLength(0);
  });
});

describe("syncSecEdgarFeed", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns correct counts when all filings are new", async () => {
    mockFetchOk(SAMPLE_ATOM_XML);
    const { upsertSecFiling } = await import("../db");
    vi.mocked(upsertSecFiling).mockResolvedValue("inserted");

    const result = await syncSecEdgarFeed();
    expect(result.fetched).toBe(2);
    expect(result.inserted).toBe(2);
    expect(result.skipped).toBe(0);
    expect(result.errors).toBe(0);
  });

  it("returns correct counts when all filings already exist", async () => {
    mockFetchOk(SAMPLE_ATOM_XML);
    const { upsertSecFiling } = await import("../db");
    vi.mocked(upsertSecFiling).mockResolvedValue("skipped");

    const result = await syncSecEdgarFeed();
    expect(result.fetched).toBe(2);
    expect(result.inserted).toBe(0);
    expect(result.skipped).toBe(2);
    expect(result.errors).toBe(0);
  });

  it("counts errors when upsertSecFiling throws", async () => {
    mockFetchOk(SAMPLE_ATOM_XML);
    const { upsertSecFiling } = await import("../db");
    vi.mocked(upsertSecFiling).mockRejectedValue(new Error("DB error"));

    const result = await syncSecEdgarFeed();
    expect(result.errors).toBe(2);
    expect(result.inserted).toBe(0);
  });

  it("handles a fatal fetch error gracefully", async () => {
    mockFetchError(500, "Internal Server Error");

    const result = await syncSecEdgarFeed();
    expect(result.fetched).toBe(0);
    expect(result.errors).toBe(1);
  });

  it("calls notifyOwner when new filings are inserted", async () => {
    mockFetchOk(SAMPLE_ATOM_XML);
    const { upsertSecFiling } = await import("../db");
    vi.mocked(upsertSecFiling).mockResolvedValue("inserted");
    const { notifyOwner } = await import("../_core/notification");

    await syncSecEdgarFeed();
    expect(notifyOwner).toHaveBeenCalledOnce();
    const call = vi.mocked(notifyOwner).mock.calls[0][0];
    expect(call.title).toContain("2 new filings");
  });

  it("does NOT call notifyOwner when no new filings are found", async () => {
    mockFetchOk(SAMPLE_ATOM_XML);
    const { upsertSecFiling } = await import("../db");
    vi.mocked(upsertSecFiling).mockResolvedValue("skipped");
    const { notifyOwner } = await import("../_core/notification");
    vi.mocked(notifyOwner).mockClear();

    await syncSecEdgarFeed();
    expect(notifyOwner).not.toHaveBeenCalled();
  });
});
