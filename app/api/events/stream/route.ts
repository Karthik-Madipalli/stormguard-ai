import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const events = [
  {
    type: "RECONNAISSANCE",
    severity: "MEDIUM",
    source: "10.24.7.81",
    target: "10.24.3.21",
  },
  {
    type: "ANOMALY",
    severity: "HIGH",
    source: "10.24.7.81",
    target: "10.24.3.21",
  },
  {
    type: "EXPLOIT",
    severity: "CRITICAL",
    source: "10.24.7.81",
    target: "10.24.3.21",
  },
  {
    type: "LATERAL_MOVEMENT",
    severity: "CRITICAL",
    source: "10.24.3.21",
    target: "10.24.5.44",
  },
]

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let index = 0

      const send = () => {
        const event = {
          id: `LIVE-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...events[index % events.length],
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify(event)}\n\n`
          )
        )

        index++
      }

      send()

      const interval = setInterval(send, 4000)

      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}