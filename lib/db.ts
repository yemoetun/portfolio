import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.POSTGRES_URL!)

export async function getProjects() {
  const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`
  return rows
}

export async function getAchievements() {
  const rows = await sql`SELECT * FROM achievements ORDER BY featured DESC, created_at DESC`
  return rows
}

export async function getContent(key: string) {
  const rows = await sql`SELECT value FROM content WHERE key = ${key}`
  return rows[0]?.value ?? ''
}

export async function setContent(key: string, value: string) {
  await sql`INSERT INTO content (key, value) VALUES (${key}, ${value})
            ON CONFLICT (key) DO UPDATE SET value = ${value}`
}
