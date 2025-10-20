"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X } from "lucide-react"

interface CostSummaryProps {
  beforeCost?: number
  afterCost?: number
  savingsRate?: number
}

export function CostSummary({ beforeCost = 0, afterCost = 0, savingsRate = 0 }: CostSummaryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [displayBeforeCost, setDisplayBeforeCost] = useState(beforeCost)
  const [displayAfterCost, setDisplayAfterCost] = useState(afterCost)
  const [displaySavingsRate, setDisplaySavingsRate] = useState(savingsRate)
  const [editBeforeCost, setEditBeforeCost] = useState("")
  const [editAfterCost, setEditAfterCost] = useState("")
  const [editSavingsRate, setEditSavingsRate] = useState("")
  const [editMode, setEditMode] = useState<"costs" | "rate">("costs")

  useEffect(() => {
    setDisplayBeforeCost(beforeCost)
    setDisplayAfterCost(afterCost)
    setDisplaySavingsRate(savingsRate)
  }, [beforeCost, afterCost, savingsRate])

  const handleEditCosts = () => {
    setIsEditing(true)
    setEditMode("costs")
    setEditBeforeCost(displayBeforeCost.toString())
    setEditAfterCost(displayAfterCost.toString())
  }

  const handleEditRate = () => {
    setIsEditing(true)
    setEditMode("rate")
    setEditBeforeCost(displayBeforeCost.toString())
    setEditSavingsRate(displaySavingsRate.toString())
  }

  const handleSave = () => {
    if (editMode === "costs") {
      const before = Number.parseFloat(editBeforeCost)
      const after = Number.parseFloat(editAfterCost)
      const rate = ((before - after) / before) * 100

      setDisplayBeforeCost(before)
      setDisplayAfterCost(after)
      setDisplaySavingsRate(rate)
    } else {
      const before = Number.parseFloat(editBeforeCost)
      const rate = Number.parseFloat(editSavingsRate)
      const after = before * (1 - rate / 100)

      setDisplayBeforeCost(before)
      setDisplayAfterCost(Math.round(after))
      setDisplaySavingsRate(rate)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const savings = displayBeforeCost - displayAfterCost

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        {!isEditing ? (
          <>
            <Button onClick={handleEditCosts} variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-2" />
              금액 수정
            </Button>
            <Button onClick={handleEditRate} variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-2" />
              절감률 수정
            </Button>
          </>
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
                  type="number"
                  value={editBeforeCost}
                  onChange={(e) => setEditBeforeCost(e.target.value)}
                  className="text-3xl font-bold bg-muted px-2 py-1 rounded border border-border w-full"
                  disabled={editMode === "rate"}
                />
              ) : (
                <div className="text-3xl font-bold">₩{displayBeforeCost.toLocaleString()}</div>
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
              {isEditing && editMode === "costs" ? (
                <input
                  type="number"
                  value={editAfterCost}
                  onChange={(e) => setEditAfterCost(e.target.value)}
                  className="text-3xl font-bold bg-muted px-2 py-1 rounded border border-border w-full"
                />
              ) : (
                <div className="text-3xl font-bold text-chart-2">₩{displayAfterCost.toLocaleString()}</div>
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
              {isEditing && editMode === "rate" ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={editSavingsRate}
                    onChange={(e) => setEditSavingsRate(e.target.value)}
                    className="text-sm bg-muted px-2 py-1 rounded border border-border w-20"
                  />
                  <span className="text-sm text-chart-4">% 절감</span>
                </div>
              ) : (
                <div className="text-sm text-chart-4">{displaySavingsRate.toFixed(1)}% 절감</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
