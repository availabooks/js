---
_$_import: monaco
---

## What Variables Are and Why They Matter

As you begin writing programs that do more than print a message or perform a single calculation, you need a way to store information—something your code can remember, reuse, and change as it runs. That’s exactly what **variables** are for. A variable is a named container that holds a piece of data. You can think of it like a labeled box: you put something inside, give the box a name, and later you can open it, change what’s inside, or use its contents in a calculation.

In JavaScript and Google Apps Script, variables let you keep track of values such as numbers, text, dates, or even entire lists of data. Without variables, every program would be rigid and repetitive. With them, your code becomes flexible, dynamic, and capable of responding to different situations.

A simple example looks like this:

<pre class="code" data-environment="none"> 
let score = 10 
</pre>

Here, `score` is the variable’s name, and `10` is the value stored inside it. Once you’ve created this variable, you can use it anywhere in your script:

<pre class="code" data-environment="none"> 
console.log(score)
</pre>

To see this example execute in Google Apps Script, do the following:

1. Open a new Google Sheet
2. From the menu bar, choose “Extensions” then “Apps Script”  
   ![{width:334, alt="Opening Apps Script Editor"}](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3j_ZQ5HXTAbC-DQiRbQOngEJNc3rQ-OHiKKCTnsovgeU16k4zbgiuLsrmReTfJSmFhBOMVNyUiVv4rMuF9kES2x3O7TkNbn7s1UqLZxURDNscVa79jioBfRWZrp_OCqShjwpMeK_0Ayr6yTFGs8OJJjcr1W6EUwWiYhtSRSOtbL1VpbxMEM-xkaFaLa0/s1600/84cd1741.png)

This will open the Google Apps Script editor with a new script file named “[Code.gs](http://Code.gs),” showing the following:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8B09kVhscTTl6lJyGzklWN2kqMt7ZSY4Aa-vct7HmHR6GjRXVmIfFPC8G_DM0WaOMikBZMn784e6vapHIWLVVCf3jdXQsRuuzjKIO2zKTwFO8a6xq5130b4_q2-Q40qMQTPnDO4834vEnHiJMsqLMTnd-1gXK5yhiSH0ycr2Dw6XELt-zbi7OwtGjLl8/s1600/d467b986.png)

Notice that there is already some code here in the code GS file. What you see is the basic structure of a function. We'll talk more about functions later but it's the structure that allows us to group multiple lines of code to execute together. To execute code, just write (or paste) the lines between the braces as follows:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQH1PqnDqi-QXT6DoByjraPWqGCbkdbNc8dJHFaY2fUd9befeIjBFcLDATgGGPTERA47c_XO5i9ALj9tRj2ESXQiyfH_BDugG0TvpDIt2YagNWtP-XD5nXRlddIS6WRwnnDFmMPCL5kEabRe7ohn_JG3t2JGzScvkwV5dSCb5APZKCqzKAlQID0kx5XZM/s1600/1637cacb.png)

Now, your code is ready to execute. To do so, click the “Run” button.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmFx67OG_2-F0Or2T_2_nUhmnNcYMEpW-6mXcqTI8YP5BEyazIg8w56aMMiD8co-Gv_RLapr3CCQ9cw6Jh5OQ-rrPH73Uj1Xnp0kXvD0XDdH_wCb4Vtig4t7JQZ3gcT_axtXVrwRCQydhAH1yofuQ7yK1xCJI96CHLdPsEWWWlSx9_AovzmVfnHOnFTl4/s1600/8029f1d6.png)

This will execute the function and open the execution log:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjP3hh-YYHn0EgM_VPlCLHqfmQ-CtJbjkncf_Ylaf5caooCSraRp5jF2c-wxQArAEuzWiu0NbzIjnrrJHmrfGfy_wbcvOs8EEB926WDeOrZMNPdbE1J7P7vwk6whzUGGxCYR1a-MSpgTA6spM2uWhofYUpNdMT6Vucm__o9vaI3bCdmslDaatH4Mew0qTw/s1600/9109882d.png)

There are three entries in the execution log: The first and the last just show the times that the function began and completed running. The remaining item displays the value of the variable named “count” at the time that line 3 of the function ran.

You can modify the code in the “myFunction” function to run any of the examples in this section.

Now let’s continue with our discussion of variables. Modify the code as follows:

<pre class="code">
let count = 10  
 count = 20  
 count = count + 1  
 console.log(count)
</pre>

The first statement defines the variable “count” and gives it a value of 10\. The second statement changes the value of the variable “count” to 20\. The third statement will set a new value for the “count” variable, but to calculate the new value, it must read its current value. Before it can assign the value it must evaluate “count \+ 1”. At this point of the code, count holds a value of 20, so “count \+ 1” evaluates to 21\. So the variable named “count” will take on the value 21\. The final statement will print 21 into the execution log. Give it a try.

This ability to store and update information is at the heart of programming. It’s how you track progress, remember user input, process spreadsheet data, or build tools that adapt to whatever information they’re given.

Variables matter because they allow your programs to:

- **Reuse values** without rewriting them
- **Respond to changing data**
- **Store results** from calculations or user actions
- **Organize information** in a clear, meaningful way
- **Build more complex logic** that depends on what’s happening in the program

In Google Apps Script, variables become especially powerful because they can hold values pulled directly from a spreadsheet—like a list of names, a column of numbers, or a single cell’s content. Once that data is in a variable, your script can analyze it, transform it, or write new results back into the sheet.

As you move through this chapter, you’ll learn how to create variables, choose good names for them, and work with different kinds of data. These skills form the foundation for everything you’ll build next, whether you’re automating a spreadsheet, generating reports, or writing full applications.

## Primitive Types: Strings, Numbers, Booleans

Every programming language needs a way to represent basic kinds of information. In JavaScript—and therefore in Google Apps Script—these fundamental building blocks are called **primitive types**. They’re the simplest forms of data your program can work with, and they show up everywhere: in calculations, text processing, decisions, and interactions with spreadsheet values.

Understanding these types will help you write clearer code and avoid common mistakes as you begin working with real data from Google Sheets.

### Strings: Working With Text

A **string** is any piece of text—words, sentences, symbols, or even empty space. Strings are written inside quotes:

<pre class="code" data-environment="none">
let name = "Ava"
let message = "Hello, world!"
let empty = ""
</pre>

Strings are useful for:

- Labels and descriptions
- Messages you log or display
- Data pulled from spreadsheet cells
- Building dynamic text (like email subjects or custom messages)

You can combine strings using the `+` operator:

<pre class="code" data-environment="none">
let greeting = "Hello, " + name
</pre>

In Apps Script, strings are especially common because spreadsheet data often arrives as text—even when it looks like a number.

### Numbers: Doing Math and Calculations

Numbers in JavaScript represent both whole numbers and decimals:

<pre class="code" data-environment="none">
let age = 30
let price = 19.99
let total = age + price
</pre>

You can perform all the usual arithmetic:

<pre class="code" data-environment="none">
let sum = 5 + 7
let product = 3 * 4
let average = (10 + 20 + 30) / 3
</pre>

In Google Sheets, numbers are everywhere—totals, counts, dates, percentages—so being comfortable with numeric operations is essential. Apps Script can read numbers directly from cells and use them in calculations or write new results back into the sheet.

### Booleans: True or False Values

A **boolean** represents one of two possible values:

<pre class="code" data-environment="none">
let isActive = true
let isComplete = false
</pre>

Booleans are the backbone of decision‑making in your programs. They’re used in conditions, comparisons, and logic:

<pre class="code" data-environment="none">
let score = 85
let passed = score > 70   // passed becomes true
</pre>

Whenever your script needs to choose between two paths—send an email or not, update a cell or skip it, run a calculation or stop—a boolean is involved.

### Why Primitive Types Matter

These three types—strings, numbers, and booleans—form the foundation of almost everything you’ll do in Apps Script. They allow your programs to:

- Store and manipulate text
- Perform calculations
- Make decisions
- Interpret spreadsheet data
- Build dynamic, flexible scripts

As you begin interacting with Google Sheets, you’ll see these types constantly. A cell might contain a string, a number, or something that becomes a boolean when you compare it. Understanding how these types behave will make your scripts more reliable and easier to reason about.

Next, we’ll explore how to work with these values inside variables and how to combine them into more complex structures.

## Working With Variables in Apps Script

Now that you’ve seen the basic data types—strings, numbers, and booleans—it’s time to look more closely at how variables actually behave inside your programs. Variables are the foundation of everything you’ll do in Apps Script, especially once you start pulling information out of a spreadsheet and transforming it with code.

### Declaring Variables With `let`

In modern JavaScript (and Apps Script), the most common way to create a variable is with the keyword `let`:

<pre class="code" data-environment="none">
let total = 0
let name = "Jordan"
let isReady = true
</pre>

When you declare a variable with `let`, you’re telling the computer:  
 _“Create a container with this name, and store this value inside it.”_

You can change the value later:

<pre class="code" data-environment="none">
total = total + 5
name = "Jordan Smith"
isReady = false
</pre>

This flexibility is what makes variables so powerful. They allow your program to evolve as it runs.

### Choosing Good Variable Names

A variable name should describe what the value represents. Clear names make your code easier to read and understand—especially when you come back to it later.

Good examples:

- `totalSales`
- `firstName`
- `isComplete`
- `rowCount`

Less helpful examples:

- `x`
- `data1`
- `thing`

Apps Script doesn’t care what you name your variables, but _you_ will. Good names make your scripts feel organized and intentional.

### Variables and Spreadsheet Data

In Apps Script, variables often hold values pulled directly from a Google Sheet. For example:

<pre class="code" data-environment="none">
let sheet = SpreadsheetApp.getActiveSheet()
let cell = sheet.getRange("A1")
let value = cell.getValue()
</pre>

Here:

- `sheet` stores a reference to the active sheet
- `cell` stores a reference to cell A1 on the active sheet
- `value` stores whatever is in cell A1

The first time you run code that accesses data from the spreadsheet, the Apps Script environment will prompt you to be sure that you want to allow code to access your sheet. You can probably imagine that someone with malicious intent could try to trick someone into running code that accesses or deletes sensitive data or sends email messages to other users. Every time you run code that accesses a feature of the Apps Script environment for the first time, you will be prompted with a warning message about the service that is about to be invoked. This can be a bit annoying, but it’s there for the safety of folks who may be copying and pasting code that they don’t understand. Apps Script requires you to approve the script each time a new service is introduced.

When you run the code above for the first time, you will see a prompt similar to the following:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhR8c6fPDH044_XrWrpK4wNhadf7g3a_6jL0SvBarMFDmauJCJK9nMXmidDn_QPVMfYATAiNRJZPjLxHY82IiPByc5L2GlOET3YFM3JNkrluHjTR-Tnr2i3dYdLjR0DAkdpCwjGo39YQIBc97Txre9joxgtHEwZvx2xj76c8FzjIPYO8v4NSKYCAK4aiX8/s1600/a67405fb.png)

When you indicate that you will “review permissions”, you’ll advance to the next step in the process.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgnxOFlrt_7D-HUUfe371b6D-5lAUk2VGIXmqoTf7arbM83PKfu0f1dkRzBPOkIhzWKdrRIQwV_0vcVUK0hHgD8D99ds6NGHhqF4w3YvwNPe2i0AcZjiLRAt7gmfRYjbyAc5mbj3xxF7FnTcxVuAdMVC1Hxzc-BJsC61OEJvROQxLZjr0UvpkJnaIc-Xyw/s1600/75d1cb3b.png)

Here, you’ll need to click the gray “advanced” link on the left side of the window.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi58vQBbnMxMiEuu3Fbfq2KVOILoBL-5WgYlZF_x0NASyET16xoFQkQ2iDVYqVXes8bO8-nD0OOExPaiJqEio7jnpal__gF44BPM8gnbP-DWdH_UpMOMB8fYPsGGOSWcsp9tMVIRIhT53JgNZNcJAjLR9GPTvqVZTz0ephw6goSO-H7k3ZE-0Be_kKrpHw/s1600/6c44db2e.png)

Now, click the gray “Go to Untitiled project (unsafe)” link in the bottle left of the window. This will bring up the prompt that alerts you to the fact that this code is going to access data from your sheet as follows:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBrKg0BwVK7EM8Q8m6iHwrRpKM2nphUPb4Bg-lrQdHbKupzeJv7J0sjCVZr-EsSbjDTYRBykxamPYuOG0IMQv-Oi85qp9SjN2Qw-vdo10CxeQm_c_yuQDpx885SKC7A89OmetQDn0cIFtsz8RCl7xoWh0Ag_0P0Rrv9BX3iUXOi5wvhKbqwdUFgKl-I18/s1600/13fac37e.png)

When you click “Continue” you authorize this script to execute with the permissions that were listed. The Apps Script environment will not prompt you to approve those permissions again is this project. However, if you add code that requires other permissions, you’ll need to through a similar approval process.

Also, sometimes the Apps Script environment will execute the script after you approve its elevated access and sometimes it does not. If you do not see the expected output, just run the script again.

Now, let’s return to our discussion of variables.

Once the data is in a variable, you can manipulate it just like any other value:

<pre class="code" data-environment="none">
console.log("The value in A1 is: ", value)
</pre>

This is where variables start to feel practical—you’re no longer working with abstract examples, but with real information from your spreadsheet.

### Reassigning vs. Redefining

One important detail: you can **change** the value of a variable declared with `let`, but you cannot **redeclare** it in the same scope.

This is allowed:

<pre class="code" data-environment="none">
let count = 10  
count = 20 // OK
</pre>

This is not:

<pre class="code" data-environment="none">
let count = 10
let count = 20    // Not allowed
</pre>

Understanding this distinction helps you avoid common errors as your scripts grow.

### Why Variables Matters

Variables are the glue that holds your programs together. They let you:

- Capture data from a spreadsheet
- Store intermediate results
- Build dynamic messages
- Track progress through a script
- Make decisions based on changing values

As you move forward, you’ll use variables constantly—sometimes dozens of them in a single script. Getting comfortable with how they work now will make everything else feel much more natural.

## Working With Text and Numbers

As you begin writing scripts that interact with real spreadsheet data, you’ll spend a lot of time working with two fundamental types of information: **text** and **numbers**. These values show up everywhere in Google Sheets—names, labels, totals, dates, prices, IDs—and understanding how to manipulate them in JavaScript (and Apps Script) is essential for building useful tools.

Even though text and numbers behave differently, the way you work with them in JavaScript is surprisingly intuitive once you see a few examples.

### Working With Text (Strings)

Text values—called **strings**—are written inside quotes:

<pre class="code" data-environment="none">
let firstName = "Jordan"
let message = "Welcome to Apps Script!"
</pre>

Strings are incredibly flexible. You can:

- Combine them
- Break them apart
- Insert values into them
- Use them to build dynamic messages or labels

For example, you can join strings using the `+` operator:

<pre class="code" data-environment="none">
let greeting = "Hello, " + firstName + "!"
</pre>

This approach to manipulating string data is called string concatenation.

Or build more readable text using template literals:

<pre class="code" data-environment="none">
let greeting = `Hello, ${firstName}!`
</pre>

This approach to manipulating string data is called string interpolation.

When you pull text from a spreadsheet, it arrives as a string:

<pre class="code" data-environment="none">
let sheet = SpreadsheetApp.getActiveSheet()
let city = sheet.getRange("A2").getValue()  // likely a string
</pre>

Once it’s in a variable, you can transform it however you like—capitalize it, add punctuation, or combine it with other values.

### Working With Numbers

Numbers in JavaScript represent both whole numbers and decimals:

<pre class="code" data-environment="none">
let price = 19.99
let quantity = 3
let total = price * quantity
</pre>

You can perform all the standard arithmetic operations:

- Addition: `+`
- Subtraction: `-`
- Multiplication: `*`
- Division: `/`
- Remainder: `%`

Apps Script reads numeric spreadsheet values as JavaScript numbers:

<pre class="code" data-environment="none">
let amount = sheet.getRange("B5").getValue()  // a number
let doubled = amount * 2
</pre>

This makes it easy to build scripts that calculate totals, averages, or other metrics directly from your data.

### Converting Between Text and Numbers

Sometimes you’ll get a value from a spreadsheet that _looks_ like a number but is actually stored as text. Or you may need to turn a number into text to build a message.

JavaScript gives you simple tools for this:

Convert text to a number:

<pre class="code" data-environment="none">
let num = Number("42") // becomes 42
</pre>

Convert a number to text:

<pre class="code" data-environment="none">
let text = String(42) // becomes "42"
</pre>

Apps Script often handles these conversions automatically, but it’s helpful to know how to do it yourself when needed.

### Example: Reading a Name and Writing a Greeting

This small script reads a user’s name from cell **A1** in your spreadsheet and writes a greeting like **“Hello, Jordan\!”** into cell **B1**. Go ahead and put your name into cell **A1**.

<pre class="code">
function writeGreeting() {
  // Get the active sheet
  let sheet = SpreadsheetApp.getActiveSheet()

  // Get a reference to cell A1
  let cellA1 = sheet.getRange("A1")

  // Read the user's name from cell A1
  let name = cellA1.getValue()

  // Build the greeting message
  let greeting = "Hello, " + name + "!"

  // Get a reference to cell B1
  let cellB1 = sheet.getRange("B1")

  // Write the greeting into cell B1
  cellB1.setValue(greeting)
}
</pre>

This shows how to read from and write to a single cell on a sheet. Accessing multiple cells at once is a bit more advanced and will be covered in section XXXXXXXX.

If this if the first time you are running a script that accesses data in the worksheet, you’ll have to specifically allow it, see section 4.3.3

#### How it works:

- `getRange("A1").getValue()` pulls the name from the sheet and stores it in the variable `name`.
- The script builds a new string by combining `"Hello, "` with the name.
- `setValue()` writes the final message into cell B1.

Try putting your own name in **A1**, run the script, and watch the greeting appear instantly. It’s a simple example, but it captures the essence of Apps Script: reading real data, transforming it with JavaScript, and writing meaningful results back into the spreadsheet.

### Why This Matters

Working with text and numbers is the backbone of almost every spreadsheet automation. Whether you’re:

- Cleaning up names
- Formatting labels
- Calculating totals
- Generating reports
- Building custom messages
- Processing rows of mixed data

…you’ll rely on these basic operations constantly.

Mastering how to read, combine, and transform text and numbers gives you the power to turn raw spreadsheet data into something meaningful—and sets the stage for more advanced scripting in the chapters ahead.

## Naming Conventions and Best Practices

As your scripts grow beyond a few lines, the names you choose for your variables start to matter a lot. Good naming makes your code easier to read, easier to debug, and easier to return to weeks or months later. In Apps Script—just like in any JavaScript environment—clear, consistent naming is one of the simplest ways to write code that feels clean and professional.

### Use Clear, Descriptive Names

A variable name should tell you _what the value represents_, not how it’s used or what type it is. When you read your code later, you want the meaning to be obvious at a glance.

Good examples:

- `totalSales`
- `firstName`
- `isApproved`
- `rowCount`

Less helpful examples:

- `x`
- `temp`
- `data1`
- `flag`

Descriptive names reduce mental overhead. You don’t have to remember what `x` means—you can just read the name and keep going.

### Follow JavaScript’s camelCase Style

Although other style conventions can be used in JavaScript, we will use **camelCase** for variable and function names. This means:

- The first word is lowercase
- Each following word starts with a capital letter

Examples:

<pre class="code" data-environment="none">
let customerName = "Ava"
let totalAmount = 42
let isComplete = false
</pre>

CamelCase seems to be the most commonly used naming convention across the JavaScript ecosystem, so following it helps your code feel familiar and consistent.

### Start Names With Letters, Not Numbers

Variable names must begin with a letter, underscore, or dollar sign. They cannot start with a number:

<pre class="code" data-environment="none">
let name1 = "Jordan" // valid  
let _count = 10 // valid  
let 1stValue = 5 // not valid
</pre>

Sticking to letters for most names keeps things simple.

### Avoid Abbreviations Unless They’re Obvious

Shortened names save a few keystrokes but cost clarity. Unless the abbreviation is universally understood, spell it out.

Prefer:

- `departmentTotal` over `deptTot`
- `emailAddress` over `emlAddr`

Clear code is almost always better than compact code.

### Use Boolean Names That Read Like True/False Statements

Boolean variables should sound like conditions. This makes your code easier to read when you use them in logic.

Examples:

- `customerIsActive`
- `hasPermission`
- `isComplete`
- `shouldSendEmail`

When you read a line like:

<pre class="code" data-environment="none">
if (customerIsActive) {
</pre>

…it feels natural and self‑explanatory.

### Keep a Consistent Style Across Your Script

Consistency is more important than perfection. If you choose a naming pattern, stick with it. For example:

- If you use `firstName`, don’t switch to `last_name` later
- If you name one variable `totalSales`, don’t name another `sales_total`

A consistent style makes your code feel intentional and easier to navigate.

### Why Naming Matters in Apps Script

When you start interacting with spreadsheet data, you’ll often have variables like:

<pre class="code" data-environment="none">
let sheet = SpreadsheetApp.getActiveSheet()  
let names = sheet.getRange("A2:A20").getValues()  
let total = sheet.getRange("B1").getValue()
</pre>

Clear names help you keep track of what each value represents—especially when you’re juggling multiple ranges, rows, and calculations.

Good naming is one of the simplest habits that separates messy scripts from maintainable ones. As your projects grow, you’ll be glad you invested in clarity early on.

If you’d like, we can move on to arrays and objects next, or jump into reading and writing spreadsheet data using these naming principles.
