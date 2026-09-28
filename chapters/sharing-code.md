---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Call functions in one JADE code module from another, with `jade_modules`.
2. Share code through a GitHub gist, and choose between loading it and importing it.
3. Load a JavaScript library, such as Chart.js, and pin its version.
4. Decide how far to trust code that comes from elsewhere, before it runs in your workbook.
5. Recognize when two rules in your profiles conflict.
:::
:::

## Code That Outlives One Workbook

The harvest app from [Building an Application in Excel](excel-app){.book-link} is a success, and now the sustainability office wants it in their own workbook. You could copy and paste the code. But you'll keep improving the app, and every improvement would mean pasting it again, into every copy, and hoping nobody's copy falls behind.

The usual answer in programming is to keep **one copy** of shared code somewhere everyone can reach, and have each place that uses it load it from there. This lesson covers that within a workbook, between workbooks, and from the wider internet, and the question that comes with it: whose code are you running?

## Calling Code in Another Module

Within one workbook, JADE already shares code between modules. Every function in a code module is registered in an object called **`jade_modules`**, under the module's name in lowercase, with spaces turned into underscores. So a module named Garden Tools is `jade_modules.garden_tools`, and its functions can be called from any other module:

```{.code environment="jade"}
// in a code module named Garden Tools
function kilogramsByBed(harvestRows) {
  const totals = {}
  // start at 1 to skip the header row; B is Bed ID, D is Kilograms
  for (let i = 1; i < harvestRows.length; i++) {
    const bedId = harvestRows[i][1]
    if (totals[bedId] === undefined) {
      totals[bedId] = 0
    }
    totals[bedId] += harvestRows[i][3]
  }
  return totals
}
```

```{.code environment="jade"}
// in any other code module
async function printBedTotals(excel) {
  const sheet = excel.workbook.worksheets.getItem("Harvests")
  const usedRange = sheet.getUsedRange()
  usedRange.load("values")
  await excel.sync()
  const totals = jade_modules.garden_tools.kilogramsByBed(usedRange.values)
  Jade.print(JSON.stringify(totals), "Kilograms by bed")
  Jade.open_output()
}
```

`kilogramsByBed` doesn't touch the workbook at all: it takes rows and returns an object, like the calculating functions in [Generating Documents](documents){.book-link}. Functions like that are the easiest to share, because they work anywhere.

## Sharing Between Workbooks

Here's the question for an assistant, in a new chat with your learner profile from [Building an Application in Excel](excel-app){.book-link} and your JADE platform profile:

::: {.ai-conversation prompt="(Paste the JADE platform profile first.) My harvest-entry app is in a JADE code module named Harvest App in one workbook. The university's sustainability office wants the same app in their own workbook, and I'll keep improving it. What's the best way to share the code so their workbook can get my updates?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="excel-app" transcript="sharing-code/share"}
> I'm not fully sure how JADE handles sharing a module between workbooks — I don't want to guess at steps that might not exist or might work differently.
>
> Here's what I *can* tell from what I know about JADE:
>
> - Code modules are saved inside each workbook, so by default a module in your workbook and a module in theirs are separate copies with no built-in link between them.
> - The instruction not to use the key `jade` or keys starting with `gist:` with `save_object_to_workbook` suggests JADE has some reserved, built-in feature involving GitHub Gists — possibly a way to load or sync a module from a Gist. But I don't know the actual mechanism (menu item, function, syntax), so I don't want to make up steps for it.
>
> Two things I'd suggest before writing any code:
>
> 1. **Check JADE's own help/documentation** — look for something like "Import module," "Share module," or "Sync from Gist" in the JADE task pane menus. If there's a built-in feature for this, it'll be more reliable than anything I could invent.
>
> 2. **If there's no built-in sharing feature**, the manual fallback is:
>    - Open the **Harvest App** module in your workbook
>    - Copy all its code
>    - Have the sustainability office create a module (e.g., also named **Harvest App**) in their workbook and paste the code in
>    - When you improve it, you'd repeat this — copy your updated code and have them paste over their old version
>
> That manual approach works but doesn't auto-update — they'd need to re-paste each time you change something, and you'd need to tell them when you've made an update.
>
> Could you check the JADE task pane for any menu related to sharing, importing, or Gists? If you find something, tell me exactly what it says and I can help you use it correctly instead of guessing at how it works.
:::

This is the honesty rule at its best. The assistant didn't know how JADE shares code, and said so. It even reasoned from a clue in your platform profile: keys starting with `gist:` are reserved, so JADE probably does something with GitHub gists. Then it told you where to look, and gave a fallback, copy and paste, that it knew would work.

JADE's documentation has a section called "Loading code from elsewhere," and it confirms the guess. Here are the lines it adds to the platform profile:

```{.code environment="none"}
- Functions in one code module can be called from another as jade_modules.moduleName.functionName(). The module name is the code module's name in lowercase, with spaces replaced by underscores: a module named Harvest App is jade_modules.harvest_app.
- await Jade.load_gist(gistId, moduleName) loads a GitHub gist: it runs the gist's .js files and registers their functions as jade_modules[moduleName], then runs the module's auto_exec if it has one. JADE caches the gist in the workbook and downloads it again only when it has changed on GitHub. GitHub allows 60 anonymous requests an hour.
- Jade.import_code_module(gistIdOrUrl) copies a gist's .js files into the workbook as editor modules (the Import a Code Module menu item does this). A module with the same name is overwritten.
- await Jade.load_js(url, null) downloads a JavaScript library from a web address, runs it at global scope and waits for it. Jade.add_library(url) adds it without waiting, so it can't be used on the next line.
```

A **gist** is a small collection of files on GitHub, often a single file of code, with its own web address. You create one at **gist.github.com**, with a free GitHub account: give the file a name ending in `.js`, paste your code, and click **Create secret gist** or **Create public gist**. The gist's ID is the long string of letters and numbers at the end of its address.

::: {.term}
> **Gist** — A small set of files stored on GitHub with its own web address, often used to share a single piece of code.
:::

With the new lines in the platform profile, the same question gets a different answer:

::: {.ai-conversation prompt="(Paste the updated JADE platform profile first.) My harvest-entry app is in a JADE code module named Harvest App in one workbook. The university's sustainability office wants the same app in their own workbook, and I'll keep improving it. What's the best way to share the code so their workbook can get my updates?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="excel-app" transcript="sharing-code/share-with-loaders"}
> Good news — JADE has a built-in way to do exactly this: **share the code as a GitHub gist, and have their workbook load it with `Jade.load_gist`.**
>
> Here's why this fits better than the alternative (`Jade.import_code_module`):
>
> - **`Jade.import_code_module`** copies the gist's code into their workbook once. If you improve the code later, they'd have to re-import it manually every time.
> - **`Jade.load_gist`** downloads the code from GitHub each time the workbook opens (only redownloading when it's actually changed), so your updates reach them automatically.
>
> ## How to set it up
>
> **1. Put your Harvest App code in a GitHub gist**
>
> Create a gist containing your module's `.js` file(s). You'll need the gist's ID (the long string of letters/numbers in its URL).
>
> A gist can be public or secret. A secret gist isn't listed publicly, but anyone who has the link can still open it — so don't put secrets like API keys in it.
>
> **2. In their workbook, add a small loader module**
>
> They'll need one small code module (you could name it something like *Harvest App Loader*) with an `auto_exec()` function:
>
> ```javascript
> async function autoExec() {
>     // downloads the gist and registers its functions as jade_modules.harvest_app
>     await Jade.load_gist("yourGistIdHere", "harvest_app")
> }
> ```
>
> This runs automatically when their workbook opens. It downloads your gist's code and makes its functions available as `jade_modules.harvest_app.functionName()`.
>
> **3. Have it open your app**
>
> If your Harvest App has a function that opens its canvas, call it after loading:
>
> ```javascript
> async function autoExec() {
>     // downloads and registers the harvest app module
>     await Jade.load_gist("yourGistIdHere", "harvest_app")
>
>     // runs the function that opens the app's canvas
>     Jade.automate(jade_modules.harvest_app.openHarvestApp)()
> }
> ```
>
> (Replace `openHarvestApp` with whatever your actual "start the app" function is called.)
>
> ## A few things to keep in mind
>
> - **Reminder:** since this involves fetching from GitHub, it's worth checking GitHub's terms of use for how gists and the API may be used — this is just automated fetching of a file you control, so it should be fine, but worth a glance.
> - GitHub allows 60 anonymous requests per hour — fine for normal use, but don't call `load_gist` in a tight loop.
> - Since the gist is code that will run inside their workbook, **avoid putting any workbook IDs, keys, or secrets in it** — anyone with the gist's link can read it.
> - Test this by trying it in a copy of their workbook (or a test workbook) first, to make sure the loader and `auto_exec` work as expected before rolling it out to them.
>
> Want help writing the loader module or checking your Harvest App's structure so it plays nicely with `load_gist`?
:::

**Read.** The comparison is exactly right: `import_code_module` copies the code into their workbook once, and `load_gist` downloads it from GitHub, using the cached copy unless it has changed, so your updates reach them. A small loader module in their workbook calls `load_gist` when the workbook opens, and then opens the app. The notes are good too, especially that a *secret* gist is only unlisted, not private: anyone with the link can read it.

Now look at the name of the loader function: `autoExec`. The explanation even says "an `auto_exec()` function," and then the code says `autoExec`. JADE only runs a function spelled exactly `auto_exec`, so this loader would never run, and nothing would tell you why.

Where did `autoExec` come from? From your platform profile, which says "Write in the style of my textbook: camelCase names." The assistant applied a style rule to a name the platform requires. It's the same kind of collision as in [How Web Pages Work](web-pages){.book-link}, where your rule against semicolons leaked into CSS. When two instructions meet, an assistant has to decide which wins, and it can choose wrong. The fix is to say which one wins, in the profile:

```{.code environment="none"}
- Write in the style of my textbook: camelCase names, except for names JADE requires, such as auto_exec.
```

There's one more thing to know. `load_gist` runs the loaded module's own `auto_exec`, if it has one. The Harvest App module you wrote in the last lesson *does* have one, which opens the form. So the loader's second step, opening the app, would open it a second time. The simplest loader just loads the gist and lets the app's own `auto_exec` do the rest:

```{.code environment="jade"}
// in a small module named Harvest App Loader, in the university's workbook
async function auto_exec() {
  // loads the app from the gist; the app's own auto_exec then opens the form
  await Jade.load_gist("yourGistIdHere", "harvest_app")
}
```

## Whose Code Is Running?

Sharing code this way is powerful, and it deserves a moment of care, because of what `load_gist` does: every time the university's workbook opens, it runs whatever is in your gist *today*, with full access to their workbook. That's what makes updates automatic. It also means:

- **The gist's owner controls the code.** If you change the gist, their workbook runs the change the next time it opens. If someone took over your GitHub account, they could put anything in it.
- **Anyone can read it,** public or secret. Never put passwords, keys or private data in a gist.

So match the method to the trust:

| Situation | Use | Why |
|---|---|---|
| Your own code, in your own workbooks | `load_gist` | Updates are automatic, and you trust the author. |
| Code from someone else | `import_code_module`, then read it | You get a copy that stays the same, and you can read it before running it. It won't change unless you import it again. |
| Code you haven't read | Neither, yet | Don't run code you can't explain. |

The university office is in a middle position: they're trusting you. A reasonable arrangement is to tell them what the code does, and to change the gist only when you've tested the change.

## Loading a Library

Some code is so widely useful that other people have already written it, packaged as a **library**. Drawing charts is a good example. Here's a request for a chart of the harvest by bed, in a new chat with your learner profile and the updated platform profile:

::: {.ai-conversation prompt="(Paste the updated JADE platform profile first.) In JADE, show a bar chart of the total kilograms harvested from each bed, in a panel in the task pane, using the Chart.js library. The Harvests sheet has headers in row 1, B Bed ID and D Kilograms." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="excel-app" transcript="sharing-code/chart"}
> Here's a function that reads the Harvests sheet, totals kilograms by bed, and draws a bar chart in a task pane panel using Chart.js.
>
> **Who sees this:** the canvas panel only shows up in your own JADE task pane, inside your own copy of Excel. No one else sees it, and no data leaves your workbook — Chart.js is just a drawing library downloaded from a public CDN (jsdelivr), it doesn't send your data anywhere.
>
> ```javascript
> async function showHarvestChart(excel) {
>   /*Jade.listing:{"name":"Harvest Chart","description":"Shows a bar chart of total kilograms harvested by bed"}*/
>
>   // Get the Harvests sheet from the workbook
>   const sheet = excel.workbook.worksheets.getItem("Harvests")
>
>   // Get all the cells that have data on that sheet
>   const usedRange = sheet.getUsedRange()
>
>   // Ask Excel to load the values of those cells
>   usedRange.load("values")
>
>   // Send the request and wait for the values to come back
>   await excel.sync()
>
>   // Store the values in a variable, an array of arrays
>   const data = usedRange.values
>
>   // This object will hold each bed's running total of kilograms
>   const totals = {}
>
>   // Loop through the rows, starting at 1 to skip the header row
>   for (let i = 1; i < data.length; i++) {
>
>     // Column B (index 1) has the bed ID
>     const bedId = data[i][1]
>
>     // Column D (index 3) has the kilograms, converted to a number
>     const kilograms = Number(data[i][3])
>
>     // If this bed hasn't been seen yet, start its total at 0
>     if (totals[bedId] === undefined) {
>       totals[bedId] = 0
>     }
>
>     // Add this row's kilograms to the bed's running total
>     totals[bedId] += kilograms
>   }
>
>   // Get the list of bed IDs to use as chart labels
>   const bedIds = Object.keys(totals)
>
>   // Build an array of totals in the same order as bedIds
>   const kilogramTotals = []
>   for (let i = 0; i < bedIds.length; i++) {
>     kilogramTotals.push(totals[bedIds[i]])
>   }
>
>   // Download the Chart.js library and wait for it to finish loading
>   await Jade.load_js("https://cdn.jsdelivr.net/npm/chart.js", null)
>
>   // Build the HTML for the panel: just one canvas element for the chart
>   const html = `<canvas id="harvestChart" width="400" height="300"></canvas>`
>
>   // Show that HTML in a task pane panel named "Harvest Chart"
>   Jade.open_canvas("Harvest Chart", html)
>
>   // Find the canvas element we just created
>   const canvasElement = tag("harvestChart")
>
>   // Get its 2D drawing context, which Chart.js needs to draw on
>   const context = canvasElement.getContext("2d")
>
>   // Create the bar chart, using the bed IDs as labels and totals as the data
>   const chart = new Chart(context, {
>     type: "bar",
>     data: {
>       labels: bedIds,
>       datasets: [{
>         label: "Total Kilograms Harvested",
>         data: kilogramTotals
>       }]
>     }
>   })
> }
> ```
>
> A few notes on choices I made:
>
> - I used `totals[bedId] === undefined` the same way you've checked for a missing object property before, to start each new bed at 0.
> - Since bed IDs are only used as chart labels (Chart.js draws them on the canvas, not through `innerHTML`), I didn't run them through `toHtmlEntities()` — that's only needed when text goes directly into HTML you're inserting.
> - `Jade.load_js` is awaited because the chart-drawing code that follows needs `Chart` to already exist.
>
> Try running `showHarvestChart` from the List Automations panel once you've added some rows to a "Harvests" sheet with Bed ID in column B and Kilograms in column D.
:::

**Read.** The first half is the counting-by-name pattern, followed by building two parallel arrays: bed IDs for the labels and totals for the bars. Then:

- **`await Jade.load_js(url, null)`** downloads Chart.js and waits until it's ready, so the next lines can use it. `null` means "run it at global scope," which is how Chart.js expects to be loaded: it creates a global named `Chart`.
- **`<canvas>`** is an HTML element for drawing, and `getContext("2d")` gets the tool Chart.js draws with.
- **`new Chart(context, { ... })`** creates the chart from an object that describes it: its `type`, its `labels` and a `datasets` array with the numbers. The shape of that object comes from Chart.js's documentation, and the assistant knows Chart.js well; it's one of the most popular libraries on the web.

The assistant's reasoning about escaping is correct: the labels are drawn on the canvas, not inserted as HTML, so `toHtmlEntities` isn't needed. Three things need fixing:

- **The library's address has no version.** `https://cdn.jsdelivr.net/npm/chart.js` means "the latest version, whatever that is today." When Chart.js releases a new major version, your chart could change or break, without your code changing at all. An address with the version in it, like `chart.js@4.5.1`, always gets the same file. That's called **pinning** the version, and your platform profile now asks for it.
- **The bars are in a strange order.** `Object.keys` gives the beds in the order they first appear in the Harvests sheet, B2, B4, B1 and so on, not B1 to B8. For a chart, order matters.
- **The panel name has a space,** `"Harvest Chart"`, the same slip as before.

::: {.term}
> **Library** — Code written by someone else for a common job, such as drawing charts, that you load and use in your own code.
:::

::: {.term}
> **Pinning a version** — Loading a specific version of a library, such as `chart.js@4.5.1`, so that updates to the library can't change your program without your knowing.
:::

Here's the chart with the three fixes. It uses the bed IDs in order, B1 to B8, so every bed gets a bar, even one with no harvests yet:

```{.code environment="jade"}
const CHART_JS_URL = "https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"
const BED_IDS = ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"]

async function showHarvestChart(excel) {
  /*Jade.listing:{"name":"Harvest chart","description":"A bar chart of kilograms harvested from each bed"}*/
  const sheet = excel.workbook.worksheets.getItem("Harvests")
  const usedRange = sheet.getUsedRange()
  usedRange.load("values")
  await excel.sync()
  const data = usedRange.values

  const totals = {}
  for (let i = 1; i < data.length; i++) {
    const bedId = data[i][1]
    if (totals[bedId] === undefined) {
      totals[bedId] = 0
    }
    totals[bedId] += data[i][3]
  }

  // one bar per bed, in order, rounded to one decimal place
  const kilograms = []
  for (let i = 0; i < BED_IDS.length; i++) {
    let total = totals[BED_IDS[i]]
    if (total === undefined) {
      total = 0
    }
    kilograms.push(Math.round(total * 10) / 10)
  }

  await Jade.load_js(CHART_JS_URL, null)
  Jade.open_canvas("harvestChart", '<h2>Kilograms harvested by bed</h2><canvas id="chartCanvas"></canvas>')
  const canvas = tag("chartCanvas")
  const chart = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: BED_IDS,
      datasets: [{ label: "Kilograms", data: kilograms }]
    }
  })
}
```

A library is code from elsewhere, like a gist, and the same questions apply. Chart.js is maintained by a large, long-running open-source project and served by a major content delivery network, and the pinned version always delivers the same file. That's about as trustworthy as outside code gets. Be much more careful with an obscure library from an address you don't recognize, even if an assistant suggests it.

## Your Learner Profile

::: {.ai-profile lesson="sharing-code"}
Add rules:

- Before code loads code or a library from the internet, tell me where it comes from, and use an address with the version in it.

Add to "What I know so far":

- jade_modules, for calling functions in another code module
- GitHub gists, and the difference between Jade.load_gist (loads the latest version each time) and Jade.import_code_module (copies it once)
- loading libraries with await Jade.load_js(url, null), and pinning their versions
- drawing a chart with Chart.js on a canvas element
- deciding whether to trust code from elsewhere before it runs
:::

Your JADE platform profile changed too: four new lines about loading code, a new line about pinning versions, and a change to the style line that says JADE's required names win over camelCase.

## Summary

Shared code lives in one place and is loaded wherever it's needed. Within a workbook, `jade_modules` lets one module call another's functions. Between workbooks, a GitHub gist can hold the code: `Jade.load_gist` runs the latest version every time, which suits your own code, and `Jade.import_code_module` copies it once, which suits code from others that you want to read first. Libraries like Chart.js load with `Jade.load_js`, and pinning the version keeps them from changing underneath you. Any code you load runs with full access to the workbook, so decide how much you trust its author before it runs. And when an assistant follows one of your rules into a place it doesn't belong, as camelCase did with `auto_exec`, add a line saying which rule wins. That completes the core of Part IV. The next lesson, on Office Scripts, is optional and needs a work or school Microsoft 365 account.
