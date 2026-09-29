---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Describe the parts of an HTTP request and response: method, address, headers, body and status.
2. Explain the common status codes, and read an error response's body.
3. Choose the right HTTP method for an action.
4. Design a simple REST API: its addresses, methods, status codes and JSON.
5. Send requests from the terminal with `curl`.
:::
:::

## A Conversation Between Computers

Every time you've used `fetch`, `UrlFetchApp` or a browser, your code was a **client**: it sent a request to a **server**, another computer, which sent back a response. In this part of the book, you'll build the other side: servers of your own, which answer requests from browsers, from scripts, and, eventually, from a chat app.

The language of that conversation is **HTTP**, the HyperText Transfer Protocol. It's simpler than it sounds. A request says what the client wants; a response says what happened and includes the result. Understanding exactly what's in each is the foundation for everything in this part, so this lesson looks closely, before you build anything.

::: {.term}
> **HTTP** — The rules for how clients and servers on the web talk: a client sends a request, and the server sends back a response. **HTTPS** is HTTP over an encrypted connection.
:::

::: {.term}
> **Server** — A program that waits for requests and sends back responses. Also the computer it runs on.
:::

::: {.q99}
Your learner profile needs a new environment line for this part; it's at the end of this lesson.
:::

## Inside a Response

Here's a request for a script that shows what a response really contains, in a new chat with the updated profile:

::: {.ai-conversation prompt="Write a Node script that requests the Open-Meteo forecast for latitude 40.25 and longitude -111.65 and prints the response's status code, its headers, and the first 200 characters of the body, so I can see what an HTTP response really contains." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="http" transcript="http/inspect"}
> Here's a script that makes one request to Open-Meteo's public forecast API and prints out the three parts of the response.
>
> ```javascript
> // buildUrl combines the base address with the latitude and longitude
> const url = `https://api.open-meteo.com/v1/forecast?latitude=40.25&longitude=-111.65&current_weather=true`
>
> // fetch sends the request and waits for the response to arrive
> const response = await fetch(url)
>
> // status is the three-digit code, like 200 for success or 404 for not found
> console.log("Status code:", response.status)
>
> // headers describes the response: its content type, length, and so on
> // response.headers is iterable, so a for...of loop can read each pair
> console.log("Headers:")
> for (const [name, value] of response.headers) {
>   console.log(`  ${name}: ${value}`)
> }
>
> // text() reads the whole body as a string, then slice(0, 200) keeps only the start
> const body = await response.text()
> console.log("First 200 characters of body:")
> console.log(body.slice(0, 200))
> ```
>
> A few notes:
>
> - **Where this comes from**: `api.open-meteo.com` is Open-Meteo's public weather API. No API key is needed for non-commercial use, but check their terms of use if you plan to use this beyond learning.
> - **fetch** is built into Node (version 18 and later), so no package is needed.
> - Save this as something like `weather.mjs` (the `.mjs` ending tells Node to treat it as an ES module) and run it with `node weather.mjs`.
> - The body will be JSON text — you'll likely see it cut off partway through a property, since it's just the first 200 characters, not a full JSON object. That's expected; this script is just letting you see the raw shape of an HTTP response before you parse anything.
:::

::: {.hhn}
**Read.** It's short: `fetch`, then three things from the response. `response.status` is the **status code**. `response.headers` can be looped over with `for...of`, giving `[name, value]` pairs that are destructured in the loop, the syntax from [Working with Files and Folders](files){.book-link}. And `response.text()` reads the body as text. (The reply suggests a `.mjs` file name; in a project with `"type": "module"`, a `.js` name works the same.)
:::

Here's what it printed when this lesson was written:

```{.code environment="message"}
Status code: 200
Headers:
  connection: keep-alive
  content-encoding: deflate
  content-type: application/json; charset=utf-8
  date: Sun, 27 Sep 2026 04:26:48 GMT
  transfer-encoding: chunked
First 200 characters of body:
{"latitude":40.256767,"longitude":-111.66114,"generationtime_ms":0.15997886657714844,"utc_offset_seconds":0,"timezone":"GMT","timezone_abbreviation":"GMT","elevation":1427.0,"current_weather_units":{"
```

Every response has the same three parts:

- **The status code**, 200, which means the request worked.
- **Headers**: information *about* the response, as names and values. `content-type` says what kind of data the body is, here JSON. `date` is when the server sent it. `content-encoding: deflate` says the body was compressed to travel faster; `fetch` decompressed it for you.
- **The body**: the data itself.

A request has a similar shape: a **method**, such as GET or POST, an **address**, headers, and, for some methods, a body. You wrote all of these in [Calling AI Models from Your Code](ai-api){.book-link}, where the request carried headers with your API key and a JSON body with the prompt.

::: {.term .nmg}
> **Header** — A named piece of information sent with a request or response, such as `content-type: application/json`, describing the message rather than being part of its content.
:::

## When Something Goes Wrong

Continuing the chat:

::: {.ai-conversation prompt="Now make the same request with a mistake in it, so I can see an error response. What status codes should I expect to see most often, and what do they mean?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="http" transcript="http/inspect"}
> Here's the same request pattern, but missing the `longitude` parameter — a mistake you might easily make by typing too fast.
>
> ```javascript
> // This URL is missing longitude on purpose, to see how the API responds to a mistake
> const url = `https://api.open-meteo.com/v1/forecast?latitude=40.25&current_weather=true`
>
> const response = await fetch(url)
>
> console.log("Status code:", response.status)
>
> console.log("Headers:")
> for (const [name, value] of response.headers) {
>   console.log(`  ${name}: ${value}`)
> }
>
> const body = await response.text()
> console.log("First 200 characters of body:")
> console.log(body.slice(0, 200))
> ```
>
> Open-Meteo checks its parameters and should reply with a **400** status and a JSON body explaining what's wrong, rather than crashing or returning weather data.
>
> ### Status codes you'll see most often
>
> **Success**
> - **200 OK** — the request worked, and the body has what you asked for.
>
> **Client mistakes (something wrong with the request you sent)**
> - **400 Bad Request** — the request is malformed or has invalid values, like a missing parameter or a latitude out of range.
> - **401 Unauthorized** — the request needs an API key or login, and didn't provide one (or provided a bad one).
> - **403 Forbidden** — you're recognized, but not allowed to do this (missing permission, wrong plan, etc.).
> - **404 Not Found** — the address doesn't match anything, like a typo in the path or a deleted resource.
> - **429 Too Many Requests** — you've been rate-limited for sending requests too fast or too often.
>
> **Server mistakes (something wrong on their end)**
> - **500 Internal Server Error** — a generic "something broke" on the server.
> - **502 Bad Gateway** / **503 Service Unavailable** — the server (or something it depends on) is temporarily down or overloaded.
>
> A good habit, which you've already learned with `response.ok`, is: codes from 200–299 mean success, and anything else means you should read the body for an explanation before treating the data as good.
:::

Here's what the request with the missing longitude actually printed:

```{.code environment="message"}
Status code: 400
Headers:
  connection: keep-alive
  content-encoding: deflate
  content-length: 90
  content-type: application/json; charset=utf-8
  date: Sun, 27 Sep 2026 04:26:49 GMT
First 200 characters of body:
{"error":true,"reason":"Parameter 'latitude' and 'longitude' must have the same number of elements"}
```

A 400, as the assistant predicted. But look at the body's reason: not "longitude is missing," but a message about the two parameters having "the same number of elements." Open-Meteo accepts lists of locations, so a missing longitude looks to it like a mismatched list. Error messages come from whoever wrote the server, and they describe the problem from the server's point of view. Always read the body of an error response; it's usually the most specific explanation you'll get, even when it takes a moment to translate.

The assistant's list of status codes is the one to learn. The first digit tells you the most:

| Codes | Meaning | The ones you'll see |
|---|---|---|
| **2xx** | It worked | 200 OK, 201 Created, 204 No Content |
| **3xx** | Look somewhere else | 301 and 302, which redirect to another address |
| **4xx** | The request had a problem | 400 Bad Request, 401 Unauthorized (no or bad key), 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests |
| **5xx** | The server had a problem | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

The distinction between 4xx and 5xx matters when you debug: a 4xx means *your request* needs fixing, and a 5xx means the *server* broke, which, once you're writing servers, may be your code.

::: {.term .dhd}
> **Status code** — The three-digit number at the start of an HTTP response saying how the request went: 2xx success, 3xx redirect, 4xx a problem with the request, 5xx a problem on the server.
:::

## Methods

A request's **method** says what kind of action the client wants. Five cover almost everything:

| Method | Means | Example |
|---|---|---|
| **GET** | Give me something | Load a page, read the forecast |
| **POST** | Create something new, or do something | Submit a form, send a prompt, log a shift |
| **PUT** | Replace something | Replace a member's whole record |
| **PATCH** | Change part of something | Update just a member's phone number |
| **DELETE** | Remove something | Cancel a sign-up |

::: {.ftc}
One rule matters more than the rest: **a GET should never change anything.** Browsers, search engines and link previews make GET requests freely, prefetching links and checking pages. A server where visiting an address deletes something will eventually delete it by accident.
:::

## Designing an API

The club wants volunteers to sign up for shifts through a web page, instead of by email. That needs a small web API: a server that lists shifts and records sign-ups. Before writing any code, design it:

::: {.ai-conversation prompt="Our garden club wants a web API for volunteer shift sign-ups: listing upcoming shifts, seeing one shift, signing up for a shift, and canceling a sign-up. Before any code, design it: what URLs, HTTP methods and status codes should it use, and what would the JSON look like?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="http" transcript="http/rest"}
> Good project. Let's design the shape of it before writing any code — this is the part that's easy to change now and hard to change later.
>
> ## The four operations, as URLs and HTTP methods
>
> | What it does | Method | URL |
> |---|---|---|
> | List upcoming shifts | GET | `/shifts` |
> | See one shift's details | GET | `/shifts/:id` |
> | Sign up for a shift | POST | `/shifts/:id/signups` |
> | Cancel a sign-up | DELETE | `/signups/:id` |
>
> A few notes on this:
>
> - **GET** means "just show me something," so listing and viewing use GET. You've done this already with `fetch()` against other APIs.
> - **POST** creates something new — here, a sign-up. You've used this with `doPost` and `fetch` with `method: "POST"`.
> - **DELETE** is a method you haven't used yet. It's built for exactly this: "remove this thing." Like POST, the browser or your code sends a request with that method name, and the server decides what to remove based on the URL.
> - Notice sign-ups get their own URL (`/signups/:id`) separate from shifts. Each sign-up is its own "thing" with its own id, even though it belongs to a shift. That's why signing up is `POST /shifts/:id/signups` (create a sign-up *under* a shift) but canceling is `DELETE /signups/:id` (act on the sign-up directly, since you no longer need to mention which shift once you have the sign-up's own id).
>
> ## Status codes to use
>
> | Situation | Code | Meaning |
> |---|---|---|
> | Successful GET | 200 | OK, here's the data |
> | Successful sign-up created | 201 | Created |
> | Successful cancellation | 204 | No Content (worked, nothing to send back) |
> | Shift or sign-up id doesn't exist | 404 | Not Found |
> | Sign-up request missing a name, or shift already full | 400 | Bad Request |
>
> (A shift being full could also arguably be 409 Conflict, but 400 is simpler and you already understand "bad request." We can revisit this.)
>
> ## JSON shapes
>
> **A shift**, as returned by `GET /shifts/:id`:
> ```json
> {
>   "id": 1,
>   "date": "2025-06-14",
>   "startTime": "09:00",
>   "endTime": "11:00",
>   "role": "Weeding",
>   "capacity": 4,
>   "signups": [
>     { "id": 101, "name": "Ava" },
>     { "id": 102, "name": "Sam" }
>   ]
> }
> ```
>
> **The list**, from `GET /shifts` — same shifts, but maybe without the full sign-up list, just a count, so the list stays short:
> ```json
> [
>   { "id": 1, "date": "2025-06-14", "startTime": "09:00", "endTime": "11:00", "role": "Weeding", "capacity": 4, "spotsFilled": 2 },
>   { "id": 2, "date": "2025-06-15", "startTime": "13:00", "endTime": "15:00", "role": "Watering", "capacity": 2, "spotsFilled": 2 }
> ]
> ```
>
> **Signing up** — what the page sends, `POST /shifts/1/signups`:
> ```json
> { "name": "Priya" }
> ```
>
> **What the server sends back**, 201:
> ```json
> { "id": 103, "shiftId": 1, "name": "Priya" }
> ```
>
> **An error**, whatever the code:
> ```json
> { "error": "Shift not found" }
> ```
>
> ## Questions before we code
>
> 1. Do you want anything besides a name for a sign-up — an email, for reaching volunteers later?
> 2. Should `GET /shifts` show *all* shifts or only ones in the future (comparing to today's date)?
> 3. When a shift is full, should sign-up just fail (400), or is a waitlist something you want later? (I'd say start simple: just fail.)
> 4. Where should the data live to start — an array in memory (resets when the server restarts), or a JSON file read and written with `fs`? Since sign-ups are data you don't want to lose, a file makes more sense once we write real code, and whatever stores it should double-check the incoming name isn't empty, not just trust the page.
>
> Once you answer these, I'll write the server.
:::

This is a design in the style called **REST**, the most common way to organize a web API, and it follows its main ideas:

- **Addresses name things, and methods say what to do with them.** `/shifts` is the list of shifts, and `/shifts/1` is one shift. GET reads them; POST creates a sign-up; DELETE removes one. The addresses are nouns, not verbs: `/signups/101` with DELETE, not `/cancelSignup?id=101`.
- **`:id` marks a part of the address that changes,** called a *path parameter*: `/shifts/1`, `/shifts/2` and so on.
- **Status codes say what happened:** 201 when a sign-up is created, 204 when a cancellation worked and there's nothing to send back, 404 for an id that doesn't exist.
- **Requests and responses are JSON,** including errors, which always have the same shape, `{ "error": "..." }`, so a client can show the message.

::: {.term .kt7}
> **REST** — A common way of designing web APIs, in which addresses name resources, such as `/shifts/1`, and HTTP methods say what to do with them.
:::

The example data is invented, including volunteers named Sam and Priya, and dates in 2025. The club's real shifts are in its data. And the assistant ended by asking four good questions, which a design should answer before code is written. Here are the club's answers, which the next lessons build on:

::: {.kpp}
1. **Sign-ups use the member's email,** which must belong to a club member. But the API must not *show* emails: `GET /shifts/1` lists how many spots are filled, not who filled them. An API that anyone can call is as public as a web page.
2. **`GET /shifts` shows upcoming shifts.** The club's data has eight, on Saturdays in June 2027.
3. **A full shift gets 409 Conflict.** 409 means "this request conflicts with the current state," which is exactly what signing up for a full shift is, and it lets the page tell a full shift apart from a mistake in the request. Signing up twice for the same shift is also a 409.
4. **Storage** comes in steps: in memory in the next lesson, then in a database in the one after.
:::

## Trying Requests from the Terminal

A browser can make GET requests, by visiting an address, but not easily other methods. **curl** is a small program for making any HTTP request from a terminal, and it's built into Windows 10 and later, Mac and Linux:

```{.code environment="none"}
curl -i "https://api.open-meteo.com/v1/forecast?latitude=40.25&longitude=-111.65&daily=precipitation_sum"
```

`-i` shows the status and headers as well as the body. In the next lesson, you'll use curl to send POST and DELETE requests to your own server.

::: {.caution .ssx}
> **curl in PowerShell.** In Windows PowerShell, `curl` is a nickname for a different command, `Invoke-WebRequest`, which takes different options. Type **`curl.exe`** instead, to get the real curl. In Command Prompt, Mac and Linux, plain `curl` is fine.
:::

## Your Learner Profile

::: {.learner-profile}
:::

## Summary

HTTP is how clients and servers talk: a request has a method, an address, headers and sometimes a body, and a response has a status code, headers and a body. Status codes group by first digit: 2xx worked, 3xx redirect, 4xx a problem with the request, 5xx a problem on the server; the body of an error response usually says the most, even if it takes some translating. GET reads, POST creates, PUT and PATCH change, DELETE removes, and a GET must never change anything. A REST API names things with addresses, like `/shifts/1`, and uses methods and status codes to say what happens to them, with JSON for data and errors. The club's sign-up API is designed, including what it must not reveal. `curl` sends any request from a terminal. Next, you'll build the server.
