import { NextResponse } from "next/server"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

export async function GET() {
  const file = path.join(
    process.cwd(),
    "ml",
    "artifacts",
    "clusters.json"
  )

  if (!existsSync(file)) {
    return NextResponse.json(
      {
        error: "Clusters not generated",
        command: "python ml/cluster.py",
      },
      { status: 503 }
    )
  }

  return NextResponse.json(
    JSON.parse(readFileSync(file, "utf8"))
  )
}