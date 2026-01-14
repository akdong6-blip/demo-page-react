"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OverlappingPowerChart } from "@/components/charts/overlapping-power-chart"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import {
  loadSiteData,
  type SiteData,
  filterByBusinessType,
  filterByScale,
  filterByLogicVersion,
  calculateTotalStats,
  BUSINESS_TYPES,
  SCALES,
  LOGIC_VERSIONS,
} from "@/lib/csv-parser"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const electricityRates = {
  industrial_low: { base: 5550, summer: 107.7, spring: 68.1, winter: 109.7, label: "산업용전력(갑) I - 저압" },
  industrial_highA1: { base: 6490, summer: 116.3, spring: 92.6, winter: 116.2, label: "산업용전력(갑) I - 고압A" },
  industrial_highA2: { base: 7470, summer: 111.5, spring: 88.0, winter: 109.7, label: "산업용전력(갑) I - 고압A" },
  general_low: { base: 6160, summer: 132.4, spring: 91.9, winter: 119.0, label: "일반용전력(갑) I - 저압" },
  general_highA1: { base: 7170, summer: 142.6, spring: 98.6, winter: 130.3, label: "일반용전력(갑) I - 고압A" },
  general_highA2: { base: 8230, summer: 138.6, spring: 94.3, winter: 125.0, label: "일반용전력(갑) I - 고압A" },
  education_low: { base: 5200, summer: 123.6, spring: 86.4, winter: 110.8, label: "교육용전력(갑) - 저압" },
  education_highA1: { base: 6080, summer: 123.3, spring: 86.5, winter: 109.3, label: "교육용전력(갑) - 고압A" },
  education_highA2: { base: 6370, summer: 118.8, spring: 82.1, winter: 104.9, label: "교육용전력(갑) - 고압A" },
}

export function DashboardContent() {
  const [showBaseline, setShowBaseline] = useState(true)
  const [showSavings, setShowSavings] = useState(false)
  const [showComfort, setShowComfort] = useState(false)
  const [showLearning, setShowLearning] = useState(false)
  const [selectedRate, setSelectedRate] = useState<keyof typeof electricityRates>("industrial_low")
  const [allSiteData, setAllSiteData] = useState<SiteData[]>([])
  const [filteredData, setFilteredData] = useState<SiteData[]>([])
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([])
  const [selectedScales, setSelectedScales] = useState<string[]>([])
  const [selectedLogicVersions, setSelectedLogicVersions] = useState<number[]>([])
  const [isBusinessTypeOpen, setIsBusinessTypeOpen] = useState(false)
  const [isScaleOpen, setIsScaleOpen] = useState(false)
  const [isLogicOpen, setIsLogicOpen] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const data = await loadSiteData()
      console.log("[v0] CSV 데이터 로드됨:", data.length, "개 레코드")
      setAllSiteData(data)
      setFilteredData(data)
    }
    loadData()
  }, [])

  useEffect(() => {
    let filtered = allSiteData

    if (selectedBusinessTypes.length > 0) {
      filtered = filterByBusinessType(filtered, selectedBusinessTypes)
    }

    if (selectedScales.length > 0) {
      filtered = filterByScale(filtered, selectedScales)
    }

    if (selectedLogicVersions.length > 0) {
      filtered = filterByLogicVersion(filtered, selectedLogicVersions)
    }

    setFilteredData(filtered)
    console.log("[v0] 필터 적용됨:", filtered.length, "개 레코드")
  }, [selectedBusinessTypes, selectedScales, selectedLogicVersions, allSiteData])

  const handleBusinessTypeToggle = (type: string) => {
    setSelectedBusinessTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleScaleToggle = (scale: string) => {
    setSelectedScales((prev) => (prev.includes(scale) ? prev.filter((s) => s !== scale) : [...prev, scale]))
  }

  const handleLogicVersionToggle = (version: number) => {
    setSelectedLogicVersions((prev) =>
      prev.includes(version) ? prev.filter((v) => v !== version) : [...prev, version],
    )
  }

  const getSeasonRate = (month: number) => {
    if (month >= 6 && month <= 8) return electricityRates[selectedRate].summer
    if (month >= 11 || month <= 2) return electricityRates[selectedRate].winter
    return electricityRates[selectedRate].spring
  }

  const avgRate =
    filteredData.length > 0
      ? filteredData.reduce((sum, d) => sum + getSeasonRate(d.월), 0) / filteredData.length
      : electricityRates[selectedRate].summer

  const stats = calculateTotalStats(filteredData)

  const avgSavingsAmount = stats.perSiteStats.avgMonthlyAmountPerSite
  const avgSavingsCost = stats.perSiteStats.avgMonthlyCostPerSite
  const avgSavingsCostPerIndoorUnit = stats.perSiteStats.avgMonthlyCostPerIndoorUnit
  const avgSavingsRate = stats.perSiteStats.avgSavingsRate

  console.log("[v0] 대시보드 통계:")
  console.log("[v0] - 현장당 월평균 절감량:", avgSavingsAmount, "kWh")
  console.log("[v0] - 현장당 월평균 절감금액:", avgSavingsCost, "원")
  console.log("[v0] - 실내기당 월평균 절감금액:", avgSavingsCostPerIndoorUnit, "원")
  console.log("[v0] - 평균 절감률:", avgSavingsRate.toFixed(1), "%")

  // 현장별 월평균 비절감 전력량 계산 (calculatePerSiteStats와 동일 로직)
  const avgBeforePowerPerSite =
    stats.totalSites > 0
      ? Math.round(avgSavingsAmount / (avgSavingsRate / 100)) // 절감량 / 절감률 = 비절감 전력량
      : 0
  const avgAfterPowerPerSite = avgBeforePowerPerSite - avgSavingsAmount // 비절감 - 절감량 = 절감 후 전력량

  // 전기요금 계산기용 금액 계산
  const avgBeforeCostPerSite = Math.round(avgBeforePowerPerSite * avgRate)
  const avgAfterCostPerSite = Math.round(avgAfterPowerPerSite * avgRate)
  const avgSavingsCostPerSite = avgBeforeCostPerSite - avgAfterCostPerSite

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-lg-bold text-foreground">대시보드</h2>
          <p className="text-xs text-muted-foreground/70 font-lg-regular italic mt-1">* 월별 절감데이터 기준</p>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-lg-bold">검색 조건</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedBusinessTypes([])
                setSelectedScales([])
                setSelectedLogicVersions([])
              }}
              className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
            >
              전체 초기화
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {/* 업태별 필터 */}
          <Collapsible open={isBusinessTypeOpen} onOpenChange={setIsBusinessTypeOpen}>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-lg-bold text-sm">업태별</span>
                  <span className="text-xs text-muted-foreground font-lg-regular">
                    {selectedBusinessTypes.length === 0
                      ? "(전체 데이터)"
                      : `(${selectedBusinessTypes.length}개 선택됨)`}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${isBusinessTypeOpen ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 py-3 border-t border-gray-200 bg-muted/30">
                  <div className="flex flex-wrap gap-2">
                    {BUSINESS_TYPES.map((type) => (
                      <label
                        key={type}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all ${
                          selectedBusinessTypes.includes(type)
                            ? "bg-[#8B1538] text-white border-[#8B1538]"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedBusinessTypes.includes(type)}
                          onCheckedChange={() => handleBusinessTypeToggle(type)}
                          className="hidden"
                        />
                        <span className="text-sm font-lg-regular">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* 규모별 필터 */}
          <Collapsible open={isScaleOpen} onOpenChange={setIsScaleOpen}>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-lg-bold text-sm">규모별</span>
                  <span className="text-xs text-muted-foreground font-lg-regular">
                    {selectedScales.length === 0 ? "(전체 데이터)" : `(${selectedScales.length}개 선택됨)`}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${isScaleOpen ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 py-3 border-t border-gray-200 bg-muted/30">
                  <div className="flex flex-wrap gap-2">
                    {SCALES.map((scale) => (
                      <label
                        key={scale}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all ${
                          selectedScales.includes(scale)
                            ? "bg-[#8B1538] text-white border-[#8B1538]"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Checkbox
                          id={`scale-${scale}`}
                          checked={selectedScales.includes(scale)}
                          onCheckedChange={() => handleScaleToggle(scale)}
                          className="hidden"
                        />
                        <span className="text-sm font-lg-regular">{scale}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-muted-foreground font-lg-regular">
                      <span className="font-medium">실내기 기준:</span> 소형(30대 미만) | 중소형(30~50대 미만) |
                      중형(50~100대 미만) | 대형(100대 이상)
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Collapsible open={isLogicOpen} onOpenChange={setIsLogicOpen}>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="font-lg-bold text-sm">로직버전</span>
                  <span className="text-xs text-muted-foreground font-lg-regular">
                    {selectedLogicVersions.length === 0
                      ? "(전체 데이터)"
                      : `(${selectedLogicVersions.length}개 선택됨)`}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${isLogicOpen ? "rotate-180" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 py-3 border-t border-gray-200 bg-muted/30">
                  <div className="flex flex-wrap gap-2">
                    {LOGIC_VERSIONS.map((version) => (
                      <label
                        key={version}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all ${
                          selectedLogicVersions.includes(version)
                            ? "bg-[#8B1538] text-white border-[#8B1538]"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Checkbox
                          id={`logic-${version}`}
                          checked={selectedLogicVersions.includes(version)}
                          onCheckedChange={() => handleLogicVersionToggle(version)}
                          className="hidden"
                        />
                        <span className="text-sm font-lg-regular">로직 {version}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-lg-bold text-muted-foreground">현장별 월평균</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-muted/30 rounded-lg border border-gray-200">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-lg-regular">현장수</div>
                <div className="text-xl font-lg-bold">
                  {stats.totalSites.toLocaleString()}{" "}
                  <span className="text-sm font-lg-regular text-muted-foreground">site</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-lg-regular">평균 절감량</div>
                <div className="text-xl font-lg-bold">{avgSavingsAmount.toLocaleString()} kWh</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-lg-regular">평균 절감률</div>
                <div className="text-xl font-lg-bold">{avgSavingsRate.toFixed(1)}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-lg-regular whitespace-nowrap">월 평균 절감금액</div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-lg-bold">₩{avgSavingsCost.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground font-lg-regular">
                    연 환산 ₩{(avgSavingsCost * 12).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-lg-regular whitespace-nowrap">
                  월 평균 실내기당 절감금액
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-lg-bold">₩{avgSavingsCostPerIndoorUnit.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground font-lg-regular">
                    연 환산 ₩{(avgSavingsCostPerIndoorUnit * 12).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg md:text-xl font-lg-bold">전력량 사용 비교 분석(예시)</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="default"
                size="sm"
                disabled
                className="text-xs opacity-100 cursor-default bg-red-500 hover:bg-red-500"
              >
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3" />
                  제어 전
                </span>
              </Button>
              <Button
                variant={showSavings ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSavings(!showSavings)}
                className={`text-xs transition-all duration-300 hover:scale-105 ${
                  showSavings ? "bg-primary hover:bg-primary/90" : "border-primary text-primary hover:bg-primary/10"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {showSavings && <Check className="w-3 h-3" />}
                  절감 제어
                </span>
              </Button>
              <Button
                variant={showComfort ? "default" : "outline"}
                size="sm"
                onClick={() => setShowComfort(!showComfort)}
                className={`text-xs transition-all duration-300 hover:scale-105 ${
                  showComfort
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {showComfort && <Check className="w-3 h-3" />}
                  쾌적도 반영
                </span>
              </Button>
              <Button
                variant={showLearning ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLearning(!showLearning)}
                className={`text-xs transition-all duration-300 hover:scale-105 ${
                  showLearning
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "border-purple-500 text-purple-500 hover:bg-purple-50"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {showLearning && <Check className="w-3 h-3" />}
                  학습 데이터
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <OverlappingPowerChart
            showBaseline={showBaseline}
            showSavings={showSavings}
            showComfort={showComfort}
            showLearning={showLearning}
          />
        </CardContent>
      </Card>

      {/* 전기요금 계산기 섹션 - 수정 */}
      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <Collapsible defaultOpen={false}>
          <CollapsibleTrigger asChild>
            <CardHeader className="bg-gradient-to-r from-[#8B1538]/5 to-[#8B1538]/10 cursor-pointer hover:bg-[#8B1538]/10 transition-colors">
              <CardTitle className="text-lg md:text-xl font-lg-bold flex items-center justify-between">
                전기요금 계산기
                <ChevronDown className="h-5 w-5 transition-transform" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* 요금제 선택 */}
                <div>
                  <label className="text-xs md:text-sm font-medium mb-2 block">요금제 선택</label>
                  <select
                    className="w-full px-3 md:px-4 py-2 bg-card border border-border rounded-lg text-xs md:text-sm"
                    value={selectedRate}
                    onChange={(e) => setSelectedRate(e.target.value as keyof typeof electricityRates)}
                  >
                    {Object.entries(electricityRates).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-3 md:p-4 bg-muted rounded-lg">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1 font-lg-regular">
                      절감 전 전기요금 (월평균)
                    </div>
                    <div className="text-xl md:text-2xl font-lg-bold text-destructive">
                      ₩{avgBeforeCostPerSite.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-lg-regular">
                      {Math.round(avgBeforePowerPerSite).toLocaleString()} kWh
                    </div>
                  </div>
                  <div className="p-3 md:p-4 bg-muted rounded-lg">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1 font-lg-regular">
                      절감 후 전기요금 (월평균)
                    </div>
                    <div className="text-xl md:text-2xl font-lg-bold text-chart-2">
                      ₩{avgAfterCostPerSite.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-lg-regular">
                      {Math.round(avgAfterPowerPerSite).toLocaleString()} kWh
                    </div>
                  </div>
                  <div className="p-3 md:p-4 bg-muted rounded-lg">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1 font-lg-regular">
                      총 절감 금액 (월평균)
                    </div>
                    <div className="text-xl md:text-2xl font-lg-bold text-chart-3">
                      ₩{avgSavingsCostPerSite.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-lg-regular">
                      절감률 {avgSavingsRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="border border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#8B1538]/5 to-[#8B1538]/10">
          <CardTitle className="text-lg md:text-xl font-lg-bold">전기요금표 (kWh당)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 md:p-3 text-left font-lg-bold border-b">요금제</th>
                  <th className="p-2 md:p-3 text-right font-lg-bold border-b">기본요금</th>
                  <th className="p-2 md:p-3 text-right font-lg-bold border-b text-red-600">여름</th>
                  <th className="p-2 md:p-3 text-right font-lg-bold border-b text-green-600">봄/가을</th>
                  <th className="p-2 md:p-3 text-right font-lg-bold border-b text-blue-600">겨울</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(electricityRates).map(([key, rate]) => (
                  <tr key={key} className={`border-b hover:bg-muted/30 ${selectedRate === key ? "bg-primary/10" : ""}`}>
                    <td className="p-2 md:p-3 font-lg-regular">{rate.label}</td>
                    <td className="p-2 md:p-3 text-right font-lg-regular">₩{rate.base.toLocaleString()}</td>
                    <td className="p-2 md:p-3 text-right font-lg-regular text-red-600">₩{rate.summer}</td>
                    <td className="p-2 md:p-3 text-right font-lg-regular text-green-600">₩{rate.spring}</td>
                    <td className="p-2 md:p-3 text-right font-lg-regular text-blue-600">₩{rate.winter}</td>
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
