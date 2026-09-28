---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Name several more places JavaScript runs, and what each is good for.
2. Recognize, in an assistant's reply, what's specific to a platform and what's ordinary JavaScript.
3. Start learning a new platform with a starter prompt, and turn what you learn into a platform profile.
:::
:::

## One Language, Many More Places

This book has taken JavaScript to Google Sheets, web pages, browser extensions, Excel, Airtable, Obsidian, your own computer, n8n and Cloudflare. That's a lot of places, and it's still not all of them. This lesson is a short tour of others, each with what it's for, what it costs, what's different about it, and a **starter prompt**: a first message to send an assistant, after your learner profile, to begin learning it.

Every stop follows the pattern from [Teaching Your AI About a New Platform](platform-profile){.book-link}. The JavaScript you know works the same everywhere; what changes is the set of objects the platform gives you, the way code is run, and the pitfalls. Two short captured replies show what a first exchange about a new platform looks like.

## On Your Phone: Scriptable

**Scriptable** is a free iPhone and iPad app that runs JavaScript, with access to the phone's calendar, reminders, files and notifications, and it can make **home screen widgets**. There's no free equivalent on Android, which is why this book tours it rather than teaching it. A widget that reads your own API from [Serverless with Cloudflare Workers](workers){.book-link} is a nice first project:

::: {.ai-conversation prompt="I have an iPhone and the free Scriptable app. Write a Scriptable widget for my home screen that shows the garden club's next shift with open spots, from our API at https://garden-signups.example.workers.dev/shifts, which returns an array of shifts with date, task, start, capacity and spotsFilled. What should I know about Scriptable that's different from the JavaScript I've written so far?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="discord" transcript="tour/scriptable"}
> Good project! Before the code, here's what's different about Scriptable compared to what you've used so far:
>
> **What's new here:**
> - Scriptable is its own JavaScript environment on iOS — no `document`, `window`, `fetch`... but it has its own built-in objects for things like widgets, files, and network requests.
> - Instead of `fetch()`, Scriptable has a `Request` object: `new Request(url)`, then `await request.loadJSON()`.
> - To make a home screen widget, you build a `ListWidget` object, add text/spacer elements to it, then call `Script.setWidget(widget)` and `Script.complete()`.
> - `config.runsInApp` is a Scriptable-provided boolean that's `true` when you tap the script inside the app (for testing) and `false` when iOS runs it as an actual widget.
> - iOS — not your script — decides when to refresh a widget. You can *suggest* a refresh time with `widget.refreshAfterDate`, but you can't force continuous updates.
> - I'm not fully certain how reliably `Intl.DateTimeFormat` behaves in Scriptable's JS engine — I believe it works, since it's documented in the Scriptable community, but if the date/time text looks wrong on your phone, that's the first thing to check.
> - I don't know the exact format of your `date` and `start` fields (like `"2024-06-01"` and `"09:00"`, or something else). The code below assumes 24-hour `"HH:MM"` text combined with an ISO date — check your API's actual response and adjust if needed.
>
> **Who sees this:** a home screen widget only shows on *your own* iPhone, to whoever is holding/unlocking your phone. It calls your own API, which returns shift data (no personal names, based on what you described), so that's fine to display.
>
> ```js
> // Scriptable widget: next garden club shift with open spots
>
> const API_URL = "https://garden-signups.example.workers.dev/shifts"
>
> const widget = new ListWidget()
> widget.backgroundColor = new Color("#f0f5ec")
>
> try {
>   // Ask the API for the shift list
>   const request = new Request(API_URL)
>   const shifts = await request.loadJSON()
>
>   const now = new Date()
>
>   // Turn each shift's date + start time into one real Date,
>   // and work out how many spots are still open
>   const upcomingOpenShifts = shifts
>     .map(shift => {
>       const shiftStart = new Date(`${shift.date}T${shift.start}`)
>       const spotsOpen = shift.capacity - shift.spotsFilled
>       return { ...shift, shiftStart, spotsOpen }
>     })
>     .filter(shift => shift.shiftStart > now && shift.spotsOpen > 0)
>     .sort((a, b) => a.shiftStart - b.shiftStart)
>
>   console.log(`fetched ${shifts.length} shifts, ${upcomingOpenShifts.length} upcoming with open spots`)
>
>   const next = upcomingOpenShifts[0]
>
>   if (next === undefined) {
>     const text = widget.addText("No open shifts")
>     text.font = Font.mediumSystemFont(14)
>   } else {
>     const title = widget.addText(next.task)
>     title.font = Font.boldSystemFont(16)
>
>     widget.addSpacer(4)
>
>     const dateFormatter = new Intl.DateTimeFormat("en-US", {
>       weekday: "long",
>       month: "short",
>       day: "numeric"
>     })
>     const dateText = widget.addText(dateFormatter.format(next.shiftStart))
>     dateText.font = Font.systemFont(14)
>
>     const timeFormatter = new Intl.DateTimeFormat("en-US", {
>       hour: "numeric",
>       minute: "2-digit"
>     })
>     const timeText = widget.addText(timeFormatter.format(next.shiftStart))
>     timeText.font = Font.systemFont(14)
>
>     widget.addSpacer(4)
>
>     const spotsWord = next.spotsOpen === 1 ? "spot" : "spots"
>     const spotsText = widget.addText(`${next.spotsOpen} ${spotsWord} open`)
>     spotsText.font = Font.mediumSystemFont(14)
>     spotsText.textColor = new Color("#2e7d32")
>   }
>
>   // Ask iOS to check again in 30 minutes
>   widget.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000)
>
> } catch (error) {
>   // If the fetch fails, show that on the widget instead of a blank one
>   const errorText = widget.addText("Couldn't load shifts")
>   errorText.font = Font.mediumSystemFont(14)
>   console.log(error)
> }
>
> Script.setWidget(widget)
> Script.complete()
>
> // Preview the widget when running the script inside the app
> if (config.runsInApp) {
>   widget.presentSmall()
> }
> ```
>
> **How each part works, briefly:**
> - `try/catch` — if the network call fails, the widget still shows something readable instead of crashing.
> - `.map()` adds computed fields (`shiftStart`, `spotsOpen`) to each shift.
> - `.filter()` keeps only shifts that are still in the future and have room.
> - `.sort()` puts the soonest shift first, so `[0]` is the next one.
> - `console.log` counts — only visible when you run the script manually in the app (tap it), not when it runs silently as a widget.
>
> **To test and install:**
> 1. Open Scriptable, create a new script, paste this in, and tap the play button (▶) — it should show a small preview.
> 2. Check the log for the counts, to confirm it fetched real data.
> 3. Go to your home screen, long-press an empty spot, tap the **+**, search for **Scriptable**, choose a small widget size, add it.
> 4. Long-press the new widget, choose **Edit Widget**, and set **Script** to this script's name.
>
> One thing to double check yourself: the exact text format of `date` and `start` from your API, so the `new Date(...)` line parses correctly — want to paste me a sample shift object so I can confirm the parsing is right?
:::

The first list in the reply is a small platform profile, and it's what to look for whenever you start somewhere new: Scriptable has no `fetch`, so requests use its own `Request` object; a widget is a `ListWidget` you add text to; `config.runsInApp` tells your code whether it's being tested in the app or run as a widget; and iOS, not your code, decides when a widget refreshes. Everything else is familiar: array methods, spread, `try` and `catch`, `Intl.DateTimeFormat`, and counts in the log. The assistant was also clear about what it wasn't sure of, and asked to see a real shift object before trusting its date parsing, which is exactly the right instinct.

## In Design Tools: Figma and Penpot

**Figma**, the popular design tool, runs **plugins** written in JavaScript (or TypeScript) that create and change designs. Its free plan allows developing plugins for your own use. **Penpot** is a free, open-source alternative, with a plugin system of its own. For the club, a plugin could make a name badge for every volunteer:

::: {.ai-conversation prompt="I'd like to write a Figma plugin that makes a name badge for each of our 12 garden club volunteers: a rectangle with their first and last name on it, laid out in a grid on the current page. The names can be in an array in the plugin's code for now. What do I need to know about Figma plugins, and what would the code look like?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="discord" transcript="tour/figma"}
> Figma plugins are a new platform for you, so here's what you need to know before we write code.
>
> ## What a Figma plugin is
>
> - A plugin is a folder with at least two files: **`manifest.json`** (tells Figma the plugin's name and which file to run) and **`code.js`** (your actual JavaScript).
> - Your code runs in a special sandbox inside Figma. Like Node has no `document` or `window`, this sandbox has no browser DOM either — instead it has a global object called **`figma`** that you use to read and create things on the canvas.
> - There's no `import`/`export` or bundler in the basic setup — it's a plain script, like the Apps Script editor.
> - Figma can scaffold the files for you: in the Figma desktop app, go to **Plugins menu > Development > New Plugin**, pick a blank template. This generates a working `manifest.json` with the `id` field already filled in correctly — I'd let Figma do that instead of typing one by hand, since I'm not fully sure of every field it expects.
> - To run it after editing `code.js`: right-click the canvas > **Plugins > Development > [your plugin name]**.
> - There's a developer console for it too (**Plugins > Development > Show/Open Console**), similar to the browser dev tools you already use.
> - Nothing here is published anywhere — it only affects the Figma file you're working in, on your own account, and everything it does can be undone with Ctrl+Z, so there's not much risk in just running it and checking the result.
>
> ## Figma-specific things the code will use (new to you)
>
> - `figma.createRectangle()` and `figma.createText()` — create shape and text nodes.
> - Colors are objects like `{ r: 0.9, g: 0.95, b: 0.9 }` with each channel from **0 to 1**, not 0–255.
> - Before setting text, you must `await figma.loadFontAsync({ family, style })` — Figma loads fonts lazily, so it makes you ask first.
> - `figma.currentPage.appendChild(node)` adds a node to the page — similar idea to `appendChild()` in the DOM, which you've already used.
> - `figma.closePlugin()` ends the plugin run.
>
> ## The code
>
> ```js
> // The volunteers' names, as an array of objects
> const volunteers = [
>   { first: "Ava", last: "Nguyen" },
>   { first: "Ben", last: "Ortiz" },
>   { first: "Carla", last: "Diaz" },
>   { first: "Dan", last: "Kim" },
>   { first: "Ella", last: "Brown" },
>   { first: "Finn", last: "Walsh" },
>   { first: "Gia", last: "Patel" },
>   { first: "Hugo", last: "Lopez" },
>   { first: "Ivy", last: "Chen" },
>   { first: "Jax", last: "Reed" },
>   { first: "Kira", last: "Moss" },
>   { first: "Leo", last: "Grant" }
> ]
>
> // Grid layout settings
> const COLUMNS = 4
> const BADGE_WIDTH = 200
> const BADGE_HEIGHT = 100
> const GAP = 20
>
> async function makeBadges() {
>   // Fonts must be loaded before we can set text on a node
>   await figma.loadFontAsync({ family: "Inter", style: "Regular" })
>
>   for (let i = 0; i < volunteers.length; i++) {
>     const volunteer = volunteers[i]
>
>     // Turn the index into a row and column position
>     const column = i % COLUMNS
>     const row = Math.floor(i / COLUMNS)
>
>     // The rectangle background
>     const rect = figma.createRectangle()
>     rect.resize(BADGE_WIDTH, BADGE_HEIGHT)
>     rect.x = column * (BADGE_WIDTH + GAP)
>     rect.y = row * (BADGE_HEIGHT + GAP)
>     rect.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.95, b: 0.9 } }]
>
>     // The name, placed on top of the rectangle
>     const text = figma.createText()
>     text.characters = `${volunteer.first} ${volunteer.last}`
>     text.x = rect.x + 10
>     text.y = rect.y + BADGE_HEIGHT / 2 - 8
>
>     figma.currentPage.appendChild(rect)
>     figma.currentPage.appendChild(text)
>   }
>
>   figma.closePlugin("Badges created")
> }
>
> makeBadges()
> ```
>
> **What each part does:**
> - `volunteers` is your data — an array of objects, same shape you've used for sheet rows.
> - The `for` loop runs once per volunteer. `i % COLUMNS` and `Math.floor(i / COLUMNS)` turn a single index (0 to 11) into a row and column, so badges wrap into a new row every 4 across.
> - Each loop creates a rectangle, positions it with `x`/`y`, and colors it, then creates a text node with the person's name and places it over the rectangle.
> - `appendChild` adds both nodes to the current page — text is appended after the rectangle, so it sits visually on top.
> - `makeBadges()` is `async` because loading the font requires `await`; the function runs once when the plugin starts.
>
> ## To try it
>
> 1. Create the plugin folder through Figma's **New Plugin** flow so `manifest.json` is set up correctly, and paste this into the generated `code.js` (replacing the boilerplate).
> 2. Open a Figma file, run the plugin from **Plugins > Development**.
> 3. Check the current page — you should see 12 badges in a 4-column grid. If something looks wrong, Ctrl+Z undoes it, and the plugin's console will show errors.
>
> Want me to extend this to read the names from a Google Sheet instead of the hardcoded array, once this version works?
:::

Again, the reply starts with what's different: a `figma` object instead of `document`, colors from 0 to 1 instead of 0 to 255, and fonts that must be loaded with `figma.loadFontAsync` before setting any text, the most common Figma plugin mistake and a line for any Figma platform profile. The grid layout uses `%` and `Math.floor`, arithmetic you could work out yourself.

And one thing to catch: the twelve volunteers are made up. None of them is in the club. The request said "12 garden club volunteers" without giving names, so the assistant invented them, as assistants always fill gaps. The club's real roster is in `club-data.json`, and the next step would be to paste it in, or have the plugin read it.

## Automating Services: Zapier and Make

In [Automation Workflows with n8n](n8n){.book-link}, you built workflows on your own computer. **Zapier** and **Make** are the best-known online services for the same idea: connect a trigger in one app to actions in others, with no computer of your own to keep running. Both have free plans with limits on how many tasks run each month, and both have steps that run JavaScript, though which plans include them changes, so check the current terms.

```{.code environment="none"}
I use n8n on my computer. I'm considering Zapier or Make instead,
so that our club's automations keep running when my laptop is off.
Compare them with n8n for a small club: what's free, what isn't,
and how their code steps differ from n8n's Code node.
```

## Scripting a Mac: JavaScript for Automation

On a Mac, **JavaScript for Automation**, or JXA, can control apps such as Finder, Mail, Calendar and Music, using the same system as the older AppleScript. It's built in and free, but it's Mac-only and not much used, so assistants' knowledge of it is thin and often out of date: a good candidate for a careful platform profile.

```{.code environment="none"}
I'd like to try JavaScript for Automation (JXA) on my Mac, in the
Script Editor app. Show me a script that lists today's events from
the Calendar app. Tell me which parts are JXA-specific, and anything
you're unsure about, since JXA is less documented than most JavaScript.
```

## Other Runtimes: Deno and Bun

**Deno** and **Bun** are alternatives to Node: they run JavaScript on your computer and on servers, like Node, with different priorities. Deno is careful about permissions: a script can't read files or use the network unless you allow it when you run it, which is an interesting answer to the trust questions this book keeps asking. Bun is built for speed, and includes its own package manager and test runner. Both run TypeScript directly, and both run most Node code. Deno is also what powers the JavaScript notebooks mentioned in [Analyzing and Charting Data](charts){.book-link}.

```{.code environment="none"}
I know Node.js. Explain what's different about Deno, especially its
permissions. Rewrite my Node script that reads harvests.json and prints
totals by crop so it runs with Deno, and show the command to run it
with only the permissions it needs.
```

## Apps: Desktop and Mobile

The HTML, CSS and JavaScript from Part III can become real applications:

- **Desktop apps** for Windows, Mac and Linux, with **Electron**, which is how apps such as VS Code itself are built, or the lighter **Tauri**.
- **Mobile apps** for iPhone and Android, with **React Native**, often through a toolkit called **Expo**, which lets you try your app on your own phone for free. Publishing in the app stores costs money, and has review rules.

These are big frameworks, and most apps built with them use a front-end library such as **React**, which is worth learning first. It's a natural next step after Part III.

```{.code environment="none"}
I've built web pages with HTML, CSS and JavaScript, using the DOM
directly. I'd like to learn React, then build a small mobile app with
Expo that shows our garden club's upcoming shifts from our API. Suggest
a learning path in small steps, and tell me which step needs which new
concepts.
```

## Creative Coding: p5.js

**p5.js** is a free library for drawing, animation and interactive art in the browser, with a friendly online editor at editor.p5js.org, built for artists, designers and beginners. It's a very different use of the same language, and a fun one: a garden that grows on screen as the harvest totals come in, for example.

```{.code environment="none"}
Using p5.js in the online editor, draw eight raised garden beds as
rectangles, and grow a plant in each one whose height matches that
bed's harvest total. The totals are: B1 9.5, B2 10, B3 14.4, B4 7.6,
B5 6, B6 1.3, B7 8.5, B8 13.6 kilograms. Explain what setup() and
draw() are for.
```

## TypeScript, Everywhere

You met **TypeScript** in [Office Scripts and TypeScript](office-scripts){.book-link}, if you took that lesson, and several stops on this tour use it: Figma plugins, Deno, Bun, and much of the professional JavaScript world. If you plan to keep programming, it's the most useful next language, because it *is* JavaScript, with types that catch mistakes before your code runs. Everything you know carries over.

```{.code environment="none"}
I know JavaScript well, including functions, objects, arrays, async and
modules, but not TypeScript. Teach me TypeScript by converting one of my
own scripts, step by step. Start with type annotations for function
parameters, then interfaces for objects, and explain each error the
TypeScript checker reports.
```

## Using the Starter Prompts

Each starter prompt above follows the same pattern, and you can write your own for anything:

- **Say what you already know,** so the assistant can connect the new platform to it.
- **Ask what's different,** because that's where the platform's pitfalls are.
- **Ask for a small, real example,** preferably one you care about.
- **Ask what the assistant is unsure of,** which is especially important for less common platforms.

Then do what you did with JADE: check the reply against the platform's documentation, collect what you learn into a platform profile, and add a line each time you catch a mistake.

## Your Learner Profile

::: {.ai-profile lesson="tour"}
Add to "What I know so far":

- other places JavaScript runs: Scriptable, Figma and Penpot plugins, Zapier and Make, JXA on a Mac, Deno and Bun, Electron and Tauri, React Native and Expo, and p5.js
- writing starter prompts to begin learning a new platform
:::

## Summary

JavaScript runs in far more places than one book can teach: on phones with Scriptable, in design tools as Figma and Penpot plugins, in online automation services like Zapier and Make, on Macs with JXA, in the Deno and Bun runtimes, in desktop and mobile apps built with Electron, Tauri and React Native, and in creative coding with p5.js. On each, the language is the same, and the platform provides its own objects, its own way of running code and its own pitfalls. A good starter prompt says what you know, asks what's different, asks for a small real example, and asks what the assistant isn't sure of; and, as the invented volunteers in the Figma reply show, it gives the assistant your real data, or it will make some up. In the last lesson, you'll turn everything you've learned about learning into a plan of your own.
