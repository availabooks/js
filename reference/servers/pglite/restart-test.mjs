// starts server.js, runs test-api.js, signs Ava up for shift 6, restarts, checks shift 6
import { spawn, execFileSync } from "node:child_process"
function start() {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["server.js"])
    let log = ""
    const onData = d => { log += d; process.stdout.write("[server] " + d); if (log.includes("running")) resolve(child) }
    child.stdout.on("data", onData); child.stderr.on("data", onData)
    child.on("exit", code => reject(new Error("server exited " + code + "\n" + log)))
  })
}
const stop = child => new Promise(r => { child.removeAllListeners("exit"); child.on("exit", r); child.kill() })
let server = await start()
console.log(execFileSync("node", ["test-api.js"]).toString())
await fetch("http://localhost:3000/shifts/6/signups", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: "ava.lopez@example.com" }) }).then(r => r.text()).then(t => console.log("signup before restart:", t))
await stop(server)
server = await start()
console.log("after restart:", await (await fetch("http://localhost:3000/shifts/6")).text())
await stop(server)
