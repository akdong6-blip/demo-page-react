"use client"

import { Card, CardContent } from "@/components/ui/card"

export function LogicContent() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">에너지 절감 서비스</h2>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">내 현장에 딱 맞춘 에너지 절감 제어</p>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6 lg:p-8">
          <h3 className="text-lg md:text-xl font-lg-bold mb-4 md:mb-6">에너지 절감 원리</h3>

          <div className="space-y-4 md:space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-2">학습 단계</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  인버터* 절감 방식과 더불어 고객 현장의 사용 패턴을 분석하고 그에 맞춘 추가적인 에너지 절감을 제공
                  드립니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-2">에너지 절감</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  제품 운전 정보와 사용패턴을 바탕으로 실·내외 환경에 맞춰 냉난방 시스템을 조정하여 고객의 제품 사용
                  환경, 습관에 맞춘 에너지 절감을 가능하게 합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-2">쾌적도 보정 & 제어</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  또한, '현장 쾌적 맞춤 기능'은 매일 업데이트 되어 에너지 절감과 공간의 쾌적함을 동시에 유지할 수 있게
                  합니다.
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  [에어컨 사용이 적은 시간대와 많은 시간대를 구분하여 에너지 절감을 조절하면서 쾌적한 환경을 우선하도록
                  설정]
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-2">지속적 최적화</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  냉난방 불편 없이 전력 절감 가능하며, 1일 마다 학습된 데이터와 기상 예보 등 수집된 데이터를 바탕으로
                  현장에 딱 맞춘 제어를 진행합니다.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 md:p-6 lg:p-8">
          <h3 className="text-lg md:text-xl font-lg-bold mb-4 md:mb-6 text-center">에너지 절감 제어 프로세스</h3>

          <div className="flex justify-center">
            <img src="/images/energy-process.png" alt="에너지 절감 제어 프로세스" className="w-full max-w-4xl h-auto" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 md:p-6 lg:p-8">
          <h3 className="text-lg md:text-xl font-lg-bold mb-4 md:mb-6 text-center">일일 학습 및 제어 사이클</h3>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Step 1 */}
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                  <span className="font-bold text-primary text-sm">Step 1</span>
                </div>
                <div className="flex-1 p-4 bg-muted rounded-lg">
                  <div className="font-semibold mb-2">데이터 수집 및 학습</div>
                  <p className="text-sm text-muted-foreground">사용 패턴 분석 (온도, 습도, 사용 시간대 등)</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center mb-8">
                <div className="w-1 h-12 bg-primary" />
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-chart-2/10 flex items-center justify-center border-2 border-chart-2">
                  <span className="font-bold text-chart-2 text-sm">Step 2</span>
                </div>
                <div className="flex-1 p-4 bg-muted rounded-lg">
                  <div className="font-semibold mb-2">학습 데이터 반영</div>
                  <p className="text-sm text-muted-foreground">전날 학습한 패턴을 기반으로 최적화된 제어 실행</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center mb-8">
                <div className="w-1 h-12 bg-chart-2" />
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-chart-3/10 flex items-center justify-center border-2 border-chart-3">
                  <span className="font-bold text-chart-3 text-sm">Step 3</span>
                </div>
                <div className="flex-1 p-4 bg-muted rounded-lg">
                  <div className="font-semibold mb-2">지속적 개선</div>
                  <p className="text-sm text-muted-foreground">매일 업데이트되는 학습 데이터로 더욱 정교한 절감 제어</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
