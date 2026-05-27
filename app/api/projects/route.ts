import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getProjects } from '@/lib/db'

const sql = neon(process.env.POSTGRES_URL!)

export async function GET() {
  const projects = await getProjects()
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const { title, description, full_description, tags, repo_url, image_url } = await req.json()
  await sql`INSERT INTO projects (title, description, full_description, tags, repo_url, image_url)
            VALUES (${title}, ${description}, ${full_description ?? ''}, ${tags}, ${repo_url}, ${image_url})`
  return NextResponse.json({ success: true }, { status: 201 })
}

export async function PATCH(req: Request) {
  const { id, title, description, full_description, tags, repo_url, image_url } = await req.json()
  await sql`UPDATE projects SET
    title=${title}, description=${description}, full_description=${full_description ?? ''},
    tags=${tags}, repo_url=${repo_url}, image_url=${image_url}
    WHERE id=${id}`
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await sql`DELETE FROM projects WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
