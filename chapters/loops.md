---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Write a `while` loop, and explain how its condition controls when it stops.
2. Build a `for` loop from the three parts of a counting `while` loop.
3. Loop over the rows of a sheet, skipping the header row, to filter rows and add up values.
4. Recognize and fix an infinite loop.
5. Read code for lines that could damage your data before you run it.
6. Read a `forEach` loop in code you find.
:::
:::

## Doing the Same Thing Many Times

Here's the club's Members sheet, which you'll use throughout this lesson:

<pre class="spreadsheet">
{"sheetName": "Members", "rows": 16, "columns": 8,
 "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}],
 "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
</pre>

Suppose you want to log every member's name. Here's that request, in a new chat with your learner profile from [Arrays](arrays){.book-link} and the sheet description you wrote in that lesson:

::: {.ai-conversation prompt="My sheet is named Members. Row 1 has headers, and each row after that is one club member (rows 2 to 13). Column A is First Name, B is Last Name, C is Email, D is Dues Paid (a checkbox, so true or false), and E is Volunteer Hours (a number). Log the first and last name of every member, skipping the header row." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="arrays" transcript="loops/each-member"}
> Great exercise! One thing to flag: normally this kind of task uses a **loop** (like `for`), but that's not on your list yet. So instead, I'll read all the data at once with `getValues()`, then access each row by its index individually and log it. Since there are 12 members (rows 2–13), that means 12 lines that each look similar.
>
> ```javascript
> function logMemberNames() {
>   // Get the Members sheet
>   let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>
>   // Get all the data in the sheet as an array of arrays
>   let data = sheet.getDataRange().getValues()
>
>   // Each row in "data" is one row from the sheet
>   // data[0] is row 1 (the headers), so we skip that one
>   // data[1] is row 2, the first member, and so on
>
>   Logger.log(data[1][0] + " " + data[1][1])
>   Logger.log(data[2][0] + " " + data[2][1])
>   Logger.log(data[3][0] + " " + data[3][1])
>   Logger.log(data[4][0] + " " + data[4][1])
>   Logger.log(data[5][0] + " " + data[5][1])
>   Logger.log(data[6][0] + " " + data[6][1])
>   Logger.log(data[7][0] + " " + data[7][1])
>   Logger.log(data[8][0] + " " + data[8][1])
>   Logger.log(data[9][0] + " " + data[9][1])
>   Logger.log(data[10][0] + " " + data[10][1])
>   Logger.log(data[11][0] + " " + data[11][1])
>   Logger.log(data[12][0] + " " + data[12][1])
> }
> ```
>
> **What each part does:**
> - `sheet.getDataRange().getValues()` reads every cell in the sheet and stores it as an array of arrays — one inner array per row.
> - `data[1]` is the second row in the sheet (row 2), since arrays start counting at 0. `data[1][0]` is the First Name in that row, and `data[1][1]` is the Last Name.
> - Each `Logger.log` line joins a first and last name with a space and prints it, moving down one row at a time until row 13 (`data[12]`).
>
> This works, but you can probably already see it's repetitive — this is exactly the kind of problem loops are designed to solve. Once you learn `for` loops, this same task could be written in about 3 lines instead of 12. Want me to hold off on loops until your textbook introduces them, or are you curious to see a preview?
:::

This is the profile at work again. The usual tool for this job is a loop, which isn't on your list yet, so the assistant said so and solved the problem with what you know: twelve nearly identical lines, one per member. It works, and you can read every line.

But imagine the club grows to 200 members, or you decide to log emails instead of names. You'd have to write, or change, a line for every member. The assistant pointed this out itself, and offered a preview of loops.

::: {.note}
> **Did you spot the chained calls?** The reply chains `getActiveSpreadsheet().getSheetByName("Members")` and `getDataRange().getValues()`, even though your profile asks it not to chain method calls. The assistant followed the rule you care about most here, the one about unlearned concepts, and let this one slip. When it happens, a quick "Please follow my profile: one step per line" fixes it.
:::

A **loop** repeats a block of code, so you write the steps once and let the computer do them as many times as needed. This lesson builds up to the most common kind step by step, starting with the simplest.

::: {.term}
> **Loop** — Code that repeats a block of statements, usually once for each item in a list or until a condition changes. Each time through the block is called an *iteration*.
:::

## The while Loop

A `while` loop repeats its block as long as a condition is true. It looks like an `if` statement, but instead of running the block once, it goes back and checks the condition again after each time through:

<pre class="code">
let count = 1
while (count <= 5) {
  console.log(count)
  count = count + 1
}
console.log("The loop is done.")
</pre>

Follow it the way the computer does:

1. `count` starts at 1.
2. The condition `count <= 5` is true, so the block runs: it logs 1, then adds 1 to `count`, which becomes 2.
3. Back to the condition. `2 <= 5` is true, so the block runs again, logging 2.
4. This repeats for 3, 4 and 5.
5. After logging 5, `count` becomes 6. Now `6 <= 5` is false, so the loop ends, and the code carries on after the closing brace.

The line `count = count + 1` is what makes the loop end. Each time through, it moves `count` a step closer to making the condition false. Without it, the condition would stay true forever. You'll see what happens then later in this lesson.

### Shortcuts for counting

Adding 1 to a variable is so common that JavaScript has a shortcut for it, the **increment operator**, `++`. These two lines do the same thing:

<pre class="code" data-environment="none">
count = count + 1
count++
</pre>

`--`, the **decrement operator**, subtracts 1 in the same way. There's also a shortcut for adding any amount: `total += 5` means `total = total + 5`. You'll see all three in code from an assistant, so it's worth recognizing them.

You may also see `++count`, with the `++` in front. On a line by itself it does the same thing. It only behaves differently when it's part of a larger expression, which this book avoids because it makes code harder to read.

## A while Loop Over a Sheet

Now to the members. Here's code that reads the sheet and logs the first few rows, one line per row:

<pre class="code">
function logMembers() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let range = sheet.getDataRange()
  let data = range.getValues()
  console.log(data[1])
  console.log(data[2])
  console.log(data[3])
}
</pre>

Each line is the same except for the index. That's the clue for turning it into a loop. Replace the index with a variable, and change the variable each time:

<pre class="code" data-environment="none">
function logMembers() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let range = sheet.getDataRange()
  let data = range.getValues()
  let rowIndex = 1
  while (true) {
    console.log(data[rowIndex])
    rowIndex++
  }
}
</pre>

The condition here is just `true`, so this loop never stops. Don't run it. After the last member it would keep going, logging `undefined` for rows that don't exist, until you stopped it. It's here to show the part that changes: `rowIndex` starts at 1 and goes up by one each time, so `data[rowIndex]` is a different row on each pass.

To stop at the last row, the condition should be true while there are rows left and false once they run out. `data.length` is the number of rows, and the last row's index is `data.length - 1`, so the condition is `rowIndex < data.length`:

<pre class="code">
function logMembers() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let range = sheet.getDataRange()
  let data = range.getValues()
  let rowIndex = 1
  while (rowIndex < data.length) {
    console.log(data[rowIndex])
    rowIndex++
  }
}
</pre>

Run it. `data.length` is 13, so `rowIndex` goes from 1 to 12, and every member is logged. When `rowIndex` reaches 13, `13 < 13` is false, and the loop ends. Starting at 1 instead of 0 skips the header row.

Now changing what's logged means changing one line, not twelve. To log each member's name, pick items out of the row. Storing the row in its own variable makes that easier to read:

<pre class="code">
function logMembers() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let range = sheet.getDataRange()
  let data = range.getValues()
  let rowIndex = 1
  while (rowIndex < data.length) {
    let row = data[rowIndex]
    console.log(row[0], row[1])
    rowIndex++
  }
}
</pre>

`row` holds one member's row at a time, so `row[0]` is always a first name and `row[1]` a last name, whichever member the loop is on.

## From while to for

Look at the three parts of that loop that control it:

1. **Setting up** the counter, before the loop: `let rowIndex = 1`
2. **The condition**, checked before each pass: `rowIndex < data.length`
3. **The step**, at the end of each pass: `rowIndex++`

This pattern, a counter that starts somewhere, goes up by one, and stops at a limit, is so common that JavaScript has a loop built around it. Here's the same loop with two changes: the word `while` becomes `for`, and there's a semicolon on each side of the condition:

<pre class="code">
function logMembers() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let range = sheet.getDataRange()
  let data = range.getValues()
  let rowIndex = 1
  for (; rowIndex < data.length; ) {
    let row = data[rowIndex]
    console.log(row[0], row[1])
    rowIndex++
  }
}
</pre>

It looks odd, but it runs exactly the same. The semicolons mark out three slots in the `for` loop's parentheses: setup, condition, step. So far only the middle one is filled. Now move the setup into the first slot and the step into the third:

<pre class="code">
function logMembers() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let range = sheet.getDataRange()
  let data = range.getValues()
  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    let row = data[rowIndex]
    console.log(row[0], row[1])
  }
}
</pre>

That's a standard **`for` loop**. It does exactly what the `while` loop did, in the same order:

- The setup, `let rowIndex = 1`, runs once, before anything else.
- The condition, `rowIndex < data.length`, is checked before each pass. If it's false, the loop ends.
- The block runs.
- The step, `rowIndex++`, runs after each pass, even though it's written at the top. Then the condition is checked again.

That last point is the one that trips people up: the step is written before the block but runs after it. If you ever lose track, rewrite the `for` loop as the `while` loop above in your head.

Why have both? Because putting all three controlling parts on one line makes the loop easy to read: you can see where it starts, where it stops and how it moves without hunting through the block. Use `for` when you're counting through a list, which is most of the time, and `while` when you're repeating until something happens.

::: {.term}
> **for loop** — A loop with three parts in its parentheses, separated by semicolons: a setup that runs once, a condition checked before each pass, and a step that runs after each pass: `for (let i = 0; i < 5; i++) { }`.
:::

::: {.note}
> **Semicolons you can't leave out.** The semicolons inside a `for` loop's parentheses aren't the optional kind at the end of a line. They separate the three parts, and they're required.
:::

## Asking for a Loop

Back to the chat. With loops learned, you can ask again:

::: {.ai-conversation prompt="I've now learned while loops and for loops, and ++ and --. Rewrite it with a loop." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="arrays" transcript="loops/each-member"}
> Great, loops make this much shorter! Here's the same task using a `for` loop.
>
> ```javascript
> function logMemberNames() {
>   // Get the Members sheet
>   let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>
>   // Get all the data in the sheet as an array of arrays
>   let data = sheet.getDataRange().getValues()
>
>   // Start i at 1 to skip row 0 (the headers)
>   // Keep going while i is less than the number of rows
>   // Add 1 to i after each loop
>   for (let i = 1; i < data.length; i++) {
>     let firstName = data[i][0]
>     let lastName = data[i][1]
>     Logger.log(firstName + " " + lastName)
>   }
> }
> ```
>
> **What each part does:**
> - `data.length` is the total number of rows, including the header row, so the loop stops right after the last real row.
> - `i` starts at `1` instead of `0` so it skips the header row and starts on the first member.
> - Inside the loop, `data[i][0]` and `data[i][1]` get the first and last name for whichever row `i` currently points to.
> - `firstName` and `lastName` are stored in their own variables just to make the `Logger.log` line easier to read.
> - Each time through the loop, `i++` increases `i` by 1, moving to the next row, until `i` reaches `data.length` and the loop stops.
:::

**Read.** It's the loop you just built, with two small differences. The counter is called `i`, a very common name for a loop counter, short for *index*. And the reply stores each name in its own variable before logging it, where the book's version used a `row` variable. Both are fine. Twelve lines became one loop, and it would work just as well for 200 members.

Loops get useful when you combine them with the decisions from [Making Decisions](decisions){.book-link}. The club wants to know who hasn't paid their dues:

::: {.ai-conversation prompt="Now change it to log only the members who haven't paid their dues." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="arrays" transcript="loops/each-member"}
> Simple change — just add an `if` inside the loop to check column D (Dues Paid).
>
> ```javascript
> function logMemberNames() {
>   // Get the Members sheet
>   let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>
>   // Get all the data in the sheet as an array of arrays
>   let data = sheet.getDataRange().getValues()
>
>   // Start i at 1 to skip row 0 (the headers)
>   // Keep going while i is less than the number of rows
>   // Add 1 to i after each loop
>   for (let i = 1; i < data.length; i++) {
>     let firstName = data[i][0]
>     let lastName = data[i][1]
>     let duesPaid = data[i][3]
>
>     // Only log this member if their dues are not paid
>     if (duesPaid === false) {
>       Logger.log(firstName + " " + lastName)
>     }
>   }
> }
> ```
>
> **What's new:**
> - `duesPaid` grabs column D (index `3`, since A is 0, B is 1, C is 2, D is 3) for the current row.
> - The `if (duesPaid === false)` line checks whether that checkbox is unchecked, since the checkbox stores an actual boolean `true` or `false`, not text.
> - The `Logger.log` line moved inside the `if` block, so it only runs when the condition is true — meaning only unpaid members get logged.
:::

The `if` sits inside the loop, so it's checked once for every member, and only the unpaid ones are logged. Because you described Dues Paid as a checkbox, the assistant knew the value is a real boolean and compared it with `false`.

Then a total:

::: {.ai-conversation prompt="Now add up everyone's volunteer hours and log the total." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="arrays" transcript="loops/each-member"}
> This is a new task, so I'll write it fresh without the dues filter from before.
>
> ```javascript
> function logTotalVolunteerHours() {
>   // Get the Members sheet
>   let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>
>   // Get all the data in the sheet as an array of arrays
>   let data = sheet.getDataRange().getValues()
>
>   // This will keep a running total of everyone's hours
>   let totalHours = 0
>
>   // Start i at 1 to skip row 0 (the headers)
>   for (let i = 1; i < data.length; i++) {
>     let hours = data[i][4]
>     totalHours = totalHours + hours
>   }
>
>   Logger.log(totalHours)
> }
> ```
>
> **What each part does:**
> - `totalHours` starts at `0` before the loop, so we have a place to keep adding numbers to.
> - `hours` grabs column E (index `4`) for the current row, which is that member's Volunteer Hours.
> - `totalHours = totalHours + hours` takes the running total, adds this row's hours, and stores the new sum back into `totalHours`.
> - After the loop finishes going through all the members, `Logger.log(totalHours)` prints the final sum.
:::

This is a pattern you'll use constantly, called a **running total**. A variable starts at 0 *before* the loop, and each pass adds one member's hours to it. When the loop ends, it holds the sum. The variable has to be created before the loop: if `let totalHours = 0` were inside the block, it would be reset to 0 on every pass.

Here are both tasks in the book's style, in one function. Run it, and check the results against the sheet. The unpaid members should be Ben, Elena, Gabe and Jordan, and the total should be 123:

<pre class="code">
function reportMembers() {
  let spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName("Members")
  let range = sheet.getDataRange()
  let data = range.getValues()
  let totalHours = 0

  // start at 1 to skip the header row
  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    let row = data[rowIndex]
    let fullName = `${row[0]} ${row[1]}`
    let duesPaid = row[3]
    let hours = row[4]

    if (duesPaid === false) {
      console.log(`${fullName} hasn't paid dues`)
    }
    totalHours = totalHours + hours
  }

  console.log(`Total volunteer hours: ${totalHours}`)
}
</pre>

Try changing it: log the members with more than 10 hours, or count the unpaid members instead of listing them. (For a count, start a variable at 0 and add 1 to it inside the `if`.)

## When a Loop Never Ends

Sooner or later, you'll write a loop that never stops. Here's a typical one. Can you see the problem?

<pre class="code" data-environment="none">
function logFirstNames() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let range = sheet.getDataRange()
  let data = range.getValues()
  let rowIndex = 1
  while (rowIndex < data.length) {
    let firstName = data[rowIndex][0]
    console.log(firstName)
  }
}
</pre>

When it runs in Apps Script, it logs "Maya" over and over, and never finishes. Here's what an assistant said when asked about it, in a new chat with the learner profile:

::: {.ai-conversation prompt="My script never finishes. It keeps running until I click Stop. Why? Explain it, but don't fix it yet. (Then paste the code above.)" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="arrays" transcript="loops/never-finishes"}
> Your `while` loop's condition is `rowIndex < data.length`, but nothing inside the loop ever changes `rowIndex`. You set it to `1` before the loop starts, and then inside the loop you only read `data[rowIndex][0]` and log it — you never do something like `rowIndex = rowIndex + 1`.
>
> Since `rowIndex` stays `1` forever, the condition `rowIndex < data.length` never becomes false, so the loop never ends. It just keeps logging the same row's first name over and over until you manually stop it.
:::

The assistant spotted it immediately: nothing inside the loop changes `rowIndex`, so the condition `rowIndex < data.length` stays true forever. This is an **infinite loop**. The fix is the missing `rowIndex++` at the end of the block.

::: {.term}
> **Infinite loop** — A loop whose condition never becomes false, so it never ends. Usually caused by forgetting to change the variable the condition depends on.
:::

`for` loops are less prone to this, because the step is written right at the top where it's hard to forget. That's one more reason to prefer them for counting.

If your script runs much longer than you expect, click **Stop** in the Apps Script toolbar. If you don't, Apps Script stops it for you after six minutes, the longest a script is allowed to run.

::: {.caution}
> **Don't run an infinite loop in this book's editors.** The code editors on these pages run in your browser tab, and a loop that never ends can freeze the tab. That's why the loops above that never end are shown but can't be run. If a page ever stops responding, close the tab and reopen it.
:::

## Reading for Danger

Loops and `setValues` let code change a lot of data very quickly, which makes the Read step more important than ever. Here's a request for something that sounds harmless, sample data for practicing:

::: {.ai-conversation prompt="Write an Apps Script function that fills my sheet with sample data for a club member list: a header row with First Name, Last Name, Email, Dues Paid and Volunteer Hours, and five made-up members." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="arrays" transcript="loops/sample-data"}
> Here's a function that builds the sample data as an array of arrays, then writes it all to the sheet in one step with `setValues()`.
>
> ```javascript
> function fillClubMemberList() {
>   // Get the active sheet so we can write data into it
>   let sheet = SpreadsheetApp.getActiveSheet()
>
>   // Build the header row as an array
>   let headerRow = ["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"]
>
>   // Build each member row as an array
>   let member1 = ["Ava", "Chen", "ava.chen@example.com", "Yes", 12]
>   let member2 = ["Liam", "Torres", "liam.torres@example.com", "No", 5]
>   let member3 = ["Maya", "Patel", "maya.patel@example.com", "Yes", 20]
>   let member4 = ["Noah", "Kim", "noah.kim@example.com", "Yes", 8]
>   let member5 = ["Zoe", "Okafor", "zoe.okafor@example.com", "No", 0]
>
>   // Combine the header and all member rows into one array of arrays
>   let allData = [headerRow, member1, member2, member3, member4, member5]
>
>   // Get the range that matches the size of our data (6 rows, 5 columns)
>   let range = sheet.getRange("A1:E6")
>
>   // Write all the data into the sheet at once
>   range.setValues(allData)
> }
> ```
>
> **What's happening here:**
> - Each row of data (header and members) is its own array, just like the `data[row][column]` idea you've learned.
> - `allData` is an array of arrays — six rows total, each with five items.
> - `getRange("A1:E6")` selects a block of cells matching the shape of our data (6 rows, 5 columns).
> - `setValues(allData)` writes the whole block of data into the sheet in one step, instead of writing cell by cell.
>
> To run it, select `fillClubMemberList` in the Apps Script editor's function dropdown and click **Run**.
:::

The code is clear, and you can explain every line. Before you run it, though, ask the question from [Working with an AI Assistant](ai-assistant){.book-link}: *does it change or delete anything?*

It does. `sheet.getRange("A1:E6")` with `setValues` writes over cells A1 to E6 of the *active* sheet, whatever is there. If you ran it while the real Members sheet was showing, it would replace Maya, Ava, Ben, Cam and Dev with made-up people. Rows 7 to 13 would be left alone, so you'd end up with a mix of real and fake members, with no warning and no error. (**Edit**, then **Undo**, in Google Sheets can usually reverse it, if you notice in time.)

There's a second, quieter problem. The sample data uses the text "Yes" and "No" for Dues Paid, but your real sheet uses checkboxes, which are `true` and `false`. Code that checks `duesPaid === false` would find no unpaid members in this sample data. Practice data that doesn't match the real data's types can make working code look broken, or broken code look fine.

Neither problem is the assistant's fault. You asked it to fill "my sheet," and you didn't say what types to use. But it didn't warn you either. Reading for danger means looking for three things before you run code that works with real data:

- **Which sheet** it changes. "Active sheet" means whichever tab is showing when you click Run.
- **Which cells** it changes, and whether anything is already there.
- **Whether it deletes** anything. Watch for methods with names like `clear`, `delete` or `remove`.

Then run it on a practice copy. In Google Sheets, **File**, then **Make a copy**, gives you a whole spreadsheet to experiment on.

## Loops You'll See in Other Code

Here's the same kind of request, the unpaid members and the total hours, sent with the sheet description but without a learner profile:

::: {.ai-conversation prompt="My sheet is named Members. Row 1 has headers, and each row after that is one club member (rows 2 to 13). Column A is First Name, B is Last Name, C is Email, D is Dues Paid (a checkbox, so true or false), and E is Volunteer Hours (a number). Write Apps Script that logs the names of members who haven't paid their dues, and the total volunteer hours for all members." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="none" transcript="loops/no-profile"}
> ```javascript
> function checkDuesAndVolunteerHours() {
>   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members");
>   var data = sheet.getRange(2, 1, 12, 5).getValues(); // Rows 2-13, columns A-E
>
>   var unpaidMembers = [];
>   var totalVolunteerHours = 0;
>
>   for (var i = 0; i < data.length; i++) {
>     var firstName = data[i][0];
>     var lastName = data[i][1];
>     var duesPaid = data[i][3];
>     var volunteerHours = data[i][4];
>
>     if (duesPaid === false) {
>       unpaidMembers.push(firstName + " " + lastName);
>     }
>
>     totalVolunteerHours += Number(volunteerHours) || 0;
>   }
>
>   Logger.log("Members who haven't paid dues:");
>   if (unpaidMembers.length === 0) {
>     Logger.log("None — everyone has paid!");
>   } else {
>     unpaidMembers.forEach(function(name) {
>       Logger.log(name);
>     });
>   }
>
>   Logger.log("Total volunteer hours: " + totalVolunteerHours);
> }
> ```
>
> **How it works:**
> - `getRange(2, 1, 12, 5)` grabs rows 2–13 (12 rows) and columns A–E (5 columns).
> - It loops through each row, checking column D (index 3) for `false` to flag unpaid dues.
> - It adds up column E (index 4) for total volunteer hours, using `Number(...) || 0` to safely handle any blank cells.
> - Results are printed with `Logger.log()`, which you can view via **View > Logs** (or `Ctrl+Enter` in the Apps Script editor).
>
> **To run it:**
> 1. Open your spreadsheet.
> 2. Go to **Extensions > Apps Script**.
> 3. Paste this code in.
> 4. Click the ▶️ **Run** button (make sure `checkDuesAndVolunteerHours` is selected as the function).
> 5. Check the execution log for output.
>
> Let me know if you'd like this to also write results into the sheet itself instead of just logging them!
:::

A lesson ago, much of this would have been unreadable. Now you can follow most of it:

- **The `for` loop** is the one you know, starting at 0 because the range starts at row 2, so there's no header row in `data`.
- **`getRange(2, 1, 12, 5)`** is another way to write a range, with numbers: start at row 2, column 1, and take 12 rows and 5 columns. That's A2:E13.
- **`unpaidMembers.push(...)`** collects the unpaid names in an array to log later.
- **`totalVolunteerHours += ...`** is the `+=` shortcut for a running total.
- **`Number(volunteerHours) || 0`** converts the hours to a number, and uses 0 if that fails. `||` here isn't the *or* you learned in a condition; it picks the right-hand value when the left one is empty, zero or `NaN`. You don't need this trick, but now you know what it does.

Two things deserve a closer look. The first is the hard-coded 12 in `getRange(2, 1, 12, 5)`. When the club gets its thirteenth member, this code will silently leave them out. Code that uses `getDataRange()` and `data.length` adjusts to the data automatically.

The second is **`forEach`**, at the end:

<pre class="code" data-environment="none">
unpaidMembers.forEach(function(name) {
  Logger.log(name);
});
</pre>

`forEach` is a method that arrays have. It runs a function once for each item in the array, and hands the item to the function each time, here under the name `name`. So this does the same thing as:

<pre class="code" data-environment="none">
for (let i = 0; i < unpaidMembers.length; i++) {
  let name = unpaidMembers[i]
  Logger.log(name)
}
</pre>

`forEach` is shorter, and you'll see it often, along with another form, `for (let name of unpaidMembers)`, called *for...of*, which does the same. Both hide the counter, which is exactly why this book asks for the `for` loop with an index for now: you can see every step. You'll learn to use these shorter forms later in the book.

(The instructions in this reply also mention **View**, then **Logs**, the old editor menu you saw in [Arrays](arrays){.book-link}.)

## Your Learner Profile

::: {.ai-profile lesson="loops"}
Add rules:

- Use for loops with an index, such as for (let i = 0; i < data.length; i++). Don't use forEach or for...of.

Add to "What I know so far":

- while loops and for loops
- the ++, -- and += shortcuts
- running totals: a variable that starts at 0 before a loop and is added to inside it
- looping over the rows from getValues(), starting at 1 to skip a header row
- infinite loops, and why they happen
:::

What's new:

- **"Use for loops with an index."** Without this rule, an assistant may use `forEach` or `for...of`, which you can recognize now but haven't practiced. A `for` loop with an index shows you exactly where the loop starts, where it stops and which row it's on, which makes it easier to check. This rule will come off later in the book, when you'll use the shorter forms.
- **Five new items** under "What I know so far," covering the loops and patterns in this lesson.

## Summary

A loop repeats a block of code. A `while` loop repeats as long as its condition is true, so something inside it has to change the condition eventually, or it becomes an infinite loop. A counting `while` loop has three parts: a setup, a condition and a step. A `for` loop puts all three in its parentheses, which makes it the natural choice for going through the rows of a sheet: start at 1 to skip the header, and stop before `data.length`. Inside a loop, an `if` can pick out certain rows, and a running total can add up a column. Loops make code powerful, and code that changes many cells at once deserves careful reading: check which sheet and which cells it changes, and try it on a copy first. In code you find, you'll also see `forEach` and `for...of`, which do the same job with the counter hidden. So far, each of your scripts has been one function. In the next lesson, you'll learn to split code into several functions that work together.
