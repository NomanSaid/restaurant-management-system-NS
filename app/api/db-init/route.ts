import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("rms")
    
    // Create collections with initial data
    
    // 1. Create tables collection
    const tablesExist = await db.listCollections({ name: "tables" }).hasNext()
    if (!tablesExist) {
      await db.createCollection("tables")
      await db.collection("tables").insertMany([
        { number: 1, capacity: 4, status: "available" },
        { number: 2, capacity: 2, status: "available" },
        { number: 3, capacity: 6, status: "available" },
        { number: 4, capacity: 4, status: "available" }
      ])
    }
    
    // 2. Create menuItems collection
    const menuItemsExist = await db.listCollections({ name: "menuItems" }).hasNext()
    if (!menuItemsExist) {
      await db.createCollection("menuItems")
      await db.collection("menuItems").insertMany([
        { name: "Burger", category: "Main", price: 9.99, description: "Classic beef burger" },
        { name: "Pizza", category: "Main", price: 12.99, description: "Margherita pizza" },
        { name: "Salad", category: "Starter", price: 5.99, description: "Fresh garden salad" },
        { name: "Ice Cream", category: "Dessert", price: 4.99, description: "Vanilla ice cream" }
      ])
    }
    
    // 3. Create orders collection
    const ordersExist = await db.listCollections({ name: "orders" }).hasNext()
    if (!ordersExist) {
      await db.createCollection("orders")
    }
    
    // 4. Create inventory collection
    const inventoryExist = await db.listCollections({ name: "inventory" }).hasNext()
    if (!inventoryExist) {
      await db.createCollection("inventory")
      await db.collection("inventory").insertMany([
        { name: "Beef", quantity: 20, unit: "kg", reorderLevel: 5 },
        { name: "Cheese", quantity: 10, unit: "kg", reorderLevel: 2 },
        { name: "Lettuce", quantity: 15, unit: "kg", reorderLevel: 3 },
        { name: "Tomato", quantity: 25, unit: "kg", reorderLevel: 5 }
      ])
    }
    
    return NextResponse.json({
      success: true,
      message: "Database initialized successfully"
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}