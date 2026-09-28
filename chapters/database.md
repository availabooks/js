---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain why a server stores data in a database rather than in memory or a JSON file.
2. Use SQLite from Node with the built-in `node:sqlite` module: create tables, insert rows and query them.
3. Read basic SQL: `CREATE TABLE`, `INSERT`, `SELECT` with `WHERE`, `COUNT`, `GROUP BY`, `JOIN` and `DELETE`.
4. Explain SQL injection, and always pass values with placeholders.
5. Let the database enforce rules, with constraints such as `UNIQUE`.
:::
:::

## Why a Database

The sign-up server from [A Server with Node and Express](express){.book-link} forgets everything when it stops. You could save the arrays back to `club-data.json` after every change, and for a tiny project that can work. But a file isn't built for this: two sign-ups arriving at the same moment could each read the file, add their row and write it back, and one would overwrite the other. And every question, such as "how many people signed up for shift 6?", means reading the whole file.

A **database** is software built for exactly this job: storing data safely, letting many requests read and change it at once, and answering questions about it quickly. The language for talking to most databases is **SQL**. If you've used this book's companion on SQL, you know it already; if not, this lesson covers the parts the club needs.

**SQLite** is a database that lives in a single file, with no separate database server to install or run. It's free, very reliable, and built into more software than any other database, including every smartphone. Recent versions of Node include it, as the module **`node:sqlite`**, so there's nothing to install. (It's newer than most of Node, so check the documentation for your version; the widely used `better-sqlite3` package works in much the same way if you need an alternative.)

::: {.term}
> **Database** — Software that stores data and answers questions about it, safely handling many readers and writers at once. **SQL** is the language most databases use.
:::

## SQL in Brief

A SQL database holds **tables**, like sheets, with **rows** and named **columns**, each with a type. Here's a short tour, which you can run with Node:

<pre class="code" data-environment="nodejs">
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
</pre>

- **`new DatabaseSync(":memory:")`** opens a database that exists only while the script runs, which is handy for trying things. A file name, such as `"garden.db"`, opens or creates a database file.
- **`db.exec(sql)`** runs SQL that returns nothing, such as `CREATE TABLE`, which defines a table's columns and their types.
- **`db.prepare(sql)`** turns SQL into a *statement* you can run many times. **`.run(...)`** runs it, for changes such as `INSERT`. **`.get(...)`** returns the first row, as an object, and **`.all(...)`** returns every row, as an array of objects.
- Each **`?`** in the SQL is a placeholder, filled with the values passed to `run`, `get` or `all`, in order. You'll see why that matters shortly.

The three queries show the core of `SELECT`: every row, rows chosen with `WHERE`, and rows grouped with `GROUP BY` and totaled with `SUM`, the same as `groupby` and `rollup` in [Analyzing and Charting Data](charts){.book-link}. The results print with `[Object: null prototype]` in front, which is just how Node labels the plain objects `node:sqlite` returns; they work like any other objects, including with `res.json`.

## Moving the Sign-Ups into SQLite

Here's the request, in a new chat with your learner profile from [A Server with Node and Express](express){.book-link}:

::: {.ai-conversation prompt="Change our Express sign-up API to keep its data in a SQLite database file, garden.db, instead of in memory, so sign-ups survive a restart. The first time the server starts, it should create the tables and load the starting data from club-data.json. Keep the same routes, status codes and rules as before (including comparing emails in lowercase, and no emails in GET responses)." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="express" transcript="database/sqlite"}
> I want to make sure I keep your existing routes, status codes and validation rules exactly as they are — but I don't have the code from our earlier session in front of me. Could you paste:
>
> 1. Your current Express sign-up API code (the in-memory version)
> 2. The structure of `club-data.json` (or a sample of it)
>
> Once I see those, I'll convert it to use SQLite (with Node's built-in `node:sqlite` module — I'll confirm details once I see your Node version, since that module is fairly new) while keeping:
>
> - The same routes and their status codes (200, 201, 400, 404, 409, etc.)
> - Email comparisons done in lowercase
> - No emails included in any GET response
> - A one-time setup on first run: create tables, then load starting data from `club-data.json`
>
> A couple of things I'll flag once I see the code:
> - **`node:sqlite`** is a newer built-in module (stable in recent Node versions but still fairly new) — I'll check with you whether your Node version supports it, or whether we should use **`better-sqlite3`**, which is a very widely used package, instead.
> - We'll need a way to detect "first run" — likely by checking if `garden.db` already exists before creating tables, using `fs.existsSync`.
>
> Paste the code and JSON and I'll write the updated version.
:::

Of course: it's a new chat, and the server code is in the old one. You learned in [Working with an AI Assistant](ai-assistant){.book-link} that a new chat starts from nothing, and the assistant was right to ask rather than invent a server that only resembled yours. So paste it:

::: {.ai-conversation prompt="Here is the current server.js: (then paste the whole file) club-data.json has three arrays: members (objects with firstName, lastName, email), slots (objects with id, date, task, start, end, capacity) and slotSignups (objects with id, slotId, memberEmail). I'm using Node 24." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="express" transcript="database/sqlite"}
> Good, this is enough to work with. A few notes before the code:
>
> - **`node:sqlite`** is a fairly new built-in module. I know its general shape (a `DatabaseSync` class, `.prepare()`, then `.run()`, `.get()` or `.all()` on the prepared statement), but I haven't used every detail of it and Node has changed it between versions. If something doesn't match — an unfamiliar error, or a property name that doesn't exist — tell me the exact message and I'll adjust. If it turns out your Node 24 build still needs a flag or behaves differently, the fallback is **`better-sqlite3`**, a very widely used package with the same synchronous style.
> - No `npm install` needed for `node:sqlite` — it comes with Node.
> - I check `existsSync(dbPath)` **before** opening the database, so we know whether this is truly the first run, and we never re-run the setup (and never overwrite `garden.db`) on later starts.
> - I added a `UNIQUE` constraint on `(slotId, memberEmail)` in the database itself, not just a check in the route. That way, if two requests happened to arrive at almost the same instant, the database — not just the page's check — stops the duplicate.
>
> ```javascript
> import express from "express"
> import { existsSync, readFileSync } from "node:fs"
> import { join } from "node:path"
> import { DatabaseSync } from "node:sqlite"
>
> // the database file sits next to this script
> const dbPath = join(import.meta.dirname, "garden.db")
> // if the file doesn't exist yet, this is the first time the server has run
> const isFirstRun = !existsSync(dbPath)
> const db = new DatabaseSync(dbPath)
>
> if (isFirstRun) {
>   setUpDatabase()
> }
>
> // creates the tables and loads club-data.json, but only once ever
> function setUpDatabase() {
>   db.exec(`
>     CREATE TABLE members (
>       email TEXT PRIMARY KEY,
>       firstName TEXT NOT NULL,
>       lastName TEXT NOT NULL
>     )
>   `)
>   db.exec(`
>     CREATE TABLE slots (
>       id INTEGER PRIMARY KEY,
>       date TEXT NOT NULL,
>       task TEXT NOT NULL,
>       start TEXT NOT NULL,
>       end TEXT NOT NULL,
>       capacity INTEGER NOT NULL
>     )
>   `)
>   db.exec(`
>     CREATE TABLE slotSignups (
>       id INTEGER PRIMARY KEY,
>       slotId INTEGER NOT NULL,
>       memberEmail TEXT NOT NULL,
>       UNIQUE (slotId, memberEmail)
>     )
>   `)
>
>   const data = JSON.parse(
>     readFileSync(join(import.meta.dirname, "club-data.json"), "utf8")
>   )
>
>   const insertMember = db.prepare(
>     "INSERT INTO members (email, firstName, lastName) VALUES (?, ?, ?)"
>   )
>   data.members.forEach(member => {
>     insertMember.run(member.email.toLowerCase(), member.firstName, member.lastName)
>   })
>
>   const insertSlot = db.prepare(
>     "INSERT INTO slots (id, date, task, start, end, capacity) VALUES (?, ?, ?, ?, ?, ?)"
>   )
>   data.slots.forEach(slot => {
>     insertSlot.run(slot.id, slot.date, slot.task, slot.start, slot.end, slot.capacity)
>   })
>
>   const insertSignup = db.prepare(
>     "INSERT INTO slotSignups (id, slotId, memberEmail) VALUES (?, ?, ?)"
>   )
>   data.slotSignups.forEach(signup => {
>     insertSignup.run(signup.id, signup.slotId, signup.memberEmail.toLowerCase())
>   })
>
>   console.log(
>     `First run: loaded ${data.members.length} members, ${data.slots.length} slots, ${data.slotSignups.length} sign-ups`
>   )
> }
>
> const app = express()
> app.use(express.json())
> app.use(express.static(join(import.meta.dirname, "public")))
>
> // a slot plus how many people have signed up, with no emails
> function getShiftWithCount(id) {
>   return db.prepare(`
>     SELECT slots.*, COUNT(slotSignups.id) AS spotsFilled
>     FROM slots
>     LEFT JOIN slotSignups ON slotSignups.slotId = slots.id
>     WHERE slots.id = ?
>     GROUP BY slots.id
>   `).get(id)
> }
>
> app.get("/shifts", (req, res) => {
>   const shifts = db.prepare(`
>     SELECT slots.*, COUNT(slotSignups.id) AS spotsFilled
>     FROM slots
>     LEFT JOIN slotSignups ON slotSignups.slotId = slots.id
>     GROUP BY slots.id
>     ORDER BY slots.id
>   `).all()
>   res.json(shifts)
> })
>
> app.get("/shifts/:id", (req, res) => {
>   const shift = getShiftWithCount(Number(req.params.id))
>   if (shift === undefined) {
>     return res.status(404).json({ error: "Shift not found" })
>   }
>   res.json(shift)
> })
>
> app.post("/shifts/:id/signups", (req, res) => {
>   const slotId = Number(req.params.id)
>   const slot = db.prepare("SELECT * FROM slots WHERE id = ?").get(slotId)
>   if (slot === undefined) {
>     return res.status(404).json({ error: "Shift not found" })
>   }
>
>   // emails aren't case-sensitive, so compare them in lowercase
>   const email = String(req.body.email ?? "").trim().toLowerCase()
>   if (email === "") {
>     return res.status(400).json({ error: "Email is required" })
>   }
>
>   const member = db.prepare("SELECT * FROM members WHERE email = ?").get(email)
>   if (member === undefined) {
>     return res.status(400).json({ error: "That email doesn't belong to a club member" })
>   }
>
>   const existingSignup = db.prepare(
>     "SELECT * FROM slotSignups WHERE slotId = ? AND memberEmail = ?"
>   ).get(slotId, email)
>   if (existingSignup !== undefined) {
>     return res.status(409).json({ error: "You're already signed up for this shift" })
>   }
>
>   const { spotsFilled } = db.prepare(
>     "SELECT COUNT(*) AS spotsFilled FROM slotSignups WHERE slotId = ?"
>   ).get(slotId)
>   if (spotsFilled >= slot.capacity) {
>     return res.status(409).json({ error: "This shift is full" })
>   }
>
>   try {
>     const result = db.prepare(
>       "INSERT INTO slotSignups (slotId, memberEmail) VALUES (?, ?)"
>     ).run(slotId, email)
>     res.status(201).json({ id: Number(result.lastInsertRowid), slotId, memberEmail: email })
>   } catch (error) {
>     // the UNIQUE constraint catches a duplicate sign-up even if two
>     // requests arrived at nearly the same moment
>     res.status(409).json({ error: "You're already signed up for this shift" })
>   }
> })
>
> app.delete("/signups/:id", (req, res) => {
>   const result = db.prepare("DELETE FROM slotSignups WHERE id = ?").run(Number(req.params.id))
>   if (result.changes === 0) {
>     return res.status(404).json({ error: "Sign-up not found" })
>   }
>   res.status(204).end()
> })
>
> // 127.0.0.1 means only this computer can connect
> app.listen(3000, "127.0.0.1", () => {
>   console.log("Sign-up API running at http://localhost:3000")
> })
> ```
>
> **What changed, in plain terms:**
>
> - Instead of arrays in memory, the three kinds of data now live in three SQLite tables inside `garden.db`.
> - `isFirstRun` checks whether `garden.db` already exists. If not, `setUpDatabase()` creates the tables and copies in everything from `club-data.json`, then logs how many rows it loaded so you can check the count against the JSON file.
> - Every route now runs a small SQL query instead of using array methods like `find` or `filter` — the ideas (find a slot, check for a duplicate, count sign-ups) are the same, just expressed in SQL.
> - `getShiftWithCount` and the `GET /shifts` query use `LEFT JOIN` and `COUNT` so the number of sign-ups is worked out by the database, without ever selecting the `memberEmail` column for shifts — so emails still never appear in a GET response.
> - Sign-up IDs are now assigned automatically by SQLite (`INTEGER PRIMARY KEY`), so there's no more `nextSignupId` variable to manage by hand.
>
> **To test:**
> 1. Delete `garden.db` if one exists, then run `node server.js` — check the console log's counts match your `club-data.json`.
> 2. Run it again — it should start instantly without re-loading data (no "First run" log line).
> 3. Use `fetch` or `curl` to sign someone up, then stop the server (Ctrl+C) and start it again — the sign-up should still be there, which is the whole point of this change.
:::

**Read.** This is a careful reply, and it's worth reading in three parts.

**The tables.** Each array becomes a table. The columns have types, `TEXT` and `INTEGER`, and **constraints**, rules the database enforces itself: `PRIMARY KEY` means each row's value is unique and identifies it, `NOT NULL` means a value is required, and `UNIQUE (slotId, memberEmail)` means one member can appear only once per shift. That last one is a thoughtful addition: even if two requests from the same member arrive at almost the same instant, and both pass the route's own check, the database refuses the second. Rules that matter should be enforced where the data is stored, which, now, means the database.

**The queries.** Each route's array methods became SQL. The interesting one lists shifts with their counts:

<pre class="code" data-environment="none">
SELECT slots.*, COUNT(slotSignups.id) AS spotsFilled
FROM slots
LEFT JOIN slotSignups ON slotSignups.slotId = slots.id
GROUP BY slots.id
ORDER BY slots.id
</pre>

A **`JOIN`** combines rows from two tables where a condition matches, here each slot with its sign-ups. **`LEFT JOIN`** keeps slots that have no sign-ups at all, such as shift 6, which a plain `JOIN` would drop. `GROUP BY` and `COUNT` then count each slot's sign-ups. And because only `slots.*` and the count are selected, the emails never leave the database for a GET request, so your profile's rule is kept by the query itself.

**The details.** `result.lastInsertRowid` is the id SQLite gave the new sign-up, converted with `Number()` because it can arrive as a very large-number type called a BigInt. `result.changes` says how many rows a `DELETE` removed: 0 means there was no such sign-up, hence 404.

The assistant said, twice, where its knowledge of `node:sqlite` might be thin, and what to do if something didn't match. That's what you want from a reply about a newer tool.

### Two improvements

The code works; the book's test script from the last lesson passes against it, and sign-ups survive a restart. Two parts can be made sturdier:

- **The first-run check.** The server decides it's the first run if `garden.db` doesn't exist yet. But if setup fails halfway, say because `club-data.json` has a typo, the file now exists, and every later start skips setup and runs with half-empty tables. A sturdier approach is to run `CREATE TABLE IF NOT EXISTS` every time, which does nothing when the table is already there, and to load the data only if the tables are empty.
- **The `catch`.** It turns *any* error from the insert into "You're already signed up." A different error, such as a full disk, would be reported as a duplicate. It should only treat a UNIQUE violation that way, and let anything else be a real error.

Here's the server with both changes:

<pre class="code" data-environment="nodejs">
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
</pre>

`db.exec` can run several SQL statements at once, separated by semicolons, which SQL uses the way CSS does. `throw error` in the `catch` passes an unexpected error on, and Express responds with a 500 status, which is the honest answer when the server has a problem.

Here's what the first start printed, followed by the test script from [A Server with Node and Express](express){.book-link}:

<pre class="code" data-environment="message">
Loaded 12 members, 8 slots and 12 sign-ups
Sign-up API running at http://localhost:3000
GET /shifts/6 -> 200 {"id":6,"date":"2027-06-19","task":"planting","start":"09:00","end":"11:00","capacity":3,"spotsFilled":0}
POST /shifts/6/signups -> 201 {"id":13,"slotId":6,"memberEmail":"ava.lopez@example.com"}
POST /shifts/6/signups -> 409 {"error":"You're already signed up for this shift"}
POST /shifts/1/signups -> 409 {"error":"This shift is full"}
POST /shifts/2/signups -> 400 {"error":"That email doesn't belong to a club member"}
POST /shifts/2/signups -> 400 {"error":"Email is required"}
POST /shifts/99/signups -> 404 {"error":"Shift not found"}
DELETE /signups/13 -> 204
DELETE /signups/13 -> 404 {"error":"Sign-up not found"}
</pre>

Stop the server and start it again: this time there's no "Loaded" line, because the tables already have data, and any sign-ups made before the restart are still there.

## SQL Injection

Every query uses `?` placeholders, even where building the SQL with a template literal would be shorter. Continuing the chat:

::: {.ai-conversation prompt="Why do the queries use ? placeholders, like WHERE email = ?, instead of putting the email straight into the SQL with a template literal? It would be shorter." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="express" transcript="database/sqlite"}
> Good question — it looks shorter, but building SQL with a template literal opens a security hole called **SQL injection**.
>
> Here's the problem. Say we wrote the email lookup like this instead:
>
> ```javascript
> // don't do this
> const member = db.prepare(`SELECT * FROM members WHERE email = '${email}'`).get()
> ```
>
> `email` comes from `req.body.email` — data typed in by whoever is using the sign-up form. Normally it's a plain address like `ava@example.com`, and that query works fine. But nothing stops someone from typing something else into that field instead of an email, such as:
>
> ```
> ' OR '1'='1
> ```
>
> That would turn the query into:
>
> ```sql
> SELECT * FROM members WHERE email = '' OR '1'='1'
> ```
>
> Since `'1'='1'` is always true, that condition matches every row in the table — so the "is this a club member" check would pass for anyone, with no valid email at all. With a `DELETE` or `INSERT` statement, a similar trick can do far worse, like deleting every row in a table.
>
> The `?` placeholder avoids this because the value is never turned into SQL text at all. It's handed to SQLite separately, as *data*, so SQLite always treats it as one plain value to compare — no matter what characters are in it. That's why every query in the server uses `.get(...)`, `.run(...)` or `.all(...)` with `?` placeholders instead of building the SQL string by hand.
>
> The rule of thumb: any value that came from outside your code (a request body, a query string, a form) should go into SQL through a placeholder, never pasted straight into the query text.
:::

This is one of the most important security lessons in programming, and the explanation is exactly right. You can see it happen:

<pre class="code" data-environment="nodejs">
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
</pre>

It prints Ava's record for the template-literal query, even though nobody typed her email, and `undefined` for the placeholder query, which looked for a member whose email is literally `' OR '1'='1` and found none. In the sign-up server, the unsafe version would let anyone pass the "club member" check. It's the same principle as text in HTML, from [A Web App with Apps Script](web-app){.book-link}: text that gets inserted into another language is read as that language, unless it's passed as data.

::: {.term}
> **SQL injection** — An attack in which text typed by a user becomes part of a SQL command, changing what the command does. Prevented by passing values with placeholders instead of building SQL text.
:::

## The Database File

`garden.db` is now where the club's sign-ups live, so treat it like the valuable file it is:

- **Back it up** by copying it, ideally while the server is stopped, so the copy isn't taken in the middle of a change.
- **Keep it out of anything public:** out of a website's folder, from [Publishing a Site for Free](publishing){.book-link}, and out of shared code, because it contains members' emails.
- **To look inside,** free tools such as DB Browser for SQLite open the file and show its tables, and some VS Code extensions do the same. Close them before starting the server, so two programs aren't changing the file at once.

## Your Learner Profile

::: {.ai-profile lesson="database"}
Add rules:

- Always pass values into SQL with ? placeholders. Never build SQL text from values that came from outside the code.

Add to "What I know so far":

- SQLite with node:sqlite: DatabaseSync, exec, prepare, and run, get and all
- SQL: CREATE TABLE IF NOT EXISTS, INSERT, SELECT with WHERE, ORDER BY, COUNT, SUM, GROUP BY, JOIN and LEFT JOIN, and DELETE
- constraints: PRIMARY KEY, NOT NULL and UNIQUE
- lastInsertRowid and changes
- SQL injection, and why placeholders prevent it
:::

## Summary

A database stores data safely, handles many changes at once and answers questions quickly, which a JSON file can't. SQLite is a complete database in one file, built into recent versions of Node as `node:sqlite`: `exec` runs SQL, and prepared statements `run` changes and `get` or `all` rows. Tables have typed columns and constraints such as `PRIMARY KEY` and `UNIQUE`, which let the database itself enforce the club's rules. SQL's `SELECT` chooses rows with `WHERE`, combines tables with `JOIN`, and groups and counts with `GROUP BY` and `COUNT`. Always pass values through `?` placeholders; building SQL from user input allows SQL injection. The sign-ups now survive a restart. Next, the API moves off your computer and onto the internet, with Cloudflare Workers.
