"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Factory, School, Hotel, ShoppingBag, Landmark, GraduationCap, ChevronDown } from "lucide-react"
import {
  loadSiteData,
  groupByBusinessType,
  calculateTotalStats,
  calculatePerSiteStats,
  type SiteData,
} from "@/lib/csv-parser"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"

export function StatusContent() {
  const [siteData, setSiteData] = useState<SiteData[]>([])
  const [regionalData, setRegionalData] = useState<Array<{ region: string; sites: number; percentage: number }>>([])
  const [industryData, setIndustryData] = useState<
    Array<{ category: string; sites: number; percentage: number; avgSavingsRate: number; avgMonthlyCost: number }>
  >([])
  const [isChartsOpen, setIsChartsOpen] = useState(false)
  const [perSiteStats, setPerSiteStats] = useState<{
    avgMonthlyAmountPerSite: number
    avgMonthlyCostPerSite: number
    avgSavingsRate: number
  }>({ avgMonthlyAmountPerSite: 0, avgMonthlyCostPerSite: 0, avgSavingsRate: 0 })

  useEffect(() => {
    const loadData = async () => {
      const data = await loadSiteData()
      console.log("[v0] 현황 페이지 CSV 데이터 로드됨:", data.length, "개 레코드")
      setSiteData(data)

      const siteStats = calculatePerSiteStats(data)
      setPerSiteStats({
        avgMonthlyAmountPerSite: siteStats.avgMonthlyAmountPerSite,
        avgMonthlyCostPerSite: siteStats.avgMonthlyCostPerSite,
        avgSavingsRate: siteStats.avgSavingsRate,
      })

      const regionMap = groupByBusinessType(data)
      const totalSites =
        regionMap.size > 0 ? Array.from(regionMap.values()).reduce((sum, sites) => sum + sites.length, 0) : 0
      const regional = Array.from(regionMap.entries())
        .map(([region, sites]) => ({
          region,
          sites: sites.length,
          percentage: totalSites > 0 ? (sites.length / totalSites) * 100 : 0,
        }))
        .sort((a, b) => b.sites - a.sites)
      setRegionalData(regional)
      console.log("[v0] 지역별 데이터:", regional.length, "개 지역")

      const businessMap = groupByBusinessType(data)

      const totalSiteCount = Array.from(businessMap.values()).reduce((sum, sites) => sum + sites.length, 0)
      console.log("[v0] 업종별 총 현장수:", totalSiteCount)

      const industry = Array.from(businessMap.entries())
        .map(([category, siteIds]) => {
          const businessRecords = data.filter((record) => record.업종구분 === category)
          const validRates = businessRecords.filter((r) => r.절감률 > 0)
          const avgSavingsRate =
            validRates.length > 0 ? validRates.reduce((sum, r) => sum + r.절감률, 0) / validRates.length : 0

          // 현장별 월평균 절감금액 계산
          const siteGroups = new Map<string, typeof businessRecords>()
          for (const record of businessRecords) {
            const existing = siteGroups.get(record.ID_SITE) || []
            existing.push(record)
            siteGroups.set(record.ID_SITE, existing)
          }
          
          let totalMonthlyCost = 0
          for (const [, records] of siteGroups) {
            const siteTotalCost = records.reduce((sum, r) => sum + r.절감비용, 0)
            const siteAvgCost = siteTotalCost / records.length
            totalMonthlyCost += siteAvgCost
          }
          const avgMonthlyCost = siteGroups.size > 0 ? Math.round(totalMonthlyCost / siteGroups.size) : 0

          return {
            category,
            sites: siteIds.length,
            percentage: totalSiteCount > 0 ? (siteIds.length / totalSiteCount) * 100 : 0,
            avgSavingsRate,
            avgMonthlyCost,
          }
        })
        .sort((a, b) => b.sites - a.sites)
      setIndustryData(industry)
    }
    loadData()
  }, [])

  const stats = calculateTotalStats(siteData)

  const getIndustryIcon = (category: string) => {
    if (category.includes("초중고")) return School
    if (category.includes("대학교")) return GraduationCap
    if (category.includes("빌딩")) return Building2
    if (category.includes("공장")) return Factory
    if (category.includes("공공기관")) return Landmark
    if (category.includes("숙박")) return Hotel
    if (category.includes("병원")) return Building2
    if (category.includes("기타")) return ShoppingBag
    return Building2
  }

  const getGrayColor = (sites: number, maxSites: number) => {
    const intensity = sites / maxSites
    const lightness = 85 - intensity * 55
    return `hsl(0, 0%, ${lightness}%)`
  }

  const getBurgundyColor = (sites: number, maxSites: number) => {
    const intensity = sites / maxSites
    const lightness = 65 - intensity * 35
    const saturation = 40 + intensity * 30
    return `hsl(345, ${saturation}%, ${lightness}%)`
  }

  const maxRegionalSites = regionalData.length > 0 ? Math.max(...regionalData.map((d) => d.sites)) : 1
  const maxIndustrySites = industryData.length > 0 ? Math.max(...industryData.map((d) => d.sites)) : 1

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-lg-bold text-foreground">더욱 넓어진 에너지 현장</h2>
        <p className="text-base md:text-lg text-muted-foreground font-lg-regular">
          전국 {stats.totalSites.toLocaleString()}개 현장에서 BECON cloud를 이용해 에너지를 절감하고 있습니다
        </p>
        <p className="text-sm text-muted-foreground/70 font-lg-regular italic">* 2025년 12월 기준 데이터 반영</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">총 현장 수</div>
            <div className="text-4xl font-lg-bold text-primary">{stats.totalSites.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">site</div>
            <div className="text-xs text-muted-foreground/70 mt-2 font-lg-regular italic">
              * 2025년 12월 기준 운영중인 현장수
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">실내기 대수</div>
            <div className="text-4xl font-lg-bold text-chart-2">{stats.totalIndoorUnits.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">대</div>
            <div className="text-xs text-muted-foreground/70 mt-2 font-lg-regular italic">
              * 2025년 12월 기준 운영중인 현장수
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">절감량</div>
            <div className="text-4xl font-lg-bold text-chart-5">
              {perSiteStats.avgMonthlyAmountPerSite.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">kWh</div>
            <div className="text-xs text-muted-foreground/70 mt-2 font-lg-regular italic">* 현장별 월 평균</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">절감 금액</div>
            <div className="text-4xl font-lg-bold text-chart-3">
              {perSiteStats.avgMonthlyCostPerSite.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">원</div>
            <div className="text-xs text-muted-foreground/70 mt-2 font-lg-regular italic">* 현장별 월 평균</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">평균 절감률</div>
            <div className="text-4xl font-lg-bold text-chart-4">{perSiteStats.avgSavingsRate.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">%</div>
            <div className="text-xs text-muted-foreground/70 mt-2 font-lg-regular italic">* 현장별 월 평균</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-lg-bold">업종별 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {industryData.map((data, index) => (
              <Card key={data.category} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${(index * 360) / industryData.length}, 70%, 50%)`,
                      }}
                    />
                    <span className="font-lg-bold text-base">{data.category || "미분류"}</span>
                  </div>
                  <div>
                    <div className="font-lg-bold text-2xl text-primary">{data.sites}</div>
                    <div className="text-sm text-muted-foreground mt-1 font-lg-regular">
                      현장 ({data.percentage.toFixed(1)}%)
                    </div>
                    <div className="text-sm text-chart-4 mt-1 font-lg-regular">
                      절감률 {data.avgSavingsRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-chart-3 mt-1 font-lg-regular">
                      월평균 ₩{data.avgMonthlyCost.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <Collapsible open={isChartsOpen} onOpenChange={setIsChartsOpen}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl md:text-2xl font-lg-bold">통계 차트</CardTitle>
                <ChevronDown className={`w-5 h-5 transition-transform ${isChartsOpen ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-8 pt-4">
              <div>
                <h4 className="font-lg-bold text-lg mb-4">업종별 현장수</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={industryData} margin={{ top: 60, right: 10, left: 10, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="category"
                      angle={-45}
                      textAnchor="end"
                      height={120}
                      tick={{ fontSize: 11, fill: "#4a5568" }}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#4a5568" }} width={45} />
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => {
                        const item = industryData.find((d) => d.sites === value)
                        return [`${value}개 (${item?.percentage.toFixed(1) || "0.0"}%)`, "현장 수"]
                      }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="sites" radius={[8, 8, 0, 0]} barSize={50}>
                      {industryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getBurgundyColor(entry.sites, maxIndustrySites)}
                          stroke="#7A1230"
                          strokeWidth={1}
                        />
                      ))}
                      <LabelList
                        dataKey="sites"
                        position="top"
                        content={(props: any) => {
                          const { x, y, width, value, index } = props
                          const percentage = industryData[index]?.percentage.toFixed(1) || "0.0"
                          return (
                            <g>
                              <text
                                x={x + width / 2}
                                y={y - 25}
                                fill="#1a202c"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={13}
                                fontWeight="bold"
                              >
                                {value}
                              </text>
                              <text
                                x={x + width / 2}
                                y={y - 8}
                                fill="#4a5568"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={10}
                              >
                                {percentage}%
                              </text>
                            </g>
                          )
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="font-lg-bold text-lg mb-4">업종별 절감률</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={industryData} margin={{ top: 60, right: 10, left: 10, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="category"
                      angle={-45}
                      textAnchor="end"
                      height={120}
                      tick={{ fontSize: 11, fill: "#4a5568" }}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#4a5568" }}
                      width={45}
                      domain={[0, "auto"]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(1)}%`, "평균 절감률"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="avgSavingsRate" radius={[8, 8, 0, 0]} barSize={50} fill="#10b981">
                      <LabelList
                        dataKey="avgSavingsRate"
                        position="top"
                        content={(props: any) => {
                          const { x, y, width, value } = props
                          return (
                            <text
                              x={x + width / 2}
                              y={y - 10}
                              fill="#1a202c"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize={13}
                              fontWeight="bold"
                            >
                              {value?.toFixed(1)}%
                            </text>
                          )
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}
