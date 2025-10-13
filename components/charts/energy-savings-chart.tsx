"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const allData = [
  { month: "1월", 공업: 2800, 상업: 1900, 문화시설: 2100, 대학교: 2450, 오피스: 2280, 초중고: 1750 },
  { month: "2월", 공업: 2600, 상업: 1800, 문화시설: 1900, 대학교: 2280, 오피스: 2100, 초중고: 1650 },
  { month: "3월", 공업: 3000, 상업: 2100, 문화시설: 2300, 대학교: 2610, 오피스: 2450, 초중고: 1900 },
  { month: "4월", 공업: 3200, 상업: 2300, 문화시설: 2450, 대학교: 2780, 오피스: 2600, 초중고: 2100 },
  { month: "5월", 공업: 3500, 상업: 2550, 문화시설: 2800, 대학교: 3120, 오피스: 2950, 초중고: 2350 },
  { month: "6월", 공업: 4000, 상업: 2950, 문화시설: 3300, 대학교: 3640, 오피스: 3450, 초중고: 2800 },
  { month: "7월", 공업: 4350, 상업: 3300, 문화시설: 3650, 대학교: 3990, 오피스: 3800, 초중고: 3100 },
  { month: "8월", 공업: 4550, 상업: 3500, 문화시설: 3850, 대학교: 4160, 오피스: 4000, 초중고: 3300 },
  { month: "9월", 공업: 3850, 상업: 2800, 문화시설: 3150, 대학교: 3470, 오피스: 3300, 초중고: 2600 },
  { month: "10월", 공업: 3150, 상업: 2300, 문화시설: 2450, 대학교: 2780, 오피스: 2600, 초중고: 2100 },
  { month: "11월", 공업: 2800, 상업: 1900, 문화시설: 2100, 대학교: 2430, 오피스: 2280, 초중고: 1750 },
  { month: "12월", 공업: 3000, 상업: 2100, 문화시설: 2300, 대학교: 2610, 오피스: 2450, 초중고: 1900 },
]

const industryDataMap: Record<string, string> = {
  industrial: "공업",
  commercial: "상업",
  cultural: "문화시설",
  university: "대학교",
  office: "오피스",
  school: "초중고",
}

interface EnergySavingsChartProps {
  industry?: string
}

export function EnergySavingsChart({ industry = "all" }: EnergySavingsChartProps) {
  const getVisibleLines = () => {
    if (industry === "all") {
      return ["공업", "상업", "문화시설", "대학교", "오피스", "초중고"]
    }
    return [industryDataMap[industry] || "공업"]
  }

  const visibleLines = getVisibleLines()

  return (
    <div className="h-[400px] w-full" key={industry}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={allData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            label={{ value: "kWh", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          {visibleLines.includes("공업") && (
            <Line type="monotone" dataKey="공업" stroke="hsl(var(--chart-1))" strokeWidth={2} animationDuration={800} />
          )}
          {visibleLines.includes("상업") && (
            <Line type="monotone" dataKey="상업" stroke="hsl(var(--chart-2))" strokeWidth={2} animationDuration={800} />
          )}
          {visibleLines.includes("문화시설") && (
            <Line
              type="monotone"
              dataKey="문화시설"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              animationDuration={800}
            />
          )}
          {visibleLines.includes("대학교") && (
            <Line
              type="monotone"
              dataKey="대학교"
              stroke="hsl(var(--chart-4))"
              strokeWidth={2}
              animationDuration={800}
            />
          )}
          {visibleLines.includes("오피스") && (
            <Line
              type="monotone"
              dataKey="오피스"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
              animationDuration={800}
            />
          )}
          {visibleLines.includes("초중고") && (
            <Line type="monotone" dataKey="초중고" stroke="hsl(220 70% 50%)" strokeWidth={2} animationDuration={800} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
