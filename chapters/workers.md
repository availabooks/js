---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain what serverless means, and how a Cloudflare Worker handles requests.
2. Create a Worker project and a D1 database with Wrangler, test it locally and deploy it.
3. Write a Worker's `fetch` handler: read the request, route it, and build `Response` objects.
4. Move code to a new platform without losing its rules, by giving the assistant the whole specification.
5. Protect actions on a public API, such as cancelling, with a secret only the right person has.
:::
:::

## Serverless

The sign-up server runs on your computer, so it's only available while your computer is on, and only to you. To let every club member sign up from their phone, it has to run somewhere that's always on and reachable from the internet.

One way is to rent a server and keep it running. Another is **serverless**: you give your code to a company, and it runs the code whenever a request arrives, on computers you never see or manage. **Cloudflare Workers** is a serverless platform with a free plan, and it's where the club's website already lives, since [Publishing a Site for Free](publishing){.book-link}. Its database, **D1**, is SQLite, so the SQL from [Storing Data](database){.book-link} carries over almost unchanged.

::: {.term}
> **Serverless** — Running code on a provider's computers, which start it when requests arrive, instead of on a server you set up and keep running yourself.
:::

A Worker is simpler than an Express server in one way: there's no `app.listen`, because Cloudflare does the listening. Your code is a function that receives a request and returns a response:

```{.code environment="none"}
export default {
  async fetch(request, env) {
    return new Response("Hello from the College Community Garden!")
  }
}
```

`request` is a standard **Request** object, the same kind `fetch` sends, and the function returns a standard **Response**, the same kind `fetch` receives. So everything you learned about requests and responses in [How the Web Works](http){.book-link} applies directly. `env` holds the Worker's **bindings**: connections to other Cloudflare services, such as a D1 database.

::: {.term .v5k}
> **Binding** — In a Cloudflare Worker, a named connection to a resource such as a D1 database, available in the code as a property of `env`, such as `env.DB`.
:::

## Moving the API

Here's the request, in a new chat with your learner profile from [Storing Data](database){.book-link}:

::: {.ai-conversation prompt="Now I want to move the sign-up API online with Cloudflare Workers, using a D1 database instead of the SQLite file, on the free plan. The routes and rules stay the same: GET /shifts, GET /shifts/:id, POST /shifts/:id/signups with { &quot;email&quot;: &quot;...&quot; }, DELETE /signups/:id, with the same status codes, lowercase email comparison, placeholders in SQL, and no emails in GET responses. The tables are members (email, firstName, lastName), slots (id, date, task, start, end, capacity) and slotSignups (id, slotId, memberEmail, with UNIQUE (slotId, memberEmail)). Walk me through creating the project, the database and the Worker code, without extra packages." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="database" transcript="workers/worker-api"}
> This is a good next step — same logic, new hosting. Since I don't have your original Express code in front of me, I'll build this from the routes and rules you described, and flag a few small business-logic decisions (like whether a shift can go over capacity) for you to confirm against your original version.
>
> ## Before you start
>
> - You'll need a free Cloudflare account (sign up at cloudflare.com if you don't have one).
> - We'll use **Wrangler**, Cloudflare's own official command-line tool for building and deploying Workers. It's not a package your code depends on — it's a dev-time tool, like `node` itself, so trusting it is reasonable.
> - The free plan has limits on Worker requests per day and D1 storage/reads/writes per day. I don't want to state exact numbers here since Cloudflare changes them — check the current limits on Cloudflare's pricing page before relying on this for real signups.
>
> ## 1. Create the project folder
>
> ```
> mkdir signup-api
> cd signup-api
> npm init -y
> npm install --save-dev wrangler
> ```
>
> - `npm init -y` makes a basic `package.json`.
> - Installing `wrangler` as a dev dependency records the exact version in `package-lock.json`, so it's reproducible. I don't want to guess the current version number since it changes often — npm will grab the latest, and that's fine to start with.
>
> Log in once, so Wrangler can act on your Cloudflare account:
>
> ```
> npx wrangler login
> ```
>
> This opens your browser to authorize Wrangler.
>
> ## 2. Create the D1 database
>
> ```
> npx wrangler d1 create signup-db
> ```
>
> This creates a real database in your Cloudflare account and prints a `database_id`. Copy that value — you'll need it next.
>
> ## 3. Configure the project
>
> Create a file named `wrangler.toml` in the project folder:
>
> ```toml
> name = "signup-api"
> main = "src/index.js"
> compatibility_date = "2024-09-23"
>
> [[d1_databases]]
> binding = "DB"
> database_name = "signup-db"
> database_id = "paste-the-id-here"
> ```
>
> - `main` says which file is the Worker's code.
> - `compatibility_date` can be set to today's date.
> - The `[[d1_databases]]` block connects your database to the Worker. Inside your code, you'll reach it as `env.DB`.
>
> ## 4. Define the schema
>
> Create `schema.sql` in the project folder:
>
> ```sql
> CREATE TABLE IF NOT EXISTS members (
>   email TEXT PRIMARY KEY,
>   firstName TEXT NOT NULL,
>   lastName TEXT NOT NULL
> );
>
> CREATE TABLE IF NOT EXISTS slots (
>   id INTEGER PRIMARY KEY,
>   date TEXT NOT NULL,
>   task TEXT NOT NULL,
>   start TEXT NOT NULL,
>   end TEXT NOT NULL,
>   capacity INTEGER NOT NULL
> );
>
> CREATE TABLE IF NOT EXISTS slotSignups (
>   id INTEGER PRIMARY KEY,
>   slotId INTEGER NOT NULL,
>   memberEmail TEXT NOT NULL,
>   UNIQUE (slotId, memberEmail)
> );
> ```
>
> (SQL files still use semicolons — the no-semicolon rule is just for JavaScript.)
>
> Apply it to a **local** copy first (used when you test on your own machine), then to the **real, remote** database:
>
> ```
> npx wrangler d1 execute signup-db --local --file=./schema.sql
> npx wrangler d1 execute signup-db --remote --file=./schema.sql
> ```
>
> ## 5. Write the Worker code
>
> Create `src/index.js`. I'll build it piece by piece.
>
> **A small helper to send JSON responses.** Workers don't have `res.json()` like Express — instead you build a `Response` object directly:
>
> ```js
> function json(data, status = 200) {
>   return new Response(JSON.stringify(data), {
>     status,
>     headers: { "content-type": "application/json" }
>   })
> }
> ```
>
> **The router.** A Worker exports an object with a `fetch` function that runs for every request. There's no `express.Router` here, so we check the method and path by hand:
>
> ```js
> export default {
>   async fetch(request, env) {
>     const url = new URL(request.url)
>     const parts = url.pathname.split("/").filter(part => part !== "")
>     const method = request.method
>
>     if (method === "GET" && parts.length === 1 && parts[0] === "shifts") {
>       return getShifts(env)
>     }
>
>     if (method === "GET" && parts.length === 2 && parts[0] === "shifts") {
>       return getShift(env, parts[1])
>     }
>
>     if (method === "POST" && parts.length === 3 && parts[0] === "shifts" && parts[2] === "signups") {
>       return createSignup(request, env, parts[1])
>     }
>
>     if (method === "DELETE" && parts.length === 2 && parts[0] === "signups") {
>       return deleteSignup(env, parts[1])
>     }
>
>     return json({ error: "Not found" }, 404)
>   }
> }
> ```
>
> **GET /shifts** — lists shifts with a signup count, but no emails:
>
> ```js
> async function getShifts(env) {
>   const { results } = await env.DB.prepare(
>     `SELECT slots.id, slots.date, slots.task, slots.start, slots.end, slots.capacity,
>             COUNT(slotSignups.id) AS signupCount
>      FROM slots
>      LEFT JOIN slotSignups ON slotSignups.slotId = slots.id
>      GROUP BY slots.id
>      ORDER BY slots.date, slots.start`
>   ).all()
>   return json(results)
> }
> ```
>
> **GET /shifts/:id** — one shift, 404 if missing:
>
> ```js
> async function getShift(env, idText) {
>   const id = Number(idText)
>   if (isNaN(id)) return json({ error: "Invalid id" }, 400)
>
>   const slot = await env.DB.prepare(
>     `SELECT slots.id, slots.date, slots.task, slots.start, slots.end, slots.capacity,
>             COUNT(slotSignups.id) AS signupCount
>      FROM slots
>      LEFT JOIN slotSignups ON slotSignups.slotId = slots.id
>      WHERE slots.id = ?
>      GROUP BY slots.id`
>   ).bind(id).first()
>
>   if (slot === null) return json({ error: "Shift not found" }, 404)
>   return json(slot)
> }
> ```
>
> **POST /shifts/:id/signups** — my assumptions here (please tell me if your original API did these differently): reject a full shift with 409, reject a duplicate signup with 409, and don't require the email to already exist in `members`.
>
> ```js
> async function createSignup(request, env, idText) {
>   const slotId = Number(idText)
>   if (isNaN(slotId)) return json({ error: "Invalid id" }, 400)
>
>   let body
>   try {
>     body = await request.json()
>   } catch {
>     return json({ error: "Body must be JSON" }, 400)
>   }
>
>   const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
>   if (email === "") return json({ error: "Email is required" }, 400)
>
>   const slot = await env.DB.prepare(`SELECT capacity FROM slots WHERE id = ?`).bind(slotId).first()
>   if (slot === null) return json({ error: "Shift not found" }, 404)
>
>   const countRow = await env.DB.prepare(
>     `SELECT COUNT(*) AS count FROM slotSignups WHERE slotId = ?`
>   ).bind(slotId).first()
>
>   if (countRow.count >= slot.capacity) return json({ error: "Shift is full" }, 409)
>
>   try {
>     const result = await env.DB.prepare(
>       `INSERT INTO slotSignups (slotId, memberEmail) VALUES (?, ?)`
>     ).bind(slotId, email).run()
>
>     return json({ id: result.meta.last_row_id, slotId }, 201)
>   } catch (error) {
>     if (error.message.includes("UNIQUE constraint failed")) {
>       return json({ error: "Already signed up for this shift" }, 409)
>     }
>     throw error
>   }
> }
> ```
>
> Note: `env.DB.prepare(...).bind(...).run()` is D1's equivalent of `db.prepare(...).run(...)` from `node:sqlite`. I believe `result.meta.last_row_id` and `result.meta.changes` are the right property names, but D1 is a newer API — if `last_row_id` doesn't show up, check the object with `console.log(result)` in `wrangler dev` and I'll help adjust.
>
> **DELETE /signups/:id**:
>
> ```js
> async function deleteSignup(env, idText) {
>   const id = Number(idText)
:::

The reply stopped in the middle of a function. Long replies sometimes do, when they reach the limit on how much the assistant can write at once. The fix is simple, and works in any assistant:

::: {.ai-conversation prompt="Your reply was cut off partway through deleteSignup. Please continue from there." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="database" transcript="workers/worker-api"}
> Continuing from where it cut off:
>
> ```js
> async function deleteSignup(env, idText) {
>   const id = Number(idText)
>   if (isNaN(id)) return json({ error: "Invalid id" }, 400)
>
>   const result = await env.DB.prepare(`DELETE FROM slotSignups WHERE id = ?`).bind(id).run()
>
>   if (result.meta.changes === 0) return json({ error: "Signup not found" }, 404)
>   return new Response(null, { status: 204 })
> }
> ```
>
> - Deletes the row matching that id.
> - `result.meta.changes` tells us how many rows were actually deleted. If it's 0, nothing matched, so we return 404.
> - On success, a DELETE conventionally returns **204 No Content** with an empty body, which is why we use `new Response(null, ...)` instead of `json(...)`.
>
> ## 6. Test it locally
>
> ```
> npx wrangler dev
> ```
>
> This starts the Worker on your own computer (something like `http://127.0.0.1:8787`), using the **local** copy of the D1 database you set up in step 4. Try it with curl:
>
> ```
> curl http://127.0.0.1:8787/shifts
> curl http://127.0.0.1:8787/shifts/1
> curl -X POST http://127.0.0.1:8787/shifts/1/signups -H "Content-Type: application/json" -d "{\"email\":\"Ava@Example.com\"}"
> curl -X DELETE http://127.0.0.1:8787/signups/1
> ```
>
> Check that:
> - `/shifts` never shows an email column
> - signing up twice with the same email (any mix of case) gives 409
> - signing up for a nonexistent shift gives 404
> - filling a shift to capacity then trying again gives 409
> - deleting a signup that doesn't exist gives 404, and one that does gives 204 with no body
>
> ## 7. Deploy it for real
>
> Once local testing looks right:
>
> ```
> npx wrangler deploy
> ```
>
> This uploads your Worker code to Cloudflare and connects it to the **remote** D1 database you filled in step 4. Wrangler prints a URL like `https://signup-api.your-subdomain.workers.dev` — that's the live address.
>
> **Who can see this:** anyone with that URL can call every route, including creating and deleting signups, since there's no authentication yet. The GET responses don't include emails, so that part's safe, but the POST and DELETE routes are open to whoever finds the URL. If this is meant to be used only by your own group, you may want to add some form of access control later — let me know if you want to explore that (e.g., a shared secret header) since it's a new topic beyond what's in your list so far.
>
> ## 8. Checking your data
>
> Since the data now lives in Cloudflare's D1, not a file you control, it's worth spot-checking counts after changes rather than assuming they worked. For example, after running a few test signups:
>
> ```
> npx wrangler d1 execute signup-db --remote --command="SELECT COUNT(*) AS total FROM slotSignups"
> ```
>
> This prints a total you can compare against what you expect, similar to how you've checked counts after merges before.
>
> Want to try this end-to-end now, or should we first double check the assumptions I flagged (capacity enforcement, duplicate handling, whether `members` needs to exist before a signup)?
:::

**Read the setup first.** Wrangler, Cloudflare's command-line tool, does the work: `wrangler login` connects it to your account, `wrangler d1 create` makes a database, a configuration file connects the database to the Worker as the binding `DB`, and `wrangler d1 execute` runs SQL files against the database, first a *local* copy for testing, then the real, *remote* one. `wrangler dev` runs the Worker on your own computer, with the local database, and `wrangler deploy` puts it online. The advice to test locally, then check counts in the real database after deploying, is exactly right.

::: {.fce}
Two details in the setup are dated: the configuration file. New Cloudflare projects now usually use `wrangler.jsonc`, the same settings in JSON, and the `compatibility_date` should be a recent date, which the reply mentions. The older `wrangler.toml` still works.
:::

::: {.fzw .xgh}
**Then the code.** The Worker's `fetch` handler does its own routing: it splits the address's path into parts, `/shifts/6/signups` becoming `["shifts", "6", "signups"]`, and checks the method and parts to decide which function handles the request. Each function is the Express route's logic with D1's methods: `env.DB.prepare(sql).bind(values).first()` for one row, `.all()` for many, and `.run()` for changes, all awaited, because D1 is a service across the network. Instead of `res.json()`, a small `json` helper builds a `Response` with the status and a `content-type` header.
:::

### What was lost in the move

Compare this with the API you designed and built, and several things changed that shouldn't have:

- **The member check is gone.** The assistant said so: without your original code, it assumed that sign-ups *don't* require a club member's email. That was a reasonable flag, and it's the wrong assumption. Anyone could sign up with any email.
- **`spotsFilled` became `signupCount`.** The sign-up page from [A Server with Node and Express](express){.book-link} reads `shift.spotsFilled`. With the new name, it would show "NaN spots left." Each half works; together they don't, the lesson from [Building a Browser Extension](extension){.book-link}.
- **The data never arrives.** The reply creates the tables, but never loads the members and shifts into them.

::: {.ffj}
None of this is carelessness. The request said "the routes and rules stay the same," but the assistant, in a new chat, didn't know what the rules *were*: your request listed some and not others. When you move code to a new platform, give the assistant the whole thing: the old code, or a complete list of every rule. "The same as before" means nothing to a chat that wasn't there before.
:::

## A Public API Needs Protection

The reply's own warning points to the biggest change of all: on your computer, only you could reach the API; on Workers, anyone on the internet can. That changes what's safe:

- **Anyone can cancel anyone's sign-up.** `DELETE /signups/13` needs nothing but a number, and the numbers go 1, 2, 3. Someone could cancel every sign-up in a minute.
- **Anyone can sign up anyone,** if they know a member's email.

The second is a real limitation, which a login system would fix, and is beyond this book. The first has a simple fix: when someone signs up, give them a **cancel code**, a long random string that only they receive, and require it to cancel. A number can be guessed; `crypto.randomUUID()`, built into Workers and Node, makes a string like `3b9f0c7e-5a8d-4e1f-9c2b-7d4e6a1f8b30`, which can't be.

::: {.term .la3}
> **Random token** — A long, unguessable random string, such as one from `crypto.randomUUID()`, given to one person as proof that they're allowed to do something, like cancel their own sign-up.
:::

## The Club's Worker

Here's the Worker with everything restored and protected: the member check, the original field names, a `cancelCode` column, and a cancellation that requires it. The configuration file is `wrangler.jsonc`:

```{.code environment="none"}
{
  "name": "garden-signups",
  "main": "src/index.js",
  "compatibility_date": "2026-09-01",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "garden-signups",
      "database_id": "paste-the-id-from-wrangler-d1-create"
    }
  ]
}
```

`schema.sql` creates the tables, with a `cancelCode` column added:

```{.code environment="none"}
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
  cancelCode TEXT NOT NULL,
  UNIQUE (slotId, memberEmail)
);
```

`seed.sql` loads the club's data, generated from `club-data.json`. For the sign-ups that already exist, SQLite makes random cancel codes itself, with `lower(hex(randomblob(16)))`. Here are its first lines:

```{.code environment="none"}
-- the club data at the start of the season
INSERT INTO members (email, firstName, lastName) VALUES ('maya.thompson@example.com', 'Maya', 'Thompson');
INSERT INTO members (email, firstName, lastName) VALUES ('ava.lopez@example.com', 'Ava', 'Lopez');
...
INSERT INTO slots (id, date, task, start, end, capacity) VALUES (1, '2027-06-05', 'watering', '08:00', '09:00', 2);
...
INSERT INTO slotSignups (id, slotId, memberEmail, cancelCode) VALUES (1, 1, 'maya.thompson@example.com', lower(hex(randomblob(16))));
```

And `src/index.js`, the Worker:

```{.code environment="none"}
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
```

Two small new pieces: `request.json().catch(() => ({}))` reads the body as JSON, or gives an empty object if the body isn't valid JSON, so the checks that follow report "Email is required" instead of crashing. And `SHIFT_QUERY` holds the part of the query both GET routes share, with each adding its own ending, the same select-only-what's-public query as before.

### Running it

In a new folder, with the four files above:

```{.code environment="none"}
npm install --save-dev wrangler
npx wrangler login
npx wrangler d1 create garden-signups
```

Copy the `database_id` that `d1 create` prints into `wrangler.jsonc`. Then set up the local database and run the Worker on your computer:

```{.code environment="none"}
npx wrangler d1 execute garden-signups --local --file=./schema.sql
npx wrangler d1 execute garden-signups --local --file=./seed.sql
npx wrangler dev
```

`wrangler dev` runs the Worker at `http://127.0.0.1:8787`. A test script like the one from [A Server with Node and Express](express){.book-link}, with the new cancel codes, printed this:

```{.code environment="message"}
GET /shifts/6 -> 200 {"id":6,"date":"2027-06-19","task":"planting","start":"09:00","end":"11:00","capacity":3,"spotsFilled":0}
POST /shifts/6/signups -> 201 {"id":13,"slotId":6,"cancelCode":"(a random code)"}
POST /shifts/6/signups -> 409 {"error":"You're already signed up for this shift"}
POST /shifts/1/signups -> 409 {"error":"This shift is full"}
POST /shifts/2/signups -> 400 {"error":"That email doesn't belong to a club member"}
DELETE /signups/13 -> 404 {"error":"Sign-up not found, or the cancel code is wrong"}
DELETE /signups/13 -> 204
GET /shifts/6 -> 200 {"id":6,"date":"2027-06-19","task":"planting","start":"09:00","end":"11:00","capacity":3,"spotsFilled":0}
```

A guessed code is refused, and the right one cancels. When it all works locally, run the same two `d1 execute` commands with `--remote` instead of `--local`, then `npx wrangler deploy`. Wrangler prints the Worker's public address, ending in `workers.dev`, and the club's API is online.

::: {.caution}
> **Free plans have limits.** Workers and D1 are free up to daily limits on requests, reads and writes, which a club won't come near, but a script stuck in a loop could. Cloudflare's pricing page lists the current limits. Check the dashboard now and then, and never put an account's API token in code.
:::

### One more wrinkle: CORS

If the sign-up page from [A Server with Node and Express](express){.book-link} stays on the club's website, at a `pages.dev` address, and calls the API at a `workers.dev` address, the browser treats that as a request to *another site*, and applies the CORS rules from [Asynchronous JavaScript](async){.book-link}. The simplest solution is to have the Worker serve the page too, so both come from the same address, which is where the next lesson begins.

## Your Learner Profile

::: {.learner-profile}
:::

The new rule captures what went wrong in the move: an assistant can't keep rules it was never shown.

## Summary

Serverless platforms run your code on their computers whenever a request arrives, and Cloudflare Workers does it for free, within limits. A Worker exports a `fetch` function that receives a standard Request and returns a standard Response, and reaches a D1 database, which is SQLite, through a binding, `env.DB`. Wrangler creates databases, runs SQL against local and remote copies, runs the Worker locally with `wrangler dev`, and deploys it. Moving code to a new platform is where rules get lost: give the assistant the old code or every rule, and test against the original design. An API on the internet can be called by anyone, so protect actions such as cancelling with a random token that only the right person has. Next, the page and the API come together in one app.
