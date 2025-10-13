"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X } from "lucide-react"

interface CostSummaryProps {
  industry?: string
}

export function CostSummary({ industry = "all" }: CostSummaryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [beforeCost, setBeforeCost] = useState("4,850,000")
  const [afterCost, setAfterCost] = useState("4,205,000")
  const [editBeforeCost, setEditBeforeCost] = useState("")
  const [editAfterCost, setEditAfterCost] = useState("")

  const handleEdit = () => {
    setIsEditing(true)
    setEditBeforeCost(beforeCost)
    setEditAfterCost(afterCost)
  }

  const handleSave = () => {
    setBeforeCost(editBeforeCost)
    setAfterCost(editAfterCost)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  // Calculate savings
  const before = Number.parseFloat(beforeCost.replace(/,/g, ""))
  const after = Number.parseFloat(afterCost.replace(/,/g, ""))
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
                <div className="text-3xl font-bold">₩{beforeCost}</div>
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
                <div className="text-3xl font-bold text-chart-2">₩{afterCost}</div>
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
