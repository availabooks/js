import express from "express"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { DatabaseSync } from "node:sqlite"

// the database file sits next to this script; it's created if it doesn't exist
const db = new DatabaseSync(join(import.meta.dirname, "garden.db"))

// IF NOT EXISTS makes this safe to run every time the server starts
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    email TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS slots (
    id INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    task TEXT NOT NULL,
    start TEXT NOT NULL,
    end TEXT NOT NULL,
    capacity INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS slotSignups (
    id INTEGER PRIMARY KEY,
    slotId INTEGER NOT NULL,
    memberEmail TEXT NOT NULL,
    UNIQUE (slotId, memberEmail)
  );
`)

// load the starting data only if the tables are empty
const { memberCount } = db.prepare("SELECT COUNT(*) AS memberCount FROM members").get()
if (memberCount === 0) {
  loadStartingData()
}

function loadStartingData() {
  const data = JSON.parse(readFileSync(join(import.meta.dirname, "club-data.json"), "utf8"))
  const insertMember = db.prepare("INSERT INTO members (email, firstName, lastName) VALUES (?, ?, ?)")
  for (const member of data.members) {
    insertMember.run(member.email.toLowerCase(), member.firstName, member.lastName)
  }
  const insertSlot = db.prepare("INSERT INTO slots (id, date, task, start, end, capacity) VALUES (?, ?, ?, ?, ?, ?)")
  for (const slot of data.slots) {
    insertSlot.run(slot.id, slot.date, slot.task, slot.start, slot.end, slot.capacity)
  }
  const insertSignup = db.prepare("INSERT INTO slotSignups (id, slotId, memberEmail) VALUES (?, ?, ?)")
  for (const signup of data.slotSignups) {
    insertSignup.run(signup.id, signup.slotId, signup.memberEmail.toLowerCase())
  }
  console.log(`Loaded ${data.members.length} members, ${data.slots.length} slots and ${data.slotSignups.length} sign-ups`)
}

const app = express()
app.use(express.json())
app.use(express.static(join(import.meta.dirname, "public")))

// a slot plus how many people have signed up, with no emails
function getShiftWithCount(id) {
  return db.prepare(`
    SELECT slots.*, COUNT(slotSignups.id) AS spotsFilled
    FROM slots
    LEFT JOIN slotSignups ON slotSignups.slotId = slots.id
    WHERE slots.id = ?
    GROUP BY slots.id
  `).get(id)
}

app.get("/shifts", (req, res) => {
  const shifts = db.prepare(`
    SELECT slots.*, COUNT(slotSignups.id) AS spotsFilled
    FROM slots
    LEFT JOIN slotSignups ON slotSignups.slotId = slots.id
    GROUP BY slots.id
    ORDER BY slots.id
  `).all()
  res.json(shifts)
})

app.get("/shifts/:id", (req, res) => {
  const shift = getShiftWithCount(Number(req.params.id))
  if (shift === undefined) {
    return res.status(404).json({ error: "Shift not found" })
  }
  res.json(shift)
})

app.post("/shifts/:id/signups", (req, res) => {
  const slotId = Number(req.params.id)
  const slot = db.prepare("SELECT * FROM slots WHERE id = ?").get(slotId)
  if (slot === undefined) {
    return res.status(404).json({ error: "Shift not found" })
  }

  // emails aren't case-sensitive, so compare them in lowercase
  const email = String(req.body.email ?? "").trim().toLowerCase()
  if (email === "") {
    return res.status(400).json({ error: "Email is required" })
  }

  const member = db.prepare("SELECT * FROM members WHERE email = ?").get(email)
  if (member === undefined) {
    return res.status(400).json({ error: "That email doesn't belong to a club member" })
  }

  const existingSignup = db.prepare(
    "SELECT * FROM slotSignups WHERE slotId = ? AND memberEmail = ?"
  ).get(slotId, email)
  if (existingSignup !== undefined) {
    return res.status(409).json({ error: "You're already signed up for this shift" })
  }

  const { spotsFilled } = db.prepare(
    "SELECT COUNT(*) AS spotsFilled FROM slotSignups WHERE slotId = ?"
  ).get(slotId)
  if (spotsFilled >= slot.capacity) {
    return res.status(409).json({ error: "This shift is full" })
  }

  try {
    const result = db.prepare(
      "INSERT INTO slotSignups (slotId, memberEmail) VALUES (?, ?)"
    ).run(slotId, email)
    res.status(201).json({ id: Number(result.lastInsertRowid), slotId, memberEmail: email })
  } catch (error) {
    // the UNIQUE constraint catches a duplicate even if two requests arrive
    // at nearly the same moment; any other error is a real problem
    if (String(error.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "You're already signed up for this shift" })
    }
    throw error
  }
})

app.delete("/signups/:id", (req, res) => {
  const result = db.prepare("DELETE FROM slotSignups WHERE id = ?").run(Number(req.params.id))
  if (result.changes === 0) {
    return res.status(404).json({ error: "Sign-up not found" })
  }
  res.status(204).end()
})

// 127.0.0.1 means only this computer can connect
app.listen(3000, "127.0.0.1", () => {
  console.log("Sign-up API running at http://localhost:3000")
})
