import { PGlite } from "@electric-sql/pglite"
import { join } from "node:path"

// stop the server first: only one program at a time should open the folder
const db = new PGlite(join(import.meta.dirname, "garden-data"))

const signups = await db.query("SELECT * FROM slot_signups ORDER BY id")
console.table(signups.rows)

await db.close()
