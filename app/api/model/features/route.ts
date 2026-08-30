import { NextResponse } from 'next/server'
import { featureContributions } from '@/lib/stormguard/data'
export async function GET(){ return NextResponse.json({ model: 'DEMO MODEL', data: featureContributions }) }
