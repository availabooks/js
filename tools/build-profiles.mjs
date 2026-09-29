#!/usr/bin/env node
// Writes reference/profiles/<lesson-id>.txt, the learner profile at the end of
// each lesson that teaches a skill, from skills.yaml and the skill tags in the
// lessons, with nothing marked as already known. These are the files
// capture.mjs sends, so they match the profiles readers see at the end of each
// lesson (built the same way, by tools/system-files/dev/learner-profile.js).
//
//   node tools/build-profiles.mjs [version]     (default: alpha)

import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const bookDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = path.resolve(bookDir, "..", "..")
const { loadSkills, taughtInFromMarkdown } = require(path.join(repoRoot, "tools", "author-tools", "skills.js"))
const { sourceBaseForChapterId } = require(path.join(repoRoot, "tools", "author-tools", "book.js"))
const { profileText, idsBeforeChapter } = require(path.join(repoRoot, "tools", "system-files", "dev", "learner-profile.js"))

const version = process.argv[2] || "alpha"
const config = JSON.parse(fs.readFileSync(path.join(bookDir, "config.json"), "utf8"))
const chapters = config.versions[version]?.chapters
if (!chapters) {
  console.error(`No version named ${version} in config.json.`)
  process.exit(1)
}
const skills = loadSkills(bookDir)
if (!skills) {
  console.error("No skills.yaml in this book.")
  process.exit(1)
}
if (skills.errors.length > 0) {
  console.error(`skills.yaml has problems:\n  ${skills.errors.join("\n  ")}`)
  process.exit(1)
}

const { taughtIn } = taughtInFromMarkdown(bookDir, skills.catalog, chapters, (id) => sourceBaseForChapterId(bookDir, id))
const data = { ...skills.catalog, taughtIn }
const outDir = path.join(bookDir, "reference", "profiles")
fs.mkdirSync(outDir, { recursive: true })
chapters.forEach((chapter, index) => {
  if (!Object.values(taughtIn).includes(index)) return
  const file = path.join(outDir, `${chapter.id}.txt`)
  const text = profileText(data, idsBeforeChapter(data, index, true)) + "\n"
  const old = fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null
  if (old === text) {
    console.log(`${chapter.id}: unchanged`)
  } else {
    fs.writeFileSync(file, text)
    console.log(`${chapter.id}: ${old === null ? "created" : "updated"}`)
  }
})
