import { NextResponse } from 'next/server'
import { runAnalysis } from '@/lib/stormguard/server'
export async function POST(request:Request){ const body=await request.json().catch(()=>({})); const question=String(body.question??'').trim(); if(!question) return NextResponse.json({error:'question is required'}, {status:400}); try { return NextResponse.json(await runAnalysis(question)) } catch { return NextResponse.json({error:'Analysis persistence unavailable'}, {status:503}) } }
