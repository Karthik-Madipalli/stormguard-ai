import { NextResponse } from 'next/server'
import { modelMetrics } from '@/lib/stormguard/data'
export async function GET(){ return NextResponse.json(modelMetrics) }
