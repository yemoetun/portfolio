import { NextResponse } from 'next/server'
import { getContent, setContent } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key') ?? ''
  const value = await getContent(key)
  return NextResponse.json({ value })
}

export async function POST(req: Request) {
  const { key, value } = await req.json()
  await setContent(key, value)
  return NextResponse.json({ success: true })
}
