---
_$_import: monaco
---

::: {.learning}
Learning Objectives

::: {.objectives}
1. Read, write and add to text files with Node's `fs` module.
2. List a folder's contents, look up a file's details, and create and move files and folders.
3. Build file paths with `path.join`, and explain how relative paths depend on the current working directory.
4. Read array destructuring with `...rest`, and the spread syntax.
5. Work safely with files: dry runs, copies, and checking before overwriting.
:::
:::

## Files and Folders from Code

This is what Node can do that nothing else in this book could: work directly with the files and folders on your computer. Node comes with a built-in module for it, **`fs`**, for *file system*, and another, **`path`**, for building file paths correctly on any operating system. Built-in modules are imported like packages, but need no installing. The `node:` in front of their names says they're part of Node:

<pre class="code" data-environment="nodejs">
import fs from "node:fs"
import path from "node:path"

// write a file, replacing it if it exists
fs.writeFileSync("notes.txt", "Bed 3 needs compost.\n")

// add to the end of a file
fs.appendFileSync("notes.txt", "Twine is running low.\n")

// read a whole file as text
const text = fs.readFileSync("notes.txt", "utf8")
console.log(text)

// list what's in a folder
console.log(fs.readdirSync("."))

// build a path from parts; Windows gets \ and Mac gets /
console.log(path.join("garden-photos", "2027-06", "tomatoes.jpg"))
</pre>

Run it with Node in an empty project folder, and look at the folder afterward: `notes.txt` is there. A few things to notice:

- **`"utf8"`** tells `readFileSync` to give back text. Without it, you get the file's raw bytes.
- **`"."`** means "the current folder." All these relative names, `notes.txt` included, are relative to the terminal's current working directory, from [Installing Node and Running Scripts](node){.book-link}, not to the script's location. Run the script from a different folder, and it reads and writes there.
- **`writeFileSync` replaces a file without asking.** There's no "are you sure?" and no undo.

::: {.note}
> **Sync or not?** Each of these functions has an asynchronous version in `node:fs/promises`, used with `await`: `await readFile("notes.txt", "utf8")`. Asynchronous versions let a program do other things while it waits for the disk, which matters for servers handling many people at once. For a script that does one job from start to finish, the `Sync` versions are simpler, and they're what this lesson uses. You'll see both in AI replies.
:::

## Sorting the Garden Photos

Volunteers have been sending photos all season, and they're all in one folder, `garden-photos`, hundreds of them. Maya would like them sorted into a folder for each month. Here's the request, in a new chat with your learner profile from [Modules and Packages](node-modules){.book-link}:

::: {.ai-conversation prompt="I have a folder named garden-photos full of .jpg photos from the season. Write a Node script that moves each photo into a subfolder named for the year and month the photo was taken, like 2027-06." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="node-modules" transcript="files/photos"}
> Good project! Before I write this, there are a few things worth flagging:
>
> **New concept: the `fs` module**
> Your list doesn't include Node's built-in `fs` (file system) module, which is what reads folders, checks files, makes folders, and moves files. It's built into Node — no installing anything — but it's new material, so I'll explain each piece as I use it.
>
> **A question about "date taken"**
> A JPEG file can store the actual date-taken inside its metadata (called EXIF data), but reading that requires an extra package, since Node has no built-in way to parse it. The simpler, built-in option is to use the file's own **modified time** — the timestamp your operating system already keeps for every file. This usually matches when the photo was taken, but if you copied or edited the files afterward, it might not.
>
> I'll write it using the built-in modified time. If you want true EXIF "date taken" instead, tell me and I'll suggest a package for it.
>
> **Safety**
> Moving files can't easily be undone, so I've set it up to do a **dry run** first — it just prints what it *would* do. You can flip one setting to actually move the files once you've checked the output.
>
> ```js
> import fs from "node:fs"
> import path from "node:path"
>
> // The folder with your photos, and a switch for dry runs
> const PHOTO_FOLDER = "garden-photos"
> const DRY_RUN = true
>
> // fs.readdirSync gives back an array of file names in a folder
> const allFiles = fs.readdirSync(PHOTO_FOLDER)
>
> // Keep only files ending in .jpg (case-insensitive)
> const jpgFiles = allFiles.filter(name => name.toLowerCase().endsWith(".jpg"))
>
> jpgFiles.forEach(fileName => {
>   // path.join combines folder and file names correctly for your operating system
>   const sourcePath = path.join(PHOTO_FOLDER, fileName)
>
>   // fs.statSync looks up details about a file, including when it was last modified
>   const stats = fs.statSync(sourcePath)
>   const modifiedDate = stats.mtime
>
>   const year = modifiedDate.getFullYear()
>   const monthNumber = modifiedDate.getMonth() + 1 // getMonth counts from 0
>
>   // Add a leading zero for months under 10, so June is "06" not "6"
>   let monthText
>   if (monthNumber < 10) {
>     monthText = `0${monthNumber}`
>   } else {
>     monthText = `${monthNumber}`
>   }
>
>   const folderName = `${year}-${monthText}`
>   const destinationFolder = path.join(PHOTO_FOLDER, folderName)
>   const destinationPath = path.join(destinationFolder, fileName)
>
>   if (DRY_RUN) {
>     console.log(`Would move ${fileName} to ${folderName}/`)
>   } else {
>     // fs.mkdirSync makes the folder; recursive: true means "don't error if it already exists"
>     fs.mkdirSync(destinationFolder, { recursive: true })
>     // fs.renameSync moves the file to its new path
>     fs.renameSync(sourcePath, destinationPath)
>     console.log(`Moved ${fileName} to ${folderName}/`)
>   }
> })
> ```
>
> A couple of notes:
>
> - Since this uses `import`, make sure your `package.json` has `"type": "module"`, like you've done before.
> - Run it once with `DRY_RUN = true` and check the printed list. If it looks right, change it to `DRY_RUN = false` and run it again to actually move the files.
>
> Want me to also show the EXIF-based version that reads the real "date taken" from inside the photo?
:::

**Read.** The assistant flagged `fs` as new and explained each function as it used it:

- **`readdirSync`** lists the file names, and `filter` keeps the ones ending in `.jpg`, after `toLowerCase()`, so `.JPG` counts too.
- **`statSync`** looks up a file's details. Its `mtime` property is the **modified time**, a Date object.
- The folder name is built from the date, with a leading zero for months below 10, as in [Email, Calendar, and Dates](email-calendar){.book-link}.
- **`mkdirSync`** creates the month folder, where `{ recursive: true }` means "and don't complain if it's already there," and **`renameSync`** moves the file. Renaming a file to a path in a different folder is how you move it.

Two parts of the reply show good judgment. It raised the question of *which* date: a photo's modified time is easy to get, but it's the date the *file* last changed, which may not be when the photo was taken. Photos downloaded from a chat app or a cloud service often get the download date. The true "date taken" is stored inside the photo, in its **EXIF** data, and reading it needs a package. For the club, trying the built-in approach first, on a copy, is sensible: if every photo lands in the month you downloaded them, you'll know you need the package.

And it made a dry run, without being asked. Your profile's dry-run rule mentions only email, calendars and Google Drive, but the assistant applied its spirit to moving files. With `DRY_RUN = true`, the script only prints what it would do.

### One more check before running it

What if the month folder already has a file with the same name? Phones name photos with counters, such as `IMG_0412.jpg`, so two volunteers' photos can easily share a name. `renameSync` onto an existing file *replaces* it, silently, on Windows and Mac alike. One volunteer's photo would be gone.

The fix is to check first, with **`existsSync`**, and skip any photo that would overwrite another. Here's the script with that check, in the book's style:

<pre class="code" data-environment="nodejs">
import fs from "node:fs"
import path from "node:path"

const PHOTO_FOLDER = "garden-photos"
// change to false to move the files for real, after checking the output
const DRY_RUN = true

const photos = fs.readdirSync(PHOTO_FOLDER)
  .filter(name => name.toLowerCase().endsWith(".jpg"))

for (const fileName of photos) {
  const sourcePath = path.join(PHOTO_FOLDER, fileName)
  // the modified time, which may differ from when the photo was taken
  const modified = fs.statSync(sourcePath).mtime
  const month = String(modified.getMonth() + 1).padStart(2, "0")
  const monthFolder = path.join(PHOTO_FOLDER, `${modified.getFullYear()}-${month}`)
  const destinationPath = path.join(monthFolder, fileName)

  if (fs.existsSync(destinationPath)) {
    console.log(`Skipped ${fileName}: a photo with that name is already in ${monthFolder}`)
  } else if (DRY_RUN) {
    console.log(`Would move ${fileName} to ${monthFolder}`)
  } else {
    fs.mkdirSync(monthFolder, { recursive: true })
    fs.renameSync(sourcePath, destinationPath)
    console.log(`Moved ${fileName} to ${monthFolder}`)
  }
}
</pre>

`padStart(2, "0")` is a string method that adds zeros to the front until the string is 2 characters long: `"6"` becomes `"06"`, and `"11"` stays `"11"`. It replaces the `if` for the leading zero.

Before running it for real, make a copy of the whole `garden-photos` folder, and run it on the copy first.

## Reading the Garden Journal

In [Scripting Your Notes in Obsidian](obsidian){.book-link}, you learned that an Obsidian vault is just a folder of text files. That means Node can read it, even with Obsidian closed. Here's a request for a harvest calendar made from the journal, in a new chat:

::: {.ai-conversation prompt="My Obsidian vault is a folder named Garden Journal. Its Plantings subfolder has one Markdown note per planting, and each note starts with front matter between lines of three dashes, with lines like crop: Tomato and expected_harvest: 2027-06-29. Write a Node script that reads every note in Plantings and writes a file named harvest-calendar.txt listing each crop and its expected harvest date, soonest first. Don't use any packages." assistant="Claude" model="claude-sonnet-5" captured="2026-09-26" profile="node-modules" transcript="files/vault"}
> Here's a script that does this using only Node's built-in `fs` and `path` modules — no packages needed.
>
> ```javascript
> import { readdirSync, readFileSync, writeFileSync } from "fs"
> import { join } from "path"
>
> // The folder holding all the planting notes
> const PLANTINGS_FOLDER = "Plantings"
>
> // Pulls out crop and expected_harvest from one note's front matter
> const readPlanting = (fileName) => {
>   const filePath = join(PLANTINGS_FOLDER, fileName)
>   const text = readFileSync(filePath, "utf8")
>
>   // Split the file into lines so we can look at the front matter
>   const lines = text.split("\n")
>
>   // Front matter is between the first two lines that are just "---"
>   const dashLines = []
>   lines.forEach((line, index) => {
>     if (line.trim() === "---") {
>       dashLines.push(index)
>     }
>   })
>   const frontMatterLines = lines.slice(dashLines[0] + 1, dashLines[1])
>
>   // Turn each "key: value" line into an entry in an object
>   const data = {}
>   frontMatterLines.forEach((line) => {
>     const [key, ...rest] = line.split(":")
>     data[key.trim()] = rest.join(":").trim()
>   })
>
>   return { crop: data.crop, expected_harvest: data.expected_harvest }
> }
>
> // Get every Markdown file name in the Plantings folder
> const fileNames = readdirSync(PLANTINGS_FOLDER).filter((name) =>
>   name.endsWith(".md")
> )
>
> // Read all the plantings into an array of { crop, expected_harvest }
> const plantings = fileNames.map(readPlanting)
>
> // Sort by date, soonest first
> const sorted = plantings.sort(
>   (a, b) => new Date(a.expected_harvest) - new Date(b.expected_harvest)
> )
>
> // Turn each planting into one line of text
> const lines = sorted.map(
>   (planting) => `${planting.crop} - ${planting.expected_harvest}`
> )
>
> // Join the lines with line breaks and write the result to a file
> writeFileSync("harvest-calendar.txt", lines.join("\n"))
>
> console.log("harvest-calendar.txt written")
> ```
>
> A few notes on how it works:
>
> - `readdirSync(PLANTINGS_FOLDER)` lists every file name in that folder. `.filter()` keeps only ones ending in `.md`.
> - `readPlanting` opens one note, splits it into lines, finds the two `---` lines with `dashLines`, and only looks at the lines between them.
> - Each front matter line is split on `:` into a key and a value. `rest.join(":")` handles the rare case where a value itself contains a colon.
> - `.map(readPlanting)` turns the list of file names into a list of `{ crop, expected_harvest }` objects.
> - `.sort()` compares two dates by subtracting them — `new Date(...) - new Date(...)` gives a negative number when `a` is earlier, which is what `sort` needs to put earliest first.
> - The final `.map()` turns each object into a line of text, and `writeFileSync` saves them all to `harvest-calendar.txt` in the current folder.
>
> To run it, put this file in your **Garden Journal** folder (so `Plantings` is right next to it), then in the VS Code terminal run:
>
> ```
> node harvest-calendar.js
> ```
>
> One thing to check: this assumes every note's front matter has both `crop:` and `expected_harvest:` on their own lines, spelled exactly that way. If a note is missing one, that planting will show as `undefined` in the output rather than causing an error — let me know if you'd rather have it skip or flag those notes instead.
:::

**Read.** The overall plan is clear: list the notes, read each one, pull out two values from its front matter, sort, and write the lines to a file. It imports just the functions it needs, `import { readdirSync, readFileSync, writeFileSync } from "fs"`, another form of `import` you'll see often. The front matter is found by splitting the note into lines and finding the two `---` lines. Each line between them is split at the colon into a key and a value, stored in an object.

That split uses syntax you haven't met: `const [key, ...rest] = line.split(":")`. It's **array destructuring**, like the object destructuring in [Modules and Packages](node-modules){.book-link}, but by position: `key` gets the first item of the array, and **`...rest`**, the *rest* syntax, gets all the remaining items as a new array. Then `rest.join(":")` puts them back together, so a value that contains a colon, like `note: water at 6:00`, isn't cut short. The assistant explained why, but not the syntax. Try it:

<pre class="code">
const parts = "note: water at 6:00".split(":")
console.log(parts)

const [key, ...rest] = parts
console.log(key)
console.log(rest)
console.log(rest.join(":").trim())

// the same three dots in an array literal spread an array's items out
const moreParts = [...rest, "extra"]
console.log(moreParts)
</pre>

In an array literal, the same `...` does the reverse, called **spread**: it spreads an array's items into the new array.

::: {.term}
> **Rest and spread** — Three dots, `...`, either gather the remaining items into an array (rest, as in `const [first, ...others] = list`) or spread an array's items out (spread, as in `[...list, "new item"]`).
:::

Three other details:

- **`trim()`** removes spaces from both ends of a string, and it also quietly handles a difference between computers: files saved on Windows end each line with two invisible characters instead of one, and the extra one is removed by `trim`.
- **`slice(start, end)`** returns part of an array, from `start` up to but not including `end`.
- The script expects to run from the vault folder, since it reads `"Plantings"`, a relative path. The instructions say so, which is the current working directory lesson again.

The assistant pointed out what happens with a note that lacks a field: `undefined` in the calendar, rather than an error. That's worth deciding about. For a calendar, skipping those notes and printing a warning is probably best. Also, the sort converts each date text to a Date object and subtracts. It works, but as you saw in [Scripting Your Notes in Obsidian](obsidian){.book-link}, dates written as `YYYY-MM-DD` sort correctly as text with `localeCompare`, which avoids converting at all.

## Working Safely with Files

Everything in this lesson changes your real files, immediately. A few habits keep that from going wrong:

- **Dry runs first,** for any script that moves, renames, overwrites or deletes.
- **Work on a copy** of important folders until the script has proved itself.
- **Check before overwriting,** with `existsSync`, as the photo script now does.
- **Deleting is permanent.** `fs.rmSync` and `fs.unlinkSync` delete files without using the Recycle Bin or Trash. There's no getting them back.
- **Watch the paths.** A script run from the wrong folder does its work in the wrong folder. Printing `process.cwd()`, the current working directory, at the start of a script is a quick check.

## Your Learner Profile

::: {.ai-profile lesson="files"}
Add rules:

- Before code sends email, changes a calendar, or creates, moves, changes or deletes files, on my computer or in Google Drive, have it show what it would do (a dry run) or test it on one item, unless I ask for the real thing. Check before overwriting a file.

Remove rules:

- Before code sends email, changes a calendar, or creates, changes or deletes files in Google Drive, have it log what it would do (a dry run) or test it on one item, unless I ask for the real thing.

Add to "What I know so far":

- the fs module: readFileSync, writeFileSync, appendFileSync, readdirSync, statSync, existsSync, mkdirSync with recursive, and renameSync to move a file
- the async versions in node:fs/promises
- path.join, and that relative paths depend on the current working directory (process.cwd())
- importing named functions: import { readFileSync } from "node:fs"
- array destructuring, rest (...rest) and spread ([...list])
- string methods: split, trim, toLowerCase, startsWith, endsWith and padStart; and array slice
:::

The dry-run rule now covers files on your own computer, and asks the assistant to check before overwriting, the mistake the photo script almost made.

## Summary

Node's built-in `fs` module reads and writes files, lists folders, looks up file details, and creates, moves and deletes, and `path.join` builds paths that work on any system. Relative paths are relative to the terminal's current working directory. File operations take effect immediately and without undo: `writeFileSync` and `renameSync` replace existing files silently, and deleting skips the Recycle Bin. So work with dry runs, copies and checks such as `existsSync`. Reading a folder of Markdown notes shows that any data stored as text files is open to your code. Along the way, you met array destructuring with `...rest`, spread, and several string methods for taking text apart. Next, you'll work with data files: CSV, JSON and Excel.
