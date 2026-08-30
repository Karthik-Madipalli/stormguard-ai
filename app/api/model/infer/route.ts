import { NextResponse } from "next/server"
import { spawn } from "node:child_process"
import path from "node:path"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.features || typeof body.features !== "object") {
      return NextResponse.json(
        { error: "features object is required" },
        { status: 400 }
      )
    }

    const script = path.join(process.cwd(), "ml", "infer.py")

    const result = await new Promise<string>((resolve, reject) => {
      const python = spawn(
        process.env.PYTHON_BIN || "python",
        [script],
        {
          cwd: process.cwd(),
          env: {
            ...process.env,
            STORMGUARD_FEATURES: JSON.stringify(body.features),
          },
        }
      )

      let stdout = ""
      let stderr = ""

      python.stdout.on("data", d => {
        stdout += d.toString()
      })

      python.stderr.on("data", d => {
        stderr += d.toString()
      })

      python.on("close", code => {
        if (code === 0) resolve(stdout)
        else reject(new Error(stderr || `Python exited with ${code}`))
      })
    })

    return NextResponse.json(JSON.parse(result))
  } catch (error) {
    return NextResponse.json(
      {
        error: "Model inference unavailable",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    )
  }
}