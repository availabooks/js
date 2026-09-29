---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Organize a website as a folder of files, with CSS and JavaScript in their own files.
2. Use relative paths, and explain why a site that works on your computer can break online.
3. Publish a site for free with a static hosting service, and update it.
4. Check a published site for problems with the developer tools.
5. Explain what becomes public when you publish a site.
:::
:::

## A Website Is a Folder

The club's home page, with its forecast and its plant-spacing calculator, works on your computer. Now it needs to be somewhere anyone can visit. Before it goes online, it's worth organizing it the way websites usually are: as a **folder of files**, rather than one page with everything inside it.

Until now, each page kept its CSS in a `<style>` tag and its JavaScript in a `<script>` tag. A real site usually puts them in files of their own:

```{.code environment="none"}
club-site/
  index.html
  style.css
  script.js
  garden.jpg
```

The page then *links* to them:

```{.code environment="none"}
<!doctype html>
<html>
  <head>
    <title>College Community Garden</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>College Community Garden</h1>
    <img src="garden.jpg" alt="Volunteers weeding the raised beds">
    <script src="script.js"></script>
  </body>
</html>
```

- **`<link rel="stylesheet" href="style.css">`** in the head loads the CSS from `style.css`. The CSS file holds exactly what used to go between the `<style>` tags.
- **`<script src="script.js"></script>`** at the end of the body loads and runs the JavaScript from `script.js`. It still needs its closing tag, even though it's empty.

Separate files are easier to work with as a site grows. Several pages can share one stylesheet, so changing the club's colors means changing one file. You've already met one place that requires this: the extension in [Building a Browser Extension](extension){.book-link}.

::: {.czb}
One file name is special. **`index.html`** is the page a web server sends when someone visits the site's address without naming a page, so every site's home page is called `index.html`.
:::

### Relative paths

The `href` and `src` values above are **relative paths**: they describe where a file is *relative to the page*. `style.css` means "in the same folder as this page." `images/garden.jpg` would mean "in the `images` folder, inside this page's folder," and `../style.css` means "in the folder *above* this one."

Relative paths keep working when the whole folder moves, from your computer to a server, because the files stay in the same places relative to each other. You'll see what happens with the other kind shortly.

::: {.term}
> **Relative path** — A file's location described from the current page's folder, such as `style.css` or `images/garden.jpg`. An *absolute* path starts from the top of a disk or a website, such as `C:\Users\...` or `https://...`.
:::

## Where to Put It

A site made only of files, with no program running on the server, is called a **static site**, and several companies host static sites for free. The club's site is static: the forecast is fetched by the visitor's browser, not by the server. Here's the question, in a new chat with your learner profile from [Building a Browser Extension](extension){.book-link}:

::: {.ai-conversation prompt="Our club's website is a folder with three files: index.html, style.css and script.js, plus a photo, garden.jpg. What's the easiest free way to put it online so anyone can visit it? I've never used GitHub or anything like it." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="extension" transcript="publishing/go-live"}
> Here's the easiest option for a beginner: **Netlify Drop**. You don't need to install anything or learn Git.
>
> **Steps:**
>
> 1. Go to `app.netlify.com/drop` in your web browser.
> 2. You'll see a box that says something like "drag and drop your site here."
> 3. Open the folder on your computer that has all four files (`index.html`, `style.css`, `script.js`, `garden.jpg`).
> 4. Drag that whole folder into the box on the Netlify page.
> 5. Netlify uploads the files and gives you a web address right away, like `https://random-name-123.netlify.app`.
> 6. Click that address to see your site live.
>
> **A few things to know:**
>
> - The free address Netlify gives you will have a random name. If you make a free account (just an email and password), you can rename it to something like `ourclub.netlify.app` and come back later to update the site.
> - Without an account, that "drop" is temporary and harder to update — so I'd suggest making the free account if you plan to keep this site around.
> - To update the site later, you sign in, go to your site, and drag the folder in again.
>
> **Who can see it and what it shows:** Once it's live, anyone with the web address can open it — it's public, not private. Make sure nothing in `index.html`, `style.css`, or `script.js` contains information you don't want the public to see (like personal phone numbers or addresses), since anyone can also view the page's source code in their browser.
>
> Want me to walk through making the free account and renaming the site, once you've tried the drag-and-drop step?
:::

Netlify Drop is a good answer: no software, no Git, drag a folder, get an address. The other well-known free options are **GitHub Pages**, popular with programmers and tied to GitHub's way of storing code, and **Cloudflare Pages**. They all serve static sites well. An assistant will usually pick one; if you have a reason to prefer another, say so.

The club does have a reason. Later in the book, it will run code on Cloudflare's servers, with Cloudflare Workers, and keeping everything in one account will make that simpler. So, continuing the chat:

::: {.ai-conversation prompt="Later we plan to use Cloudflare Workers, so we'd rather keep everything on Cloudflare. How do I put the folder online with Cloudflare, without using Git?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="extension" transcript="publishing/go-live"}
> Good plan — Cloudflare Pages has a direct upload option that skips Git entirely.
>
> **Steps:**
>
> 1. Go to `dash.cloudflare.com` in your web browser.
> 2. If you don't have a Cloudflare account yet, sign up (it's free — just an email and password).
> 3. Once signed in, look in the sidebar for **Workers & Pages**.
> 4. Click **Create**, then choose the **Pages** tab.
> 5. Choose **Upload assets** (this is the option that skips Git — it may also say "Direct Upload").
> 6. Give your project a name, like `ourclub`.
> 7. Drag your folder in, or click to browse and select all four files (`index.html`, `style.css`, `script.js`, `garden.jpg`).
> 8. Click to deploy. Cloudflare uploads the files and gives you a web address like `https://ourclub.pages.dev`.
> 9. Click that address to see your site live.
>
> **Updating the site later:**
>
> - Go back to the same project in the Cloudflare dashboard.
> - Look for an option to create a new deployment and upload the folder again with your changes.
>
> **Who can see it and what it shows:** Once deployed, the site is public — anyone with the address can open it. As before, anyone can also view the source of `index.html`, `style.css`, and `script.js` through their browser's developer tools, so don't put anything private in those files.
>
> Since you're already planning to use Cloudflare Workers later, this keeps everything in one dashboard, which should make that transition easier when you get there.
>
> Want help with anything on the page itself in the meantime, like the HTML or the script?
:::

The approach is right: Cloudflare's **direct upload** takes a folder from your computer, with no Git. But check the steps against your screen. Cloudflare reorganizes its dashboard often, and the assistant hedged, sensibly, that the button "may also say" something else. At the time of writing, Cloudflare had been moving new projects from Pages toward Workers, which can also serve a folder of files, so you may be offered that path instead. Either works for a static site. What matters is the result: an address ending in `.pages.dev` or `.workers.dev` that shows your site.

::: {.screenshot-needed file="images/publishing-cloudflare-upload.png"}
The Cloudflare dashboard's create-project screen with the option to upload a folder of files (direct upload) highlighted.
:::

A few things come with the free address automatically:

::: {.q2r}
- **HTTPS.** The address starts with `https://`, and the connection is encrypted. You don't have to set anything up.
- **Updates.** To change the site, edit the files on your computer, then upload the folder again as a new deployment. The address stays the same.
- **Your own domain, optionally.** An address like `collegecommunitygarden.org` costs money, about $10 to $20 a year at the time of writing, and can be connected to the free hosting. It's not needed.
:::

## When It Works on Your Computer but Not Online

A very common first experience with publishing: the site is online, but it looks wrong. Here's one version of it:

::: {.ai-conversation prompt="The site is online, but it has no styling and the photo is missing, even though it all looked fine on my computer. In index.html I have <link rel=&quot;stylesheet&quot; href=&quot;C:\Users\maya\Desktop\club\style.css&quot;> and <img src=&quot;C:\Users\maya\Desktop\club\garden.jpg&quot; alt=&quot;The garden&quot;>. Why? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="extension" transcript="publishing/go-live"}
> Good question — this is a really common beginner trap.
>
> **Why it worked on your computer:**
>
> `C:\Users\maya\Desktop\club\style.css` is called an **absolute path**. It tells the browser exactly where to find the file on *your* computer's hard drive — starting from the `C:` drive, through your folders, down to the file. When you opened `index.html` by double-clicking it, your browser could follow that path because it was reading files from your own machine, where that path is real.
>
> **Why it fails online:**
>
> When your site is on Cloudflare, it's no longer running from `C:\Users\maya\...`. It's running from Cloudflare's servers, which have no idea what `C:\Users\maya\Desktop\club` means — that folder doesn't exist there at all. So the browser tries to fetch a file at that path, fails, and you end up with no styling and no photo.
>
> **What should happen instead:**
>
> Since `style.css` and `garden.jpg` are sitting in the *same folder* as `index.html`, you can just refer to them by name, like `style.css` and `garden.jpg`. This is called a **relative path** — it means "look in the same folder as this HTML file," which works no matter whose computer or server the folder ends up on.
>
> Want me to show you the fix now, or would you like to try changing those two lines yourself first?
:::

That's exactly right. `C:\Users\maya\Desktop\club\` exists on one computer. The fix is `href="style.css"` and `src="garden.jpg"`. Some code editors insert absolute paths when you drag a file in, so it's worth checking.

::: {.o6c}
Another difference catches people out. On Windows and Mac computers, file names usually aren't case-sensitive, so `Garden.JPG` and `garden.jpg` are the same file. On most web servers they're different files. A page that says `src="garden.jpg"` for a file named `Garden.JPG` works on your computer and breaks online. The simplest habit: use lowercase file names, with hyphens instead of spaces, like `plant-spacing.html`.
:::

### Finding what's missing

The developer tools will tell you exactly which files failed. Open them on the published site, and:

::: {.abj}
- **Console** lists errors, including files that couldn't be loaded.
- **Network** lists every file the page asked for, with its status. Reload the page with the Network panel open. A file shown in red, with the status **404**, wasn't found. Its address shows you where the browser looked.
:::

::: {.screenshot-needed file="images/publishing-network-404.png"}
Chrome's Network panel after reloading a page, with style.css and garden.jpg shown in red with status 404.
:::

::: {.tip}
> **Seeing an old version?** Browsers keep copies of files they've loaded, to save time. If you've uploaded a change and don't see it, do a *hard reload*: **Ctrl+Shift+R** on Windows, **Cmd+Shift+R** on a Mac.
:::

## Everything You Publish Is Public

The assistant's note about who can see the site is worth repeating in full. Publishing a site sends every file in the folder to anyone who asks for it. That includes:

::: {.zie}
- **Your code.** Anyone can read your HTML, CSS and JavaScript in the developer tools. That's normal on the web, but it means a web page can never hold a secret, such as an API key or a webhook address.
- **Every file in the folder,** even ones no page links to. If a spreadsheet of members' contact details is sitting in the folder, it's online too, for anyone who guesses its name. Keep the site's folder for the site's files only.
- **Anything in the pages.** Before publishing, read the site as a stranger would. Members' names, phone numbers and schedules don't belong on a public page without their permission.
:::

## The Club's Site

Here's the club's site as three files, bringing together the home page from [How Web Pages Work](web-pages){.book-link} and the forecast from [Asynchronous JavaScript](async){.book-link}. Save each one in the same folder, with these names, and open `index.html` in your browser. Then publish the folder.

**index.html**

```{.code environment="none"}
<!doctype html>
<html>
  <head>
    <title>College Community Garden</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>College Community Garden</h1>
    <p>A student-run club where students and neighbors grow food together, share the harvest, and learn to garden sustainably. Everyone is welcome, and no experience is needed.</p>

    <h2>Upcoming Workdays</h2>
    <ul id="workdays"></ul>

    <h2>Rain in the Next Three Days</h2>
    <ul id="forecast">
      <li>Loading the forecast...</li>
    </ul>

    <script src="script.js"></script>
  </body>
</html>
```

**style.css**

```{.code environment="none"}
body {
  font-family: Arial, sans-serif;
  background-color: #f4f9f4;
  margin: 20px;
  max-width: 700px;
}
h1 {
  color: #2e7d32;
}
ul {
  background-color: white;
  padding: 15px 30px;
  border: 1px solid #cde5cd;
}
.error {
  color: darkred;
}
```

**script.js**

```{.code environment="none"}
const WORKDAYS = ["Saturday, May 1, 2027", "Saturday, May 15, 2027", "Saturday, May 29, 2027"]
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast?latitude=40.25&longitude=-111.65&daily=precipitation_sum&timezone=auto&forecast_days=3"
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function showWorkdays() {
  const list = document.querySelector("#workdays")
  for (let i = 0; i < WORKDAYS.length; i++) {
    const item = document.createElement("li")
    item.textContent = WORKDAYS[i]
    list.appendChild(item)
  }
}

async function showForecast() {
  const list = document.querySelector("#forecast")
  try {
    const response = await fetch(FORECAST_URL)
    if (response.ok === false) {
      throw new Error(`the weather service replied with status ${response.status}`)
    }
    const data = await response.json()
    const dates = data.daily.time
    const rainAmounts = data.daily.precipitation_sum
    list.textContent = ""
    for (let i = 0; i < dates.length; i++) {
      // noon avoids the date shifting across time zones
      const date = new Date(`${dates[i]}T12:00`)
      const item = document.createElement("li")
      item.textContent = `${DAY_NAMES[date.getDay()]}: ${rainAmounts[i]} mm`
      list.appendChild(item)
    }
  } catch (error) {
    list.textContent = ""
    const item = document.createElement("li")
    item.className = "error"
    item.textContent = `The forecast isn't available right now (${error.message}).`
    list.appendChild(item)
  }
}

showWorkdays()
showForecast()
```

This version builds the workday list with `createElement` and `textContent` instead of `innerHTML`, so nothing in the list could ever be read as HTML. Once it's online, send the address to a friend and ask them to open it on their phone. That's the test that matters: it works on a computer that isn't yours.

## Your Learner Profile

::: {.learner-profile}
:::

## Summary

A website is a folder of files: `index.html` for the home page, with CSS and JavaScript in their own files, linked with `<link rel="stylesheet">` and `<script src>`. Relative paths, like `style.css`, keep working when the folder moves to a server; absolute paths to your own computer break, and so do file names whose capitals don't match. Static hosting services such as Cloudflare Pages, Netlify and GitHub Pages publish a folder for free, with HTTPS included, and an assistant's steps for their dashboards should be checked against your screen. The Network panel shows which files didn't load. Everything in a published folder is public, code included, so a site can't hold secrets or private data. The club's website is now online. That's the end of Part III. Next, you'll take JavaScript into Microsoft Excel.
