---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Create a Google Form that saves its responses to a spreadsheet.
2. Describe a form's response sheet so an assistant can write code for it.
3. Break text into an array with `split`.
4. Count values using two arrays that work together, and a helper function that searches an array.
5. Check an assistant's setup instructions against your screen, and read its warnings about your data.
:::
:::

## The Spring Kickoff

As spring break approached, the club planned its first official meeting, the Spring (Ground) Break Kickoff, where students and community members could tour the garden site, meet one another, and choose the roles they were most excited about. To keep things organized, you and Maya decided to collect sign-ups ahead of time with an online form, shared on flyers around campus with a QR code that links to it. People could still sign up in person at the event, but most would register beforehand, which would help the club estimate attendance, prepare materials, and group people by interest.

That's a job for **Google Forms**. A form collects answers in a consistent shape, and it can save every response straight into a spreadsheet, where your code can work with it. No more retyping names and email addresses from paper sign-up sheets.

Besides contact information, the club wants to know what each person would like to learn, so the form needs a list of interests to choose from. Maya's list:

- **Home Food Growing:** turning patios, balconies and backyards into productive mini-gardens.
- **Community Gardening:** collaborative growing techniques and shared harvests.
- **Sustainable Living:** everyday practices that reduce waste and conserve resources.
- **Teaching Through Gardening:** skills you can pass on to friends, family and students.
- **Nutrition & Wellness:** how fresh produce supports a healthy lifestyle.
- **Houseplant Care:** keeping indoor plants thriving with the right light, soil and water.
- **Organic Gardening:** growing without synthetic chemicals, using compost and mulch.
- **Hydroponics:** growing herbs and greens in water instead of soil.
- **Pest Management:** safe, targeted ways to protect plants, such as companion planting.
- **Microgreens & Sprouts:** nutrient-dense greens on a windowsill.
- **Vertical Gardening:** growing up trellises and pallets when space is short.
- **Container Gardening:** the best vegetables for pots and buckets.
- **Composting & Vermiculture:** turning kitchen scraps into compost with the help of worms.
- **Rainwater Harvesting:** collecting rain in barrels to water the garden.
- **Native Plant Restoration:** attracting local birds and butterflies.
- **Heirloom Seeds:** the history and art of saving seeds for next year.
- **Pollinator Gardens:** plots designed for bees and butterflies.
- **Mushroom Cultivation:** growing oyster or shiitake mushrooms in shady spots.
- **Medicinal Herbs:** a "healing garden" of lavender, echinacea and mint.
- **Farm-to-Table Cooking:** what to do with a huge harvest of zucchini.
- **Canning & Preservation:** pickling, drying and fermenting the harvest.
- **Garden Photography:** capturing the garden through the seasons.
- **Therapeutic Horticulture:** gardening for mental health and stress relief.

## Building the Sign-Up Form

You can create a form on its own at **forms.google.com** and connect it to a spreadsheet afterward. It's simpler to create it from the spreadsheet, because then the connection is made for you.

Before you start, it's worth asking your assistant how, both to see what it says and to practice checking it. Here's the question, in a new chat with your learner profile from [College Community Garden: Case Setup](case){.book-link}:

::: {.ai-conversation prompt="How do I create a Google Form that saves its responses to my existing Google Sheet?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="case" transcript="google-forms/create-form"}
> This is more of a Google Sheets/Forms setup question than a coding one, so here's how to do it through the interface (no script needed):
>
> **Option 1: Create the Form from inside the Sheet**
> 1. Open your Google Sheet
> 2. Click **Insert** in the menu bar
> 3. Click **Form**
> 4. Google creates a new Form and automatically links it to your Sheet — a new tab (like "Form Responses 1") will appear in your Sheet
> 5. Edit the Form's questions in the Form editor that opens
>
> **Option 2: Link an existing Form to your Sheet**
> 1. Open your existing Google Form
> 2. Click the **Responses** tab at the top
> 3. Click the green Sheets icon (or the three-dot menu → **Select response destination**)
> 4. Choose **Select existing spreadsheet**
> 5. Pick your Sheet from the list
>
> Either way, every time someone submits the Form, a new row gets added automatically to that responses tab in your Sheet — no script required.
>
> ---
>
> If you want, once you have real form response data in your Sheet, that's a great time to write an Apps Script function using what you've learned — for example, one that reads all the rows with `getValues()` and loops through them with a `for` loop to calculate a total or check for specific answers. Want to try that once your Form is set up?
:::

The assistant was right that this needs no code, and the overall idea is right: create the form from the sheet, or link an existing form to it, and responses arrive in a new tab. But check each step against your screen. Google moves these menus from time to time. At the time of writing, Google Sheets doesn't have a Form item in its **Insert** menu; creating a form from a spreadsheet is under **Tools**, then **Create a new form**. And in Google Forms, the Responses tab has a button labeled **Link to Sheets**. Your screen may differ again by the time you read this. As in [Getting Started with Google Apps Script in Google Sheets](apps-script){.book-link}, when an assistant's directions don't match what you see, trust your screen, and tell the assistant what you actually see.

Here are the steps, starting from the club's spreadsheet (or any spreadsheet you want to practice in):

1. In Google Sheets, click **Tools**, then **Create a new form**. A new form opens in another tab, already linked to the spreadsheet, and a new sheet named **Form Responses 1** appears in the spreadsheet.
2. Give the form a title, such as *Spring (Ground) Break Kickoff Sign-Up*, and a short description.
3. Add a question for **First Name**, and set its type to **Short answer**. Turn on **Required**.
4. Add **Last Name**, **Email** and **Phone** the same way, each as a short answer. Make the first three required. Phone can be optional.
5. Add a question titled **Interests**, and set its type to **Checkboxes**. Add each interest from the list above as an option. Checkboxes let people choose as many as they like.
6. Click **Preview** (the eye icon) to see the form as others will, and try submitting a response. Then look at the Form Responses 1 sheet: your response is there.

::: {.screenshot-needed file="images/forms-create-from-sheet.png"}
The Google Sheets Tools menu open, with "Create a new form" highlighted.
:::

::: {.screenshot-needed file="images/forms-interests-question.png"}
The Google Forms editor showing the Interests question as Checkboxes, with the first several interests listed as options.
:::

To share the form, click **Send** in the form editor. You can copy a link, and Google can shorten it for you. Many free tools turn a link into a QR code for a flyer.

::: {.caution}
> **A form collects personal information.** Names, email addresses and phone numbers are personal data, and people are trusting the club with them. Only ask for what the club needs, share the response sheet only with people who need it, and don't paste real responses into an AI assistant. The examples in this lesson use the book's made-up members.
:::

## Where Responses Go

Every submission becomes a new row on the Form Responses 1 sheet. Google adds a **Timestamp** column first, recording when the form was submitted, followed by one column per question, in the order the questions appear on the form.

Here are the sign-ups from before the kickoff, one from each of the club's first twelve members:

```{.spreadsheet}
{"sheetName": "Form Responses 1", "rows": 16, "columns": 8, "data": [{"range": "A1:F13", "values": [["Timestamp", "First Name", "Last Name", "Email", "Phone", "Interests"], ["2027-03-02 09:24", "Isaac", "Cohen", "isaac.cohen@example.com", "555-0119", "Nutrition & Wellness, Native Plant Restoration, Mushroom Cultivation, Medicinal Herbs"], ["2027-03-02 09:34", "Elena", "Rossi", "elena.rossi@example.com", "555-0115", "Sustainable Living, Vertical Gardening, Container Gardening, Garden Photography"], ["2027-03-03 14:39", "Ben", "Okafor", "ben.okafor@example.com", "555-0112", "Community Gardening"], ["2027-03-03 18:29", "Dev", "Patel", "dev.patel@example.com", "555-0114", "Home Food Growing, Organic Gardening, Medicinal Herbs"], ["2027-03-05 15:18", "Keisha", "Brown", "keisha.brown@example.com", "555-0121", "Hydroponics, Canning & Preservation, Therapeutic Horticulture"], ["2027-03-07 09:13", "Hana", "Kim", "hana.kim@example.com", "555-0118", "Nutrition & Wellness, Hydroponics, Microgreens & Sprouts, Pollinator Gardens"], ["2027-03-08 20:32", "Jordan", "Lee", "jordan.lee@example.com", "555-0120", "Heirloom Seeds, Farm-to-Table Cooking, Therapeutic Horticulture"], ["2027-03-09 08:55", "Ava", "Lopez", "ava.lopez@example.com", "555-0111", "Native Plant Restoration"], ["2027-03-09 20:46", "Maya", "Thompson", "maya.thompson@example.com", "555-0110", "Pollinator Gardens, Mushroom Cultivation"], ["2027-03-12 10:19", "Farah", "Haddad", "farah.haddad@example.com", "555-0116", "Teaching Through Gardening, Houseplant Care, Hydroponics, Vertical Gardening"], ["2027-03-12 11:34", "Gabe", "Martinez", "gabe.martinez@example.com", "555-0117", "Vertical Gardening, Native Plant Restoration, Therapeutic Horticulture"], ["2027-03-12 15:19", "Cam", "Nguyen", "cam.nguyen@example.com", "555-0113", "Houseplant Care, Pollinator Gardens"]]}], "formats": [{"range": "A1:F1", "fontWeight": "bold"}, {"range": "A2:A13", "numberFormat": "@"}]}
```

Look at the Interests column. A checkbox question can have several answers, but they all go into one cell, separated by a comma and a space: *Hydroponics, Pollinator Gardens*. That's convenient to read, and it's something code has to deal with.

::: {.note}
> **Timestamps in real response sheets.** In a real response sheet, the Timestamp column holds actual dates, and `getValue` gives your code a Date object for them. On this page, the timestamps are text, like the other dates in the club's spreadsheet, for the reason explained in [College Community Garden: Case Setup](case){.book-link}. The code in this lesson doesn't use the Timestamp column, so it works the same either way.
:::

## Counting One Interest

Maya wants to know how many people are interested in hydroponics, to decide whether to run a workshop. The response sheet is new, so describe it, including the detail about the Interests cell. Here's the request, in a new chat with your learner profile:

::: {.ai-conversation prompt="My form saves its responses to a sheet named Form Responses 1. Row 1 has headers, and each row after that is one sign-up. Column A is Timestamp, B is First Name, C is Last Name, D is Email, E is Phone, and F is Interests. The Interests question uses checkboxes, so column F holds all the interests a person checked in one cell, separated by a comma and a space, such as &quot;Hydroponics, Pollinator Gardens&quot;. Write a script that counts how many people chose Hydroponics." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="case" transcript="google-forms/count-interests"}
> Before I write this, I need to flag one new concept: to check whether "Hydroponics" is one of the interests in a cell like `"Hydroponics, Pollinator Gardens"`, I need the **`split()`** method. It breaks a string into an array of pieces, using whatever text you give it as the divider. For example:
>
> ```javascript
> const text = "Hydroponics, Pollinator Gardens"
> const parts = text.split(", ")
> // parts is now ["Hydroponics", "Pollinator Gardens"]
> ```
>
> This lets me check each interest separately with `===`, instead of guessing whether "Hydroponics" appears somewhere inside a longer string.
>
> Here's the script:
>
> ```javascript
> function countHydroponicsSignUps() {
>   // Get the sheet by its name
>   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1")
>
>   // Read all the data, including the header row, as an array of arrays
>   const data = sheet.getDataRange().getValues()
>
>   // This will keep track of how many people chose Hydroponics
>   let count = 0
>
>   // Start at row 1 to skip the header row
>   for (let i = 1; i < data.length; i++) {
>
>     // Column F is index 5, since columns start counting at 0
>     const interestsText = data[i][5]
>
>     // Break the cell's text into separate interests
>     const interestsList = interestsText.split(", ")
>
>     // Check each interest in this person's list
>     for (let j = 0; j < interestsList.length; j++) {
>       if (interestsList[j] === "Hydroponics") {
>         count++
>       }
>     }
>   }
>
>   // Show the final count in the Execution log
>   Logger.log(count)
> }
> ```
>
> **How it works, step by step:**
> 1. `getSheetByName("Form Responses 1")` grabs the correct sheet.
> 2. `getDataRange().getValues()` reads every row and column into a 2D array called `data`.
> 3. `count` starts at 0, ready to be added to.
> 4. The outer loop goes through each row of sign-ups, skipping row 0 (the headers).
> 5. `data[i][5]` grabs the Interests cell for that row.
> 6. `split(", ")` turns that cell's text into a list, splitting wherever it sees a comma and a space.
> 7. The inner loop checks each item in that list. If it exactly matches `"Hydroponics"`, `count` goes up by one.
> 8. After both loops finish, `Logger.log(count)` prints the total.
>
> To run it, select `countHydroponicsSignUps` in the Apps Script editor's function dropdown and click Run, then check the Execution log for the result.
:::

The assistant started by flagging something new: `split`. It's a string method that breaks text into an array, cutting it wherever it finds the separator you give it:

```{.code}
const interestsText = "Hydroponics, Pollinator Gardens, Heirloom Seeds"
const interestsList = interestsText.split(", ")
console.log(interestsList)
console.log(interestsList.length)
console.log(interestsList[1])
```

The separator is removed, and each piece becomes an item. If the text has no separator in it, you get an array with one item, the whole string. Try splitting `"Community Gardening"`.

::: {.term .zvv}
> **split** — A string method that breaks text into an array of pieces wherever a separator appears: `"a, b".split(", ")` gives `["a", "b"]`.
:::

The description of column F made this possible. Without "separated by a comma and a space," the assistant would have had to guess what the cell looks like, and a separator of `","` instead of `", "` would leave a space at the start of every interest after the first, so `" Hydroponics"` wouldn't equal `"Hydroponics"`.

::: {.m1k}
**Read.** There's a loop inside a loop, written in one function this time. The outer loop goes through the sign-ups, one row at a time. For each row, `split` turns the Interests cell into a list, and the inner loop goes through that list, adding 1 to `count` for each exact match. The inner loop's counter is called `j`, because `i` is already in use by the outer loop. That's a common convention: `i` for the outer loop, `j` for the one inside it.
:::

Why split at all, rather than checking whether the cell contains the word? Because comparing whole items with `===` is exact. If the form had options named *Hydroponics* and *Hydroponics Basics*, as an early draft of Maya's list did, a "contains" check would count both.

Run it. The answer should be 3: Keisha, Hana and Farah.

```{.code}
function countHydroponicsSignUps() {
  // Get the sheet by its name
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1")

  // Read all the data, including the header row, as an array of arrays
  const data = sheet.getDataRange().getValues()

  // This will keep track of how many people chose Hydroponics
  let count = 0

  // Start at row 1 to skip the header row
  for (let i = 1; i < data.length; i++) {

    // Column F is index 5, since columns start counting at 0
    const interestsText = data[i][5]

    // Break the cell's text into separate interests
    const interestsList = interestsText.split(", ")

    // Check each interest in this person's list
    for (let j = 0; j < interestsList.length; j++) {
      if (interestsList[j] === "Hydroponics") {
        count++
      }
    }
  }

  // Show the final count in the Execution log
  Logger.log(count)
}
```

## Counting Every Interest

Counting one interest is useful. A table of every interest and how many people chose it would be better. Continuing the chat:

::: {.ai-conversation prompt="Now I want a count for every interest, not just Hydroponics. Write the results to a sheet named Interest Counts, with the interest in column A and the number of people in column B." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="case" transcript="google-forms/count-interests"}
> Two new things I need to flag before writing this:
>
> 1. **`getRange(row, column, numRows, numColumns)`** — you've used `getRange("A1")` for one cell, but to write multiple rows and columns at once, `getRange` can also take four numbers: which row to start, which column to start, how many rows, and how many columns. This lets me write all my results in one step instead of one cell at a time.
> 2. Since I don't know ahead of time how many different interests there are, I need a way to check "have I already seen this interest?" I'll do this with a small helper function that loops through an array searching for a match — no new method needed, just a loop and a `return`.
>
> Here's the script:
>
> ```javascript
> // Searches an array for a value and returns its index, or -1 if not found
> function findIndexOfInterest(interestNames, interestToFind) {
>   for (let i = 0; i < interestNames.length; i++) {
>     if (interestNames[i] === interestToFind) {
>       return i
>     }
>   }
>   return -1
> }
>
> function countAllInterests() {
>   // Get the form responses sheet
>   const formSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1")
>
>   // Read all the data as an array of arrays
>   const data = formSheet.getDataRange().getValues()
>
>   // These two arrays work together: same index means matching name and count
>   const interestNames = []
>   const interestCounts = []
>
>   // Start at row 1 to skip the header row
>   for (let i = 1; i < data.length; i++) {
>
>     // Column F is index 5
>     const interestsText = data[i][5]
>
>     // Break the cell's text into separate interests
>     const interestsList = interestsText.split(", ")
>
>     // Check each interest this person chose
>     for (let j = 0; j < interestsList.length; j++) {
>       const interest = interestsList[j]
>
>       // See if we've already recorded this interest
>       const existingIndex = findIndexOfInterest(interestNames, interest)
>
>       if (existingIndex === -1) {
>         // New interest: add it with a count of 1
>         interestNames.push(interest)
>         interestCounts.push(1)
>       } else {
>         // Already seen: add one to its existing count
>         interestCounts[existingIndex] = interestCounts[existingIndex] + 1
>       }
>     }
>   }
>
>   // Build a 2D array to write to the sheet: one row per interest
>   const outputData = []
>   for (let i = 0; i < interestNames.length; i++) {
>     outputData.push([interestNames[i], interestCounts[i]])
>   }
>
>   // Get the sheet to write the results into
>   const outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Interest Counts")
>
>   // Write all the rows at once, starting at row 1, column 1
>   const numRows = outputData.length
>   const numColumns = 2
>   outputSheet.getRange(1, 1, numRows, numColumns).setValues(outputData)
> }
> ```
>
> **How it works, step by step:**
>
> 1. `findIndexOfInterest` is a helper function. Give it the array of names seen so far and one interest to look for. It loops through and returns the matching index, or `-1` if it's not there yet.
> 2. `interestNames` and `interestCounts` are two arrays that stay in sync — `interestCounts[0]` is the count for `interestNames[0]`, and so on.
> 3. The loops walk through every sign-up and every interest in that sign-up, same as before.
> 4. For each interest, `findIndexOfInterest` checks whether it's new. If it's new (`-1`), both arrays get a new entry. If it already exists, its count goes up by one.
> 5. After counting, `outputData` is built as an array of `[name, count]` pairs, ready to write to the sheet.
> 6. `getRange(1, 1, numRows, numColumns).setValues(outputData)` writes the whole table at once, starting at cell A1.
>
> Note: this assumes the **Interest Counts** sheet already exists. If you run this more than once, it will overwrite the top rows each time, but if the number of interests shrinks between runs, old leftover rows below could stay — want me to add a step that clears the sheet first?
:::

This is a harder problem than it looks. Counting Hydroponics needed one counter. Counting every interest needs a counter for each interest, and the code doesn't know in advance what the interests are. The assistant solved it with what you know, and it's worth reading slowly.

**Read.**

::: {.bd5 .wn5}
- **Two arrays that work together.** `interestNames` holds each interest the first time it's seen, and `interestCounts` holds its count at the *same index*. If `interestNames[3]` is "Hydroponics", then `interestCounts[3]` is how many people chose it. Arrays used in pairs like this are called **parallel arrays**.
- **A helper function that searches.** `findIndexOfInterest` loops through `interestNames` and returns the index where it finds a match. If there's no match, it returns `-1`. Since no real index is ever negative, -1 is a safe way to say "not found," and you'll see it used this way often, including by JavaScript's own methods.
- **The counting.** For each interest in each sign-up, the code asks the helper for its index. If it's -1, the interest is new, so it's added to `interestNames` with a count of 1 in `interestCounts`. Otherwise, the count at that index goes up by one.
- **Writing the results.** The two arrays are combined into an array of arrays, one `[name, count]` row per interest, which `setValues` writes to the sheet. It uses the numeric form of `getRange` you've seen before: start at row 1, column 1, and take as many rows as there are interests, and 2 columns.
:::

One more thing about this code: the helper is written *above* the function you run. That makes `findIndexOfInterest` the first function in the file, so in the Apps Script editor, and on this page, it's the one selected in the menu at first. Choose `countAllInterests` before you click Run.

### Read the warnings

The assistant ended with two warnings, and both are worth taking seriously:

- **The Interest Counts sheet has to exist already.** If it doesn't, `getSheetByName` returns `null`, and the next line stops with an error. Create the sheet before you run the code. (On this page, there's an empty one below.)
- **Old rows can be left behind.** The code writes over the top rows each time it runs. If there are fewer interests the next time, the extra rows from the last run stay underneath, and the table would look longer than it really is.

This is the kind of thing you learned to look for in [Loops and Repetition](loops){.book-link}: which sheet the code changes, which cells, and what's already there. Here, the assistant pointed it out for you. It doesn't always, so keep reading for it yourself.

Notice also what the output doesn't have: a header row. The table starts in A1 with the first interest. You might want to ask for "Interest" and "Count" headers in row 1.

Run it. Choose `countAllInterests` in the menu first:

```{.spreadsheet}
{"sheetName": "Interest Counts", "rows": 25, "columns": 4, "data": [], "formats": []}
```

```{.code}
// Searches an array for a value and returns its index, or -1 if not found
function findIndexOfInterest(interestNames, interestToFind) {
  for (let i = 0; i < interestNames.length; i++) {
    if (interestNames[i] === interestToFind) {
      return i
    }
  }
  return -1
}

function countAllInterests() {
  // Get the form responses sheet
  const formSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1")

  // Read all the data as an array of arrays
  const data = formSheet.getDataRange().getValues()

  // These two arrays work together: same index means matching name and count
  const interestNames = []
  const interestCounts = []

  // Start at row 1 to skip the header row
  for (let i = 1; i < data.length; i++) {

    // Column F is index 5
    const interestsText = data[i][5]

    // Break the cell's text into separate interests
    const interestsList = interestsText.split(", ")

    // Check each interest this person chose
    for (let j = 0; j < interestsList.length; j++) {
      const interest = interestsList[j]

      // See if we've already recorded this interest
      const existingIndex = findIndexOfInterest(interestNames, interest)

      if (existingIndex === -1) {
        // New interest: add it with a count of 1
        interestNames.push(interest)
        interestCounts.push(1)
      } else {
        // Already seen: add one to its existing count
        interestCounts[existingIndex] = interestCounts[existingIndex] + 1
      }
    }
  }

  // Build a 2D array to write to the sheet: one row per interest
  const outputData = []
  for (let i = 0; i < interestNames.length; i++) {
    outputData.push([interestNames[i], interestCounts[i]])
  }

  // Get the sheet to write the results into
  const outputSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Interest Counts")

  // Write all the rows at once, starting at row 1, column 1
  const numRows = outputData.length
  const numColumns = 2
  outputSheet.getRange(1, 1, numRows, numColumns).setValues(outputData)
}
```

Twenty of the 23 interests were chosen at least once. Five are tied as the most popular, with 3 people each: Native Plant Restoration, Vertical Gardening, Hydroponics, Therapeutic Horticulture and Pollinator Gardens. Check a couple of the counts against the Form Responses 1 sheet yourself.

Parallel arrays work, but keeping two arrays in step is fiddly: add to one and forget the other, and every count after that is attached to the wrong name. JavaScript has a better way to keep a name and its count together, called an **object**. It's the first new idea in the next part of the book, and when you've learned it, this code gets simpler.

## Your Learner Profile

::: {.learner-profile}
:::

Four new items. As before, the response sheet's description goes in your prompt, not the profile. You may want to add it to your garden context, since the club will use this form all season.

## Summary

A Google Form collects answers in a consistent shape, and when it's created from a spreadsheet, each response arrives as a new row on a Form Responses sheet, with a Timestamp column first. A checkbox question puts all of a person's choices in one cell, separated by a comma and a space, and `split(", ")` turns that text into an array. Counting every value in a list takes a counter for each value; with what you know, that's two parallel arrays and a helper function that returns an index, or -1 when there's no match. Assistants' instructions for using an app can be out of date, so check each step against your screen, and pay attention when an assistant warns you about what its code will do to your data. Personal information collected by a form deserves care: collect only what you need, and keep real responses out of your chats. In the next part of the book, you'll put the club's spreadsheet to work across Google Workspace, starting with objects.
