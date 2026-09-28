---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Run code when something happens on a page, with `addEventListener`.
2. Explain what it means to pass a function as a value, without calling it.
3. Read what someone typed into a form field, and convert it to a number.
4. Validate input: empty fields, text that isn't a number, and values that make no sense.
5. Choose how to round a result based on what it means.
:::
:::

## Pages That Respond

The page in [How Web Pages Work](web-pages){.book-link} ran its script once, when it loaded, and then sat still. Useful pages respond: to a click, a key press, a choice from a list. Each of those is an **event**, and JavaScript can run code whenever one happens.

::: {.term}
> **Event** — Something that happens on a page, such as a click, a key press or a change to a form field, that JavaScript can respond to.
:::

Here's the simplest example. Click the button after running it:

<pre class="code" data-environment="html">
&lt;button id="greetButton"&gt;Say hello&lt;/button&gt;
&lt;p id="greeting"&gt;&lt;/p&gt;

&lt;script&gt;
  const button = document.querySelector("#greetButton")
  const greeting = document.querySelector("#greeting")

  function showGreeting() {
    greeting.textContent = "Hello from the College Community Garden!"
  }

  button.addEventListener("click", showGreeting)
&lt;/script&gt;
</pre>

The last line is the new part. **`addEventListener`** tells the button: "when a `click` event happens, run `showGreeting`." It takes two arguments: the name of the event, as a string, and the function to run. That function is called an **event handler**, or *listener*.

Look closely at how `showGreeting` is written in that line: with no parentheses. `showGreeting()` would *call* the function, right now, once. `showGreeting` without parentheses is the function itself, handed over as a value, for the button to call later, each time it's clicked. Try adding the parentheses and running it again: the greeting appears immediately, and clicking does nothing.

That's an important idea you haven't needed before: a function is a value, like a number or a string, and you can pass it to another function. You did something similar in [Menus and Triggers](triggers){.book-link}, where `addItem` took a function's *name* as a string. Here you pass the function itself.

::: {.term}
> **Event handler** — A function that runs when an event happens. It's passed to `addEventListener` without parentheses, so it runs later, when the event happens, not now.
:::

### Handlers written in place

You'll often see the handler written right inside the `addEventListener` call, with no name:

<pre class="code" data-environment="html">
&lt;button id="countButton"&gt;Click me&lt;/button&gt;
&lt;p id="clicks"&gt;No clicks yet.&lt;/p&gt;

&lt;script&gt;
  const button = document.querySelector("#countButton")
  const clicks = document.querySelector("#clicks")
  let clickCount = 0

  button.addEventListener("click", function() {
    clickCount++
    clicks.textContent = `Clicked ${clickCount} times.`
  })
&lt;/script&gt;
</pre>

`function() { ... }` with no name is an **anonymous function**. It's the same as writing a named function and passing its name, just shorter when the function is only used in one place. AI replies use this form a lot. Read it as "when clicked, do this."

This example also shows why `let clickCount` is outside the handler. The handler runs once per click, and a variable created inside it would start at 0 every time.

## Reading What Someone Typed

A text box is an **`<input>`** element. Its **`value`** property is whatever is typed in it right now, and it's always a string, even when someone types a number:

<pre class="code" data-environment="html">
&lt;label for="hoursBox"&gt;Hours volunteered:&lt;/label&gt;
&lt;input type="text" id="hoursBox"&gt;
&lt;button id="addButton"&gt;Add 2 hours&lt;/button&gt;
&lt;p id="answer"&gt;&lt;/p&gt;

&lt;script&gt;
  const hoursBox = document.querySelector("#hoursBox")
  const addButton = document.querySelector("#addButton")
  const answer = document.querySelector("#answer")

  addButton.addEventListener("click", function() {
    const hoursText = hoursBox.value
    answer.textContent = `Without Number: ${hoursText + 2}. With Number: ${Number(hoursText) + 2}.`
  })
&lt;/script&gt;
</pre>

Type 12 and click. It's the "122" problem from [Variables and Data](variables){.book-link} all over again, and the fix is the same: convert with `Number()`. The **`<label>`** isn't required, but it's good practice: its `for` attribute names the input's id, so clicking the label puts the cursor in the box, and screen readers announce what the box is for.

There are other events besides `click`. The **`input`** event happens every time the text in a box changes, which lets a page respond as someone types. You'll use it in the finished calculator.

## The Plant-Spacing Calculator

New members always ask how many plants fit in a bed. The answer depends on the bed's size and how far apart the plants need to be, which varies by crop: about 12 inches for lettuce, 18 for peppers, 24 or more for tomatoes. A calculator on the club site can answer it.

**Plan.** Two inputs: the bed's size in square feet, and the spacing between plants in inches. One output: the number of plants. Each plant needs a square of ground as wide as the spacing, so the number of plants is the bed's area divided by the area of one square, once both are in the same units. For a 32-square-foot bed with plants 12 inches (1 foot) apart, that's 32 plants.

Here's the request, in a new chat with your learner profile from [How Web Pages Work](web-pages){.book-link}. It tells the assistant you've learned events:

::: {.ai-conversation prompt="I've now learned events: addEventListener, click and input events, and reading what someone typed with an input's value. Make a plant-spacing calculator page for our garden club: the visitor types a bed's size in square feet and the spacing between plants in inches, clicks Calculate, and the page shows how many plants fit in the bed." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="web-pages" transcript="events/spacing"}
> Here's a plant-spacing calculator page. Since this is a static HTML page with no server, **anyone who opens the file can see the calculator and use it** — it doesn't store or send any data anywhere; it only does math in the visitor's own browser.
>
> ```html
> <!DOCTYPE html>
> <html>
> <head>
>   <title>Plant Spacing Calculator</title>
>   <style>
>     body {
>       font-family: Arial, sans-serif;
>       margin: 20px;
>     }
>     .calculator {
>       border: 2px solid green;
>       padding: 15px;
>       max-width: 300px;
>     }
>     label {
>       display: block;
>       margin-top: 10px;
>     }
>     #result {
>       font-weight: bold;
>       margin-top: 15px;
>     }
>   </style>
> </head>
> <body>
>
>   <h1>Garden Club Plant Spacing Calculator</h1>
>
>   <div class="calculator">
>     <label for="bedSize">Bed size (square feet):</label>
>     <input type="text" id="bedSize">
>
>     <label for="spacing">Spacing between plants (inches):</label>
>     <input type="text" id="spacing">
>
>     <button id="calculateButton">Calculate</button>
>
>     <p id="result"></p>
>   </div>
>
>   <script>
>     const calculateButton = document.querySelector("#calculateButton")
>
>     calculateButton.addEventListener("click", function() {
>
>       const bedSizeInput = document.querySelector("#bedSize")
>       const bedSizeText = bedSizeInput.value
>       const bedSize = Number(bedSizeText)
>
>       const spacingInput = document.querySelector("#spacing")
>       const spacingText = spacingInput.value
>       const spacingInches = Number(spacingText)
>
>       const resultBox = document.querySelector("#result")
>
>       if (bedSizeText === "" || spacingText === "") {
>         resultBox.textContent = "Please fill in both fields."
>       } else if (isNaN(bedSize) === true || isNaN(spacingInches) === true) {
>         resultBox.textContent = "Please enter numbers only."
>       } else {
>
>         const spacingFeet = spacingInches / 12
>         const areaPerPlant = spacingFeet * spacingFeet
>         const plantCount = bedSize / areaPerPlant
>         const roundedCount = Math.round(plantCount)
>
>         resultBox.textContent = `You can fit about ${roundedCount} plants.`
>       }
>
>     })
>   </script>
>
> </body>
> </html>
> ```
>
> **What each part does:**
>
> - `const calculateButton = document.querySelector("#calculateButton")` finds the button on the page and stores it.
> - `calculateButton.addEventListener("click", function() { ... })` runs the code inside whenever the button is clicked.
> - Inside the click handler, we grab the two input boxes and read their `.value` (what the visitor typed), storing the raw text and the converted number separately.
> - `if (bedSizeText === "" || spacingText === "")` checks whether either box was left empty, before trying to convert anything.
> - `isNaN(bedSize) === true` checks whether the conversion failed (like if someone typed letters instead of numbers).
> - If everything is valid, we do the math:
>   - Convert spacing from inches to feet, since bed size is in square feet.
>   - Square the spacing to get the area one plant needs.
>   - Divide the bed's total area by that to get how many plants fit.
>   - Round to a whole number, since you can't have part of a plant.
> - Finally, `resultBox.textContent = ...` writes the answer onto the page using a template literal.
>
> Let me know if you'd like to adjust the math (for example, using row spacing and plant spacing separately instead of one spacing number).
:::

**Read.** Notice first that the CSS has semicolons and the JavaScript doesn't. The profile fix from the last lesson worked.

- **The HTML** has two labeled inputs, a button and an empty result paragraph, inside a `div` with the class `calculator`, which the CSS gives a border.
- **The CSS** has two new properties: `max-width` keeps the calculator from stretching across a wide screen, and `display: block` puts each label on its own line.
- **The JavaScript** adds a click handler to the button, written in place. When the button is clicked, the handler reads both inputs, keeping the text and the number separately, then checks and calculates.

The checking is thoughtful. It tests for empty boxes using the *text*, before conversion, which you'll remember from [Making Decisions](decisions){.book-link} is necessary because `Number("")` is 0. Then it tests whether either conversion failed, with **`isNaN`**, a built-in function that's true when its argument is `NaN`. That one's new, and the assistant used it without flagging it; it's simple enough, but worth noticing.

The calculation converts inches to feet, squares the spacing to get the area per plant, and divides. Try it:

<pre class="code" data-environment="html">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;Plant Spacing Calculator&lt;/title&gt;
  &lt;style&gt;
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    .calculator {
      border: 2px solid green;
      padding: 15px;
      max-width: 300px;
    }
    label {
      display: block;
      margin-top: 10px;
    }
    #result {
      font-weight: bold;
      margin-top: 15px;
    }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;

  &lt;h1&gt;Garden Club Plant Spacing Calculator&lt;/h1&gt;

  &lt;div class="calculator"&gt;
    &lt;label for="bedSize"&gt;Bed size (square feet):&lt;/label&gt;
    &lt;input type="text" id="bedSize"&gt;

    &lt;label for="spacing"&gt;Spacing between plants (inches):&lt;/label&gt;
    &lt;input type="text" id="spacing"&gt;

    &lt;button id="calculateButton"&gt;Calculate&lt;/button&gt;

    &lt;p id="result"&gt;&lt;/p&gt;
  &lt;/div&gt;

  &lt;script&gt;
    const calculateButton = document.querySelector("#calculateButton")

    calculateButton.addEventListener("click", function() {

      const bedSizeInput = document.querySelector("#bedSize")
      const bedSizeText = bedSizeInput.value
      const bedSize = Number(bedSizeText)

      const spacingInput = document.querySelector("#spacing")
      const spacingText = spacingInput.value
      const spacingInches = Number(spacingText)

      const resultBox = document.querySelector("#result")

      if (bedSizeText === "" || spacingText === "") {
        resultBox.textContent = "Please fill in both fields."
      } else if (isNaN(bedSize) === true || isNaN(spacingInches) === true) {
        resultBox.textContent = "Please enter numbers only."
      } else {

        const spacingFeet = spacingInches / 12
        const areaPerPlant = spacingFeet * spacingFeet
        const plantCount = bedSize / areaPerPlant
        const roundedCount = Math.round(plantCount)

        resultBox.textContent = `You can fit about ${roundedCount} plants.`
      }

    })
  &lt;/script&gt;

&lt;/body&gt;
&lt;/html&gt;
</pre>

Try 32 and 12 (32 plants), then some awkward values: 0 for the spacing, and 24 and 18.

## Checking the Edges

With 0 spacing, the page says "You can fit about Infinity plants." With 24 and 18, it says 11. Is there really room for 11? Here's the follow-up:

::: {.ai-conversation prompt="What happens if someone enters 0 or a negative number for the spacing? And is Math.round the right way to round here?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="web-pages" transcript="events/spacing"}
> Good questions — let's think through both.
>
> **What happens with 0 or negative spacing?**
>
> - If spacing is `0`, then `spacingFeet` is `0`, so `areaPerPlant` is `0`. Dividing `bedSize / areaPerPlant` gives `Infinity` (dividing by zero). The page would show "You can fit about Infinity plants," which doesn't make sense.
> - If spacing is negative, `areaPerPlant` becomes a positive number (a negative times a negative), but the result is still physically meaningless — you can't have negative spacing between plants in real life, so we should reject it too.
>
> We should add a check: spacing (and bed size) must be greater than 0.
>
> **Is Math.round right here?**
>
> Not quite. Imagine a bed fits 10.9 plants worth of space. `Math.round` would round that up to 11 — but you can't fit 11 whole plants in a space sized for 10.9. Rounding down with `Math.floor` is more accurate, since any leftover space isn't enough for one more full plant.
>
> Here's the corrected script with both fixes:
>
> ```html
> <script>
>   const calculateButton = document.querySelector("#calculateButton")
>
>   calculateButton.addEventListener("click", function() {
>
>     const bedSizeInput = document.querySelector("#bedSize")
>     const bedSizeText = bedSizeInput.value
>     const bedSize = Number(bedSizeText)
>
>     const spacingInput = document.querySelector("#spacing")
>     const spacingText = spacingInput.value
>     const spacingInches = Number(spacingText)
>
>     const resultBox = document.querySelector("#result")
>
>     if (bedSizeText === "" || spacingText === "") {
>       resultBox.textContent = "Please fill in both fields."
>     } else if (isNaN(bedSize) === true || isNaN(spacingInches) === true) {
>       resultBox.textContent = "Please enter numbers only."
>     } else if (bedSize <= 0 || spacingInches <= 0) {
>       resultBox.textContent = "Please enter numbers greater than zero."
>     } else {
>
>       const spacingFeet = spacingInches / 12
>       const areaPerPlant = spacingFeet * spacingFeet
>       const plantCount = bedSize / areaPerPlant
>       const roundedCount = Math.floor(plantCount)
>
>       resultBox.textContent = `You can fit about ${roundedCount} plants.`
>     }
>
>   })
> </script>
> ```
>
> **What changed:**
>
> - Added `else if (bedSize <= 0 || spacingInches <= 0)` to catch zero and negative values before doing any math with them.
> - Changed `Math.round(plantCount)` to `Math.floor(plantCount)`, so leftover partial space doesn't get counted as a whole extra plant.
:::

Both fixes are right.

- **Values that make no sense.** Dividing by zero in JavaScript doesn't cause an error; it gives the special value `Infinity`. A number can be valid JavaScript and still be meaningless, so validation has to check what makes sense for the problem, here that both numbers are greater than zero.
- **Rounding.** 24 square feet with 18-inch spacing gives 10.67. `Math.round` makes that 11, but the eleventh plant won't fit. **`Math.floor`** always rounds *down*, to 10. (Its partner, `Math.ceil`, always rounds up.) Which to use depends on what the number means: for plants that must fit, round down; for bags of compost you must buy to cover a bed, round up.

This is the same habit as testing edges in [Making Decisions](decisions){.book-link}: after the ordinary case works, try zero, negatives, empty boxes, and values that don't divide evenly.

## The Finished Calculator

This version adds two improvements. The inputs use `type="number"`, which gives a number keypad on phones and small up and down arrows in most browsers. And instead of a Calculate button, the result updates as the visitor types, using the `input` event on both boxes, with one named handler shared between them:

<pre class="code" data-environment="html">
&lt;!doctype html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Plant Spacing Calculator&lt;/title&gt;
    &lt;style&gt;
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      .calculator {
        border: 2px solid green;
        padding: 15px;
        max-width: 320px;
      }
      label {
        display: block;
        margin-top: 10px;
      }
      #result {
        font-weight: bold;
        margin-top: 15px;
      }
    &lt;/style&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;How Many Plants Fit?&lt;/h1&gt;
    &lt;div class="calculator"&gt;
      &lt;label for="bedSize"&gt;Bed size (square feet):&lt;/label&gt;
      &lt;input type="number" id="bedSize" value="32"&gt;
      &lt;label for="spacing"&gt;Spacing between plants (inches):&lt;/label&gt;
      &lt;input type="number" id="spacing" value="12"&gt;
      &lt;p id="result"&gt;&lt;/p&gt;
    &lt;/div&gt;

    &lt;script&gt;
      const bedSizeInput = document.querySelector("#bedSize")
      const spacingInput = document.querySelector("#spacing")
      const result = document.querySelector("#result")

      function updateResult() {
        const bedSizeText = bedSizeInput.value
        const spacingText = spacingInput.value
        const bedSize = Number(bedSizeText)
        const spacingInches = Number(spacingText)

        if (bedSizeText === "" || spacingText === "") {
          result.textContent = "Enter both numbers."
        } else if (bedSize &lt;= 0 || spacingInches &lt;= 0) {
          result.textContent = "Both numbers must be greater than zero."
        } else {
          const spacingFeet = spacingInches / 12
          const areaPerPlant = spacingFeet * spacingFeet
          // round down: a partial plant's space isn't room for another plant
          const plantCount = Math.floor(bedSize / areaPerPlant)
          result.textContent = `${plantCount} plants fit in this bed.`
        }
      }

      bedSizeInput.addEventListener("input", updateResult)
      spacingInput.addEventListener("input", updateResult)
      // show a result for the starting values, too
      updateResult()
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

The last line calls `updateResult()` once, *with* parentheses, so the page shows an answer for the starting values before anyone types. The two lines above it pass `updateResult` *without* parentheses, for the inputs to call later. Seeing both side by side is a good way to fix the difference in your mind.

With `type="number"`, the browser won't let most letters into the box, so the `isNaN` check isn't needed. That's a general principle: the right kind of input prevents mistakes before your code ever sees them. But never rely on it entirely. Some browsers still allow odd input, and you'll see in a later lesson that a page's code can be bypassed, so code that *stores* or *acts on* input should always check it too.

The club's beds are 24, 32, 48 and 64 square feet. Try each one with 12-, 18- and 24-inch spacing.

## Your Learner Profile

::: {.ai-profile lesson="events"}
Add to "What I know so far":

- events and addEventListener, with click and input events
- passing a function as a value, without parentheses, and anonymous functions written in place: function() { }
- form inputs: input with type text or number, label, and reading value (always a string)
- validating input: empty fields, isNaN, and values that make no sense for the problem
- Math.floor and Math.ceil
:::

## Summary

Events let a page respond to what visitors do. `addEventListener` connects an event, such as `click` or `input`, to a handler function, which runs each time the event happens. The handler is passed as a value, without parentheses; with parentheses, it would run once, immediately. Handlers are often written in place as anonymous functions. An input's `value` is always a string, so convert it with `Number()`, and validate it: check for empty fields before converting, for text that isn't a number, and for values that make no sense, such as zero where you'll divide. JavaScript's `Infinity` and `NaN` won't stop your code, so they can reach the page unless you check. Choose rounding by meaning: `Math.floor` for "how many fit," `Math.ceil` for "how many to buy." Next, your pages will fetch live data, which brings in a new idea: code that waits.
