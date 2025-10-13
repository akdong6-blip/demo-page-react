"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Wind, Zap, TrendingDown, Pencil, Check, X } from "lucide-react"

const industryMapping: Record<string, string> = {
  all: "전체",
  industrial: "공장",
  commercial: "상업&문화",
  cultural: "상업&문화",
  university: "대학교",
  office: "오피스",
  school: "초중고",
}

const industryBaseData: Record<string, { sites: number; units: number; power: number; savings: number }> = {
  all: { sites: 1830, units: 15420, power: 2847, savings: 13.3 },
  industrial: { sites: 310, units: 4200, power: 4200, savings: 15.2 },
  commercial: { sites: 270, units: 2620, power: 3100, savings: 12.8 },
  cultural: { sites: 250, units: 2180, power: 2900, savings: 11.5 },
  university: { sites: 280, units: 2400, power: 3600, savings: 14.1 },
  office: { sites: 380, units: 2800, power: 3400, savings: 13.7 },
  school: { sites: 450, units: 3200, power: 2200, savings: 10.9 },
}

interface SiteStatsProps {
  industry?: string
}

export function SiteStats({ industry = "all" }: SiteStatsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [stats, setStats] = useState<any[]>([])

  useEffect(() => {
    let baseData = industryBaseData[industry] || industryBaseData.all

    // Try to load from localStorage only on client side
    if (typeof window !== "undefined") {
      try {
        const savedStats = localStorage.getItem("industryStats")
        if (savedStats) {
          const parsed = JSON.parse(savedStats)
          const mappedCategory = industryMapping[industry]
          const matchedData = parsed.find((item: any) => item.category === mappedCategory)

          if (matchedData) {
            baseData = {
              sites: matchedData.sites,
              units: matchedData.units,
              power: baseData.power,
              savings: baseData.savings,
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse industry stats from localStorage", e)
      }
    }

    const calculatedStats = [
      {
        label: "총 현장 수",
        value: baseData.sites.toLocaleString(),
        unit: "곳",
        icon: Building2,
        color: "text-chart-1",
      },
      {
        label: "총 실외기 대수",
        value: baseData.units.toLocaleString(),
        unit: "대",
        icon: Wind,
        color: "text-chart-2",
      },
      {
        label: "월 평균 전력 사용량",
        value: baseData.power.toLocaleString(),
        unit: "kWh",
        icon: Zap,
        color: "text-chart-3",
      },
      {
        label: "평균 절감률",
        value: baseData.savings.toFixed(1),
        unit: "%",
        icon: TrendingDown,
        color: "text-chart-4",
      },
    ]

    if (!isEditing) {
      setStats(calculatedStats)
    }
  }, [industry, isEditing])

  const handleEdit = () => {
    setIsEditing(true)
    const values: Record<string, string> = {}
    stats.forEach((stat) => {
      values[stat.label] = stat.value
    })
    setEditValues(values)
  }

  const handleSave = () => {
    setStats(
      stats.map((stat) => ({
        ...stat,
        value: editValues[stat.label] || stat.value,
      })),
    )
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValues({})
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-2" />
            수정
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Check className="w-4 h-4 mr-2" />
              저장
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValues[stat.label] || stat.value}
                        onChange={(e) => setEditValues({ ...editValues, [stat.label]: e.target.value })}
                        className="text-3xl font-bold bg-muted px-2 py-1 rounded border border-border w-32"
                      />
                    ) : (
                      <span className="text-3xl font-bold">{stat.value}</span>
                    )}
                    <span className="text-sm text-muted-foreground">{stat.unit}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
