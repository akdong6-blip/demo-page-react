"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface OverlappingPowerChartProps {
  industry: string
  showBaseline: boolean
  showSavings: boolean
  showComfort: boolean
  showLearning: boolean
}

// 시간대별 데이터 생성 함수
const generateHourlyData = (industry: string) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return hours.map((hour) => {
    // 기본 패턴: 오전 9-10시, 오후 1-2시에 피크
    const isPeakMorning = hour >= 9 && hour <= 10
    const isPeakAfternoon = hour >= 13 && hour <= 14
    const isNight = hour >= 22 || hour <= 6

    // 업종별 기본 전력 사용량
    const baseMultiplier =
      {
        all: 1.0,
        industrial: 1.5,
        commercial: 1.2,
        cultural: 0.9,
        university: 1.1,
        office: 1.0,
        school: 0.8,
      }[industry] || 1.0

    // 제어 전 전력량 (기본)
    let baseline = 100 * baseMultiplier
    if (isPeakMorning || isPeakAfternoon) baseline *= 1.8
    else if (isNight) baseline *= 0.4
    else baseline *= 0.6 + Math.random() * 0.4

    // 절감 제어 후 전력량 (15-25% 감소)
    const savingsReduction = 0.15 + Math.random() * 0.1
    const savings = baseline * (1 - savingsReduction)

    // 쾌적도 반영 (피크 시간대에 5-10% 증가, 나머지는 절감 제어와 동일)
    let comfort = savings
    if (isPeakMorning || isPeakAfternoon) {
      comfort = savings * (1 + 0.05 + Math.random() * 0.05)
    }

    // 학습 데이터 (1일 학습 후 최적화, 절감 제어보다 3-5% 더 효율적)
    const learning = savings * (1 - 0.03 - Math.random() * 0.02)

    return {
      time: `${hour.toString().padStart(2, "0")}:00`,
      baseline: Math.round(baseline),
      savings: Math.round(savings),
      comfort: Math.round(comfort),
      learning: Math.round(learning),
    }
  })
}

export function OverlappingPowerChart({
  industry,
  showBaseline,
  showSavings,
  showComfort,
  showLearning,
}: OverlappingPowerChartProps) {
  const data = useMemo(() => generateHourlyData(industry), [industry])

  const hasSelection = showBaseline || showSavings || showComfort || showLearning

  return (
    <div className="space-y-4">
      {!hasSelection && <div className="text-center text-muted-foreground py-8">최소 하나의 데이터를 선택해주세요</div>}
      {hasSelection && (
        <>
          <div className="h-[400px] animate-in fade-in duration-500">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                  label={{ value: "전력량 (kWh)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />

                {showBaseline && (
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="제어 전"
                    dot={false}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                  />
                )}

                {showSavings && (
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="절감 제어"
                    dot={false}
                    animationDuration={1000}
                    animationBegin={200}
                    animationEasing="ease-in-out"
                  />
                )}

                {showComfort && (
                  <Line
                    type="monotone"
                    dataKey="comfort"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="쾌적도 반영"
                    dot={false}
                    animationDuration={1000}
                    animationBegin={400}
                    animationEasing="ease-in-out"
                  />
                )}

                {showLearning && (
                  <Line
                    type="monotone"
                    dataKey="learning"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="학습 데이터 (1일)"
                    dot={false}
                    animationDuration={1000}
                    animationBegin={600}
                    animationEasing="ease-in-out"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t animate-in fade-in duration-700">
            {showBaseline && (
              <div className="space-y-1 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium">제어 전</span>
                </div>
                <p className="text-2xl font-bold">
                  {Math.round(data.reduce((sum, d) => sum + d.baseline, 0) / 24)} kWh
                </p>
                <p className="text-xs text-muted-foreground">평균 시간당 사용량</p>
              </div>
            )}

            {showSavings && (
              <div className="space-y-1 animate-in slide-in-from-bottom-4 duration-500 delay-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium">절감 제어</span>
                </div>
                <p className="text-2xl font-bold">{Math.round(data.reduce((sum, d) => sum + d.savings, 0) / 24)} kWh</p>
                <p className="text-xs text-muted-foreground">
                  {showBaseline &&
                    `↓ ${Math.round((1 - data.reduce((sum, d) => sum + d.savings, 0) / data.reduce((sum, d) => sum + d.baseline, 0)) * 100)}% 절감`}
                </p>
              </div>
            )}

            {showComfort && (
              <div className="space-y-1 animate-in slide-in-from-bottom-4 duration-500 delay-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-medium">쾌적도 반영</span>
                </div>
                <p className="text-2xl font-bold">{Math.round(data.reduce((sum, d) => sum + d.comfort, 0) / 24)} kWh</p>
                <p className="text-xs text-muted-foreground">피크 시간대 쾌적도 우선</p>
              </div>
            )}

            {showLearning && (
              <div className="space-y-1 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm font-medium">학습 데이터</span>
                </div>
                <p className="text-2xl font-bold">
                  {Math.round(data.reduce((sum, d) => sum + d.learning, 0) / 24)} kWh
                </p>
                <p className="text-xs text-muted-foreground">1일 학습 후 최적화</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
