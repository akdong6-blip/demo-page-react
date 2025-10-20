"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Factory, School, Hotel, ShoppingBag, Landmark, GraduationCap } from "lucide-react"
import { loadSiteData, groupByRegion, calculateTotalStats, type SiteData } from "@/lib/csv-parser"

export function StatusContent() {
  const [siteData, setSiteData] = useState<SiteData[]>([])
  const [regionalData, setRegionalData] = useState<Array<{ region: string; sites: number; percentage: number }>>([])
  const [industryData, setIndustryData] = useState<Array<{ category: string; sites: number; units: number }>>([])

  useEffect(() => {
    const loadData = async () => {
      const data = await loadSiteData()
      console.log("[v0] 현황 페이지 CSV 데이터 로드됨:", data.length, "개 현장")
      setSiteData(data)

      const regionMap = groupByRegion(data)
      const totalSites = data.length
      const regional = Array.from(regionMap.entries())
        .map(([region, sites]) => ({
          region,
          sites: sites.length,
          percentage: (sites.length / totalSites) * 100,
        }))
        .sort((a, b) => b.sites - a.sites)
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
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-lg-bold text-foreground">더욱 넓어진 에너지 현장</h2>
        <p className="text-base md:text-lg text-muted-foreground font-lg-regular">
          전국 {stats.totalSites.toLocaleString()}개 현장에서 BECON cloud를 사용하고 있습니다
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
            <div className="text-4xl font-lg-bold text-chart-5">{stats.totalSavingsAmount.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-1 font-lg-regular">kWh</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-sm text-muted-foreground mb-2 font-lg-regular">절감 금액</div>
            <div className="text-4xl font-lg-bold text-chart-3">{stats.totalSavingsCost.toLocaleString()}</div>
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
    </div>
  )
}
