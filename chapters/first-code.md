---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Run JavaScript in this book's code editors.
2. Tell the difference between an expression and a statement.
3. Use `console.log` to display text, numbers and the results of calculations.
4. Give a value a name with `let`, and use the name later.
5. Read an error message and ask an AI assistant to explain it.
6. Explain why this book leaves semicolons out of JavaScript code.
:::
:::

## Where You'll Run Code

Code editors like the one below appear throughout this book. Each one has a Run button (▶). Click it, and the code runs right here in the page, with any output shown underneath. You can change the code and run it again as often as you like.

<pre class="code">
console.log("Hello from JavaScript")
</pre>

You'll also see editors that show code without a Run button. That code is meant to run somewhere else, such as a Google Sheet, and the lesson explains where.

::: {.note}
> **Your browser has a console too.** Every modern browser (Chrome, Edge, Firefox and Safari) includes developer tools with a *console*, a panel where you can type JavaScript and see the result. You don't need it yet, because this book's editors work the same way. You'll use the browser's console later, when you work with web pages.
:::

This is the environment your learner profile describes: "an online editor that shows console.log output." When you ask your AI assistant for code in this lesson, you can paste its code into any editor on this page to run it.

## Expressions and Statements

Two ideas sit underneath every line of JavaScript: expressions and statements.

An **expression** is a piece of code that produces a value. `25` is an expression whose value is the number 25. `5 + 7` is an expression whose value is 12. `"Hello"` is an expression whose value is the text *Hello*.

A **statement** is an instruction: it tells the computer to *do* something. A statement often contains expressions, the way a sentence contains words.

::: {.term}
> **Expression** — Code that produces a value, such as `5 + 7` or `"Hello"`.
:::

::: {.term}
> **Statement** — A complete instruction that tells the computer to do something, such as display a value.
:::

Run this editor. Nothing appears:

<pre class="code">
5 + 7
</pre>

The computer did calculate `5 + 7`, but nothing told it to do anything with the result, so the result was thrown away. Now wrap the expression in `console.log( )`, and it becomes a statement that displays the value:

<pre class="code">
console.log(5 + 7)
</pre>

This time you see `12`. The expression `5 + 7` is the value, and `console.log(...)` is the instruction that displays it.

Text works the same way. In JavaScript, text goes inside quote marks, so the computer can tell the words you want to display from the words that are part of the code:

<pre class="code">
console.log("JavaScript is fun!")
</pre>

::: {.term}
> **String** — A piece of text in a program, written inside quote marks, such as `"Hello"`. The name comes from the idea of a string of characters.
:::

## Asking for Your First Line of Code

Time to use the five-step workflow on something small.

**Plan.** You want one line of code that displays a greeting. Nothing needs to go in. The output is a greeting in the console, and you'll know it worked if the greeting appears under the editor.

**Ask.** Start a new chat, paste your learner profile from [Working with an AI Assistant](ai-assistant){.book-link}, and send this prompt:

::: {.ai-conversation prompt="Write one line of JavaScript that prints a greeting to the console." assistant="Gemini" model="gemini-3.8-flash" captured="2026-09-26" profile="ai-assistant" transcript="first-code/greeting"}
> ```javascript
> console.log("Hi there!")
> ```
>
> ### What this line does:
> * `console.log(...)` tells the computer to display something on the screen.
> * `"Hi there!"` is the greeting text you want to print, wrapped in quotation marks.
:::

**Read.** The reply is short because the learner profile asked for short, simple code. Go through it using what you've just learned:

- `"Hi there!"` is an expression. It's a string, so it's in quote marks.
- `console.log( )` makes the line a statement that displays the value in its parentheses.
- There's no semicolon at the end, because the profile asked for none.

It doesn't change or delete anything, and it matches the plan. You can explain every part of it.

**Run.** Paste the code into the editor below, or type it, and run it:

<pre class="code">
console.log("Hi there!")
</pre>

**Revise.** If your greeting appeared, there's nothing to revise. If your assistant's reply was different, run its version instead. Any line that puts a string inside `console.log( )` does the same job.

## More About console.log

`console.log` is how your code shows you what it's doing, and you'll use it constantly: to see results, to check a value, and to find out which parts of your code actually ran.

It can display numbers, text, and the results of calculations:

<pre class="code">
console.log(42)
console.log("Learning JavaScript")
console.log(10 * 10)
console.log(100 / 4 - 5)
</pre>

JavaScript uses `+` and `-` for adding and subtracting, `*` for multiplying and `/` for dividing. As in ordinary math, multiplying and dividing happen before adding and subtracting, and parentheses change the order: `(2 + 3) * 4` is 20, while `2 + 3 * 4` is 14.

You can display several values at once by separating them with commas. `console.log` puts a space between them:

<pre class="code">
console.log("The total is", 5 + 7)
console.log("Two times three is", 2 * 3, "and ten minus four is", 10 - 4)
</pre>

Labeling a value this way makes output much easier to understand, especially once a program displays more than one thing.

## Comments

Anything after two forward slashes (`//`) on a line is a **comment**: a note for people, which the computer ignores.

<pre class="code">
// This line displays the number of days in a week
console.log(7)

console.log(24 * 7) // the number of hours in a week
</pre>

::: {.term}
> **Comment** — A note in the code, starting with `//`, that the computer ignores. Comments explain code to the people who read it.
:::

Comments have three common uses:

- **Explaining what code does,** so you (or someone else) can understand it later.
- **Recording why you did something a particular way,** which the code alone can't show.
- **Turning off a line temporarily.** Put `//` in front of a line to stop it from running without deleting it. This is handy when you're hunting for a problem.

AI assistants often add comments to the code they write. They're worth reading. A comment tells you what the code is *supposed* to do, which makes it easier to check whether it actually does.

## Giving a Value a Name

Programs constantly need to remember values and use them again. You can give a value a name with `let`:

<pre class="code">
let name = "Ava"
console.log("Hello,", name)
</pre>

The first line says: *create a name, `name`, and store the string "Ava" under it.* After that, whenever the code uses `name`, JavaScript uses the value stored there. Notice that `name` in the second line has no quote marks. Without quotes, it refers to the stored value. With quotes, `"name"` would just be the four letters n-a-m-e.

A named value like this is called a **variable**. You'll learn much more about variables later, including how to change what they hold. For now, it's enough to recognize the pattern, because you'll see it in almost every piece of code an AI assistant writes for you.

::: {.term}
> **Variable** — A name that refers to a stored value. `let name = "Ava"` creates a variable called `name` that holds the string "Ava."
:::

Here's how an assistant handles a request that needs a variable:

::: {.ai-conversation prompt="Write JavaScript that stores my name, Ava, and then prints a greeting that uses it." assistant="Gemini" model="Gemini 3.6 Thinking (Gemini app)" captured="2026-09-26" profile="ai-assistant" transcript="first-code/named-value"}
> To store a name and use it in a greeting, this task requires two new concepts: **variables** (used to store information) and **text combination** using the `+` operator.
>
> ```javascript
> let name = "Ava"
> console.log("Hello, " + name)
>
> ```
>
> * `let` tells JavaScript to create a variable, which acts like a labeled box for storing data.
> * `name` is the label given to this box.
> * `=` places the text `"Ava"` inside the `name` box.
> * `+` glues the text `"Hello, "` together with the stored value inside `name`.
> * `console.log(...)` displays the final combined message (`Hello, Ava`).
>
> Would you like to try adding a second variable, such as your favorite color or city, to expand the greeting?
:::

**Read.** This reply was sent with the learner profile from the previous lesson, which says you know nothing yet, and the assistant handled that sensibly. It started by naming the two concepts the task needs, *variables* and *text combination*, and then explained each piece of the code as it used it. That's close to what the profile asks for, though not exactly: the profile asks the assistant to *tell you* what a task needs instead of using it. When an assistant goes ahead anyway, as it did here, the explanation is what lets you keep up.

You can now read every line:

- `let name = "Ava"` creates a variable called `name` holding the string "Ava", just like the example above.
- `console.log("Hello, " + name)` uses `+` in a new way. With numbers, `+` adds. With strings, it joins them end to end, so `"Hello, " + name` becomes the single string "Hello, Ava".

Compare it with the version earlier in this section, `console.log("Hello,", name)`. Both display *Hello, Ava*, but they get there differently:

- **With a comma,** `console.log` receives two separate values and puts a space between them for you.
- **With `+`,** you build one string yourself, so you control the spacing. That's why the assistant's version has a space inside the quotes: `"Hello, "`. Leave it out and you'd get *Hello,Ava*.

**Run.** Try both versions, then take out the space inside the quotes in the second one and run it again to see the difference:

<pre class="code">
let name = "Ava"
console.log("Hello,", name)
console.log("Hello, " + name)
</pre>

You'll learn more about joining strings with `+` in the lesson on variables and data. The assistant's closing question, about adding a second variable, is a good one to try on your own.

## Why This Book Leaves Out Semicolons

Look back at the reply in [Welcome to Programming](welcome){.book-link}, where an assistant was asked for a program that says hello. Its code looked like this:

<pre class="code" data-environment="none">
console.log("Hello, World!");
</pre>

That semicolon (`;`) at the end is optional. JavaScript treats the end of a line as the end of a statement, so these two lines do exactly the same thing:

<pre class="code">
console.log("with a semicolon");
console.log("without a semicolon")
</pre>

You only *need* a semicolon if you put two statements on the same line: `console.log(1); console.log(2)`.

Much of the JavaScript you'll find online, and much of what AI assistants write, uses semicolons anyway. Many other programming languages require them, and plenty of programmers are used to them. This book leaves them out, for two reasons:

- **There's one less thing to remember.** You can focus on what each line does instead of on punctuation.
- **The code is easier to read.** With less punctuation, the instructions themselves stand out.

Code with semicolons works just as well, so there's no need to remove them from code you find. Your learner profile asks your assistant to leave them out so its code matches this book.

## When Things Go Wrong: Errors

Every programmer, at every level, runs into errors constantly. An error isn't a sign you've failed. It's the computer telling you, as precisely as it can, that it tried to follow your instructions and couldn't.

Run this line. It's missing its closing parenthesis:

<pre class="code">
console.log("Hello"
</pre>

Instead of output, you get an error message. In Chrome and Edge it reads:

<pre class="code" data-environment="message">
SyntaxError: missing ) after argument list
</pre>

The editor adds the line number where it found the problem, and the message may start with the word *Uncaught*, which just means nothing in the code handled the error. Other browsers word the message a little differently.

Here's a different kind of error. The name is misspelled on the second line:

<pre class="code">
let name = "Ava"
console.log(nmae)
</pre>

<pre class="code" data-environment="message">
ReferenceError: nmae is not defined
</pre>

### Kinds of errors

Most errors a beginner meets fall into four groups:

- **Syntax errors.** The code breaks the rules of how JavaScript must be written, such as a missing parenthesis or quote mark. The computer can't even start running it.
- **Reference errors.** The code uses a name that doesn't exist, usually because of a typo or because the name was never created.
- **Type errors.** The code tries to do something with a value that doesn't make sense for that kind of value. You'll meet these later.
- **Logic errors.** The code runs without complaint but does the wrong thing, such as adding when it should subtract. These are the hardest to find, because nothing tells you they're there. You find them by checking results against your plan.

::: {.term}
> **Syntax** — The rules for how code in a language must be written, such as which punctuation goes where. A syntax error means the code breaks those rules.
:::

### Reading an error message

Error messages look intimidating, but they're usually telling you three useful things: *what kind* of error it is, *what went wrong*, and *where* (the line number). "ReferenceError: nmae is not defined" says the problem is a name (`nmae`) that JavaScript doesn't recognize. Once you know that, the typo is easy to spot.

When a message doesn't make sense, your AI assistant can help, but how you ask matters. Here's one way to ask about the first error, in a new chat that starts with your learner profile:

::: {.ai-conversation prompt="I ran this line: console.log(&quot;Hello&quot; and got this error: SyntaxError: missing ) after argument list. What does this error mean? Explain it, but don't fix it yet." assistant="Gemini" model="Gemini 3.6 Thinking (Gemini app)" captured="2026-09-26" profile="ai-assistant" transcript="first-code/explain-error"}
> A **SyntaxError** means JavaScript couldn't run your code because it broke a basic grammar rule of the language.
>
> Specifically, **"missing ) after argument list"** happens because of how opening and closing punctuation work:
>
> * The opening parenthesis `(` tells JavaScript: *"Start looking at the item I want to display."*
> * JavaScript reads `"Hello"`.
> * It expects a matching closing parenthesis `)` right after that to finish the instruction, but it reached the end of the line without finding one.
>
> Because JavaScript never saw that closing symbol, it got stuck waiting for the instruction to end and flagged the mistake.
>
> Would you like to try fixing the code yourself now, or move on to your next textbook exercise?
:::

This reply teaches something you can use again. Parentheses come in pairs, and when JavaScript finds an opening `(` it keeps reading until it finds the matching `)`. Here it ran out of line first. The next time you see "missing )", you'll know to count your parentheses.

The explanation also answers a question the message raises without spelling it out: the "argument list" is whatever sits inside the parentheses, here `"Hello"`. A value you hand to `console.log` (or any other command) this way is called an **argument**. If a word in an explanation is new to you, you can always ask the assistant what it means.

Notice what the assistant *didn't* do: it didn't hand you the corrected line. It left the fix to you, as you asked. Try it now. Add the missing parenthesis and run the code:

<pre class="code">
console.log("Hello"
</pre>

For comparison, here's the other way to ask, sent in a new chat with the same learner profile:

::: {.ai-conversation prompt="I ran this line: console.log(&quot;Hello&quot; and got this error: SyntaxError: missing ) after argument list. Fix it." assistant="Gemini" model="Gemini 3.6 Thinking (Gemini app)" captured="2026-09-26" profile="ai-assistant" transcript="first-code/fix-error"}
> ```javascript
> console.log("Hello")
>
> ```
>
> * `console.log(...)` tells JavaScript to display the text inside the parentheses.
> * `"Hello"` is the text to display.
> * `)` closes the argument list so JavaScript knows the instruction is complete.
:::

This reply is correct, and because of your learner profile it even explains each part. But look at what it leaves out. It never says what went wrong or why JavaScript complained. It just hands you the working line. You'd be able to run it, but the next time you forget a parenthesis you'd have to ask again.

The first reply took you one step further. It explained the rule behind the error and left the fix to you, so the next time you see "missing )" you can fix it yourself, without asking.

Both kinds of question have their place. Once you understand an error, asking for a fix is a fine way to save time. While you're learning, though, ask for the explanation first.

### Debugging habits

Finding and fixing problems in code is called **debugging**. These habits will save you time from the start:

- **Read the error message slowly,** one piece at a time.
- **Check for typos,** especially in names and punctuation.
- **Use `console.log`** to check values while the code runs.
- **Turn off lines with `//`** to narrow down which one causes a problem.
- **Make small changes and test each one,** instead of changing many things at once.
- **Ask your assistant to explain before you ask it to fix.** An explanation helps you next time too.

## Syntax and Structure

Every language has rules for how words fit together. JavaScript's rules are strict: a missing parenthesis or quote mark stops the code from running at all. That's why a human reader might not notice a problem that the computer refuses to accept.

As you learn JavaScript, you'll meet a handful of building blocks over and over:

- **Keywords,** words with special meaning to JavaScript, such as `let`.
- **Values,** such as numbers and strings.
- **Names** you choose for your own values, such as `name`.
- **Operators,** such as `+`, `-`, `*` and `/`.
- **Punctuation,** such as parentheses `( )`, quote marks, and the curly braces `{ }` you'll soon use to group lines together.
- **Comments,** starting with `//`.

Syntax is about whether code is *valid*. **Structure** is about whether it's *understandable*: lines in a sensible order, consistent indentation, meaningful names, and comments where they help. The computer doesn't care about structure, but you will, and so will anyone else who reads your code later. Well-structured code is also easier to check, which matters when an AI assistant wrote it.

## Your Learner Profile

You've learned enough to update your learner profile. Use this version at the start of every new chat from now on:

::: {.ai-profile lesson="first-code"}
Add to "What I know so far":

- statements and expressions
- console.log to display values, including several values separated by commas
- text in quote marks
- joining strings with +
- numbers and the arithmetic operators + - * /
- comments that start with //
- giving a value a name with let, for example let name = "Ava"
- reading error messages
:::

Two things changed. The sentence "I don't know any programming concepts yet" is gone, and "What I know so far" now lists what you learned in this lesson. The rules stay the same. With this profile, an assistant can use `console.log`, arithmetic, strings, comments and `let` in its code, and should tell you when a task needs anything else.

## Summary

This book's code editors run JavaScript right in the page. An expression produces a value, and a statement tells the computer to do something with it. `console.log` displays values: text in quote marks, numbers, calculations, or several values separated by commas. Comments start with `//` and are ignored by the computer. `let` gives a value a name, called a variable, so you can use it again. Semicolons are optional in JavaScript, and this book leaves them out. Errors are normal. They tell you what kind of problem the computer found, what it was, and where. When a message is unclear, ask your assistant to explain it before you ask it to fix the code.
