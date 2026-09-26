#!/usr/bin/env node
// Captures real AI replies for the book's conversation blocks (see AUTHORING.md,
// "Capturing replies"). Sends a conversation to the Gemini API and saves the
// full exchange in transcripts/<lesson>/<name>.json.
//
//   node tools/capture.mjs --list-models
//   node tools/capture.mjs --lesson ai-assistant --name sum-1-to-10 --profile none --turn "Write JavaScript that..."
//   node tools/capture.mjs --lesson ai-assistant --name sum-1-to-10 --continue --turn "Try again. Use only what I know."
//
// --profile <lesson-id|none>  sends reference/profiles/<lesson-id>.txt as the first message, as a reader would paste it
// --turn <text>               a message to send; repeat for several turns
// --continue                  add turns to the latest attempt instead of starting a new attempt
// --model <id>                override the default model
//
// The API key is read from private/gemini.key (ignored by git). It is never printed.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const DEFAULT_MODEL = "gemini-3.8-flash"
const MAX_ATTEMPTS = 3
const API = "https://generativelanguage.googleapis.com/v1beta"

const bookDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function readKey() {
  const keyFile = path.join(bookDir, "private", "gemini.key")
  if (!fs.existsSync(keyFile)) fail(`No key file at ${keyFile}.`)
  const key = fs.readFileSync(keyFile, "utf8").split(/\r?\n/).map(line => line.trim())
    .find(line => line && !line.startsWith("#"))
  if (!key || key.startsWith("PASTE-")) fail(`Put your Gemini API key in ${keyFile} (replace the placeholder line).`)
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

async function callApi(key, url, body) {
  // busy (503) and rate-limit (429) errors are usually temporary, so wait and retry
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
    // an exhausted quota won't recover in a few seconds, so don't spend more requests on it
    if (response.status === 429 && /quota/i.test(message)) {
      const detail = (message.match(/\* Quota exceeded[^\n]*/) || [""])[0]
      fail(`Gemini quota used up: ${message.split("\n")[0]}\n${detail}`)
    }
    if ([429, 503].includes(response.status) && retry < waits.length) {
      console.warn(`Gemini is busy (${response.status}); retrying in ${waits[retry]} seconds...`)
      await new Promise(resolve => setTimeout(resolve, waits[retry] * 1000))
      continue
    }
    fail(`Gemini API error ${response.status}: ${message}`)
  }
}

async function listModels(key) {
  const json = await callApi(key, `${API}/models?pageSize=1000`)
  for (const model of json.models || []) {
    if ((model.supportedGenerationMethods || []).includes("generateContent")) {
      console.log(`${model.name.replace("models/", "")}  (${model.displayName})`)
    }
  }
}

// sends one user message with the conversation so far and returns the reply
async function send(key, model, messages, text) {
  const contents = [...messages, { role: "user", text }]
    .map(message => ({ role: message.role, parts: [{ text: message.text }] }))
  const json = await callApi(key, `${API}/models/${model}:generateContent`, { contents })
  const candidate = json.candidates?.[0]
  const reply = (candidate?.content?.parts || []).filter(part => !part.thought).map(part => part.text || "").join("")
  if (!reply) fail(`No reply text (finish reason: ${candidate?.finishReason || "unknown"}).`)
  return { reply, finishReason: candidate.finishReason, modelVersion: json.modelVersion || model }
}

// The opening exchange of a chat that starts with a learner profile: the profile
// and Gemini's real reply to it. The reply is captured once per profile and model,
// saved in transcripts/_profile-replies/, and reused so each capture spends one
// request instead of two. It is recaptured whenever the profile text changes.
async function profileOpening(key, model, profile, profileText) {
  const cacheFile = path.join(bookDir, "transcripts", "_profile-replies", `${profile}.json`)
  if (fs.existsSync(cacheFile)) {
    const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"))
    if (cached.model === model && cached.profileText === profileText) {
      return [{ role: "user", text: profileText, isProfile: true },
        { role: "model", text: cached.reply, modelVersion: cached.modelVersion, reusedFrom: cached.captured }]
    }
  }
  const result = await send(key, model, [], profileText)
  const cached = { profile, model, captured: new Date().toISOString(), profileText, reply: result.reply, modelVersion: result.modelVersion }
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true })
  fs.writeFileSync(cacheFile, JSON.stringify(cached, null, 2) + "\n")
  return [{ role: "user", text: profileText, isProfile: true },
    { role: "model", text: result.reply, modelVersion: result.modelVersion }]
}

async function capture(key, args) {
  if (!args.lesson || !args.name) fail("--lesson and --name are required.")
  if (args.turns.length === 0) fail("Give at least one --turn.")
  const file = path.join(bookDir, "transcripts", args.lesson, `${args.name}.json`)
  const record = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, "utf8"))
    : { lesson: args.lesson, name: args.name, assistant: "Gemini", attempts: [] }

  let attempt
  if (args.continue) {
    attempt = record.attempts.at(-1)
    if (!attempt) fail(`Nothing to continue in ${file}.`)
  } else {
    if (record.attempts.length >= MAX_ATTEMPTS) {
      console.warn(`Note: this is attempt ${record.attempts.length + 1}. The book's policy is about ${MAX_ATTEMPTS} at most; consider changing the example instead.`)
    }
    const profile = args.profile || "none"
    attempt = { profile, model: args.model || DEFAULT_MODEL, captured: new Date().toISOString(), messages: [] }
    record.attempts.push(attempt)
    if (profile !== "none") {
      const profileFile = path.join(bookDir, "reference", "profiles", `${profile}.txt`)
      if (!fs.existsSync(profileFile)) fail(`No profile file at ${profileFile}.`)
      // normalize line endings so a Windows (CRLF) copy of the file sends the same text
      const profileText = fs.readFileSync(profileFile, "utf8").replace(/\r\n/g, "\n").trim()
      attempt.messages.push(...await profileOpening(key, attempt.model, profile, profileText))
    }
  }

  for (const text of args.turns) {
    const result = await send(key, attempt.model, attempt.messages, text)
    attempt.messages.push({ role: "user", text },
      { role: "model", text: result.reply, modelVersion: result.modelVersion, finishReason: result.finishReason })
    console.log(`\n=== YOU ===\n${text}\n\n=== GEMINI (${result.modelVersion}) ===\n${result.reply}`)
  }

  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(record, null, 2) + "\n")
  console.log(`\nSaved attempt ${record.attempts.length} to ${path.relative(bookDir, file)}`)
}

const args = parseArgs(process.argv.slice(2))
const key = readKey()
if (args.listModels) await listModels(key)
else await capture(key, args)
