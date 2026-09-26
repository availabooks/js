# Rework Outline: Learning JavaScript with an AI Assistant

Working outline for reworking *Personal Productivity with Javascript* so that readers learn to program by working with their own AI assistant from the very first lesson. Nothing in `chapters/` has been changed yet.

---

## Scope: one language, many platforms

JavaScript runs almost everywhere a person might want to automate something: web pages, Google Workspace, Microsoft Office, their own computer (through Node.js), and servers. The book's goal is **breadth, not expertise**. Readers learn the core concepts once, then get enough hands-on experience on each platform to get started, and learn how to use their AI to go deeper on whichever platforms they choose.

Four ideas hold the book together:

1. **Every platform is free to use** (see the platform table below for the one exception).
2. **The learner profile travels with the reader.** When they move to a new platform, the "environment" line in the profile changes, and everything they know comes along. Each new part begins by updating the profile, which shows in practice that the method works anywhere.
3. **Each platform is also the natural place to learn a new concept.** Apps Script runs code synchronously, which makes it ideal for beginners, so asynchronous code waits until the browser part, where `fetch` makes it unavoidable. Office.js in JADE reuses that async knowledge along with Part III's HTML and CSS. Modules and packages arrive with Node.
4. **The garden case runs through every part.** Each platform solves a real club problem, so switching platforms never feels arbitrary.

### Table of contents (draft)

Part I is outlined lesson by lesson in §5. The later parts are listed here at title level with their case tie-ins, and will be detailed later.

**Part I — Foundations, in Google Sheets**

| # | Lesson | New concepts |
|---|---|---|
| 1 | Welcome to Programming | — |
| 2 | Working with an AI Assistant | the workflow, the learner profile |
| 3 | Your First Lines of Code | statements, `console.log`, errors |
| 4 | Getting Started with Apps Script | a first look at functions |
| 5 | Variables and Data | `let`, types |
| 6 | Making Decisions | `if`, operators |
| 7 | Arrays | arrays, describing your data |
| 8 | Loops | `while`, `for` |
| 9 | Functions | parameters, `return`, `const` |
| 10 | College Community Garden: Case Setup | — |
| 11 | Google Forms | — |

**Part II — Automating Google Workspace**

| # | Lesson | New concepts | Case tie-in |
|---|---|---|---|
| 12 | Objects and JSON | objects, properties, JSON | member records as objects instead of rows |
| 13 | Menus and Triggers | `onOpen`, `onFormSubmit`, time-driven triggers | welcome each new sign-up automatically |
| 14 | Email, Calendar, and Dates | `MailApp`, `CalendarApp`, the `Date` object | volunteer shift reminders; workday calendar events |
| 15 | Generating Documents | `DocumentApp`, templates, saving PDFs to Drive | volunteer-hours certificates; weekly newsletter |
| 16 | Custom Functions in Sheets | writing your own `=FORMULA()` | `=HOURSFOR(name)` |
| 17 | Talking to Web Services | `UrlFetchApp`, APIs, `try`/`catch` | watering reminders from a free weather API (e.g. Open-Meteo, which needs no key) |
| 18 | A Web App with Apps Script | `doGet`, `HtmlService`, a first look at HTML | a harvest dashboard page (bridge to Part III) |

**Part III — JavaScript in the Browser**

| # | Lesson | New concepts | Case tie-in |
|---|---|---|---|
| 19 | How Web Pages Work | HTML, CSS, the DOM | the club's website |
| 20 | Events and Interactivity | events, form input, validation | a plant-spacing calculator |
| 21 | Asynchronous JavaScript | promises, `async`/`await`, `fetch` (and why Apps Script never needed them) | live garden data on the site |
| 22 | Automating Pages You Use | DevTools snippets, bookmarklets, userscripts (Tampermonkey) | export a web table to CSV; fill a repetitive form (with a note on site terms of use) |
| 23 | Building a Browser Extension | Manifest V3, loading an unpacked extension | a one-click "log my volunteer hours" tool |
| 24 | Publishing a Site for Free | GitHub Pages or Cloudflare Pages | the club site goes live |

**Part IV — JavaScript in Microsoft Office**

| # | Lesson | New concepts | Case tie-in |
|---|---|---|---|
| 25 | Excel's JavaScript API, with JADE | installing JADE; `Excel.run`, `load`, `await excel.sync()` (reusing Part III's async concepts); reading and writing ranges | the university's sustainability office works in Excel and wants a harvest report |
| 26 | Teaching Your AI About a New Platform | writing a platform profile; spotting the wrong API flavor (VBA, Office Scripts' `ExcelScript`, Google Apps Script) and missing `load`/`sync` calls | the harvest report, done right |
| 27 | Building an Application in Excel | `Jade.open_canvas` with HTML/CSS interfaces, buttons and forms; `Jade.listing` automations; `auto_exec`; code saved in the workbook | a harvest-entry app volunteers use inside the workbook |
| 28 | Sharing and Reusing Code | importing modules from gists and URLs, `Jade.add_library`, reading imported code before running it | share the harvest app with the university |
| 29 | Automating Word with JADE *(on hold until the Word version is published)* | the Word JavaScript API: paragraphs, tables, content controls | generate the club's monthly newsletter from harvest and volunteer data |
| 30 | Automating PowerPoint with JADE *(on hold until the PowerPoint version is published)* | the PowerPoint JavaScript API: slides, shapes, text | build the end-of-season report deck for the university from workbook data |
| 31 | Office Scripts and TypeScript *(optional: requires a Microsoft 365 work or school license)* | types, reading TypeScript, how `ExcelScript` differs from Office.js, Power Automate; where VBA fits | the same report as an Office Script, compared side by side |

If both are published, Part IV becomes "JavaScript Across Microsoft Office": one API style and one development environment (JADE) for three apps. That parallels Part II's tour of Google Workspace (Sheets, Gmail, Calendar, Docs), and readers could compare the two ecosystems directly, for example the newsletter built with `DocumentApp` in Lesson 15 and again in Word. The optional Office Scripts lesson comes last in the part.

**Why JADE anchors Part IV:**
- **It's free.** It's in the Office Add-ins store, which avoids the Office Scripts license problem.
- **It uses the real Office.js API**, the same one professional Office add-ins use, so the skills carry over.
- **It removes the usual add-in setup.** There's no hosting, manifest or sideloading, because the code lives in the workbook.
- **It builds on Part III.** Its canvas interfaces use HTML, CSS and the DOM, which readers learned in the browser.

**Lesson 26 is new, and it matters.** Most assistants know Office.js well, but they know little or nothing about JADE's conventions (the `excel` parameter, `Jade.listing`, `Jade.open_canvas`). Worse, they mix up Office.js with Office Scripts, VBA and even Apps Script. Readers learn to write a *platform profile* that describes a tool the AI doesn't know. It's the same skill as describing a sheet in Lesson 7, applied to a whole platform, and they'll need it any time they work with a niche or new tool.

**Where the JADE reference is used** (`JADE-functions.md`, Part 1):

| Lesson | Sections of the reference |
|---|---|
| 25 | "How your code is loaded" (runnable function shapes, `async function name(excel)` with `await excel.sync()`); `Jade.print` and `Jade.open_output` |
| 26 | All of Part 1, condensed into the platform profile |
| 27 | `Jade.open_canvas` and `tag()`, `Jade.automate` for button handlers, `alert`, `Jade.listing`, `Jade.open_automations`, `auto_exec`, themes (`set_theme`, `list_themes`, `set_css`), `save_object_to_workbook`/`read_object_from_workbook` |
| 28 | `jade_modules` (calling one module from another), `Jade.load_gist`, `Jade.use`, `Jade.load_js`, `Jade.add_library`, `Jade.import_code_module` |

Leave the Blogger functions (`getBloggerPost`, `incorporateBloggerModule`) and "Writing examples" out of the book.

**What the Lesson 26 platform profile must tell the AI.** Each of these is a likely AI mistake, and a candidate exchange to capture:
- **Output goes through `Jade.print`, not `console.log`.** `console.log` goes to the task pane's browser console, which readers can't easily open. Assistants will use `console.log` by default. Also call `Jade.open_output()` to show the Output panel, since `print` doesn't switch to it.
- **Workbook code uses `async function name(excel)` and `await excel.sync()`.** Values have to be `load`ed and synced before they are read. Assistants familiar with Office Scripts or VBA will get this wrong.
- **Buttons in a canvas need `Jade.automate(...)`**, because a click handler needs a function reference that runs inside `Excel.run`.
- **`alert` is JADE's non-blocking message box.** Code after it keeps running. Assistants may also reach for `prompt()` or `confirm()`, which don't work in the task pane (verify), so a canvas form is the replacement.
- **`Jade.print` and `open_canvas` insert HTML,** so text from cells that contains `<` is rendered as markup. Escape it with `.toHtmlEntities()`. This is a small, real security lesson.
- **Listing an automation takes a `/*Jade.listing:{...}*/` comment inside the function, with valid JSON.**
- **Don't use the storage keys `jade` or `gist:...`**, which are reserved for JADE.

**Part V — Scripting Your Productivity Apps**

| # | Lesson | New concepts | Case tie-in |
|---|---|---|---|
| 32 | Scripting Airtable | records and fields as objects, `await` with `selectRecordsAsync`, the Scripting extension; a spreadsheet-database hybrid | move the volunteer roster into an Airtable base with linked tables for members, shifts and beds |
| 33 | Scripting Your Notes in Obsidian | DataviewJS queries over note metadata; Templater scripts; array methods and chained calls (`where`, `sort`, `map`) | a garden journal with one note per planting and a "ready to harvest" dashboard; meeting notes generated from a template |

**Why this part exists:** readers have used JavaScript in platforms built *for* programming (Apps Script, the browser, JADE). Here it lives inside everyday apps, which is where much personal-productivity scripting happens. Both apps come after the async lesson (21), because their APIs use `await`.

- **Airtable** is free for students. Airtable offers a workspace for students with a `.edu` email address for up to two years (verify the current terms). The Scripting extension is on the free plan as well. "Run script" inside Automations may require a paid plan (verify). It introduces relational data (linked records) without SQL, which links to the SQL book.
- **Obsidian** is free, runs offline, and stores notes as plain Markdown files. Its data is *documents with metadata*, a new shape after rows (Sheets) and records (Airtable).
  - **Rules removed.** DataviewJS code is naturally written as chained array methods, so this lesson removes the profile's "`for` loops only" and "no chained calls" rules (§4).
  - **Things to cover:** Restricted mode and plugin trust (community plugins have full file access); the maintenance status of Dataview and Templater (check at writing time); and Obsidian's built-in Bases feature as a no-code alternative, which is also a good example of an AI's out-of-date knowledge.
  - **A connection to Part VI:** a vault is just a folder of text files, so the Node file lessons can process the same notes.
  - **Possible later lesson:** building a real Obsidian plugin in TypeScript, after Part VI.

**Part VI — Node.js on Your Own Computer**

| # | Lesson | New concepts | Case tie-in |
|---|---|---|---|
| 34 | Installing Node and Running Scripts | the terminal, VS Code, running `node` | profile environment → "Node.js on my computer" |
| 35 | Modules and Packages | `import`/`export`, npm, `package.json` | — |
| 36 | Working with Files and Folders | `fs`, `path` | sort a folder of garden photos by date |
| 37 | Working with Data Files | CSV, JSON, and Excel files (via an npm package) | merge harvest logs exported from several sheets (typical Python work, done in JS) |
| 38 | Analyzing and Charting Data | reactive notebooks (they recompute like a spreadsheet); Arquero for table manipulation (like pandas); Observable Plot for charts; SQL on your data with DuckDB (link to the SQL book); choosing the right chart | a season of harvest data: yield by bed, by crop, and against volunteer hours; the charts feed the university deck in Lesson 30 |

**Lesson 38 notes:** build the lesson around the topic, not a platform. Plot and Arquero are stable open-source libraries. Choose the environment at writing time: an Observable notebook (no setup; check the free plan and whether free notebooks are public) or a Deno Jupyter notebook (free and local, run in Jupyter or VS Code). Assistants mix up the old "Observable JavaScript" dialect with standard JavaScript, so the platform profile should say which one is in use. Plan step: say what question the chart should answer before asking for one.
| 39 | Building Command-Line Tools | arguments, prompting for input, running on a schedule | a `garden-report` command |
| 40 | Automating the Web with Playwright | browser automation, screenshots, scraping | check seed supplier prices |
| 41 | Calling AI Models from Your Code | API keys, keeping secrets out of code, an LLM API | draft newsletter text from the week's harvest data |
| 42 | Automation Workflows with n8n | running n8n locally (`npx n8n`); triggers and nodes; the Code node (items as arrays of `{ json }` objects); expressions; an AI node; when to wire boxes vs. write a script | a Monday-morning workflow: Airtable shifts + weather forecast → a Code node decides which beds need watering → a post to the club's Discord channel |

**Lesson 42 notes:** use services that need only a token or URL (Airtable, Discord or Telegram webhooks, public APIs), and avoid Google OAuth, whose credential setup is a stumbling block when n8n runs locally. Point out that n8n runs only while the computer is on. Expect AI replies with pre-1.0 syntax and missing `{ json }` wrapping, and use them as another stale-knowledge exercise. Add a short sidebar comparing Zapier and Make. The n8n license allows free personal and internal use.

**Part VII — Servers and Full-Stack Apps**

| # | Lesson | New concepts | Case tie-in |
|---|---|---|---|
| 43 | How the Web Works | HTTP, requests and responses, status codes, REST | — |
| 44 | A Server with Node and Express | routes, serving pages, a JSON API (run locally) | a volunteer sign-up API |
| 45 | Storing Data | SQLite from Node; link to the SQL book | the member database |
| 46 | Serverless with Cloudflare Workers | deploying a free API; D1 or KV storage | move the sign-up API online |
| 47 | A Full-Stack App | Part III front end + Worker API + database | a garden-plot reservation app |
| 48 | A Chat Bot for the Club | Discord slash commands on Cloudflare Workers; the platform calling *your* code; verifying request signatures; protecting bot tokens | `/nextshift` reads the reader's own API (Lesson 47); `/harvest 3kg tomatoes` logs to Airtable |

**Lesson 48 notes:** teach Discord, following its official Cloudflare Workers tutorial, with a sidebar on Telegram (easiest setup, via @BotFather) and Slack (Bolt, Socket Mode). Skip always-on bots that read every message. Developer-portal screens change often, so this is another screen-vs-AI check. Earlier lessons use **incoming webhooks** (posting only, one HTTP request) as small examples: Lesson 17 (Apps Script `UrlFetchApp`) and Lesson 42 (n8n).

**Part VIII — Going Further on Your Own**

| # | Lesson | Content |
|---|---|---|
| 49 | Other Places JavaScript Runs | A tour with a starter prompt for each (see "Other areas" below) |
| 50 | Writing Your Own Learning Profile | Capstone: pick a platform or skill and design your own AI-guided learning path |

### Where core concepts land

Concepts are introduced on the platform where they're first needed.

| Concept | Lesson | Why there |
|---|---|---|
| Objects and JSON | 12 | APIs and triggers pass objects around; needed everywhere after Part II |
| Dates | 14 | Calendar and scheduling can't avoid them |
| Error handling (`try`/`catch`) | 17 | web requests fail |
| HTML | 18 → 19 | a gentle start in Apps Script, then full treatment |
| Async (`async`/`await`) | 21 | `fetch` requires it; Apps Script is synchronous |
| Writing a platform profile | 26 | the first platform the AI doesn't already know |
| TypeScript | 31 (optional) | Office Scripts is TypeScript. Readers who skip Lesson 31 could get TypeScript in Part VI instead, since recent Node versions can run `.ts` files directly (verify). |
| Modules and npm | 35 | Node is where they matter |
| Secrets and API keys | 41 | first time a key is involved |
| HTTP | 43 | needed to build servers |

### Platforms and cost

| Platform | What readers need | Cost |
|---|---|---|
| Google Apps Script | a Google account | free |
| Browser, bookmarklets, userscripts, extensions | Chrome or Edge (Tampermonkey is free) | free (publishing to the Chrome Web Store has a one-time $5 fee, but it isn't needed) |
| Static site hosting | GitHub or Cloudflare account | free |
| JADE (Lessons 25–28) | Excel, including Excel on the web with a free Microsoft account; JADE from the Office Add-ins store | free (confirm that store add-ins work in Excel on the web with a free consumer account) |
| Office Scripts (Lesson 31, optional) | **a Microsoft 365 work or school license** | ⚠ not available with free or personal Microsoft accounts (verify the current requirements). Many students have access through their school. |
| Node.js, VS Code, Playwright | a computer they can install software on | free |
| Cloudflare Workers | Cloudflare account (free tier) | free |
| LLM API (Lesson 41) | an API key | the free tiers vary by provider and change often; Gemini has offered one. Make this lesson optional or provider-neutral. |

### Other areas worth considering

Candidates for Lesson 49's tour, or for full lessons if one earns it. Each one is JavaScript, free, and aimed at personal productivity:

- **Scriptable** (iPhone/iPad): JavaScript automation on a phone, including widgets, Shortcuts integration, and reading the calendar and reminders. *Decided: tour only, not a lesson.* It's iOS-only and Android has no free JavaScript equivalent. A good tour example is a widget that reads the reader's own API from Lesson 46.
- **Zapier and Make:** *n8n is now Lesson 42.* Mention these as "the same idea, elsewhere." Check whether their free plans include code steps.
- **Figma plugins:** JavaScript/TypeScript that automates design work. *Decided: tour only.* Starter project: generate a name badge for every volunteer from the Airtable roster. Point out the need to load fonts before editing text (`figma.loadFontAsync`) as a platform-profile note. Mention **Penpot** (free, open source, has JavaScript plugins) as an alternative.
- **macOS JavaScript for Automation (JXA):** scripting Mac apps. Niche, Mac only.
- **Deno and Bun:** alternative runtimes to Node, worth a mention.

### Course tracks using `config.json` versions

The book already supports multiple `versions`, each with its own chapter list. At 50 lessons the full book is more than one course can cover, but versions could define tracks, for example:

- **Core** — Part I plus one part of the instructor's choice
- **Workspace** — Parts I–II
- **Web** — Parts I, III, VII
- **Office** — Parts I, III (Lessons 19–21 only, for HTML and async), IV
- **Productivity apps** — Parts I, II (Lesson 12 for objects), III (Lesson 21 for async), V
- **Complete** — everything

---

## 1. The premise

Readers will have an AI assistant write most of their code. The book teaches them to **direct** that assistant and to **understand and check** what it gives back. Learning the concepts is still the core of the book, because you can't check code you can't read.

A theme for Lesson 1 that runs through the whole book:

> A computer never fills in the gaps in your instructions — it does exactly what you wrote. An AI assistant *always* fills in the gaps — it guesses what you meant. Programming with AI means managing both: giving the AI enough to guess well, and reading its code carefully enough to catch the guesses that are wrong.

### The central problem, and our answer

**Problem:** an AI will happily answer a beginner's question with code full of features the beginner hasn't learned yet, such as `const`, arrow functions, `forEach`, destructuring, semicolons and chained calls. Code the reader can't read is code they can't check.

**Answer: the learner profile.** This is a short block of context the reader gives their assistant at the start of a conversation. It says what they're working in, which concepts they know so far, and how they want code written. It grows with every lesson. The book generates it automatically from the lessons the reader has completed (see §4). It plays the same role as the schema that SQL Lesson 5 pastes into the chat, where giving the AI context up front makes its answers fit.

### A second goal: learning how to learn with an AI

The profile isn't hidden. The book shows it, explains each part of it, and shows how it changes from lesson to lesson (§4). So readers learn JavaScript, and they also learn a method they can reuse for any new skill: tell the AI what you're working in, what you already know, and how you want to be taught; start with tight limits; loosen them as you learn. By the end, readers should be able to write a learning profile of their own for a new subject.

---

## 2. The workflow (taught in Lesson 2, used in every example)

The SQL book uses Plan → Write → Examine → Try. The JS version:

1. **Plan.** Decide what you want before you ask. What goes in, what comes out, which cells or data are involved, and what counts as "correct."
2. **Ask.** Write a prompt that includes your plan. Start the conversation with your learner profile.
3. **Read.** Go through the reply line by line. You should be able to say what each line does. If you can't, ask the AI to explain it, or ask for a version that uses only concepts you know.
4. **Run.** Run it, ideally on a practice sheet, and compare the result with your plan.
5. **Revise.** Send a follow-up describing what's wrong, or fix it yourself.

**Read** is the skill the book is really teaching. Every AI exchange in the book is followed by the authors walking through the code line by line.

A standing rule, stated in Lesson 2 and repeated when it matters: **don't run code you can't explain**. This matters most in Apps Script, where code can overwrite sheet data, send email, or ask for access to your Drive.

---

## 3. How the AI conversations work in the book

### Markup (already supported by the platform)

````markdown
::: {.ai-conversation prompt="Write an Apps Script function that ..."}
> Reply text...
>
> ```js
> function example() {
>   ...
> }
> ```
>
> More reply text...
:::
````

- The `prompt` becomes a "send to AI" button, so readers can send the same prompt to their own assistant.
- Follow-up turns are separate blocks, the same as the SQL book's "Try again. The table is named museum."
- After the exchange, the final code appears as a runnable `<pre class="code">` block. Apps Script code uses `data-environment="none"`.

### Rules for capturing transcripts

Replies are **real captured output**, not written by us.

- Capture each reply in a **fresh chat** that starts with the learner profile at that lesson's level (or with no profile, when the example is meant to show what happens without one).
- **Don't edit the code** in a reply. Trimming chatty prose is fine; mark cuts with `[…]`.
- Record where each capture came from in an HTML comment beside the block: assistant, model, date, and profile version. This tells us when to re-capture as models change.
- If the mistake a lesson needs doesn't happen, **change the lesson, not the transcript**. Each example below lists the mistake it's hoping for and a fallback if that mistake doesn't show up.
- The book isn't tied to one assistant. Readers may use ChatGPT, Gemini, Claude or Copilot. A note in Lesson 2, repeated occasionally, says: *"Your assistant's reply won't match this one word for word. Compare the code, not the wording."*

### Not everything has to be an AI exchange

Some explanations are better in the authors' own voice. The best example is the step-by-step derivation of a `for` loop from a `while` loop in Lesson 8. Use AI exchanges where they teach something about working with an AI, not as the default for every example.

---

## 4. The learner profile

### How readers get it

A button in each lesson (for example, "Copy my learner profile") builds the profile from the book's table of contents and the lessons up to the current one. This is the same machinery as the Make Prompt button in `toDoList.txt`, which already needs to scrape the table of contents and gather extra context. See §7 for how the two relate.

### Showing the profile in the book

Readers see the profile, not just a copy button. Each lesson that changes it shows:

- the full current profile, with each part explained (what it's for, and what the AI would do without it);
- what's new in this lesson, highlighted;
- for any rule being removed, why the reader no longer needs it.

Possible markup: an `::: {.ai-profile}` block with annotations. This needs tooling (see Q6).

### Rules that come and go

Some rules are scaffolding. They keep the AI's code within the reader's reach while the reader is new, and the book removes them once the reader can handle what they were holding back. Each removal is a small lesson in itself, and it's the habit readers take away: start with tight limits, and loosen them as you learn.

| Rule | Added | Removed | Why it's there |
|---|---|---|---|
| "Don't use semicolons." | 2 | never | book style |
| "Explain what each line does." | 2 | reader's choice, later | the Read step |
| "Put all the code in one function with a descriptive name. Don't create extra functions or use parameters." | 4 | 9 (Functions) | functions are introduced lightly in Lesson 4 and taught fully in Lesson 9 |
| "Use `let` for every variable. Don't use `const`." | 5 | 9 (Functions) | readers can change values freely while learning; `const` is taught in Lesson 9 |
| "Write each step on its own line; don't chain calls." | 5 | 33 (Obsidian) | readable Apps Script |
| "Use `for` loops with an index, not `forEach` or `for...of`." | 8 | 33 (Obsidian) | readers can follow every step of the loop |

### Profile draft at the end of Lesson 2 (before any code)

```text
I'm a beginner learning JavaScript from a textbook. I'll be running code in my
web browser. I don't know any programming concepts yet.

When you write code for me:
- Use only the concepts listed below as "what I know." If a task needs something
  I haven't learned, tell me instead of using it.
- Don't use semicolons at the ends of lines.
- Keep it short and simple, and explain what each line does in plain language.

What I know so far: nothing yet.
```

### What each lesson adds to "what I know"

| After lesson | Environment | Added concepts | Added style rules |
|---|---|---|---|
| 2 | Browser | — | no semicolons; explain each line |
| 3 | Browser console / on-page editor | statements, expressions, `console.log`, comments, arithmetic operators, reading error messages | — |
| 4 | Apps Script in Google Sheets | what a function is (`function name() { }`), choosing a function to run, the Execution log | "I run code from the Apps Script editor in Google Sheets"; one function, no parameters |
| 5 | same | `let`, reassigning, strings/numbers/booleans, `+` concatenation, template literals, `Number()`/`String()`, `SpreadsheetApp.getActiveSheet()`, `getRange`, `getValue`, `setValue` | use `let`, not `const`; one step per line (no chained calls) |
| 6 | same | `if` / `else if` / `else`, comparison operators (`===`, `!==`, `>`, `<`, `>=`, `<=`), `&&`, `\|\|`, `!` | use `===`, not `==` |
| 7 | same + Members sheet | arrays, indexes starting at 0, `length`, `push`, arrays of arrays, `getValues`, `setValues`; a description of the Members sheet | — |
| 8 | same | `while`, `for`, `++`/`--`, infinite loops | use `for` loops with an index, not `forEach` or `for...of` |
| 9 | same | functions in full: parameters, arguments, `return`, calling one function from another; `const` | *removes* the one-function rule and the `let`-only rule |
| 10+ | + garden case | description of the case's sheets (the JS equivalent of the SQL schema) | — |

---

## 5. Lesson-by-lesson outline

Each lesson lists: **Goal**, **Keep / move / cut** from the current draft, **AI exchanges**, and **Fixes** carried over from the review of the current draft.

### Example data: a club Members sheet (Lessons 5–9)

Examples use a generic **club member list** that makes sense without the garden case. When the case is introduced in Lesson 10, the story reveals that this is the garden club's roster. This replaces the Founding Fathers and Ada Lovelace data in the current draft.

Proposed columns (about 10 fictional members):

| First Name | Last Name | Email | Dues Paid | Volunteer Hours |
|---|---|---|---|---|
| text | text | text | checkbox → `true`/`false` | number |

- It covers all three primitive types. Checkbox cells come back from `getValue` as real booleans, which is a nice Apps Script detail for Lesson 5.
- It supports natural decisions (*"has this member paid dues?"*, *"more than 10 hours?"*) and loops (*"total hours"*, *"list members who haven't paid"*).
- **Leave out a Join Date column for now.** `getValue` returns a Date object for a date cell, which is a concept readers won't have. The current loops lesson works around this by formatting dates as plain text. Add dates in a later lesson.
- How readers get the sheet: a shared template ("File → Make a copy") so they don't have to type it in. The script that generates the data can also stay for Lesson 8's "reading for danger" exercise.
- **Running Apps Script code on the page: the `appsscript` module** (`tools/system-files/*/appsscript.js`; the original is at `theGove/tools/api/appsscript.js`). A `<pre class="spreadsheet">` block becomes an editable grid, and a mock `SpreadsheetApp` lets Apps Script code in Monaco blocks run against it. Its copy button produces either "Code to build sheet" (an Apps Script function that recreates the sheet in real Google Sheets) or the data to paste. Plan: define the Members sheet this way, so readers run the AI's code on the page first and then for real in Sheets. It needs the gaps in Q10 closed first.

---

### Lesson 1 — Welcome to Programming

**Goal:** explain what programming is, and why you still need to understand code when an AI writes it.

**Keep:** "What Programming Actually Is", "How Computers Think", and "Why JavaScript Is a Great First Language".

**Rework:** "Beyond the Browser" and "JavaScript Variants" become **a map of the book**: the platforms readers will visit, what each is good for, and the promise that one language plus one method (the learner profile) works on all of them. Fix the platform descriptions along the way. Office Scripts now also runs in desktop Excel, and TypeScript should be presented as a language readers will actually learn in Part IV, not just a side note.

**Move:** "How to Run JavaScript" (the console steps) → Lesson 3. The semicolon note → Lesson 3, where it gets resolved.

**New:**
- *Programming in the age of AI.* The fills-the-gaps contrast from §1: you're the one who knows what you want, and the one who has to check it.
- *How this book works.* Preview of the five-step workflow and the conversation blocks, and a short explanation of the learner profile.

**AI exchange (one short demonstration):**
- Prompt: *"Write a JavaScript program that says hello."*
- Hoping to capture: the AI makes choices you didn't ask for, such as a full HTML page, Node.js instructions, or `alert()`. Nothing wrong with it, but it isn't what you'd have picked, because a vague prompt leaves the AI to guess.
- Fallback: if it just gives `console.log("Hello")`, use the exchange to show it guessed well and explained where to run it, and note that it still made the choice for you.

---

### Lesson 2 — Working with an AI Assistant (new)

**Goal:** readers set up an assistant, learn the workflow, create their first learner profile, and see why it matters.

**Sections:**
1. *Choosing an assistant.* Any mainstream assistant works, and the free tiers are enough. Cover school and workplace policies, and privacy: don't paste personal or sensitive spreadsheet data.
2. *How a conversation works.* Prompts, replies and follow-ups. The assistant remembers earlier messages within a chat and forgets them in a new chat, so the profile goes at the start of each new chat.
3. *The workflow* (§2), with **Read** as the core skill.
4. *Your learner profile.* What it is and the copy button. Paste the first version.
5. *Your replies will differ.* How to compare an AI's answer with the book's.
6. *Asking good follow-up questions.* "Explain line 3." "Use only what I know." "What does this error mean? Don't fix it yet." "What would happen if…?"

**AI exchanges (the lesson's main demonstration):**
- Same prompt twice: *"Write JavaScript that adds up the numbers from 1 to 10."*
  - **Without a profile.** Hoping to capture: a one-liner such as `Array.from(...).reduce(...)` or a `for` loop with `const` and semicolons. It's correct, but unreadable to a beginner.
  - **With a profile.** A short loop with explanations, or the AI saying it needs concepts the reader hasn't learned yet. Either one makes the point.
  - Fallback: if both versions look alike, use a harder prompt, for example *"…and only count the even numbers."*
- *"Explain what each line of that code does."* Shows readers they can always ask.

---

### Lesson 3 — Your First Lines of Code (current Lesson 2)

**Goal:** statements, expressions, `console.log`, comments, errors, and syntax. The reader asks for tiny pieces of code and reads them.

**Keep:** almost all of the current Lesson 2, including expressions vs. statements, `console.log`, comments, the types of errors, and syntax and structure.

**Move in:** the browser console steps from Lesson 1.

**Make explicit:** a short section on named values (`let name = "Ava"`, `let x = 42`), so readers can read the basic variables in every AI reply from their first prompt. Types, conversion and sheet data wait for the Variables lesson (see Q5b).

**Move out:** "Transitioning to Google Apps Script" → the opening of Lesson 4.

**AI exchanges:**
- *"Write a line of JavaScript that prints a greeting to the console."* Reading it: which part is the expression, which is the statement, and what the quotes mean.
- **Semicolons, resolved here.** Hoping to capture: the AI ends every line with `;`, even with the profile. Use this to explain that semicolons are optional, that the book leaves them out, and that code with them works the same. This one explanation replaces the two current, contradictory ones.
- **Explaining errors.** The reader runs `console.log("Hello"`, gets a SyntaxError, and asks *"What does this error mean? Don't fix it, explain it."* Compare that with asking *"fix it"*, where the AI hands back corrected code and the reader learns nothing.

**Fixes:** remove the current Lesson 2's semicolon text ("using them consistently… avoids subtle bugs"). Fix "This calculates a number, though it doesn't show the result anywhere." Remove the stray `\<-(Note: …)` fragment.

---

### Lesson 4 — Getting Started with Apps Script in Google Sheets (current Lesson 3 + the setup parts of current Lesson 4)

**Goal:** open the editor, understand that code lives inside a function, run it, read the Execution log, and handle the permission prompt safely.

**Keep:** the current Lesson 3's "Why Sheets" and editor tour.

**Move in from the current Lesson 4:** the screenshot walk-through of opening the editor and running `myFunction`, and the whole authorization walk-through. That's setup, not variables.

**Rewrite:** the current Lesson 3's "What This Chapter Will Accomplish", which describes the variables lesson.

**New section: a first look at functions.** Enough to read the syntax and know why it's needed, with the details left for Lesson 9.

- *Why:* Apps Script doesn't run loose lines of code. It runs a function you choose by name from the Run menu. One file can hold several functions, and you pick which one to run. Readers need this by Lesson 8, which puts two functions in one file.
- *Anatomy:* `function` (the keyword) · the name · `()` ("empty for now; you'll see what goes here in Lesson 9") · `{ }` holding the steps, which run from top to bottom.
- *A bridge:* readers have been *calling* a function since Lesson 3. `console.log(...)` is one, and the parentheses carry a value into it. One sentence, without the word "parameter."
- *Naming:* give functions descriptive names, not `myFunction`. Readers can ask the AI to do this too.
- *Profile rule added:* one function, with a descriptive name, and no parameters. Show what happens without the rule: the AI splits a small task into helper functions that take arguments (capture this).

**AI exchanges:**
- *"How do I open the Apps Script editor for my Google Sheet?"* Hoping to capture: out-of-date instructions such as "Tools → Script editor". Lesson: AI knowledge can be stale, so check its instructions against what's on your screen.
  - Fallback: if the answer is correct, make the point with a smaller detail it gets wrong, or cover it in prose.
- *"Write an Apps Script function that writes Hello into cell A1."* Hoping to capture: a one-line chained call, `SpreadsheetApp.getActiveSheet().getRange("A1").setValue("Hello")`. Read it piece by piece. It's hard to follow, which motivates asking for one step per line and leads into Lesson 5.
- **Permissions.** When the script runs, Google asks for authorization. Read what's being requested, and ask the AI *"what permissions does this code need, and why?"* Rule: approve only when the permissions match what you expected the code to do.

**Profile update:** switch the environment to Apps Script.

---

### Lesson 5 — Variables and Data (current Lesson 4)

**Goal:** variables, the primitive types, text and numbers, conversion, and naming. The reader reads and writes single cells.

**Keep:** "What Variables Are", "Primitive Types", "Working With Variables", "Working With Text and Numbers", and "Naming Conventions". Keep the lesson short, since the setup material has moved to Lesson 4. **End with a preview of decisions:** *"You've read a number from a sheet. Next lesson, your code will decide what to do with it."*

**AI exchanges:**
- *"Write an Apps Script function that reads a name from A1 and writes 'Hello, <name>!' in B1."* This replaces the current hand-written `writeGreeting` with the AI's version. Hoping to capture, with the Lesson 4 profile: `const` instead of `let`, and possibly `getActiveSpreadsheet().getActiveSheet()`. That leads into:
- **A short note on `const`.** Code you find elsewhere, including AI code, often uses `const`: a variable that can't be given a new value. For now, the profile asks the AI to use `let` so readers can change values freely while they learn. Show the new profile rule and explain it. `const` is taught properly in Lesson 9, when the rule is removed.
- Re-ask with the updated profile, and read the `let` version.
- **Naming.** Ask the AI to *"rename the variables so the names describe what they hold"*, or show a reply that uses short or unclear names. Ties into "Naming Conventions".
- **A type bug.** A1 holds the text `"5"`, and the code adds 5 and writes `55`. The reader asks *"why do I get 55 instead of 10?"* Covers strings vs. numbers and `Number()`. This is a common, realistic spreadsheet problem.
- *"Explain each line."* Model the Read step on a longer function.

**Fixes:** the "count" / "line 3" mismatch with the `score` example; "section XXXXXXXX" and "4.3.3"; the "If you'd like, we can move on…" chat leftover; typos in the authorization steps ("Untitiled", "bottle left").

---

### Lesson 6 — Making Decisions (current Lesson 5)

**Goal:** `if` / `else if` / `else`, comparison operators, and logical operators. Plan precisely, then test edge cases.

**Keep:** the current content. Finish "Real-World Examples".

**AI exchanges:**
- *"Write a function that reads a number from A1 and writes High, Medium, or Low in B1."* Hoping to capture: the AI picks its own thresholds. Lesson: a vague plan means the AI decides for you, so put the thresholds in the prompt. Follow-up: *"What happens if A1 is exactly 100?"* Introduces testing edge cases.
- **Why `===`.** The AI uses `===`. Ask it why, and compare with `==`. Ties into the existing table.
- **Empty cells.** *"What if A1 is empty?"* Hoping to capture: `if (!value)`, a truthy check the reader hasn't learned. Revise with *"use only what I know"* and get `value === ""`. Also shows that `getValue()` returns `""` for an empty cell.

**Fixes:** rebuild the comparison table, whose cells have lost their line breaks; remove the stray spaces in `cellB1 .setValue`; decide what the "Make Prompt" button should do (see §7).

---

### Lesson 7 — Arrays (current Lesson 6)

**Goal:** arrays, arrays of arrays, and `getValues`/`setValues`. **New skill: describing your data to the AI.**

**Keep:** the current explanations, rewritten to use the Members sheet instead of the Lovelace/Babbage table. Convert the escaped arrays (`\[ \["Ava"\] \]`) into proper code blocks.

**New section: describing your sheet.** An AI can't see your spreadsheet. Tell it the range, what each column holds, and whether there's a header row. This is the JS equivalent of the SQL book's `museum` vs `Museums` lesson.

**AI exchanges:**
- *"Write Apps Script that reads my data and logs the first person's last name."* (No description of the sheet.) Hoping to capture: the AI guesses the range or the column order, or treats the header row as data. The follow-up describes the sheet, and the corrected reply is read line by line.
- **Unlearned syntax.** Hoping to capture: destructuring, for example `const [first, last] = data[0]`. Revise with the profile.
- **setValues error.** The range and the array are different sizes. Paste the error and ask for an explanation. (Capture the exact wording of the Apps Script error.)

**Fixes:** mostly made moot by switching to the Members data, but don't carry over the old slips ("Sommerville"; a birth year stored in a variable called `age`).

---

### Lesson 8 — Loops and Repetition (current Lesson 7)

**Goal:** `while`, `for`, increment and decrement, and infinite loops. The reader processes every row of a sheet.

**Keep:** the authors' `while` → `for` derivation. It's the best teaching in the current draft, so it stays in the authors' voice with no AI exchange.

**AI exchanges:**
- *"Log the first and last name of each member in my sheet, skipping the header row."* (With a description of the sheet.) Follow-ups that combine this with Lesson 6: *"…only members who haven't paid dues"*, and *"add up everyone's volunteer hours."* Hoping to capture: `forEach`, `for...of`, or `slice(1)`. Revise to a `for` loop with an index. Optional sidebar: *"Now that you can read a `for` loop, here's what that `forEach` was doing."* This shows readers that unfamiliar code becomes readable as they learn more.
- **Diagnosing a hung script.** The reader's loop never ends (a missing increment) and they ask *"my script never finishes. Why?"*
- **Reading for danger.** Ask the AI for a script that fills a sheet with sample member data (replacing the current `writeDataToActiveSheet` and its Founding Fathers data). Before running it, find the line that overwrites whatever is already there. Makes the "read before you run" rule concrete.

**Fixes:** `i < data.length` → `rowIndex`; mark the infinite-loop example `data-environment="none"`; finish the two incomplete sentences; remove the duplicated `for` introduction, the "7.2.2" heading and the "does exactly what you asked" chat leftover; `data=` → `let data =`; remove the reference to a `numberOfRows` variable that never appears; "reality accessible" → "readily accessible".

---

### Lesson 9 — Functions (new)

**Goal:** functions in full, following the light introduction in Lesson 4. This is also where the profile changes most: two scaffolding rules come off.

**Sections:**
1. *Why split code into functions:* reuse, readability, and naming a job so you don't have to reread how it's done.
2. *Parameters and arguments:* what goes in the `()`. Tie back to `console.log(...)` and `getRange("A1")`, which readers have been passing values to all along.
3. *`return`:* getting a value back out.
4. *Calling one function from another.*
5. *`const`:* now that readers understand reassignment, introduce the variable that can't be reassigned. Include the "a `const` array can still change with `push`" subtlety.
6. *Updating your profile:* remove the one-function rule and the `let`-only rule. Show the before and after, and explain why each rule was there and why it's no longer needed. This is the lesson where readers see a scaffolding rule removed on purpose.

**AI exchanges:**
- Re-ask a Lesson 8 prompt (for example, the dues report) with the updated profile. Hoping to capture: the AI now splits the work into helper functions and uses `const`. Read it with the new concepts. Code that would have been unreadable in Lesson 5 is now readable.
- *"Refactor my Lesson 8 script into smaller functions, and explain each one."* Readers take code they wrote and see it reorganized.
- **A `const` error:** the reader changes a `const` variable and gets `TypeError: Assignment to constant variable`. They ask for an explanation, which reinforces the "explain before fixing" habit.

**Not covered here (candidates for later):** pass-by-value vs. pass-by-reference, default parameters, arrow functions, scope in depth.

---

### Lesson 10 — College Community Garden: Case Setup (current Lesson 8)

**Goal:** introduce the case, and show how to give the AI a description of the case's sheets.

**Keep:** the story as written.

**New:**
- *Tie in the Members sheet:* the member list used in Lessons 5–9 turns out to be the garden club's roster.
- A "Garden context" block that describes each case sheet's columns. Readers add it to their profile. From here on, readers write more of their own prompts.

---

### Lesson 11 — Google Forms (current Lesson 9)

**Goal:** build the sign-up form linked to the sheet, then work with the responses.

**Needs:** a real section title and the form-building steps. Remove the duplicate interests (Hydroponics Basics / 101; Responsible Pest Management / Organic Pest Control).

**AI exchanges:**
- *"How do I create a Google Form that saves responses to my existing sheet?"* Check the steps against your screen (same point as in Lesson 4).
- The reader describes the response sheet's columns and asks for a script that summarizes interests. This brings together arrays, loops and decisions with a real data description.

---

### Lessons 12–50

See the table of contents at the top. Two items from the earlier candidate list still need a home:

- `forEach` and the other array methods, which would remove the `for`-loop profile rule. *Placed:* Lesson 33 (Obsidian), where DataviewJS makes them the natural style. Readers may meet `forEach` earlier in AI code; the Lesson 8 sidebar covers reading it.
- A Join Date column on the Members sheet, added in Lesson 14 with dates.

---

## 6. Skills progression (what readers learn about working with AI)

| Skill | Introduced | Reinforced |
|---|---|---|
| Vague prompts leave the AI to guess | 1 | 6 |
| Using a learner profile, and understanding each part of it | 2 | every lesson |
| Asking for explanations | 2 | 3, 5 |
| Recognizing code you haven't learned and asking for simpler code | 2 | 4, 5, 7, 8 |
| Explaining an error before fixing it | 3 | 7, 8, 9 |
| Checking outdated or incorrect instructions against your screen | 4 | 11 |
| Reading permissions before approving them | 4 | — |
| Adding a scaffolding rule to the profile | 4 | 5, 8 |
| Putting precise requirements in the prompt | 6 | 11 |
| Testing edge cases | 6 | 8 |
| Describing your data to the AI | 7 | 10, 11 |
| Describing a platform the AI doesn't know | 26 | 49, 50 |
| Reading for danger before running | 8 | later lessons |
| Removing a scaffolding rule once you're ready | 9 | later lessons |
| Writing your own learning profile for a new skill | capstone | — |

---

## 7. Relationship to the Make Prompt button

`toDoList.txt` describes a Make Prompt button at the end of each section that scrapes the section and generates prompts. Lesson 5 already calls it with `{types:['quiz','review','examples']}`. That's a study aid, a different feature from the learner profile, but both need the same pieces:

- the table of contents, and which lessons the reader has completed,
- the "what I know" list for the current lesson (which could be declared in each lesson's front matter, so it doesn't have to be scraped from the prose),
- the current section's text as Markdown (the part already written).

One way to combine them: the learner profile becomes the standard opening of *every* generated prompt. A quiz or review prompt then automatically stays within what the reader knows.

---

## 8. Open questions

### Settled

- **Q5b. Decisions before Variables?** *Decided:* Variables stays before Decisions. Decisions depend on types: `===` vs. `==`, the empty-cell check and the "55" bug all require knowing strings from numbers, and sheet examples need `getValue`. To keep the early payoff that motivated the beta ordering: Lesson 3 explicitly introduces named values (`let name = "Ava"`) so readers can read basic variables in AI code from the start; the Variables lesson stays short and lively; and it ends with a preview of decisions. Fix the beta chapter order when `config.json` versions are rebuilt from the new table of contents.
- **Q7. Recording where each AI reply came from.** *Decided: both.* (1) Each conversation block records its source as attributes, for example `::: {.ai-conversation prompt="..." assistant="ChatGPT" model="GPT-5" captured="2026-10-01" profile="lesson-5"}`, so a script can list replies older than a set age for re-capture. (2) Readers see a short caption such as *"Reply from ChatGPT, October 2026,"* which reinforces that their own replies will differ. The caption needs a small build or rendering change.
- **Q5a. Lesson numbers in the prose.** *Decided:* never hard-code lesson numbers in lesson text. Use `.book-link` cross-references, which the build numbers correctly for each version. The numbers in this outline are working labels only.
- **Q6. Declaring profile additions in front matter.** *Decided:* yes. Each lesson's front matter declares what it adds to the learner profile, for example `_profile: { environment, knows: [...], rules_add: [...], rules_remove: [...] }`. The profile button builds the profile from the lessons in the reader's version (course track), in that version's order. This is required because tracks skip parts, so scraping the prose can't produce the right profile. The same data drives the annotated profile display. Needs tooling; build it when lesson writing starts.
- **Q8. JADE code style.** *Decided:* JADE examples use the book's style (camelCase, no semicolons). Functions that work with the workbook take one parameter, and the book always names it `excel` (`async function name(excel)`). JADE also accepts `ctx` or `context`, but the platform profile should ask for `excel` so AI code matches the book.
- **Q9. JADE documentation.** *Done:* the Excel version is documented in `D:\code\jade\orignial\jade\docs\JADE-functions.md`. Part 1, "Functions for automation authors," is the source for the Lesson 26 platform profile; Part 2 is internal and stays out of the book. **Lessons 25–28 can now be written. Lessons 29 and 30 (Word, PowerPoint) are on hold until those versions of JADE are published.** Still to fix: the `first-module.png` screenshot shows `ace.listing`, but the code and docs use `Jade.listing`.
- **Q11. How the on-page console shows arrays.** *Done* in `tools/system-files/dev/monaco.js` (promote to `stable/` when ready). `console.log` output now shows arrays and objects with their structure, in the style of Apps Script's execution log (`[ 'Ava', 'Lopez', 12 ]`). Values longer than one line are split one element per line, so a `getValues()` result shows one row per line. Top-level strings still print as-is.
- **Q10. Gaps in the `appsscript` mock.** *Done* (in `tools/system-files/dev/appsscript.js`; promote to `stable/` when ready). Added: `SpreadsheetApp.getActiveSheet()` (the active sheet is the nearest sheet above the code block being run), `getActiveSpreadsheet().getActiveSheet()`, `getSheets()`, `getDataRange()`, `getLastRow()`/`getLastColumn()`, `appendRow()`, `clearContents()`, `setNumberFormat()` (with `"@"` for plain text), range `getRow/getColumn/getNumRows/getNumColumns/getSheet`, open-ended ranges (`"A2:C"`, `"A:A"`), `Logger.log` (including `%s`), `SpreadsheetApp.flush()`, and setters that return the range, so calls can be chained. Values now match real Sheets: empty cells read as `""`, TRUE/FALSE as booleans, and plain-text cells stay strings, so the Lesson 5 "55" bug can be reproduced. `getSheetByName` returns `null` for a missing sheet, and `setValue` fills every cell in the range. Error messages follow Apps Script's wording (row/column mismatch, "outside the dimensions of the sheet", "starting row… too small"). **Check them against real Apps Script output when capturing transcripts.** Also fixed: overwriting a formula cell now removes the formula, and the "Code to build sheet" script now applies number formats before the data. The feared name clash doesn't happen, because Monaco wraps reader code in a function. Tested in jsdom: 28 checks, plus an AI-style function run through the Monaco wrapper. **Authoring note:** real sheets start at 1000 rows × 26 columns, but the grid on the page is only as large as its spec. Make example grids a few rows and columns larger than the data, because AI code often writes to the next empty column or row. The error message tells readers the size of the grid on the page.
- **Q4. Functions.** *Decided:* a light introduction in Lesson 4 (the syntax, why Apps Script needs functions, `console.log` as a function you've already called), plus the profile rule "one function, no parameters." A full Functions lesson becomes the new Lesson 9, after Loops, which shifts the case to 10 and Forms to 11.
- **Q1. `const` vs. `let`.** *Decided:* the profile asks the AI to use `let` from Lesson 5 on. The same lesson includes a short note explaining that `const` exists, why the profile avoids it, and where readers will see it. The rule is removed and `const` taught properly in Lesson 9 (Functions).
- **Q3. Where Lesson 3's code runs.** *Decided:* the on-page editor, which shows `console.log` output on the page. It needs no setup and works on school Chromebooks where DevTools may be blocked. The browser console gets a brief mention in Lesson 3 and full treatment in Part III (DevTools snippets, debugging). The profile's environment line reads: "I'm running JavaScript in an online editor that shows console.log output."
- **Q2. Garden case timing.** *Decided:* the case stays at Lesson 10. Lessons 5–9 use a generic club Members sheet, which the case later reveals to be the garden club's roster (§5).


### Still open

None right now.

---

## 9. Writing decisions

- **Audience:** college students with no programming background.
- **Voice:** plain and direct, in the second person. Existing prose that's kept is tightened, removing generic phrases ("JavaScript with superpowers," "It's not just X — it's Y") and heavy em-dash use.
- **Lesson format:** the SQL book's features: a learning-objectives block, `.term` definitions, `.note`/`.tip`/`.caution` callouts, and a summary. Each lesson also gets an **assessment** (questions and small tasks drafted by Claude). Grading and submission will be decided later.
- **AI replies:** captured live from the Gemini API while each lesson is written, so the text is written around the real reply (see Q7 for the source record). **Re-runs:** a capture may be re-run a few times (about three at most) when an example needs a particular mistake. If the mistake doesn't show up, change the example rather than chasing it, because students would be unlikely to see it themselves.
