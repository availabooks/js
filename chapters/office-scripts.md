---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain what Office Scripts is, who can use it, and how it differs from Office.js in JADE.
2. Read TypeScript type annotations, such as `workbook: ExcelScript.Workbook`, and type assertions, such as `as number`.
3. Write an Office Script that reads and writes ranges.
4. Describe how Power Automate runs Office Scripts on a schedule, and where VBA fits.
:::
:::

::: {.note}
> **This lesson is optional.** Office Scripts needs a Microsoft 365 work or school account; it isn't available with free or personal Microsoft accounts. Many students have one through their school. If you don't, read the lesson anyway: you'll meet Office Scripts code in AI replies, as you did in [Teaching Your AI About a New Platform](platform-profile){.book-link}, and it's worth being able to read it.
:::

## Another Way to Script Excel

In [Teaching Your AI About a New Platform](platform-profile){.book-link}, an assistant asked for "JavaScript for Excel" answered with Office Scripts, not the Office.js that JADE uses. Office Scripts is Microsoft's own tool for automating Excel with a script, built into Excel's **Automate** tab. It's aimed at automating everyday work: cleaning up a report, formatting a table, copying data between sheets.

Three things set it apart from JADE:

- **It's built in,** for people with the right account. There's nothing to install.
- **Scripts are stored in your OneDrive,** not in the workbook, and can be shared with others who use the workbook.
- **It uses TypeScript,** JavaScript with types added, and a simpler API with no `load` or `sync`.

To try it, open a workbook in Excel on the web with your work or school account, click the **Automate** tab, and click **New Script**. A code editor opens beside the workbook, with a **Run** button.

::: {.screenshot-needed file="images/office-scripts-editor.png"}
Excel on the web with the Automate tab selected and the Office Scripts code editor open on the right, showing a new script with function main(workbook: ExcelScript.Workbook).
:::

## The Harvest Total as an Office Script

Here's the harvest total from [Excel's JavaScript API, with JADE](jade){.book-link}, asked for as an Office Script. The request was sent with your learner profile from [Sharing and Reusing Code](sharing-code){.book-link}, which describes JADE, so the prompt says clearly that this is different:

::: {.ai-conversation prompt="This time I'm not using JADE. My school gives me Microsoft 365, so I'm writing an Office Script in Excel's Automate tab. My workbook has a Harvests sheet with headers in row 1 and Kilograms in column D. Write an Office Script that adds up the kilograms and writes the total, rounded to one decimal place, in cell G1." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="sharing-code" transcript="office-scripts/total"}
> Good to know — Office Scripts is a different tool from JADE and Apps Script, so a few small things will look new here even though the ideas are the same as what you already know. I'll point those out as I go.
>
> A couple of notes before the code:
>
> - Office Scripts uses TypeScript, so the `main` function needs a bit of extra syntax: `function main(workbook: ExcelScript.Workbook)`. The `: ExcelScript.Workbook` part is just telling Office Scripts what kind of thing `workbook` is — you can copy that pattern without needing to understand TypeScript fully.
> - Unlike Office.js in JADE, Office Scripts doesn't use `load()` or `await excel.sync()`. When you call `getValues()`, you get the array right away.
> - I'm fairly confident in this API, but Office Scripts is a separate platform from what's on your list, so if something doesn't run exactly as expected, the error message will help us fix it.
>
> ```typescript
> function main(workbook: ExcelScript.Workbook) {
>   // get the Harvests sheet
>   const sheet = workbook.getWorksheet("Harvests")
>
>   // get all the used cells on that sheet, as an array of arrays
>   const usedRange = sheet.getUsedRange()
>   const values = usedRange.getValues()
>
>   // start a running total at 0
>   let total = 0
>
>   // loop over the rows, starting at 1 to skip the header row
>   for (let i = 1; i < values.length; i++) {
>     // column D is index 3, since columns start counting at 0
>     const kilograms = values[i][3] as number
>     total = total + kilograms
>   }
>
>   // round to one decimal place
>   // multiplying by 10, rounding, then dividing by 10 keeps one decimal digit
>   const rounded = Math.round(total * 10) / 10
>
>   // write the result into cell G1
>   const targetCell = sheet.getRange("G1")
>   targetCell.setValue(rounded)
> }
> ```
>
> One more new bit: `as number` on the kilograms line. Office Scripts needs to know each cell's value is a number before you can add it up, and `as number` tells it that. It's similar in spirit to `Number()`, which you already know, but it doesn't convert the value — it just tells Office Scripts to treat what's already there as a number.
>
> Want me to explain `as number` more, or should we test this in the Automate tab first?
:::

**Read.** The steps are the ones you know from every platform in this book: get the sheet, read the used range's values as an array of arrays, add up column D starting after the header, round, and write the result. What's different is how Office Scripts spells them:

- The script is always a function named **`main`**, and Excel passes it the workbook.
- **`getWorksheet`**, **`getUsedRange`**, **`getValues`** and **`setValue`** are methods, much like Apps Script's, not properties like Office.js's `values`.
- There's no `load` and no `sync`. You call `getValues()` and have the values immediately.

The assistant noted that it was "fairly confident" in this API, but that Office Scripts isn't on your list, which is the honesty rule at work again.

## Reading TypeScript

Two parts of the script aren't JavaScript you've seen, and the follow-up asked about the first:

::: {.ai-conversation prompt="What do the parts after the colons mean, like workbook: ExcelScript.Workbook? I haven't seen that before." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="sharing-code" transcript="office-scripts/total"}
> Good question — that's called a **type annotation**, and it's a TypeScript feature that Apps Script and plain JavaScript don't have.
>
> You already know that a parameter is just a name that holds whatever value gets passed in when the function is called — like `function greet(name) { }`. In plain JavaScript, `name` could hold a string, a number, anything.
>
> TypeScript adds a rule: every parameter has to say **what type of value it's allowed to hold**, written after a colon.
>
> ```typescript
> function main(workbook: ExcelScript.Workbook) {
> ```
>
> This says: "`main` takes one parameter called `workbook`, and it must be an `ExcelScript.Workbook`." That's a specific kind of object that Office Scripts provides, representing the whole workbook — it's how you get access to sheets, ranges, and so on, similar to how `context` works in Office.js.
>
> You'll see the same pattern elsewhere in Office Scripts, for example when a function returns a value, or when you're being more precise about a variable:
>
> ```typescript
> let count: number = 0
> let name: string = "Ava"
> ```
>
> Here `: number` and `: string` mean "this variable must always hold a number" or "must always hold a string" — TypeScript will warn you if you try to put the wrong kind of value in.
>
> In the code I gave you, the only place this shows up is:
>
> ```typescript
> function main(workbook: ExcelScript.Workbook) {
> ```
>
> and
>
> ```typescript
> const kilograms = values[i][3] as number
> ```
>
> That second one, `as number`, is a slightly different thing — it's called a **type assertion**. Instead of declaring a type, it tells TypeScript "trust me, treat this value as a number," because `getValues()` normally returns values whose type TypeScript isn't sure about.
>
> You don't need to memorize TypeScript's rules — for Office Scripts, it's enough to recognize `: SomeType` as "this must be this kind of value," and copy the patterns you see in examples like `workbook: ExcelScript.Workbook`.
:::

**TypeScript** is JavaScript with **types** written into the code. `workbook: ExcelScript.Workbook` says the parameter `workbook` holds an `ExcelScript.Workbook` object, and `let count: number = 0` says `count` must always hold a number. Before the script runs, TypeScript checks the whole thing, and if you try to put a string in `count` or call a method that `ExcelScript.Workbook` doesn't have, it reports an error right away, instead of letting the mistake happen while the script runs. For larger programs, that catches a lot of bugs early. It's why many professional JavaScript projects use TypeScript.

::: {.term}
> **TypeScript** — JavaScript with types added, such as `let count: number = 0`. The types are checked before the code runs, and then removed, leaving ordinary JavaScript.
:::

::: {.term}
> **Type annotation** — A type written after a name with a colon, such as `workbook: ExcelScript.Workbook`, saying what kind of value the name may hold.
:::

The second new part is **`as number`**, a *type assertion*. The assistant's explanation of it is important, so here it is again in different words: `as number` tells TypeScript to *treat* the value as a number. It does **not** turn it into one. `getValues()` can return strings, numbers or booleans, and TypeScript won't let you add a value of unknown type to a number, so `as number` quiets the complaint.

That creates a trap you've met before. If the Kilograms column were formatted as text, as the Volunteer Hours column was in [Variables and Data](variables){.book-link}, then `values[i][3] as number` would still be a string, and `total + kilograms` would join instead of add. TypeScript's check can't catch it, because you told it to trust you. When values might be text, convert them for real:

```{.code environment="officescriptexcel"}
function main(workbook: ExcelScript.Workbook) {
  const sheet = workbook.getWorksheet("Harvests")
  const usedRange = sheet.getUsedRange()
  const values = usedRange.getValues()

  let total = 0
  // start at 1 to skip the header row; kilograms are in column D, index 3
  for (let i = 1; i < values.length; i++) {
    // Number() really converts, even if the cell holds text
    const kilograms = Number(values[i][3])
    total = total + kilograms
  }

  const rounded = Math.round(total * 10) / 10
  const totalCell = sheet.getRange("G1")
  totalCell.setValue(rounded)
  console.log(`Total kilograms harvested: ${rounded}`)
}
```

`Number(...)` always returns a number, so TypeScript is satisfied without `as`, and the result is right even for text. In Office Scripts, `console.log` output appears below the editor, so there it's the right way to show output, unlike in JADE.

## Side by Side

Here's the same job in JADE and in Office Scripts, reduced to the essentials:

```{.code environment="jade"}
async function writeHarvestTotal(excel) {
  const sheet = excel.workbook.worksheets.getItem("Harvests")
  const usedRange = sheet.getUsedRange()
  usedRange.load("values")
  await excel.sync()
  const data = usedRange.values
  // ... add up data[i][3] ...
  sheet.getRange("G1").values = [[rounded]]
  await excel.sync()
}
```

```{.code environment="officescriptexcel"}
function main(workbook: ExcelScript.Workbook) {
  const sheet = workbook.getWorksheet("Harvests")
  const usedRange = sheet.getUsedRange()
  const data = usedRange.getValues()
  // ... add up data[i][3] ...
  sheet.getRange("G1").setValue(rounded)
}
```

| | JADE (Office.js) | Office Scripts |
|---|---|---|
| Account needed | Free Microsoft account | Microsoft 365 work or school |
| Where code lives | In the workbook | In your OneDrive |
| Function shape | `async function name(excel)` | `function main(workbook: ExcelScript.Workbook)` |
| Reading values | `load("values")`, `await excel.sync()`, then `.values` | `.getValues()` |
| Writing values | set `.values`, then `await excel.sync()` | `.setValue()` or `.setValues()` |
| Output | `Jade.print` | `console.log` |
| Interfaces | HTML canvases in the task pane | None; scripts run and finish |
| Language | JavaScript | TypeScript |

Office Scripts is simpler for straightforward jobs: no async, no queue. JADE can do more, such as building an app in the task pane or loading libraries, and it works without a work or school account. Both are real, supported ways of automating Excel, and knowing both makes you better at reading whatever an assistant gives you.

## Running a Script on a Schedule

Apps Script had time-driven triggers. Here's what the assistant said about Office Scripts:

::: {.ai-conversation prompt="Can this script run by itself every Monday morning, like a time-driven trigger in Apps Script?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="sharing-code" transcript="office-scripts/total"}
> Not on its own — Office Scripts don't have a built-in trigger system like Apps Script's time-driven triggers. There's no equivalent to picking "Time-driven" and "Every Monday" directly in Excel.
>
> To run a script automatically on a schedule, you'd need **Power Automate**, a separate Microsoft tool that can trigger flows on a schedule (or on other events) and includes an action to run an Office Script against a specific workbook.
>
> I know the general idea — you'd create a flow with a recurrence trigger set to weekly/Monday, and add a "Run script" action pointing at your workbook and this script — but I'm not fully confident about the exact steps in Power Automate's current interface, since it changes over time and isn't something I've listed as one of your known tools. I'd rather not guess at menu names that might be wrong.
>
> If you want, I can:
> - Explain what I do know about how Power Automate + Office Scripts fit together conceptually, or
> - Suggest you search Microsoft's current documentation for "run Office Script on a schedule" to get exact click-by-click steps.
>
> Would you like either of those?
:::

That's accurate, and notice the honesty rule again: it gave the idea confidently, and declined to guess at the menu names. **Power Automate** is Microsoft's service for automated workflows: "when this happens, do that." A flow with a **Recurrence** trigger, set to Mondays, and an Excel action to **Run script**, pointed at your workbook and script, runs the script on schedule. Whether you can use it depends on your organization's Microsoft 365 plan and settings. Microsoft's documentation, under "Run Office Scripts with Power Automate," has the current steps. You'll build a workflow of this kind yourself, with a free tool called n8n, later in the book.

## And VBA?

You'll hear about **VBA** (Visual Basic for Applications) as soon as you talk to anyone who automates Excel. It's the original way, dating from the 1990s, built into Excel on Windows and Mac as *macros*. There's an enormous amount of VBA in the world, and assistants know it very well. But it's a different language, not JavaScript, and it doesn't run in Excel on the web. You'll recognize it by lines like `Sub TotalHarvest()`, `Dim total As Double` and `End Sub`.

If you're given a workbook with VBA macros, an assistant can explain the code line by line, and can often translate it into Office.js or Office Scripts. Treat workbooks with macros from people you don't know with the same caution as any other code: Excel blocks macros in files from the internet for a reason.

## Your Learner Profile

::: {.ai-profile lesson="office-scripts"}
Add to "What I know so far":

- Office Scripts: function main(workbook: ExcelScript.Workbook), getWorksheet, getUsedRange, getValues, setValue and setValues, and that it has no load or sync
- reading TypeScript: type annotations such as count: number, and that "as number" doesn't convert a value
- that Power Automate can run Office Scripts on a schedule
- recognizing VBA
:::

There's no change to your environment line; your main Excel tool is still JADE. When you work in Office Scripts, say so at the start of the chat, as the request in this lesson did.

## Summary

Office Scripts is Microsoft's built-in way to script Excel, in the Automate tab, for people with Microsoft 365 work or school accounts. It uses TypeScript, and a simpler API than Office.js: `main(workbook)` gets the workbook, `getValues()` returns values immediately, and there's no `load` or `sync`. Type annotations like `workbook: ExcelScript.Workbook` say what kind of value a name holds, and are checked before the script runs; `as number` only tells TypeScript to trust you, so use `Number()` when a value might be text. Power Automate can run a script on a schedule. VBA is Excel's original macro language, not JavaScript, and you'll recognize it by `Sub` and `End Sub`. That's the end of Part IV. Next, you'll script two productivity apps, Airtable and Obsidian.
