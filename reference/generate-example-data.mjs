import fs from "fs"
// deterministic pseudo-random numbers so the data can be regenerated identically
let seed = 20270315
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648)
const pick = (list) => list[Math.floor(rand() * list.length)]

const people = [
  ["Maya", "Thompson", true, 24], ["Ava", "Lopez", true, 12], ["Ben", "Okafor", false, 4],
  ["Cam", "Nguyen", true, 9.5], ["Dev", "Patel", true, 15], ["Elena", "Rossi", false, 6.5],
  ["Farah", "Haddad", true, 11], ["Gabe", "Martinez", false, 2], ["Hana", "Kim", true, 18.5],
  ["Isaac", "Cohen", true, 7], ["Jordan", "Lee", false, 0], ["Keisha", "Brown", true, 13.5],
]
const members = people.map(([first, last, duesPaid, hours]) => ({
  firstName: first, lastName: last,
  email: `${first}.${last}@example.com`.toLowerCase(),
  duesPaid, volunteerHours: hours,
}))

const beds = [
  ["B1", 32, "full", "north"], ["B2", 32, "full", "north"], ["B3", 48, "full", "south"], ["B4", 48, "partial", "south"],
  ["B5", 64, "full", "south"], ["B6", 64, "partial", "east"], ["B7", 24, "partial", "east"], ["B8", 24, "full", "east"],
].map(([id, sizeSqFt, sun, zone]) => ({ id, name: `Bed ${id.slice(1)}`, sizeSqFt, sun, zone }))

const plantingSpecs = [
  ["B1", "Tomato", "Cherokee Purple", "2027-04-10", 80], ["B1", "Basil", "Genovese", "2027-04-10", 60],
  ["B2", "Lettuce", "Buttercrunch", "2027-03-20", 55], ["B2", "Radish", "French Breakfast", "2027-03-20", 28],
  ["B3", "Zucchini", "Black Beauty", "2027-04-24", 50], ["B3", "Bean", "Blue Lake Bush", "2027-04-24", 58],
  ["B4", "Kale", "Lacinato", "2027-03-27", 60], ["B4", "Spinach", "Bloomsdale", "2027-03-27", 45],
  ["B5", "Tomato", "Sungold", "2027-04-17", 65], ["B5", "Pepper", "California Wonder", "2027-04-17", 75],
  ["B6", "Carrot", "Nantes", "2027-04-03", 70], ["B7", "Mint", "Spearmint", "2027-04-03", 90],
  ["B8", "Cucumber", "Marketmore", "2027-05-01", 60], ["B8", "Squash", "Waltham Butternut", "2027-05-01", 100],
]
const addDays = (iso, days) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10) }
const active = members.filter(m => m.volunteerHours > 0)
const plantings = plantingSpecs.map(([bed, crop, variety, plantedOn, days], i) => ({
  id: `P${String(i + 1).padStart(2, "0")}`, bed, crop, variety, plantedOn,
  expectedHarvest: addDays(plantedOn, days), plantedBy: active[i % active.length].email,
}))

// split each member's hours into shifts of 1, 1.5 or 2 hours on Saturdays in the season
const saturdays = []
for (let d = "2027-03-20"; d <= "2027-09-25"; d = addDays(d, 7)) saturdays.push(d)
const tasks = ["watering", "weeding", "planting", "harvesting", "composting"]
const shifts = []
for (const m of members) {
  let left = m.volunteerHours
  while (left > 0) {
    let h = left <= 2 ? left : pick([1, 1.5, 2])
    if (left - h > 0 && left - h < 1) h = left - 1   // never leave a sliver under an hour
    shifts.push({ date: pick(saturdays), task: pick(tasks), memberEmail: m.email, hours: h })
    left = Math.round((left - h) * 10) / 10
  }
}
shifts.sort((a, b) => a.date.localeCompare(b.date) || a.memberEmail.localeCompare(b.memberEmail))

const harvests = []
for (const p of plantings) {
  const n = 1 + Math.floor(rand() * 3)
  for (let k = 0; k < n; k++) {
    harvests.push({ date: addDays(p.expectedHarvest, k * 7 + Math.floor(rand() * 4)), bed: p.bed, crop: p.crop,
      kg: Math.round((0.4 + rand() * 3.6) * 10) / 10, loggedBy: pick(active).email })
  }
}
harvests.sort((a, b) => a.date.localeCompare(b.date))

const supplies = [
  ["Tomato cages", 18, "each", 10], ["Compost", 6, "bags", 8], ["Mulch", 12, "bags", 5], ["Seed packets", 40, "packets", 15],
  ["Garden gloves", 9, "pairs", 12], ["Hose nozzles", 3, "each", 2], ["Twine", 2, "rolls", 3], ["Trowels", 11, "each", 6],
].map(([item, quantity, unit, reorderAt]) => ({ item, quantity, unit, reorderAt }))

const interests = ["Home Food Growing", "Community Gardening", "Sustainable Living", "Teaching Through Gardening",
  "Nutrition & Wellness", "Houseplant Care", "Organic Gardening", "Hydroponics", "Pest Management",
  "Microgreens & Sprouts", "Vertical Gardening", "Container Gardening", "Composting & Vermiculture",
  "Rainwater Harvesting", "Native Plant Restoration", "Heirloom Seeds", "Pollinator Gardens",
  "Mushroom Cultivation", "Medicinal Herbs", "Farm-to-Table Cooking", "Canning & Preservation",
  "Garden Photography", "Therapeutic Horticulture"]


// sign-ups from the Google Form before the spring kickoff (Google Forms lesson):
// one per member, with 1 to 4 interests. Timestamps are text for now, like the other dates.
// Phone numbers use 555-01xx, which is reserved for fiction.
const signups = members.map((m, i) => {
  const chosen = []
  const n = 1 + Math.floor(rand() * 4)
  while (chosen.length < n) {
    const interest = pick(interests)
    if (!chosen.includes(interest)) chosen.push(interest)
  }
  chosen.sort((a, b) => interests.indexOf(a) - interests.indexOf(b))
  const day = 1 + Math.floor(rand() * 12)
  const hour = 8 + Math.floor(rand() * 13)
  const minute = Math.floor(rand() * 60)
  return {
    timestamp: `2027-03-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    firstName: m.firstName, lastName: m.lastName, email: m.email,
    phone: `555-01${String(10 + i).padStart(2, "0")}`, interests: chosen.join(", "),
  }
})
signups.sort((a, b) => a.timestamp.localeCompare(b.timestamp))


// upcoming shift slots volunteers can sign up for, and the sign-ups so far
// (the servers lessons in Part VII): Saturdays in June 2027, two tasks a day
const slotTasks = [["watering", "08:00", "09:00", 2], ["weeding", "09:00", "11:00", 4], ["harvesting", "09:00", "11:00", 3], ["planting", "09:00", "11:00", 3]]
const slots = []
let slotId = 1
for (const date of ["2027-06-05", "2027-06-12", "2027-06-19", "2027-06-26"]) {
  for (const [task, start, end, capacity] of [slotTasks[0], slotTasks[1 + (slotId % 3)]]) {
    slots.push({ id: slotId, date, task, start, end, capacity })
    slotId++
  }
}
const slotSignups = []
let signupId = 1
for (const slot of slots) {
  const n = Math.floor(rand() * (slot.capacity + 1))
  const chosen = []
  while (chosen.length < n) {
    const m = pick(active)
    if (!chosen.includes(m)) chosen.push(m)
  }
  for (const m of chosen) slotSignups.push({ id: signupId++, slotId: slot.id, memberEmail: m.email })
}

// self-check: shift hours add up to each member's Volunteer Hours
for (const m of members) {
  const total = shifts.filter(s => s.memberEmail === m.email).reduce((a, s) => a + s.hours, 0)
  if (Math.abs(total - m.volunteerHours) > 1e-9) throw new Error(`hours mismatch for ${m.email}: ${total}`)
}
const data = { season: 2027, members, beds, plantings, shifts, harvests, supplies, interests, signups, slots, slotSignups }
fs.writeFileSync(process.argv[2], JSON.stringify(data, null, 2) + "\n")
console.log(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? v.length : v])))
