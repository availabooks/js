---
_$_import: monaco, websql
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain why a server stores data in a database rather than in memory or a JSON file.
2. Use PostgreSQL from Node with PGlite: create tables, insert rows and query them.
3. Read basic SQL: `CREATE TABLE`, `INSERT`, `SELECT` with `WHERE`, `COUNT`, `GROUP BY`, `JOIN` and `DELETE`.
4. Explain SQL injection, and always pass values with placeholders.
5. Let the database enforce rules, with constraints such as `UNIQUE`, and keep setup safe with a transaction.
:::
:::

## Why a Database

The sign-up server from [A Server with Node and Express](express){.book-link} forgets everything when it stops. You could save the arrays back to `club-data.json` after every change, and for a tiny project that can work. But a file isn't built for this: two sign-ups arriving at the same moment could each read the file, add their row and write it back, and one would overwrite the other. And every question, such as "how many people signed up for shift 6?", means reading the whole file.

A **database** is software built for exactly this job: storing data safely, letting many requests read and change it at once, and answering questions about it quickly. The language for talking to most databases is **SQL**. If you've used this book's companion on SQL, you know it already; if not, this lesson covers the parts the club needs.

**PostgreSQL**, usually called Postgres, is one of the most widely used databases in the world. It's free, and it runs everything from class projects to large companies' systems. Normally it's a separate server program you install and keep running. **PGlite** is Postgres packaged so it runs inside your own Node program, with nothing else to install, keeping its data in a folder next to your code. It's the same database the SQL book runs in your browser, so the SQL you learned there works here unchanged. And because it's real Postgres, moving to a Postgres server online later, as the next lesson does, means changing how you connect, not rewriting your SQL.

PGlite is a package, so install it in the server's folder, as you learned in [Modules and Packages](node-modules){.book-link}:

```{.code environment="none"}
npm install @electric-sql/pglite
```

::: {.term}
> **Database** — Software that stores data and answers questions about it, safely handling many readers and writers at once. **SQL** is the language most databases use.
:::

## SQL in Brief

A SQL database holds **tables**, like sheets, with **rows** and named **columns**, each with a type. You don't need JavaScript to try it. Each box below is a query box, like the ones in the SQL book, running Postgres right in your browser: edit the SQL, then press **Run** or Ctrl+Enter (Cmd+Enter on a Mac). The boxes on this page share one database, and your browser keeps it, so a table you make in one box is there in the next, even after you reload the page.

Start by making a table and putting a few harvests in it. Run this box first:

```sql {.websql}
DROP TABLE IF EXISTS harvests;

CREATE TABLE harvests (
    id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bed  TEXT NOT NULL,
    crop TEXT NOT NULL,
    kg   REAL NOT NULL
);

INSERT INTO harvests (bed, crop, kg)
VALUES ('B2', 'Radish', 1.2),
       ('B4', 'Spinach', 2.4),
       ('B2', 'Lettuce', 3.9),
       ('B2', 'Lettuce', 2.5);
```

- **`CREATE TABLE`** names a table and lists its columns, each with a type: `TEXT` for text and `REAL` for numbers with decimals. `NOT NULL` means every row must have a value there.
- **`INTEGER GENERATED ALWAYS AS IDENTITY`** asks the database to number the rows itself: 1, 2, 3 and so on. **`PRIMARY KEY`** makes `id` the column that identifies each row, so no two rows can share one.
- **`INSERT INTO`** adds rows, listing the columns to fill and then the values for each row. Text values go in single quotes.
- **`DROP TABLE IF EXISTS`** deletes the table if it's already there, so you can run the box again whenever you want to start fresh.
- Each statement ends with a semicolon, which is how SQL tells where one statement stops and the next begins.

Now ask questions of it. `SELECT` chooses the columns to show and `FROM` names the table; `*` means every column:

```sql {.websql}
SELECT *
FROM   harvests;
```

You'll see all four rows, with the `id` numbers the database added. **`WHERE`** keeps only the rows that pass a test, here the harvests from bed B2:

```sql {.websql}
SELECT crop, kg
FROM   harvests
WHERE  bed = 'B2';
```

Try changing `'B2'` to `'B4'` and running it again. **`GROUP BY`** puts rows with the same value together, so you can count or total each group, the same as `groupby` and `rollup` in [Analyzing and Charting Data](charts){.book-link}:

```sql {.websql}
SELECT   crop, COUNT(*) AS harvests, SUM(kg) AS total_kg
FROM     harvests
GROUP BY crop
ORDER BY total_kg DESC;
```

`COUNT(*)` counts the rows in each group and `SUM(kg)` adds up their kilograms. **`AS`** names the new columns, and **`ORDER BY`** sorts the results, with `DESC` for largest first, so Lettuce comes first, with two harvests and 6.4 kg.

**`DELETE`** removes the rows that pass a `WHERE` test. This one removes the radish harvest, then shows what's left:

```sql {.websql}
DELETE FROM harvests
WHERE  crop = 'Radish';

SELECT *
FROM   harvests;
```

Be careful with `DELETE`: without a `WHERE`, it removes every row in the table. If you delete more than you meant to, run the first box again.

SQL doesn't care whether keywords are in capitals, so `select` works as well as `SELECT`; the capitals just make them easy to spot. Nor does it care about line breaks and spaces, which are only there to make each part of a query easy to find.

Notice the name `total_kg`, where you might have expected `totalKg`. Postgres turns names in SQL into lowercase unless they're in double quotes, so `AS totalKg` would come back as `totalkg`. That's why SQL names are usually written in **snake_case**, with underscores between the words.

## SQL from Node

Here's the same table and the same questions, run from Node with PGlite:

```{.code environment="nodejs"}
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
```

- **`new PGlite()`**, with no folder name, opens a database that exists only while the script runs, which is handy for trying things. A folder name, such as `new PGlite("garden-data")`, opens the database stored in that folder, creating it the first time.
- **`db.exec(sql)`** runs SQL whose results you don't need, such as `CREATE TABLE`.
- **`db.query(sql, values)`** runs one SQL statement and gives back a result whose **`rows`** property is an array of objects, one per row.
- Each **`$1`**, **`$2`** and so on in the SQL is a placeholder, filled with the values in the array, in order. It takes the place of the quoted values you typed in the query boxes. You'll see why that matters shortly.
- Both return promises, so each call is `await`ed, as with `fetch` in [Asynchronous JavaScript](async){.book-link}.

Here's what it prints:

```{.code environment="message"}
[
  { id: 1, bed: 'B2', crop: 'Radish', kg: 1.2 },
  { id: 2, bed: 'B4', crop: 'Spinach', kg: 2.4 },
  { id: 3, bed: 'B2', crop: 'Lettuce', kg: 3.9 },
  { id: 4, bed: 'B2', crop: 'Lettuce', kg: 2.5 }
]
[
  { crop: 'Radish', kg: 1.2 },
  { crop: 'Lettuce', kg: 3.9 },
  { crop: 'Lettuce', kg: 2.5 }
]
[
  { crop: 'Lettuce', total_kg: 6.4 },
  { crop: 'Spinach', total_kg: 2.4 },
  { crop: 'Radish', total_kg: 1.2 }
]
```

Each row comes back as an object whose property names are the column names, so the snake_case `total_kg` shows up in your JavaScript too. You'll see how the assistant deals with this next.

## Moving the Sign-Ups into PGlite

Here's the request, in a new chat with your learner profile from [A Server with Node and Express](express){.book-link}:

::: {.ai-conversation prompt="Change our Express sign-up API to keep its data in a PGlite database (the @electric-sql/pglite package), stored in a folder named garden-data, instead of in memory, so sign-ups survive a restart. The first time the server starts, it should create the tables and load the starting data from club-data.json. Keep the same routes, status codes and rules as before (including comparing emails in lowercase, and no emails in GET responses)." assistant="Claude" model="claude-sonnet-5" captured="2026-09-28" profile="express" transcript="database/pglite"}
> I don't have your current sign-up API code in front of me — could you paste it (the Express server file, and your `club-data.json`)? I want to convert your actual routes and fields correctly rather than guess at the shape of your data.
>
> While you get that, a few things to flag about the plan:
>
> **About `@electric-sql/pglite`:** This is a real package (Postgres compiled to WebAssembly, so it runs without installing a separate Postgres server). It's fairly new and more niche than something like `pg` — not something with years of widespread use yet, so worth knowing that it's a newer tool rather than a long-established default choice. It stores its data as files, which matches what you want (a `garden-data` folder that persists between restarts).
>
> **How "create tables once" will work:** On startup, the code will check whether the tables already exist. If not, it creates them and loads `club-data.json`. If they do exist, it skips loading, so restarting the server won't duplicate data.
>
> **Async note:** PGlite's queries return promises (you await them), so the route handlers will need to be `async function`s that `await` the database calls, with `try`/`catch` around them to send a `500` if something goes wrong — same pattern as `UrlFetchApp` calls you've already handled with try/catch, just for the database instead.
>
> **Emails and privacy:** I'll keep comparing emails by lowercasing both sides before comparing, and keep emails out of any GET response, same as before.
>
> **File location reminder:** Since `garden-data` is a folder "next to" the script, I'll build its path from the script's own folder (`import.meta.dirname`), not from wherever the terminal happens to be when you run it.
>
> Send over the existing code and JSON file and I'll rewrite it.
:::

Of course: it's a new chat, and the server code is in the old one. You learned in [Working with an AI Assistant](ai-assistant){.book-link} that a new chat starts from nothing, and the assistant was right to ask rather than invent a server that only resembled yours. Its notes are sound, too, including the honest warning that PGlite is newer than most tools you've used. So paste the code:

::: {.ai-conversation prompt="Here is the current server.js: (then paste the whole file) club-data.json has three arrays: members (objects with firstName, lastName, email), slots (objects with id, date, task, start, end, capacity) and slotSignups (objects with id, slotId, memberEmail). I'm using Node 24 and @electric-sql/pglite 0.5.8." assistant="Claude" model="claude-sonnet-5" captured="2026-09-28" profile="express" transcript="database/pglite"}
> Here's the setup split into two files: a new `db.js` that handles the database connection and setup, and the updated `server.js` that uses it.
>
> ## Install the package
>
> ```
> npm install @electric-sql/pglite@0.5.8
> ```
>
> This is a fairly new package (as I mentioned before), so I'm not 100% certain about every detail of its behavior — in particular, whether `count(*)` comes back as a string or a number, and the exact shape of what `db.query()` returns. I've written the code based on its documented API (which mirrors the widely-used `pg` package's style: `db.query(sql, params)` returns `{ rows: [...] }`), but **please test each route after this change** and let me know if anything doesn't match, so we can adjust.
>
> ## db.js (new file)
>
> ```js
> import { PGlite } from "@electric-sql/pglite"
> import { readFileSync } from "node:fs"
> import { join } from "node:path"
>
> // the database's files live in a garden-data folder next to this script,
> // so restarting the server doesn't lose any data
> const db = new PGlite(join(import.meta.dirname, "garden-data"))
>
> // creates the tables the first time the server runs, and loads
> // club-data.json's starting data. Later restarts skip this, so
> // sign-ups already in the database aren't overwritten.
> export async function setupDatabase() {
>   const existing = await db.query(`
>     select table_name from information_schema.tables
>     where table_schema = 'public' and table_name = 'members'
>   `)
>
>   if (existing.rows.length > 0) {
>     console.log("Database already set up")
>     return
>   }
>
>   console.log("Setting up database for the first time...")
>
>   await db.exec(`
>     create table members (
>       email text primary key,
>       first_name text not null,
>       last_name text not null
>     )
>   `)
>
>   await db.exec(`
>     create table slots (
>       id integer primary key,
>       date text not null,
>       task text not null,
>       start text not null,
>       "end" text not null,
>       capacity integer not null
>     )
>   `)
>
>   await db.exec(`
>     create table slot_signups (
>       id integer primary key,
>       slot_id integer not null references slots(id),
>       member_email text not null
>     )
>   `)
>
>   const data = JSON.parse(
>     readFileSync(join(import.meta.dirname, "club-data.json"), "utf8")
>   )
>
>   for (const member of data.members) {
>     await db.query(
>       "insert into members (email, first_name, last_name) values ($1, $2, $3)",
>       [member.email.toLowerCase(), member.firstName, member.lastName]
>     )
>   }
>
>   for (const slot of data.slots) {
>     await db.query(
>       `insert into slots (id, date, task, start, "end", capacity)
>        values ($1, $2, $3, $4, $5, $6)`,
>       [slot.id, slot.date, slot.task, slot.start, slot.end, slot.capacity]
>     )
>   }
>
>   for (const signup of data.slotSignups) {
>     await db.query(
>       "insert into slot_signups (id, slot_id, member_email) values ($1, $2, $3)",
>       [signup.id, signup.slotId, signup.memberEmail.toLowerCase()]
>     )
>   }
>
>   console.log(
>     `Loaded ${data.members.length} members, ${data.slots.length} slots, ${data.slotSignups.length} signups`
>   )
> }
>
> export { db }
> ```
>
> **What this does:** `information_schema.tables` is a built-in list every Postgres-style database keeps of its own tables. Checking it for a `members` table tells us whether this is a fresh database or one that already has data — that's how we avoid reloading `club-data.json` (and duplicating sign-ups) on every restart.
>
> ## server.js (updated)
>
> ```js
> import express from "express"
> import { join } from "node:path"
> import { db, setupDatabase } from "./db.js"
>
> const app = express()
> app.use(express.json())
> app.use(express.static(join(import.meta.dirname, "public")))
>
> // turns a database row into what a shift looks like to the outside world: no emails
> function toShift(row) {
>   return {
>     id: row.id,
>     date: row.date,
>     task: row.task,
>     start: row.start,
>     end: row.end,
>     capacity: row.capacity,
>     spotsFilled: Number(row.spots_filled)
>   }
> }
>
> function toSignup(row) {
>   return { id: row.id, slotId: row.slot_id, memberEmail: row.member_email }
> }
>
> app.get("/shifts", async (req, res) => {
>   try {
>     const result = await db.query(`
>       select s.id, s.date, s.task, s.start, s."end", s.capacity,
>              count(su.id) as spots_filled
>       from slots s
>       left join slot_signups su on su.slot_id = s.id
>       group by s.id, s.date, s.task, s.start, s."end", s.capacity
>       order by s.id
>     `)
>     res.json(result.rows.map(toShift))
>   } catch (error) {
>     console.error(error)
>     res.status(500).json({ error: "Something went wrong" })
>   }
> })
>
> app.get("/shifts/:id", async (req, res) => {
>   try {
>     const result = await db.query(`
>       select s.id, s.date, s.task, s.start, s."end", s.capacity,
>              count(su.id) as spots_filled
>       from slots s
>       left join slot_signups su on su.slot_id = s.id
>       where s.id = $1
>       group by s.id, s.date, s.task, s.start, s."end", s.capacity
>     `, [Number(req.params.id)])
>
>     if (result.rows.length === 0) {
>       return res.status(404).json({ error: "Shift not found" })
>     }
>     res.json(toShift(result.rows[0]))
>   } catch (error) {
>     console.error(error)
>     res.status(500).json({ error: "Something went wrong" })
>   }
> })
>
> app.post("/shifts/:id/signups", async (req, res) => {
>   try {
>     const slotId = Number(req.params.id)
>     const slotResult = await db.query(
>       "select id, capacity from slots where id = $1",
>       [slotId]
>     )
>     if (slotResult.rows.length === 0) {
>       return res.status(404).json({ error: "Shift not found" })
>     }
>     const slot = slotResult.rows[0]
>
>     // emails aren't case-sensitive, so compare them in lowercase
>     const email = String(req.body.email ?? "").trim().toLowerCase()
>     if (email === "") {
>       return res.status(400).json({ error: "Email is required" })
>     }
>
>     const memberResult = await db.query(
>       "select email from members where email = $1",
>       [email]
>     )
>     if (memberResult.rows.length === 0) {
>       return res.status(400).json({ error: "That email doesn't belong to a club member" })
>     }
>
>     const existingResult = await db.query(
>       "select id from slot_signups where slot_id = $1 and member_email = $2",
>       [slotId, email]
>     )
>     if (existingResult.rows.length > 0) {
>       return res.status(409).json({ error: "You're already signed up for this shift" })
>     }
>
>     const countResult = await db.query(
>       "select count(*) as count from slot_signups where slot_id = $1",
>       [slotId]
>     )
>     if (Number(countResult.rows[0].count) >= slot.capacity) {
>       return res.status(409).json({ error: "This shift is full" })
>     }
>
>     const nextIdResult = await db.query(
>       "select coalesce(max(id), 0) + 1 as next_id from slot_signups"
>     )
>     const nextId = nextIdResult.rows[0].next_id
>
>     const insertResult = await db.query(
>       "insert into slot_signups (id, slot_id, member_email) values ($1, $2, $3) returning *",
>       [nextId, slotId, email]
>     )
>
>     res.status(201).json(toSignup(insertResult.rows[0]))
>   } catch (error) {
>     console.error(error)
>     res.status(500).json({ error: "Something went wrong" })
>   }
> })
>
> app.delete("/signups/:id", async (req, res) => {
>   try {
>     const result = await db.query(
>       "delete from slot_signups where id = $1 returning id",
>       [Number(req.params.id)]
>     )
>     if (result.rows.length === 0) {
>       return res.status(404).json({ error: "Sign-up not found" })
>     }
>     res.status(204).end()
>   } catch (error) {
>     console.error(error)
>     res.status(500).json({ error: "Something went wrong" })
>   }
> })
>
> async function start() {
>   await setupDatabase()
>   // 127.0.0.1 means only this computer can connect
>   app.listen(3000, "127.0.0.1", () => {
>     console.log("Sign-up API running at http://localhost:3000")
>   })
> }
>
> start()
> ```
>
> ## What changed and why
>
> - Route handlers are now `async` and `await` the database calls, wrapped in `try`/`catch` so a database problem sends back a `500` instead of crashing the server.
> - `$1`, `$2` in the SQL are placeholders — the database fills them in safely with the values from the array, which avoids ever building SQL text out of user input directly.
> - Instead of a `nextSignupId` variable in memory, the next sign-up ID is calculated from the database itself (`max(id) + 1`), since a plain variable wouldn't survive a restart anyway.
> - The two `toShift`/`toSignup` functions translate the database's column names (like `slot_id`) back into the camelCase names your API already used (`slotId`), so nothing changes for whoever calls this API.
>
> ## Before you run it
>
> Since this creates tables and loads starting data automatically, it's guarded so it only happens once (checked by looking for the `members` table). Still, I'd suggest:
>
> 1. Run the server once and watch the console for "Setting up database for the first time..." and the loaded counts.
> 2. Check the API with `curl` (or your test script) — same routes as before.
> 3. Stop the server (Ctrl+C) and start it again — it should print "Database already set up" and your sign-ups should still be there.
> 4. If you want to start over, delete the `garden-data` folder and run it again.
>
> One limitation worth knowing: calculating the next sign-up ID with `max(id) + 1` could clash if two sign-ups arrived at the exact same instant, since nothing reserves that number in between. For a small club sign-up app this is unlikely to matter, but it's a real limitation of this simple approach compared to letting the database generate IDs itself with a proper auto-incrementing column.
:::

**Read.** This is a careful reply, and it's worth reading in three parts.

**The tables.** Each array becomes a table, and the setup code lives in its own module, `db.js`, which `server.js` imports, as in [Modules and Packages](node-modules){.book-link}. The columns have types, `text` and `integer`, and **constraints**, rules the database enforces itself: `primary key` means each row's value is unique and identifies it, `not null` means a value is required, and `references slots(id)` means a sign-up's `slot_id` must be the id of a real slot. The first run is detected by asking `information_schema.tables`, the database's own list of its tables, whether `members` exists yet.

::: {.c5i .lxv}
**The names.** The assistant handled Postgres's lowercase names without being asked. The columns are in snake_case, `first_name` and `slot_id`, and two small functions, `toShift` and `toSignup`, turn each row back into the camelCase names your API has always sent, so the JSON doesn't change. And `"end"` is in double quotes everywhere, because `end` is a word Postgres reserves for its own use; without the quotes, `CREATE TABLE` fails with `syntax error at or near "end"`. The dates stay as text, as in `club-data.json`; Postgres has a real `date` type, but PGlite turns those into JavaScript `Date` objects, which would change what the API sends.
:::

**The queries.** Each route's array methods became SQL, and each handler is now `async`, with `try` and `catch` sending a 500 status if the database has a problem. The interesting query lists shifts with their counts:

```{.code environment="none"}
select s.id, s.date, s.task, s.start, s."end", s.capacity,
       count(su.id) as spots_filled
from slots s
left join slot_signups su on su.slot_id = s.id
group by s.id, s.date, s.task, s.start, s."end", s.capacity
order by s.id
```

`slots s` gives the table a short nickname, so `s.id` means the `id` column of `slots`. A **`JOIN`** combines rows from two tables where a condition matches, here each slot with its sign-ups. **`LEFT JOIN`** keeps slots that have no sign-ups at all, such as shift 6, which a plain `JOIN` would drop. `GROUP BY` and `COUNT` then count each slot's sign-ups. Postgres insists that every selected column be either grouped or counted; grouping by `s.id` alone would be enough, because the id decides the rest, but listing them all is clear. And because only the slot's columns and the count are selected, the emails never leave the database for a GET request, so your profile's rule is kept by the query itself.

The assistant wasn't sure whether a count comes back as a number or as a string, so it wrapped each one in `Number()` and asked you to test. PGlite returns a number; the widely used `pg` package, for Postgres servers, returns a string. Keeping `Number()` means the code works with both.

The code works. The book's test script from [A Server with Node and Express](express){.book-link} passes against it, and a sign-up made before stopping the server is still there after starting it again.

### Three improvements

Three parts can be made sturdier. The first is a real bug; the other two matter more once the database is on a server that many requests reach at once, as in the next lesson.

- **Setup that fails halfway.** The setup creates the tables and *then* reads `club-data.json`. If the file has a typo, the server stops with an error, but the tables now exist. Fix the typo and start again, and the server prints "Database already set up" and runs with no members and no shifts. This happened when we tried it. The fix is a **transaction**: a group of changes that happen completely or not at all. If any step inside fails, the database undoes the others, so the tables are either all there, with their data, or not there at all. (Reading `club-data.json` before creating anything helps too.)
- **Numbering sign-ups.** The server finds the highest id and adds 1. The assistant pointed out itself that two sign-ups arriving together could both pick the same number. The database can number rows itself, as in the SQL tour. The starting sign-ups come with their own ids, 1 to 12, so after loading them the setup tells the database to continue from the highest one.
- **Signing up twice.** The server checks for an existing sign-up and then inserts one, as separate steps. Two requests from the same member arriving together could both pass the check before either inserts. A `UNIQUE` constraint on `slot_id` and `member_email` makes the database refuse the second, whatever the timing. The route then turns that refusal into the usual 409.

We couldn't make either of the last two happen on our computer: PGlite runs one query at a time, so the overlapping requests we sent were handled in turn. A Postgres server handling many connections at once has no such luck. Here's `db.js` with all three changes:

```{.code environment="nodejs"}
import { PGlite } from "@electric-sql/pglite"
import { readFileSync } from "node:fs"
import { join } from "node:path"

// the database's files live in a garden-data folder next to this script,
// so restarting the server doesn't lose any data
const db = new PGlite(join(import.meta.dirname, "garden-data"))

// creates the tables the first time the server runs, and loads
// club-data.json's starting data. Later restarts skip this, so
// sign-ups already in the database aren't overwritten.
export async function setupDatabase() {
  const existing = await db.query(`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_name = 'members'
  `)

  if (existing.rows.length > 0) {
    console.log("Database already set up")
    return
  }

  console.log("Setting up database for the first time...")

  const data = JSON.parse(
    readFileSync(join(import.meta.dirname, "club-data.json"), "utf8")
  )

  // everything inside the transaction happens completely or not at all:
  // if any step fails, the tables it created are removed again
  await db.transaction(async tx => {
    await tx.exec(`
      create table members (
        email text primary key,
        first_name text not null,
        last_name text not null
      )
    `)

    await tx.exec(`
      create table slots (
        id integer primary key,
        date text not null,
        task text not null,
        start text not null,
        "end" text not null,
        capacity integer not null
      )
    `)

    // the database numbers new sign-ups itself, and one member
    // can sign up for a shift only once
    await tx.exec(`
      create table slot_signups (
        id integer generated by default as identity primary key,
        slot_id integer not null references slots(id),
        member_email text not null,
        unique (slot_id, member_email)
      )
    `)

    for (const member of data.members) {
      await tx.query(
        "insert into members (email, first_name, last_name) values ($1, $2, $3)",
        [member.email.toLowerCase(), member.firstName, member.lastName]
      )
    }

    for (const slot of data.slots) {
      await tx.query(
        `insert into slots (id, date, task, start, "end", capacity)
         values ($1, $2, $3, $4, $5, $6)`,
        [slot.id, slot.date, slot.task, slot.start, slot.end, slot.capacity]
      )
    }

    for (const signup of data.slotSignups) {
      await tx.query(
        "insert into slot_signups (id, slot_id, member_email) values ($1, $2, $3)",
        [signup.id, signup.slotId, signup.memberEmail.toLowerCase()]
      )
    }

    // the sign-ups above came with their own ids, so tell the database
    // to continue numbering after the highest one
    await tx.query(
      "select setval(pg_get_serial_sequence('slot_signups', 'id'), max(id)) from slot_signups"
    )
  })

  console.log(
    `Loaded ${data.members.length} members, ${data.slots.length} slots, ${data.slotSignups.length} signups`
  )
}

export { db }
```

::: {.oh2}
- **`db.transaction(async tx => { ... })`** runs the function inside a transaction. Inside it, use `tx`, not `db`, for every query. If anything in the function throws an error, every change it made is undone.
- **`generated by default as identity`** numbers new rows, as `ALWAYS` did in the tour, but `BY DEFAULT` still lets the setup insert the starting sign-ups with their own ids.
- **`setval(pg_get_serial_sequence('slot_signups', 'id'), max(id))`** looks up the counter the database numbers sign-ups with and sets it to the highest id loaded, so the next sign-up gets 13.
- **`unique (slot_id, member_email)`** allows each member only once per shift.
:::

::: {.owt .heb}
In `server.js`, only the end of the sign-up route changes. The insert leaves out the id, and `returning *` sends back the new row, id included. The `catch` recognizes the `UNIQUE` refusal by its **error code**: Postgres gives every kind of error a code, and `23505` means a unique rule was broken. Any other error is still a real problem and gets the 500:
:::

```{.code environment="nodejs"}
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
```

Here's what the first start printed, followed by the test script:

```{.code environment="message"}
Setting up database for the first time...
Loaded 12 members, 8 slots, 12 signups
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
```

Stop the server and start it again: this time it prints "Database already set up", and any sign-ups made before the restart are still there. One difference from before: sign up again and the new sign-up gets id 14, not 13. The database never reuses a number, even after a row is deleted, so an old id can't be confused with a new sign-up.

We also tried the typo again, by removing one slot's `end` time from `club-data.json`. The setup stopped with `null value in column "end" of relation "slots" violates not-null constraint`, the transaction undid everything, and once the file was fixed, the next start set everything up properly.

::: {.tip}
When PGlite reports an error your code doesn't catch, Node first prints a very long line of unreadable code from inside the package. Scroll past it: the line starting with `error:` says what went wrong, in plain words.
:::

## SQL Injection

Every query uses `$1` placeholders, even where building the SQL with a template literal would be shorter. Continuing the chat:

::: {.ai-conversation prompt="Why do the queries use $1 and $2 placeholders, like where email = $1, instead of putting the email straight into the SQL with a template literal? It would be shorter." assistant="Claude" model="claude-sonnet-5" captured="2026-09-28" profile="express" transcript="database/pglite"}
> Good question — it would definitely be shorter to write, and it might even seem to work fine while you're testing it yourself. The problem is what happens with unexpected input.
>
> ## What could go wrong
>
> Imagine building the query with a template literal, like this:
>
> ```js
> const result = await db.query(`select * from members where email = '${email}'`)
> ```
>
> Normally `email` is something like `"ava@example.com"`, so the final query looks fine:
>
> ```sql
> select * from members where email = 'ava@example.com'
> ```
>
> But `email` comes from `req.body.email` — something anyone sending a request can set to *any* text at all. If someone sent this as the email:
>
> ```
> ' or '1'='1
> ```
>
> the template literal would build this query:
>
> ```sql
> select * from members where email = '' or '1'='1'
> ```
>
> Since `'1'='1'` is always true, that query would match every row in the table, not zero rows like you intended. Depending on the query, an attacker could use this trick to bypass checks, read data they shouldn't see, or even delete rows. This is a well-known attack called **SQL injection**.
>
> ## Why $1 avoids the problem
>
> ```js
> await db.query("select * from members where email = $1", [email])
> ```
>
> Here, the SQL text and the value are sent to the database *separately*. The database treats `$1` purely as a placeholder for a value — never as SQL code to run — so no matter what text is inside `email`, it's only ever compared as a plain string. There's no way for it to change the meaning of the query.
>
> So it's not just shorter vs. longer — the placeholder version is actually safe against input designed to manipulate the query, and the template literal version isn't. This matters most exactly where you're using it: anywhere a value comes from `req.body` or `req.params`, i.e. from someone else's request.
:::

This is one of the most important security lessons in programming, and the explanation is exactly right. You can see it happen:

```{.code environment="nodejs"}
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
```

It prints:

```{.code environment="message"}
Built with a template literal: [ { email: 'ava.lopez@example.com', first_name: 'Ava' } ]
Passed with a placeholder: []
```

The template-literal query found Ava's record, even though nobody typed her email. The placeholder query looked for a member whose email is literally `' OR '1'='1` and found none. In the sign-up server, the unsafe version would let anyone pass the "club member" check. It's the same principle as text in HTML, from [A Web App with Apps Script](web-app){.book-link}: text that gets inserted into another language is read as that language, unless it's passed as data.

::: {.term .aid .mha}
> **SQL injection** — An attack in which text typed by a user becomes part of a SQL command, changing what the command does. Prevented by passing values with placeholders instead of building SQL text.
:::

## The Database Folder

The `garden-data` folder is now where the club's sign-ups live, so treat it like the valuable thing it is:

- **Stop the server before touching it.** Only one program at a time should open the folder. Stop the server with Ctrl+C, rather than closing the terminal window, so it can finish what it's writing.
- **Back it up** by copying the whole folder while the server is stopped.
- **Keep it out of anything public:** out of a website's folder, from [Publishing a Site for Free](publishing){.book-link}, and out of shared code, because it contains members' emails.
- **To look inside,** write a short script that opens the folder and prints a table, and run it while the server is stopped. `console.table` prints rows as a neat table:

```{.code environment="nodejs"}
import { PGlite } from "@electric-sql/pglite"
import { join } from "node:path"

// stop the server first: only one program at a time should open the folder
const db = new PGlite(join(import.meta.dirname, "garden-data"))

const signups = await db.query("SELECT * FROM slot_signups ORDER BY id")
console.table(signups.rows)

await db.close()
```

::: {.lam}
`db.close()` closes the database properly, so the folder is left tidy for the server.
:::

::: {.note}
**Going further with SQL.** This lesson uses a small part of SQL. The SQL book covers much more, including joins, views and transactions, and it uses the same database, so everything there works in your server too.
:::

## Your Learner Profile

::: {.learner-profile}
:::

## Summary

A database stores data safely, handles many changes at once and answers questions quickly, which a JSON file can't. PGlite is PostgreSQL packaged to run inside Node, keeping its data in a folder: `exec` runs SQL, and `query` runs a statement with `$1` placeholders and returns its `rows`. Tables have typed columns and constraints such as `PRIMARY KEY`, `UNIQUE` and `REFERENCES`, which let the database itself enforce the club's rules, and a transaction makes a group of changes happen completely or not at all. Postgres turns unquoted names into lowercase, so SQL names are written in snake_case and turned into camelCase in JavaScript. SQL's `SELECT` chooses rows with `WHERE`, combines tables with `JOIN`, and groups and counts with `GROUP BY` and `COUNT`. Always pass values through placeholders; building SQL from user input allows SQL injection. The sign-ups now survive a restart. Next, the API moves off your computer and onto the internet, with Cloudflare Workers and a Postgres database online.
