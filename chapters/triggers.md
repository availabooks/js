---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Add a custom menu to a spreadsheet with an `onOpen` function.
2. Explain the difference between simple triggers and installable triggers, and set up a trigger that runs when a form is submitted or on a schedule.
3. Read a form submission from the event object, `e`.
4. Test a trigger function by calling it with a made-up event object.
5. Find out why automatic code failed, using the Executions page.
:::
:::

## Code That Runs Without You

Every script so far has run because you chose a function and clicked Run. That's fine for a report you want now, but much of the club's work should happen on its own: a new sign-up should be added to the roster when the form is submitted, and the interest counts should be updated every week, whether or not anyone remembers.

Apps Script can run a function automatically when something happens. The thing that starts it is called a **trigger**. There are two kinds:

- **Simple triggers** are functions with special names that Apps Script runs by itself. `onOpen` runs when someone opens the spreadsheet, and `onEdit` runs when someone changes a cell. You just write the function; there's nothing to set up.
- **Installable triggers** are set up in the Apps Script editor, and connect any function to an event: a form submission, a time schedule, and a few others. They can do more than simple triggers, such as sending email, because you authorize them once and they run with your permissions.

::: {.term}
> **Trigger** — Something that makes Apps Script run a function automatically, such as opening the spreadsheet, submitting a form, or a time of day.
:::

This lesson uses one of each: a menu that appears when the spreadsheet opens, a function that runs when the sign-up form is submitted, and one that runs every week.

## A Menu for the Club

Maya isn't going to open the Apps Script editor to run a report. A custom menu in the spreadsheet itself, next to Help, lets anyone run the club's scripts with a click. Here's the request, in a new chat with your learner profile from [Objects and JSON](objects){.book-link} and the garden context (with a line added for the Form Responses 1 sheet):

::: {.ai-conversation prompt="(Paste the garden context first.) Add a custom menu called Garden Tools to my spreadsheet, with one item that runs my existing function writeInterestCounts." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="objects" transcript="triggers/menu"}
> Here's how to add a custom menu. Google Apps Script uses a special function called `onOpen` that runs automatically whenever the spreadsheet is opened.
>
> ```javascript
> function onOpen() {
>   // get the UI object, which lets us build menus
>   const ui = SpreadsheetApp.getUi()
>
>   // create a menu named "Garden Tools" with one item
>   // the item's label is "Write Interest Counts"
>   // clicking it will run the function writeInterestCounts
>   ui.createMenu("Garden Tools")
>     .addItem("Write Interest Counts", "writeInterestCounts")
>     .addToMenu()
> }
> ```
>
> A few notes on new pieces here:
>
> - `onOpen` is a **special function name** that Apps Script automatically runs when the spreadsheet opens. You don't call it yourself.
> - `SpreadsheetApp.getUi()` gets an object that represents the spreadsheet's interface, so you can add menus to it.
> - `.createMenu("Garden Tools")` starts building a menu with that name.
> - `.addItem("Write Interest Counts", "writeInterestCounts")` adds one item to the menu. The first text is what the user sees. The second text is the *name* of the function to run (as a string, in quotes) when they click it.
> - `.addToMenu()` finishes building the menu and adds it to the spreadsheet.
>
> This is a bit different from your usual style since these methods are chained together with dots on separate lines. That's a common pattern for building menus, since each method returns something to keep building on. I kept it in one statement because splitting it into separate variables would be awkward with this particular method — but let me know if you'd like me to try storing intermediate steps instead.
>
> After you save this, you'll need to **reload the spreadsheet** (close and reopen it, or refresh the browser tab) for the menu to appear.
:::

**Read.** `onOpen` is a simple trigger: because of its name, Apps Script runs it every time the spreadsheet is opened. It gets the spreadsheet's user interface with `SpreadsheetApp.getUi()`, and builds a menu with three chained method calls: create a menu named Garden Tools, add an item, and put the menu on the screen. Notice the second argument to `addItem`: it's the *name* of the function, as a string. The menu stores the name, and when someone clicks the item, Apps Script looks up and runs the function with that name.

The assistant pointed out that it chained the calls against your profile's rule, and explained why. Building a menu this way is common, and the chain is short and clear. That's a reasonable judgment call, and it said so, which is what you want.

Now the problem. After you save this and reload the spreadsheet, no menu appears. There's no error message either. Here's what the assistant said when told:

::: {.ai-conversation prompt="I saved it and reloaded the spreadsheet, but no Garden Tools menu appears, and I don't see any error message. What could be wrong?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="objects" transcript="triggers/menu"}
> Good catch that there's no visible error — that's actually a clue! When `onOpen` runs automatically (like when you open the spreadsheet), Apps Script doesn't always show you error messages right away. You have to check the **Executions** log in the Apps Script editor to see if it failed.
>
> The likely problem is a typo in my code. The method to finish building a menu is `.addToUi()`, not `.addToMenu()`. Here's the fix:
>
> ```javascript
> function onOpen() {
>   // get the UI object, which lets us build menus
>   const ui = SpreadsheetApp.getUi()
>
>   // create a menu named "Garden Tools" with one item
>   // the item's label is "Write Interest Counts"
>   // clicking it will run the function writeInterestCounts
>   ui.createMenu("Garden Tools")
>     .addItem("Write Interest Counts", "writeInterestCounts")
>     .addToUi()
> }
> ```
>
> To check for errors like this yourself next time:
>
> 1. In the Apps Script editor, click **Executions** on the left sidebar.
> 2. Look for the most recent run of `onOpen`.
> 3. If it failed, it'll show a red mark and the error message, such as `addToMenu is not a function`.
>
> Try saving this fix and reloading the spreadsheet again.
:::

This time the assistant found its own mistake and said so: the last method is `addToUi()`, not `addToMenu()`. Compare that with the `getSheetByName` error in [Arrays](arrays){.book-link}, where the assistant fixed its mistake without admitting it. Either way, the lesson is the same: code from an assistant is a draft until it runs.

The more important lesson is about *where the error went*. When you run a function yourself, errors appear in the Execution log below the code. When a trigger runs a function, nobody is watching, so the error doesn't appear on screen. It's recorded on the **Executions** page instead: click **Executions** in the Apps Script editor's left sidebar. Each run is listed with its trigger, its status and, when it failed, the error message. Make checking it a habit whenever automatic code doesn't seem to do anything.

::: {.screenshot-needed file="images/triggers-executions.png"}
The Apps Script Executions page showing a failed onOpen run, with the error "addToMenu is not a function" visible.
:::

Here's the working menu, written one step per line. `createMenu` returns a menu, and you can call `addItem` on it as many times as you like before adding it to the screen:

<pre class="code" data-environment="appsscriptsheets">
function onOpen() {
  const ui = SpreadsheetApp.getUi()
  const menu = ui.createMenu("Garden Tools")
  menu.addItem("Count interests", "writeInterestCounts")
  menu.addItem("Label volunteer hours", "labelAllMembers")
  menu.addToUi()
}
</pre>

Each item's function must exist in the project, so this assumes `writeInterestCounts` from [Objects and JSON](objects){.book-link} and `labelAllMembers` from [Functions](functions){.book-link} are in your Code.gs file. After saving, reload the spreadsheet. The menu appears after a few seconds. The first time you choose an item, Apps Script asks for permission, as it did for your first script.

This code can't run on this page, because the page has no menus. That's true for everything about triggers in this lesson, but you'll see how to test the important parts on the page in a moment.

## When a Form Is Submitted

In [Google Forms](google-forms){.book-link}, sign-ups arrived on the Form Responses 1 sheet. Maya still had to copy each new person onto the Members sheet. That's a job for an installable trigger. Here's the request, in a new chat with the same profile and garden context:

::: {.ai-conversation prompt="(Paste the garden context first.) When someone submits the sign-up form, I want their first name, last name and email added to the Members sheet automatically, with Dues Paid unchecked (false) and 0 volunteer hours. How do I do that?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="objects" transcript="triggers/form-submit"}
> Great question! This introduces one new idea: a **trigger function**. Google Apps Script can run a function automatically when something happens, like a form being submitted. To do that, the function needs to accept one parameter, usually called `e`, which holds information about the event. You haven't learned to use the *contents* of `e` yet, so this code won't need it — but the function still has to list it, or Apps Script won't treat it as a proper trigger function.
>
> Here's the code:
>
> ```javascript
> function addMemberFromFormSubmission(e) {
>   // Get the sheet that stores form responses
>   const formSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1")
>
>   // Find the row number of the most recent response
>   const lastRow = formSheet.getLastRow()
>
>   // Read that row's values into an array of arrays
>   const responseRow = formSheet.getRange(lastRow, 1, 1, 6).getValues()
>
>   // Pull out the first name, last name and email from that row
>   const firstName = responseRow[0][1]
>   const lastName = responseRow[0][2]
>   const email = responseRow[0][3]
>
>   // Get the Members sheet
>   const membersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>
>   // Find the next empty row in Members
>   const newRow = membersSheet.getLastRow() + 1
>
>   // Write the new member's info into that row
>   membersSheet.getRange(newRow, 1, 1, 5).setValues([[firstName, lastName, email, false, 0]])
> }
> ```
>
> **How each part works:**
> - `getSheetByName("Form Responses 1")` gets the sheet with the form's answers.
> - `getLastRow()` tells us which row has the newest response.
> - `getRange(lastRow, 1, 1, 6).getValues()` reads that whole row (columns A through F) as a 2D array, so `responseRow[0]` is the row itself, and `responseRow[0][1]` is column B, and so on.
> - We copy out just the pieces we need: first name, last name, email.
> - Then we find the first empty row in Members using `getLastRow() + 1`.
> - Finally, `setValues([[...]])` writes one new row: first name, last name, email, `false` for Dues Paid, and `0` for Volunteer Hours.
>
> **One more step — setting up the trigger:**
> This function won't run by itself when someone submits the form. You need to connect it:
> 1. In the Apps Script editor, click the clock icon on the left (Triggers).
> 2. Click **Add Trigger**.
> 3. Choose `addMemberFromFormSubmission` as the function to run.
> 4. Set **Event source** to "From spreadsheet" and **Event type** to "On form submit."
> 5. Save it.
>
> After that, every time someone submits the form, this function runs automatically and adds them to Members.
>
> Want me to also show how to store the whole event's info in `e` for a future task, once you learn more about objects passed into functions this way?
:::

**Read.** The function finds the last row of Form Responses 1, which is the newest response, reads its values, and writes a new row to Members after the last one. The steps for setting up the trigger are the important part. Check them against your screen: at the time of writing, **Triggers** is in the left sidebar, with a clock icon, and **Add Trigger** is a button at the bottom of the Triggers page.

::: {.screenshot-needed file="images/triggers-add-form-submit.png"}
The Add Trigger dialog with addMemberFromFormSubmission chosen, event source "From spreadsheet" and event type "On form submit".
:::

Two things in the reply deserve a second look.

First, the assistant says the function "still has to list" the parameter `e`, "or Apps Script won't treat it as a proper trigger function." That isn't true. Apps Script passes information about the event to the function either way, and a function that doesn't list a parameter simply ignores it. It's a confident-sounding rule that's easy to believe, and harmless here, but it's a good example of why you can't take every explanation at face value.

Second, it said you "haven't learned" to use the contents of `e`. But `e` is an object, and you have learned objects. The assistant was being cautious. So say so, and ask about the approach:

::: {.ai-conversation prompt="I do know objects. Rewrite it to get the answers from e instead of reading the last row of the sheet. Is reading the last row risky?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="objects" transcript="triggers/form-submit"}
> Good question. Yes, reading the last row is a bit risky — here's why:
>
> - If two people submit the form at almost the same moment, the two triggers could run close together, and there's a small chance one function reads the wrong row (not necessarily the one that triggered it).
> - If someone else adds a blank row, sorts the sheet, or types something below the data, `getLastRow()` might return the wrong row number.
> - It also does extra work (reading the sheet again) when Apps Script already handed you the data directly through `e`.
>
> Since `e` holds the actual submitted data, it's more reliable and slightly simpler.
>
> Here's the rewrite:
>
> ```javascript
> function addMemberFromFormSubmission(e) {
>   // e.namedValues is an object where each key is a header name
>   // and each value is an array holding the answer (just one item here)
>   const responses = e.namedValues
>
>   // Pull out the pieces we need using the header names as keys
>   const firstName = responses["First Name"][0]
>   const lastName = responses["Last Name"][0]
>   const email = responses["Email"][0]
>
>   // Get the Members sheet
>   const membersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>
>   // Find the next empty row in Members
>   const newRow = membersSheet.getLastRow() + 1
>
>   // Write the new member's info into that row
>   membersSheet.getRange(newRow, 1, 1, 5).setValues([[firstName, lastName, email, false, 0]])
> }
> ```
>
> **What's new here:**
> - `e` is an object Apps Script automatically creates and passes in when the trigger fires.
> - `e.namedValues` is a property on that object — it's itself an object, where each key is a column header from the form ("First Name", "Last Name", "Email", etc.) and each value is an array containing the submitted answer.
> - We use bracket notation, like `responses["First Name"]`, because the header has a space in it, so we can't use dot notation.
> - `[0]` grabs the actual text out of that one-item array.
>
> Note that `getLastRow() + 1` for the *Members* sheet is still needed, since that part isn't affected by the form submission timing risk — you're just finding an empty row to write into, not reading data tied to the event.
:::

**Read.** This version is simpler, and more reliable. When a form is submitted, Apps Script passes the function an **event object** describing the submission. Its `namedValues` property is itself an object: each key is a question's title, and each value is an array holding the answer. So `responses["First Name"][0]` is the first name. The value is an array because a question can have several answers, like the Interests checkboxes. Bracket notation is needed because the keys contain spaces.

::: {.term}
> **Event object** — An object Apps Script passes to a trigger function, usually named `e`, describing what happened. For a form submission, `e.namedValues` holds the answers by question title, and `e.values` holds them as an array, in column order.
:::

The assistant's explanation of the risk is right: if two people submit the form at nearly the same moment, reading "the last row" could pick up the wrong response. But its last paragraph misses that the same risk applies to the Members sheet. If two submissions run at once, both functions could find the same "next empty row," and one new member would overwrite the other. There's a method made for adding a row safely: `appendRow`. It adds a row after the last one in a single step, so two runs can't collide:

<pre class="code" data-environment="appsscriptsheets">
function addMemberFromSignUp(e) {
  // each answer is an array, because a question can have several answers
  const answers = e.namedValues
  const firstName = answers["First Name"][0]
  const lastName = answers["Last Name"][0]
  const email = answers["Email"][0]

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const membersSheet = spreadsheet.getSheetByName("Members")
  // appendRow adds the row after the last one in a single step
  membersSheet.appendRow([firstName, lastName, email, false, 0])
}
</pre>

`appendRow` takes one row as a plain array, not an array of arrays. A new row written this way shows `FALSE` in the Dues Paid column, not a checkbox, unless the column is already formatted with checkboxes. To format it, select column D in the Members sheet, then click **Insert**, then **Checkbox**. Empty cells in the column stay blank until something is written to them.

## Testing a Trigger Function

How do you know `addMemberFromSignUp` works before a real person submits the form? You could submit the form yourself, but that adds a test sign-up to Form Responses 1 every time. There's a better way: call the function yourself, with a made-up event object shaped like the real one.

The code below does exactly that. `testAddMemberFromSignUp` builds an object with a `namedValues` property, just like the one Apps Script would pass, and hands it to `addMemberFromSignUp`. The test function comes first, so it's the one selected in the menu. Run it, and watch the bottom of the Members sheet:

<pre class="spreadsheet">
{"sheetName": "Members", "rows": 16, "columns": 8, "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}], "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
</pre>

<pre class="code">
function testAddMemberFromSignUp() {
  // a made-up event, shaped like the one a real form submission passes in
  const fakeEvent = {
    namedValues: {
      "First Name": ["Test"],
      "Last Name": ["Member"],
      "Email": ["test.member@example.com"]
    }
  }
  addMemberFromSignUp(fakeEvent)
}

function addMemberFromSignUp(e) {
  // each answer is an array, because a question can have several answers
  const answers = e.namedValues
  const firstName = answers["First Name"][0]
  const lastName = answers["Last Name"][0]
  const email = answers["Email"][0]

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const membersSheet = spreadsheet.getSheetByName("Members")
  // appendRow adds the row after the last one in a single step
  membersSheet.appendRow([firstName, lastName, email, false, 0])
}
</pre>

A new row appears after Keisha Brown. Run it again and you get a second one, which is exactly what would happen if the same person submitted the form twice. (Handling duplicates is a good follow-up question for your assistant.)

This is how professionals test code that normally runs in response to something outside their control: they simulate the input. It works in Apps Script, too. Paste both functions into your project, run `testAddMemberFromSignUp`, then delete the test row from Members.

Now choose `addMemberFromSignUp` in the menu and run it directly. It stops with an error about reading `namedValues` of `undefined`. When you run a trigger function yourself, there's no event, so `e` is `undefined`. That's the error you'll see in the Execution log if you click Run on a trigger function in the Apps Script editor. It isn't a bug in the function; it's a sign to test it with a fake event instead.

## On a Schedule

The last piece is a weekly update. Continuing the same chat:

::: {.ai-conversation prompt="How do I make writeInterestCounts run by itself every Monday morning?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="objects" transcript="triggers/form-submit"}
> You don't need any new code concepts for this — you just need to set up a **time-driven trigger** in the Apps Script editor, similar to how we set up the form trigger earlier, but choosing a schedule instead of "on form submit."
>
> Here's how:
>
> 1. In the Apps Script editor, click the clock icon on the left (**Triggers**).
> 2. Click **Add Trigger**.
> 3. Under **Choose which function to run**, select `writeInterestCounts`.
> 4. Under **Select event source**, choose **Time-driven**.
> 5. Under **Select type of time based trigger**, choose **Week timer**.
> 6. Choose **Every Monday**.
> 7. Choose a time range, like 5am to 6am (Apps Script runs it sometime in that hour, not at an exact minute).
> 8. Click **Save**.
>
> That's it — Apps Script will now run `writeInterestCounts` automatically every Monday morning, without you needing to open the sheet or run it yourself.
>
> One thing to note: since this function runs automatically, it shouldn't have a parameter like `e` — that's only for triggers tied to an event like a form submission. Since `writeInterestCounts` takes no parameters, it works perfectly as-is for a time-driven trigger.
:::

**Read.** The steps are the same as for the form trigger, with a different event source. Note the detail that a time-driven trigger runs at some point *within* the hour you choose, not at an exact minute.

The last paragraph is worth comparing with what the assistant said earlier. First, a trigger function "has to list" `e`. Now, a time-driven function "shouldn't have" a parameter like `e`. Both statements are wrong in the same way. Every trigger passes an event object, including time-driven ones, and a function can list the parameter or not, as it likes. The practical advice, that `writeInterestCounts` works as it is, happens to be right. When an assistant's explanations contradict each other, that's a signal to check the documentation, which for Apps Script is at **developers.google.com/apps-script**.

::: {.screenshot-needed file="images/triggers-weekly.png"}
The Add Trigger dialog with writeInterestCounts chosen, event source "Time-driven", type "Week timer", "Every Monday" and "5am to 6am".
:::

## Triggers and Responsibility

Automatic code deserves more care than code you run yourself, because nobody is watching when it runs:

- **Triggers run as you.** An installable trigger uses the permissions you gave it, even when you're asleep. If the code sends email or deletes rows, it does so in your name.
- **Failures are quiet.** Check the Executions page after setting up a trigger. Apps Script can also email you a summary of failures; you choose how often when you create the trigger.
- **Triggers pile up.** Each time you click Save in the Add Trigger dialog, you create another trigger. Two identical form-submit triggers mean every sign-up is added twice. The Triggers page lists them all, and you can delete extras there.
- **There are limits.** Google limits how long a script can run (six minutes) and how many triggers a project can have. A club's scripts won't come close, but if a trigger stops working, a limit is one thing to check.

## Your Learner Profile

::: {.ai-profile lesson="triggers"}
Add rules:

- When code needs a trigger, tell me how to set it up in the Apps Script editor, and how to test it without waiting for the event.

Add to "What I know so far":

- simple triggers (onOpen, onEdit) and installable triggers (on form submit, time-driven)
- custom menus with SpreadsheetApp.getUi(), createMenu(), addItem() and addToUi()
- the event object e, including e.namedValues for a form submission
- testing a trigger function by calling it with a made-up event object
- checking the Executions page when automatic code fails
- adding a row with appendRow()
:::

The new rule asks for two things assistants often leave out: how to connect the function to its trigger, and how to test it. You've seen that the first is essential, since the function does nothing without the trigger, and the second saves you from testing with real sign-ups.

## Summary

Triggers run functions automatically. Simple triggers, such as `onOpen`, run because of their names, while installable triggers are set up in the editor and can respond to form submissions or run on a schedule. A custom menu, built in `onOpen`, lets anyone run the club's scripts from the spreadsheet. A form-submit trigger receives an event object, and `e.namedValues` holds the answers by question title, as arrays. To test a trigger function, call it from another function with a made-up event object shaped like the real one. Because nobody watches automatic code run, its errors appear only on the Executions page, so check there when something silently doesn't happen. Assistants explain triggers confidently, and sometimes inconsistently, so test what they tell you. Next, the club's scripts start reaching beyond the spreadsheet, with email and calendars.
