#!/usr/bin/env node
// Writes reference/profiles/<lesson-id>.txt, the learner profile at the end of
// each lesson that changes it, from the lessons' ai-profile blocks and the
// learnerProfile template in config.json. These are the files capture.mjs sends,
// so they always match the profiles readers see in the book (which the build
// generates the same way, in tools/author-tools/learnerProfile.js).
//
//   node tools/build-profiles.mjs [version]     (default: alpha)

import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const bookDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const toolsDir = path.resolve(bookDir, "..", "..", "tools", "author-tools")
const { learnerProfilesForVersion } = require(path.join(toolsDir, "learnerProfile.js"))
const { sourceBaseForChapterId } = require(path.join(toolsDir, "book.js"))

const version = process.argv[2] || "alpha"
const config = JSON.parse(fs.readFileSync(path.join(bookDir, "config.json"), "utf8"))
const chapters = config.versions[version]?.chapters
if (!chapters) {
  console.error(`No version named ${version} in config.json.`)
  process.exit(1)
}

const profiles = learnerProfilesForVersion(bookDir, config, chapters, (id) => sourceBaseForChapterId(bookDir, id))
const outDir = path.join(bookDir, "reference", "profiles")
fs.mkdirSync(outDir, { recursive: true })
for (const [id, profile] of Object.entries(profiles)) {
  if (!profile.changed) continue
  const file = path.join(outDir, `${id}.txt`)
  const text = profile.after + "\n"
  const old = fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null
  if (old === text) {
    console.log(`${id}: unchanged`)
  } else {
    fs.writeFileSync(file, text)
    console.log(`${id}: ${old === null ? "created" : "updated"}`)
  }
}
