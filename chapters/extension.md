---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Describe the files in a Manifest V3 browser extension, and load one into Chrome to try it.
2. Build an extension popup that sends data to an Apps Script web app with `doPost`.
3. Explain why input must be checked where it's stored, not just in the page that sends it.
4. Read two halves of a system together, and check that what one sends matches what the other expects.
5. Decide how far to trust an extension before installing it.
:::
:::

## Your Own Browser Extension

A **browser extension** is a small program that adds to the browser itself: a button in the toolbar, a change to certain sites, a new menu item. Extensions are built from the same things as web pages, HTML, CSS and JavaScript, plus a settings file that tells the browser what the extension is and what it's allowed to do. Chrome, Edge and other Chromium-based browsers share the same extension format, called **Manifest V3**, and Firefox supports most of it.

The club's problem: volunteers are supposed to log each shift, and many forget, because opening the spreadsheet and finding the right row is a chore. A button in the browser toolbar that opens a small form, one click away on any page, would make logging a shift take ten seconds.

::: {.term}
> **Browser extension** — A small program, written in HTML, CSS and JavaScript, that adds features to a web browser. Its `manifest.json` file describes it and lists the permissions it needs.
:::

### Two halves

The extension can't write to the club's spreadsheet directly. It will send each shift to an Apps Script web app, which adds it to the Shifts sheet. So this project has two halves that have to agree with each other:

- **the front end,** the extension's popup, which a member sees and types into, and
- **the back end,** a `doPost` function in Apps Script, which receives the shift and stores it.

In [A Web App with Apps Script](web-app){.book-link}, `doGet` ran when someone *opened* the web app. `doPost` is its partner: it runs when a program *sends data* to the web app.

## Asking for Both Halves

Here's the request, in a new chat with your learner profile from [Automating Pages You Use](automating-pages){.book-link} and the garden context:

::: {.ai-conversation prompt="(Paste the garden context first.) I want to build a Chrome extension for club members. Clicking its toolbar button opens a small popup where a member enters their email, the date, the task and the hours of a volunteer shift, then clicks Log. The shift should be added to the Shifts sheet, through an Apps Script web app. Write both parts: the extension and the Apps Script." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="automating-pages" transcript="extension/log-shift"}
> Great project! Before I write the code, here are a few things that go beyond your list, which I'll explain as we go instead of just using silently:
>
> - **Chrome extensions need a `manifest.json` file.** It's not JavaScript — it's a small JSON file that tells Chrome the extension's name and what the popup looks like. I'll explain each part.
> - **`doPost(e)`** — you know `doGet` for web apps. `doPost` is the matching function Apps Script runs when something sends data *to* your web app (instead of just opening it in a browser). The incoming data arrives as text in `e.postData.contents`, which you turn into an object with `JSON.parse()`.
> - **`ContentService.createTextOutput()`** — a way for `doPost` to send a short reply back, similar to how `doGet` uses `HtmlService.createHtmlOutput()`.
>
> I'll keep these as simple as possible.
>
> ## Part 1: The Apps Script web app
>
> Paste this into the Apps Script editor attached to your spreadsheet.
>
> ```js
> function doPost(e) {
>   // Turn the incoming text into a regular object
>   const data = JSON.parse(e.postData.contents)
>
>   // Pull out each piece of the shift
>   const email = data.email
>   const date = data.date
>   const task = data.task
>   const hours = data.hours
>
>   // Get the Shifts sheet from this spreadsheet
>   const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
>   const sheet = spreadsheet.getSheetByName("Shifts")
>
>   // Add the new shift as a row, in the same column order as the sheet
>   sheet.appendRow([date, task, email, hours])
>
>   // Build a small success message to send back
>   const result = { status: "success" }
>   const resultText = JSON.stringify(result)
>   const output = ContentService.createTextOutput(resultText)
>   const jsonOutput = output.setMimeType(ContentService.MimeType.JSON)
>
>   return jsonOutput
> }
>
> // Run this one yourself in the editor to test doPost
> // without needing the extension at all
> function testDoPost() {
>   const fakeEvent = {
>     postData: {
>       contents: JSON.stringify({
>         email: "test@example.com",
>         date: "2027-04-10",
>         task: "watering",
>         hours: 2
>       })
>     }
>   }
>
>   const result = doPost(fakeEvent)
>   Logger.log(result.getContent())
> }
> ```
>
> **To test it:** run `testDoPost` from the editor, check the Execution log, and check that a new row appeared in Shifts. Then delete that test row.
>
> **To deploy it:**
> 1. Click **Deploy > New deployment**.
> 2. Choose type **Web app**.
> 3. Set "Execute as" to **Me**.
> 4. Set "Who has access" to **Anyone** (the extension can't sign in as a club member, so the web app has to accept requests without asking who's calling).
> 5. Click **Deploy**, and copy the web app URL — you'll paste it into the extension.
> 6. If you edit the script later, choose **Manage deployments > Edit > New version** so the URL keeps working with your latest code.
>
> **Who can see this, and what data does it expose?** Anyone with the URL can send a POST request that adds a row to Shifts — there's no `doGet`, so they can't read your sheet's data through this URL, but they *could* add fake shifts if they had the address. Since it's only visible to people who have your extension's code (see below), that's a reasonable risk for a small club, but worth knowing.
>
> ## Part 2: The Chrome extension
>
> Three files, all in one folder.
>
> **manifest.json** — tells Chrome about your extension. New to you, but it's just settings, not code.
>
> ```json
> {
>   "manifest_version": 3,
>   "name": "Volunteer Shift Logger",
>   "version": "1.0",
>   "action": {
>     "default_popup": "popup.html"
>   },
>   "host_permissions": [
>     "https://script.google.com/*"
>   ]
> }
> ```
>
> - `action.default_popup` says which file opens when someone clicks the toolbar button.
> - `host_permissions` lets the extension send requests to Google's script address without being blocked by CORS.
>
> **popup.html** — the small window that opens.
>
> ```html
> <!DOCTYPE html>
> <html>
> <head>
>   <title>Log a Shift</title>
>   <style>
>     body {
>       font-family: Arial;
>       width: 240px;
>       padding: 10px;
>     }
>     label {
>       display: block;
>       margin-top: 8px;
>     }
>     input {
>       width: 100%;
>     }
>     #status {
>       margin-top: 10px;
>       font-weight: bold;
>     }
>   </style>
> </head>
> <body>
>   <h2>Log a Shift</h2>
>
>   <label for="email">Email</label>
>   <input type="text" id="email">
>
>   <label for="date">Date (YYYY-MM-DD)</label>
>   <input type="text" id="date">
>
>   <label for="task">Task</label>
>   <input type="text" id="task">
>
>   <label for="hours">Hours</label>
>   <input type="number" id="hours">
>
>   <button id="logButton">Log</button>
>
>   <div id="status"></div>
>
>   <script src="popup.js"></script>
> </body>
> </html>
> ```
>
> **popup.js** — the logic.
>
> ```js
> // Paste your deployed web app URL here
> const WEB_APP_URL = "PASTE_YOUR_WEB_APP_URL_HERE"
>
> // The only task names the Shifts sheet expects
> const ALLOWED_TASKS = ["watering", "weeding", "planting", "harvesting", "composting"]
>
> // Find the button and the status message spot
> const logButton = document.querySelector("#logButton")
> const statusDiv = document.querySelector("#status")
>
> // Run handleLogClick whenever the button is clicked
> logButton.addEventListener("click", handleLogClick)
>
> async function handleLogClick() {
>   // Read each input on the page
>   const emailInput = document.querySelector("#email")
>   const dateInput = document.querySelector("#date")
>   const taskInput = document.querySelector("#task")
>   const hoursInput = document.querySelector("#hours")
>
>   const email = emailInput.value
>   const date = dateInput.value
>   const task = taskInput.value
>   const hoursText = hoursInput.value
>
>   // Check nothing was left blank
>   if (email === "" || date === "" || task === "" || hoursText === "") {
>     statusDiv.textContent = "Please fill in every field."
>     return
>   }
>
>   // Check the task matches one of the five allowed names
>   let taskIsValid = false
>   for (let i = 0; i < ALLOWED_TASKS.length; i++) {
>     if (task === ALLOWED_TASKS[i]) {
>       taskIsValid = true
>     }
>   }
>   if (taskIsValid === false) {
>     statusDiv.textContent = "Task must be watering, weeding, planting, harvesting or composting."
>     return
>   }
>
>   // Check the hours is a real number
>   const hours = Number(hoursText)
>   if (isNaN(hours)) {
>     statusDiv.textContent = "Hours must be a number."
>     return
>   }
>
>   statusDiv.textContent = "Logging..."
>
>   try {
>     await sendShift(email, date, task, hours)
>     statusDiv.textContent = "Shift logged!"
>   } catch (error) {
>     statusDiv.textContent = "Something went wrong: " + error.message
>   }
> }
>
> async function sendShift(email, date, task, hours) {
>   // Build the object to send, matching what doPost expects
>   const shift = {
>     email: email,
>     date: date,
>     task: task,
>     hours: hours
>   }
>
>   const options = {
>     method: "POST",
>     body: JSON.stringify(shift)
>   }
>
>   const response = await fetch(WEB_APP_URL, options)
>
>   if (response.ok === false) {
>     throw new Error("The server did not accept the shift.")
>   }
> }
> ```
>
> ## Loading the extension
>
> 1. Put `manifest.json`, `popup.html` and `popup.js` in one folder.
> 2. Open Chrome, go to `chrome://extensions`.
> 3. Turn on **Developer mode** (top right).
> 4. Click **Load unpacked**, and choose the folder.
> 5. Click the toolbar puzzle-piece icon, pin your extension, and click it to open the popup.
>
> **Who can see this?** Only whoever has this folder loaded as an extension in their own Chrome — it's not published or shared automatically. If you want other club members to use it, you'd share the folder with them (or eventually publish it to the Chrome Web Store, which is a separate process).
>
> **One more note on secrets:** the web app URL is sitting in `popup.js` in plain text, and anyone who opens `chrome://extensions`, clicks "Inspect views," or unpacks the folder can read it. That's unavoidable for a client-side extension, so don't rely on this URL being truly private — the "Anyone can access" setting above already assumes that.
>
> Want to test the whole flow together, or add anything (like showing a confirmation of what was logged)?
:::

This is a long reply, but it's organized well, and it started by listing what's new. Take it one file at a time.

### The back end: doPost

- **`doPost(e)`** receives the request. The data the extension sent is in **`e.postData.contents`**, as text, and `JSON.parse` turns it into an object.
- **`appendRow`** adds the shift to Shifts, with the values in the sheet's column order: date, task, email, hours. That order comes from the garden context, which is exactly why you pasted it.
- **`ContentService.createTextOutput`** sends a reply back, here a small JSON object saying it worked. It's `doPost`'s version of `HtmlService`.
- **`testDoPost`** calls `doPost` with a made-up event, the testing method from [Menus and Triggers](triggers){.book-link}. Run it before anything else.

The deployment notes are thoughtful. "Who has access" has to be *Anyone*, because the extension can't sign in as a club member. And the assistant followed your profile's web page rule by spelling out what that means: anyone who has the address can add rows to Shifts. They can't *read* the sheet through it, because there's no `doGet`, but they could add fake shifts.

### The front end: three files

- **`manifest.json`** is the extension's settings, in JSON. `manifest_version` must be 3. `action.default_popup` names the page that opens when the toolbar button is clicked. `host_permissions` lists the sites the extension may send requests to, which also lets it get past the CORS rule you met in [Asynchronous JavaScript](async){.book-link}.
- **`popup.html`** is an ordinary web page with a form. Notice its script is in a separate file, `popup.js`, loaded with `<script src="popup.js">`. That's not just tidiness: Manifest V3 extensions aren't allowed to run JavaScript written inside the HTML, as a security measure. A `<script>` with code between its tags would simply not run.
- **`popup.js`** does the work. `handleLogClick` checks every field, including that the task is one of the five the sheet expects, with a loop over an array of allowed tasks, and `sendShift` sends the shift with `fetch`, using the `method` and `body` options, an `await`, and the `response.ok` check you know.

### Loading and sharing

**Load unpacked** installs an extension from a folder on your computer, for testing. It needs **Developer mode**, which is safe to turn on for your own extensions. The last note is honest and important: the web app's address is in `popup.js`, and anyone who has the extension can read it. As in [How Web Pages Work](web-pages){.book-link}, code that runs in the browser can't keep secrets.

::: {.screenshot-needed file="images/extension-load-unpacked.png"}
The chrome://extensions page with Developer mode turned on and the "Load unpacked" button highlighted, and the Volunteer Shift Logger extension card below.
:::

## Checking on Both Ends

The popup checks what members type before sending it. Is that enough?

::: {.ai-conversation prompt="The popup checks the input before sending it. Should doPost check the data too, or is checking in the popup enough?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="automating-pages" transcript="extension/log-shift"}
> Checking in the popup is good for helping the member fix mistakes quickly, but it isn't enough by itself. The web app's URL is public — anyone (or any program, like curl or Postman) could send a request straight to it without ever opening your popup, skipping its checks entirely. So `doPost` should check the data too, since it's the last line of defense before something gets written to your sheet.
>
> Here's `doPost` updated with its own checks, similar to what the popup does:
>
> ```js
> function doPost(e) {
>   // The only task names the Shifts sheet expects
>   const ALLOWED_TASKS = ["watering", "weeding", "planting", "harvesting", "composting"]
>
>   // Turn the incoming text into a regular object
>   const data = JSON.parse(e.postData.contents)
>
>   const email = data.email
>   const date = data.date
>   const task = data.task
>   const hours = data.hours
>
>   // Check nothing is missing
>   if (email === "" || date === "" || task === "" || hours === "") {
>     return buildErrorResponse("Missing a field")
>   }
>
>   // Check the task matches one of the five allowed names
>   let taskIsValid = false
>   for (let i = 0; i < ALLOWED_TASKS.length; i++) {
>     if (task === ALLOWED_TASKS[i]) {
>       taskIsValid = true
>     }
>   }
>   if (taskIsValid === false) {
>     return buildErrorResponse("Task is not one of the allowed values")
>   }
>
>   // Check hours is a real number
>   const hoursNumber = Number(hours)
>   if (isNaN(hoursNumber)) {
>     return buildErrorResponse("Hours is not a number")
>   }
>
>   // Everything checks out, so add the row
>   const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
>   const sheet = spreadsheet.getSheetByName("Shifts")
>   sheet.appendRow([date, task, email, hoursNumber])
>
>   const result = { status: "success" }
>   const resultText = JSON.stringify(result)
>   const output = ContentService.createTextOutput(resultText)
>   const jsonOutput = output.setMimeType(ContentService.MimeType.JSON)
>   return jsonOutput
> }
>
> // Builds an error reply, so doPost can return early without repeating this
> function buildErrorResponse(message) {
>   const result = { status: "error", message: message }
>   const resultText = JSON.stringify(result)
>   const output = ContentService.createTextOutput(resultText)
>   const jsonOutput = output.setMimeType(ContentService.MimeType.JSON)
>   return jsonOutput
> }
> ```
>
> A couple of things worth knowing:
>
> - **`data.hours === ""`** works here because if `hours` is missing entirely from the request, it'll be `undefined`, not `""` — so you might want to also treat `undefined` as missing. For now this catches the common case, but it's a good thing to test with `testDoPost` using a made-up event with a missing field, to see what actually happens.
> - This is also a case where testing matters: you can call `doPost` with several fake "bad" events (missing email, bad task, hours as text) the same way you tested it with a good one, and check the Execution log shows the right error each time — all without touching the real extension or sheet.
>
> Want to try writing one of those bad test cases yourself, or should I write one as an example?
:::

That's the key principle, and it applies far beyond this project: **checks in the page are for convenience; checks where data is stored are for safety.** The popup's checks help an honest member fix a typo before sending. But the web app's address is public, and anyone can send it anything, without ever opening the popup. Only checks in `doPost` actually protect the sheet. The assistant even pointed out a gap in its own checks: a field that's missing entirely arrives as `undefined`, not `""`.

### Do the two halves agree?

Now read the two halves *together*, which is a different skill from reading each one. When `doPost` rejects a shift, what does the member see?

`doPost` reports a problem by returning JSON like `{"status": "error", "message": "Hours is not a number"}`. But Apps Script's `ContentService` can't mark a reply as a failure the way a server can with an error code such as 404, so the reply still counts as successful, and `response.ok` is true. The popup only checks `response.ok`, so it says "Shift logged!" even when the shift was rejected. Each half is correct on its own. Together, they tell a member their shift was saved when it wasn't.

The fix is for the popup to read the reply and check its `status`:

<pre class="code" data-environment="none">
async function sendShift(email, date, task, hours) {
  const shift = {
    email: email,
    date: date,
    task: task,
    hours: hours
  }
  const options = {
    method: "POST",
    body: JSON.stringify(shift)
  }
  const response = await fetch(WEB_APP_URL, options)
  if (response.ok === false) {
    throw new Error("The server could not be reached.")
  }
  // doPost reports its own errors in the reply, so check them too
  const reply = await response.json()
  if (reply.status !== "success") {
    throw new Error(reply.message)
  }
}
</pre>

Now `handleLogClick`'s `catch` shows the server's own message, such as "Task is not one of the allowed values." Whenever you connect two pieces of code, check that what one sends is what the other expects, and that errors travel all the way back to the person.

### Testing the checks on this page

The checks in `doPost` are easier to test if they're in a function of their own, one that takes the shift and returns an error message, or an empty string when the shift is fine. Here's that function, in the book's style, handling the missing-field gap, with tests for good and bad shifts:

<pre class="code">
function testCheckShift() {
  console.log(checkShift({ email: "ava.lopez@example.com", date: "2027-05-01", task: "watering", hours: 1.5 }))
  console.log(checkShift({ email: "ava.lopez@example.com", date: "2027-05-01", task: "sleeping", hours: 1.5 }))
  console.log(checkShift({ email: "ava.lopez@example.com", date: "2027-05-01", task: "watering", hours: "lots" }))
  console.log(checkShift({ email: "ava.lopez@example.com", task: "watering", hours: 1 }))
  console.log(checkShift({ email: "ava.lopez@example.com", date: "2027-05-01", task: "weeding", hours: 0 }))
}

const ALLOWED_TASKS = ["watering", "weeding", "planting", "harvesting", "composting"]

// returns "" if the shift can be stored, or a message saying what's wrong
function checkShift(shift) {
  const fields = ["email", "date", "task", "hours"]
  for (let i = 0; i < fields.length; i++) {
    const value = shift[fields[i]]
    // a missing field is undefined, and an empty one is ""
    if (value === undefined || value === "") {
      return `Missing ${fields[i]}`
    }
  }
  let taskIsAllowed = false
  for (let i = 0; i < ALLOWED_TASKS.length; i++) {
    if (shift.task === ALLOWED_TASKS[i]) {
      taskIsAllowed = true
    }
  }
  if (taskIsAllowed === false) {
    return "Task is not one of the allowed values"
  }
  const hours = Number(shift.hours)
  if (isNaN(hours) || hours <= 0 || hours > 12) {
    return "Hours must be a number between 0 and 12"
  }
  return ""
}
</pre>

The first test prints an empty line, because a good shift gets `""`. Each of the others names its problem. The last check, hours between 0 and 12, is new: without it, anyone could log 1,000 hours. Deciding what values make sense is part of the Plan step, as in [Events and Interactivity](events){.book-link}.

In `doPost`, the checks shrink to a few lines: call `checkShift(data)`, and if it returns anything other than `""`, return an error reply with that message.

## Sharing the Extension, and Trusting Others'

To give the extension to other members, you can share the folder, zipped, and they can load it unpacked, the same way you did. Publishing it in the **Chrome Web Store**, where anyone can install it with one click, takes a one-time $5 developer registration fee and a review by Google, and isn't needed for a club.

Building one also shows you why to be careful about the extensions you install. An extension with permission to "read and change all your data on all websites" can see everything you do in the browser, including passwords you type and pages you read, and so can anyone who takes it over later. Before installing an extension:

- **Read the permissions** it asks for, and ask whether they match what it does. A shift logger needs to talk to one site, not all of them.
- **Prefer extensions from sources you trust,** and be especially wary of unpacked extensions someone sends you. You wouldn't run their code without reading it, and an unpacked extension *is* their code.
- **Remove extensions you no longer use.**

## Your Learner Profile

::: {.ai-profile lesson="extension"}
Add rules:

- When a page sends data that will be stored, check the data where it's stored, not only in the page.

Add to "What I know so far":

- Manifest V3 browser extensions: manifest.json, a popup page, host_permissions, loading an unpacked extension, and that JavaScript must be in separate .js files
- doPost(e), e.postData.contents, and replying with ContentService.createTextOutput()
- fetch with method: "POST" and a body
- reading both halves of a system together, and passing errors back to the person
:::

The new rule captures this lesson's main idea, so that any time you ask for code that stores data, the assistant checks it on the storing side too.

## Summary

A browser extension is HTML, CSS and JavaScript plus a `manifest.json` that describes it and lists its permissions; Manifest V3 extensions keep their JavaScript in separate files, and you can load one from a folder with Developer mode. An extension can send data to an Apps Script web app, where `doPost` receives it in `e.postData.contents` and replies with `ContentService`. Checking input in the page helps honest users, but only checks where data is stored protect it, because anyone can send data straight to a public address. When you connect two pieces of code, read them together: here, errors reported inside a successful reply were invisible until the popup read the reply. And having built an extension, you know how much an installed one can see, so check permissions before installing others'. Next, the club's website goes online.
