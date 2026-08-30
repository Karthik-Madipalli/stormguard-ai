import { NextResponse } from 'next/server'
import { saveAction } from '@/lib/stormguard/server'
export async function POST(request:Request){ const body=await request.json().catch(()=>({})); const action=String(body.action??'').trim(); const target=String(body.target??'').trim(); if(!action||!target) return NextResponse.json({error:'action and target are required'},{status:400}); try { return NextResponse.json(await saveAction(action,target),{status:201}) } catch { return NextResponse.json({error:'Action queue unavailable'},{status:503}) } }
