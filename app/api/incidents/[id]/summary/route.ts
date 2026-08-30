import { NextResponse } from "next/server"
import { getIncident } from "@/lib/stormguard/server"
import { generateIncidentSummary } from "@/lib/ai"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const incident = await getIncident(id)

    if (!incident.incident) {
      return NextResponse.json(
        { error: "Incident not found" },
        { status: 404 }
      )
    }

    const summary = await generateIncidentSummary(incident)

    return NextResponse.json({
      incidentId: id,
      summary,
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      generated: true,
    })
  } catch {
    return NextResponse.json(
      { error: "AI summary unavailable" },
      { status: 503 }
    )
  }
}