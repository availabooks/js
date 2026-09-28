---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain why assistants know some platforms well and others barely at all, and why their guesses sound confident either way.
2. Recognize the different kinds of "JavaScript for Excel" in an assistant's reply: Office.js, Office Scripts, VBA and Apps Script.
3. Write a platform profile that describes a tool an assistant doesn't know.
4. Improve a platform profile when an assistant still makes a mistake.
5. Build a task pane panel in JADE with a button that works with the workbook.
:::
:::

## What an Assistant Knows

An AI assistant learned what it knows from an enormous amount of text, including a great deal of code. How well it knows a platform depends mostly on how much has been written about it. Google Apps Script and Office.js have been around for years, with documentation, tutorials, forum answers and code everywhere, so assistants know them well. JADE is a small tool with one set of documentation, so an assistant knows little or nothing about it.

The trouble is that an assistant doesn't sound less sure when it knows less. You saw that in [Excel's JavaScript API, with JADE](jade){.book-link}: the assistant said `console.log` would show in JADE's Output panel in exactly the same confident tone it used for the parts it knew. Where its knowledge ran out, it filled the gap with what's true of *similar* tools.

This lesson teaches the fix, and it's a skill you'll use far beyond JADE: describe the platform to the assistant, in a **platform profile**, before it has a chance to guess. It's the same idea as describing your sheet in [Arrays](arrays){.book-link}, and the garden context in [College Community Garden: Case Setup](case){.book-link}, applied to a whole tool.

::: {.term}
> **Platform profile** — A description of a tool or platform, pasted into a chat along with your learner profile, that tells an assistant what it needs to know to write code for it: what the platform is and isn't, how code is written and run, and its known pitfalls.
:::

## Four Kinds of JavaScript for Excel

First, a complication that makes Excel especially prone to mix-ups. Here's a request with no learner profile, and no mention of JADE:

::: {.ai-conversation prompt="Write JavaScript for Excel that highlights in yellow every row of my Supplies sheet where Quantity (column B) is at or below Reorder At (column D). Row 1 has headers." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="none" transcript="platform-profile/no-profile"}
> # Excel JavaScript: Highlight Rows Where Quantity ≤ Reorder At
>
> Here's a script using the Office Scripts API for Excel:
>
> ```javascript
> function main(workbook: ExcelScript.Workbook) {
>   // Get the Supplies sheet
>   const sheet = workbook.getWorksheet("Supplies");
>
>   // Get the used range to determine how many rows have data
>   const usedRange = sheet.getUsedRange();
>   const rowCount = usedRange.getRowCount();
>
>   // Get values for columns B (Quantity) and D (Reorder At)
>   // Starting from row 2 (index 1) since row 1 is headers
>   const dataRange = sheet.getRangeByIndexes(1, 0, rowCount - 1, 4); // Columns A-D
>   const values = dataRange.getValues();
>
>   // Loop through each row of data
>   for (let i = 0; i < values.length; i++) {
>     const quantity = values[i][1];   // Column B
>     const reorderAt = values[i][3];  // Column D
>
>     // Check if both values are numbers before comparing
>     if (typeof quantity === "number" && typeof reorderAt === "number") {
>       if (quantity <= reorderAt) {
>         // Highlight the entire row (adjust column range as needed)
>         const rowIndex = i + 1; // +1 to account for header row
>         const rowRange = sheet.getRangeByIndexes(rowIndex, 0, 1, 4); // A:D
>         rowRange.getFormat().getFill().setColor("#FFFF00");
>       } else {
>         // Optional: clear fill for rows that don't meet criteria
>         const rowIndex = i + 1;
>         const rowRange = sheet.getRangeByIndexes(rowIndex, 0, 1, 4);
>         rowRange.getFormat().getFill().clear();
>       }
>     }
>   }
> }
> ```
>
> ## Notes:
>
> 1. **Column range**: This highlights columns A–D. If your sheet has more columns (e.g., Supply Name, Unit Cost, etc.), adjust the `4` in `getRangeByIndexes(rowIndex, 0, 1, 4)` to match your total column count.
>
> 2. **Clearing non-matching rows**: The `else` block clears fill color for rows that don't meet the condition — useful if you re-run the script after updating quantities. Remove this block if you don't want that behavior.
>
> 3. **Header row**: The script starts checking from row 2 (index 1 in the array, but index 1 in the sheet since row 0 = header row 1).
>
> 4. **Where to run this**:
>    - Open your workbook in Excel (desktop or web)
>    - Go to **Automate** tab → **New Script**
>    - Paste this code, rename the function if desired, and click **Run**
>
> ### If you need it for VBA instead
> Let me know — this version is for **Office Scripts** (used in Excel Online / the "Automate" tab). VBA macros use a different syntax entirely.
:::

This is **Office Scripts**, a different way to automate Excel with JavaScript, not Office.js. It would not run in JADE. And the assistant's instructions to use the **Automate** tab only work with a Microsoft 365 work or school account. With a free or personal account, there's no Automate tab at all.

"JavaScript for Excel" can mean several things, and replies mix them up. Learn to recognize each one by its markers:

| Kind | Where it runs | How to recognize it |
|---|---|---|
| **Office.js** (what JADE uses) | Office add-ins, in a task pane | `excel.workbook` or `context.workbook`, `load(...)`, `await excel.sync()`, properties like `range.values = ...` |
| **Office Scripts** | Excel's Automate tab, with a work or school license | `function main(workbook: ExcelScript.Workbook)`, methods like `getValues()` and `setColor()`, no `sync` |
| **VBA** | Excel on Windows and Mac, as macros | Not JavaScript at all: `Sub`, `End Sub`, `Dim`, `Range("A1").Value` |
| **Apps Script** | Google Sheets | `SpreadsheetApp`, `getRange(row, column, numRows, numColumns)`, `getValues()` |

The `: ExcelScript.Workbook` in the reply is also a clue. It's **TypeScript**, JavaScript with types added, which Office Scripts uses. An optional lesson at the end of this part covers Office Scripts and TypeScript, for readers who have the license.

## Without a Platform Profile

Now a request that uses more of JADE: a small panel in the task pane with a button. First, the build function for the Supplies sheet, to run in JADE:

```{.code environment="jade"}
async function buildSuppliesSheet(excel) {
  const data = [
    ["Item", "Quantity", "Unit", "Reorder At"],
    ["Tomato cages", 18, "each", 10],
    ["Compost", 6, "bags", 8],
    ["Mulch", 12, "bags", 5],
    ["Seed packets", 40, "packets", 15],
    ["Garden gloves", 9, "pairs", 12],
    ["Hose nozzles", 3, "each", 2],
    ["Twine", 2, "rolls", 3],
    ["Trowels", 11, "each", 6]
  ]
  const sheet = excel.workbook.worksheets.add("Supplies")
  const range = sheet.getRange("A1:D9")
  range.values = data
  await excel.sync()
  Jade.print("Added the Supplies sheet", "Setup")
  Jade.open_output()
}
```

Here's the request, in a new chat with your learner profile from [Excel's JavaScript API, with JADE](jade){.book-link}, which says you're using JADE, but nothing about how JADE works:

::: {.ai-conversation prompt="My workbook has a sheet named Supplies. Row 1 has headers, and each row after that is one item: A Item, B Quantity (a number), C Unit, D Reorder At (a number). Write a JADE automation that shows a small panel in the task pane with a button. When the button is clicked, it highlights in yellow every row where Quantity is at or below Reorder At, and reports how many items need reordering." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="jade" transcript="platform-profile/without"}
> Before I write this, two things to flag:
>
> **1. The task pane and button**
> Based on what you've learned, JADE itself provides the task pane where you write your function and click Run — you don't build custom HTML buttons inside it (that would need a separate web page setup you haven't covered). So what I'll write is the automation function itself. You run it from JADE's own Run button, and it shows its report with `Jade.print`.
>
> **2. A new concept: coloring cells**
> Highlighting a row yellow needs setting a range's **fill color**, which isn't on your list yet. The property is:
>
> ```js
> rowRange.format.fill.color = "yellow"
> ```
>
> This is like `values` and `numberFormat`, but it's a different property of a range called `format.fill`. I'll use it here since there's no way to highlight cells without it — let me know if you want to stop and practice that alone first before combining it with the loop.
>
> Here's the automation:
>
> ```js
> const highlightReorderItems = async (excel) => {
>   // get the Supplies worksheet
>   const sheet = excel.workbook.worksheets.getItem("Supplies")
>
>   // get all the cells that have data on that sheet
>   const usedRange = sheet.getUsedRange()
>
>   // load the values so we can read them
>   usedRange.load("values")
>
>   // send the request to Excel and wait for the values to come back
>   await excel.sync()
>
>   // read the values into a plain array of arrays
>   const data = usedRange.values
>
>   // start a running total of how many items need reordering
>   let reorderCount = 0
>
>   // loop over each row, starting at 1 to skip the header row
>   for (let i = 1; i < data.length; i++) {
>
>     // read quantity from column B (index 1)
>     const quantity = data[i][1]
>
>     // read reorder at from column D (index 3)
>     const reorderAt = data[i][3]
>
>     // check if quantity is at or below reorder at
>     if (quantity <= reorderAt) {
>
>       // build the address for this row, like "A2:D2"
>       const rowAddress = `A${i + 1}:D${i + 1}`
>
>       // get that row as a range
>       const rowRange = sheet.getRange(rowAddress)
>
>       // set its fill color to yellow
>       rowRange.format.fill.color = "yellow"
>
>       // add one to the count
>       reorderCount++
>     }
>   }
>
>   // send all the queued color changes to Excel
>   await excel.sync()
>
>   // report the result in JADE's output panel
>   Jade.print(`${reorderCount} item(s) need reordering.`, "Reorder Check")
> }
> ```
>
> A few things to notice:
>
> - `data[i]` is row `i + 1` on the sheet, because row 1 is the header — that's why the address uses `i + 1`.
> - Setting `.color` doesn't send anything to Excel by itself — it just queues the change, which is why we call `await excel.sync()` again after the loop, once all rows are marked.
> - No dry run is needed here since this only changes formatting, not data or anything sent externally.
>
> Want to try running it, or would you like to practice `format.fill.color` on its own first with one test row?
:::

The highlighting code is good: it loads, syncs, loops, sets `format.fill.color` on each matching row, and syncs again, and the assistant flagged `format.fill.color` as new. But the reply has three problems, and all three come from not knowing JADE:

- **It said the panel can't be built.** "You don't build custom HTML buttons inside it," it said. JADE can, with `Jade.open_canvas`. The assistant turned a gap in its knowledge into a statement about the tool.
- **It wrote the function as `const highlightReorderItems = async (excel) => { }`**, an arrow function in a variable. JADE's function drop-down lists functions written as `function name()` or `async function name(excel)`, so this one may not appear there to run.
- **It never calls `Jade.open_output()`**, so the report is written to the Output panel, but the panel isn't shown.

## Writing a Platform Profile

A platform profile answers the questions an assistant would otherwise guess at. Where do the answers come from? Mostly from two places: the platform's **documentation**, and the **mistakes** you've already seen. For JADE, the documentation is its function reference, and this part of the book has already shown several mistakes.

A good platform profile covers:

- **What the platform is, and isn't.** Name the kinds it's easily confused with. For JADE: Office.js, not Office Scripts, VBA or Apps Script.
- **How code is written and run.** The shape of a function, and anything the platform does for you, such as JADE calling `Excel.run`.
- **How to show output and interfaces.** For JADE: `Jade.print`, `Jade.open_output`, `Jade.open_canvas`.
- **Known pitfalls.** Each mistake you've seen, stated as a rule.
- **Your style,** if the platform's examples differ from it.

Here's a platform profile for JADE. It's short enough to paste into any chat:

```{.code environment="none"}
About JADE, the Excel add-in I'm using:

- JADE is a free Excel add-in. My code lives in code modules in JADE's task pane and is saved in the workbook. It uses the Office JavaScript API (Office.js). It is not Office Scripts, VBA or Google Apps Script, so don't use ExcelScript, function main(workbook), VBA, or SpreadsheetApp.
- A function that works with the workbook is written as async function name(excel). JADE runs it inside Excel.run for me, and excel is the request context. Don't call Excel.run yourself. Always name the parameter excel.
- Before reading a property such as values, call load() on the object and then await excel.sync(). After making changes, call await excel.sync() to send them to Excel.
- Show output with Jade.print(text, heading), then Jade.open_output() to show the Output panel. console.log goes to a hidden browser console, so don't use it for output.
- To show my own HTML in the task pane, use Jade.open_canvas(panelName, html). After that, find elements with tag(id), which is short for document.getElementById.
- A button's click handler that works with the workbook must be wrapped with Jade.automate, which runs it inside Excel.run: tag("myButton").onclick = Jade.automate(async function(excel) { ... }).
- alert(html, heading) shows JADE's message box; it doesn't pause the code. prompt() and confirm() don't work in the task pane, so ask for input with a form in a canvas.
- Jade.print and Jade.open_canvas insert HTML, so text from cells should be escaped with its toHtmlEntities() method before it goes into them.
- To list a function in JADE's List Automations panel, put a comment inside the function: /*Jade.listing:{"name":"Short name","description":"What it does"}*/. The text after the colon must be valid JSON.
- Jade.save_object_to_workbook(object, key) and await Jade.read_object_from_workbook(key) store data in the workbook. Don't use the key jade or keys starting with gist:.
- Write in the style of my textbook: camelCase names.
```

Read it against the documentation, and against this part of the book: every line either describes how JADE works or heads off a specific mistake. The line about `console.log` comes from the last lesson. The line about `prompt()` and `confirm()` comes from how Office task panes work: they're blocked there, and assistants reach for them whenever code needs input. The line about `toHtmlEntities` comes from the rule you learned in [A Web App with Apps Script](web-app){.book-link}: text inserted into HTML is read as HTML.

Use it the way you use the garden context: start a chat with your learner profile, then paste the platform profile, then ask.

## With the Platform Profile

Here's the same request, in a new chat with the learner profile and the platform profile:

::: {.ai-conversation prompt="(Paste the JADE platform profile first.) My workbook has a sheet named Supplies. Row 1 has headers, and each row after that is one item: A Item, B Quantity (a number), C Unit, D Reorder At (a number). Write a JADE automation that shows a small panel in the task pane with a button. When the button is clicked, it highlights in yellow every row where Quantity is at or below Reorder At, and reports how many items need reordering." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="jade" transcript="platform-profile/with"}
> Good context — thanks. This task needs one new piece you haven't learned yet: to color cells, Office.js uses a range's `format.fill.color` property. I'll introduce it here and explain it as I go.
>
> Here's the automation:
>
> ```javascript
> function highlightReorderPanel() {
>   /*Jade.listing:{"name":"Highlight Reorder Items","description":"Shows a panel with a button that highlights supply rows needing reorder"}*/
>
>   // Build a small HTML page with a heading and a button
>   const html = `
>     <!doctype html>
>     <html>
>     <head><title>Reorder Check</title></head>
>     <body>
>       <h2>Check Supplies</h2>
>       <button id="checkButton">Highlight Items to Reorder</button>
>     </body>
>     </html>
>   `
>
>   // Show that HTML in the task pane
>   Jade.open_canvas("Reorder Check", html)
>
>   // Find the button we just created
>   const checkButton = tag("checkButton")
>
>   // Wrap the click handler with Jade.automate so it can work with the workbook
>   checkButton.onclick = Jade.automate(async function(excel) {
>
>     // Get the Supplies sheet
>     const sheet = excel.workbook.worksheets.getItem("Supplies")
>
>     // Get all the used cells on that sheet
>     const usedRange = sheet.getUsedRange()
>
>     // Ask to read the values, then send the request and wait for the reply
>     usedRange.load("values")
>     await excel.sync()
>
>     // Store the values in a variable, as an array of arrays
>     const data = usedRange.values
>
>     // This will count how many rows need reordering
>     let reorderCount = 0
>
>     // Loop through the rows, starting at 1 to skip the header row
>     for (let i = 1; i < data.length; i++) {
>
>       // Quantity is column B (index 1), Reorder At is column D (index 3)
>       const quantity = data[i][1]
>       const reorderAt = data[i][3]
>
>       // Check if this item is at or below its reorder point
>       if (quantity <= reorderAt) {
>
>         // Add one to the count
>         reorderCount = reorderCount + 1
>
>         // Get a range for just this row, same width as the data
>         const rowRange = sheet.getRange(`A${i + 1}:D${i + 1}`)
>
>         // Set that row's fill color to yellow
>         rowRange.format.fill.color = "yellow"
>       }
>     }
>
>     // Send the color changes to Excel
>     await excel.sync()
>
>     // Show the result in the Output panel
>     Jade.print(`Items needing reorder: ${reorderCount}`, "Reorder Check")
>     Jade.open_output()
>   })
> }
> ```
>
> **What's new here, explained:**
> - `rowRange.format.fill.color = "yellow"` — every range has a `format` property, and `format.fill.color` sets its background color. You just assign a color name (or a hex code like `"#FFFF00"`) to it, then `await excel.sync()` sends the change to Excel.
> - `sheet.getRange(\`A${i + 1}:D${i + 1}\`)` — this gets a range using an Excel-style address like `"A2:D2"`, built with a template literal. This is a different way to call `getRange` than the numbers version you've used before (`getRange(row, column, numRows, numColumns)`), but it works the same way, just with a text address instead of numbers. I used it here because it's simpler when you already know the column letters.
>
> **To run this:** call `highlightReorderPanel()` from JADE's editor once, which opens the panel. Then click the button in the task pane to do the actual highlighting and see the count.
>
> Want me to rewrite the row range using the numeric version of `getRange` instead, so it matches what you've already learned more closely?
:::

The difference is large. The panel is built with `Jade.open_canvas`, the button is found with `tag`, and its handler is wrapped in `Jade.automate`, so it runs inside `Excel.run` with `excel` as its parameter. The function is a plain `function`, it has a `Jade.listing` comment so it appears in the List Automations panel, and the report ends with `Jade.open_output()`. Every line of the platform profile that applied was followed.

**Read.** It's still worth reading closely, and three things need attention:

- **The panel's name has a space in it.** `"Reorder Check"` becomes the panel's element id, and ids shouldn't contain spaces, because CSS selectors like `#Reorder Check` can't find them. `"reorderCheck"` is safer.
- **The canvas HTML is a whole page,** with a doctype, `<html>`, `<head>` and `<body>`. The canvas is a part of the task pane, not a new page, so only the heading and the button are needed. The browser ignores the rest, but it's clutter.
- **The last offer mixes two APIs.** The assistant offers to rewrite the range "using the numeric version of `getRange`... that you've already learned." That's Apps Script's `getRange(row, column, numRows, numColumns)`, from [Google Forms](google-forms){.book-link}. Office.js's `getRange` only takes an address, like `"A2:D2"`. Its version with numbers is a different method, `getRangeByIndexes(row, column, rowCount, columnCount)`, and it counts rows and columns from 0. Taking the offer would give you code that fails. Your learner profile lists what you know from *both* platforms, and the assistant blended them.

### A platform profile grows

The last mistake is exactly the kind a platform profile should prevent next time. So add a line to it:

```{.code environment="none"}
- In Office.js, sheet.getRange() takes an address such as "A2:D2". For row and column numbers, use getRangeByIndexes(row, column, rowCount, columnCount), which counts from 0. Don't use Apps Script's getRange(row, column, numRows, numColumns).
```

A platform profile is never finished. Each time an assistant makes a mistake the profile could have prevented, add a line. Over time, it becomes a record of everything that's tricky about the platform, which is useful to *you*, not just the assistant.

### The finished panel

Here's the panel in the book's style, with the three fixes. Paste it into a JADE code module, choose `showReorderPanel`, and run it, then click the button:

```{.code environment="jade"}
function showReorderPanel() {
  /*Jade.listing:{"name":"Reorder check","description":"Highlights supplies that need reordering"}*/
  const html = `
    <h2>Check Supplies</h2>
    <p>Highlights every item at or below its reorder level.</p>
    <button id="checkButton">Highlight items to reorder</button>
  `
  Jade.open_canvas("reorderCheck", html)
  const checkButton = tag("checkButton")
  checkButton.onclick = Jade.automate(highlightReorderItems)
}

async function highlightReorderItems(excel) {
  const sheet = excel.workbook.worksheets.getItem("Supplies")
  const usedRange = sheet.getUsedRange()
  usedRange.load("values")
  await excel.sync()

  const data = usedRange.values
  let reorderCount = 0
  // start at 1 to skip the header row
  for (let i = 1; i < data.length; i++) {
    const quantity = data[i][1]
    const reorderAt = data[i][3]
    if (quantity <= reorderAt) {
      // data[i] is sheet row i + 1
      const rowRange = sheet.getRange(`A${i + 1}:D${i + 1}`)
      rowRange.format.fill.color = "yellow"
      reorderCount++
    }
  }
  await excel.sync()

  Jade.print(`Items to reorder: ${reorderCount}`, "Reorder check")
  Jade.open_output()
}
```

This version passes `highlightReorderItems`, a named function, to `Jade.automate`, instead of writing the handler in place. Because it's written as `async function name(excel)`, it also appears in JADE's function drop-down, so you can run and test it without the button. For the club's supplies, three rows turn yellow: Compost, Garden gloves and Twine.

## A Skill for Any Platform

You'll meet many tools that assistants don't know well: new ones, small ones, your school's or employer's own systems, and new versions of familiar ones. The method is the same every time:

1. **Notice the signs.** Code that looks like a *different* platform, instructions for menus that don't exist, or confident claims that turn out to be false.
2. **Read the documentation,** especially the part about how code is written and run.
3. **Write a platform profile:** what it is and isn't, how code runs, how to show output, and the pitfalls you've found.
4. **Test it,** by asking for something that uses several features at once, and reading the reply against the documentation.
5. **Add a line** each time you catch a new mistake.

At the end of the book, you'll write a learning profile of your own for a new subject, and a platform profile is half of it.

## Your Learner Profile

::: {.ai-profile lesson="platform-profile"}
Add rules:

- When you're not sure how a tool or platform works, say so instead of guessing.

Add to "What I know so far":

- recognizing Office.js, Office Scripts, VBA and Apps Script code
- platform profiles, such as my JADE platform profile
- JADE canvases: Jade.open_canvas(), tag(), and button handlers wrapped in Jade.automate()
- the Jade.listing comment
- a range's format.fill.color, and getRangeByIndexes() in Office.js
:::

The new rule asks for honesty about uncertainty. Assistants won't always notice when they're guessing, so it's no substitute for a platform profile, but it helps, and it applies everywhere.

## Summary

Assistants know popular platforms well and small or new ones barely at all, and they sound equally confident about both, filling gaps with what's true of similar tools. "JavaScript for Excel" alone can mean Office.js, Office Scripts or even VBA, and each has markers you can learn to spot. A platform profile tells an assistant what a tool is and isn't, how code runs on it, how to show output and what the known pitfalls are. With one, the JADE panel request went from "that can't be done" to working code that followed the platform's conventions, though the assistant still blended two APIs, which became a new line in the profile. Writing, testing and growing platform profiles is a skill you can use with any tool. Next, you'll use JADE's canvas to build a real application inside Excel.
