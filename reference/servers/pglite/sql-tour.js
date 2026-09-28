import { PGlite } from "@electric-sql/pglite"

// with no folder name, the database exists only while the script runs
const db = new PGlite()
await db.exec(`
  CREATE TABLE harvests (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bed TEXT NOT NULL,
    crop TEXT NOT NULL,
    kg REAL NOT NULL
  )
`)

const insert = "INSERT INTO harvests (bed, crop, kg) VALUES ($1, $2, $3)"
await db.query(insert, ["B2", "Radish", 1.2])
await db.query(insert, ["B4", "Spinach", 2.4])
await db.query(insert, ["B2", "Lettuce", 3.9])
await db.query(insert, ["B2", "Lettuce", 2.5])

// every row, as an array of objects
const all = await db.query("SELECT * FROM harvests")
console.log(all.rows)

// only some rows
const bedB2 = await db.query("SELECT crop, kg FROM harvests WHERE bed = $1", ["B2"])
console.log(bedB2.rows)

// grouped and totaled, like groupby and rollup in Arquero
const totals = await db.query("SELECT crop, SUM(kg) AS total_kg FROM harvests GROUP BY crop ORDER BY total_kg DESC")
console.log(totals.rows)
