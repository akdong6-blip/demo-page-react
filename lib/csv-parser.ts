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
  절감률: number
  업종구분: string
  그룹구분: string
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

    // 헤더 확인
    if (lines.length > 0) {
      console.log("[v0] CSV 헤더:", lines[0])
    }

    // 첫 번째 데이터 행 확인
    if (lines.length > 1) {
      console.log("[v0] 첫 번째 데이터 행:", lines[1])
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",")

      if (values.length < 18) {
        if (i < 5) {
          console.log(`[v0] 라인 ${i} 컬럼 수 부족:`, values.length, "개")
        }
        continue
      }

      // CSV 컬럼 순서 (18개, 0-indexed):
      // 0: 현장명, 1: ID_SITE, 2: 전기요금, 3: 분석일수, 4: MV5수량, 5: MVS수량,
      // 6: 실내기수량, 7: 로직버전, 8: 절감사용량(Kwh), 9: 비절감절감량(Kwh),
      // 10: 절감량(Kwh), 11: 절감금액(원), 12: 비절감금액(원), 13: 절감비용(원),
      // 14: 월, 15: 연, 16: 절감률, 17: 업종구분

      const 업종구분 = values[17]?.trim() || ""

      // 업종구분이 없거나 헤더인 경우 스킵
      if (!업종구분 || 업종구분 === "업종구분" || 업종구분 === "0" || 업종구분 === "") continue

      const 절감률Str = values[16]?.trim() || "0%"
      let 절감률 = 0
      if (절감률Str !== "#DIV/0!" && 절감률Str !== "") {
        절감률 = Number.parseFloat(절감률Str.replace("%", "")) || 0
      }

      const 현장명 = values[0]?.trim() || ""
      let 그룹구분 = "기타"
      // Try to extract region from site name (e.g., "서울 XXX" -> "서울")
      const regionMatch = 현장명.match(
        /^(서울|경기|인천|부산|대구|광주|대전|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)/,
      )
      if (regionMatch) {
        그룹구분 = regionMatch[1]
      }

      const record: SiteData = {
        No: i,
        현장명: 현장명,
        ID_SITE: values[1]?.trim() || "",
        전기요금: values[2]?.trim() || "",
        분석일수: Number.parseFloat(values[3]) || 0,
        MV5수량: Number.parseFloat(values[4]) || 0,
        MVS수량: Number.parseFloat(values[5]) || 0,
        실내기수량: Number.parseInt(values[6]) || 0,
        로직버전: Number.parseInt(values[7]) || 1,
        절감사용량: Number.parseFloat(values[8]) || 0,
        비절감절감량: Number.parseFloat(values[9]) || 0,
        절감량: Number.parseFloat(values[10]) || 0,
        절감금액: Number.parseFloat(values[11]) || 0,
        비절감금액: Number.parseFloat(values[12]) || 0,
        절감비용: Number.parseFloat(values[13]) || 0,
        월: Number.parseInt(values[14]) || 0,
        연: Number.parseInt(values[15]) || 0,
        절감률: 절감률,
        업종구분: 업종구분,
        그룹구분: 그룹구분,
      }

      data.push(record)
    }

    console.log("[v0] 파싱된 데이터 레코드 수:", data.length)

    if (data.length > 0) {
      console.log("[v0] 첫 번째 레코드 샘플:", {
        현장명: data[0].현장명,
        ID_SITE: data[0].ID_SITE,
        실내기수량: data[0].실내기수량,
        로직버전: data[0].로직버전,
        절감량: data[0].절감량,
        절감비용: data[0].절감비용,
        월: data[0].월,
        연: data[0].연,
        절감률: data[0].절감률,
        업종구분: data[0].업종구분,
        그룹구분: data[0].그룹구분,
      })

      const uniqueBusinessTypes = [...new Set(data.map((d) => d.업종구분))].filter(Boolean)
      console.log("[v0] 업종구분 종류:", uniqueBusinessTypes.join(", "))

      const uniqueLogicVersions = [...new Set(data.map((d) => d.로직버전))].filter(Boolean)
      console.log("[v0] 로직버전 종류:", uniqueLogicVersions.join(", "))

      const uniqueRegions = [...new Set(data.map((d) => d.그룹구분))].filter(Boolean)
      console.log("[v0] 그룹구분 종류:", uniqueRegions.join(", "))
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

  console.log("[v0] 규모별 필터 적용 중:")
  console.log("[v0] - 선택된 규모:", scales.join(", "))
  console.log("[v0] - 필터 전 레코드 수:", data.length)

  const sampleUnitsBefore = data.slice(0, 10).map((d) => ({
    현장명: d.현장명,
    실내기수량: d.실내기수량,
  }))
  console.log("[v0] - 필터 전 샘플 실내기 수량:", JSON.stringify(sampleUnitsBefore))

  const filtered = data.filter((site) => {
    const units = site.실내기수량
    if (scales.includes("소형") && units < 30) return true
    if (scales.includes("중소형") && units >= 30 && units < 50) return true
    if (scales.includes("중형") && units >= 50 && units < 100) return true
    if (scales.includes("대형") && units >= 100) return true
    return false
  })

  console.log("[v0] - 필터 후 레코드 수:", filtered.length)

  const sampleUnitsAfter = filtered.slice(0, 10).map((d) => ({
    현장명: d.현장명,
    실내기수량: d.실내기수량,
  }))
  console.log("[v0] - 필터 후 샘플 실내기 수량:", JSON.stringify(sampleUnitsAfter))

  // 각 규모별로 몇 개씩 필터링되었는지 확인
  const scaleCount = {
    소형: filtered.filter((d) => d.실내기수량 < 30).length,
    중소형: filtered.filter((d) => d.실내기수량 >= 30 && d.실내기수량 < 50).length,
    중형: filtered.filter((d) => d.실내기수량 >= 50 && d.실내기수량 < 100).length,
    대형: filtered.filter((d) => d.실내기수량 >= 100).length,
  }
  console.log("[v0] - 규모별 레코드 수:", JSON.stringify(scaleCount))

  return filtered
}

export function filterByLogicVersion(data: SiteData[], versions: number[]): SiteData[] {
  if (versions.length === 0) return data

  console.log("[v0] 로직버전 필터 적용:")
  console.log("[v0] - 선택된 로직버전:", versions.join(", "))
  console.log("[v0] - 필터 전 레코드 수:", data.length)

  const filtered = data.filter((site) => versions.includes(site.로직버전))

  console.log("[v0] - 필터 후 레코드 수:", filtered.length)

  return filtered
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

  if (validData.length === 0) {
    console.log("[v0] 유효한 연/월 데이터 없음")
    return siteMap
  }

  const latestYear = Math.max(...validData.map((d) => d.연))
  const latestYearData = validData.filter((d) => d.연 === latestYear)
  const latestMonth = Math.max(...latestYearData.map((d) => d.월))

  console.log("[v0] 가장 최근 데이터:", `${latestYear}년 ${latestMonth}월`)

  validData
    .filter((d) => d.월 === latestMonth && d.연 === latestYear)
    .forEach((record) => {
      if (!siteMap.has(record.ID_SITE)) {
        siteMap.set(record.ID_SITE, record)
      }
    })

  console.log("[v0] 최근 월 현장 수:", siteMap.size)
  return siteMap
}

export function calculatePerSiteStats(data: SiteData[]) {
  console.log("[v0] ===== calculatePerSiteStats 시작 =====")
  console.log("[v0] 입력 데이터 레코드 수:", data.length)

  const siteGroups = groupBySite(data)

  console.log("[v0] 유니크 현장 수:", siteGroups.size)

  // 처음 5개 현장의 정보 출력
  let sampleCount = 0
  siteGroups.forEach((records, siteId) => {
    if (sampleCount < 5) {
      console.log(`[v0] 샘플 현장 ${sampleCount + 1}: ${records[0].현장명} (${siteId})`)
      console.log(`[v0]   - 레코드 수: ${records.length}개`)
      console.log(`[v0]   - 실내기: ${records[0].실내기수량}대`)
      console.log(`[v0]   - 총 절감비용: ${records.reduce((sum, r) => sum + r.절감비용, 0)}원`)
      console.log(
        `[v0]   - 월평균 절감비용: ${Math.round(records.reduce((sum, r) => sum + r.절감비용, 0) / records.length)}원`,
      )
      sampleCount++
    }
  })

  let totalSiteMonthlyAvgCost = 0
  let totalSiteIndoorUnits = 0
  let totalSiteMonthlyAvgAmount = 0
  let totalSavingsAmount = 0 // 전체 절감량 합계
  let totalNonSavingsAmount = 0 // 전체 비절감절감량 합계

  let grandTotalSavingsCost = 0 // 전체 절감비용 합계 (월별 데이터 전부)
  let grandTotalIndoorUnits = 0 // 전체 실내기 수 합계 (월별 데이터 전부)

  siteGroups.forEach((records, siteId) => {
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
    grandTotalIndoorUnits += indoorUnits * monthCount // 실내기수 × 레코드(월) 수
  })

  const siteCount = siteGroups.size
  const avgSavingsRate = totalNonSavingsAmount > 0 ? (totalSavingsAmount / totalNonSavingsAmount) * 100 : 0
  const avgMonthlyCostPerSite = siteCount > 0 ? totalSiteMonthlyAvgCost / siteCount : 0
  const avgMonthlyAmountPerSite = siteCount > 0 ? totalSiteMonthlyAvgAmount / siteCount : 0

  const avgMonthlyCostPerIndoorUnit = grandTotalIndoorUnits > 0 ? grandTotalSavingsCost / grandTotalIndoorUnits : 0

  console.log("[v0] 현장별 통계 계산:")
  console.log("[v0] - 총 현장 수:", siteCount)
  console.log("[v0] - 총 실내기 수 (현장별 한 번):", totalSiteIndoorUnits)
  console.log("[v0] - 총 절감비용 (전체 합계):", Math.round(grandTotalSavingsCost))
  console.log("[v0] - 총 실내기 수 (전체 레코드 기준):", grandTotalIndoorUnits)
  console.log("[v0] - 총 현장 월평균 절감비용 합계:", Math.round(totalSiteMonthlyAvgCost))
  console.log("[v0] - 현장당 월평균 절감금액:", Math.round(avgMonthlyCostPerSite))
  console.log("[v0] - 실내기당 절감금액 (총합/총실내기):", Math.round(avgMonthlyCostPerIndoorUnit))
  console.log("[v0] - 총 절감량:", Math.round(totalSavingsAmount), "kWh")
  console.log("[v0] - 총 비절감절감량:", Math.round(totalNonSavingsAmount), "kWh")
  console.log("[v0] - 평균 절감률 (절감량/비절감절감량):", avgSavingsRate.toFixed(1), "%")
  console.log("[v0] ===== calculatePerSiteStats 종료 =====")

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

  console.log("[v0] 통계 계산 완료:")
  console.log("[v0] - 총 현장 수 (최근 월):", totalSites)
  console.log("[v0] - 총 실내기 대수 (최근 월):", totalIndoorUnits)
  console.log("[v0] - 총 절감량 (월별 합산):", Math.round(totalSavingsAmount), "kWh")
  console.log("[v0] - 총 비절감절감량:", Math.round(totalBeforePower), "kWh")
  console.log("[v0] - 절감률 (절감량/비절감절감량):", avgSavingsRate.toFixed(1), "%")
  console.log("[v0] - 총 절감비용:", Math.round(totalSavingsCost), "원")

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
