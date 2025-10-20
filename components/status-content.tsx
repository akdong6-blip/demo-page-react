"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Factory, School, Hotel, ShoppingBag, Landmark, GraduationCap, Pencil, Check, X } from "lucide-react"
import { loadSiteData, groupByRegion, calculateTotalStats, type SiteData } from "@/lib/csv-parser"

const initialMonthlyStats = [
  { category: "설치현장", jan: 14, feb: 15, mar: 18, apr: 21, may: 23, jun: 28, avg: 19.8 },
  { category: "계약현장", jan: 7, feb: 7, mar: 9, apr: 11, may: 14, jun: 18, avg: 11.0 },
  { category: "체험 현장", jan: 51, feb: 53, mar: 55, apr: 58, may: 62, jun: 68, avg: 57.8 },
  { category: "총 실외기", jan: 34, feb: 35, mar: 38, apr: 42, may: 48, jun: 56, avg: 42.2 },
  { category: "절감률", jan: 28, feb: 29, mar: 31, apr: 35, may: 39, jun: 45, avg: 34.5 },
  { category: "절감금액", jan: 120, feb: 125, mar: 130, apr: 140, may: 150, jun: 160, avg: 137.5 },
]

export function StatusContent() {
  const [isEditingMonthly, setIsEditingMonthly] = useState(false)
  const [siteData, setSiteData] = useState<SiteData[]>([])
  const [regionalData, setRegionalData] = useState<Array<{ region: string; sites: number; percentage: number }>>([])
  const [industryData, setIndustryData] = useState<Array<{ category: string; sites: number; units: number }>>([])
  const [monthlyStats, setMonthlyStats] = useState(initialMonthlyStats)
  const [editMonthlyStats, setEditMonthlyStats] = useState(initialMonthlyStats)

  useEffect(() => {
    const loadData = async () => {
      const data = await loadSiteData()
      console.log("[v0] 현황 페이지 CSV 데이터 로드됨:", data.length, "개 현장")
      setSiteData(data)

      // Calculate regional data
      const regionMap = groupByRegion(data)
      const totalSites = data.length
      const regional = Array.from(regionMap.entries()).map(([region, sites]) => ({
        region,
        sites: sites.length,
        percentage: (sites.length / totalSites) * 100,
      }))
      setRegionalData(regional)

      // Calculate industry data
      const industryMap = new Map<string, SiteData[]>()
      data.forEach((site) => {
        const industry = site.업태
        if (!industryMap.has(industry)) {
          industryMap.set(industry, [])
        }
        industryMap.get(industry)!.push(site)
      })

      const industry = Array.from(industryMap.entries()).map(([category, sites]) => ({
        category,
        sites: sites.length,
        units: sites.reduce((sum, site) => sum + site.실내기대수, 0),
      }))
      setIndustryData(industry)
    }
    loadData()
  }, [])

  const stats = calculateTotalStats(siteData)

  const handleEditMonthly = () => {
    setIsEditingMonthly(true)
    setEditMonthlyStats([...monthlyStats])
  }

  const handleSaveMonthly = () => {
    setMonthlyStats(editMonthlyStats)
    setIsEditingMonthly(false)
  }

  const handleCancelMonthly = () => {
    setIsEditingMonthly(false)
  }

  const getIndustryIcon = (category: string) => {
    if (category.includes("초중고")) return School
    if (category.includes("대학교")) return GraduationCap
    if (category.includes("오피스") || category.includes("빌딩")) return Building2
    if (category.includes("공장")) return Factory
    if (category.includes("상업") || category.includes("문화") || category.includes("상가")) return ShoppingBag
    if (category.includes("공공") || category.includes("종교")) return Landmark
    if (category.includes("숙박") || category.includes("호텔")) return Hotel
    return Building2
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">더욱 넓어진 에너지 현장</h2>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          전국 {stats.totalSites.toLocaleString()}개 현장에서 BECON cloud를 사용하고 있습니다
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">총 현장 수</div>
            <div className="mt-2 text-3xl font-bold text-primary">{stats.totalSites}</div>
            <div className="text-sm text-muted-foreground">site</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">실내기 대수</div>
            <div className="mt-2 text-3xl font-bold text-chart-2">{stats.totalIndoorUnits.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">대</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">절감량</div>
            <div className="mt-2 text-3xl font-bold text-chart-5">{stats.totalSavingsAmount.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">kWh</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">절감 금액</div>
            <div className="mt-2 text-3xl font-bold text-chart-3">{stats.totalSavingsCost.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">원</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">평균 절감률</div>
            <div className="mt-2 text-3xl font-bold text-chart-4">{stats.avgSavingsRate.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">탄소배출 절감</div>
            <div className="mt-2 text-3xl font-bold text-chart-1">
              {siteData.reduce((sum, site) => sum + site.탄소배출량, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">kg</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">지역별 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {regionalData.map((data) => (
              <div key={data.region} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-medium">{data.region}</span>
                </div>
                <div>
                  <div className="font-bold text-lg">{data.sites} site</div>
                  <div className="text-sm text-muted-foreground">{data.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">업태별 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {industryData.map((stat) => {
              const Icon = getIndustryIcon(stat.category)
              return (
                <div key={stat.category} className="p-6 bg-muted/50 rounded-lg space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-bold text-lg">{stat.category}</h4>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">현장</span>
                      <span className="font-semibold">{stat.sites} site</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">실내기</span>
                      <span className="font-semibold">{stat.units}대</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl">월별 에너지 절감 통계</CardTitle>
            {!isEditingMonthly ? (
              <Button
                onClick={handleEditMonthly}
                variant="outline"
                size="sm"
                className="text-xs md:text-sm bg-transparent"
              >
                <Pencil className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                수정
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSaveMonthly} size="sm" className="text-xs md:text-sm">
                  <Check className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  저장
                </Button>
                <Button
                  onClick={handleCancelMonthly}
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm bg-transparent"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  취소
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-semibold">구분</th>
                  <th className="text-right p-3 text-sm font-semibold">1월</th>
                  <th className="text-right p-3 text-sm font-semibold">2월</th>
                  <th className="text-right p-3 text-sm font-semibold">3월</th>
                  <th className="text-right p-3 text-sm font-semibold">4월</th>
                  <th className="text-right p-3 text-sm font-semibold">5월</th>
                  <th className="text-right p-3 text-sm font-semibold">6월</th>
                  <th className="text-right p-3 text-sm font-semibold">평균</th>
                </tr>
              </thead>
              <tbody>
                {(isEditingMonthly ? editMonthlyStats : monthlyStats).map((stat, rowIndex) => (
                  <tr key={stat.category} className="border-b border-border/50">
                    <td className="p-3 text-sm font-medium">{stat.category}</td>
                    {isEditingMonthly ? (
                      <>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].jan}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].jan = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].feb}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].feb = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].mar}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].mar = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].apr}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].apr = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].may}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].may = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].jun}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].jun = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].avg}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].avg = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 text-right text-sm">{stat.jan}</td>
                        <td className="p-3 text-right text-sm">{stat.feb}</td>
                        <td className="p-3 text-right text-sm">{stat.mar}</td>
                        <td className="p-3 text-right text-sm">{stat.apr}</td>
                        <td className="p-3 text-right text-sm">{stat.may}</td>
                        <td className="p-3 text-right text-sm">{stat.jun}</td>
                        <td className="p-3 text-right text-sm font-semibold text-primary">{stat.avg}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
