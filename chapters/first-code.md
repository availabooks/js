---
_$_import: monaco
---

## Writing and Running Simple Statements

Before you can build programs that make decisions, loop through data, or interact with the world, you need to get comfortable with one of the most fundamental building blocks of all: the **expression**. An expression is any piece of code that the computer evaluates to produce a specific value. It might be a simple number, a piece of text, or a complex calculation. Think of expressions as the meaningful phrases or ingredients that provide the "data" for your code.

In JavaScript, expressions are everywhere:

- A simple number like `25` is an expression.

- A calculation like `5 + 7` is an expression that evaluates to `12`.

- A piece of text in quotes, like `"Hello, world!"`, is an expression.

While expressions represent values, they need to be wrapped into **statements**—the full "sentences" or instructions that tell the computer to take an action with those values.

### From Value to Action

An expression on its own is like a thought that hasn't been spoken aloud. For example, the text `"Hello, world!"` is an expression; it represents a specific piece of data. However, just writing that text doesn't tell the computer what to do with it.

To make it an instruction, you use a statement like `console.log()`.

In this line, `"Hello, world!"` is the **expression** (the value), and the entire line is the **statement** (the instruction to print that value). The statement takes the "ingredient" and carries out a clear command.

In JavaScript, a simple statement might look like this:

<!-- <pre class="code" data-environment="html">
&lt;h1&gt;Hello world&lt;/h1&gt;
</pre> -->

<pre class="code">
console.log("Hello, world!") 
</pre>

<pre class="code">
console.log("Hello, world!") //this is a statement
//“Hello, world!”  is just the expression
</pre>

This line tells the computer to print a message. That’s it. One instruction, one action. But this tiny example captures the essence of programming: you write a clear command, and the computer carries it out exactly.

### What Makes a Statement “Simple”

A simple statement usually does one thing:

- Display a value
- Assign a variable
- Call a function

For example:

<pre class="code">
console.log(5 + 7) // “5+7” is the expression
                   // “console.log()” is added around it to 
			             //turn it into a statement that displays the sum of 5+7
</pre>

This calculates a number, though it doesn’t show the result anywhere. Or:

<pre class="code" >
let name = "Ava"
</pre>

This stores a piece of information for later use. Each of these lines is a complete thought, expressed in code.

### Running Your First Statements

You can run simple statements in several environments, but the easiest place to start is the **browser console**. Open your browser’s developer tools, switch to the Console tab, and type:\<-(Note: the console in browser will echo expressions back to you, so sometimes you can see an expression.)

Run these code blocks below, the first two won’t show anything because they are both just expressions. But you can turn them into statements by wrapping them in console.log()

<pre class="code">
2 + 3
</pre>

<pre class="code">
"JavaScript is fun!"
</pre>

This is a true, simple statement:

<pre class="code">
console.log(10 * 10)
</pre>

<pre class="code">
let x = 42
x
</pre>

Line one is a simple statement, it is telling the computer to assign the value 42 to the variable x, but line two is just an expression of the variable x. When the computer processes that line it can tell that x is 42, but the computer doesn’t know what to do with the information.

You can tell the computer what to do with the expression by turning line 2 into a statement.

<pre class="code">
let x = 42
console.log(x)
</pre>

Each statement runs immediately, giving you instant feedback. This rapid loop—write, run, observe—is one of the best ways to learn.

### Ending Statements

Most JavaScript statements end with a semicolon. Technically, JavaScript can often figure out where a statement ends even if you leave the semicolon out, but using them consistently makes your code clearer and avoids subtle bugs. Think of semicolons as punctuation that helps the computer read your instructions cleanly.

If you look at JavaScript code online, you will often see a semicolon (`;`) at the end of every line. In this book, however, we will **not** be using them.

Modern JavaScript has a feature called **Automatic Semicolon Insertion**. This means the computer is smart enough to see your line breaks and understand where one instruction ends, and the next begins without needing a piece of punctuation to tell it so.

We are skipping semicolons for two main reasons:

- **Reducing Mental Strain**: Learning to program involves keeping track of many new rules. Forcing yourself to remember a semicolon at the end of every line adds an extra layer of "mental overhead" that doesn't actually help you learn the logic of the code.
- **Cleaner Look**: Many modern developers prefer the clean, minimalist look of code without semicolons. It allows you to focus on the action—the words and symbols—rather than the punctuation.

While you may eventually work on projects where semicolons are the established norm, for your journey through this book, we will keep things simple and focus on the instructions themselves.

### Why Simple Statements Matter

It’s tempting to rush ahead to bigger, more exciting programs, but mastering simple statements is essential. They’re the foundation for everything else you’ll write. Even the most complex applications are built from thousands of small, clear instructions just like these.

As you continue through this book, you’ll combine simple statements into larger structures—functions, loops, conditionals, and full programs. But it all starts here: one line of code, one action, one step toward thinking like a programmer.

## `console.log()` and Basic Output

Before you can build anything meaningful in JavaScript, you need a way to _see_ what your code is doing. That’s where `console.log()` comes in. It’s one of the simplest tools in the language, yet you’ll use it constantly—whether you’re just starting out or working on complex applications years from now.

`console.log()` sends a message to the console, a built‑in panel in your browser or development environment where JavaScript can display information. Think of it as your program’s voice. Whenever you want to check a value, confirm that a piece of code is running, or understand what’s happening inside your program, you log it.

A basic example looks like this:

<pre class="code">
console.log("Hello, JavaScript!")
</pre>

When you run this line, the message appears in the console. It’s simple, but it’s the foundation of how you’ll observe and understand your code.

### Why `console.log()` Matters

At first glance, logging might seem trivial, but it plays several important roles:

- **Seeing results**: You can display numbers, text, variables, or calculations.
- **Debugging**: When something isn’t working, logging helps you trace the problem.
- **Understanding flow**: You can log messages to see which parts of your program run and in what order.
- **Learning**: As a beginner, logging is your window into how JavaScript behaves.

It’s not an exaggeration to say that `console.log()` is one of the most important tools you’ll use while learning.

### Logging Different Kinds of Values

You can log almost anything:

<pre class="code">
console.log(42) // numbers
console.log("Learning JS") // strings
console.log(true) // booleans
console.log(5 + 7) // expressions
</pre>

Note: Any text following a “//” will be completely ignored by the Apps Script interpreter, this text is called a comment. You can use a comment to make a note of what a specific line of code does, record your thought process, or even disable sections of code that you don’t want to run but also don’t want to delete.

You can also log multiple values at once:

<pre class="code">
console.log("The total is:", 5 + 7)
</pre>

The console will print both the text and the result, making it easy to understand what’s happening.

### Using the Console in Your Browser

To try this out:

1. Open your browser.
2. Right‑click anywhere and choose **Inspect** or **Developer Tools**.
3. Click the **Console** tab.
4. Type a line like:

<pre class="code">
console.log("Testing output")
</pre>

5. Press Enter.

You’ll see the message appear immediately. This instant feedback loop is one of the best ways to experiment and build confidence.

### Output Isn’t Just for Beginners

Even experienced developers rely on logging. It’s a quick, flexible way to understand what your code is doing without setting up complex tools. As your programs grow, you’ll learn more advanced debugging techniques, but `console.log()` will always remain part of your toolkit.

For now, think of it as your first and most reliable way to communicate with your program. Every time you wonder “What’s going on here?”, a well‑placed `console.log()` can give you the answer.

## Understanding Errors and Debugging Early

Every programmer—beginner or expert—runs into errors. In fact, encountering errors is not a sign that you’re doing something wrong; it’s a sign that you’re _programming_. Errors are simply the computer’s way of telling you, “I tried to follow your instructions, but something didn’t quite make sense.” Learning to understand and fix these messages early on will make you a far more confident and capable coder.

### Errors Are Part of the Process

When you’re learning a new language, you expect to stumble over grammar or vocabulary. Learning a programming language is no different. You’ll misspell a variable name, forget a parenthesis, or use a feature incorrectly. Instead of getting frustrated, treat errors as feedback. They point you directly to what needs attention.

A typical JavaScript error might look like this:

<pre class="code" data-environment="message">
Uncaught ReferenceError: myVariable is not defined
</pre>

It may seem intimidating at first, but with practice you’ll learn to read these messages like clues in a puzzle.

### Types of Errors You’ll See

Most beginner errors fall into a few categories:

- **Syntax errors**: You wrote something the computer can’t parse—missing brackets, stray characters, or incorrect punctuation.
- **Reference errors**: You tried to use a variable or function that doesn’t exist (or isn’t spelled the way you think).
- **Type errors**: You attempted an operation that doesn’t make sense, like calling something that isn’t a function.
- **Logic errors**: The code runs, but it doesn’t do what you intended. These are trickier because the computer doesn’t complain—you just get the wrong result.

Understanding which category you’re dealing with helps you narrow down the fix.

### Reading Error Messages

Error messages often feel cryptic at first, but they’re surprisingly helpful once you know how to interpret them. They usually tell you:

- **What went wrong**
- **Where it happened** (a line number or file)
- **Why the computer couldn’t continue**

For example:

<pre class="code" data-environment="message">
Uncaught SyntaxError: Unexpected token '}'
</pre>

This tells you the computer found a closing brace it wasn’t expecting—usually a sign that something earlier in the code is missing.

### Debugging: Your First Toolkit

Debugging is the process of finding and fixing problems in your code. Early on, you’ll rely on a few simple but powerful techniques:

- **Use `console.log()`** to check values and confirm your code is running where you expect.
- **Read error messages slowly**, one piece at a time.
- **Check for typos**, especially in variable names.
- **Comment out sections of code** to isolate the problem.
- **Test small pieces** before combining them into something bigger.

These habits will save you hours of frustration and help you build a strong foundation.

### Debugging Builds Understanding

Fixing errors isn’t just about making your code work—it’s how you learn. Each time you track down a bug, you deepen your understanding of how JavaScript behaves. You start to anticipate problems before they happen, and you become more deliberate in how you write code.

By embracing errors early, you’ll develop the mindset of a programmer: curious, patient, and unafraid to experiment. Debugging isn’t a chore—it’s a skill, and one of the most valuable ones you’ll gain on your programming journey.

## The Idea of Syntax and Structure

Every language—spoken or written—has rules that determine how words fit together to form meaningful sentences. Programming languages are no different. **Syntax** is the set of rules that defines how you must write your code so the computer can understand it. **Structure** is how those rules fit together to form larger, coherent programs.

If syntax is the grammar, structure is the organization.

### Why Syntax Matters

Computers are incredibly literal. They don’t interpret tone, guess your intent, or fill in missing pieces. If you forget a parenthesis, misspell a keyword, or place something in the wrong order, the computer can’t proceed. It stops and reports an error because the instruction no longer fits the expected pattern.

For example, this is valid JavaScript:

<pre class="code">
console.log("Hello")
</pre>

But remove one character:

<pre class="code">
console.log("Hello"
</pre>

Suddenly the computer has no idea where the statement ends. A human might overlook the missing parenthesis, but the computer cannot.

Syntax rules ensure clarity. They create a predictable structure that both you and the machine can rely on.

### The Building Blocks of JavaScript Syntax

As you learn JavaScript, you’ll encounter several recurring elements:

- **Keywords** like `let`, `if`, `function`
- **Symbols** like `{}`, `()`, `[]`, `;`
- **Operators** like `+`, `-`, `===`
- **Comments** `//`
- **Values** like numbers, strings, and booleans
- **Identifiers** (names you create for variables and functions)

Each of these has a specific role and must appear in the right place for your code to make sense.

### Structure: How Code Fits Together

While syntax governs the details, structure governs the big picture. Structure is how you organize your code so it’s readable, logical, and easy to maintain.

For example, JavaScript uses **curly braces** to group related statements:

<pre class="code">
if (score > 10) {
  console.log("You win!")
  console.log("Great Work!")
}
</pre>

The braces show that both console.log statements belong to the `if` condition. Without them, the computer would only execute the first one based on the condition. The second would execute every time regardless of the value of the “score” variable. So, the braces tell the computer to handle the two (or more) statements together. They will either both execute or neither will.

Structure also includes:

- Indentation to show hierarchy
- Grouping related code into functions
- Keeping variable names meaningful
- Writing code in a logical order

Good structure makes your programs easier to understand—not just for the computer, but for you and anyone else who reads your code later.

### Syntax \+ Structure \= Clear Communication

Programming is ultimately about communication. You’re expressing ideas in a form the computer can execute. Syntax ensures your message is valid; structure ensures it’s understandable.

As you continue through this book, you’ll see how these two concepts work together. You’ll learn the rules, but you’ll also learn how to write code that feels clean, organized, and intentional. Mastering syntax and structure early will make everything else in programming feel more natural.

An easy way for your code to communicate clearly is to use comments. It is wise to add comments throughout your code to give an explanation about any complicated parts. If you clearly explain what each section of your code does in comments it will be much easier for you to understand what you have written when you refer to it months later.

Example of comments:

<pre class="code">
//This section of code will print "You win!"
//and "Great work!" if the score is above 10
if (score > 10) {
  console.log("You win!")
  console.log("Great Work!")
}
</pre>

## Transitioning to Google Apps Script in Google Sheets

Up to this point, you’ve been learning JavaScript in its simplest form—writing small statements, experimenting in the console, and getting comfortable with the language’s basic building blocks. Now it’s time to take those skills somewhere more practical, somewhere you can see your code interact with real data and real tools you already use every day.

For the next part of this book, we’ll shift our focus to **Google Apps Script**, a JavaScript‑based environment that runs inside Google Workspace. We’ll anchor our learning inside **Google Sheets**, one of the most flexible and useful tools available.

### Why Move to Google Apps Script Now

Google Apps Script is a natural next step because it lets you apply your new programming skills to tasks that matter—automating spreadsheets, generating reports, cleaning data, sending emails, and building custom tools that live right inside your Google account. It’s JavaScript with superpowers, connected directly to your documents, your Drive, and your workflows.

This environment is ideal for beginners because:

- You don’t need to install anything.
- You can write code directly in your browser.
- You get immediate, visible results in a spreadsheet.
- The scripting language is close to the JavaScript you’ve already learned.
- You can build genuinely useful tools with just a few lines of code.

### What You’ll Learn in Google Sheets

As we move into Apps Script, you’ll learn how to:

- Write functions that read and modify spreadsheet data
- Create custom menus and buttons
- Automate repetitive tasks
- Build small applications that live inside Sheets
- Connect your spreadsheet to other Google services like Gmail or Drive

This is where programming starts to feel powerful. Instead of writing code in isolation, you’ll be shaping tools that interact with real information.

### How This Transition Works

Don’t worry—you’re not leaving JavaScript behind. Apps Script _is_ JavaScript, just running in a different environment with additional features. Everything you’ve learned so far still applies. You’ll simply be adding new abilities, like accessing spreadsheet cells or responding to user actions.

Think of this as moving from practicing chords to playing your first song. The fundamentals stay the same, but now you get to create something meaningful.

---

With that foundation in place, the next chapter will guide you into Google Sheets, show you how to open the Apps Script editor, and help you write your first script that interacts with real spreadsheet data.
