// Sends test requests to the Worker and prints what comes back.
// Start it first, in another terminal, with: npx wrangler dev
const BASE = "http://127.0.0.1:8787"

async function show(method, path, body) {
  const options = { method, headers: { "content-type": "application/json" } }
  if (body !== undefined) {
    options.body = JSON.stringify(body)
  }
  const response = await fetch(BASE + path, options)
  const text = await response.text()
  console.log(`${method} ${path} -> ${response.status} ${text}`)
  return text === "" ? null : JSON.parse(text)
}

await show("GET", "/shifts/6")
const signup = await show("POST", "/shifts/6/signups", { email: "Ava.Lopez@example.com" })
await show("POST", "/shifts/6/signups", { email: "ava.lopez@example.com" })
await show("POST", "/shifts/1/signups", { email: "ben.okafor@example.com" })
await show("POST", "/shifts/2/signups", { email: "nobody@example.com" })
await show("DELETE", `/signups/${signup.id}`, { cancelCode: "a-guess" })
await show("DELETE", `/signups/${signup.id}`, { cancelCode: signup.cancelCode })
await show("GET", "/shifts/6")
