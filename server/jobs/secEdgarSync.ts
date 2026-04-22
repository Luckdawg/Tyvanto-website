/**
 * SEC EDGAR Auto-Sync Job
 *
 * Polls the SEC EDGAR Atom feed for Visium Technologies (CIK 1082733) once per day
 * and upserts any new filings into the sec_filings table.
 *
 * Feed URL:
 *   https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=1082733
 *     &type=&dateb=&owner=include&count=40&search_text=&output=atom
 *
 * Each Atom <entry> contains:
 *   <accession-number>, <filing-type>, <filing-date>, <form-name>,
 *   <items-desc>, <size>, <filing-href>
 */

import { XMLParser } from "fast-xml-parser";
import { upsertSecFiling } from "../db";
import { notifyOwner } from "../_core/notification";

const SEC_CIK = "1082733";
const FEED_URL =
  `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${SEC_CIK}` +
  `&type=&dateb=&owner=include&count=40&search_text=&output=atom`;

const USER_AGENT =
  "VisiumTechnologies-AutoSync/1.0 (info@tyvanto.com)";

/** A single parsed entry from the SEC EDGAR Atom feed */
export interface SecEdgarEntry {
  accessionNumber: string;
  filingType: string;
  filingDate: string; // YYYY-MM-DD
  formName: string;
  itemsDesc: string;
  size: string;
  filingHref: string; // index page URL
  documentUrl: string; // direct document URL (derived)
}

/**
 * Fetch and parse the SEC EDGAR Atom feed for the configured CIK.
 * Returns an array of parsed entries sorted newest-first.
 */
export async function fetchSecEdgarFeed(): Promise<SecEdgarEntry[]> {
  const res = await fetch(FEED_URL, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/atom+xml, application/xml, text/xml",
    },
  });

  if (!res.ok) {
    throw new Error(
      `SEC EDGAR feed returned HTTP ${res.status}: ${res.statusText}`
    );
  }

  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
    trimValues: true,
    // SEC feed uses hyphenated tag names inside <content> — preserve them
    parseAttributeValue: false,
  });

  const parsed = parser.parse(xml);
  const feed = parsed?.feed;
  if (!feed) throw new Error("Unexpected feed structure: missing <feed> root");

  const rawEntries: unknown[] = Array.isArray(feed.entry)
    ? feed.entry
    : feed.entry
    ? [feed.entry]
    : [];

  const entries: SecEdgarEntry[] = [];

  for (const raw of rawEntries) {
    const entry = raw as Record<string, unknown>;
    const content = entry.content as Record<string, unknown> | undefined;
    if (!content) continue;

    const accessionNumber = String(content["accession-number"] ?? "").trim();
    const filingType = String(content["filing-type"] ?? "").trim();
    const filingDate = String(content["filing-date"] ?? "").trim();
    const formName = String(content["form-name"] ?? "").trim();
    const itemsDesc = String(content["items-desc"] ?? "").trim();
    const size = String(content["size"] ?? "N/A").trim();
    const filingHref = String(content["filing-href"] ?? "").trim();

    if (!accessionNumber || !filingDate) continue;

    // Derive the direct document URL from the index href.
    // Index URL pattern: .../000165495426003620/0001654954-26-003620-index.htm
    // Document URL pattern: .../000165495426003620/vism_8k.htm  (or vism_10k.htm, etc.)
    // We use the index URL as documentUrl — it always works and links to the full filing.
    const documentUrl = filingHref || "";

    entries.push({
      accessionNumber,
      filingType,
      filingDate,
      formName,
      itemsDesc,
      size,
      filingHref,
      documentUrl,
    });
  }

  return entries;
}

/**
 * Build a human-readable description from the feed entry.
 * Example: "Current report — items 3.02, 5.03, 8.01 and 9.01"
 */
export function buildDescription(entry: SecEdgarEntry): string {
  const parts: string[] = [];
  if (entry.formName) parts.push(entry.formName);
  if (entry.itemsDesc) {
    // Normalise "items 3.02, 5.03and9.01" → "items 3.02, 5.03 and 9.01"
    const cleaned = entry.itemsDesc
      .replace(/(\d)and(\d)/g, "$1 and $2")
      .replace(/\s+/g, " ")
      .trim();
    parts.push(cleaned);
  }
  return parts.join(" — ");
}

/**
 * Sync the SEC EDGAR feed into the database.
 * Returns a summary of what was inserted vs already present.
 */
export async function syncSecEdgarFeed(): Promise<{
  fetched: number;
  inserted: number;
  skipped: number;
  errors: number;
}> {
  console.log("[SecEdgarSync] Starting daily SEC EDGAR feed sync…");

  let fetched = 0;
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  try {
    const entries = await fetchSecEdgarFeed();
    fetched = entries.length;
    console.log(`[SecEdgarSync] Fetched ${fetched} entries from EDGAR feed`);

    for (const entry of entries) {
      try {
        const description = buildDescription(entry);
        const result = await upsertSecFiling({
          filingType: entry.filingType,
          filingDate: new Date(entry.filingDate),
          accessionNumber: entry.accessionNumber,
          fileNumber: null,
          description,
          documentUrl: entry.documentUrl,
          size: entry.size,
        });

        if (result === "inserted") {
          inserted++;
          console.log(
            `[SecEdgarSync] ✓ Inserted ${entry.filingType} (${entry.filingDate}): ${entry.accessionNumber}`
          );
        } else {
          skipped++;
        }
      } catch (err) {
        errors++;
        console.error(
          `[SecEdgarSync] ✗ Error upserting ${entry.accessionNumber}:`,
          err
        );
      }
    }
  } catch (err) {
    console.error("[SecEdgarSync] Fatal error fetching feed:", err);
    errors++;
  }

  const summary = { fetched, inserted, skipped, errors };
  console.log("[SecEdgarSync] Sync complete:", summary);

  // Notify the site owner if any new filings were inserted
  if (inserted > 0) {
    try {
      await notifyOwner({
        title: `SEC EDGAR Sync: ${inserted} new filing${inserted > 1 ? "s" : ""} added`,
        content:
          `The daily SEC EDGAR sync for Visium Technologies (CIK ${SEC_CIK}) ` +
          `found and inserted ${inserted} new filing${inserted > 1 ? "s" : ""} ` +
          `out of ${fetched} total entries. ` +
          `${skipped} were already present. ` +
          (errors > 0 ? `${errors} error(s) occurred.` : "No errors."),
      });
    } catch {
      // Non-fatal: notification failure should not fail the sync
    }
  }

  return summary;
}

/**
 * Start the daily SEC EDGAR sync scheduler.
 * Runs once at startup (to catch up on any missed filings) and then
 * every 24 hours thereafter.  The production cron expression is
 * "0 10 * * *" (06:00 ET = 10:00 UTC) but we use setInterval here
 * to stay consistent with the existing emailCampaignJob pattern and
 * avoid adding a new dependency.
 */
export function startSecEdgarSyncScheduler(): void {
  // Run once immediately on startup
  syncSecEdgarFeed().catch(console.error);

  // Then run every 24 hours
  const intervalMs = 24 * 60 * 60 * 1000;
  setInterval(() => {
    syncSecEdgarFeed().catch(console.error);
  }, intervalMs);

  console.log(
    "[SecEdgarSync] Scheduler started — runs every 24 hours (next run in 24 h)"
  );
}
