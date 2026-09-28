---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Build an application in a JADE task pane: a form, a button that writes to the workbook, and a list that updates.
2. Use a drop-down list, with `<select>` and `<option>`.
3. Store settings in the workbook with `Jade.save_object_to_workbook` and `Jade.read_object_from_workbook`.
4. Open an application automatically when the workbook opens, with `auto_exec`.
5. Find out what a function really returns when an assistant has guessed, and add what you learn to a platform profile.
:::
:::

## An App Inside the Workbook

The sustainability office has its harvest workbook now, and they'd like volunteers to add harvests to it directly, instead of emailing the numbers to someone who types them in. The volunteers aren't Excel experts. What they need is a small form: pick the bed, type the crop and the weight, click Add.

JADE can put exactly that in the task pane, beside the workbook, and because JADE saves code in the workbook, the app travels with the file. Anyone who opens the workbook with JADE installed gets the app.

**Plan.** The app should:

- open by itself when the workbook opens;
- show a form with the date, a drop-down list of the eight beds, the crop, the kilograms and the volunteer's email;
- add a row to the bottom of the Harvests sheet when Add is clicked, after checking the input;
- remember the last volunteer's email, so a returning volunteer doesn't retype it;
- show the five most recent harvests below the form.

### Drop-down lists

A drop-down list in HTML is a **`<select>`** element, with an **`<option>`** for each choice. Each option's `value` is what code reads; the text between the tags is what people see:

```{.code environment="html"}
<label for="bed">Bed</label>
<select id="bed">
  <option value="B1">Bed 1</option>
  <option value="B2">Bed 2</option>
  <option value="B3">Bed 3</option>
</select>
<button id="show">Show choice</button>
<p id="choice"></p>

<script>
  const bed = document.querySelector("#bed")
  const show = document.querySelector("#show")
  const choice = document.querySelector("#choice")
  show.addEventListener("click", function() {
    choice.textContent = `You chose ${bed.value}`
  })
</script>
```

The select's `value` is the `value` of whichever option is chosen, "B2" for the second option, even though the list shows "Bed 2."

## Asking for the App

Here's the request, in a new chat with your learner profile from [Teaching Your AI About a New Platform](platform-profile){.book-link} and the JADE platform profile, with the line you added in that lesson:

::: {.ai-conversation prompt="(Paste the JADE platform profile first.) Build a harvest-entry app in JADE for our garden's volunteers. The workbook has a Harvests sheet: row 1 has headers, and each row after is one harvest: A Date (text such as 2027-06-18), B Bed ID (B1 to B8), C Crop, D Kilograms, E Logged By (the volunteer's email). When the workbook opens, the app should show a form in the task pane with the date, a drop-down list of beds, the crop, the kilograms and the volunteer's email, and an Add button that adds a row to the bottom of the Harvests sheet. It should remember the email of the last volunteer who used it, and show the five most recent harvests below the form." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="platform-profile" transcript="excel-app/harvest-app"}
> Before the code, two quick heads-ups:
>
> **1. Two new HTML tags:** A drop-down list needs `<select>` and `<option>`, which aren't in your list yet. They're simple: `<select>` makes the box, and each `<option>` inside it is one choice. I'll use them since you specifically asked for a drop-down.
>
> **2. Running the form when the workbook opens:** I don't actually know whether JADE has a way to run code automatically when the workbook opens — that's not in what you've told me about JADE, and I don't want to guess. What I *do* know works is listing the function with `Jade.listing` so it shows up in JADE's List Automations panel, and the volunteer runs it from there. Could you check JADE's own help/docs for an "on open" option? If one exists, we can wire it up.
>
> Also, since there's no `type="date"` in what you've learned (only `text` and `number`), I used a plain text box for the date and just labeled the expected format.
>
> Here's the code:
>
> ```javascript
> async function showHarvestForm(excel) {
>   /*Jade.listing:{"name":"Harvest Entry Form","description":"Shows a form to add a harvest and lists the 5 most recent harvests"}*/
>
>   // Get the Harvests sheet and read everything in it
>   const sheet = excel.workbook.worksheets.getItem("Harvests")
>   const usedRange = sheet.getUsedRange()
>   usedRange.load("values")
>   await excel.sync()
>   const allRows = usedRange.values
>
>   // Look up the last volunteer's email from a previous visit
>   let lastEmail = await Jade.read_object_from_workbook("lastVolunteerEmail")
>   if (lastEmail === null || lastEmail === undefined) {
>     lastEmail = ""
>   }
>   const lastEmailSafe = lastEmail.toHtmlEntities()
>
>   // Build one <option> tag per bed
>   const bedIds = ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"]
>   let bedOptionsHtml = ""
>   for (let i = 0; i < bedIds.length; i++) {
>     bedOptionsHtml = bedOptionsHtml + `<option value="${bedIds[i]}">${bedIds[i]}</option>`
>   }
>
>   // Build a table of the 5 most recent harvests, newest first
>   let recentHtml = "<table><tr><th>Date</th><th>Bed</th><th>Crop</th><th>Kg</th><th>Logged By</th></tr>"
>   let rowsShown = 0
>   for (let i = allRows.length - 1; i >= 1 && rowsShown < 5; i--) {
>     const row = allRows[i]
>     const dateText = String(row[0]).toHtmlEntities()
>     const bedText = String(row[1]).toHtmlEntities()
>     const cropText = String(row[2]).toHtmlEntities()
>     const kgText = String(row[3]).toHtmlEntities()
>     const emailText = String(row[4]).toHtmlEntities()
>     recentHtml = recentHtml + `<tr><td>${dateText}</td><td>${bedText}</td><td>${cropText}</td><td>${kgText}</td><td>${emailText}</td></tr>`
>     rowsShown = rowsShown + 1
>   }
>   recentHtml = recentHtml + "</table>"
>
>   // Put the whole page together as one HTML string
>   const html = `
>     <h2>Add a Harvest</h2>
>     <label>Date (example: 2027-06-18)</label><br>
>     <input type="text" id="dateInput"><br>
>     <label>Bed</label><br>
>     <select id="bedInput">${bedOptionsHtml}</select><br>
>     <label>Crop</label><br>
>     <input type="text" id="cropInput"><br>
>     <label>Kilograms</label><br>
>     <input type="number" id="kgInput"><br>
>     <label>Your Email</label><br>
>     <input type="text" id="emailInput" value="${lastEmailSafe}"><br><br>
>     <button id="addButton">Add</button>
>     <p id="statusText"></p>
>     <h2>Recent Harvests</h2>
>     ${recentHtml}
>   `
>
>   Jade.open_canvas("Harvest Entry", html)
>
>   // Wire up the Add button
>   tag("addButton").onclick = Jade.automate(async function(excel) {
>     const dateValue = tag("dateInput").value
>     const bedValue = tag("bedInput").value
>     const cropValue = tag("cropInput").value
>     const kgText = tag("kgInput").value
>     const emailValue = tag("emailInput").value
>
>     // Check the text fields aren't empty
>     if (dateValue === "" || cropValue === "" || emailValue === "") {
>       alert("Please fill in the date, crop and email.", "Missing information")
>       return
>     }
>
>     // Check kilograms is a real, positive number
>     const kgNumber = Number(kgText)
>     if (kgText === "" || isNaN(kgNumber) || kgNumber <= 0) {
>       alert("Please enter a valid number of kilograms.", "Invalid kilograms")
>       return
>     }
>
>     // Read the sheet again to find the next empty row
>     const sheet = excel.workbook.worksheets.getItem("Harvests")
>     const usedRange = sheet.getUsedRange()
>     usedRange.load("values")
>     await excel.sync()
>     const nextRow = usedRange.values.length
>
>     // Write the new harvest into that row
>     const newRowRange = sheet.getRangeByIndexes(nextRow, 0, 1, 5)
>     newRowRange.values = [[dateValue, bedValue, cropValue, kgNumber, emailValue]]
>     await excel.sync()
>
>     // Remember this volunteer's email for next time
>     Jade.save_object_to_workbook(emailValue, "lastVolunteerEmail")
>
>     // Redraw the whole form so the recent list is up to date
>     await showHarvestForm(excel)
>   })
> }
> ```
>
> **How it works, in plain language:**
>
> - The first part reads all the existing rows from the Harvests sheet (`usedRange.load("values")` then `await excel.sync()` to actually fetch them).
> - It looks up the last saved email with `Jade.read_object_from_workbook`, and if there isn't one yet, uses `""` instead.
> - A loop builds the eight `<option>` tags for the bed drop-down from a fixed list, since you said beds are always B1–B8.
> - Another loop walks backwards through the sheet's rows (skipping row 0, the header), building a table row for each of up to 5 harvests, so the newest ones show first. Each cell value is escaped with `toHtmlEntities()` since it's going into HTML.
> - Everything is combined into one HTML string and shown with `Jade.open_canvas`.
> - The Add button's handler is wrapped in `Jade.automate` because it needs to talk to Excel. It reads each form field's `.value`, checks nothing important is blank and that kilograms is a sensible number, then works out the next empty row by counting how many rows are already there (`usedRange.values.length`).
> - It writes the new row with `getRangeByIndexes`, saves the email for next time, then calls `showHarvestForm(excel)` again so the task pane redraws with the new row included in the recent list.
>
> Since this only writes to your own workbook (not email, a shared calendar, or an outside file), I didn't add a separate dry run — but it does check the input before writing, which covers the spirit of validating data before it's stored.
>
> Want me to also add a way to edit or delete a mistaken entry?
:::

Before reading the code, notice the second heads-up. Your profile's newest rule says to admit uncertainty instead of guessing, and the assistant did: it said it doesn't know whether JADE can run code when the workbook opens, and asked you to check. Compare that with the last lesson, where an assistant without the platform profile told you a JADE panel couldn't be built. Saying "I don't know" is far more useful than a wrong answer, because it tells you exactly where to look.

JADE's documentation answers the question: a function named **`auto_exec`**, in any code module, runs when the module loads, which happens when the workbook opens. You'll use it at the end of this lesson.

**Read.** It's a long function, but it's built from pieces you know:

- **Reading.** It loads the Harvests sheet's values, then reads the saved email with `Jade.read_object_from_workbook`.
- **Building the HTML.** A loop builds the `<option>` tags for the beds. Another loop builds a table of recent harvests, walking *backward* from the last row. Its condition, `i >= 1 && rowsShown < 5`, stops at whichever comes first: the header row, or five rows shown. Every value from the sheet goes through `toHtmlEntities()`, as the platform profile asks, because it's inserted into HTML.
- **Showing it.** `Jade.open_canvas` puts the form in the task pane.
- **The Add button.** Its handler is wrapped in `Jade.automate`. It reads each field's `value`, checks for empty fields and a sensible number of kilograms, finds the next empty row by counting the sheet's rows, and writes the new harvest with `getRangeByIndexes`, the method you added to the platform profile in the last lesson. Then it saves the email and calls `showHarvestForm(excel)` again, which redraws the whole panel, so the new harvest appears in the recent list.

That last step, a function calling itself to redraw the page, is a simple way to keep a panel up to date: after any change, rebuild everything from the sheet.

Three smaller things to fix:

- **The panel name has a space again,** `"Harvest Entry"`, the same slip as in the last lesson. Use something like `"harvestEntry"`.
- **`Jade.save_object_to_workbook` isn't awaited.** It returns a promise, and without `await`, the function carries on before the save finishes, and any error in saving is lost.
- **The labels aren't connected to their inputs.** A `<label>` needs a `for` attribute matching its input's `id`, as in [Events and Interactivity](events){.book-link}, or clicking it does nothing and screen readers can't tell which label goes with which box.

## A First-Run Bug

Run it in a new workbook, or one where nobody has used it yet, and it stops immediately:

::: {.ai-conversation prompt="The first time I run it, it stops with: TypeError: lastEmail.toHtmlEntities is not a function. Why? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="platform-profile" transcript="excel-app/harvest-app"}
> Good question — let's break down what this error is telling us.
>
> **What the error means:** `TypeError: lastEmail.toHtmlEntities is not a function` means that whatever value is stored in `lastEmail`, it's *not a string* — because `toHtmlEntities()` is a method that only exists on strings. When JavaScript tries to call a method that doesn't exist on a value, it throws this error.
>
> **Why this happens on the first run specifically:** The first time the form runs, nobody has ever saved a value under the key `"lastVolunteerEmail"` yet. So `Jade.read_object_from_workbook("lastVolunteerEmail")` has nothing to return.
>
> My code guards against that with:
> ```javascript
> if (lastEmail === null || lastEmail === undefined) {
>   lastEmail = ""
> }
> ```
> This assumes that when nothing is saved, JADE gives back either `null` or `undefined`. But the error tells us that assumption is wrong — `lastEmail` ended up being some other kind of value (not a string, and apparently not `null` or `undefined` either, or the check would have replaced it with `""`).
>
> **The honest issue:** I don't actually know for certain what `Jade.read_object_from_workbook` returns when a key has never been saved — it might be `undefined`, `null`, an empty object `{}`, or something else, and I guessed. That guess appears to be wrong, which is why the check didn't catch it.
>
> Before fixing it, it would help to find out exactly what's coming back. We could temporarily do something like:
> ```javascript
> Jade.print(typeof lastEmail, "Debug")
> ```
> to see what type it actually is. Want to try that, or do you already know (e.g. from JADE's documentation) what it returns for a missing key?
:::

This is a very good answer, and not because it knows the cause. It reasons from the error to what must be true: `toHtmlEntities` only exists on strings, so `lastEmail` isn't a string, and it isn't `null` or `undefined` either, or the check would have caught it. Then it admits it guessed what `read_object_from_workbook` returns, and suggests finding out with `typeof`, the tool you learned in [Variables and Data](variables){.book-link}.

You can also look it up. JADE's documentation says `read_object_from_workbook` returns `{}`, an empty object, when nothing has been saved under the key. An object has no `toHtmlEntities` method, hence the error. The fix is to check for what you actually want, a string, rather than for the things you think you might get:

```{.code environment="none"}
let lastEmail = await Jade.read_object_from_workbook("lastVolunteerEmail")
// nothing saved yet gives {}, so use "" unless a string was saved
if (typeof lastEmail !== "string") {
  lastEmail = ""
}
```

Checking `typeof lastEmail !== "string"` handles `{}`, `null`, `undefined` and anything else unexpected, all at once.

This is another mistake a platform profile should prevent, so the JADE profile gets two new lines, one for this and one for `auto_exec`:

```{.code environment="none"}
- await Jade.save_object_to_workbook(object, key) and await Jade.read_object_from_workbook(key) store data in the workbook. Both return promises, so await them. read_object_from_workbook returns {} (an empty object) when nothing has been saved under the key. Don't use the key jade or keys starting with gist:.
- If a module has a function named auto_exec(), JADE runs it when the module loads, including when the workbook opens. auto_exec takes no parameters; to run a workbook function from it, call Jade.automate(functionName)().
```

The first replaces the profile's earlier line about storing data. Notice where the information came from: the documentation, prompted by a question an honest assistant asked.

## Opening Automatically

`auto_exec` has no parameters, and `showHarvestForm` needs `excel`. `Jade.automate` bridges the gap: `Jade.automate(showHarvestForm)` makes a new function that runs `showHarvestForm` inside `Excel.run`, and the `()` after it calls that new function straight away:

```{.code environment="jade"}
function auto_exec() {
  Jade.automate(showHarvestForm)()
}
```

Another option is to open JADE's list of automations, built from every function with a `Jade.listing` comment, so volunteers can choose what to run:

```{.code environment="jade"}
function auto_exec() {
  Jade.open_automations()
}
```

For an app with one job, opening the form directly is friendlier.

::: {.note}
> **Code that runs when a file opens.** `auto_exec` runs every time someone opens the workbook with JADE, without them clicking anything. That's what makes the app convenient, and it's also why you should only open workbooks with code from people you trust, and read that code before relying on it. The next lesson says more about using other people's code.
:::

## The Finished App

Here's the app in the book's style, with the fixes: the first-run check, awaited saving, a panel name without spaces, labels connected to their inputs, and `auto_exec`. It also gives the panel a theme: the fourth argument to `Jade.open_canvas` is the name of one of JADE's built-in styles. Try `"water"`, `"mvp"` or `"sajura"`; `Jade.list_themes()` returns all of them.

```{.code environment="jade"}
const BED_IDS = ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"]

function auto_exec() {
  Jade.automate(showHarvestForm)()
}

async function showHarvestForm(excel) {
  /*Jade.listing:{"name":"Harvest entry","description":"A form for adding harvests, with the five most recent below it"}*/
  const sheet = excel.workbook.worksheets.getItem("Harvests")
  const usedRange = sheet.getUsedRange()
  usedRange.load("values")
  await excel.sync()
  const rows = usedRange.values

  let lastEmail = await Jade.read_object_from_workbook("lastVolunteerEmail")
  // nothing saved yet gives {}, so use "" unless a string was saved
  if (typeof lastEmail !== "string") {
    lastEmail = ""
  }

  let bedOptions = ""
  for (let i = 0; i < BED_IDS.length; i++) {
    bedOptions += `<option value="${BED_IDS[i]}">${BED_IDS[i]}</option>`
  }

  // the five most recent harvests, newest first (row 0 is the header)
  let recentRows = ""
  let shown = 0
  for (let i = rows.length - 1; i >= 1 && shown < 5; i--) {
    const cells = rows[i]
    recentRows += "<tr>"
    for (let j = 0; j < 4; j++) {
      recentRows += `<td>${String(cells[j]).toHtmlEntities()}</td>`
    }
    recentRows += "</tr>"
    shown++
  }

  const html = `
    <h2>Add a harvest</h2>
    <label for="dateInput">Date (such as 2027-06-18)</label>
    <input type="text" id="dateInput">
    <label for="bedInput">Bed</label>
    <select id="bedInput">${bedOptions}</select>
    <label for="cropInput">Crop</label>
    <input type="text" id="cropInput">
    <label for="kgInput">Kilograms</label>
    <input type="number" id="kgInput">
    <label for="emailInput">Your email</label>
    <input type="text" id="emailInput" value="${lastEmail.toHtmlEntities()}">
    <p><button id="addButton">Add</button></p>
    <h2>Recent harvests</h2>
    <table>
      <tr><th>Date</th><th>Bed</th><th>Crop</th><th>Kg</th></tr>
      ${recentRows}
    </table>
  `
  Jade.open_canvas("harvestEntry", html, true, "water")
  const addButton = tag("addButton")
  addButton.onclick = Jade.automate(addHarvest)
}

async function addHarvest(excel) {
  const date = tag("dateInput").value
  const bed = tag("bedInput").value
  const crop = tag("cropInput").value
  const kgText = tag("kgInput").value
  const email = tag("emailInput").value

  if (date === "" || crop === "" || email === "") {
    alert("Please fill in the date, crop and email.", "Missing information")
    return
  }
  const kilograms = Number(kgText)
  if (kgText === "" || isNaN(kilograms) || kilograms <= 0 || kilograms > 50) {
    alert("Kilograms must be a number between 0 and 50.", "Check the kilograms")
    return
  }

  const sheet = excel.workbook.worksheets.getItem("Harvests")
  const usedRange = sheet.getUsedRange()
  usedRange.load("rowCount")
  await excel.sync()

  // the next empty row, counting from 0, is the number of rows in use
  const newRow = sheet.getRangeByIndexes(usedRange.rowCount, 0, 1, 5)
  newRow.values = [[date, bed, crop, kilograms, email]]
  await excel.sync()

  await Jade.save_object_to_workbook(email, "lastVolunteerEmail")
  await showHarvestForm(excel)
}
```

Two small differences from the assistant's version are worth noticing. `addHarvest` loads `rowCount`, the number of rows in the used range, instead of all the values, because that's all it needs; Office.js is faster when you load only what you use. The check on kilograms has an upper limit, as the shift logger's did in [Building a Browser Extension](extension){.book-link}. And the recent-harvests table leaves out the Logged By column, so the panel doesn't show every volunteer's email address to whoever opens the workbook.

Save the module, close the workbook, and open it again. The form appears by itself.

::: {.screenshot-needed file="images/excel-app-harvest-form.png"}
Excel with the JADE task pane showing the finished harvest entry form in the "water" theme, with the recent harvests table below it.
:::

## Your Learner Profile

::: {.ai-profile lesson="excel-app"}
Add to "What I know so far":

- select and option elements for drop-down lists
- auto_exec in JADE, and Jade.open_automations()
- storing settings with await Jade.save_object_to_workbook() and await Jade.read_object_from_workbook(), which returns {} when nothing is saved
- JADE themes: the fourth argument to Jade.open_canvas(), Jade.set_theme() and Jade.list_themes()
- redrawing a panel by calling the function that builds it again
- loading only the properties you need, such as rowCount
:::

Your JADE platform profile has grown too, with the two lines from this lesson.

## Summary

JADE can host a complete application in Excel's task pane: `Jade.open_canvas` shows a form, a button wrapped in `Jade.automate` writes to the workbook, and calling the form function again redraws it with fresh data. A `<select>` with `<option>` elements makes a drop-down list whose `value` is the chosen option's value. `Jade.save_object_to_workbook` and `Jade.read_object_from_workbook` keep settings with the file; both must be awaited, and reading a key that was never saved gives `{}`. A function named `auto_exec` runs when the workbook opens, which makes an app start by itself, and is also a reason to trust only workbooks whose code you've read. An assistant that admits what it doesn't know points you straight to the documentation, and what you find there belongs in your platform profile. Next, you'll share code between workbooks, and load code other people have written.
