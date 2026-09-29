---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain why code in a browser has to wait for data without freezing the page, and why Apps Script didn't.
2. Describe a promise, and use `async` functions and `await` to work with one.
3. Fetch JSON from a web API in a web page, with `fetch` and `response.json()`.
4. Check a response for errors, and show a useful message when something fails.
5. Recognize the symptoms of a missing `await`.
6. Build page elements with `document.createElement` and `appendChild`.
:::
:::

## Two Ways to Get Live Data

Maya would like the club's home page to show the rain forecast. You fetched a forecast in [Talking to Web Services](web-services){.book-link}, with Apps Script's `UrlFetchApp`. So ask how to do it in a web page, in a new chat with your learner profile from [Events and Interactivity](events){.book-link}:

::: {.ai-conversation prompt="On our club's home page, I want to show the rain forecast for the next three days from the Open-Meteo API, for latitude 40.25 and longitude -111.65. In Apps Script I used UrlFetchApp.fetch for this. How do I do it in a web page?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="events" transcript="async/forecast"}
> Good question. This actually touches on something you haven't learned yet, so let me explain the options.
>
> **The gap:** In Apps Script, `UrlFetchApp.fetch()` gets a reply right away. But in a web page, the browser's version of "fetch" doesn't work that way — it hands you a *promise* and you need `.then()` or `async`/`await` to get the actual result later. Those aren't on your list yet, so I don't want to use them without explaining them first.
>
> **A path that uses only what you know:** Instead of fetching the weather from the browser, do it in Apps Script and have Apps Script build the whole page, using what you already know about web apps (`doGet`, `HtmlService`) and `UrlFetchApp.fetch()`. Here's how:
>
> ```javascript
> const LATITUDE = 40.25
> const LONGITUDE = -111.65
>
> function doGet() {
>   // Build the web address for the Open-Meteo API using the club's location
>   const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=precipitation_sum&timezone=auto&forecast_days=3`
>
>   // Ask Open-Meteo for the forecast
>   const response = UrlFetchApp.fetch(url)
>
>   // Get the reply as text
>   const text = response.getContentText()
>
>   // Turn the text into a JavaScript object
>   const data = JSON.parse(text)
>
>   // Pull out the list of dates and rain amounts
>   const dates = data.daily.time
>   const rainAmounts = data.daily.precipitation_sum
>
>   // Start building the page as a string of HTML
>   let html = "<h1>Rain Forecast</h1>"
>   html = html + "<ul>"
>
>   // Add one list item for each of the three days
>   for (let i = 0; i < dates.length; i++) {
>     const date = dates[i]
>     const rain = rainAmounts[i]
>     html = html + `<li>${date}: ${rain} mm of rain</li>`
>   }
>
>   html = html + "</ul>"
>
>   // Send the finished page back to the browser
>   return HtmlService.createHtmlOutput(html)
> }
> ```
>
> **What each part does:**
> - The constants at the top hold the club's location, so they're easy to find and change later.
> - The `url` line builds the web address, inserting the latitude and longitude with a template literal.
> - `UrlFetchApp.fetch(url)` calls the Open-Meteo API and gets a response.
> - `JSON.parse(text)` turns the JSON reply into a regular JavaScript object you can read with dot notation.
> - `data.daily.time` and `data.daily.precipitation_sum` are parallel arrays — matching dates and rain amounts.
> - The loop builds one `<li>` per day and adds it to the `html` string.
> - `HtmlService.createHtmlOutput(html)` sends the finished page to whoever opens the web app.
>
> **To try it:**
> 1. Paste this into your Apps Script project.
> 2. Deploy it as a web app (Deploy → New deployment → Web app).
> 3. Choose who can access it — for a club home page, you'd likely choose "Anyone" or "Anyone with the link."
>
> **Who sees what:** Anyone you allow to open the deployed link will see the three-day rain forecast (dates and rain amounts in mm) for the fixed latitude/longitude you set. There's no personal or private data here — just public weather info — so this is safe to share.
>
> If you'd like, I can also teach you the browser-side `fetch`/`async`/`await` approach later, in case you want the page to update without Apps Script involved.
:::

This is a thoughtful answer. The assistant explained that fetching data in a browser works differently, in a way your profile doesn't cover yet, and instead of using it anyway, it found a route with what you know: let Apps Script fetch the forecast and build the page, as a web app. You can read every line of it: it's [A Web App with Apps Script](web-app){.book-link} and [Talking to Web Services](web-services){.book-link} put together.

It's also a real design choice, not just a workaround. Doing the work on a server, then sending a finished page, is how much of the web works, and it has advantages: the visitor's browser does less, and secrets can stay on the server. But the club's home page is an ordinary web page, not an Apps Script web app, and the browser can fetch the data itself. That needs the "different way" the assistant mentioned, which is this lesson's subject.

## Why the Browser Waits Differently

In Apps Script, `UrlFetchApp.fetch(url)` stopped your script until the reply arrived, and then the next line ran. That's called **synchronous** code: each line finishes before the next one starts. It was fine, because nobody was looking at your script while it waited.

::: {.dtv}
A web page is different. Someone *is* looking at it, scrolling, clicking and typing. If the page stopped everything while waiting a second or two for a reply from another computer, it would freeze: buttons wouldn't respond, and nothing would scroll. So in the browser, a request for data is **asynchronous**: your code asks for the data, carries on, and handles the reply when it arrives.
:::

::: {.term}
> **Asynchronous** — Code that starts something that takes time, such as a web request, and carries on without waiting; the result is handled when it arrives. *Synchronous* code waits for each step to finish.
:::

### Promises

The browser's version of `UrlFetchApp.fetch` is called **`fetch`**, and it can't give you the reply right away, because the reply hasn't arrived. Instead it gives you a **promise**: an object that stands for a result that will be available later. The promise is *pending* at first, and later it's either *fulfilled*, with the result, or *rejected*, with an error.

::: {.term}
> **Promise** — An object representing a result that isn't available yet, such as the reply to a web request. It later becomes fulfilled, with the result, or rejected, with an error.
:::

### async and await

To use the result, you **`await`** the promise. `await` pauses the function until the promise is fulfilled, then gives you its result. And `await` can only be used inside a function marked **`async`**:

```{.code environment="html"}
<p id="status">Waiting...</p>

<script>
  async function loadForecast() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=40.25&longitude=-111.65&daily=precipitation_sum&timezone=auto&forecast_days=3"
    console.log("1. Asking for the forecast")
    const response = await fetch(url)
    const data = await response.json()
    console.log("3. The forecast arrived")
    const status = document.querySelector("#status")
    status.textContent = `Rain in the next three days: ${data.daily.precipitation_sum}`
  }

  loadForecast()
  console.log("2. The page carries on")
</script>
```

Run it, and look at the order of the messages: 1, 2, 3. When `loadForecast` reaches the first `await`, it pauses, and the rest of the page's code carries on, which is why message 2 appears before message 3. When the reply arrives, `loadForecast` picks up where it left off. Inside the function, `await` makes the code read top to bottom, like the synchronous code you're used to. Outside it, nothing waits.

Two `await`s are needed. `fetch` gives a promise of a **response**, which holds the reply's status and headers, but not yet all of its content. `response.json()` gives a second promise, for the content read and parsed as JSON, which does the job of `getContentText()` and `JSON.parse` together.

::: {.term}
> **async function** — A function marked with `async`, which can use `await` to pause until a promise is fulfilled. An async function itself returns a promise.
:::

::: {.note .wmk}
> **You'll also see `.then()`.** Before `async` and `await` existed, promises were used with a method called `then`, which takes a function to run with the result: `fetch(url).then(function(response) { ... })`. It does the same job, and you'll see it in older code and some AI replies. `async` and `await` are easier to read, and this book uses them.
:::

## Fetching the Forecast in the Page

Back to the chat, now that you know `async` and `await`:

::: {.ai-conversation prompt="I've now learned promises, async functions, await, fetch() and response.json(). Write the version that runs in the web page itself, and handle errors." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="events" transcript="async/forecast"}
> Since you now know promises, `async`/`await`, `fetch()` and `response.json()`, here's a version that runs entirely in the browser — no Apps Script needed.
>
> ```html
> <!DOCTYPE html>
> <html>
> <head>
>   <title>Club Rain Forecast</title>
>   <style>
>     body {
>       font-family: Arial;
>       margin: 20px;
>     }
>     .error {
>       color: red;
>     }
>   </style>
> </head>
> <body>
>
>   <h1>Rain Forecast</h1>
>
>   <ul id="forecast-list"></ul>
>
>   <p id="error-message" class="error"></p>
>
>   <script>
>
>     async function loadForecast() {
>       // These hold the club's location
>       const latitude = 40.25
>       const longitude = -111.65
>
>       // Build the web address for the Open-Meteo API
>       const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_sum&timezone=auto&forecast_days=3`
>
>       // Find the elements on the page we'll fill in
>       const list = document.querySelector("#forecast-list")
>       const errorMessage = document.querySelector("#error-message")
>
>       try {
>         // Ask Open-Meteo for the forecast and wait for the reply
>         const response = await fetch(url)
>
>         // Check whether the server said something went wrong
>         if (response.ok === false) {
>           throw new Error(`Server responded with status ${response.status}`)
>         }
>
>         // Turn the reply into a JavaScript object
>         const data = await response.json()
>
>         // Pull out the parallel arrays of dates and rain amounts
>         const dates = data.daily.time
>         const rainAmounts = data.daily.precipitation_sum
>
>         // Add one list item for each day
>         for (let i = 0; i < dates.length; i++) {
>           const date = dates[i]
>           const rain = rainAmounts[i]
>           const item = document.createElement("li")
>           item.textContent = `${date}: ${rain} mm of rain`
>           list.appendChild(item)
>         }
>
>       } catch (error) {
>         // If anything above failed, show a message instead of a blank page
>         errorMessage.textContent = `Could not load forecast: ${error.message}`
>       }
>     }
>
>     loadForecast()
>
>   </script>
>
> </body>
> </html>
> ```
>
> **What each part does:**
> - `latitude` and `longitude` hold the club's location.
> - `url` is built with a template literal, same as before.
> - `fetch(url)` sends the request and `await` pauses the function until the reply arrives.
> - `response.ok` is `false` if the server returned an error status (like 404 or 500), so we `throw` our own error to catch it below.
> - `response.json()` turns the reply into a usable object, and `await` waits for that too.
> - The `for` loop creates one `<li>` element per day and adds it to the list on the page.
> - `try`/`catch` means if the fetch fails (no internet, bad address, server error), the `catch` block runs and shows a friendly message in red instead of leaving the page broken or blank.
>
> **Who sees what:** Anyone who opens this page can see the three-day rain forecast (dates and rain amounts in mm) for the fixed latitude/longitude built into the code. There's no API key or secret here — Open-Meteo's forecast endpoint is public and free to call — so there's nothing sensitive to protect in this file.
:::

**Read.**

- **`loadForecast`** is `async`, and it's called once at the end of the script.
- **`await fetch(url)`** and **`await response.json()`** are the two waits you just learned.
- [**`response.ok`** is a property that's `true` when the server replied successfully. Unlike `UrlFetchApp`, `fetch` doesn't treat an error reply, such as "404 Not Found," as a failure; it only fails when there's no reply at all. So checking `ok` is how you notice that the server said no. When it's false, the code **throws** an error of its own, with **`new Error(...)`**, which creates an error object with a message.]{.zu2}
- **`document.createElement("li")`** creates a new list item, and **`appendChild`** adds it to the end of the list. It's a way to build a page without writing HTML in a string, which also means the text goes in through `textContent`, so it can never be read as HTML. Neither method was on your list, and the reply didn't mention that; you can read them from their names, but it's worth noticing.
- **`try` and `catch`** put a message on the page if anything fails, instead of leaving a blank list. Unlike the Apps Script trigger in [Talking to Web Services](web-services){.book-link}, where catching an error hid it, here a person is looking at the page, so showing the message is exactly right.

Run it:

```{.code environment="html"}
<!DOCTYPE html>
<html>
<head>
  <title>Club Rain Forecast</title>
  <style>
    body {
      font-family: Arial;
      margin: 20px;
    }
    .error {
      color: red;
    }
  </style>
</head>
<body>

  <h1>Rain Forecast</h1>

  <ul id="forecast-list"></ul>

  <p id="error-message" class="error"></p>

  <script>

    async function loadForecast() {
      // These hold the club's location
      const latitude = 40.25
      const longitude = -111.65

      // Build the web address for the Open-Meteo API
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_sum&timezone=auto&forecast_days=3`

      // Find the elements on the page we'll fill in
      const list = document.querySelector("#forecast-list")
      const errorMessage = document.querySelector("#error-message")

      try {
        // Ask Open-Meteo for the forecast and wait for the reply
        const response = await fetch(url)

        // Check whether the server said something went wrong
        if (response.ok === false) {
          throw new Error(`Server responded with status ${response.status}`)
        }

        // Turn the reply into a JavaScript object
        const data = await response.json()

        // Pull out the parallel arrays of dates and rain amounts
        const dates = data.daily.time
        const rainAmounts = data.daily.precipitation_sum

        // Add one list item for each day
        for (let i = 0; i < dates.length; i++) {
          const date = dates[i]
          const rain = rainAmounts[i]
          const item = document.createElement("li")
          item.textContent = `${date}: ${rain} mm of rain`
          list.appendChild(item)
        }

      } catch (error) {
        // If anything above failed, show a message instead of a blank page
        errorMessage.textContent = `Could not load forecast: ${error.message}`
      }
    }

    loadForecast()

  </script>

</body>
</html>
```

::: {.caution .yft}
> **Not every API works from a web page.** For security, a browser only lets a page fetch from another site if that site allows it, a rule called *CORS*. Open-Meteo allows it, but many APIs don't, especially ones that need a key. When a fetch works in Apps Script but fails in a page with an error mentioning CORS, that's why, and fetching on a server, as in the assistant's first answer, is the usual solution.
:::

## A Missing await

One mistake with `async` code is so common that it's worth seeing on purpose. Here's what happens when `await` goes missing:

::: {.ai-conversation prompt="I accidentally deleted the word await in front of fetch(url). Now the page says: Could not load forecast: response.json is not a function. What happened? Explain it, but don't fix it yet." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="events" transcript="async/forecast"}
> Good bug to run into — here's what's happening.
>
> `fetch(url)` doesn't give you the response right away. It gives you back a **promise** — a placeholder that says "I'll have a response for you eventually." Normally, `await` pauses the function until that promise finishes, and then hands you the real `Response` object.
>
> Without `await`, the line:
>
> ```javascript
> const response = await fetch(url)
> ```
>
> becomes:
>
> ```javascript
> const response = fetch(url)
> ```
>
> So `response` isn't a `Response` object anymore — it's the **promise itself**, still pending. A promise object doesn't have a `.json()` method the way a real response does, so when your code reaches:
>
> ```javascript
> const data = await response.json()
> ```
>
> it tries to call `.json()` on the promise, finds there's no such method, and throws the error:
>
> ```
> response.json is not a function
> ```
>
> Then your `catch` block catches that error and displays it, which is exactly why you saw that message instead of a blank page or a crash — the error handling did its job, it just reported the *real* underlying problem, which was the missing `await`.
>
> Want me to point you to the fix now, or do you want to try restoring it yourself first?
:::

That's right. Without `await`, `response` holds the promise itself, not the response, and a promise has no `json` method. The error message is a *symptom*: it says `json` isn't a function, and doesn't mention `await` at all. (The reply says the message reported "the real underlying problem," but it didn't; you had to reason back from the symptom to the cause.)

There's a quieter problem hidden in that code, too. The check `response.ok === false` didn't catch anything, because a promise has no `ok` property, so `response.ok` was `undefined`, and `undefined === false` is false. The code sailed past the check to the next line.

Learn to recognize the signs of a missing `await`:

- "... is not a function" or `undefined` properties on something that came from `fetch` or another `async` function.
- `[object Promise]` appearing on the page, where text was expected.
- `Promise { <pending> }` in the Console where you expected data.

## Showing the Forecast on the Home Page

Here's the forecast as part of the club's home page, in the book's style. It adds a day of the week to each date, using what you learned about Date objects in [Email, Calendar, and Dates](email-calendar){.book-link}. Adding `T12:00` to the date text makes it noon in your time zone, which avoids the time-zone trap from that lesson:

```{.code environment="html"}
<!doctype html>
<html>
  <head>
    <title>College Community Garden</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f9f4;
        margin: 20px;
      }
      h1 {
        color: #2e7d32;
      }
      .error {
        color: darkred;
      }
    </style>
  </head>
  <body>
    <h1>College Community Garden</h1>
    <h2>Rain in the next three days</h2>
    <ul id="forecast">
      <li>Loading the forecast...</li>
    </ul>

    <script>
      const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

      async function showForecast() {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=40.25&longitude=-111.65&daily=precipitation_sum&timezone=auto&forecast_days=3"
        const list = document.querySelector("#forecast")
        try {
          const response = await fetch(url)
          if (response.ok === false) {
            throw new Error(`the weather service replied with status ${response.status}`)
          }
          const data = await response.json()
          const dates = data.daily.time
          const rainAmounts = data.daily.precipitation_sum

          // replace the "Loading" message with the forecast
          list.textContent = ""
          for (let i = 0; i < dates.length; i++) {
            // noon avoids the date shifting across time zones
            const date = new Date(`${dates[i]}T12:00`)
            const dayName = DAY_NAMES[date.getDay()]
            const item = document.createElement("li")
            item.textContent = `${dayName}: ${rainAmounts[i]} mm`
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

      showForecast()
    </script>
  </body>
</html>
```

::: {.jhm}
Two touches worth copying: the list says "Loading the forecast..." until the data arrives, so visitors know something is happening, and an error replaces it with a message a club member can understand. Try breaking the address, for example by changing `open-meteo` to `open-meteor`, to see the error message.
:::

## Your Learner Profile

::: {.learner-profile}
:::

## Summary

A browser can't freeze a page while it waits for data, so a web request there is asynchronous: `fetch` returns a promise, a stand-in for a result that arrives later. Inside an `async` function, `await` pauses until a promise is fulfilled and gives you its result, so `await fetch(url)` gets a response and `await response.json()` gets its content as an object. Everything outside the function carries on meanwhile. `fetch` only fails when there's no reply, so check `response.ok` and throw an error when the server says no. A missing `await` shows up as strange symptoms, such as "is not a function," far from the real cause. Apps Script's `UrlFetchApp` was synchronous, which is why you didn't need any of this before; fetching on a server remains a good option, especially for APIs that don't allow CORS. Next, you'll use JavaScript on pages you *don't* own, to automate sites you use.
