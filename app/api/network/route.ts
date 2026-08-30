import { NextResponse } from 'next/server'
import { listNetwork } from '@/lib/stormguard/server'
export async function GET(){ try { return NextResponse.json({ data: await listNetwork(), model:'DEMO MODEL · Neon' }) } catch { return NextResponse.json({ error:'Database unavailable' }, { status:503 }) } }
