import { NextResponse } from 'next/server'
import { networkEntities } from '@/lib/stormguard/data'
export async function GET(){ return NextResponse.json({ data: networkEntities, model: 'DEMO MODEL' }) }
