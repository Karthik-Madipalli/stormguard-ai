import { NextResponse } from 'next/server'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { modelMetrics, mlPipeline, postgresEntities } from '@/lib/stormguard/data'

export async function GET() {
  const metricsPath = path.join(process.cwd(), 'ml', 'artifacts', 'metrics.json')
  const trained = existsSync(metricsPath)
  const metrics = trained ? JSON.parse(readFileSync(metricsPath, 'utf8')) : modelMetrics
  return NextResponse.json({
    metrics,
    pipeline: mlPipeline,
    entities: postgresEntities,
    status: trained ? 'TRAINED_ARTIFACT_AVAILABLE' : 'TRAINING_REQUIRED',
    demoFallback: !trained,
    source: 'UNSW-NB15 official dataset; run python ml/download_unsw.py && python ml/train.py',
  })
}
