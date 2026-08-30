import { NextResponse } from 'next/server'
import { analyzePhishing } from '@/lib/stormguard/data'
export async function POST(request: Request){ const body = await request.json().catch(()=>({})); return NextResponse.json(analyzePhishing(String(body.text ?? ''))) }
