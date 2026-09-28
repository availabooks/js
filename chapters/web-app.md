---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Read and write a simple HTML page with headings, paragraphs and a table.
2. Build a web app in Apps Script with `doGet` and `HtmlService`.
3. Deploy a web app, choose who can open it, and update it after changing the code.
4. Explain why text from a spreadsheet can change a page when it's inserted into HTML.
:::
:::

## A Page for the Whole Club

Maya's harvest numbers live in the spreadsheet, and only people who have the spreadsheet can see them. The club wants a simple web page, a link anyone in the club can open on their phone, showing how much each bed has produced. Apps Script can create exactly that: a **web app**, a web page produced by your script each time someone opens its link.

Web pages are written in **HTML**, so this lesson starts with a first look at it. The next part of the book is all about the web, and HTML gets its full treatment there. Here, you need just enough to read and build a page with a table.

## A First Look at HTML

HTML describes what's on a page: this is a heading, this is a paragraph, this is a table. It does that with **tags**, words in angle brackets. Most tags come in pairs, an opening tag like `<h1>` and a closing tag with a slash, like `</h1>`, around the content they describe:

```{.code environment="html"}
<h1>Garden Harvest</h1>
<p>Totals for the 2027 season.</p>
<p>Thank you to <strong>everyone</strong> who helped!</p>
```

Run it, and the page appears below the code. `<h1>` is the main heading, `<p>` is a paragraph, and `<strong>` makes text bold. Tags can go inside other tags, like `<strong>` inside `<p>`, as long as the inner one closes first. There are smaller headings too, `<h2>` through `<h6>`.

::: {.term}
> **HTML** — HyperText Markup Language, the language that describes the content of web pages, using tags such as `<h1>` for a heading and `<p>` for a paragraph.
:::

::: {.term}
> **Tag** — A word in angle brackets that marks part of an HTML page. Most come in pairs: an opening tag, `<p>`, and a closing tag, `</p>`.
:::

A table takes four tags. `<table>` wraps the whole thing, `<tr>` is a row, `<th>` is a header cell and `<td>` is an ordinary cell:

```{.code environment="html"}
<table>
  <tr><th>Bed</th><th>Kilograms</th></tr>
  <tr><td>Bed 1</td><td>9.5</td></tr>
  <tr><td>Bed 2</td><td>10.0</td></tr>
</table>
```

Try adding a row for Bed 3, which produced 14.4 kilograms. The table has no lines around its cells, because how a page *looks* is decided by a second language, CSS, which you'll meet in the next part. For now, plain is fine.

## Asking for the Web App

Here's the request, in a new chat with your learner profile from [Talking to Web Services](web-services){.book-link} and the garden context:

::: {.ai-conversation prompt="(Paste the garden context first.) Make a simple web page with Apps Script that shows a table of the total kilograms harvested from each bed, using the bed names. Club members should be able to open it with a link." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="web-services" transcript="web-app/dashboard"}
> This task needs a few things that aren't in your list yet:
>
> - **`doGet(e)`** — a special function name that Apps Script automatically runs when someone visits your project's web app link. It's not called by you; Apps Script calls it.
> - **`HtmlService`** — a service for building an HTML page to send back as the response.
> - **Deploying as a web app** — a step in the Apps Script editor (not code) where you publish your project and get a shareable link.
>
> None of these are in your "what I know so far" list, so I don't want to just use them without explaining.
>
> Here's how I'd suggest we handle it — pick one:
>
> 1. **I teach you the three things above** (each is fairly small), then we write the web page together.
> 2. **We build the same report inside the spreadsheet instead** — a function that calculates total kilograms per bed and writes the results to a new sheet (or a range on an existing sheet). Anyone with access to the spreadsheet could see it, using only what you already know.
>
> Which would you like to do?
:::

The profile held the assistant back, and it offered a sensible alternative that uses only what you know. The web page is what the club wants, though, so choose the first option:

::: {.ai-conversation prompt="Option 1, please. Teach me the three things and write the page. I'm new to HTML too, so keep the HTML simple and explain it." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="web-services" transcript="web-app/dashboard"}
> Let's go step by step.
>
> ## 1. `doGet(e)` — the function Apps Script runs for a web page
>
> When you deploy an Apps Script project as a web app, Apps Script automatically calls a function named exactly `doGet` whenever someone visits the link. You never call it yourself — it's a "trigger" function, similar to `onOpen` or `onEdit`.
>
> It takes one parameter, `e`, which holds information about the request (like the web address someone typed, including anything after a `?`). We won't need anything from `e` for this task, but the parameter still has to be there because Apps Script always passes it in.
>
> Whatever `doGet` returns becomes the web page. If it returns plain text, the page shows plain text. If it returns something built with `HtmlService`, the page shows HTML.
>
> ## 2. `HtmlService` — turning a string into a web page
>
> HTML is a language for describing the structure of a web page using **tags**. Tags usually come in pairs: an opening tag and a closing tag with a `/`, like `<table>...</table>`.
>
> The tags we need for a table:
> - `<table>...</table>` — the whole table
> - `<tr>...</tr>` — a table row
> - `<th>...</th>` — a header cell (bold, at the top)
> - `<td>...</td>` — a regular data cell
>
> So a tiny table with one row looks like:
> ```
> <table><tr><th>Bed</th><th>Kilograms</th></tr><tr><td>Bed 1</td><td>4.5</td></tr></table>
> ```
>
> Since you already know template literals and loops, we can build this HTML as a plain string, then hand the string to `HtmlService.createHtmlOutput()`, which packages it as a web page:
>
> ```javascript
> const page = HtmlService.createHtmlOutput(html)
> ```
>
> ## 3. Deploying as a web app
>
> This is a step you do in the Apps Script editor, not code:
>
> 1. Click **Deploy** (top right) → **New deployment**
> 2. Click the gear icon and choose **Web app**
> 3. Set **Execute as**: "Me"
> 4. Set **Who has access**: choose "Anyone with the link" (or your organization's option, if your club uses Google Workspace) so club members can open it
> 5. Click **Deploy**, then copy the URL it gives you — that's the link you share
>
> **To test without deploying to everyone:** click **Deploy** → **Test deployments**, and use the test URL it gives you. Only you can see that one, so it's safe to try first.
>
> ---
>
> ## The code
>
> ```javascript
> // Adds up kilograms harvested per Bed ID, using the Harvests sheet
> function calculateHarvestTotals() {
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Harvests")
>   const data = sheet.getDataRange().getValues()
>   const totalsByBed = {}
>
>   for (let i = 1; i < data.length; i++) {
>     const bedId = data[i][1]
>     const kilograms = data[i][3]
>
>     if (totalsByBed[bedId] === undefined) {
>       totalsByBed[bedId] = 0
>     }
>     totalsByBed[bedId] += kilograms
>   }
>
>   return totalsByBed
> }
>
> // Builds an object mapping Bed ID to Bed Name, from the Beds sheet
> function getBedNames() {
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Beds")
>   const data = sheet.getDataRange().getValues()
>   const bedNames = {}
>
>   for (let i = 1; i < data.length; i++) {
>     const bedId = data[i][0]
>     const bedName = data[i][1]
>     bedNames[bedId] = bedName
>   }
>
>   return bedNames
> }
>
> // Combines the two, so every bed appears even if it has 0 kg harvested
> function buildHarvestReport() {
>   const totalsByBed = calculateHarvestTotals()
>   const bedNames = getBedNames()
>   const report = []
>   const bedIds = Object.keys(bedNames)
>
>   for (let i = 0; i < bedIds.length; i++) {
>     const bedId = bedIds[i]
>     const bedName = bedNames[bedId]
>     let totalKg = totalsByBed[bedId]
>
>     if (totalKg === undefined) {
>       totalKg = 0
>     }
>
>     const roundedKg = totalKg.toFixed(2)
>     report.push({ bedName: bedName, totalKg: roundedKg })
>   }
>
>   return report
> }
>
> // Turns the report array into an HTML table, as one string
> function buildHtmlTable(report) {
>   let html = "<table border='1'><tr><th>Bed</th><th>Total Kilograms</th></tr>"
>
>   for (let i = 0; i < report.length; i++) {
>     const row = report[i]
>     html += `<tr><td>${row.bedName}</td><td>${row.totalKg}</td></tr>`
>   }
>
>   html += "</table>"
>   return html
> }
>
> // This is the function Apps Script calls when someone opens the web app link
> function doGet(e) {
>   const report = buildHarvestReport()
>   const tableHtml = buildHtmlTable(report)
>   const page = HtmlService.createHtmlOutput(tableHtml)
>   return page
> }
> ```
>
> ### What each function does, in plain terms
>
> - **`calculateHarvestTotals`** reads the Harvests sheet and adds up kilograms for each Bed ID, using an object as a running-total counter — the same pattern as "counting by name" you already know.
> - **`getBedNames`** reads the Beds sheet and builds a lookup object so we can turn a Bed ID like `"B1"` into a name like `"Tomato Patch"`.
> - **`buildHarvestReport`** goes through every bed (not just ones with harvests) and pairs each bed's name with its total, defaulting to `0` if nothing was harvested there.
> - **`buildHtmlTable`** loops over that report and builds one long HTML string, adding a table row for each bed.
> - **`doGet`** puts it all together and returns the finished page.
>
> ### How to test before deploying
>
> Since `calculateHarvestTotals`, `getBedNames`, and `buildHarvestReport` don't need any special permissions to just calculate values, you can test them the normal way: select `buildHarvestReport` in the function dropdown, run it, and check the Execution log — but you'd need a temporary `Logger.log(buildHarvestReport())` line inside a function to actually see the output, since it currently just returns a value without logging it. Want me to add a small test function for that, or are you ready to deploy and try the real page?
:::

**Read.** Start at the bottom, with `doGet`, because that's where Apps Script starts.

- **`doGet`** is a special name, like `onOpen`. When someone opens the web app's link, Apps Script runs `doGet`, and whatever it returns is the page. Here it gets the report, turns it into an HTML table, and passes that HTML to **`HtmlService.createHtmlOutput`**, which packages it as a web page.
- **`calculateHarvestTotals`** and **`getBedNames`** each read one sheet into an object: kilograms by bed ID, and names by bed ID. The second is a new use of an object, as a *lookup table*: give it an ID, get back a name.
- **`buildHarvestReport`** goes through every bed, not just the ones with harvests, and pairs its name with its total, or 0 if it has none. That's a thoughtful detail: a bed with nothing harvested yet still appears in the table.
- **`buildHtmlTable`** builds the table as one long string, starting with the header row and adding a `<tr>` for each bed, with a template literal filling in the cells.

A few things to check:

- **The claim about `e`, again.** The assistant says the parameter "still has to be there because Apps Script always passes it in." As you saw in [Menus and Triggers](triggers){.book-link}, Apps Script passes it either way, and a function doesn't have to list it. It's a harmless myth, but notice that the same assistant repeats it.
- **The bed name in the explanation.** It says `getBedNames` turns "B1" into "Tomato Patch." The club's Bed 1 is called "Bed 1." The assistant invented an example, as it did with Ava Chen in [Objects and JSON](objects){.book-link}. The code reads the real names from the sheet, so the page is right; only the explanation made something up.
- **The deployment steps.** Check them against your screen. At the time of writing, the choices under **Who has access** are *Only myself*, *Anyone with a Google account* and *Anyone*. There isn't one called "Anyone with the link," though *Anyone* works that way: anyone who has the link can open it.

The assistant's offer at the end, of a test function for `buildHarvestReport`, is worth taking, for the reason you know by now: that function does the calculating, and it can be tested without deploying anything.

### Try the page here

`buildHtmlTable` only turns an array of objects into a string, so it can run on this page. The test below gives it a report for three beds, and logs the HTML it builds:

```{.code}
function testBuildHtmlTable() {
  const report = [
    { bedName: "Bed 1", totalKg: "9.50" },
    { bedName: "Bed 2", totalKg: "10.00" },
    { bedName: "Bed 3", totalKg: "14.40" }
  ]
  const html = buildHtmlTable(report)
  console.log(html)
}

// Turns the report array into an HTML table, as one string
function buildHtmlTable(report) {
  let html = "<table border='1'><tr><th>Bed</th><th>Total Kilograms</th></tr>"

  for (let i = 0; i < report.length; i++) {
    const row = report[i]
    html += `<tr><td>${row.bedName}</td><td>${row.totalKg}</td></tr>`
  }

  html += "</table>"
  return html
}
```

Copy the logged HTML into the HTML editor earlier in this lesson, in place of the table there, and run it to see the page the club would see. The `border='1'` in the table's opening tag is an *attribute*, extra information inside a tag. It's an old way of drawing lines around cells; CSS is the modern way.

## Deploying and Updating

Deploying gives the web app its link. The steps the assistant listed are the right ones: **Deploy**, then **New deployment**, choose **Web app**, set **Execute as** and **Who has access**, and click **Deploy**.

::: {.screenshot-needed file="images/web-app-new-deployment.png"}
The Apps Script "New deployment" dialog with type Web app, "Execute as: Me" and the "Who has access" menu open.
:::

The two settings deserve thought:

- **Execute as: Me** means the script runs with *your* permissions, whoever opens the page. That's what lets a club member who can't open the spreadsheet see the totals. It also means the page can show anything your account can read, so it should only show what you mean to share.
- **Who has access** decides who can open the link. *Anyone* means anyone at all, including people outside the club who come across the link. For harvest totals, that's fine. For the Members sheet, with names and email addresses, it wouldn't be.

After deploying, a surprise is common. Here it is:

::: {.ai-conversation prompt="I deployed it and it works. Then I changed the heading in the code and saved, but when I open the link, the page hasn't changed. Why?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="web-services" transcript="web-app/dashboard"}
> That happens because a deployed web app is a **snapshot** of your code at the moment you deployed it — saving new changes to the script doesn't automatically update the live link.
>
> To make the link show your latest code, you need to update the deployment:
>
> 1. Click **Deploy** → **Manage deployments**
> 2. Find your existing deployment and click the pencil (edit) icon
> 3. Where it says **Version**, change the dropdown from a specific numbered version to **New version**
> 4. Click **Deploy**
>
> The same link will now serve your updated code — you don't get a new URL, this just points the existing one at your latest version.
>
> **For testing while you're still making changes**, use the **Test deployments** link instead (Deploy → Test deployments). That one always runs your most recently saved code, without needing a new version each time — which is handy while you're experimenting with the HTML.
:::

That's right, and it's a useful safety feature once you know about it. The link runs the version you deployed, so you can keep editing without breaking the page members are using. When you're ready, **Manage deployments** and a **New version** update the live page, at the same address. While you're working, the **Test deployments** link runs your latest saved code, and only you can open it.

## A Word About Text in HTML

The table's cells are filled with text from the spreadsheet, dropped straight into the HTML. That works because the bed names are ordinary words. But whatever is in the cell becomes part of the page, and the browser reads it as HTML. If someone renamed a bed `<h1>Bed 9</h1>`, the page would show a giant heading in the table. A cell containing a `<script>` tag could even run code in the browser of everyone who opens the page.

That's not a worry for a club's harvest table, where only trusted members edit the sheet. But it becomes important any time a page shows text that other people typed, such as form responses. The fix is to replace the characters that HTML treats as special, like `<` and `>`, with codes that display them as ordinary characters. You'll learn how in the next part of the book. For now, remember the rule: **text inserted into HTML is read as HTML.**

## The Finished Page

This version adds a heading and a line of explanation, and rounds to one decimal place. The calculating functions are the ones from the reply.

```{.code environment="appsscriptsheets"}
function doGet() {
  const report = buildHarvestReport()
  const table = buildHtmlTable(report)
  const html = `<h1>Garden Harvest</h1><p>Total kilograms harvested from each bed this season.</p>${table}`
  const page = HtmlService.createHtmlOutput(html)
  page.setTitle("Garden Harvest")
  return page
}
```

`setTitle` sets the text on the browser tab. Once it's deployed, the club has a link that always shows the current totals, calculated fresh from the spreadsheet every time someone opens it.

## Your Learner Profile

::: {.ai-profile lesson="web-app"}
Add rules:

- When code creates a web page that other people can open, tell me who will be able to see it and what data it shows.

Add to "What I know so far":

- basic HTML: tags such as h1, p, strong, table, tr, th and td, and attributes
- web apps in Apps Script: doGet and HtmlService.createHtmlOutput()
- deploying a web app, choosing who can open it, test deployments, and making a new version after changing the code
- using an object as a lookup table, such as bed names by bed ID
- text inserted into HTML is read as HTML
:::

The new rule asks the assistant to be explicit about the most important decision in a web app: who can see it.

## Summary

HTML describes a web page with tags, most of which come in pairs around their content: `<h1>` for a heading, `<p>` for a paragraph, and `<table>`, `<tr>`, `<th>` and `<td>` for a table. An Apps Script web app is a `doGet` function that returns a page built with `HtmlService`, often from an HTML string made with template literals and loops. Deploying gives it a link; *Execute as* decides whose permissions it uses, and *Who has access* decides who can open it, which matters most when the page shows personal data. A deployment is a snapshot, so update it with a new version after changing the code, and use the test deployment while you work. Text inserted into HTML is read as HTML. That's the end of Part II. Next, you'll leave Apps Script for the browser itself, and learn how web pages really work.
