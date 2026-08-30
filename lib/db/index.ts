import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { schema } from './schema'

const globalForDb = globalThis as unknown as { stormguardPool?: Pool }
export const pool = globalForDb.stormguardPool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
if (process.env.NODE_ENV !== 'production') globalForDb.stormguardPool = pool
export const db = drizzle(pool, { schema })
