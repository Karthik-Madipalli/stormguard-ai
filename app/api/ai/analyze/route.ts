import { NextResponse } from 'next/server'
import { runAnalysis } from '@/lib/stormguard/server'
export async function POST(request:Request){ const body=await request.json().catch(()=>({})); const question=String(body.question??'').trim(); if(!question) return NextResponse.json({error:'question is required'}, {status:400}); try { const result=await runAnalysis(question); return NextResponse.json({answer:result.explanation,model:result.model,id:result.id}) } catch { return NextResponse.json({error:'AI analysis unavailable'}, {status:503}) } }
