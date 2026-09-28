---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Describe how Airtable organizes data into bases, tables, fields and records, and what a linked record is.
2. Set up a base with linked tables, and choose a good primary field.
3. Read records in Airtable's Scripting extension with `selectRecordsAsync` and `getCellValue`.
4. Ask for input and create records with `input` and `createRecordAsync`.
5. Explain why totals should be keyed by record ID rather than by name.
:::
:::

## When a Spreadsheet Isn't Enough

The club's spreadsheet has done a lot. But you've seen its weak spot: the sheets refer to each other by typing the same value in two places. Shifts refer to members by email, and nothing stops someone from typing an email wrong, or from changing a member's email on one sheet and not the other. Every script that connects two sheets has to match them up itself, as `HOURSFOR` did in [Custom Functions in Sheets](custom-functions){.book-link}.

**Airtable** is a tool that looks like a spreadsheet but works more like a database. Its key feature is the **linked record**: instead of typing a member's email into a shift, you link the shift to the member's record itself. Airtable keeps the link even if the email changes, and from a member's record you can see all their shifts. It has a JavaScript scripting feature built in, and in this part of the book, you'll script it.

::: {.note}
> **Is Airtable free?** Airtable has a free plan, and at the time of writing it has offered students with a school email address a free upgrade for a limited time. Plans and limits change, so check Airtable's current pricing page. Everything in this lesson works on the free plan at the time of writing, except where noted.
:::

### How Airtable organizes data

- A **base** is like a spreadsheet file: one project's data. The club gets one base.
- A **table** is like a sheet: Members, Shifts, Beds.
- A **field** is like a column, but with a fixed **type**: text, number, date, checkbox, single select (a choice from a list), email, and **link to another record**.
- A **record** is like a row: one member, one shift.
- Each table has one **primary field**, its first field, which Airtable uses as the record's name wherever the record appears, including in linked record fields.

::: {.term}
> **Linked record** — A field that points to records in another table, instead of copying a value from them. A shift's Member field links to one record in the Members table.
:::

::: {.term}
> **Primary field** — The first field of an Airtable table, used as each record's name wherever the record is shown or linked.
:::

## Building the Club's Base

Create a free account at **airtable.com**, then create a new base from scratch, named *College Community Garden*.

1. **Members.** Rename the first table *Members*. The easiest way to fill it is to copy the data from the Members sheet in [College Community Garden: Case Setup](case){.book-link} (its copy button can give you the data to paste) and paste it into Airtable's grid; or save it as a CSV file and import it. Make **Email** the first field, the primary field, by dragging its column to the left. Emails are unique, and names aren't.
2. **Shifts.** Add a table named *Shifts* the same way, from the Shifts sheet, with the fields Date, Task, Member Email and Hours.
3. **Link them.** In Shifts, rename *Member Email* to *Member*, then change its field type to **Link to another record**, choosing the Members table. Because the column holds emails, and emails are the Members table's primary field, Airtable matches each shift to the right member automatically.
4. **Field types.** Make Hours a **Number** field (with one decimal place), Date a **Date** field and Task a **Single select**, with the five tasks as its options.

Now open any member's record: it shows their shifts, linked. That's the relationship the spreadsheet could only imitate.

::: {.screenshot-needed file="images/airtable-linked-shifts.png"}
The Airtable Shifts table with the Member field shown as linked record chips containing email addresses, and the field type menu open showing "Link to another record".
:::

## The Scripting Extension

Airtable's **Scripting** extension runs JavaScript on your base. Open it from the base's toolbar: click **Extensions**, then **Add an extension**, and choose **Scripting**. A panel opens with a code editor and a **Run** button, and output appears in the panel.

::: {.screenshot-needed file="images/airtable-scripting.png"}
An Airtable base with the Scripting extension open on the right, showing a short script and its output table below the editor.
:::

Your learner profile needs a new environment line, the first change of this part; the updated profile is at the end of this lesson. Here's the first request, in a new chat with it:

::: {.ai-conversation prompt="My base has a Members table with the fields First Name, Last Name and Email, and a Shifts table with the fields Date, Task, Member (a link to a record in Members) and Hours (a number). Write a script that adds up each member's hours from the Shifts table and shows the totals as a table." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="airtable" transcript="airtable/hours"}
> Here's a script for the Airtable Scripting extension. A couple of things to flag first:
>
> **Airtable Scripting is different from Google Apps Script**, so this uses a few methods you haven't learned yet. I'll explain each one:
> - `base.getTable("name")` — gets a table by name
> - `table.selectRecordsAsync()` — loads a table's records so the script can read them (this is `await`ed, like `fetch`)
> - `record.getCellValue("field name")` — reads one field's value from a record
> - For a linked record field like Member, `getCellValue` returns either `null` (if empty) or an array of objects like `[{id: "...", name: "..."}]`
> - `output.table(arrayOfObjects)` — displays an array of objects as a table in the script's output panel
>
> Also, unlike Apps Script, Airtable Scripting doesn't need you to define a function and select it — the script just runs top to bottom, and you can use `await` directly at the top level.
>
> ```javascript
> // Get the Shifts table
> const shiftsTable = base.getTable("Shifts")
>
> // Load all the records from the Shifts table
> const shiftsQuery = await shiftsTable.selectRecordsAsync()
> const shiftsRecords = shiftsQuery.records
>
> // This object will hold each member's name as a key and their total hours as the value
> const totals = {}
>
> // Loop through every shift record
> for (let i = 0; i < shiftsRecords.length; i++) {
>     const shiftRecord = shiftsRecords[i]
>
>     // Member is a linked record field, so this is null or an array like [{name: "Ava"}]
>     const memberLinks = shiftRecord.getCellValue("Member")
>
>     // Only count this shift if it has a member linked
>     if (memberLinks !== null) {
>         const memberName = memberLinks[0].name
>
>         // Hours might be empty, which reads as null, so treat that as 0
>         let hours = shiftRecord.getCellValue("Hours")
>         if (hours === null) {
>             hours = 0
>         }
>
>         // If we haven't seen this member yet, start their total at 0
>         if (totals[memberName] === undefined) {
>             totals[memberName] = 0
>         }
>
>         // Add this shift's hours to the member's running total
>         totals[memberName] = totals[memberName] + hours
>     }
> }
>
> // Get the list of member names so we can loop through them
> const memberNames = Object.keys(totals)
>
> // Build an array of objects, one per member, for the output table
> const outputRows = []
>
> for (let i = 0; i < memberNames.length; i++) {
>     const name = memberNames[i]
>
>     const row = {
>         "Member": name,
>         "Total Hours": totals[name]
>     }
>
>     outputRows.push(row)
> }
>
> // Show the totals as a table in the script panel
> output.table(outputRows)
> ```
>
> This only reads data — it doesn't change anything in your base, so there's no dry run needed. The output table only appears in the script panel while you're running it, so it's just for you to see.
:::

**Read.** The assistant began by listing the new pieces, and they fit together in a familiar way:

- **`base.getTable("Shifts")`** gets a table, like `getSheetByName`.
- **`await shiftsTable.selectRecordsAsync()`** loads its records. It's asynchronous, like `fetch` in [Asynchronous JavaScript](async){.book-link}, so it's awaited. The result's `records` property is an array of records.
- **`record.getCellValue("Hours")`** reads one field of a record, by the field's name. An empty field gives `null`.
- **A linked record field** gives an array of objects, one for each linked record, each with an `id` and a `name`. A shift links to one member, so the code uses `memberLinks[0]`.
- **`output.table(outputRows)`** shows an array of objects as a table in the panel. There's also `output.text(...)`, for a line of text.

And one thing the assistant pointed out: an Airtable script isn't a function you choose from a menu. It runs from top to bottom, and `await` can be used at the top level, outside any function.

Look at the comment in the loop, though: `memberLinks[0].name` is described as `"Ava"`. That's only true if the Members table's primary field is First Name, which is what the request implied, since it listed First Name first. The `name` of a linked record is always its primary field. So what happens with duplicate names?

::: {.ai-conversation prompt="The first field of my Members table is First Name. What would happen if two members had the same first name?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="airtable" transcript="airtable/hours"}
> Good catch — this would cause a real problem.
>
> The linked record's `name` property shows whatever is in the Members table's **first field**, which is First Name. So if two members are both named "Ava," their linked records would both show up as `"Ava"` in the Shifts table's Member field.
>
> In the script, `memberName` would be `"Ava"` for both of them, so their hours would get added together into a single `"Ava"` entry in `totals`. You'd lose the distinction between the two people entirely, and the totals would be wrong.
>
> **The fix:** instead of using the member's name as the key in `totals`, use the linked record's `id`, which is always unique. Then look up the name only when building the final output.
>
> Here's the changed section:
>
> ```javascript
> // Loop through every shift record
> for (let i = 0; i < shiftsRecords.length; i++) {
>     const shiftRecord = shiftsRecords[i]
>
>     const memberLinks = shiftRecord.getCellValue("Member")
>
>     if (memberLinks !== null) {
>         const memberId = memberLinks[0].id
>         const memberName = memberLinks[0].name
>
>         let hours = shiftRecord.getCellValue("Hours")
>         if (hours === null) {
>             hours = 0
>         }
>
>         // If we haven't seen this member's id yet, start their record
>         if (totals[memberId] === undefined) {
>             totals[memberId] = { name: memberName, hours: 0 }
>         }
>
>         // Add this shift's hours to the member's running total
>         totals[memberId].hours = totals[memberId].hours + hours
>     }
> }
>
> // Get the list of member ids so we can loop through them
> const memberIds = Object.keys(totals)
>
> const outputRows = []
>
> for (let i = 0; i < memberIds.length; i++) {
>     const id = memberIds[i]
>
>     const row = {
>         "Member": totals[id].name,
>         "Total Hours": totals[id].hours
>     }
>
>     outputRows.push(row)
> }
>
> output.table(outputRows)
> ```
>
> Now `totals` is keyed by the unique record `id`, and each entry stores both the display name and the running hours total together. Two members named "Ava" would still show up as two separate rows, correctly, even though their names look the same in the output.
>
> If you wanted to make the output clearer in that situation, you could also pull in Last Name and show something like `"Ava R."` — let me know if you'd like that added.
:::

That's the heart of this lesson. A name is a label; an **ID** identifies. Every Airtable record has an `id`, a unique string like `rec8Hj2...`, that never changes, even if every field in the record does. The fix keys the totals by ID, and keeps the name alongside, as an object, for showing.

The club's base avoids part of the problem by design: its primary field is Email, which is unique. But the lesson applies everywhere. Whenever you total, count or group records, group them by something unique, not by a name. You met the same idea in [College Community Garden: Case Setup](case){.book-link}, where sheets referred to beds by ID and members by email.

Here's the script for the club's base, in the book's style. Because the primary field is Email, the linked record's `name` is an email, so the script reads the Members table too, to show each member's full name:

<pre class="code" data-environment="none">
const membersTable = base.getTable("Members")
const shiftsTable = base.getTable("Shifts")

// load only the fields the script uses, which is faster for big tables
const membersQuery = await membersTable.selectRecordsAsync({ fields: ["First Name", "Last Name"] })
const shiftsQuery = await shiftsTable.selectRecordsAsync({ fields: ["Member", "Hours"] })

// total hours by member record ID, because IDs are unique
const hoursById = {}
for (let i = 0; i < shiftsQuery.records.length; i++) {
  const shift = shiftsQuery.records[i]
  const memberLinks = shift.getCellValue("Member")
  const hours = shift.getCellValue("Hours")
  if (memberLinks !== null && hours !== null) {
    const memberId = memberLinks[0].id
    if (hoursById[memberId] === undefined) {
      hoursById[memberId] = 0
    }
    hoursById[memberId] += hours
  }
}

const rows = []
for (let i = 0; i < membersQuery.records.length; i++) {
  const member = membersQuery.records[i]
  let hours = hoursById[member.id]
  if (hours === undefined) {
    hours = 0
  }
  rows.push({
    "Member": `${member.getCellValue("First Name")} ${member.getCellValue("Last Name")}`,
    "Hours": hours
  })
}
output.table(rows)
</pre>

This version passes `{ fields: [...] }` to `selectRecordsAsync`, so Airtable loads only the fields the script needs. Airtable's documentation recommends it, and on a big table it's much faster, the same idea as loading only `rowCount` in [Building an Application in Excel](excel-app){.book-link}. It also lists every member, including Jordan with 0 hours, because it goes through the Members table rather than only the members who appear in Shifts. The totals should match the Volunteer Hours you've seen all along: Maya 24, Ava 12, and so on.

## Adding Records

Continuing the chat, a script to log a shift:

::: {.ai-conversation prompt="Now a script that asks me for a member's email, a date, a task and a number of hours, then adds a new record to Shifts linked to that member. Tasks are watering, weeding, planting, harvesting or composting." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="airtable" transcript="airtable/hours"}
> Here's a script that collects the details and creates the record. A few new things I'll explain:
>
> - `input.textAsync("label")` — shows a text box in the script panel, waits for you to type something and press Enter, and returns what you typed as a string
> - `input.buttonsAsync("label", arrayOfOptions)` — shows a row of buttons and returns the one you click; good for picking from a fixed list like your five tasks
> - `table.createRecordAsync(fieldsObject)` — creates a new record using an object of field names and values, and returns the new record's id
> - For a linked record field, the value you write is an array like `[{id: "rec123..."}]`
> - Using `return` on its own, outside any function, stops the whole script early — this only works in Airtable's scripting environment, not in a plain web page
>
> This script **creates a real record** each time you run it — there's no "dry run" version of this, since creating the record is the whole point. Just be sure your test entries are ones you're okay having in the table (you can delete them afterward).
>
> ```javascript
> // Get both tables
> const membersTable = base.getTable("Members")
> const shiftsTable = base.getTable("Shifts")
>
> // Ask for the member's email
> const email = await input.textAsync("Enter the member's email")
>
> // Load all Members records so we can search for a match
> const membersQuery = await membersTable.selectRecordsAsync()
> const memberRecords = membersQuery.records
>
> // Search for a record whose Email field matches what was typed
> let memberId = -1
>
> for (let i = 0; i < memberRecords.length; i++) {
>     const currentEmail = memberRecords[i].getCellValue("Email")
>
>     if (currentEmail === email) {
>         memberId = memberRecords[i].id
>     }
> }
>
> // Stop here if no matching member was found
> if (memberId === -1) {
>     output.text(`No member found with email ${email}`)
>     return
> }
>
> // Ask for the date as text in YYYY-MM-DD form
> const dateText = await input.textAsync("Enter the date (YYYY-MM-DD)")
>
> // Split it into year, month and day to check it looks valid
> const dateParts = dateText.split("-")
>
> let dateIsValid = true
>
> if (dateParts.length !== 3) {
>     dateIsValid = false
> } else {
>     const year = Number(dateParts[0])
>     const month = Number(dateParts[1])
>     const day = Number(dateParts[2])
>
>     if (isNaN(year) || isNaN(month) || isNaN(day)) {
>         dateIsValid = false
>     }
>     if (month < 1 || month > 12) {
>         dateIsValid = false
>     }
>     if (day < 1 || day > 31) {
>         dateIsValid = false
>     }
> }
>
> if (dateIsValid === false) {
>     output.text(`"${dateText}" doesn't look like a valid date`)
>     return
> }
>
> // Ask for the task using buttons, since there are only five choices
> const task = await input.buttonsAsync("Choose a task", [
>     "watering",
>     "weeding",
>     "planting",
>     "harvesting",
>     "composting"
> ])
>
> // Ask for the number of hours
> const hoursText = await input.textAsync("Enter the number of hours")
> const hours = Number(hoursText)
>
> if (isNaN(hours) || hours <= 0) {
>     output.text(`"${hoursText}" isn't a valid number of hours`)
>     return
> }
>
> // Build the new record's fields
> const newFields = {
>     "Date": dateText,
>     "Task": task,
>     "Member": [{ id: memberId }],
>     "Hours": hours
> }
>
> // Create the record in Shifts
> await shiftsTable.createRecordAsync(newFields)
>
> output.text("Shift added")
> ```
>
> A couple of things worth checking in your base:
> - This assumes **Task** is set up to accept these five values as text (either a plain text field or a single select field with those exact option names). If it's a single select field with different option names, the record creation will fail.
> - This assumes **Date** is a Date field that accepts an ISO date string like `"2024-05-01"`, which is the standard format Airtable expects.
:::

**Read.**

- **`input.textAsync("...")`** shows a text box in the panel and waits for an answer; **`input.buttonsAsync("...", [...])`** shows a button for each choice. Both are awaited, because the script pauses for you.
- The member is found by looping through the Members records and comparing emails, and the script stops early, with a top-level **`return`**, if there's no match. That's allowed in an Airtable script, which is really the inside of a function Airtable runs for you.
- The date check splits the text on `-` and tests each part. It's careful work, though it would still accept February 31.
- **`createRecordAsync(fields)`** creates the record from an object of field names and values. The linked Member field takes an array of objects with an `id`: `[{ id: memberId }]`.

The notes at the end are the part to check, because one of them is wrong. For a **single select** field, Airtable doesn't accept a plain string like `"watering"`. It expects an object naming the option: `{ name: "watering" }`. So in the club's base, where Task is a single select, `createRecordAsync` would stop with an error saying the Task field can't accept the value. The assistant said it would work "if it's a single select field with those exact option names," which sounds right and isn't.

This is where documentation earns its keep. Airtable's scripting documentation lists, for each field type, the shape of the value `getCellValue` returns and the shape `createRecordAsync` accepts, and they're not always the same: reading a single select gives `{ id, name, color }`, and writing one takes `{ name }`. When a write fails with a message about a field not accepting a value, look up that field type.

The fix is one line:

<pre class="code" data-environment="none">
const newFields = {
  "Date": dateText,
  "Task": { name: task },
  "Member": [{ id: memberId }],
  "Hours": hours
}
</pre>

One more thing to consider: the email comparison is exact, so `Ava.Lopez@example.com` wouldn't match `ava.lopez@example.com`. Emails aren't case-sensitive in practice, so a friendlier script would compare them in lowercase, with `toLowerCase()` on both sides.

::: {.caution}
> **Scripts change your base immediately.** There's no dry run in the Scripting extension unless you write one. Test on a copy of the base (the base's menu has **Duplicate base**), and when a script will create or change many records, have it show what it would do with `output.table` first. Airtable's trash can restore recently deleted records, but changed fields can't be undone the same way.
:::

## Limits to Know

- **Batches of 50.** To create, update or delete many records, use `createRecordsAsync`, `updateRecordsAsync` or `deleteRecordsAsync`, which take up to 50 records at a time. A script that creates 200 records does it in four batches, in a loop.
- **Automations.** Airtable can also run scripts automatically, when a record is created or on a schedule, through **Automations**, with a "Run script" action. At the time of writing, running scripts in automations may require a paid plan; check the current terms. Scripts in automations have no `input` or `output.table`, because nobody is there to see them.
- **The extension panel runs as you.** Anyone who can edit the base can run a script in it, with their own permissions.

## Your Learner Profile

::: {.ai-profile lesson="airtable"}
Environment: I'm writing JavaScript in Airtable's Scripting extension, in my own Airtable base.

Add to "What I know so far":

- Airtable bases, tables, fields, records, linked records and primary fields
- base.getTable(), await table.selectRecordsAsync({ fields: [...] }), and record.getCellValue()
- linked record values: arrays of { id, name }, and writing them as [{ id }]
- output.text(), output.table(), input.textAsync() and input.buttonsAsync()
- await table.createRecordAsync(fields), and that a single select is written as { name: "..." }
- top-level await and return in an Airtable script
- grouping and totaling records by ID, not by name
:::

The environment line changes, and your knowledge of Office.js and JADE comes along, in case you go back to Excel.

## Summary

Airtable organizes data into bases, tables, typed fields and records, and a linked record field points to records in another table instead of copying their values. A table's primary field names its records everywhere they appear, so choosing a unique one, like Email, prevents confusion. In the Scripting extension, a script runs from top to bottom with `await` allowed anywhere: `base.getTable` gets a table, `selectRecordsAsync` loads its records, and `getCellValue` reads a field, with linked records arriving as arrays of `{ id, name }`. `input` asks for answers, `output` shows results, and `createRecordAsync` adds a record, with each field type expecting its own shape of value, such as `{ name }` for a single select. Group and total records by their IDs, which are unique, rather than by names, which aren't. Next, you'll script a very different kind of data: notes.
