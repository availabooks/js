::: {.learning}
Learning Objectives

::: {.objectives}
1. Describe what programming is and why computers need precise instructions.
2. Explain the difference between how a computer follows instructions and how an AI assistant responds to a request.
3. Explain why you still need to understand code when an AI assistant can write it for you.
4. Name the kinds of platforms where you'll use JavaScript in this book.
5. Describe the PARSE workflow this book uses for every example.
:::
:::

## What Programming Is

Programming is giving a computer instructions precise enough that it can carry out a task for you. The computer does exactly what the instructions say. Not roughly what they say, and not what you meant to say.

You already know what instructions look like. A recipe is a program for making a meal. Directions to a friend's house are a program for getting there. The difference is that people fill in gaps and computers don't. If a recipe says "cook until done," a person uses judgment. A computer has no judgment to use. It needs every step, in order, with nothing left open.

So programming is less about memorizing commands and more about a way of thinking. You learn to break a problem into small steps, to state each step clearly, to test whether the steps work, and to build something small before making it bigger. Those habits are useful even when you're not writing code.

This book teaches programming with **JavaScript**, one of the most widely used programming languages in the world. By the end, you'll be able to automate real tasks on several platforms you probably already use.

::: {.term}
> **Program** — A set of instructions a computer follows to carry out a task. The instructions are written in a programming language, such as JavaScript.
:::

## How Computers Follow Instructions

Inside a computer, everything comes down to a huge number of tiny, simple decisions: yes or no, on or off, true or false. A modern computer makes billions of them every second. Games, websites, spreadsheets and music apps are all built from these simple steps.

Because the steps are so simple, the instructions you give have to be exact. Take a task that feels like a single action to a person, such as "sort these names alphabetically." For a computer, that task has to be spelled out: compare two names, decide which comes first, swap them if they're out of order, and repeat until the whole list is in order. One action for you becomes hundreds of small steps for the machine.

The payoff is that once a computer has the steps, it follows them quickly and the same way every time. It doesn't get tired, lose its place or skip a step. Describe a process once, and the computer can repeat it thousands of times without a mistake.

That precision cuts both ways. If you leave out a detail, the computer won't fill it in. If you write something ambiguous, it won't work out what you meant. It does exactly what you wrote, even when that isn't what you wanted.

## Computers Never Guess. AI Assistants Always Do.

Until recently, learning to program meant learning to write every one of those instructions yourself. Today, an **AI assistant** such as ChatGPT, Gemini, Claude or Copilot can write code for you from a description in plain English. This book shows you how to work with one from the very first lesson.

::: {.term}
> **AI assistant** — A program you can chat with in ordinary language. You ask it questions or describe what you want, and it replies with text, which can include working code.
:::

An AI assistant behaves very differently from the computer that runs your code:

- **A computer never fills in gaps.** It does exactly what your instructions say, and nothing more.
- **An AI assistant always fills in gaps.** When your request leaves something out, it makes a reasonable guess about what you meant and keeps going.

Programming with an AI means working with both. You give the AI enough detail that its guesses are good ones. Then you read the code it writes carefully enough to catch the guesses that are wrong, before the computer carries them out.

Here's a short example. Below is a request sent to an AI assistant, followed by its reply. Throughout this book, conversations look like this. The request is shown first, and the reply follows.

::: {.ai-conversation prompt="Write a JavaScript program that says hello." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="none" transcript="welcome/say-hello"}
> Here's a simple JavaScript program that says hello:
>
> ```javascript
> console.log("Hello, World!");
> ```
>
> If you'd like a more complete example, here's a version with a function:
>
> ```javascript
> function sayHello(name) {
>   console.log(`Hello, ${name}!`);
> }
>
> sayHello("World");
> ```
>
> **How to run this:**
>
> 1. **In a browser:** Open the Developer Console (F12) and paste the code, then press Enter.
>
> 2. **With Node.js:**
>    - Save the code in a file, e.g., `hello.js`
>    - Run it in your terminal with:
>      ```
>      node hello.js
>      ```
>
> 3. **In an HTML file:**
>    ```html
>    <!DOCTYPE html>
>    <html>
>    <body>
>      <script>
>        console.log("Hello, World!");
>        alert("Hello, World!"); // This will show a popup
>      </script>
>    </body>
>    </html>
>    ```
>
> Let me know if you'd like a variation—like displaying the message on a webpage instead of the console, or personalizing it further!
:::

You don't need to understand this code yet. Instead, notice what the assistant decided on its own:

- **The words.** The request said "hello." The assistant chose "Hello, World!", the traditional first message in programming.
- **How much to write.** It gave a one-line program, then added a longer version "with a function" that you didn't ask for.
- **Where the code runs.** The request didn't say, so the assistant described three places: a developer tool in your browser called the console, a program called Node.js, and a web page that also shows a popup window. It couldn't know which one you needed, because it doesn't know where you'll run the code.
- **The punctuation.** Most lines end with a semicolon (`;`). That's a style choice. JavaScript works the same without them, and this book leaves them out. You'll see why in [Your First Lines of Code](first-code){.book-link}.

None of this is wrong. It's what a sensible guess looks like when a request leaves things out. A more specific request, such as "Write one line of JavaScript that prints Hello in the console," would leave less to guess.

::: {.note}
> **Your replies won't match this book's.** AI assistants word things differently each time, even when you send the same request twice, and different assistants give different answers. When you try an example yourself, compare the *code* in your reply with the code in the book, not the wording. The book's replies were captured from Claude, and each one is labeled with its date.
:::

## Why You Still Need to Understand Code

If an AI can write code, why learn to program at all? Because someone has to decide whether the code is right, and that someone is you.

AI-generated code usually *looks* correct. It's neatly formatted, the explanation sounds confident, and often it works. But the assistant is guessing about your situation, and it can't see your data, your spreadsheet or what you're trying to accomplish. Sometimes its code does something slightly different from what you asked. Sometimes it does something you'd never want, like overwriting a column of data you needed. You'll only catch those problems if you can read the code.

In this book, your job is to be the one in charge:

- **You decide what the code should do.** The AI doesn't know your goal until you describe it.
- **You check what the AI gives you.** You read the code before you run it, and you test the result.
- **You decide what to change.** When something is wrong, you explain the problem to the AI or fix it yourself.

Each lesson teaches a programming concept so you can do those three things. You're not learning JavaScript so you can write everything from scratch. You're learning it because you can't check code you can't read.

## Why JavaScript

JavaScript is a good first language for several reasons:

- **You already have it.** Every web browser runs JavaScript, so you can start with no special software. This book's own pages include editors where you can run code as you read.
- **It runs almost everywhere.** JavaScript powers web pages, automates Google and Microsoft apps, runs programs on your own computer, and runs web servers. Once you learn it, you can use it in all of those places.
- **It's forgiving.** You can write something useful before you understand every detail, and learn more as you go.
- **Help is easy to find.** Millions of people write JavaScript, so almost any question you have has been asked and answered. Because so much JavaScript exists, AI assistants have also seen a great deal of it, and they're generally good at writing and explaining it.

## Where You'll Use JavaScript in This Book

This book aims for breadth, not expertise. You'll learn the core ideas of programming once, then use them on a range of free platforms, getting enough experience on each one to start real projects. After that, your AI assistant can help you go as deep as you like on the ones that interest you.

| Platform | What you'll do there |
|---|---|
| **Google Sheets and Google Workspace** | Read and change spreadsheet data, send email, create calendar events and documents, and build small web apps, using Google Apps Script. |
| **Web pages and your browser** | Build interactive pages, and automate websites you already use. |
| **Microsoft Excel** | Build tools and applications inside a workbook, with a free add-in called JADE. |
| **Productivity apps** | Script Airtable databases and the Obsidian note-taking app. |
| **Your own computer** | Work with files and folders, process data files and build command-line tools, using Node.js. |
| **Servers and web apps** | Build small web services and a complete web application, and put them online for free. |

The book begins with Google Sheets. Spreadsheets are familiar, the results of your code appear right in front of you, and Google Apps Script needs nothing but a free Google account.

Along the way you'll follow a student club, the College Community Garden, as it grows from an idea into an organization with volunteers, shifts, garden beds and harvests to keep track of. Many examples solve that club's real problems.

## How This Book Works

Every example in this book follows the same five steps, and their first letters spell **PARSE**:

1. **Plan.** Decide what you want before you ask for anything. What goes in, what should come out, and how will you know it's right?
2. **Ask.** Describe your plan to your AI assistant.
3. **Read.** Go through the code it gives you, line by line, until you can say what each line does. If you can't, ask the assistant to explain it.
4. **Scrutinize.** Run the code and examine the result closely against your plan.
5. **Edit.** If something is wrong, tell the assistant what happened, or edit the code yourself.

The third step is the one this book cares about most. A rule you'll see again and again: **don't run code you can't explain.**

Each AI conversation in the book has a button that copies the prompt so you can try it out with your own AI assistant. It's the one that looks like a paper airplane just to the right of the prompt. Before you send an example prompt to your own AI assistant, you'll give your assistant a **learner profile**: a short message that tells it what you're working on and which programming ideas you know so far. The profile keeps the assistant from answering with code you haven't learned to read yet. You'll write your first one in the next lesson, [Working with an AI Assistant](ai-assistant){.book-link}, and add to it as you learn.

## Summary

Programming is writing instructions precise enough for a computer to follow, because a computer does exactly what it's told and never fills in gaps. An AI assistant works the other way: it fills in whatever your request leaves out with its best guess. Working with an AI means giving it enough detail to guess well, and understanding code well enough to catch the guesses that are wrong. This book teaches JavaScript because it runs almost everywhere, from spreadsheets to web servers, and it teaches every example through the same five steps, PARSE: plan, ask, read, scrutinize and edit.
