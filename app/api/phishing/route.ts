import { NextResponse } from 'next/server'
import { runAnalysis } from '@/lib/stormguard/server'
export async function POST(request:Request){ const body=await request.json().catch(()=>({})); const text=String(body.text??'').trim(); if(!text) return NextResponse.json({error:'text is required'}, {status:400}); try { return NextResponse.json(await runAnalysis(text,true)) } catch { return NextResponse.json({error:'Analysis persistence unavailable'}, {status:503}) } }
