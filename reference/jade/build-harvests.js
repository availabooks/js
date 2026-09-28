async function buildHarvestsSheet(excel) {
  const data = [
    ["Date", "Bed ID", "Crop", "Kilograms", "Logged By"],
    ["2027-04-18", "B2", "Radish", 1.2, "elena.rossi@example.com"],
    ["2027-05-13", "B4", "Spinach", 2.4, "ben.okafor@example.com"],
    ["2027-05-15", "B2", "Lettuce", 3.9, "hana.kim@example.com"],
    ["2027-05-21", "B2", "Lettuce", 2.5, "dev.patel@example.com"],
    ["2027-05-21", "B4", "Spinach", 0.6, "gabe.martinez@example.com"],
    ["2027-05-28", "B4", "Kale", 2.2, "isaac.cohen@example.com"],
    ["2027-05-31", "B2", "Lettuce", 2.4, "gabe.martinez@example.com"],
    ["2027-06-05", "B4", "Kale", 0.6, "keisha.brown@example.com"],
    ["2027-06-09", "B1", "Basil", 2, "gabe.martinez@example.com"],
    ["2027-06-11", "B4", "Kale", 1.8, "dev.patel@example.com"],
    ["2027-06-13", "B3", "Zucchini", 0.5, "elena.rossi@example.com"],
    ["2027-06-13", "B6", "Carrot", 1.3, "gabe.martinez@example.com"],
    ["2027-06-18", "B1", "Basil", 1.3, "cam.nguyen@example.com"],
    ["2027-06-21", "B3", "Zucchini", 3.2, "dev.patel@example.com"],
    ["2027-06-22", "B3", "Bean", 2.6, "elena.rossi@example.com"],
    ["2027-06-24", "B5", "Tomato", 3.1, "ben.okafor@example.com"],
    ["2027-06-29", "B3", "Bean", 3.8, "dev.patel@example.com"],
    ["2027-06-30", "B3", "Zucchini", 0.6, "maya.thompson@example.com"],
    ["2027-07-01", "B1", "Tomato", 2.6, "dev.patel@example.com"],
    ["2027-07-01", "B5", "Tomato", 0.9, "ava.lopez@example.com"],
    ["2027-07-01", "B8", "Cucumber", 2.6, "isaac.cohen@example.com"],
    ["2027-07-03", "B5", "Pepper", 2, "elena.rossi@example.com"],
    ["2027-07-05", "B7", "Mint", 3.6, "farah.haddad@example.com"],
    ["2027-07-07", "B3", "Bean", 3.7, "hana.kim@example.com"],
    ["2027-07-08", "B1", "Tomato", 2.2, "elena.rossi@example.com"],
    ["2027-07-09", "B7", "Mint", 2.4, "keisha.brown@example.com"],
    ["2027-07-10", "B8", "Cucumber", 2.9, "maya.thompson@example.com"],
    ["2027-07-13", "B1", "Tomato", 1.4, "gabe.martinez@example.com"],
    ["2027-07-16", "B8", "Cucumber", 3.9, "farah.haddad@example.com"],
    ["2027-07-17", "B7", "Mint", 2.5, "ben.okafor@example.com"],
    ["2027-08-10", "B8", "Squash", 1.9, "gabe.martinez@example.com"],
    ["2027-08-16", "B8", "Squash", 2.3, "dev.patel@example.com"]
  ]
  const sheet = excel.workbook.worksheets.add("Harvests")
  // format the dates as text, as in the club's Google spreadsheet:
  // one ["@"] row for each of the 32 date cells
  const dateFormats = []
  for (let i = 1; i < data.length; i++) {
    dateFormats.push(["@"])
  }
  const dateColumn = sheet.getRange("A2:A33")
  dateColumn.numberFormat = dateFormats
  const range = sheet.getRange("A1:E33")
  range.values = data
  await excel.sync()
  Jade.print("Added the Harvests sheet", "Setup")
  Jade.open_output()
}