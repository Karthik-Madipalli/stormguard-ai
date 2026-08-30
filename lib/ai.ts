import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateIncidentSummary(input: {
  incident: unknown
  threats: unknown[]
  events: unknown[]
}) {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
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