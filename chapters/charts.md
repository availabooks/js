---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Decide what question a chart should answer before asking for one, and choose a chart that answers it honestly.
2. Group and total data with Arquero, a library for data tables.
3. Draw bar charts and dot plots with Observable Plot.
4. Load libraries as ES modules from a CDN, with pinned versions.
5. Describe what a small dataset can and can't tell you.
:::
:::

## A Season of Data

The garden's first season is over, and the university wants to know what happened. How much did each crop produce? Did some beds do better than others, and why? Answering takes two steps: **analyzing** the data, grouping and totaling it, and **charting** it, so the answer can be seen at a glance.

Two JavaScript libraries are made for exactly this, and both run in any web page:

- **Arquero** works with tables of data: grouping, totaling, filtering, sorting and joining tables. If you've heard of pandas in Python, or used SQL, the ideas are the same.
- **Observable Plot** draws charts from arrays of objects, with a few lines of code.

This lesson uses them in a web page, with the page's HTML editor, so there's nothing to install. The same libraries work in Node, and in **notebooks**, documents that mix code, results and writing, where the results update when the code or data changes. Observable's online notebooks and Jupyter notebooks, which can run JavaScript through a runtime called Deno, are both popular choices, and worth exploring once you've learned the libraries.

## Loading Libraries as Modules

In [Sharing and Reusing Code](sharing-code){.book-link}, you loaded Chart.js with a `<script>` tag, which created a global named `Chart`. Modern libraries are usually loaded as ES modules instead, the kind of module you learned in [Modules and Packages](node-modules){.book-link}. In a web page, that means a `<script type="module">`, which can use `import` with a full web address:

```{.code environment="none"}
<script type="module">
  import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6.17/+esm"
</script>
```

::: {.ntk}

`import * as Plot` puts everything the library exports into one object named `Plot`. The address comes from **jsDelivr**, a service that serves npm packages to web pages; `@0.6.17` pins the version, as your profile asks, and `/+esm` asks for the ES module form.

:::

## Totals by Crop

Here's the first request, in a new chat with your learner profile from [Working with Data Files](data-files){.book-link}. It describes the data exactly, and names the library versions:

::: {.ai-conversation prompt="I'm making a web page that loads Observable Plot 0.6.17 and Arquero 8.0.3 as ES modules from jsDelivr, in a script tag with type=&quot;module&quot;. The page has an array named harvests, where each harvest is an object like { date: &quot;2027-06-21&quot;, bed: &quot;B3&quot;, crop: &quot;Bean&quot;, kg: 2.6, loggedBy: &quot;ava.lopez@example.com&quot; }. Use Arquero to total the kilograms for each crop, and Plot to show the totals as a bar chart, largest first." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="data-files" transcript="charts/by-crop"}
> Quick notes before the code:
>
> - **Libraries**: Observable Plot and Arquero are both from npm, served here through jsDelivr's `/+esm` builds, pinned to the exact versions you gave. Neither library is on your "known so far" list, so I'll explain the specific methods I use as I go.
> - **Visibility**: if you just open this HTML file yourself, only you see it. If you publish it somewhere others can visit, anyone who opens the page can see the full `harvests` array in the page's source — including the `loggedBy` email addresses. You may want to strip that field out before publishing, or keep the page private.
>
> Here's the page:
>
> ```html
> <!DOCTYPE html>
> <html>
> <head>
>   <title>Harvest totals by crop</title>
> </head>
> <body>
>
>   <h1>Total kilograms harvested, by crop</h1>
>   <div id="chart"></div>
>
>   <script type="module">
>     // Import Arquero (a data table library) and Plot (a charting library)
>     // from jsDelivr, with exact versions pinned
>     import * as aq from "https://cdn.jsdelivr.net/npm/arquero@8.0.3/+esm"
>     import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6.17/+esm"
>
>     // Example data — replace this with wherever your real harvests array comes from
>     const harvests = [
>       { date: "2027-06-21", bed: "B3", crop: "Bean", kg: 2.6, loggedBy: "ava.lopez@example.com" },
>       { date: "2027-06-22", bed: "B1", crop: "Tomato", kg: 5.1, loggedBy: "ava.lopez@example.com" },
>       { date: "2027-06-22", bed: "B3", crop: "Bean", kg: 1.4, loggedBy: "sam.chen@example.com" },
>       { date: "2027-06-23", bed: "B2", crop: "Tomato", kg: 3.9, loggedBy: "sam.chen@example.com" },
>       { date: "2027-06-23", bed: "B4", crop: "Squash", kg: 4.0, loggedBy: "ava.lopez@example.com" }
>     ]
>
>     // Turn the array into an Arquero table, then chain three steps:
>     const totalsTable = aq.from(harvests)
>       .groupby("crop")                                    // group rows by crop name
>       .rollup({ totalKg: d => aq.op.sum(d.kg) })           // sum kg within each group
>       .orderby(aq.desc("totalKg"))                         // sort groups largest total first
>
>     // .objects() turns the Arquero table back into a plain array of objects,
>     // which is the shape Plot expects
>     const totals = totalsTable.objects()
>
>     // Print the totals so you can check them against the raw data
>     console.log(totals)
>
>     // Build the bar chart
>     const chart = Plot.plot({
>       x: {
>         label: "Crop",
>         domain: totals.map(d => d.crop) // force bar order to match our sorted totals
>       },
>       y: {
>         label: "Total kg"
>       },
>       marks: [
>         Plot.barY(totals, { x: "crop", y: "totalKg" })
>       ]
>     })
>
>     // Add the chart to the page, inside the div
>     document.querySelector("#chart").append(chart)
>   </script>
>
> </body>
> </html>
> ```
>
> **What each Arquero step does:**
> 1. `aq.from(harvests)` — loads your array into an Arquero table.
> 2. `.groupby("crop")` — groups the rows so the next step works on one crop at a time.
> 3. `.rollup({ totalKg: d => aq.op.sum(d.kg) })` — for each group, adds up the `kg` values into one `totalKg` number.
> 4. `.orderby(aq.desc("totalKg"))` — sorts the groups so the biggest total comes first.
>
> **Why the `domain` line matters:** Plot doesn't guarantee it will keep your sort order for a bar chart's categories on its own, so I set `x.domain` explicitly to the crop order from `totals`, which is already sorted largest first.
>
> **To check it:** open the page, press F12, and look at the Console — you'll see the `totals` array logged so you can confirm the numbers and order are right before trusting the chart.
:::

**Read.** The assistant started with two notes that show your profile rules at work: where the libraries come from, with pinned versions, and who could see the page, including a warning that publishing it would expose volunteers' email addresses. That's a good catch: if the page were published, the `loggedBy` field should be removed first.

::: {.k0z}

Then the analysis, as an Arquero chain, one step per line, each explained:

- **`aq.from(harvests)`** turns the array of objects into an Arquero table.
- **`.groupby("crop")`** groups the rows by crop, so the next step works on one crop at a time.
- **`.rollup({ totalKg: d => aq.op.sum(d.kg) })`** reduces each group to one row, with a new column, `totalKg`, holding the sum of its kilograms. `aq.op` holds Arquero's operations: `sum`, `mean`, `count`, `max` and more.
- **`.orderby(aq.desc("totalKg"))`** sorts the rows, largest first.
- **`.objects()`** turns the table back into an array of objects, for Plot.

:::

It's the counting-by-name pattern from [Objects and JSON](objects){.book-link}, in four lines. And the chart is one call: **`Plot.plot`** takes an object describing the chart, with **`Plot.barY(totals, { x: "crop", y: "totalKg" })`** as its one mark, a vertical bar for each row. The `domain` setting keeps the bars in the sorted order. `Plot.plot` returns an SVG element, a drawing, which `append` adds to the page.

The example data is invented, including a volunteer named Sam Chen who isn't in the club; the assistant said so and told you to replace it. Here's the page with the club's real harvests. Run it:

```{.code environment="html"}
<h2>Kilograms harvested by crop, 2027 season</h2>
<div id="chart"></div>

<script type="module">
  import * as aq from "https://cdn.jsdelivr.net/npm/arquero@8.0.3/+esm"
  import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6.17/+esm"

    const harvests = [
      { date: "2027-04-18", bed: "B2", crop: "Radish", kg: 1.2 },
      { date: "2027-05-13", bed: "B4", crop: "Spinach", kg: 2.4 },
      { date: "2027-05-15", bed: "B2", crop: "Lettuce", kg: 3.9 },
      { date: "2027-05-21", bed: "B2", crop: "Lettuce", kg: 2.5 },
      { date: "2027-05-21", bed: "B4", crop: "Spinach", kg: 0.6 },
      { date: "2027-05-28", bed: "B4", crop: "Kale", kg: 2.2 },
      { date: "2027-05-31", bed: "B2", crop: "Lettuce", kg: 2.4 },
      { date: "2027-06-05", bed: "B4", crop: "Kale", kg: 0.6 },
      { date: "2027-06-09", bed: "B1", crop: "Basil", kg: 2 },
      { date: "2027-06-11", bed: "B4", crop: "Kale", kg: 1.8 },
      { date: "2027-06-13", bed: "B3", crop: "Zucchini", kg: 0.5 },
      { date: "2027-06-13", bed: "B6", crop: "Carrot", kg: 1.3 },
      { date: "2027-06-18", bed: "B1", crop: "Basil", kg: 1.3 },
      { date: "2027-06-21", bed: "B3", crop: "Zucchini", kg: 3.2 },
      { date: "2027-06-22", bed: "B3", crop: "Bean", kg: 2.6 },
      { date: "2027-06-24", bed: "B5", crop: "Tomato", kg: 3.1 },
      { date: "2027-06-29", bed: "B3", crop: "Bean", kg: 3.8 },
      { date: "2027-06-30", bed: "B3", crop: "Zucchini", kg: 0.6 },
      { date: "2027-07-01", bed: "B1", crop: "Tomato", kg: 2.6 },
      { date: "2027-07-01", bed: "B5", crop: "Tomato", kg: 0.9 },
      { date: "2027-07-01", bed: "B8", crop: "Cucumber", kg: 2.6 },
      { date: "2027-07-03", bed: "B5", crop: "Pepper", kg: 2 },
      { date: "2027-07-05", bed: "B7", crop: "Mint", kg: 3.6 },
      { date: "2027-07-07", bed: "B3", crop: "Bean", kg: 3.7 },
      { date: "2027-07-08", bed: "B1", crop: "Tomato", kg: 2.2 },
      { date: "2027-07-09", bed: "B7", crop: "Mint", kg: 2.4 },
      { date: "2027-07-10", bed: "B8", crop: "Cucumber", kg: 2.9 },
      { date: "2027-07-13", bed: "B1", crop: "Tomato", kg: 1.4 },
      { date: "2027-07-16", bed: "B8", crop: "Cucumber", kg: 3.9 },
      { date: "2027-07-17", bed: "B7", crop: "Mint", kg: 2.5 },
      { date: "2027-08-10", bed: "B8", crop: "Squash", kg: 1.9 },
      { date: "2027-08-16", bed: "B8", crop: "Squash", kg: 2.3 }
    ]
    const beds = [
      { id: "B1", sizeSqFt: 32, sun: "full" },
      { id: "B2", sizeSqFt: 32, sun: "full" },
      { id: "B3", sizeSqFt: 48, sun: "full" },
      { id: "B4", sizeSqFt: 48, sun: "partial" },
      { id: "B5", sizeSqFt: 64, sun: "full" },
      { id: "B6", sizeSqFt: 64, sun: "partial" },
      { id: "B7", sizeSqFt: 24, sun: "partial" },
      { id: "B8", sizeSqFt: 24, sun: "full" }
    ]

  const totals = aq.from(harvests)
    .groupby("crop")
    .rollup({ totalKg: d => aq.op.sum(d.kg) })
    .orderby(aq.desc("totalKg"))
    .objects()

  // check the numbers before trusting the chart
  console.log(`${totals.length} crops, ${harvests.length} harvests`)

  const chart = Plot.plot({
    marginLeft: 50,
    x: { label: null, domain: totals.map(d => d.crop), tickRotate: -30 },
    y: { label: "Kilograms", grid: true },
    marks: [
      Plot.barY(totals, { x: "crop", y: "totalKg", fill: "#2e7d32" }),
      Plot.ruleY([0])
    ]
  })
  document.querySelector("#chart").append(chart)
</script>
```

Tomatoes and beans lead, each with just over 10 kilograms, followed closely by cucumbers, lettuce and mint. The console line is your rule from the last lesson: counts you can check. Thirteen crops and 32 harvests match the data you've worked with.

## Which Chart?

The next question is harder, and more interesting: did beds with full sun do better than beds with partial sun? Beds are different sizes, so the fair measure is kilograms *per square foot*. Before asking for code, ask about the chart:

::: {.ai-conversation prompt="Next I want to know whether beds with full sun produced more per square foot than beds with partial sun. I also have an array named beds, with objects like { id: &quot;B3&quot;, sizeSqFt: 48, sun: &quot;full&quot; }. Before writing code: what kind of chart would answer that question best, and why?" assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="data-files" transcript="charts/by-crop"}
> Good question to think through before coding. A few options and why I'd pick one:
>
> **Option 1: A bar chart of averages — one bar for "full," one bar for "partial," showing average kg per square foot.**
> This directly answers your yes/no question in one glance. But it hides how many beds are in each group and how much they vary. If one "full sun" bed had an unusually high yield, it could pull the average up and make the comparison misleading, especially if you only have a handful of beds total.
>
> **Option 2: A dot plot — one dot per bed, plotted by its kg/sqft value, with beds grouped along one axis into "full" and "partial."**
> This shows every bed's actual number, so you can see the spread within each group, not just one summary number. You could visually judge things like "the full sun beds are consistently higher" versus "one full sun bed is an outlier pulling up the average." With garden-scale data (probably a small number of beds), showing each point rather than hiding them behind an average is usually more honest.
>
> **My recommendation:** Option 2, the dot plot, because it's likely you have few enough beds that individual points are meaningful, and it won't hide variation the way a two-bar average chart would. I'd still calculate and could print the average for each group as a number to check, but the chart itself would show individual beds.
>
> One new thing this would need: Plot's `dot` mark (`Plot.dot`), which places one dot per row at an x/y position — similar in spirit to `barY`, but plotting a point instead of a bar. I'd explain it as I use it.
>
> Does that approach make sense, or would you rather start simpler with the two-bar average version and add the dot plot later?
:::

::: {.xxq .mv0}

That's the Plan step applied to charts, and the reasoning is excellent. Two bars showing averages would answer the question in one glance, but they'd hide how many beds are behind each bar and how much they differ. With only eight beds, showing each one as a dot is more honest. It's a principle worth remembering: **the fewer the data points, the more you should show them all.**

:::

Here's the dot plot. It combines the two arrays, which is new: for each bed, it looks up the bed's total kilograms, divides by its size, and keeps its sun. Run it:

```{.code environment="html"}
<h2>Kilograms per square foot, by bed</h2>
<div id="chart"></div>
<p id="averages"></p>

<script type="module">
  import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6.17/+esm"

    const harvests = [
      { date: "2027-04-18", bed: "B2", crop: "Radish", kg: 1.2 },
      { date: "2027-05-13", bed: "B4", crop: "Spinach", kg: 2.4 },
      { date: "2027-05-15", bed: "B2", crop: "Lettuce", kg: 3.9 },
      { date: "2027-05-21", bed: "B2", crop: "Lettuce", kg: 2.5 },
      { date: "2027-05-21", bed: "B4", crop: "Spinach", kg: 0.6 },
      { date: "2027-05-28", bed: "B4", crop: "Kale", kg: 2.2 },
      { date: "2027-05-31", bed: "B2", crop: "Lettuce", kg: 2.4 },
      { date: "2027-06-05", bed: "B4", crop: "Kale", kg: 0.6 },
      { date: "2027-06-09", bed: "B1", crop: "Basil", kg: 2 },
      { date: "2027-06-11", bed: "B4", crop: "Kale", kg: 1.8 },
      { date: "2027-06-13", bed: "B3", crop: "Zucchini", kg: 0.5 },
      { date: "2027-06-13", bed: "B6", crop: "Carrot", kg: 1.3 },
      { date: "2027-06-18", bed: "B1", crop: "Basil", kg: 1.3 },
      { date: "2027-06-21", bed: "B3", crop: "Zucchini", kg: 3.2 },
      { date: "2027-06-22", bed: "B3", crop: "Bean", kg: 2.6 },
      { date: "2027-06-24", bed: "B5", crop: "Tomato", kg: 3.1 },
      { date: "2027-06-29", bed: "B3", crop: "Bean", kg: 3.8 },
      { date: "2027-06-30", bed: "B3", crop: "Zucchini", kg: 0.6 },
      { date: "2027-07-01", bed: "B1", crop: "Tomato", kg: 2.6 },
      { date: "2027-07-01", bed: "B5", crop: "Tomato", kg: 0.9 },
      { date: "2027-07-01", bed: "B8", crop: "Cucumber", kg: 2.6 },
      { date: "2027-07-03", bed: "B5", crop: "Pepper", kg: 2 },
      { date: "2027-07-05", bed: "B7", crop: "Mint", kg: 3.6 },
      { date: "2027-07-07", bed: "B3", crop: "Bean", kg: 3.7 },
      { date: "2027-07-08", bed: "B1", crop: "Tomato", kg: 2.2 },
      { date: "2027-07-09", bed: "B7", crop: "Mint", kg: 2.4 },
      { date: "2027-07-10", bed: "B8", crop: "Cucumber", kg: 2.9 },
      { date: "2027-07-13", bed: "B1", crop: "Tomato", kg: 1.4 },
      { date: "2027-07-16", bed: "B8", crop: "Cucumber", kg: 3.9 },
      { date: "2027-07-17", bed: "B7", crop: "Mint", kg: 2.5 },
      { date: "2027-08-10", bed: "B8", crop: "Squash", kg: 1.9 },
      { date: "2027-08-16", bed: "B8", crop: "Squash", kg: 2.3 }
    ]
    const beds = [
      { id: "B1", sizeSqFt: 32, sun: "full" },
      { id: "B2", sizeSqFt: 32, sun: "full" },
      { id: "B3", sizeSqFt: 48, sun: "full" },
      { id: "B4", sizeSqFt: 48, sun: "partial" },
      { id: "B5", sizeSqFt: 64, sun: "full" },
      { id: "B6", sizeSqFt: 64, sun: "partial" },
      { id: "B7", sizeSqFt: 24, sun: "partial" },
      { id: "B8", sizeSqFt: 24, sun: "full" }
    ]

  // total kilograms for each bed
  const kgByBed = {}
  for (const harvest of harvests) {
    kgByBed[harvest.bed] = (kgByBed[harvest.bed] || 0) + harvest.kg
  }

  // one object per bed, with its yield per square foot
  const yields = beds.map(bed => ({
    bed: bed.id,
    sun: bed.sun,
    kgPerSqFt: kgByBed[bed.id] / bed.sizeSqFt
  }))

  const chart = Plot.plot({
    marginLeft: 60,
    x: { label: "Kilograms per square foot", grid: true },
    y: { label: null },
    marks: [
      Plot.dot(yields, { x: "kgPerSqFt", y: "sun", r: 6, fill: "sun" }),
      Plot.text(yields, { x: "kgPerSqFt", y: "sun", text: "bed", dy: -12 })
    ]
  })
  document.querySelector("#chart").append(chart)

  const average = sun => {
    const group = yields.filter(y => y.sun === sun)
    return group.reduce((sum, y) => sum + y.kgPerSqFt, 0) / group.length
  }
  document.querySelector("#averages").textContent =
    `Average: full sun ${average("full").toFixed(2)}, partial sun ${average("partial").toFixed(2)} kg per square foot`
</script>
```

::: {.usk}

Two pieces of syntax are new. `(kgByBed[harvest.bed] || 0)` uses `||` the way you saw in [Loops and Repetition](loops){.book-link}: if the bed has no total yet, `undefined || 0` gives 0. And `bed => ({ ... })` is an arrow function that returns an object; the parentheses around the braces tell JavaScript the braces are an object, not the function's body.

:::

::: {.gpj}

**`Plot.dot`** places a dot for each bed, with `x` its yield and `y` its sun, colored by sun, and **`Plot.text`** labels each dot with the bed's ID.

:::

## What the Chart Can and Can't Say

The averages say full sun won: about 0.31 kilograms per square foot against 0.18. The dots tell a more careful story:

- **The groups overlap.** Bed 7, in partial sun, did better than four of the five full-sun beds. Bed 5, in full sun, did worse than two of the three partial-sun beds.
- **Other things differ between beds, too.** Bed 7 grew mint, which spreads eagerly; Bed 5 grew peppers and tomatoes. Bed 8, the top performer, grew cucumbers and squash. The crop may matter as much as the sun.
- **Eight beds is very few.** One unusual bed moves an average a lot.

So the honest conclusion for the university is: *in the first season, full-sun beds produced more per square foot on average, but the difference is uncertain, and the crops planted may explain as much of it as the sunlight.* That's less exciting than "full sun doubles yields," and far more likely to be true. Assistants, and people, are quick to read causes into charts; your job is to say what the data can support.

### When the data grows: SQL

::: {.skf}

For much larger data, or data from several related tables, many people analyze it with **SQL**, the language of databases. A tool called **DuckDB** runs SQL directly on CSV and JSON files, in Node or in a web page, with no database to set up. If you know SQL, from this book's companion on the subject or elsewhere, "total kilograms by crop" is `SELECT crop, SUM(kg) FROM harvests GROUP BY crop`, and DuckDB can run exactly that on `harvests.json`. It's a good tool to ask your assistant about when Arquero starts to feel slow.

:::

## Your Learner Profile

::: {.learner-profile}
:::

## Summary

Analyzing data means grouping and totaling it; charting it means showing the result so it can be seen at a glance. Arquero does the first with chains like `groupby`, `rollup` and `orderby`, and Observable Plot does the second with marks like `barY` and `dot`. Both load in a web page as ES modules from a CDN, with the version pinned. Before asking for a chart, decide what question it should answer, and choose a chart that shows the data honestly: with only a few data points, show them all rather than hiding them behind averages. Then say only what the data supports. Eight beds and one season suggested that full sun helped, but couldn't separate the sun from the crops. Next, you'll build command-line tools the club can run with a single command.
