/**
 * Seed script: Insert the 5 new 8-K filings (April 2026) into the sec_filings table.
 * Run with: node scripts/seed-new-8k-filings.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set.");
  process.exit(1);
}

async function seedNewFilings() {
  const connection = await mysql.createConnection(DATABASE_URL);

  const filings = [
    {
      filingType: "8-K",
      filingDate: "2026-04-07",
      accessionNumber: "0001654954-26-003315",
      description:
        "Current report, items 5.02, 5.03, and 3.03 — Departure of Directors; Amendments to Articles of Incorporation (Certificates of Designation for Series A and Series B Convertible Preferred Stock; adoption of non-waivable Conversion Gates)",
      size: "N/A",
      documentUrl:
        "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003315/vism_8k.htm",
    },
    {
      filingType: "8-K",
      filingDate: "2026-04-10",
      accessionNumber: "0001654954-26-003548",
      description:
        "Current report, item 1.01 — Entry into a Material Definitive Agreement: full settlement and extinguishment of Labrys Notes (~$182,243.75) and 5,112,426 Talos Warrants for a single payment of $150,000, eliminating all conversion overhang and derivative liabilities",
      size: "N/A",
      documentUrl:
        "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003548/vism_8k.htm",
    },
    {
      filingType: "8-K",
      filingDate: "2026-04-14",
      accessionNumber: "0001654954-26-003578",
      description:
        "Current report, items 3.02 and 5.03 — Unregistered issuance of 1,597,868 shares of Series D Callable Convertible Preferred Stock to ~40 accredited investors in exchange for full cancellation of $1,597,868.39 in outstanding indebtedness (promissory notes and accrued officer payables); conversion price fixed at $0.05 per common share",
      size: "N/A",
      documentUrl:
        "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003578/vism_8k.htm",
    },
    {
      filingType: "8-K",
      filingDate: "2026-04-14",
      accessionNumber: "0001654954-26-003579",
      description:
        "Current report, items 5.03, 3.02, and 8.01 — Designation of Series G Governing Preferred Stock (4 shares issued to existing Series AA holders as senior-most class); adoption of 125-day voluntary Remediation Plan for legacy Series A and B Preferred Stock; conclusion that Series A/B conversion probability is remote for EPS purposes",
      size: "N/A",
      documentUrl:
        "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003579/vism_8k.htm",
    },
    {
      filingType: "8-K",
      filingDate: "2026-04-16",
      accessionNumber: "0001654954-26-003620",
      description:
        "Current report, items 3.02, 5.03, and 8.01 — Designation of Series E Convertible Preferred Stock ($750 stated value, 8% cumulative dividend, fixed conversion at $0.05/share representing 40% fully diluted equity) to be issued in connection with the pending acquisition of 100% of ConnexUs AI (DE) pursuant to the LOI dated March 29, 2026",
      size: "N/A",
      documentUrl:
        "https://www.sec.gov/Archives/edgar/data/1082733/000165495426003620/vism_8k.htm",
    },
  ];

  console.log("📝 Inserting 5 new 8-K filings (April 2026)...\n");

  for (const filing of filings) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO sec_filings 
         (filingType, filingDate, accessionNumber, description, size, documentUrl, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          filing.filingType,
          filing.filingDate,
          filing.accessionNumber,
          filing.description,
          filing.size,
          filing.documentUrl,
        ]
      );
      console.log(`  ✓ Inserted 8-K (${filing.filingDate}): ${filing.accessionNumber}`);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        console.log(`  ℹ️  Already exists: ${filing.accessionNumber}`);
      } else {
        throw error;
      }
    }
  }

  console.log("\n✅ Done — 5 new 8-K filings inserted successfully.");
  await connection.end();
}

seedNewFilings().catch((err) => {
  console.error("❌ Fatal error:", err.message);
  process.exit(1);
});
