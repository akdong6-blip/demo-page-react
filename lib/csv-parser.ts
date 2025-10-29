export interface SiteData {
  현장명: string
  ID_SITE: number
  분석일수: number
  절감사용량: number
  비절감절감량: number
  절감량: number
  절감금액: number
  비절감금액: number
  절감비용: string
  월: string
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

const CSV_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sites_0%EC%88%98%EC%A0%95-HQzZFki5bpUOP5ilKzSYjxt4S3Gt0I.csv"

export async function loadSiteData(): Promise<SiteData[]> {
  try {
    const response = await fetch(CSV_URL)
    const text = await response.text()
    const lines = text.split("\n")
    const data: SiteData[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = parseCSVLine(line)
      if (values.length < 19) continue

      const businessType = values[12]
      if (!businessType || businessType === "0" || businessType.trim() === "") continue

      const monthValue = values[9]
      const monthWithSuffix = monthValue.includes("월") ? monthValue : `${monthValue}월`

      data.push({
        현장명: values[0],
        ID_SITE: Number.parseInt(values[1]),
        분석일수: Number.parseInt(values[2]),
        절감사용량: Number.parseInt(values[3]),
        비절감절감량: Number.parseInt(values[4]),
        절감량: Number.parseInt(values[5]),
        절감금액: Number.parseInt(values[6]),
        비절감금액: Number.parseInt(values[7]),
        절감비용: values[8],
        월: monthWithSuffix,
        연: Number.parseInt(values[10]),
        현장구분: values[11],
        업태: businessType,
        실내기대수: Number.parseInt(values[13]),
        구분: values[14],
        절감률: values[15],
        지역: values[16],
        한전요금: values[17],
        탄소배출량: values[18],
      })
    }

    return data
  } catch (error) {
    console.error("CSV 파일 로드 실패:", error)
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

export function filterByMonth(data: SiteData[], months: string[]): SiteData[] {
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

export function groupBySite(data: SiteData[]): Map<number, SiteData> {
  const siteMap = new Map<number, SiteData>()

  data.forEach((record) => {
    const siteId = record.ID_SITE

    if (!siteMap.has(siteId)) {
      // First record for this site
      siteMap.set(siteId, { ...record })
    } else {
      // Aggregate data for existing site
      const existing = siteMap.get(siteId)!
      existing.분석일수 += record.분석일수
      existing.절감사용량 += record.절감사용량
      existing.비절감절감량 += record.비절감절감량
      existing.절감량 += record.절감량
      existing.절감금액 += record.절감금액
      existing.비절감금액 += record.비절감금액

      // Parse and sum 절감비용
      const existingCost = Number.parseInt(existing.절감비용.replace(/[₩,]/g, "")) || 0
      const newCost = Number.parseInt(record.절감비용.replace(/[₩,]/g, "")) || 0
      existing.절감비용 = (existingCost + newCost).toString()
    }
  })

  return siteMap
}

export function calculateTotalStats(data: SiteData[]) {
  const siteMap = groupBySite(data)
  const uniqueSites = Array.from(siteMap.values())

  const totalSites = uniqueSites.length
  const totalIndoorUnits = uniqueSites.reduce((sum, d) => sum + d.실내기대수, 0)
  const totalSavingsAmount = data.reduce((sum, d) => sum + d.절감량, 0)
  const totalSavingsCost = data.reduce((sum, d) => {
    const cost = d.절감비용.replace(/[₩,]/g, "")
    return sum + (Number.parseInt(cost) || 0)
  }, 0)
  const totalBeforeCost = data.reduce((sum, d) => sum + d.비절감금액, 0)
  const totalAfterCost = data.reduce((sum, d) => sum + d.절감금액, 0)
  const totalBeforePower = data.reduce((sum, d) => sum + d.비절감절감량, 0)
  const totalAfterPower = data.reduce((sum, d) => sum + d.절감사용량, 0)
  const avgSavingsRate =
    data.length > 0
      ? data.reduce((sum, d) => {
          const rate = Number.parseFloat(d.절감률.replace("%", ""))
          return sum + (rate || 0)
        }, 0) / data.length
      : 0
  const totalCarbonReduction = data.reduce((sum, d) => {
    const carbon = Number.parseInt(d.탄소배출량)
    return sum + (carbon || 0)
  }, 0)
  const recordCount = data.length

  return {
    totalSites,
    totalIndoorUnits,
    totalSavingsAmount,
    totalSavingsCost,
    totalBeforeCost,
    totalAfterCost,
    totalBeforePower,
    totalAfterPower,
    avgSavingsRate,
    totalCarbonReduction,
    recordCount,
  }
}

export function groupByRegion(data: SiteData[]) {
  const siteMap = groupBySite(data)
  const uniqueSites = Array.from(siteMap.values())

  const regionMap = new Map<string, SiteData[]>()
  uniqueSites.forEach((site) => {
    const region = site.지역
    if (!regionMap.has(region)) {
      regionMap.set(region, [])
    }
    regionMap.get(region)!.push(site)
  })
  return regionMap
}

export function groupByBusinessType(data: SiteData[]) {
  const siteMap = groupBySite(data)
  const uniqueSites = Array.from(siteMap.values())

  const businessMap = new Map<string, SiteData[]>()
  uniqueSites.forEach((site) => {
    const business = site.업태
    if (!businessMap.has(business)) {
      businessMap.set(business, [])
    }
    businessMap.get(business)!.push(site)
  })
  return businessMap
}

export const BUSINESS_TYPES = [
  "공공기관",
  "공장",
  "금융업",
  "기타",
  "다지점(프랜차이즈)",
  "대학교",
  "문화시설",
  "범LG그룹",
  "병원",
  "빌딩",
  "상가",
  "상업시설",
  "숙박업",
  "연구소",
  "연수원",
  "오피스빌딩",
  "유치원",
  "유통업",
  "임대빌딩",
  "종교시설",
  "주거지",
  "체육시설",
  "초중고",
  "학원",
] as const

export const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"] as const

export const SCALES = ["대형", "중형", "중소형", "소형"] as const
