---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Describe the three layers of a full-stack app: the page, the API and the database.
2. Serve a web page and an API from one Cloudflare Worker, with static assets.
3. Keep small pieces of data in the browser with `localStorage`, and explain its limits.
4. Handle a form's `submit` event, and update a page after every change.
5. Test a whole app the way a person uses it, with Playwright.
:::
:::

## Three Layers

Over the last few lessons you've built the pieces of the club's sign-up system separately: a page in [A Server with Node and Express](express){.book-link}, an API and a database in [Storing Data](database){.book-link}, and the API and database online in [Serverless with Cloudflare Workers](workers){.book-link}. Put together, they make a **full-stack app**: an application with all three layers.

- **The front end**: the page in the browser, HTML, CSS and JavaScript, from Part III.
- **The back end**: the API on a server, which decides what's allowed.
- **The database**: where the data lives, and where the rules that matter most are enforced.

::: {.term .jf2}
> **Full-stack app** — An application with a front end in the browser, a back end on a server, and a database, working together. *Front end* and *back end* are also used on their own for those two sides.
:::

At the end of the last lesson, the page and the API were at different addresses, which meant CORS trouble. The simplest fix is to serve both from the same Worker. That's also this lesson's request.

## Asking for the App

Following the rule you added in the last lesson, the request starts with the Worker's full code and configuration, so nothing is lost. Here it is, in a new chat with your learner profile from [Serverless with Cloudflare Workers](workers){.book-link}:

::: {.ai-conversation prompt="Here is my sign-up API's Cloudflare Worker, src/index.js, and its wrangler.jsonc: (then paste both files) I want to turn it into a complete app. The Worker should also serve the sign-up web page (index.html, style.css and script.js in a folder named public), so the page and the API share one address. The page lists the shifts with spots left and lets a member sign up with their email. After signing up, the page should remember the cancel code in the browser, so the member can see their sign-ups and cancel one later from the same browser." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="workers" transcript="full-stack/app"}
> Nice, your API already does the right things (server-side member check, capacity check, unique constraint, no emails in responses). To add the page, you mostly need new files plus one change to `wrangler.jsonc`. Your `src/index.js` doesn't need to change at all.
>
> ## 1. `wrangler.jsonc`: tell Wrangler about the `public` folder
>
> ```jsonc
> {
>   "name": "garden-signups",
>   "main": "src/index.js",
>   "compatibility_date": "2026-09-01",
>   "assets": {
>     "directory": "./public"
>   },
>   "d1_databases": [
>     {
>       "binding": "DB",
>       "database_name": "garden-signups",
>       "database_id": "paste-the-id-from-wrangler-d1-create"
>     }
>   ]
> }
> ```
>
> **A caveat:** Cloudflare's static assets feature (the `assets` key) is fairly new, and I'm not fully certain of every configuration detail (for example, exactly how it decides whether a request goes to a static file or to your Worker code when there could be ambiguity). What I understand is: files in `public` are served automatically, and any request that doesn't match a file there falls through to your Worker's `fetch` handler. That should work fine here, since `/shifts`, `/shifts/6`, `/signups/3` etc. don't match any filename in `public`. But please test with `npx wrangler dev` and try both a page load and an API call before trusting it, and check the current Wrangler docs for `assets` if anything behaves oddly.
>
> One nice side effect: because the page and the API now share one address, you won't run into CORS problems.
>
> ## 2. `public/index.html`
>
> ```html
> <!doctype html>
> <html>
> <head>
> <meta charset="utf-8">
> <title>Garden Shift Sign-Up</title>
> <link rel="stylesheet" href="style.css">
> </head>
> <body>
>
> <h1>Garden Shift Sign-Up</h1>
>
> <h2>Upcoming shifts</h2>
> <table id="shifts-table">
>   <thead>
>     <tr><th>Date</th><th>Task</th><th>Time</th><th>Spots left</th></tr>
>   </thead>
>   <tbody id="shifts-body"></tbody>
> </table>
>
> <h2>Sign up</h2>
> <form id="signup-form">
>   <label for="shift-select">Shift</label>
>   <select id="shift-select"></select>
>
>   <label for="email-input">Email</label>
>   <input type="text" id="email-input">
>
>   <button type="submit">Sign up</button>
> </form>
> <p id="signup-message"></p>
>
> <h2>My sign-ups (this browser)</h2>
> <ul id="my-signups-list"></ul>
> <p id="cancel-message"></p>
>
> <script src="script.js"></script>
> </body>
> </html>
> ```
>
> This is plain HTML: a table for the shift list, a form with a drop-down (`select`) and an email box, and a list for "my sign-ups." `script.js` runs at the end so the elements above it already exist in the DOM.
>
> ## 3. `public/style.css`
>
> ```css
> body {
>   font-family: sans-serif;
>   margin: 2rem;
>   max-width: 40rem;
> }
>
> table {
>   border-collapse: collapse;
>   width: 100%;
>   margin-bottom: 1rem;
> }
>
> th, td {
>   border: 1px solid #ccc;
>   padding: 0.5rem;
>   text-align: left;
> }
>
> label {
>   display: block;
>   margin-top: 0.5rem;
> }
>
> button {
>   margin-left: 0.5rem;
>   margin-top: 0.5rem;
> }
> ```
>
> ## 4. `public/script.js`
>
> ```js
> // where the browser remembers this member's cancel codes
> const STORAGE_KEY = "gardenSignups"
>
> // --- elements on the page ---
> const shiftsBody = document.querySelector("#shifts-body")
> const shiftSelect = document.querySelector("#shift-select")
> const form = document.querySelector("#signup-form")
> const emailInput = document.querySelector("#email-input")
> const signupMessage = document.querySelector("#signup-message")
> const mySignupsList = document.querySelector("#my-signups-list")
> const cancelMessage = document.querySelector("#cancel-message")
>
> // --- reading and writing the browser's own storage ---
> function loadMySignups() {
>   const text = localStorage.getItem(STORAGE_KEY)
>   if (text === null) {
>     return []
>   }
>   return JSON.parse(text)
> }
>
> function saveMySignups(signups) {
>   localStorage.setItem(STORAGE_KEY, JSON.stringify(signups))
> }
>
> // --- getting the shift list from the API ---
> async function loadShifts() {
>   const response = await fetch("/shifts")
>   if (!response.ok) {
>     throw new Error("Could not load shifts")
>   }
>   return response.json()
> }
>
> // turns the array of shifts into an object, so we can look one up by id
> function shiftsById(shifts) {
>   const lookup = {}
>   shifts.forEach(shift => {
>     lookup[shift.id] = shift
>   })
>   return lookup
> }
>
> // --- building the parts of the page ---
> function renderShiftsTable(shifts) {
>   shiftsBody.textContent = "" // clear old rows first
>   shifts.forEach(shift => {
>     const spotsLeft = shift.capacity - shift.spotsFilled
>     const row = document.createElement("tr")
>     row.innerHTML = `
>       <td>${shift.date}</td>
>       <td>${shift.task}</td>
>       <td>${shift.start}–${shift.end}</td>
>       <td>${spotsLeft}</td>
>     `
>     shiftsBody.appendChild(row)
>   })
> }
>
> function renderShiftOptions(shifts) {
>   shiftSelect.textContent = ""
>   shifts.forEach(shift => {
>     const spotsLeft = shift.capacity - shift.spotsFilled
>     const option = document.createElement("option")
>     option.value = String(shift.id)
>     option.textContent = `${shift.date} ${shift.task} (${spotsLeft} left)`
>     if (spotsLeft <= 0) {
>       option.disabled = true
>     }
>     shiftSelect.appendChild(option)
>   })
> }
>
> function renderMySignups(signups, lookup) {
>   mySignupsList.textContent = ""
>   if (signups.length === 0) {
>     const li = document.createElement("li")
>     li.textContent = "No sign-ups saved in this browser yet."
>     mySignupsList.appendChild(li)
>     return
>   }
>   signups.forEach(signup => {
>     const shift = lookup[signup.slotId]
>     const li = document.createElement("li")
>     const label = shift === undefined
>       ? `Shift #${signup.slotId}`
>       : `${shift.date} — ${shift.task} (${shift.start}–${shift.end})`
>     li.textContent = label + " "
>     const button = document.createElement("button")
>     button.textContent = "Cancel"
>     button.addEventListener("click", () => cancelSignup(signup))
>     li.appendChild(button)
>     mySignupsList.appendChild(li)
>   })
> }
>
> // --- pulling it all together ---
> async function refreshPage() {
>   const shifts = await loadShifts()
>   renderShiftsTable(shifts)
>   renderShiftOptions(shifts)
>   const lookup = shiftsById(shifts)
>   renderMySignups(loadMySignups(), lookup)
> }
>
> // --- signing up ---
> form.addEventListener("submit", async (event) => {
>   event.preventDefault()
>   signupMessage.textContent = ""
>   const slotId = Number(shiftSelect.value)
>   const email = emailInput.value.trim()
>   if (email === "") {
>     signupMessage.textContent = "Enter an email address"
>     return
>   }
>   const response = await fetch(`/shifts/${slotId}/signups`, {
>     method: "POST",
>     headers: { "content-type": "application/json" },
>     body: JSON.stringify({ email })
>   })
>   const data = await response.json()
>   if (!response.ok) {
>     signupMessage.textContent = data.error
>     return
>   }
>   const signups = loadMySignups()
>   signups.push({ id: data.id, slotId: data.slotId, cancelCode: data.cancelCode })
>   saveMySignups(signups)
>   signupMessage.textContent = "Signed up. This browser will remember your cancel code."
>   emailInput.value = ""
>   await refreshPage()
> })
>
> // --- cancelling ---
> async function cancelSignup(signup) {
>   cancelMessage.textContent = ""
>   const response = await fetch(`/signups/${signup.id}`, {
>     method: "DELETE",
>     headers: { "content-type": "application/json" },
>     body: JSON.stringify({ cancelCode: signup.cancelCode })
>   })
>   if (response.status === 204) {
>     const remaining = loadMySignups().filter(s => s.id !== signup.id)
>     saveMySignups(remaining)
>     await refreshPage()
>     return
>   }
>   const data = await response.json().catch(() => ({}))
>   cancelMessage.textContent = data.error ?? "Could not cancel"
> }
>
> refreshPage()
> ```
>
> Walking through the pieces:
>
> - `loadMySignups` / `saveMySignups` read and write a JSON array in `localStorage`, which only this browser can see.
> - `loadShifts` fetches `/shifts` (same address as the API, since they now share an origin).
> - `shiftsById` turns the array into a lookup object, like the bed-by-ID lookup you've used before.
> - The two `render...` functions clear out old content (`textContent = ""`) and rebuild it from the current data, using `forEach` to create one row/option/list item per shift or sign-up.
> - `refreshPage` is the one place that reloads everything: it's called once when the page loads, and again after a successful sign-up or cancel, so the page always reflects the latest data.
> - The submit handler prevents the normal form submission, `POST`s the email to the right shift, and — only if the server says it worked — saves the returned `cancelCode` to `localStorage`.
> - `cancelSignup` `DELETE`s the sign-up, and only removes it from `localStorage` if the server actually confirms it with a `204`.
>
> ## Who can see this, and what data
>
> Anyone who has the Worker's URL can open this page. It shows the shift schedule (date, task, time, capacity and spots filled) — no member emails or personal data appear anywhere in the API responses or the page. To sign up, a visitor types an email, which the server checks privately against your `members` table; it never echoes other people's emails back.
>
> The **cancel code** is stored only in `localStorage` on that one visitor's browser. That means:
> - It won't show up if they open the page on a different device or browser, or after clearing site data — they'd need the cancel code itself to cancel from elsewhere (your API doesn't have a way to recover it otherwise).
> - Anyone else using the same browser/computer could see the "My sign-ups" list and cancel those shifts, since `localStorage` isn't tied to a login.
>
> That matches what you asked for, but it's worth being aware of as a limitation, not a bug.
>
> ## Testing and deploying
>
> 1. Run `npx wrangler dev` from the project folder and open the local address it prints. Confirm the page loads, the shift table and drop-down fill in, sign-up works, and the new sign-up shows up under "My sign-ups."
> 2. Try cancelling one, and confirm it disappears from the list and the spots-left count goes back up after a refresh.
> 3. When you're happy, run `npx wrangler deploy` to publish it for real.
:::

This is a very good reply, and much of that is because the request had everything in it. The assistant could see the API's rules and field names, so it kept every one, and it noticed that the Worker needed no changes at all.

::: {.vly}
**Read the configuration first.** The one change to `wrangler.jsonc` is `"assets": { "directory": "./public" }`. With it, Cloudflare serves the files in `public` directly: a request for `/` gets `index.html`, and `/script.js` gets the script. Any request that doesn't match a file goes on to the Worker's `fetch` function, which handles the API. The assistant was honest about not knowing every detail of this newer feature, and told you exactly what to test. (It works as described.)
:::

**Then the page.** It's HTML you know: a table of shifts, a form with a drop-down of shifts and an email box, and a list for "my sign-ups."

**Then the script,** which is organized well enough to read in the order it's written:

- **`loadMySignups` and `saveMySignups`** use **`localStorage`**, which you haven't met: a small store of text, kept by the browser for each website. `localStorage.setItem(key, text)` saves, and `getItem(key)` reads, giving `null` when nothing's there. It only holds strings, so the array of sign-ups is saved as JSON, the same idea as saving objects in the workbook in [Building an Application in Excel](excel-app){.book-link}.
- **`loadShifts`** fetches `/shifts`, a relative address, which works because the page and the API now share one.
- **The three `render` functions** each clear part of the page and rebuild it from data, and **`refreshPage`** calls all three. After any change, the page rebuilds everything from the server's current data, the redraw pattern from the JADE app.
- [**The form** uses the **`submit`** event, which happens when a form's button is clicked or Enter is pressed. **`event.preventDefault()`** stops the browser's normal behavior, which would be to leave the page and send the form somewhere, so the script can send it with `fetch` instead.]{.w5l}
- **Only after the server says yes** does the script save the cancel code, and only after a 204 does cancelling remove it. The browser's record follows the server, never the other way around.

::: {.term}
> **localStorage** — A small store in the browser, kept separately for each website, where a page can save text with `setItem` and read it back with `getItem`, even after the browser is closed.
:::

::: {.m2d}
**The limits are spelled out** in the "Who can see this" section, and they're worth repeating. The cancel codes live in one browser: on another device, or after clearing the browser's data, "My sign-ups" is empty. And anyone using the same browser could cancel those sign-ups. For a club, that's an acceptable trade. A system where the same person can manage their sign-ups from anywhere needs a login, which is beyond this book.
:::

One small thing to notice: `renderShiftsTable` fills each row with `innerHTML`. The values come from the club's own database, set by the club, so it's safe here. If the table ever showed text that visitors typed, it would need `textContent` or `createElement`, the rule from [How Web Pages Work](web-pages){.book-link}.

## Running the App

The project folder now has everything:

```{.code environment="none"}
garden-signups/
  wrangler.jsonc
  schema.sql
  seed.sql
  src/
    index.js
  public/
    index.html
    style.css
    script.js
```

`src/index.js`, `schema.sql` and `seed.sql` are the ones from [Serverless with Cloudflare Workers](workers){.book-link}; `wrangler.jsonc` and the three files in `public` are the ones in the reply. Run `npx wrangler dev`, and open `http://127.0.0.1:8787`: the page appears, with the shifts filled in from the database.

::: {.screenshot-needed file="images/full-stack-app.png"}
The garden sign-up app in a browser at 127.0.0.1:8787, showing the table of June 2027 shifts with spots left, the sign-up form, and one entry under "My sign-ups" with a Cancel button.
:::

## Testing It Like a Person Would

The API test scripts from earlier lessons check the back end. To check the whole app, the page included, use the tool from [Automating the Web with Playwright](playwright){.book-link}: a script that opens the page, fills in the form and clicks the buttons, exactly as a volunteer would. Save this in a project where Playwright is installed, and run it while `wrangler dev` is running:

```{.code environment="nodejs"}
import { chromium } from "playwright"
const browser = await chromium.launch()
const page = await browser.newPage()
page.on("dialog", d => d.accept())
await page.goto("http://127.0.0.1:8787/")
await page.waitForSelector("#shifts-body tr")
console.log("rows:", await page.locator("#shifts-body tr").count())
await page.selectOption("#shift-select", "6")
await page.fill("#email-input", "Jordan.Lee@example.com")
await page.click("button[type=submit]")
await page.waitForFunction(() => document.querySelector("#signup-message").textContent !== "")
console.log("message:", await page.locator("#signup-message").textContent())
await page.waitForSelector("#my-signups-list li button")
console.log("shift 6 row:", await page.locator("#shifts-body tr").nth(5).textContent())
console.log("my sign-ups:", await page.locator("#my-signups-list li").allTextContents())
await page.click("#my-signups-list li button")
await page.waitForFunction(() => document.querySelector("#my-signups-list li").textContent.startsWith("No sign-ups"))
console.log("after cancel:", await page.locator("#my-signups-list li").allTextContents())
await page.fill("#email-input", "nobody@example.com")
await page.click("button[type=submit]")
await page.waitForTimeout(500)
console.log("non-member:", await page.locator("#signup-message").textContent())
await page.screenshot({ path: "app.png", fullPage: true })
await browser.close()
```

It printed this when this lesson was written:

```{.code environment="message"}
rows: 8
message: Signed up. This browser will remember your cancel code.
shift 6 row:
      2027-06-19
      planting
      09:00–11:00
      2
my sign-ups: [ '2027-06-19 — planting (09:00–11:00) Cancel' ]
after cancel: [ 'No sign-ups saved in this browser yet.' ]
non-member: That email doesn't belong to a club member
```

Every layer checked at once: the page loaded eight shifts from the database; signing up with `Jordan.Lee@example.com`, in capitals, worked, because the API compares emails in lowercase; the shift's spots left dropped from 3 to 2; the sign-up appeared in "My sign-ups" from `localStorage`; the Cancel button removed it; and a non-member got the server's own error message.

::: {.vve}
One detail in the test is worth knowing. The line `await page.waitForSelector("#my-signups-list li button")` waits for the Cancel button to appear. The first version of this test didn't wait, and read the list too soon, while the page was still refreshing it, so it reported no sign-ups even though the sign-up had worked. Tests of a page have to wait for the page, just as code that fetches has to `await`. Playwright's waiting methods exist for exactly this.
:::

When it all works, `npx wrangler deploy` publishes the app, page and API together, at one `workers.dev` address. Run the remote `d1 execute` commands from the last lesson first, if you haven't. Then send the address to a club member and ask them to sign up from their phone.

## Your Learner Profile

::: {.learner-profile}
:::

## Summary

A full-stack app has a front end in the browser, a back end that decides what's allowed, and a database where the data and its most important rules live. A Cloudflare Worker can serve all of it from one address: static assets for the page, and its `fetch` function for the API, which also avoids CORS. The page keeps each member's cancel codes in `localStorage`, which is private to one browser, survives closing it, and is lost on another device. A form's `submit` event, with `preventDefault`, lets the page send data with `fetch`, and rebuilding the page from the server after every change keeps it accurate. Giving the assistant the complete code, as your new rule asks, is what let this reply keep every rule. And a Playwright script that uses the app like a person checks every layer at once, as long as it waits for the page. Next, the club's app gets a new way in: a chat bot.
