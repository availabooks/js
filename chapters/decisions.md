---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Write `if`, `else if` and `else` statements that choose between actions.
2. Compare values with `===`, `!==`, `>`, `<`, `>=` and `<=`, and explain why this book uses `===` instead of `==`.
3. Combine conditions with `&&`, `||` and `!`.
4. Put precise requirements, such as thresholds, into a prompt instead of leaving them for the AI to choose.
5. Test code with edge cases, including boundary values and empty cells.
:::
:::

## Asking for a Decision

So far, your code has done the same thing every time it ran. Most useful programs need to look at a value and decide what to do. For example, a club might want to label each member's volunteer hours as High, Medium or Low.

Here's that request, sent in a new chat with your learner profile from [Variables and Data](variables){.book-link}:

::: {.ai-conversation prompt="Write an Apps Script function that reads a member's volunteer hours from cell E3 and writes High, Medium, or Low in cell F3." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="variables" transcript="decisions/hours-level"}
> I can write part of this for you, but there's a concept missing from your list that this task actually needs: **if/else statements** (conditional logic like `if (hours > 10) { }`).
>
> To decide between "High," "Medium," or "Low," the code needs to compare the hours value and branch into different paths — that's exactly what `if`, `else if`, and `else` do. Since that's not on your "known" list yet, I don't want to use it without telling you first.
>
> Here's what I *can* show you using only what you've learned so far — reading the value, converting it, and writing a placeholder result:
>
> ```javascript
> function checkVolunteerHours() {
>   // Store the active sheet in a variable
>   let sheet = SpreadsheetApp.getActiveSheet()
>
>   // Store cell E3 (where the hours are) in a variable
>   let hoursCell = sheet.getRange("E3")
>
>   // Read the value from E3
>   let rawHours = hoursCell.getValue()
>
>   // Convert it to a number, in case it was read as text
>   let hours = Number(rawHours)
>
>   // Store cell F3 (where we'll write the result) in a variable
>   let resultCell = sheet.getRange("F3")
>
>   // For now, just write the number back so we can confirm it read correctly
>   resultCell.setValue(hours)
> }
> ```
>
> Once you learn **if/else statements**, this becomes an easy addition — you'd add something like:
>
> ```javascript
> if (hours > 20) {
>   // set result to "High"
> } else if (hours > 5) {
>   // set result to "Medium"
> } else {
>   // set result to "Low"
> }
> ```
>
> Would you like me to explain if/else now, or wait until your textbook covers it?
:::

Your profile is working. Choosing between High, Medium and Low needs a new idea, the `if` statement, so the assistant said so instead of quietly using it. It wrote the part it could with what you know: reading E3, converting it with `Number()`, and writing to F3. Then it sketched the missing part and asked whether you wanted to learn it now.

Look at the sketch closely, because it contains a decision you didn't make. It uses `hours > 20` for High and `hours > 5` for Medium. Where did 20 and 5 come from? Your request never said what counts as High. The assistant filled in that gap with its own guess, as assistants always do. You'll see this again in a moment.

First, the new idea.

## if, else and else if

An **`if` statement** runs some code only when a condition is true:

<pre class="code">
let hours = 24

if (hours >= 15) {
  console.log("Thank you for all your help!")
}

console.log("Done")
</pre>

It has three parts:

- **`if`**, a keyword.
- **A condition** in parentheses: `hours >= 15`. A condition is an expression whose value is `true` or `false`, a boolean. Here, `>=` means "is greater than or equal to."
- **A block** of code in curly braces. The block runs only if the condition is true. If it's false, JavaScript skips the block and carries on after the closing brace.

Run the code, then change `hours` to 4 and run it again. "Done" appears both times, because it's outside the block.

::: {.term}
> **Condition** — An expression that is either `true` or `false`, used to decide whether code runs.
:::

To do one thing when the condition is true and something else when it's false, add **`else`**:

<pre class="code">
let hours = 4

if (hours >= 15) {
  console.log("High")
} else {
  console.log("Not high")
}
</pre>

Exactly one of the two blocks runs, every time.

For more than two possibilities, add **`else if`**. JavaScript checks each condition in order, from the top, and runs the block of the *first* one that's true. It skips everything after that:

<pre class="code">
let hours = 9.5

if (hours >= 15) {
  console.log("High")
} else if (hours >= 5) {
  console.log("Medium")
} else {
  console.log("Low")
}
</pre>

With 9.5 hours, the first condition is false, so JavaScript checks the second. `9.5 >= 5` is true, so it displays "Medium" and skips the `else`. Try 24, 5 and 2.

The order matters. The second condition, `hours >= 5`, is also true for 24 hours. But for 24, the first condition is true, so the second is never checked. When you read an `else if` chain, read it the way JavaScript does: top to bottom, stopping at the first true condition.

Notice the indentation, too. The lines inside each block are indented two spaces, so you can see at a glance which lines belong to which block. JavaScript doesn't require it, but you'll find code much harder to read without it.

## Comparing Values

These are the operators for comparing two values. Each one produces `true` or `false`:

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `===` | is equal to | `4 === 4` | `true` |
| `!==` | is not equal to | `4 !== 4` | `false` |
| `>` | is greater than | `24 > 15` | `true` |
| `<` | is less than | `24 < 15` | `false` |
| `>=` | is greater than or equal to | `15 >= 15` | `true` |
| `<=` | is less than or equal to | `16 <= 15` | `false` |

You can try any of them with `console.log`:

<pre class="code">
console.log(15 >= 15)
console.log("Ava" === "Ava")
console.log("Ava" === "ava")
console.log("12" === 12)
</pre>

Two of these results are worth a second look. `"Ava" === "ava"` is false, because comparing strings is exact, and capital letters count. And `"12" === 12` is false, because one is a string and the other is a number. `===` only says two values are equal if they're the same type *and* the same value.

### === and ==

You'll often see a shorter operator, `==`, in code you find. It also compares values, but first it tries to convert them to the same type. So `"12" == 12` is true, because `==` turns the string into a number before comparing:

<pre class="code">
console.log("12" == 12)
console.log("12" === 12)
</pre>

That sounds convenient, but the conversions follow rules that can surprise you, and you'll see one shortly. This book always uses `===` and its partner `!==`, and your learner profile will ask your assistant to do the same.

::: {.caution}
> **One equals sign or three?** `=` stores a value in a variable. `===` compares two values. Writing `if (hours = 15)` doesn't compare anything: it stores 15 in `hours`, and the condition counts as true. It's a common typo, so check for it when an `if` behaves strangely.
:::

## Putting a Decision in a Script

Back to the chat. In the same conversation, you can tell the assistant what you've now learned and ask again:

::: {.ai-conversation prompt="I've now learned if, else if and else, and the comparison operators > < >= <= === and !==. Please write the full function." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="variables" transcript="decisions/hours-level"}
> Here's the full function using if/else if/else:
>
> ```javascript
> function checkVolunteerHours() {
>   // Store the active sheet in a variable
>   let sheet = SpreadsheetApp.getActiveSheet()
>
>   // Store cell E3 (where the hours are) in a variable
>   let hoursCell = sheet.getRange("E3")
>
>   // Read the value from E3
>   let rawHours = hoursCell.getValue()
>
>   // Convert it to a number, in case it was read as text
>   let hours = Number(rawHours)
>
>   // Store cell F3 (where we'll write the result) in a variable
>   let resultCell = sheet.getRange("F3")
>
>   // Start with an empty result
>   let result = ""
>
>   // Decide which category the hours fall into
>   if (hours >= 20) {
>     result = "High"
>   } else if (hours >= 10) {
>     result = "Medium"
>   } else {
>     result = "Low"
>   }
>
>   // Write the result into F3
>   resultCell.setValue(result)
> }
> ```
>
> ### What each part does:
>
> 1. **`sheet`** — grabs the currently active sheet.
> 2. **`hoursCell`** — points to cell E3, where the volunteer hours are stored.
> 3. **`rawHours`** — reads whatever is in E3.
> 4. **`hours`** — converts that value into a proper number, in case it came in as text.
> 5. **`resultCell`** — points to cell F3, where we'll write the category.
> 6. **`result`** — starts as an empty string, ready to hold "High," "Medium," or "Low."
> 7. **`if / else if / else`** — checks the number of hours:
>    - 20 or more → `"High"`
>    - 10 to 19 → `"Medium"`
>    - anything less → `"Low"`
> 8. **`resultCell.setValue(result)`** — writes whichever category was chosen into F3.
>
> Try putting different numbers in E3 (like 5, 15, and 25) and run the function each time to see F3 update.
:::

**Read.** You can now read all of it:

- The first five variables are the pattern from [Variables and Data](variables){.book-link}: the sheet, the cell, the value, the value as a number, and the cell to write to.
- `let result = ""` creates a variable to hold the label, starting as an empty string.
- The `if` chain stores "High", "Medium" or "Low" in `result`.
- The last line writes `result` into F3.

This is a common pattern: decide on a value first, then write it once. The alternative, calling `setValue` inside each block, works too, but it repeats the same step three times.

Now look at the thresholds. High is now `hours >= 20` and Medium is `hours >= 10`. A few minutes earlier, in the same chat, the sketch used `> 20` and `> 5`. Neither is wrong, because you never said what you wanted. Here's the same request sent to a new chat with no learner profile, asking for "No data" when the cell is empty:

::: {.ai-conversation prompt="Write an Apps Script function that reads the volunteer hours in E3 and writes High, Medium, or Low in F3, or No data if E3 is empty." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="none" transcript="decisions/empty-no-profile"}
> # Apps Script Function: Volunteer Hours Classifier
>
> Here's a function that reads volunteer hours from cell E3 and writes the appropriate classification to F3:
>
> ```javascript
> function classifyVolunteerHours() {
>   // Get the active spreadsheet and sheet
>   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
>
>   // Read the value from E3
>   var hours = sheet.getRange("E3").getValue();
>
>   var result;
>
>   // Check if E3 is empty
>   if (hours === "" || hours === null) {
>     result = "No data";
>   } else {
>     // Classify based on hours (adjust thresholds as needed)
>     if (hours >= 50) {
>       result = "High";
>     } else if (hours >= 20) {
>       result = "Medium";
>     } else {
>       result = "Low";
>     }
>   }
>
>   // Write the result to F3
>   sheet.getRange("F3").setValue(result);
> }
> ```
>
> ## How It Works
>
> 1. **Gets the sheet**: Uses `getActiveSheet()` to work with the currently open sheet
> 2. **Reads E3**: Retrieves the value using `getRange("E3").getValue()`
> 3. **Checks for empty**: Tests if the value is an empty string or null
> 4. **Classifies hours**: Uses if/else logic with these default thresholds:
>    - **High**: 50+ hours
>    - **Medium**: 20-49 hours
>    - **Low**: 0-19 hours
> 5. **Writes to F3**: Outputs the result using `setValue()`
>
> […]
:::

This time High is 50 or more. Three replies gave three different answers to "what counts as High?" For the club's members, it matters: Maya, with 24 hours, is High in the second reply and Medium in the third, and Ava, with 12, drops from Medium to Low.

This is what the Plan step is for. **A vague request means the assistant decides for you.** The assistant can't know what the club considers a lot of volunteering. You can. So decide before you ask, and put the decision in the prompt: *"15 hours or more is High, 5 or more is Medium, and anything less is Low."*

(The reply also used `var`, semicolons, `getActiveSpreadsheet()` and a check for something called `null`, all things your profile steers away from. You'll meet `||` later in this lesson.)

## Testing the Edges

Once code runs, the next question is whether it's right for *every* value, not just the one you tried. The values most likely to go wrong are at the edges: exactly on a threshold, zero, or nothing at all. Here's a question about the first of those:

::: {.ai-conversation prompt="What happens if E3 is exactly 20?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="variables" transcript="decisions/hours-level"}
> If E3 is exactly **20**, the result will be **"High"**.
>
> Here's why: the code checks conditions in order, from top to bottom, and stops at the first one that's true.
>
> ```javascript
> if (hours >= 20) {
>   result = "High"
> } else if (hours >= 10) {
>   result = "Medium"
> } else {
>   result = "Low"
> }
> ```
>
> 1. JavaScript first checks `hours >= 20`. Since `hours` is `20`, and `20 >= 20` is `true` (the `>=` means "greater than *or equal to*"), this condition passes.
> 2. `result` is set to `"High"`.
> 3. Because this first condition was true, JavaScript **skips** the `else if` and `else` parts entirely — it never even checks them.
>
> So the boundary numbers work like this:
> - **19** → `"Medium"` (fails the first check, passes the second)
> - **20** → `"High"` (passes the first check)
> - **10** → `"Medium"`
> - **9** → `"Low"`
>
> If you ever want the boundaries to work differently (for example, wanting exactly 20 to count as "Medium" instead), you'd change `>=` to `>` in that specific condition.
:::

The answer shows the difference between `>=` and `>`. With `>=`, a member with exactly 20 hours is High. With `>`, they'd be Medium. Neither is wrong, but only one matches what you meant, and a value exactly on the boundary is where you find out which one you wrote.

::: {.term}
> **Edge case** — An unusual value that code must handle correctly, such as a value exactly on a boundary, zero, or an empty cell. Edge cases are where bugs tend to hide.
:::

A good habit is to test a value on each side of every boundary, plus the boundary itself. For thresholds of 15 and 5, that's something like 16, 15, 14, 6, 5 and 4, and also 0 and an empty cell.

## Empty Cells

An empty cell is the edge case people forget most. Here's what the assistant said about it, still in the same chat:

::: {.ai-conversation prompt="What happens if E3 is empty?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="variables" transcript="decisions/hours-level"}
> If E3 is empty, something a little surprising happens: **it will show "Low"**, not an error.
>
> Here's the chain of events:
>
> 1. **`rawHours = hoursCell.getValue()`** — reading an empty cell gives you an empty string `""` (you learned this earlier: empty cells read as `""`).
>
> 2. **`hours = Number(rawHours)`** — this is the surprising part. You might expect `Number("")` to become `NaN` (like it would for text such as `"hello"`), but JavaScript has a special rule: **`Number("")` actually equals `0`**, not `NaN`.
>
> 3. Since `hours` is now `0`, the if/else chain runs like this:
>    - `hours >= 20` → `0 >= 20` is `false`
>    - `hours >= 10` → `0 >= 10` is `false`
>    - falls through to `else` → `result = "Low"`
>
> So an empty E3 quietly gets labeled `"Low"`, which might not be what you want — it could mislead someone into thinking a member volunteered 0 hours and did poorly, when really no data was entered at all.
>
> **If you want to handle this differently** (for example, writing something like `"No data"` for empty cells), that would need an extra condition checking `rawHours === ""` before doing the number conversion. Would you like me to show you that version?
:::

This is a real bug, and it's easy to miss. `Number("")` is 0, so a member whose hours haven't been entered would be labeled Low, as if they'd done no volunteering. It's another logic error: no message, just a wrong answer.

The assistant offered a fix, and suggested checking `rawHours === ""` before converting. Here's the version it wrote:

::: {.ai-conversation prompt="Yes, show me that version." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="variables" transcript="decisions/hours-level"}
> Here's the updated version that checks for an empty cell first:
>
> ```javascript
> function checkVolunteerHours() {
>   // Store the active sheet in a variable
>   let sheet = SpreadsheetApp.getActiveSheet()
>
>   // Store cell E3 (where the hours are) in a variable
>   let hoursCell = sheet.getRange("E3")
>
>   // Read the value from E3
>   let rawHours = hoursCell.getValue()
>
>   // Store cell F3 (where we'll write the result) in a variable
>   let resultCell = sheet.getRange("F3")
>
>   // Start with an empty result
>   let result = ""
>
>   // Check for an empty cell before doing any number conversion
>   if (rawHours === "") {
>     result = "No data"
>   } else {
>     // Convert it to a number, since we know it's not empty
>     let hours = Number(rawHours)
>
>     // Decide which category the hours fall into
>     if (hours >= 20) {
>       result = "High"
>     } else if (hours >= 10) {
>       result = "Medium"
>     } else {
>       result = "Low"
>     }
>   }
>
>   // Write the result into F3
>   resultCell.setValue(result)
> }
> ```
>
> ### What changed:
>
> 1. **`rawHours === ""`** — this new check happens first. It compares the raw value straight from the cell (before any conversion) to an empty string, using the strict equality operator `===` you learned.
> 2. If E3 is empty, `result` is set to `"No data"` right away, and the rest of the number-checking code is skipped entirely.
> 3. If E3 is **not** empty, the code moves to the `else` block, where it converts the value to a number and runs the same High/Medium/Low logic as before — but now this all happens *inside* the `else`, so it only runs when there's actually something to check.
>
> Now:
> - **Empty E3** → `"No data"`
> - **20** → `"High"`
> - **15** → `"Medium"`
> - **3** → `"Low"`
> - **"abc" (text)** → this would still slip through to the number conversion and become `NaN`, which would end up as `"Low"` since `NaN >= 20` and `NaN >= 10` are both `false`. Let me know if you'd like to handle that case too!
:::

**Read.** The new part is an `if` whose `else` block contains another `if` chain. Putting one `if` inside another's block is called **nesting**. Read it from the outside in:

- If `rawHours` is the empty string, `result` becomes "No data", and the whole `else` block is skipped.
- Otherwise, the code converts the value and runs the familiar High, Medium, Low chain.

The order is the important part. The empty check has to come *before* the conversion, because once `""` has become 0, you can't tell an empty cell from a real zero anymore.

Notice the end of the reply, too. Without being asked, the assistant pointed out another edge case: text such as "abc" becomes `NaN`, and `NaN` fails every comparison, so it would be labeled Low. That's worth knowing, even if you decide it's unlikely in this sheet.

## Why === Matters Here

The code checks for an empty cell with `rawHours === ""`. Why not `==`? That question went to the assistant too:

::: {.ai-conversation prompt="Why did you use === instead of ==?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="variables" transcript="decisions/hours-level"}
> Good question! This has to do with how JavaScript compares values.
>
> ### The short answer
> `===` checks if two values are equal **and** the same type, with no conversion. `==` checks if two values are equal **after** JavaScript tries to convert them to match — which can lead to surprising results.
>
> ### An example that shows the danger
> Say `rawHours` accidentally contains the number `0` (not an empty string, but an actual zero, maybe typed in by someone). Watch what happens with each operator:
>
> ```javascript
> let rawHours = 0
>
> // Using == (loose equality)
> let looseCheck = rawHours == ""
> // JavaScript converts "" to a number (0) before comparing
> // 0 == 0 is true — but rawHours was NOT actually empty!
>
> // Using === (strict equality)
> let strictCheck = rawHours === ""
> // No conversion happens — a number is never equal to a string
> // 0 === "" is false, which is correct
> ```
>
> If you'd used `==` in the volunteer hours function, a genuine `0` hours entry would get mistaken for an empty cell and mislabeled `"No data"` instead of `"Low"`. That's a bug that could go unnoticed for a while.
>
> ### The general rule
> `===` avoids these hidden conversions, so it only says two things are equal if they truly match in both value and type. Because of this, `===` (and its partner `!==`) are usually the safer, more predictable choice — which is why I used it here and why your textbook likely emphasizes it too.
:::

This isn't a made-up problem. Look at the Members sheet below: Jordan Lee, in row 12, has 0 volunteer hours. The code below checks Jordan's hours both ways. Run it:

<pre class="spreadsheet">
{"sheetName": "Members", "rows": 16, "columns": 8,
 "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}],
 "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
</pre>

<pre class="code">
function checkJordan() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let hoursCell = sheet.getRange("E12")
  let rawHours = hoursCell.getValue()
  console.log("With ==, is it empty?", rawHours == "")
  console.log("With ===, is it empty?", rawHours === "")
}
</pre>

With `==`, Jordan's 0 counts as empty, and the code would write "No data" instead of "Low." With `===`, the check is only true for a real empty string.

Here's the finished function in the book's style, with the club's own thresholds from the Plan step. It labels Ava's hours in row 3. Run it, then change it to label other rows, including Jordan's:

<pre class="code">
function labelVolunteerHours() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let hoursCell = sheet.getRange("E3")
  let rawHours = hoursCell.getValue()
  let label = ""

  // check for an empty cell before converting, because Number("") is 0
  if (rawHours === "") {
    label = "No data"
  } else {
    let hours = Number(rawHours)
    if (hours >= 15) {
      label = "High"
    } else if (hours >= 5) {
      label = "Medium"
    } else {
      label = "Low"
    }
  }

  let labelCell = sheet.getRange("F3")
  labelCell.setValue(label)
}
</pre>

To test the empty case, delete the value in E3 and run it again.

## Combining Conditions

Sometimes one comparison isn't enough. Three **logical operators** combine or reverse conditions:

- **`&&`** means *and*. The whole condition is true only if both sides are true.
- **`||`** means *or*. The whole condition is true if either side is true, or both.
- **`!`** means *not*. It turns `true` into `false`, and `false` into `true`.

Suppose the club wants to thank members who have paid their dues *and* volunteered at least 10 hours. Dues Paid is a checkbox, so its value is already a boolean, `true` or `false`:

<pre class="code">
let duesPaid = true
let hours = 12

if (duesPaid === true && hours >= 10) {
  console.log("Thank you for your support!")
}
</pre>

Try setting `duesPaid` to `false`, or `hours` to 4. The message disappears, because `&&` needs both conditions to be true.

With `||`, either condition is enough. This finds members who need a reminder, because they haven't paid *or* they haven't volunteered:

<pre class="code">
let duesPaid = true
let hours = 0

if (duesPaid === false || hours === 0) {
  console.log("Send a reminder")
}
</pre>

`!` reverses a boolean, so `!duesPaid` is true when `duesPaid` is false. These two conditions mean the same thing:

<pre class="code">
let duesPaid = false

if (duesPaid === false) {
  console.log("Dues not paid")
}

if (!duesPaid) {
  console.log("Dues not paid")
}
</pre>

You'll see `!` often in AI code, especially with booleans. It's short, but when you're reading carefully, `=== false` is harder to misread. Either is fine.

## Your Learner Profile

You can now write code that makes decisions. Here's the update:

::: {.ai-profile lesson="decisions"}
Add rules:

- Compare values with === and !==. Don't use == or !=.

Add to "What I know so far":

- if, else if and else, including an if inside another if's block
- the comparison operators === !== > < >= <=
- the logical operators && (and), || (or) and ! (not)
- checking for an empty cell with === "" before converting a value
:::

What's new:

- **"Compare values with === and !==."** As you saw with Jordan's zero, `==` can say two values are equal when they aren't. Assistants usually use `===` already, but code learned from older examples sometimes uses `==`, and this rule makes the choice explicit.
- **Four new items** under "What I know so far," covering everything in this lesson. With `if` on the list, a request like the High, Medium, Low one should now get complete code.

There's no rule for thresholds, because those belong in each prompt, not in the profile. That's the habit to take from this lesson: when a task involves a decision, decide it yourself and say so in your request.

## Summary

An `if` statement runs a block of code only when its condition is true. `else` gives an alternative, and `else if` adds more choices, checked from the top down until one is true. Conditions use the comparison operators `===`, `!==`, `>`, `<`, `>=` and `<=`, and can be combined with `&&` (and), `||` (or) and `!` (not). This book uses `===` rather than `==`, because `==` converts values before comparing and can treat 0 and an empty cell as equal. When you ask for a decision without saying where the lines fall, the assistant chooses for you, and it may choose differently each time. So plan the decision and put it in your prompt. Then test the edges: values on each side of a boundary, zero and empty cells. So far your code has worked with one cell at a time. In the next lesson, it will work with a whole list at once.
