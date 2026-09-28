// where the browser remembers this member's cancel codes
const STORAGE_KEY = "gardenSignups"

// --- elements on the page ---
const shiftsBody = document.querySelector("#shifts-body")
const shiftSelect = document.querySelector("#shift-select")
const form = document.querySelector("#signup-form")
const emailInput = document.querySelector("#email-input")
const signupMessage = document.querySelector("#signup-message")
const mySignupsList = document.querySelector("#my-signups-list")
const cancelMessage = document.querySelector("#cancel-message")

// --- reading and writing the browser's own storage ---
function loadMySignups() {
  const text = localStorage.getItem(STORAGE_KEY)
  if (text === null) {
    return []
  }
  return JSON.parse(text)
}

function saveMySignups(signups) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signups))
}

// --- getting the shift list from the API ---
async function loadShifts() {
  const response = await fetch("/shifts")
  if (!response.ok) {
    throw new Error("Could not load shifts")
  }
  return response.json()
}

// turns the array of shifts into an object, so we can look one up by id
function shiftsById(shifts) {
  const lookup = {}
  shifts.forEach(shift => {
    lookup[shift.id] = shift
  })
  return lookup
}

// --- building the parts of the page ---
function renderShiftsTable(shifts) {
  shiftsBody.textContent = "" // clear old rows first
  shifts.forEach(shift => {
    const spotsLeft = shift.capacity - shift.spotsFilled
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${shift.date}</td>
      <td>${shift.task}</td>
      <td>${shift.start}–${shift.end}</td>
      <td>${spotsLeft}</td>
    `
    shiftsBody.appendChild(row)
  })
}

function renderShiftOptions(shifts) {
  shiftSelect.textContent = ""
  shifts.forEach(shift => {
    const spotsLeft = shift.capacity - shift.spotsFilled
    const option = document.createElement("option")
    option.value = String(shift.id)
    option.textContent = `${shift.date} ${shift.task} (${spotsLeft} left)`
    if (spotsLeft <= 0) {
      option.disabled = true
    }
    shiftSelect.appendChild(option)
  })
}

function renderMySignups(signups, lookup) {
  mySignupsList.textContent = ""
  if (signups.length === 0) {
    const li = document.createElement("li")
    li.textContent = "No sign-ups saved in this browser yet."
    mySignupsList.appendChild(li)
    return
  }
  signups.forEach(signup => {
    const shift = lookup[signup.slotId]
    const li = document.createElement("li")
    const label = shift === undefined
      ? `Shift #${signup.slotId}`
      : `${shift.date} — ${shift.task} (${shift.start}–${shift.end})`
    li.textContent = label + " "
    const button = document.createElement("button")
    button.textContent = "Cancel"
    button.addEventListener("click", () => cancelSignup(signup))
    li.appendChild(button)
    mySignupsList.appendChild(li)
  })
}

// --- pulling it all together ---
async function refreshPage() {
  const shifts = await loadShifts()
  renderShiftsTable(shifts)
  renderShiftOptions(shifts)
  const lookup = shiftsById(shifts)
  renderMySignups(loadMySignups(), lookup)
}

// --- signing up ---
form.addEventListener("submit", async (event) => {
  event.preventDefault()
  signupMessage.textContent = ""
  const slotId = Number(shiftSelect.value)
  const email = emailInput.value.trim()
  if (email === "") {
    signupMessage.textContent = "Enter an email address"
    return
  }
  const response = await fetch(`/shifts/${slotId}/signups`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email })
  })
  const data = await response.json()
  if (!response.ok) {
    signupMessage.textContent = data.error
    return
  }
  const signups = loadMySignups()
  signups.push({ id: data.id, slotId: data.slotId, cancelCode: data.cancelCode })
  saveMySignups(signups)
  signupMessage.textContent = "Signed up. This browser will remember your cancel code."
  emailInput.value = ""
  await refreshPage()
})

// --- cancelling ---
async function cancelSignup(signup) {
  cancelMessage.textContent = ""
  const response = await fetch(`/signups/${signup.id}`, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ cancelCode: signup.cancelCode })
  })
  if (response.status === 204) {
    const remaining = loadMySignups().filter(s => s.id !== signup.id)
    saveMySignups(remaining)
    await refreshPage()
    return
  }
  const data = await response.json().catch(() => ({}))
  cancelMessage.textContent = data.error ?? "Could not cancel"
}

refreshPage()
