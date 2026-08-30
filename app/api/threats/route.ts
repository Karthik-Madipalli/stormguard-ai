import { NextResponse } from 'next/server'
import { threats } from '@/lib/stormguard/data'
export async function GET(){ return NextResponse.json({ data: threats, model: 'DEMO MODEL' }) }
