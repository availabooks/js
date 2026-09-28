import express from "express"
import { join } from "node:path"
import { db, setupDatabase } from "./db.js"

const app = express()
app.use(express.json())
app.use(express.static(join(import.meta.dirname, "public")))

// turns a database row into what a shift looks like to the outside world: no emails
function toShift(row) {
  return {
    id: row.id,
    date: row.date,
    task: row.task,
    start: row.start,
    end: row.end,
    capacity: row.capacity,
    spotsFilled: Number(row.spots_filled)
  }
}

function toSignup(row) {
  return { id: row.id, slotId: row.slot_id, memberEmail: row.member_email }
}

app.get("/shifts", async (req, res) => {
  try {
    const result = await db.query(`
      select s.id, s.date, s.task, s.start, s."end", s.capacity,
             count(su.id) as spots_filled
      from slots s
      left join slot_signups su on su.slot_id = s.id
      group by s.id, s.date, s.task, s.start, s."end", s.capacity
      order by s.id
    `)
    res.json(result.rows.map(toShift))
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong" })
  }
})

app.get("/shifts/:id", async (req, res) => {
  try {
    const result = await db.query(`
      select s.id, s.date, s.task, s.start, s."end", s.capacity,
             count(su.id) as spots_filled
      from slots s
      left join slot_signups su on su.slot_id = s.id
      where s.id = $1
      group by s.id, s.date, s.task, s.start, s."end", s.capacity
    `, [Number(req.params.id)])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Shift not found" })
    }
    res.json(toShift(result.rows[0]))
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong" })
  }
})

app.post("/shifts/:id/signups", async (req, res) => {
  try {
    const slotId = Number(req.params.id)
    const slotResult = await db.query(
      "select id, capacity from slots where id = $1",
      [slotId]
    )
    if (slotResult.rows.length === 0) {
      return res.status(404).json({ error: "Shift not found" })
    }
    const slot = slotResult.rows[0]

    // emails aren't case-sensitive, so compare them in lowercase
    const email = String(req.body.email ?? "").trim().toLowerCase()
    if (email === "") {
      return res.status(400).json({ error: "Email is required" })
    }

    const memberResult = await db.query(
      "select email from members where email = $1",
      [email]
    )
    if (memberResult.rows.length === 0) {
      return res.status(400).json({ error: "That email doesn't belong to a club member" })
    }

    const existingResult = await db.query(
      "select id from slot_signups where slot_id = $1 and member_email = $2",
      [slotId, email]
    )
    if (existingResult.rows.length > 0) {
      return res.status(409).json({ error: "You're already signed up for this shift" })
    }

    const countResult = await db.query(
      "select count(*) as count from slot_signups where slot_id = $1",
      [slotId]
    )
    if (Number(countResult.rows[0].count) >= slot.capacity) {
      return res.status(409).json({ error: "This shift is full" })
    }

    // the database gives the new sign-up its id
    const insertResult = await db.query(
      "insert into slot_signups (slot_id, member_email) values ($1, $2) returning *",
      [slotId, email]
    )

    res.status(201).json(toSignup(insertResult.rows[0]))
  } catch (error) {
    // 23505 is Postgres's code for breaking a unique rule: the same member,
    // twice, in two requests that arrived at nearly the same moment
    if (error.code === "23505") {
      return res.status(409).json({ error: "You're already signed up for this shift" })
    }
    console.error(error)
    res.status(500).json({ error: "Something went wrong" })
  }
})

app.delete("/signups/:id", async (req, res) => {
  try {
    const result = await db.query(
      "delete from slot_signups where id = $1 returning id",
      [Number(req.params.id)]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sign-up not found" })
    }
    res.status(204).end()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Something went wrong" })
  }
})

async function start() {
  await setupDatabase()
  // 127.0.0.1 means only this computer can connect
  app.listen(3000, "127.0.0.1", () => {
    console.log("Sign-up API running at http://localhost:3000")
  })
}

start()
