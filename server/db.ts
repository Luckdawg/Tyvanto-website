import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, NewSecFiling, users, secFilings } from "../drizzle/schema";
import { ENV } from './_core/env';
import { ADMIN_EMAILS } from '../shared/const';
import mysql from 'mysql2/promise';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql.Pool | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// Get the MySQL connection pool for raw SQL queries
async function getPool() {
  if (!_pool && process.env.DATABASE_URL) {
    try {
      _pool = mysql.createPool(process.env.DATABASE_URL);
    } catch (error) {
      console.error("[Database] Failed to create pool:", error);
      _pool = null;
    }
  }
  return _pool;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    // Determine the role to assign:
    // 1. Caller explicitly passed a role → honour it.
    // 2. User's email is in the ADMIN_EMAILS allow-list → auto-promote to admin.
    // 3. User is the site owner (by openId) → admin.
    // 4. Otherwise leave the default ('user') set by the schema.
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.email && ADMIN_EMAILS.has(user.email.toLowerCase())) {
      values.role = 'admin';
      updateSet.role = 'admin';
      console.log(`[Auth] Auto-promoted ${user.email} to admin (ADMIN_EMAILS match)`);
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Helper function to execute raw SQL queries
export async function executeRawSQL(sql: string, params: any[] = []): Promise<any> {
  const pool = await getPool();
  if (!pool) {
    throw new Error("Database pool not available");
  }
  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(sql, params);
      return result;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("[Database] SQL execution error:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.

/**
 * Upsert a single SEC filing by accession number (unique key).
 * Returns 'inserted' if a new row was created, 'skipped' if it already existed.
 */
export async function upsertSecFiling(
  filing: Omit<NewSecFiling, 'id' | 'createdAt' | 'updatedAt'>
): Promise<'inserted' | 'skipped'> {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot upsert SEC filing: database not available');
    return 'skipped';
  }

  try {
    // Check if the filing already exists by accession number
    const existing = await db
      .select({ id: secFilings.id })
      .from(secFilings)
      .where(eq(secFilings.accessionNumber, filing.accessionNumber))
      .limit(1);

    if (existing.length > 0) {
      return 'skipped';
    }

    await db.insert(secFilings).values({
      filingType: filing.filingType,
      filingDate: filing.filingDate,
      accessionNumber: filing.accessionNumber,
      fileNumber: filing.fileNumber ?? null,
      description: filing.description ?? null,
      documentUrl: filing.documentUrl ?? null,
      size: filing.size ?? null,
    });

    return 'inserted';
  } catch (error) {
    console.error('[Database] Failed to upsert SEC filing:', error);
    throw error;
  }
}
