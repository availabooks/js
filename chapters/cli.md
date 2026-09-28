---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Read command-line arguments with `process.argv`, and with Node's built-in `parseArgs`.
2. Use the `??` operator to supply a default for a missing value.
3. Turn a script into a command you can run from any folder, and find files relative to the script.
4. Ask the person running a tool a question with `readline`.
5. Run a tool on a schedule, and save its output to a file.
:::
:::

## A Tool Maya Can Run

Throughout the season, Maya has asked the same questions again and again: How many tomatoes so far? What did we harvest in June? Each time, someone opened a spreadsheet and added things up. A **command-line tool** answers in one line typed into a terminal:

<pre class="code" data-environment="none">
garden-report --crop Tomato --from 2027-06-01
</pre>

The words after the command are **arguments**. Ones that start with `--`, such as `--crop`, are usually called **options**, and many take a value, such as `Tomato`. Almost every programming tool you've used so far, from `node` to `npm install`, works this way, and now you'll build one of your own.

::: {.term}
> **Command-line arguments** — The words typed after a command, which the program can read. Options such as `--crop Tomato` name a setting and give its value.
:::

## Reading the Command Line

Here's the request, in a new chat with your learner profile from [Analyzing and Charting Data](charts){.book-link}. It uses `harvests.json`, the merged file from [Working with Data Files](data-files){.book-link}:

::: {.ai-conversation prompt="Write a Node command-line tool that reads harvests.json (an array of objects with date, bed, crop, kg and loggedBy) and prints total kilograms by crop. It should accept options: --crop Tomato to show just one crop, and --from 2027-06-01 --to 2027-06-30 for a date range. I want to run it like: node garden-report.js --crop Tomato --from 2027-06-01" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="charts" transcript="cli/report"}
> Here's the tool. One quick note first: this needs **`process.argv`**, which isn't on your list yet. It's a built-in array Node gives every script — it holds the words typed on the command line. For example, running `node garden-report.js --crop Tomato` gives you `process.argv` as `["path/to/node", "path/to/garden-report.js", "--crop", "Tomato"]`. We only care about the parts after the file name, so we slice off the first two.
>
> ```js
> import { readFileSync } from "node:fs"
>
> // The words typed after "node garden-report.js", e.g. ["--crop", "Tomato", "--from", "2027-06-01"]
> const args = process.argv.slice(2)
>
> // Looks for a flag like "--crop" and returns the word right after it, or null if it's missing
> const getOption = name => {
>   const index = args.indexOf(name)
>   if (index === -1) return null
>   return args[index + 1]
> }
>
> const cropFilter = getOption("--crop")
> const fromDate = getOption("--from")
> const toDate = getOption("--to")
>
> // Read and parse the harvest records
> const text = readFileSync("harvests.json", "utf8")
> const harvests = JSON.parse(text)
>
> // Keep only the records that match whatever filters were given
> const filtered = harvests
>   .filter(h => cropFilter === null || h.crop === cropFilter)
>   .filter(h => fromDate === null || h.date >= fromDate)
>   .filter(h => toDate === null || h.date <= toDate)
>
> console.log(`Matching records: ${filtered.length} of ${harvests.length}`)
>
> // Add up kilograms per crop using an object as a lookup table
> const totals = {}
> filtered.forEach(h => {
>   if (totals[h.crop] === undefined) {
>     totals[h.crop] = 0
>   }
>   totals[h.crop] += h.kg
> })
>
> console.log("Total kilograms by crop:")
> Object.keys(totals).forEach(crop => {
>   console.log(`${crop}: ${totals[crop].toFixed(2)} kg`)
> })
> ```
>
> **Why date comparisons with `>=` and `<=` work:** since dates are stored as text like `"2027-06-01"`, comparing them as strings sorts them correctly, because year comes first, then month, then day — the same order as the text.
>
> **How to run it:**
> ```
> node garden-report.js --crop Tomato --from 2027-06-01
> node garden-report.js --from 2027-06-01 --to 2027-06-30
> node garden-report.js
> ```
> With no options, it totals every crop across all dates.
>
> Make sure your `package.json` has `"type": "module"` so the `import` line works, and that `harvests.json` is in the same folder.
:::

**Read.**

- **`process.argv`** is an array of everything on the command line, and the assistant's explanation of it is clear: the first two items are the path to Node and the path to the script, so `slice(2)` keeps just the arguments you typed.
- **`getOption`** finds an option with `indexOf` and returns the word after it, or `null` if the option isn't there.
- **The filters** each keep a harvest if their option wasn't given, `cropFilter === null`, *or* if it matches. Three chained filters, one per option, each easy to check.
- **The dates** are compared as text, which works for `YYYY-MM-DD`, as the reply explains.

Try the edges: what does `node garden-report.js --crop` do, with no crop after it? `getOption` returns `args[index + 1]`, which doesn't exist, so `cropFilter` is `undefined`, not `null`. Then `h.crop === undefined` is false for every harvest, and the report is empty, with no hint why. Hand-written argument handling tends to have gaps like that.

## A Built-in Parser

Parsing a command line well is a common enough job that Node includes a tool for it. Continuing the chat:

::: {.ai-conversation prompt="I read that Node has a built-in parseArgs function in node:util. Would it be better here?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="charts" transcript="cli/report"}
> Yes, `parseArgs` is a good fit here, and using it is a bit more robust than my hand-rolled `getOption` function. It's built into Node's `node:util` module, so no package to install.
>
> One honesty note: I'm not fully sure which Node version marked it stable (I believe it arrived experimental around Node 18 and became stable later), so it's worth checking `node --version` and the Node docs for your version if something doesn't behave as expected.
>
> Here's the tool rewritten with it:
>
> ```js
> import { readFileSync } from "node:fs"
> import { parseArgs } from "node:util"
>
> // Describe each option: what it's called and what type of value it takes
> const { values } = parseArgs({
>   options: {
>     crop: { type: "string" },
>     from: { type: "string" },
>     to: { type: "string" }
>   }
> })
>
> const cropFilter = values.crop ?? null
> const fromDate = values.from ?? null
> const toDate = values.to ?? null
>
> const text = readFileSync("harvests.json", "utf8")
> const harvests = JSON.parse(text)
>
> const filtered = harvests
>   .filter(h => cropFilter === null || h.crop === cropFilter)
>   .filter(h => fromDate === null || h.date >= fromDate)
>   .filter(h => toDate === null || h.date <= toDate)
>
> console.log(`Matching records: ${filtered.length} of ${harvests.length}`)
>
> const totals = {}
> filtered.forEach(h => {
>   if (totals[h.crop] === undefined) {
>     totals[h.crop] = 0
>   }
>   totals[h.crop] += h.kg
> })
>
> console.log("Total kilograms by crop:")
> Object.keys(totals).forEach(crop => {
>   console.log(`${crop}: ${totals[crop].toFixed(2)} kg`)
> })
> ```
>
> What's new here, since it's not on your list yet:
>
> - **`parseArgs({...})`** — you give it an `options` object describing each flag (`crop`, `from`, `to`) and that each one is a string. It reads `process.argv` for you and returns an object with a `values` property, like `{ crop: "Tomato", from: "2027-06-01" }`.
> - **`values.crop ?? null`** — the `??` operator means "use the left side unless it's `null` or `undefined`, then use the right side." Since you haven't covered `??` yet, I only used it to convert a missing option (`undefined`) into `null`, so the rest of the code matches what you already had.
>
> **Trade-off:** `parseArgs` also gives you free error messages if someone passes an option you didn't declare, which the manual version doesn't do. For a small personal script either approach works fine — I'd say use `parseArgs` since it's built-in and a little less code for you to maintain.
:::

**Read.** `parseArgs` takes a description of the options you accept, and returns their values in an object. You describe the options once, and it handles the rest, including the edge cases: an option given without its value, or an option you didn't declare, stops the tool with a clear error instead of a silently empty report. Try `node garden-report.js --size 3` and you get an error naming the unknown option.

The assistant flagged uncertainty about when `parseArgs` became stable, which is honest. It was added in Node 18, and every current LTS version has it; the Node documentation for your version says whether it's marked stable. And it introduced **`??`**, the *nullish coalescing* operator: `values.crop ?? null` gives `values.crop` unless it's `null` or `undefined`, in which case it gives `null`. It's the right way to supply a default. The older `||`, which you saw in [Loops and Repetition](loops){.book-link}, also replaces `0` and `""`, which is sometimes wrong: `hours || 1` would turn a real 0 hours into 1, but `hours ?? 1` keeps it.

<pre class="code">
const hours = 0
console.log(hours || 1)
console.log(hours ?? 1)

let crop
console.log(crop ?? "all crops")
</pre>

::: {.term}
> **??** — The nullish coalescing operator: `a ?? b` is `a`, unless `a` is `null` or `undefined`, in which case it's `b`. Useful for defaults.
:::

## A Command You Can Run Anywhere

Typing `node garden-report.js` from the right folder is fine for you, but not for Maya. Continuing:

::: {.ai-conversation prompt="I'd like to type garden-report from any folder, without node or the .js, and have it still find harvests.json next to the script. How?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="charts" transcript="cli/report"}
> This needs a few things that aren't on your list yet, so let me explain them first:
>
> 1. **A shebang line** — a special first line, `#!/usr/bin/env node`, that tells the terminal "run this file with Node" even when you don't type `node` yourself.
> 2. **`import.meta.url`** — inside an ES module, this gives you the file's own address (like `file:///Users/you/project/garden-report.js`). We need this because once you can run the command from *any* folder, `process.cwd()` (the current working directory) won't point at your project folder anymore — we need the script's own location instead.
> 3. **`fileURLToPath` and `path.dirname`**, from Node's built-in `node:url` and `node:path` modules — these convert that file address into a normal folder path we can build on.
> 4. **A `bin` entry in `package.json`, plus `npm link`** — this is how you register a short command name (`garden-report`) that points at your script, so npm can put it on your system's PATH.
>
> None of these are packages you install — they're built into Node and npm.
>
> ### 1. Update `garden-report.js`
>
> ```js
> #!/usr/bin/env node
> import { readFileSync } from "node:fs"
> import { parseArgs } from "node:util"
> import { fileURLToPath } from "node:url"
> import { dirname, join } from "node:path"
>
> // Find the folder this script lives in, no matter where it's run from
> const scriptFolder = dirname(fileURLToPath(import.meta.url))
> const dataFile = join(scriptFolder, "harvests.json")
>
> const { values } = parseArgs({
>   options: {
>     crop: { type: "string" },
>     from: { type: "string" },
>     to: { type: "string" }
>   }
> })
>
> const cropFilter = values.crop ?? null
> const fromDate = values.from ?? null
> const toDate = values.to ?? null
>
> const text = readFileSync(dataFile, "utf8")
> const harvests = JSON.parse(text)
>
> const filtered = harvests
>   .filter(h => cropFilter === null || h.crop === cropFilter)
>   .filter(h => fromDate === null || h.date >= fromDate)
>   .filter(h => toDate === null || h.date <= toDate)
>
> console.log(`Matching records: ${filtered.length} of ${harvests.length}`)
>
> const totals = {}
> filtered.forEach(h => {
>   if (totals[h.crop] === undefined) {
>     totals[h.crop] = 0
>   }
>   totals[h.crop] += h.kg
> })
>
> console.log("Total kilograms by crop:")
> Object.keys(totals).forEach(crop => {
>   console.log(`${crop}: ${totals[crop].toFixed(2)} kg`)
> })
> ```
>
> ### 2. Update `package.json`
>
> Add a `"bin"` field alongside your existing `"type": "module"`:
>
> ```json
> {
>   "type": "module",
>   "bin": {
>     "garden-report": "./garden-report.js"
>   }
> }
> ```
>
> This tells npm: "when someone runs the command `garden-report`, run this file."
>
> ### 3. Make it runnable and register it
>
> In your project folder's terminal:
>
> ```
> chmod +x garden-report.js
> npm link
> ```
>
> - `chmod +x garden-report.js` marks the file as executable (Mac/Linux only — on Windows you can skip this step; `npm link` handles it there with its own shim).
> - `npm link` creates a global shortcut on your system pointing at this project's `garden-report` command.
>
> ### 4. Test it
>
> From *any* folder now:
>
> ```
> garden-report --crop Tomato --from 2027-06-01
> ```
>
> It should find `harvests.json` next to the script, not in whatever folder you happen to be standing in.
>
> One thing to double check: run it once and confirm the record counts printed look right for your actual `harvests.json`, since this changes *where* the file is read from.
:::

**Read.** There are two separate problems here, and the reply solves both.

**Finding the data.** `readFileSync("harvests.json")` looks in the current working directory, from [Installing Node and Running Scripts](node){.book-link}, which is wherever you happen to be when you type the command. To find a file *next to the script*, you need the script's own folder. **`import.meta.url`** gives the script's location as a `file:` web address, and `fileURLToPath` and `dirname` turn it into a folder path. (Recent versions of Node, 20.11 and later, also have **`import.meta.dirname`**, which gives the folder directly.)

**Making a command.** Three pieces work together:

- **The shebang line**, `#!/usr/bin/env node`, at the very top, tells Mac and Linux to run the file with Node.
- **`bin` in `package.json`** maps a command name, `garden-report`, to the script.
- **`npm link`**, run once in the project folder, installs the command on your computer, so it works in any terminal. On Windows, npm creates a small `.cmd` file that runs Node for you, so the shebang isn't needed there, though it does no harm.

Run from a different folder, the tool now finds its data. For the club's harvests, `garden-report --crop Tomato` reports 5 of 32 records and 10.20 kilograms. The reply's last line is your rule from [Working with Data Files](data-files){.book-link} again: check the counts after changing where the data comes from.

## Asking a Question

If Maya types `garden-report` with no options, maybe the tool should ask which crop she wants. Node's built-in **`readline`** module reads a line typed in the terminal:

<pre class="code" data-environment="nodejs">
import * as readline from "node:readline/promises"

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout })
const answer = await terminal.question("Which crop? (press Enter for all) ")
terminal.close()

const cropFilter = answer.trim() === "" ? null : answer.trim()
console.log(cropFilter ?? "All crops")
</pre>

`terminal.question` shows a question and waits, with `await`, until the person presses Enter. `process.stdin` and `process.stdout` are the terminal's input and output. Always `close` the interface when you're done, or the program keeps waiting for more.

The line that sets `cropFilter` uses one more new operator, the **conditional operator**: `condition ? a : b` is `a` if the condition is true, and `b` if it isn't. It's a short `if...else` that produces a value. You'll see it often.

A tool that asks questions is friendly for people, but a tool that takes options can also be run by other programs and schedules. Good tools do both: options when they're given, questions when they're not.

## Running on a Schedule

The last request: a report every Monday morning, without anyone typing anything:

::: {.ai-conversation prompt="How do I make garden-report run by itself every Monday at 7 in the morning on my Windows laptop, and save what it prints to a file?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="charts" transcript="cli/report"}
> This is about scheduling a program on your own Windows computer (not Apps Script, so no script triggers involved — Windows has its own scheduler called **Task Scheduler**). I haven't used every version of Windows Task Scheduler, so if a screen looks different from what I describe, that's why — the idea stays the same.
>
> There are two new pieces here:
>
> 1. **Windows Task Scheduler** — a built-in Windows tool that runs a program at a time you set, similar in spirit to a time-driven trigger in Apps Script, but it's a Windows feature, not JavaScript.
> 2. **Output redirection with `>>`** — a feature of the Windows command line (`cmd.exe`), not JavaScript. When you run a command followed by `>> filename`, instead of printing to the screen, everything it would have printed gets added to the end of that file. Using `>>` (append) instead of `>` (overwrite) means each week's report gets added to the file rather than replacing last week's.
>
> ### Step 1: Find the full path to your script
>
> In the project folder, run:
>
> ```
> where garden-report
> ```
>
> This should show a path like `C:\Users\you\AppData\Roaming\npm\garden-report.cmd`. You can use that, or point straight at the `.js` file with `node`, which is more reliable for scheduled tasks since it doesn't depend on PATH being set up the same way for scheduled tasks as it is in your interactive terminal. I'd suggest the `node` route.
>
> Find the full path to `garden-report.js` itself, e.g.:
> ```
> C:\Users\you\projects\garden-report\garden-report.js
> ```
>
> ### Step 2: Create the task
>
> Open a terminal and run (as one line):
>
> ```
> schtasks /create /tn "GardenReport" /tr "cmd /c node \"C:\Users\you\projects\garden-report\garden-report.js\" >> \"C:\Users\you\projects\garden-report\garden-log.txt\" 2>&1" /sc weekly /d MON /st 07:00
> ```
>
> What each part means:
>
> - `/tn "GardenReport"` — the task's name, so you can find it later.
> - `/tr "..."` — the command to run. It starts with `cmd /c` because redirecting with `>>` is a `cmd.exe` feature, so we ask `cmd` to run our command and then quit.
> - `node "..."` — runs your script with Node, full path in quotes in case there are spaces.
> - `>> "...\garden-log.txt"` — appends everything the script prints to that file.
> - `2>&1` — also sends any error messages into the same file, so you'll see failures too, not just successful runs.
> - `/sc weekly /d MON /st 07:00` — schedule: weekly, on Monday, starting at 7:00 AM.
>
> ### Step 3: Test it without waiting for Monday
>
> Run the task immediately:
>
> ```
> schtasks /run /tn "GardenReport"
> ```
>
> Then open `garden-log.txt` and check that it contains the report you expect (record counts and totals), the same as if you'd run `garden-report` yourself in a terminal.
>
> ### Step 4: Check on it later
>
> - To see the task: open Task Scheduler (search "Task Scheduler" in the Start menu) and look under "Task Scheduler Library" for `GardenReport`.
> - To remove it: `schtasks /delete /tn "GardenReport" /f`
>
> ### One thing to watch
>
> Since `garden-log.txt` will keep growing every week (append, not overwrite), it's worth opening it every so often to check it's not getting huge or filling with repeated error messages instead of real reports.
:::

**Read.** Windows' **Task Scheduler** runs programs on a schedule, and `schtasks` creates a task from the command line. The reply explains every part: the task's name, the command, the weekly schedule, and **`>>`**, which appends a program's output to a file instead of showing it. `2>&1` sends error messages to the same file, so a failure leaves a trace, which is the lesson of the Executions page in [Menus and Triggers](triggers){.book-link}, applied to your own computer. Testing with `schtasks /run` right away is exactly right.

Two practical warnings the reply doesn't give:

- **Run that command in Command Prompt, not PowerShell.** The `\"` inside the quotes is how Command Prompt nests quotes; PowerShell treats them differently, and the task would be created with a broken command. VS Code's terminal on Windows is often PowerShell, so open Command Prompt from the Start menu for this.
- **A sleeping laptop doesn't run tasks.** If the laptop is closed at 7 on Monday, the report doesn't happen. In Task Scheduler, the task's settings include "Run task as soon as possible after a scheduled start is missed," which is worth turning on. For something that must run reliably, a computer that's always on, or a server, is the answer; you'll run code on a server in the next part of the book.

On a Mac or Linux, the traditional scheduler is **cron**. Running `crontab -e` opens a list of scheduled commands, and a line like `0 7 * * 1 /usr/local/bin/node /Users/maya/garden-report/garden-report.js >> /Users/maya/garden-log.txt 2>&1` runs the report at 7:00 every Monday. Ask your assistant for the details for your system, and check where Node is with `which node`.

## Your Learner Profile

::: {.ai-profile lesson="cli"}
Add rules:

- When a script reads files that live next to it, find them from the script's folder, not the current working directory.

Add to "What I know so far":

- process.argv, and parseArgs from node:util for command-line options
- the ?? operator, and how it differs from ||
- the conditional operator: condition ? a : b
- import.meta.url, import.meta.dirname, fileURLToPath and dirname
- making a command: the shebang line, bin in package.json and npm link
- asking a question in the terminal with node:readline/promises
- scheduling with Windows Task Scheduler (schtasks) or cron, and saving output with >>
:::

## Summary

A command-line tool reads its arguments from `process.argv`, and Node's built-in `parseArgs` turns them into values and catches mistakes such as unknown options. `??` supplies a default only when a value is missing, unlike `||`, which also replaces `0` and `""`. To run from any folder, a tool finds its own files from `import.meta.url` or `import.meta.dirname`, and becomes a command with a shebang line, a `bin` entry and `npm link`. `readline` can ask the person running the tool a question. Task Scheduler on Windows, or cron on a Mac, runs a tool on a schedule, and `>>` saves its output to a file, though only while the computer is awake. Next, you'll use Node to control a web browser.
