---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Describe the College Community Garden and the problems its club needs to solve.
2. Explain what each sheet in the club's spreadsheet holds, and how the sheets connect.
3. Give an AI assistant a description of several related sheets, and use it to answer a question that needs two of them.
4. Explain why adding decimals can give results like 9.500000000000002, and round numbers for display.
:::
:::

## The Founder's Realization

The idea for the College Community Garden began with a single observation from a sophomore named **Maya Thompson**, an environmental science major who spent a lot of time wandering the quieter edges of campus. One afternoon, walking past the Agricultural Sciences research plots, she noticed a fenced stretch of land, nearly half an acre, that looked oddly untouched. The soil was tilled and the irrigation lines were coiled neatly at the edge, but nothing was planted. A small sign explained why: the parcel was part of a long-term crop-rotation study that wouldn't resume for several years.

Most students would have walked past without a second thought. Maya saw potential.

The university had been trying to strengthen its relationship with the surrounding community, especially around sustainability and food security. Local residents had been asking for hands-on places to learn about growing food, composting and gardening in small spaces. The unused land looked like an answer to both.

Maya started imagining what it could become: a teaching garden where students and community members worked side by side, learned practical skills, grew fresh produce and got to know one another. It could be done without interfering with the department's long-term plans for the land.

## Pitching the Idea

Maya drafted a proposal and met with a faculty advisor in Agricultural Sciences. She expected a polite rejection. Instead, the advisor smiled and said, "If you can organize it, we'll support it. That land is just resting."

Encouraged, Maya went to the Office of Student Life with a plan for an official club. Her pitch was simple:

- The garden would be **student-led**, but **open to community members**.
- It would teach **urban farming techniques**, especially ones useful in small yards, balconies and shared spaces.
- It would produce **fresh food** for volunteers and for local food-access programs.
- It would give the university a **visible project** to point to in its sustainability reports.

The club was approved within weeks.

## The Club Takes Shape, and You Step Up

Maya recruited students from environmental science, nutrition, biology, education and business. Community members joined too: retirees with years of gardening experience, parents looking for weekend activities, and neighbors who simply wanted to learn to grow their own food. You signed up as well.

Together, the first members agreed on the club's mission:

- Teach practical, accessible gardening skills to anyone who wants to learn.
- Grow food for the community, favoring crops that thrive locally.
- Model sustainable practices, from composting to saving water.
- Create a welcoming space where students and neighbors work together.
- Build a program that lasts after its founders graduate.

The garden quickly became more than a plot of land. It became a project with real logistics: who's volunteering when, what's planted where, when it will be ready, what supplies are running low, how much the garden is producing, and how to keep dozens of people informed.

Maya was keeping track of all of it in a spreadsheet, by hand. When she mentioned that she spent more time updating it than gardening, you offered to help. You'd been learning to program with Google Apps Script, and this looked like exactly the kind of work a script could do.

## A Familiar List

When Maya shared the spreadsheet with you, the first sheet looked familiar. It was the Members sheet you've been working with for the last five lessons. Maya Thompson, in row 2, is the club's founder, and every script you've written so far, from greeting a member to totaling volunteer hours, was already work for the club.

The Members sheet is only the beginning, though. Maya's spreadsheet has six sheets.

## The Club's Spreadsheet

Here is each sheet, as it stands at the end of the club's first season. Each one has a copy button, which gives you a script that recreates the sheet in your own Google Sheets file, so you can follow along in Apps Script as well as on this page. Put all six in one spreadsheet file, with the sheet names shown.

**Members** is the roster you know: one row per member, with dues and volunteer hours.

```{.spreadsheet}
{"sheetName": "Members", "rows": 16, "columns": 8, "data": [{"range": "A1:E13", "values": [["First Name", "Last Name", "Email", "Dues Paid", "Volunteer Hours"], ["Maya", "Thompson", "maya.thompson@example.com", true, 24], ["Ava", "Lopez", "ava.lopez@example.com", true, 12], ["Ben", "Okafor", "ben.okafor@example.com", false, 4], ["Cam", "Nguyen", "cam.nguyen@example.com", true, 9.5], ["Dev", "Patel", "dev.patel@example.com", true, 15], ["Elena", "Rossi", "elena.rossi@example.com", false, 6.5], ["Farah", "Haddad", "farah.haddad@example.com", true, 11], ["Gabe", "Martinez", "gabe.martinez@example.com", false, 2], ["Hana", "Kim", "hana.kim@example.com", true, 18.5], ["Isaac", "Cohen", "isaac.cohen@example.com", true, 7], ["Jordan", "Lee", "jordan.lee@example.com", false, 0], ["Keisha", "Brown", "keisha.brown@example.com", true, 13.5]]}], "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
```

**Beds** lists the garden's eight raised beds. Each has an ID, used on the other sheets to refer to it, a size in square feet, how much sun it gets and which part of the garden it's in.

```{.spreadsheet}
{"sheetName": "Beds", "rows": 12, "columns": 8, "data": [{"range": "A1:E9", "values": [["Bed ID", "Name", "Size (sq ft)", "Sun", "Zone"], ["B1", "Bed 1", 32, "full", "north"], ["B2", "Bed 2", 32, "full", "north"], ["B3", "Bed 3", 48, "full", "south"], ["B4", "Bed 4", 48, "partial", "south"], ["B5", "Bed 5", 64, "full", "south"], ["B6", "Bed 6", 64, "partial", "east"], ["B7", "Bed 7", 24, "partial", "east"], ["B8", "Bed 8", 24, "full", "east"]]}], "formats": [{"range": "A1:E1", "fontWeight": "bold"}]}
```

**Plantings** records what was planted in each bed, when it was planted, when it's expected to be ready, and which member planted it.

```{.spreadsheet}
{"sheetName": "Plantings", "rows": 18, "columns": 10, "data": [{"range": "A1:G15", "values": [["Planting ID", "Bed ID", "Crop", "Variety", "Planted On", "Expected Harvest", "Planted By"], ["P01", "B1", "Tomato", "Cherokee Purple", "2027-04-10", "2027-06-29", "maya.thompson@example.com"], ["P02", "B1", "Basil", "Genovese", "2027-04-10", "2027-06-09", "ava.lopez@example.com"], ["P03", "B2", "Lettuce", "Buttercrunch", "2027-03-20", "2027-05-14", "ben.okafor@example.com"], ["P04", "B2", "Radish", "French Breakfast", "2027-03-20", "2027-04-17", "cam.nguyen@example.com"], ["P05", "B3", "Zucchini", "Black Beauty", "2027-04-24", "2027-06-13", "dev.patel@example.com"], ["P06", "B3", "Bean", "Blue Lake Bush", "2027-04-24", "2027-06-21", "elena.rossi@example.com"], ["P07", "B4", "Kale", "Lacinato", "2027-03-27", "2027-05-26", "farah.haddad@example.com"], ["P08", "B4", "Spinach", "Bloomsdale", "2027-03-27", "2027-05-11", "gabe.martinez@example.com"], ["P09", "B5", "Tomato", "Sungold", "2027-04-17", "2027-06-21", "hana.kim@example.com"], ["P10", "B5", "Pepper", "California Wonder", "2027-04-17", "2027-07-01", "isaac.cohen@example.com"], ["P11", "B6", "Carrot", "Nantes", "2027-04-03", "2027-06-12", "keisha.brown@example.com"], ["P12", "B7", "Mint", "Spearmint", "2027-04-03", "2027-07-02", "maya.thompson@example.com"], ["P13", "B8", "Cucumber", "Marketmore", "2027-05-01", "2027-06-30", "ava.lopez@example.com"], ["P14", "B8", "Squash", "Waltham Butternut", "2027-05-01", "2027-08-09", "ben.okafor@example.com"]]}], "formats": [{"range": "A1:G1", "fontWeight": "bold"}, {"range": "E2:E15", "numberFormat": "@"}, {"range": "F2:F15", "numberFormat": "@"}]}
```

**Shifts** is the volunteer log. Each row is one shift: the date, the task, which member worked it and for how long. A member's Volunteer Hours on the Members sheet is the total of their shifts here.

```{.spreadsheet}
{"sheetName": "Shifts", "rows": 87, "columns": 7, "data": [{"range": "A1:D84", "values": [["Date", "Task", "Member Email", "Hours"], ["2027-03-20", "composting", "ava.lopez@example.com", 1], ["2027-03-20", "planting", "cam.nguyen@example.com", 1], ["2027-03-20", "watering", "dev.patel@example.com", 1.5], ["2027-03-20", "composting", "isaac.cohen@example.com", 1], ["2027-03-20", "harvesting", "keisha.brown@example.com", 1.5], ["2027-03-20", "watering", "maya.thompson@example.com", 1], ["2027-04-03", "watering", "elena.rossi@example.com", 1], ["2027-04-03", "planting", "maya.thompson@example.com", 1], ["2027-04-10", "planting", "dev.patel@example.com", 1], ["2027-04-10", "watering", "farah.haddad@example.com", 1.5], ["2027-04-10", "watering", "hana.kim@example.com", 1.5], ["2027-04-17", "watering", "maya.thompson@example.com", 2], ["2027-04-24", "planting", "ava.lopez@example.com", 2], ["2027-04-24", "watering", "keisha.brown@example.com", 2], ["2027-05-01", "watering", "farah.haddad@example.com", 1], ["2027-05-01", "harvesting", "hana.kim@example.com", 2], ["2027-05-01", "weeding", "keisha.brown@example.com", 1], ["2027-05-01", "harvesting", "maya.thompson@example.com", 1.5], ["2027-05-01", "composting", "maya.thompson@example.com", 2], ["2027-05-08", "composting", "dev.patel@example.com", 1], ["2027-05-15", "watering", "dev.patel@example.com", 2], ["2027-05-15", "planting", "elena.rossi@example.com", 1], ["2027-05-15", "watering", "isaac.cohen@example.com", 1.5], ["2027-05-15", "weeding", "maya.thompson@example.com", 2], ["2027-05-22", "weeding", "dev.patel@example.com", 1], ["2027-05-22", "composting", "farah.haddad@example.com", 1], ["2027-05-22", "weeding", "farah.haddad@example.com", 1], ["2027-05-22", "weeding", "hana.kim@example.com", 1.5], ["2027-05-22", "watering", "hana.kim@example.com", 2], ["2027-05-22", "weeding", "keisha.brown@example.com", 1], ["2027-05-29", "harvesting", "dev.patel@example.com", 1.5], ["2027-05-29", "planting", "hana.kim@example.com", 1.5], ["2027-05-29", "weeding", "keisha.brown@example.com", 2], ["2027-06-05", "planting", "farah.haddad@example.com", 1], ["2027-06-05", "weeding", "hana.kim@example.com", 1.5], ["2027-06-05", "weeding", "hana.kim@example.com", 2], ["2027-06-12", "planting", "dev.patel@example.com", 1.5], ["2027-06-12", "harvesting", "maya.thompson@example.com", 1.5], ["2027-06-19", "planting", "cam.nguyen@example.com", 1.5], ["2027-06-19", "composting", "cam.nguyen@example.com", 1.5], ["2027-06-19", "watering", "hana.kim@example.com", 1], ["2027-06-19", "weeding", "keisha.brown@example.com", 2], ["2027-06-19", "watering", "maya.thompson@example.com", 1.5], ["2027-07-03", "weeding", "ava.lopez@example.com", 1], ["2027-07-03", "watering", "ava.lopez@example.com", 2], ["2027-07-03", "harvesting", "farah.haddad@example.com", 2], ["2027-07-10", "harvesting", "cam.nguyen@example.com", 1], ["2027-07-10", "weeding", "isaac.cohen@example.com", 1.5], ["2027-07-10", "watering", "maya.thompson@example.com", 2], ["2027-07-17", "harvesting", "farah.haddad@example.com", 1.5], ["2027-07-17", "watering", "hana.kim@example.com", 1.5], ["2027-07-24", "watering", "ava.lopez@example.com", 2], ["2027-07-24", "harvesting", "gabe.martinez@example.com", 2], ["2027-07-24", "weeding", "hana.kim@example.com", 1.5], ["2027-07-24", "composting", "maya.thompson@example.com", 2], ["2027-07-31", "watering", "ben.okafor@example.com", 2], ["2027-07-31", "planting", "cam.nguyen@example.com", 1.5], ["2027-07-31", "watering", "elena.rossi@example.com", 1.5], ["2027-08-07", "weeding", "ava.lopez@example.com", 2], ["2027-08-14", "watering", "ben.okafor@example.com", 2], ["2027-08-14", "planting", "cam.nguyen@example.com", 1.5], ["2027-08-14", "watering", "elena.rossi@example.com", 1.5], ["2027-08-21", "composting", "dev.patel@example.com", 1.5], ["2027-08-21", "composting", "hana.kim@example.com", 1.5], ["2027-08-28", "weeding", "cam.nguyen@example.com", 1.5], ["2027-08-28", "composting", "dev.patel@example.com", 1], ["2027-08-28", "composting", "hana.kim@example.com", 1], ["2027-09-04", "harvesting", "dev.patel@example.com", 1.5], ["2027-09-04", "weeding", "farah.haddad@example.com", 1], ["2027-09-04", "watering", "isaac.cohen@example.com", 1.5], ["2027-09-04", "planting", "keisha.brown@example.com", 1], ["2027-09-04", "planting", "maya.thompson@example.com", 1], ["2027-09-04", "planting", "maya.thompson@example.com", 2], ["2027-09-11", "composting", "isaac.cohen@example.com", 1.5], ["2027-09-11", "planting", "keisha.brown@example.com", 1.5], ["2027-09-18", "planting", "dev.patel@example.com", 1.5], ["2027-09-18", "composting", "farah.haddad@example.com", 1], ["2027-09-18", "planting", "maya.thompson@example.com", 2], ["2027-09-18", "watering", "maya.thompson@example.com", 1], ["2027-09-25", "weeding", "ava.lopez@example.com", 2], ["2027-09-25", "planting", "elena.rossi@example.com", 1.5], ["2027-09-25", "weeding", "keisha.brown@example.com", 1.5], ["2027-09-25", "composting", "maya.thompson@example.com", 1.5]]}], "formats": [{"range": "A1:D1", "fontWeight": "bold"}, {"range": "A2:A84", "numberFormat": "@"}]}
```

**Harvests** records each time produce was picked: the date, the bed, the crop, how many kilograms, and who logged it.

```{.spreadsheet}
{"sheetName": "Harvests", "rows": 36, "columns": 8, "data": [{"range": "A1:E33", "values": [["Date", "Bed ID", "Crop", "Kilograms", "Logged By"], ["2027-04-18", "B2", "Radish", 1.2, "elena.rossi@example.com"], ["2027-05-13", "B4", "Spinach", 2.4, "ben.okafor@example.com"], ["2027-05-15", "B2", "Lettuce", 3.9, "hana.kim@example.com"], ["2027-05-21", "B2", "Lettuce", 2.5, "dev.patel@example.com"], ["2027-05-21", "B4", "Spinach", 0.6, "gabe.martinez@example.com"], ["2027-05-28", "B4", "Kale", 2.2, "isaac.cohen@example.com"], ["2027-05-31", "B2", "Lettuce", 2.4, "gabe.martinez@example.com"], ["2027-06-05", "B4", "Kale", 0.6, "keisha.brown@example.com"], ["2027-06-09", "B1", "Basil", 2, "gabe.martinez@example.com"], ["2027-06-11", "B4", "Kale", 1.8, "dev.patel@example.com"], ["2027-06-13", "B3", "Zucchini", 0.5, "elena.rossi@example.com"], ["2027-06-13", "B6", "Carrot", 1.3, "gabe.martinez@example.com"], ["2027-06-18", "B1", "Basil", 1.3, "cam.nguyen@example.com"], ["2027-06-21", "B3", "Zucchini", 3.2, "dev.patel@example.com"], ["2027-06-22", "B3", "Bean", 2.6, "elena.rossi@example.com"], ["2027-06-24", "B5", "Tomato", 3.1, "ben.okafor@example.com"], ["2027-06-29", "B3", "Bean", 3.8, "dev.patel@example.com"], ["2027-06-30", "B3", "Zucchini", 0.6, "maya.thompson@example.com"], ["2027-07-01", "B1", "Tomato", 2.6, "dev.patel@example.com"], ["2027-07-01", "B5", "Tomato", 0.9, "ava.lopez@example.com"], ["2027-07-01", "B8", "Cucumber", 2.6, "isaac.cohen@example.com"], ["2027-07-03", "B5", "Pepper", 2, "elena.rossi@example.com"], ["2027-07-05", "B7", "Mint", 3.6, "farah.haddad@example.com"], ["2027-07-07", "B3", "Bean", 3.7, "hana.kim@example.com"], ["2027-07-08", "B1", "Tomato", 2.2, "elena.rossi@example.com"], ["2027-07-09", "B7", "Mint", 2.4, "keisha.brown@example.com"], ["2027-07-10", "B8", "Cucumber", 2.9, "maya.thompson@example.com"], ["2027-07-13", "B1", "Tomato", 1.4, "gabe.martinez@example.com"], ["2027-07-16", "B8", "Cucumber", 3.9, "farah.haddad@example.com"], ["2027-07-17", "B7", "Mint", 2.5, "ben.okafor@example.com"], ["2027-08-10", "B8", "Squash", 1.9, "gabe.martinez@example.com"], ["2027-08-16", "B8", "Squash", 2.3, "dev.patel@example.com"]]}], "formats": [{"range": "A1:E1", "fontWeight": "bold"}, {"range": "A2:A33", "numberFormat": "@"}]}
```

**Supplies** is the club's inventory, with the quantity on hand and the level at which each item should be reordered.

```{.spreadsheet}
{"sheetName": "Supplies", "rows": 12, "columns": 7, "data": [{"range": "A1:D9", "values": [["Item", "Quantity", "Unit", "Reorder At"], ["Tomato cages", 18, "each", 10], ["Compost", 6, "bags", 8], ["Mulch", 12, "bags", 5], ["Seed packets", 40, "packets", 15], ["Garden gloves", 9, "pairs", 12], ["Hose nozzles", 3, "each", 2], ["Twine", 2, "rolls", 3], ["Trowels", 11, "each", 6]]}], "formats": [{"range": "A1:D1", "fontWeight": "bold"}]}
```

### How the sheets connect

The sheets refer to one another. Plantings and Harvests don't repeat each bed's name, size and sun; they just use its ID, such as B3, and the details are on the Beds sheet. Shifts, Plantings and Harvests refer to members by email address, which appears once on the Members sheet. So to answer a question like "how much did Bed 3 produce?" you look up B3's harvests on one sheet, and to report it by name you look up B3 on another.

Keeping each fact in one place means it only has to be updated in one place. If Hana's email address changes, it changes once, on the Members sheet, instead of in every shift she ever worked. This idea is at the heart of how databases are designed, and you'll meet it again later in the book.

::: {.note}
> **Why are the dates text?** When Google Sheets recognizes a date, `getValue` gives your code a special Date object rather than a string or a number, and you haven't learned to work with those yet. So for now, the date columns are formatted as plain text, and a date reads as a string like "2027-04-18". You'll switch to real dates when you learn to work with them.
:::

## Describing the Club's Data

You learned in [Arrays](arrays){.book-link} that an assistant can't see your spreadsheet, so you describe it. With six sheets, the description is longer, but it works the same way. Here's one that covers the whole spreadsheet. The book calls it the **garden context**:

```{.code environment="none"}
Here is my club's spreadsheet. It has these sheets. In each sheet, row 1 has headers and each row after that is one record.

- Members: A First Name, B Last Name, C Email, D Dues Paid (a checkbox, so true or false), E Volunteer Hours (a number).
- Beds: A Bed ID (text such as B1), B Name, C Size in square feet (a number), D Sun (full or partial), E Zone (north, south or east).
- Plantings: A Planting ID (text such as P01), B Bed ID (matches Beds column A), C Crop, D Variety, E Planted On (a date stored as text, such as 2027-04-10), F Expected Harvest (a date stored as text), G Planted By (a member's email, matching Members column C).
- Shifts: A Date (a date stored as text), B Task (watering, weeding, planting, harvesting or composting), C Member Email (matches Members column C), D Hours (a number).
- Harvests: A Date (a date stored as text), B Bed ID (matches Beds column A), C Crop, D Kilograms (a number), E Logged By (a member's email).
- Supplies: A Item, B Quantity (a number), C Unit, D Reorder At (a number; the item should be reordered when Quantity is at or below it).
```

For the rest of the book, whenever you ask an assistant about the club's data, start the chat with your learner profile and then paste the garden context. Save it somewhere you can copy it from easily, or copy it from this page.

Notice what the description includes beyond the column names. It says which columns match up between sheets ("matches Beds column A"), what type each value is, and what the values look like ("text such as B1", "a date stored as text"). Those are exactly the things an assistant would otherwise have to guess.

## A Question That Needs Two Sheets

Maya's first question for you is how much each bed has produced this season. Answering it takes two sheets: Harvests for the kilograms, and Beds for the names.

The sheets are on this page already, above. Here's the request, in a new chat that starts with your learner profile from [Functions](functions){.book-link}, followed by the garden context:

::: {.ai-conversation prompt="(Paste the garden context first.) Write a script that logs the total kilograms harvested from each bed, using the bed's name." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="functions" transcript="case/harvest-by-bed"}
> Here's a script that does this in two functions — one to loop through the beds, and one helper function to add up the kilograms for a single bed.
>
> ```javascript
> function logKilogramsPerBed() {
>   // Get the Beds sheet and read all its values into an array of arrays
>   const bedsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Beds")
>   const bedsData = bedsSheet.getDataRange().getValues()
>
>   // Get the Harvests sheet and read all its values into an array of arrays
>   const harvestsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Harvests")
>   const harvestsData = harvestsSheet.getDataRange().getValues()
>
>   // Loop through the beds, starting at row 1 to skip the header row
>   for (let i = 1; i < bedsData.length; i++) {
>     const bedId = bedsData[i][0]
>     const bedName = bedsData[i][1]
>
>     // Call the helper function to get this bed's total kilograms
>     const total = getTotalKilograms(bedId, harvestsData)
>
>     // Log the bed's name and its total
>     Logger.log(`${bedName}: ${total} kg`)
>   }
> }
>
> function getTotalKilograms(bedId, harvestsData) {
>   // Start a running total at 0
>   let total = 0
>
>   // Loop through the harvests, starting at row 1 to skip the header row
>   for (let i = 1; i < harvestsData.length; i++) {
>     const harvestBedId = harvestsData[i][1]
>     const kilograms = harvestsData[i][3]
>
>     // If this harvest row matches the bed we're checking, add its kilograms to the total
>     if (harvestBedId === bedId) {
>       total += kilograms
>     }
>   }
>
>   // Send the total back to whoever called this function
>   return total
> }
> ```
>
> **How it works:**
>
> - `logKilogramsPerBed` reads both sheets into arrays of arrays with `getDataRange().getValues()`.
> - It loops through each bed (skipping the header row), pulling out the bed's ID and name.
> - For each bed, it calls `getTotalKilograms`, passing in that bed's ID and the full harvests data.
> - `getTotalKilograms` loops through every harvest row, and whenever the harvest's Bed ID matches the one we're checking, it adds that row's kilograms to a running total.
> - Once the inner loop finishes, `return total` sends the answer back to the first function, which logs it with the bed's name.
>
> To run it, select `logKilogramsPerBed` in the function dropdown in the Apps Script editor, then check the Execution log for the results.
:::

**Read.** This is the most involved code so far, but everything in it is something you've learned:

- **`logKilogramsPerBed`** is the function you run. It reads both sheets, then loops over the beds. For each bed, it gets the ID and the name, and calls `getTotalKilograms` to find the total.
- **`getTotalKilograms(bedId, harvestsData)`** receives one bed's ID and all the harvest rows. It loops over every harvest, adds up the kilograms of the ones whose Bed ID matches, and returns the total.

So there's a loop inside a loop: for each of the 8 beds, the second function checks all 32 harvests. That's 256 comparisons, which takes a computer no time at all. Splitting the inner loop into its own function, with a name that says what it finds, makes the whole thing much easier to follow than two loops written one inside the other.

The garden context did its job. The code uses the right sheet names, the right columns (index 1 for the Bed ID and 3 for kilograms on Harvests), and matches the harvests to beds by ID, the way the description said they connect.

Run it:

```{.code}
function logKilogramsPerBed() {
  // Get the Beds sheet and read all its values into an array of arrays
  const bedsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Beds")
  const bedsData = bedsSheet.getDataRange().getValues()

  // Get the Harvests sheet and read all its values into an array of arrays
  const harvestsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Harvests")
  const harvestsData = harvestsSheet.getDataRange().getValues()

  // Loop through the beds, starting at row 1 to skip the header row
  for (let i = 1; i < bedsData.length; i++) {
    const bedId = bedsData[i][0]
    const bedName = bedsData[i][1]

    // Call the helper function to get this bed's total kilograms
    const total = getTotalKilograms(bedId, harvestsData)

    // Log the bed's name and its total
    Logger.log(`${bedName}: ${total} kg`)
  }
}

function getTotalKilograms(bedId, harvestsData) {
  // Start a running total at 0
  let total = 0

  // Loop through the harvests, starting at row 1 to skip the header row
  for (let i = 1; i < harvestsData.length; i++) {
    const harvestBedId = harvestsData[i][1]
    const kilograms = harvestsData[i][3]

    // If this harvest row matches the bed we're checking, add its kilograms to the total
    if (harvestBedId === bedId) {
      total += kilograms
    }
  }

  // Send the total back to whoever called this function
  return total
}
```

## Numbers That Don't Add Up Exactly

The code works, and most of the totals look fine. But look at Bed 1: 9.500000000000002 kg. Adding up a few decimals shouldn't produce that. Here's what the assistant said, in the same chat:

::: {.ai-conversation prompt="It works, but some totals look strange. The log shows Bed 1: 9.500000000000002 kg and Bed 3: 14.400000000000002 kg. Why? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="functions" transcript="case/harvest-by-bed"}
> This is happening because of how computers store decimal numbers.
>
> JavaScript stores numbers in a format called **floating point**, which is very good at storing whole numbers but can lose a little bit of precision with decimals. Numbers like `0.1`, `0.2`, or `4.4` can't always be stored *exactly* — the computer stores something extremely close instead, like `0.30000000000000004` instead of `0.3`.
>
> You can actually see this yourself. If you ran:
>
> ```javascript
> console.log(0.1 + 0.2)
> ```
>
> it would log `0.30000000000000004`, not `0.3`.
>
> In your case, you're adding up several decimal kilogram values (like `3.2 + 6.3`), and each addition can introduce a tiny rounding error. Those tiny errors build up as the loop keeps adding more numbers, which is why you end up with something like `9.500000000000002` instead of a clean `9.5`.
>
> This isn't a bug in your code — it's just a quirk of how almost all programming languages handle decimal numbers. It's very common, and there are ways to fix the *display* of the number (without changing the actual math), but since you said not to fix it yet, I'll stop here unless you want to move on to that.
:::

That's right, and it surprises almost everyone the first time. Computers store numbers in binary, and many decimals, such as 0.1, can't be written exactly in binary, the same way 1/3 can't be written exactly as a decimal (0.333...). The error is tiny, but it can show up when you add several decimals together. Try it:

```{.code}
console.log(0.1 + 0.2)
console.log(3.2 + 6.3)
```

The math isn't wrong in any way that matters for a garden. The problem is only how the number looks. So the fix is to round it when you display it:

::: {.ai-conversation prompt="How can I show the totals rounded to one decimal place?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="functions" transcript="case/harvest-by-bed"}
> Rounding to one decimal place needs a tool that isn't on your "known" list yet — either the `Math.round()` function or the `.toFixed()` method. Both are common ways to round numbers in JavaScript, but neither uses only the concepts you've listed so far.
>
> Here's a quick preview of both, so you can decide which you'd like to learn:
>
> **`toFixed()`** — a method that rounds a number and turns it into a string with a fixed number of decimal places:
> ```javascript
> const total = 9.500000000000002
> const rounded = total.toFixed(1)
> // rounded is the string "9.5"
> ```
>
> **`Math.round()`** — a function that rounds a number to the nearest whole number (you'd combine it with multiplying and dividing by 10 to round to one decimal place):
> ```javascript
> const total = 9.500000000000002
> const rounded = Math.round(total * 10) / 10
> // rounded is the number 9.5
> ```
>
> Would you like me to explain one of these so we can use it in the script? `toFixed()` is simpler for just displaying a rounded number, while `Math.round()` keeps the result as an actual number you could still do math with.
:::

Both options are worth knowing:

- **`toFixed(1)`** is a number method that rounds to one decimal place and gives back a *string*: `(9.500000000000002).toFixed(1)` is `"9.5"`. It always shows exactly that many decimals, so 10 becomes `"10.0"`. It's the simplest choice for displaying a number.
- **`Math.round()`** rounds to the nearest whole number. To round to one decimal place, multiply by 10, round, and divide by 10: `Math.round(9.500000000000002 * 10) / 10` is `9.5`. The result is still a *number*, so you can keep calculating with it.

`Math` is a built-in collection of math tools, which you use like `SpreadsheetApp`: `Math.round(...)`, and others such as `Math.max(...)` and `Math.min(...)`.

Here's the logging line changed to use `toFixed`, in the version of the function you'd keep:

```{.code}
function logKilogramsPerBed() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const bedsSheet = spreadsheet.getSheetByName("Beds")
  const bedsRange = bedsSheet.getDataRange()
  const bedsData = bedsRange.getValues()
  const harvestsSheet = spreadsheet.getSheetByName("Harvests")
  const harvestsRange = harvestsSheet.getDataRange()
  const harvestsData = harvestsRange.getValues()

  for (let i = 1; i < bedsData.length; i++) {
    const bedId = bedsData[i][0]
    const bedName = bedsData[i][1]
    const total = getTotalKilograms(bedId, harvestsData)
    // round for display only; decimals don't always add up exactly
    console.log(`${bedName}: ${total.toFixed(1)} kg`)
  }
}

function getTotalKilograms(bedId, harvestsData) {
  let total = 0
  for (let i = 1; i < harvestsData.length; i++) {
    const harvestBedId = harvestsData[i][1]
    const kilograms = harvestsData[i][3]
    if (harvestBedId === bedId) {
      total += kilograms
    }
  }
  return total
}
```

Round when you *show* a number, not while you're adding it up. Rounding each harvest before adding it would build up its own small errors.

## What the Club Needs

Maya's list of what the club needs from you is long, and it maps onto the rest of the book:

- **Signing up new members** without retyping their details. That's the next lesson, [Google Forms](google-forms){.book-link}.
- **Welcoming new members and reminding volunteers** about their shifts, by email, automatically.
- **Producing documents**, such as certificates for volunteers and a weekly newsletter.
- **Checking the weather** to decide whether the beds need watering.
- **A web page** where anyone can see how the garden is doing.

Later, the club will outgrow a single spreadsheet, and you'll follow it onto other platforms: the web, Microsoft Excel, productivity apps, your own computer, and servers. The data will be the same club's data throughout, and your garden context will come along.

## Your Learner Profile

One small addition:

::: {.ai-profile lesson="case"}
Add to "What I know so far":

- rounding numbers with toFixed() and Math.round(), and that adding decimals can give results like 9.500000000000002
:::

The garden context isn't part of the profile. As with the Members sheet description in [Arrays](arrays){.book-link}, the profile describes you, and the garden context describes the club's data. Paste them one after the other when you ask about the garden.

## Summary

The College Community Garden is a student club that turned an unused plot into a teaching garden, and its spreadsheet has six sheets: Members, Beds, Plantings, Shifts, Harvests and Supplies. The sheets refer to one another by ID and email address, so each fact is stored once. The garden context describes all six sheets, including how they connect and what their values look like, so an assistant can write code for the club's data without guessing. With it, questions that need two sheets, like harvest totals by bed name, become a loop that calls a function containing another loop. Adding decimals can produce tiny errors, such as 9.500000000000002, because computers can't store most decimals exactly. Round with `toFixed()` or `Math.round()` when you display a result. Next, the club needs a better way to sign up members.
