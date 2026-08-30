import { NextResponse } from 'next/server'
import { events } from '@/lib/stormguard/data'
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){ const {id}=await params; return NextResponse.json({data:events.filter((e)=>e.incidentId===id),model:'DEMO MODEL'}) }
