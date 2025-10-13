"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Wind, Zap, TrendingDown, Pencil, Check, X } from "lucide-react"

const initialStats = [
  {
    label: "총 현장 수",
    value: "1,830",
    unit: "곳",
    icon: Building2,
    color: "text-chart-1",
  },
  {
    label: "총 실외기 대수",
    value: "15,420",
    unit: "대",
    icon: Wind,
    color: "text-chart-2",
  },
  {
    label: "월 평균 전력 사용량",
    value: "2,847",
    unit: "kWh",
    icon: Zap,
    color: "text-chart-3",
  },
  {
    label: "평균 절감률",
    value: "13.3",
    unit: "%",
    icon: TrendingDown,
    color: "text-chart-4",
  },
]

interface SiteStatsProps {
  industry?: string
}

export function SiteStats({ industry = "all" }: SiteStatsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [stats, setStats] = useState(initialStats)
  const [editValues, setEditValues] = useState<Record<string, string>>({})

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
