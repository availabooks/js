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

```{.code}
console.log("Hello from JavaScript")
```

As we reach more advanced topics, you'll need to run some code in  other places.  In that case, when you click the "Play" button, you'll see a message telling you where to you need to take the code to execute it.

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

A string of characters is more than just a collection. The order is important You can think of it as string of beads in the image below.

![null](images/string.jpg)

Run this editor. Nothing appears:

```{.code}
5 + 7
```

The computer did calculate `5 + 7`, but nothing told it to do anything with the result, so the result was thrown away. Now wrap the expression in `console.log( )`, and it becomes a statement that displays the value:

```{.code}
console.log(5 + 7)
```

This time you see `12`. The expression `5 + 7` is the value, and `console.log(...)` is the instruction that displays it.

Text works the same way. In JavaScript, text goes inside quote marks, so the computer can tell the words you want to display from the words that are part of the code:

```{.code}
console.log("JavaScript is fun!")
```

::: {.term}
> **String** — A piece of text in a program, written inside quote marks, such as `"Hello"`. The name comes from the idea of a string of characters.
:::

## Asking for Your First Line of Code

Time to use the PARSE workflow on something small.

**Plan.** You want one line of code that displays a greeting. There is not input from the user. The output is a greeting in the console, and you'll know it worked if the greeting appears under the editor.

**Ask.** Start a new chat, paste your learner profile from the beginning of this chapter, and send this prompt:

::: {.ai-conversation prompt="Write one line of JavaScript that prints a greeting to the console." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="ai-assistant" transcript="first-code/greeting"}
> ```
> console.log("Hi there!")
> ```
>
> **What this does:**
>
> - `console.log(...)` tells the computer to display whatever is inside the parentheses
> - `"Hi there!"` is the text (a **string**) that gets displayed — the quote marks tell JavaScript "this is text, not code"
>
> Run it and you should see `Hi there!` show up in your console.
:::

**Read.** The reply is short because the learner profile asked for short, simple code. Go through it using what you've just learned:

- `"Hi there!"` is an expression. It's a string, so it's in quote marks. The assistant even uses the word *string*, which you've just learned.
- `console.log( )` makes the line a statement that displays the value in its parentheses.
- There's no semicolon at the end, because the profile asked to omit semicolons.

It doesn't change or delete anything, and it matches the plan. You can explain every part of it.

**Scrutinize.** Paste the code into the editor below, or type it, run it, and check that the greeting appears:

```{.code}
console.log("Hi there!")
```

**Edit.** If your greeting appeared, there's nothing to edit. If your assistant's reply was different, run its version instead. Any line that puts a string inside `console.log( )` does the same job.

## More About console.log

`console.log` is how your code shows you what it's doing, and you'll use it often: to see results, to check a value, and to find out which parts of your code actually ran.

It can display numbers, text, and the results of calculations:

```{.code}
console.log(42)
console.log("Learning JavaScript")
console.log(10 * 10)
console.log(100 / 4 - 5)
```

JavaScript uses `+` and `-` for adding and subtracting, `*` for multiplying and `/` for dividing. As in ordinary math, multiplying and dividing happen before adding and subtracting, and parentheses change the order: `(2 + 3) * 4` is 20, while `2 + 3 * 4` is 14.

You can display several values at once by separating them with commas. `console.log` puts a space between them:

```{.code}
console.log("The total is", 5 + 7)
console.log("Two times three is", 2 * 3, "and ten minus four is", 10 - 4)
```

Labeling a value this way makes output much easier to understand, especially once a program displays more than one thing.

## Comments

Anything after two forward slashes (`//`) on a line is a **comment**: a note for people, which the computer ignores.

```{.code}
// This line displays the number of days in a week
console.log(7)

console.log(24 * 7) // the number of hours in a week
```

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

```{.code}
let student = "Ava"
console.log("Hello,", student)
```

The first line says: *give a value the name* `student`*, and store the string "Ava" under it.* After that, whenever the code uses `student`, JavaScript uses the value stored there. Notice that `student` in the second line has no quote marks. Without quotes, it refers to the stored value. With quotes, `"student"` would just be the seven letters s-t-u-d-e-n-t.

A named value like this is called a **variable**. You'll learn much more about variables later, including how to change what they hold. For now, it's enough to recognize the pattern, because you'll see it in almost every piece of code an AI assistant writes for you.

::: {.term}
> **Variable** — A name that refers to a stored value. `let student = "Ava"` creates a variable called `student` that holds the string "Ava."
:::

Here's how an assistant handles a request that needs a variable:

::: {.ai-conversation prompt="Write JavaScript that stores a student's name, Ava, in a variable called student, and then prints a greeting that uses it." assistant="Claude" model="claude-sonnet-5" captured="2026-09-29" profile="ai-assistant" transcript="first-code/named-value"}
> This task needs a new concept: **variables**. A variable is like a labeled box where you can store information to use later.
>
> Here's how to do it:
>
> ```
> let student = "Ava"
> console.log("Hello, " + student)
> ```
>
> **What this does:**
>
> - `let student = "Ava"` creates a variable named `student` and puts the text `"Ava"` inside it. Think of it as labeling a box "student" and putting the name Ava in it.
> - `console.log(...)` prints something to the screen, like before.
> - `"Hello, " + student` joins the text `"Hello, "` together with whatever is stored in `student`. The `+` here glues two pieces of text together.
> - So this line prints: `Hello, Ava`
>
> Try running it and see if you get that greeting. Let me know when you're ready for the next concept!
:::

**Read.** This reply was sent with the learner profile from the previous lesson, which says you know nothing yet, and the assistant handled that sensibly. It started by naming the new concept the task needs, a *variable*, and it explained every part of the code, including the new use of `+` to join text. That's close to what the profile asks for, though not exactly: the profile asks the assistant to *tell you* what a task needs instead of using it. When an assistant goes ahead anyway, as it did here, its explanations are what let you keep up.

You can now read every line:

- `let student = "Ava"` creates a variable called `student` holding the string "Ava", just like the example above.
- `console.log("Hello, " + student)` uses `+` in a new way. With numbers, `+` adds. With strings, it joins them end to end, so `"Hello, " + student` becomes the single string "Hello, Ava". Joining strings this way is called **concatenation**.

Compare it with the version earlier in this section, `console.log("Hello,", student)`. Both display *Hello, Ava*, but they get there differently:

- **With a comma,** `console.log` receives two separate values and puts a space between them for you.
- **With `+`,** you build one string yourself, so you control the spacing. That's why the assistant's version has a space inside the quotes: `"Hello, "`. Leave it out and you'd get *Hello,Ava*.

**Scrutinize.** Run both versions and compare the output. Then take out the space inside the quotes in the second one and run it again to see the difference:

```{.code}
let student = "Ava"
console.log("Hello,", student)
console.log("Hello, " + student)
```

You'll learn more about joining strings with `+` in the lesson on variables and data. For more practice, try changing the name or the greeting and running the code again.

## Why This Book Leaves Out Semicolons

Look back at the reply in [Welcome to Programming](welcome){.book-link}, where an assistant was asked for a program that says hello. Its code looked like this:

```{.code environment="none"}
console.log("Hello, World!");
```

That semicolon (`;`) at the end is optional. JavaScript treats the end of a line as the end of a statement, so these two lines do exactly the same thing:

```{.code}
console.log("with a semicolon");
console.log("without a semicolon")
```

You only *need* a semicolon if you put two statements on the same line: `console.log(1); console.log(2)`.

Much of the JavaScript you'll find online, and much of what AI assistants write, uses semicolons anyway. Many other programming languages require them, and plenty of programmers are used to them. This book leaves them out, for two reasons:

- **There's one less thing to remember.** You can focus on what each line does instead of on punctuation.
- **The code is easier to read.** With less punctuation, the instructions themselves stand out.

Code with semicolons works just as well, so there's no need to remove them from code you find. Your learner profile asks your assistant to leave them out so its code matches this book.

## When Things Go Wrong: Errors

Every programmer, at every level, runs into errors constantly. An error isn't a sign you've failed. It's the computer telling you, as precisely as it can, that it tried to follow your instructions and couldn't.

Run this line. It's missing its closing parenthesis:

```{.code}
console.log("Hello"
```

Instead of output, you get an error message. In Chrome and Edge it reads:

```{.code environment="message"}
SyntaxError: missing ) after argument list
```

The editor adds the line number where it found the problem, and the message may start with the word *Uncaught*, which just means nothing in the code handled the error. Other browsers word the message a little differently.

Here's a different kind of error. The name is misspelled on the second line:

```{.code}
let student = "Ava"
console.log(stduent)
```

```{.code environment="message"}
ReferenceError: stduent is not defined
```

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

Error messages look intimidating, but they're usually telling you three useful things: *what kind* of error it is, *what went wrong*, and *where* (the line number). "ReferenceError: stduent is not defined" says the problem is a name (`stduent`) that JavaScript doesn't recognize. Once you know that, the typo is easy to spot.

When a message doesn't make sense, your AI assistant can help, but how you ask matters. Here's one way to ask about the first error, in a new chat that starts with your learner profile:

::: {.ai-conversation prompt="I ran this line: console.log(&quot;Hello&quot; and got this error: SyntaxError: missing ) after argument list. What does this error mean? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="ai-assistant" transcript="first-code/explain-error"}
> Good, let's look at that error closely — this is a great one to understand early on.
>
> **The error:** `SyntaxError: missing ) after argument list`
>
> Here's what each part means:
>
> - **SyntaxError** — this means you broke one of the grammar rules of JavaScript. Just like a sentence in English needs proper punctuation, JavaScript code needs to be written in a way that follows its rules. When you break a rule, the computer can't understand what you meant, so it stops and complains before it even tries to run your code.
> - **"missing )"** — the computer is telling you it expected to find a closing parenthesis `)` somewhere, but never found one.
> - **"after argument list"** — the "argument" is the thing you put inside the parentheses for `console.log` to work with (in your case, `"Hello"`). So this means: "I found your opening parenthesis and the thing inside it, but then I was expecting a closing parenthesis to finish it off, and it wasn't there."
>
> Basically, parentheses `(` and `)` always need to come in pairs — every opening one needs a matching closing one. The computer read your line and got left "hanging," waiting for that closing `)` that never showed up.
>
> Take a look at your line again and see if you can spot the missing piece yourself before we fix it together.
:::

This reply teaches something you can use again. It takes the message apart one piece at a time, and it ends with a rule: parentheses come in pairs, and when JavaScript finds an opening `(` it keeps reading until it finds the matching `)`. Here it ran out of line first. The next time you see "missing )", you'll know to count your parentheses.

It also explains a word in the message you may not have known. The "argument list" is whatever sits inside the parentheses, here `"Hello"`. A value you hand to `console.log` (or any other command) this way is called an **argument**. If a word in an explanation is new to you, you can always ask the assistant what it means.

Notice what the assistant *didn't* do: it didn't hand you the corrected line. It left the fix to you, as you asked, and even suggested you find the missing piece yourself. Try it now. Add the missing parenthesis and run the code:

```{.code}
console.log("Hello"
```

For comparison, here's the other way to ask, sent in a new chat with the same learner profile:

::: {.ai-conversation prompt="I ran this line: console.log(&quot;Hello&quot; and got this error: SyntaxError: missing ) after argument list. Fix it." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="ai-assistant" transcript="first-code/fix-error"}
> Good catch — that error means you're missing a closing parenthesis at the end.
>
> Here's the fix:
>
> ```
> console.log("Hello")
> ```
>
> **What was wrong:**
>
> - `console.log(` opens with a parenthesis, so it needs a matching `)` to close it
> - You had `console.log("Hello"` — the quote marks were closed, but the parenthesis wasn't
> - Adding `)` at the very end completes the command properly
>
> A good habit: whenever you type `(`, immediately type its matching `)` before you fill in what goes inside. That way you won't forget it.
>
> Try running the corrected line and let me know what you see.
:::

This reply is correct, and because your learner profile asks for explanations, it even says what was wrong. It adds a useful habit, too: type the closing `)` as soon as you type the opening one. So what's the difference?

The difference is who found the mistake. Here, the assistant found it and handed you the working line, so all that was left for you to do was read. In the first reply, the assistant explained the rule and left the finding to you. Spotting the missing parenthesis yourself is what builds the skill, and the next time you forget one you'll be able to fix it without asking.

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
- **Names** you choose for your own values, such as `student`.
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
- giving a value a name with let, for example let student = "Ava"
- reading error messages
:::

Two things changed. The sentence "I don't know any programming concepts yet" is gone, and "What I know so far" now lists what you learned in this lesson. The rules stay the same. With this profile, an assistant can use `console.log`, arithmetic, strings, comments and `let` in its code, and should tell you when a task needs anything else.

## Summary

This book's code editors run JavaScript right in the page. An expression produces a value, and a statement tells the computer to do something with it. `console.log` displays values: text in quote marks, numbers, calculations, or several values separated by commas. Comments start with `//` and are ignored by the computer. `let` gives a value a name, called a variable, so you can use it again. Semicolons are optional in JavaScript, and this book leaves them out. Errors are normal. They tell you what kind of problem the computer found, what it was, and where. When a message is unclear, ask your assistant to explain it before you ask it to fix the code.
