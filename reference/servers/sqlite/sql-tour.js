import { DatabaseSync } from "node:sqlite"

const db = new DatabaseSync(":memory:")
db.exec(`
  CREATE TABLE harvests (
    id INTEGER PRIMARY KEY,
    bed TEXT NOT NULL,
    crop TEXT NOT NULL,
    kg REAL NOT NULL
  )
`)

const insert = db.prepare("INSERT INTO harvests (bed, crop, kg) VALUES (?, ?, ?)")
insert.run("B2", "Radish", 1.2)
insert.run("B4", "Spinach", 2.4)
insert.run("B2", "Lettuce", 3.9)
insert.run("B2", "Lettuce", 2.5)

// every row, as an array of objects
console.log(db.prepare("SELECT * FROM harvests").all())

// only some rows
console.log(db.prepare("SELECT crop, kg FROM harvests WHERE bed = ?").all("B2"))

// grouped and totaled, like groupby and rollup in Arquero
console.log(db.prepare("SELECT crop, SUM(kg) AS totalKg FROM harvests GROUP BY crop ORDER BY totalKg DESC").all())
