#!/usr/bin/env node

/**
 * SEC Filings Seeding Script
 * Populates the database with the latest SEC filings for Visium Technologies
 * 
 * Usage: node scripts/seed-sec-filings.mjs
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

// Parse MySQL connection string
function parseConnectionString(url) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  };
}

async function seedSecFilings() {
  const config = parseConnectionString(DATABASE_URL);
  const connection = await mysql.createConnection({
    ...config,
    ssl: {},
  });

  try {
    console.log('🌱 Starting SEC filings seeding...\n');

    // Latest SEC filings for Visium Technologies (as of Feb 27, 2026)
    const filings = [
      {
        filingType: '10-Q',
        filingDate: '2026-02-20',
        accessionNumber: '0001654954-26-001435',
        description: 'Quarterly report [Sections 13 or 15(d)]',
        size: '4 MB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-26-001435&xbrl_type=v',
      },
      {
        filingType: 'NT 10-Q',
        filingDate: '2026-02-18',
        accessionNumber: '0001654954-26-001326',
        description: 'Notification of inability to timely file Form 10-Q or 10-QSB',
        size: '22 KB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-26-001326&xbrl_type=v',
      },
      {
        filingType: '10-K',
        filingDate: '2025-10-07',
        accessionNumber: '0001654954-25-011506',
        description: 'Annual report [Section 13 and 15(d), not S-K Item 405]',
        size: '5 MB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-25-011506&xbrl_type=v',
      },
      {
        filingType: 'NT 10-K',
        filingDate: '2025-09-30',
        accessionNumber: '0001654954-25-011247',
        description: 'Notification of inability to timely file Form 10-K 405, 10-K, 10-KSB 405, 10-KSB, 10-KT, or 10-KT405',
        size: '24 KB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-25-011247&xbrl_type=v',
      },
      {
        filingType: '8-K',
        filingDate: '2025-08-19',
        accessionNumber: '0001654954-25-009790',
        description: 'Current report, items 1.01, 2.03, 3.02, and 9.01',
        size: '486 KB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-25-009790&xbrl_type=v',
      },
      {
        filingType: '8-K/A',
        filingDate: '2025-06-30',
        accessionNumber: '0001654954-25-007532',
        description: '[Amend] Current report, item 4.01',
        size: '132 KB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-25-007532&xbrl_type=v',
      },
      {
        filingType: '8-K',
        filingDate: '2025-06-26',
        accessionNumber: '0001654954-25-007443',
        description: 'Current report, items 4.01 and 9.01',
        size: '136 KB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-25-007443&xbrl_type=v',
      },
      {
        filingType: '10-Q',
        filingDate: '2025-05-15',
        accessionNumber: '0001654954-25-005761',
        description: 'Quarterly report [Sections 13 or 15(d)]',
        size: '4 MB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-25-005761&xbrl_type=v',
      },
      {
        filingType: '8-K',
        filingDate: '2025-05-09',
        accessionNumber: '0001654954-25-005368',
        description: 'Current report, items 4.01 and 9.01',
        size: '162 KB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-25-005368&xbrl_type=v',
      },
      {
        filingType: '10-Q',
        filingDate: '2025-02-14',
        accessionNumber: '0001654954-25-001579',
        description: 'Quarterly report [Sections 13 or 15(d)]',
        size: '4 MB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-25-001579&xbrl_type=v',
      },
      {
        filingType: '10-Q',
        filingDate: '2024-11-14',
        accessionNumber: '0001654954-24-014469',
        description: 'Quarterly report [Sections 13 or 15(d)]',
        size: '4 MB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-24-014469&xbrl_type=v',
      },
      {
        filingType: '8-K',
        filingDate: '2024-10-21',
        accessionNumber: '0001654954-24-013160',
        description: 'Current report, item 5.03',
        size: '138 KB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-24-013160&xbrl_type=v',
      },
      {
        filingType: '10-K',
        filingDate: '2024-09-30',
        accessionNumber: '0001654954-24-012507',
        description: 'Annual report [Section 13 and 15(d), not S-K Item 405]',
        size: '6 MB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-24-012507&xbrl_type=v',
      },
      {
        filingType: '8-K',
        filingDate: '2024-07-31',
        accessionNumber: '0001654954-24-009661',
        description: 'Current report, items 5.02 and 9.01',
        size: '154 KB',
        documentUrl: 'https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001082733&accession_number=0001654954-24-009661&xbrl_type=v',
      },
    ];

    console.log('📝 Seeding SEC filings...');
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
        console.log(`  ✓ Added ${filing.filingType} (${filing.filingDate}): ${filing.accessionNumber}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`  ℹ️  ${filing.filingType} (${filing.accessionNumber}) already exists`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ SEC filings seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding SEC filings:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedSecFilings();
