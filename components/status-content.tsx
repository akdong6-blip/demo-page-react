"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Factory, School, Hotel, ShoppingBag, Landmark, GraduationCap, Pencil, Check, X } from "lucide-react"

const initialIndustryStats = [
  { category: "초중고", icon: School, sites: 450, units: 3200 },
  { category: "대학교", icon: GraduationCap, sites: 280, units: 2400 },
  { category: "오피스", icon: Building2, sites: 380, units: 2800 },
  { category: "공장", icon: Factory, sites: 310, units: 4200 },
  { category: "상업&문화", icon: ShoppingBag, sites: 270, units: 2620 },
  { category: "공공시설", icon: Landmark, sites: 180, units: 1800 },
  { category: "숙박시설", icon: Hotel, sites: 160, units: 1400 },
]

const initialRegionalData = [
  { region: "서울", sites: 340, percentage: 18.6 },
  { region: "경기", sites: 420, percentage: 23.0 },
  { region: "인천", sites: 120, percentage: 6.6 },
  { region: "강원", sites: 80, percentage: 4.4 },
  { region: "충북", sites: 90, percentage: 4.9 },
  { region: "충남", sites: 110, percentage: 6.0 },
  { region: "대전", sites: 85, percentage: 4.6 },
  { region: "세종", sites: 45, percentage: 2.5 },
  { region: "전북", sites: 95, percentage: 5.2 },
  { region: "전남", sites: 105, percentage: 5.7 },
  { region: "광주", sites: 75, percentage: 4.1 },
  { region: "경북", sites: 115, percentage: 6.3 },
  { region: "경남", sites: 130, percentage: 7.1 },
  { region: "대구", sites: 90, percentage: 4.9 },
  { region: "울산", sites: 60, percentage: 3.3 },
  { region: "부산", sites: 100, percentage: 5.5 },
  { region: "제주", sites: 50, percentage: 2.7 },
]

const initialMonthlyStats = [
  { category: "설치현장", jan: 14, feb: 15, mar: 18, apr: 21, may: 23, jun: 28, avg: 19.8 },
  { category: "계약현장", jan: 7, feb: 7, mar: 9, apr: 11, may: 14, jun: 18, avg: 11.0 },
  { category: "체험 현장", jan: 51, feb: 53, mar: 55, apr: 58, may: 62, jun: 68, avg: 57.8 },
  { category: "총 실외기", jan: 34, feb: 35, mar: 38, apr: 42, may: 48, jun: 56, avg: 42.2 },
  { category: "절감률", jan: 28, feb: 29, mar: 31, apr: 35, may: 39, jun: 45, avg: 34.5 },
  { category: "절감금액", jan: 120, feb: 125, mar: 130, apr: 140, may: 150, jun: 160, avg: 137.5 },
]

export function StatusContent() {
  const [isEditingStats, setIsEditingStats] = useState(false)
  const [isEditingRegional, setIsEditingRegional] = useState(false)
  const [isEditingIndustry, setIsEditingIndustry] = useState(false)
  const [isEditingMonthly, setIsEditingMonthly] = useState(false)

  const [totalSites, setTotalSites] = useState("1,830")
  const [contractSites, setContractSites] = useState("310")
  const [trialSites, setTrialSites] = useState("100")
  const [totalUnits, setTotalUnits] = useState("15,420")
  const [savingsRate, setSavingsRate] = useState("13.3")
  const [savingsAmount, setSavingsAmount] = useState("10,000,000,000")

  const [regionalData, setRegionalData] = useState(initialRegionalData)
  const [industryStats, setIndustryStats] = useState(initialIndustryStats)
  const [monthlyStats, setMonthlyStats] = useState(initialMonthlyStats)

  const [editTotalSites, setEditTotalSites] = useState("")
  const [editContractSites, setEditContractSites] = useState("")
  const [editTrialSites, setEditTrialSites] = useState("")
  const [editTotalUnits, setEditTotalUnits] = useState("")
  const [editSavingsRate, setEditSavingsRate] = useState("")
  const [editSavingsAmount, setEditSavingsAmount] = useState("")
  const [editRegionalData, setEditRegionalData] = useState(initialRegionalData)
  const [editIndustryStats, setEditIndustryStats] = useState(initialIndustryStats)
  const [editMonthlyStats, setEditMonthlyStats] = useState(initialMonthlyStats)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedStats = localStorage.getItem("industryStats")
        if (savedStats) {
          const parsed = JSON.parse(savedStats)
          const iconMap: Record<string, any> = {
            초중고: School,
            대학교: GraduationCap,
            오피스: Building2,
            공장: Factory,
            "상업&문화": ShoppingBag,
            공공시설: Landmark,
            숙박시설: Hotel,
          }
          const restoredStats = parsed.map((item: any) => ({
            ...item,
            icon: iconMap[item.category] || Building2,
          }))
          setIndustryStats(restoredStats)
        }
      } catch (e) {
        console.error("Failed to parse industry stats from localStorage", e)
      }
    }
  }, [])

  const handleEditStats = () => {
    setIsEditingStats(true)
    setEditTotalSites(totalSites)
    setEditContractSites(contractSites)
    setEditTrialSites(trialSites)
    setEditTotalUnits(totalUnits)
    setEditSavingsRate(savingsRate)
    setEditSavingsAmount(savingsAmount)
  }

  const handleSaveStats = () => {
    setTotalSites(editTotalSites)
    setContractSites(editContractSites)
    setTrialSites(editTrialSites)
    setTotalUnits(editTotalUnits)
    setSavingsRate(editSavingsRate)
    setSavingsAmount(editSavingsAmount)
    setIsEditingStats(false)
  }

  const handleCancelStats = () => {
    setIsEditingStats(false)
  }

  const handleEditRegional = () => {
    setIsEditingRegional(true)
    setEditRegionalData([...regionalData])
  }

  const handleSaveRegional = () => {
    setRegionalData(editRegionalData)
    setIsEditingRegional(false)
  }

  const handleCancelRegional = () => {
    setIsEditingRegional(false)
  }

  const handleEditIndustry = () => {
    setIsEditingIndustry(true)
    setEditIndustryStats([...industryStats])
  }

  const handleSaveIndustry = () => {
    setIndustryStats(editIndustryStats)
    if (typeof window !== "undefined") {
      try {
        const dataToSave = editIndustryStats.map(({ icon, ...rest }) => rest)
        localStorage.setItem("industryStats", JSON.stringify(dataToSave))
      } catch (e) {
        console.error("Failed to save industry stats to localStorage", e)
      }
    }
    setIsEditingIndustry(false)
  }

  const handleCancelIndustry = () => {
    setIsEditingIndustry(false)
  }

  const handleEditMonthly = () => {
    setIsEditingMonthly(true)
    setEditMonthlyStats([...monthlyStats])
  }

  const handleSaveMonthly = () => {
    setMonthlyStats(editMonthlyStats)
    setIsEditingMonthly(false)
  }

  const handleCancelMonthly = () => {
    setIsEditingMonthly(false)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">더욱 넓어진 에너지 현장</h2>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          전국 {totalSites}개 현장에서 BECON cloud를 사용하고 있습니다
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
          {!isEditingStats ? (
            <Button onClick={handleEditStats} variant="outline" size="sm" className="text-xs md:text-sm bg-transparent">
              <Pencil className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              수정
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSaveStats} size="sm" className="text-xs md:text-sm">
                <Check className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                저장
              </Button>
              <Button
                onClick={handleCancelStats}
                variant="outline"
                size="sm"
                className="text-xs md:text-sm bg-transparent"
              >
                <X className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                취소
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">설치현장</div>
              {isEditingStats ? (
                <Input
                  type="text"
                  value={editTotalSites}
                  onChange={(e) => setEditTotalSites(e.target.value)}
                  className="mt-2 text-3xl font-bold text-primary h-auto"
                />
              ) : (
                <div className="mt-2 text-3xl font-bold text-primary">{totalSites}</div>
              )}
              <div className="text-sm text-muted-foreground">site</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">계약현장</div>
              {isEditingStats ? (
                <Input
                  type="text"
                  value={editContractSites}
                  onChange={(e) => setEditContractSites(e.target.value)}
                  className="mt-2 text-3xl font-bold text-chart-2 h-auto"
                />
              ) : (
                <div className="mt-2 text-3xl font-bold text-chart-2">{contractSites}</div>
              )}
              <div className="text-sm text-muted-foreground">site</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">체험 현장</div>
              {isEditingStats ? (
                <Input
                  type="text"
                  value={editTrialSites}
                  onChange={(e) => setEditTrialSites(e.target.value)}
                  className="mt-2 text-3xl font-bold text-chart-5 h-auto"
                />
              ) : (
                <div className="mt-2 text-3xl font-bold text-chart-5">{trialSites}</div>
              )}
              <div className="text-sm text-muted-foreground">site</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">총 실외기</div>
              {isEditingStats ? (
                <Input
                  type="text"
                  value={editTotalUnits}
                  onChange={(e) => setEditTotalUnits(e.target.value)}
                  className="mt-2 text-3xl font-bold text-chart-3 h-auto"
                />
              ) : (
                <div className="mt-2 text-3xl font-bold text-chart-3">{totalUnits}</div>
              )}
              <div className="text-sm text-muted-foreground">대</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">절감률</div>
              {isEditingStats ? (
                <Input
                  type="text"
                  value={editSavingsRate}
                  onChange={(e) => setEditSavingsRate(e.target.value)}
                  className="mt-2 text-3xl font-bold text-chart-4 h-auto"
                />
              ) : (
                <div className="mt-2 text-3xl font-bold text-chart-4">{savingsRate}</div>
              )}
              <div className="text-sm text-muted-foreground">%</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">절감금액</div>
              {isEditingStats ? (
                <Input
                  type="text"
                  value={editSavingsAmount}
                  onChange={(e) => setEditSavingsAmount(e.target.value)}
                  className="mt-2 text-xl font-bold text-chart-1 h-auto"
                />
              ) : (
                <div className="mt-2 text-xl font-bold text-chart-1 break-all">{savingsAmount}</div>
              )}
              <div className="text-sm text-muted-foreground">원</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl">지역별 현황</CardTitle>
            {!isEditingRegional ? (
              <Button
                onClick={handleEditRegional}
                variant="outline"
                size="sm"
                className="text-xs md:text-sm bg-transparent"
              >
                <Pencil className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                수정
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSaveRegional} size="sm" className="text-xs md:text-sm">
                  <Check className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  저장
                </Button>
                <Button
                  onClick={handleCancelRegional}
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm bg-transparent"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  취소
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {(isEditingRegional ? editRegionalData : regionalData).map((data, index) => (
              <div key={data.region} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-medium">{data.region}</span>
                </div>
                {isEditingRegional ? (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={editRegionalData[index].sites}
                      onChange={(e) => {
                        const newData = [...editRegionalData]
                        newData[index].sites = Number.parseInt(e.target.value) || 0
                        setEditRegionalData(newData)
                      }}
                      className="h-8"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={editRegionalData[index].percentage}
                      onChange={(e) => {
                        const newData = [...editRegionalData]
                        newData[index].percentage = Number.parseFloat(e.target.value) || 0
                        setEditRegionalData(newData)
                      }}
                      className="h-8"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="font-bold text-lg">{data.sites} site</div>
                    <div className="text-sm text-muted-foreground">{data.percentage}%</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl">업종별 현황</CardTitle>
            {!isEditingIndustry ? (
              <Button
                onClick={handleEditIndustry}
                variant="outline"
                size="sm"
                className="text-xs md:text-sm bg-transparent"
              >
                <Pencil className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                수정
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSaveIndustry} size="sm" className="text-xs md:text-sm">
                  <Check className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  저장
                </Button>
                <Button
                  onClick={handleCancelIndustry}
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm bg-transparent"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  취소
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {(isEditingIndustry ? editIndustryStats : industryStats).map((stat, index) => (
              <div key={stat.category} className="p-6 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">{stat.category}</h4>
                </div>
                {isEditingIndustry ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground">현장</label>
                      <Input
                        type="number"
                        value={editIndustryStats[index].sites}
                        onChange={(e) => {
                          const newData = [...editIndustryStats]
                          newData[index].sites = Number.parseInt(e.target.value) || 0
                          setEditIndustryStats(newData)
                        }}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">실외기</label>
                      <Input
                        type="number"
                        value={editIndustryStats[index].units}
                        onChange={(e) => {
                          const newData = [...editIndustryStats]
                          newData[index].units = Number.parseInt(e.target.value) || 0
                          setEditIndustryStats(newData)
                        }}
                        className="h-8"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">현장</span>
                      <span className="font-semibold">{stat.sites} site</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">실외기</span>
                      <span className="font-semibold">{stat.units}대</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg md:text-xl">월별 에너지 절감 통계</CardTitle>
            {!isEditingMonthly ? (
              <Button
                onClick={handleEditMonthly}
                variant="outline"
                size="sm"
                className="text-xs md:text-sm bg-transparent"
              >
                <Pencil className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                수정
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSaveMonthly} size="sm" className="text-xs md:text-sm">
                  <Check className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  저장
                </Button>
                <Button
                  onClick={handleCancelMonthly}
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm bg-transparent"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  취소
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-semibold">구분</th>
                  <th className="text-right p-3 text-sm font-semibold">1월</th>
                  <th className="text-right p-3 text-sm font-semibold">2월</th>
                  <th className="text-right p-3 text-sm font-semibold">3월</th>
                  <th className="text-right p-3 text-sm font-semibold">4월</th>
                  <th className="text-right p-3 text-sm font-semibold">5월</th>
                  <th className="text-right p-3 text-sm font-semibold">6월</th>
                  <th className="text-right p-3 text-sm font-semibold">평균</th>
                </tr>
              </thead>
              <tbody>
                {(isEditingMonthly ? editMonthlyStats : monthlyStats).map((stat, rowIndex) => (
                  <tr key={stat.category} className="border-b border-border/50">
                    <td className="p-3 text-sm font-medium">{stat.category}</td>
                    {isEditingMonthly ? (
                      <>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].jan}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].jan = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].feb}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].feb = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].mar}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].mar = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].apr}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].apr = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].may}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].may = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].jun}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].jun = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={editMonthlyStats[rowIndex].avg}
                            onChange={(e) => {
                              const newData = [...editMonthlyStats]
                              newData[rowIndex].avg = Number.parseFloat(e.target.value) || 0
                              setEditMonthlyStats(newData)
                            }}
                            className="h-8 text-right"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 text-right text-sm">{stat.jan}</td>
                        <td className="p-3 text-right text-sm">{stat.feb}</td>
                        <td className="p-3 text-right text-sm">{stat.mar}</td>
                        <td className="p-3 text-right text-sm">{stat.apr}</td>
                        <td className="p-3 text-right text-sm">{stat.may}</td>
                        <td className="p-3 text-right text-sm">{stat.jun}</td>
                        <td className="p-3 text-right text-sm font-semibold text-primary">{stat.avg}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
