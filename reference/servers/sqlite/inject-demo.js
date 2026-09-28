import { DatabaseSync } from "node:sqlite"

// a small database that exists only in memory, for trying things out
const db = new DatabaseSync(":memory:")
db.exec("CREATE TABLE members (email TEXT PRIMARY KEY, firstName TEXT)")
db.prepare("INSERT INTO members (email, firstName) VALUES (?, ?)").run("ava.lopez@example.com", "Ava")

// what someone might type into the email box
const typed = "' OR '1'='1"

// unsafe: the typed text becomes part of the SQL
const unsafe = db.prepare(`SELECT * FROM members WHERE email = '${typed}'`).get()
console.log("Built with a template literal:", unsafe)

// safe: the typed text is passed separately, as a value
const safe = db.prepare("SELECT * FROM members WHERE email = ?").get(typed)
console.log("Passed with a placeholder:", safe)
