---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Build a web server with Node and Express, with routes for GET, POST and DELETE requests.
2. Read path parameters and JSON bodies, and send JSON responses with the right status codes.
3. Test an API with a script, and with curl.
4. Serve a web page from the same server, and connect it to the API.
5. Control who can reach a server on your computer.
:::
:::

## A Server Is a Program That Waits

Every program you've written so far ran from start to finish and stopped. A server is different: it starts, then waits, possibly for days, and runs some code each time a request arrives. Node can be a server with its built-in `node:http` module, but most people use a package called **Express**, which makes the common jobs, such as sending a different response for each address, much shorter. It's one of the most widely used Node packages there is.

Here's the smallest useful Express server:

```{.code environment="nodejs"}
import express from "express"

const app = express()

app.get("/", (req, res) => {
  res.send("Hello from the College Community Garden!")
})

app.listen(3000, "127.0.0.1", () => {
  console.log("Listening at http://localhost:3000")
})
```

In a project folder with `"type": "module"`, run `npm install express`, then run this with Node. It prints its message and keeps running. Open `http://localhost:3000` in a browser, and you see the greeting. Stop it with **Ctrl+C**.

- **`app.get("/", ...)`** is a **route**: it says "when a GET request arrives for the address `/`, run this function." The function gets two objects: **`req`**, the request, and **`res`**, the response you'll send.
- **`res.send(...)`** sends a response. There's also `res.json(...)`, which sends JSON, and `res.status(404)`, which sets the status code.
- **`app.listen(3000, "127.0.0.1", ...)`** starts listening. `3000` is the **port**, a number that lets many servers share one computer; `localhost:3000` means "port 3000 on this computer." The `"127.0.0.1"` matters too, as you'll see.

::: {.term}
> **Route** — In a server, a rule connecting a method and an address, such as GET `/shifts`, to the code that handles it.
:::

::: {.term}
> **Port** — A number that identifies one server program on a computer, so that many can run at once. `localhost:3000` is port 3000 on your own computer.
:::

## Building the Sign-Up API

In [How the Web Works](http){.book-link}, you designed the club's shift sign-up API. Now build it. The data starts in a file, `club-data.json`, made from the club's data: the members, the eight shift slots in June 2027, and the sign-ups so far. Save it next to the server:

```{.code environment="none"}
{
  "members": [
    {"firstName":"Maya","lastName":"Thompson","email":"maya.thompson@example.com"},
    {"firstName":"Ava","lastName":"Lopez","email":"ava.lopez@example.com"},
    {"firstName":"Ben","lastName":"Okafor","email":"ben.okafor@example.com"},
    {"firstName":"Cam","lastName":"Nguyen","email":"cam.nguyen@example.com"},
    {"firstName":"Dev","lastName":"Patel","email":"dev.patel@example.com"},
    {"firstName":"Elena","lastName":"Rossi","email":"elena.rossi@example.com"},
    {"firstName":"Farah","lastName":"Haddad","email":"farah.haddad@example.com"},
    {"firstName":"Gabe","lastName":"Martinez","email":"gabe.martinez@example.com"},
    {"firstName":"Hana","lastName":"Kim","email":"hana.kim@example.com"},
    {"firstName":"Isaac","lastName":"Cohen","email":"isaac.cohen@example.com"},
    {"firstName":"Jordan","lastName":"Lee","email":"jordan.lee@example.com"},
    {"firstName":"Keisha","lastName":"Brown","email":"keisha.brown@example.com"}
  ],
  "slots": [
    {"id":1,"date":"2027-06-05","task":"watering","start":"08:00","end":"09:00","capacity":2},
    {"id":2,"date":"2027-06-05","task":"harvesting","start":"09:00","end":"11:00","capacity":3},
    {"id":3,"date":"2027-06-12","task":"watering","start":"08:00","end":"09:00","capacity":2},
    {"id":4,"date":"2027-06-12","task":"weeding","start":"09:00","end":"11:00","capacity":4},
    {"id":5,"date":"2027-06-19","task":"watering","start":"08:00","end":"09:00","capacity":2},
    {"id":6,"date":"2027-06-19","task":"planting","start":"09:00","end":"11:00","capacity":3},
    {"id":7,"date":"2027-06-26","task":"watering","start":"08:00","end":"09:00","capacity":2},
    {"id":8,"date":"2027-06-26","task":"harvesting","start":"09:00","end":"11:00","capacity":3}
  ],
  "slotSignups": [
    {"id":1,"slotId":1,"memberEmail":"hana.kim@example.com"},
    {"id":2,"slotId":1,"memberEmail":"farah.haddad@example.com"},
    {"id":3,"slotId":2,"memberEmail":"ava.lopez@example.com"},
    {"id":4,"slotId":3,"memberEmail":"keisha.brown@example.com"},
    {"id":5,"slotId":4,"memberEmail":"dev.patel@example.com"},
    {"id":6,"slotId":4,"memberEmail":"keisha.brown@example.com"},
    {"id":7,"slotId":5,"memberEmail":"maya.thompson@example.com"},
    {"id":8,"slotId":5,"memberEmail":"ben.okafor@example.com"},
    {"id":9,"slotId":7,"memberEmail":"ben.okafor@example.com"},
    {"id":10,"slotId":8,"memberEmail":"keisha.brown@example.com"},
    {"id":11,"slotId":8,"memberEmail":"hana.kim@example.com"},
    {"id":12,"slotId":8,"memberEmail":"gabe.martinez@example.com"}
  ]
}
```

Here's the request, in a new chat with your learner profile from [How the Web Works](http){.book-link}. It describes the data and spells out the design, including the club's answers to the assistant's questions:

::: {.ai-conversation prompt="Build the shift sign-up API we designed, with Node and Express, keeping the data in memory for now. The data starts from a file named club-data.json next to the script, with three arrays: members (objects with firstName, lastName, email), slots (objects with id, date, task, start, end, capacity) and slotSignups (objects with id, slotId, memberEmail). The routes: GET /shifts lists the slots with how many spots are filled; GET /shifts/:id shows one slot with its spots filled; POST /shifts/:id/signups takes JSON { &quot;email&quot;: &quot;...&quot; } and returns 201 with the new sign-up; DELETE /signups/:id returns 204. Use 404 for an unknown shift or sign-up, 400 for a missing email or an email that is not a member, and 409 if the shift is full or the member is already signed up for it. Never include emails in GET responses." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="http" transcript="express/signup-api"}
> Good — this is a nice project because it uses almost everything from your REST/HTTP knowledge plus arrays of objects. Since you asked for Express specifically: it's one of the most widely used Node packages in the world for building APIs, so it's a reasonable choice here (built-in `http` would work too, but Express's routing makes this shorter).
>
> ## Setup
>
> **`package.json`**
> ```json
> {
>   "type": "module",
>   "scripts": {
>     "start": "node server.js"
>   },
>   "dependencies": {
>     "express": "^4.19.2"
>   }
> }
> ```
> Run `npm install express` in the folder first. `"type": "module"` lets you use `import`/`export`.
>
> **`club-data.json`** (sample — put this next to `server.js`)
> ```json
> {
>   "members": [
>     { "firstName": "Ava", "lastName": "Lee", "email": "ava@example.com" },
>     { "firstName": "Sam", "lastName": "Diaz", "email": "sam@example.com" }
>   ],
>   "slots": [
>     { "id": 1, "date": "2024-06-01", "task": "Front desk", "start": "09:00", "end": "12:00", "capacity": 2 },
>     { "id": 2, "date": "2024-06-01", "task": "Cleanup", "start": "12:00", "end": "14:00", "capacity": 1 }
>   ],
>   "slotSignups": [
>     { "id": 1, "slotId": 1, "memberEmail": "ava@example.com" }
>   ]
> }
> ```
>
> ## `server.js`
>
> ```js
> import express from "express"
> import { readFileSync } from "node:fs"
> import { join } from "node:path"
>
> // import.meta.dirname is the folder this script lives in,
> // so the data file is found no matter where you run `node` from
> const dataPath = join(import.meta.dirname, "club-data.json")
> const data = JSON.parse(readFileSync(dataPath, "utf8"))
>
> // Keep the three arrays in memory. Using const because we won't
> // replace the arrays themselves, just push/splice their contents
> const members = data.members
> const slots = data.slots
> const slotSignups = data.slotSignups
>
> // Work out the next sign-up id from the highest one already used
> let nextSignupId = slotSignups.reduce((max, s) => Math.max(max, s.id), 0) + 1
>
> const app = express()
> app.use(express.json()) // lets req.body be read as parsed JSON
>
> // Turn a slot into the shape we're willing to show: never emails
> const shapeSlot = (slot) => ({
>   ...slot,
>   spotsFilled: slotSignups.filter((s) => s.slotId === slot.id).length
> })
>
> // GET /shifts - list every slot with its filled-spot count
> app.get("/shifts", (req, res) => {
>   res.json(slots.map(shapeSlot))
> })
>
> // GET /shifts/:id - one slot with its filled-spot count
> app.get("/shifts/:id", (req, res) => {
>   const id = Number(req.params.id)
>   const slot = slots.find((s) => s.id === id)
>   if (!slot) {
>     res.status(404).json({ error: "Shift not found" })
>     return
>   }
>   res.json(shapeSlot(slot))
> })
>
> // POST /shifts/:id/signups - sign a member up for a shift
> app.post("/shifts/:id/signups", (req, res) => {
>   const slotId = Number(req.params.id)
>   const slot = slots.find((s) => s.id === slotId)
>   if (!slot) {
>     res.status(404).json({ error: "Shift not found" })
>     return
>   }
>
>   const email = req.body.email
>   if (typeof email !== "string" || email.trim() === "") {
>     res.status(400).json({ error: "Email is required" })
>     return
>   }
>
>   const isMember = members.some((m) => m.email === email)
>   if (!isMember) {
>     res.status(400).json({ error: "Email is not a member" })
>     return
>   }
>
>   const spotsFilled = slotSignups.filter((s) => s.slotId === slotId).length
>   if (spotsFilled >= slot.capacity) {
>     res.status(409).json({ error: "Shift is full" })
>     return
>   }
>
>   const alreadySignedUp = slotSignups.some(
>     (s) => s.slotId === slotId && s.memberEmail === email
>   )
>   if (alreadySignedUp) {
>     res.status(409).json({ error: "Already signed up for this shift" })
>     return
>   }
>
>   const newSignup = { id: nextSignupId, slotId, memberEmail: email }
>   nextSignupId += 1
>   slotSignups.push(newSignup)
>   res.status(201).json(newSignup)
> })
>
> // DELETE /signups/:id - cancel a sign-up
> app.delete("/signups/:id", (req, res) => {
>   const id = Number(req.params.id)
>   const index = slotSignups.findIndex((s) => s.id === id)
>   if (index === -1) {
>     res.status(404).json({ error: "Sign-up not found" })
>     return
>   }
>   slotSignups.splice(index, 1)
>   res.status(204).end()
> })
>
> app.listen(3000, () => {
>   console.log("Server running at http://localhost:3000")
> })
> ```
>
> ### What each part does
> - `readFileSync(dataPath, "utf8")` + `JSON.parse` loads your three arrays once, when the server starts.
> - `shapeSlot` builds the object sent back for a slot — it spreads the slot's own fields and adds `spotsFilled`, but never touches `slotSignups`' emails.
> - Each route checks things in order: does the shift exist → is the email valid → is it a real member → is it full → already signed up — returning the matching status code at the first problem found.
> - `slotSignups.push` and `.splice` change the in-memory array directly (no writing back to the file, since you said in-memory for now — restarting the server resets to what's in `club-data.json`).
>
> ### Who can see this
> Since it's `app.listen(3000, ...)` on `localhost`, only your own computer can reach `http://localhost:3000` — nobody else on the internet, or even your network, unless you deliberately expose it later.
>
> ### Testing it with curl
> ```
> curl http://localhost:3000/shifts
> curl http://localhost:3000/shifts/1
> curl -X POST http://localhost:3000/shifts/2/signups -H "Content-Type: application/json" -d "{\"email\":\"sam@example.com\"}"
> curl -X DELETE http://localhost:3000/signups/1
> ```
>
> Since this data disappears when you stop the server (in-memory only), want me to add saving back to `club-data.json` next, or move on to something else first?
:::

**Read.** Each route in the design is one `app.get`, `app.post` or `app.delete`, and each follows the same pattern: find what the request is about, check for every problem, send an error response at the first one, and otherwise do the work and send the result.

- **`app.use(express.json())`** tells Express to read JSON request bodies, so `req.body.email` works in the POST route.
- **`req.params.id`** is the `:id` part of the address, always a string, which is why it goes through `Number()` before comparing with the numeric ids.
- **`find`**, **`some`** and **`filter`** do the looking up, as in [Scripting Your Notes in Obsidian](obsidian){.book-link}. Two array methods are new: **`findIndex`**, which gives the position of the first match, or -1, and **`splice(index, 1)`**, which removes one item at that position.
- **`res.status(409).json({ error: ... })`** sends an error with a status code and a JSON message, in the shape the design chose. The `return` after each one stops the route there.
- **`shapeSlot`** builds what a slot looks like to the outside world, with its spots filled but no emails, following your profile's new rule. It uses **object spread**, `{ ...slot, spotsFilled: ... }`, which copies all of a slot's properties into a new object and adds one: the object version of the array spread from [Working with Files and Folders](files){.book-link}.

::: {.term}
> **Object spread** — `{ ...object, name: value }`, which makes a new object with all of an object's properties, plus or replacing the ones listed after it.
:::

A few details to check:

- **The version in `package.json`.** It says `"express": "^4.19.2"`, but the current version of Express is 5. The code works with both, but there's no reason to start with the old one: `npm install express` installs the current version and writes it into `package.json` for you. As with model names, version numbers in replies are memories.
- **The sample data is invented,** from 2024, with tasks like "Front desk." Use the club's `club-data.json` above.
- **Emails aren't compared carefully.** `Ava.Lopez@example.com`, with capitals, would be rejected as "not a member." Emails should be compared in lowercase, as you saw in [Scripting Airtable](airtable){.book-link}.

## Testing the API

The reply suggests testing with curl, which is a good way to see exactly what goes over the network. But typing JSON into a terminal is awkward, especially on Windows, where Command Prompt and PowerShell each have their own rules for quotes. A small Node script that sends test requests is easier to run, and to run again after every change:

```{.code environment="nodejs"}
// Sends test requests to the sign-up API and prints what comes back.
// Start the server first, in another terminal.
const BASE = "http://localhost:3000"

async function show(method, path, body) {
  const options = { method, headers: { "content-type": "application/json" } }
  if (body !== undefined) {
    options.body = JSON.stringify(body)
  }
  const response = await fetch(BASE + path, options)
  const text = await response.text()
  console.log(`${method} ${path} -> ${response.status} ${text}`)
}

await show("GET", "/shifts/6")
await show("POST", "/shifts/6/signups", { email: "Ava.Lopez@example.com" })
await show("POST", "/shifts/6/signups", { email: "ava.lopez@example.com" })
await show("POST", "/shifts/1/signups", { email: "ben.okafor@example.com" })
await show("POST", "/shifts/2/signups", { email: "nobody@example.com" })
await show("POST", "/shifts/2/signups", {})
await show("POST", "/shifts/99/signups", { email: "ava.lopez@example.com" })
await show("DELETE", "/signups/13")
await show("DELETE", "/signups/13")
```

With the server running in one terminal, run this in another. Here's what it printed, against the book's version of the server shown below:

```{.code environment="message"}
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

Every rule in the design gets a test: a good sign-up, a duplicate, a full shift, a non-member, a missing email, an unknown shift, a cancellation, and cancelling again. That's the edge-case testing from [Making Decisions](decisions){.book-link}, applied to a server.

## Who Can Reach Your Server?

The assistant's reply ended with a claim worth checking: that only your own computer can reach the server. Here's the follow-up:

::: {.ai-conversation prompt="You said only my computer can reach the server. But when I started it, Windows asked whether to allow Node.js to communicate on private networks. Is it really only reachable from my computer?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="http" transcript="express/signup-api"}
> Good catch, and good question to ask — I was wrong to say that without qualifying it.
>
> Here's what's actually going on: when you call `app.listen(3000, ...)` without specifying an address, Node listens on **all network interfaces**, not just your own computer. That means any other device on the same network (like your phone, or someone else's laptop on the same Wi-Fi) could potentially reach `http://your-computer's-network-address:3000`. That's exactly why Windows asked about private networks — it noticed Node wanted to accept connections from the network, not just from itself.
>
> To actually restrict it to only your own computer, you tell `listen` to use the loopback address, `127.0.0.1`:
>
> ```js
> app.listen(3000, "127.0.0.1", () => {
>   console.log("Server running at http://localhost:3000")
> })
> ```
>
> With this, only processes on your own machine can connect — other devices on the network can't reach it, even if the firewall allows it.
>
> A couple of things I'm not fully certain about, so I don't want to guess: exactly how Windows Firewall's private/public network rule interacts with this at a low level, and whether your specific router or network setup would actually let another device reach you even without that firewall prompt allowed. If you want a hard guarantee of "only this computer," binding to `127.0.0.1` is the reliable way — the firewall setting is a second layer, not the main one.
>
> Want me to update the server code to bind to `127.0.0.1`?
:::

The correction is right, and it's an important one. `app.listen(3000)`, with no address, listens on *every* network connection your computer has, so a phone or laptop on the same Wi-Fi may be able to reach it, at your computer's network address. Windows asked about the firewall because it noticed. Adding `"127.0.0.1"`, the address that always means "this computer," restricts the server to requests from your own machine. That's the right setting while you're developing, especially on shared networks like a campus or a café.

Notice how the assistant handled being wrong: it said so, explained why, gave the fix, and was clear about which parts it wasn't sure of. That's what you want, and it's also a reminder that it was wrong in the first place, confidently. Claims about security deserve checking.

## The Sign-Up Page

An API is for programs. Volunteers need a page. Express can serve that too: **`express.static`** serves the files in a folder, as they are, so a file named `index.html` in a folder named `public` appears at `http://localhost:3000/`. Because the page and the API come from the same server, the page can `fetch` from addresses like `/shifts` without any CORS problems, the rule you met in [Asynchronous JavaScript](async){.book-link}.

Here's the server in the book's style, with the fixes: the current Express, careful email comparison, the page served from `public`, and `127.0.0.1`:

```{.code environment="nodejs"}
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
```

And the page, saved as `public/index.html`:

```{.code environment="none"}
<!doctype html>
<html>
  <head>
    <title>Volunteer Sign-Up</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; max-width: 600px; }
      li { margin-bottom: 8px; }
      #message { font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>Sign up for a shift</h1>
    <label for="email">Your club email</label>
    <input type="email" id="email">
    <ul id="shifts"></ul>
    <p id="message"></p>

    <script>
      const shiftList = document.querySelector("#shifts")
      const message = document.querySelector("#message")

      async function showShifts() {
        const response = await fetch("/shifts")
        const shifts = await response.json()
        shiftList.textContent = ""
        for (const shift of shifts) {
          const item = document.createElement("li")
          const spotsLeft = shift.capacity - shift.spotsFilled
          item.textContent = `${shift.date}, ${shift.start} to ${shift.end}: ${shift.task} (${spotsLeft} of ${shift.capacity} spots left) `
          const button = document.createElement("button")
          button.textContent = "Sign up"
          button.disabled = spotsLeft === 0
          button.addEventListener("click", () => signUp(shift.id))
          item.appendChild(button)
          shiftList.appendChild(item)
        }
      }

      async function signUp(shiftId) {
        const email = document.querySelector("#email").value
        const response = await fetch(`/shifts/${shiftId}/signups`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email })
        })
        const reply = await response.json()
        if (response.ok) {
          message.textContent = "You're signed up. Thank you!"
        } else {
          // the server's error message explains what went wrong
          message.textContent = reply.error
        }
        showShifts()
      }

      showShifts()
    </script>
  </body>
</html>
```

The page lists the shifts with the spots left, disables the button for full shifts, and when a sign-up fails, it shows the server's own error message, such as "This shift is full." That's the two halves agreeing, the lesson from [Building a Browser Extension](extension){.book-link}: the server decides what's allowed, and the page reports what the server said. The checks are all in the server, where the data is stored, so they can't be skipped by sending requests directly.

Run the server, open `http://localhost:3000`, type a club member's email, such as `jordan.lee@example.com`, and sign up for a shift.

::: {.screenshot-needed file="images/express-signup-page.png"}
The sign-up page in a browser at localhost:3000, listing the June 2027 shifts with spots left and Sign up buttons, one of them disabled because the shift is full.
:::

### In memory means temporary

Stop the server and start it again, and every sign-up made since it started is gone, because the arrays were only in memory, and the file was never changed. For the club, that won't do. The next lesson stores the data in a database.

## Your Learner Profile

::: {.ai-profile lesson="express"}
Add rules:

- When starting a server on my computer, listen on 127.0.0.1 unless I ask otherwise.

Add to "What I know so far":

- Express: app.get, app.post and app.delete routes, req.params, req.body with express.json(), res.json(), res.status() and res.end()
- serving files with express.static
- app.listen with a port and 127.0.0.1, and what localhost and ports are
- object spread: { ...object, name: value }
- findIndex and splice
- testing an API with a script that uses fetch
:::

## Summary

A server waits for requests and answers each one. With Express, each route connects a method and an address to a function that gets the request, `req`, and builds the response, `res`: `req.params` holds path parameters, `req.body` holds the JSON body once `express.json()` is in use, and `res.status(...).json(...)` sends a status and JSON. The sign-up API follows one pattern in every route: find the thing, check every rule, send an error at the first problem, otherwise do the work. A test script that sends a request for every rule makes checking quick. `express.static` serves a page from the same server, so the page can call the API directly. `app.listen` with no address can be reached from your network, so use `127.0.0.1` while developing. Data kept in memory disappears when the server stops, which the next lesson fixes.
