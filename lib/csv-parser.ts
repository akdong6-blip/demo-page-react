export interface SiteData {
  No: number
  현장명: string
  ID_SITE: string
  전기요금: string
  분석일수: number
  MV5수량: number
  MVS수량: number
  실내기수량: number
  로직버전: number
  절감사용량: number
  비절감절감량: number
  절감량: number
  절감금액: number
  비절감금액: number
  절감비용: number
  월: number
  연: number
  그룹구분: string
  컨텐츠구분: string
  절감률: number
  규모구분: string
  업종구분: string
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

    // 헤더 분석
    if (lines.length > 0) {
      const headerValues = lines[0].split("\t")
      console.log("[v0] 헤더 컬럼 수:", headerValues.length)
      console.log("[v0] 헤더 첫 5개:", headerValues.slice(0, 5).join(" | "))
    }

    // 첫 번째 줄은 헤더이므로 건너뜀
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // 탭으로 분리
      const values = line.split("\t")

      // 첫 번째 줄 디버깅
      if (i === 1) {
        console.log("[v0] 첫 데이터 행 컬럼 수:", values.length)
        console.log("[v0] 첫 5개 값:", values.slice(0, 5).join(" | "))
        console.log("[v0] 컬럼 6-10:", values.slice(5, 10).join(" | "))
        console.log("[v0] 마지막 5개 값:", values.slice(-5).join(" | "))
      }

      const firstVal = values[0]?.trim() || ""
      const isFirstColumnRowNumber = /^\d+$/.test(firstVal)
      const offset = isFirstColumnRowNumber ? 0 : -1 // 행번호가 없으면 인덱스를 1씩 감소

      if (i === 1) {
        console.log("[v0] 첫 번째 컬럼:", firstVal, "- 행번호 여부:", isFirstColumnRowNumber, "- 오프셋:", offset)
      }

      // 컬럼 수 체크 (최소 20개)
      if (values.length < 20) {
        if (i < 5) console.log("[v0] 컬럼 수 부족 (라인", i, "):", values.length)
        continue
      }

      const idx = (base: number) => base + offset

      // 절감률 파싱
      let 절감률 = 0
      const 절감률Str = values[idx(19)]?.trim() || ""
      if (절감률Str && 절감률Str !== "#DIV/0!" && 절감률Str !== "") {
        절감률 = Number.parseFloat(절감률Str.replace("%", "")) || 0
      }

      const 규모구분 = values[idx(20)]?.trim() || ""
      const 업종구분 = values[idx(21)]?.trim() || values[values.length - 1]?.trim() || ""

      // 업종구분이 없거나 헤더인 경우 스킵
      if (!업종구분 || 업종구분 === "업종구분") continue

      const record: SiteData = {
        No: isFirstColumnRowNumber ? Number.parseInt(values[0]?.trim()) || i : i,
        현장명: values[idx(1)]?.trim() || "",
        ID_SITE: values[idx(2)]?.trim() || "",
        전기요금: values[idx(3)]?.trim() || "",
        분석일수: Number.parseInt(values[idx(4)]) || 0,
        MV5수량: Number.parseInt(values[idx(5)]) || 0,
        MVS수량: Number.parseInt(values[idx(6)]) || 0,
        실내기수량: Number.parseInt(values[idx(7)]) || 0,
        로직버전: Number.parseInt(values[idx(8)]) || 1,
        절감사용량: Number.parseFloat(values[idx(9)]) || 0,
        비절감절감량: Number.parseFloat(values[idx(10)]) || 0,
        절감량: Number.parseFloat(values[idx(11)]) || 0,
        절감금액: Number.parseFloat(values[idx(12)]) || 0,
        비절감금액: Number.parseFloat(values[idx(13)]) || 0,
        절감비용: Number.parseFloat(values[idx(14)]) || 0,
        월: Number.parseInt(values[idx(15)]) || 0,
        연: Number.parseInt(values[idx(16)]) || 0,
        그룹구분: values[idx(17)]?.trim() || "",
        컨텐츠구분: values[idx(18)]?.trim() || "",
        절감률: 절감률,
        규모구분: 규모구분,
        업종구분: 업종구분,
      }

      // 첫 번째 레코드 상세 디버깅
      if (i === 1) {
        console.log("[v0] 파싱된 첫 번째 레코드:")
        console.log("[v0]   현장명:", record.현장명)
        console.log("[v0]   ID_SITE:", record.ID_SITE)
        console.log("[v0]   실내기수량:", record.실내기수량)
        console.log("[v0]   로직버전:", record.로직버전)
        console.log("[v0]   절감비용:", record.절감비용)
        console.log("[v0]   월:", record.월, "연:", record.연)
        console.log("[v0]   절감률:", record.절감률)
        console.log("[v0]   규모구분:", record.규모구분)
        console.log("[v0]   업종구분:", record.업종구분)
      }

      data.push(record)
    }

    console.log("[v0] 파싱된 레코드 수:", data.length)

    if (data.length > 0) {
      const uniqueBusinessTypes = [...new Set(data.map((d) => d.업종구분))].filter(Boolean)
      console.log("[v0] 업종구분:", uniqueBusinessTypes.join(", "))

      const uniqueScales = [...new Set(data.map((d) => d.규모구분))].filter(Boolean)
      console.log("[v0] 규모구분:", uniqueScales.join(", "))

      // 최신 연월 확인
      const latestYear = Math.max(...data.map((d) => d.연))
      const latestYearData = data.filter((d) => d.연 === latestYear)
      const latestMonth = Math.max(...latestYearData.map((d) => d.월))
      console.log("[v0] 최신 연월:", latestYear, "년", latestMonth, "월")

      // 실내기수량 샘플
      const sampleUnits = data.slice(0, 5).map((d) => d.실내기수량)
      console.log("[v0] 실내기수량 샘플:", sampleUnits.join(", "))
    }

    return data
  } catch (error) {
    console.error("[v0] CSV 파일 로드 실패:", error)
    return []
  }
}

export function filterByMonth(data: SiteData[], months: number[]): SiteData[] {
  if (months.length === 0) return data
  return data.filter((site) => months.includes(site.월))
}

export function filterByBusinessType(data: SiteData[], types: string[]): SiteData[] {
  if (types.length === 0) return data
  return data.filter((site) => types.includes(site.업종구분))
}

export function filterByScale(data: SiteData[], scales: string[]): SiteData[] {
  if (scales.length === 0) return data
  // CSV의 "규모 구분" 컬럼 값을 직접 사용
  return data.filter((site) => scales.includes(site.규모구분))
}

export function filterByLogicVersion(data: SiteData[], versions: number[]): SiteData[] {
  if (versions.length === 0) return data
  return data.filter((site) => versions.includes(site.로직버전))
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

export function getLatestMonthSites(data: SiteData[]): Map<string, SiteData> {
  const siteMap = new Map<string, SiteData>()
  if (data.length === 0) return siteMap

  const validData = data.filter((d) => d.연 > 2000 && d.월 >= 1 && d.월 <= 12)
  if (validData.length === 0) return siteMap

  const latestYear = Math.max(...validData.map((d) => d.연))
  const latestYearData = validData.filter((d) => d.연 === latestYear)
  const latestMonth = Math.max(...latestYearData.map((d) => d.월))

  validData
    .filter((d) => d.월 === latestMonth && d.연 === latestYear)
    .forEach((record) => {
      if (!siteMap.has(record.ID_SITE)) {
        siteMap.set(record.ID_SITE, record)
      }
    })

  return siteMap
}

export function calculatePerSiteStats(data: SiteData[]) {
  const siteGroups = groupBySite(data)

  let totalSiteMonthlyAvgCost = 0
  let totalSiteIndoorUnits = 0
  let totalSiteMonthlyAvgAmount = 0
  let totalSavingsAmount = 0
  let totalNonSavingsAmount = 0
  let grandTotalSavingsCost = 0
  let grandTotalIndoorUnits = 0

  siteGroups.forEach((records) => {
    if (records.length === 0) return

    const indoorUnits = records[0].실내기수량
    const totalCost = records.reduce((sum, r) => sum + r.절감비용, 0)
    const totalAmount = records.reduce((sum, r) => sum + r.절감량, 0)
    const totalNonSavings = records.reduce((sum, r) => sum + r.비절감절감량, 0)
    const monthCount = records.length
    const monthlyAvgCost = totalCost / monthCount
    const monthlyAvgAmount = totalAmount / monthCount

    totalSavingsAmount += totalAmount
    totalNonSavingsAmount += totalNonSavings
    totalSiteMonthlyAvgCost += monthlyAvgCost
    totalSiteMonthlyAvgAmount += monthlyAvgAmount
    totalSiteIndoorUnits += indoorUnits
    grandTotalSavingsCost += totalCost
    grandTotalIndoorUnits += indoorUnits * monthCount
  })

  const siteCount = siteGroups.size
  const avgSavingsRate = totalNonSavingsAmount > 0 ? (totalSavingsAmount / totalNonSavingsAmount) * 100 : 0
  const avgMonthlyCostPerSite = siteCount > 0 ? totalSiteMonthlyAvgCost / siteCount : 0
  const avgMonthlyAmountPerSite = siteCount > 0 ? totalSiteMonthlyAvgAmount / siteCount : 0
  const avgMonthlyCostPerIndoorUnit = grandTotalIndoorUnits > 0 ? grandTotalSavingsCost / grandTotalIndoorUnits : 0

  return {
    siteCount,
    totalIndoorUnits: totalSiteIndoorUnits,
    avgMonthlyCostPerSite: Math.round(avgMonthlyCostPerSite),
    avgMonthlyAmountPerSite: Math.round(avgMonthlyAmountPerSite),
    avgMonthlyCostPerIndoorUnit: Math.round(avgMonthlyCostPerIndoorUnit),
    avgSavingsRate,
    grandTotalSavingsCost: Math.round(grandTotalSavingsCost),
    grandTotalIndoorUnits,
  }
}

export function calculateTotalStats(data: SiteData[]) {
  const latestSites = getLatestMonthSites(data)
  const totalSites = latestSites.size

  let totalIndoorUnits = 0
  latestSites.forEach((site) => {
    totalIndoorUnits += site.실내기수량
  })

  const totalSavingsAmount = data.reduce((sum, d) => sum + d.절감량, 0)
  const totalSavingsCost = data.reduce((sum, d) => sum + d.절감비용, 0)
  const totalBeforeCost = data.reduce((sum, d) => sum + d.비절감금액, 0)
  const totalAfterCost = data.reduce((sum, d) => sum + d.절감금액, 0)
  const totalBeforePower = data.reduce((sum, d) => sum + d.비절감절감량, 0)
  const totalAfterPower = data.reduce((sum, d) => sum + d.절감사용량, 0)

  const avgSavingsRate = totalBeforePower > 0 ? (totalSavingsAmount / totalBeforePower) * 100 : 0
  const perSiteStats = calculatePerSiteStats(data)

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
    recordCount: data.length,
    perSiteStats,
  }
}

export function groupByRegion(data: SiteData[]) {
  const latestSites = getLatestMonthSites(data)
  const regionMap = new Map<string, string[]>()

  latestSites.forEach((site, siteId) => {
    const region = site.그룹구분
    if (!regionMap.has(region)) {
      regionMap.set(region, [])
    }
    regionMap.get(region)!.push(siteId)
  })

  return regionMap
}

export function groupByBusinessType(data: SiteData[]) {
  const latestSites = getLatestMonthSites(data)
  const businessMap = new Map<string, string[]>()

  latestSites.forEach((site, siteId) => {
    const business = site.업종구분
    if (!businessMap.has(business)) {
      businessMap.set(business, [])
    }
    businessMap.get(business)!.push(siteId)
  })

  return businessMap
}

export function calculateBusinessTypeStats(data: SiteData[]) {
  const siteGroups = groupBySite(data)
  const businessStats = new Map<string, { siteCount: number; avgRate: number }>()
  const businessTotals = new Map<string, { siteCount: number; totalSavings: number; totalNonSavings: number }>()

  siteGroups.forEach((records) => {
    if (records.length === 0) return
    const 업종구분 = records[0].업종구분
    const totalSavings = records.reduce((sum, r) => sum + r.절감량, 0)
    const totalNonSavings = records.reduce((sum, r) => sum + r.비절감절감량, 0)

    if (!businessTotals.has(업종구분)) {
      businessTotals.set(업종구분, { siteCount: 0, totalSavings: 0, totalNonSavings: 0 })
    }
    const current = businessTotals.get(업종구분)!
    current.siteCount += 1
    current.totalSavings += totalSavings
    current.totalNonSavings += totalNonSavings
  })

  businessTotals.forEach((totals, 업종구분) => {
    const avgRate = totals.totalNonSavings > 0 ? (totals.totalSavings / totals.totalNonSavings) * 100 : 0
    businessStats.set(업종구분, { siteCount: totals.siteCount, avgRate })
  })

  return businessStats
}

export const BUSINESS_TYPES = ["공장", "빌딩", "병원", "숙박업", "초중고", "공공기관", "기타", "대학교"] as const
export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
export const SCALES = ["소형", "중소형", "중형", "대형"] as const
export const LOGIC_VERSIONS = [1, 2] as const
