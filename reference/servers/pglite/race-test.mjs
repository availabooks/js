// sends sign-ups at the same moment, to show what happens when requests overlap
import { spawn } from "node:child_process"
const child = spawn("node", ["server.js"])
await new Promise(r => child.stdout.on("data", d => { if (String(d).includes("running")) r() }))
const post = (id, email) => fetch(`http://localhost:3000/shifts/${id}/signups`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) })
  .then(async r => `${email} -> ${r.status} ${await r.text()}`)
console.log("same member five times at once:")
console.log((await Promise.all([1, 2, 3, 4, 5].map(() => post(6, "ava.lopez@example.com")))).join("\n"))
console.log("three members at once:")
console.log((await Promise.all([post(6, "dev.patel@example.com"), post(6, "elena.rossi@example.com"), post(6, "hana.kim@example.com")])).join("\n"))
console.log(await (await fetch("http://localhost:3000/shifts/6")).text())
child.kill()
