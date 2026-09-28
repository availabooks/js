---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Create arrays, read items by index, and use `length` and `push`.
2. Explain how an array of arrays represents the rows and columns of a sheet.
3. Read a whole range with `getValues` and write one with `setValues`.
4. Describe a sheet to an AI assistant so it doesn't have to guess.
5. Check an assistant's stated assumptions, and diagnose an error in code the assistant wrote.
:::
:::

## Lists of Values

A variable holds one value. Real data comes in lists: every member's name, every shift's hours, every row of a sheet. JavaScript holds a list in an **array**:

<pre class="code">
let firstNames = ["Maya", "Ava", "Ben", "Cam"]
console.log(firstNames)
</pre>

An array is written in square brackets, with its items separated by commas. The items can be any type: strings, numbers, booleans, or a mix.

::: {.term}
> **Array** — An ordered list of values, written in square brackets: `["Maya", "Ava", "Ben"]`. Each value in the list is an *item* or *element*.
:::

To get one item, write the array's name followed by the item's position in square brackets. The position is called its **index**, and indexes start at **0**, not 1:

<pre class="code">
let firstNames = ["Maya", "Ava", "Ben", "Cam"]
console.log(firstNames[0])
console.log(firstNames[1])
console.log(firstNames[3])
</pre>

So `firstNames[0]` is "Maya", the first item, and `firstNames[3]` is "Cam", the fourth. Starting at 0 feels strange at first, and it's the source of many "off by one" mistakes. When you read code with an index, count from zero.

::: {.term}
> **Index** — An item's position in an array, counting from 0. In `firstNames[2]`, the index is 2, which is the third item.
:::

Try `firstNames[4]`. There's no fifth item, so you get `undefined`, JavaScript's way of saying "there's nothing here." It doesn't stop with an error, which means a wrong index can slip by unnoticed.

Three more things you'll use constantly:

<pre class="code">
let firstNames = ["Maya", "Ava", "Ben"]

// length is how many items the array has
console.log(firstNames.length)

// push adds an item to the end
firstNames.push("Cam")
console.log(firstNames, firstNames.length)

// you can change an item by assigning to its index
firstNames[0] = "Dev"
console.log(firstNames)
</pre>

Notice that `length` has no parentheses. It's a **property**, a value that belongs to the array, not a method that does something. `push("Cam")` is a method, so it has parentheses to carry the value to add.

Because indexes start at 0, the last item's index is always one less than the length. With 4 items, the last one is `firstNames[3]`, which you can also write as `firstNames[firstNames.length - 1]`.

## Arrays of Arrays

An array's items can themselves be arrays. That's how JavaScript represents a table: an array of rows, where each row is an array of values:

<pre class="code">
let members = [
  ["First Name", "Last Name", "Hours"],
  ["Maya", "Thompson", 24],
  ["Ava", "Lopez", 12],
  ["Ben", "Okafor", 4]
]

console.log(members[1])
console.log(members[1][0])
console.log(members[2][2])
</pre>

Read `members[1][0]` from left to right: `members[1]` is the second row, `["Maya", "Thompson", 24]`, and `[0]` is the first item in that row, "Maya". So the first index picks the row and the second picks the column. `members[2][2]` is row index 2 (Ava's row), column index 2 (hours): 12.

Writing the array over several lines, one row per line, doesn't change it. JavaScript ignores the line breaks. It just makes the rows easy to see.

::: {.term}
> **Array of arrays** — An array whose items are arrays, often used for rows and columns: `data[row][column]`. Also called a *two-dimensional array*.
:::

## Reading a Whole Sheet

Here's the club's Members sheet again:

<pre class="spreadsheet">
{"sheetName": "Members", "rows": 16, "columns": 8,
 "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}],
 "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
</pre>

`getValue` reads one cell. `getValues`, with an *s*, reads a whole range at once and gives you an array of arrays, one inner array per row:

<pre class="code">
function readMembers() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let range = sheet.getRange("A1:E13")
  let data = range.getValues()
  console.log(data.length)
  console.log(data[0])
  console.log(data[1])
  console.log(data[1][2])
}
</pre>

Run it and compare the output with the sheet:

- `data.length` is 13, one for each row, including the header row.
- `data[0]` is the header row. Rows in the sheet are numbered from 1, but array indexes start at 0, so sheet row 1 is `data[0]` and sheet row 2 is `data[1]`.
- `data[1][2]` is row index 1 (Maya), column index 2 (column C, the email). Columns are counted from 0 too: A is 0, B is 1, C is 2, and so on.

Keeping these two numbering systems straight is the main skill in this lesson. When you see `data[5][4]`, translate it: row index 5 is sheet row 6, and column index 4 is column E.

::: {.tip}
> **Why read the whole range?** You could read 65 cells one at a time with `getValue`. But each call to a sheet takes time, and a script that makes hundreds of them is slow. One `getValues` call brings everything into an array, where your code can work with it quickly.
:::

## Your Assistant Can't See Your Sheet

When you ask an assistant about your data, remember that it can't see your spreadsheet. It only knows what you tell it. Here's a request that tells it almost nothing, sent in a new chat with your learner profile from [Making Decisions](decisions){.book-link}:

::: {.ai-conversation prompt="Write an Apps Script function that reads my data and logs the first person's last name." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="decisions" transcript="arrays/first-last-name"}
> Since I don't know exactly how your sheet is laid out, I'll assume there's a header row (row 1) and the last name is in column B, so the first person's last name is in cell B2. Adjust the cell reference if your data is arranged differently.
>
> ```javascript
> function logFirstLastName() {
>   // Get the sheet you're currently working in
>   let sheet = SpreadsheetApp.getActiveSheet()
>
>   // Get the cell B2, where the first person's last name should be
>   let lastNameCell = sheet.getRange("B2")
>
>   // Read the value out of that cell
>   let lastName = lastNameCell.getValue()
>
>   // Display the value in the Execution log
>   console.log(lastName)
> }
> ```
>
> **Line by line:**
>
> 1. `SpreadsheetApp.getActiveSheet()` grabs the sheet you're currently viewing, and we store it in `sheet`.
> 2. `sheet.getRange("B2")` points to cell B2 (row 2, column B), stored in `lastNameCell`.
> 3. `.getValue()` reads whatever is written in that cell, stored in `lastName`.
> 4. `console.log(lastName)` prints that value so you can see it in the Execution log.
>
> Let me know how your data is actually arranged (which column has last names, whether there's a header row), and I can adjust the cell reference.
:::

The assistant didn't know where the last names were, so it assumed: a header in row 1 and last names in column B. It said so in its first sentence, and asked you to correct it at the end. That's good behavior, and it's also a warning. The code is only right if the assumptions are right.

In the same chat, you can say you've learned arrays and ask for a version that reads all the data:

::: {.ai-conversation prompt="I've now learned arrays: indexes starting at 0, length, push, arrays of arrays, and getValues and setValues. Rewrite it to read all of my data at once with getValues, then log the first person's last name from the array." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="decisions" transcript="arrays/first-last-name"}
> Here's the rewritten version using `getValues()` to grab everything at once, then pulling out the value we want using array indexes.
>
> ```javascript
> function logFirstLastName() {
>   // Get the sheet you're currently working in
>   let sheet = SpreadsheetApp.getActiveSheet()
>
>   // Get the range that covers all your data
>   let dataRange = sheet.getDataRange()
>
>   // Read all the values into an array of arrays (rows and columns)
>   let data = dataRange.getValues()
>
>   // Get the first person's row (index 1, since index 0 is the header row)
>   let firstPersonRow = data[1]
>
>   // Get the last name from that row (index 1, since last name is in column B)
>   let lastName = firstPersonRow[1]
>
>   // Display the value in the Execution log
>   console.log(lastName)
> }
> ```
>
> **Line by line:**
>
> 1. `sheet.getDataRange()` finds the range that covers all the data on the sheet (no need to type a specific range like "B2").
> 2. `.getValues()` reads that whole range into `data`, which is an array of arrays — each inner array is one row.
> 3. `data[1]` grabs the second row (index 1), since index 0 is the header row. This is `firstPersonRow`, an array of that row's column values.
> 4. `firstPersonRow[1]` grabs the second item in that row (index 1), which is column B — the last name.
> 5. `console.log(lastName)` prints it to the Execution log.
>
> Same assumption as before: header row on row 1, last names in column B. Let me know if your columns are arranged differently and I'll adjust the indexes.
:::

**Read.** You can follow this with what you've learned: `data` is an array of arrays, `data[1]` is the second row (the first person, after the header), and `firstPersonRow[1]` is the second item in that row, column B. The comments even translate the indexes for you.

One method is new: `getDataRange()`, which gets the range covering all the data on the sheet, so you don't have to type something like `"A1:E13"`. The assistant explained it, but didn't point out that it wasn't on your list.

The assistant repeated its assumptions at the end: a header row, and last names in column B. For this Members sheet, both are right, and the code logs "Thompson." But imagine a sheet with last names in column A and first names in column B, which is a common layout for a roster. The code would run without an error and log a *first* name, and nothing would tell you something was wrong. When an assistant states an assumption, check it against your sheet before you run the code.

## Describing Your Sheet

Better than checking guesses is not making the assistant guess. Describe your data in the prompt:

- the sheet's name,
- whether there's a header row, and which rows hold the data,
- what each column holds, and what type of value is in it.

Here's a description of the Members sheet, sent in the same chat along with a slightly bigger request:

::: {.ai-conversation prompt="Here is my sheet. It is named Members. Row 1 has headers, and each row after that is one club member (rows 2 to 13). Column A is First Name, B is Last Name, C is Email, D is Dues Paid (a checkbox, so true or false), and E is Volunteer Hours (a number). Using getValues, log the first member's full name and email, and whether they have paid their dues." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="decisions" transcript="arrays/first-last-name"}
> ```javascript
> function logFirstMemberInfo() {
>   // Get the sheet named "Members"
>   let sheet = SpreadsheetApp.getSheetByName("Members")
>
>   // Get the range that covers all the data on the sheet
>   let dataRange = sheet.getDataRange()
>
>   // Read all the values into an array of arrays (rows and columns)
>   let data = dataRange.getValues()
>
>   // Get the first member's row (index 1, since index 0 is the header row)
>   let firstMemberRow = data[1]
>
>   // Pull out each piece of info using the column indexes
>   let firstName = firstMemberRow[0]
>   let lastName = firstMemberRow[1]
>   let email = firstMemberRow[2]
>   let duesPaid = firstMemberRow[3]
>
>   // Combine first and last name into one string
>   let fullName = `${firstName} ${lastName}`
>
>   // Display the full name and email in the Execution log
>   console.log(`${fullName}, ${email}`)
>
>   // Check the dues paid value and log a readable message
>   if (duesPaid === true) {
>     console.log(`${fullName} has paid their dues`)
>   } else {
>     console.log(`${fullName} has not paid their dues`)
>   }
> }
> ```
>
> **Line by line:**
>
> 1. `SpreadsheetApp.getSheetByName("Members")` gets the specific sheet named "Members" (instead of just whichever sheet is active).
> 2. `sheet.getDataRange()` finds the range covering all the data.
> 3. `.getValues()` reads it all into `data`, an array of arrays (rows and columns).
> 4. `data[1]` grabs the second row (index 1) — the first member, since index 0 is headers. Stored in `firstMemberRow`.
> 5. `firstMemberRow[0]`, `[1]`, `[2]`, `[3]` pull out First Name, Last Name, Email, and Dues Paid using their column positions (A=0, B=1, C=2, D=3).
> 6. The template literal `` `${firstName} ${lastName}` `` joins first and last name with a space between, stored in `fullName`.
> 7. `console.log(...)` prints the name and email together, separated by a comma.
> 8. The `if/else` checks whether `duesPaid` is exactly `true`, and logs a matching message either way.
:::

**Read.** With the description, there's nothing left to assume. The code pulls four values out of `firstMemberRow` using the column indexes you gave: 0 for First Name, 1 for Last Name, 2 for Email, 3 for Dues Paid. Because you said Dues Paid is `true` or `false`, the `if` compares it with `true`. And because you named the sheet, the code now asks for the sheet named "Members" instead of whichever sheet is active, which is safer in a file with several sheets.

That last change uses a method you haven't seen, `getSheetByName`. Everything else looks right. Run it:

<pre class="code">
function logFirstMemberInfo() {
  // Get the sheet named "Members"
  let sheet = SpreadsheetApp.getSheetByName("Members")

  // Get the range that covers all the data on the sheet
  let dataRange = sheet.getDataRange()

  // Read all the values into an array of arrays (rows and columns)
  let data = dataRange.getValues()

  // Get the first member's row (index 1, since index 0 is the header row)
  let firstMemberRow = data[1]

  // Pull out each piece of info using the column indexes
  let firstName = firstMemberRow[0]
  let lastName = firstMemberRow[1]
  let email = firstMemberRow[2]
  let duesPaid = firstMemberRow[3]

  // Combine first and last name into one string
  let fullName = `${firstName} ${lastName}`

  // Display the full name and email in the Execution log
  console.log(`${fullName}, ${email}`)

  // Check the dues paid value and log a readable message
  if (duesPaid === true) {
    console.log(`${fullName} has paid their dues`)
  } else {
    console.log(`${fullName} has not paid their dues`)
  }
}
</pre>

It stops on the first line inside the function, with a TypeError. The code came from the assistant, but the error is yours to understand, so paste it back and ask:

::: {.ai-conversation prompt="When I ran it, I got this error: TypeError: SpreadsheetApp.getSheetByName is not a function. What does it mean? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="decisions" transcript="arrays/first-last-name"}
> This error means JavaScript tried to run something as a function, but it isn't one (or doesn't exist where you're looking for it).
>
> Breaking down the message:
>
> - **TypeError** — this is a category of error that happens when you try to use a value in a way that doesn't match its type. Here, you're trying to *call* `getSheetByName` like a function (with parentheses and an argument), but JavaScript says that's not a valid function to call in this spot.
> - **SpreadsheetApp.getSheetByName is not a function** — this tells you specifically that `SpreadsheetApp.getSheetByName` doesn't exist as a method, so trying to call it with `()` fails.
>
> This usually means one of two things:
> 1. The method name is slightly wrong (misspelled, or it doesn't exist at all).
> 2. The method exists, but not directly on `SpreadsheetApp` — it might belong to a different object, and you need to get that object first before calling the method on it.
>
> Want me to explain which of these is happening here, or would you like to look it up yourself first?
:::

The explanation narrows the problem to two possibilities: the method doesn't exist, or it exists but belongs to something else. Your code has used `SpreadsheetApp.getActiveSheet()` many times, so asking `SpreadsheetApp` for a sheet looks reasonable. The question is whether `getSheetByName` works the same way. Now ask for the fix:

::: {.ai-conversation prompt="Now fix it." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="decisions" transcript="arrays/first-last-name"}
> ```javascript
> function logFirstMemberInfo() {
>   // Get the spreadsheet you're currently working in
>   let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
>
>   // Get the sheet named "Members" from that spreadsheet
>   let sheet = spreadsheet.getSheetByName("Members")
>
>   // Get the range that covers all the data on the sheet
>   let dataRange = sheet.getDataRange()
>
>   // Read all the values into an array of arrays (rows and columns)
>   let data = dataRange.getValues()
>
>   // Get the first member's row (index 1, since index 0 is the header row)
>   let firstMemberRow = data[1]
>
>   // Pull out each piece of info using the column indexes
>   let firstName = firstMemberRow[0]
>   let lastName = firstMemberRow[1]
>   let email = firstMemberRow[2]
>   let duesPaid = firstMemberRow[3]
>
>   // Combine first and last name into one string
>   let fullName = `${firstName} ${lastName}`
>
>   // Display the full name and email in the Execution log
>   console.log(`${fullName}, ${email}`)
>
>   // Check the dues paid value and log a readable message
>   if (duesPaid === true) {
>     console.log(`${fullName} has paid their dues`)
>   } else {
>     console.log(`${fullName} has not paid their dues`)
>   }
> }
> ```
>
> **What changed:**
>
> `getSheetByName` is a method that belongs to a **Spreadsheet** object, not to `SpreadsheetApp` itself. `SpreadsheetApp` is more like a starting point that gives you access to a spreadsheet — you first have to get the spreadsheet itself, then ask it for a sheet by name.
>
> So I added this line:
>
> ```javascript
> let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
> ```
>
> This gets the actual spreadsheet file you're working in, and stores it in `spreadsheet`. Then:
>
> ```javascript
> let sheet = spreadsheet.getSheetByName("Members")
> ```
>
> calls `getSheetByName` on the spreadsheet (not on `SpreadsheetApp`), which works correctly.
:::

So the second possibility was right. `getSheetByName` belongs to a *spreadsheet*, the whole file, which you get with `SpreadsheetApp.getActiveSpreadsheet()`. A spreadsheet contains sheets, so you ask the spreadsheet for one by name. `getActiveSheet()` happens to work on both `SpreadsheetApp` and a spreadsheet, which is probably how the assistant mixed them up.

Notice what the reply doesn't say: that the mistake was its own. It explains what was wrong as if the code had come from somewhere else. That's not unusual, and it doesn't matter much, but it's a reminder that an assistant's code is a draft, not a finished product. It looked right, the explanation of each line was confident, and it still didn't run. Reading catches a lot, and running catches the rest.

::: {.note}
> **Spreadsheet or sheet?** In Apps Script, a *spreadsheet* is the whole file, and a *sheet* is one tab inside it. `SpreadsheetApp.getActiveSpreadsheet()` gets the file, and its `getSheetByName("Members")` gets the tab named Members. When a sheet name is wrong, `getSheetByName` gives back `null`, and the next line fails with an error that mentions `null`.
:::

Here's the corrected function. Run it now:

<pre class="code">
function logFirstMemberInfo() {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName("Members")
  let dataRange = sheet.getDataRange()
  let data = dataRange.getValues()
  let firstMemberRow = data[1]
  let firstName = firstMemberRow[0]
  let lastName = firstMemberRow[1]
  let email = firstMemberRow[2]
  let duesPaid = firstMemberRow[3]
  let fullName = `${firstName} ${lastName}`
  console.log(`${fullName}, ${email}`)
  if (duesPaid === true) {
    console.log(`${fullName} has paid their dues`)
  } else {
    console.log(`${fullName} has not paid their dues`)
  }
}
</pre>

Change `data[1]` to `data[3]` and run it again. Which member is that? Check your answer against the sheet.

A sheet description is worth saving somewhere you can copy it from, such as a note or a document. You'll paste it into any chat where you ask about that sheet, right after your learner profile.

## Writing Several Cells at Once

`setValues` is the partner of `getValues`: it writes an array of arrays into a range. Continuing the same chat:

::: {.ai-conversation prompt="Next I want to write the labels High, Medium and Low into F2, F3 and F4 on the same sheet, all at once with one setValues call." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="decisions" transcript="arrays/first-last-name"}
> ```javascript
> function writeVolunteerLabels() {
>   // Get the spreadsheet you're currently working in
>   let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
>
>   // Get the sheet named "Members" from that spreadsheet
>   let sheet = spreadsheet.getSheetByName("Members")
>
>   // Get the range F2:F4, where the labels will go
>   let labelRange = sheet.getRange("F2:F4")
>
>   // Build an array of arrays: one row per label, one column per row
>   let labels = [["High"], ["Medium"], ["Low"]]
>
>   // Write all three labels into the range at once
>   labelRange.setValues(labels)
> }
> ```
>
> **Line by line:**
>
> 1. `SpreadsheetApp.getActiveSpreadsheet()` gets the spreadsheet file, stored in `spreadsheet`.
> 2. `spreadsheet.getSheetByName("Members")` gets the "Members" sheet from it, stored in `sheet`.
> 3. `sheet.getRange("F2:F4")` points to the three cells F2, F3, and F4 together, stored in `labelRange`.
> 4. `setValues` needs an array of arrays — one inner array per row, since a range is thought of as a grid of rows and columns. Since we only have one column, each inner array holds just one value: `[["High"], ["Medium"], ["Low"]]`. This is stored in `labels`.
> 5. `labelRange.setValues(labels)` writes those three rows into F2:F4 all at once — "High" goes in F2, "Medium" in F3, "Low" in F4.
:::

**Read.** The important line is `let labels = [["High"], ["Medium"], ["Low"]]`. Even though there's only one column, each label is inside its own inner array, because `setValues` always takes rows, and each row is an array. Three rows of one column each fit the range F2:F4, which is also three rows of one column.

Run it, and watch column F:

<pre class="code">
function writeVolunteerLabels() {
  // Get the spreadsheet you're currently working in
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()

  // Get the sheet named "Members" from that spreadsheet
  let sheet = spreadsheet.getSheetByName("Members")

  // Get the range F2:F4, where the labels will go
  let labelRange = sheet.getRange("F2:F4")

  // Build an array of arrays: one row per label, one column per row
  let labels = [["High"], ["Medium"], ["Low"]]

  // Write all three labels into the range at once
  labelRange.setValues(labels)
}
</pre>

Now add a fourth label for Cam in row 5, by changing the `labels` line to `let labels = [["High"], ["Medium"], ["Low"], ["Medium"]]`, and run it again. You'll get an error. Here's what the assistant made of it:

::: {.ai-conversation prompt="I added a fourth label, so the line is now let labels = [[&quot;High&quot;], [&quot;Medium&quot;], [&quot;Low&quot;], [&quot;Medium&quot;]]. When I run it I get: Exception: The number of rows in the data does not match the number of rows in the range. The data has 4 but the range has 3. What does this mean? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="decisions" transcript="arrays/first-last-name"}
> This error means there's a mismatch between the size of the data you're trying to write and the size of the range you're writing it into.
>
> Breaking it down:
>
> - **Exception** — this is a runtime error, meaning the code ran but hit a problem partway through (as opposed to a typo-type error that stops it before it even starts).
> - **The number of rows in the data does not match the number of rows in the range** — `setValues` expects the array of arrays you give it to line up exactly with the range you're writing to. Each inner array becomes one row in that range. If the range has 3 rows, `setValues` expects exactly 3 inner arrays — no more, no less.
> - **The data has 4 but the range has 3** — your `labels` array now has 4 inner arrays (`["High"]`, `["Medium"]`, `["Low"]`, `["Medium"]`), but `labelRange` still refers to `"F2:F4"`, which is only 3 cells (3 rows, 1 column).
>
> So the range you defined and the data you're trying to put into it no longer agree on how many rows there are. To fix this, something needs to change so both sides match — either the range needs to cover 4 rows, or the data needs to go back to 3 items. Want me to fix it now?
:::

The message says exactly what's wrong, once you know how to read it: four rows of data, three rows of range. `setValues` needs them to match exactly. Fix it yourself: change the range so it covers four rows, then run the code again. (The answer is at the end of this section.)

`setValues` also fails if you forget the inner arrays and write `["High", "Medium", "Low"]`. That's one row of three columns, not three rows of one column, and Apps Script says the parameters "don't match the method signature."

(The fix: change `"F2:F4"` to `"F2:F5"`.)

## Reading Code from Elsewhere

To finish, here's the kind of code you'll find online and in replies from an assistant that doesn't have your profile. The request describes the sheet, but no profile was sent:

::: {.ai-conversation prompt="My Google Sheet is named Members. Row 1 has headers: First Name, Last Name, Email, Dues Paid, Volunteer Hours. Write Apps Script that reads the data with getValues and logs the first member's full name and email." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="none" transcript="arrays/no-profile"}
> Here's an Apps Script function that reads the data from your "Members" sheet and logs the first member's full name and email:
>
> ```javascript
> function logFirstMember() {
>   // Get the active spreadsheet and the "Members" sheet
>   const ss = SpreadsheetApp.getActiveSpreadsheet();
>   const sheet = ss.getSheetByName("Members");
>
>   // Get all data from the sheet as a 2D array
>   const data = sheet.getDataRange().getValues();
>
>   // Row 0 is the header row, so the first member is row index 1
>   const firstMemberRow = data[1];
>
>   // Columns: 0 = First Name, 1 = Last Name, 2 = Email, 3 = Dues Paid, 4 = Volunteer Hours
>   const firstName = firstMemberRow[0];
>   const lastName = firstMemberRow[1];
>   const email = firstMemberRow[2];
>
>   const fullName = firstName + " " + lastName;
>
>   Logger.log("Full Name: " + fullName);
>   Logger.log("Email: " + email);
> }
> ```
>
> ### How it works:
> 1. **`SpreadsheetApp.getActiveSpreadsheet()`** — gets the current spreadsheet.
> 2. **`getSheetByName("Members")`** — targets your specific sheet by name.
> 3. **`getDataRange().getValues()`** — reads all the data into a 2D array (`data`), where `data[0]` is the header row and `data[1]` is the first member's row.
> 4. Indexes `[0]`, `[1]`, `[2]` correspond to **First Name**, **Last Name**, and **Email** columns respectively, based on your headers.
> 5. **`Logger.log()`** — outputs the results, which you can view via **View > Logs** (or `Ctrl+Enter` in the Apps Script editor) after running the function.
>
> ### To run it:
> 1. Open your Google Sheet.
> 2. Go to **Extensions > Apps Script**.
> 3. Paste this code into the script editor.
> 4. Save, then select `logFirstMember` from the function dropdown and click **Run**.
> 5. Check the logs (**View > Logs** or **Ctrl+Enter**) to see the output.
>
> Let me know if you'd like a version that loops through *all* members instead of just the first one!
:::

You can read nearly all of it now. It uses `const` and semicolons, as expected, and a short variable name, `ss`, for the spreadsheet. It chains `getDataRange().getValues()`. And it uses `Logger.log` instead of `console.log`. In Apps Script, `Logger.log` also writes to the Execution log, so for your purposes the two work the same way.

The instructions at the end are the part to check. They say to see the output under **View**, then **Logs**. The current Apps Script editor has no View menu; the Execution log opens by itself below the code when you run a function. That menu was in an older version of the editor, and plenty of instructions written for it are still online. As in [Getting Started with Google Apps Script in Google Sheets](apps-script){.book-link}, check an assistant's directions against what's on your screen.

## Your Learner Profile

Here's the update for this lesson:

::: {.ai-profile lesson="arrays"}
Add to "What I know so far":

- arrays: square brackets, indexes starting at 0, length, push, and changing an item by its index
- arrays of arrays, read as data[row][column]
- reading a range with getValues() and writing one with setValues(), and getDataRange()
- getting a sheet by name with SpreadsheetApp.getActiveSpreadsheet().getSheetByName()
- Logger.log, which works like console.log in Apps Script
:::

Five new items, and no new rules this time.

Your sheet description doesn't go in the profile. The profile describes *you*: where you work, what you know and how you want code written. A sheet description describes one set of data, and you'll work with several. Keep each description handy, and paste it into a chat, after your profile, whenever you ask about that sheet.

## Summary

An array is an ordered list of values in square brackets, and each item has an index that starts at 0. `length` tells you how many items there are, and `push` adds one to the end. An array of arrays represents rows and columns, read as `data[row][column]`. `getValues` reads a range into an array of arrays, and `setValues` writes one, as long as its rows and columns match the range exactly. Remember that sheet rows and columns count from 1, but array indexes count from 0. An assistant can't see your spreadsheet, so it guesses at anything you don't describe, and even when it tells you its assumptions, you have to check them. Describing your sheet in the prompt removes the guesswork. Even then, code from an assistant can contain mistakes like calling a method on the wrong thing, which is why you read it, run it, and understand any error before you ask for a fix. Next, you'll learn to repeat steps for every row of a sheet.
