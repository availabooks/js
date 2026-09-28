---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain why programs are split into functions.
2. Write functions with parameters, and call them with arguments.
3. Use `return` to send a value back from a function.
4. Write a function that calls other functions, and run it from the Apps Script editor.
5. Choose between `const` and `let`, and explain what `const` does and doesn't prevent.
6. Explain why two rules come off your learner profile in this lesson.
:::
:::

## Why Split Code into Functions

In [Getting Started with Google Apps Script in Google Sheets](apps-script){.book-link}, you learned that a function is a named group of steps, and that Apps Script runs code by function name. Since then, every script has been a single function, because your learner profile asked for that. As scripts grow, one long function gets hard to read. The report at the end of [Loops and Repetition](loops){.book-link} already did three jobs in one block: reading the sheet, finding unpaid members and adding up hours.

Splitting code into several functions, each doing one job, helps in three ways:

- **Each function has a name that says what it does.** A line like `calculateTotalHours(data)` tells you what happens without making you read the loop inside it.
- **You write a job once and use it many times.** A function that turns hours into a label can be called for every member, from any script that needs it.
- **You can check each part on its own.** A short function that does one thing is easier to read, and easier to test, than a long one that does everything.

You've been using functions like this since your first line of code. `console.log` is a function someone else wrote. You don't know how it puts text on the screen, and you don't need to: its name tells you what it does, and you hand it the value to display. That's the idea. In this lesson you'll write functions that work the same way.

## Parameters and Arguments

Here's a function that greets someone:

```{.code}
function greetTwoMembers() {
  greet("Ava")
  greet("Ben")
}

function greet(name) {
  console.log(`Hello, ${name}!`)
}
```

The new part is `name` in the parentheses of `greet`. It's a **parameter**: a variable that gets its value when the function is called. The first function, `greetTwoMembers`, calls `greet` twice. The first time, the value `"Ava"` goes into `name`, and the function displays *Hello, Ava!* The second time, `name` holds `"Ben"`. The value you pass in is called an **argument**.

::: {.term}
> **Parameter** — A variable listed in a function's parentheses, such as `name` in `function greet(name)`. It holds whatever value the function is called with.
:::

::: {.term}
> **Argument** — A value passed to a function when it's called, such as `"Ava"` in `greet("Ava")`.
:::

This is exactly how `console.log("Hello")` and `getRange("A1")` have worked all along. `"A1"` is an argument, and somewhere inside Apps Script, `getRange` has a parameter that receives it.

Run it. The editor below the code has a menu listing the functions in it, like the menu in the Apps Script toolbar, and **Run** runs whichever one is selected. The first function is selected to start with, so the examples in this lesson put the function to run first. You'll see why that matters later in the lesson.

A function can have several parameters, separated by commas. The arguments are matched to them in order:

```{.code}
function describeTwoMembers() {
  describeMember("Maya", 24)
  describeMember("Cam", 9.5)
}

function describeMember(firstName, hours) {
  console.log(`${firstName} has ${hours} volunteer hours.`)
}
```

The first argument goes into the first parameter, and the second into the second. Swap them, as in `describeMember(24, "Maya")`, and you get *24 has Maya volunteer hours.* JavaScript doesn't check that the arguments make sense. It just matches them up by position.

## Getting a Value Back with return

`greet` displays something, but often you want a function to *work something out* and give you the answer, so your code can use it. That's what `return` does:

```{.code}
function tryFullName() {
  let name = fullName("Keisha", "Brown")
  console.log(name)
  console.log(fullName("Dev", "Patel").length)
}

function fullName(firstName, lastName) {
  return `${firstName} ${lastName}`
}
```

`return` sends a value back to wherever the function was called. So `fullName("Keisha", "Brown")` becomes the string "Keisha Brown", which is stored in `name`. You can use a function call anywhere you could use a value. In the last line of `tryFullName`, `fullName("Dev", "Patel")` becomes "Dev Patel", and `.length` counts its characters.

::: {.term}
> **Return value** — The value a function sends back with `return`. The function call is replaced by that value, so it can be stored in a variable or used in an expression.
:::

Two more things about `return`:

- **It ends the function.** Any lines after a `return` that runs are skipped. That's handy in functions with an `if`: each branch can return its own answer.
- **A function without `return` gives back `undefined`.** If you store the result of `greet("Ava")`, you'll get `undefined`, because `greet` displays a greeting but doesn't return anything. When a variable holds `undefined` and you expected a value, check whether the function you called actually returns one.

Here's a function that returns a label for a number of hours, using the club's thresholds from [Making Decisions](decisions){.book-link}:

```{.code}
function testLabels() {
  console.log(labelForHours(24))
  console.log(labelForHours(9.5))
  console.log(labelForHours(2))
}

function labelForHours(hours) {
  if (hours >= 15) {
    return "High"
  } else if (hours >= 5) {
    return "Medium"
  } else {
    return "Low"
  }
}
```

Compare it with the version in [Making Decisions](decisions){.book-link}, which read a cell, decided and wrote the result all in one function. This one does only the deciding. It doesn't know about sheets or cells at all. That makes it easy to test, as `testLabels` does, and easy to reuse.

## Functions That Call Functions

Now put the pieces together. Here's the Members sheet again:

```{.spreadsheet}
{"sheetName": "Members", "rows": 16, "columns": 8,
 "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}],
 "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
```

This code labels every member's hours in column F. The first function does the work you'd run from the menu, and it calls `labelForHours` once for each member:

```{.code}
function labelAllMembers() {
  const sheet = SpreadsheetApp.getActiveSheet()
  const range = sheet.getDataRange()
  const data = range.getValues()

  // start at 1 to skip the header row
  for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
    const hours = data[rowIndex][4]
    const label = labelForHours(hours)
    // rowIndex 1 is sheet row 2, so the sheet row is one more than the index
    const labelCell = sheet.getRange(rowIndex + 1, 6)
    labelCell.setValue(label)
  }
}

function labelForHours(hours) {
  if (hours >= 15) {
    return "High"
  } else if (hours >= 5) {
    return "Medium"
  } else {
    return "Low"
  }
}
```

Make sure `labelAllMembers` is selected in the menu below the code, and run it. When the loop reaches `labelForHours(hours)`, JavaScript jumps into `labelForHours` with that member's hours, runs it until it reaches a `return`, and comes back with the label, which is stored in `label`. Then the loop carries on.

Two details are new. `sheet.getRange(rowIndex + 1, 6)` uses the numeric form of `getRange` you saw in [Loops and Repetition](loops){.book-link}: row `rowIndex + 1`, column 6, which is F. And the variables are created with `const` instead of `let`. You'll learn about `const` shortly.

The order of the functions in the file doesn't matter. `labelAllMembers` can call `labelForHours` even though it's written below it.

### What the Run button can and can't do

Now choose `labelForHours` in the menu and run it. Nothing useful happens. The Run button calls the function with no arguments, so `hours` has no value, which JavaScript calls `undefined`. `undefined >= 15` is false, and so is `undefined >= 5`, so the function returns "Low" to nobody.

Apps Script's Run button works the same way. So a script needs at least one function with no parameters that does the whole job: that's the one you run. It can call as many functions with parameters as it needs. In a well-organized script, the function you run reads almost like a list of steps, and the details are in the functions it calls.

## const

`const` creates a variable, like `let`, with one difference: once it has a value, you can't give it a new one.

```{.code}
const clubName = "Garden Club"
console.log(clubName)
clubName = "Book Club"
```

The last line stops with `TypeError: Assignment to constant variable`. A `const` variable is assigned once, when it's created, and that's it.

Why would you want a variable you can't change? Because most variables never *need* to change. In `labelAllMembers`, the sheet, the range and the data are set once and only read after that. Declaring them with `const` tells anyone reading the code, including you next month, that these values stay the same. If some line later tried to change one by mistake, JavaScript would stop with an error instead of quietly doing the wrong thing. Variables that do change, such as `rowIndex` in a `for` loop or a running total, use `let`.

So the rule most JavaScript programmers follow is: **use `const` unless you know the value will change, and then use `let`.** You'll see this in almost all modern code, including AI replies.

There's one surprise. A `const` variable that holds an array can't be given a *new array*, but the array it holds can still change:

```{.code}
const names = ["Maya", "Ava"]
names.push("Ben")
names[0] = "Dev"
console.log(names)
```

That runs without an error. `const` protects the variable, not what's inside it. `names` still refers to the same array. The array just has different items now. What `const` stops is `names = ["Cam"]`, which would make `names` refer to a different array.

## Your Learner Profile

This lesson makes the biggest change to your learner profile so far. Two rules come off, and two new ones replace them:

::: {.ai-profile lesson="functions"}
Add rules:

- Use const for a variable whose value never changes, and let for one that does. Don't use var.
- Put the steps for each task in a function with no parameters and a descriptive name, so I can run it from the Apps Script editor. That function can call other functions.

Remove rules:

- Put all the code in one function with a descriptive name. Don't create extra functions or use parameters.
- Use let for every variable. Don't use var or const.

Add to "What I know so far":

- functions with parameters, called with arguments
- return, to send a value back from a function
- calling one function from another
- const, and that an array created with const can still be changed with push
:::

Here's why each change makes sense now:

- **The one-function rule comes off.** It was there because you didn't know how functions pass values to each other, and code split into helpers you couldn't follow would have been harder to check, not easier. Now you know parameters, arguments and `return`, so a script made of several small functions is something you can read.
- **It's replaced by a rule about the function you run.** As you saw with `labelForHours`, the Run button can't pass arguments. This rule makes sure every script has a function you can run, whatever else it contains.
- **The `let`-only rule comes off.** It was there so you could change any variable while experimenting, without having to decide which ones should stay fixed. Now you know what `const` does, and code that uses it tells you something useful: which values stay the same.
- **It's replaced by the usual rule for `const` and `let`,** and `var` stays out.

This is the habit behind the whole profile: start with tight limits, and loosen them when you're ready for what they were holding back. Rules that come off aren't failures of the profile. They're signs of progress.

## Working with the New Profile

Here's the dues report from [Loops and Repetition](loops){.book-link} again, sent in a new chat with the updated profile and the Members sheet description:

::: {.ai-conversation prompt="My sheet is named Members. Row 1 has headers, and each row after that is one club member (rows 2 to 13). Column A is First Name, B is Last Name, C is Email, D is Dues Paid (a checkbox, so true or false), and E is Volunteer Hours (a number). Write Apps Script that logs the names of members who haven't paid their dues, and the total volunteer hours for all members." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="functions" transcript="functions/dues-report"}
> Here's the code:
>
> ```javascript
> function checkMembers() {
>   // Get the Members sheet
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>
>   // Read all the data from the sheet into an array of arrays
>   const data = sheet.getDataRange().getValues()
>
>   // This will keep a running total of volunteer hours
>   let totalHours = 0
>
>   // Loop through each row, starting at 1 to skip the header row
>   for (let i = 1; i < data.length; i++) {
>
>     // Get the values from this row and store them with clear names
>     const firstName = data[i][0]
>     const lastName = data[i][1]
>     const duesPaid = data[i][3]
>     const hours = data[i][4]
>
>     // If dues haven't been paid, log the member's name
>     if (duesPaid === false) {
>       Logger.log(`${firstName} ${lastName} has not paid dues`)
>     }
>
>     // Add this member's hours to the running total
>     totalHours += hours
>   }
>
>   // Log the total volunteer hours after the loop finishes
>   Logger.log(`Total volunteer hours: ${totalHours}`)
> }
> ```
>
> **How it works:**
>
> 1. `getSheetByName("Members")` finds your sheet by name.
> 2. `getDataRange().getValues()` reads everything into a 2D array, so `data[i][0]` is First Name, `data[i][3]` is Dues Paid, and so on.
> 3. `totalHours` starts at 0 before the loop, so we can add to it as we go — this is the running total pattern.
> 4. The loop starts at `i = 1` to skip the header row in row 1.
> 5. Inside the loop, we pull out each piece of data with a clear name so the code is easy to read.
> 6. `if (duesPaid === false)` checks the checkbox value directly, since checkboxes read as `true` or `false` already — no conversion needed.
> 7. `totalHours += hours` adds each row's volunteer hours to the total.
> 8. After the loop ends, we log the final total.
>
> Run `checkMembers` from the Apps Script editor, then check **View > Logs** (or the Execution log) to see the output.
:::

**Read.** The first change you'll notice is `const`. The sheet, the data and each row's values are set once and never change, so they're `const`. `totalHours` changes on every pass, so it's `let`, and so is the loop counter `i`. That's the new rule, applied exactly.

The second thing is what *didn't* change: it's still one function. Removing a rule allows something, but doesn't require it, and for a task this small, one function is a reasonable choice. (It also chains two method calls again, and mentions the old **View** menu, both of which you've seen before.)

If you want smaller functions, ask:

::: {.ai-conversation prompt="Refactor this into smaller functions, and explain what each one does." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="functions" transcript="functions/dues-report"}
> Here's the refactored version, split into smaller functions:
>
> ```javascript
> function checkMembers() {
>   // Get the member data from the sheet
>   const data = getMemberData()
>
>   // Log the names of members who haven't paid dues
>   logUnpaidDues(data)
>
>   // Calculate the total volunteer hours
>   const totalHours = calculateTotalHours(data)
>
>   // Log the total
>   Logger.log(`Total volunteer hours: ${totalHours}`)
> }
>
> function getMemberData() {
>   // Get the Members sheet
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>
>   // Read all the data into an array of arrays
>   const data = sheet.getDataRange().getValues()
>
>   // Send the data back to whichever function called this one
>   return data
> }
>
> function logUnpaidDues(data) {
>   // Loop through each row, starting at 1 to skip the header row
>   for (let i = 1; i < data.length; i++) {
>
>     // Get the values from this row and store them with clear names
>     const firstName = data[i][0]
>     const lastName = data[i][1]
>     const duesPaid = data[i][3]
>
>     // If dues haven't been paid, log the member's name
>     if (duesPaid === false) {
>       Logger.log(`${firstName} ${lastName} has not paid dues`)
>     }
>   }
> }
>
> function calculateTotalHours(data) {
>   // This will keep a running total of volunteer hours
>   let totalHours = 0
>
>   // Loop through each row, starting at 1 to skip the header row
>   for (let i = 1; i < data.length; i++) {
>
>     // Get the hours from this row
>     const hours = data[i][4]
>
>     // Add this member's hours to the running total
>     totalHours += hours
>   }
>
>   // Send the total back to whichever function called this one
>   return totalHours
> }
> ```
>
> **What each function does:**
>
> - **`checkMembers`** is the main function you'll run. It doesn't do any work itself — it just calls the other three functions in order and logs the final result. This makes it easy to read at a glance what the overall task does.
>
> - **`getMemberData`** handles only the job of getting the sheet and reading its values. It returns the data array so other functions can use it. This means if you ever need member data somewhere else, you can just call this function instead of repeating the same two lines.
>
> - **`logUnpaidDues`** takes the data as a parameter and loops through it, logging names of members who haven't paid dues. It only handles that one task.
>
> - **`calculateTotalHours`** takes the data as a parameter, loops through it, and returns the total volunteer hours. It only handles that one task.
>
> Since `getMemberData` reads the sheet only once, and `checkMembers` passes that same `data` array into both `logUnpaidDues` and `calculateTotalHours`, we avoid reading the sheet twice.
:::

**Read.** This is worth reading slowly, because it uses everything in this lesson:

- **`checkMembers`** is the function you run. It has no parameters, as your profile asks, and it reads like a list of steps: get the data, log the unpaid members, calculate the total, log it.
- **`getMemberData`** takes no arguments and *returns* the data. In `checkMembers`, `const data = getMemberData()` stores what it returns.
- **`logUnpaidDues(data)`** receives the data through its parameter, also named `data`, and logs names. It doesn't return anything, because its job is to log.
- **`calculateTotalHours(data)`** receives the data, works out the total and returns it, and `checkMembers` stores the answer in `totalHours`.

Notice that `data` appears in all four functions. The name is the same, but each function's `data` is its own variable. When `checkMembers` calls `logUnpaidDues(data)`, the array in *its* `data` is passed in, and becomes the value of `logUnpaidDues`'s parameter. The parameter could have been called `rows` or `memberData`, and the code would work the same way. Matching names just make the connection easier to see.

The assistant also pointed out a detail you might have missed: the sheet is read only once, in `getMemberData`, and the same array is passed to both of the other functions.

Run it. Keep `checkMembers` selected, since it's the function that does the whole job. Then try choosing `logUnpaidDues` in the menu, and see what happens when `data` has no value.

```{.code}
function checkMembers() {
  // Get the member data from the sheet
  const data = getMemberData()

  // Log the names of members who haven't paid dues
  logUnpaidDues(data)

  // Calculate the total volunteer hours
  const totalHours = calculateTotalHours(data)

  // Log the total
  Logger.log(`Total volunteer hours: ${totalHours}`)
}

function getMemberData() {
  // Get the Members sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")

  // Read all the data into an array of arrays
  const data = sheet.getDataRange().getValues()

  // Send the data back to whichever function called this one
  return data
}

function logUnpaidDues(data) {
  // Loop through each row, starting at 1 to skip the header row
  for (let i = 1; i < data.length; i++) {

    // Get the values from this row and store them with clear names
    const firstName = data[i][0]
    const lastName = data[i][1]
    const duesPaid = data[i][3]

    // If dues haven't been paid, log the member's name
    if (duesPaid === false) {
      Logger.log(`${firstName} ${lastName} has not paid dues`)
    }
  }
}

function calculateTotalHours(data) {
  // This will keep a running total of volunteer hours
  let totalHours = 0

  // Loop through each row, starting at 1 to skip the header row
  for (let i = 1; i < data.length; i++) {

    // Get the hours from this row
    const hours = data[i][4]

    // Add this member's hours to the running total
    totalHours += hours
  }

  // Send the total back to whichever function called this one
  return totalHours
}
```

Running `logUnpaidDues` by itself stops with an error saying it can't read `length` of `undefined`. That's `data.length`, with no data. It's the same lesson as `labelForHours`: a function with parameters needs to be called by code that supplies the arguments.

### A const mistake

Now suppose you notice that everything else uses `const`, and change `let totalHours = 0` to `const totalHours = 0` for consistency. Try it in the code above, run `checkMembers` again, and you'll get an error. Here's the explanation, in the same chat:

::: {.ai-conversation prompt="I changed let totalHours = 0 to const totalHours = 0 in calculateTotalHours, since everything else uses const. Now I get TypeError: Assignment to constant variable. What does that mean? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="functions" transcript="functions/dues-report"}
> That error means you tried to change the value of a variable that was declared with `const`, and JavaScript doesn't allow that.
>
> Remember the rule: `const` is for a variable whose value never changes, and `let` is for one that does. When you write `const totalHours = 0`, you're telling JavaScript "this variable will always be 0 — I won't change it later."
>
> But inside the loop, this line:
>
> ```javascript
> totalHours += hours
> ```
>
> is actually short for `totalHours = totalHours + hours`, which **reassigns** `totalHours` to a new value on every loop. Since you declared it with `const`, JavaScript blocks this and throws the error `Assignment to constant variable`.
>
> This is different from the array situation you learned earlier, where `const` still allows `push` — because `push` changes what's *inside* the array without reassigning the variable itself to a new array. But `totalHours += hours` reassigns the variable directly, which `const` never allows.
>
> So the fix would involve looking at which variables actually get reassigned somewhere in the code, and making sure those use `let` instead of `const`.
:::

The explanation connects three things you've learned: `+=` is short for an assignment, a running total has to be reassigned on every pass, and `const` never allows reassignment. It even contrasts this with `push`, which changes an array without reassigning the variable. So you can fix it yourself: change `const totalHours` back to `let totalHours`.

A good rule of thumb: when you're deciding between `const` and `let`, look for any line that uses `=`, `+=` or `++` on the variable after it's created. If there is one, it needs `let`.

## Summary

Functions let you split a script into named jobs that you can read, reuse and test separately. A function's parameters receive the arguments it's called with, matched by position, and `return` sends a value back, ending the function. A function call can be used anywhere a value can. In Apps Script, the Run button calls a function with no arguments, so every script needs a function with no parameters that does the whole job, calling other functions as needed. `const` creates a variable that can't be given a new value, which makes clear which values stay the same; use `let` for values that change, such as counters and running totals. A `const` array can still change its contents. Your learner profile dropped two scaffolding rules in this lesson, the one-function rule and the `let`-only rule, because you've learned what they were holding back. In the next lesson, you'll meet the club behind the Members sheet, and start working with its data.
