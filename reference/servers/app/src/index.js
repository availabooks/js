// The garden's shift sign-up API, as a Cloudflare Worker with a D1 database.

// sends data as JSON with a status code
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" }
  })
}

// the columns anyone may see: no emails, no cancel codes
const SHIFT_QUERY = `
  SELECT slots.id, slots.date, slots.task, slots.start, slots.end, slots.capacity,
         COUNT(slotSignups.id) AS spotsFilled
  FROM slots
  LEFT JOIN slotSignups ON slotSignups.slotId = slots.id`

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    // "/shifts/6/signups" becomes ["shifts", "6", "signups"]
    const parts = url.pathname.split("/").filter(part => part !== "")
    const method = request.method

    if (method === "GET" && parts.length === 1 && parts[0] === "shifts") {
      return listShifts(env)
    }
    if (method === "GET" && parts.length === 2 && parts[0] === "shifts") {
      return getShift(env, Number(parts[1]))
    }
    if (method === "POST" && parts.length === 3 && parts[0] === "shifts" && parts[2] === "signups") {
      return signUp(request, env, Number(parts[1]))
    }
    if (method === "DELETE" && parts.length === 2 && parts[0] === "signups") {
      return cancel(request, env, Number(parts[1]))
    }
    return json({ error: "Not found" }, 404)
  }
}

async function listShifts(env) {
  const { results } = await env.DB.prepare(`${SHIFT_QUERY} GROUP BY slots.id ORDER BY slots.date, slots.start`).all()
  return json(results)
}

async function getShift(env, id) {
  const shift = await env.DB.prepare(`${SHIFT_QUERY} WHERE slots.id = ? GROUP BY slots.id`).bind(id).first()
  if (shift === null) {
    return json({ error: "Shift not found" }, 404)
  }
  return json(shift)
}

async function signUp(request, env, slotId) {
  const slot = await env.DB.prepare("SELECT capacity FROM slots WHERE id = ?").bind(slotId).first()
  if (slot === null) {
    return json({ error: "Shift not found" }, 404)
  }
  const body = await request.json().catch(() => ({}))
  // emails aren't case-sensitive, so compare them in lowercase
  const email = String(body.email ?? "").trim().toLowerCase()
  if (email === "") {
    return json({ error: "Email is required" }, 400)
  }
  const member = await env.DB.prepare("SELECT email FROM members WHERE email = ?").bind(email).first()
  if (member === null) {
    return json({ error: "That email doesn't belong to a club member" }, 400)
  }
  const { count } = await env.DB.prepare("SELECT COUNT(*) AS count FROM slotSignups WHERE slotId = ?").bind(slotId).first()
  if (count >= slot.capacity) {
    return json({ error: "This shift is full" }, 409)
  }
  // a random code that only the person who signed up receives, needed to cancel
  const cancelCode = crypto.randomUUID()
  try {
    const result = await env.DB.prepare("INSERT INTO slotSignups (slotId, memberEmail, cancelCode) VALUES (?, ?, ?)")
      .bind(slotId, email, cancelCode)
      .run()
    return json({ id: result.meta.last_row_id, slotId, cancelCode }, 201)
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      return json({ error: "You're already signed up for this shift" }, 409)
    }
    throw error
  }
}

async function cancel(request, env, id) {
  const body = await request.json().catch(() => ({}))
  const result = await env.DB.prepare("DELETE FROM slotSignups WHERE id = ? AND cancelCode = ?")
    .bind(id, String(body.cancelCode ?? ""))
    .run()
  if (result.meta.changes === 0) {
    return json({ error: "Sign-up not found, or the cancel code is wrong" }, 404)
  }
  return new Response(null, { status: 204 })
}
