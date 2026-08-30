import OpenAI from "openai"

type IncidentSummaryInput = {
  incident: unknown
  threats: unknown[]
  events: unknown[]
}

export async function generateIncidentSummary(
  input: IncidentSummaryInput
) {
  const apiKey = process.env.OPENAI_API_KEY

  // Safe demo fallback when OpenAI is not configured.
  if (!apiKey) {
    return generateDemoSummary(input)
  }

  const client = new OpenAI({
    apiKey,
  })

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    instructions: `
You are ODIN CORE, an AI cybersecurity analyst.

Analyze the supplied security incident.

Return:
1. Executive summary
2. Why it is dangerous
3. Attack progression
4. Evidence
5. Recommended analyst actions

Be concise and technically precise.
Never invent evidence that is not present in the supplied data.
`,
    input: JSON.stringify(input),
  })

  return response.output_text
}

function generateDemoSummary(
  input: IncidentSummaryInput
) {
  const incident = input.incident as {
    title?: string
    severity?: string
    summary?: string
  } | undefined

  const threatCount = input.threats?.length ?? 0
  const eventCount = input.events?.length ?? 0

  return [
    `Incident: ${incident?.title ?? "Security Incident"}`,
    `Severity: ${incident?.severity ?? "UNKNOWN"}`,
    "",
    incident?.summary ??
      "Security activity requires analyst investigation.",
    "",
    `Evidence: ${threatCount} associated threat(s) and ${eventCount} event(s).`,
    "",
    "Recommended actions:",
    "1. Validate the affected asset and source activity.",
    "2. Review the associated attack timeline.",
    "3. Investigate high-risk indicators.",
    "4. Contain confirmed malicious activity.",
    "",
    "MODE: DEMO ANALYSIS — OpenAI API key not configured.",
  ].join("\n")
}