import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    
    // Try to connect and run a simple command using the correct syntax
    const adminDb = client.db("admin")
    const result = await adminDb.command({ ping: 1 })
    
    // Check if rms database exists
    const dbList = await client.db().admin().listDatabases()
    const hasRmsDb = dbList.databases.some(db => db.name === "rms")
    
    // Check collections in rms database
    let collections = []
    if (hasRmsDb) {
      const db = client.db("rms")
      collections = await db.listCollections().toArray()
      collections = collections.map(c => c.name)
    }
    
    return NextResponse.json({
      connected: true,
      ping: result.ok === 1 ? "success" : "failed",
      hasRmsDb,
      collections,
      mongodbUri: process.env.MONGODB_URI ? "configured" : "not configured"
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({
      connected: false,
      error: error.message,
      mongodbUri: process.env.MONGODB_URI ? "configured" : "not configured"
    }, { status: 500 })
  }
}

