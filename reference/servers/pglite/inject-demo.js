import { PGlite } from "@electric-sql/pglite"

// a small database that exists only in memory, for trying things out
const db = new PGlite()
await db.exec("CREATE TABLE members (email TEXT PRIMARY KEY, first_name TEXT)")
await db.query("INSERT INTO members (email, first_name) VALUES ($1, $2)", ["ava.lopez@example.com", "Ava"])

// what someone might type into the email box
const typed = "' OR '1'='1"

// unsafe: the typed text becomes part of the SQL
const unsafe = await db.query(`SELECT * FROM members WHERE email = '${typed}'`)
console.log("Built with a template literal:", unsafe.rows)

// safe: the typed text is passed separately, as a value
const safe = await db.query("SELECT * FROM members WHERE email = $1", [typed])
console.log("Passed with a placeholder:", safe.rows)
