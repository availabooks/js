---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Describe how your learner profile changed over the book, and why each kind of change happened.
2. Tell scaffolding rules, which come off as you learn, from lasting habits, which stay.
3. Prune a profile that has grown too long, and rewrite it for where you are now.
4. Write a learning profile and a learning path for a new subject, and check an assistant's draft of one.
:::
:::

## Where You Started

In [Working with an AI Assistant](ai-assistant){.book-link}, your learner profile was a few lines: you were a beginner, your code ran in an online editor, and you knew nothing yet. The assistant's first reply to it was a single line, `console.log("Hello")`.

By the last lesson, the profile had 29 rules and 238 items under "What I know so far," about 3,500 words. Along the way, its environment line changed eight times, from an online editor to Google Sheets, web pages, Excel, Airtable, Obsidian, Node and, finally, servers and Cloudflare Workers. That record is worth looking back at, because the way it changed is the method this book set out to teach, and it's the method you'll use to learn the next thing, with or without this book.

## How the Profile Changed

Every change to the profile was one of five kinds:

**Knowledge grew.** Each lesson added what you'd learned to "What I know so far," so the assistant could use it, and would tell you about anything else. This is the part that did the most work. It's why an assistant, asked for a harvest total, gave you a loop in one lesson and an Arquero chain a few parts later.

**Environments changed.** A new part of the book meant a new first paragraph: Apps Script, then web pages, Excel, and on. One sentence told the assistant which tools your code could use, and everything you knew came along.

**Scaffolding came off.** Some rules held back things you weren't ready for, and were removed when you were:

| Rule | Added in | Removed in | What it held back |
|---|---|---|---|
| Put all the code in one function; no extra functions or parameters | [Getting Started with Google Apps Script in Google Sheets](apps-script){.book-link} | [Functions](functions){.book-link} | code split into helpers you couldn't yet follow |
| Use `let` for every variable; don't use `var` or `const` | [Variables and Data](variables){.book-link} | [Functions](functions){.book-link} | deciding which values should stay fixed |
| One step per line; don't chain method calls | [Variables and Data](variables){.book-link} | [Scripting Your Notes in Obsidian](obsidian){.book-link} | long lines that hid their steps |
| `for` loops with an index only | [Loops and Repetition](loops){.book-link} | [Scripting Your Notes in Obsidian](obsidian){.book-link} | loops that hide the counter |

**Rules were corrected.** Some rules were written for one situation and misbehaved in another. "Don't use semicolons" leaked into CSS, in [How Web Pages Work](web-pages){.book-link}, and had to say "in JavaScript." "camelCase names" renamed JADE's required `auto_exec`, in [Sharing and Reusing Code](sharing-code){.book-link}. The dry-run rule started with email and grew to cover calendars, Drive and your own files. Rules for Apps Script became "When I'm working in Apps Script..." so they'd stay without getting in the way elsewhere.

**Habits accumulated.** Most of the 29 rules were never scaffolding. They're how careful programmers work, whatever their skill: compare with `===`, keep secrets out of code, check data where it's stored, do a dry run before anything that can't be undone, print counts you can check, pin library versions, verify requests from a platform, and admit uncertainty. They came from mistakes you watched happen, and they'll stay useful for as long as you write code.

Some things never went in the profile at all: the garden context, sheet descriptions, and the JADE platform profile. The profile describes *you*; those describe data and tools, and you paste them alongside it when they're relevant.

## A Profile That Has Outgrown Itself

The profile has also become a problem. At 3,500 words, it's a lot to paste at the start of every chat, and much of it no longer helps. A list of 238 things you know tells the assistant that you know them, but by now the list is so long that "what I don't know yet" is the more useful information. And its first sentence, "I'm a beginner," isn't true anymore.

This is the natural end of the scaffolding idea: the profile was built to protect a beginner, and it succeeded. What you need now is shorter. Something like this:

```{.code environment="none"}
I've finished a textbook course in JavaScript, and I program for my own
projects. I know modern JavaScript well: functions, objects, array
methods, async/await, ES modules, the DOM, Node.js, and SQL. I've used it
in Google Apps Script, web pages, Excel (Office.js), Node and Cloudflare
Workers. I'm not an expert, so explain anything unusual.

When you write code for me:
- Tell me when a task needs something I may not know, and explain it.
- When you're not sure how something works, say so instead of guessing.
- Keep secrets out of code; check data where it's stored; dry-run anything
  that sends, changes or deletes; print counts I can check.
- Don't use semicolons in JavaScript.
```

It keeps the habits that matter most, in fewer words, and replaces the list of what you know with a summary. You'll adjust it as you go. The point isn't this particular text; it's that a profile should be rewritten, not just added to, as you change.

## A Profile for Something New

Suppose you want to learn Python for data analysis, which many people do after JavaScript. Here's a request for help, sent in a new chat after your full learner profile:

::: {.ai-conversation prompt="I've finished my JavaScript textbook, which had me start every chat with a learner profile like the one I just sent you. Now I want to learn Python for data analysis, the same way. Help me write a new learning profile for that: what it should say about my environment, what I already know from JavaScript, and which scaffolding rules to start with, and when I'd remove each one. Keep it short enough to paste at the start of a chat." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="tour" transcript="learning-profile/python"}
> Here's a profile you can start with, plus notes on why. The pasteable block is short; the removal notes are for your reference (you don't need to paste those every time).
>
> ## Pasteable profile
>
> ```
> I'm learning Python for data analysis, coming from JavaScript (see skills below).
>
> Environment: Python 3, running scripts from the terminal with
> `python filename.py`, in VS Code, on my own computer. I'll use a virtual
> environment (venv) and pip, with a requirements.txt file. For data work:
> pandas for tables, matplotlib or plotly for charts. A script should find
> files next to it using its own folder, not the current working directory.
>
> What I already know (from JavaScript, not Python syntax): variables,
> functions, parameters/return, if/else, comparison and logical operators,
> loops, arrays and objects (map to Python's lists and dicts), JSON,
> try/catch (Python calls it try/except), reading error messages, and array
> methods like filter/map/sort/reduce (teach me Python's equivalents
> explicitly, don't assume I know the syntax).
>
> Scaffolding rules for now:
> 1. Explain new Python syntax or built-ins the first time you use them.
> 2. Point out syntax differences from JS as they come up (indentation
>    instead of braces, no semicolons, snake_case, print(), f-strings).
> 3. After loading, cleaning or combining data, print shape/counts/.head()
>    so I can check it.
> 4. Before a chart, tell me what question it answers and why the chart
>    type is honest.
> 5. Before overwriting or deleting a file, show a dry run or ask first.
> 6. Keep secrets (API keys) in a .env file read with python-dotenv or
>    os.environ, never hard-coded.
> 7. Prefer the standard library and pandas built-ins over new packages;
>    if you suggest one, say how widely used it is.
> 8. If code visits websites automatically, pause between requests and
>    remind me to check robots.txt and terms of use.
> ```
>
> ## When to remove each rule
>
> - **Rule 1 (explain new syntax):** Drop once you notice I'm reusing things like list comprehensions or `with open()` without asking — probably after a few sessions.
> - **Rule 2 (JS vs Python differences):** Drop once the basics (indentation, no semicolons, snake_case) feel automatic — usually fast, within a session or two.
> - **Rule 3 (print counts/shape):** Keep this one indefinitely — it's a data-analysis habit, not a training wheel.
> - **Rule 4 (chart honesty):** Also keep indefinitely, same reason.
> - **Rule 5 (dry run before overwrite/delete):** Keep until you're confident reading pandas' `to_csv`/`to_excel` behavior and always know what a script will touch — then you can ask for it only on new/unfamiliar operations.
> - **Rule 6 (secrets in .env):** Keep indefinitely — it's a security practice, not a learning stage.
> - **Rule 7 (prefer stdlib/pandas, flag package trust):** Keep the "prefer built-ins" part indefinitely; drop the "tell me how widely used" part once you're comfortable checking PyPI download counts yourself.
> - **Rule 8 (scraping etiquette):** Keep indefinitely if you do any web scraping — it's about respecting other sites, not your skill level.
>
> A few things I deliberately left out for now, to add later when relevant: Jupyter notebooks (if you want them instead of plain scripts, tell me and I'll adjust), building APIs with Flask/FastAPI (a later REST-in-Python topic), and async/await in Python (different from JS's version — worth a dedicated intro when you need it).
:::

This is a good draft, and one part of it is better than anything in this book's own profile: the notes on when to remove each rule sort them into two groups. Rules 1, 2 and 5 are scaffolding, to be dropped as you learn. Rules 3, 4, 6 and 8 are habits, to be kept "indefinitely," because they're about good practice, not skill level. That's exactly the distinction this lesson has been drawing, and writing it down makes the profile easier to maintain.

**Read it critically,** though, because it's missing the most important rule of all. Look at rule 1: "Explain new Python syntax or built-ins the first time you use them." That lets the assistant use *anything*, as long as it explains it. The rule that made this book's approach work was different: *use only what I know, and tell me when a task needs something new, instead of using it.* That's what kept every reply readable, and what let you choose when to learn each new thing. Without it, a request for a chart could come back with list comprehensions, lambdas, pandas method chains and a plotting library, all explained, and all at once.

Two other things are worth changing:

- **It starts with pandas.** Pandas is the right tool for data analysis in Python, but it's a large library with its own style, and learning it before plain Python mixes two new things together. Tight limits first: a few sessions of plain Python, with lists, dictionaries and loops, then pandas.
- **"What I already know" is generic.** It lists JavaScript concepts, which is useful, but it doesn't say what you know of *Python*: nothing yet. A "What I know of Python so far" list, which grows, is how the new profile will keep up with you, just as the old one did.

Here's the draft with those changes, as a starting point:

```{.code environment="none"}
I'm learning Python for data analysis. I know JavaScript well (functions,
objects, array methods, async/await, modules, SQL), but no Python yet.
I run Python 3 scripts from VS Code's terminal on my own computer.

When you write code for me:
- Use only the Python listed below under "What I know of Python so far."
  If a task needs something else, tell me what it is instead of using it.
- Point out where Python differs from JavaScript as it comes up.
- Explain each line in plain language.
- After loading, cleaning or combining data, print counts I can check.
- Before a chart, tell me what question it answers.
- Keep secrets out of code; dry-run anything that changes or deletes files.
- When you're not sure how something works, say so.

What I know of Python so far: nothing yet.
```

Its first request would get the Python equivalent of `console.log("Hello")`: `print("Hello")`, with an explanation. And you'd be back at the start of a book you've already read, knowing how it ends.

## Designing Your Own Learning Path

A profile is half of learning with an assistant. The other half is the path: what to learn, in what order, on what platform. This book was one such path. Designing your own takes the same decisions its authors made:

1. **Choose a goal you care about, with a real project.** The garden club gave every lesson a reason. "Learn Python" is hard to finish; "analyze my running times" or "automate my club's reports" isn't.
2. **Start where setup is easy and results are visible.** This book began with an editor on the page and Google Sheets, not with installing Node. For Python, that might be a free online notebook before a local installation.
3. **List the concepts in order,** each building on the last, and plan your profile's knowledge list to grow with them. An assistant can suggest an order; check it against a well-regarded course or book.
4. **Plan the scaffolding, and when it comes off.** Start with tight limits, and write down what each one is protecting you from, so you'll know when you're ready to remove it.
5. **Collect platform profiles** for the tools you'll use, from their documentation and the mistakes you catch.
6. **Check what you're told.** Run the code, read the error bodies, compare menus with your screen, check version numbers and package claims, and trust the documentation over any assistant, including when it sounds most sure.

And none of this is only for programming. A learning profile for a language, for statistics or for music theory works the same way: what you're working with, what you know so far, and rules that keep the assistant's help at your level, loosened as you grow.

## Your Capstone

Choose a platform, language or skill you haven't learned, and design an AI-guided learning path for it:

- A **learner profile** for it, with rules marked as scaffolding (with when you'd remove each) or as habits.
- A **platform profile** for the main tool, of at least five lines, each backed by its documentation.
- A **learning path** of five to ten steps, with the concepts each step adds.
- The **first exchange**: send your first real request, paste the reply, and read it the way this book taught you, line by line, noting what fits your profile and what doesn't.

## A Last Word

The first lesson of this book said that a computer never fills in the gaps in your instructions, and an AI assistant always does, and that programming with an AI means managing both: giving the assistant enough to guess well, and reading carefully enough to catch the guesses that are wrong. You've now seen hundreds of those guesses: thresholds nobody chose, invented volunteers, stale menus and model names, a rule applied where it didn't belong, a pantry that didn't exist. You caught them because you could read the code, and you prevented many more with a profile that told the assistant who you were.

That's the skill this book was really about. JavaScript was the language you learned it in.

## Summary

Your learner profile grew from a few lines to 3,500 words, through five kinds of change: knowledge that grew, environments that changed, scaffolding that came off when you were ready, rules that were corrected when they misbehaved in a new setting, and habits that accumulated from real mistakes. A profile that has done its job needs rewriting, shorter and truer to who you are now, not just more additions. A learning profile for a new subject starts the same way yours did: where you'll work, what you know, and the rule that makes the approach work, *use only what I know, and tell me when something new is needed*, with scaffolding and habits kept clearly apart. Add a learning path, platform profiles and the habit of checking everything, and the method works for any subject, with any assistant.
