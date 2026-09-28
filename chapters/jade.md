---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Install the free JADE add-in in Excel, and write and run a code module.
2. Explain how Office.js works: requests are queued, `load` asks for values, and `await excel.sync()` sends the requests to Excel.
3. Read and write ranges on a worksheet with Office.js.
4. Show output in JADE with `Jade.print` and `Jade.open_output`.
5. Read arrow functions, `(context) => { }`, in code you find.
:::
:::

## A New Request from the University

The garden's first season has gone well, and the university's sustainability office has noticed. They'd like a harvest report for their annual sustainability review, and there's a catch: everyone in that office works in Microsoft Excel, not Google Sheets. They want an Excel workbook they can open, check and add to.

You could copy the numbers by hand. But Excel can run JavaScript too, which means everything you've learned so far carries over. This part of the book is about JavaScript in Microsoft Office.

## JavaScript in Excel

Excel has had a way to automate it for decades, a language called VBA, which you may hear about. It has a newer one, too: the **Office JavaScript API**, usually called **Office.js**, which works in Excel on Windows, on a Mac and on the web. It's the same API that professional Office add-ins are built with.

To use it, you need somewhere to write and run code inside Excel. This book uses **JADE**, the JavaScript Automation Development Environment, a free add-in written by one of this book's authors. It adds a task pane to Excel with a code editor, a Run button and an Output panel, and it saves your code inside the workbook, so the code travels with the file. It works in Excel on the web with a free Microsoft account, so you don't need to buy Office.

::: {.term}
> **Office.js** — The Office JavaScript API: JavaScript objects and methods for working with Excel, Word and PowerPoint documents, used by Office add-ins.
:::

::: {.term}
> **Add-in** — A program that adds features to an Office app, often shown in a task pane beside the document.
:::

### Installing JADE

1. Open Excel. Excel on the web is at **excel.cloud.microsoft**, or through **office.com**, with a free Microsoft account. Create a new blank workbook.
2. Open the add-ins store: on the **Home** tab, click **Add-ins** (in some versions, it's **Insert**, then **Get Add-ins**).
3. Search for **JADE**, and add it.
4. JADE's button appears on the Home tab. Click it to open the task pane.

::: {.screenshot-needed file="images/jade-install.png"}
Excel on the web with the Office Add-ins store open, showing JADE in the search results with its Add button.
:::

::: {.screenshot-needed file="images/jade-task-pane.png"}
Excel with the JADE task pane open on the right, showing the code editor with a new module, the function drop-down and the Run button.
:::

In JADE, you write code in **code modules**, each with its own tab in the editor, saved in the workbook when you click **Save** or **Run**. The function drop-down above the editor lists the functions JADE can run, like the menu in the Apps Script editor, and **Run** (or **Ctrl+Enter**) runs the selected one.

## Getting the Club's Data into Excel

For the examples in this part, the workbook needs the club's Harvests sheet. In the book's Google Sheets examples, each sheet had a copy button. You could copy its data and paste it into Excel. Or you can let JADE build it: paste this function into a code module, choose `buildHarvestsSheet` in the drop-down, and click **Run**.

<pre class="code" data-environment="jade">
async function buildHarvestsSheet(excel) {
  const data = [
    ["Date", "Bed ID", "Crop", "Kilograms", "Logged By"],
    ["2027-04-18", "B2", "Radish", 1.2, "elena.rossi@example.com"],
    ["2027-05-13", "B4", "Spinach", 2.4, "ben.okafor@example.com"],
    ["2027-05-15", "B2", "Lettuce", 3.9, "hana.kim@example.com"],
    ["2027-05-21", "B2", "Lettuce", 2.5, "dev.patel@example.com"],
    ["2027-05-21", "B4", "Spinach", 0.6, "gabe.martinez@example.com"],
    ["2027-05-28", "B4", "Kale", 2.2, "isaac.cohen@example.com"],
    ["2027-05-31", "B2", "Lettuce", 2.4, "gabe.martinez@example.com"],
    ["2027-06-05", "B4", "Kale", 0.6, "keisha.brown@example.com"],
    ["2027-06-09", "B1", "Basil", 2, "gabe.martinez@example.com"],
    ["2027-06-11", "B4", "Kale", 1.8, "dev.patel@example.com"],
    ["2027-06-13", "B3", "Zucchini", 0.5, "elena.rossi@example.com"],
    ["2027-06-13", "B6", "Carrot", 1.3, "gabe.martinez@example.com"],
    ["2027-06-18", "B1", "Basil", 1.3, "cam.nguyen@example.com"],
    ["2027-06-21", "B3", "Zucchini", 3.2, "dev.patel@example.com"],
    ["2027-06-22", "B3", "Bean", 2.6, "elena.rossi@example.com"],
    ["2027-06-24", "B5", "Tomato", 3.1, "ben.okafor@example.com"],
    ["2027-06-29", "B3", "Bean", 3.8, "dev.patel@example.com"],
    ["2027-06-30", "B3", "Zucchini", 0.6, "maya.thompson@example.com"],
    ["2027-07-01", "B1", "Tomato", 2.6, "dev.patel@example.com"],
    ["2027-07-01", "B5", "Tomato", 0.9, "ava.lopez@example.com"],
    ["2027-07-01", "B8", "Cucumber", 2.6, "isaac.cohen@example.com"],
    ["2027-07-03", "B5", "Pepper", 2, "elena.rossi@example.com"],
    ["2027-07-05", "B7", "Mint", 3.6, "farah.haddad@example.com"],
    ["2027-07-07", "B3", "Bean", 3.7, "hana.kim@example.com"],
    ["2027-07-08", "B1", "Tomato", 2.2, "elena.rossi@example.com"],
    ["2027-07-09", "B7", "Mint", 2.4, "keisha.brown@example.com"],
    ["2027-07-10", "B8", "Cucumber", 2.9, "maya.thompson@example.com"],
    ["2027-07-13", "B1", "Tomato", 1.4, "gabe.martinez@example.com"],
    ["2027-07-16", "B8", "Cucumber", 3.9, "farah.haddad@example.com"],
    ["2027-07-17", "B7", "Mint", 2.5, "ben.okafor@example.com"],
    ["2027-08-10", "B8", "Squash", 1.9, "gabe.martinez@example.com"],
    ["2027-08-16", "B8", "Squash", 2.3, "dev.patel@example.com"]
  ]
  const sheet = excel.workbook.worksheets.add("Harvests")
  // format the dates as text, as in the club's Google spreadsheet:
  // one ["@"] row for each of the 32 date cells
  const dateFormats = []
  for (let i = 1; i < data.length; i++) {
    dateFormats.push(["@"])
  }
  const dateColumn = sheet.getRange("A2:A33")
  dateColumn.numberFormat = dateFormats
  const range = sheet.getRange("A1:E33")
  range.values = data
  await excel.sync()
  Jade.print("Added the Harvests sheet", "Setup")
  Jade.open_output()
}
</pre>

It's your first Office.js code, and it's worth reading before you run it, as always. You can follow most of it already: an array of arrays with the data, a new worksheet named Harvests, a loop building an array of number formats, and two ranges. The parts that are new are what this lesson explains.

## How Office.js Works

Here's a small function that reads a cell and writes to another, in the form JADE expects:

<pre class="code" data-environment="jade">
async function copyFirstCrop(excel) {
  const sheet = excel.workbook.worksheets.getItem("Harvests")
  const cropCell = sheet.getRange("C2")
  // ask Excel for the cell's values
  cropCell.load("values")
  // send the request to Excel, and wait for the answer
  await excel.sync()
  const firstCrop = cropCell.values[0][0]
  const targetCell = sheet.getRange("G1")
  targetCell.values = [[firstCrop]]
  // send the change to Excel
  await excel.sync()
  Jade.print(`The first crop harvested was ${firstCrop}`, "First crop")
  Jade.open_output()
}
</pre>

Most of it will look familiar from Apps Script, with different names: `worksheets.getItem("Harvests")` is `getSheetByName`, and a range's `values` property is like `getValues` and `setValues`, always an array of arrays, even for one cell. Three things are different, and they're the heart of Office.js.

**`async function name(excel)`.** A JADE function that works with the workbook takes one parameter, which the book always names `excel`. When you run it, JADE passes in the **request context**, the connection between your code and the workbook. Every Office.js object you get comes, directly or indirectly, from `excel.workbook`.

**Nothing happens until `sync`.** Your code doesn't talk to Excel line by line. Instead, each line that asks for something or changes something is added to a queue of requests, and **`await excel.sync()`** sends the whole queue to Excel at once and waits for the reply. That's why the function is `async`: `sync` returns a promise, as `fetch` did in [Asynchronous JavaScript](async){.book-link}. Excel may be on another computer, in Excel on the web, and sending one batch instead of dozens of separate requests keeps things fast.

**`load` before you read.** Because of the queue, an object like `cropCell` starts out empty: it's a stand-in, called a *proxy*, for the real cell in Excel. To read its `values`, you first ask for them with **`load("values")`**, then `sync`, and only then read `cropCell.values`. Writing works the other way: set `values`, and the change is sent at the next `sync`.

::: {.term}
> **excel.sync()** — Sends all the queued Office.js requests to Excel and waits for the reply. Values you've asked for with `load` can be read after it; changes you've made take effect with it.
:::

The two most common Office.js mistakes both come from this:

- **Reading before loading and syncing.** `cropCell.values` without `load` and `sync` gives an error saying the property isn't available, and tells you to call `load` and `sync`.
- **Forgetting the final `sync`.** Changes that are never sent are never made. The code runs without an error, and nothing changes.

### Output in JADE

`Jade.print(text, heading)` writes to JADE's **Output** panel, and a heading starts a new block with a timestamp. `print` doesn't switch to the Output panel by itself, so call `Jade.open_output()` when you want to show it. You'll see why that matters in a moment.

## Asking for a Harvest Total

Your learner profile needs a new environment line for Excel, as it did for the browser in [How Web Pages Work](web-pages){.book-link}; the updated profile is at the end of this lesson. Here's a request in a new chat with it:

::: {.ai-conversation prompt="My workbook has a sheet named Harvests. Row 1 has headers, and each row after that is one harvest: A Date, B Bed ID, C Crop, D Kilograms, E Logged By. Write code that adds up the Kilograms column and writes the total in cell G1 of the Harvests sheet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="jade" transcript="jade/harvest-total"}
> Since this is Office.js (not Apps Script), it uses a different pattern than `SpreadsheetApp`. Office.js needs a few new pieces you haven't seen yet:
>
> - `Excel.run()` — wraps your code so it can talk to Excel
> - `context.sync()` — sends your requests to Excel and waits for the reply (this is why the function is `async` and uses `await`)
> - `.load()` — tells Excel which properties you want to read, before you read them
>
> Here's the code:
>
> ```javascript
> async function addHarvestTotal() {
>   await Excel.run(async (context) => {
>     // Get the Harvests sheet
>     const sheet = context.workbook.worksheets.getItem("Harvests")
>
>     // Get all the cells that have data in them
>     const usedRange = sheet.getUsedRange()
>
>     // Ask Excel to load the values of that range
>     usedRange.load("values")
>
>     // Send the request and wait for the values to come back
>     await context.sync()
>
>     // Now the values are ready to use, as an array of arrays
>     const data = usedRange.values
>
>     // Add up the Kilograms column (column D, index 3)
>     // Start at row 1 to skip the header row
>     let total = 0
>     for (let i = 1; i < data.length; i++) {
>       total += data[i][3]
>     }
>
>     // Get cell G1 and set its value to the total
>     const totalCell = sheet.getRange("G1")
>     totalCell.values = [[total]]
>
>     // Send that change to Excel
>     await context.sync()
>   })
> }
> ```
>
> A few notes:
>
> - `data[i][3]` reads column D (Kilograms) because arrays start counting at 0 (A=0, B=1, C=2, D=3).
> - The two `await context.sync()` calls are needed because talking to Excel takes time — one to fetch the data, one to send the write.
> - Since this only writes one total into one cell (not deleting or emailing anything), it doesn't need a dry run.
>
> Would you like to try running this, or do you want me to explain `Excel.run` and `context.sync()` a bit more first?
:::

**Read.** The assistant listed the three new pieces, and the pattern is the one you just learned: get the sheet, get the range, `load("values")`, `sync`, read, add up, write, `sync` again. `getUsedRange()` is like Apps Script's `getDataRange()`: the range covering all the cells that have something in them.

Two things don't fit, though:

- **`Excel.run(async (context) => { ... })`.** This is how Office.js code is written in a regular add-in: `Excel.run` creates the request context and passes it to the function you give it. JADE does that for you, when a function is written as `async function name(excel)`. The assistant didn't know that; it knew Office.js, but not JADE.
- **`(context) => { ... }`** is a kind of function you haven't learned, and the assistant used it without saying so.

### Arrow functions

`(context) => { ... }` is an **arrow function**, a shorter way to write an anonymous function, like the event handlers in [Events and Interactivity](events){.book-link}. These two do the same thing:

<pre class="code">
function compareFunctions() {
  const double = function(number) {
    return number * 2
  }
  const doubleArrow = (number) => {
    return number * 2
  }
  console.log(double(4), doubleArrow(4))
}
</pre>

The parameters go in the parentheses, then `=>`, then the body. Office.js documentation and examples use arrow functions everywhere, so it's worth being able to read them, even though this book doesn't write them. (There are shorter forms still, such as `number => number * 2`, with no parentheses, braces or `return`. When you see one, read it as "take `number`, give back `number * 2`.")

::: {.term}
> **Arrow function** — A shorter way to write an anonymous function: `(x) => { return x * 2 }` does the same as `function(x) { return x * 2 }`.
:::

### Telling the assistant about JADE

The fix is to tell the assistant how JADE works, and what you haven't learned, in the same chat:

::: {.ai-conversation prompt="In JADE, if I write a function as async function name(excel), JADE runs it inside Excel.run for me, and excel is the request context. Rewrite it that way. Also, I haven't learned the => kind of function." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="jade" transcript="jade/harvest-total"}
> Got it — thanks for clarifying. Here's the rewrite:
>
> ```javascript
> async function addHarvestTotal(excel) {
>   // Get the Harvests sheet
>   const sheet = excel.workbook.worksheets.getItem("Harvests")
>
>   // Get all the cells that have data in them
>   const usedRange = sheet.getUsedRange()
>
>   // Ask Excel to load the values of that range
>   usedRange.load("values")
>
>   // Send the request and wait for the values to come back
>   await excel.sync()
>
>   // Now the values are ready to use, as an array of arrays
>   const data = usedRange.values
>
>   // Add up the Kilograms column (column D, index 3)
>   // Start at row 1 to skip the header row
>   let total = 0
>   for (let i = 1; i < data.length; i++) {
>     total += data[i][3]
>   }
>
>   // Get cell G1 and set its value to the total
>   const totalCell = sheet.getRange("G1")
>   totalCell.values = [[total]]
>
>   // Send that change to Excel
>   await excel.sync()
> }
> ```
>
> Changes I made:
>
> - Removed `Excel.run` and the wrapping — JADE handles that for you.
> - Renamed `context` to `excel`, since that's the parameter name JADE gives you.
> - Changed `context.sync()` to `excel.sync()` to match.
> - No arrow functions anywhere — just the one `async function name(excel) { }` you write, with no functions nested inside it.
:::

That's exactly JADE's form. One sentence about the platform changed the code.

Then one more request:

::: {.ai-conversation prompt="I also want to see the total in JADE's output panel, not just in the cell. How do I show it?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="jade" transcript="jade/harvest-total"}
> In JADE, `console.log` output shows up in the output panel — you already know this from browser developer tools, and it works the same way here.
>
> Just add a `console.log` line before the final `sync()`:
>
> ```javascript
> async function addHarvestTotal(excel) {
>   // Get the Harvests sheet
>   const sheet = excel.workbook.worksheets.getItem("Harvests")
>
>   // Get all the cells that have data in them
>   const usedRange = sheet.getUsedRange()
>
>   // Ask Excel to load the values of that range
>   usedRange.load("values")
>
>   // Send the request and wait for the values to come back
>   await excel.sync()
>
>   // Now the values are ready to use, as an array of arrays
>   const data = usedRange.values
>
>   // Add up the Kilograms column (column D, index 3)
>   // Start at row 1 to skip the header row
>   let total = 0
>   for (let i = 1; i < data.length; i++) {
>     total += data[i][3]
>   }
>
>   // Show the total in JADE's output panel
>   console.log(`Total kilograms: ${total}`)
>
>   // Get cell G1 and set its value to the total
>   const totalCell = sheet.getRange("G1")
>   totalCell.values = [[total]]
>
>   // Send that change to Excel
>   await excel.sync()
> }
> ```
>
> This uses a template literal (backticks with `${ }`) to build the message, which you've already learned.
:::

This one is wrong, and confidently so. In JADE, `console.log` doesn't write to the Output panel. It writes to the browser console of the task pane, which is hidden, and which most people never open. The total would seem to vanish. The assistant filled in the gap with a reasonable guess, based on how other tools work, and presented it as fact: "it works the same way here."

The right way is `Jade.print`, followed by `Jade.open_output()` to show the panel. There's also a surprise waiting in the result. Run it, and the Output panel shows *Total kilograms: 70.90000000000002*, the floating-point tail from [College Community Garden: Case Setup](case){.book-link}. Here's the function with both fixed:

<pre class="code" data-environment="jade">
async function writeHarvestTotal(excel) {
  const sheet = excel.workbook.worksheets.getItem("Harvests")
  const usedRange = sheet.getUsedRange()
  usedRange.load("values")
  await excel.sync()

  const data = usedRange.values
  let total = 0
  // start at 1 to skip the header row; kilograms are in column D, index 3
  for (let i = 1; i < data.length; i++) {
    total += data[i][3]
  }
  const roundedTotal = Math.round(total * 10) / 10

  const totalCell = sheet.getRange("G1")
  totalCell.values = [[roundedTotal]]
  await excel.sync()

  Jade.print(`Total kilograms harvested: ${roundedTotal}`, "Harvest total")
  Jade.open_output()
}
</pre>

The total is 70.9 kilograms. This version rounds with `Math.round`, rather than `toFixed`, so the cell gets a number the sustainability office can calculate with.

### What this tells you about assistants and new platforms

This exchange shows something you'll run into again. The assistant knew Office.js well, because a great deal of Office.js code exists for it to have learned from. It knew almost nothing about JADE, a much smaller tool. So where JADE differs from ordinary Office.js, it guessed, and its guesses sounded exactly as confident as the parts it knew. You fixed one guess by describing JADE, and caught another because the output didn't appear.

That's the subject of the next lesson: how to describe a platform an assistant doesn't know, *before* it guesses.

## Your Learner Profile

::: {.ai-profile lesson="jade"}
Environment: I'm writing JavaScript for Microsoft Excel, using the Office JavaScript API (Office.js) in a free Excel add-in called JADE.

Add to "What I know so far":

- Office.js in JADE: async function name(excel), where excel is the request context
- excel.workbook.worksheets.getItem(), worksheets.add(), getRange(), getUsedRange(), and a range's values and numberFormat (arrays of arrays)
- load() before reading a property, and await excel.sync() to send queued requests to Excel
- Jade.print(text, heading) and Jade.open_output()
- reading arrow functions, such as (context) => { }
:::

The environment line is the only change to your rules. The next lesson adds a description of JADE itself, the kind of thing that would have prevented both of this lesson's wrong guesses.

## Summary

Excel runs JavaScript through Office.js, and the free JADE add-in gives you an editor, a Run button and an Output panel inside Excel, with your code saved in the workbook. A JADE function that works with the workbook is written `async function name(excel)`, where `excel` is the request context. Office.js queues your requests: `load` asks for a property's value, `await excel.sync()` sends the queue to Excel, and only after that can you read what you loaded; changes take effect at the next `sync`. Ranges have a `values` property, always an array of arrays. In JADE, output goes through `Jade.print` and `Jade.open_output`, not `console.log`. Assistants know Office.js well and JADE barely at all, so where the two differ, they guess, confidently. Next, you'll learn to describe a platform to an assistant before it has the chance.
