---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Create objects, and read and change their properties with dot notation and bracket notation.
2. Turn the rows of a sheet into an array of objects.
3. Count values with an object, and list its keys with `Object.keys`.
4. Explain what JSON is, and convert between objects and JSON with `JSON.stringify` and `JSON.parse`.
:::
:::

## Names Instead of Numbers

By now you've written `data[i][4]` many times, and each time you've had to remember, or look up, that column index 4 is Volunteer Hours. The code works, but it doesn't say what it means. It's a fair question to ask an assistant, so here it is, in a new chat with your learner profile from [Google Forms](google-forms){.book-link}:

::: {.ai-conversation prompt="In my scripts, lines like const hours = data[i][4] are hard to read, because I have to remember that column 4 is Volunteer Hours. Is there a way to refer to the values in a row by the column name instead of a number?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="google-forms" transcript="objects/by-name"}
> Good question! The most natural way to do this in JavaScript is with an **object** — something like `data[i].hours` instead of `data[i][4]`. But objects aren't on your list yet, so I won't use them.
>
> Here's a way to solve the same problem using only what you already know: instead of a plain number, store the column number in a **named constant**. That way your code reads like a label, even though it's still using a number underneath.
>
> ```javascript
> function sumVolunteerHours() {
>   // Give the column number a descriptive name
>   const HOURS_COLUMN = 4
>
>   // Get the sheet and its data
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1")
>   const data = sheet.getDataRange().getValues()
>
>   // Start a running total
>   let total = 0
>
>   // Loop over rows, skipping the header row
>   for (let i = 1; i < data.length; i++) {
>     const hours = data[i][HOURS_COLUMN]
>     total += hours
>   }
>
>   Logger.log(total)
> }
> ```
>
> Now `data[i][HOURS_COLUMN]` reads almost like `data[i].hours`, but it's just a number in disguise, so it still works exactly like before.
>
> If you want, once you're comfortable with arrays and functions, objects are the next concept that would let you write `row.hours` directly — happy to explain that later when you're ready. For now, would you like to try renaming your other column numbers this way?
:::

The assistant named the real answer, an **object**, then respected your profile and offered a workaround with what you know: a constant with a descriptive name. Writing a fixed value's name in capital letters with underscores, like `HOURS_COLUMN`, is a common convention for "this is a setting, not a value that changes." It's a good habit, and you'll see it in code from other people.

Did you notice the sheet name? The question didn't describe the sheet, so the assistant guessed `"Sheet1"`, the name Google gives the first sheet in a new spreadsheet. It's the same lesson as in [Arrays](arrays){.book-link}: whatever you don't describe, the assistant guesses.

The workaround helps, but objects are the real answer, so they're what this lesson is about.

## Objects

An array holds values in order, and you get each one by its position. An **object** holds values by *name*:

<pre class="code">
const member = {
  firstName: "Maya",
  lastName: "Thompson",
  duesPaid: true,
  volunteerHours: 24
}

console.log(member.firstName)
console.log(member.volunteerHours)
console.log(member)
</pre>

An object is written in curly braces. Inside, each value has a name, followed by a colon, and the name-value pairs are separated by commas. Each pair is called a **property**. The name is the property's **key**, and you read a property by writing the object, a dot and the key: `member.firstName`. That's called **dot notation**.

::: {.term}
> **Object** — A collection of named values, written in curly braces: `{ firstName: "Maya", volunteerHours: 24 }`.
:::

::: {.term}
> **Property** — One name-value pair in an object. The name is called the property's *key*. In `{ volunteerHours: 24 }`, the key is `volunteerHours` and the value is 24.
:::

You've been using dot notation all along. `data.length` reads the `length` property of an array. `SpreadsheetApp.getActiveSheet()` reads a property of `SpreadsheetApp` whose value happens to be a function, which is what a method is: a property that holds a function.

Properties can be changed and added:

<pre class="code">
const member = {
  firstName: "Maya",
  volunteerHours: 24
}

// change a property
member.volunteerHours = member.volunteerHours + 2

// add a property that wasn't there
member.role = "Founder"

console.log(member)

// a property that doesn't exist is undefined
console.log(member.phone)
</pre>

Notice that `member` was declared with `const`, and its properties still changed. As with arrays, `const` stops the variable from being given a whole new object, but not the object from changing.

### Bracket notation

There's a second way to read a property: put the key in square brackets, as a string:

<pre class="code">
const member = {
  firstName: "Maya",
  volunteerHours: 24
}

console.log(member["firstName"])

const whichProperty = "volunteerHours"
console.log(member[whichProperty])
</pre>

`member["firstName"]` does the same thing as `member.firstName`. The difference is that the brackets can hold any expression, including a variable. In the last line, `member[whichProperty]` reads whichever property `whichProperty` names, here `volunteerHours`. Dot notation can't do that: `member.whichProperty` would look for a property literally named "whichProperty."

So use dot notation when you know the key as you write the code, and bracket notation when the key is in a variable. You'll need bracket notation later in this lesson.

## Arrays of Objects

Objects become really useful in arrays. An array of objects is a list where each item has named parts, which is exactly what a sheet of records is:

<pre class="code">
const members = [
  { firstName: "Maya", lastName: "Thompson", volunteerHours: 24 },
  { firstName: "Ava", lastName: "Lopez", volunteerHours: 12 },
  { firstName: "Ben", lastName: "Okafor", volunteerHours: 4 }
]

for (let i = 0; i < members.length; i++) {
  const member = members[i]
  console.log(`${member.firstName} ${member.lastName}: ${member.volunteerHours} hours`)
}
</pre>

Compare `member.volunteerHours` with `data[i][4]`. They hold the same thing, but only one of them tells you what it is.

## Turning Rows into Objects

The data in a sheet arrives from `getValues` as an array of arrays. So a common first step in a script is to turn it into an array of objects, and work with names from then on. In the same chat, after telling the assistant you've learned objects:

::: {.ai-conversation prompt="I've now learned objects: curly braces, properties, dot notation and bracket notation, arrays of objects, and Object.keys. My sheet is named Members. Row 1 has headers, and each row after that is one member. Column A is First Name, B is Last Name, C is Email, D is Dues Paid (true or false), and E is Volunteer Hours. Write a function that reads the sheet and returns an array of member objects with the properties firstName, lastName, email, duesPaid and volunteerHours. Then use it to log the members who haven't paid their dues." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="google-forms" transcript="objects/by-name"}
> Great, objects will make this much cleaner! Here's how to do it:
>
> ```javascript
> function getMembers() {
>   // Get the sheet and read all its data
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>   const data = sheet.getDataRange().getValues()
>
>   // Start an empty array to hold the member objects
>   const members = []
>
>   // Loop over rows, skipping the header row
>   for (let i = 1; i < data.length; i++) {
>     // Build one object for this row, using property names instead of column numbers
>     const member = {
>       firstName: data[i][0],
>       lastName: data[i][1],
>       email: data[i][2],
>       duesPaid: data[i][3],
>       volunteerHours: data[i][4]
>     }
>
>     // Add this member to the array
>     members.push(member)
>   }
>
>   return members
> }
>
> function logUnpaidMembers() {
>   // Get the array of member objects
>   const members = getMembers()
>
>   // Loop over the members and log the ones who haven't paid
>   for (let i = 0; i < members.length; i++) {
>     if (members[i].duesPaid === false) {
>       Logger.log(members[i].firstName + " " + members[i].lastName)
>     }
>   }
> }
> ```
>
> A few things to notice:
>
> - `getMembers()` does the work of turning rows into objects, and returns the whole array
> - `logUnpaidMembers()` calls `getMembers()` to get that array, then loops through it
> - Inside the loop, `members[i].duesPaid` reads the `duesPaid` property using dot notation, which is much clearer than `data[i][3]`
> - `members[i].firstName` and `members[i].lastName` read the name properties the same way
>
> Would you like to try modifying `logUnpaidMembers` yourself to also show each unpaid member's volunteer hours?
:::

**Read.**

- **`getMembers`** reads the sheet, then builds one object per row. Inside the loop, `const member = { ... }` is an object written over several lines, with each property's value taken from a column. The column numbers appear exactly once, here, and nowhere else in the script. The function returns the array of objects.
- **`logUnpaidMembers`** calls `getMembers` and loops through what it returns. `members[i].duesPaid` and `members[i].firstName` say what they mean.

This split is worth copying. If the club ever adds a column to the Members sheet, only `getMembers` needs to change. Every function that works with members uses names, not positions.

There's one catch when you run it. Both functions have no parameters, so the editor's menu lists both, and `getMembers` comes first. Running `getMembers` reads the sheet and returns the array, but displays nothing, because returning a value isn't the same as logging it. The function that does the job is `logUnpaidMembers`. Choose it in the menu, then run:

<pre class="spreadsheet">
{"sheetName": "Members", "rows": 16, "columns": 8, "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}], "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
</pre>

<pre class="code">
function getMembers() {
  // Get the sheet and read all its data
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
  const data = sheet.getDataRange().getValues()

  // Start an empty array to hold the member objects
  const members = []

  // Loop over rows, skipping the header row
  for (let i = 1; i < data.length; i++) {
    // Build one object for this row, using property names instead of column numbers
    const member = {
      firstName: data[i][0],
      lastName: data[i][1],
      email: data[i][2],
      duesPaid: data[i][3],
      volunteerHours: data[i][4]
    }

    // Add this member to the array
    members.push(member)
  }

  return members
}

function logUnpaidMembers() {
  // Get the array of member objects
  const members = getMembers()

  // Loop over the members and log the ones who haven't paid
  for (let i = 0; i < members.length; i++) {
    if (members[i].duesPaid === false) {
      Logger.log(members[i].firstName + " " + members[i].lastName)
    }
  }
}
</pre>

## Counting with an Object

In [Google Forms](google-forms){.book-link}, counting every interest took two parallel arrays and a search function, and you had to keep the arrays in step. An object does the same job more simply, because it keeps each name with its count. Continuing the chat:

::: {.ai-conversation prompt="Next, my sign-up form saves responses to a sheet named Form Responses 1. Row 1 has headers, and column F is Interests, which holds all the interests a person checked, separated by a comma and a space. Count how many people chose each interest, using an object whose keys are the interest names. Write the results to a sheet named Interest Counts, with the headers Interest and Count in row 1." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="google-forms" transcript="objects/by-name"}
> Here's how to do it:
>
> ```javascript
> function countInterests() {
>   // Get the sheet and read all its data
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1")
>   const data = sheet.getDataRange().getValues()
>
>   // Start an empty object to hold the counts
>   const counts = {}
>
>   // Loop over rows, skipping the header row
>   for (let i = 1; i < data.length; i++) {
>     // Get the Interests text for this row, column F is index 5
>     const interestsText = data[i][5]
>
>     // Split it into an array of individual interests
>     const interests = interestsText.split(", ")
>
>     // Loop over each interest in this row
>     for (let j = 0; j < interests.length; j++) {
>       const interest = interests[j]
>
>       // If we haven't seen this interest before, start it at 0
>       if (counts[interest] === undefined) {
>         counts[interest] = 0
>       }
>
>       // Add one to this interest's count
>       counts[interest] += 1
>     }
>   }
>
>   return counts
> }
>
> function writeInterestCounts() {
>   // Get the counts object
>   const counts = countInterests()
>
>   // Get the list of interest names from the object's keys
>   const interests = Object.keys(counts)
>
>   // Start the output array with a header row
>   const rows = [["Interest", "Count"]]
>
>   // Build one row per interest
>   for (let i = 0; i < interests.length; i++) {
>     const interest = interests[i]
>     const count = counts[interest]
>     rows.push([interest, count])
>   }
>
>   // Get the destination sheet
>   const outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Interest Counts")
>
>   // Write all the rows at once, starting at row 1, column 1
>   outputSheet.getRange(1, 1, rows.length, 2).setValues(rows)
> }
> ```
>
> A few things worth noticing:
>
> - `counts[interest] === undefined` checks whether this is the first time we've seen that interest, using bracket notation since `interest` is a variable, not a fixed property name
> - The inner `for` loop (using `j`) handles the multiple interests within one row's text, while the outer loop (using `i`) handles each row
> - `Object.keys(counts)` turns the object's property names into an array, so we can loop over them in order
> - `rows` is an array of arrays, just like the ones `getValues()` and `setValues()` use, with the header row built in from the start
>
> Would you like to try adding a check for empty cells, in case someone submitted the form without picking any interests?
:::

**Read.** The heart of it is five lines:

<pre class="code" data-environment="none">
if (counts[interest] === undefined) {
  counts[interest] = 0
}
counts[interest] += 1
</pre>

`counts` starts as an empty object, `{}`. For each interest, bracket notation looks up the property whose key is that interest's name. The first time an interest appears, there's no such property, so it's `undefined`, and the code creates it with the value 0. Then it adds 1. By the end, `counts` looks something like `{ "Nutrition & Wellness": 2, "Native Plant Restoration": 3, ... }`.

Bracket notation is essential here. The key is in a variable, `interest`, and keys like "Nutrition & Wellness" contain spaces and an ampersand, which dot notation couldn't handle anyway.

To write the results, `writeInterestCounts` needs to go through the object's properties. `Object.keys(counts)` gives an array of its keys, which a `for` loop can go through like any array. For each key, `counts[interest]` is its count.

Compare this with the parallel arrays: no search function, no -1, and no way for a name and its count to get out of step. The assistant's closing question is a good one, too. If someone submitted the form without choosing any interests, their cell would be empty, `"".split(", ")` would give `[""]`, and the counts would include an interest with no name. Nobody in the book's data did that, but a real form might get one.

Run it, with `writeInterestCounts` chosen in the menu:

<pre class="spreadsheet">
{"sheetName": "Form Responses 1", "rows": 16, "columns": 8, "data": [{"range": "A1:F13", "values": [["Timestamp", "First Name", "Last Name", "Email", "Phone", "Interests"], ["2027-03-02 09:24", "Isaac", "Cohen", "isaac.cohen@example.com", "555-0119", "Nutrition & Wellness, Native Plant Restoration, Mushroom Cultivation, Medicinal Herbs"], ["2027-03-02 09:34", "Elena", "Rossi", "elena.rossi@example.com", "555-0115", "Sustainable Living, Vertical Gardening, Container Gardening, Garden Photography"], ["2027-03-03 14:39", "Ben", "Okafor", "ben.okafor@example.com", "555-0112", "Community Gardening"], ["2027-03-03 18:29", "Dev", "Patel", "dev.patel@example.com", "555-0114", "Home Food Growing, Organic Gardening, Medicinal Herbs"], ["2027-03-05 15:18", "Keisha", "Brown", "keisha.brown@example.com", "555-0121", "Hydroponics, Canning & Preservation, Therapeutic Horticulture"], ["2027-03-07 09:13", "Hana", "Kim", "hana.kim@example.com", "555-0118", "Nutrition & Wellness, Hydroponics, Microgreens & Sprouts, Pollinator Gardens"], ["2027-03-08 20:32", "Jordan", "Lee", "jordan.lee@example.com", "555-0120", "Heirloom Seeds, Farm-to-Table Cooking, Therapeutic Horticulture"], ["2027-03-09 08:55", "Ava", "Lopez", "ava.lopez@example.com", "555-0111", "Native Plant Restoration"], ["2027-03-09 20:46", "Maya", "Thompson", "maya.thompson@example.com", "555-0110", "Pollinator Gardens, Mushroom Cultivation"], ["2027-03-12 10:19", "Farah", "Haddad", "farah.haddad@example.com", "555-0116", "Teaching Through Gardening, Houseplant Care, Hydroponics, Vertical Gardening"], ["2027-03-12 11:34", "Gabe", "Martinez", "gabe.martinez@example.com", "555-0117", "Vertical Gardening, Native Plant Restoration, Therapeutic Horticulture"], ["2027-03-12 15:19", "Cam", "Nguyen", "cam.nguyen@example.com", "555-0113", "Houseplant Care, Pollinator Gardens"]]}], "formats": [{"range": "A1:F1", "fontWeight": "bold"}, {"range": "A2:A13", "numberFormat": "@"}]}
</pre>

<pre class="spreadsheet">
{"sheetName": "Interest Counts", "rows": 25, "columns": 4, "data": [], "formats": []}
</pre>

<pre class="code">
function countInterests() {
  // Get the sheet and read all its data
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1")
  const data = sheet.getDataRange().getValues()

  // Start an empty object to hold the counts
  const counts = {}

  // Loop over rows, skipping the header row
  for (let i = 1; i < data.length; i++) {
    // Get the Interests text for this row, column F is index 5
    const interestsText = data[i][5]

    // Split it into an array of individual interests
    const interests = interestsText.split(", ")

    // Loop over each interest in this row
    for (let j = 0; j < interests.length; j++) {
      const interest = interests[j]

      // If we haven't seen this interest before, start it at 0
      if (counts[interest] === undefined) {
        counts[interest] = 0
      }

      // Add one to this interest's count
      counts[interest] += 1
    }
  }

  return counts
}

function writeInterestCounts() {
  // Get the counts object
  const counts = countInterests()

  // Get the list of interest names from the object's keys
  const interests = Object.keys(counts)

  // Start the output array with a header row
  const rows = [["Interest", "Count"]]

  // Build one row per interest
  for (let i = 0; i < interests.length; i++) {
    const interest = interests[i]
    const count = counts[interest]
    rows.push([interest, count])
  }

  // Get the destination sheet
  const outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Interest Counts")

  // Write all the rows at once, starting at row 1, column 1
  outputSheet.getRange(1, 1, rows.length, 2).setValues(rows)
}
</pre>

::: {.tip}
> **A pattern worth remembering.** "If the key isn't there yet, start it at 0; then add 1" is how you count anything by name: members per task, harvests per crop, shifts per day. You'll use it again and again.
:::

## JSON

Objects live inside a running program. When the script ends, they're gone. To save an object, or send it to another program, it has to become text. The standard text format for that is **JSON**. Here's how the assistant explained it, in the same chat:

::: {.ai-conversation prompt="I keep hearing about JSON. What is it, and how is it related to objects? Show me how to turn one of my member objects into JSON and back." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="google-forms" transcript="objects/by-name"}
> **JSON** stands for **J**ava**S**cript **O**bject **N**otation. It's a way of writing data as text, using the same curly-brace-and-property style you already know from objects. It's commonly used for saving data to a file, or sending data between a script and a web service.
>
> The key difference is that JSON is always **text** (a string), while an object is a live value you can work with in your code — read properties from, change, loop over, and so on. JSON is what you get when you turn an object into text so it can be stored or sent somewhere, and an object is what you get when you turn that text back into something usable.
>
> To convert between the two, JavaScript gives you two built-in methods:
>
> - `JSON.stringify()` turns an object into a JSON string
> - `JSON.parse()` turns a JSON string back into an object
>
> Here's an example using one of your member objects:
>
> ```javascript
> function tryJSON() {
>   // Make a member object
>   const member = {
>     firstName: "Ava",
>     lastName: "Chen",
>     email: "ava@example.com",
>     duesPaid: true,
>     volunteerHours: 12
>   }
>
>   // Turn the object into a JSON string
>   const jsonText = JSON.stringify(member)
>
>   // Log the JSON string, and check its type
>   Logger.log(jsonText)
>   Logger.log(typeof jsonText)
>
>   // Turn the JSON string back into an object
>   const rebuiltMember = JSON.parse(jsonText)
>
>   // Log a property from the rebuilt object, to prove it worked
>   Logger.log(rebuiltMember.firstName)
>   Logger.log(typeof rebuiltMember)
> }
> ```
>
> If you run this, `jsonText` would look like:
>
> ```
> {"firstName":"Ava","lastName":"Chen","email":"ava@example.com","duesPaid":true,"volunteerHours":12}
> ```
>
> Notice that it looks almost exactly like your object, just with quote marks around the property names too, and it's all one string rather than a live object — that's why `typeof jsonText` reports `"string"`, while `typeof rebuiltMember` reports `"object"`.
>
> A common real-world use for you: if you ever wanted to save a whole array of member objects into a single spreadsheet cell (rather than spreading it across rows and columns), you could `JSON.stringify()` the array to store it as text, and later `JSON.parse()` it back into an array of objects to work with again.
>
> Would you like to try that — storing your `members` array as JSON in one cell, then reading it back?
:::

That's a clear explanation. One small thing: the example member, Ava Chen, isn't in the club. The assistant made up an example rather than using your data, which is fine for showing how something works, but it's a reminder that assistants invent plausible details freely.

::: {.term}
> **JSON** — JavaScript Object Notation: a text format for data that looks like JavaScript objects and arrays. `JSON.stringify` turns a value into JSON text, and `JSON.parse` turns JSON text back into a value.
:::

Try it with a real member, and one extra trick:

<pre class="code">
const member = {
  firstName: "Hana",
  lastName: "Kim",
  duesPaid: true,
  volunteerHours: 18.5
}

const text = JSON.stringify(member)
console.log(text)

// the extra arguments add line breaks and indent by 2 spaces, for reading
console.log(JSON.stringify(member, null, 2))

const copy = JSON.parse(text)
console.log(copy.volunteerHours + 1)
</pre>

JSON looks almost like the objects you write, with a few stricter rules:

- Keys must be in double quotes: `{"firstName": "Hana"}`.
- Strings must use double quotes, not single quotes or backticks.
- Values can be strings, numbers, `true`, `false`, `null`, arrays and objects. Functions and `undefined` can't be stored.
- There's no comma after the last item.

`JSON.parse` stops with an error if the text breaks any of these rules. You'll see JSON constantly from here on. Web services send and receive it, which you'll use in [Talking to Web Services](web-services){.book-link}, and it's how many programs store settings. It also appears in this book's garden data, which is kept as a JSON file.

## Your Learner Profile

::: {.ai-profile lesson="objects"}
Add to "What I know so far":

- objects: properties in curly braces, read and changed with dot notation or bracket notation
- a property that doesn't exist is undefined
- arrays of objects, such as turning the rows of a sheet into member objects
- counting by name with an object, and listing its keys with Object.keys()
- JSON, with JSON.stringify() and JSON.parse()
- naming a fixed value in capitals, such as HOURS_COLUMN
:::

With objects on the list, an assistant can now answer questions like the one that opened this lesson directly. You should see more code that turns rows into objects early and uses property names from then on.

## Summary

An object stores values by name. Each property has a key and a value, read with dot notation (`member.firstName`) or with bracket notation (`member["firstName"]`), which also works when the key is in a variable. Properties can be changed and added, and one that doesn't exist reads as `undefined`. An array of objects is a natural way to hold a sheet's records, so scripts often start by turning rows into objects, keeping the column numbers in one place. An object can also count things by name: start a key at 0 the first time it appears, add 1 each time, and use `Object.keys` to list the keys afterward. JSON is the text form of objects and arrays, used to save data and send it between programs, with `JSON.stringify` and `JSON.parse` to convert. Next, you'll make the club's scripts run by themselves, from a menu, when a form is submitted, or on a schedule.
