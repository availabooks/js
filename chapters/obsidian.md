---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Describe how Obsidian stores notes, and how front matter turns notes into data.
2. Use the array methods `filter`, `map`, `sort`, `forEach`, `find`, `some`, `join` and `reduce`, and chain them.
3. Write arrow functions, including the short form.
4. Build a DataviewJS table from notes, and a Templater template that asks questions.
5. Explain why two scaffolding rules come off your learner profile, and decide whether to trust a community plugin.
:::
:::

## Notes as Data

**Obsidian** is a free note-taking app for Windows, Mac, Linux, iPhone and Android. What makes it unusual is how it stores notes: each note is an ordinary text file, written in **Markdown**, in a folder on your own computer called a **vault**. There's no account and no server; your notes are files you can open with any text editor.

A note can start with **front matter**, a few lines of named values between lines of three dashes. Obsidian calls them *properties*:

<pre class="code" data-environment="none">
---
bed: B1
crop: Tomato
variety: Cherokee Purple
planted: 2027-04-10
expected_harvest: 2027-06-29
---
Planted six seedlings along the north edge. Staked on April 24.
</pre>

With front matter, a folder of notes becomes a kind of database, where each note is a record and each property a field, with free-form writing underneath. That's a new shape of data after the rows of a sheet and the records of Airtable: **documents with metadata**. The club's volunteers like it for a garden journal, one note per planting, where they can write what happened as well as record the facts.

::: {.term}
> **Front matter** — Named values at the top of a Markdown note, between lines of `---`, such as `crop: Tomato`. Obsidian shows them as the note's properties, and plugins can query them.
:::

### Setting up the journal

1. Download Obsidian from **obsidian.md**, and create a new vault, *Garden Journal*.
2. Create a folder named **Plantings**, and in it a note for each planting in the club's Plantings sheet, from [College Community Garden: Case Setup](case){.book-link}, with front matter like the example above. Three or four notes are enough to follow the lesson.

## Plugins and Trust

Obsidian runs JavaScript through **community plugins**, written by people outside the company. This lesson uses two of the most popular:

- **Dataview**, which queries your notes' front matter. Its `dataviewjs` code blocks run JavaScript inside a note and show the result in place.
- **Templater**, which fills in new notes from templates, and can run JavaScript while doing it.

Before installing them, understand what you're agreeing to. A community plugin has the same access to your computer's files as Obsidian itself: it can read every note in your vault, and could read or change other files too, or send data over the internet. That's why Obsidian starts in **Restricted mode**, with community plugins turned off, and asks you to turn it off yourself.

To decide whether to trust a plugin, check:

- **How widely it's used and how long it's been around.** Dataview and Templater have each been downloaded millions of times over several years.
- **Whether it's maintained.** A plugin's page shows when it was last updated. At the time of writing, Dataview's author had shifted most new work to a successor project, and Dataview receives mainly fixes; check the current status when you install it.
- **Where its code is.** Popular plugins are open source, so their code can be read, and has been, by many people.

To install them: open **Settings**, then **Community plugins**, turn off Restricted mode, click **Browse**, and install and enable **Dataview** and **Templater**. In Dataview's settings, turn on **Enable JavaScript queries**, which is off by default, for the same reason Restricted mode exists.

::: {.caution}
> **The same rule as always.** A `dataviewjs` block or a Templater template runs JavaScript on your computer. Only use ones you can read and explain, especially ones copied from the internet.
:::

## Array Methods

Until now, your learner profile has asked for `for` loops with an index, so you could see every step. Code for Dataview, and most modern JavaScript, is written differently: with **array methods** that take a function and apply it to every item. You've read one already, `forEach`, in [Loops and Repetition](loops){.book-link}. Now it's time to learn the rest, and write them.

Here are some of the club's plantings as an array of objects, used in the examples below:

<pre class="code">
const plantings = [
  { bed: "B1", crop: "Tomato", expectedHarvest: "2027-06-29" },
  { bed: "B1", crop: "Basil", expectedHarvest: "2027-06-09" },
  { bed: "B2", crop: "Lettuce", expectedHarvest: "2027-05-14" },
  { bed: "B3", crop: "Bean", expectedHarvest: "2027-06-21" },
  { bed: "B5", crop: "Tomato", expectedHarvest: "2027-06-21" },
  { bed: "B8", crop: "Squash", expectedHarvest: "2027-08-09" }
]

// filter keeps the items for which the function returns true
const tomatoes = plantings.filter(function(planting) {
  return planting.crop === "Tomato"
})
console.log(tomatoes)
</pre>

**`filter`** calls the function once for each item, and returns a new array of the items for which it returned `true`. Here, the two tomato plantings. The original array isn't changed.

That function is worth writing more briefly. An arrow function, which you learned to read in [Excel's JavaScript API, with JADE](jade){.book-link}, has a short form: when the body is a single expression, you can leave out the braces and `return`, and with one parameter, the parentheses too. These three lines do exactly the same thing:

<pre class="code" data-environment="none">
plantings.filter(function(planting) { return planting.crop === "Tomato" })
plantings.filter((planting) => { return planting.crop === "Tomato" })
plantings.filter(planting => planting.crop === "Tomato")
</pre>

Read the last one as "keep each planting whose crop is Tomato." That's the form you'll see and write from now on.

The other methods work the same way. Run this, and compare each result with the data:

<pre class="code">
const plantings = [
  { bed: "B1", crop: "Tomato", expectedHarvest: "2027-06-29" },
  { bed: "B1", crop: "Basil", expectedHarvest: "2027-06-09" },
  { bed: "B2", crop: "Lettuce", expectedHarvest: "2027-05-14" },
  { bed: "B3", crop: "Bean", expectedHarvest: "2027-06-21" },
  { bed: "B5", crop: "Tomato", expectedHarvest: "2027-06-21" },
  { bed: "B8", crop: "Squash", expectedHarvest: "2027-08-09" }
]

// map makes a new array from what the function returns for each item
const crops = plantings.map(planting => planting.crop)
console.log(crops)

// join turns an array into one string, with a separator
console.log(crops.join(", "))

// find returns the first item for which the function returns true
console.log(plantings.find(planting => planting.bed === "B3"))

// some returns true if the function returns true for any item
console.log(plantings.some(planting => planting.crop === "Kale"))

// forEach just runs the function for each item
plantings.forEach(planting => console.log(`${planting.crop} in ${planting.bed}`))
</pre>

- **`map`** transforms each item and returns a new array of the results, the same length as the original.
- **`join`** combines an array into a string, which the assistant avoided in [Automating Pages You Use](automating-pages){.book-link} because you didn't know it yet.
- **`find`** returns the first matching item, or `undefined` if there's none. It replaces the "search with a loop and return -1" pattern from [Google Forms](google-forms){.book-link}.
- **`some`** answers "is there at least one?" Its partner, **`every`**, answers "are they all?"
- **`forEach`** runs the function for each item and returns nothing, so it's for *doing* something, like logging, rather than making a new array.

### Sorting

**`sort`** puts an array in order, using a function that compares two items, `a` and `b`. The function returns a negative number if `a` should come first, a positive number if `b` should, and 0 if it doesn't matter. For numbers, `a - b` does exactly that:

<pre class="code">
const kilograms = [3.9, 1.2, 2.5, 0.6]
kilograms.sort((a, b) => a - b)
console.log(kilograms)

const plantings = [
  { crop: "Tomato", expectedHarvest: "2027-06-29" },
  { crop: "Basil", expectedHarvest: "2027-06-09" },
  { crop: "Lettuce", expectedHarvest: "2027-05-14" }
]
// dates written as YYYY-MM-DD sort correctly as text
plantings.sort((a, b) => a.expectedHarvest.localeCompare(b.expectedHarvest))
console.log(plantings.map(planting => planting.crop))
</pre>

Two things to know about `sort`. It changes the array itself, unlike `filter` and `map`. And for strings, `localeCompare` does the comparing. Dates written year first, like "2027-05-14", sort correctly as text, which is one reason that format is so common.

### Chaining

Because `filter`, `map` and `sort` return arrays, you can call the next method directly on the result. This is **chaining**, which your profile has asked assistants to avoid since [Variables and Data](variables){.book-link}:

<pre class="code">
const plantings = [
  { bed: "B1", crop: "Tomato", expectedHarvest: "2027-06-29" },
  { bed: "B1", crop: "Basil", expectedHarvest: "2027-06-09" },
  { bed: "B2", crop: "Lettuce", expectedHarvest: "2027-05-14" },
  { bed: "B3", crop: "Bean", expectedHarvest: "2027-06-21" },
  { bed: "B5", crop: "Tomato", expectedHarvest: "2027-06-21" },
  { bed: "B8", crop: "Squash", expectedHarvest: "2027-08-09" }
]

// what's ready in June, soonest first?
const juneHarvests = plantings
  .filter(planting => planting.expectedHarvest.startsWith("2027-06"))
  .sort((a, b) => a.expectedHarvest.localeCompare(b.expectedHarvest))
  .map(planting => `${planting.expectedHarvest}: ${planting.crop} (${planting.bed})`)

console.log(juneHarvests.join("\n"))
</pre>

Read a chain from top to bottom, one step per line: keep the June plantings, sort them by date, turn each into a line of text. Written this way, with each step on its own line and starting with a dot, a chain reads like a list of instructions. (`startsWith` is a string method that does what its name says.)

Compare it with the same job as a `for` loop:

<pre class="code" data-environment="none">
const juneHarvests = []
for (let i = 0; i < plantings.length; i++) {
  if (plantings[i].expectedHarvest.startsWith("2027-06")) {
    juneHarvests.push(plantings[i])
  }
}
// ...and then a sort, and another loop to build the lines of text
</pre>

The loop shows every step, which is why you started with it. The chain says *what* to do rather than *how*, which is easier to read once you know the methods.

### reduce

One more, less common but good to recognize. **`reduce`** combines all the items into one value, carrying a running result from item to item:

<pre class="code">
const kilograms = [1.2, 2.4, 3.9, 2.5]
const total = kilograms.reduce((runningTotal, kg) => runningTotal + kg, 0)
console.log(total)
</pre>

The function gets the running result so far and the next item, and returns the new running result. The `0` after the function is where the running result starts. It's the running-total pattern from [Loops and Repetition](loops){.book-link} in one line. You saw it in the very first AI reply in [Working with an AI Assistant](ai-assistant){.book-link}, `Array.from(...).reduce(...)`, and you can read it now.

::: {.term}
> **Array method** — A method such as `filter`, `map`, `sort` or `reduce` that takes a function and applies it to the items of an array. Methods that return arrays can be chained.
:::

Finally, **`for...of`** is a loop that goes through an array's items without an index: `for (const planting of plantings) { ... }`. It's a good choice when you need a loop but not the index.

## Your Learner Profile: Two Rules Come Off

Now that you know the array methods, two scaffolding rules come off, and are replaced. The updated profile, including the Obsidian environment line, is at the end of this lesson. The replies below were captured with it.

- **"Use for loops with an index"** was there so you could follow every step of a loop. You can still write those loops, and read them. But much code, especially Dataview code, is written with array methods, and a profile that forbids them would make assistants work against the grain of the platform.
- **"Don't chain method calls together"** was there so each line did one thing you could check. A chain written one step per line, as above, keeps that benefit, and the new rule asks the assistant to explain each step.

This is the same moment as in [Functions](functions){.book-link}, when the one-function rule and the `let`-only rule came off: you've learned what the rules were protecting you from.

## A Dashboard of What's Ready

The club wants a note that always shows which plantings will be ready in the next two weeks. Here's the request, in a new chat with the updated profile:

::: {.ai-conversation prompt="In my Obsidian vault, the folder Plantings has one note per planting, with front matter fields bed, crop, variety, planted and expected_harvest (dates written like 2027-06-29). Write a DataviewJS block that shows a table of the plantings expected to be ready in the next 14 days, soonest first." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="obsidian" transcript="obsidian/ready-soon"}
> Here's a DataviewJS block for this. Put it in a code block with the language tag `dataviewjs`.
>
> Two new things you'll need for this, since they're not in your JavaScript list:
>
> - **`dv`** is an object Dataview gives you automatically inside a `dataviewjs` block. `dv.pages('"Plantings"')` gets every note in the Plantings folder, with its front matter fields available directly (like `p.bed`, `p.crop`).
> - **Dates**: when a front matter value looks like a date (`2027-06-29`), Dataview automatically turns it into a date object (not a plain string), so you can compare and subtract them directly with `<`, `>`, and `-`.
>
> ```dataviewjs
> // Get every note in the Plantings folder
> const plantings = dv.pages('"Plantings"')
>
> // Today's date, and 14 days from now
> const today = dv.date("today")
> const cutoff = today.plus({ days: 14 })
>
> // Keep only plantings whose harvest date is between today and 14 days from now
> const upcoming = plantings
>     .filter(p => p.expected_harvest >= today && p.expected_harvest <= cutoff)
>     .sort((a, b) => a.expected_harvest - b.expected_harvest)
>
> // Build the table
> dv.table(
>     ["Bed", "Crop", "Variety", "Expected Harvest"],
>     upcoming.map(p => [p.bed, p.crop, p.variety, p.expected_harvest])
> )
> ```
>
> What each part does:
>
> - `dv.pages('"Plantings"')` — collects all notes in the Plantings folder as an array of pages.
> - `dv.date("today")` — gives today's date as a date object, so it can be compared to `expected_harvest`.
> - `.plus({ days: 14 })` — a Dataview/Luxon method that adds days to a date (similar in spirit to `setDate`, but returns a new date instead of changing one in place).
> - `.filter(...)` — keeps only plantings whose harvest date falls in the next 14 days.
> - `.sort((a, b) => a.expected_harvest - b.expected_harvest)` — sorts soonest first, the same way you'd sort numbers, because subtracting two dates gives a number of milliseconds.
> - `.map(...)` — turns each remaining page into a row of values for the table.
> - `dv.table(headers, rows)` — draws the table in the note.
>
> This only reads your notes and displays them in the note itself — nothing is sent anywhere or written to any file.
:::

**Read.** Put the code in a note, inside a code block marked `dataviewjs`, and it runs whenever the note is shown:

- **`dv`** is Dataview's object, available in every `dataviewjs` block, as `SpreadsheetApp` was in Apps Script. `dv.pages('"Plantings"')` gets every note in the Plantings folder, with its front matter as properties. The folder name has double quotes *inside* the single-quoted string, because that's how Dataview writes a folder.
- **Dates.** Dataview turns front matter that looks like a date into a date object, from a library called Luxon, which is why `expected_harvest` can be compared with `>=` and `<=`. `dv.date("today")` is today, and `.plus({ days: 14 })` is two weeks from now.
- **The chain** filters to the next 14 days, sorts soonest first, and maps each note to a row for **`dv.table`**, which takes a list of column headings and a list of rows.

Each step is explained, as the new rule asks. One detail is worth checking against Dataview's documentation. `dv.pages` returns a Dataview array, not a plain JavaScript array, and its `sort` works differently: it takes a function that returns the value to sort *by*, such as `.sort(p => p.expected_harvest)`. The assistant used the comparing kind, `(a, b) => ...`, and it happens to come out in the right order anyway, for reasons that are an accident of how Dataview calls it. The documented form is safer. When a library has its own version of something familiar, its documentation is the authority.

<pre class="code" data-environment="none">
const today = dv.date("today")
const cutoff = today.plus({ days: 14 })

const readySoon = dv.pages('"Plantings"')
  .where(p => p.expected_harvest >= today && p.expected_harvest <= cutoff)
  .sort(p => p.expected_harvest)

dv.table(
  ["Planting", "Bed", "Expected harvest"],
  readySoon.map(p => [p.file.link, p.bed, p.expected_harvest])
)
</pre>

This version uses `where`, Dataview's name for `filter`, and `p.file.link`, a link to each planting's note, so a click opens it.

To try it with the club's data, the dates need to be near today, because the plantings are from 2027. Change `dv.date("today")` to `dv.date("2027-06-15")` to see what was ready in the second half of June 2027.

::: {.screenshot-needed file="images/obsidian-dataview-table.png"}
An Obsidian note showing a Dataview table of plantings with columns Planting, Bed and Expected harvest, with the dataviewjs code block visible in the editor beside it.
:::

## Without Code

Is code even needed for this?

::: {.ai-conversation prompt="Is there a way to get a table like this in Obsidian without installing a plugin or writing code?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="obsidian" transcript="obsidian/ready-soon"}
> Yes — as of recent versions of Obsidian, there's a built-in feature called **Bases** that can do this without installing anything or writing code. It's a core feature (built into the app, not a community plugin), and lets you build a table view of notes with filters and sorting based on front matter fields, similar to what the DataviewJS code did.
>
> I want to be upfront that I'm not fully certain of the exact menu steps in the current version, since Bases is fairly new and has been changing. Roughly, the idea is:
>
> 1. Create a new Base (from the command palette or file explorer).
> 2. Point it at your Plantings folder.
> 3. Add a filter condition on `expected_harvest` (something like "is on or after today" and "is before 14 days from now").
> 4. Set the sort order to `expected_harvest` ascending.
> 5. Choose which columns to show (bed, crop, variety, expected_harvest).
>
> If Bases doesn't support relative date filters like "today + 14 days" in your version, that would be a limitation — I'm not sure how far its date comparison options go, so it's worth checking directly in the Base's filter UI to see what options it offers before assuming it can do the whole 14-day window automatically.
>
> The plain **search** feature (without Bases) can filter by folder and by front matter value matches, but it doesn't sort by date the way a table does, so it's less suited to this task.
>
> Would you like me to help you set up a Base for this once you check what filter options it gives you, or would you rather stick with the DataviewJS version since it's more predictable?
:::

That's a good answer, including the honesty. **Bases** is a feature built into recent versions of Obsidian that shows notes as a table, filtered and sorted by their properties, with no plugin and no code. The assistant knew it existed, and said plainly that it wasn't sure of the details, because the feature was new and changing. Open Obsidian and look: create a base, point it at the Plantings folder, and see what filters it offers.

This is worth doing before writing code for any platform: check whether the platform can already do the job. A built-in feature needs no maintenance and can't be broken by a plugin update. Code is for what the built-in tools can't do, such as combining data in ways they don't support, or building the club's harvest totals from a Harvests folder, which you'll do in the exercises.

## Templates That Ask Questions

Creating a planting note means typing the same front matter every time. Templater can do it for you:

::: {.ai-conversation prompt="Write a Templater template for a new note in my Plantings folder. It should ask me for the bed, the crop and the variety, set planted to today's date, fill in the front matter fields bed, crop, variety, planted and expected_harvest (leave that one empty), and rename the note to the crop and bed, like Tomato B1." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="obsidian" transcript="obsidian/template"}
> Here's a Templater template for your Plantings folder. I'll explain each line, including some Templater-specific syntax (like `tp.system.prompt`) that isn't plain JavaScript — it's how Templater lets you ask questions and rename files, so I'll explain what it does.
>
> ```
> <%*
> const bed = await tp.system.prompt("Bed")
> const crop = await tp.system.prompt("Crop")
> const variety = await tp.system.prompt("Variety")
> const planted = tp.date.now("YYYY-MM-DD")
>
> await tp.file.rename(`${crop} ${bed}`)
> -%>
> ---
> bed: <% bed %>
> crop: <% crop %>
> variety: <% variety %>
> planted: <% planted %>
> expected_harvest:
> ---
> ```
>
> What each part does:
>
> - `<%* ... -%>` is a Templater block that runs code without printing anything. Everything between here runs first, before the note's content is written.
> - `const bed = await tp.system.prompt("Bed")` opens a small popup asking "Bed", waits for your answer (that's what `await` does), and stores it in `bed`. Since `bed` never changes after that, it's `const`.
> - The next two lines do the same for `crop` and `variety`.
> - `const planted = tp.date.now("YYYY-MM-DD")` gets today's date as text in that format, like `2024-06-01`.
> - `await tp.file.rename(...)` renames the new note. The template literal `` `${crop} ${bed}` `` joins the crop and bed with a space, like `Tomato B1`.
> - After the code block, `<% bed %>`, `<% crop %>`, etc. are inline tags that print the values you collected into the front matter.
> - `expected_harvest:` is left with nothing after it, so that field stays empty.
>
> A few notes:
>
> - This renames the file in your own Obsidian vault, not Google Drive or anything shared, so there's no dry-run concern here — but it's worth running it once on a test note to make sure the rename and front matter look right before you rely on it.
> - `tp.system.prompt`, `tp.date.now`, and `tp.file.rename` are all part of Templater's own toolkit, not standard JavaScript — Templater provides the `tp` object so scripts like this can interact with Obsidian (popups, dates, file operations).
>
> Want me to also show how to set this as the default template for new notes created in the Plantings folder?
:::

**Read.** A Templater template is ordinary text with tags in it. `<%* ... %>` runs JavaScript without writing anything, and `<% ... %>` writes a value into the note. The `-` in `-%>` removes the line break after the tag, so the front matter starts on the note's first line, where it has to be.

The code uses Templater's `tp` object: **`tp.system.prompt`** asks a question in a pop-up and waits for the answer, **`tp.date.now`** gives today's date in the format you give it, and **`tp.file.rename`** renames the note.

Save it in a folder for templates, and in Templater's settings, tell it where that folder is. Then run **Templater: Create new note from template** from the command palette (**Ctrl+P**, or **Cmd+P** on a Mac).

Test the edges, as always. If you press Escape instead of answering, `tp.system.prompt` gives back `null`, and the note would be named "null B1". And if a note named "Tomato B1" already exists, from last season, the rename will fail. A careful version would check for both, and adding the planting year to the name, like "Tomato B1 2027", avoids the second problem entirely.

## A Vault Is a Folder

Remember that your whole vault is a folder of text files. That makes it unusually open to other tools. In the next part of the book, you'll run JavaScript on your own computer with Node.js, which can read, write and reorganize files, including a vault of notes. Anything you can't do inside Obsidian, you can do to its files from outside.

## Your Learner Profile

::: {.ai-profile lesson="obsidian"}
Environment: I'm writing JavaScript in Obsidian, the note-taking app, using the Dataview plugin's DataviewJS code blocks and the Templater plugin.

Remove rules:

- Write each step on its own line, and store each result in a variable. Don't chain method calls together.
- Use for loops with an index, such as for (let i = 0; i < data.length; i++). Don't use forEach or for...of.

Add rules:

- Use array methods such as filter, map, sort and forEach, and chain them when that's clearer, but explain what each step of a chain does.
- Write short functions as arrow functions when they're passed to array methods.

Add to "What I know so far":

- array methods: filter, map, sort, forEach, find, some, every, join and reduce, and chaining them
- writing arrow functions, including the short form x => x * 2
- for...of loops
- Obsidian vaults, Markdown notes and front matter
- DataviewJS: dv.pages(), where, sort by a key, dv.table(), dv.date() and Luxon dates
- Templater: tp.system.prompt(), tp.date.now() and tp.file.rename()
- deciding whether to trust a community plugin
:::

Two rules were removed and two added in their place, as explained above. The rest of the profile, including everything you've learned on other platforms, comes along.

## Summary

Obsidian stores notes as Markdown files in a folder, and front matter turns each note into a record with fields. Community plugins such as Dataview and Templater run JavaScript with full access to your files, so check how widely used and well maintained a plugin is before trusting it. Array methods take a function and apply it to every item: `filter` keeps some, `map` transforms each, `sort` orders them, `find` and `some` search, `join` makes a string and `reduce` combines, and methods that return arrays can be chained, one step per line. With them learned, the `for`-loop and no-chaining rules come off your profile. DataviewJS builds live tables from notes with `dv.pages` and `dv.table`, though its arrays have their own `sort`, and Templater fills in new notes with answers to its questions. Before writing code, check whether the platform can already do the job, as Obsidian's Bases can. That's the end of Part V. Next, you'll run JavaScript on your own computer.
