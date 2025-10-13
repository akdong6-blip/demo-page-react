"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const allData = [
  { month: "1월", 공업: 2950, 상업: 2000, 문화시설: 2200, 대학교: 2580, 오피스: 2400, 초중고: 1850 },
  { month: "2월", 공업: 2750, 상업: 1900, 문화시설: 2000, 대학교: 2400, 오피스: 2200, 초중고: 1750 },
  { month: "3월", 공업: 3150, 상업: 2200, 문화시설: 2400, 대학교: 2750, 오피스: 2580, 초중고: 2000 },
  { month: "4월", 공업: 3350, 상업: 2400, 문화시설: 2580, 대학교: 2930, 오피스: 2750, 초중고: 2200 },
  { month: "5월", 공업: 3700, 상업: 2700, 문화시설: 2950, 대학교: 3290, 오피스: 3100, 초중고: 2500 },
  { month: "6월", 공업: 4200, 상업: 3100, 문화시설: 3500, 대학교: 3840, 오피스: 3650, 초중고: 2950 },
  { month: "7월", 공업: 4600, 상업: 3500, 문화시설: 3850, 대학교: 4210, 오피스: 4000, 초중고: 3300 },
  { month: "8월", 공업: 4800, 상업: 3700, 문화시설: 4050, 대학교: 4390, 오피스: 4200, 초중고: 3500 },
  { month: "9월", 공업: 4050, 상업: 2950, 문화시설: 3300, 대학교: 3660, 오피스: 3500, 초중고: 2750 },
  { month: "10월", 공업: 3350, 상업: 2400, 문화시설: 2580, 대학교: 2930, 오피스: 2750, 초중고: 2200 },
  { month: "11월", 공업: 2950, 상업: 2000, 문화시설: 2200, 대학교: 2560, 오피스: 2400, 초중고: 1850 },
  { month: "12월", 공업: 3150, 상업: 2200, 문화시설: 2400, 대학교: 2750, 오피스: 2580, 초중고: 2000 },
]

const industryDataMap: Record<string, string> = {
  industrial: "공업",
  commercial: "상업",
  cultural: "문화시설",
  university: "대학교",
  office: "오피스",
  school: "초중고",
}

interface ComfortChartProps {
  industry?: string
}

export function ComfortChart({ industry = "all" }: ComfortChartProps) {
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
