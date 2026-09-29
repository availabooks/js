# Authoring Conventions for This Book

How lessons in *Personal Productivity with JavaScript* are written and marked up. The plan for the book is in `outline.md`; the platform's general chapter rules are in `tools/system-files/authoring-chapters.md` (in the monorepo), and they apply here too. Some conventions below describe features whose tooling isn't built yet. Use them anyway, so the tooling works on every lesson when it arrives.

This file, `outline.md`, `reference/` and `private/` are not published. The build only reads `chapters/`, `assessments/` and `images/`.

---

## Files and names

- **Lesson files have no number prefix:** `chapters/ai-assistant.md`, not `02-ai-assistant.md`. The order comes from `config.json`. A chapter's `id` in `config.json` must match the end of its file name (`ai-assistant`).
- **Add a lesson to `config.json` when its file exists.** The build fails on an `id` with no matching file.
- **Never hard-code a lesson number in lesson text.** Refer to other lessons with a cross-reference, which the build numbers correctly for each version (course track):

  ```markdown
  [Working with an AI Assistant](ai-assistant){.book-link}
  ```

- **No `#` (H1) headings.** The build adds the lesson title from `config.json`. Use `##` for sections and `###` below that, and don't number them; the build does.

---

## Front matter

A lesson with code starts with a YAML block listing the page modules it needs. The build reads keys that begin with `_$_`.

```yaml
---
_$_import: monaco, appsscript
---
```

- **`_$_import`**: `monaco` gives runnable code editors; `appsscript` adds on-page spreadsheets with a stand-in `SpreadsheetApp` (see "Spreadsheets on the page").
- A lesson with no code needs no front matter at all.
- Learner-profile changes don't go here. They go in `skills.yaml` and the lesson body (see "Showing the profile").

---

## Lesson structure

1. **Learning objectives**, at the top:

   ```markdown
   ::: {.learning}
   Learning Objectives

   ::: {.objectives}
   1. Explain what a variable is and why programs need them.
   2. ...
   :::
   :::
   ```

2. **Sections (`##`)**. Most follow the workflow from outline §2: Plan, then Ask (an AI exchange), then Read (a line-by-line walkthrough), then Scrutinize and Edit (together, PARSE).
3. **A "Your Learner Profile" section** in any lesson that changes the profile. It holds a `learner-profile` box and explains what changed (see "Showing the profile").
4. **`## Summary`**: a short paragraph or two.
5. **The assessment** is a separate draft file (see "Assessments").

### Callouts

Use the platform's callout classes, with the text in a blockquote:

```markdown
::: {.term}
> **Variable** — A named container that holds a value your program can use and change.
:::

::: {.note}
> **Why no semicolons?** ...
:::

::: {.tip}
> ...
:::

::: {.caution}
> **This code replaces what's on your sheet.** ...
:::
```

- `.term` defines a new word the first time it appears.
- `.note` gives background.
- `.tip` gives advice.
- `.caution` warns about something that can lose data, expose information, or cost money.

---

## Code

Code blocks are pandoc fenced code blocks with a `.code` class. Pandoc turns them into the `<pre class="code">` that the page's editor looks for.

````markdown
```{.code}
let count = 10
console.log(count)
```

```{.code environment="nodejs"}
import fs from "node:fs"
```
````

- **Runnable JavaScript:** ```` ```{.code} ````, in lessons that import `monaco`. Readers can edit and run it, and `console.log` output appears below it.
- **Other environments:** add `environment="..."` (pandoc writes it as `data-environment`). The editor supports:
  - `none`: shown but not runnable;
  - `message`: output or an error message;
  - `html`: rendered in a frame;
  - `appsscript`, `appsscriptsheets`, `nodejs`, `jade`, `officescriptexcel`: shown with a note on where to paste the code.
- **Apps Script code that runs against an on-page spreadsheet** uses a plain ```` ```{.code} ```` (no `environment`). The `appsscript` module makes `SpreadsheetApp` work on the page.
- **Don't add a language class** (such as ```` ```{.js .code} ````). It turns on pandoc's syntax highlighting, which wraps the block in a `div.sourceCode` and changes its classes, and the editor then treats it differently.
- **Write code as-is.** Inside a fence, `<`, `>` and `&` need no escaping, so HTML examples are written as plain HTML.
- **Book code style:** no semicolons; `let` (until the Functions lesson removes that rule); camelCase; comments where they help a beginner.
- **Code from an AI reply isn't restyled.** It's shown exactly as captured. When the book's final version of that code appears as a runnable block, it follows the book's style.

### Spreadsheets on the page

A lesson that imports `appsscript` can include a sheet:

````markdown
```{.spreadsheet}
{"sheetName": "Members", "rows": 16, "columns": 8,
 "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ...]}],
 "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
```
````

- Code run in a Monaco block acts on the **nearest sheet above it**.
- **Make the grid a few rows and columns bigger than the data.** AI code often writes to the next empty row or column, and a real sheet starts with 1000 rows and 26 columns.
- `"numberFormat": "@"` in `formats` makes cells plain text, which is how to set up the "why do I get 55?" example.
- Readers can copy the sheet into real Google Sheets with the grid's copy button.
- **Take example data from `reference/example-data.json`.**

---

## AI conversations

Every reply is **real output captured from the Claude API** while the lesson is written (see "Capturing replies"). Nothing in a reply is invented or edited, except for trimming, which is marked `[…]`.

```markdown
::: {.ai-conversation prompt="Write JavaScript that adds up the numbers from 1 to 10." assistant="Claude" model="claude-sonnet-5" captured="2026-10-02" profile="none" transcript="ai-assistant/sum-1-to-10"}
> Reply text, exactly as captured…
>
> ```javascript
> ...
> ```
:::
```

| Attribute | Meaning |
|---|---|
| `prompt` | What the reader types. The build shows it above the reply with a copy button (a paper-airplane icon) that copies the prompt, so readers can paste it into their own assistant. It does not send anything itself. |
| `assistant`, `model` | Where the reply came from. |
| `captured` | The date it was captured, so old replies can be found and re-captured. |
| `profile` | Which learner profile was used: `none`, the id of the lesson whose end-of-lesson profile it was (for example `variables`), or `here` for the profile at this block. |
| `transcript` | Path under `transcripts/` to the saved raw exchange (without `.json`). |

- **Follow-up turns** ("Try again. Use only what I know.") are separate blocks, as in the SQL book.
- **Captions.** The build adds a caption at the end of each reply from these attributes: *"Reply from Claude, captured September 26, 2026"*, with the model shown on hover. A block with `status="pending"` shows *"Reply not captured yet"* instead. (Built into `tools/author-tools/html.js`, styled by `div.ai-source` in the system CSS.)
- **Placeholders.** If a reply couldn't be captured yet, write the block with `status="pending"` and describe what the example needs in place of the reply. Never write a stand-in reply.
- **Re-runs.** A capture may be re-run a few times (about three at most) when an example needs a particular mistake. If the mistake doesn't appear, change the example; readers would be unlikely to see it themselves. The transcript file records how many attempts there were.
- **After each exchange**, the lesson walks through the code line by line (the Read step) before anyone runs it.

### Capturing replies

`tools/capture.mjs` sends an exchange to the Claude API and saves it in `transcripts/<lesson-id>/<name>.json`. The API key is read from `private/anthropic.key`, which git ignores. Run `npm install` in the book folder once, for the Anthropic SDK.
- The learner profile is sent as the conversation's **first message**, the way a reader would paste it, and the reply to it is saved but not shown in the book. No system prompt is sent.
- Follow-up turns include the conversation so far.
- The API's replies are close to, but not identical to, the Claude app's.
- **Replies from the Claude app** (claude.ai) are also fine, and closer to what readers see. The author sends the prompt in a new chat that starts with the right learner profile and pastes the reply back. The transcript records `"source": "Claude app ... pasted in"`. Leave out the `model` attribute unless the model picker's label is known.
- **Model:** captures use `claude-sonnet-5` (the script's `DEFAULT_MODEL`), pinned so every reply in the book comes from the same model. Sonnet is the model family the free Claude app uses. Change the model only for a deliberate re-capture of the whole book.
- **Earlier Gemini captures.** The book's first drafts used Gemini. A Claude capture with the same name moves the old transcript to `<name>.gemini.json`, so it can be compared. `--model gemini-...` still sends a capture to Gemini (key in `private/gemini.key`).

---

## Showing the profile

The learner profile is built from **skills**, listed in `skills.yaml` at the top of the book folder. `skills.yaml` also holds the profile's fixed text: `intro`, `noConceptsYet`, `rulesHeading`, `knowsHeading` and `knowsNone`. Each skill has an id, a type and a text:

```yaml
  - id: e4q
    type: environment        # replaces the previous environment once it's learned
    text: I'm writing Google Apps Script in the Apps Script editor attached to a Google Sheet.
  - id: t4d
    type: rule
    text: Put all the code in one function with a descriptive name. Don't create extra functions or use parameters.
  - id: k7m                  # type "know" (the default): a "What I know so far" item
    text: "what a function is: a named group of steps written as function name() { }"
  - id: w9c
    type: rule
    text: Use const for a variable whose value never changes, and let for one that does. Don't use var.
    replaces: [r2x]          # r2x comes off once w9c is learned
    with: c3n                # w9c is also on whenever c3n is, for example when a reader marks c3n as known
```

- **Ids** are random: a lowercase letter, then two lowercase letters or digits. They say nothing about order. Make new ones with `node ../../tools/new-skill-id.mjs js [count]` (add `--append` to add stub entries to `skills.yaml`). Never reuse or renumber an id.
- **The order of `skills.yaml`** is the order of lines in the profile, within each lesson.
- **Tag the content that teaches each skill** with its id as a class. A skill is learned at the *end* of its first tag, in the order of the version being built:
  - one or more paragraphs: wrap them in `::: {.k7m}` … `:::` (several ids can share a wrapper: `::: {.k7m .w9c}`);
  - a list item: `- [the item's text]{.k7m}`;
  - an existing div, such as an AI conversation: add the class, as in `::: {.ai-conversation .k7m prompt="..."}`.

  Don't put a heading inside a wrapper, and never add a class to a code fence (it must keep its single `.code` class).
- **Rules and environments** are tagged where the lesson tells the reader about them, often in its "Your Learner Profile" section.
- **The "Your Learner Profile" section** in a lesson that changes the profile holds an empty `::: {.learner-profile}` / `:::` box. It shows the profile at that point, with this lesson's new lines highlighted and a copy button. Skill ids may also sit on this box (`::: {.learner-profile .w9c}`) when the section is where the skill is taught. Follow it with a short explanation of what's new and why. For a removed rule, say why the reader no longer needs it.

On every page, the book adds (from `tools/system-files/dev/learner-profile.js`, which the build includes for any book with a `skills.yaml`):

- **A box at the start** (after the Learning Objectives box, or at the top) and **one at the end** of each lesson, each with "Copy learner profile" and "Show profile". The box at the start is hidden until some earlier lesson has taught a skill.
- **A profile for any paragraph.** On a computer, hovering over a paragraph shows a small person icon at its end. On a phone, tapping a paragraph shows it. The icon opens the profile through that paragraph. A floating **Profile** button opens the profile for the paragraph being read.
- **"Skills I already know."** The profile panel lists the skills from later in the book, by lesson, as checkboxes. Anything a reader checks goes into their profile everywhere. Checks are saved in the reader's browser; for a signed-in reader with a paid account they're also saved to the account, so they follow the login to other devices (see `tools/system-files/reader-state.md`).

**After tagging or changing skills,** run `node tools/build-profiles.mjs` to regenerate `reference/profiles/*.txt` (the profile at the end of each lesson), the files `capture.mjs --profile <lesson-id>` sends. `capture.mjs --profile here` instead sends the profile a reader has at the conversation's own block, worked out from the tags before it.

---

## Screenshots

Screenshots aren't produced during writing. Where one is needed, leave a placeholder that says exactly what it should show:

```markdown
::: {.screenshot-needed file="images/apps-script-run-button.png"}
The Apps Script editor with the Run button highlighted and myFunction selected in the function menu.
:::
```

Images from the existing draft that are hosted on Blogger can stay until they're replaced. New images go in `images/`.

---

## Example data

All example data comes from `reference/example-data.json`: the Members list (Lessons 5–9, and in the case the club roster), plus the garden case's beds, plantings, shifts, harvests, supplies and interests. `reference/generate-example-data.mjs` recreates the file, and checks that each member's volunteer hours equal the sum of their shifts. Don't invent new names or numbers in a lesson. If a lesson needs more data, add it to the generator.

---

## Assessments

Each lesson gets an assessment drafted in `assessments-draft/<lesson-id>.json`. It is kept out of `assessments/` because the build processes that folder, and the JS grading format isn't decided yet. The format follows the SQL book's, with a `type` on each task:

```json
{
  "title": "Variables and Data",
  "lesson": "variables",
  "text": "Introduction shown to the student.",
  "tasks": [
    {"type": "multiple-choice", "text": "...", "choices": ["...", "..."], "answer": 1, "points": 2},
    {"type": "short-answer", "text": "...", "answer": "Model answer or grading notes", "points": 4},
    {"type": "code", "text": "...", "start": "starter code", "key": ["a correct solution"], "lines": 10, "points": 10},
    {"type": "ai-exchange", "text": "A task done with the student's own AI assistant, e.g. ask for code, then explain it line by line", "answer": "Grading notes", "points": 10}
  ]
}
```

Where there's code, `key` is a working solution (tested where possible), and `answer` holds grading notes for anything open-ended.

---

## Voice

- Plain and direct, in the second person, for college students with no programming background.
- Short sentences. Define terms before using them, and use each term consistently.
- Avoid generic filler: "superpowers," "It's not just X — it's Y," "dive into," "unlock," and piles of em dashes.
- Be honest about what an AI gets wrong without scaring readers off using one.
