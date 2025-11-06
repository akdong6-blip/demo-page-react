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
  calculateTotalStats,
  BUSINESS_TYPES,
  SCALES,
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
  const [isBusinessTypeOpen, setIsBusinessTypeOpen] = useState(false)
  const [isScaleOpen, setIsScaleOpen] = useState(false)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [displayMode, setDisplayMode] = useState<"annual" | "monthly">("annual")

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

    setFilteredData(filtered)
    console.log("[v0] 필터 적용됨:", filtered.length, "개 레코드")
  }, [selectedBusinessTypes, selectedScales, allSiteData])

  const handleBusinessTypeToggle = (type: string) => {
    setSelectedBusinessTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleScaleToggle = (scale: string) => {
    setSelectedScales((prev) => (prev.includes(scale) ? prev.filter((s) => s !== scale) : [...prev, scale]))
  }

  const handleResetBusinessTypes = () => {
    setSelectedBusinessTypes([])
  }

  const handleResetScales = () => {
    setSelectedScales([])
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
  const divisor = displayMode === "annual" ? 1 : 12

  const avgSavingsAmount = stats.totalSites > 0 ? Math.round(stats.totalSavingsAmount / stats.totalSites / divisor) : 0
  const avgSavingsCost = stats.totalSites > 0 ? Math.round(stats.totalSavingsCost / stats.totalSites / divisor) : 0

  const avgBeforeCostPerSite =
    stats.totalSites > 0 ? Math.round((stats.totalBeforePower * avgRate) / stats.totalSites / divisor) : 0
  const avgAfterCostPerSite =
    stats.totalSites > 0 ? Math.round((stats.totalAfterPower * avgRate) / stats.totalSites / divisor) : 0
  const avgSavingsCostPerSite = avgBeforeCostPerSite - avgAfterCostPerSite

  const avgSavingsRateDisplay = stats.avgSavingsRate

  const getRateCategory = (rateKey: string) => {
    if (rateKey.startsWith("industrial")) return "industrial"
    if (rateKey.startsWith("general")) return "general"
    if (rateKey.startsWith("education")) return "education"
    return ""
  }

  const selectedCategory = getRateCategory(selectedRate)

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-lg-bold text-foreground">대시보드</h2>
          <p className="text-xs text-muted-foreground/70 font-lg-regular italic mt-1">
            * 데이터 출처: 2024년 개시 현장 중, 개시일부터 12개월간의 현장 실측 결과
          </p>
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

          {/* 통계 요약 */}
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-lg-bold text-muted-foreground">현장별 평균</span>
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={displayMode === "annual" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDisplayMode("annual")}
                  className={`h-7 px-3 text-xs ${
                    displayMode === "annual" ? "bg-[#8B1538] text-white hover:bg-[#8B1538]/90" : "hover:bg-transparent"
                  }`}
                >
                  연간
                </Button>
                <Button
                  variant={displayMode === "monthly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDisplayMode("monthly")}
                  className={`h-7 px-3 text-xs ${
                    displayMode === "monthly" ? "bg-[#8B1538] text-white hover:bg-[#8B1538]/90" : "hover:bg-transparent"
                  }`}
                >
                  월간
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg border border-gray-200">
              <div>
                <div className="text-xs text-muted-foreground mb-1 font-lg-regular">평균 절감량</div>
                <div className="text-xl font-lg-bold">{avgSavingsAmount.toLocaleString()} kWh</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1 font-lg-regular">평균 절감률</div>
                <div className="text-xl font-lg-bold">{stats.avgSavingsRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1 font-lg-regular">평균 절감금액</div>
                <div className="text-xl font-lg-bold">₩{avgSavingsCost.toLocaleString()}</div>
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

      <Card className="border border-gray-200 shadow-sm">
        <Collapsible open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="bg-gradient-to-r from-[#8B1538]/5 to-[#8B1538]/10 hover:from-[#8B1538]/10 hover:to-[#8B1538]/15 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg md:text-xl font-lg-bold">전기요금 계산기</CardTitle>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${isCalculatorOpen ? "rotate-180" : ""}`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* 연간/월간 토글 */}
                <div className="flex justify-end">
                  <div className="flex gap-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={displayMode === "annual" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setDisplayMode("annual")}
                      className={`h-7 px-3 text-xs ${
                        displayMode === "annual"
                          ? "bg-[#8B1538] text-white hover:bg-[#8B1538]/90"
                          : "hover:bg-transparent"
                      }`}
                    >
                      연간
                    </Button>
                    <Button
                      variant={displayMode === "monthly" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setDisplayMode("monthly")}
                      className={`h-7 px-3 text-xs ${
                        displayMode === "monthly"
                          ? "bg-[#8B1538] text-white hover:bg-[#8B1538]/90"
                          : "hover:bg-transparent"
                      }`}
                    >
                      월간
                    </Button>
                  </div>
                </div>

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
                      절감 전 전기요금 ({displayMode === "annual" ? "연간" : "월간"})
                    </div>
                    <div className="text-xl md:text-2xl font-lg-bold text-destructive">
                      ₩{avgBeforeCostPerSite.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-lg-regular">
                      {stats.totalSites > 0
                        ? Math.round(stats.totalBeforePower / stats.totalSites / divisor).toLocaleString()
                        : 0}{" "}
                      kWh
                    </div>
                  </div>
                  <div className="p-3 md:p-4 bg-muted rounded-lg">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1 font-lg-regular">
                      절감 후 전기요금 ({displayMode === "annual" ? "연간" : "월간"})
                    </div>
                    <div className="text-xl md:text-2xl font-lg-bold text-primary">
                      ₩{avgAfterCostPerSite.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-lg-regular">
                      {stats.totalSites > 0
                        ? Math.round(stats.totalAfterPower / stats.totalSites / divisor).toLocaleString()
                        : 0}{" "}
                      kWh
                    </div>
                  </div>
                  <div className="p-3 md:p-4 bg-chart-2/10 rounded-lg border-2 border-gray-200">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1 font-lg-regular">
                      총 절감 금액 ({displayMode === "annual" ? "연간" : "월간"})
                    </div>
                    <div className="text-xl md:text-2xl font-lg-bold text-chart-2">
                      ₩{avgSavingsCostPerSite.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-lg-regular">
                      절감률 {avgSavingsRateDisplay.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg md:text-xl font-lg-bold">전기요금표</CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {selectedCategory === "industrial" && "산업용전력(갑) I 요금제가 선택되었습니다"}
              {selectedCategory === "general" && "일반용전력(갑) I 요금제가 선택되었습니다"}
              {selectedCategory === "education" && "교육용전력(갑) 요금제가 선택되었습니다"}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className={selectedCategory === "industrial" ? "ring-2 ring-primary rounded-lg p-4" : ""}>
              <h4 className="font-semibold mb-3 text-sm md:text-base">산업용전력(갑) I</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">구분</th>
                      <th className="text-right p-2">기본요금(원/kW)</th>
                      <th className="text-right p-2">여름철(6~8월)</th>
                      <th className="text-right p-2">봄·가을철(3~5월, 9~10월)</th>
                      <th className="text-right p-2">겨울철(11~2월)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={`border-b border-border/50 ${selectedRate === "industrial_low" ? "bg-primary/10" : ""}`}
                    >
                      <td className="p-2">저압</td>
                      <td className="text-right p-2">5,550</td>
                      <td className="text-right p-2">107.7</td>
                      <td className="text-right p-2">68.1</td>
                      <td className="text-right p-2">109.7</td>
                    </tr>
                    <tr
                      className={`border-b border-border/50 ${selectedRate === "industrial_highA1" ? "bg-primary/10" : ""}`}
                    >
                      <td className="p-2" rowSpan={2}>
                        고압A
                      </td>
                      <td className="text-right p-2">6,490</td>
                      <td className="text-right p-2">116.3</td>
                      <td className="text-right p-2">92.6</td>
                      <td className="text-right p-2">116.2</td>
                    </tr>
                    <tr
                      className={`border-b border-border/50 ${selectedRate === "industrial_highA2" ? "bg-primary/10" : ""}`}
                    >
                      <td className="text-right p-2">7,470</td>
                      <td className="text-right p-2">111.5</td>
                      <td className="text-right p-2">88.0</td>
                      <td className="text-right p-2">109.7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={selectedCategory === "general" ? "ring-2 ring-primary rounded-lg p-4" : ""}>
              <h4 className="font-semibold mb-3 text-sm md:text-base">일반용전력(갑) I</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">구분</th>
                      <th className="text-right p-2">기본요금(원/kW)</th>
                      <th className="text-right p-2">여름철(6~8월)</th>
                      <th className="text-right p-2">봄·가을철(3~5월, 9~10월)</th>
                      <th className="text-right p-2">겨울철(11~2월)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={`border-b border-border/50 ${selectedRate === "general_low" ? "bg-primary/10" : ""}`}
                    >
                      <td className="p-2">저압</td>
                      <td className="text-right p-2">6,160</td>
                      <td className="text-right p-2">132.4</td>
                      <td className="text-right p-2">91.9</td>
                      <td className="text-right p-2">119.0</td>
                    </tr>
                    <tr
                      className={`border-b border-border/50 ${selectedRate === "general_highA1" ? "bg-primary/10" : ""}`}
                    >
                      <td className="p-2" rowSpan={2}>
                        고압A
                      </td>
                      <td className="text-right p-2">7,170</td>
                      <td className="text-right p-2">142.6</td>
                      <td className="text-right p-2">98.6</td>
                      <td className="text-right p-2">130.3</td>
                    </tr>
                    <tr
                      className={`border-b border-border/50 ${selectedRate === "general_highA2" ? "bg-primary/10" : ""}`}
                    >
                      <td className="text-right p-2">8,230</td>
                      <td className="text-right p-2">138.6</td>
                      <td className="text-right p-2">94.3</td>
                      <td className="text-right p-2">125.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={selectedCategory === "education" ? "ring-2 ring-primary rounded-lg p-4" : ""}>
              <h4 className="font-semibold mb-3 text-sm md:text-base">교육용전력(갑)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">구분</th>
                      <th className="text-right p-2">기본요금(원/kW)</th>
                      <th className="text-right p-2">여름철(6~8월)</th>
                      <th className="text-right p-2">봄·가을철(3~5월, 9~10월)</th>
                      <th className="text-right p-2">겨울철(11~2월)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={`border-b border-border/50 ${selectedRate === "education_low" ? "bg-primary/10" : ""}`}
                    >
                      <td className="p-2">저압</td>
                      <td className="text-right p-2">5,200</td>
                      <td className="text-right p-2">123.6</td>
                      <td className="text-right p-2">86.4</td>
                      <td className="text-right p-2">110.8</td>
                    </tr>
                    <tr
                      className={`border-b border-border/50 ${selectedRate === "education_highA1" ? "bg-primary/10" : ""}`}
                    >
                      <td className="p-2" rowSpan={2}>
                        고압A
                      </td>
                      <td className="text-right p-2">6,080</td>
                      <td className="text-right p-2">123.3</td>
                      <td className="text-right p-2">86.5</td>
                      <td className="text-right p-2">109.3</td>
                    </tr>
                    <tr
                      className={`border-b border-border/50 ${selectedRate === "education_highA2" ? "bg-primary/10" : ""}`}
                    >
                      <td className="text-right p-2">6,370</td>
                      <td className="text-right p-2">118.8</td>
                      <td className="text-right p-2">82.1</td>
                      <td className="text-right p-2">104.9</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
