import { NextResponse } from 'next/server'
import { incidents } from '@/lib/stormguard/data'
export async function GET(){ return NextResponse.json({ data: incidents, model: 'DEMO MODEL' }) }
