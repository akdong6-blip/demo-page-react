const fs = require("fs")
const path = require("path")

// Read the CSV file from user_read_only_context
const csvPath = path.join(process.cwd(), "user_read_only_context", "text_attachments", "데이터-수정-Oc2Ta.csv")
const csvContent = fs.readFileSync(csvPath, "utf-8")

const lines = csvContent.split("\n")
const businessTypes = new Set()

// Skip header row (index 0) and process data rows
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim()
  if (!line) continue

  // Parse CSV line (handle quoted fields)
  const fields = []
  let current = ""
  let inQuotes = false

  for (let j = 0; j < line.length; j++) {
    const char = line[j]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  fields.push(current.trim())

  // Business type is at index 13 (0-based)
  if (fields.length > 13) {
    const businessType = fields[13]
    if (businessType && businessType !== "0" && businessType.trim() !== "") {
      businessTypes.add(businessType)
    }
  }
}

// Convert to sorted array
const sortedBusinessTypes = Array.from(businessTypes).sort()

console.log("Found business types:", sortedBusinessTypes.length)
console.log("Business types:", JSON.stringify(sortedBusinessTypes, null, 2))

// Write to output file
const outputPath = path.join(process.cwd(), "scripts", "business-types-output.json")
fs.writeFileSync(outputPath, JSON.stringify(sortedBusinessTypes, null, 2))
console.log("Output written to:", outputPath)
