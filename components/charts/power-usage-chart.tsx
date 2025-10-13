"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const allData = [
  { month: "1월", 공업: 3200, 상업: 2200, 문화시설: 2400, 대학교: 2800, 오피스: 2600, 초중고: 2000 },
  { month: "2월", 공업: 3000, 상업: 2100, 문화시설: 2200, 대학교: 2600, 오피스: 2400, 초중고: 1900 },
  { month: "3월", 공업: 3400, 상업: 2400, 문화시설: 2600, 대학교: 3000, 오피스: 2800, 초중고: 2200 },
  { month: "4월", 공업: 3600, 상업: 2600, 문화시설: 2800, 대학교: 3200, 오피스: 3000, 초중고: 2400 },
  { month: "5월", 공업: 4000, 상업: 2900, 문화시설: 3200, 대학교: 3600, 오피스: 3400, 초중고: 2700 },
  { month: "6월", 공업: 4600, 상업: 3400, 문화시설: 3800, 대학교: 4200, 오피스: 4000, 초중고: 3200 },
  { month: "7월", 공업: 5000, 상업: 3800, 문화시설: 4200, 대학교: 4600, 오피스: 4400, 초중고: 3600 },
  { month: "8월", 공업: 5200, 상업: 4000, 문화시설: 4400, 대학교: 4800, 오피스: 4600, 초중고: 3800 },
  { month: "9월", 공업: 4400, 상업: 3200, 문화시설: 3600, 대학교: 4000, 오피스: 3800, 초중고: 3000 },
  { month: "10월", 공업: 3600, 상업: 2600, 문화시설: 2800, 대학교: 3200, 오피스: 3000, 초중고: 2400 },
  { month: "11월", 공업: 3200, 상업: 2200, 문화시설: 2400, 대학교: 2800, 오피스: 2600, 초중고: 2000 },
  { month: "12월", 공업: 3400, 상업: 2400, 문화시설: 2600, 대학교: 3000, 오피스: 2800, 초중고: 2200 },
]

const industryDataMap: Record<string, string> = {
  industrial: "공업",
  commercial: "상업",
  cultural: "문화시설",
  university: "대학교",
  office: "오피스",
  school: "초중고",
}

interface PowerUsageChartProps {
  industry?: string
}

export function PowerUsageChart({ industry = "all" }: PowerUsageChartProps) {
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
