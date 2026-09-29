#!/usr/bin/env node
// One-time move from the old ::: {.ai-profile} blocks to skills.yaml (see
// tools/author-tools/skills.js). Reads every lesson's block in alpha order and
// writes skills.yaml with a random id for each environment, rule and "What I
// know so far" item. Each old block becomes a ::: {.learner-profile} box that
// carries that lesson's skill ids, so the profiles come out as before; the ids
// are then moved onto the paragraphs that teach each skill.
//
//   node tools/migrate-skills.mjs [--dry-run]

import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const bookDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const repoRoot = path.resolve(bookDir, "..", "..")
const toolsDir = path.join(repoRoot, "tools", "author-tools")
const { SKILLS_FILE, classesInRepo, newSkillIds } = require(path.join(toolsDir, "skills.js"))
const { sourceBaseForChapterId } = require(path.join(toolsDir, "book.js"))
const yaml = require(path.join(toolsDir, "node_modules", "js-yaml"))

const dryRun = process.argv.includes("--dry-run")
const configFile = path.join(bookDir, "config.json")
const configText = fs.readFileSync(configFile, "utf8")
const config = JSON.parse(configText)
const template = config.learnerProfile
if (!template) {
  console.error("config.json has no learnerProfile; nothing to migrate.")
  process.exit(1)
}
if (fs.existsSync(path.join(bookDir, SKILLS_FILE)) && !dryRun) {
  console.error(`${SKILLS_FILE} already exists; not overwriting it.`)
  process.exit(1)
}

const BLOCK_OPEN = /^:{3,}\s*\{[^}]*\.ai-profile\b[^}]*\}\s*$/

// the old parser, from tools/author-tools/learnerProfile.js
function profileChangesFromMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  let changes = null
  let inBlock = false
  let list = null
  for (const line of lines) {
    if (!inBlock) {
      if (BLOCK_OPEN.test(line)) {
        inBlock = true
        list = null
        changes = changes || { environment: "", rulesAdd: [], rulesRemove: [], knowsAdd: [] }
      }
      continue
    }
    if (/^:{3,}\s*$/.test(line)) {
      inBlock = false
      continue
    }
    const text = line.trim()
    let match
    if ((match = /^environment:\s*(.+)$/i.exec(text))) {
      changes.environment = match[1].trim()
      list = null
    } else if (/^add rules:?$/i.test(text)) {
      list = changes.rulesAdd
    } else if (/^remove rules:?$/i.test(text)) {
      list = changes.rulesRemove
    } else if (/^add to "?what i know so far"?:?$/i.test(text)) {
      list = changes.knowsAdd
    } else if ((match = /^[-*]\s+(.+)$/.exec(text)) && list) {
      list.push(match[1].trim())
    }
  }
  return changes
}

const chapters = config.versions.alpha.chapters
const taken = classesInRepo(repoRoot)
const skills = []
const activeRuleIds = new Map() // rule text -> id of the rule now on
const perChapter = []
const newId = () => {
  const [id] = newSkillIds(taken, 1)
  taken.add(id)
  return id
}

for (const chapter of chapters) {
  const file = path.join(bookDir, "chapters", `${sourceBaseForChapterId(bookDir, chapter.id)}.md`)
  const markdown = fs.readFileSync(file, "utf8")
  const changes = profileChangesFromMarkdown(markdown)
  if (!changes) continue
  const added = []
  const add = (type, text) => {
    const skill = { id: newId(), ...(type === "know" ? {} : { type }), text, chapter: chapter.id }
    skills.push(skill)
    added.push(skill)
    return skill
  }
  if (changes.environment) add("environment", changes.environment)
  const removed = changes.rulesRemove.map((text) => {
    const id = activeRuleIds.get(text)
    if (!id) console.warn(`${chapter.id}: removes a rule that isn't on: ${text}`)
    activeRuleIds.delete(text)
    return id
  }).filter(Boolean)
  const newRules = changes.rulesAdd.map((text) => {
    const skill = add("rule", text)
    activeRuleIds.set(text, skill.id)
    return skill
  })
  for (const text of changes.knowsAdd) add("know", text)
  // each removed rule comes off when the lesson's matching new rule is
  // learned (the first with the first, and so on), or its first skill
  removed.forEach((id, index) => {
    const by = newRules[index] || newRules[newRules.length - 1] || added[0]
    by.replaces = [...(by.replaces || []), id]
  })
  perChapter.push({ chapter, file, markdown, added })
}

// skills.yaml, grouped by the lesson that teaches each skill
const header = {
  intro: template.intro,
  noConceptsYet: template.noConceptsYet,
  rulesHeading: template.rulesHeading,
  knowsHeading: template.knowsHeading,
  knowsNone: template.knowsNone,
}
const dump = (value) => yaml.dump(value, { lineWidth: -1 }).trimEnd()
let out = `# Learner skills for this book: see tools/author-tools/skills.js.
# Each skill's id is also the class that tags the paragraph teaching it,
# as in ::: {.${skills[0].id}}. Make new ids with: node tools/new-skill-id.mjs js [count]
# The order here is the order of lines in the profile.

${dump(header)}

skills:
`
for (const { chapter, added } of perChapter) {
  out += `\n  # ${chapter.id}\n`
  for (const skill of added) {
    const { chapter: _, ...entry } = skill
    out += dump([entry]).replace(/^/gm, "  ") + "\n"
  }
}

// each ai-profile block becomes a learner-profile box carrying its skill ids
const edits = perChapter.map(({ chapter, file, markdown, added }) => {
  const eol = markdown.includes("\r\n") ? "\r\n" : "\n"
  const lines = markdown.split(/\r?\n/)
  const result = []
  let inBlock = false
  let first = true
  for (const line of lines) {
    if (!inBlock && BLOCK_OPEN.test(line)) {
      inBlock = true
      if (first) {
        result.push(`::: {.learner-profile ${added.map((skill) => `.${skill.id}`).join(" ")}}`, ":::")
        first = false
      } else {
        result.push("::: {.learner-profile}", ":::")
      }
      continue
    }
    if (inBlock) {
      if (/^:{3,}\s*$/.test(line)) inBlock = false
      continue
    }
    result.push(line)
  }
  return { chapter, file, text: result.join(eol), added }
})

delete config.learnerProfile
const newConfig = JSON.stringify(config, null, 2) + (configText.endsWith("\n") ? "\n" : "")

for (const { chapter, added } of edits) {
  console.log(`\n${chapter.id}`)
  for (const skill of added) {
    console.log(`  .${skill.id}  ${skill.type || "know"}${skill.replaces ? ` (replaces ${skill.replaces.join(" ")})` : ""}: ${skill.text}`)
  }
}

if (dryRun) {
  console.log(`\n(dry run: ${skills.length} skills; nothing written)`)
} else {
  fs.writeFileSync(path.join(bookDir, SKILLS_FILE), out)
  for (const { file, text } of edits) fs.writeFileSync(file, text)
  fs.writeFileSync(configFile, newConfig)
  console.log(`\nWrote ${SKILLS_FILE} (${skills.length} skills), ${edits.length} lessons and config.json.`)
}
