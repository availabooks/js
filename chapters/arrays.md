---
_$_import: monaco
---

## Why Arrays Matter in Apps Script

When you start automating Google Sheets with Apps Script, you quickly discover that working with **one value at a time** isn’t enough. Spreadsheets are built around **lists**, **columns**, and **tables**—all collections of values. To handle that kind of data, you need a structure that can hold many items at once. That’s exactly what arrays are designed for.

Arrays let your scripts read, process, and transform groups of values efficiently. They’re the backbone of almost every meaningful spreadsheet automation you’ll write.

### Arrays Hold Multiple Values in a Single Variable

A normal variable stores one value:

<pre class="code" data-environment="none"> 
let city = "Denver"
</pre>

An array stores many:

<pre class="code" data-environment="none"> 
let cities = ["Denver", "Chicago", "Boston"]
</pre>

This ability to group related values is essential when you’re dealing with spreadsheet data, which naturally comes in lists.

### Arrays Are How Google Sheets Returns Ranges

When you read a single cell, you get a single value. But when you read **multiple cells**, Apps Script returns an **array of arrays**:

- Each **inner array** represents a row
- The **outer array** contains all the rows you requested

This structure mirrors the shape of the spreadsheet, but in JavaScript form. Once you understand arrays of arrays, you can process entire ranges at once instead of working cell by cell.

### Arrays Make Your Scripts Faster and Cleaner

Apps Script is at its best when you:

- Read a whole range into an array
- Process the data in memory
- Write the results back in one step

This approach is dramatically faster than touching the spreadsheet repeatedly. Arrays make that possible.

### Arrays Help You Think in Terms of Data, Not Cells

Once you start using arrays, your mental model shifts:

- Instead of “read A2,” you think “get the second item in the list.”
- Instead of “look at each cell in column B,” you think “consider each row and look at index 1.”
- Instead of “write to row 10,” you think “update the tenth array element.”

This mindset is how real applications handle data—by working with collections rather than isolated pieces.

### What You’ll Learn in This Chapter

In the sections ahead, you’ll explore:

- How to create and use arrays
- How to work with arrays of arrays returned by Google Sheets
- Useful array methods for transforming data
- How to write arrays back into the sheet
- Real‑world examples that turn raw spreadsheet ranges into meaningful results

By the end of this chapter, arrays will feel natural and intuitive—and you’ll be ready to build scripts that handle real‑world data with confidence and speed.

## Understanding Arrays

Arrays are one of the most important data structures you’ll use in JavaScript and Google Apps Script. If variables let you store a single value, arrays let you store **many values in a single place**—a list, a sequence, a collection. This becomes essential when you start working with spreadsheet data, because Sheets almost always gives you information in groups: rows, columns, or entire tables.

Think of an array as a row of labeled boxes, each holding a value. You can look inside any box, change what’s in it, or look at all of them one by one.

### What an Array Looks Like

Arrays are created using square brackets:

<pre class="code" data-environment="none">
let colors = ["red", "green", "blue"]
let scores = [95, 87, 72, 100]
</pre>

Each item in the array has a position called an **index**. JavaScript starts counting at **0**, not 1:

- `colors[0]` → `"red"`
- `colors[1]` → `"green"`
- `colors[2]` → `"blue"`

This “zero‑based indexing” is standard in most programming languages.

### Accessing and Changing Array Values

You can read a value by referencing its index:

<pre class="code" data-environment="none">
let firstColor = colors[0]
</pre>

You can also change a value:

<pre class="code" data-environment="none">
colors[1] = "yellow"   // replaces "green"
</pre>

Or add new values:

<pre class="code" data-environment="none">
colors.push("purple")
</pre>

Arrays grow as needed—you don’t have to declare their size ahead of time.

### Arrays Can Hold Any Type of Data

Arrays aren’t limited to one type of value. You can mix strings, numbers, booleans, or even other arrays:

<pre class="code" data-environment="none">
let mixed = ["Ava", 42, true]
</pre>

In practice, though, it’s best to keep arrays consistent so your code stays predictable.

### Common Mistakes to Watch For

**Off‑by‑one errors**  
 Because arrays start at index 0, beginners often try to access an index that doesn’t exist:

<pre class="code" data-environment="none">
let items = ["a", "b", "c"]
items[3]  // This will be undefined since there is no index 3
</pre>

**Empty arrays**  
 An array with no items still exists, but accessing any index returns `undefined`:

<pre class="code" data-environment="none">
let empty = []
empty[0]  // undefined
</pre>

**Forgetting that arrays are ordered**  
 If order matters—like rows in a spreadsheet—be careful when adding or removing items.

### Why Arrays Matter in Apps Script

Arrays become essential when you start working with Google Sheets. For example:

<pre class="code" data-environment="none">
let sheet = SpreadsheetApp.getActiveSheet()
let range= sheet.getRange("A1:A10")
let values= range.getValues()
</pre>

`getValues()` returns an array of arrays—an array of rows, where each row is itself an array. You’ll explore this in detail in the next section, but the key idea is this:

**Arrays are how Apps Script represents spreadsheet data.**

If you want to process multiple rows, clean up a column, or generate new output, you’ll be working with arrays.

### What You Can Do With Arrays

By the end of this chapter, arrays will feel like second nature. You’ll use them to:

- Read data from a sheet into an array
- Transform values before writing them back
- Build new lists from existing ones
- Represent entire tables in memory

Arrays are the gateway to handling real‑world data at scale. Once you’re comfortable with them, you’ll be ready to tackle the arrays of arrays that Google Sheets gives you—and that’s where your Apps Script skills really start to shine.

## Arrays and Google Sheets

Arrays become truly useful once you start working with data from Google Sheets. Almost everything you read from a sheet—whether it’s a column, a row, or a whole table—comes back as an **array**. And when you read more than one cell at a time, Apps Script gives you an **array of arrays**, where each inner array represents a single row of data.

Understanding this structure is the key to writing fast, efficient spreadsheet automations.

### `getValue()` vs. `getValues()`

These two methods behave very differently:

- **`getValue()`** returns a _single value_
- **`getValues()`** returns an _array of arrays_

Example:

<pre class="code" data-environment="none">
let sheet = SpreadsheetApp.getActiveSheet()


let singleValue = sheet.getRange("A1").getValue()  // one value


// array of arrays
let manyValues = sheet.getRange("A1:A5").getValues() 
</pre>

If you log `manyValues`, you’ll see something like:

\[  
 \["Ava"\],  
 \["Jordan"\],  
 \["Mia"\],  
 \["Sam"\],  
 \["Leo"\]  
\]

Each inner array represents one row from the range.

### Thinking in Rows and Columns

When you read a range like `"A1:C1"`, you get **one row**, represented as an array:

\["Ava", "Smith", 28\]

When you read `"A1:C3"`, you get **three rows**, represented as an array of arrays:

\[  
 \["Ava", "Smith", 28\],  
 \["Jordan", "Lee", 31\],  
 \["Mia", "Chen", 25\]  
\]

This structure mirrors the spreadsheet:

- Outer array → all rows
- Inner arrays → each row
- Items inside inner arrays → each cell in that row

Once you see the pattern, it becomes intuitive.

### Extracting Values

In the next chapter, we’ll see how to use something called a “loop” to extract values from an array in an elegant way, but for now, let’s see how to refer to individual values in an array of arrays. Suppose you had a spreadsheet with the following data:

|     | A       | B           | C    |
| :-- | ------- | ----------- | ---- |
| 1   | Ada     | Lovelace    | 1815 |
| 2   | Charles | Babbage     | 1791 |
| 3   | Mary    | Sommerville | 1780 |

If you were to execute this statement:

<pre class="code" data-environment="none">
let data = sheet.getRange("A1:C3").getValues()
</pre>

you would have a variable named “data” containing an array of arrays that looks as follows:

\[  
 \["Ada", "Lovelace", 1815\],  
 \["Charles", "Babbage", 1791\],  
 \["Mary", "Sommerville", 1780\]  
\]

Here is one approach to read the data from the first row into individual variables

<pre class="code" data-environment="none">
let data = sheet.getRange("A1:C3").getValues()

let firstRow = data[0]         // ["Ada", "Lovelace", 1815]
let firstName = firstRow[0]     // "Ada"
let lastName = firstRow[1]      // "Lovelace"
let age = firstRow[2]           // 1815
</pre>

In this example, we assign a variable named “firstRow” to the first value in the “data” array. That value is itself an array, holding the values Ada, Lovelace, and 1815\. Then use the “firstRow” variable to access individual values. However, we can accomplish the same result without the intermediated variable (firstRow) as follows:

<pre class="code" data-environment="none">
let data = sheet.getRange("A1:C3").getValues()

let firstName = data[0][0]    // "Ada"
let lastName = data[0][1]     // "Lovelace"
let age = data[0][2]          // 1815
</pre>

Similarly, you can pull out a single column by accessing the first element of each inner array:

<pre class="code" data-environment="none">
let data = sheet.getRange("A1:A3").getValues()

let first = data[0][0]     // Ada
let second = data[1][0]    // Charles
let third = data[2][0]     // Mary
</pre>

You’re simply navigating the structure—outer array first, then inner array.

### Why This Matters

Arrays are the format Google Sheets uses to give you data. Once you understand how to read and access values inside arrays of arrays, you can:

- Work with entire ranges at once
- Extract specific rows or columns
- Prepare data for later transformation
- Build scripts that handle more than one cell at a time

This sets the stage for everything that comes next. Soon you’ll learn how to transform these arrays, reshape them, and prepare them for writing back into the sheet.

## Writing Arrays Back to the Worksheet

Now that you’ve seen how Google Sheets gives you data as arrays (and arrays of arrays), the next step is learning how to **write** data back into the sheet. This is where arrays become truly powerful: you can prepare all your data in memory and then write it to the spreadsheet in a single, efficient operation.

Apps Script provides two main methods for writing values:

- **`setValue()`** — writes a _single_ value
- **`setValues()`** — writes an _array of arrays_

Since this chapter focuses on arrays, we’ll work with `setValues()`.

### Writing a Single Row (One Inner Array)

If you want to write one row of data, you pass a single inner array. For example, using the row:

\["Ada", "Lovelace", 1815\]

You can write it like this:

<pre class="code" data-environment="none">
function writeOneRow() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let row = ["Ada", "Lovelace", 1815]

  sheet.getRange("A1:C1").setValues([row])
}
</pre>

Notice that `setValues()` expects an **array of arrays**, even if you’re only writing one row. That’s why we wrap `row` in another pair of brackets.

### Writing Multiple Rows (An Array of Arrays)

Here’s the full dataset as an array of arrays:

\[  
 \["Ada", "Lovelace", 1815\],  
 \["Charles", "Babbage", 1791\],  
 \["Mary", "Sommerville", 1780\]  
\]

This structure is already perfect for `setValues()`. Each inner array is a row, and the outer array contains all the rows.

To write all three rows into the sheet:

<pre class="code" data-environment="none">
function writeManyRows() {
  let sheet = SpreadsheetApp.getActiveSheet()

  let data = [
    ["Ada", "Lovelace", 1815],
    ["Charles", "Babbage", 1791],
    ["Mary", "Sommerville", 1780]
  ]

  sheet.getRange("A1:C3").setValues(data)
}
</pre>

As long as the range size matches the array size (3 rows × 3 columns), Apps Script writes everything in one step.

### Why This Matters

Writing data with `setValues()` is:

- **Fast** — one operation instead of many
- **Clean** — your script stays simple and readable
- **Reliable** — the structure of your array matches the structure of the sheet

This is the preferred way to write any non‑trivial amount of data back into Google Sheets.

### A Helpful Pattern to Remember

Whenever you want to write data:

1. Build an **array of arrays** in memory
2. Select a range with the same dimensions
3. Call `setValues()`

This pattern is the foundation of efficient spreadsheet automation.
