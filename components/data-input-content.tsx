"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Save, Trash2 } from "lucide-react"

export function DataInputContent() {
  const [sites, setSites] = useState([
    { id: 1, name: "서울 본사", location: "서울", industry: "오피스", outdoorUnits: 10, indoorUnits: 80 },
    { id: 2, name: "부산 공장", location: "부산", industry: "공장", outdoorUnits: 25, indoorUnits: 150 },
  ])

  const [powerData, setPowerData] = useState([
    { id: 1, site: "서울 본사", month: "2025-01", usage: 2800, cost: 485000 },
    { id: 2, site: "부산 공장", month: "2025-01", usage: 4200, cost: 720000 },
  ])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">데이터 입력</h2>
        <p className="mt-2 text-muted-foreground">현장 정보와 전력 사용 데이터를 수동으로 입력하고 관리합니다</p>
      </div>

      <Tabs defaultValue="sites" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="sites">현장 정보</TabsTrigger>
          <TabsTrigger value="power">전력 데이터</TabsTrigger>
          <TabsTrigger value="settings">요금 설정</TabsTrigger>
        </TabsList>

        {/* Sites Tab */}
        <TabsContent value="sites" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>현장 정보 관리</CardTitle>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />새 현장 추가
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sites.map((site) => (
                  <div key={site.id} className="p-4 bg-muted/50 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{site.name}</h4>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">지역</Label>
                        <div className="mt-1 font-medium">{site.location}</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">업종</Label>
                        <div className="mt-1 font-medium">{site.industry}</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">실외기 대수</Label>
                        <div className="mt-1 font-medium">{site.outdoorUnits}대</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">실내기 대수</Label>
                        <div className="mt-1 font-medium">{site.indoorUnits}대</div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      수정
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Site Form */}
              <div className="mt-6 p-6 border border-border rounded-lg space-y-4">
                <h4 className="font-semibold">새 현장 추가</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">현장명</Label>
                    <Input id="siteName" placeholder="예: 서울 본사" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">지역</Label>
                    <select id="location" className="w-full px-3 py-2 bg-background border border-input rounded-md">
                      <option value="">선택하세요</option>
                      <option value="서울">서울</option>
                      <option value="경기">경기</option>
                      <option value="인천">인천</option>
                      <option value="부산">부산</option>
                      <option value="대구">대구</option>
                      <option value="대전">대전</option>
                      <option value="광주">광주</option>
                      <option value="울산">울산</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">업종</Label>
                    <select id="industry" className="w-full px-3 py-2 bg-background border border-input rounded-md">
                      <option value="">선택하세요</option>
                      <option value="학교">학교</option>
                      <option value="오피스">오피스</option>
                      <option value="공장">공장</option>
                      <option value="스낵">스낵</option>
                      <option value="상업&문화">상업&문화</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outdoorUnits">실외기 대수</Label>
                    <Input id="outdoorUnits" type="number" placeholder="10" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="indoorUnits">실내기 대수</Label>
                    <Input id="indoorUnits" type="number" placeholder="80" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="season">계절</Label>
                    <select id="season" className="w-full px-3 py-2 bg-background border border-input rounded-md">
                      <option value="여름(6-8월)">여름(6-8월)</option>
                      <option value="겨울(12-2월)">겨울(12-2월)</option>
                      <option value="봄/가을">봄/가을</option>
                    </select>
                  </div>
                </div>

                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  현장 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Power Data Tab */}
        <TabsContent value="power" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>전력 사용 데이터</CardTitle>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                데이터 추가
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-sm font-semibold">현장</th>
                        <th className="text-left p-3 text-sm font-semibold">월</th>
                        <th className="text-right p-3 text-sm font-semibold">사용량 (kWh)</th>
                        <th className="text-right p-3 text-sm font-semibold">전기요금 (원)</th>
                        <th className="text-center p-3 text-sm font-semibold">작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {powerData.map((data) => (
                        <tr key={data.id} className="border-b border-border/50">
                          <td className="p-3 text-sm">{data.site}</td>
                          <td className="p-3 text-sm">{data.month}</td>
                          <td className="text-right p-3 text-sm">{data.usage.toLocaleString()}</td>
                          <td className="text-right p-3 text-sm">₩{data.cost.toLocaleString()}</td>
                          <td className="text-center p-3">
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New Power Data Form */}
              <div className="mt-6 p-6 border border-border rounded-lg space-y-4">
                <h4 className="font-semibold">전력 데이터 추가</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="powerSite">현장</Label>
                    <select id="powerSite" className="w-full px-3 py-2 bg-background border border-input rounded-md">
                      <option value="">선택하세요</option>
                      {sites.map((site) => (
                        <option key={site.id} value={site.name}>
                          {site.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="powerMonth">월</Label>
                    <Input id="powerMonth" type="month" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="powerUsage">사용량 (kWh)</Label>
                    <Input id="powerUsage" type="number" placeholder="2800" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="powerCost">전기요금 (원)</Label>
                    <Input id="powerCost" type="number" placeholder="485000" />
                  </div>
                </div>

                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  데이터 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>요금 단가 설정 (원/kWh)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate-school">학교</Label>
                    <Input id="rate-school" type="number" defaultValue="120" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate-office">오피스</Label>
                    <Input id="rate-office" type="number" defaultValue="150" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate-factory">공장</Label>
                    <Input id="rate-factory" type="number" defaultValue="110" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate-snack">스낵</Label>
                    <Input id="rate-snack" type="number" defaultValue="140" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate-commercial">상업&문화</Label>
                    <Input id="rate-commercial" type="number" defaultValue="160" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold mb-4">계절별 요금 할증</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="summer-rate">여름 (6-8월)</Label>
                      <div className="flex items-center gap-2">
                        <Input id="summer-rate" type="number" defaultValue="20" />
                        <span className="text-sm text-muted-foreground">% 할증</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="winter-rate">겨울 (12-2월)</Label>
                      <div className="flex items-center gap-2">
                        <Input id="winter-rate" type="number" defaultValue="15" />
                        <span className="text-sm text-muted-foreground">% 할증</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spring-fall-rate">봄/가을</Label>
                      <div className="flex items-center gap-2">
                        <Input id="spring-fall-rate" type="number" defaultValue="0" />
                        <span className="text-sm text-muted-foreground">% 할증</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  요금 설정 저장
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>절감률 목표 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-savings">목표 절감률 (%)</Label>
                    <Input id="target-savings" type="number" defaultValue="13.3" step="0.1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comfort-score">최소 쾌적도 점수</Label>
                    <Input id="comfort-score" type="number" defaultValue="85" />
                  </div>
                </div>

                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  목표 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
