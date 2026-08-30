import { NextResponse } from 'next/server'
import { getIncident, getThreat, events } from '@/lib/stormguard/data'
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){ const {id}=await params; const incident=getIncident(id); if(!incident) return NextResponse.json({error:'Incident not found'},{status:404}); return NextResponse.json({incident,threats:incident.threatIds.map(getThreat).filter(Boolean),events:events.filter((e)=>e.incidentId===id),model:'DEMO MODEL'}) }
