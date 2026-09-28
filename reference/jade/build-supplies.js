async function buildSuppliesSheet(excel) {
  const data = [
    ["Item", "Quantity", "Unit", "Reorder At"],
    ["Tomato cages", 18, "each", 10],
    ["Compost", 6, "bags", 8],
    ["Mulch", 12, "bags", 5],
    ["Seed packets", 40, "packets", 15],
    ["Garden gloves", 9, "pairs", 12],
    ["Hose nozzles", 3, "each", 2],
    ["Twine", 2, "rolls", 3],
    ["Trowels", 11, "each", 6]
  ]
  const sheet = excel.workbook.worksheets.add("Supplies")
  const range = sheet.getRange("A1:D9")
  range.values = data
  await excel.sync()
  Jade.print("Added the Supplies sheet", "Setup")
  Jade.open_output()
}