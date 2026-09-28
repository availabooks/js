---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Run n8n on your own computer, and describe a workflow as a trigger followed by nodes.
2. Explain how data moves through a workflow as items, each with a `json` object.
3. Write JavaScript for n8n's Code node, using `$input` and returning items.
4. Build a scheduled workflow that fetches data, makes a decision and posts a message.
5. Decide when a workflow tool is a better choice than a script, and the reverse.
:::
:::

## Boxes and Arrows

Many automation jobs have the same shape: *when* something happens, *get* some data, *decide* something, and *send* a result somewhere. You've written that shape as code several times: the weather check in [Talking to Web Services](web-services){.book-link}, the weekly report in [Building Command-Line Tools](cli){.book-link}. **Workflow tools** let you build it by connecting boxes on a screen instead, each box doing one step, with code only where you need it.

**n8n** is a popular one, and it's built on Node, so you can run it on your own computer for free. (Its license allows free use for personal and internal purposes; check its terms for anything else.) Well-known alternatives that run online, such as **Zapier** and **Make**, work the same way; their free plans are more limited, and whether they allow code steps depends on the plan.

In n8n, a workflow is made of **nodes**. The first is a **trigger**, which starts the workflow: a schedule, a web request, a new row in a spreadsheet. Each node after it does one job, such as calling an API, filtering data or sending a message, and passes its results along the connection to the next.

::: {.term}
> **Workflow** — In a tool like n8n, a trigger and a series of connected steps, called nodes, that run automatically, passing data from each step to the next.
:::

### Starting n8n

With Node installed, run this in a terminal:

<pre class="code" data-environment="none">
npx n8n
</pre>

`npx`, which you used in [Automating the Web with Playwright](playwright){.book-link}, downloads n8n the first time, which takes a few minutes, and starts it. When it's ready, it prints an address, `http://localhost:5678`. Open that in your browser. **localhost** means "this computer": n8n is running as a small web server on your own machine, and the browser is its screen. You'll build servers of your own in the next part of the book.

The first time, n8n asks you to create an owner account, which is stored on your computer. Then you're in the workflow editor.

::: {.screenshot-needed file="images/n8n-editor.png"}
The n8n workflow editor showing a Schedule Trigger node connected to an HTTP Request node, a Code node, an IF node and a final HTTP Request node, with the Code node's editor panel open.
:::

Two things follow from running n8n this way. Your workflows only run **while n8n is running**, so while your computer is on and the terminal is open; a closed laptop means a missed Monday. And stopping it is the same as stopping any Node program: **Ctrl+C** in the terminal. For workflows that must run reliably, n8n can be installed on a server, or used as a paid online service.

## Items

Data moves between nodes as a list of **items**. Each item is an object with a `json` property, which holds the actual data:

<pre class="code" data-environment="none">
[
  { "json": { "date": "2027-06-12", "task": "watering", "memberEmail": "ava.lopez@example.com", "hours": 1.5 } },
  { "json": { "date": "2027-06-12", "task": "weeding", "memberEmail": "ben.okafor@example.com", "hours": 1 } }
]
</pre>

A node usually runs once for each item it receives. In a node's settings, you can refer to the current item's data with an **expression** in double curly braces, such as `{{ $json.memberEmail }}`, which n8n replaces with the value. It's the same idea as `${ }` in a template literal.

## The Code Node

When no ready-made node does what you need, the **Code node** runs JavaScript. Here's a request for one, in a new chat with your learner profile from [Calling AI Models from Your Code](ai-api){.book-link}:

::: {.ai-conversation prompt="I'm building a workflow in n8n, running on my computer. A node before my Code node outputs one item per volunteer shift, each with the fields date, task, memberEmail and hours. Write the JavaScript for the Code node that outputs one item per member with their total hours, largest first." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="ai-api" transcript="n8n/code-node"}
> Here's the code for the Code node:
>
> ```javascript
> const items = $input.all()
>
> // Add up hours for each member, keyed by their email
> const totals = {}
> items.forEach(item => {
>   const email = item.json.memberEmail
>   const hours = Number(item.json.hours)
>
>   if (totals[email] === undefined) {
>     totals[email] = 0
>   }
>   totals[email] = totals[email] + hours
> })
>
> // Turn the totals object into an array of {memberEmail, totalHours}
> const result = Object.keys(totals).map(email => ({
>   memberEmail: email,
>   totalHours: totals[email]
> }))
>
> // Sort so the member with the most hours comes first
> result.sort((a, b) => b.totalHours - a.totalHours)
>
> // Check: print counts so you can confirm the numbers look right
> console.log(`Combined ${items.length} shifts into ${result.length} members`)
>
> // n8n expects each output item wrapped in an object with a "json" property
> return result.map(row => ({ json: row }))
> ```
>
> What each part does:
>
> - `$input.all()` gets every item coming into the node — one per volunteer shift.
> - The `forEach` loop goes through each shift and adds its hours to a running total for that member's email, stored in the `totals` object. `Number(...)` converts the hours value in case it arrives as text.
> - `Object.keys(totals).map(...)` turns that object (email → total) into an array of plain objects, one per member.
> - `result.sort(...)` sorts by `totalHours` from largest to smallest. Subtracting `a.totalHours` from `b.totalHours` puts the bigger number first.
> - The `console.log` line prints how many shifts came in and how many members came out, so you can check that no one got lost or double-counted.
> - The last line wraps each result in `{ json: ... }`, which is the shape n8n requires for output items.
>
> One thing to double check: this assumes `memberEmail` is written consistently (same capitalization, no extra spaces) for each volunteer — otherwise the same person could get split into two totals. Want me to add a step that trims and lowercases the email before grouping?
:::

**Read.** The middle of it is the counting-by-name pattern you know. The n8n parts are at the start and the end:

- **`$input.all()`** gives every item coming into the node, as an array. Each item's data is in `item.json`.
- **The last line** wraps each result as `{ json: row }`, because n8n requires every output item to have that shape. Forgetting the wrapper is the most common Code node mistake.

The assistant added a check that prints counts, following your profile's rule, and suggested cleaning up the emails before grouping, since `Ava.Lopez@example.com` and `ava.lopez@example.com` would count as two people. Both are good habits. One detail: in the Code node, `console.log` output goes to your *browser's* developer console, not to the node's output panel, so press F12 in the browser to see it.

This reply uses n8n's current way of writing Code node JavaScript. Much of what you'll find online, including in some AI replies, is older: a node called **Function**, which the Code node replaced, and a variable called `items` instead of `$input.all()`. If code from somewhere else refers to `items` or a Function node, it was written for an older version, and needs updating. Like the stale menus and model names you've met before, it's a sign to check the documentation.

## The Monday Watering Workflow

Continuing the chat, the whole workflow, and a bigger question:

::: {.ai-conversation prompt="Now the whole workflow. Every Monday at 7:00 it should get the weather forecast from Open-Meteo for latitude 40.25 and longitude -111.65, decide whether the beds need watering this week (less than 5 mm of rain expected over the next 7 days), and if so post a message to our Discord channel through its incoming webhook. What nodes do I need, and what does each one do? And when is n8n a better choice than the Node scripts I've been writing?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="ai-api" transcript="n8n/code-node"}
> Here's the workflow, node by node:
>
> ## Nodes
>
> **1. Schedule Trigger**
> Starts the workflow automatically. Set it to trigger weekly, Monday at 7:00 (n8n's trigger node has a "Weeks" interval option, or you can use a cron expression like `0 7 * * 1`). This replaces what cron or Windows Task Scheduler would do for a Node script.
>
> **2. HTTP Request**
> Calls Open-Meteo to get the forecast. Method: GET. URL:
> ```
> https://api.open-meteo.com/v1/forecast?latitude=40.25&longitude=-111.65&daily=precipitation_sum&timezone=auto&forecast_days=7
> ```
> This returns JSON with a `daily.precipitation_sum` array — one number per day, in millimeters. Open-Meteo doesn't require an API key for this kind of use, but since it's someone else's service, worth glancing at their terms of use page for any limits on frequency (once a week is very light, so you should be fine).
>
> **3. Code**
> Adds up the week's rain and decides whether watering is needed:
>
> ```javascript
> const forecast = $input.first().json
>
> const totalRain = forecast.daily.precipitation_sum.reduce((sum, mm) => sum + mm, 0)
>
> const needsWatering = totalRain < 5
>
> console.log(`Total rain forecast: ${totalRain} mm, needsWatering: ${needsWatering}`)
>
> return [{
>   json: {
>     totalRain,
>     needsWatering,
>     message: `Forecast rain this week: ${totalRain.toFixed(1)} mm. Beds need watering.`
>   }
> }]
> ```
> - `$input.first().json` gets the single item from the HTTP Request node.
> - `reduce` adds every day's precipitation into one total.
> - `needsWatering` is `true` if the total is under 5 mm.
> - The `console.log` line lets you check the number in the execution log before trusting the branch below.
>
> **4. IF**
> Checks `{{$json.needsWatering}} === true`. Only items on the "true" branch continue to the next node — this is how you avoid posting when watering isn't needed.
>
> **5. HTTP Request (POST to Discord)**
> On the true branch, sends the message. Method: POST, body (JSON):
> ```json
> { "content": "{{$json.message}}" }
> ```
>
> **About the webhook address:** don't type it directly into the node's URL field where it'll sit in plain text in the workflow. n8n has two better options:
> - If a built-in **Discord node** with webhook support exists in your version, it can store the webhook as a saved credential (encrypted by n8n), which is the cleaner path.
> - Otherwise, store it as an environment variable when you start n8n (similar to a `.env` file) and reference it in the URL field. I'm not fully certain of the exact steps for this in your n8n version — it's changed between versions — so check n8n's own documentation for "environment variables in expressions" before relying on it.
>
> Either way, **test with a dry run first**: point the webhook at a private test channel, or temporarily disconnect the final node and just check the Code node's output in the execution log, before letting it post to your real channel automatically.
>
> ## Who sees what
>
> The Discord message is visible to everyone in that channel. It contains only forecast rain totals — no personal data — so that's low risk, but worth keeping in mind if the channel is more widely shared than you expect.
>
> ## n8n vs. the Node scripts you've been writing
>
> **n8n is a better fit when:**
> - You need a *schedule* — it has a trigger node built in, so you don't need cron or Task Scheduler.
> - The task is mostly "fetch something, check a condition, send it somewhere" — n8n's nodes already handle HTTP calls, JSON, and branching, so there's less boilerplate.
> - You want to *see* the flow and its history — every run is logged with its data, so you can inspect what happened without adding your own logging.
> - Secrets (like the webhook) can be stored in n8n's credential system, separate from the workflow logic.
>
> **A Node script is a better fit when:**
> - The logic is genuinely complex — deep data processing, custom algorithms, or things array methods and functions handle more clearly in code than in a chain of nodes.
> - You want it in version control (Git) as readable text, not as an exported JSON workflow.
> - You need libraries beyond what's easy to reach in a Code node, or want to write tests for your functions.
> - You're building something reusable, like a command-line tool, rather than a background automation.
>
> A common pattern: use n8n for the *plumbing* (schedule, fetch, branch, send), and drop into a Code node — just like you did here — when a step needs real logic.
:::

**Read the workflow node by node,** and compare it with the code you wrote for the same job in [Talking to Web Services](web-services){.book-link}:

1. **Schedule Trigger** replaces Apps Script's time-driven trigger, or Task Scheduler.
2. **HTTP Request** replaces `UrlFetchApp.fetch`, with the same Open-Meteo address you read in that lesson.
3. **Code** adds up the week's rain with `reduce` and decides. `$input.first().json` is the single item from the HTTP Request node: the forecast.
4. **IF** sends items down a *true* or *false* branch. In the IF node's settings, you choose the field, `{{ $json.needsWatering }}`, and the condition from a list, such as *is true*, rather than typing `=== true` as the reply shows.
5. **HTTP Request** on the *true* branch posts the message to Discord, with the body `{ "content": ... }` that Discord expects, as in [Talking to Web Services](web-services){.book-link}.

The workflow is the same logic as the script, spread across boxes. What changed is that the schedule, the web requests and the branching are handled by nodes you configure instead of code you write, and the only code left is the part that makes a decision.

**The webhook address** is still a secret. The assistant's advice is right: n8n has a **Credentials** feature that stores secrets encrypted, separately from the workflow, and some nodes, including its Discord node, can use them. It was honest about not being sure of the details for using environment variables in your version; n8n has changed how, and whether, workflows can read environment variables, so check its documentation. And the advice to test first, with a private test channel or the last node disconnected, is your dry-run rule in a new setting.

**To test it now,** instead of waiting for Monday, click **Test workflow** (or **Execute workflow**) in the editor. Every node shows the items it produced, so you can check each step: the forecast from Open-Meteo, the Code node's total and decision, and which branch the IF node took. That view is one of the best reasons to use a workflow tool.

## Wire or Write?

The assistant's comparison is thoughtful, and worth keeping. In short:

| Choose a workflow tool when | Choose a script when |
|---|---|
| The job is mostly connecting services: fetch, check, send | The logic is complicated, or needs careful testing |
| There's a ready-made node for each service | You need packages or tools a Code node can't reach |
| You want to see each run's data without writing logging | You want the code in plain text files, to share or keep in version control |
| Someone who doesn't program may need to change it | It's a tool people will run themselves, such as a command |

And the pattern the reply ends with is the one most people settle on: **nodes for the plumbing, code for the decisions.** The schedule, the requests and the posting are nodes; the one step that needs real logic is a Code node.

### An AI step

n8n also has nodes for calling AI models, the kind of call you wrote by hand in [Calling AI Models from Your Code](ai-api){.book-link}. The same rule applies inside a workflow: let a Code node calculate the numbers, give them to the model, and have a person check the result before it's published. In a workflow, that can mean posting the model's draft to a private channel for a volunteer to review, rather than straight to the whole club.

## Your Learner Profile

::: {.ai-profile lesson="n8n"}
Add rules:

- In n8n's Code node, use $input.all() or $input.first(), and return items as objects with a json property.

Add to "What I know so far":

- n8n: running it with npx n8n, workflows, triggers, nodes and items
- expressions such as {{ $json.field }}
- the Schedule Trigger, HTTP Request, Code and IF nodes, and n8n credentials for secrets
- that older n8n examples use a Function node and an items variable
- localhost, a server running on my own computer
- choosing between a workflow tool and a script
:::

The rule is a small platform profile of its own, in one line, heading off the two mistakes you're most likely to see in n8n code from elsewhere. This is the end of Part VI, and your environment line still says Node.js on your own computer, which remains true for n8n.

## Summary

n8n builds automations as workflows: a trigger, such as a schedule, followed by nodes that each do one step, passing data along as items, each with a `json` object. It runs on your own computer with `npx n8n`, as a small server at `localhost:5678`, so it only runs while your computer does. Expressions like `{{ $json.field }}` use an item's data in a node's settings, and the Code node runs JavaScript, reading items with `$input` and returning `{ json }` objects; older examples use a Function node and `items` instead. The Monday watering check becomes a Schedule Trigger, two HTTP Requests, a Code node and an IF node, with the webhook address stored in n8n's credentials. Workflow tools are best for connecting services, and scripts for complex logic; many automations use both, with nodes for the plumbing and code for the decisions. That's the end of Part VI. Next, you'll build servers of your own.
