---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Fill in a Google Docs template from spreadsheet data, and save the result as a PDF in a Drive folder.
2. Build a new document with headings, paragraphs and a table.
3. Find a Drive file's or folder's ID in its URL, and use constants for settings like IDs.
4. Separate the part of a script that calculates from the part that creates files, so the calculating part can be tested on its own.
:::
:::

## Documents from Data

Two jobs have been on Maya's list since the club started. At the end of the season, members who volunteered at least 10 hours get a certificate. And every week, someone writes up the harvest for the club's newsletter. Both mean copying numbers out of the spreadsheet into a document by hand, which is slow and easy to get wrong.

Apps Script can do both, with two more services: **DriveApp**, for files and folders in Google Drive, and **DocumentApp**, for the contents of Google Docs.

## Certificates from a Template

The easiest way to make many similar documents is to design one by hand as a **template**, with placeholders where the details go, and let a script make a copy for each person and fill in the placeholders. You design the certificate in Google Docs, with fonts, a border and the club's name, and type the placeholders `{{First Name}}`, `{{Last Name}}` and `{{Hours}}` where the details belong. The double curly braces aren't special to Google Docs. They just make the placeholders easy to see, and unlikely to appear anywhere else in the document by accident.

::: {.screenshot-needed file="images/documents-template.png"}
A Google Docs certificate template for the College Community Garden, with the placeholders {{First Name}}, {{Last Name}} and {{Hours}} visible in the text.
:::

Here's the request, in a new chat with your learner profile from [Email, Calendar, and Dates](email-calendar){.book-link} and the garden context:

::: {.ai-conversation prompt="(Paste the garden context first.) I made a Google Docs certificate template containing the placeholders {{First Name}}, {{Last Name}} and {{Hours}}. Write a script that makes a certificate for each member with at least 10 volunteer hours: copy the template, fill in the placeholders, and save the result as a PDF in a Google Drive folder named Certificates." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="email-calendar" transcript="documents/certificates"}
> Good news: this task is doable with what you know (loops, if, functions with parameters, arrays, getValues), but it also needs a few Apps Script tools you haven't learned yet, because they belong to **Google Drive** and **Google Docs**, not the Spreadsheet service. I'll introduce just the ones you need:
>
> - `DriveApp.getFolderById(id)` — gets a Drive folder using its ID
> - `DriveApp.getFileById(id)` — gets a Drive file (like your template doc) using its ID
> - `file.makeCopy(name, folder)` — copies a file, giving it a new name, into a folder
> - `DocumentApp.openById(id)` — opens a Google Doc so you can edit its text
> - `doc.getBody()` — gets the main text area of a document
> - `body.replaceText(searchText, newText)` — finds text and replaces it (this is how we'll fill in `{{First Name}}` etc.)
> - `doc.saveAndClose()` — saves changes to the document
> - `file.getAs("application/pdf")` — converts a file to a PDF "blob" (a file-like object in memory)
> - `folder.createFile(blob)` — saves a blob as a new file in a folder
> - `file.setTrashed(true)` — moves a file to the trash (we'll use this to delete the leftover Google Doc copy after making the PDF)
>
> ### Setup you need to do first
>
> 1. Create a folder in Google Drive named **Certificates**. Open it, and copy its ID from the URL (the long string after `/folders/`).
> 2. Open your certificate template Google Doc. Copy its ID from the URL (the long string after `/d/`).
> 3. Paste both IDs into the constants below.
>
> ### The code
>
> ```javascript
> // Fill these in with your own IDs from Google Drive
> const TEMPLATE_ID = "PUT_YOUR_TEMPLATE_DOC_ID_HERE"
> const CERTIFICATES_FOLDER_ID = "PUT_YOUR_FOLDER_ID_HERE"
> const MIN_HOURS_FOR_CERTIFICATE = 10
>
> // Main function: makes a certificate for every qualifying member
> function createVolunteerCertificates() {
>   // Get the Members sheet and all its data
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Members")
>   const data = sheet.getDataRange().getValues()
>
>   // Loop over the rows, starting at 1 to skip the header row
>   for (let i = 1; i < data.length; i++) {
>     const firstName = data[i][0]
>     const lastName = data[i][1]
>     const hours = data[i][4]
>
>     if (hours >= MIN_HOURS_FOR_CERTIFICATE) {
>       makeCertificate(firstName, lastName, hours)
>     }
>   }
> }
>
> // Makes one certificate PDF for one member
> function makeCertificate(firstName, lastName, hours) {
>   // Get the folder and the template file
>   const folder = DriveApp.getFolderById(CERTIFICATES_FOLDER_ID)
>   const templateFile = DriveApp.getFileById(TEMPLATE_ID)
>
>   // Make a copy of the template, named after the member
>   const copyName = firstName + " " + lastName + " Certificate"
>   const copyFile = templateFile.makeCopy(copyName, folder)
>   const copyId = copyFile.getId()
>
>   // Open the copy and fill in the placeholders
>   const doc = DocumentApp.openById(copyId)
>   const body = doc.getBody()
>   body.replaceText("{{First Name}}", firstName)
>   body.replaceText("{{Last Name}}", lastName)
>   body.replaceText("{{Hours}}", String(hours))
>   doc.saveAndClose()
>
>   // Convert the filled-in doc to a PDF and save it in the folder
>   const pdfBlob = copyFile.getAs("application/pdf")
>   folder.createFile(pdfBlob)
>
>   // Delete the Google Doc copy, keeping only the PDF
>   copyFile.setTrashed(true)
> }
> ```
>
> ### How to test it safely
>
> Instead of running `createVolunteerCertificates` on your whole Members sheet right away, add this test function and run it first:
>
> ```javascript
> // Test function: makes one certificate with made-up data
> function testMakeCertificate() {
>   makeCertificate("Test", "Person", 15)
> }
> ```
>
> Run `testMakeCertificate`, then check your Certificates folder in Drive to see if the PDF looks right before running the real function on all your members.
:::

**Read.** The assistant listed the new methods first, which makes the code easier to follow. Take it in two parts.

`createVolunteerCertificates` is familiar: read the Members sheet, loop over the rows, and call `makeCertificate` for each member with enough hours.

`makeCertificate` does the new work, one step per line:

1. Get the Certificates folder and the template file from Drive, by their IDs.
2. `makeCopy` copies the template into the folder, named after the member, and `getId` gets the copy's ID.
3. `DocumentApp.openById` opens the copy for editing, and `getBody` gets its text.
4. `replaceText` swaps each placeholder for the member's details. `String(hours)` turns the number into text, because `replaceText` works with text.
5. `saveAndClose` saves the changes. This matters: without it, the PDF in the next step could be made from the unchanged copy.
6. `getAs("application/pdf")` makes a PDF version of the copy, and `createFile` saves it in the folder.
7. `setTrashed(true)` moves the Google Docs copy to the trash, so only the PDF is left.

### IDs and settings

The first three lines are new in another way: they're written *outside* any function. A variable declared at the top of the file, outside all functions, can be used by every function in the file. The assistant used this for settings: the template's ID, the folder's ID, and the minimum hours. Written in capitals, as you saw in [Objects and JSON](objects){.book-link}, they tell you these are values to set, not values that change as the script runs. If the club changes the threshold to 12 hours, there's one place to change it.

Every file and folder in Google Drive has an **ID**, a long string of letters and numbers that never changes, even if the file is renamed or moved. You'll find it in the address bar when the file is open: in a document's address, it's the part between `/d/` and the next `/`, and in a folder's address, it's the part after `/folders/`. Scripts use IDs because names aren't unique: you could have three files named "Certificate," but only one with a given ID.

::: {.term}
> **File ID** — The unique identifier Google Drive gives each file and folder, found in its web address. Scripts use it to find exactly one file.
:::

### Before you run it

- **Test with one.** The assistant's `testMakeCertificate` makes a single certificate for a made-up person. Run it, open the PDF, and check it before making all of them. (The profile's dry-run rule mentions only email and calendars, so the assistant didn't write a dry run for this. It offered a one-certificate test instead, which is the right idea.)
- **Read the permission screen.** This script asks for access to your Google Drive and your documents, including permission to delete files, since it trashes the copies. That matches what it does, and it's also a reason to be sure it only trashes what it should: `copyFile`, never `templateFile`.
- **Running it twice makes duplicates.** Each run makes a new PDF for every qualifying member. If you run it again after fixing a typo in the template, delete the first batch.

For the book's members, six people qualify: Maya, Ava, Dev, Farah, Hana and Keisha.

## Building a Document from Scratch

The newsletter doesn't need a template. Its contents change every week, so the script builds the document itself. Continuing the chat:

::: {.ai-conversation prompt="Next, the newsletter. Write a script that creates a new Google Doc named Garden News with a heading, a short paragraph, and a table showing the total kilograms harvested for each crop this season, rounded to one decimal place." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="email-calendar" transcript="documents/certificates"}
> This task needs a few tools from the **Google Docs service**, which is different from the Spreadsheet service you've used so far. Here's what's new:
>
> - `DocumentApp.create(name)` — creates a brand new Google Doc with the given name, and gives you back a Document object
> - `body.appendParagraph(text)` — adds a paragraph of text to the end of the document, and gives you back that paragraph so you can format it
> - `paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING1)` — makes a paragraph look like a heading
> - `body.appendTable(data)` — adds a table built from an array of arrays; each inner array is one row, and each item in it becomes one cell (the items must be strings)
>
> ### The code
>
> ```javascript
> // Main function: builds the whole newsletter doc
> function createNewsletter() {
>   // Get the harvest data from the sheet
>   const harvestSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Harvests")
>   const harvestData = harvestSheet.getDataRange().getValues()
>
>   // Add up kilograms by crop
>   const cropTotals = getCropTotals(harvestData)
>
>   // Create the new Google Doc
>   const doc = DocumentApp.create("Garden News")
>   const body = doc.getBody()
>
>   // Add the pieces of the newsletter
>   addHeading(body)
>   addParagraph(body)
>   addHarvestTable(body, cropTotals)
> }
>
> // Adds up kilograms harvested for each crop, using an object
> function getCropTotals(harvestData) {
>   const totals = {}
>
>   // Loop over the rows, starting at 1 to skip the header row
>   for (let i = 1; i < harvestData.length; i++) {
>     const crop = harvestData[i][2]
>     const kilograms = harvestData[i][3]
>
>     // If we haven't seen this crop yet, start it at 0
>     if (totals[crop] === undefined) {
>       totals[crop] = 0
>     }
>
>     totals[crop] = totals[crop] + kilograms
>   }
>
>   return totals
> }
>
> // Adds the title as a heading
> function addHeading(body) {
>   const heading = body.appendParagraph("Garden News")
>   heading.setHeading(DocumentApp.ParagraphHeading.HEADING1)
> }
>
> // Adds a short intro paragraph
> function addParagraph(body) {
>   const introText = "Here is a summary of this season's harvest. Thank you to everyone who helped grow, tend, and harvest these crops!"
>   body.appendParagraph(introText)
> }
>
> // Builds and adds the table of crop totals
> function addHarvestTable(body, cropTotals) {
>   const cropNames = Object.keys(cropTotals)
>   const tableData = []
>
>   // First row of the table is the header
>   const headerRow = ["Crop", "Total Kilograms"]
>   tableData.push(headerRow)
>
>   // One row per crop
>   for (let i = 0; i < cropNames.length; i++) {
>     const crop = cropNames[i]
>     const total = cropTotals[crop]
>     const roundedTotal = total.toFixed(1)
>     const row = [crop, roundedTotal]
>     tableData.push(row)
>   }
>
>   body.appendTable(tableData)
> }
> ```
>
> ### How to run it
>
> In the Apps Script editor, select `createNewsletter` from the function dropdown and click Run. Since this only creates a new Google Doc (it doesn't send email or touch a calendar), it's safe to run for real — check your Google Drive afterward for a file named "Garden News."
:::

**Read.** `createNewsletter` reads like a table of contents: get the data, total it by crop, create the document, then add a heading, a paragraph and a table. Each step is its own function:

- **`getCropTotals`** is the counting-by-name pattern from [Objects and JSON](objects){.book-link}, adding kilograms instead of 1.
- **`addHeading`** appends a paragraph and makes it a heading. `DocumentApp.ParagraphHeading.HEADING1` is a built-in constant that means "Heading 1," the same style you'd pick from the Docs toolbar.
- **`addHarvestTable`** builds an array of arrays, a header row and then one row per crop, and `appendTable` turns it into a table. The totals go through `toFixed(1)`, which also turns them into strings, as `appendTable` needs.

Two small things to know when you run it. The new document is saved in the top level of your Drive, called My Drive, and each run creates *another* document named Garden News. And a new Google Doc starts with one empty paragraph, so the heading, appended after it, comes out one line down from the top. It's harmless, and your assistant can show you how to remove it.

The assistant decided this was "safe to run for real" because it doesn't send email or touch a calendar. That's the letter of your profile's rule. Creating a document is easy to undo, since you can delete it, so here it's a reasonable call. But the rule should cover files too, and you'll update it at the end of this lesson.

### Testing the part you can test

Documents can't be created on this page, but look at how the newsletter script is organized. `getCropTotals` takes an array of rows and returns an object. It doesn't create anything or talk to Drive, so you can test it here, on the club's Harvests sheet:

```{.spreadsheet}
{"sheetName": "Harvests", "rows": 36, "columns": 8, "data": [{"range": "A1:E33", "values": [["Date", "Bed ID", "Crop", "Kilograms", "Logged By"], ["2027-04-18", "B2", "Radish", 1.2, "elena.rossi@example.com"], ["2027-05-13", "B4", "Spinach", 2.4, "ben.okafor@example.com"], ["2027-05-15", "B2", "Lettuce", 3.9, "hana.kim@example.com"], ["2027-05-21", "B2", "Lettuce", 2.5, "dev.patel@example.com"], ["2027-05-21", "B4", "Spinach", 0.6, "gabe.martinez@example.com"], ["2027-05-28", "B4", "Kale", 2.2, "isaac.cohen@example.com"], ["2027-05-31", "B2", "Lettuce", 2.4, "gabe.martinez@example.com"], ["2027-06-05", "B4", "Kale", 0.6, "keisha.brown@example.com"], ["2027-06-09", "B1", "Basil", 2, "gabe.martinez@example.com"], ["2027-06-11", "B4", "Kale", 1.8, "dev.patel@example.com"], ["2027-06-13", "B3", "Zucchini", 0.5, "elena.rossi@example.com"], ["2027-06-13", "B6", "Carrot", 1.3, "gabe.martinez@example.com"], ["2027-06-18", "B1", "Basil", 1.3, "cam.nguyen@example.com"], ["2027-06-21", "B3", "Zucchini", 3.2, "dev.patel@example.com"], ["2027-06-22", "B3", "Bean", 2.6, "elena.rossi@example.com"], ["2027-06-24", "B5", "Tomato", 3.1, "ben.okafor@example.com"], ["2027-06-29", "B3", "Bean", 3.8, "dev.patel@example.com"], ["2027-06-30", "B3", "Zucchini", 0.6, "maya.thompson@example.com"], ["2027-07-01", "B1", "Tomato", 2.6, "dev.patel@example.com"], ["2027-07-01", "B5", "Tomato", 0.9, "ava.lopez@example.com"], ["2027-07-01", "B8", "Cucumber", 2.6, "isaac.cohen@example.com"], ["2027-07-03", "B5", "Pepper", 2, "elena.rossi@example.com"], ["2027-07-05", "B7", "Mint", 3.6, "farah.haddad@example.com"], ["2027-07-07", "B3", "Bean", 3.7, "hana.kim@example.com"], ["2027-07-08", "B1", "Tomato", 2.2, "elena.rossi@example.com"], ["2027-07-09", "B7", "Mint", 2.4, "keisha.brown@example.com"], ["2027-07-10", "B8", "Cucumber", 2.9, "maya.thompson@example.com"], ["2027-07-13", "B1", "Tomato", 1.4, "gabe.martinez@example.com"], ["2027-07-16", "B8", "Cucumber", 3.9, "farah.haddad@example.com"], ["2027-07-17", "B7", "Mint", 2.5, "ben.okafor@example.com"], ["2027-08-10", "B8", "Squash", 1.9, "gabe.martinez@example.com"], ["2027-08-16", "B8", "Squash", 2.3, "dev.patel@example.com"]]}], "formats": [{"range": "A1:E1", "fontWeight": "bold"}, {"range": "A2:A33", "numberFormat": "@"}]}
```

```{.code}
function testGetCropTotals() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const harvestSheet = spreadsheet.getSheetByName("Harvests")
  const harvestRange = harvestSheet.getDataRange()
  const harvestData = harvestRange.getValues()
  const cropTotals = getCropTotals(harvestData)
  console.log(JSON.stringify(cropTotals, null, 2))
}

// Adds up kilograms harvested for each crop, using an object
function getCropTotals(harvestData) {
  const totals = {}

  // Loop over the rows, starting at 1 to skip the header row
  for (let i = 1; i < harvestData.length; i++) {
    const crop = harvestData[i][2]
    const kilograms = harvestData[i][3]

    // If we haven't seen this crop yet, start it at 0
    if (totals[crop] === undefined) {
      totals[crop] = 0
    }

    totals[crop] = totals[crop] + kilograms
  }

  return totals
}
```

You'll see some totals with a long tail of digits, like the ones in [College Community Garden: Case Setup](case){.book-link}, which is why the newsletter's table rounds them.

This is a design habit worth copying. Keep the calculating separate from the doing. The calculating part is where most bugs are, and it can be tested anywhere, quickly and safely. The part that creates files or sends messages stays small, and you test it once, carefully.

::: {.tip}
> **Other things DocumentApp can do.** Beyond paragraphs and tables, a script can add lists, images, page breaks and links, and change fonts and colors. Ask your assistant for what you need, and check the method names in its reply against the documentation if something doesn't work.
:::

## Your Learner Profile

::: {.ai-profile lesson="documents"}
Add rules:

- Before code sends email, changes a calendar, or creates, changes or deletes files in Google Drive, have it log what it would do (a dry run) or test it on one item, unless I ask for the real thing.

Remove rules:

- Before code sends email or changes a calendar, have it log what it would do (a dry run), unless I ask for the real thing.

Add to "What I know so far":

- DriveApp: getFileById, getFolderById, makeCopy, createFile and setTrashed, and finding a file's ID in its web address
- DocumentApp: create, openById, getBody, replaceText, appendParagraph, setHeading, appendTable and saveAndClose
- saving a document as a PDF with getAs("application/pdf")
- constants declared at the top of the file, outside any function, for settings such as IDs
- keeping calculations in their own functions so they can be tested without creating anything
:::

The dry-run rule is replaced with a broader one that covers files, and allows a one-item test as an alternative, which is often more useful for documents than a log.

## Summary

DriveApp works with files and folders, and DocumentApp with the contents of Google Docs. A template with placeholders like `{{First Name}}` turns into a finished document when a script copies it, fills it in with `replaceText`, saves it with `saveAndClose`, and can save it as a PDF with `getAs`. A new document can also be built from nothing with `appendParagraph`, `setHeading` and `appendTable`. Scripts find files by their IDs, which appear in their web addresses, and settings like IDs are best kept as constants at the top of the file. Keeping the calculating separate from the file-creating lets you test the part most likely to have bugs without creating anything. Next, you'll write your own spreadsheet functions, the kind you type into a cell.
