#!/usr/bin/env node
// Captures real AI replies for the book's conversation blocks (see AUTHORING.md,
// "Capturing replies"). Sends a conversation to Claude (the book's assistant) and
// saves the full exchange in transcripts/<lesson>/<name>.json.
//
//   node tools/capture.mjs --list-models
//   node tools/capture.mjs --lesson ai-assistant --name sum-1-to-10 --profile none --turn "Write JavaScript that..."
//   node tools/capture.mjs --lesson ai-assistant --name sum-1-to-10 --continue --turn "Try again. Use only what I know."
//
// --profile <lesson-id|none>  sends reference/profiles/<lesson-id>.txt as the first message, as a reader would paste it
// --profile here              sends the profile a reader has at this conversation's block in the lesson (the first
//                             ::: {.ai-conversation} with transcript="<lesson>/<name>"), from skills.yaml and the tags before it
// --turn <text>               a message to send; repeat for several turns
// --continue                  add turns to the latest attempt instead of starting a new attempt
// --model <id>                override the default model (a gemini-* id uses the Gemini API)
//
// Keys are read from private/anthropic.key (or private/gemini.key for Gemini
// models), which git ignores. They are never printed. For Claude, the
// ANTHROPIC_API_KEY environment variable also works.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import crypto from "node:crypto"
import Anthropic from "@anthropic-ai/sdk"

// pinned so every reply in the book comes from the same model; Sonnet is the
// model family the free Claude app uses
const DEFAULT_MODEL = "claude-sonnet-5"
const MAX_ATTEMPTS = 3
const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta"

const bookDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const isGemini = model => model.startsWith("gemini")
const assistantName = model => isGemini(model) ? "Gemini" : "Claude"

function readKey(fileName, label) {
  const keyFile = path.join(bookDir, "private", fileName)
  if (!fs.existsSync(keyFile)) return null
  const key = fs.readFileSync(keyFile, "utf8").split(/\r?\n/).map(line => line.trim())
    .find(line => line && !line.startsWith("#"))
  if (!key || key.startsWith("PASTE-")) fail(`Put your ${label} API key in ${keyFile} (replace the placeholder line).`)
  return key
}

function parseArgs(argv) {
  const args = { turns: [] }
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i]
    if (flag === "--turn") args.turns.push(argv[++i])
    else if (flag === "--continue") args.continue = true
    else if (flag === "--list-models") args.listModels = true
    else if (["--lesson", "--name", "--profile", "--model"].includes(flag)) args[flag.slice(2)] = argv[++i]
    else fail(`Unknown argument: ${flag}`)
  }
  return args
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

// ---- Claude ----

let anthropic
function claudeClient() {
  if (!anthropic) {
    const apiKey = readKey("anthropic.key", "Anthropic") || process.env.ANTHROPIC_API_KEY
    if (!apiKey) fail(`No Anthropic key. Put it in ${path.join(bookDir, "private", "anthropic.key")}.`)
    // the SDK retries busy (529) and rate-limit (429) errors itself
    anthropic = new Anthropic({ apiKey, maxRetries: 4 })
  }
  return anthropic
}

async function sendClaude(model, messages, text) {
  const history = [...messages, { role: "user", text }]
    .map(message => ({ role: message.role === "user" ? "user" : "assistant", content: message.text }))
  let response
  try {
    // no system prompt: the reader's conversation starts with their learner profile.
    // Streamed with a high limit, because the model's thinking also counts toward max_tokens
    // and a long reply could otherwise be cut off (the app doesn't cut replies this short).
    response = await claudeClient().messages.stream({ model, max_tokens: 64000, messages: history }).finalMessage()
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) fail("Claude rejected the API key (401). Check private/anthropic.key.")
    if (error instanceof Anthropic.NotFoundError) fail(`Claude API: model ${model} not found or not available to this key.`)
    if (error instanceof Anthropic.RateLimitError) fail(`Claude rate limit reached: ${error.message}`)
    if (error instanceof Anthropic.APIError) fail(`Claude API error ${error.status}: ${error.message}`)
    throw error
  }
  if (response.stop_reason === "refusal") fail("Claude declined this request (stop reason: refusal).")
  const reply = response.content.filter(block => block.type === "text").map(block => block.text).join("")
  if (!reply) fail(`No reply text (stop reason: ${response.stop_reason}).`)
  return { reply, finishReason: response.stop_reason, modelVersion: response.model }
}

// ---- Gemini (the book's earlier assistant; kept for comparison captures) ----

async function callGemini(url, body) {
  const key = readKey("gemini.key", "Gemini")
  if (!key) fail(`No Gemini key at ${path.join(bookDir, "private", "gemini.key")}.`)
  const waits = [5, 15, 30, 60]
  for (let retry = 0; ; retry++) {
    const response = await fetch(url, {
      method: body ? "POST" : "GET",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    })
    const json = await response.json().catch(() => ({}))
    if (response.ok) return json
    const message = json.error?.message || response.statusText
    if (response.status === 429 && /quota/i.test(message)) fail(`Gemini quota used up: ${message.split("\n")[0]}`)
    if ([429, 503].includes(response.status) && retry < waits.length) {
      console.warn(`Gemini is busy (${response.status}); retrying in ${waits[retry]} seconds...`)
      await new Promise(resolve => setTimeout(resolve, waits[retry] * 1000))
      continue
    }
    fail(`Gemini API error ${response.status}: ${message}`)
  }
}

async function sendGemini(model, messages, text) {
  const contents = [...messages, { role: "user", text }]
    .map(message => ({ role: message.role === "user" ? "user" : "model", parts: [{ text: message.text }] }))
  const json = await callGemini(`${GEMINI_API}/models/${model}:generateContent`, { contents })
  const candidate = json.candidates?.[0]
  const reply = (candidate?.content?.parts || []).filter(part => !part.thought).map(part => part.text || "").join("")
  if (!reply) fail(`No reply text (finish reason: ${candidate?.finishReason || "unknown"}).`)
  return { reply, finishReason: candidate.finishReason, modelVersion: json.modelVersion || model }
}

// ---- shared ----

async function listModels() {
  for await (const model of claudeClient().models.list()) console.log(`${model.id}  (${model.display_name})`)
}

// sends one user message with the conversation so far and returns the reply
function send(model, messages, text) {
  return isGemini(model) ? sendGemini(model, messages, text) : sendClaude(model, messages, text)
}

// The opening exchange of a chat that starts with a learner profile: the profile
// and the assistant's real reply to it. The reply is captured once per profile and
// model, saved in transcripts/_profile-replies/, and reused so each capture spends
// one request instead of two. It is recaptured whenever the profile text changes.
async function profileOpening(model, profile, profileText) {
  const cacheFile = path.join(bookDir, "transcripts", "_profile-replies", `${profile}.json`)
  if (fs.existsSync(cacheFile)) {
    const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"))
    if (cached.model === model && cached.profileText === profileText) {
      return [{ role: "user", text: profileText, isProfile: true },
        { role: "assistant", text: cached.reply, modelVersion: cached.modelVersion, reusedFrom: cached.captured }]
    }
  }
  const result = await send(model, [], profileText)
  const cached = { profile, model, captured: new Date().toISOString(), profileText, reply: result.reply, modelVersion: result.modelVersion }
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true })
  fs.writeFileSync(cacheFile, JSON.stringify(cached, null, 2) + "\n")
  return [{ role: "user", text: profileText, isProfile: true },
    { role: "assistant", text: result.reply, modelVersion: result.modelVersion }]
}

// The learner profile at a conversation block: skills taught in earlier lessons
// (alpha order) plus the lesson's tags that close before the block starts.
function profileHere(lesson, name) {
  const require = createRequire(import.meta.url)
  const repoRoot = path.resolve(bookDir, "..", "..")
  const { loadSkills, taughtInFromMarkdown } = require(path.join(repoRoot, "tools", "author-tools", "skills.js"))
  const { sourceBaseForChapterId } = require(path.join(repoRoot, "tools", "author-tools", "book.js"))
  const { profileText, idsBeforeChapter } = require(path.join(repoRoot, "tools", "system-files", "dev", "learner-profile.js"))
  const skills = loadSkills(bookDir)
  if (!skills) fail("--profile here needs a skills.yaml.")
  const config = JSON.parse(fs.readFileSync(path.join(bookDir, "config.json"), "utf8"))
  const chapters = config.versions.alpha.chapters
  const index = chapters.findIndex(chapter => chapter.id === lesson)
  if (index < 0) fail(`No lesson ${lesson} in the alpha version.`)
  const { taughtIn, tagsByChapter } = taughtInFromMarkdown(bookDir, skills.catalog, chapters, id => sourceBaseForChapterId(bookDir, id))
  const file = path.join(bookDir, "chapters", `${sourceBaseForChapterId(bookDir, lesson)}.md`)
  const lines = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n")
  const blockLine = lines.findIndex(line => /^:{3,}\s*\{[^}]*\.ai-conversation\b/.test(line) && line.includes(`transcript="${lesson}/${name}"`))
  if (blockLine < 0) fail(`No ai-conversation block with transcript="${lesson}/${name}" in ${path.relative(bookDir, file)}. Add the block first.`)
  const data = { ...skills.catalog, taughtIn }
  const ids = new Set(idsBeforeChapter(data, index))
  for (const tag of tagsByChapter[lesson]) {
    if (tag.line < blockLine && taughtIn[tag.id] === index) ids.add(tag.id)
  }
  return profileText(data, ids)
}

async function capture(args) {
  if (!args.lesson || !args.name) fail("--lesson and --name are required.")
  if (args.turns.length === 0) fail("Give at least one --turn.")
  const model = args.model || DEFAULT_MODEL
  const file = path.join(bookDir, "transcripts", args.lesson, `${args.name}.json`)
  let record = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null
  // a capture from a different assistant starts a new record; the old one is kept beside it
  if (record && record.assistant !== assistantName(model) && !args.continue) {
    const old = file.replace(/\.json$/, `.${record.assistant.toLowerCase()}.json`)
    fs.renameSync(file, old)
    console.warn(`Moved the earlier ${record.assistant} transcript to ${path.relative(bookDir, old)}`)
    record = null
  }
  record ||= { lesson: args.lesson, name: args.name, assistant: assistantName(model), attempts: [] }

  let attempt
  if (args.continue) {
    attempt = record.attempts.at(-1)
    if (!attempt) fail(`Nothing to continue in ${file}.`)
  } else {
    if (record.attempts.length >= MAX_ATTEMPTS) {
      console.warn(`Note: this is attempt ${record.attempts.length + 1}. The book's policy is about ${MAX_ATTEMPTS} at most; consider changing the example instead.`)
    }
    const profile = args.profile || "none"
    attempt = { profile, model, captured: new Date().toISOString(), messages: [] }
    record.attempts.push(attempt)
    if (profile === "here") {
      const profileText = profileHere(args.lesson, args.name)
      // cached by the text itself, since many blocks share the same profile
      const cacheName = `here-${crypto.createHash("sha1").update(profileText).digest("hex").slice(0, 12)}`
      attempt.messages.push(...await profileOpening(attempt.model, cacheName, profileText))
    } else if (profile !== "none") {
      const profileFile = path.join(bookDir, "reference", "profiles", `${profile}.txt`)
      if (!fs.existsSync(profileFile)) fail(`No profile file at ${profileFile}.`)
      // normalize line endings so a Windows (CRLF) copy of the file sends the same text
      const profileText = fs.readFileSync(profileFile, "utf8").replace(/\r\n/g, "\n").trim()
      attempt.messages.push(...await profileOpening(attempt.model, profile, profileText))
    }
  }

  for (const text of args.turns) {
    const result = await send(attempt.model, attempt.messages, text)
    attempt.messages.push({ role: "user", text },
      { role: "assistant", text: result.reply, modelVersion: result.modelVersion, finishReason: result.finishReason })
    console.log(`\n=== YOU ===\n${text}\n\n=== ${record.assistant.toUpperCase()} (${result.modelVersion}) ===\n${result.reply}`)
  }

  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(record, null, 2) + "\n")
  console.log(`\nSaved attempt ${record.attempts.length} to ${path.relative(bookDir, file)}`)
}

const args = parseArgs(process.argv.slice(2))
if (args.listModels) await listModels()
else await capture(args)
