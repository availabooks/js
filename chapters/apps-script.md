---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain what Google Apps Script is and what it can do in Google Sheets.
2. Open the Apps Script editor for a spreadsheet and find your way around it.
3. Describe what a function is and why Apps Script code goes inside one.
4. Run a function and read its output in the Execution log.
5. Decide whether to approve the permissions a script asks for.
:::
:::

## From the Browser to Google Sheets

So far, your code has run in this book's editors, where all it could do was display things. That's a good way to learn, but most real work involves data: lists of people, schedules, budgets, inventories. A lot of that data lives in spreadsheets.

**Google Apps Script** lets JavaScript work with that data. It's JavaScript, running on Google's servers, with extra tools for working with Google's apps: Sheets, Gmail, Calendar, Docs and Drive. Everything you've learned still applies. What's new is that your code can reach into a spreadsheet, read what's there, and change it.

::: {.term}
> **Google Apps Script** — A version of JavaScript, provided free by Google, that can read and change Google Sheets, send Gmail, create Calendar events and work with other Google apps.
:::

Google Sheets is a good place to learn to program, for three reasons:

- **You can see the results.** When your code writes a value or changes a format, the change appears in the sheet in front of you.
- **The structure is already there.** Rows, columns and cells give your data a shape, so you don't have to design one.
- **Everything is free.** You need only a Google account, and nothing to install.

Here are a few of the things people build with Apps Script and Sheets. You'll build versions of several of them in this book:

- Tools that clean up data, such as standardizing names or dates
- Reports that summarize a sheet with one click
- Emails sent automatically, based on what's in a sheet
- Custom menus and buttons inside a spreadsheet
- Scripts that run on a schedule, or whenever a form is submitted

## Opening the Apps Script Editor

Every Google Sheet can have its own Apps Script project attached to it. To open one:

1. Create a new spreadsheet by going to **sheets.new** in your browser. (You need to be signed in to a Google account.)
2. In the menu bar, click **Extensions**, then **Apps Script**.

![The Extensions menu in Google Sheets, with Apps Script highlighted.](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3j_ZQ5HXTAbC-DQiRbQOngEJNc3rQ-OHiKKCTnsovgeU16k4zbgiuLsrmReTfJSmFhBOMVNyUiVv4rMuF9kES2x3O7TkNbn7s1UqLZxURDNscVa79jioBfRWZrp_OCqShjwpMeK_0Ayr6yTFGs8OJJjcr1W6EUwWiYhtSRSOtbL1VpbxMEM-xkaFaLa0/s1600/84cd1741.png)

The Apps Script editor opens in a new browser tab.

You could also have asked your AI assistant how to get there. Here's what happened when this question was sent in a new chat that started with the learner profile from [Your First Lines of Code](first-code){.book-link}:

::: {.ai-conversation prompt="How do I open the Apps Script editor for my Google Sheet?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="first-code" transcript="apps-script/open-editor"}
> Here's how to open the Apps Script editor from a Google Sheet:
>
> 1. Open your Google Sheet
> 2. Click **Extensions** in the top menu
> 3. Click **Apps Script**
>
> This opens a new tab with the Apps Script editor, where you can write JavaScript-based code to interact with your spreadsheet.
>
> A couple of things to know:
> - Apps Script uses JavaScript, so what you're learning will apply here
> - It also has some extra built-in features (like `SpreadsheetApp`) that aren't part of standard JavaScript — those aren't on your "what I know so far" list, so if you start using them, let me know and I can explain them separately as new tools rather than assuming you already know them
>
> Want help with anything once you're in there, or are you just exploring for now?
:::

These steps match the screen exactly. That won't always be true of instructions for using an app, whether they come from an assistant or from a web page. Google, Microsoft and other companies rearrange their menus from time to time, while older instructions stay online. Before the current menus, for example, the editor was under **Tools**, then **Script editor**, and you'll still find instructions that say so. An assistant can learn from those older pages too. So when an assistant tells you where to click, check each step against what's on your screen. If they don't match, tell the assistant what you actually see.

Look at the reply's last section, too. The assistant noticed that Apps Script has tools, such as `SpreadsheetApp`, that aren't on your "what I know so far" list, and it offered to explain them as new tools rather than assume you know them. It was reading your profile carefully. The profile still says your code runs in "an online editor that shows console.log output," though, and now you're working in Sheets. You'll update the profile to match at the end of this lesson.

## A Tour of the Editor

When the editor opens, it looks like this:

![The Apps Script editor for a new project, showing the Code.gs file with an empty function called myFunction.](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8B09kVhscTTl6lJyGzklWN2kqMt7ZSY4Aa-vct7HmHR6GjRXVmIfFPC8G_DM0WaOMikBZMn784e6vapHIWLVVCf3jdXQsRuuzjKIO2zKTwFO8a6xq5130b4_q2-Q40qMQTPnDO4834vEnHiJMsqLMTnd-1gXK5yhiSH0ycr2Dw6XELt-zbi7OwtGjLl8/s1600/d467b986.png)

The main parts are:

- **Files,** on the left. A new project has one file, `Code.gs`, where your code goes. (`.gs` stands for Google Script.) Larger projects can have several files.
- **The code editor,** in the middle, where you write code.
- **The toolbar,** above the code, with a **Run** button, a **Debug** button, and a menu that shows the name of a function (here, `myFunction`).
- **The Execution log,** which opens below the code when you run something. It shows what your code displayed with `console.log`, and any errors.

::: {.nux}

The project is attached to the spreadsheet you opened it from. That's what lets its code read and change that sheet. The project is saved automatically, and you can get back to it any time through **Extensions**, then **Apps Script**.

:::

## A First Look at Functions

Notice that the new project isn't empty. It already contains this:

```{.code environment="appsscriptsheets"}
function myFunction() {

}
```

This is a **function**: a named group of steps. Apps Script needs functions because it doesn't run loose lines of code the way this book's editors do. Instead, you choose a function by name, from the menu in the toolbar, and click **Run**. Apps Script then runs the steps inside that function, from top to bottom.

::: {.term}
> **Function** — A named group of steps. In Apps Script, you run code by choosing a function and clicking Run.
:::

Here are the parts of a function:

::: {.f6f}

- **`function`** is a keyword that tells JavaScript a function is starting.
- **`myFunction`** is the function's name. It's what appears in the toolbar's menu.
- **`( )`** is a pair of parentheses. They're empty for now. You'll see what can go in them in a later lesson.
- **`{ }`** is a pair of curly braces. The steps of the function go between them, one per line.

:::

You've already been using functions without knowing it. `console.log` is a function, and each time you wrote `console.log("Hello")`, you *called* it. You told it to run, and the parentheses carried the value it should display. Writing your own function is the other half of the story: you define the steps, and Apps Script calls it when you click Run.

::: {.jnz}

A file can hold several functions. The menu in the toolbar lists them all, and **Run** runs whichever one is selected. That's handy, and it's also a common source of confusion: if you click Run and nothing seems to happen, check which function is selected.

:::

Give your functions names that say what they do, such as `writeGreeting` or `listUnpaidMembers`, not `myFunction`. Like the names of values, function names can't contain spaces, so this book uses *camelCase*: the first word in lowercase, and each word after it starting with a capital letter.

## Running Your First Script

Try it. Replace the empty function with this code:

```{.code environment="appsscriptsheets"}
function myFunction() {
  let count = 10
  console.log(count)
}
```

![The same function in the editor, with two lines added between the braces.](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQH1PqnDqi-QXT6DoByjraPWqGCbkdbNc8dJHFaY2fUd9befeIjBFcLDATgGGPTERA47c_XO5i9ALj9tRj2ESXQiyfH_BDugG0TvpDIt2YagNWtP-XD5nXRlddIS6WRwnnDFmMPCL5kEabRe7ohn_JG3t2JGzScvkwV5dSCb5APZKCqzKAlQID0kx5XZM/s1600/1637cacb.png)

The lines inside the braces are indented by two spaces. JavaScript doesn't require that, but indenting the steps inside a function makes it easy to see where the function starts and ends.

Make sure `myFunction` is selected in the toolbar's menu, then click **Run**:

![The toolbar with the Run button circled.](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmFx67OG_2-F0Or2T_2_nUhmnNcYMEpW-6mXcqTI8YP5BEyazIg8w56aMMiD8co-Gv_RLapr3CCQ9cw6Jh5OQ-rrPH73Uj1Xnp0kXvD0XDdH_wCb4Vtig4t7JQZ3gcT_axtXVrwRCQydhAH1yofuQ7yK1xCJI96CHLdPsEWWWlSx9_AovzmVfnHOnFTl4/s1600/8029f1d6.png)

The Execution log opens below the code:

![The Execution log, showing Execution started, then the value 10, then Execution completed.](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjP3hh-YYHn0EgM_VPlCLHqfmQ-CtJbjkncf_Ylaf5caooCSraRp5jF2c-wxQArAEuzWiu0NbzIjnrrJHmrfGfy_wbcvOs8EEB926WDeOrZMNPdbE1J7P7vwk6whzUGGxCYR1a-MSpgTA6spM2uWhofYUpNdMT6Vucm__o9vaI3bCdmslDaatH4Mew0qTw/s1600/9109882d.png)

::: {.bxj}

It has three entries. The first and last are notices from Apps Script saying when the function started and finished. The middle entry, marked *Info*, is the output of `console.log(count)`: the value 10.

:::

::: {.note}
> **The screenshots show semicolons.** The code in these screenshots ends its lines with semicolons. As you saw in [Your First Lines of Code](first-code){.book-link}, they're optional, and the code works the same either way.
:::

## Writing to Your Sheet

Displaying a value in the log works just like it did in this book's editors. The new part is changing the spreadsheet itself. Here's a request for that, sent with the learner profile from the previous lesson:

::: {.ai-conversation prompt="Write an Apps Script function that writes Hello into cell A1 of my Google Sheet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="first-code" transcript="apps-script/write-hello"}
> This request needs a couple of things you haven't learned yet:
>
> 1. **Functions** – Apps Script requires wrapping code in a function (like `function myFunction() { ... }`) so Google knows what to run. You've only learned statements and expressions so far, not how to define functions.
> 2. **Apps Script commands** – Writing to a Google Sheet needs special commands like `SpreadsheetApp.getActiveSpreadsheet()` and `.getRange().setValue()`, which aren't part of core JavaScript and aren't on your list yet.
>
> Would you like me to:
> - Explain what a function is first, since that's the next building block, or
> - Just show you the Apps Script code with extra comments explaining the new parts (functions and SpreadsheetApp), so you can see how it works even though it's ahead of your current lessons?
:::

The assistant didn't write the code, and that's the learner profile doing its job. The profile says to tell you when a task needs something you haven't learned, instead of using it. Writing to a sheet needs two new things, a function and Apps Script's commands for sheets, so the assistant named them and let you choose what to do next: learn about functions first, or see the code with extra comments.

This shows the other side of a learner profile: it has to keep up with you. You've already met functions in this lesson, but the profile doesn't know that. It still says your code runs in "an online editor" and lists nothing about Apps Script, so the assistant is right to hold back. At the end of this lesson you'll update the profile, and after that, requests like this one will get code.

First, though, here's the missing piece. This is the kind of line the assistant was describing:

```{.code environment="none"}
SpreadsheetApp.getActiveSheet().getRange("A1").setValue("Hello")
```

It's long, but it reads left to right, one step at a time. Each dot (`.`) means "and then, from what we have so far":

- **`SpreadsheetApp`** is Apps Script's tool for working with Google Sheets.
- **`.getActiveSheet()`** gets the sheet you're looking at, the one tab that's showing in the spreadsheet.
- **`.getRange("A1")`** gets cell A1 on that sheet. A *range* is one cell or a block of cells.
- **`.setValue("Hello")`** writes the value "Hello" into that cell.

Each of these steps is a **method**, an action that belongs to something, such as the spreadsheet tool, a sheet or a cell. You use a method by writing a dot after the thing it belongs to, then the method's name and parentheses. The parentheses work just as they do with `console.log`: they carry any values the method needs, such as which cell to get or what to write.

::: {.term .fv7}
> **Method** — An action that belongs to something, used with a dot: `getRange("A1")` is a method of a sheet, and `setValue("Hello")` is a method of a range.
:::

You don't need to memorize these. What matters is that you can read a line like this one and say what each part does. In the next lesson, you'll write the same steps on separate lines, which makes them easier to follow and check.

You can try the code right here. Below is a small practice sheet, and the editor under it can run Apps Script code against it, much as the real Apps Script editor runs code against your spreadsheet. Click **Run**, and watch cell A1:

```{.spreadsheet}
{"sheetName": "Practice", "rows": 5, "columns": 4, "data": [], "formats": []}
```

```{.code}
function writeHello() {
  SpreadsheetApp.getActiveSheet().getRange("A1").setValue("Hello")
}
```

Now change `"A1"` to `"B3"`, or change the message, and run it again.

To run it for real, paste the same function into your spreadsheet's Apps Script editor, choose `writeHello` in the toolbar's menu, and click **Run**. The first time, Apps Script asks for permission, as the next section describes.

## Giving Permission

The first time you run code that works with your spreadsheet, Apps Script stops and asks for permission. That's a safety feature. Code can read, change and delete data, and someone could try to trick you into running code that does harm. So Google asks you to approve what a script can do before it runs.

Here's what you'll see. First, a message that the script needs authorization. Click **Review permissions**:

![A dialog titled Authorization required, with Cancel and Review permissions buttons.](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhR8c6fPDH044_XrWrpK4wNhadf7g3a_6jL0SvBarMFDmauJCJK9nMXmidDn_QPVMfYATAiNRJZPjLxHY82IiPByc5L2GlOET3YFM3JNkrluHjTR-Tnr2i3dYdLjR0DAkdpCwjGo39YQIBc97Txre9joxgtHEwZvx2xj76c8FzjIPYO8v4NSKYCAK4aiX8/s1600/a67405fb.png)

After you choose your Google account, you'll see a warning that "Google hasn't verified this app":

![A warning page saying Google hasn't verified this app, with an Advanced link and a Back to safety button.](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgnxOFlrt_7D-HUUfe371b6D-5lAUk2VGIXmqoTf7arbM83PKfu0f1dkRzBPOkIhzWKdrRIQwV_0vcVUK0hHgD8D99ds6NGHhqF4w3YvwNPe2i0AcZjiLRAt7gmfRYjbyAc5mbj3xxF7FnTcxVuAdMVC1Hxzc-BJsC61OEJvROQxLZjr0UvpkJnaIc-Xyw/s1600/75d1cb3b.png)

This warning looks alarming, so read it carefully. It says the app hasn't been verified by Google "until the developer" verifies it, and it names the developer's email address. **The developer is you.** You wrote the script, so the address shown is your own. Google shows this warning for any script that hasn't been through its review process, which is meant for apps shared with the public, not for code you wrote for yourself.

If the address shown *isn't* yours, stop. That means you're running someone else's script, and you should only continue if you know and trust them and understand what the code does.

To continue with your own script, click **Advanced**, then the link that says **Go to Untitled project (unsafe)**. (The name changes if you've renamed your project.)

![The same warning with the Advanced section open, showing a link to go to Untitled project (unsafe).](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi58vQBbnMxMiEuu3Fbfq2KVOILoBL-5WgYlZF_x0NASyET16xoFQkQ2iDVYqVXes8bO8-nD0OOExPaiJqEio7jnpal__gF44BPM8gnbP-DWdH_UpMOMB8fYPsGGOSWcsp9tMVIRIhT53JgNZNcJAjLR9GPTvqVZTz0ephw6goSO-H7k3ZE-0Be_kKrpHw/s1600/6c44db2e.png)

Finally, Google lists what the script will be allowed to do:

![A consent page saying Untitled project wants access to your Google Account, and listing the permission See, edit, create, and delete all your Google Sheets spreadsheets.](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBrKg0BwVK7EM8Q8m6iHwrRpKM2nphUPb4Bg-lrQdHbKupzeJv7J0sjCVZr-EsSbjDTYRBykxamPYuOG0IMQv-Oi85qp9SjN2Qw-vdo10CxeQm_c_yuQDpx885SKC7A89OmetQDn0cIFtsz8RCl7xoWh0Ag_0P0Rrv9BX3iUXOi5wvhKbqwdUFgKl-I18/s1600/13fac37e.png)

This is the screen that matters. Read the list and ask: *does this match what I expect the code to do?* Code that writes "Hello" into a cell needs to change a spreadsheet, so a permission to edit spreadsheets makes sense. A permission to send email or delete files from your Drive would not, and would be a reason to stop and find out why.

If the list matches what you expect, click **Continue**. Apps Script remembers your approval for this project, so you won't be asked again unless you add code that needs a different permission. Sometimes the script runs right after you approve it, and sometimes it doesn't. If you don't see the result, click **Run** again.

When you're not sure why code needs a permission, ask your assistant. This question was a follow-up in the same chat as the request above:

::: {.ai-conversation prompt="What permissions will this code need when I run it, and why?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="first-code" transcript="apps-script/write-hello"}
> Good question! Here's what happens when you run Apps Script code that writes to a Google Sheet:
>
> **Permission needed:** Access to see, edit, create, and delete your Google Sheets spreadsheets (and sometimes Google Drive, depending on how the sheet is accessed).
>
> **Why:**
> - The code uses `SpreadsheetApp` to talk to Google Sheets — this requires Google to confirm you (the user) are allowing a script to interact with your spreadsheet data.
> - Since the script *writes* a value (not just reads), Google's permission system needs to grant "edit" access, not just "view" access.
> - The first time you run the script, Google will show a popup asking you to **review permissions** and **allow access**. This is a safety measure so scripts can't silently mess with your files without your knowledge.
>
> **What you'll likely see:**
> 1. A prompt saying something like *"This app wants to access your Google Sheets"*
> 2. A list of specific permissions (e.g., "See, edit, create, and delete your Google Sheets spreadsheets")
> 3. Buttons to **Allow** or **Cancel**
>
> You only need to approve this once per script (unless you edit the script significantly later).
>
> Would you like me to go ahead and show you the code now, with comments explaining the new parts?
:::

The main answer matches the permission screen: "see, edit, create, and delete" your spreadsheets. The reason is sound too. The code *writes* to a sheet, so it needs permission to edit, not just to view, and the approval step makes sure you're choosing to let it.

Now compare the rest with the screens you just went through. The assistant says you'll see buttons marked **Allow** or **Cancel**, but the real screen says **Continue**. It doesn't mention the "Google hasn't verified this app" warning at all, which is the most startling screen of the lot. It says you'll be asked again if you "edit the script significantly," when what matters is whether your changes need a *different* permission. And it doesn't point out that the permission covers *all* of your spreadsheets, not just the one this code writes to.

None of these slips would cause harm, and the explanation of *why* is good. But an assistant describing a screen it can't see is working from memory, and details drift. That's why you read the permission screen yourself.

::: {.tip}
> **Limit a script to one spreadsheet.** The permission above covers *all* of your spreadsheets, not just this one. For a script that only works with the spreadsheet it's attached to, you can narrow that. Put this comment at the very top of `Code.gs`:
>
> ```
> /** @OnlyCurrentDoc */
> ```
>
> Apps Script then asks only for access to the current spreadsheet. It's a good habit for scripts you write for a single sheet.
:::

::: {.caution}
> **Approve only what you understand.** The permission screen is your last chance to catch code that does more than it should. Never approve permissions for code you can't explain, or for a script someone else sent you that you haven't read.
:::

## Your Learner Profile

Your code now runs in a different place, so your learner profile needs to say so. You've also learned what a function is, and there's one new rule:

::: {.learner-profile .d18}
:::

Here's what changed:

- **Where your code runs.** The first paragraph now says you're writing Apps Script in the editor attached to a Google Sheet. That tells the assistant which tools your code can use, such as `SpreadsheetApp`, and where to look for output.
- **A new rule about functions.** You know what a function is, but not yet how functions pass values to each other. Assistants sometimes split even a small task into several functions that hand values back and forth, which is harder to follow. This rule keeps all the code in one function you can run from the menu. You'll learn the rest in the lesson on functions, and that lesson will remove this rule.
- **Four new items** under "What I know so far," including reading a line of Apps Script like the one that writes Hello into cell A1. With this profile, the request for that code should now get an answer.

## Summary

Google Apps Script is JavaScript with tools for working with Google's apps, and in this book you'll use it mostly with Google Sheets. Each spreadsheet can have an Apps Script project, which you open through **Extensions**, then **Apps Script**. Code in Apps Script goes inside functions, which are named groups of steps written as `function name() { }`. You run one by choosing it in the toolbar's menu and clicking **Run**, and its `console.log` output appears in the Execution log. The first time a script works with your data, Google asks you to approve its permissions. The "unverified app" warning names you as the developer, because you wrote the script. Approve permissions only when they match what you expect the code to do.
