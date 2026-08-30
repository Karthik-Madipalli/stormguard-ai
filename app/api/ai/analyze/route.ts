import { NextResponse } from 'next/server'
import { analyzeQuestion } from '@/lib/stormguard/data'
export async function POST(request:Request){const body=await request.json().catch(()=>({})); return NextResponse.json({answer:analyzeQuestion(String(body.question??'')),model:'DEMO MODEL',source:'deterministic demo corpus'})}
