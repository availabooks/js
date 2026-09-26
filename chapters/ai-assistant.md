---
_$_import: monaco
_$_profile:
  environment: "an online editor that shows console.log output"
  knows: []
  rules_add:
    - "Use only the concepts listed below under \"What I know so far.\" If a task needs something I haven't learned, tell me what it is instead of using it."
    - "Don't use semicolons at the ends of lines."
    - "Keep the code short and simple, and explain what each line does in plain language."
  rules_remove: []
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Choose an AI assistant and use it safely.
2. Explain how a conversation with an AI assistant works, including what it remembers and what it forgets.
3. Apply the five-step workflow: plan, ask, read, run and revise.
4. Write a learner profile and explain what each part of it does.
5. Ask follow-up questions that help you understand the code an assistant writes.
:::
:::

## Choosing an AI Assistant

Any of the popular AI assistants will work with this book: ChatGPT, Gemini, Claude or Microsoft Copilot, among others. The free version of any of them is enough. You'll need to sign in with an account, and it's worth using the same assistant throughout the book so its behavior becomes familiar.

Before you start, check two things:

- **Your course's or employer's rules.** Some courses encourage using an AI assistant, some limit it, and some schools provide a particular assistant for students. Follow the rules that apply to you.
- **What happens to what you type.** Conversations may be stored, and on many free plans they may be used to improve the product.

::: {.caution}
> **Don't paste private information into an AI assistant.** That includes passwords, access keys, and real data about other people, such as a list of names and email addresses from a club or class. The examples in this book use made-up data, so you can share them freely.
:::

## How a Conversation Works

A conversation with an AI assistant is a series of turns. You write a **prompt**, and the assistant writes a reply. Then you can write another prompt, and so on.

::: {.term}
> **Prompt** — The message you send to an AI assistant: a question, a request, or a description of what you want.
:::

Three things about conversations matter for this book:

- **The assistant remembers the conversation you're in.** A follow-up like "Try again, but shorter" works because the assistant can see everything said so far in that chat.
- **A new chat starts from nothing.** Open a new conversation and the assistant knows nothing about your earlier ones. That's why you'll start every new chat with your learner profile, which you'll write later in this lesson.
- **Replies vary.** Send the same prompt twice and you'll get two different replies. They'll usually be similar, but the wording, and sometimes the code, will differ. The replies in this book are real ones, captured from Gemini on the date shown. Yours won't match word for word, and that's expected.

## Plan, Ask, Read, Run, Revise

Every example in this book follows the same five steps:

1. **Plan.** Before you ask for anything, decide what you want. What information goes in? What should come out? How will you know the result is right? A clear plan makes a clear prompt, and a clear prompt leaves the assistant less to guess.
2. **Ask.** Write a prompt that describes your plan. In a new chat, start with your learner profile.
3. **Read.** Go through the reply line by line. For each line, you should be able to say what it does. If you can't, ask the assistant to explain it, or to rewrite the code using only what you know.
4. **Run.** Run the code and check the result against your plan. When the code works with real data, such as a spreadsheet, try it on a practice copy first.
5. **Revise.** If the result isn't what you planned, tell the assistant exactly what happened and what you expected, or fix the code yourself.

Reading is the skill this book is really about. While you read, ask yourself four questions:

- What does each line do?
- Does it use anything I haven't learned?
- Does it change or delete anything?
- Does it match my plan?

And one rule applies to every example: **don't run code you can't explain.** Code can overwrite data, send email and share files, and it does those things as fast and as reliably as everything else.

## Why Your Assistant Needs to Know What You Know

Here's a simple request, sent to an assistant in a brand-new chat with no other information:

::: {.ai-conversation prompt="Write JavaScript that adds up the numbers from 1 to 10." assistant="Gemini" model="gemini-3.8-flash" captured="2026-09-26" profile="none" transcript="ai-assistant/sum-no-profile"}
> Here are a few ways to do this in JavaScript:
>
> ### Method 1: Using a standard `for` loop (Most common)
>
> ```javascript
> let sum = 0;
>
> for (let i = 1; i <= 10; i++) {
>   sum += i;
> }
>
> console.log(sum); // Output: 55
> ```
>
> ---
>
> ### Method 2: Using the math formula $n(n + 1) / 2$ (Fastest)
>
> ```javascript
> const n = 10;
> const sum = (n * (n + 1)) / 2;
>
> console.log(sum); // Output: 55
> ```
>
> ---
>
> ### Method 3: One-liner using Array methods
>
> ```javascript
> const sum = Array.from({ length: 10 }, (_, i) => i + 1)
>                  .reduce((acc, curr) => acc + curr, 0);
>
> console.log(sum); // Output: 55
> ```
:::

All three methods are correct, and all three print 55. But look at them from a beginner's point of view. They use `let` and `const`, `+=` and `i++`, `for`, `Array.from`, `=>` and `.reduce`. The assistant chose three approaches at once, and it had no way to know that none of them would make sense to you yet.

This is where the rule "don't run code you can't explain" leaves you stuck. The code is probably fine, but you have no way to check it. So the natural next step is to ask for an explanation, which you can do in the same chat:

::: {.ai-conversation prompt="Explain what each line of Method 3 does." assistant="Gemini" model="gemini-3.8-flash" captured="2026-09-26" profile="none" transcript="ai-assistant/sum-no-profile"}
> Here is the code broken down line by line:
>
> […]
>
> ### Line 1: `const sum = Array.from({ length: 10 }, (_, i) => i + 1)`
>
> This line creates an array of numbers from 1 to 10:
>
> * **`const sum =`**: Declares a variable named `sum` to hold the final result.
> * **`Array.from(...)`**: A built-in JavaScript method that creates a new array from an "array-like" object.
> * **`{ length: 10 }`**: This is an object that tells `Array.from` to make an array with 10 empty slots.
> * **`(_, i) => i + 1`**: A function that runs on every slot to fill it with a value:
>   * `_` represents the element itself (it is unused/empty, so the underscore `_` is a common naming convention meaning "ignore this").
>   * `i` is the index of the slot (which starts at `0` and goes up to `9`).
>   * `i + 1` shifts the indexes so the values become `1` through `10`.
>
> > **Result of Line 1:** It generates the array `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`.
>
> ---
>
> ### Line 2: `.reduce((acc, curr) => acc + curr, 0);`
>
> This line takes the array created in Line 1 and boils it down into a single number:
>
> * **`.reduce(...)`**: A method that loops through the array, carrying over a running total from one element to the next.
> * **`(acc, curr) => acc + curr`**: The function that runs for each item in the array:
>   * **`acc` (accumulator)**: The running total.
>   * **`curr` (current value)**: The current number being processed from the array.
>   * **`acc + curr`**: Adds the current number to the running total.
> * **`0`**: The starting value for `acc` (the accumulator starts at `0`).
>
> […]
:::

The explanation is accurate and carefully organized. It still doesn't help much, because it explains unfamiliar code using more unfamiliar words: *variable, method, array, object, function, element, index, accumulator.* Each of those is a real idea you'll learn, but you'd need several of them before this explanation made sense.

The problem isn't the assistant. It answered the question it was given. The problem is that it didn't know who was asking. An explanation, like code, only helps if it's pitched at your level, and the assistant can't know your level unless you tell it.

## Your Learner Profile

A **learner profile** is a short message you send at the start of every new chat. It tells the assistant what you're doing, what you already know, and how you'd like code written. Here is your first one:

::: {.ai-profile lesson="ai-assistant"}
> I'm a beginner learning JavaScript from a textbook, and I'd like your help learning it. I'm running JavaScript in an online editor that shows console.log output. I don't know any programming concepts yet.
>
> When you write code for me:
>
> - Use only the concepts listed below under "What I know so far." If a task needs something I haven't learned, tell me what it is instead of using it.
> - Don't use semicolons at the ends of lines.
> - Keep the code short and simple, and explain what each line does in plain language.
>
> What I know so far: nothing yet.
:::

Each part has a job:

- **The first paragraph** says who you are and where your code runs. "An online editor that shows console.log output" describes the code editors in this book's pages. You'll use one later in this lesson. Without this, the assistant has to guess where you'll run the code, as it did with the three ways to say hello in [Welcome to Programming](welcome){.book-link}.
- **"Use only the concepts listed below"** is the most important rule. It asks the assistant to stay within what you know, and to *say so* when a task needs something new, instead of quietly using it.
- **"Don't use semicolons"** matches the style of this book, so the assistant's code looks like the code you'll read here. (You'll learn why semicolons are optional in the next lesson.)
- **"Keep the code short and simple, and explain what each line does"** asks for explanations as part of every answer, pitched at a beginner.
- **"What I know so far"** is the part that grows. Each lesson that teaches something new shows an updated profile, and you'll use the newest one from then on.

To use the profile, paste it as the first message of every new chat, before your first question. Here's what happened when this profile was sent to a new chat:

::: {.ai-conversation prompt="I'm a beginner learning JavaScript from a textbook, and I'd like your help learning it. I'm running JavaScript in an online editor that shows console.log output. I don't know any programming concepts yet. When you write code for me: - Use only the concepts listed below under &quot;What I know so far.&quot; If a task needs something I haven't learned, tell me what it is instead of using it. - Don't use semicolons at the ends of lines. - Keep the code short and simple, and explain what each line does in plain language. What I know so far: nothing yet." assistant="Gemini" model="gemini-3.8-flash" captured="2026-09-26" profile="ai-assistant" transcript="ai-assistant/sum-with-profile"}
> Welcome! It's great to have you starting your programming journey.
>
> Since you're starting from absolute zero, our very first tool will be **how to make the computer display a message**.
>
> In JavaScript, we do this using a command called `console.log`.
>
> Here is your very first line of code to try in your editor:
>
> ```javascript
> console.log("Hello, world!")
> ```
>
> ### What this line does:
>
> * `console.log(...)` tells the computer: *"Print whatever is inside these parentheses to the screen."*
> * `"Hello, world!"` is the message you want to print. We put words inside quote marks so the computer knows it is regular text and not a computer command.
>
> ---
>
> Go ahead and paste that into your editor and run it. You should see `Hello, world!` appear in your console.
>
> Once you try that, let me know! What would you like to learn next, or what is the first topic in your textbook?
:::

The assistant has changed how it behaves. Its code has no semicolon, it explains each part of the line in plain words, and it offers to go at your pace.

Because the assistant explained the line, you can say what it does: it displays the text `Hello, world!`. That means it passes the test of "don't run code you can't explain," so go ahead and run it. Click the Run button (▶) on the editor below, and the output appears underneath.

<pre class="code">
console.log("Hello, world!")
</pre>

Try changing the message between the quote marks, then run it again. You'll learn more about `console.log` and the other parts of this line in the next lesson.

Now the same request as before, in the same chat:

::: {.ai-conversation prompt="Write JavaScript that adds up the numbers from 1 to 10." assistant="Gemini" model="gemini-3.8-flash" captured="2026-09-26" profile="ai-assistant" transcript="ai-assistant/sum-with-profile"}
> To do this, we need a few concepts that you haven't learned yet:
>
> 1. **Numbers and the `+` (addition) operator**: How JavaScript handles math.
> 2. **Variables**: A way to create a container in the computer's memory to hold and update the running total.
> 3. **Loops (like a `for` loop)**: A way to make the computer count and repeat an action automatically, rather than typing every single number out by hand.
>
> Since you haven't learned these yet, we can't write the complete code just yet!
>
> Would you like to start by learning how JavaScript does basic math with numbers, or would you like to start with variables?
:::

This time, you got no code at all, and that's the profile working as intended. Instead of three programs you couldn't read, you got a short list of what you'd need to learn first: numbers and arithmetic, variables, and loops. Those are exactly the topics of the next several lessons. When you've worked through them, come back to Method 1 in the first reply. You'll be able to read every line.

::: {.tip}
> **When the assistant ignores your profile.** In a long chat, an assistant can drift back to its usual habits, such as adding semicolons or using features you haven't learned. Remind it ("Please follow my learner profile: use only what I know"), or start a new chat and paste the profile again.
:::

## Asking Good Follow-Up Questions

The first reply is rarely the last word. Most of the value of an AI assistant comes from follow-up questions. These are worth keeping handy:

| Ask this | When |
|---|---|
| "Explain line 3 in plain language." | One line doesn't make sense. |
| "Rewrite this using only what I know." | The code uses something you haven't learned. |
| "What does this error message mean? Explain it, but don't fix it yet." | Your code stopped with an error. Understanding the error teaches you more than getting a fixed version. |
| "What would happen if the list were empty?" | You want to check an unusual case before trusting the code. |
| "Why did you use this approach instead of a simpler one?" | The code seems more complicated than the task. |
| "Does this code change or delete anything?" | Before you run code that works with real data. |

Notice that none of these ask the assistant to take over. Each one helps you understand the code well enough to decide for yourself whether it's right.

## When Your Replies Don't Match the Book

When you send one of this book's prompts to your own assistant, your reply will almost certainly differ from the book's. Here's how to handle the differences:

- **Compare the code, not the wording.** Two replies can be worded completely differently and contain the same code.
- **If your code differs, read it anyway.** Different code can be just as correct. The Read step works the same way on any reply.
- **If your reply uses something you haven't learned,** ask the assistant to rewrite it using only what you know. That's a good sign your profile needs a reminder.
- **If your reply is completely different,** check that you started the chat with your current learner profile.

## Summary

Any mainstream AI assistant works for this book, as long as you follow your course's rules and keep private information out of your chats. An assistant remembers the chat you're in, forgets everything when you start a new one, and words its replies differently every time. Every example follows five steps, plan, ask, read, run and revise, and the rule behind them is that you don't run code you can't explain. Without context, an assistant answers a beginner's question with code and explanations pitched at an expert. A learner profile fixes that by telling it where your code runs, what you know, and how to write for you. You'll paste it at the start of every new chat, and it will grow with every lesson.
