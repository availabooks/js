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
- Learner-profile changes don't go here. They go in the lesson body (see "Showing the profile").

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
3. **A "Your Learner Profile" section** in any lesson that changes the profile. It holds the lesson's `ai-profile` block and explains what changed (see "Showing the profile").
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
| `prompt` | What the reader types. The build shows it above the reply with a copy button (a paper-airplane icon) that copies the prompt, so readers can paste it into their own assistant. It does not send anything itself. |
| `assistant`, `model` | Where the reply came from. |
| `captured` | The date it was captured, so old replies can be found and re-captured. |
| `profile` | Which learner profile was used: `none`, or the id of the lesson whose profile it was (for example `variables`). |
| `transcript` | Path under `transcripts/` to the saved raw exchange (without `.json`). |

- **Follow-up turns** ("Try again. Use only what I know.") are separate blocks, as in the SQL book.
- **Captions.** The build adds a caption at the end of each reply from these attributes: *"Reply from Gemini, captured September 26, 2026"*, with the model shown on hover. A block with `status="pending"` shows *"Reply not captured yet"* instead. (Built into `tools/author-tools/html.js`, styled by `div.ai-source` in the system CSS.)
- **Placeholders.** If a reply couldn't be captured yet, write the block with `status="pending"` and describe what the example needs in place of the reply. Never write a stand-in reply.
- **Re-runs.** A capture may be re-run a few times (about three at most) when an example needs a particular mistake. If the mistake doesn't appear, change the example; readers would be unlikely to see it themselves. The transcript file records how many attempts there were.
- **After each exchange**, the lesson walks through the code line by line (the Read step) before anyone runs it.

### Capturing replies

`tools/capture.mjs` sends an exchange to the Gemini API and saves it in `transcripts/<lesson-id>/<name>.json`. The API key is read from `private/gemini.key`, which git ignores.
- The learner profile is sent as the conversation's **first message**, the way a reader would paste it, and the reply to it is saved but not shown in the book.
- Follow-up turns include the conversation so far.
- The API's replies are close to, but not identical to, the Gemini app's.
- **Replies from the Gemini app** are also fine, and closer to what readers see. The author sends the prompt in a new chat that starts with the right learner profile and pastes the reply back. The transcript records `"source": "Gemini app ... pasted in"`. Leave out the `model` attribute unless the model picker's label is known.
- **Model:** captures use `gemini-3.8-flash` (the script's `DEFAULT_MODEL`), pinned so every reply in the book comes from the same model. Flash is the model family the free Gemini app typically uses. Change the model only for a deliberate re-capture of the whole book.

---

## Showing the profile

A lesson that changes the learner profile says how, in an `ai-profile` block in its "Your Learner Profile" section:

```markdown
::: {.ai-profile lesson="apps-script"}
Environment: I'm writing Google Apps Script in the Apps Script editor attached to a Google Sheet.

Add rules:

- Put all the code in one function with a descriptive name. Don't create extra functions or use parameters.

Remove rules:

- Use let for every variable. Don't use const.

Add to "What I know so far":

- what a function is: a named group of steps written as function name() { }
:::
```

- **Every part is optional.** "Environment" is a whole sentence, because the wording differs between platforms, and it replaces the previous one. Rules and "What I know so far" items are added in order. A rule is removed by repeating its exact wording.
- **Profile changes go at the end of a lesson,** where the lesson explains them. A lesson has one profile before it and one after.
- **The build generates the full profile** (`tools/author-tools/learnerProfile.js`) from these blocks and the `learnerProfile` template in `config.json`. A lesson's profile is everything the lessons *before* it added, in the order of the version being built, so a course track that skips lessons gets the right profile automatically.

On each page, the build adds:

- **After the Learning Objectives box** (or at the top, if a lesson has none): "Copy learner profile for this lesson", which copies the profile readers should use while working through the lesson (the one its examples were captured with), with a "Show the profile" toggle. It's omitted when no profile exists yet.
- **In place of each `ai-profile` block:** the complete updated profile, with this lesson's changes highlighted, and a copy button.
- **At the bottom:** "Copy updated learner profile", but only when the lesson has an `ai-profile` block.

Follow the block with a short explanation of what's new and why. For a removed rule, say why the reader no longer needs it.

**After changing any `ai-profile` block,** run `node tools/build-profiles.mjs` to regenerate `reference/profiles/*.txt`, the files `capture.mjs` sends, so captures use exactly the profile readers see.

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
