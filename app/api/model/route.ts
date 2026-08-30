import { NextResponse } from 'next/server'
import { modelMetrics, mlPipeline, postgresEntities } from '@/lib/stormguard/data'
export async function GET(){ return NextResponse.json({metrics:modelMetrics,pipeline:mlPipeline,entities:postgresEntities,model:'DEMO MODEL · Neon'}) }
