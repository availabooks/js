---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Read and write JSON and CSV files, and explain what makes CSV harder to read correctly than it looks.
2. Merge data from files with different column names, orders and formats into one consistent shape.
3. Check a merge by comparing counts and totals.
4. Write an Excel file from Node with a package.
5. Check an assistant's claims about a package against its npm page.
:::
:::

## Data in Files

A great deal of real data moves around as files: exports from websites, downloads from forms, spreadsheets emailed between offices. You've met the three most common formats already:

- **JSON**, from [Objects and JSON](objects){.book-link}: text that looks like JavaScript objects and arrays. Easy for programs, and it keeps types: numbers stay numbers.
- **CSV**, from [Automating Pages You Use](automating-pages){.book-link}: plain text, one line per row, values separated by commas. Every spreadsheet program can open and save it, which makes it the most common way to move a table between programs. Everything in it is text.
- **Excel's `.xlsx`**: not text at all, but a compressed bundle of files, so it takes a package to read or write.

Work of this kind, combining files, cleaning them up and converting between formats, is often done in a language called Python. JavaScript, with Node, does it just as well, and you already know the language.

### JSON files

Reading and writing JSON files is two steps you know, put together:

```{.code environment="nodejs"}
import fs from "node:fs"

const beds = [
  { id: "B1", sizeSqFt: 32 },
  { id: "B2", sizeSqFt: 32 }
]
// null, 2 makes the file readable, with line breaks and indents
fs.writeFileSync("beds.json", JSON.stringify(beds, null, 2))

const loaded = JSON.parse(fs.readFileSync("beds.json", "utf8"))
console.log(loaded[1].sizeSqFt + 10)
```

### CSV files, and why they're trickier than they look

A CSV line looks easy to take apart with `split(",")`. It is, until a value contains a comma. Run this:

```{.code}
const line = 'Seed packets,40,"Tomato, pepper and basil",15'
console.log(line.split(","))
```

Four values become five, because the comma inside the quotes was split too. The CSV rules, which you met in [Automating Pages You Use](automating-pages){.book-link}, say a value with a comma is wrapped in quotes, and a quote inside a value is written twice. Handling every case correctly takes more code than it seems. For real-world CSV files, well-established packages such as `csv-parse` and `papaparse` do it properly. For files you *know* have no commas or quotes in their values, `split(",")` is fine, as long as you've checked.

## Merging the Harvest Logs

Three volunteers kept the club's harvest log at different times of the season, each in a different tool, and each exported a CSV file. Here are the first lines of each:

```{.code environment="none"}
harvests-spring.csv
Date,Bed,Crop,Kg,Logged By
2027-04-18,B2,Radish,1.2,elena.rossi@example.com

harvests-june.csv
Crop,Bed,Weight (kg),Date,Volunteer
Kale,B4,0.6,6/5/2027,keisha.brown@example.com

harvests-summer.csv
date,bed_id,crop,kilograms,logged_by
2027-07-01,B1,Tomato,2.6,dev.patel@example.com
```

The same information, three ways: different column names, a different column order in June, and June's dates in the American month/day/year style. That's normal for data from different sources. Here's the request, in a new chat with your learner profile from [Working with Files and Folders](files){.book-link}. It describes each file's differences exactly, because describing data well, from [Arrays](arrays){.book-link}, matters as much here as it did with sheets:

::: {.ai-conversation prompt="Three volunteers exported harvest logs from different places, and I want to merge them. harvests-spring.csv has the columns Date,Bed,Crop,Kg,Logged By with dates like 2027-04-18. harvests-june.csv has Crop,Bed,Weight (kg),Date,Volunteer with dates like 6/5/2027. harvests-summer.csv has date,bed_id,crop,kilograms,logged_by with dates like 2027-07-01, and ends with a blank line. Write a Node script that merges them into one file, harvests.json, as an array of objects with the properties date (like 2027-06-05), bed, crop, kg (a number) and loggedBy, sorted by date." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="files" transcript="data-files/merge"}
> Here's a script that reads all three CSV files, converts each into the same shape, combines them, sorts by date, and writes the result. I'll explain each part below.
>
> ```javascript
> import { readFileSync, existsSync, writeFileSync } from "node:fs"
>
> // Splits a CSV file's text into lines, trims each one,
> // removes blank lines (like the trailing one in the summer file),
> // and drops the header row
> const getDataLines = (text) => {
>   const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "")
>   return lines.slice(1)
> }
>
> // Turns "6/5/2027" into "2027-06-05"
> const convertJuneDate = (rawDate) => {
>   const [month, day, year] = rawDate.split("/")
>   return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
> }
>
> // Date,Bed,Crop,Kg,Logged By
> const parseSpring = (text) =>
>   getDataLines(text).map(line => {
>     const [date, bed, crop, kg, loggedBy] = line.split(",")
>     return { date, bed, crop, kg: Number(kg), loggedBy }
>   })
>
> // Crop,Bed,Weight (kg),Date,Volunteer
> const parseJune = (text) =>
>   getDataLines(text).map(line => {
>     const [crop, bed, kg, rawDate, loggedBy] = line.split(",")
>     return { date: convertJuneDate(rawDate), bed, crop, kg: Number(kg), loggedBy }
>   })
>
> // date,bed_id,crop,kilograms,logged_by
> const parseSummer = (text) =>
>   getDataLines(text).map(line => {
>     const [date, bed, crop, kg, loggedBy] = line.split(",")
>     return { date, bed, crop, kg: Number(kg), loggedBy }
>   })
>
> // Read the three files (must be in the same folder you run this from)
> const springText = readFileSync("harvests-spring.csv", "utf8")
> const juneText = readFileSync("harvests-june.csv", "utf8")
> const summerText = readFileSync("harvests-summer.csv", "utf8")
>
> // Combine all three into one array of matching objects
> const allHarvests = [
>   ...parseSpring(springText),
>   ...parseJune(juneText),
>   ...parseSummer(summerText)
> ]
>
> // Sort by date (works because YYYY-MM-DD text sorts the same as time order)
> const sortedHarvests = [...allHarvests].sort((a, b) => {
>   if (a.date < b.date) return -1
>   if (a.date > b.date) return 1
>   return 0
> })
>
> const outputFile = "harvests.json"
>
> // Check before overwriting
> if (existsSync(outputFile)) {
>   console.log(`${outputFile} already exists. Rename or delete it, then run this again.`)
> } else {
>   writeFileSync(outputFile, JSON.stringify(sortedHarvests, null, 2))
>   console.log(`Wrote ${sortedHarvests.length} harvest records to ${outputFile}`)
> }
> ```
>
> **What each part does:**
>
> - `getDataLines` cleans up a CSV file's text: splits it into lines, trims stray spaces, throws out blank lines, and skips the header row.
> - `convertJuneDate` rearranges `M/D/YYYY` into `YYYY-MM-DD` so all three sources end up in the same date format. `padStart(2, "0")` adds a leading zero if the month or day is a single digit.
> - Each `parse...` function reads its file's lines, splits each line on commas, and destructures the pieces into variables in the order that file uses. Then it returns a new object with the same property names (`date`, `bed`, `crop`, `kg`, `loggedBy`) no matter which file it came from. `Number(kg)` turns the text weight into an actual number.
> - The three arrays are combined into one with the spread operator (`...`).
> - `.sort()` compares the `date` strings directly — since they're all `YYYY-MM-DD` now, comparing them as text also puts them in chronological order.
> - Before writing, it checks with `existsSync` whether `harvests.json` is already there, so you don't lose a previous file by accident.
>
> **A few things to check:**
> - This assumes no field (like a volunteer's name) contains a comma. If one does, the simple `split(",")` would break — let me know if that's a real possibility and I'll show you a safer way to handle quoted CSV fields.
> - Make sure your `package.json` has `"type": "module"` so `import` works.
> - Run it from the folder containing the three CSV files, since `readFileSync` here uses relative paths based on your terminal's current directory.
:::

**Read.** The design is the important part. Each file gets its own small parsing function, `parseSpring`, `parseJune` and `parseSummer`, and each one returns objects of the *same* shape, with the same property names and types. Everything after that, combining, sorting and saving, works on one consistent kind of data. This is called **normalizing** the data: converting everything to one standard form as early as possible.

::: {.term}
> **Normalizing data** — Converting data from different sources into one consistent form: the same field names, types and formats.
:::

The details use what you learned in the last few lessons:

- **`getDataLines`** splits a file into lines, trims them, drops blank ones, including the summer file's trailing blank line, and removes the header with `slice(1)`.
- **Array destructuring** gives the columns names, in each file's own order: `[crop, bed, kg, rawDate, loggedBy]` for June.
- **`convertJuneDate`** rearranges `6/5/2027` into `2027-06-05`, with `padStart`.
- **Spread** combines the three arrays, and dates in `YYYY-MM-DD` form sort correctly as text.
- **`existsSync`** checks before overwriting `harvests.json`, which is your profile's new rule at work.

And the assistant stated its main assumption: no value contains a comma. For these files that's true, but it's something you should check, now that you know why it matters.

### Checking the merge

How do you know the merge worked? Don't just look at the first few records. Check numbers you can verify independently:

- **The count.** The three files have 7, 11 and 14 rows, so the merged file should have 32 records.
- **A total.** The kilograms should add up to the season's total, which you've seen before: 70.9 kilograms.
- **The edges.** The first date should be the earliest harvest, 2027-04-18, and the last the latest, 2027-08-16.

A few lines at the end of the script can do the checking for you:

```{.code environment="nodejs"}
const totalKg = sortedHarvests.reduce((sum, harvest) => sum + harvest.kg, 0)
console.log(`Records: ${sortedHarvests.length}`)
console.log(`Total kilograms: ${totalKg.toFixed(1)}`)
console.log(`From ${sortedHarvests[0].date} to ${sortedHarvests[sortedHarvests.length - 1].date}`)
```

For the club's files, that prints 32 records, 70.9 kilograms, from 2027-04-18 to 2027-08-16. A count that's off means rows were lost or duplicated; a total that's off means numbers were misread, for example a text value that `Number()` turned into `NaN`. This is worth a profile rule.

## Writing an Excel File

The sustainability office would rather have Excel. Continuing the chat:

::: {.ai-conversation prompt="The sustainability office wants the merged harvests as an Excel file, harvests.xlsx, with a header row. Which package should I use, and how?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="files" transcript="data-files/merge"}
> For creating a real `.xlsx` file, you need a package — Node's built-in `fs` module can't write Excel's binary/zip format on its own.
>
> **Recommended package: `exceljs`**
>
> It's one of the most widely used packages for this on npm (millions of downloads a week), actively maintained, and has a simple API for writing rows with headers.
>
> ### 1. Install it
>
> In your terminal, in your project folder:
>
> ```
> npm install exceljs
> ```
>
> This adds it to `node_modules` and lists it in `package.json`.
>
> ### 2. The script
>
> ```javascript
> import ExcelJS from "exceljs"
> import { readFileSync, existsSync } from "node:fs"
>
> // Read the merged data you already created
> const harvestsText = readFileSync("harvests.json", "utf8")
> const harvests = JSON.parse(harvestsText)
>
> // Create a new workbook and a sheet in it
> const workbook = new ExcelJS.Workbook()
> const sheet = workbook.addWorksheet("Harvests")
>
> // Define the header row and which property goes in each column
> sheet.columns = [
>   { header: "Date", key: "date" },
>   { header: "Bed", key: "bed" },
>   { header: "Crop", key: "crop" },
>   { header: "Kg", key: "kg" },
>   { header: "Logged By", key: "loggedBy" }
> ]
>
> // Add one row per harvest record
> // (addRow reads the matching property for each column by its key)
> harvests.forEach(harvest => sheet.addRow(harvest))
>
> const outputFile = "harvests.xlsx"
>
> // Check before overwriting an existing file
> if (existsSync(outputFile)) {
>   console.log(`${outputFile} already exists. Rename or delete it, then run this again.`)
> } else {
>   await workbook.xlsx.writeFile(outputFile)
>   console.log(`Wrote ${harvests.length} rows to ${outputFile}`)
> }
> ```
>
> **What's new here:**
>
> - `import ExcelJS from "exceljs"` brings in the whole package as one object named `ExcelJS`, since that's how this package is built (unlike `node:fs`, where you import individual named functions).
> - `new ExcelJS.Workbook()` creates an empty spreadsheet in memory.
> - `sheet.columns` sets up both the header text (what people see in row 1) and a `key`, which tells ExcelJS which property of each object to put in that column.
> - `sheet.addRow(harvest)` adds one row, matching each column's `key` to a property on the `harvest` object.
> - `await workbook.xlsx.writeFile(...)` actually writes the file. It's `await`ed because saving a file is asynchronous — Node doesn't pause on its own to wait for the disk write to finish.
> - Top-level `await` (using `await` outside a function) works in an ES module file run directly with `node`, as long as your `package.json` has `"type": "module"`.
>
> Run it with:
> ```
> node yourfilename.js
> ```
>
> and check that `harvests.xlsx` opens correctly in Excel afterward.
:::

**Read.** The assistant followed both parts of your package rule: it said a package was needed, because Node can't write Excel's format by itself, and it said how widely used `exceljs` is. The code creates a workbook and a worksheet, sets up the columns with a header and a `key` each, adds one row per harvest, where each row's values are matched to columns by their keys, and writes the file with `await`. Top-level `await` works in an ES module, as the reply explains.

The code works: the file opens in Excel with a header row and 32 harvests. But check the claims about the package, because your profile asked the assistant to say how widely used it is, and it can only say what it remembers. On npmjs.com, the `exceljs` page shows its weekly downloads, which are indeed high, and the date of its latest release. At the time of writing, that was December 2024, almost two years earlier. "Actively maintained" was a stretch. A package that works well and hasn't changed in two years may be fine, but it's a fact you should see for yourself before relying on it.

::: {.note}
> **Package knowledge goes stale in another way, too.** Another popular Excel package, SheetJS, is published on npm as `xlsx`, but its makers stopped updating the npm copy years ago and now publish new versions on their own website. An assistant that suggests `npm install xlsx` gets you an old version, with known problems. The package's npm page and its official documentation both say so, which is one more reason to look before installing.
:::

## Data Is Messy

The three harvest files were tidy compared with most real data. When you combine files, expect:

- **Different names** for the same thing: *Kg*, *kilograms*, *Weight (kg)*.
- **Different formats:** dates as `6/5/2027`, `2027-06-05` or `5 June 2027`; numbers with commas, like `1,200`; `TRUE`, `yes` or `1` for the same answer.
- **Different units:** kilograms from one volunteer and pounds from another.
- **Blanks and stray spaces,** such as an empty last line, or `" B3"` with a space.
- **Duplicates,** when two exports overlap.

The approach is always the same: describe each source exactly, normalize everything to one form as early as possible, and check the result with counts and totals you can verify.

## Your Learner Profile

::: {.ai-profile lesson="data-files"}
Add rules:

- After code combines, cleans or converts data, have it print counts or totals I can check.

Add to "What I know so far":

- reading and writing JSON files with fs, JSON.parse and JSON.stringify
- CSV files, quoting, why split(",") fails on quoted commas, and packages such as csv-parse and papaparse
- normalizing data from different sources into one shape
- checking a merge with counts and totals
- writing Excel files with the exceljs package
- top-level await in ES modules
:::

## Summary

JSON, CSV and Excel are the most common data file formats: JSON keeps types, CSV is plain text every spreadsheet program understands, and Excel's format needs a package. CSV looks easy to split, but quoted values containing commas break a simple `split(",")`, so use a CSV package for files you haven't checked. Merging files from different sources means normalizing them: one small function per source, each returning the same shape of object. Checking a merge means comparing numbers you can verify, such as the count of records and a total. The `exceljs` package writes Excel files from Node. When an assistant describes a package, check the claims on its npm page, because its knowledge of packages goes stale like everything else it knows. Next, you'll analyze and chart a season of the club's data.
