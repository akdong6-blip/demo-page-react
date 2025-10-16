"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteStats } from "@/components/site-stats"
import { CostSummary } from "@/components/cost-summary"
import { OverlappingPowerChart } from "@/components/charts/overlapping-power-chart"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const industries = [
  { value: "all", label: "전체" },
  { value: "industrial", label: "공업" },
  { value: "commercial", label: "상업" },
  { value: "cultural", label: "문화시설" },
  { value: "university", label: "대학교" },
  { value: "office", label: "오피스" },
  { value: "school", label: "초중고" },
]

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
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [showBaseline, setShowBaseline] = useState(true)
  const [showSavings, setShowSavings] = useState(false)
  const [showComfort, setShowComfort] = useState(false)
  const [showLearning, setShowLearning] = useState(false)
  const [selectedRate, setSelectedRate] = useState<keyof typeof electricityRates>("industrial_low")
  const [season, setSeason] = useState<"summer" | "spring" | "winter">("summer")

  const calculateCost = (kwh: number) => {
    const rate = electricityRates[selectedRate]
    const energyRate = rate[season]
    return Math.round(kwh * energyRate)
  }

  const baselineUsage = 15000
  const savingsUsage = 12000
  const savingsAmount = calculateCost(baselineUsage) - calculateCost(savingsUsage)
  const savingsRate = (((baselineUsage - savingsUsage) / baselineUsage) * 100).toFixed(1)

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
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">대시보드</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <select
            className="px-3 md:px-4 py-2 bg-card border border-border rounded-lg text-xs md:text-sm font-medium"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            {industries.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SiteStats industry={selectedIndustry} />

      <CostSummary
        industry={selectedIndustry}
        beforeCost={calculateCost(baselineUsage)}
        afterCost={calculateCost(savingsUsage)}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">전기요금 계산기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="text-xs md:text-sm font-medium mb-2 block">계절 선택</label>
                <select
                  className="w-full px-3 md:px-4 py-2 bg-card border border-border rounded-lg text-xs md:text-sm"
                  value={season}
                  onChange={(e) => setSeason(e.target.value as "summer" | "spring" | "winter")}
                >
                  <option value="summer">여름철 (6~8월)</option>
                  <option value="spring">봄·가을철 (3~5월, 9~10월)</option>
                  <option value="winter">겨울철 (11~2월)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-3 md:p-4 bg-muted rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground mb-1">제어 전 전기요금</div>
                <div className="text-xl md:text-2xl font-bold text-destructive">
                  {calculateCost(baselineUsage).toLocaleString()}원
                </div>
                <div className="text-xs text-muted-foreground mt-1">{baselineUsage.toLocaleString()} kWh</div>
              </div>
              <div className="p-3 md:p-4 bg-muted rounded-lg">
                <div className="text-xs md:text-sm text-muted-foreground mb-1">절감 후 전기요금</div>
                <div className="text-xl md:text-2xl font-bold text-primary">
                  {calculateCost(savingsUsage).toLocaleString()}원
                </div>
                <div className="text-xs text-muted-foreground mt-1">{savingsUsage.toLocaleString()} kWh</div>
              </div>
              <div className="p-3 md:p-4 bg-chart-2/10 rounded-lg border-2 border-chart-2">
                <div className="text-xs md:text-sm text-muted-foreground mb-1">절감 금액</div>
                <div className="text-xl md:text-2xl font-bold text-chart-2">{savingsAmount.toLocaleString()}원</div>
                <div className="text-xs text-muted-foreground mt-1">절감률 {savingsRate}%</div>
              </div>
            </div>

            <div className="mt-4 p-3 md:p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-xs md:text-sm font-medium text-primary mb-2">선택한 요금제 정보</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">기본요금:</span>{" "}
                  <span className="font-semibold">{electricityRates[selectedRate].base.toLocaleString()}원/kW</span>
                </div>
                <div>
                  <span className="text-muted-foreground">여름철:</span>{" "}
                  <span className="font-semibold">{electricityRates[selectedRate].summer} 원/kWh</span>
                </div>
                <div>
                  <span className="text-muted-foreground">봄·가을철:</span>{" "}
                  <span className="font-semibold">{electricityRates[selectedRate].spring} 원/kWh</span>
                </div>
                <div>
                  <span className="text-muted-foreground">겨울철:</span>{" "}
                  <span className="font-semibold">{electricityRates[selectedRate].winter} 원/kWh</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg md:text-xl">전력량 사용 비교 분석</CardTitle>
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
                  showSavings ? "bg-blue-500 hover:bg-blue-600" : "border-blue-500 text-blue-500 hover:bg-blue-50"
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
            industry={selectedIndustry}
            showBaseline={showBaseline}
            showSavings={showSavings}
            showComfort={showComfort}
            showLearning={showLearning}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">전기요금표</CardTitle>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {selectedCategory === "industrial" && "산업용전력(갑) I 요금제가 선택되었습니다"}
            {selectedCategory === "general" && "일반용전력(갑) I 요금제가 선택되었습니다"}
            {selectedCategory === "education" && "교육용전력(갑) 요금제가 선택되었습니다"}
          </p>
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
