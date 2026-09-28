---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Create variables with `let` and give them new values.
2. Tell strings, numbers and booleans apart, and check a value's type with `typeof`.
3. Read a value from a cell with `getValue`, and write code that does one step per line.
4. Explain why `"12" + 2` gives `"122"`, and convert between text and numbers with `Number()` and `String()`.
5. Build text with template literals.
6. Choose clear variable names, and recognize `var` and `const` in code you find.
:::
:::

## Variables

In [Your First Lines of Code](first-code){.book-link} you gave a value a name with `let`:

<pre class="code">
let name = "Ava"
console.log("Hello,", name)
</pre>

A named value like `name` is a **variable**. The name comes from the fact that its value can *vary*: once a variable exists, you can give it a new value whenever you like. Run this, and watch what the last line displays:

<pre class="code">
let count = 10
count = 20
count = count + 1
console.log(count)
</pre>

Read it one line at a time, the way the computer does:

1. `let count = 10` creates a variable called `count` and stores 10 in it.
2. `count = 20` stores 20 in `count`. The 10 is gone. There's no `let` this time, because `count` already exists. `let` is only for creating a variable.
3. `count = count + 1` looks strange if you read `=` as "equals." Read it instead as "store": *work out `count + 1`, then store the result in `count`*. At that moment `count` holds 20, so `count + 1` is 21, and 21 is stored.
4. `console.log(count)` displays 21.

::: {.term}
> **Assignment** — Storing a value in a variable with `=`. In `count = count + 1`, the right side is worked out first, using the variable's current value, and the result is then stored on the left.
:::

If you use `let` twice for the same name, JavaScript stops with an error, because the variable already exists. Try it:

<pre class="code">
let count = 10
let count = 20
</pre>

The message says `count` "has already been declared." *Declaring* a variable means creating it, which is what `let` does.

Variables are how a program remembers things: a total that grows as you add to it, a name read from a spreadsheet, a message you build a piece at a time. Almost every line of code you'll read from now on uses at least one.

## Three Kinds of Values

Every value in JavaScript has a **type**, which tells JavaScript what kind of value it is and what can be done with it. You'll use three types constantly:

- **Strings** are text, written in quote marks: `"Ava"`, `"ava.lopez@example.com"`, `"12"`. Even `"12"` is text, because of the quotes.
- **Numbers** are written without quotes, and can be whole or decimal: `12`, `9.5`, `-3`.
- **Booleans** have only two possible values, `true` and `false`, written without quotes. They answer yes-or-no questions, such as *has this member paid their dues?*

::: {.term}
> **Type** — The kind of value something is, such as a string, a number or a boolean. A value's type decides what operations make sense for it.
:::

::: {.term}
> **Boolean** — A value that is either `true` or `false`. Named after George Boole, a mathematician who studied logic.
:::

You can ask JavaScript for any value's type with `typeof`:

<pre class="code">
console.log(typeof "Ava")
console.log(typeof 12)
console.log(typeof "12")
console.log(typeof true)
</pre>

`typeof` is especially handy when a value doesn't behave the way you expect, because the problem is often that it's a different type than you thought. You'll see exactly that later in this lesson.

### Values from a spreadsheet

When your code reads a cell, the type of value it gets depends on what's in the cell. Here's a club's member list, the kind of sheet you'll work with for the next several lessons. Column D holds checkboxes: checked means the member has paid dues for the year.

<pre class="spreadsheet">
{"sheetName": "Members", "rows": 16, "columns": 7,
 "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}],
 "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
</pre>

The code below reads three cells from Ava's row, row 3, and displays each value with its type. It uses a new method, `getValue`, which reads what's in a cell, the way `setValue` writes to one.

<pre class="code">
function showTypes() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let firstName = sheet.getRange("A3").getValue()
  let duesPaid = sheet.getRange("D3").getValue()
  let hours = sheet.getRange("E3").getValue()
  console.log(firstName, typeof firstName)
  console.log(duesPaid, typeof duesPaid)
  console.log(hours, typeof hours)
}
</pre>

Text comes back as a string and a number as a number. A checkbox comes back as a boolean: `true` if it's checked, `false` if it isn't. An empty cell comes back as an empty string, `""`. Try changing the code to read an empty cell, such as `G3`, and see what it displays.

## Reading a Cell

Time for the five steps.

**Plan.** You want a function that reads a name from cell A1 and writes a greeting, such as *Hello, Ava!*, into cell B1. One value goes in (the name), and one comes out (the greeting). You'll know it worked if B1 shows the greeting with the right name.

**Ask.** Start a new chat with your learner profile from [Getting Started with Google Apps Script in Google Sheets](apps-script){.book-link}, and send:

::: {.ai-conversation prompt="Write an Apps Script function that reads a name from cell A1 and writes a greeting like Hello, Ava! in cell B1." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="apps-script" transcript="variables/greeting"}
> Here's a function that does that:
>
> ```javascript
> function writeGreetingFromName() {
>   // this gets the active sheet, picks cell A1, and reads its value
>   let name = SpreadsheetApp.getActiveSheet().getRange("A1").getValue()
>
>   // this joins "Hello, " with the name and an exclamation point
>   let greeting = "Hello, " + name + "!"
>
>   // this shows the greeting in the Execution log so you can check it
>   console.log(greeting)
>
>   // this gets the active sheet, picks cell B1, and writes the greeting into it
>   SpreadsheetApp.getActiveSheet().getRange("B1").setValue(greeting)
> }
> ```
>
> **What each line does:**
> 1. `let name = SpreadsheetApp.getActiveSheet().getRange("A1").getValue()` — gets the active sheet, selects cell A1, reads whatever value is in it, and names that value `name`
> 2. `let greeting = "Hello, " + name + "!"` — joins the text `"Hello, "`, the name from A1, and `"!"` into one string
> 3. `console.log(greeting)` — prints the greeting so you can see it in the log
> 4. `SpreadsheetApp.getActiveSheet().getRange("B1").setValue(greeting)` — selects cell B1 and writes the greeting into it
>
> Try putting "Ava" in cell A1 before running it, then check cell B1 for the result.
:::

**Read.** The assistant followed your profile closely. Everything is in one function with a descriptive name, every variable uses `let`, there are no semicolons, and each line is explained twice: once in a comment, and again in a numbered list.

Go through it line by line:

- The first line inside the function gets the sheet, picks cell A1, reads its value and stores it in a variable called `name`. That's four steps in one line.
- `let greeting = "Hello, " + name + "!"` joins three strings: `"Hello, "`, whatever is in `name`, and `"!"`. You learned this use of `+` in [Your First Lines of Code](first-code){.book-link}.
- `console.log(greeting)` shows the greeting in the Execution log. You didn't ask for this, but it's a sensible addition: it lets you check the value before you look at the sheet.
- The last line gets the sheet again, picks cell B1 and writes the greeting there.

Notice two things. First, the reply uses `getValue`, which isn't on your "what I know" list. It's the obvious partner to `setValue`, and the assistant explained it, but it didn't mention that it was new. This is the same kind of judgment call you saw in [Working with an AI Assistant](ai-assistant){.book-link}, and the reason you read every line.

Second, the long lines are hard to check. The first one does four things, and the last one repeats `SpreadsheetApp.getActiveSheet()` just to get the same sheet a second time. When several method calls are joined with dots on one line like this, it's called **chaining**. It's common, and you'll see it in a lot of code, but while you're learning it hides the steps. So ask for them one at a time:

::: {.term}
> **Chaining** — Calling one method directly on the result of another, joined by dots on one line, as in `sheet.getRange("A1").getValue()`.
:::

::: {.ai-conversation prompt="Rewrite it with each step on its own line. Store the sheet in a variable so the code only gets it once." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="apps-script" transcript="variables/greeting"}
> Here's the rewritten version:
>
> ```javascript
> function writeGreetingFromName() {
>   // this gets the active sheet once and names it "sheet"
>   let sheet = SpreadsheetApp.getActiveSheet()
>
>   // this picks cell A1 on that sheet
>   let cellA1 = sheet.getRange("A1")
>
>   // this reads the value from cell A1
>   let name = cellA1.getValue()
>
>   // this joins "Hello, " with the name and an exclamation point
>   let greeting = "Hello, " + name + "!"
>
>   // this shows the greeting in the Execution log so you can check it
>   console.log(greeting)
>
>   // this picks cell B1 on the sheet
>   let cellB1 = sheet.getRange("B1")
>
>   // this writes the greeting into cell B1
>   cellB1.setValue(greeting)
> }
> ```
>
> **What each line does:**
> 1. `let sheet = SpreadsheetApp.getActiveSheet()` — gets the active sheet one time and names it `sheet`
> 2. `let cellA1 = sheet.getRange("A1")` — uses `sheet` to select cell A1
> 3. `let name = cellA1.getValue()` — reads the value in cell A1
> 4. `let greeting = "Hello, " + name + "!"` — builds the greeting text
> 5. `console.log(greeting)` — prints the greeting to the log
> 6. `let cellB1 = sheet.getRange("B1")` — uses the same `sheet` to select cell B1
> 7. `cellB1.setValue(greeting)` — writes the greeting into cell B1
:::

This version is longer, but every line does exactly one thing, and each variable holds the result of one step:

- `sheet` holds the sheet. Both cells are picked from it, so the code gets the sheet only once.
- `cellA1` and `cellB1` hold the two cells. A variable can hold a cell, a sheet or anything else, not just text and numbers.
- `name` holds the value read from A1.
- `greeting` holds the message built from it.

Longer isn't worse. If the greeting came out wrong, you could add `console.log(name)` after the third line to check what was read, which you couldn't easily do with the one-line version. You'll add a rule to your learner profile at the end of this lesson, so you won't have to ask for this every time.

**Run.** Type a name into cell A1 of the practice sheet, then run the function:

<pre class="spreadsheet">
{"sheetName": "Practice", "rows": 5, "columns": 4, "data": [{"range": "A1", "values": [["Ava"]]}], "formats": []}
</pre>

<pre class="code">
function writeGreetingFromName() {
  // this gets the active sheet once and names it "sheet"
  let sheet = SpreadsheetApp.getActiveSheet()

  // this picks cell A1 on that sheet
  let cellA1 = sheet.getRange("A1")

  // this reads the value from cell A1
  let name = cellA1.getValue()

  // this joins "Hello, " with the name and an exclamation point
  let greeting = "Hello, " + name + "!"

  // this shows the greeting in the Execution log so you can check it
  console.log(greeting)

  // this picks cell B1 on the sheet
  let cellB1 = sheet.getRange("B1")

  // this writes the greeting into cell B1
  cellB1.setValue(greeting)
}
</pre>

**Revise.** Try a different name in A1, and run it again. What happens if A1 is empty? The greeting becomes *Hello, !*, because an empty cell reads as `""`. Deciding what to do in a case like that takes a new tool, which you'll meet in the next lesson.

## let, var and const

Here's the same request, sent in a new chat with **no** learner profile:

::: {.ai-conversation prompt="Write an Apps Script function that reads a name from cell A1 and writes a greeting like Hello, Ava! in cell B1." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="none" transcript="variables/greeting-no-profile"}
> Here's an Apps Script function that reads a name from cell A1 and writes a greeting in cell B1:
>
> ```javascript
> function writeGreeting() {
>   // Get the active spreadsheet and the active sheet
>   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
>
>   // Read the name from cell A1
>   var name = sheet.getRange("A1").getValue();
>
>   // Build the greeting message
>   var greeting = "Hello, " + name + "!";
>
>   // Write the greeting to cell B1
>   sheet.getRange("B1").setValue(greeting);
> }
> ```
>
> […]
:::

The steps are familiar: get the sheet, read A1, build the greeting, write it to B1. (The reply went on with steps for running the code, then suggested a second function that runs by itself whenever the sheet is edited, which uses several things you haven't learned.) Three differences from the profile version stand out:

- **Semicolons** at the end of each line. As you know, they make no difference.
- **`getActiveSpreadsheet().getActiveSheet()`** instead of `getActiveSheet()`. It gets the whole spreadsheet file first, then the sheet showing in it. The result is the same sheet.
- **`var`** instead of `let`.

`var` is JavaScript's original keyword for creating a variable. `let` arrived in 2015, along with a third keyword, `const`. They look like this:

<pre class="code">
var greeting = "Hi"
let team = "Blue"
const daysInWeek = 7
console.log(greeting, team, daysInWeek)
</pre>

- **`let`** creates a variable whose value you can change. It's what this book uses.
- **`const`** creates a variable whose value *can't* be changed. Try adding `daysInWeek = 8` to the code above and running it.
- **`var`** also creates a variable you can change, but it has some older behavior that can cause surprising bugs in larger programs. Most modern JavaScript avoids it. It's still common in Apps Script examples, because so many were written before 2015, and assistants learned from those examples.

You'll see all three in code you find online and in AI replies. For now, your learner profile will ask your assistant to use `let` for everything, so you can change any value while you experiment and don't have to decide which keyword fits. You'll learn when `const` is the better choice in the lesson on functions, and the profile rule will come off then.

## When Numbers Are Really Text

Here's a problem you're likely to meet with real spreadsheets. Below is the Members sheet again, with one difference you can't see: the Volunteer Hours column is formatted as **plain text**. That happens more often than you'd think, for example when data is pasted in from another program, or when someone sets a column to plain text so that codes with leading zeros, like `007`, keep them.

<pre class="spreadsheet">
{"sheetName": "Members", "rows": 16, "columns": 7,
 "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, "24"], ["Ava", "Lopez", "ava.lopez@example.com", true, "12"], ["Ben", "Okafor", "ben.okafor@example.com", false, "4"], ["Cam", "Nguyen", "cam.nguyen@example.com", true, "9.5"], ["Dev", "Patel", "dev.patel@example.com", true, "15"], ["Elena", "Rossi", "elena.rossi@example.com", false, "6.5"], ["Farah", "Haddad", "farah.haddad@example.com", true, "11"], ["Gabe", "Martinez", "gabe.martinez@example.com", false, "2"], ["Hana", "Kim", "hana.kim@example.com", true, "18.5"], ["Isaac", "Cohen", "isaac.cohen@example.com", true, "7"], ["Jordan", "Lee", "jordan.lee@example.com", false, "0"], ["Keisha", "Brown", "keisha.brown@example.com", true, "13.5"]]}],
 "formats": [{"range": "A1:E1", "fontWeight": "bold"}, {"range": "E2:E13", "numberFormat": "@"}]}
</pre>

Ava just worked a two-hour shift, so her hours in E3 should go from 12 to 14. Here's the request, in a new chat with your learner profile. It asks for one step per line, as you did above:

::: {.ai-conversation prompt="Write an Apps Script function that adds 2 to the number in cell E3 and writes the new total back into E3. Put each step on its own line." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="apps-script" transcript="variables/add-hours"}
> ```javascript
> function addTwoToE3() {
>   // this method gets the active sheet, picks cell E3, and reads its current value
>   let currentValue = SpreadsheetApp.getActiveSheet().getRange("E3").getValue()
>
>   // adds 2 to the value we just read
>   let newValue = currentValue + 2
>
>   // this method gets the active sheet, picks cell E3 again, and writes the new value into it
>   SpreadsheetApp.getActiveSheet().getRange("E3").setValue(newValue)
> }
> ```
>
> **What each line does:**
> 1. `let currentValue = SpreadsheetApp.getActiveSheet().getRange("E3").getValue()` — gets the active sheet, selects cell E3, and reads whatever number is currently there, giving it the name `currentValue`
> 2. `let newValue = currentValue + 2` — adds 2 to that number and gives the result the name `newValue`
> 3. `SpreadsheetApp.getActiveSheet().getRange("E3").setValue(newValue)` — selects cell E3 again and writes `newValue` into it, replacing the old number
:::

**Read.** Each line is explained, and the logic matches the plan: read E3, add 2, write the result back. One thing didn't go as asked, though: the first and last lines are still chained. The assistant took "each step on its own line" to mean "each statement on its own line," which is a reasonable reading. The rule you'll add to your profile says exactly what you mean: don't chain method calls.

The code looks right, and it would work on most sheets. Run it on this one:

<pre class="code">
function addTwoToE3() {
  // this method gets the active sheet, picks cell E3, and reads its current value
  let currentValue = SpreadsheetApp.getActiveSheet().getRange("E3").getValue()

  // adds 2 to the value we just read
  let newValue = currentValue + 2

  // this method gets the active sheet, picks cell E3 again, and writes the new value into it
  SpreadsheetApp.getActiveSheet().getRange("E3").setValue(newValue)
}
</pre>

Ava's hours are now 122. Before you read on, can you work out why? Here's what happened when that question went back to the assistant, in the same chat:

::: {.ai-conversation prompt="When I ran this, E3 changed from 12 to 122 instead of 14. Why? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="apps-script" transcript="variables/add-hours"}
> Good catch — this is a classic JavaScript surprise!
>
> Here's what's happening: the `+` operator behaves differently depending on what kind of value it's working with.
>
> - If both values are **numbers**, `+` does **addition**: `12 + 2` → `14`
> - If either value is **text** (a string), `+` does **joining** (concatenation): `"12" + 2` → `"122"`
>
> You got `122`, which means `currentValue` was actually the *text* `"12"`, not the *number* `12`. When you wrote `currentValue + 2`, JavaScript joined `"12"` and `2` together as strings instead of adding them.
>
> This usually happens because `getValue()` reads whatever is in the cell, and if that cell is formatted as **plain text** (rather than a number format), Google Sheets stores it as a string, so `getValue()` hands back a string too.
>
> So the bug isn't in your math — it's that `currentValue` wasn't the type of value you expected. Want me to show you how to check this, or move on to fixing it?
:::

That's exactly right. `getValue` read the text `"12"`, not the number 12, and `+` with a string joins instead of adding. You could have confirmed it yourself with `typeof`:

<pre class="code" data-environment="none">
console.log(currentValue, typeof currentValue)
</pre>

That line would display `12 string`. The number *looks* the same in the log either way. Its type is what gives it away.

This is a **logic error**, the kind you met in [Your First Lines of Code](first-code){.book-link}: no message, no warning, just a wrong answer. It's also a good example of why the Run step compares the result with your plan. If you hadn't known Ava's hours should be 14, you might not have noticed.

Now ask for the fix:

::: {.ai-conversation prompt="Now show me how to fix it." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="apps-script" transcript="variables/add-hours"}
> Since you haven't learned the `Number()` function yet (which is the usual tool for this), I'll show you a fix using only what you know: arithmetic operators.
>
> Here's the trick — multiplying by 1 forces JavaScript to treat the value as a number, because `*` (unlike `+`) only makes sense for numbers, so JavaScript converts the text into a number first.
>
> ```javascript
> function addTwoToE3() {
>   // gets the active sheet, picks cell E3, and reads its current value
>   let currentValue = SpreadsheetApp.getActiveSheet().getRange("E3").getValue()
>
>   // multiplying by 1 converts currentValue to a real number, even if it was text
>   let numberValue = currentValue * 1
>
>   // now this addition works correctly, since numberValue is a number
>   let newValue = numberValue + 2
>
>   // gets the active sheet, picks cell E3 again, and writes the new value into it
>   SpreadsheetApp.getActiveSheet().getRange("E3").setValue(newValue)
> }
> ```
>
> **What's new here:**
> - `let numberValue = currentValue * 1` — takes whatever `currentValue` is (text or number) and multiplies by 1. If it's text like `"12"`, JavaScript converts it to the number `12` first, then multiplies, giving you a real number back.
>
> Now `numberValue + 2` will always do proper math instead of joining text.
>
> (By the way, there's a built-in tool called `Number()` made exactly for this kind of conversion — I didn't use it since it's not on your list yet, but it's worth knowing it exists for later.)
:::

This is an interesting reply. Your profile said to use only what you know, and `Number()`, the usual tool for this job, isn't on your list. So the assistant found a trick that uses only arithmetic: multiplying by 1. Because `*` only works with numbers, JavaScript turns `"12"` into 12 before multiplying, and the result is a real number.

The trick works, but it's the kind of code that puzzles readers later: why would anyone multiply by 1? The assistant was honest about this. It mentioned `Number()` at the end and said it's worth knowing. This is a signal to watch for. When staying inside your profile produces a workaround, it's often a sign there's something new worth learning. So here it is.

### Converting between text and numbers

`Number()` turns a value into a number. `String()` does the opposite:

<pre class="code">
let hoursText = "12"
let hours = Number(hoursText)
console.log(hours + 2, typeof hours)

let total = 14
let totalText = String(total)
console.log(totalText + 2, typeof totalText)
</pre>

If a string doesn't look like a number, such as `"twelve"`, `Number()` gives a special value called `NaN`, short for "not a number." If you see `NaN` in your output, some text that wasn't a number ended up in a calculation.

Here's the function again, rewritten in the book's style with `Number()` and one step per line. Before you run it, set E3 back to 12 by typing into the cell.

<pre class="code">
function addShiftHours() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let hoursCell = sheet.getRange("E3")
  // the cell may hold text, so convert what it holds to a number
  let currentHours = Number(hoursCell.getValue())
  let updatedHours = currentHours + 2
  hoursCell.setValue(updatedHours)
}
</pre>

Notice the rewrite needs only one `getRange` for E3. The cell is stored in `hoursCell`, and the code both reads from it and writes to it.

## Building Text with Template Literals

Joining strings with `+` gets awkward when a message has several parts, and it's easy to forget a space:

<pre class="code">
let firstName = "Ava"
let hours = 14
console.log("Thank you, " + firstName + "! You have " + hours + " volunteer hours.")
</pre>

JavaScript has a neater way to build text, called a **template literal**. It's written between backticks (`` ` ``) instead of quote marks, and you drop a value into it with `${ }`:

<pre class="code">
let firstName = "Ava"
let hours = 14
console.log(`Thank you, ${firstName}! You have ${hours} volunteer hours.`)
</pre>

Both lines display the same message. The template literal reads like the finished sentence, with the spaces exactly where you see them. The backtick key is usually at the top left of the keyboard, next to the 1 key.

::: {.term}
> **Template literal** — A string written between backticks, in which `${ }` inserts the value of a variable or expression: `` `Hello, ${name}!` ``.
:::

Assistants use template literals often, so it's worth being able to read them. Anything inside `${ }` is worked out first, so it can even be a calculation: `` `${hours * 2} hours` ``.

## Naming Variables

The assistant's names in the hours example, `currentValue` and `newValue`, are fine as far as they go, but they don't say *what* the value is. The assistant couldn't have done better, because it didn't know what was in E3. So tell it:

::: {.ai-conversation prompt="Cell E3 holds a club member's volunteer hours. Rename the variables so the names describe what they hold." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="apps-script" transcript="variables/add-hours"}
> ```javascript
> function addTwoToE3() {
>   // gets the active sheet, picks cell E3, and reads the member's current volunteer hours
>   let currentHours = SpreadsheetApp.getActiveSheet().getRange("E3").getValue()
>
>   // multiplying by 1 converts currentHours to a real number, even if it was text
>   let hoursAsNumber = currentHours * 1
>
>   // adds 2 more volunteer hours to the total
>   let updatedHours = hoursAsNumber + 2
>
>   // gets the active sheet, picks cell E3 again, and writes the updated hours into it
>   SpreadsheetApp.getActiveSheet().getRange("E3").setValue(updatedHours)
> }
> ```
>
> **What changed:**
> - `currentValue` → `currentHours` — the number of volunteer hours currently in E3
> - `numberValue` → `hoursAsNumber` — the same hours, guaranteed to be a real number
> - `newValue` → `updatedHours` — the hours after adding 2 more
>
> The logic is exactly the same — only the names changed to describe what the data actually represents.
:::

The new names, `currentHours`, `hoursAsNumber` and `updatedHours`, tell you what each value means without reading the rest of the code. Notice what didn't change: the function is still called `addTwoToE3`. You asked about variables, and the assistant did exactly that. If you want a better function name, such as `addShiftHours`, you have to ask for that too.

Good names are one of the easiest ways to make code readable. A few guidelines:

- **Say what the value is.** `volunteerHours` is better than `value`, `x` or `data`.
- **Use camelCase.** Start with a lowercase letter and capitalize each word after the first: `firstName`, `hoursCell`, `updatedHours`. JavaScript names can't contain spaces.
- **Spell it out.** `emailAddress` is clearer than `emlAddr`. Common abbreviations like `id` are fine.
- **Name booleans like yes-or-no questions.** `duesPaid` or `isMember` reads naturally when you check it, as you'll do in the next lesson.
- **Follow the rules.** Names can contain letters, digits, `_` and `$`, but can't start with a digit, and can't be a word JavaScript already uses, such as `let` or `function`.

Capital letters matter. `hours` and `Hours` are two different names, which is a common source of "is not defined" errors.

## Your Learner Profile

You've learned a lot in this lesson, and your profile gets two new rules:

::: {.ai-profile lesson="variables"}
Add rules:

- Use let for every variable. Don't use var or const.
- Write each step on its own line, and store each result in a variable. Don't chain method calls together.

Add to "What I know so far":

- changing a variable's value with =, as in count = count + 1
- strings, numbers and booleans (true and false), and checking a value's type with typeof
- reading a cell with getValue(), and storing a sheet or a range in a variable
- empty cells read as an empty string ""
- converting with Number() and String(), and what NaN means
- template literals: text between backticks, with ${ } to insert a value
:::

What's new:

- **"Use let for every variable."** Without this rule, an assistant may use `var` or `const`, depending on the examples it learned from. `let` works everywhere and lets you change any value. You'll learn when to use `const` in the lesson on functions, and this rule will come off then.
- **"Write each step on its own line."** This asks for code like the second greeting function, where each line does one thing and you can check any step with `console.log`. The rule names chained method calls specifically, because "each step on its own line" alone wasn't enough, as you saw with the hours example.
- **Six new items** under "What I know so far." With `Number()` on the list, an assistant fixing the hours bug should reach for it instead of multiplying by 1.

## Summary

A variable is a name for a value, created with `let`. You can give it a new value with `=`, which works out the right side first and then stores the result. Every value has a type, and the three you'll use most are strings, numbers and booleans. `typeof` tells you which one you have. `getValue` reads a cell, and the type you get depends on what's in it: a cell formatted as plain text gives a string even when it looks like a number, so `+` joins instead of adding. `Number()` and `String()` convert between the two. Template literals build text with `${ }`. Code is easier to check when each line does one step and variables have names that say what they hold, and your learner profile now asks for both. So far your code does the same thing every time it runs. In the next lesson, it will look at a value and decide what to do.
