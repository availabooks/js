---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Run JavaScript on any page from the developer tools' Console and Snippets.
2. Select many elements with `querySelectorAll` and loop over them.
3. Turn a script into a bookmarklet, and explain what changes when code must fit on one line.
4. Write a userscript that runs automatically on a site, with Tampermonkey.
5. Decide when automating a site is appropriate, and recognize the danger of pasting code you don't understand into the Console.
:::
:::

## JavaScript on Pages You Don't Own

Everything so far has run on pages you wrote. But the browser will run your JavaScript on *any* page you're viewing, including sites you use every day. That opens up a useful kind of personal automation: pulling data out of a page, filling in a form you fill in every week, or hiding parts of a site you find distracting. The changes happen only in your browser, only for you.

There are three ways to do it, from quickest to most automatic:

- **The Console and Snippets** in the developer tools: run code by hand, on the page in front of you.
- **Bookmarklets:** a bookmark that runs code when you click it, on whatever page you're on.
- **Userscripts:** code that runs by itself every time you open a particular site, using a browser extension called Tampermonkey.

### Before you automate a site

Running code on a page you're viewing is legal and normal; it's what the developer tools are for. But what you *do* with it matters:

::: {.cks}
- **Read the site's terms of use.** Some sites forbid automated access, or copying their data. Filling in your own form faster is almost always fine; collecting other people's data from a site usually isn't.
- **Only act as yourself.** Automate what you could do by hand, in your own account, at a human pace. Code that sends hundreds of requests, or gets around a login or a limit, can break rules or laws, and can harm the site.
- **Be careful with personal data.** A table you copy out of a site may include information about other people, and it needs the same care as the club's form responses.
:::

::: {.caution}
> **Never paste code you don't understand into the Console.** Scammers send messages like "paste this into your browser to get free credits" or "to verify your account." Code in the Console runs as *you*, on that page, with your login, so it can read your messages, change your settings or send data anywhere. Some sites print a warning in the Console for exactly this reason. The rule from the start of the book, don't run code you can't explain, matters more here than anywhere.
:::

## Selecting Many Elements

`document.querySelector` returns the *first* element that matches a selector. **`document.querySelectorAll`** returns *all* of them, as a list you can loop over with an index, like an array:

```{.code environment="html"}
<table id="harvests">
  <tr><th>Date</th><th>Bed</th><th>Crop</th><th>Kilograms</th></tr>
  <tr><td>2027-04-18</td><td>B2</td><td>Radish</td><td>1.2</td></tr>
  <tr><td>2027-05-13</td><td>B4</td><td>Spinach</td><td>2.4</td></tr>
  <tr><td>2027-05-15</td><td>B2</td><td>Lettuce</td><td>3.9</td></tr>
</table>
<p id="total"></p>

<script>
  const rows = document.querySelectorAll("#harvests tr")
  let totalKg = 0
  // start at 1 to skip the header row
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td")
    const kilograms = Number(cells[3].textContent)
    totalKg += kilograms
  }
  const total = document.querySelector("#total")
  total.textContent = `${rows.length - 1} harvests, ${totalKg.toFixed(1)} kg in all`
</script>
```

::: {.hbw}
The selector `"#harvests tr"`, with a space, means "every `tr` *inside* the element with id harvests." And `rows[i].querySelectorAll("td")` searches inside one row only: `querySelectorAll` can be called on any element, not just `document`. Reading a page's table is the same as reading a sheet's rows, with `textContent` in place of `getValues`, and every value arriving as text.
:::

::: {.term}
> **querySelectorAll** — A method that returns every element matching a CSS selector, as a list with a `length` that you can loop over by index.
:::

## Trying Code in the Console

The quickest way to run code on a page is the developer tools' **Console**, which you met in [How Web Pages Work](web-pages){.book-link}. Open it on any page (F12), type a line such as `document.querySelectorAll("a").length`, and press Enter: it tells you how many links the page has. The Console runs your code *on that page*, so `document` is that page.

::: {.n0t}
For code longer than a line or two, use **Snippets**, saved scripts you can run on any page: in Chrome or Edge, open the **Sources** panel, choose **Snippets** (you may need to click `>>` to find it), click **New snippet**, write or paste your code, and press **Ctrl+Enter** (**Cmd+Enter** on a Mac) to run it. Snippets are saved in your browser, so they're a good place to keep small tools while you're trying them out.
:::

::: {.screenshot-needed file="images/automating-snippets.png"}
Chrome's developer tools with the Sources panel open, the Snippets tab selected, and a short snippet in the editor.
:::

## A Bookmarklet That Exports a Table

Many sites show data in tables with no way to download it. A bookmarklet that turns the first table on any page into a CSV file, which opens in Google Sheets or Excel, would be handy for the club, for example for a table of plant spacings on a gardening site. Here's the request, in a new chat with your learner profile from [Asynchronous JavaScript](async){.book-link}:

::: {.ai-conversation prompt="I've now learned document.querySelectorAll, which returns a list of elements I can loop over with a for loop and .length. I want a bookmarklet I can click on any web page that finds the first table on the page and downloads it as a CSV file." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="async" transcript="automating-pages/table-csv"}
> This task needs a few browser features you haven't learned yet, since downloading a file isn't something we've covered. Here's what's new:
>
> - **Blob** – an object that holds file-like data in memory (in our case, the CSV text)
> - **URL.createObjectURL()** – turns that Blob into a temporary web address the browser can download from
> - **click()** – a method that triggers a click on an element in code, instead of waiting for a real click
> - **`(function() { ... })()`** – wraps code in a function and runs it immediately; bookmarklets need this so the code has its own private variables and doesn't cause errors if you click it more than once
>
> I'll explain each as it comes up. Everything else uses what you already know.
>
> Also, one small change from what you've learned: instead of building an array with `push` and needing `join()` (which you haven't learned yet), I'll build the CSV text with a string and `+=`, the same way you've built running totals.
>
> ```javascript
> (function() {
>   // Find the first table on the page
>   const table = document.querySelector("table")
>
>   // Stop early if there's no table
>   if (table === null) {
>     alert("No table found on this page")
>     return
>   }
>
>   // Get all the rows inside that table (not the whole page)
>   const rows = table.querySelectorAll("tr")
>
>   // This will hold the finished CSV text
>   let csvText = ""
>
>   // Loop over each row
>   for (let i = 0; i < rows.length; i++) {
>
>     // Get all cells in this row (both header cells and data cells)
>     const cells = rows[i].querySelectorAll("td, th")
>
>     // This will hold one line of CSV text
>     let csvRow = ""
>
>     // Loop over each cell in the row
>     for (let j = 0; j < cells.length; j++) {
>       const cellText = cells[j].textContent
>
>       // Add a comma before every cell except the first
>       if (j > 0) {
>         csvRow = csvRow + ","
>       }
>
>       // Wrap the cell text in quotes and add it to the row
>       csvRow = csvRow + '"' + cellText + '"'
>     }
>
>     // Add this row, followed by a line break, to the full CSV text
>     csvText = csvText + csvRow + "\n"
>   }
>
>   // Package the CSV text as a file-like object
>   const blob = new Blob([csvText], { type: "text/csv" })
>
>   // Get a temporary web address pointing to that file
>   const url = URL.createObjectURL(blob)
>
>   // Create a hidden link that points to the file, then click it
>   const link = document.createElement("a")
>   link.href = url
>   link.download = "table.csv"
>   document.body.appendChild(link)
>   link.click()
> })()
> ```
>
> **How to make this a bookmarklet:**
> 1. Create a new bookmark in your browser (any page will do).
> 2. In the URL field, delete everything and paste `javascript:` followed by the code above, all on one line (no line breaks).
> 3. Save it. Click it on any page with a table to download that table as `table.csv`.
>
> **Who sees this and what data it uses:** This runs only in your own browser when you click it. It reads whatever table is on the page you're viewing and saves a CSV file to your own computer. Nothing is sent anywhere else.
>
> One limitation: if a cell's text contains a quote mark, the CSV won't escape it properly. Fixing that needs a string method (`replace()`) you haven't learned yet — let me know if you'd like me to explain it and add that later.
:::

**Read.** The assistant listed four new things first, which is exactly what your profile asks.

- **The loops** are the ones you just saw: every `tr` in the table, then every `td` or `th` in each row. The selector `"td, th"`, with a comma, means "either kind of cell." Each cell's text is wrapped in quotes and separated by commas, and each row ends with `\n`.
- [**A CSV file** (comma-separated values) is plain text: one line per row, with commas between the values. The quotes around each value let a value contain a comma, like "Bed 3, south." The assistant pointed out the one case it doesn't handle, a value that contains a quote mark, which would need to be written as two quote marks.]{.nzs}
- [**The download** takes three steps. A **`Blob`** holds the CSV text as file-like data. **`URL.createObjectURL`** gives it a temporary address. A link to that address with a **`download`** attribute makes the browser save the file instead of opening it, and **`click()`** clicks the link from code.]{.tbv}
- **`(function() { ... })()`** is a function with no name, written in parentheses and called immediately with the `()` at the end. It keeps the bookmarklet's variables inside the function, so they don't clash with the page's own variables. It also lets the code use `return` to stop early when there's no table.

::: {.term}
> **Bookmarklet** — A bookmark whose address is JavaScript code, starting with `javascript:`. Clicking it runs the code on the page you're viewing.
:::

Here's the CSV-building part on a page, with the download replaced by showing the text, so you can see exactly what the file would contain:

```{.code environment="html"}
<table>
  <tr><th>Crop</th><th>Spacing (inches)</th></tr>
  <tr><td>Lettuce</td><td>12</td></tr>
  <tr><td>Pepper</td><td>18</td></tr>
  <tr><td>Tomato</td><td>24</td></tr>
</table>
<pre id="csv"></pre>

<script>
  const table = document.querySelector("table")
  const rows = table.querySelectorAll("tr")
  let csvText = ""
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td, th")
    let csvRow = ""
    for (let j = 0; j < cells.length; j++) {
      const cellText = cells[j].textContent
      if (j > 0) {
        csvRow = csvRow + ","
      }
      csvRow = csvRow + '"' + cellText + '"'
    }
    csvText = csvText + csvRow + "\n"
  }
  document.querySelector("#csv").textContent = csvText
</script>
```

### When the bookmarklet does nothing

Following the assistant's instructions exactly, you'd join the lines into one, put `javascript:` in front, and save it as a bookmark. Clicking it does nothing:

::: {.ai-conversation prompt="I put javascript: in front of the code, joined all the lines into one line, and saved it as a bookmark. When I click it on a page with a table, nothing happens at all, and there's nothing in the Console. What could be wrong?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="async" transcript="automating-pages/table-csv"}
> A few likely culprits — let's check them in order.
>
> **1. Your browser may have stripped `javascript:` when you pasted it**
>
> This is the most common cause of "nothing happens, nothing in Console." Chrome (and some other browsers) automatically remove `javascript:` from anything you paste into the address bar, as a security measure against malicious bookmarklets. If that happened, your bookmark's address doesn't start with `javascript:` anymore, so clicking it just tries to visit a broken web address — no code runs at all, and there's no error to show.
>
> **How to check:** Open your bookmark manager, find the bookmark, and look at its URL. If it doesn't start with `javascript:`, that's the problem.
>
> **How to fix it:** Paste the code into the URL field first, then click at the very start of the field and type `javascript:` yourself (rather than pasting it as part of the whole string). Typing it yourself avoids the strip.
>
> **2. Missing separators between statements**
>
> You joined all the lines into one line without semicolons. Normally, line breaks tell JavaScript where one statement ends and the next begins. Without line breaks *and* without semicolons, some statements can run together and cause a syntax error — for example:
>
> ```javascript
> const url = URL.createObjectURL(blob)const link = document.createElement("a")
> ```
>
> This is one case where we need an exception to the "no semicolons" style, because we're forced onto a single line. Here's the code again with semicolons added only where lines got joined together, so each statement is still separated correctly:
>
> ```javascript
> javascript:(function() { const table = document.querySelector("table"); if (table === null) { alert("No table found on this page"); return } const rows = table.querySelectorAll("tr"); let csvText = ""; for (let i = 0; i < rows.length; i++) { const cells = rows[i].querySelectorAll("td, th"); let csvRow = ""; for (let j = 0; j < cells.length; j++) { const cellText = cells[j].textContent; if (j > 0) { csvRow = csvRow + "," } csvRow = csvRow + '"' + cellText + '"' } csvText = csvText + csvRow + "\n" } const blob = new Blob([csvText], { type: "text/csv" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "table.csv"; document.body.appendChild(link); link.click() })()
> ```
>
> **Steps to try:**
> 1. Delete the old bookmark and make a new one.
> 2. Paste just the code part (without `javascript:`) into the URL field.
> 3. Click at the very beginning of the field and type `javascript:` yourself.
> 4. Save, then test on a page with a table.
>
> If it still doesn't work, open DevTools (F12) **before** clicking the bookmarklet, so you're sure to catch any error message, and let me know exactly what it says.
:::

Both suggestions are worth knowing. Some browsers do remove `javascript:` from pasted text in certain places, as a defense against the scams described above. And joining lines without semicolons really does break code: the line breaks were doing the job of separating statements, and once they're gone, something else has to. That's the one place this book adds semicolons back.

But the explanation misses the biggest problem. The original code is full of comments, and a `//` comment runs *to the end of the line*. Joined into one line, the first `// Find the first table on the page` turns *everything after it* into a comment, so almost none of the code is left. Look at the assistant's one-line version: it quietly removed every comment. Its fix works, but partly for a reason it didn't mention. When you compare a fix with the original, look for changes the explanation doesn't account for.

::: {.wrl}
So, for code that has to fit on one line: remove `//` comments (or use the `/* ... */` kind, which ends where it says), and separate statements with semicolons. The assistant's one-line version does both.
:::

## Userscripts

A bookmarklet runs when you click it. A **userscript** runs by itself, every time you open a page it's meant for. Userscripts need a browser extension; the most popular is **Tampermonkey**, which is free for Chrome, Edge, Firefox and Safari. Install it from your browser's extension store. (Recent versions of Chrome also require turning on **Allow User Scripts** for Tampermonkey in the extension's details page; Tampermonkey's own site explains the current steps.)

::: {.term}
> **Userscript** — JavaScript that a browser extension, such as Tampermonkey, runs automatically on the sites it's set to match.
:::

Every week, someone signs the club up for shifts on the university's volunteer portal, typing the same three things into the same form. Here's a request for a userscript that fills it in, in a new chat with your learner profile. (The portal's address and field names are made up for this example.)

::: {.ai-conversation prompt="Every week I sign the garden club up for volunteer shifts on our university's volunteer portal, at https://volunteer.example.edu/signup. The form has text boxes with the ids orgName, contactEmail and hours. Write a Tampermonkey userscript that fills them in with College Community Garden, maya.thompson@example.com and 2 whenever I open that page, but doesn't submit the form." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="async" transcript="automating-pages/userscript"}
> Here's a Tampermonkey userscript that fills in the three fields but leaves the Submit button alone.
>
> **Who can see this:** Only you. This script runs in your own browser only, on your own copies of Tampermonkey. It doesn't send your data anywhere except into the form fields on the page you're already looking at.
>
> ```javascript
> // ==UserScript==
> // @name         Garden Club Auto-Fill
> // @match        https://volunteer.example.edu/signup
> // @run-at       document-idle
> // ==/UserScript==
>
> const orgNameBox = document.querySelector("#orgName")
> const contactEmailBox = document.querySelector("#contactEmail")
> const hoursBox = document.querySelector("#hours")
>
> orgNameBox.value = "College Community Garden"
> contactEmailBox.value = "maya.thompson@example.com"
> hoursBox.value = "2"
> ```
>
> **What each part does:**
>
> - The block between `// ==UserScript==` and `// ==/UserScript==` isn't JavaScript — it's special metadata Tampermonkey reads to know the script's name, and which page to run it on (`@match`) and when to run it (`@run-at document-idle` means "wait until the page has finished loading").
> - `document.querySelector("#orgName")` finds the element whose id is `orgName` — the `#` means "look for an id," same idea as the CSS id selector you've learned.
> - Each box is stored in its own variable, just like you'd store a range in a variable in Apps Script.
> - Setting `.value` puts text into a form input. This is the reverse of what you've done before — you've read `.value` from a box the user typed into, but here we're writing to it instead.
>
> **How to install it:**
> 1. Open the Tampermonkey extension menu and choose "Create a new script."
> 2. Delete the sample code it gives you and paste this in.
> 3. Save it (Ctrl+S or File > Save).
> 4. Visit the signup page — the fields should fill in automatically.
>
> Since the form is never submitted, you'll still need to click Submit yourself once you check the fields look right.
:::

::: {.om0}
**Read.** The code is short, because the hard part is done by Tampermonkey. The comment block at the top is its **metadata**: `@name` is what Tampermonkey shows in its list, `@match` is the address the script runs on, and `@run-at document-idle` waits until the page has loaded. The code finds the three boxes and sets their `value`, the reverse of reading it in [Events and Interactivity](events){.book-link}.
:::

Two things to know before relying on it:

- **`@match` decides where your code runs.** A pattern like `https://volunteer.example.edu/*`, with a `*`, would run it on *every* page of the site. Keep it as narrow as the job needs, because a userscript runs with the same access to the page as the site's own code.
- [**Some sites don't notice values set by code.** Many modern sites keep their own record of what's been typed, updated by `input` events. Setting `value` changes the box, but not that record, so the site may treat the box as empty when you submit. If that happens, the fix is to send an `input` event after setting the value; your assistant can show you how, and it's a good question to ask if the form seems to ignore your script.]{.plz}

The assistant noted who can see the script, as your profile asks, but said nothing about the site's rules. A script that fills in your own form is almost certainly fine. Still, it's your job to check, and it's worth a new profile rule.

## Your Learner Profile

::: {.learner-profile}
:::

## Summary

The browser will run your JavaScript on any page you're viewing, which makes it a tool for personal automation: in the Console and Snippets by hand, as a bookmarklet when you click it, or as a userscript that runs by itself on the pages its `@match` pattern names. `querySelectorAll` returns every matching element, and reading a web page's table is much like reading a sheet. A bookmarklet's code has to fit on one line, so `//` comments must go and statements need semicolons. Automate only what you could do by hand, in your own account, and check the site's terms. Above all, never paste code you can't explain into the Console, because it runs as you. Next, you'll package this kind of code as a browser extension of your own.
