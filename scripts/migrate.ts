import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL_UNPOOLED!)
const db = drizzle(sql)

await migrate(db, { migrationsFolder: "./drizzle" })
console.log("✅ Migrations applied successfully")
process.exit(0)
