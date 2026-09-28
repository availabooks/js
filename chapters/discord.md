---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain how a chat platform calls *your* code when someone uses a slash command.
2. Verify that a request really comes from Discord, by checking its signature.
3. Register a slash command with Discord's API, keeping the bot's token secret.
4. Answer a command from a Cloudflare Worker, using the club's database.
5. Compare bots on Discord, Telegram and Slack.
:::
:::

## When the Platform Calls You

In [Talking to Web Services](web-services){.book-link}, your code posted to a Discord channel through a webhook: your code called Discord. A **slash command** works the other way around. When a member types `/nextshift` in the club's Discord server, Discord sends a request to an address *you* chose, and your code's response becomes the bot's reply. Your Worker is now the server, and Discord is the client.

That changes the security question. A webhook address was a secret you kept. An address that Discord calls is one anyone could call, pretending to be Discord. So every request has to be checked, and Discord makes that possible by *signing* each one.

::: {.term}
> **Slash command** — A command in a chat app, such as `/nextshift`, that the platform sends to a bot's code, and whose response it shows as the bot's reply.
:::

## Asking for the Command

Here's the request, in a new chat with your learner profile from [A Full-Stack App](full-stack){.book-link}. It includes the Worker's code, following your rule about changing existing code:

::: {.ai-conversation prompt="Here is our sign-up app's Cloudflare Worker, src/index.js: (then paste the file) Our club talks on Discord. I want a slash command, /nextshift, that replies with the next shift that still has spots left, handled by this same Worker at the path /discord. Explain the setup in the Discord Developer Portal, how the Worker should verify that requests really come from Discord, how to register the command, and where the bot's secrets go. Use no packages in the Worker if you can." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="full-stack" transcript="discord/nextshift"}
> This is a good multi-part task. I'll walk through it in order: Portal setup, how verification works, the Worker code, registering the command, and where secrets live.
>
> **One reminder up front:** you'll be calling Discord's API and running a bot inside their platform, so it's worth glancing at [Discord's Developer Terms of Service and Developer Policy](https://discord.com/developers/docs/policies-and-agreements/developer-terms-of-service) to make sure a simple club sign-up bot fits within them (it should — this is exactly what the interactions API is for).
>
> ## Part 1: Discord Developer Portal setup
>
> 1. Go to https://discord.com/developers/applications and click **New Application**. Name it something like "Garden Shifts".
> 2. On the **General Information** page, note two values you'll need:
>    - **Application ID**
>    - **Public Key** (this one isn't secret — it's used to *verify* signatures, not create them)
> 3. Leave the **Interactions Endpoint URL** field blank for now — you'll fill it in after the Worker is deployed, because Discord immediately tests it.
> 4. Go to the **Bot** tab, click **Add Bot** if there isn't one, and copy the **Bot Token**. This *is* secret — treat it like a password. You only need it to register the command (Part 4), not while the Worker is running.
> 5. Go to **OAuth2 → URL Generator**, check the scope **applications.commands** (you don't need the "bot" scope just to reply to slash commands), copy the generated URL, open it, and add the app to your club's server.
>
> ## Part 2: How verification works
>
> Every request Discord sends to your endpoint is signed with a private key only Discord holds. Your Worker checks the signature using the **public key** from step 2. Two headers arrive with each request: `X-Signature-Ed25519` (the signature) and `X-Signature-Timestamp`. The rule is: take the timestamp joined with the *exact raw text* of the request body, and check that against the signature.
>
> Two things here are new for you, so I want to flag them rather than use them silently:
>
> - **`crypto.subtle`** is part of the Web Crypto API, a built-in cryptography toolkit available in both browsers and Cloudflare Workers. We'll use `importKey` (load the public key in a usable format) and `verify` (check the signature).
> - **`parseInt(text, base)`** reads text as a number in a given base — we need base 16 because the keys and signatures arrive as hex text. It's like `Number()` but lets you pick the base.
>
> One honest caveat: I'm fairly confident Cloudflare Workers support the algorithm name `"Ed25519"` with raw-format keys in `crypto.subtle`, since Cloudflare added this a while back — but I haven't personally run this exact code against Discord's endpoint check. **Deploy it, then try setting the Interactions Endpoint URL in the Portal** — if Discord reports it can't verify the endpoint, tell me, and we'll fall back to the `discord-interactions` package (published by Discord itself on npm, widely used) which does the same check.
>
> ## Part 3: Worker code
>
> Add this to `src/index.js`:
>
> ```js
> // checks that a request to /discord was really signed by Discord
> async function verifyDiscordRequest(request, publicKeyHex) {
>   const signature = request.headers.get("x-signature-ed25519")
>   const timestamp = request.headers.get("x-signature-timestamp")
>   const body = await request.text() // raw text - the signature covers these exact bytes
>   if (signature === null || timestamp === null) {
>     return { valid: false, body }
>   }
>   const key = await crypto.subtle.importKey(
>     "raw",
>     hexToBytes(publicKeyHex),
>     { name: "Ed25519" },
>     false,
>     ["verify"]
>   )
>   const message = new TextEncoder().encode(timestamp + body)
>   const valid = await crypto.subtle.verify("Ed25519", key, hexToBytes(signature), message)
>   return { valid, body }
> }
>
> // turns hex text like "1a2b" into raw bytes
> function hexToBytes(hex) {
>   const bytes = new Uint8Array(hex.length / 2)
>   for (let i = 0; i < bytes.length; i++) {
>     bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
>   }
>   return bytes
> }
>
> // handles Discord's interactions - both its "are you alive" check and /nextshift
> async function handleDiscord(request, env) {
>   const { valid, body } = await verifyDiscordRequest(request, env.DISCORD_PUBLIC_KEY)
>   if (valid === false) {
>     return new Response("Bad signature", { status: 401 })
>   }
>   const interaction = JSON.parse(body)
>
>   // type 1 is Discord's endpoint check - answer it the same way, every time
>   if (interaction.type === 1) {
>     return json({ type: 1 })
>   }
>
>   // type 2 is someone running a slash command
>   if (interaction.type === 2 && interaction.data && interaction.data.name === "nextshift") {
>     const shift = await env.DB.prepare(
>       `${SHIFT_QUERY} GROUP BY slots.id HAVING COUNT(slotSignups.id) < slots.capacity ORDER BY slots.date, slots.start LIMIT 1`
>     ).first()
>     const content = shift === null
>       ? "No upcoming shifts have open spots."
>       : `Next open shift: ${shift.task} on ${shift.date}, ${shift.start}–${shift.end} (${shift.spotsFilled}/${shift.capacity} filled)`
>     // type 4 means "reply immediately with this message"
>     return json({ type: 4, data: { content } })
>   }
>
>   return json({ error: "Unhandled interaction" }, 400)
> }
> ```
>
> And add a route in `fetch`, alongside your other routes:
>
> ```js
> if (method === "POST" && parts.length === 1 && parts[0] === "discord") {
>   return handleDiscord(request, env)
> }
> ```
>
> The `HAVING COUNT(slotSignups.id) < slots.capacity` line filters *after* grouping, keeping only shifts that aren't full — `HAVING` is needed instead of `WHERE` here because it checks a totalled (aggregate) value.
>
> ## Part 4: Registering the command
>
> Registering a command is a one-time (or occasional) call to Discord's REST API, done with your bot token — not something the Worker itself needs to do. Run it locally as a small script, separate from the Worker:
>
> ```js
> // register-command.js
> // Run with: node --env-file=.env register-command.js
>
> const appId = process.env.DISCORD_APP_ID
> const guildId = process.env.DISCORD_GUILD_ID // your club's server ID - guild commands show up instantly, global ones take up to an hour
> const token = process.env.DISCORD_BOT_TOKEN
>
> const command = {
>   name: "nextshift",
>   description: "Show the next shift that still has open spots",
>   type: 1 // a slash command
> }
>
> const url = `https://discord.com/api/v10/applications/${appId}/guilds/${guildId}/commands`
>
> const response = await fetch(url, {
>   method: "POST",
>   headers: {
>     "Authorization": `Bot ${token}`,
>     "content-type": "application/json"
>   },
>   body: JSON.stringify(command)
> })
>
> if (response.ok === false) {
>   throw new Error(`Discord replied with ${response.status}: ${await response.text()}`)
> }
>
> console.log("Command registered:", await response.json())
> ```
>
> Find your server's ID by right-clicking the server icon in Discord with Developer Mode on (User Settings → Advanced → Developer Mode).
>
> ## Part 5: Where secrets go
>
> | Value | Secret? | Where it lives |
> |---|---|---|
> | Bot Token | Yes | `.env` file next to `register-command.js`, read as `process.env.DISCORD_BOT_TOKEN`. Never in the Worker. Add `.env` to `.gitignore`. |
> | Application ID, Guild ID | Not really secret, but config | Same `.env` file, for convenience |
> | Public Key | Not secret (it's for verifying, not signing) | Set as a Cloudflare Worker secret with `wrangler secret put DISCORD_PUBLIC_KEY`, read in the Worker as `env.DISCORD_PUBLIC_KEY` |
>
> The Worker never needs the bot token, since it only *replies* to interactions directly — it doesn't call Discord's API itself.
>
> ## Part 6: Testing it
>
> 1. Deploy the Worker first: `wrangler deploy`.
> 2. In the Portal's General Information page, set **Interactions Endpoint URL** to `https://your-worker.workers.dev/discord` and save. Discord sends a type-1 PING right then — if verification fails, it'll refuse to save and tell you.
> 3. Run `register-command.js` once.
> 4. In your club's Discord server, type `/nextshift` and confirm it replies with a shift.
> 5. Try editing a slot's capacity or filling it completely in D1, then run `/nextshift` again to confirm it skips full shifts.
>
> Let me know how the endpoint verification step goes — that's the part I'd like you to actually test, since I flagged some uncertainty about the exact Web Crypto call.
:::

This reply is long because the job has five parts, and it takes them in order. It also follows two of your rules without being asked: it points to Discord's developer terms, and it's clear about the one thing it hadn't tested itself.

### The Developer Portal

A Discord bot starts as an **application** in the Developer Portal. It has three values you'll use: an **Application ID**, which identifies it; a **Public Key**, used to check signatures; and a **Bot Token**, which is a password for the bot. Adding the application to the club's server with the `applications.commands` scope is what lets its commands appear there. Discord's portal changes its layout from time to time, so check the steps against your screen; the names of the three values have stayed the same for years.

::: {.screenshot-needed file="images/discord-portal.png"}
The Discord Developer Portal's General Information page for an application named Garden Shifts, showing the Application ID and Public Key fields and the empty Interactions Endpoint URL field.
:::

### Checking the signature

Every request Discord sends has two headers: a timestamp and a **signature**, made with a private key that only Discord has. Anyone can check the signature with Discord's *public* key, but nobody can make a valid one without the private key. So if the check passes, the request came from Discord, and nobody changed it on the way.

::: {.term}
> **Digital signature** — A value made from a message with a private key, which anyone can check with the matching public key. A valid signature proves who sent the message, and that it wasn't changed.
:::

**Read `verifyDiscordRequest`** carefully, because the details matter:

- The body is read with `request.text()`, as the raw text, *before* parsing it. The signature covers the exact characters Discord sent; parsing the JSON and turning it back into text could change spacing and break the check.
- `crypto.subtle` is the Web Crypto API, built into Workers, browsers and Node. `importKey` loads the public key, and `verify` checks the signature against the timestamp joined with the body, using the **Ed25519** method that Discord uses.
- The key and signature arrive as **hex** text, pairs of characters from 0 to 9 and a to f, each pair one byte. `hexToBytes` converts them, with `parseInt(text, 16)`, which reads a number written in base 16.

Then `handleDiscord` returns 401 for anything that fails the check, answers Discord's test request, `type: 1`, with the same type, and answers the command, `type: 2`, with a message.

The assistant said it hadn't run this exact code, and asked you to test it by setting the Interactions Endpoint URL, when Discord sends a test request and refuses the address unless it passes. That's the right test. The verification can also be checked on your own computer, with a key pair you make yourself, which is what this book did: a correctly signed request passed, and the same signature with a changed body failed. That's what you want from a signature check, and it's worth knowing how to test security code *without* trusting it.

### The query

The query finds the first shift that isn't full, using **`HAVING`**, which the reply explains well: `WHERE` filters rows before they're grouped, and `HAVING` filters groups after they're counted, so it can compare the count with the capacity. For the club's data, it finds the harvesting shift on June 5, 2027, with 1 of 3 spots filled. A real version would also skip shifts whose date has passed, with `WHERE slots.date >= ?` and today's date.

### Registering and secrets

Slash commands are registered once, by a small script you run on your own computer, which sends the command's name and description to Discord's API with the bot token. The table of secrets is exactly right, and it's the most important part of the reply:

- **The bot token** stays in a `.env` file on your computer, used only by the registration script, as in [Calling AI Models from Your Code](ai-api){.book-link}. The Worker never needs it, because it only answers requests.
- **The public key** isn't secret at all; that's what "public" means. Storing it with `wrangler secret put` is harmless, and keeps all the Worker's settings in one place.

::: {.caution}
> **A leaked bot token is an emergency.** Anyone with it can act as your bot in every server it's in. If a token ends up in code you've shared, in a chat or in a screenshot, reset it immediately in the Developer Portal's Bot page, which makes the old one stop working.
:::

Here's the order that works: deploy the Worker, set its `/discord` address as the Interactions Endpoint URL in the portal, register the command, then type `/nextshift` in the club's server. For the club's data, the code builds this reply, which Discord shows as a message from the bot:

```{.code environment="message"}
Next open shift: harvesting on 2027-06-05, 09:00–11:00 (1/3 filled)
```

## Other Chat Platforms

Discord's approach is typical, but not the only one. Two others the club might use:

- **Telegram** bots are the easiest to set up: you talk to Telegram's own bot, @BotFather, which gives you a token in a minute. Telegram then sends messages to your address, a *webhook* in Telegram's terms, with a secret token in a header that you check, instead of a signature.
- **Slack** apps work much like Discord's: commands are sent to your address, signed, and you verify the signature with a *signing secret*. Slack also offers **Socket Mode**, where your code connects out to Slack instead of waiting for requests, which works even without a public address, and its official **Bolt** library handles the details.

Whichever platform, the same three questions apply: how does the platform reach your code, how do you know a request really came from it, and where does the bot's secret live?

One thing to avoid, for a club: bots that read every message in a channel. They need broad permissions, raise privacy questions for every member, and are rarely needed. Commands, which members choose to use, are enough.

## Your Learner Profile

::: {.ai-profile lesson="discord"}
Add rules:

- When a platform sends requests to my code, verify that each request really comes from it before doing anything else.

Add to "What I know so far":

- slash commands: the platform calling my code, and replying with type 1 to a ping and type 4 with a message
- digital signatures, and verifying Discord's Ed25519 signatures with crypto.subtle
- reading a request's raw body with request.text() before parsing it
- hex text and parseInt(text, 16)
- registering commands with a bot token kept in .env, and wrangler secret put
- SQL HAVING, to filter groups after counting
- how Telegram and Slack bots compare
:::

That's the end of Part VII. Your environment line still describes servers and Workers, and in the last part of the book, you'll change it one final time.

## Summary

A slash command reverses the direction of a webhook: when a member types `/nextshift`, Discord calls your Worker, and your response becomes the bot's reply. Because anyone could call the same address, every request must be verified: Discord signs each one with a private key, and your code checks the signature against the exact raw body with Discord's public key, using the built-in Web Crypto API. Security code like this can, and should, be tested with a key pair of your own. Commands are registered once, by a script that uses the bot token, which stays in a `.env` file and never in the Worker. Telegram and Slack follow the same pattern with their own ways of proving a request is genuine. That completes the club's system: a website, an API, a database, an app and a bot. Next, you'll look at the other places JavaScript runs, and plan what to learn next on your own.
