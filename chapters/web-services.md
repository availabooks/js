---
_$_import: monaco, appsscript
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain what a web API is, and read the parts of an API's web address.
2. Get data from a web service with `UrlFetchApp`, and turn its JSON reply into an object.
3. Handle errors with `try` and `catch`, without hiding them.
4. Send data to a web service, such as posting a message through a webhook.
5. Keep secrets, like webhook addresses, out of your code with Script Properties.
:::
:::

## Asking Another Computer

So far, your scripts have worked with data you already had: the club's spreadsheet, its documents and calendar. A lot of useful data lives elsewhere: weather forecasts, maps, exchange rates, sports scores. Many services make their data available to programs through a **web API**: a web address your code can request, which replies with data instead of a web page.

::: {.term}
> **API** — Application Programming Interface: a set of rules for how one program can ask another for data or services. A *web API* is one you reach by requesting a web address.
:::

The club's problem is watering. In dry weather, someone has to water the beds; when rain is coming, they don't. Checking the forecast every morning is exactly the kind of chore a script can do. **Open-Meteo** is a free weather API that needs no account and no key, which makes it a good first API. (Check its terms before relying on it for anything important; at the time of writing, it's free for non-commercial use.)

## Reading an API's Address

An API request is a web address with the question built into it. Here's one for Open-Meteo:

<pre class="code" data-environment="none">
https://api.open-meteo.com/v1/forecast?latitude=40.25&longitude=-111.65&daily=precipitation_sum&timezone=auto
</pre>

Read it in two parts:

- **Before the `?`** is the address of the service: `api.open-meteo.com`, and the part of it you want, `/v1/forecast`.
- **After the `?`** is the **query string**: pairs of `name=value`, separated by `&`. Here they ask for the forecast at latitude 40.25 and longitude -111.65, with the total precipitation for each day, in the local time zone.

The names, like `daily` and `precipitation_sum`, come from the service's documentation. Every API has its own. That's worth remembering when an assistant writes an API request: it's recalling the names from what it learned, and APIs change. If a request fails, the documentation is the place to check.

Open that address in your browser, and you'll see the reply: JSON. Here's a real one, captured while this lesson was written:

<pre class="code" data-environment="none">
{"latitude":40.256767,"longitude":-111.66114,"generationtime_ms":0.05125999450683594,"utc_offset_seconds":-21600,"timezone":"America/Denver","timezone_abbreviation":"GMT-6","elevation":1427.0,"daily_units":{"time":"iso8601","precipitation_sum":"mm"},"daily":{"time":["2026-09-26","2026-09-27","2026-09-28"],"precipitation_sum":[0.00,0.00,1.70]}}
</pre>

(That reply asked for three days, with `&forecast_days=3` added to the address. Without it, you get seven.) The part you need is `daily`: an object with two arrays, `time` with the dates and `precipitation_sum` with the rain in millimeters. They're parallel arrays, like the ones in [Google Forms](google-forms){.book-link}: the rain for `time[1]` is `precipitation_sum[1]`.

## Getting the Forecast

Here's the request, in a new chat with your learner profile from [Custom Functions in Sheets](custom-functions){.book-link}:

::: {.ai-conversation prompt="Use the free Open-Meteo weather API, which doesn't need a key, to get tomorrow's total rainfall forecast for latitude 40.25 and longitude -111.65, and log it." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="custom-functions" transcript="web-services/weather"}
> This task needs one new tool: **`UrlFetchApp.fetch(url)`**, which is the Apps Script method for calling a web address and getting back its response. It's how you talk to an API like Open-Meteo. You'll also use two small helper pieces that go with it:
>
> - **`.getContentText()`** — pulls the plain text out of the response `UrlFetchApp.fetch()` gives you
> - **`Session.getScriptTimeZone()`** — gets the time zone your script is set to, so `Utilities.formatDate()` can use it
>
> Everything else in the code below uses concepts you already know: template literals, JSON.parse, parallel arrays, and a for loop search.
>
> Here's the plan: build tomorrow's date as text, ask Open-Meteo for the daily rainfall forecast, then search for the row that matches tomorrow's date.
>
> ```javascript
> // Settings for the location, kept at the top so they're easy to find and change
> const LATITUDE = 40.25
> const LONGITUDE = -111.65
>
> function logTomorrowRainfall() {
>   // Figure out tomorrow's date
>   const today = new Date()
>   const tomorrow = new Date()
>   tomorrow.setDate(today.getDate() + 1)
>
>   // Turn tomorrow's date into text like "2025-05-21" to match the API's format
>   const timeZone = Session.getScriptTimeZone()
>   const tomorrowText = Utilities.formatDate(tomorrow, timeZone, "yyyy-MM-dd")
>
>   // Build the web address to ask Open-Meteo for daily rainfall totals
>   const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=precipitation_sum&timezone=auto`
>
>   // Fetch the data from the API and turn it into an object
>   const response = UrlFetchApp.fetch(url)
>   const responseText = response.getContentText()
>   const data = JSON.parse(responseText)
>
>   // The API gives back two parallel arrays: dates and rainfall amounts
>   const dates = data.daily.time
>   const rainfallAmounts = data.daily.precipitation_sum
>
>   // Search the dates array for the index that matches tomorrow
>   let tomorrowIndex = -1
>   for (let i = 0; i < dates.length; i++) {
>     if (dates[i] === tomorrowText) {
>       tomorrowIndex = i
>     }
>   }
>
>   // Log the result, or say if it wasn't found
>   if (tomorrowIndex === -1) {
>     Logger.log("Tomorrow's forecast was not found")
>   } else {
>     const tomorrowRainfall = rainfallAmounts[tomorrowIndex]
>     Logger.log(`Tomorrow's total rainfall forecast: ${tomorrowRainfall} mm`)
>   }
> }
> ```
>
> A couple of notes:
>
> - The first time you run this, Apps Script will ask you to authorize it, since fetching a web address needs permission (even though this API doesn't need a key).
> - This is a read-only call — it doesn't send email, touch Calendar, or change Drive files — so there's no need for a dry run here.
>
> Want me to explain any part of this in more depth, like how the JSON structure from the API is shaped?
:::

**Read.**

- The location goes in constants at the top, as in [Generating Documents](documents){.book-link}.
- Tomorrow's date is turned into text in the same form the API uses, with `Utilities.formatDate` from [Email, Calendar, and Dates](email-calendar){.book-link}.
- The address is built with a template literal, dropping in the latitude and longitude. It matches the one you just read, which is a good sign: the assistant knows this API's parameter names.
- **`UrlFetchApp.fetch(url)`** requests the address and returns a response. `getContentText()` gets the reply as text, and `JSON.parse` turns the text into an object, as you learned in [Objects and JSON](objects){.book-link}.
- The rest searches the `time` array for tomorrow, and uses the index to read the rain.

A detail for later: `timezone=auto` gives dates in the *garden's* time zone, and `Utilities.formatDate` uses your *script's*. If the two differ, "tomorrow" can mean different days. Set your project's time zone, in the editor's Project Settings, to the garden's.

The assistant pointed out that the first run asks for permission. At the time of writing, the permission reads "Connect to an external service." It's worth pausing on. A script with that permission can send data anywhere on the internet, including data from your spreadsheet. That's fine for this script, which only requests a forecast, but it's a permission to take seriously in code you haven't read.

### Try the reading part here

This page can't make web requests from Apps Script, but it can run everything that happens after the reply arrives. The code below uses the real reply from above, as text, and finds the rain for September 28, 2026. Run it:

<pre class="code">
function testReadForecast() {
  const responseText = '{"latitude":40.256767,"longitude":-111.66114,"generationtime_ms":0.05125999450683594,"utc_offset_seconds":-21600,"timezone":"America/Denver","timezone_abbreviation":"GMT-6","elevation":1427.0,"daily_units":{"time":"iso8601","precipitation_sum":"mm"},"daily":{"time":["2026-09-26","2026-09-27","2026-09-28"],"precipitation_sum":[0.00,0.00,1.70]}}'
  const rain = rainForDate(responseText, "2026-09-28")
  console.log(`Rain expected: ${rain} mm`)
}

// Finds the forecast rain for one date in an Open-Meteo reply,
// or returns -1 if the date isn't in the reply
function rainForDate(responseText, dateText) {
  const data = JSON.parse(responseText)
  const dates = data.daily.time
  const rainfallAmounts = data.daily.precipitation_sum
  for (let i = 0; i < dates.length; i++) {
    if (dates[i] === dateText) {
      return rainfallAmounts[i]
    }
  }
  return -1
}
</pre>

The string is in single quotes, `'...'`, because the JSON inside it is full of double quotes. Either kind of quote can start a string, as long as the same kind ends it. Try other dates, including one that isn't in the reply.

Separating `rainForDate` from the part that fetches is the same habit as in [Generating Documents](documents){.book-link}: the calculating part can be tested anywhere, and the part that talks to the outside world stays small.

## When Things Go Wrong

Code that depends on another computer can fail for reasons that have nothing to do with the code: the service is down, the internet connection drops, or the service changes its reply. This script will run on a trigger every morning, so it's worth asking about:

::: {.ai-conversation prompt="This will run every morning on a trigger. What happens if the weather service is down, or sends back an error? How should the code handle that?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="custom-functions" transcript="web-services/weather"}
> Good question — right now, if Open-Meteo is down or sends back bad data, `UrlFetchApp.fetch()` will throw an error and stop the script. Since this runs on a trigger with nobody watching, that error just sits on the **Executions page** (which you already know how to check) — but you won't get any warning unless you go look.
>
> This needs one new concept: **try/catch**. It lets you say "try these steps, and if any of them cause an error, do something else instead of stopping the whole script." It looks like this:
>
> ```javascript
> try {
>   // steps that might fail
> } catch (error) {
>   // steps to run instead, if something above failed
> }
> ```
>
> Here's the updated code using it:
>
> ```javascript
> // Settings for the location, kept at the top so they're easy to find and change
> const LATITUDE = 40.25
> const LONGITUDE = -111.65
>
> function logTomorrowRainfall() {
>   // Figure out tomorrow's date
>   const today = new Date()
>   const tomorrow = new Date()
>   tomorrow.setDate(today.getDate() + 1)
>
>   // Turn tomorrow's date into text like "2025-05-21" to match the API's format
>   const timeZone = Session.getScriptTimeZone()
>   const tomorrowText = Utilities.formatDate(tomorrow, timeZone, "yyyy-MM-dd")
>
>   // Build the web address to ask Open-Meteo for daily rainfall totals
>   const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=precipitation_sum&timezone=auto`
>
>   // Try to fetch and read the data, and catch it if anything goes wrong
>   try {
>     const response = UrlFetchApp.fetch(url)
>     const responseText = response.getContentText()
>     const data = JSON.parse(responseText)
>
>     // The API gives back two parallel arrays: dates and rainfall amounts
>     const dates = data.daily.time
>     const rainfallAmounts = data.daily.precipitation_sum
>
>     // Search the dates array for the index that matches tomorrow
>     let tomorrowIndex = -1
>     for (let i = 0; i < dates.length; i++) {
>       if (dates[i] === tomorrowText) {
>         tomorrowIndex = i
>       }
>     }
>
>     if (tomorrowIndex === -1) {
>       Logger.log("Tomorrow's forecast was not found in the response")
>     } else {
>       const tomorrowRainfall = rainfallAmounts[tomorrowIndex]
>       Logger.log(`Tomorrow's total rainfall forecast: ${tomorrowRainfall} mm`)
>     }
>
>   } catch (error) {
>     // This runs if fetch(), getContentText(), JSON.parse(), or anything else above failed
>     Logger.log(`Could not get rainfall forecast: ${error}`)
>   }
> }
> ```
>
> A few notes on how this behaves:
>
> - If Open-Meteo is completely unreachable, `UrlFetchApp.fetch()` throws an error, and the `catch` block logs it instead of the script crashing silently.
> - If Open-Meteo responds but with an error status (like a server error), `fetch()` also throws by default — so that's caught too.
> - If the response comes back but isn't shaped the way you expect (missing data), `JSON.parse()` or reading `data.daily.time` might fail, and that's caught as well.
>
> **Setting up the trigger:**
> 1. In the Apps Script editor, click the clock icon ("Triggers") in the left sidebar.
> 2. Click **Add Trigger**.
> 3. Choose `logTomorrowRainfall` as the function to run.
> 4. Set the event source to **Time-driven**, then pick **Day timer** and choose a morning time range.
>
> **Testing without waiting:**
> Just select `logTomorrowRainfall` in the function dropdown at the top of the editor and click **Run**. Since it's not tied to `onEdit` or `onOpen`, it doesn't need a fake event object — you can run it directly anytime.
>
> Would you like to also have it email you if the fetch fails, so you don't have to check the Executions page yourself?
:::

**`try` and `catch`** are the new idea. JavaScript runs the code in the `try` block. If any line there causes an error, it stops that block immediately and runs the `catch` block instead, with the error in the variable named in the parentheses. Try it:

<pre class="code">
try {
  console.log("Before the problem")
  const data = JSON.parse("this is not JSON")
  console.log("This line never runs")
} catch (error) {
  console.log(`Something went wrong: ${error}`)
}
console.log("The program carries on")
</pre>

::: {.term}
> **try...catch** — A statement that runs the code in its `try` block, and if an error happens there, runs the `catch` block instead of stopping the whole program.
:::

The assistant's explanation of *what* can fail is good: an unreachable service, an error from the service, and a reply in an unexpected shape. But look at what its `catch` block does with the error: it logs it. For a script run by a trigger, that's worse than doing nothing. Without `try`, a failure would stop the script and show up as *Failed* on the Executions page. With this `catch`, the script finishes normally, the run is marked *Completed*, and the only trace of the problem is a line in a log that nobody reads. The assistant said the catch keeps the script from "crashing silently," but it actually makes the failure quieter.

Catching an error is only useful if you *do* something with it: tell someone, try again, or use a sensible fallback. The assistant's closing offer, to email you when the fetch fails, is the right idea. Another option is to log the error and then let it continue to the Executions page, with `throw error` at the end of the `catch` block. `throw` raises an error on purpose, so the run is marked as failed and, if you asked for failure notifications when you set up the trigger, Google emails you.

<pre class="code">
function checkForecast() {
  try {
    const data = JSON.parse("this is not JSON")
  } catch (error) {
    console.log(`Could not read the forecast: ${error}`)
    // raise the error again, so the run is marked as failed
    throw error
  }
}
</pre>

A good way to test error handling: break the address on purpose, for example by misspelling `open-meteo`, and run the script. Then put it back.

## Sending Data: a Webhook

The club talks in a Discord channel, so the most useful place for a watering alert is there. Discord, Slack and many other services offer **incoming webhooks**: a secret web address that posts whatever you send it as a message in a particular channel. Continuing the chat:

::: {.ai-conversation prompt="Instead of email, our club has a Discord channel with an incoming webhook. If less than 2 mm of rain is expected tomorrow, post a message to the channel saying the beds need watering. How do I do that, and where should I keep the webhook address?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="custom-functions" transcript="web-services/weather"}
> This needs two new things:
>
> **1. `PropertiesService`** — a way to store a value (like a secret webhook address) outside your code, so it's not sitting in plain text in a file that other club members might see if they open the script. You set it once through the editor, then read it in code with `PropertiesService.getScriptProperties().getProperty("KEY_NAME")`.
>
> **2. An options object for `UrlFetchApp.fetch()`** — so far you've only used `fetch(url)` to *read* data. To *send* data (a message) to Discord, you pass a second argument describing the request: what method to use (`post`), what kind of data you're sending (`application/json`), and the actual message (`payload`). It looks like this:
>
> ```javascript
> UrlFetchApp.fetch(url, {
>   method: "post",
>   contentType: "application/json",
>   payload: JSON.stringify({ content: "some message" })
> })
> ```
>
> **Setting up the webhook address:**
> 1. In the Apps Script editor, click the gear icon ("Project Settings") in the left sidebar.
> 2. Scroll to **Script Properties** and click **Add script property**.
> 3. Set the property name to `DISCORD_WEBHOOK_URL` and paste in your Discord webhook address as the value.
> 4. Save.
>
> Since posting to Discord is an external action with a visible effect (like sending email), I've written it as a **dry run** first — it logs what it would post instead of actually posting. Here's the code:
>
> ```javascript
> // Settings for the location, kept at the top so they're easy to find and change
> const LATITUDE = 40.25
> const LONGITUDE = -111.65
> const RAIN_THRESHOLD_MM = 2
>
> function logTomorrowRainfall() {
>   // Figure out tomorrow's date
>   const today = new Date()
>   const tomorrow = new Date()
>   tomorrow.setDate(today.getDate() + 1)
>
>   // Turn tomorrow's date into text like "2025-05-21" to match the API's format
>   const timeZone = Session.getScriptTimeZone()
>   const tomorrowText = Utilities.formatDate(tomorrow, timeZone, "yyyy-MM-dd")
>
>   // Build the web address to ask Open-Meteo for daily rainfall totals
>   const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=precipitation_sum&timezone=auto`
>
>   try {
>     const response = UrlFetchApp.fetch(url)
>     const responseText = response.getContentText()
>     const data = JSON.parse(responseText)
>
>     // The API gives back two parallel arrays: dates and rainfall amounts
>     const dates = data.daily.time
>     const rainfallAmounts = data.daily.precipitation_sum
>
>     // Search the dates array for the index that matches tomorrow
>     let tomorrowIndex = -1
>     for (let i = 0; i < dates.length; i++) {
>       if (dates[i] === tomorrowText) {
>         tomorrowIndex = i
>       }
>     }
>
>     if (tomorrowIndex === -1) {
>       Logger.log("Tomorrow's forecast was not found in the response")
>     } else {
>       const tomorrowRainfall = rainfallAmounts[tomorrowIndex]
>       Logger.log(`Tomorrow's total rainfall forecast: ${tomorrowRainfall} mm`)
>
>       // If not enough rain is expected, post an alert
>       if (tomorrowRainfall < RAIN_THRESHOLD_MM) {
>         const message = `Only ${tomorrowRainfall} mm of rain expected tomorrow — the beds need watering!`
>         postToDiscord(message)
>       }
>     }
>
>   } catch (error) {
>     Logger.log(`Could not get rainfall forecast: ${error}`)
>   }
> }
>
> // Posts a message to the club's Discord channel using the incoming webhook
> function postToDiscord(message) {
>   const properties = PropertiesService.getScriptProperties()
>   const webhookUrl = properties.getProperty("DISCORD_WEBHOOK_URL")
>
>   // Discord expects the message inside an object with a "content" property
>   const payload = JSON.stringify({ content: message })
>
>   // DRY RUN: log what would be sent instead of actually sending it
>   Logger.log(`Would post to Discord: ${message}`)
>
>   // When you're ready to send for real, uncomment the lines below
>   // const options = {
>   //   method: "post",
>   //   contentType: "application/json",
>   //   payload: payload
>   // }
>   // UrlFetchApp.fetch(webhookUrl, options)
> }
> ```
>
> **Testing this without waiting for tomorrow's real forecast:**
> You can temporarily change the `if (tomorrowRainfall < RAIN_THRESHOLD_MM)` line to something like `if (true)` to force the alert branch to run, then change it back afterward.
>
> Once you've checked the Execution log and are happy with the dry run message, just let me know and I'll show you the version with the real `UrlFetchApp.fetch()` call turned on.
:::

**Read.** Two new ideas:

- **Sending, not just getting.** `UrlFetchApp.fetch` takes a second argument, an options object. `method: "post"` means "I'm sending something," `contentType` says it's JSON, and `payload` is the message itself, turned into JSON text. Discord expects an object with a `content` property holding the message, a detail the assistant knew from Discord's documentation.
- **Script Properties.** The webhook address isn't in the code. It's stored in the project's settings, and `PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL")` reads it when the script runs.

The assistant applied your dry-run rule to Discord, too, even though the rule doesn't name it: `postToDiscord` logs the message, and the real request is commented out. That's a sensible reading of the rule's intent.

Its suggestion for testing, temporarily changing the `if` to `if (true)`, works, but it's easy to forget to change back. A cleaner way, now that the reading is in its own function, is to test the decision with made-up rain amounts, as you did with `rainForDate`.

::: {.term}
> **Webhook** — A web address that another service gives you, so your code can send it data. An *incoming* webhook posts what you send as a message in a chat channel.
:::

### Why keep the address secret

Anyone who has a webhook address can post to your channel, as your club, with no password. So treat it like a password. Code gets shared, copied into chats with assistants, and pasted into forums when you ask for help, and a secret written in the code goes wherever the code goes. Script Properties keeps it separate: someone can read your code without seeing the address.

::: {.caution}
> **Never paste a secret into a chat.** Webhook addresses, API keys and passwords don't belong in your prompts either. If you ask an assistant about code that uses one, replace it with a placeholder like `YOUR_WEBHOOK_URL` first. If a secret does leak, most services let you delete it and make a new one; in Discord, that's in the channel's Integrations settings.
:::

::: {.screenshot-needed file="images/web-services-script-properties.png"}
The Apps Script Project Settings page, scrolled to Script Properties, with one property named DISCORD_WEBHOOK_URL (its value hidden).
:::

## Your Learner Profile

::: {.ai-profile lesson="web-services"}
Add rules:

- Keep secrets such as webhook addresses and API keys out of the code. Store them in Script Properties.

Add to "What I know so far":

- web APIs, query strings, and reading JSON replies
- UrlFetchApp.fetch() and getContentText(), including posting JSON with an options object
- try and catch, and throw to raise an error again so a failure isn't hidden
- incoming webhooks
- PropertiesService.getScriptProperties() for storing secrets
- strings in single quotes, useful when the text contains double quotes
:::

The new rule makes keeping secrets out of the code the default, so you don't have to remember to ask.

## Summary

A web API lets your code ask another computer for data by requesting a web address, with the question in the query string. `UrlFetchApp.fetch` makes the request in Apps Script, and most APIs reply with JSON, which `JSON.parse` turns into an object. An assistant writes API requests from memory, so check the names against the service's documentation if something fails. Code that depends on the internet can fail for reasons outside your control; `try` and `catch` let you handle the failure, but catching an error and only logging it hides the problem, so notify someone or `throw` it again. `fetch` can also send data, such as a message to a chat channel through an incoming webhook. A webhook address is a secret, so keep it in Script Properties, never in your code or your prompts. Next, you'll build a web page with Apps Script, and take your first look at HTML.
