"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Edit2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { WasteAlertDetailModal } from "@/components/waste-alert-detail-modal"

const monthlyData = [
  {
    month: "2024년 10월",
    days: 31,
    usage: 384899,
    before: 307919,
    after: 230939,
    saved: 2401,
    rate: 44.0,
    cost: 319755,
  },
  { month: "2024년 11월", days: 30, usage: 402098, before: 321678, after: 241259, saved: 473, rate: 16.3, cost: 86421 },
  { month: "2024년 12월", days: 31, usage: 1222778, before: 978222, after: 733667, saved: 350, rate: 4.8, cost: 65023 },
  {
    month: "2025년 01월",
    days: 31,
    usage: 1400501,
    before: 1120401,
    after: 840301,
    saved: 177,
    rate: 2.2,
    cost: 30918,
  },
  {
    month: "2025년 02월",
    days: 28,
    usage: 1515557,
    before: 1212446,
    after: 909334,
    saved: 239,
    rate: 2.7,
    cost: 42269,
  },
  { month: "2025년 03월", days: 31, usage: 239138, before: 191310, after: 143483, saved: 288, rate: 13.2, cost: 37753 },
  {
    month: "2025년 04월",
    days: 30,
    usage: 199731,
    before: 159785,
    after: 119839,
    saved: 894,
    rate: 37.9,
    cost: 125997,
  },
  {
    month: "2025년 05월",
    days: 31,
    usage: 409968,
    before: 327974,
    after: 245981,
    saved: 2334,
    rate: 42.8,
    cost: 310573,
  },
  {
    month: "2025년 06월",
    days: 29,
    usage: 1202385,
    before: 961908,
    after: 721431,
    saved: 4574,
    rate: 40.1,
    cost: 797429,
  },
  {
    month: "2025년 07월",
    days: 31,
    usage: 2470810,
    before: 1976648,
    after: 1482486,
    saved: 4282,
    rate: 23.2,
    cost: 686258,
    highlight: true,
  },
  {
    month: "2025년 08월",
    days: 31,
    usage: 2247645,
    before: 1798116,
    after: 1348587,
    saved: 4710,
    rate: 26.8,
    cost: 763560,
  },
  {
    month: "2025년 09월",
    days: 29,
    usage: 884959,
    before: 707967,
    after: 530975,
    saved: 4767,
    rate: 40.9,
    cost: 612783,
  },
]

const dailyData = Array.from({ length: 31 }, (_, i) => {
  const beforeControl = Math.floor(Math.random() * 20) + 35 // 비제어시: 35-55
  const afterControl = Math.floor(Math.random() * 15) + 25 // 제어시: 25-40
  const savingsRate = (((beforeControl - afterControl) / beforeControl) * 100).toFixed(1)

  return {
    day: i + 1,
    weekday: ["월", "화", "수", "목", "금", "토", "일"][i % 7],
    beforeControl, // 비제어시 에너지
    afterControl, // 제어시 에너지
    savingsRate, // 절감율
    cost: Math.floor(Math.random() * 2000) + 3000,
    operationRate: (Math.random() * 15 + 25).toFixed(1),
    coolingHeating: "1.0",
    operationTime: (Math.random() * 5 + 17).toFixed(1),
    comfortTemp: (Math.random() * 2 + 22).toFixed(1),
    indoorTemp: (Math.random() * 2 + 23).toFixed(1),
    outdoorTemp: (Math.random() * 5 + 27).toFixed(1),
    humidity: (Math.random() * 30 + 45).toFixed(1),
  }
})

const weatherAlerts = [
  {
    title: "끄기 잊음",
    subtitle: "19시 이후 운전 실내기 점검",
    detail: "다수 있음 실내기",
    units: "707~709/711/713/화장실 : 23회 | 701/702/703/704/7B : 21회 | 503/506/507/513 : 15회 | ...",
  },
  {
    title: "에너지 누수",
    subtitle: "실내에너지 누수 점검",
    detail: "가장 개선이 필요한 실내기",
    units: "508/509/510/511",
  },
  {
    title: "설정 온도 과다",
    subtitle: "적정온도 설정점검",
    detail: "다수 있음 실내기",
    units: "801/802/화장실 : 30회 | 508/509/510/511 : 28회 | 707~709/711/713/화장실 : 27회 | ...",
  },
  {
    title: "실내 온도 이상",
    subtitle: "실내환경점검",
    detail: "실내온도 편차가 큰 실내기",
    units: "701/702/703/704/7B",
  },
  {
    title: "운전 시간 과다",
    subtitle: "장시간 운전 실내기 점검",
    detail: "가장 점검이 필요한 실내기",
    units: "707~709/711/713/화장실",
  },
  {
    title: "잦은 On/Off",
    subtitle: "불필요한 냉/난방 운전점검",
    detail: "가장 개선이 필요한 실내기",
    units: "801/802/화장실",
  },
]

export function ReportContent() {
  const [activeStep, setActiveStep] = useState(1)
  const [editingMonthly, setEditingMonthly] = useState(false)
  const [editingDaily, setEditingDaily] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<(typeof weatherAlerts)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const steps = [
    { id: 1, name: "에너지절감 누적분석" },
    { id: 2, name: "월별분석" },
    { id: 3, name: "당월상세분석" },
    { id: 4, name: "당월 낭비 알림 분석" },
  ]

  const handleAlertClick = (alert: (typeof weatherAlerts)[0]) => {
    setSelectedAlert(alert)
    setIsModalOpen(true)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">에너지 절감 리포트(예시)</h2>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          LG전자 입니다. 고객님 현장의 기기에 에너지 로직을 적용하고 에너지 절감 효과를 분석한 결과입니다.
        </p>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <Button
              variant={activeStep === step.id ? "default" : "outline"}
              onClick={() => setActiveStep(step.id)}
              className="whitespace-nowrap text-xs md:text-sm"
              size="sm"
            >
              <span className="mr-2">{step.id}</span>
              {step.name}
            </Button>
            {index < steps.length - 1 && (
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: 에너지절감 누적분석 */}
      {activeStep === 1 && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">에너지절감 누적분석</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                2024년 10월 ~ 2025년 09월 에너지 예측절감금액은 3,878,739원입니다.
                <br />
                예측 절감량(절감율)은 25,489kWh (25.0%) 입니다.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h4 className="font-semibold mb-4">절감결과요약</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">미적용시 사용량</div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-1" style={{ width: "62%" }} />
                      </div>
                      <div className="text-sm font-medium mt-1">23,582kWh | 3,275,614원</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">적용시 사용량</div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-3" style={{ width: "38%" }} />
                      </div>
                      <div className="text-sm font-medium mt-1">18,575kWh | 2,600,178원</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">분석대상기기 및 가입요금정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">중앙제어기</span>
                      <span>1기</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">실외기</span>
                      <span>멀티V S 0기, 멀티V 5 1기</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">실내기</span>
                      <span>6기</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">현장가입요금</span>
                      <span>산업용전력(을), 고압A, 선택 II</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h4 className="font-semibold mb-4">리포트정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">분석기간</span>
                      <span>2024-10-01 ~ 2025-09-30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">분석일수</span>
                      <span>364일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">적용로직</span>
                      <span>냉매 온도 제어</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <h4 className="font-semibold mb-4 text-sm md:text-base">월별 절감량</h4>
              <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis width={90} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="before" fill="#9ca3af" name="미적용시 사용량 (kWh)" />
                  <Bar dataKey="after" fill="#14b8a6" name="적용시 사용량 (kWh)" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-4">
                * 사용량, 절감금액은 한국전력과 계약 시 책정된 기본요금을 제외한 공급기관의 사용요금을 고려하였습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: 월별분석 */}
      {activeStep === 2 && (
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold">월별분석</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  분석기간동안 에너지 최대사용 기간은 '24년 12월 입니다.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingMonthly(!editingMonthly)}
                className="text-xs md:text-sm"
              >
                <Edit2 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                {editingMonthly ? "완료" : "수정"}
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">실증기간</th>
                    <th className="text-right p-2">분석일수[일]</th>
                    <th className="text-right p-2">에어컨 사용요금[원]</th>
                    <th className="text-right p-2">ⓐ 미적용시 사용량[kWh]</th>
                    <th className="text-right p-2">ⓑ 에너지로직 적용 후 사용량[kWh]</th>
                    <th className="text-right p-2">ⓒ 에너지 절감량 (ⓐ - ⓑ)[kWh]</th>
                    <th className="text-right p-2">에너지 절감율 (ⓒ / ⓐ)[%]</th>
                    <th className="text-right p-2">절감금액 [원]</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((row, index) => (
                    <tr key={index} className={`border-b ${row.highlight ? "bg-chart-3/10" : ""} hover:bg-muted/50`}>
                      <td className="p-2">{row.month}</td>
                      <td className="text-right p-2">
                        {editingMonthly ? (
                          <input
                            type="number"
                            defaultValue={row.days}
                            className="w-16 px-2 py-1 text-right border rounded"
                          />
                        ) : (
                          row.days
                        )}
                      </td>
                      <td className="text-right p-2">
                        {editingMonthly ? (
                          <input
                            type="number"
                            defaultValue={row.usage}
                            className="w-24 px-2 py-1 text-right border rounded"
                          />
                        ) : (
                          row.usage.toLocaleString()
                        )}
                      </td>
                      <td className="text-right p-2">
                        {editingMonthly ? (
                          <input
                            type="number"
                            defaultValue={row.before}
                            className="w-24 px-2 py-1 text-right border rounded"
                          />
                        ) : (
                          row.before.toLocaleString()
                        )}
                      </td>
                      <td className="text-right p-2">
                        {editingMonthly ? (
                          <input
                            type="number"
                            defaultValue={row.after}
                            className="w-24 px-2 py-1 text-right border rounded"
                          />
                        ) : (
                          row.after.toLocaleString()
                        )}
                      </td>
                      <td className="text-right p-2">
                        {editingMonthly ? (
                          <input
                            type="number"
                            defaultValue={row.saved}
                            className="w-20 px-2 py-1 text-right border rounded"
                          />
                        ) : (
                          row.saved.toLocaleString()
                        )}
                      </td>
                      <td className="text-right p-2">
                        {editingMonthly ? (
                          <input
                            type="number"
                            step="0.1"
                            defaultValue={row.rate}
                            className="w-16 px-2 py-1 text-right border rounded"
                          />
                        ) : (
                          `${row.rate}%`
                        )}
                      </td>
                      <td className="text-right p-2">
                        {editingMonthly ? (
                          <input
                            type="number"
                            defaultValue={row.cost}
                            className="w-24 px-2 py-1 text-right border rounded"
                          />
                        ) : (
                          row.cost.toLocaleString()
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-muted">
                    <td className="p-2">합계</td>
                    <td className="text-right p-2">364</td>
                    <td className="text-right p-2">2,600,178</td>
                    <td className="text-right p-2">23,582</td>
                    <td className="text-right p-2">18,575</td>
                    <td className="text-right p-2">5,007</td>
                    <td className="text-right p-2">21.2%</td>
                    <td className="text-right p-2">675,436</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * 예측결과는 사용량, 내/외부 부하 표준화 하지 않은 비교결과로 계약 시 책정된 기본요금을 제외한 공급기관의
              사용요금을 고려하였습니다.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 3: 당월상세사용분석 */}
      {activeStep === 3 && (
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h3 className="text-lg md:text-xl font-bold">당월상세사용분석</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingDaily(!editingDaily)}
                className="text-xs md:text-sm"
              >
                <Edit2 className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                {editingDaily ? "완료" : "수정"}
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <span>비제어시</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-teal-500 rounded" />
                <span>제어시</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">날짜</th>
                    <th className="text-left p-2">요일</th>
                    <th className="text-right p-2">에너지 [kWh] / 월절감율 [%]</th>
                    <th className="text-right p-2">사용금액[원]</th>
                    <th className="text-right p-2">충전율[%]</th>
                    <th className="text-right p-2">냉/난방[h]</th>
                    <th className="text-right p-2">운전시간[h]</th>
                    <th className="text-right p-2">쾌적온도[평균]</th>
                    <th className="text-right p-2">실내온도[평균]</th>
                    <th className="text-right p-2">외기온도[평균]</th>
                    <th className="text-right p-2">습도[평균]</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyData.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2">{row.day}</td>
                      <td className="p-2">{row.weekday}</td>
                      <td className="text-right p-2">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-3 bg-muted rounded-full overflow-hidden relative">
                              <div
                                className="h-full bg-gray-300 absolute top-0 left-0"
                                style={{ width: `${(row.beforeControl / 55) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{row.beforeControl}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-3 bg-muted rounded-full overflow-hidden relative">
                              <div
                                className="h-full bg-teal-500 absolute top-0 left-0"
                                style={{ width: `${(row.afterControl / 55) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-teal-600">{row.afterControl}</span>
                          </div>
                          <span className="text-xs font-medium">{row.savingsRate}%</span>
                        </div>
                      </td>
                      <td className="text-right p-2">
                        {editingDaily ? (
                          <input
                            type="number"
                            defaultValue={row.cost}
                            className="w-24 px-2 py-1 text-right border rounded"
                          />
                        ) : (
                          `₩ ${row.cost.toLocaleString()}`
                        )}
                      </td>
                      <td className="text-right p-2">{row.operationRate}</td>
                      <td className="text-right p-2">{row.coolingHeating}</td>
                      <td className="text-right p-2">{row.operationTime}</td>
                      <td className="text-right p-2">{row.comfortTemp}</td>
                      <td className="text-right p-2">{row.indoorTemp}</td>
                      <td className="text-right p-2">{row.outdoorTemp}</td>
                      <td className="text-right p-2">{row.humidity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: 당월 낭비 알림 분석 */}
      {activeStep === 4 && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-2">당월 낭비 알림 분석</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-6">
                고객님 현장의 에너지 낭비요인을 분석하였습니다. ('25년 09월 기준)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {weatherAlerts.map((alert, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleAlertClick(alert)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">⚠️</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground">{alert.subtitle}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{alert.detail}</p>
                        <p className="text-xs text-primary">{alert.units}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Waste Alert Detail Modal */}
      {selectedAlert && (
        <WasteAlertDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} alert={selectedAlert} />
      )}
    </div>
  )
}
