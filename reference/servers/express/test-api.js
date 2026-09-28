// Sends test requests to the sign-up API and prints what comes back.
// Start the server first, in another terminal.
const BASE = "http://localhost:3000"

async function show(method, path, body) {
  const options = { method, headers: { "content-type": "application/json" } }
  if (body !== undefined) {
    options.body = JSON.stringify(body)
  }
  const response = await fetch(BASE + path, options)
  const text = await response.text()
  console.log(`${method} ${path} -> ${response.status} ${text}`)
}

await show("GET", "/shifts/6")
await show("POST", "/shifts/6/signups", { email: "Ava.Lopez@example.com" })
await show("POST", "/shifts/6/signups", { email: "ava.lopez@example.com" })
await show("POST", "/shifts/1/signups", { email: "ben.okafor@example.com" })
await show("POST", "/shifts/2/signups", { email: "nobody@example.com" })
await show("POST", "/shifts/2/signups", {})
await show("POST", "/shifts/99/signups", { email: "ava.lopez@example.com" })
await show("DELETE", "/signups/13")
await show("DELETE", "/signups/13")
