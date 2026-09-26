---
_$_import: monaco
---

## Why Loops Matter

When you’re working with Google Sheets, you rarely want to perform an action just once. More often, you want to repeat something many times:

- Check every value in a list
- Process each row in a dataset
- Build a new array from an existing one
- Apply the same rule to a whole column

Doing this manually—one step at a time—would be slow and error‑prone. Doing it in code without loops would be even worse, because you’d have to write the same line over and over again.

Loops solve this problem by letting your script repeat an action automatically. Instead of writing the same instruction dozens or hundreds of times, you write it once and let the loop handle the repetition.

### Loops Let You Work at Scale

Imagine you have an array of 500 names. Without loops, you’d need 500 separate lines of code to process them. With loops, you can handle all 500 with a single, compact structure.

This is why loops are essential for spreadsheet automation: they let your script move through data the way your eyes move down a column.

### Loops and Arrays Go Hand in Hand

Loops become especially powerful when combined with arrays. Arrays give you a collection of values; loops give you a way to visit each value in turn. Together, they form the backbone of almost every real‑world Apps Script project.

### What You’ll Learn in This Chapter

In the sections ahead, you’ll explore:

- The basic structure of a loop
- How to repeat an action a specific number of times
- How to move through the items in an array
- How to stop a loop early or skip certain values
- How to apply loops to real spreadsheet tasks

By the end of this chapter, you’ll be able to write scripts that handle entire lists, columns, and datasets with ease. Loops are one of the biggest leaps in programming power you’ll make — and once you understand them, your automations will feel dramatically more capable.

## The `while` Loop

A `while` loop is the simplest kind of loop in JavaScript. It repeats an action **as long as a condition remains true**. You can think of it as a way of saying:

“Keep doing this until something changes.”

This makes the `while` loop perfect for situations where you don’t know in advance how many times something needs to happen. Instead of repeating a task a fixed number of times, a `while` loop repeats based on a **condition**.

### How a `while` Loop Works

A `while` loop has two parts:

1. A **condition** that JavaScript checks
2. A **block of code** that runs if the condition is true

The structure looks like this:

<pre class="code" data-environment="none">
while (condition) {
  // code that runs repeatedly
}
</pre>

As long as the condition evaluates to `true`, the code inside the braces keeps running.

### 7.2.2 A Simple Example

Here’s a small example that counts upward until a limit is reached:

<pre class="code">
function incrementShorthandNotation(){
  let x=0
  while(x < 5){
    x = x + 1
    console.log(x)
  }
  console.log("The loop is done.")
}
</pre>

This loop logs the numbers 1 through 5\. Once `x` becomes 5, the condition `x < 5` becomes false, and the loop ends, allowing execution to proceed to the statement following the loop. Here’s the output:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhHJawZZt24My53F3kwDeBIQ42nDQ9HwS4v_UqSwSNcyFwtL4Cr9uLVWZCaEx6HjA6ETSgGeQarAVTb2CzbhAkfZETcIlnID9IzG6CMa31maiPR6HsyawjgXFM0oj_gK91paNUfp7t5uGNqIyG3nvlVdXMb-bkaKxhmzcqxmowzI3mQjnKWezBtuz1kJTk/s1600/d1108ce2.png)

### Shorthand Increment Notation

Because incrementing a variable's value by one is such a common operation, JavaScript has a shorthand notation to accomplish it. It’s called the increment operator. To use it, the statement is simply the variable name preceded by two plus signs: \++x .

Here is the prior example adjusted to the increment operator:

<pre class="code">
function incrementShorthandNotation_2(){
  let x=0
  while(x < 5){
    ++x
    console.log(x)
  }
  console.log("The loop is done.")
}
</pre>

This does not change how the code executes, so the output will be the same as the prior example. However, the increment operator allows us to increase the value of the variable within a statement that uses the variable’s value. So, we can combine the statements that increment the value of the variable with the statement that logs its value to the console as follows:

<pre class="code" >
function incrementShorthandNotation_2(){
  let x=0
  while(x < 5){
    console.log(++x)
  }	
  console.log("The loop is done.")
}
</pre>

Again, this modification will not change the output of the function because the “++” increments the value _before_ it has been used in the “console.log” statement. However, it is possible to use the increment operator to modify a variable’s value _after_ it is used in the statement. To accomplish this, we just put the “++” after the variable name as follows: x++ . When we use the operator in this way, it is called “post-incrementing.” Of course, using the increment operator before a variable is called “pre-incrementing.” If we modify the prior example to post-increment the variable, it will change the output.

<pre class="code">
function incrementShorthandNotation_2(){
  let x=0
  while(x < 5){
    console.log(x++)
  }
  console.log("The loop is done.")
}
</pre>

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2tUudYhDgpe-LMtDjy-htT9-41NX4q7hzJjY_mRuR5gWYjVv7rZfAAf6ApJn7WyzTsMdS0BPjORZFA8ngtK_ysDcisxFckFtGE-ywXJsje-ntouE-r8aZzHoybPpHO0TZWvRypTb3tQE-AuKNrCeQRxk2GlSQOtAvepSVNstvytbmoqEY0uWQ2q9wZuw/s1600/65148d9d.png)

Here, we see that the value of x is changed after it is displayed, so the logged values are 0-4 instead of 1-5.

So far, we have not decreased a variable’s value. It should come as no surprise that it is very similar to increasing. Here’s a statement to reduce the value of x by one: <pre class="code" data-environment="none">x = x - 1</pre> and we can use a similar shorthand, decrement operator ( <pre class="code" data-environment="none">x--</pre> or <pre class="code" data-environment="none">--x</pre> )in exactly the same way as the increment operator. The increment and decrement operators only increase or decrease a variable's value by one. If you want to change it by a different value, you must use the longhand form.

### Why the Condition Matters

A `while` loop continues until its condition becomes false. That means **you must make sure something inside the loop eventually changes the condition**. If not, the loop will run forever, which is called an _infinite loop_.

For example, this loop never ends:

<pre class="code" data-environment="none">
while (true) {  
 // This will run forever  
}
</pre>

And this one never ends because `count` never changes:

<pre class="code">
let count = 1


while (count <= 5) {
  console.log(count)   // count stays 1 forever
}
</pre>

You’ll learn more about avoiding infinite loops later in the chapter, but the key idea is simple: **the loop must move toward a stopping point**.

Here’s a clean, focused example that does exactly what you asked:

- Read **all** the data from the sheet at once
- Store it in an **array of arrays**
- Use a **while loop** to move across that array
- Log the **first value** of each row
- Use `let` for all variable declarations

## Example: Using a `while` Loop to Process data in a Sheet

Let’s begin by getting some data to work with. Run this code to build a set of data for this example to use.

Note: This code will replace any data you have on the active sheet of your spreadsheet, so be careful.

<pre class="code" data-environment="none">
function writeDataToActiveSheet() {
  data= [
  ['First Name', 'Last Name', 'Birthdate', 'Death Date', 'Birthplace'],
  ['George', 'Washington', 'February 22, 1732', 'December 14, 1799', 'Westmoreland County, VA'],
  ['John', 'Adams', 'October 30, 1735', 'July 4, 1826', 'Quincy, MA'],
  ['Thomas', 'Jefferson', 'April 13, 1743', 'July 4, 1826', 'Albemarle County, VA'],
  ['Benjamin', 'Franklin', 'January 17, 1706', 'April 17, 1790', 'Boston, MA'],
  ['Alexander', 'Hamilton', 'January 11, 1755', 'July 12, 1804', 'Charlestown, Nevis'],
  ['James', 'Madison', 'March 16, 1751', 'June 28, 1836', 'Port Conway, VA'],
  ['John', 'Jay', 'December 12, 1745', 'May 17, 1829', 'New York City, NY'],
  ['Samuel', 'Adams', 'September 27, 1722', 'October 2, 1803', 'Boston, MA'],
  ['Patrick', 'Henry', 'May 29, 1736', 'June 6, 1799', 'Studley, VA'],
  ['George', 'Mason', 'December 11, 1725', 'October 7, 1792', 'Fairfax County, VA']
]
  const sheet = SpreadsheetApp.getActiveSheet()  
  const range = sheet.getRange(1, 1, data.length, data[0].length)
  range.setValues(data)


  // Set the number format to plain text 
  //(the "@" symbol signifies plain text)
  //this will make the data easier for you to read later on
  sheet.getRange("C2:D11").setNumberFormat("@")
}
</pre>

Once you have activated a sheet with no data on it, execute the `writeDataToActiveSheet` function. This should give you a sheet that looks as follows:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJxKNMOB1Z3MT3_oO6d6sY7yrTdpqpDF7WX-6fvG0LKqI0_rVgv0oCTxWXLnD1m3DYOPD8e-FLB5YprJYMWIssTEbtLnwEn849XdzOkFfk2BkBJbAZnOGjQ3CZQ5Q8_SsaS6lhdjKQLdgguiHDsQDLv2mFnGbhmWD11or58LKtxQVPB-8tmt6FYdE75vA/s1600/61eb4adf.png)

With this data in place. We are ready to build an example to read the data from the sheet and log the first and last names. Let’s start with an empty function.

<pre class="code" data-environment="none">
function logFirstValues() {  
}
</pre>

Now let’s add the code to pull the information out of the Google Sheet and into the memory of our program.

<pre class="code" data-environment="none">
function logFirstValues() {

  // get a reference to the active sheet of the spreadsheet
  let sheet = SpreadsheetApp.getActiveSheet()

   // Read all rows and columns in the data range
  let data = sheet.getDataRange().getValues()


  // Print all the data
  console.log('All Data:', data)
}
</pre>

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUDT1I6IQbO06PD_4qxOfRXcOhm1GWywIS13PnYEHX2Ssc0xzMid7wivILoDZbg5YLiNGD3_-7R9Cp57Z7Mkkz4NOPTjmiBKerAYhLo8ko6TAu6_-uLRbBYvlI2yxgSi0AEj27MGhVj0DbO2nO9YgOx2T8KXeiAiwGDd3Q7j4L4yR6mJKqYan6zKOkRWU/s1600/a766976b.png)

Now, instead of printing all of the data as an array of arrays, let’s print each row of data separately.

<pre class="code" data-environment="none">
function logFirstValues() {

  let sheet = SpreadsheetApp.getActiveSheet()
  let data = sheet.getDataRange().getValues()

  // Print each row of the data
  console.log('row', 1, data[0])
  console.log('row', 2, data[1])
  console.log('row', 3, data[2])
  console.log('row', 4, data[3])
  console.log('row', 5, data[4])
  console.log('row', 6, data[5])
  console.log('row', 7, data[6])
  console.log('row', 8, data[7])
  console.log('row', 9, data[8])
  console.log('row', 10, data[9])
  console.log('row', 11, data[10])
}
</pre>

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSGBsEAKJBQRzH_OvYGFDxQ8JeFbUGGk7TKHvF5_676P0F1OkEK41uGwa2v7OLPY19fDZVzAv4Mm3r26jX2FtYYMcPyt0RUlc0-Wyt3pkCePbVPkj9Qap2waSGcPmiPEReDP_6ho-p2LvR3-msYznDHL52CNKCNZOllIzMKiQPSmGn1E7a0VIilqCnPDo/s1600/a468c47f.png)

With a table that only has one header and ten rows of data, this is not terrible, however, if you wanted to change this code to display the first name instead of the whole row, you would need to then change all 11 rows of code. Let’s use a loop to print the data instead.

The “while” loop requires a condition to control when the interpreter should exit the loop. For now, we’ll just use the boolean value “true” to control the loop. This will result in an endless loop; we’ll fix that later. For now, we are focusing on how to manipulate a variable to access a different part of the array with each iteration of the loop. To do this, we will create a variable, give it an initial value and change its value in the loop.

<pre class="code" data-environment="none">
function logFirstValues() {

  let sheet = SpreadsheetApp.getActiveSheet()
  let data = sheet.getDataRange().getValues()

  // Print each row of the data
  let index = 0
  while(true){  
    console.log('row', index+1, data[index])
    index++             //  increase the value held in the index 
                  //  variable at the end of each iteration
  }
}
</pre>

If you choose to run this example, the interpreter will print the data from the spreadsheet and then keep printing “row” followed by the increasing value of the “index” variable. For “data\[index\]”, it will display “undefined” because it is trying to access an element of the array that does not exist:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiofzx4p1lCBH3Z5ogrdQtcYtFBexG_K9ffwXfWNdsw8mbhPjFkisHsQeejMhMWsCUIPWt2lTJ9s0wXCXtqEOH3t3BK85DV1mtWjvFiYal8mUu7bsVArfy-dXr6JlMv6a-b9EFiZwr5xme0JUfDxS43oKGypQtIz6Xrl5rMS4YIu9tEmPy9xzYcqPRv2Ko/s1600/a541c20b.png)

To stop the code from executing, just click the “Stop” button as seen here:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhetjYxBsq4CPiJvofdjjfpdETb3n-EUdwVaf6eAtmGN18WypD6LzPUbuaNcJbgZtUtIkukrzHqcz68UsBAA5vg2I4WrfVlCPqd3CWptRo1wvJ6TfAovR8OI4i0dZAsz8TqkyR-1t4uc4ZpaXsFEv4Bq_xPIEv1bM2HaAjZsjbzr9ZtwYXg8x3vHduhrkE/s1600/93e97e8f.png)  
To make this loop end once it has displayed all data from the array, we’ll change the control condition from “true” to a condition that evaluates to “true” while accessing data and switches to “false” when there is not more data to access as seen here:

<pre class="code" data-environment="none">
function logFirstValues() {

  let sheet = SpreadsheetApp.getActiveSheet()
  let data = sheet.getDataRange().getValues()

  // Print each row of the data
  let index = 0
  while(index < data.length){  
    console.log('row', index+1, data[index])
    index++                   
  }
}
</pre>

Here is a partial output of from the code above:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhwQhDYUpx3YxxxyQXhuQcHGnfkZucPMChMeNaOIYgGXNEqokuChyphenhypheni47jQbjyY2sC_qqLEugRD1ggwHZFkcZT0P8L2X8ym5Ua3fwmmIXIi5PqBfJD6cai04RghPZSjq7_lNnoGPODU10fjrBqwvdFrvypmzO5WmLcYV57IdV_ieufYKMX341QMGou1ebFk/s1600/5541c86b.png)  
On the first iteration of the loop, the variable named “index” holds a value of 0 and the “data.length” evaluates to 11\. So, the condition evaluates to true because zero is less than 11\. As “index” increases with each iteration, the control condition remains true as “index” equals 1, 2, and 3…all the way to when “index” equals 10\. However, once the value in the “index” variable equals 11, the statement is 11\<11, which is a false statement. Because the control condition has become false, the interpreter discontinues the loop and moves on to process any statements that follow the loop. In this case, there are no more statements to process, so the function ends.

Let’s add another parameter for our loop. The “index” will be used to keep track of what element of the array “data” the loop is on, and the “numberOfRows” variable the value of the number of elements in the “data” variable, which correlates to the number of rows in the Sheet. As you’ve just seen above, “numberOfRows \= data.length” will be 11\.

Now, if we want to change what is displayed, we need only modify one line of code. To make this code display just the last name and the death date, we can modify the code as follow:

<pre class="code" data-environment="none">
function logFirstValues() {

  let sheet = SpreadsheetApp.getActiveSheet()
  let data = sheet.getDataRange().getValues()

  // Print each row of the data
  let index = 0
  while(index < data.length){  
    console.log('row', index+1, data[index][1], data[index][3])
    index++                   
  }
}
</pre>

Now, instead of printing the whole array that represents each row, we are isolating just two values of the array, the last name and the death date, as seen here:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhq-GEXiaAxtRooBEFeuONztgYsVTq7TEykqhVW4WG0lSLYPMZcAnxFJLUodyHUylqZe9awFbaTYW2I2iHW1niKWRD5souDy9jo0bhyOUqVkswO48-aZHdxeAAjPf0yOO9-PoOawJo15h1LvfAFc0z5WfAgD5qoQy1Gvf60MzEHDtY07OSGZlN8_xQhvo8/s1600/427976a9.png)

To conclude this example, let's introduce one change to make the code more readable. In the expression “data\[index\]\[1\]” we are identifying an element of an array that is itself an element of  
an array. To improve readability, let’s add a variable at the beginning of the loop to hold one row’s data, then use that variable to access individual columns from the row as seen here:

<pre class="code" data-environment="none">
function logFirstValues() {

  let sheet = SpreadsheetApp.getActiveSheet()
  let data = sheet.getDataRange().getValues()

  // Print each row of the data
  let index = 0
  while(index < data.length){  
    let values = data[index]
    console.log('row', index+1, values[1], values[3])
    index++                   
  }
}
</pre>

Here, the variable named “values” holds the array of values from one row at a time, so the expression “values\[0\]” refers to the first name of any given row, and “values\[1\]” refers to the last name, etc.

The While loop relies on a single condition to control how many times it executes its code: It examines the condition just before it begins each iteration. If the condition is true, it executes the code in the loop. To use this kind of loop to effectively process each value in an array, we need three bits of code:

- A variable to keep track of which element of the array are examining in each iteration of loop: <pre class="code" data-environment="none">let index = 0</pre>
- A statement to increment the value in the variable each time the code in the loop executes: <pre class="code" data-environment="none">index++</pre>
- The condition that evaluates to True as long as we have data to process and switches to False when we are out of data: <pre class="code" data-environment="none">index < data.length</pre>

Although there are many other approaches to designing a while loop to accomplish different tasks, this one is so common that there is another kind of loop in JavaScript that is specifically designed to work with these three control elements. It’s called the “For” loop

## The `for` Loop

Let’s begin our discussion of the For loop by examining a simplified version of our most recent example of the While loop:

<pre class="code" data-environment="none">
function logFirstValues() {

  let data = ["George", "John", "Thomas", "James", "Samuel"]

  let index = 0

  while(index < data.length){  
    console.log(index,data[index])
    index++                   
  }

}
</pre>

This loop iterates over the values in the “data” array and logs the following:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhNy7zUl9b5JAxyJBF5nqEqKmMmz8NNyNKoWGHm0TEZDYpiqCPzC-A4iLjkgEUjDVSNCL9F3tgn7i7rUR1Me7jQJJYdAo5XK4Kug1sQhLPlmWRalUM0yYA7u3X_r6tvypHPyOh6tFdyWNoFJ3DCkX-EIStyK5GXzLL91YVBmPQ_P35OeqtzGzcX7XXGOY4/s1600/f512ac8a.png)

Let’s review and name the three control elements that manage the execution of the loop:

1. **The Initialization Statement:** <pre class="code" data-environment="none">let index = 0</pre>  
   This statement executes only once in this example because it precedes the loop entirely, so it is not a _part_ of the loop.

2. **The Control Condition:** <pre class="code" data-environment="none">index < data.length</pre>  
   This condition is evaluated before the first execution of the code in the loop’s body and is evaluated again prior to each subsequent execution of the loop’s body to determine if it is time to exit the loop

3. **The Increment Statement:** <pre class="code" data-environment="none">index++</pre>  
   This statement is inside the body of the loop, so it will run for each iteration of the loop.

Let’s rewrite the example using the For loop with the minimum number of changes to get it working, Then we’ll adjust it to the standard format in which a For loop is written.

<pre class="code" data-environment="none">
function logFirstValues() {

  let data = ["George", "John", "Thomas", "James", "Samuel"]

  let index = 0

  for(      ; index < data.length;      ){  
    console.log(index,data[index])
    index++                   
  }

}

</pre>

All we have done here is change the keyword “while” to the keyword “for” and put semicolons before and after the control condition. This code executes exactly the same as the prior example.

Because the For loop _requires_ all three of the control structures in this example, it has a place built into its syntax to accept them. The added semicolons delineate the three control elements for the For loop as follows: initialization statement; control condition; increment statement , as seen here:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1OqKb_r2zZxB-lT5SBKz1NFDOYyy5ySriWKNBQ3frJC5jbx4WrxjW4WqM1ITZef1qzYf-ax3IhzMEFJrr3u97lcPS_zCmwlqvHarBt5wNn0CuAQbcuH8NkfmmbZ_NFgV9bd8zFJ6rujrbbp5N4Zg0D1TdDQ3Glff6BFzvqdOZYnlies74cZs2P6X57Xc/s1600/96d2d8c7.png)

Here is the resulting For loop written in the standard format:

<pre class="code">
function logFirstValues() {

  let data = ["George", "John", "Thomas", "James", "Samuel"]

  for(let index = 0; index < data.length; index++){  
    console.log(index,data[index])                  
  }
}
</pre>

The important point to recognize here is that making this change does not change the order of execution. Each of the three preceding examples executes exactly the same because they are logically equivalent.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEig49ZuYFrJ8G_ij22PPkXerxv4kgmj_YFb6LaSY5QDWt0i-K99qlQaURqB3BEFFTlSZ2oP0Ujw-r3Zl8bEX7JyESy7xHYirEzYruEOE4y7uSlsShxCTSsZaBPP6PYutgM8WA7wM8CdJ_23-Ioh1sKA5A0w86p2uHKp5uXP5XGdQd6tkYB4i5_Tni2nN5o/s1600/59a163dd.png)

A reasonable student might ask, “if they are exactly the same, why do we need them both?” The answer is simple. All computer programming languages strike a balance between the complexity of the language itself and the simplicity of the programs that can be written using the language. In this case, the designers of JavaScript felt that because this kind of control structure was so common that it was worth adding a type of loop that expressly requires these three control elements and places them where they are reality accessible to a human reader, making the code easier to understand.

In this example of the For loop, we are beginning a variable at specified value (0) and adding a value to it (1) with each iteration of the loop. As we begin each iteration of the loop we check the control condition and only continue the loop if it evaluates to True. This is the most common use of the for loop, to move an integer across a specified range. However, the control structures need not deal only with integers, or numbers. Here’s an example that

The `for` loop is one of the most common and useful loop types in JavaScript. Unlike a `while` loop—which repeats until a condition changes—a `for` loop is ideal when you **know exactly how many times** you want something to repeat. This makes it perfect for working with arrays, because arrays always know their own length.

A `for` loop gives you a clean, predictable way to move through each item in an array, one step at a time.

### How a `for` Loop Works

A `for` loop has three parts:

<pre class="code" data-environment="none">
function forLoopOfStrings() {

  for (start; condition; step) {
    // code that runs each time
  }
}
</pre>

- **start** — where the loop begins
- **condition** — how long the loop should keep going
- **step** — what happens after each repetition

A simple example:

<pre class="code">
function forLoopOfStrings() {

  for (let index = 0; index  < 5; index++) {
    console.log(index)
  }
}
</pre>

This logs the numbers 0 through 4\.

This loop simplifies the code in that it places the three parts of the loop’s control mechanism together where they are readily accessible to a human reader. However, it makes the code a bit more confusing for beginning programmers because the order in which these statements execute i

In this example, notice that the “start” statement ( let index \= 0;) is executed only once: when the interpreter begins the loop.

### Example: Using a For loop to access data in an array

Let’s modify this loop to display elements from an array of string values.

<pre class="code">
function forLoopOfStrings() {
  
  let data = ["George", "Abigail", "Thomas", "Martha", "Penelope"]
  
  for (let index = 0; index < 5; index++) {
    console.log(index, data[index])
  }
}
</pre>

In this example we have added an array called “data” and we are using the loop to log each of the values.

### Example: Accessing Sheet Data with a `for` Loop

Let’s write a `For` loop that logs the **first and last name** of each person in the dataset we used for our While Loop example.

<pre class="code" data-environment="none">
function logNames() {
  let sheet = SpreadsheetApp.getActiveSheet()
  let data = sheet.getDataRange().getValues()

  // Start at index 1 to skip the header row
  for (let rowIndex = 1; i < data.length; rowIndex++) {
    let row = data[rowIndex]     // the current row (an array)
    let first = row[0]           // first name
    let last = row[1]            // last name

    console.log(first + " " + last)
  }
}
</pre>

### How This Works

- `rowIndex = 1` Starting at 1 instead of 0 skips the header row
- `rowIndex < data.length` ensures we stop after the last row
- `rowIndex++` moves to the next row each time
- `row` becomes the current inner array
- `row[0]` and `row[1]` give us the first and last names

This pattern—looping through an array and working with each row—is one of the most common tasks for Apps Script in Google Sheets.
