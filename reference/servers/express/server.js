import express from "express"
import { readFileSync } from "node:fs"
import { join } from "node:path"

// the data file sits next to this script
const data = JSON.parse(readFileSync(join(import.meta.dirname, "club-data.json"), "utf8"))
const members = data.members
const slots = data.slots
const slotSignups = data.slotSignups
let nextSignupId = slotSignups.reduce((max, signup) => Math.max(max, signup.id), 0) + 1

const app = express()
app.use(express.json())
// files in the public folder, such as index.html, are served as they are
app.use(express.static(join(import.meta.dirname, "public")))

// what a shift looks like to the outside world: no emails
function publicShift(slot) {
  const spotsFilled = slotSignups.filter(signup => signup.slotId === slot.id).length
  return { ...slot, spotsFilled }
}

app.get("/shifts", (req, res) => {
  res.json(slots.map(publicShift))
})

app.get("/shifts/:id", (req, res) => {
  const slot = slots.find(s => s.id === Number(req.params.id))
  if (slot === undefined) {
    return res.status(404).json({ error: "Shift not found" })
  }
  res.json(publicShift(slot))
})

app.post("/shifts/:id/signups", (req, res) => {
  const slot = slots.find(s => s.id === Number(req.params.id))
  if (slot === undefined) {
    return res.status(404).json({ error: "Shift not found" })
  }
  // emails aren't case-sensitive, so compare them in lowercase
  const email = String(req.body.email ?? "").trim().toLowerCase()
  if (email === "") {
    return res.status(400).json({ error: "Email is required" })
  }
  if (!members.some(member => member.email === email)) {
    return res.status(400).json({ error: "That email doesn't belong to a club member" })
  }
  const signupsForSlot = slotSignups.filter(signup => signup.slotId === slot.id)
  if (signupsForSlot.some(signup => signup.memberEmail === email)) {
    return res.status(409).json({ error: "You're already signed up for this shift" })
  }
  if (signupsForSlot.length >= slot.capacity) {
    return res.status(409).json({ error: "This shift is full" })
  }
  const signup = { id: nextSignupId, slotId: slot.id, memberEmail: email }
  nextSignupId++
  slotSignups.push(signup)
  res.status(201).json(signup)
})

app.delete("/signups/:id", (req, res) => {
  const index = slotSignups.findIndex(signup => signup.id === Number(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: "Sign-up not found" })
  }
  slotSignups.splice(index, 1)
  res.status(204).end()
})

// 127.0.0.1 means only this computer can connect
app.listen(3000, "127.0.0.1", () => {
  console.log("Sign-up API running at http://localhost:3000")
})
