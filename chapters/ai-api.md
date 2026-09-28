---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Explain what an AI model's API is, and how it differs from chatting with an assistant.
2. Keep an API key out of your code with a `.env` file and `process.env`.
3. Call a model's API from Node with `fetch`, and read its reply.
4. Estimate what a call costs, from its tokens.
5. Design code that uses a model safely: the code calculates, the model writes, and a person checks.
:::
:::

::: {.note}
> **This lesson may cost a little money.** Calling an AI model from code usually needs an account with the model's provider and, often, a payment method. A call like the ones in this lesson costs a fraction of a cent. Some providers have offered free tiers for their APIs; Google's Gemini has been one. Terms change often, so check current pricing. If you'd rather not sign up, read the lesson anyway: the ideas about keys and checking a model's output apply to any service.
:::

## From Chatting to Calling

Throughout this book, you've used an AI assistant by chatting with it. The same models are available to programs, through an **API**, like the weather API in [Talking to Web Services](web-services){.book-link}. Your code sends a request with a prompt, and gets back the model's reply as JSON. There's no chat window, no memory between calls unless you send the earlier messages yourself, and no learner profile unless you include one.

That makes a model something your programs can use as a part: to draft text, summarize notes, sort messages into categories, or pull information out of writing. The club's idea: every week, a script turns the week's harvest totals into a friendly paragraph for the newsletter, and a volunteer edits it, instead of writing it from scratch.

This book's replies come from Claude, made by Anthropic, so this lesson uses Anthropic's API. The pattern is the same with other providers, and the end of the lesson shows how they differ.

## API Keys

To use a provider's API, you create an account on its developer site, such as console.anthropic.com, and create an **API key**: a long secret string that identifies your account. Every request carries the key, and every request is billed to that account. So a key is like a password and a credit card at once. Anyone who has it can run up charges on your account.

::: {.term}
> **API key** — A secret string that identifies you to a service. Requests made with it are allowed, and billed, as yours.
:::

You've kept secrets out of code before: in Script Properties, in [Talking to Web Services](web-services){.book-link}, and out of web pages entirely, in [How Web Pages Work](web-pages){.book-link}. On your own computer, the standard place for them is **environment variables**: named values that the terminal gives to a program when it starts. Node reads them from **`process.env`**, and the simplest way to set them is a file named `.env` in the project folder, which recent versions of Node can load for you. Here's the question, in a new chat with your learner profile from [Automating the Web with Playwright](playwright){.book-link}:

::: {.ai-conversation prompt="Write a Node script that sends this week's harvest totals to Anthropic's Claude API and asks it to draft a short, friendly paragraph for our garden club's newsletter. The totals are an object like { Tomato: 3.1, Bean: 2.6, Cucumber: 2.6 } (kilograms). How should I handle the API key?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="playwright" transcript="ai-api/newsletter"}
> Here's how I'd handle the API key, then the script.
>
> ## Handling the API key
>
> Since this is a Node script on your own computer (not Apps Script, not a web page), the right place for a secret like this is an **environment variable** — a value stored outside your code, in your terminal session or a local file, that Node can read with `process.env`.
>
> Node (version 20.6 or later) has a built-in way to load variables from a file, no packages needed:
>
> 1. In your project folder, make a file called `.env` (just that name, no filename before the dot):
>    ```
>    ANTHROPIC_API_KEY=your-real-key-here
>    ```
> 2. **Don't commit this file to Git or share it.** If you use Git, add a line `.env` to a `.gitignore` file.
> 3. Run your script like this instead of `node script.js`:
>    ```
>    node --env-file=.env harvest-summary.js
>    ```
>
> If `--env-file` doesn't work (older Node), you can instead set the variable directly in your terminal before running the script:
> - Mac/Linux: `export ANTHROPIC_API_KEY=your-real-key-here`
> - Windows (PowerShell): `$env:ANTHROPIC_API_KEY="your-real-key-here"`
>
> Either way, the key never appears in your `.js` file.
>
> ## The script
>
> ```js
> // harvest-summary.js
> // Run with: node --env-file=.env harvest-summary.js
>
> const totals = { Tomato: 3.1, Bean: 2.6, Cucumber: 2.6 }
>
> // Object.entries turns the object into pairs like ["Tomato", 3.1]
> // map turns each pair into a text piece like "Tomato: 3.1 kg"
> // join glues all the pieces together with ", " between them
> const summary = Object.entries(totals)
>   .map(([name, kilograms]) => `${name}: ${kilograms} kg`)
>   .join(", ")
>
> const prompt = `Write a short, friendly paragraph for a garden club newsletter announcing this week's harvest totals: ${summary}. Keep it upbeat and under 80 words.`
>
> // Read the key from the environment instead of writing it in the code
> const apiKey = process.env.ANTHROPIC_API_KEY
>
> if (apiKey === undefined) {
>   throw new Error("Set ANTHROPIC_API_KEY before running this script")
> }
>
> async function getNewsletterParagraph() {
>   const response = await fetch("https://api.anthropic.com/v1/messages", {
>     method: "POST",
>     headers: {
>       "x-api-key": apiKey,
>       "anthropic-version": "2023-06-01",
>       "content-type": "application/json"
>     },
>     body: JSON.stringify({
>       model: "claude-3-5-haiku-20241022",
>       max_tokens: 200,
>       messages: [{ role: "user", content: prompt }]
>     })
>   })
>
>   if (!response.ok) {
>     throw new Error(`Claude API request failed: ${response.status}`)
>   }
>
>   const data = await response.json()
>   return data.content[0].text
> }
>
> try {
>   const paragraph = await getNewsletterParagraph()
>   console.log(paragraph)
> } catch (error) {
>   console.error("Something went wrong:", error.message)
> }
> ```
>
> A few notes:
>
> - This uses **top-level await**, so your `package.json` needs `"type": "module"`.
> - I'm not fully certain `"claude-3-5-haiku-20241022"` is the exact current model name — check Anthropic's API documentation for the current model list before running this, and swap in whichever one you want.
> - `data.content[0].text` pulls the reply text out of Claude's response shape; if you ever get an unexpected error, `console.log(data)` first to see the actual shape they returned.
> - The `try/catch` wraps the whole thing so a network problem or a bad response shows a clear message instead of an unhandled crash.
>
> Would you like me to also add a step that writes this paragraph into a text file, or pastes it into a Google Doc?
:::

**Read the key handling first,** because it's the part that matters most. The key goes in `.env`, as `ANTHROPIC_API_KEY=...`, and the script is run with `node --env-file=.env harvest-summary.js`, which loads the file into `process.env`. The code only ever says `process.env.ANTHROPIC_API_KEY`, so the key never appears in the `.js` file, and the script stops with a clear message if it's missing. If you use Git, a `.gitignore` file listing `.env` keeps the file out of anything you share. All of that is right.

::: {.term}
> **Environment variable** — A named value given to a program by the terminal or system that starts it, read in Node from `process.env`. Commonly used for secrets and settings.
:::

**Then the request.** It's a `fetch` with `method: "POST"`, like the webhook in [Talking to Web Services](web-services){.book-link}, plus **headers**: extra information sent with a request. `x-api-key` carries the key, `anthropic-version` says which version of the API the code expects, and `content-type` says the body is JSON. The body names a model, a maximum length for the reply in **tokens**, and the conversation as an array of messages. The reply's text is in `data.content[0].text`.

Two pieces of syntax are new: **`Object.entries(totals)`** turns an object into an array of `[key, value]` pairs, and **`([name, kilograms]) => ...`** destructures each pair right in the arrow function's parameters.

**And the model's name.** The reply uses `claude-3-5-haiku-20241022`, and says it isn't sure that's current. That's honest, and it's right to be unsure: model names change often, and older models are retired. An assistant remembers the names that existed when it learned. The provider's documentation lists the current ones, and that's where the name should come from.

## The Book's Version

Here's the script in the book's style, with a current model name and two design changes that matter more than they look:

<pre class="code" data-environment="nodejs">
// Drafts a newsletter paragraph from this week's harvest totals.
// Run with: node --env-file=.env newsletter.js
const MODEL = "claude-opus-5"
const totals = { Tomato: 3.1, Bean: 2.6, Cucumber: 2.6 }

const apiKey = process.env.ANTHROPIC_API_KEY
if (apiKey === undefined) {
  throw new Error("ANTHROPIC_API_KEY isn't set. Put it in .env and run with --env-file=.env")
}

// the code does the arithmetic; the model only writes the words
const lines = Object.entries(totals).map(([crop, kg]) => `${crop}: ${kg} kg`)
const totalKg = Object.values(totals).reduce((sum, kg) => sum + kg, 0)

const prompt = `Write a short, friendly paragraph (under 80 words) for the College Community Garden's weekly newsletter about this week's harvest. Use these numbers exactly, and don't add any others:
${lines.join("\n")}
Total: ${totalKg.toFixed(1)} kg`

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }]
  })
})

if (response.ok === false) {
  throw new Error(`The API replied with status ${response.status}: ${await response.text()}`)
}
const data = await response.json()
const text = data.content.filter(block => block.type === "text").map(block => block.text).join("")
console.log(text)
console.log(`\n(${data.usage.input_tokens} tokens in, ${data.usage.output_tokens} tokens out)`)
</pre>

**The code does the arithmetic.** The total is calculated in JavaScript, with `reduce`, and given to the model as a fact, along with the instruction to use the numbers exactly and add no others. Language models are good at writing and unreliable at arithmetic. Anything that can be calculated should be calculated by code, which is never wrong about sums.

**The reply is read carefully.** The reply's `content` is an array of blocks, and the text is in the blocks whose `type` is `"text"`, so the code collects just those, rather than assuming the first block is always the text. Error replies include the API's own message, which usually says exactly what's wrong, such as an unknown model name.

The model's name is in a constant at the top, where it's easy to change. Providers offer several models at different prices: larger ones for harder tasks, smaller and cheaper ones for simple ones, like a short paragraph. The provider's model list says which is which.

### A real run

Here's what one run of this script printed, while this lesson was written:

<pre class="code" data-environment="message">
**This Week in the Garden**

What a wonderful week at the plots! Our tomato vines came through with 3.1 kg of ripe fruit, while the bean rows and cucumber trellises each contributed a tidy 2.6 kg. Altogether, that's 8.3 kg of fresh produce headed to the campus pantry and to the hands of our volunteers. Thank you to everyone who watered, weeded, and picked. Come join us at the beds this weekend — there's always room for another pair of gloves!

(116 tokens in, 263 tokens out)
</pre>

It's pleasant, and every number is right. The `**` around the heading are Markdown for bold, which the model added by habit; you'd remove them, or ask for plain text.

### What a call costs

Models are priced by **token**, a piece of text of around three or four characters on average, counted separately for what you send and what comes back. At the time of writing, the model above cost $5 per million tokens sent and $25 per million received, so this run cost about 116 × $5 + 263 × $25, divided by a million: less than a cent. The reply's `usage` shows the counts for every call, which is why the script prints them. Prices vary a lot between models and change over time, so check the provider's pricing page, and set a monthly spending limit on your account, which most providers allow.

::: {.term}
> **Token** — The unit AI models read and write in, and are priced by: a piece of text averaging a few characters. A short paragraph is around 100 tokens.
:::

## When the Model Makes Things Up

Look at the run's output again: "headed to the campus pantry." Nothing in the prompt mentioned a pantry. Here's what the assistant said about it:

::: {.ai-conversation prompt="I ran a version of it. The numbers were right, but the paragraph said the produce was headed to the campus pantry, which I never mentioned. Why would it do that, and how should I handle it?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="playwright" transcript="ai-api/newsletter"}
> That's a good thing to notice, and it's a known behavior of these models, not a bug in your code.
>
> **Why it happens:** Claude doesn't know anything about your garden club except what you put in the prompt. It generates text by predicting what words are likely to come next based on patterns from lots of writing it was trained on — it's not looking anything up or reasoning from facts. Newsletter paragraphs about donated produce often mention food pantries, so the model filled in a plausible-sounding detail that wasn't true for you. This kind of made-up but confident-sounding detail is usually called a "hallucination."
>
> The numbers came out right because you gave them directly in the prompt and the model just had to repeat them. Anything you *don't* give it, it may invent to make the paragraph sound complete.
>
> **How to handle it:**
>
> 1. **Tell it explicitly not to invent details.** Add a line to the prompt like:
>    ```js
>    const prompt = `Write a short, friendly paragraph for a garden club newsletter announcing this week's harvest totals: ${summary}. Only use the facts given here — don't invent details like where the produce goes or who grew it. Keep it upbeat and under 80 words.`
>    ```
>    This helps but doesn't guarantee anything; the model can still slip in extra details.
>
> 2. **Always read the output before it goes anywhere.** Treat what Claude writes as a rough draft from a helpful volunteer, not a finished, fact-checked newsletter. Since this script just prints to your console right now, that review step is easy — read it, edit it yourself, and only then paste it into your actual newsletter.
>
> 3. **Don't have the script auto-publish the paragraph anywhere** (a Google Doc, an email, a website) without you looking at it first. This fits the general rule of doing a dry run or a human check before anything gets sent or saved for others to see — an AI-written paragraph is a case where that check is about *truth*, not just formatting.
>
> Would you like me to update the prompt with the "don't invent details" instruction, or add a step where the script shows you the paragraph and asks you to confirm before doing anything else with it?
:::

That's the right explanation, and it applies to every assistant, including the one you've been chatting with throughout this book. A model writes what's *likely*, and newsletter paragraphs about harvests often mention food pantries, so one appeared. Invented details like this are called **hallucinations**. They're most likely exactly where the prompt leaves a gap: here, what happens to the produce.

::: {.term}
> **Hallucination** — A confident statement by an AI model that isn't supported by anything it was given, and may be false.
:::

The assistant's three suggestions are the right defense, in order of strength: tell the model not to add facts; always have a person read the output; and never let a script publish model-written text by itself. The first reduces the problem. Only the second and third solve it. That's why the script prints the paragraph instead of emailing it, and it's the same reason for the dry-run rule in your profile: some actions deserve a person's check before they happen.

Put together, this is a good pattern for any program that uses a model: **the code calculates, the model writes, and a person checks.**

## What You Send

Everything in a prompt goes to the provider's servers. The club's harvest totals are harmless, but a prompt built from the Members sheet would send members' names and email addresses to a company outside the club. Before sending data to a model's API, ask whether the model actually needs it (the newsletter doesn't need anyone's email address), and read the provider's policy on how API data is stored and used. The rule from the start of the book, don't paste private information into an assistant, applies just as much when your code does the pasting.

## Other Providers

Other providers' APIs follow the same pattern, with different details:

| | What stays the same | What changes |
|---|---|---|
| **Request** | A POST with your prompt, as JSON | The address, and the names of the fields |
| **Key** | Kept in `.env`, read from `process.env` | The header it goes in, and the variable's name |
| **Model** | Named in the request | Each provider's own model names |
| **Reply** | JSON with the text somewhere inside | Where the text is |

Providers also publish official packages for their APIs, such as `@anthropic-ai/sdk` for Anthropic's, which handle the details, retry temporary failures, and give clearer errors. For a larger program, an official package is usually the better choice. For learning, a plain `fetch` shows you exactly what's being sent, which is why this lesson uses one. Either way, the provider's documentation, not an assistant's memory, is the authority on the current details.

## Your Learner Profile

::: {.ai-profile lesson="ai-api"}
Add rules:

- When code calls an AI model, have the code calculate any numbers and pass them in, tell the model not to add facts, and have a person review the output before it's used anywhere.
- Keep secrets such as API keys in a .env file, loaded with node --env-file=.env and read from process.env.

Add to "What I know so far":

- calling an AI model's API with fetch: headers, a model name, messages, and reading the reply's content blocks
- API keys, environment variables, process.env, .env files and .gitignore
- tokens, and estimating what a call costs
- hallucinations, and designing code so that the code calculates, the model writes, and a person checks
- Object.entries() and Object.values(), and destructuring in a function's parameters
:::

## Summary

An AI model's API lets your code send a prompt and get back a reply, as JSON, with no chat window or memory. An API key identifies and bills your account, so keep it in a `.env` file, load it with `node --env-file=.env`, read it from `process.env`, and never put it in code, web pages or prompts. A request is a POST with headers, a model name and messages; model names change, so take them from the provider's documentation. Calls are priced by tokens, usually a fraction of a cent for short tasks. Models write fluently and invent details confidently, especially where a prompt leaves gaps, so let code do the calculating, tell the model not to add facts, and have a person check before anything is published. Next, you'll connect services together into automated workflows, with a tool called n8n.
