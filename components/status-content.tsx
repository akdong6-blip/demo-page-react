"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Factory, School, Hotel, ShoppingBag, Landmark, GraduationCap, ChevronDown } from "lucide-react"
import { loadSiteData, groupByRegion, groupByBusinessType, calculateTotalStats, type SiteData } from "@/lib/csv-parser"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"

export function StatusContent() {
  const [siteData, setSiteData] = useState<SiteData[]>([])
  const [regionalData, setRegionalData] = useState<Array<{ region: string; sites: number; percentage: number }>>([])
  const [industryData, setIndustryData] = useState<Array<{ category: string; sites: number; units: number }>>([])
  const [isChartsOpen, setIsChartsOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const data = await loadSiteData()
      console.log("[v0] 현황 페이지 CSV 데이터 로드됨:", data.length, "개 레코드")
      setSiteData(data)

      const regionMap = groupByRegion(data)
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
      const siteMap = new Map<string, SiteData>()

      // Create a map of site ID to site data (using first record of each site)
      data.forEach((record) => {
        if (!siteMap.has(record.ID_SITE)) {
          siteMap.set(record.ID_SITE, record)
        }
      })

      const industry = Array.from(businessMap.entries())
        .map(([category, siteIds]) => ({
          category,
          sites: siteIds.length,
          units: siteIds.reduce((sum, siteId) => {
            const siteData = siteMap.get(siteId)
            return sum + (siteData?.실내기대수 || 0)
          }, 0),
        }))
        .sort((a, b) => b.sites - a.sites)
      setIndustryData(industry)
      console.log("[v0] 업태별 데이터:", industry.length, "개 업태")
    }
    loadData()
  }, [])

  const stats = calculateTotalStats(siteData)

  const getIndustryIcon = (category: string) => {
    if (category.includes("초중고")) return School
    if (category.includes("대학교")) return GraduationCap
    if (category.includes("오피스") || category.includes("빌딩")) return Building2
    if (category.includes("공장")) return Factory
    if (category.includes("상업") || category.includes("문화") || category.includes("상가")) return ShoppingBag
    if (category.includes("공공") || category.includes("종교")) return Landmark
    if (category.includes("숙박") || category.includes("호텔")) return Hotel
    if (category.includes("병원")) return Building2
    if (category.includes("유치원")) return School
    if (category.includes("학원")) return GraduationCap
    if (category.includes("금융")) return Landmark
    if (category.includes("연구소") || category.includes("연수원")) return GraduationCap
    if (category.includes("유통") || category.includes("체육")) return ShoppingBag
    return Building2
  }

  const getGrayColor = (sites: number, maxSites: number) => {
    const intensity = sites / maxSites
    // Dark gray for high values, light gray for low values
    const lightness = 85 - intensity * 55 // Range from 85% (light) to 30% (dark)
    return `hsl(0, 0%, ${lightness}%)`
  }

  const getBurgundyColor = (sites: number, maxSites: number) => {
    const intensity = sites / maxSites
    // Dark burgundy for high values, light burgundy for low values
    const lightness = 65 - intensity * 35 // Range from 65% (light) to 30% (dark)
    const saturation = 40 + intensity * 30 // Range from 40% to 70%
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
        <p className="text-sm text-muted-foreground/70 font-lg-regular italic">
          * 데이터 출처: 2024년 개시 현장 중, 개시일부터 12개월간의 현장 실측 결과
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">총 현장 수</div>
            <div className="text-4xl font-lg-bold text-primary">{stats.totalSites}</div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">site</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">실내기 대수</div>
            <div className="text-4xl font-lg-bold text-chart-2">{stats.totalIndoorUnits.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">대</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">절감량</div>
            <div className="text-4xl font-lg-bold text-chart-5">
              {Math.round(stats.totalSavingsAmount).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">kWh</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">절감 금액</div>
            <div className="text-4xl font-lg-bold text-chart-3">
              {Math.round(stats.totalSavingsCost).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">원</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">평균 절감률</div>
            <div className="text-4xl font-lg-bold text-chart-4">{stats.avgSavingsRate.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-lg-bold">지역별 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {regionalData.map((data, index) => (
              <Card key={data.region} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${(index * 360) / regionalData.length}, 70%, 50%)`,
                      }}
                    />
                    <span className="font-lg-bold text-base">{data.region || "미분류"}</span>
                  </div>
                  <div>
                    <div className="font-lg-bold text-2xl text-primary">{data.sites}</div>
                    <div className="text-sm text-muted-foreground mt-1 font-lg-regular">
                      현장 ({data.percentage.toFixed(1)}%)
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-lg-bold">업태별 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {industryData.map((stat) => {
              const Icon = getIndustryIcon(stat.category)
              return (
                <Card key={stat.category} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-lg-bold text-lg">{stat.category}</h4>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-lg-regular">현장</span>
                        <span className="font-lg-regular">{stat.sites} site</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-lg-regular">실내기</span>
                        <span className="font-lg-regular">{stat.units}대</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
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
              {/* 지역별 현장 수 차트 */}
              <div>
                <h4 className="font-lg-bold text-lg mb-4">지역별 현장 수</h4>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={regionalData} margin={{ top: 60, right: 20, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="region"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12, fill: "#4a5568" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#4a5568" }} />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value}개 (${regionalData.find((d) => d.sites === value)?.percentage.toFixed(1)}%)`,
                        "현장 수",
                      ]}
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    />
                    <Bar dataKey="sites" radius={[8, 8, 0, 0]} barSize={60}>
                      {regionalData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getGrayColor(entry.sites, maxRegionalSites)}
                          stroke="#4a5568"
                          strokeWidth={1}
                        />
                      ))}
                      <LabelList
                        dataKey="sites"
                        position="top"
                        content={(props: any) => {
                          const { x, y, width, value } = props
                          const dataPoint = regionalData.find((d) => d.sites === value)
                          return (
                            <g>
                              <text
                                x={x + width / 2}
                                y={y - 25}
                                fill="#1a202c"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={16}
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
                                fontSize={13}
                              >
                                {dataPoint?.percentage.toFixed(1)}%
                              </text>
                            </g>
                          )
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 업태별 현장 수 차트 */}
              <div>
                <h4 className="font-lg-bold text-lg mb-4">업태별 현장 수</h4>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={industryData} margin={{ top: 60, right: 20, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="category"
                      angle={-45}
                      textAnchor="end"
                      height={120}
                      tick={{ fontSize: 12, fill: "#4a5568" }}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#4a5568" }} />
                    <Tooltip
                      formatter={(value: number) => {
                        const totalSites = industryData.reduce((sum, d) => sum + d.sites, 0)
                        const percentage = totalSites > 0 ? ((value / totalSites) * 100).toFixed(1) : "0.0"
                        return [`${value}개 (${percentage}%)`, "현장 수"]
                      }}
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    />
                    <Bar dataKey="sites" radius={[8, 8, 0, 0]} barSize={60}>
                      {industryData.map((entry, index) => (
                        <Cell
                          key={`cell-biz-${index}`}
                          fill={getBurgundyColor(entry.sites, maxIndustrySites)}
                          stroke="#7A1230"
                          strokeWidth={1}
                        />
                      ))}
                      <LabelList
                        dataKey="sites"
                        position="top"
                        content={(props: any) => {
                          const { x, y, width, value } = props
                          const totalSites = industryData.reduce((sum, d) => sum + d.sites, 0)
                          const percentage = totalSites > 0 ? ((value / totalSites) * 100).toFixed(1) : "0.0"
                          return (
                            <g>
                              <text
                                x={x + width / 2}
                                y={y - 25}
                                fill="#1a202c"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={16}
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
                                fontSize={13}
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
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}
