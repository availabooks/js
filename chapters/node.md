---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain what Node.js is, and what JavaScript can do with it that it can't do in a browser.
2. Install Node.js and Visual Studio Code, and check that they work.
3. Use a terminal: see which folder you're in, move between folders and run commands.
4. Run a JavaScript file with `node`, and read the errors it reports.
5. Explain what the current working directory is, and why it matters.
:::
:::

## JavaScript on Your Own Computer

So far, your JavaScript has always run inside something else: Google's servers, a web page, Excel, Airtable, Obsidian. Each gave your code a particular set of tools, and kept it away from everything else. **Node.js** runs JavaScript directly on your own computer, as an ordinary program. With it, your code can do what the others couldn't: read and write any file you can, process folders full of data, run commands, and, in the next part of the book, act as a web server.

The language is the same. `let`, `if`, loops, functions, objects, array methods, `async` and `await` all work exactly as you know them. What changes are the tools around it: there's no `document`, because there's no web page, and no `SpreadsheetApp`. Instead, Node has its own built-in tools for files, folders and the network, which the next few lessons cover.

::: {.term}
> **Node.js** — A program that runs JavaScript outside a web browser, on your own computer or a server, with built-in tools for files, folders and networking.
:::

The club has plenty of work for it: sorting a folder of garden photos, combining harvest logs exported from several places, analyzing a season of data, and building small tools Maya can run with one command.

## Installing Node

You'll need a computer where you can install software: Windows, Mac or Linux. (A Chromebook or school-managed computer may not allow it. Check with your school, or use a free online environment such as GitHub Codespaces.) Here's the question, in a new chat with your learner profile, updated for Node.js as shown at the end of this lesson:

::: {.ai-conversation prompt="How do I install Node.js on my Windows laptop, and how do I check that it worked?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="node" transcript="node/install"}
> Here's how to install Node.js on Windows and check it worked.
>
> ## Installing Node.js
>
> 1. Go to **nodejs.org** in your browser.
> 2. You'll see two download buttons — pick the one labeled **LTS** (Long Term Support). That's the stable version recommended for most people, including beginners.
> 3. This downloads a file like `node-v20.x.x-x64.msi`. Open it once it's downloaded.
> 4. The installer will walk you through some screens — you can just keep clicking **Next** and accept the defaults, then click **Install**.
> 5. Let it finish, then click **Finish**.
>
> ## Checking that it worked
>
> 1. Open a terminal. In VS Code, you can do this with the menu **Terminal > New Terminal**, or on Windows you can open the **Command Prompt** or **PowerShell** app directly.
> 2. Type this and press Enter:
>
> ```
> node -v
> ```
>
> This asks Node to report its own version number. If it worked, you'll see something like:
>
> ```
> v20.11.0
> ```
>
> 3. It's also worth checking npm (Node's package manager, which comes bundled with Node):
>
> ```
> npm -v
> ```
>
> This should print a version number too, like `10.2.4`.
>
> If either command instead says something like `'node' is not recognized as an internal or external command`, the most common fix is to **close and reopen your terminal** (or restart VS Code, or sometimes your whole computer) so it picks up the new installation. If that still doesn't work, let me know the exact error message and we can figure it out together.
>
> Once both commands show version numbers, you're ready to run JavaScript files with Node. Want to try running your first file next?
:::

The steps are right, including the most important choice: the **LTS** version, which stands for Long Term Support and is the stable one. But notice the version numbers in the examples: `v20`. Node releases a new version every six months, and by the time you read this, the current LTS will be a larger number. The assistant is remembering what was current when it learned, not looking. When instructions include version numbers, take the number from the official site, nodejs.org, not from the assistant.

On a Mac, the installer on nodejs.org works the same way.

::: {.tip}
> **"Running scripts is disabled on this system."** On Windows, if `node -v` works but `npm -v` gives this error in PowerShell, it's a Windows security setting, not a problem with Node. The simplest fix is to use **Command Prompt** instead of PowerShell for npm commands, or in VS Code, to choose **Command Prompt** as the terminal. You won't need npm until [Modules and Packages](node-modules){.book-link}.
:::

## The Terminal

A **terminal** is a window where you type commands instead of clicking. It's how you run Node, and it's worth getting comfortable with, because many programming tools work this way. On Windows, the terminal is **PowerShell** or **Command Prompt**; on a Mac, it's the **Terminal** app.

::: {.term}
> **Terminal** — A text window for typing commands to your computer. Also called a *command line*, *shell* or *console*.
:::

The key idea is that a terminal is always *in* a folder, called the **current working directory**. The prompt usually shows it, something like `C:\Users\maya>` on Windows or `maya@laptop ~ %` on a Mac, where `~` means your home folder. Commands work relative to that folder, the same way relative paths worked for web pages in [Publishing a Site for Free](publishing){.book-link}.

::: {.term}
> **Current working directory** — The folder a terminal is in. Commands and programs look for files starting from there.
:::

A handful of commands covers most of what you'll need:

| To do this | Windows (PowerShell) | Mac |
|---|---|---|
| See which folder you're in | `pwd` (or look at the prompt) | `pwd` |
| List what's in the folder | `dir` (or `ls`) | `ls` |
| Go into a folder | `cd Documents` | `cd Documents` |
| Go up one folder | `cd ..` | `cd ..` |
| Clear the screen | `cls` (or `clear`) | `clear` |

Two shortcuts save a lot of typing: press **Tab** to finish a file or folder name you've started typing, and press the **up arrow** to bring back your last command.

## Visual Studio Code

You can write JavaScript files in any text editor, but a code editor makes it much easier. **Visual Studio Code**, usually called VS Code, is free from **code.visualstudio.com**, and it's what most JavaScript programmers use. It colors your code, points out some mistakes as you type, and has a terminal built in.

The way to work in VS Code:

1. Make a folder for a project, such as `garden-scripts` in your Documents folder.
2. In VS Code, choose **File**, then **Open Folder**, and open that folder.
3. Create files with the **New File** button in the Explorer panel on the left.
4. Open a terminal with **Terminal**, then **New Terminal**. It opens at the bottom of the window, already *in* your project folder.

That last point matters more than it seems, as you're about to see.

::: {.screenshot-needed file="images/node-vscode.png"}
Visual Studio Code with a folder named garden-scripts open, a file countdown.js in the editor, and the terminal at the bottom showing "node countdown.js" and its output.
:::

## Your First Script

Here's a first script, in the same chat:

::: {.ai-conversation prompt="Write a small Node.js script that prints how many days are left until the next Saturday, when our garden club has its workday." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="node" transcript="node/countdown"}
> Here's a simple script:
>
> ```javascript
> // Get today's date
> const today = new Date()
>
> // getDay() returns 0 for Sunday, 1 for Monday, ... 6 for Saturday
> const dayOfWeek = today.getDay()
>
> // Saturday is day 6, so subtract today's day number from 6
> const daysUntilSaturday = 6 - dayOfWeek
>
> console.log(`Days until the next garden club workday: ${daysUntilSaturday}`)
> ```
>
> **How it works:**
>
> - `new Date()` creates a Date object for right now.
> - `getDay()` gives a number for the day of the week, where Saturday is always `6`.
> - Since `dayOfWeek` can only be 0 through 6, subtracting it from 6 always gives a number from 0 to 6 — no negative numbers to worry about.
> - If today **is** Saturday, `dayOfWeek` is `6`, so the result is `0` (today's the workday!).
>
> Save this as something like `nextSaturday.js` and run it with:
>
> ```
> node nextSaturday.js
> ```
:::

**Read.** It's plain JavaScript, using the `Date` methods from [Email, Calendar, and Dates](email-calendar){.book-link}. The reasoning in the explanation is careful: `getDay()` is 0 to 6, so `6 - dayOfWeek` can't be negative, and on a Saturday the answer is 0. You can run the same code right here, since it doesn't use anything specific to Node:

<pre class="code">
const today = new Date()
const dayOfWeek = today.getDay()
const daysUntilSaturday = 6 - dayOfWeek
console.log(`Days until the next garden club workday: ${daysUntilSaturday}`)
</pre>

Now run it with Node. Suppose you save it as `countdown.js` in your Documents folder, open a terminal from the Start menu, and type `node countdown.js`:

::: {.ai-conversation prompt="I saved it as countdown.js in my Documents folder, opened a terminal and typed node countdown.js. I got: Error: Cannot find module 'C:\Users\maya\countdown.js'. What does that mean? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="node" transcript="node/countdown"}
> That error means Node looked for the file `countdown.js` in the folder `C:\Users\maya\` — but it wasn't there, because you saved it in your Documents folder instead.
>
> Here's what's happening: when you type `node countdown.js`, Node.js looks for that file starting from whatever folder your terminal is currently "in" (this is called the **current working directory**). The error message shows you exactly where it looked — `C:\Users\maya\` — which tells you your terminal is sitting in your main user folder, not in Documents.
>
> So the file exists, but the terminal isn't looking in the right place to find it.
>
> Let me know if you'd like help fixing it — there are a couple of ways to do it (like navigating to the right folder, or typing the full path to the file).
:::

That's exactly right, and the error message is more helpful than it looks: it shows the full path where Node looked, `C:\Users\maya\countdown.js`, which tells you the terminal was in `C:\Users\maya`, not in `Documents`. There are two fixes:

- **Move the terminal to the file:** type `cd Documents`, then `node countdown.js` again.
- **Work in VS Code with the folder open,** so the terminal starts in the right place.

This is the most common problem people have when they start with Node. When Node can't find a file, look at the path in the message, and compare it with where the file really is.

When it works, the terminal shows the script's `console.log` output:

<pre class="code" data-environment="message">
Days until the next garden club workday: 3
</pre>

## Errors in Node

When a script has an error, Node stops and prints it in the terminal, with more detail than you've seen elsewhere. Try it: add a typo, such as `today.getDya()`, and run the script again. You'll see something like:

<pre class="code" data-environment="message">
C:\Users\maya\Documents\garden-scripts\countdown.js:3
const dayOfWeek = today.getDya()
                        ^

TypeError: today.getDya is not a function
    at Object.&lt;anonymous&gt; (C:\Users\maya\Documents\garden-scripts\countdown.js:3:25)
</pre>

The first line gives the file and the line number, 3. Then it shows the line, with a `^` pointing at the problem, and the error itself, a TypeError you'd recognize from any platform. The lines starting with `at` are the **stack trace**, which lists where the error happened and what called it. For now, the first line of it, with your file's name, is the useful one.

Two more things to know about running scripts:

- **Stopping a script.** If a script runs longer than you want, perhaps because of an infinite loop from [Loops and Repetition](loops){.book-link}, press **Ctrl+C** in the terminal. It works on a Mac too, not Cmd+C.
- **Browser code doesn't all work.** Code that uses `document` or `alert` fails in Node with an error like `ReferenceError: document is not defined`, because there's no page. If you see that, the code was written for a browser.

## Your Learner Profile

::: {.ai-profile lesson="node"}
Environment: I'm writing JavaScript that runs with Node.js on my own computer, editing files in Visual Studio Code and running them in a terminal.

Add to "What I know so far":

- running a JavaScript file with node filename.js in a terminal
- terminal basics: the current working directory, pwd, ls or dir, cd and cd ..
- opening a project folder in VS Code and using its terminal
- reading Node's error messages and stack traces, and stopping a script with Ctrl+C
- that Node has no document or window, because there's no web page
:::

The environment line is the only change to your rules. Everything else you've learned comes along, which will matter in the next lessons: Node code uses modern JavaScript, including array methods and `async` and `await`, all of which you know.

## Summary

Node.js runs JavaScript on your own computer, with the same language you know and different built-in tools: no `document`, but access to files, folders and the network. Install the LTS version from nodejs.org, taking the version number from the site rather than from an assistant's memory. A terminal is always in a folder, the current working directory, and commands like `cd`, `ls` or `dir`, and `pwd` let you move around and look. `node filename.js` runs a file, which Node looks for starting from the current working directory, so "Cannot find module" usually means the terminal is in the wrong folder. VS Code, with a project folder open, gives you an editor and a terminal that starts in the right place. Next, you'll split your code into modules, and use code other people have published.
