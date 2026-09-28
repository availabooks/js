---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Describe the jobs of HTML, CSS and JavaScript in a web page.
2. Write a complete HTML page with headings, lists, links, images and a style section.
3. Style a page with CSS, using tag, class and id selectors.
4. Change a page with JavaScript through the DOM, using `document.querySelector` and `textContent`.
5. Use the browser's developer tools to find errors and inspect a page.
6. Recognize when a rule in your learner profile doesn't fit a new language, and fix it.
:::
:::

## From Apps Script to the Browser

For the last seventeen lessons, your JavaScript has run on Google's computers, inside Apps Script. In this part of the book, it runs in your own web browser, the way JavaScript was first meant to. Every web page you visit is built from three languages, each with its own job:

- **HTML** describes the *content*: headings, paragraphs, lists, images and links. You met it in [A Web App with Apps Script](web-app){.book-link}.
- **CSS** describes how the content *looks*: colors, fonts, spacing and layout.
- **JavaScript** describes how the page *behaves*: what happens when you click, what changes over time, what's fetched from elsewhere.

Everything you've learned about JavaScript still applies. What's new is what your code works with: instead of sheets and ranges, a page and its parts.

The club's case for this part is its website. Maya wants a simple site with the club's news, a calendar of workdays and, eventually, live garden data. By the end of this part, it will be online for anyone to visit.

### Where you'll write and run pages

You can try pages in three places:

- **This book's HTML editors.** Code in an editor marked for HTML shows the page below it when you run it.
- **A file on your computer.** Create a plain text file, save it with a name ending in `.html`, such as `garden.html`, and open it in your browser (double-click it, or drag it onto a browser window). Edit the file, save, and reload the page to see the change. Any plain text editor works, such as Notepad on Windows or TextEdit on a Mac (in TextEdit, choose **Format**, then **Make Plain Text** first). A code editor such as the free Visual Studio Code is nicer, and you'll install it later in the book.
- **The browser's developer tools,** which you'll meet later in this lesson.

## The Structure of a Page

In the last lesson, HTML was a few tags in a string. A complete page has a standard structure:

<pre class="code" data-environment="html">
&lt;!doctype html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;College Community Garden&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;College Community Garden&lt;/h1&gt;
    &lt;p&gt;A student club growing food and community since 2027.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

- **`<!doctype html>`** tells the browser this is a modern HTML page. It always comes first.
- **`<html>`** wraps everything else.
- **`<head>`** holds information *about* the page that isn't shown in it, such as the **`<title>`**, which appears on the browser tab, and, as you'll see, the page's CSS.
- **`<body>`** holds everything that appears on the page.

The indentation is only for people. The browser ignores it, but it makes it much easier to see which tags are inside which.

## More HTML

A handful of tags covers most pages:

<pre class="code" data-environment="html">
&lt;h1&gt;College Community Garden&lt;/h1&gt;
&lt;h2&gt;Upcoming workdays&lt;/h2&gt;
&lt;ul&gt;
  &lt;li&gt;Saturday, May 1&lt;/li&gt;
  &lt;li&gt;Saturday, May 8&lt;/li&gt;
&lt;/ul&gt;
&lt;h2&gt;How to join&lt;/h2&gt;
&lt;ol&gt;
  &lt;li&gt;Fill in the sign-up form.&lt;/li&gt;
  &lt;li&gt;Come to a workday.&lt;/li&gt;
&lt;/ol&gt;
&lt;p&gt;Questions? &lt;a href="https://example.com"&gt;Contact the club&lt;/a&gt;.&lt;/p&gt;
&lt;img src="garden-photo.jpg" alt="Volunteers weeding the raised beds"&gt;
</pre>

- **`<h2>`** is a second-level heading, for sections. There are six levels, `<h1>` to `<h6>`.
- **`<ul>`** is a bulleted list and **`<ol>`** a numbered one. Each item is an **`<li>`**.
- **`<a>`** is a link. Its **attribute** `href` says where it goes. Attributes, like `border` in the last lesson, are written inside the opening tag as `name="value"`.
- **`<img>`** shows an image, from the address in `src`. It has no closing tag, because it has no content. The `alt` attribute describes the image for people who can't see it, including anyone using a screen reader, and it appears in place of the image if the image doesn't load. There's no `garden-photo.jpg` here, so that's what you see when you run this example. Always include `alt`.

Two more tags have no meaning of their own, and are used to group things so CSS or JavaScript can find them: **`<div>`** for a block, such as a section of the page, and **`<span>`** for a few words inside a line.

Any tag can also have an **`id`** attribute, a name that's unique on the page, and a **`class`** attribute, a name shared by all the elements that should be treated alike. You'll use both in a moment.

::: {.term}
> **Attribute** — Extra information in an HTML opening tag, written as `name="value"`, such as `href` on a link or `class` on any element.
:::

## CSS: How the Page Looks

CSS is a list of **rules**. Each rule has a **selector**, which says which elements it applies to, and one or more **declarations** in curly braces, each a property and a value. It usually goes in a `<style>` tag in the page's `<head>`:

<pre class="code" data-environment="html">
&lt;!doctype html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Garden&lt;/title&gt;
    &lt;style&gt;
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f9f4;
        margin: 20px;
      }
      h1 {
        color: darkgreen;
      }
      .note {
        border: 1px solid green;
        padding: 10px;
      }
      #workday-count {
        font-weight: bold;
      }
    &lt;/style&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;College Community Garden&lt;/h1&gt;
    &lt;p class="note"&gt;Bring gloves and water to every workday.&lt;/p&gt;
    &lt;p&gt;Regular text.&lt;/p&gt;
    &lt;p class="note"&gt;Workdays start at 9:00.&lt;/p&gt;
    &lt;p id="workday-count"&gt;Three workdays this month.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

There are three kinds of selectors here:

- **A tag name,** such as `body` or `h1`, applies to every element of that kind.
- **A dot and a class name,** such as `.note`, applies to every element with `class="note"`. Both "note" paragraphs get a border.
- **A `#` and an id,** such as `#workday-count`, applies to the one element with that id.

The properties are mostly readable: `color` for text color, `background-color`, `font-family` for the typeface (with a general fallback like `sans-serif` at the end), `font-weight`. A few need a word of explanation:

- **Colors** can be names, such as `darkgreen`, or codes like `#f4f9f4`, which mix red, green and blue in amounts from `00` to `ff`.
- **`margin`** is space *outside* an element's edge, and **`padding`** is space *inside* it, between the edge and the content.
- **`border`** takes three values: the thickness, the style (`solid`, `dashed` and others) and the color.

Notice the punctuation. Each declaration ends with a **semicolon**. In JavaScript, the book leaves semicolons out because they're optional. In CSS they're not: they're what separates one declaration from the next. Remember that; you'll see why it matters shortly.

::: {.term}
> **CSS** — Cascading Style Sheets, the language that describes how HTML looks, as rules made of a selector and declarations: `h1 { color: darkgreen; }`.
:::

## The DOM: JavaScript Meets the Page

When the browser loads a page, it turns the HTML into a set of objects, one for each element, arranged like the tags: the `body` object contains the `h1` object, and so on. This structure is called the **DOM**, the Document Object Model. JavaScript doesn't change the HTML file. It changes the DOM, and the browser updates what you see.

::: {.term}
> **DOM** — Document Object Model: the browser's objects representing a page's elements, which JavaScript can find and change.
:::

JavaScript goes in a **`<script>`** tag. To change an element, you first find it with **`document.querySelector`**, which takes a CSS selector, the same kind you just used, and returns the first element that matches. Then you change it, for example with **`textContent`**, the text inside it:

<pre class="code" data-environment="html">
&lt;h1&gt;College Community Garden&lt;/h1&gt;
&lt;p id="message"&gt;This text will be replaced.&lt;/p&gt;

&lt;script&gt;
  const message = document.querySelector("#message")
  message.textContent = "Welcome! The next workday is Saturday."
  console.log("The script ran")
&lt;/script&gt;
</pre>

`document` is an object representing the whole page, the way `SpreadsheetApp` represented the spreadsheet. `querySelector("#message")` finds the element whose id is "message," and assigning to its `textContent` property replaces its text.

## The Browser's Developer Tools

Every major browser has built-in tools for people who build pages. In Chrome or Edge, press **F12** (or **Ctrl+Shift+I** on Windows, **Cmd+Option+I** on a Mac), or right-click anything on a page and choose **Inspect**. Two panels matter most for now:

- **Console** shows `console.log` output and error messages from the page's JavaScript. When a page doesn't do what you expect, look here first, the same way you checked the Execution log in Apps Script. You can also type JavaScript here and run it on the page.
- **Elements** shows the page's DOM as tags. Click an element to see the CSS that applies to it, and try changing a value to see the effect immediately. Nothing you change here is saved; reload the page to undo it.

::: {.screenshot-needed file="images/web-pages-devtools.png"}
Chrome's developer tools open beside a simple page, with the Elements panel showing the page's tags and the Styles pane showing a CSS rule for h1.
:::

Open a file you've made, press F12, and look at both panels. On some school computers, the developer tools are turned off. If yours are, you can still do everything in this book's editors, which show console output below the page.

## Your Profile Moves to the Browser

Your learner profile still says you're writing Apps Script. Before asking for a web page, it needs a new environment line, and a few rules that only make sense in Apps Script need to say so. The updated profile is at the end of this lesson, with an explanation of each change. The replies below were captured with it, except for one fix to the semicolon rule that you'll see the reason for in a moment.

## Asking for a Page

Here's the request, in a new chat with the updated profile:

::: {.ai-conversation prompt="Write a simple home page for our club, the College Community Garden. It should have a heading, a short paragraph about the club, a list of three upcoming Saturday workdays in May 2027, and a little CSS to make it look nice. At the bottom, use JavaScript to show how many workdays are listed." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="web-pages" transcript="web-pages/home-page"}
> Here's a home page for your club. Since this is a plain HTML file (not deployed as a web app), only people who open this file in their own browser will see it — there's no private data here anyway, just public club info.
>
> ```html
> <!doctype html>
> <html>
> <head>
>   <title>College Community Garden</title>
>   <style>
>     /* This sets the font and background for the whole page */
>     body {
>       font-family: Arial, sans-serif
>       background-color: #f4f9f4
>       margin: 20px
>     }
>
>     /* This styles the main heading */
>     h1 {
>       color: #2e7d32
>     }
>
>     /* This styles the list of workdays */
>     ul {
>       background-color: white
>       padding: 15px 30px
>       border: 1px solid #cde5cd
>     }
>
>     /* This styles the count message at the bottom */
>     #count {
>       font-weight: bold
>       color: #2e7d32
>     }
>   </style>
> </head>
> <body>
>
>   <h1>College Community Garden</h1>
>
>   <p>
>     The College Community Garden is a student-run club where we grow
>     vegetables and flowers together, share what we harvest, and learn
>     about sustainable gardening. Everyone is welcome, no experience needed!
>   </p>
>
>   <h2>Upcoming Workdays</h2>
>   <ul>
>     <li>Saturday, May 1, 2027</li>
>     <li>Saturday, May 15, 2027</li>
>     <li>Saturday, May 29, 2027</li>
>   </ul>
>
>   <p id="count"></p>
>
>   <script>
>     // This array holds the same workdays listed above, just so we can count them
>     const workdays = ["May 1", "May 15", "May 29"]
>
>     // This finds how many workdays are in the array
>     const workdayCount = workdays.length
>
>     // This finds the paragraph on the page where the count should go
>     const countParagraph = document.querySelector("#count")
>
>     // This puts a message with the count into that paragraph
>     countParagraph.textContent = `There are ${workdayCount} workdays scheduled.`
>   </script>
>
> </body>
> </html>
> ```
>
> **How it works:**
> - The `ul` and `li` tags create the visible list of workdays in the HTML.
> - The `workdays` array in the script is a separate list of the same dates, just used so we can count them with `.length`.
> - `document.querySelector("#count")` finds the empty paragraph with `id="count"`.
> - `textContent` fills that paragraph with a sentence showing the count, built with a template literal.
>
> One thing to note: the workday dates are typed twice (once in the HTML list, once in the array). That's a bit repetitive, but it keeps things simple with what you've learned so far. Later on, you could learn `querySelectorAll` to count the actual `li` elements instead — happy to explain that if you want a preview.
:::

**Read.** You can read all three languages now:

- **The HTML** is the structure you learned: a doctype, a head with a title and a style section, and a body with a heading, a paragraph, a list and an empty paragraph with `id="count"` for the message.
- **The CSS** styles the body, the heading, the list and the count paragraph, using tag selectors and one id selector.
- **The JavaScript** counts an array and puts a message in the count paragraph with `querySelector` and `textContent`, following your profile's rules: `const`, one step per line, and no semicolons.

The assistant opened with a note about who can see the page, following your profile's web page rule. It also pointed out a weakness in its own design: the dates are typed twice, once in the list and once in the array, so a change to one could be missed in the other.

Did you spot the problem? Run the page:

<pre class="code" data-environment="html">
&lt;!doctype html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;College Community Garden&lt;/title&gt;
  &lt;style&gt;
    /* This sets the font and background for the whole page */
    body {
      font-family: Arial, sans-serif
      background-color: #f4f9f4
      margin: 20px
    }

    /* This styles the main heading */
    h1 {
      color: #2e7d32
    }

    /* This styles the list of workdays */
    ul {
      background-color: white
      padding: 15px 30px
      border: 1px solid #cde5cd
    }

    /* This styles the count message at the bottom */
    #count {
      font-weight: bold
      color: #2e7d32
    }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;

  &lt;h1&gt;College Community Garden&lt;/h1&gt;

  &lt;p&gt;
    The College Community Garden is a student-run club where we grow
    vegetables and flowers together, share what we harvest, and learn
    about sustainable gardening. Everyone is welcome, no experience needed!
  &lt;/p&gt;

  &lt;h2&gt;Upcoming Workdays&lt;/h2&gt;
  &lt;ul&gt;
    &lt;li&gt;Saturday, May 1, 2027&lt;/li&gt;
    &lt;li&gt;Saturday, May 15, 2027&lt;/li&gt;
    &lt;li&gt;Saturday, May 29, 2027&lt;/li&gt;
  &lt;/ul&gt;

  &lt;p id="count"&gt;&lt;/p&gt;

  &lt;script&gt;
    // This array holds the same workdays listed above, just so we can count them
    const workdays = ["May 1", "May 15", "May 29"]

    // This finds how many workdays are in the array
    const workdayCount = workdays.length

    // This finds the paragraph on the page where the count should go
    const countParagraph = document.querySelector("#count")

    // This puts a message with the count into that paragraph
    countParagraph.textContent = `There are ${workdayCount} workdays scheduled.`
  &lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;
</pre>

The heading is green, but the page has no background color, no Arial font and no border around the list. Here's what the assistant said when asked:

::: {.ai-conversation prompt="When I open the page, the heading is green, but the background color, the font and the border around the list don't appear. Why? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="web-pages" transcript="web-pages/home-page"}
> Good observation! This is happening because of how CSS is written, not because of a mistake in the HTML structure.
>
> In the `style` tag, each property needs a semicolon (`;`) after it to separate it from the next property. For example:
>
> ```css
> body {
>   font-family: Arial, sans-serif;
>   background-color: #f4f9f4;
> }
> ```
>
> But in the code I wrote, the semicolons are missing between properties, like this:
>
> ```css
> body {
>   font-family: Arial, sans-serif
>   background-color: #f4f9f4
> }
> ```
>
> CSS reads this as one long, broken declaration instead of two separate ones. The browser can only make sense of the *first* property in each block (`font-family` for `body`, `color` for `h1`, `background-color` for `ul`), and it ignores the rest because it doesn't know where one property ends and the next begins.
>
> That's why:
> - `h1`'s `color` works — it's the only property in that block, so nothing is missing.
> - `body`'s `font-family` might work, but `background-color` gets ignored.
> - `ul`'s `background-color` might work, but `padding` and `border` get ignored.
>
> This is a case where a rule you learned for JavaScript (no semicolons at the end of lines) doesn't carry over to CSS — CSS has its own syntax rules, and it *requires* semicolons between properties inside a block.
>
> Want me to fix it now, or do you want to try fixing it yourself first?
:::

The heart of the explanation is right: CSS needs a semicolon after each declaration, and without them, the declarations run together into one that makes no sense. The `h1` rule works only because it has a single declaration.

The details are wrong, though. The assistant says the first property in each rule "might work." You can see that it doesn't: the font didn't change. When declarations run together, the browser reads them as one long, invalid value for the *first* property, and throws the whole thing away. You told the assistant the font didn't appear, and its explanation contradicted what you saw. When that happens, believe your screen.

The more interesting question is *why* the semicolons were missing. Your profile says "Don't use semicolons at the ends of lines," and the assistant followed it, in a language where the rule doesn't belong. It's your rule, written when JavaScript was the only language you used. The fix belongs in the profile, and it's in the updated version at the end of this lesson: no semicolons in JavaScript, but CSS still needs them.

This is a lesson about profiles in general. Rules are written for a situation, and when the situation changes, such as a new language or a new platform, some of them need to change too. When an assistant does something odd, ask whether your profile told it to.

## Where the Script Goes

One more common problem. Suppose you move the `<script>` tag from the bottom of the body up into the head:

::: {.ai-conversation prompt="Separate question. I moved the script tag into the head, above the style tag, and now the count doesn't appear. The Console says: Uncaught TypeError: Cannot set properties of null (setting 'textContent'). What does that mean? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="web-pages" transcript="web-pages/home-page"}
> This error happens because of the order the browser reads the page in.
>
> When the browser loads an HTML page, it reads through the file from top to bottom, building the DOM (the page's structure) as it goes. When it reaches a `script` tag, it stops and runs that JavaScript right away, *before* reading the rest of the page.
>
> Your script tag is now in the `head`, which comes *before* the `body`. So when the line
>
> ```js
> const countParagraph = document.querySelector("#count")
> ```
>
> runs, the browser hasn't read the `body` yet — the `<p id="count"></p>" element doesn't exist in the DOM yet. Since `querySelector` can't find something that isn't there, it returns `null` (meaning "nothing found") instead of the paragraph.
>
> Then this line:
>
> ```js
> countParagraph.textContent = `There are ${workdayCount} workdays scheduled.`
> ```
>
> tries to set `textContent` on `countParagraph`, but `countParagraph` is `null`, not an element. You can't set a property on `null`, so JavaScript throws the error: `Cannot set properties of null (setting 'textContent')`.
>
> This is why the script tag is usually placed at the *bottom* of the `body` — so all the HTML above it has already been read and turned into DOM elements before the script tries to find them.
>
> Want me to fix it now, or do you want to try first?
:::

That's right, and worth remembering. The browser reads a page from top to bottom and runs each script as soon as it reaches it. A script in the head runs before the body has been read, so `querySelector` finds nothing and returns `null`, and setting a property of `null` is an error. See it for yourself:

<pre class="code" data-environment="html">
&lt;script&gt;
  const message = document.querySelector("#message")
  message.textContent = "Found it!"
&lt;/script&gt;
&lt;p id="message"&gt;Original text.&lt;/p&gt;
</pre>

The error message is a good one to recognize: "Cannot set properties of null" almost always means `querySelector` didn't find what you asked for, either because the element doesn't exist *yet*, or because the selector has a typo. Putting scripts at the end of the body avoids the first problem.

## The Finished Page

Here's the page with its CSS fixed, and one improvement: the workdays are in *one* place, an array, and the script builds the list from it. That removes the duplication the assistant pointed out.

<pre class="code" data-environment="html">
&lt;!doctype html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;College Community Garden&lt;/title&gt;
    &lt;style&gt;
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f9f4;
        margin: 20px;
      }
      h1 {
        color: #2e7d32;
      }
      ul {
        background-color: white;
        padding: 15px 30px;
        border: 1px solid #cde5cd;
      }
      #count {
        font-weight: bold;
        color: #2e7d32;
      }
    &lt;/style&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;College Community Garden&lt;/h1&gt;
    &lt;p&gt;A student-run club where students and neighbors grow food together, share the harvest, and learn to garden sustainably. Everyone is welcome, and no experience is needed.&lt;/p&gt;
    &lt;h2&gt;Upcoming Workdays&lt;/h2&gt;
    &lt;ul id="workdays"&gt;&lt;/ul&gt;
    &lt;p id="count"&gt;&lt;/p&gt;

    &lt;script&gt;
      // the workdays are listed once, here, and the page is built from them
      const workdays = ["Saturday, May 1, 2027", "Saturday, May 15, 2027", "Saturday, May 29, 2027"]

      let listHtml = ""
      for (let i = 0; i &lt; workdays.length; i++) {
        listHtml += `&lt;li&gt;${workdays[i]}&lt;/li&gt;`
      }
      const list = document.querySelector("#workdays")
      list.innerHTML = listHtml

      const count = document.querySelector("#count")
      count.textContent = `There are ${workdays.length} workdays scheduled.`
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

The new property is **`innerHTML`**. `textContent` sets an element's *text*: anything in it, including `<`, is shown as it is. `innerHTML` sets its *HTML*: the string is read as tags. Here that's what you want, because the string contains `<li>` tags. But it's the same rule you met in [A Web App with Apps Script](web-app){.book-link}: text inserted into HTML is read as HTML. Use `innerHTML` only with HTML you built yourself from text you trust, and `textContent` for anything else, especially anything a person typed.

Add a fourth workday to the array, and run it again. The list and the count both update.

## Your Learner Profile

::: {.ai-profile lesson="web-pages"}
Environment: I'm writing web pages with HTML, CSS and JavaScript, and opening them in my web browser.

Remove rules:

- Don't use semicolons at the ends of lines.
- Put the steps for each task in a function with no parameters and a descriptive name, so I can run it from the Apps Script editor. That function can call other functions.
- When code needs a trigger, tell me how to set it up in the Apps Script editor, and how to test it without waiting for the event.
- Keep secrets such as webhook addresses and API keys out of the code. Store them in Script Properties.

Add rules:

- Don't use semicolons at the ends of lines in JavaScript. CSS still needs a semicolon after each property.
- When I'm working in Apps Script, put the steps for each task in a function with no parameters that I can run from the editor, and when code needs a trigger, tell me how to set it up and test it.
- Keep secrets such as webhook addresses and API keys out of the code. In Apps Script, store them in Script Properties. In a web page, remember that anyone who opens the page can read its code.

Add to "What I know so far":

- the structure of an HTML page: doctype, html, head, title and body
- more HTML: h2, ul, ol, li, a with href, img with src and alt, div and span, and the id and class attributes
- CSS in a style tag: selectors for tags, classes (.name) and ids (#name), and properties such as color, font-family, margin, padding and border
- the DOM, and changing a page with a script tag at the end of the body: document.querySelector(), textContent and innerHTML
- opening a page's developer tools (F12) to see the Console and the Elements panel
:::

What changed, and why:

- **The environment.** Your code now runs in a browser, so the first paragraph says so. This one line tells the assistant which tools your code can use: the DOM, not `SpreadsheetApp`.
- **The semicolon rule** now says it's about JavaScript, after it leaked into CSS.
- **Two Apps Script rules now start with "When I'm working in Apps Script."** The rule about a function you can run from the editor, and the one about triggers, only make sense there. Rather than deleting them, the profile keeps them for when you go back to Apps Script, as many readers will.
- **The secrets rule** now covers web pages, with an important difference: a web page's code is sent to every visitor's browser, and anyone can read it with the developer tools. A secret in a web page isn't secret at all.
- **Everything you know comes along,** including Apps Script. That's the point of the profile: your knowledge travels with you to a new platform, and only the environment and a few rules change.

## Summary

A web page is built from three languages: HTML for content, CSS for appearance and JavaScript for behavior. A page has a standard structure, a head with its title and styles and a body with its content, and tags for headings, lists, links and images, with attributes like `href`, `alt`, `id` and `class`. CSS rules select elements by tag, class or id, and each declaration ends with a semicolon. The browser turns HTML into the DOM, and a script at the end of the body can find elements with `document.querySelector` and change them with `textContent`, or with `innerHTML` for HTML you built yourself. The developer tools' Console shows errors, and the Elements panel shows the DOM. Moving to a new platform means updating your learner profile: the environment line, and any rule written for a situation that has changed, as the semicolon rule showed. Next, your pages will respond to clicks and typing.
