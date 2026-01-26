"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Calculator, TrendingDown, Info } from "lucide-react"
import {
  loadSiteData,
  filterByBusinessType,
  filterByScale,
  filterByLogicVersion,
  calculatePerSiteStats,
  BUSINESS_TYPES,
  SCALES,
  type SiteData,
} from "@/lib/csv-parser"

// 기본 요금표 (기본요금 / 냉전모델 요금)
const DEFAULT_PRICING_TABLE = {
  기본요금: { normal: 11000, cooling: 11000 },
  "보장50%": { normal: 32000, cooling: 29000 },
  보장1: { normal: 40000, cooling: 34000 },
  보장2: { normal: 54000, cooling: 42000 },
  보장3: { normal: 67000, cooling: 49000 },
}

type PricingPlan = keyof typeof DEFAULT_PRICING_TABLE
type PricingTable = typeof DEFAULT_PRICING_TABLE

const PRICING_TABLE = DEFAULT_PRICING_TABLE; // Declare PRICING_TABLE variable

export default function CalculatorPage() {
  const [allData, setAllData] = useState<SiteData[]>([])
  const [loading, setLoading] = useState(true)

  // 필터 상태
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("")
  const [selectedScale, setSelectedScale] = useState<string>("")
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>("기본요금")
  const [isCoolingModel, setIsCoolingModel] = useState(false)
  const [indoorUnitCount, setIndoorUnitCount] = useState<number>(30)
  const [pricingTable, setPricingTable] = useState<PricingTable>(DEFAULT_PRICING_TABLE)

  // 로직 계산 상태
  const [isLogic1Fallback, setIsLogic1Fallback] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const data = await loadSiteData()
      setAllData(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  // 선택된 조건에 따른 실내기당 연간 환산 절감금액 계산
  const calculatedStats = useMemo(() => {
    if (allData.length === 0 || !selectedBusinessType || !selectedScale) {
      return { annualSavingsPerUnit: 0, isLogic1: false }
    }

    // 업태, 규모 필터링
    let filteredData = filterByBusinessType(allData, [selectedBusinessType])
    filteredData = filterByScale(filteredData, [selectedScale])

    // 로직2 우선, 없으면 로직1
    let logic2Data = filterByLogicVersion(filteredData, [2])
    let isLogic1 = false

    if (logic2Data.length === 0) {
      logic2Data = filterByLogicVersion(filteredData, [1])
      isLogic1 = logic2Data.length > 0
    }

    if (logic2Data.length === 0) {
      return { annualSavingsPerUnit: 0, isLogic1: false }
    }

    const stats = calculatePerSiteStats(logic2Data)
    // 월평균 실내기당 절감금액 * 12 = 연간 환산 절감금액
    const annualSavingsPerUnit = stats.avgMonthlyCostPerIndoorUnit * 12

    return { annualSavingsPerUnit, isLogic1 }
  }, [allData, selectedBusinessType, selectedScale])

  useEffect(() => {
    setIsLogic1Fallback(calculatedStats.isLogic1)
  }, [calculatedStats.isLogic1])

  // 요금 수정 핸들러
  const handlePriceChange = (plan: PricingPlan, type: "normal" | "cooling", value: number) => {
    setPricingTable((prev) => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [type]: value,
      },
    }))
  }

  // 계산된 금액들
  const unitPrice = isCoolingModel
    ? pricingTable[selectedPlan].cooling
    : pricingTable[selectedPlan].normal

  const originalMaintenanceCost = unitPrice * indoorUnitCount
  const expectedSavings = calculatedStats.annualSavingsPerUnit * indoorUnitCount
  const energyProductPrice = Math.round(expectedSavings * 0.2) // 절감금액의 20%
  const renewalPrice = originalMaintenanceCost + energyProductPrice
  const effectivePrice = renewalPrice - expectedSavings // 실질적 체감 상품가

  const hasValidSelection = selectedBusinessType && selectedScale

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="w-7 h-7" />
            견적 계산기
          </h1>
          <p className="text-sm text-muted-foreground">
            본 결과는 현장별 평균 데이터를 기반으로 예측된 것으로, 실제 현장에 따라 달라질 수 있으니 참고용으로만 보시고 1년간 에너지 절감 무상 체험을 통해 직접 효과를 확인해보시길 권장드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 입력 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>조건 설정</CardTitle>
              <CardDescription>업태, 규모, 요금제를 선택하고 실내기 대수를 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 업태 선택 */}
              <div className="space-y-2">
                <Label>업태</Label>
                <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
                  <SelectTrigger>
                    <SelectValue placeholder="업태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 규모 선택 */}
              <div className="space-y-2">
                <Label>규모</Label>
                <Select value={selectedScale} onValueChange={setSelectedScale}>
                  <SelectTrigger>
                    <SelectValue placeholder="규모를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCALES.map((scale) => (
                      <SelectItem key={scale} value={scale}>
                        {scale}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* 요금제 선택 */}
              <div className="space-y-2">
                <Label>요금제 선택</Label>
                <Select value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as PricingPlan)}>
                  <SelectTrigger>
                    <SelectValue placeholder="요금제를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(pricingTable).map((plan) => (
                      <SelectItem key={plan} value={plan}>
                        {plan} ({pricingTable[plan as PricingPlan].normal.toLocaleString()}원)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 냉전모델 여부 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>냉전모델</Label>
                  <p className="text-xs text-muted-foreground">냉전모델 요금제 적용</p>
                </div>
                <Switch checked={isCoolingModel} onCheckedChange={setIsCoolingModel} />
              </div>

              <Separator />

              {/* 실내기 대수 입력 */}
              <div className="space-y-2">
                <Label>실내기 대수</Label>
                <Input
                  type="number"
                  min={1}
                  value={indoorUnitCount}
                  onChange={(e) => setIndoorUnitCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  placeholder="실내기 대수 입력"
                />
                <p className="text-xs text-muted-foreground">현장의 실내기 대수를 입력하세요.</p>
              </div>

              {/* 요금표 (수정 가능) */}
              <div className="p-3 rounded-lg bg-muted/30 border">
                <p className="text-xs font-medium text-muted-foreground mb-2">요금표 (실내기당 월 요금, 수정 가능)</p>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="font-medium">상품</div>
                  <div className="text-right font-medium">일반</div>
                  <div className="text-right font-medium text-cyan-600">냉전</div>
                  {Object.entries(pricingTable).map(([plan, prices]) => (
                    <div key={plan} className="contents">
                      <div className="text-muted-foreground py-1">{plan}</div>
                      <div className="text-right">
                        <Input
                          type="number"
                          value={prices.normal}
                          onChange={(e) => handlePriceChange(plan as PricingPlan, "normal", Number(e.target.value) || 0)}
                          className="h-6 w-20 text-xs text-right px-1 ml-auto"
                        />
                      </div>
                      <div className="text-right">
                        <Input
                          type="number"
                          value={prices.cooling}
                          onChange={(e) => handlePriceChange(plan as PricingPlan, "cooling", Number(e.target.value) || 0)}
                          className="h-6 w-20 text-xs text-right px-1 ml-auto text-cyan-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 로직1 사용 알림 */}
              {isLogic1Fallback && hasValidSelection && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-500">로직1로 계산됨</p>
                    <p className="text-muted-foreground">
                      선택한 조건의 로직2 데이터가 없어 로직1 데이터로 계산되었습니다.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 결과 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>계산 결과</CardTitle>
              <CardDescription>
                {hasValidSelection
                  ? `${selectedBusinessType} / ${selectedScale} 기준 계산 결과`
                  : "업태와 규모를 선택하면 결과가 표시됩니다."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!hasValidSelection ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Info className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">업태와 규모를 선택해주세요.</p>
                </div>
              ) : (
                <>
                  {/* 적용 요금 */}
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">적용 요금 (실내기당)</span>
                      <Badge variant="secondary">{isCoolingModel ? "냉전모델" : "일반"}</Badge>
                    </div>
                    <p className="text-2xl font-bold">{unitPrice.toLocaleString()}원</p>
                  </div>

                  {/* 원래 유지보수금액 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">원래 유지보수금액</span>
                      <span className="font-medium">{originalMaintenanceCost.toLocaleString()}원</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedPlan} {unitPrice.toLocaleString()}원 × {indoorUnitCount}대
                    </p>
                  </div>

                  <Separator />

                  {/* 절감금액 예상 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">예상 절감금액 (연간)</span>
                      <span className="font-bold text-chart-3">{Math.round(expectedSavings).toLocaleString()}원</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      1년간 무상 체험 후 예상되는 에너지 절감 금액입니다.
                      <br />
                      (실내기당 연간 {Math.round(calculatedStats.annualSavingsPerUnit).toLocaleString()}원 × {indoorUnitCount}대)
                    </p>
                  </div>

                  {/* 재계약 시 에너지 상품가격 */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">재계약 시 에너지 상품가격</span>
                      <span className="font-medium text-amber-500">{energyProductPrice.toLocaleString()}원</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      재계약 시 예상 절감금액의 20%를 에너지 서비스 비용으로 책정합니다.
                      <br />
                      절감 효과를 직접 확인하신 후, 그 가치의 일부만 지불하시면 됩니다.
                    </p>
                  </div>

                  <Separator />

                  {/* 에너지 포함 재계약시 상품가 */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">에너지 포함 재계약 시 상품가</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">{renewalPrice.toLocaleString()}원</p>
                    <p className="text-xs text-muted-foreground">
                      기존 유지보수금액({originalMaintenanceCost.toLocaleString()}원)에 에너지 상품가격({energyProductPrice.toLocaleString()}원)을 더한 금액입니다.
                      <br />
                      재계약 시 실제로 청구되는 금액입니다.
                    </p>
                  </div>

                  {/* 실질적 체감 상품가 */}
                  <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20 space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-chart-3" />
                      <span className="text-sm font-medium">실질적 체감 상품가</span>
                    </div>
                    <p className="text-2xl font-bold text-chart-3">{Math.round(effectivePrice).toLocaleString()}원</p>
                    <p className="text-xs text-muted-foreground">
                      에너지 포함 재계약 시 상품가({renewalPrice.toLocaleString()}원)에서 예상 절감금액({Math.round(expectedSavings).toLocaleString()}원)을 빼면,
                      <br />
                      <strong>고객이 실질적으로 체감하는 비용은 {Math.round(effectivePrice).toLocaleString()}원</strong>입니다.
                      <br />
                      에너지 절감으로 돌려받는 금액을 고려하면, 실제 부담은 이 정도입니다.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
