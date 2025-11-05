export interface SiteData {
  No: number
  현장명: string
  ID_SITE: string
  분석일수: number
  절감사용량: number
  비절감절감량: number
  절감량: number
  절감금액: number
  비절감금액: number
  절감비용: number
  월: number
  연: number
  현장구분: string
  업태: string
  실내기대수: number
  구분: string
  절감률: string
  지역: string
  한전요금: string
  탄소배출량: string
}

const CSV_URL = "/data/sites-data.csv"

export async function loadSiteData(): Promise<SiteData[]> {
  try {
    const response = await fetch(CSV_URL)
    if (!response.ok) {
      console.error("[v0] CSV 파일 로드 실패:", response.status)
      return []
    }

    const text = await response.text()
    const lines = text.split("\n")
    const data: SiteData[] = []

    console.log("[v0] CSV 총 라인 수:", lines.length)

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = parseCSVLine(line)
      if (values.length < 20) continue

      const businessType = values[13]?.trim()
      if (!businessType || businessType === "0" || businessType === "") continue

      data.push({
        No: Number.parseInt(values[0]) || 0,
        현장명: values[1] || "",
        ID_SITE: values[2] || "",
        분석일수: Number.parseFloat(values[3]) || 0,
        절감사용량: Number.parseFloat(values[4]) || 0,
        비절감절감량: Number.parseFloat(values[5]) || 0,
        절감량: Number.parseFloat(values[6]) || 0,
        절감금액: Number.parseFloat(values[7]) || 0,
        비절감금액: Number.parseFloat(values[8]) || 0,
        절감비용: Number.parseFloat(values[9]) || 0,
        월: Number.parseInt(values[10]) || 0,
        연: Number.parseInt(values[11]) || 0,
        현장구분: values[12] || "",
        업태: businessType,
        실내기대수: Number.parseInt(values[14]) || 0,
        구분: values[15] || "",
        절감률: values[16] || "0%",
        지역: values[17] || "",
        한전요금: values[18] || "",
        탄소배출량: values[19] || "",
      })
    }

    console.log("[v0] 파싱된 데이터 레코드 수:", data.length)
    return data
  } catch (error) {
    console.error("[v0] CSV 파일 로드 실패:", error)
    return []
  }
}

function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      values.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  values.push(current.trim())
  return values
}

export function filterByMonth(data: SiteData[], months: number[]): SiteData[] {
  if (months.length === 0) return data
  return data.filter((site) => months.includes(site.월))
}

export function filterByBusinessType(data: SiteData[], types: string[]): SiteData[] {
  if (types.length === 0) return data
  return data.filter((site) => types.includes(site.업태))
}

export function filterByScale(data: SiteData[], scales: string[]): SiteData[] {
  if (scales.length === 0) return data
  return data.filter((site) => scales.includes(site.현장구분))
}

export function groupBySite(data: SiteData[]): Map<string, SiteData[]> {
  const siteMap = new Map<string, SiteData[]>()

  data.forEach((record) => {
    const siteId = record.ID_SITE
    if (!siteMap.has(siteId)) {
      siteMap.set(siteId, [])
    }
    siteMap.get(siteId)!.push(record)
  })

  return siteMap
}

export function calculateTotalStats(data: SiteData[]) {
  const siteMap = groupBySite(data)
  const uniqueSites = Array.from(siteMap.keys())

  console.log("[v0] 디버그 - 총 레코드 수:", data.length)
  console.log("[v0] 디버그 - 고유 현장 수:", uniqueSites.length)
  console.log("[v0] 디버그 - 첫 3개 현장 ID:", uniqueSites.slice(0, 3))

  let totalIndoorUnits = 0
  let debugCount = 0
  siteMap.forEach((records, siteId) => {
    if (records.length > 0) {
      const units = records[0].실내기대수
      totalIndoorUnits += units
      if (debugCount < 3) {
        console.log(`[v0] 디버그 - 현장 ${siteId}: ${records.length}개 레코드, 실내기 ${units}대`)
        debugCount++
      }
    }
  })

  // Divide by 12 to correct for monthly duplication in source data
  totalIndoorUnits = Math.round(totalIndoorUnits / 12)
  console.log("[v0] 디버그 - 계산된 총 실내기 대수 (12로 나눔):", totalIndoorUnits)

  // Sum all records for totals
  const totalSavingsAmount = data.reduce((sum, d) => sum + d.절감량, 0)
  const totalSavingsCost = data.reduce((sum, d) => sum + d.절감비용, 0)
  const totalBeforeCost = data.reduce((sum, d) => sum + d.비절감금액, 0)
  const totalAfterCost = data.reduce((sum, d) => sum + d.절감금액, 0)
  const totalBeforePower = data.reduce((sum, d) => sum + d.비절감절감량, 0)
  const totalAfterPower = data.reduce((sum, d) => sum + d.절감사용량, 0)

  // Calculate average savings rate
  const avgSavingsRate =
    data.length > 0
      ? data.reduce((sum, d) => {
          const rate = Number.parseFloat(d.절감률.replace("%", ""))
          return sum + (rate || 0)
        }, 0) / data.length
      : 0

  console.log("[v0] 통계 계산 완료:")
  console.log("[v0] - 총 현장 수:", uniqueSites.length)
  console.log("[v0] - 총 실내기 대수:", totalIndoorUnits)
  console.log("[v0] - 총 절감량:", totalSavingsAmount, "kWh")
  console.log("[v0] - 평균 절감률:", avgSavingsRate.toFixed(1), "%")

  return {
    totalSites: uniqueSites.length,
    totalIndoorUnits,
    totalSavingsAmount,
    totalSavingsCost,
    totalBeforeCost,
    totalAfterCost,
    totalBeforePower,
    totalAfterPower,
    avgSavingsRate,
    recordCount: data.length,
  }
}

export function groupByRegion(data: SiteData[]) {
  const siteMap = groupBySite(data)
  const regionMap = new Map<string, string[]>()

  siteMap.forEach((records, siteId) => {
    if (records.length > 0) {
      const region = records[0].지역
      if (!regionMap.has(region)) {
        regionMap.set(region, [])
      }
      regionMap.get(region)!.push(siteId)
    }
  })

  return regionMap
}

export function groupByBusinessType(data: SiteData[]) {
  const siteMap = groupBySite(data)
  const businessMap = new Map<string, string[]>()

  siteMap.forEach((records, siteId) => {
    if (records.length > 0) {
      const business = records[0].업태
      if (!businessMap.has(business)) {
        businessMap.set(business, [])
      }
      businessMap.get(business)!.push(siteId)
    }
  })

  return businessMap
}

export const BUSINESS_TYPES = [
  "공공기관",
  "공장",
  "금융업",
  "기타",
  "대학교",
  "문화시설",
  "범LG그룹",
  "병원",
  "빌딩",
  "상업시설",
  "숙박업",
  "연구소",
  "연수원",
  "유치원",
  "유통업",
  "종교시설",
  "주거지",
  "체육시설",
  "초중고",
  "학원",
] as const

export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

export const SCALES = ["대형", "중형", "중소형", "소형"] as const
