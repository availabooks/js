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

Every lesson starts with a YAML block. The build reads keys that begin with `_$_`.

```yaml
---
_$_import: monaco, appsscript
_$_profile:
  environment: "Apps Script in Google Sheets"
  knows:
    - "let, and giving a variable a new value"
    - "strings, numbers and booleans"
  rules_add:
    - "Use let for every variable. Don't use const."
  rules_remove: []
---
```

- **`_$_import`** lists the page modules the lesson needs. `monaco` gives runnable code editors; `appsscript` adds on-page spreadsheets with a stand-in `SpreadsheetApp` (see "Spreadsheets on the page"). A lesson with no code uses `_junk: morano`, as the existing lessons do.
- **`_$_profile`** declares what this lesson adds to the learner profile (outline §4):
  - `environment`: set only when the lesson changes where code runs.
  - `knows`: concepts the reader has after this lesson, in plain words an AI will understand.
  - `rules_add` / `rules_remove`: profile rules this lesson adds or removes, worded exactly as they should appear in the profile. A rule is removed by repeating its exact wording.

  The profile button (not built yet) will combine these, in the order of the reader's version in `config.json`.

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

2. **Sections (`##`)**. Most follow the workflow from outline §2: Plan, then Ask (an AI exchange), then Read (a line-by-line walkthrough), then Run and Revise.
3. **A "Your Learner Profile" section** in any lesson whose `_$_profile` changes something. It shows the profile and explains what changed (see "Showing the profile").
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

- **Runnable JavaScript:** `<pre class="code">` ... `</pre>`, in lessons that import `monaco`. Readers can edit and run it, and `console.log` output appears below it.
- **Other environments:** add `data-environment="..."`. The editor supports:
  - `none`: shown but not runnable;
  - `message`: output or an error message;
  - `html`: rendered in a frame;
  - `appsscript`, `appsscriptsheets`, `nodejs`, `jade`, `officescriptexcel`: shown with a note on where to paste the code.
- **Apps Script code that runs against an on-page spreadsheet** uses a plain `<pre class="code">` (no `data-environment`). The `appsscript` module makes `SpreadsheetApp` work on the page.
- **Book code style:** no semicolons; `let` (until the Functions lesson removes that rule); camelCase; comments where they help a beginner.
- **Code from an AI reply isn't restyled.** It's shown exactly as captured. When the book's final version of that code appears as a runnable block, it follows the book's style.

### Spreadsheets on the page

A lesson that imports `appsscript` can include a sheet:

```markdown
<pre class="spreadsheet">
{"sheetName": "Members", "rows": 16, "columns": 8,
 "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ...]}],
 "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
</pre>
```

- Code run in a Monaco block acts on the **nearest sheet above it**.
- **Make the grid a few rows and columns bigger than the data.** AI code often writes to the next empty row or column, and a real sheet starts with 1000 rows and 26 columns.
- `"numberFormat": "@"` in `formats` makes cells plain text, which is how to set up the "why do I get 55?" example.
- Readers can copy the sheet into real Google Sheets with the grid's copy button.
- **Take example data from `reference/example-data.json`.**

---

## AI conversations

Every reply is **real output captured from the Gemini API** while the lesson is written (see "Capturing replies"). Nothing in a reply is invented or edited, except for trimming, which is marked `[…]`.

```markdown
::: {.ai-conversation prompt="Write JavaScript that adds up the numbers from 1 to 10." assistant="Gemini" model="gemini-x.y" captured="2026-10-02" profile="none" transcript="ai-assistant/sum-1-to-10"}
> Reply text, exactly as captured…
>
> ```javascript
> ...
> ```
:::
```

| Attribute | Meaning |
|---|---|
| `prompt` | What the reader types. The platform turns it into a "send to AI" button. |
| `assistant`, `model` | Where the reply came from. |
| `captured` | The date it was captured, so old replies can be found and re-captured. |
| `profile` | Which learner profile was used: `none`, or the id of the lesson whose profile it was (for example `variables`). |
| `transcript` | Path under `transcripts/` to the saved raw exchange (without `.json`). |

- **Follow-up turns** ("Try again. Use only what I know.") are separate blocks, as in the SQL book.
- **Captions.** Readers will see a short caption built from these attributes, such as *"Reply from Gemini, October 2026."* (Not built yet; the attributes are enough.)
- **Placeholders.** If a reply couldn't be captured yet, write the block with `status="pending"` and describe what the example needs in place of the reply. Never write a stand-in reply.
- **Re-runs.** A capture may be re-run a few times (about three at most) when an example needs a particular mistake. If the mistake doesn't appear, change the example; readers would be unlikely to see it themselves. The transcript file records how many attempts there were.
- **After each exchange**, the lesson walks through the code line by line (the Read step) before anyone runs it.

### Capturing replies

`tools/capture.mjs` sends an exchange to the Gemini API and saves it in `transcripts/<lesson-id>/<name>.json`. The API key is read from `private/gemini.key`, which git ignores.
- The learner profile is sent as the conversation's **first message**, the way a reader would paste it, and the reply to it is saved but not shown in the book.
- Follow-up turns include the conversation so far.
- The API's replies are close to, but not identical to, the Gemini app's.
- **Model:** captures use `gemini-3.8-flash` (the script's `DEFAULT_MODEL`), pinned so every reply in the book comes from the same model. Flash is the model family the free Gemini app typically uses. Change the model only for a deliberate re-capture of the whole book.

---

## Showing the profile

A lesson that changes the profile shows it in full, with a short note on each change:

```markdown
::: {.ai-profile lesson="variables"}
> I'm learning JavaScript with Google Apps Script in Google Sheets. ...
>
> What I know so far: ...
:::
```

Follow the block with a short explanation of what's new and why. For a removed rule, say why the reader no longer needs it. (Rendering and the copy button are future tooling. The block is written out in full so the lesson reads correctly without them.)

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
