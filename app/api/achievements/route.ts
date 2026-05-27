import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getAchievements } from '@/lib/db'

const sql = neon(process.env.POSTGRES_URL!)

export async function GET() {
  const achievements = await getAchievements()
  return NextResponse.json(achievements)
}

export async function POST(req: Request) {
  const { title, description, full_description, image_url, featured } = await req.json()
  await sql`INSERT INTO achievements (title, description, full_description, image_url, featured)
            VALUES (${title}, ${description}, ${full_description ?? ''}, ${image_url}, ${featured ?? false})`
  return NextResponse.json({ success: true }, { status: 201 })
}

export async function PATCH(req: Request) {
  const { id, title, description, full_description, image_url, featured } = await req.json()
  await sql`UPDATE achievements SET
    title=${title}, description=${description}, full_description=${full_description ?? ''},
    image_url=${image_url}, featured=${featured}
    WHERE id=${id}`
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await sql`DELETE FROM achievements WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
