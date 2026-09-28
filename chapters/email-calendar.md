---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Send email from Apps Script with `MailApp`, and explain why it's safer than `GmailApp` for sending.
2. Check a script's permissions on the permission screen, even when an assistant describes them.
3. Create and work with dates: build one, read its parts, add days, and format it as text.
4. Write a "dry run" that logs what code would do before it does anything that can't be undone.
5. Create Google Calendar events from a script.
:::
:::

## Sending Email

Until now, your scripts have only changed the club's spreadsheet, and a mistake could be undone with **Edit**, then **Undo**. This lesson's scripts reach outside the spreadsheet: they send email and create calendar events. An email can't be unsent, so the Read step matters more than ever.

The club's first email: a welcome message for each new sign-up. It builds on the form-submit trigger from [Menus and Triggers](triggers){.book-link}. Here's the request, in a new chat with your learner profile from that lesson and the garden context:

::: {.ai-conversation prompt="(Paste the garden context first.) When someone submits the sign-up form, send them a short welcome email from the club that uses their first name and mentions the interests they chose." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="triggers" transcript="email-calendar/welcome-email"}
> Before I write this, there's one new tool you'll need that isn't in your list: **`GmailApp.sendEmail(recipient, subject, body)`**. It's a method (like the ones you already know) that sends an email. You give it three strings — who to send it to, the subject line, and the message body — and Gmail sends the message. I'll use it here since there's no other way to send email.
>
> Here's the code:
>
> ```javascript
> function sendWelcomeEmail(e) {
>   // e is the event object Google Sheets creates when the form is submitted
>   // e.namedValues holds the answers, grouped by the column header they came from
>
>   const namedValues = e.namedValues
>
>   // Each answer is stored as an array with one item, so we use [0] to get it
>   const firstName = namedValues["First Name"][0]
>   const email = namedValues["Email"][0]
>   const interests = namedValues["Interests"][0]
>
>   // Build the subject line and message using template literals
>   const subject = `Welcome to the Club, ${firstName}!`
>   const body = `Hi ${firstName},\n\nThanks for signing up! We're glad you're interested in: ${interests}.\n\nWe'll be in touch soon.\n\n- The Garden Club`
>
>   // Send the email
>   GmailApp.sendEmail(email, subject, body)
> }
> ```
>
> ### How to set up the trigger
> This function needs to run automatically whenever the form is submitted, so it needs an **installable trigger** (not a simple one, since simple triggers can't send email):
>
> 1. In the Apps Script editor, click the clock icon on the left (Triggers).
> 2. Click **Add Trigger**.
> 3. Set:
>    - Function to run: `sendWelcomeEmail`
>    - Event source: **From spreadsheet**
>    - Event type: **On form submit**
> 4. Save.
>
> ### How to test it without submitting the form
> You can call the function yourself with a made-up event object, so you don't have to wait for a real form submission:
>
> ```javascript
> function testSendWelcomeEmail() {
>   // This fake event object copies the shape of a real one
>   const fakeEvent = {
>     namedValues: {
>       "First Name": ["Ava"],
>       "Email": ["your-own-email@example.com"],
>       "Interests": ["watering, composting"]
>     }
>   }
>
>   sendWelcomeEmail(fakeEvent)
> }
> ```
>
> Run `testSendWelcomeEmail` from the Apps Script editor (choose it from the function dropdown, then click Run). Use your own email address in the fake data so you can check that the message arrives and looks right.
>
> Would you like me to also add a check for interests being blank, in case someone submits the form without checking any?
:::

**Read.** The function reads the answers from `e.namedValues`, as in the last lesson, builds a subject and a body with template literals, and sends the message with `GmailApp.sendEmail`, which takes three strings: the address, the subject and the body. In the body, `\n` means a new line, so `\n\n` leaves a blank line between paragraphs.

The new rule in your profile worked. Without being asked, the assistant explained how to set up the trigger and wrote a test function with a made-up event, and it told you to put your own email address in the test, so the only message sent goes to you. That's exactly how to test code that sends email.

::: {.term}
> **\\n** — In a string, a backslash followed by `n` stands for a line break. `"Hi Ava,\n\nThanks"` is two lines with a blank line between them.
:::

### Checking the permissions

Sending email is powerful access to give a script, so it's worth asking about:

::: {.ai-conversation prompt="What permissions will GmailApp ask for when I run this? Is there a way to send email that needs less access to my account?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="triggers" transcript="email-calendar/welcome-email"}
> Good question — this matters for both privacy and trust when you share your script with others.
>
> ### What GmailApp asks for
> Since we're only calling `sendEmail`, Google will ask for permission to **"Send email as you"** — a fairly narrow permission. It does **not** ask for permission to read your inbox, see your contacts, or delete anything.
>
> However, `GmailApp` is a big service that *can* do many other things — read messages, manage labels, search your inbox, etc. Because of that, if your script ever uses any of those other GmailApp features later, Google may expand the permission request to cover full Gmail access.
>
> ### A more limited option: MailApp
> There's a separate, smaller service called **`MailApp`** that can *only* send email — nothing else. It has the exact same method signature:
>
> ```javascript
> MailApp.sendEmail(recipient, subject, body)
> ```
>
> Because `MailApp` can't do anything except send mail, Google will only ever ask for the narrow "send email" permission, no matter what else your script does. This makes it a safer choice when sending email is the only Gmail-related thing your script needs to do.
>
> ### Updated function using MailApp
>
> ```javascript
> function sendWelcomeEmail(e) {
>   const namedValues = e.namedValues
>
>   const firstName = namedValues["First Name"][0]
>   const email = namedValues["Email"][0]
>   const interests = namedValues["Interests"][0]
>
>   const subject = `Welcome to the Club, ${firstName}!`
>   const body = `Hi ${firstName},\n\nThanks for signing up! We're glad you're interested in: ${interests}.\n\nWe'll be in touch soon.\n\n- The Garden Club`
>
>   // MailApp only sends email — it can't read or manage your Gmail account
>   MailApp.sendEmail(email, subject, body)
> }
> ```
>
> Everything else — the trigger setup and the test function — stays exactly the same, since `MailApp.sendEmail` takes the same three arguments as `GmailApp.sendEmail`.
>
> One small trade-off: `MailApp` has a daily sending quota, similar to `GmailApp`, but it doesn't let you do fancier things later (like reading replies or searching your inbox) if your club ever wants that. For a simple welcome email like this, though, `MailApp` is a good, safer fit.
>
> Want me to switch the earlier code over to `MailApp` for good?
:::

The advice to use `MailApp` is good. It can only send email, so it's the right tool when sending is all you need, and its `sendEmail` takes the same arguments.

But the first part of the answer is wrong. At the time of writing, a script that uses `GmailApp` at all asks for permission to "Read, compose, send, and permanently delete all your email from Gmail," not just to send. Apps Script decides what to ask for from which services your code uses, not from which of their methods it calls. `MailApp` asks only to "Send email as you."

You don't have to take the book's word for this either. The permission screen is the final word: run the test function and read what it asks for. That's the habit from [Getting Started with Google Apps Script in Google Sheets](apps-script){.book-link}, and this is a case where it catches an assistant's mistake. If you see a request for full Gmail access for a script that only sends mail, switch to `MailApp`.

Here's the welcome email in the book's style, with `MailApp` and a test function first:

<pre class="code" data-environment="appsscriptsheets">
function testSendWelcomeEmail() {
  // use your own address, so the only email sent goes to you
  const fakeEvent = {
    namedValues: {
      "First Name": ["Test"],
      "Email": ["your.own.address@example.com"],
      "Interests": ["Hydroponics, Pollinator Gardens"]
    }
  }
  sendWelcomeEmail(fakeEvent)
}

function sendWelcomeEmail(e) {
  const answers = e.namedValues
  const firstName = answers["First Name"][0]
  const email = answers["Email"][0]
  const interests = answers["Interests"][0]

  const subject = `Welcome to the College Community Garden, ${firstName}!`
  const body = `Hi ${firstName},\n\nThanks for signing up! We're glad you're interested in ${interests}.\n\nSee you in the garden,\nThe College Community Garden`

  MailApp.sendEmail(email, subject, body)
}
</pre>

Change the address in the test to your own before you run it. Once it arrives and looks right, set up an on-form-submit trigger for `sendWelcomeEmail`. A project can have several form-submit triggers, one for adding the member and one for the welcome email.

::: {.caution}
> **Email can't be unsent.** Test with your own address, send to one person before many, and read every line that decides who receives a message. Google also limits how many emails a script can send each day. For a free Google account, the limit is about 100 recipients a day at the time of writing, which is plenty for a club but easy to hit with a loop that goes wrong.
:::

## Dates in JavaScript

Reminders, calendars and schedules all need dates. JavaScript represents a moment in time with a **Date** object. `new Date()` with nothing in the parentheses creates one for right now:

<pre class="code">
const now = new Date()
console.log(now)
console.log(now.getFullYear())
console.log(now.getMonth())
console.log(now.getDate())
console.log(now.getDay())
</pre>

The methods that read a date's parts have some surprises:

- **`getFullYear()`** gives the four-digit year.
- **`getMonth()`** gives the month, counting from **0**: January is 0 and December is 11. This catches everyone at least once. Add 1 when you display it.
- **`getDate()`** gives the day of the month, from 1 to 31. (Despite the name, it doesn't give the whole date.)
- **`getDay()`** gives the day of the week, from 0 for Sunday to 6 for Saturday.
- **`getHours()`** and **`getMinutes()`** give the time.

`new Date` is written with the word `new`, which creates a new object of a built-in type. You'll see `new` with a few other built-in types later.

::: {.term}
> **Date object** — A value representing one moment in time, created with `new Date()`. Its methods read and change its parts, such as `getFullYear()`, `getMonth()` (counting from 0) and `getDate()`.
:::

To create a particular date, give `new Date` the year, month, day and, optionally, hour and minute. The month counts from 0 here too:

<pre class="code">
// May is month 4, because months count from 0
const workday = new Date(2027, 4, 1, 9, 0)
console.log(workday)
console.log(workday.getDay())
</pre>

`getDay()` gives 6, so May 1, 2027 is a Saturday.

To move a date forward or back, change its day with `setDate`. JavaScript handles the ends of months for you:

<pre class="code">
const day = new Date(2027, 4, 29)
day.setDate(day.getDate() + 7)
console.log(day.getMonth() + 1, day.getDate())
</pre>

May 29 plus 7 days is June 5, and JavaScript rolled over into June by itself.

### Dates as text

The club's spreadsheet stores dates as text, like "2027-04-18", as you saw in [College Community Garden: Case Setup](case){.book-link}. Turning a date into text in that form means building it from its parts, with a leading zero for months and days below 10. Apps Script also has a tool that does it in one step, `Utilities.formatDate`:

<pre class="code" data-environment="appsscriptsheets">
const today = new Date()
const timeZone = Session.getScriptTimeZone()
const dateText = Utilities.formatDate(today, timeZone, "yyyy-MM-dd")
</pre>

The pattern `"yyyy-MM-dd"` means four-digit year, two-digit month, two-digit day. (Capital `MM` is month; lowercase `mm` is minutes.) The time zone matters because "today" depends on where you are: at 11 p.m. in California, it's already tomorrow in London. `Session.getScriptTimeZone()` uses the time zone in your project's settings.

Going the other way, from text to a Date, has a trap:

<pre class="code">
const date = new Date("2027-04-18")
console.log(date.getDate())
</pre>

If you're in the Americas, this probably displays 17, not 18. JavaScript reads a date written this way as midnight in *London* time (UTC, to be exact), and midnight in London is the previous evening in the Americas. Unless you need a Date object, the simplest way to compare text dates is to turn the date you have into the same text form, and compare the strings. That's what the next example does.

## Shift Reminders

Each Friday, the club wants to remind everyone with a shift the next day. Here's the request, with the garden context. It tells the assistant which Date methods you know, and asks for a **dry run**: log each email instead of sending it.

::: {.ai-conversation prompt="(Paste the garden context first.) Every Friday, I want to email each member who has a shift the next day (Saturday), telling them the task and how many hours. I know the Date object: new Date(), getFullYear, getMonth, getDate, getDay, and adding days with setDate. For now, don't send anything: log each email instead, so I can check them first." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="triggers" transcript="email-calendar/shift-reminders"}
> Here's a plan: I'll break this into three functions.
>
> 1. **`getTomorrowDateText()`** — figures out tomorrow's date and turns it into the same text format used in your sheet (`"2027-04-10"`).
> 2. **`findMemberFirstName(email, membersData)`** — looks up a member's first name by their email, so the email can start with "Hi [Name]".
> 3. **`logShiftEmailsForDate(dateText)`** — does the real work: finds every shift on a given date and logs what the email would say.
> 4. **`logSaturdayShiftEmails()`** — the function you'll actually put on a trigger. It just calls `logShiftEmailsForDate` with tomorrow's date.
>
> Splitting it this way means I can test the logic by calling `logShiftEmailsForDate` with a date I type in myself, instead of waiting for tomorrow.
>
> ```javascript
> // Works out tomorrow's date as text like "2027-04-10"
> function getTomorrowDateText() {
>   const today = new Date()
>   const tomorrow = new Date()
>   tomorrow.setDate(today.getDate() + 1)
>
>   const year = tomorrow.getFullYear()
>   const monthNumber = tomorrow.getMonth() + 1  // getMonth counts from 0, so add 1
>   const dayNumber = tomorrow.getDate()
>
>   // Build a two-digit month, adding a leading zero if needed
>   let monthText = String(monthNumber)
>   if (monthNumber < 10) {
>     monthText = `0${monthNumber}`
>   }
>
>   // Build a two-digit day, adding a leading zero if needed
>   let dayText = String(dayNumber)
>   if (dayNumber < 10) {
>     dayText = `0${dayNumber}`
>   }
>
>   const dateText = `${year}-${monthText}-${dayText}`
>   return dateText
> }
>
> // Looks through the Members data for a matching email and returns the first name
> // Returns "" if no match is found
> function findMemberFirstName(email, membersData) {
>   let firstName = ""
>
>   for (let i = 1; i < membersData.length; i++) {
>     const memberEmail = membersData[i][2]  // column C
>
>     if (memberEmail === email) {
>       firstName = membersData[i][0]  // column A
>     }
>   }
>
>   return firstName
> }
>
> // Finds every shift on the given date and logs the email that would be sent
> function logShiftEmailsForDate(dateText) {
>   const shiftsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Shifts")
>   const shiftsData = shiftsSheet.getDataRange().getValues()
>
>   const membersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>   const membersData = membersSheet.getDataRange().getValues()
>
>   for (let i = 1; i < shiftsData.length; i++) {
>     const shiftDate = shiftsData[i][0]
>
>     if (shiftDate === dateText) {
>       const task = shiftsData[i][1]
>       const email = shiftsData[i][2]
>       const hours = shiftsData[i][3]
>
>       const firstName = findMemberFirstName(email, membersData)
>
>       const subject = `Reminder: your shift tomorrow`
>       const body = `Hi ${firstName}, this is a reminder that you have a ${task} shift tomorrow (${dateText}) for ${hours} hours.`
>
>       Logger.log(`To: ${email}`)
>       Logger.log(`Subject: ${subject}`)
>       Logger.log(`Body: ${body}`)
>     }
>   }
> }
>
> // This is the function to put on a weekly Friday trigger
> function logSaturdayShiftEmails() {
>   const tomorrowText = getTomorrowDateText()
>   logShiftEmailsForDate(tomorrowText)
> }
> ```
>
> ### How to test it right now (without waiting for Friday)
>
> Add a temporary test function like this, using a date you know is in your Shifts sheet:
>
> ```javascript
> function testLogShiftEmailsForDate() {
>   logShiftEmailsForDate("2027-04-10")
> }
> ```
>
> Run `testLogShiftEmailsForDate` from the Apps Script editor's function dropdown, then check the Execution log (View > Logs, or the log icon) to see what would have been emailed.
>
> ### Setting up the real trigger
>
> 1. In the Apps Script editor, click the clock icon on the left (Triggers).
> 2. Click **Add Trigger**.
> 3. Set "Choose which function to run" to `logSaturdayShiftEmails`.
> 4. Set "Select event source" to **Time-driven**.
> 5. Set "Select type of time based trigger" to **Week timer**.
> 6. Set the day to **Every Friday** and pick a time range (like 6am–7am).
> 7. Click **Save**.
>
> Once you've checked the logged emails and they look right, let me know and we can change `Logger.log` to `MailApp.sendEmail` to actually send them.
:::

**Read.** Four functions (the reply says three, then lists four):

- **`getTomorrowDateText`** creates tomorrow's date with `setDate`, and builds it as text like "2027-04-10": the year, the month plus 1 (because months count from 0) and the day, each padded with a leading zero when needed.
- **`findMemberFirstName`** looks up a member's first name by email on the Members sheet.
- **`logShiftEmailsForDate(dateText)`** goes through the Shifts sheet, and for each shift whose date text matches, logs the email that would be sent.
- **`logSaturdayShiftEmails`** is the function to put on a Friday trigger. It finds tomorrow's date text and passes it to `logShiftEmailsForDate`.

This design is worth noticing. The function that does the work takes the date as a parameter, rather than working out "tomorrow" itself. That means you can test it with any date, today, without waiting for a Friday. The test function the assistant suggested does exactly that, with a date from the sheet.

The approach to dates is also sound: instead of turning the sheet's text into Date objects, it turns tomorrow's date into text, and compares strings. That avoids the time-zone trap above entirely. (The reply mentions **View**, then **Logs**, once more. The Execution log opens on its own.)

Here's the test on this page, with the Shifts and Members sheets. The test function comes first, so it's the one selected. On April 10, 2027, three members had shifts: Dev, Farah and Hana.

<pre class="spreadsheet">
{"sheetName": "Shifts", "rows": 87, "columns": 5, "data": [{"range": "A1:D84", "values": [["Date", "Task", "Member Email", "Hours"], ["2027-03-20", "composting", "ava.lopez@example.com", 1], ["2027-03-20", "planting", "cam.nguyen@example.com", 1], ["2027-03-20", "watering", "dev.patel@example.com", 1.5], ["2027-03-20", "composting", "isaac.cohen@example.com", 1], ["2027-03-20", "harvesting", "keisha.brown@example.com", 1.5], ["2027-03-20", "watering", "maya.thompson@example.com", 1], ["2027-04-03", "watering", "elena.rossi@example.com", 1], ["2027-04-03", "planting", "maya.thompson@example.com", 1], ["2027-04-10", "planting", "dev.patel@example.com", 1], ["2027-04-10", "watering", "farah.haddad@example.com", 1.5], ["2027-04-10", "watering", "hana.kim@example.com", 1.5], ["2027-04-17", "watering", "maya.thompson@example.com", 2], ["2027-04-24", "planting", "ava.lopez@example.com", 2], ["2027-04-24", "watering", "keisha.brown@example.com", 2], ["2027-05-01", "watering", "farah.haddad@example.com", 1], ["2027-05-01", "harvesting", "hana.kim@example.com", 2], ["2027-05-01", "weeding", "keisha.brown@example.com", 1], ["2027-05-01", "harvesting", "maya.thompson@example.com", 1.5], ["2027-05-01", "composting", "maya.thompson@example.com", 2], ["2027-05-08", "composting", "dev.patel@example.com", 1], ["2027-05-15", "watering", "dev.patel@example.com", 2], ["2027-05-15", "planting", "elena.rossi@example.com", 1], ["2027-05-15", "watering", "isaac.cohen@example.com", 1.5], ["2027-05-15", "weeding", "maya.thompson@example.com", 2], ["2027-05-22", "weeding", "dev.patel@example.com", 1], ["2027-05-22", "composting", "farah.haddad@example.com", 1], ["2027-05-22", "weeding", "farah.haddad@example.com", 1], ["2027-05-22", "weeding", "hana.kim@example.com", 1.5], ["2027-05-22", "watering", "hana.kim@example.com", 2], ["2027-05-22", "weeding", "keisha.brown@example.com", 1], ["2027-05-29", "harvesting", "dev.patel@example.com", 1.5], ["2027-05-29", "planting", "hana.kim@example.com", 1.5], ["2027-05-29", "weeding", "keisha.brown@example.com", 2], ["2027-06-05", "planting", "farah.haddad@example.com", 1], ["2027-06-05", "weeding", "hana.kim@example.com", 1.5], ["2027-06-05", "weeding", "hana.kim@example.com", 2], ["2027-06-12", "planting", "dev.patel@example.com", 1.5], ["2027-06-12", "harvesting", "maya.thompson@example.com", 1.5], ["2027-06-19", "planting", "cam.nguyen@example.com", 1.5], ["2027-06-19", "composting", "cam.nguyen@example.com", 1.5], ["2027-06-19", "watering", "hana.kim@example.com", 1], ["2027-06-19", "weeding", "keisha.brown@example.com", 2], ["2027-06-19", "watering", "maya.thompson@example.com", 1.5], ["2027-07-03", "weeding", "ava.lopez@example.com", 1], ["2027-07-03", "watering", "ava.lopez@example.com", 2], ["2027-07-03", "harvesting", "farah.haddad@example.com", 2], ["2027-07-10", "harvesting", "cam.nguyen@example.com", 1], ["2027-07-10", "weeding", "isaac.cohen@example.com", 1.5], ["2027-07-10", "watering", "maya.thompson@example.com", 2], ["2027-07-17", "harvesting", "farah.haddad@example.com", 1.5], ["2027-07-17", "watering", "hana.kim@example.com", 1.5], ["2027-07-24", "watering", "ava.lopez@example.com", 2], ["2027-07-24", "harvesting", "gabe.martinez@example.com", 2], ["2027-07-24", "weeding", "hana.kim@example.com", 1.5], ["2027-07-24", "composting", "maya.thompson@example.com", 2], ["2027-07-31", "watering", "ben.okafor@example.com", 2], ["2027-07-31", "planting", "cam.nguyen@example.com", 1.5], ["2027-07-31", "watering", "elena.rossi@example.com", 1.5], ["2027-08-07", "weeding", "ava.lopez@example.com", 2], ["2027-08-14", "watering", "ben.okafor@example.com", 2], ["2027-08-14", "planting", "cam.nguyen@example.com", 1.5], ["2027-08-14", "watering", "elena.rossi@example.com", 1.5], ["2027-08-21", "composting", "dev.patel@example.com", 1.5], ["2027-08-21", "composting", "hana.kim@example.com", 1.5], ["2027-08-28", "weeding", "cam.nguyen@example.com", 1.5], ["2027-08-28", "composting", "dev.patel@example.com", 1], ["2027-08-28", "composting", "hana.kim@example.com", 1], ["2027-09-04", "harvesting", "dev.patel@example.com", 1.5], ["2027-09-04", "weeding", "farah.haddad@example.com", 1], ["2027-09-04", "watering", "isaac.cohen@example.com", 1.5], ["2027-09-04", "planting", "keisha.brown@example.com", 1], ["2027-09-04", "planting", "maya.thompson@example.com", 1], ["2027-09-04", "planting", "maya.thompson@example.com", 2], ["2027-09-11", "composting", "isaac.cohen@example.com", 1.5], ["2027-09-11", "planting", "keisha.brown@example.com", 1.5], ["2027-09-18", "planting", "dev.patel@example.com", 1.5], ["2027-09-18", "composting", "farah.haddad@example.com", 1], ["2027-09-18", "planting", "maya.thompson@example.com", 2], ["2027-09-18", "watering", "maya.thompson@example.com", 1], ["2027-09-25", "weeding", "ava.lopez@example.com", 2], ["2027-09-25", "planting", "elena.rossi@example.com", 1.5], ["2027-09-25", "weeding", "keisha.brown@example.com", 1.5], ["2027-09-25", "composting", "maya.thompson@example.com", 1.5]]}], "formats": [{"range": "A1:D1", "fontWeight": "bold"}, {"range": "A2:A84", "numberFormat": "@"}]}
</pre>

<pre class="spreadsheet">
{"sheetName": "Members", "rows": 16, "columns": 8, "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}], "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
</pre>

<pre class="code">
function testLogShiftEmailsForDate() {
  logShiftEmailsForDate("2027-04-10")
}

// Looks through the Members data for a matching email and returns the first name
// Returns "" if no match is found
function findMemberFirstName(email, membersData) {
  let firstName = ""

  for (let i = 1; i < membersData.length; i++) {
    const memberEmail = membersData[i][2]  // column C

    if (memberEmail === email) {
      firstName = membersData[i][0]  // column A
    }
  }

  return firstName
}

// Finds every shift on the given date and logs the email that would be sent
function logShiftEmailsForDate(dateText) {
  const shiftsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Shifts")
  const shiftsData = shiftsSheet.getDataRange().getValues()

  const membersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
  const membersData = membersSheet.getDataRange().getValues()

  for (let i = 1; i < shiftsData.length; i++) {
    const shiftDate = shiftsData[i][0]

    if (shiftDate === dateText) {
      const task = shiftsData[i][1]
      const email = shiftsData[i][2]
      const hours = shiftsData[i][3]

      const firstName = findMemberFirstName(email, membersData)

      const subject = `Reminder: your shift tomorrow`
      const body = `Hi ${firstName}, this is a reminder that you have a ${task} shift tomorrow (${dateText}) for ${hours} hours.`

      Logger.log(`To: ${email}`)
      Logger.log(`Subject: ${subject}`)
      Logger.log(`Body: ${body}`)
    }
  }
}
</pre>

Read the logged emails as if you were the member receiving one. Farah's and Hana's say "for 1.5 hours," which reads fine. Dev's says "for 1 hours." Small details like this are exactly what a dry run is for: you see them before anyone else does. (Fixing it takes one `if`. Try it.)

When the logged emails look right, replace the three `Logger.log` lines with one call to `MailApp.sendEmail(email, subject, body)`, test once with a date and your own address in place of the members', and then set up a weekly time-driven trigger for `logSaturdayShiftEmails` (you might rename it `sendSaturdayShiftReminders` at that point) on Fridays.

::: {.term}
> **Dry run** — Running code that would take an action, such as sending email, so that it only logs what it would do. It lets you check the results before anything happens for real.
:::

## Calendar Events

The club's workdays are Saturday mornings, and members keep asking when the next one is. Putting them on a shared calendar answers that. Here's a request for May's workdays, in a new chat with your learner profile:

::: {.ai-conversation prompt="Add an event to my Google Calendar for every Saturday in May 2027, from 9:00 to 11:00 in the morning, titled Garden Workday." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="triggers" transcript="email-calendar/workdays"}
> This task needs two things that aren't on your list yet, so let me flag them first:
>
> 1. **`CalendarApp`** — a service like `SpreadsheetApp`, but for Google Calendar instead of Sheets.
> 2. **`new Date(year, month, day, hour, minute)`** — a way to build a specific date and time. The tricky part: **months are numbered starting at 0**, so January is `0` and May is `4`.
>
> Since there's no way to create calendar events without these, I'll use them, but keep it as simple as possible and explain each part.
>
> I figured out that in May 2027, the Saturdays fall on the 1st, 8th, 15th, 22nd, and 29th, so I can just list those days instead of calculating them in code.
>
> ```javascript
> function addGardenWorkdays() {
>   // Get your main Google Calendar
>   const calendar = CalendarApp.getDefaultCalendar()
>
>   // The days in May 2027 that are Saturdays
>   const saturdays = [1, 8, 15, 22, 29]
>
>   // Loop through each Saturday
>   for (let i = 0; i < saturdays.length; i++) {
>     // Get the day number for this loop
>     const day = saturdays[i]
>
>     // Build the start time: year 2027, month 4 (May), this day, 9:00
>     const startTime = new Date(2027, 4, day, 9, 0)
>
>     // Build the end time: same day, 11:00
>     const endTime = new Date(2027, 4, day, 11, 0)
>
>     // Create the event on the calendar
>     calendar.createEvent("Garden Workday", startTime, endTime)
>   }
> }
> ```
>
> **How to run it:**
> 1. Paste this into the Apps Script editor.
> 2. In the toolbar, choose `addGardenWorkdays` from the function dropdown.
> 3. Click **Run**.
> 4. The first time, Google will ask you to authorize access to your Calendar — approve it.
> 5. Check your Google Calendar for May 2027 to confirm the five events were added.
>
> No trigger is needed here since you're just running it once to create the events.
:::

**Read.** `CalendarApp.getDefaultCalendar()` gets your main calendar, and `createEvent(title, start, end)` adds an event, with the start and end as Date objects. The assistant flagged the month-counting trap, and the code uses 4 for May.

Look at how it found the Saturdays: it worked them out itself and typed them into an array, `[1, 8, 15, 22, 29]`. That's a fact you should check, because an assistant can get a calendar calculation wrong as easily as a person. You can check it right here:

<pre class="code">
const saturdays = [1, 8, 15, 22, 29]
for (let i = 0; i < saturdays.length; i++) {
  const date = new Date(2027, 4, saturdays[i])
  // getDay() is 6 for Saturday
  console.log(saturdays[i], date.getDay())
}
</pre>

All five give 6, so the list is right. A version that finds the Saturdays itself, by starting at May 1 and adding 7 days until the month changes, would work for any month without anyone doing the calculation. It's a good exercise.

Two more things to check before you run it:

- **It runs once, and running it twice makes duplicates.** The assistant said no trigger is needed, which is right. But if you run it again, you'll get a second set of events. There's no undo for that except deleting the events by hand.
- **It asks for access to your calendars.** Read the permission screen: at the time of writing, it asks to see, edit, share and permanently delete all your calendars. That's broad, which is another reason to read the code first.

For a club, it's better to create a separate calendar for the garden and share it with members than to fill your own. `CalendarApp.getCalendarsByName("Garden Workdays")` finds a calendar by name. Your assistant can show you how to use it.

## Your Learner Profile

::: {.ai-profile lesson="email-calendar"}
Add rules:

- Before code sends email or changes a calendar, have it log what it would do (a dry run), unless I ask for the real thing.

Add to "What I know so far":

- sending email with MailApp.sendEmail(), and that GmailApp asks for full access to Gmail
- \n for a line break in a string
- the Date object: new Date(), new Date(year, month, day, hour, minute) with months counting from 0, getFullYear, getMonth, getDate, getDay, and adding days with setDate
- formatting a date as text with Utilities.formatDate()
- creating events with CalendarApp
- dry runs that log instead of acting
:::

The new rule builds the dry run into every request that sends or schedules something. You'll still decide when to switch to the real thing, and you'll do it after reading the output.

## Summary

`MailApp.sendEmail` sends an email with an address, a subject and a body. Use it rather than `GmailApp` when sending is all you need, because `GmailApp` asks for full access to your Gmail. The permission screen is the final word on what a script can do, even when an assistant describes it confidently. Dates are Date objects: `new Date()` is now, months count from 0, `getDate()` is the day of the month and `getDay()` the day of the week, and `setDate` moves a date forward or back. Comparing dates stored as text is simplest when you turn the date you have into the same text form. Because email and calendar changes can't be undone, check them with a dry run that logs instead of acting, test with your own address, and read the code for anything that would repeat when run twice. Next, the club's scripts will write documents: certificates for volunteers and a weekly newsletter.
