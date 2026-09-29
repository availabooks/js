---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Control a web browser from Node with Playwright: open pages, take screenshots and collect information.
2. Explain which code runs in Node and which runs inside the browser page.
3. Follow links from page to page, politely, with pauses between requests.
4. Decide when automated collection of web data is appropriate, and check a site's terms and robots.txt.
5. Use browser automation to check your own site.
:::
:::

## A Browser Your Code Controls

In [Automating Pages You Use](automating-pages){.book-link}, your code ran *inside* a page you had open. **Playwright** turns that around: a Node script starts a real web browser and drives it, opening pages, clicking, typing and reading, exactly as a person would, but much faster and without getting bored. It's made by Microsoft, it's free, and it's one of the most widely used tools of its kind.

It's used for three main jobs:

- **Testing websites.** Developers use it to check that their own sites work: open the page, click the button, check the result, on every change. This is its original purpose.
- **Screenshots and PDFs** of pages, at any screen size.
- **Collecting information** from pages that don't offer it any other way, called **web scraping**.

The club's idea is the third: Maya would like to compare seed prices across suppliers' catalogs before the next season. That's a reasonable wish, and it's also where browser automation needs the most judgment, so this lesson starts there.

::: {.term}
> **Web scraping** — Collecting information from web pages automatically, by reading their HTML, rather than through an official data service such as an API.
:::

## Before You Scrape

::: {.i7x .m8e}

A site's pages are there for people to read. Whether a program may collect them is up to the site's owner, and the rules vary:

- **Look for an official source first.** Many suppliers offer a downloadable price list, a data feed or an API. That's always better than scraping: it's permitted, and it doesn't break when the site's design changes.
- **Read the terms of use.** Many sites forbid automated collection. Your profile's rule from [Automating Pages You Use](automating-pages){.book-link} applies here.
- **Check `robots.txt`.** Most sites publish a file at `/robots.txt`, such as `https://example.com/robots.txt`, listing parts of the site that automated programs are asked not to visit. It's a request, not a lock, and respecting it is standard practice.
- **Be gentle.** A script can request pages far faster than a person, and a burst of requests can slow a small site down for everyone. Pause between pages.
- **Leave personal data and logins alone.** Collecting people's information, or getting around a login, raises legal and ethical problems that price comparison doesn't need.

:::

For learning, this lesson uses **books.toscrape.com**, a fake bookstore built specifically for people to practice scraping. Its "catalog" of books stands in for a seed supplier's catalog: product boxes with titles and prices, spread over many pages, exactly the shape of a real one.

## Setting Up

Playwright is a package, and it needs a browser of its own to control. In a project folder with `"type": "module"` in `package.json`:

```{.code environment="none"}
npm install playwright
npx playwright install chromium
```

::: {.o8g}

**`npx`** runs a command that comes with a package, here Playwright's installer, which downloads a copy of Chromium, the open-source browser Chrome is built on. It's a large download, a few hundred megabytes, and only happens once.

:::

## Collecting Prices

Here's the request, in a new chat with your learner profile from [Building Command-Line Tools](cli){.book-link}:

::: {.ai-conversation prompt="I want to learn browser automation with Playwright, using the practice site books.toscrape.com, which is built for scraping practice. It stands in for a seed supplier's catalog. Write a Node script that opens the first page of the catalog, collects each product's title and price, prints them sorted from cheapest to most expensive, and saves a screenshot of the page." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="cli" transcript="playwright/prices"}
> Great choice — Playwright is a good next step after DOM/browser basics. A couple of things to set up first, since Playwright is a package, not something built into Node.
>
> ## Before you start
>
> **Playwright** is a browser automation package made by Microsoft. It's very widely used — probably the most popular tool for this kind of task, alongside Puppeteer.
>
> In your project folder, run:
>
> ```
> npm install playwright
> npx playwright install chromium
> ```
>
> The first line installs the package. The second downloads an actual Chromium browser for Playwright to control (this only needs doing once).
>
> Make sure your `package.json` has `"type": "module"` so `import` works.
>
> **About the site:** books.toscrape.com is built by its creators specifically as public, fake practice data for scraping — there's no login, no real people's data, and it's meant to be automated. Still, it's good habit to check a site's terms before scraping something in general, even here.
>
> ## The script
>
> ```javascript
> import { chromium } from "playwright"
> import { fileURLToPath } from "node:url"
> import { dirname, join } from "node:path"
>
> // Find the folder this script is in, so the screenshot saves there
> // no matter what folder your terminal happens to be in
> const scriptFolder = dirname(fileURLToPath(import.meta.url))
>
> const catalogUrl = "https://books.toscrape.com/"
>
> // Open a visible browser window. Set headless: true to run it invisibly.
> const browser = await chromium.launch({ headless: false })
> const page = await browser.newPage()
>
> await page.goto(catalogUrl)
>
> // Save a screenshot of the page as it looks right now.
> // Running this again will overwrite the old screenshot file.
> const screenshotPath = join(scriptFolder, "catalog-screenshot.png")
> await page.screenshot({ path: screenshotPath })
> console.log(`Screenshot saved to ${screenshotPath}`)
>
> // Pull title and price out of every product box on the page.
> // This function runs INSIDE the browser, so it can use querySelectorAll
> // just like a script tag in a web page would.
> const products = await page.$$eval(".product_pod", pods =>
>   pods.map(pod => {
>     // getAttribute reads an HTML attribute's value, similar to how you've
>     // read src or href - here the full title is stored in the "title"
>     // attribute, because the visible text gets cut off with "..."
>     const title = pod.querySelector("h3 a").getAttribute("title")
>     const priceText = pod.querySelector(".price_color").textContent
>     return { title, priceText }
>   })
> )
>
> await browser.close()
>
> // priceText looks like "£53.74" - slice(1) drops the £ symbol,
> // then Number() turns the rest into an actual number
> const priced = products.map(product => ({
>   title: product.title,
>   price: Number(product.priceText.slice(1))
> }))
>
> // Sort cheapest first. (a, b) => a.price - b.price means:
> // if a is cheaper than b, the result is negative, so a comes first
> const sorted = priced.sort((a, b) => a.price - b.price)
>
> console.log(`Found ${sorted.length} products\n`)
>
> sorted.forEach(product => {
>   console.log(`£${product.price.toFixed(2)}  ${product.title}`)
> })
> ```
>
> ## What each part does
>
> - **`import` lines** — bring in Playwright's `chromium` browser, and two Node tools for finding the script's own folder.
> - **`scriptFolder`** — works out where this `.js` file lives, so the screenshot always saves next to it.
> - **`chromium.launch()`** — starts a real browser. `headless: false` lets you watch it open the page.
> - **`page.goto(catalogUrl)`** — loads the first catalog page.
> - **`page.screenshot()`** — saves a PNG image of the page.
> - **`page.$$eval(".product_pod", ...)`** — finds every product box and runs your function on the whole list *inside the browser*, returning plain data back to Node.
> - **`.map()` on `products`** — converts each price string into a real number.
> - **`.sort()`** — orders the array from cheapest to most expensive.
> - **`.forEach()`** — prints each result.
>
> ## Running it
>
> ```
> node scrapeBooks.js
> ```
>
> You should see a browser flash open, then a printed count and a sorted list of titles and prices in your terminal, plus a `catalog-screenshot.png` file appear in the same folder as the script.
>
> Want to try headless mode next, or move on to clicking "next page" to scrape more than the first page?
:::

**Read.** The script follows the steps a person would take, each one awaited, because each takes time:

- **`chromium.launch()`** starts the browser. With `headless: false`, you see its window; with `headless: true`, the default, it runs invisibly, which is faster and how scripts usually run.
- **`browser.newPage()`** opens a tab, and **`page.goto(url)`** loads a page, waiting until it has loaded.
- **`page.screenshot({ path })`** saves an image of the page. The path is built from the script's folder, following your profile's rule from the last lesson.
- **`page.$$eval(".product_pod", pods => ...)`** is the key step, and the comment on it points out the most important idea in this lesson.

### Two places code runs

Most of this script runs in Node. But the function passed to `$$eval` runs *inside the browser*, on the page, like the Console code in [Automating Pages You Use](automating-pages){.book-link}. Playwright finds every element matching `.product_pod`, sends your function into the page, runs it there, and brings back what it returns.

That's why the function can use `querySelector` and `getAttribute`, which exist only in a page, and why it can't use anything from the rest of the script, such as `scriptFolder`, which exists only in Node. What comes back must be plain data: strings, numbers, arrays and objects, not elements. Keep that boundary in mind, and most Playwright errors make sense.

::: {.term .kiy}
> **$$eval** — A Playwright method that finds every element matching a selector, runs a function on them *inside the page*, and returns the result to Node. The function can't use variables from the Node script.
:::

The rest is familiar: `getAttribute("title")` reads the full title from the link, because the visible text is cut short with "...". `slice(1)` drops the £ sign before `Number()`. And the sort and printing happen back in Node, after the browser has closed.

Run it, and it prints 20 products, from £13.99 for *Starving Hearts* to £57.25, and saves `catalog-screenshot.png`.

## Visiting Every Page

The catalog has 50 pages. Continuing the chat:

::: {.ai-conversation prompt="The catalog has 50 pages. If I change the script to visit all of them, is there anything I should be careful about?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="cli" transcript="playwright/prices"}
> Good instinct to ask before scaling this up. A few things to think about:
>
> **Be gentle with the server**
> Even though this site exists for practice, loading 50 pages back-to-back as fast as possible is still 50 rapid requests to someone else's server. It's polite to add a short pause between pages — something like `await page.waitForTimeout(1000)` (waits 1 second) between loads.
>
> **Screenshots will overwrite each other**
> Your current script always saves to `catalog-screenshot.png`. If you loop over 50 pages, you'll want either:
> - one screenshot per page, with the page number in the filename (like `catalog-page-3.png`), or
> - just one screenshot of the first page, since 50 images may not be useful
>
> **Finding "next page" reliably**
> The site has a "next" link on every page except the last. You'll need to check whether it exists before clicking it, and stop the loop when it's gone, rather than assuming there are exactly 50 pages. Otherwise the script breaks if the site ever changes.
>
> **Collecting results across pages**
> You'll want one array that keeps growing as you visit each page (push each page's products into it), then sort it once at the very end — not sort after every page.
>
> **How long it takes**
> 50 page loads plus pauses adds up to a minute or two of runtime. That's normal, just don't expect it to be instant.
>
> **If one page fails**
> A network hiccup could break the loop partway through. Wrapping each page visit in `try`/`catch` means one failure won't stop the whole run — you can log which page failed and continue.
>
> **Still one browser tab**
> You don't need a new page or new browser for each catalog page — just reuse the same `page` and call `page.goto()` again for each one.
>
> Want me to write the updated script with these in mind, using a `while` loop that follows "next" until it disappears?
:::

Every point is right. The most important are pausing between pages, and following the site's own "next" link until there isn't one, instead of assuming there are exactly 50 pages. The advice to catch failures per page, and report which failed, is the lesson from [Talking to Web Services](web-services){.book-link}: catch errors only to handle them, never to hide them.

Here's the script that follows every page, in the book's style:

```{.code environment="nodejs"}
import { chromium } from "playwright"

const START_URL = "https://books.toscrape.com/"
// wait between pages, so the site isn't flooded with requests
const PAUSE_MS = 1000

const browser = await chromium.launch()
const page = await browser.newPage()

const products = []
const failedPages = []
let url = START_URL

while (url !== null) {
  try {
    await page.goto(url)
    // this function runs inside the browser, on the catalog page
    const pageProducts = await page.$$eval(".product_pod", pods =>
      pods.map(pod => ({
        title: pod.querySelector("h3 a").getAttribute("title"),
        price: Number(pod.querySelector(".price_color").textContent.slice(1))
      }))
    )
    products.push(...pageProducts)

    // follow the "next" link until there isn't one
    const nextLink = page.locator("li.next a")
    if (await nextLink.count() === 0) {
      url = null
    } else {
      const href = await nextLink.getAttribute("href")
      url = new URL(href, page.url()).href
    }
  } catch (error) {
    failedPages.push(url)
    url = null
  }
  await page.waitForTimeout(PAUSE_MS)
}

await browser.close()

products.sort((a, b) => a.price - b.price)
console.log(`Collected ${products.length} products`)
console.log(`Cheapest: £${products[0].price.toFixed(2)} ${products[0].title}`)
console.log(`Most expensive: £${products[products.length - 1].price.toFixed(2)} ${products[products.length - 1].title}`)
if (failedPages.length > 0) {
  console.log(`Stopped early. Could not load: ${failedPages.join(", ")}`)
}
```

::: {.hbo}

A few pieces are new:

- **A `while` loop**, from [Loops and Repetition](loops){.book-link}, because the number of pages isn't known in advance. It runs until `url` is `null`.
- **`page.locator("li.next a")`** describes an element to find, and `count()` says how many match: 0 on the last page.
- **`new URL(href, page.url())`** turns the link's relative address, such as `catalogue/page-2.html`, into a full one, based on the current page's address, the relative-path rules from [Publishing a Site for Free](publishing){.book-link}.
- **`products.push(...pageProducts)`** uses spread to add one page's products to the list.

:::

It takes about a minute, and it finishes by printing checkable numbers, as your profile asks: 1,000 products, from £10.00 to £59.99. If a page fails, it stops and says which one, rather than quietly reporting a partial list as if it were complete.

## Checking Your Own Site

Playwright's original purpose is worth trying too, because it's one of the most useful things you can do with it. This script opens the club's website from [Publishing a Site for Free](publishing){.book-link} at a phone's screen size and saves a screenshot, so you can see what visitors on phones see:

```{.code environment="nodejs"}
import { chromium } from "playwright"

// replace with your site's address
const SITE_URL = "https://your-club-site.pages.dev/"

const browser = await chromium.launch()
const page = await browser.newPage()
// roughly the screen size of a phone, in CSS pixels
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(SITE_URL)
await page.screenshot({ path: "home-on-phone.png", fullPage: true })

const heading = await page.locator("h1").textContent()
console.log(`The page's heading is: ${heading}`)
await browser.close()
```

::: {.u6b}

`fullPage: true` captures the whole page, not just the part that fits on the screen. Checking the heading's text is a tiny version of an automated **test**: if a change to the site ever broke the page, this script would notice. Playwright includes a complete testing tool, **Playwright Test**, built around this idea, and it's a good thing to ask your assistant about if you keep building sites.

:::

## Your Learner Profile

::: {.learner-profile}
:::

## Summary

Playwright lets a Node script control a real browser: `launch` starts it, `goto` opens a page, `screenshot` saves an image, and `$$eval` collects information by running a function inside the page, a function that can't see the script's own variables. Following "next" links in a `while` loop, with a pause between pages, collects a whole catalog, and printing the counts at the end shows whether it's complete. Scraping is appropriate only where the site allows it: look for an official data source first, read the terms and `robots.txt`, stay away from personal data and logins, and go slowly. Playwright's original use, testing your own site, is often the most valuable. Next, your code will call an AI model itself.
