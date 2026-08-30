import { NextResponse } from 'next/server'
import { getIncident } from '@/lib/stormguard/server'
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){ const {id}=await params; try { const result=await getIncident(id); if(!result.incident) return NextResponse.json({error:'Incident not found'},{status:404}); return NextResponse.json({...result,model:'DEMO MODEL · Neon'}) } catch { return NextResponse.json({error:'Database unavailable'},{status:503}) } }
