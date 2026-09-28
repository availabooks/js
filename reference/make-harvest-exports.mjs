// Writes reference/data/harvests-*.csv: the season's harvests split into three
// exports with different column names, orders and date formats, for the
// "Working with Data Files" lesson. No new data: every row comes from example-data.json.
//   node reference/make-harvest-exports.mjs
import fs from "node:fs"
const d = JSON.parse(fs.readFileSync(new URL("./example-data.json", import.meta.url), "utf8"))
const h = d.harvests
const spring = h.filter(x => x.date < "2027-06-01")
const june = h.filter(x => x.date >= "2027-06-01" && x.date < "2027-07-01")
const summer = h.filter(x => x.date >= "2027-07-01")
const usDate = s => { const [y, m, day] = s.split("-"); return `${Number(m)}/${Number(day)}/${y}` }
const out = name => new URL(`./data/${name}`, import.meta.url)
fs.writeFileSync(out("harvests-spring.csv"), "Date,Bed,Crop,Kg,Logged By\n" + spring.map(x => [x.date, x.bed, x.crop, x.kg, x.loggedBy].join(",")).join("\n") + "\n")
fs.writeFileSync(out("harvests-june.csv"), "Crop,Bed,Weight (kg),Date,Volunteer\n" + june.map(x => [x.crop, x.bed, x.kg, usDate(x.date), x.loggedBy].join(",")).join("\n") + "\n")
fs.writeFileSync(out("harvests-summer.csv"), "date,bed_id,crop,kilograms,logged_by\n" + summer.map(x => [x.date, x.bed, x.crop, x.kg, x.loggedBy].join(",")).join("\n") + "\n\n")
console.log(spring.length, june.length, summer.length)
