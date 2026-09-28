---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Split code across files with `export` and `import`, and recognize the older `require` style.
2. Explain what `package.json` is for, and why ES modules need `"type": "module"`.
3. Read object shorthand and destructuring, such as `const { total } = results`.
4. Install a package from npm, and explain what `node_modules` and `package-lock.json` are.
5. Decide whether a package is worth installing, and check whether a built-in feature would do.
:::
:::

## Code in More Than One File

As a project grows, one file gets long. The usual answer is to split it into **modules**: files that each hold related code, and share it with the others. You did something similar in JADE, in [Sharing and Reusing Code](sharing-code){.book-link}, with `jade_modules`. Node has a standard way to do it, and it's the same way modern JavaScript does it in browsers too.

Here's the question, in a new chat with your learner profile from [Installing Node and Running Scripts](node){.book-link}:

::: {.ai-conversation prompt="I have a file garden.js with two functions, totalKilograms(harvests) and kilogramsByBed(harvests). I want to use them from another file, report.js, in the same folder. How do I do that?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="node" transcript="node-modules/split"}
> Good question! This uses a Node.js feature you haven't covered yet: **modules** — the system Node uses to share code between files. Let me walk you through it.
>
> ### Step 1: Export the functions in garden.js
>
> At the bottom of `garden.js`, add:
>
> ```js
> module.exports = { totalKilograms, kilogramsByBed }
> ```
>
> - `module.exports` is a special object Node gives every file.
> - Whatever you put on it becomes available to other files that load this one.
> - `{ totalKilograms, kilogramsByBed }` is a shorthand for `{ totalKilograms: totalKilograms, kilogramsByBed: kilogramsByBed }` — it packages both functions into one object.
>
> ### Step 2: Import them in report.js
>
> At the top of `report.js`, add:
>
> ```js
> const { totalKilograms, kilogramsByBed } = require("./garden.js")
> ```
>
> - `require("./garden.js")` runs that file and gives you back whatever it put in `module.exports`.
> - `const { totalKilograms, kilogramsByBed } = ...` pulls those two functions out of that object and gives you local names for them, so you can call them just like normal functions.
> - The `./` means "look in this same folder" — it's a relative path, like the ones you've used for web pages.
>
> ### Step 3: Use them
>
> Now in `report.js` you can write:
>
> ```js
> const harvests = [
>   ["Tomatoes", "A", 5],
>   ["Beans", "B", 3]
> ]
>
> console.log(totalKilograms(harvests))
> console.log(kilogramsByBed(harvests))
> ```
>
> ### Running it
>
> In the terminal, make sure you're in the folder with both files, then run:
>
> ```
> node report.js
> ```
>
> Want me to show the full contents of both files together so you can see it end to end?
:::

**Read.** `garden.js` puts its functions on `module.exports`, and `report.js` gets them with `require("./garden.js")`. The `./` means "in this folder," the relative path you know. Two pieces of syntax are new, and the assistant explained both:

- **`{ totalKilograms, kilogramsByBed }`** is an object written in **shorthand**. When a property has the same name as the variable holding its value, you can write the name once. It means `{ totalKilograms: totalKilograms, kilogramsByBed: kilogramsByBed }`.
- **`const { totalKilograms, kilogramsByBed } = require(...)`** is **destructuring**: it creates two variables and fills each with the property of the same name from the object on the right. It's a shorter way of writing `const garden = require(...)`, then `const totalKilograms = garden.totalKilograms`, and so on.

Try both here:

```{.code}
const bed = "B3"
const kilograms = 14.4
// shorthand: the property names come from the variable names
const result = { bed, kilograms }
console.log(result)

// destructuring: variables filled from the properties of the same names
const { bed: whichBed, kilograms: howMuch } = result
const { kilograms: total } = result
console.log(whichBed, howMuch, total)
```

(A colon inside destructuring gives the variable a different name from the property, as `bed: whichBed` does, so that this example doesn't clash with the `bed` variable above.)

::: {.term}
> **Destructuring** — Creating variables from the properties of an object, or the items of an array, in one statement: `const { crop, bed } = planting`.
:::

## Two Ways to Share Code

The reply works, but it uses the older of two module systems. So ask for the other:

::: {.ai-conversation prompt="My textbook uses import and export instead of require and module.exports. How would I write it that way?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="node" transcript="node-modules/split"}
> Good catch — Node supports two module systems, and your textbook is using the newer one: **ES modules** (`import`/`export`), instead of the older **CommonJS** style (`require`/`module.exports`). Here's how to write it that way.
>
> ### Step 1: Export the functions in garden.js
>
> Instead of a separate `module.exports` line, you put `export` in front of each function:
>
> ```js
> export function totalKilograms(harvests) {
>   // ...existing code
> }
>
> export function kilogramsByBed(harvests) {
>   // ...existing code
> }
> ```
>
> - `export` marks a function as available to other files.
>
> ### Step 2: Import them in report.js
>
> At the top of `report.js`:
>
> ```js
> import { totalKilograms, kilogramsByBed } from "./garden.js"
> ```
>
> - This pulls in just those two names from `garden.js`.
> - Notice there's no `const` and no `require` — `import` is its own statement, not a value you're storing.
>
> ### Step 3: Tell Node to use this system
>
> By default, Node expects the older `require` style. To use `import`/`export`, you need a small config file.
>
> Create a file named `package.json` in the same folder, with this content:
>
> ```json
> {
>   "type": "module"
> }
> ```
>
> - This tells Node: "treat `.js` files in this project as ES modules," which turns on `import`/`export` and turns off `require`.
>
> ### Running it
>
> Same as before:
>
> ```
> node report.js
> ```
>
> Want me to show the full contents of both files together with this style, so you have a working example to compare against?
:::

That's exactly right. JavaScript has two module systems, and you'll see both:

- **CommonJS**, Node's original system: `require(...)` and `module.exports`. Most Node code written before about 2020 uses it, so assistants, which learned from that code, often reach for it first.
- **ES modules**, the standard built into the JavaScript language itself: `import` and `export`. Browsers use them, and modern Node projects do too. This book uses them.

::: {.term}
> **ES module** — A JavaScript file that shares code with `export` and uses others' code with `import`. It's the language's standard module system, used by browsers and modern Node projects.
:::

Node needs to be told which system a project uses, which is what `"type": "module"` in `package.json` does. (Naming a file with `.mjs` instead of `.js` also marks it as an ES module. Recent versions of Node can often detect `import` statements on their own, with a warning, but saying so in `package.json` makes it certain.) Mixing the two systems gives errors you'll learn to recognize:

- **`SyntaxError: Cannot use import statement outside a module`** means Node treated the file as CommonJS. Add `"type": "module"` to `package.json`.
- **`ReferenceError: require is not defined in ES module scope`** means the reverse: `require` in an ES module. Change it to `import`.

When an assistant's reply has `require`, it's CommonJS, and it's worth asking for the `import` version, as you'll make a profile rule to do.

## package.json

`package.json` is a project's settings file, in JSON. You can write it by hand, as the reply did, or create it by running `npm init -y` in the project folder, which fills in some standard fields. A typical one looks like this:

```{.code environment="none"}
{
  "name": "garden-scripts",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "report": "node report.js"
  },
  "dependencies": {
    "date-fns": "^4.4.0"
  }
}
```

- **`type`** chooses the module system.
- **`scripts`** gives commands short names: with this one, `npm run report` runs `node report.js`. For a project with several tools, it's a handy list of what the project can do.
- **`dependencies`** lists packages the project uses, which the next section explains.

## Packages and npm

A **package** is code someone has published for others to use, and **npm**, which comes with Node, is the tool and the online registry for sharing them. There are millions of packages, for nearly everything. Here's a question about one, in a new chat:

::: {.ai-conversation prompt="My project uses import and export, with type set to module in package.json. I want my garden report to show dates like Saturday, June 12. Is there an npm package that does that, and how do I use it?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="node" transcript="node-modules/package"}
> For this, you don't need an npm package — JavaScript itself has a built-in tool for formatting dates: `Intl.DateTimeFormat`. It's not on your "known" list, so here's a quick explanation before I show you the code.
>
> `Intl.DateTimeFormat` takes a locale (like `"en-US"`) and an options object describing which parts of the date you want (weekday, month, day), and gives you back a formatter. Calling `.format()` on it with a `Date` turns that date into text.
>
> ```js
> const gardenDate = new Date(2025, 5, 12) // June 12, 2025 (month is 0-based, so 5 = June)
>
> const formatter = new Intl.DateTimeFormat("en-US", {
>   weekday: "long", // "Saturday"
>   month: "long",   // "June"
>   day: "numeric"   // "12"
> })
>
> const dateText = formatter.format(gardenDate)
>
> console.log(dateText) // Saturday, June 12
> ```
>
> What each line does:
> - `new Date(2025, 5, 12)` creates the date you already know how to make.
> - `new Intl.DateTimeFormat("en-US", { ... })` builds a formatter set up to spell out the weekday and month name.
> - `formatter.format(gardenDate)` runs that date through the formatter and returns the text.
>
> This works with plain Node.js — no `npm install`, no import needed, since `Intl` is a global built into JavaScript.
>
> **If you'd rather use a package anyway** (some projects do, for more formatting options), the common ones are `date-fns` and `dayjs`. Both would need `npm install` and an `import` line, and their docs are npm's own registry pages I'd want to point you to rather than guess exact syntax from memory. But for something as simple as "Saturday, June 12," `Intl.DateTimeFormat` should do everything you need.
>
> Want to try it with a date read from a sheet or file, or is this just for a single report date?
:::

This is good advice, and it's the first thing to know about packages: check whether JavaScript can already do the job. **`Intl.DateTimeFormat`** is built in, in Node and in browsers, and formats dates in any language's style. You can try it right here.

But check the example before trusting it. The comment says the result is "Saturday, June 12," for June 12, 2025. Run it:

```{.code}
const formatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric"
})
console.log(formatter.format(new Date(2025, 5, 12)))
console.log(formatter.format(new Date(2027, 5, 12)))
```

June 12, 2025 was a Thursday. The assistant wrote the output it expected, from your request, instead of the output the code produces. (June 12, 2027, in the club's season, is the Saturday.) A comment that shows a result is a claim, and running the code is how you check it.

### Installing a package

Built-in features won't always be enough. When you need a package, installing one looks like this, run in the project folder:

```{.code environment="none"}
npm install date-fns
```

Three things happen:

- The package, and any packages *it* depends on, are downloaded into a folder named **`node_modules`** in your project.
- It's added to `dependencies` in `package.json`.
- A file named **`package-lock.json`** records the exact version of every package installed, so the project can be installed the same way again later.

Then you import it by name, without `./`, and use it according to its documentation:

```{.code environment="nodejs"}
import { format } from "date-fns"

console.log(format(new Date(2027, 5, 12), "EEEE, MMMM d"))
```

That prints *Saturday, June 12*. The `"EEEE, MMMM d"` is a pattern from date-fns's documentation: `EEEE` is the weekday's full name, `MMMM` the month's, and `d` the day. The assistant said it would rather point you to the documentation than guess this syntax from memory, which, as you know by now, is a sign of a good answer.

`node_modules` can hold thousands of files. Never edit them, and don't copy or share the folder: anyone with your `package.json` and `package-lock.json` can recreate it by running `npm install`. If you use Git later, `node_modules` is always left out.

::: {.term}
> **npm** — The package manager that comes with Node, and the online registry of published packages. `npm install name` adds a package to a project.
:::

## Is a Package Safe?

Installing a package means running a stranger's code on your computer. So, continuing the chat:

::: {.ai-conversation prompt="How do I know whether an npm package is safe to install?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="node" transcript="node-modules/package"}
> Good instinct to ask before running `npm install` — that command downloads code from strangers and runs setup scripts on your computer automatically. Here are practical things to check:
>
> **Before installing:**
>
> - **Look at weekly downloads and GitHub stars** on the [npmjs.com](https://www.npmjs.com) page for the package. A package with millions of downloads (like `date-fns`) has been used and scrutinized by a lot of people. One with 12 downloads a week is riskier — not necessarily bad, but unproven.
> - **Check when it was last updated.** A package untouched for 5+ years might be abandoned, though for something simple that's not always bad. A package updated yesterday by a brand-new account is worth more caution.
> - **Look at the number of dependencies.** A date-formatting package that pulls in 40 other packages has a bigger "supply chain" — more chances something in that chain is compromised. Fewer dependencies is generally safer.
> - **Read the README quickly.** Does it look like a real project with documentation, or a thin wrapper with no explanation?
> - **Check who maintains it.** Is it a known organization (like the `date-fns` team) or a solo unnamed account?
>
> **A command that helps:**
>
> ```
> npm audit
> ```
>
> Run this in your project folder after installing. It checks your installed packages against a database of known security problems and tells you if anything needs an update.
>
> **General rule of thumb:**
>
> For something small and common — like date formatting — stick to well-known, heavily-downloaded packages (`date-fns`, `dayjs`, `lodash`, etc.). For obscure one-off packages solving a tiny problem, ask yourself whether you could just write the few lines of code yourself instead, like we did with `Intl.DateTimeFormat` above. Fewer installed packages means fewer strangers' code running on your machine.
>
> Want me to walk through checking a specific package you're considering?
:::

That's a solid checklist, and it's the same question you asked about gists in [Sharing and Reusing Code](sharing-code){.book-link} and plugins in [Scripting Your Notes in Obsidian](obsidian){.book-link}: how widely used is it, is it maintained, and who's behind it? Two more things to add:

- **Check the name carefully.** Attackers publish packages with names one letter off from popular ones, hoping for typos, such as `date-fsn` for `date-fns`. An assistant can also suggest a package name that doesn't exist, or suggest a real package for the wrong job. Look the package up on npmjs.com before installing it.
- **Installing can run code.** Some packages run a setup script when installed, before you've used them at all. That's another reason to install only packages you've checked.

The assistant's closing advice is the most useful: for small jobs, a few lines of your own code, or a built-in feature, is often better than a package. Every package you add is code you're trusting, and code that can break when it updates.

## Your Learner Profile

::: {.ai-profile lesson="node-modules"}
Add rules:

- Use ES modules, with import and export, not require and module.exports.
- Prefer built-in JavaScript and Node features to packages when they do the job. When you suggest a package, say how widely used it is.

Add to "What I know so far":

- ES modules: export and import, and "type": "module" in package.json
- recognizing CommonJS: require() and module.exports
- object shorthand, such as { bed, kilograms }, and destructuring, such as const { bed } = planting
- package.json, including scripts run with npm run
- npm install, node_modules and package-lock.json
- Intl.DateTimeFormat for formatting dates
- checking whether a package is trustworthy before installing it
:::

The first rule heads off the most common module mix-up. The second builds this lesson's best advice into every request.

## Summary

Modules let a project's code live in several files. ES modules share code with `export` and use it with `import`, and need `"type": "module"` in `package.json`; the older CommonJS system, with `require` and `module.exports`, is still common in code and AI replies. `package.json` holds a project's settings, including its module system, named scripts and dependencies. npm installs packages into `node_modules`, and `package-lock.json` records their exact versions. Before installing a package, check whether JavaScript already has what you need, as `Intl.DateTimeFormat` did for dates, and check the package's name, popularity, maintenance and authors. Comments that show a result are claims, so run the code. Next, you'll use Node's built-in modules to work with files and folders.
