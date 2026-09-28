---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Write a custom function that can be typed into a cell like a built-in formula.
2. Explain when Google Sheets recalculates a custom function, and pass ranges as arguments so it recalculates when the data changes.
3. Describe what custom functions can't do.
4. Test a custom function from code, and use it to check a sheet's data for consistency.
:::
:::

## Your Own Formulas

Spreadsheet formulas like `=SUM(E2:E13)` are functions: a name, and arguments in parentheses. Google Sheets has hundreds of them, but none that knows about the club. Apps Script lets you add your own. Any function in your project can be typed into a cell as a formula, and whatever it returns appears in the cell. These are called **custom functions**.

::: {.term}
> **Custom function** — A function written in Apps Script that can be used in a cell formula, such as `=HOURSFOR(C2, Shifts!A2:D)`. Its arguments come from the formula, and its return value appears in the cell.
:::

The club's first one: a formula that adds up a member's hours from the Shifts sheet. Here's the request, in a new chat with your learner profile from [Generating Documents](documents){.book-link} and the garden context:

::: {.ai-conversation prompt="(Paste the garden context first.) I want a formula I can type into a cell, like =HOURSFOR(&quot;ava.lopez@example.com&quot;), that adds up that member's hours from the Shifts sheet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="documents" transcript="custom-functions/hoursfor"}
> A function that returns a value can be used as a custom formula in a cell. You just need to write it with a parameter (the email) and a return statement — Google Sheets automatically makes it available as `=HOURSFOR(...)`.
>
> Here's the code:
>
> ```javascript
> function HOURSFOR(email) {
>   // Get the Shifts sheet
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Shifts")
>
>   // Read all the data from that sheet
>   const data = sheet.getDataRange().getValues()
>
>   // Start a running total at 0
>   let totalHours = 0
>
>   // Loop through the rows, starting at 1 to skip the header
>   for (let i = 1; i < data.length; i++) {
>
>     // Get the email in this row
>     const rowEmail = data[i][2]
>
>     // Get the hours in this row
>     const rowHours = data[i][3]
>
>     // If the email matches, add the hours to the total
>     if (rowEmail === email) {
>       totalHours += rowHours
>     }
>   }
>
>   // Send the total back to the cell
>   return totalHours
> }
> ```
>
> **How to use it:**
>
> 1. Open the Apps Script editor attached to your spreadsheet and paste this in.
> 2. Save the project.
> 3. Go back to the spreadsheet and type `=HOURSFOR("ava.lopez@example.com")` into any cell.
>
> **A couple of notes:**
>
> - Since this function has a parameter and a return value, Sheets treats it like a formula function instead of something you'd run from the Apps Script editor's Run menu — no trigger or menu needed.
> - If you want to test it directly in the Apps Script editor instead of in a cell, you could write a small helper function like this:
>
> ```javascript
> function testHoursFor() {
>   const result = HOURSFOR("ava.lopez@example.com")
>   Logger.log(result)
> }
> ```
>
> That lets you check the result in the Execution log before trying it in a cell.
:::

**Read.** It's the running-total pattern you know: read the Shifts sheet, loop over the rows, and add up the hours where the email matches. The function takes the email as a parameter, which comes from the formula, and returns the total, which appears in the cell.

The name is in capitals only because built-in formulas are. Sheets doesn't care about capitals, so `=hoursfor(...)` works too. And one detail in the notes isn't quite right: Sheets doesn't treat functions with parameters differently. *Any* function in your project can be called from a cell. What makes a function useful there is that it returns a value.

The test function the assistant suggested is worth writing. A formula in a cell shows only its result, or an error with little explanation. Calling the function from code shows you everything in the Execution log.

## When the Answer Goes Stale

Now the problem that makes this lesson worth having. Suppose you type `=HOURSFOR("ava.lopez@example.com")` into a cell, and it shows 12. Then someone logs another shift for Ava on the Shifts sheet. The cell still shows 12. Here's what the assistant said:

::: {.ai-conversation prompt="It worked at first. But I added a new shift for Ava on the Shifts sheet, and the cell with =HOURSFOR(&quot;ava.lopez@example.com&quot;) still shows the old total. Why? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="documents" transcript="custom-functions/hoursfor"}
> Good question — this is about how Google Sheets decides when to re-run a custom function like `HOURSFOR`.
>
> Sheets only re-runs a custom function when it thinks the function's **inputs have changed**. The only input in `=HOURSFOR("ava.lopez@example.com")` is the text `"ava.lopez@example.com"` — and that hasn't changed. Sheets has no way of knowing that your function secretly depends on the entire Shifts sheet, since that dependency happens inside the function's code, not in the formula itself.
>
> So when you edit the Shifts sheet, Sheets doesn't see any reason to recalculate that cell, and it just keeps showing the last answer it calculated.
>
> This is different from a normal formula like `=SUM(A1:A10)`, where Sheets can see the range in the formula and knows to recalculate whenever a cell in that range changes.
>
> A few ways this normally gets forced to recalculate (just so you understand the behavior, not fixing it yet):
> - Reopening the spreadsheet
> - Manually editing the formula cell itself (like retyping it)
> - Using a menu option to force recalculation
>
> When you're ready, I can show you a common fix for this — it usually involves passing something that *does* change (like a reference to the Shifts data) into the function, so Sheets knows to watch it.
:::

That's the key to custom functions. Sheets recalculates a formula when its **inputs** change, and it can only see the inputs written in the formula. The function reaches into the Shifts sheet from inside its code, where Sheets can't see it. So as far as Sheets knows, nothing the formula depends on has changed.

A cell showing an out-of-date answer, with no warning at all, is a dangerous kind of bug. A report built from it would look perfectly normal. So ask for the fix:

::: {.ai-conversation prompt="Now fix it." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="documents" transcript="custom-functions/hoursfor"}
> The fix is to pass the Shifts data into the function as a second argument, using a cell range reference like `Shifts!A2:D`. That way, the formula itself mentions the range, so Sheets knows to recalculate whenever anything in it changes.
>
> Here's the updated function:
>
> ```javascript
> function HOURSFOR(email, shiftsData) {
>   // Start a running total at 0
>   let totalHours = 0
>
>   // Loop through the rows of the data that was passed in
>   for (let i = 0; i < shiftsData.length; i++) {
>
>     // Get the email in this row
>     const rowEmail = shiftsData[i][2]
>
>     // Get the hours in this row
>     const rowHours = shiftsData[i][3]
>
>     // If the email matches, add the hours to the total
>     if (rowEmail === email) {
>       totalHours += rowHours
>     }
>   }
>
>   // Send the total back to the cell
>   return totalHours
> }
> ```
>
> **How to use it in a cell:**
>
> ```
> =HOURSFOR("ava.lopez@example.com", Shifts!A2:D)
> ```
>
> **What changed and why:**
>
> - The function no longer reaches out and grabs the Shifts sheet itself with `getSheetByName` and `getDataRange`. Instead, it expects the data to be handed to it as `shiftsData`.
> - In the formula, `Shifts!A2:D` tells Sheets "this formula depends on this range." Now, whenever a cell in that range changes (like adding a new shift), Sheets knows to recalculate the formula.
> - Since the header row is row 1, the range starts at row 2, so you don't need to skip a header row inside the loop anymore — the loop starts at `i = 0`.
>
> **One tradeoff to know about:** if you add a new row *below* the range `Shifts!A2:D` (for example, past row 1000 if that's as far as the range goes), it won't be included unless the range covers it. You may want to make the range generous, like `Shifts!A2:D1000`, to leave room to grow.
:::

**Read.** The function no longer reads the sheet. Instead, the data comes in as a second argument, `shiftsData`. When a formula passes a range like `Shifts!A2:D`, the function receives it as an array of arrays, exactly as if it had called `getValues()` on that range. And because the range is now in the formula, Sheets knows to recalculate whenever any cell in it changes.

Two details:

- **`Shifts!A2:D`** means columns A to D of the Shifts sheet, from row 2 down to the bottom. Starting at row 2 leaves out the header, so the loop starts at 0.
- **The last paragraph gets this backward.** A range like `A2:D`, with no row number at the end, is *open-ended*: it already goes to the bottom of the sheet, and new rows are included automatically. Changing it to `A2:D1000`, as the reply suggests, would add a limit, not remove one. It's a small slip in an otherwise good answer, and a reminder to check each claim against what you know.

This version is also better in another way. It doesn't use `SpreadsheetApp` at all, so it only works with what it's given. That makes it easy to test, and it can't accidentally depend on which sheet happens to be active.

## Checking the Club's Data

Here's a use for `HOURSFOR` beyond looking up one member. The Members sheet has a Volunteer Hours column that someone updates by hand, and the Shifts sheet has every shift. The two should agree. In your spreadsheet, you'd put this formula in F2 of the Members sheet, and fill it down to row 13:

```{.code environment="none"}
=HOURSFOR(C2, Shifts!A2:D)
```

`C2` is the member's email, and filling the formula down changes it to C3, C4 and so on, while `Shifts!A2:D` stays the same. Any row where F doesn't match E is a member whose hours need checking.

The page can't run custom functions in cells, but you can do the same check in code, which is also how you'd test `HOURSFOR`. The test calls it for every member, with the same data the formula would pass, and compares:

```{.spreadsheet}
{"sheetName": "Shifts", "rows": 87, "columns": 5, "data": [{"range": "A1:D84", "values": [["Date", "Task", "Member Email", "Hours"], ["2027-03-20", "composting", "ava.lopez@example.com", 1], ["2027-03-20", "planting", "cam.nguyen@example.com", 1], ["2027-03-20", "watering", "dev.patel@example.com", 1.5], ["2027-03-20", "composting", "isaac.cohen@example.com", 1], ["2027-03-20", "harvesting", "keisha.brown@example.com", 1.5], ["2027-03-20", "watering", "maya.thompson@example.com", 1], ["2027-04-03", "watering", "elena.rossi@example.com", 1], ["2027-04-03", "planting", "maya.thompson@example.com", 1], ["2027-04-10", "planting", "dev.patel@example.com", 1], ["2027-04-10", "watering", "farah.haddad@example.com", 1.5], ["2027-04-10", "watering", "hana.kim@example.com", 1.5], ["2027-04-17", "watering", "maya.thompson@example.com", 2], ["2027-04-24", "planting", "ava.lopez@example.com", 2], ["2027-04-24", "watering", "keisha.brown@example.com", 2], ["2027-05-01", "watering", "farah.haddad@example.com", 1], ["2027-05-01", "harvesting", "hana.kim@example.com", 2], ["2027-05-01", "weeding", "keisha.brown@example.com", 1], ["2027-05-01", "harvesting", "maya.thompson@example.com", 1.5], ["2027-05-01", "composting", "maya.thompson@example.com", 2], ["2027-05-08", "composting", "dev.patel@example.com", 1], ["2027-05-15", "watering", "dev.patel@example.com", 2], ["2027-05-15", "planting", "elena.rossi@example.com", 1], ["2027-05-15", "watering", "isaac.cohen@example.com", 1.5], ["2027-05-15", "weeding", "maya.thompson@example.com", 2], ["2027-05-22", "weeding", "dev.patel@example.com", 1], ["2027-05-22", "composting", "farah.haddad@example.com", 1], ["2027-05-22", "weeding", "farah.haddad@example.com", 1], ["2027-05-22", "weeding", "hana.kim@example.com", 1.5], ["2027-05-22", "watering", "hana.kim@example.com", 2], ["2027-05-22", "weeding", "keisha.brown@example.com", 1], ["2027-05-29", "harvesting", "dev.patel@example.com", 1.5], ["2027-05-29", "planting", "hana.kim@example.com", 1.5], ["2027-05-29", "weeding", "keisha.brown@example.com", 2], ["2027-06-05", "planting", "farah.haddad@example.com", 1], ["2027-06-05", "weeding", "hana.kim@example.com", 1.5], ["2027-06-05", "weeding", "hana.kim@example.com", 2], ["2027-06-12", "planting", "dev.patel@example.com", 1.5], ["2027-06-12", "harvesting", "maya.thompson@example.com", 1.5], ["2027-06-19", "planting", "cam.nguyen@example.com", 1.5], ["2027-06-19", "composting", "cam.nguyen@example.com", 1.5], ["2027-06-19", "watering", "hana.kim@example.com", 1], ["2027-06-19", "weeding", "keisha.brown@example.com", 2], ["2027-06-19", "watering", "maya.thompson@example.com", 1.5], ["2027-07-03", "weeding", "ava.lopez@example.com", 1], ["2027-07-03", "watering", "ava.lopez@example.com", 2], ["2027-07-03", "harvesting", "farah.haddad@example.com", 2], ["2027-07-10", "harvesting", "cam.nguyen@example.com", 1], ["2027-07-10", "weeding", "isaac.cohen@example.com", 1.5], ["2027-07-10", "watering", "maya.thompson@example.com", 2], ["2027-07-17", "harvesting", "farah.haddad@example.com", 1.5], ["2027-07-17", "watering", "hana.kim@example.com", 1.5], ["2027-07-24", "watering", "ava.lopez@example.com", 2], ["2027-07-24", "harvesting", "gabe.martinez@example.com", 2], ["2027-07-24", "weeding", "hana.kim@example.com", 1.5], ["2027-07-24", "composting", "maya.thompson@example.com", 2], ["2027-07-31", "watering", "ben.okafor@example.com", 2], ["2027-07-31", "planting", "cam.nguyen@example.com", 1.5], ["2027-07-31", "watering", "elena.rossi@example.com", 1.5], ["2027-08-07", "weeding", "ava.lopez@example.com", 2], ["2027-08-14", "watering", "ben.okafor@example.com", 2], ["2027-08-14", "planting", "cam.nguyen@example.com", 1.5], ["2027-08-14", "watering", "elena.rossi@example.com", 1.5], ["2027-08-21", "composting", "dev.patel@example.com", 1.5], ["2027-08-21", "composting", "hana.kim@example.com", 1.5], ["2027-08-28", "weeding", "cam.nguyen@example.com", 1.5], ["2027-08-28", "composting", "dev.patel@example.com", 1], ["2027-08-28", "composting", "hana.kim@example.com", 1], ["2027-09-04", "harvesting", "dev.patel@example.com", 1.5], ["2027-09-04", "weeding", "farah.haddad@example.com", 1], ["2027-09-04", "watering", "isaac.cohen@example.com", 1.5], ["2027-09-04", "planting", "keisha.brown@example.com", 1], ["2027-09-04", "planting", "maya.thompson@example.com", 1], ["2027-09-04", "planting", "maya.thompson@example.com", 2], ["2027-09-11", "composting", "isaac.cohen@example.com", 1.5], ["2027-09-11", "planting", "keisha.brown@example.com", 1.5], ["2027-09-18", "planting", "dev.patel@example.com", 1.5], ["2027-09-18", "composting", "farah.haddad@example.com", 1], ["2027-09-18", "planting", "maya.thompson@example.com", 2], ["2027-09-18", "watering", "maya.thompson@example.com", 1], ["2027-09-25", "weeding", "ava.lopez@example.com", 2], ["2027-09-25", "planting", "elena.rossi@example.com", 1.5], ["2027-09-25", "weeding", "keisha.brown@example.com", 1.5], ["2027-09-25", "composting", "maya.thompson@example.com", 1.5]]}], "formats": [{"range": "A1:D1", "fontWeight": "bold"}, {"range": "A2:A84", "numberFormat": "@"}]}
```

```{.spreadsheet}
{"sheetName": "Members", "rows": 16, "columns": 8, "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}], "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
```

```{.code}
function checkHoursAgainstShifts() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const membersSheet = spreadsheet.getSheetByName("Members")
  const membersRange = membersSheet.getDataRange()
  const membersData = membersRange.getValues()
  // the same range the formula passes: row 2 to the bottom, columns A to D
  const shiftsSheet = spreadsheet.getSheetByName("Shifts")
  const shiftsRange = shiftsSheet.getRange("A2:D")
  const shiftsData = shiftsRange.getValues()

  for (let i = 1; i < membersData.length; i++) {
    const email = membersData[i][2]
    const recordedHours = membersData[i][4]
    const shiftHours = HOURSFOR(email, shiftsData)
    if (shiftHours === recordedHours) {
      console.log(`${email}: OK (${recordedHours})`)
    } else {
      console.log(`${email}: sheet says ${recordedHours}, shifts add up to ${shiftHours}`)
    }
  }
}

/**
 * Adds up a member's volunteer hours from the Shifts sheet.
 * @param {string} email The member's email address.
 * @param {Array} shiftsData The Shifts sheet's data, without the header row.
 * @return The total hours.
 * @customfunction
 */
function HOURSFOR(email, shiftsData) {
  let totalHours = 0
  for (let i = 0; i < shiftsData.length; i++) {
    const rowEmail = shiftsData[i][2]
    const rowHours = shiftsData[i][3]
    if (rowEmail === email) {
      totalHours += rowHours
    }
  }
  return totalHours
}
```

Every member should show OK. Now change one of the hours on the Shifts sheet above and run the check again. The mismatch shows up immediately.

The comment above `HOURSFOR` is a special kind, starting with `/**`. Sheets reads it: the description and `@param` lines appear as help when someone starts typing `=HOURSFOR(` in a cell, and `@customfunction` makes the function show up in the list of suggestions. It's optional, but it makes your formula feel like a built-in one to the rest of the club.

::: {.note}
> **Why can the test's floating-point totals match exactly?** Each member's shifts are whole numbers or halves, like 1.5, and halves can be stored exactly in binary. The trouble in [College Community Garden: Case Setup](case){.book-link} came from tenths, like 0.1. If the shifts had tenths, the check would need to round before comparing.
:::

## What Custom Functions Can't Do

A custom function runs every time Sheets recalculates its cell, which could be often, for anyone who opens the spreadsheet. So Google limits what it can do:

- **It can't do anything that needs your permission.** No sending email, creating files or changing calendars. A custom function that calls `MailApp` stops with an error saying it doesn't have permission.
- **It can't change other cells.** It can only return a value to its own cell. (It *can* return an array of arrays, and the values spill into the cells below and to the right, like some built-in formulas do.)
- **It has to be quick.** A custom function that takes longer than 30 seconds is stopped.
- **Errors show as `#ERROR!`.** Hover over the cell to see the message. For anything more, call the function from a test function and read the Execution log.

When you need to change the spreadsheet or reach other services, use a menu item or a trigger, from [Menus and Triggers](triggers){.book-link}, instead.

## Your Learner Profile

::: {.ai-profile lesson="custom-functions"}
Add to "What I know so far":

- custom functions typed into a cell like a formula, which receive a range argument as an array of arrays and return a value to the cell
- that Sheets recalculates a custom function only when its arguments change, so data it uses should be passed in as a range
- what custom functions can't do: anything that needs permission, or changing other cells
- the /** ... */ comment with @param and @customfunction
:::

## Summary

A custom function is an Apps Script function typed into a cell like a formula: its arguments come from the formula, and its return value appears in the cell. A range in the formula arrives as an array of arrays. Sheets recalculates a formula only when the inputs written in it change, so a custom function that reads other data from inside its code shows stale answers without warning. Passing the data in as a range fixes that, and makes the function easier to test. Custom functions can't do anything that needs permission or change other cells, and a comment with `@customfunction` makes them show up as suggestions. Testing a custom function from code, as you did to check the club's hours against its shifts, shows you far more than the cell can. Next, your scripts will talk to services on the internet, starting with the weather.
