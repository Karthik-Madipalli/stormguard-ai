import { NextResponse } from 'next/server'
import { listIncidents } from '@/lib/stormguard/server'
export async function GET(){ try { return NextResponse.json({ data: await listIncidents(), model:'DEMO MODEL · Neon' }) } catch { return NextResponse.json({ error:'Database unavailable' }, { status:503 }) } }
