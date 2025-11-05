import { readFile, writeFile } from "fs/promises"
import { join } from "path"

async function processCSV() {
  try {
    // Read the CSV file from the attachment
    const csvPath = join(process.cwd(), "user_read_only_context", "text_attachments", "데이터-수정-gd32J.csv")
    const csvContent = await readFile(csvPath, "utf-8")

    // Write to public/data directory
    const outputPath = join(process.cwd(), "public", "data", "sites-data.csv")
    await writeFile(outputPath, csvContent, "utf-8")

    console.log("[v0] CSV 파일이 성공적으로 복사되었습니다")
    console.log("[v0] 파일 크기:", csvContent.length, "바이트")

    // Parse and analyze the data
    const lines = csvContent.split("\n")
    console.log("[v0] 총 라인 수:", lines.length)

    // Extract unique business types
    const businessTypes = new Set()
    const sites = new Set()
    let totalIndoorUnits = 0
    let totalSavings = 0
    let totalSavingsRate = 0
    let recordCount = 0

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",")
      if (values.length < 20) continue

      const siteId = values[2]
      const businessType = values[13]
      const indoorUnits = Number.parseInt(values[14]) || 0
      const savings = Number.parseInt(values[6]) || 0
      const savingsRate = Number.parseFloat(values[16]?.replace("%", "")) || 0

      if (businessType && businessType !== "0" && businessType.trim() !== "") {
        businessTypes.add(businessType)
        sites.add(siteId)

        // Only count once per site (use month 1)
        if (values[10] === "1") {
          totalIndoorUnits += indoorUnits
        }

        totalSavings += savings
        totalSavingsRate += savingsRate
        recordCount++
      }
    }

    console.log("[v0] 고유 현장 수:", sites.size)
    console.log("[v0] 총 실내기 대수:", totalIndoorUnits)
    console.log("[v0] 총 절감량:", totalSavings, "kWh")
    console.log("[v0] 평균 절감률:", (totalSavingsRate / recordCount).toFixed(1), "%")
    console.log("[v0] 업태 목록:", Array.from(businessTypes).sort())
  } catch (error) {
    console.error("[v0] CSV 처리 실패:", error)
  }
}

processCSV()
