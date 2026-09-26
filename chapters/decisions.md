---
_$_import: monaco
---

## `if`, `else if`, `else`

Programs become truly useful when they can make decisions. Instead of running the same instructions every time, your code can choose different paths depending on the situation—just like you do in everyday life. In JavaScript and Google Apps Script, the primary tool for decision‑making is the **if statement**.

Think of `if`, `else if`, and `else` as a branching path. Your program checks a condition, and based on whether it’s true or false, it decides what to do next.

### The Basic `if` Statement

An `if` statement checks a condition. If the condition is **true**, the code inside the block runs. If it’s **false**, the block is skipped.

<pre class="code"> 
let score = 85

if (score > 70) {
  console.log("You passed!")
}
</pre>

Here, the message prints only if the condition `score > 70` is true.

### Adding More Options With `else if`

Sometimes one condition isn’t enough. You may want to check multiple possibilities in order. That’s where `else if` comes in.

<pre class="code" > 
let temperature = 65

if (temperature > 80) {
  console.log("It's hot outside.")
} else if (temperature > 60) {
  console.log("It's warm outside.")
}
</pre>

The program checks the first condition. If it’s false, it moves on to check the next one. Only the block of code associated with the first condition that evaluates to “true” runs.

### Catching Everything Else With `else`

The `else` block runs when none of the previous conditions evaluate to true. It’s your “fallback” option.

<pre class="code" > 
let temperature = 45

if (temperature > 80) {
  console.log("It's hot outside.")
} else if (temperature > 60) {
  console.log("It's warm outside.")
} else {
  console.log("It's cold outside.")
}
</pre>

This structure ensures that exactly one message prints, no matter what the temperature is.

### How This Applies in Apps Script

Decision‑making becomes especially powerful when you’re working with spreadsheet data. For example, you might:

- Check whether a cell is empty
- Decide whether a value meets a threshold
- Categorize data into groups
- Trigger different actions based on user input

Here’s a simple example that reads a number from cell A1 and writes a message into B1 based on the value:

<pre class="code"> 
function checkValue() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let value = sheet.getRange("A1").getValue()


  if (value > 100) {
    sheet.getRange("B1").setValue("High")
  } else if (value > 50) {
    sheet.getRange("B1").setValue("Medium")
  } else {
    sheet.getRange("B1").setValue("Low")
  }
}
</pre>

This is the heart of automation: your script looks at real data and responds intelligently.

### Why `if` Statements Matter

With `if`, `else if`, and `else`, your programs stop being static and start becoming _smart_. They can:

- React to changing data
- Choose between multiple actions
- Validate input
- Control the flow of your script
- Make your spreadsheet tools feel dynamic and responsive

These decision‑making tools are the foundation for everything from simple checks to complex logic. In the next sections, you’ll learn how to combine conditions, compare values, and build more sophisticated decision structures that bring your Apps Script projects to life.

<button onclick="makePrompt({types:['quiz','review','examples']})">Make Prompt</button>

## Comparison and Logical Operators

Decision‑making in JavaScript depends on evaluating conditions—questions your program asks to decide what to do next. To express those questions, you use **comparison operators** and **logical operators**. These tools let your code compare values, combine conditions, and determine whether something is true or false. Once you understand them, your `if` statements become far more powerful and expressive.

### Comparison Operators

Comparison operators check how two values relate to each other. They always produce a **boolean** result: either `true` or `false`.

Here are the most common ones:

| Operator | Meaning                  | Example                     | Result             |
| -------- | ------------------------ | --------------------------- | ------------------ |
| `===`    | equal to (strict)        | `5 === 5 4 === 5 "5" === 5` | `true false false` |
| `!==`    | not equal to (strict)    | `5 !== 5 4 !== 5 "5" !== 5` | `false true true`  |
| `==`     | equal to (loose)         | `5 == 5 4 == 5 "5" == 5`    | `true false true`  |
| `!=`     | not equal to (loose)     | `5 != 5 4 != 5 "5" != 5`    | `false true false` |
| `>`      | greater than             | `10 > 7`                    | `true`             |
| `<`      | less than                | `3 < 1`                     | `false`            |
| `>=`     | greater than or equal to | `8 >= 8`                    | `true`             |
| `<=`     | less than or equal to    | `4 <= 2`                    | `false`            |

The **strict** operators (`===` and `!==`) are generally recommended over the **loose** operators (`==` and `!=`) because they compare both value _and_ type. They help you avoid subtle bugs.

Example:

<pre class="code"> 
let age = 18

if (age >= 18) {
  console.log("You can vote.")
}else{
  console.log("You are not old enough to vote.")
}
</pre>

### Logical Operators

Logical operators let you combine multiple conditions or invert a condition. They’re essential when your program needs to check more than one thing at a time.

#### AND (`&&`)

The entire expression is true only if both conditions are true.

<pre class="code" data-environment="none"> 
if (score > 80 && isComplete) {
  console.log("Great job!")
}
</pre>

#### OR (`||`)

The entire expression is true if either condition is true.

<pre class="code" data-environment="none"> 
if (day === "Saturday" || day === "Sunday") {
  console.log("It's the weekend!") 
}
</pre>

#### NOT (`!`)

Flips a boolean value.

<pre class="code" data-environment="none"> 
if (!isActive) {
  console.log("The account is inactive.")
}
</pre>

Logical operators let you express more nuanced decisions, especially when working with real data from a spreadsheet.

### Using Operators With Spreadsheet Data

Apps Script is often used to read values from cells and evaluate them. For example:

<pre class="code" data-environment="none"> 
function categorizeScore() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let cellA1 = sheet.getRange("A1")
  let score = cellA1.getValue()
  let cellB1 = sheet.getRange("B1")


  if (score >= 90) {
    cellB1 .setValue("Excellent")
  } else if (score >= 70 && score < 90) {
    cellB1 .setValue("Good")
  } else {
    cellB1 .setValue("Needs Improvement")
  }
}
</pre>

Here you see comparison operators (`>=`, `<`) and a logical operator (`&&`) working together to classify the score.

### Why These Operators Matter

Comparison and logical operators are the backbone of decision‑making. They allow your scripts to:

- Validate input
- Categorize data
- Check multiple conditions at once
- Control the flow of your program
- Respond intelligently to spreadsheet values

Once you’re comfortable with these operators, you’ll be able to write much more expressive and flexible logic, turning your Apps Script projects into tools that adapt to whatever data they encounter.

## Real‑World Examples of Decision‑Making in Apps Script
