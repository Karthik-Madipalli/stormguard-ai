import { NextResponse } from 'next/server'
import { listThreats } from '@/lib/stormguard/server'
export async function GET(){ try { return NextResponse.json({ data: await listThreats(), model:'DEMO MODEL · Neon' }) } catch { return NextResponse.json({ error:'Database unavailable' }, { status:503 }) } }
