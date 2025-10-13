"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X } from "lucide-react"

const industryCostData: Record<string, { before: number; after: number }> = {
  all: { before: 4850000, after: 4205000 },
  industrial: { before: 6200000, after: 5260000 },
  commercial: { before: 4100000, after: 3575000 },
  cultural: { before: 3800000, after: 3360000 },
  university: { before: 5400000, after: 4640000 },
  office: { before: 4900000, after: 4230000 },
  school: { before: 3200000, after: 2850000 },
}

interface CostSummaryProps {
  industry?: string
  beforeCost?: number
  afterCost?: number
}

export function CostSummary({ industry = "all", beforeCost, afterCost }: CostSummaryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [displayBeforeCost, setDisplayBeforeCost] = useState("")
  const [displayAfterCost, setDisplayAfterCost] = useState("")
  const [editBeforeCost, setEditBeforeCost] = useState("")
  const [editAfterCost, setEditAfterCost] = useState("")

  const calculateCosts = () => {
    if (beforeCost && afterCost) {
      return {
        before: beforeCost,
        after: afterCost,
      }
    }

    const baseCost = industryCostData[industry] || industryCostData.all

    return {
      before: baseCost.before,
      after: baseCost.after,
    }
  }

  useEffect(() => {
    if (!isEditing) {
      const costs = calculateCosts()
      setDisplayBeforeCost(costs.before.toLocaleString())
      setDisplayAfterCost(costs.after.toLocaleString())
    }
  }, [industry, beforeCost, afterCost])

  const currentBeforeCost = displayBeforeCost || calculateCosts().before.toLocaleString()
  const currentAfterCost = displayAfterCost || calculateCosts().after.toLocaleString()

  const handleEdit = () => {
    setIsEditing(true)
    setEditBeforeCost(currentBeforeCost)
    setEditAfterCost(currentAfterCost)
  }

  const handleSave = () => {
    setDisplayBeforeCost(editBeforeCost)
    setDisplayAfterCost(editAfterCost)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  // Calculate savings
  const before = Number.parseFloat(currentBeforeCost.replace(/,/g, ""))
  const after = Number.parseFloat(currentAfterCost.replace(/,/g, ""))
  const savings = before - after
  const savingsPercent = ((savings / before) * 100).toFixed(1)

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">절감 전 전기요금</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editBeforeCost}
                  onChange={(e) => setEditBeforeCost(e.target.value)}
                  className="text-3xl font-bold bg-muted px-2 py-1 rounded border border-border w-full"
                />
              ) : (
                <div className="text-3xl font-bold">₩{currentBeforeCost}</div>
              )}
              <div className="text-sm text-muted-foreground">월 평균</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">절감 후 전기요금</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editAfterCost}
                  onChange={(e) => setEditAfterCost(e.target.value)}
                  className="text-3xl font-bold bg-muted px-2 py-1 rounded border border-border w-full"
                />
              ) : (
                <div className="text-3xl font-bold text-chart-2">₩{currentAfterCost}</div>
              )}
              <div className="text-sm text-muted-foreground">월 평균</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">총 절감 금액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-chart-4">₩{savings.toLocaleString()}</div>
              <div className="text-sm text-chart-4">{savingsPercent}% 절감</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
