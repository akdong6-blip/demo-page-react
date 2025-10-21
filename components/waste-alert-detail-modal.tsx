"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WasteAlertDetailModalProps {
  isOpen: boolean
  onClose: () => void
  alert: {
    title: string
    subtitle: string
    detail: string
    units: string
  }
}

export function WasteAlertDetailModal({ isOpen, onClose, alert }: WasteAlertDetailModalProps) {
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"]

  const forgetToTurnOffCalendar = [
    { date: 1, units: ["503/506/507/5...", "502/504/505/512", "601/602/603/604", "705/707/708", "809/810"] },
    {
      date: 2,
      units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "503/506/507/5...", "502/504/505/512"],
    },
    {
      date: 3,
      units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "508/509/510/511", "609/610/611/6..."],
    },
    {
      date: 4,
      units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "502/504/505/512", "601/602/603/604"],
    },
    { date: 5, units: ["503/506/507/5...", "601/602/603/604", "613/화장실", "809/810", "701/702/703/7..."] },
    {
      date: 6,
      units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "609/610/611/6...", "613/화장실"],
    },
    { date: 7, units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "609/610/611/6...", "809/810"] },
    {
      date: 8,
      units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "503/506/507/5...", "601/602/603/604"],
    },
    {
      date: 9,
      units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "601/602/603/604", "601/602/603/604"],
    },
    {
      date: 10,
      units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "503/506/507/5...", "601/602/603/604"],
    },
    {
      date: 11,
      units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "601/602/603/604", "801/802/화장실"],
    },
    {
      date: 12,
      units: ["세미나룸/4B/4C...", "메인라운지/스낵...", "601/602/603/604", "601/806/811/8A", "801/802/화장실"],
    },
    { date: 13, units: ["503/506/507/5...", "707~709/711/...", "705/707/708", "801/802/화장실"] },
    { date: 14, units: ["704/706/713", "709/710/711/7...", "701/702/703/7...", "705/707/708", "801/802/화장실"] },
    { date: 15, units: ["503/506/507/5...", "502/504/505/512", "709/710/711/7...", "705/707/708", "701/702/703/7..."] },
    { date: 16, units: ["503/506/507/5...", "502/504/505/512", "508/509/510/511", "705/707/708", "801/802/화장실"] },
    { date: 17, units: ["508/509/510/511", "801/802/화장실", "701/702/703/7...", "707~709/711/..."] },
    { date: 18, units: ["503/506/507/5...", "508/509/510/511", "705/707/708", "801/802/화장실", "701/702/703/7..."] },
    { date: 19, units: ["세미나룸/4B/4C...", "503/506/507/5...", "801/802/화장실", "701/702/703/7..."] },
    { date: 20, units: ["701/702/703/7..."] },
    { date: 21, units: ["801/802/화장실", "707~709/711/..."] },
    { date: 22, units: ["502/504/505/512", "508/509/510/511", "701/702/703/7...", "705/707/708", "801/802/화장실"] },
    { date: 23, units: ["709/710/711/7...", "705/707/708", "707~709/711/..."] },
    {
      date: 24,
      units: ["503/506/507/5...", "508/509/510/511", "801/802/화장실", "701/702/703/7...", "707~709/711/..."],
    },
    { date: 25, units: ["503/506/507/5...", "502/504/505/512", "701/702/703/7...", "707~709/711/..."] },
    {
      date: 26,
      units: ["세미나룸/4B/4C...", "503/506/507/5...", "508/509/510/511", "801/802/화장실", "707~709/711/..."],
    },
    { date: 27, units: ["707~709/711/..."] },
    { date: 28, units: ["707~709/711/..."] },
    { date: 29, units: ["801/802/화장실", "803/805/807/808"] },
    { date: 30, units: ["503/506/507/5...", "605/606/607/6..."] },
  ]

  const excessiveTempCalendar = [
    { date: 1, units: ["501/5A/화장실", "502/504/505/512", "508/509/510/5...", "709/710/711/7...", "801/808/809/8A"] },
    { date: 2, units: ["세미나룸/4B/4C...", "501/5A/화장실", "502/504/505/512", "508/509/510/5...", "801/808/809/8A"] },
    {
      date: 3,
      units: ["세미나룸/4B/4C...", "501/5A/화장실", "508/509/510/5...", "709/710/711/7...", "801/808/809/8A"],
    },
    { date: 4, units: ["세미나룸/4B/4C...", "501/5A/화장실", "502/504/505/512", "508/509/510/5...", "801/808/809/8A"] },
    { date: 5, units: ["세미나룸/4B/4C...", "501/5A/화장실", "508/509/510/5...", "801/802/화장실", "801/808/809/8A"] },
    { date: 6, units: ["704/706/713", "709/710/711/7...", "705/707/708", "801/802/화장실", "801/808/809/8A"] },
    { date: 7, units: ["508/509/510/5...", "704/706/713", "709/710/711/7...", "701/702/703/7...", "801/808/809/8A"] },
    { date: 8, units: ["501/5A/화장실", "508/509/510/5...", "704/706/713", "801/802/화장실", "801/808/809/8A"] },
    { date: 9, units: ["501/5A/화장실", "704/706/713", "705/707/708", "801/802/화장실", "801/808/809/8A"] },
    { date: 10, units: ["501/5A/화장실", "508/509/510/5...", "704/706/713", "801/802/화장실", "801/808/809/8A"] },
    { date: 11, units: ["501/5A/화장실", "502/504/505/512", "508/509/510/5...", "704/706/713", "801/808/809/8A"] },
    { date: 12, units: ["704/706/713", "801/802/화장실", "701/702/703/7...", "801/808/809/8A"] },
    { date: 13, units: ["704/706/713", "709/710/711/7...", "701/702/703/7...", "801/802/화장실", "707~709/711/..."] },
    { date: 14, units: ["508/509/510/5...", "601/602/603/604", "613/화장실", "801/802/화장실", "701/702/703/7..."] },
    { date: 15, units: ["508/509/510/5...", "709/710/711/7...", "801/802/화장실", "801/808/809/8A", "801/808/809/8A"] },
    { date: 16, units: ["502/504/505/512", "508/509/510/5...", "801/802/화장실", "801/808/809/8A", "801/808/809/8A"] },
    { date: 17, units: ["502/504/505/512", "508/509/510/5...", "705/707/708", "801/808/809/8A", "801/808/809/8A"] },
    { date: 18, units: ["508/509/510/5...", "705/707/708", "701/702/703/7...", "서브라운지/710...", "801/808/809/8A"] },
    { date: 19, units: ["501/5A/화장실", "508/509/510/5...", "709/710/711/7...", "801/802/화장실", "801/808/809/8A"] },
    {
      date: 20,
      units: ["401/402/402A/...", "세미나룸/4B/4C...", "메인라운지/스낵...", "508/509/510/5...", "701/702/703/7..."],
    },
    {
      date: 21,
      units: ["세미나룸/4B/4C...", "508/509/510/5...", "601/602/603/604", "609/610/611/6...", "801/802/화장실"],
    },
    { date: 22, units: ["508/509/510/5...", "709/710/711/7...", "705/707/708", "801/802/화장실", "801/808/809/8A"] },
    { date: 23, units: ["508/509/510/5...", "705/707/708", "801/802/화장실", "701/702/703/7...", "801/808/809/8A"] },
    { date: 24, units: ["508/509/510/5...", "705/707/708", "801/802/화장실", "701/702/703/7...", "서브라운지/710..."] },
    { date: 25, units: ["501/5A/화장실", "502/504/505/512", "508/509/510/5...", "801/802/화장실", "701/702/703/7..."] },
    {
      date: 26,
      units: ["세미나룸/4B/4C...", "501/5A/화장실", "508/509/510/5...", "801/802/화장실", "701/702/703/7..."],
    },
    { date: 27, units: ["401/402/402A/...", "705/707/708", "801/802/화장실", "701/702/703/7...", "707~709/711/..."] },
    { date: 28, units: ["501/5A/화장실", "502/504/505/512"] },
    { date: 29, units: ["세미나룸/4B/4C...", "501/5A/화장실"] },
    { date: 30, units: ["508/509/510/5...", "705/707/708"] },
  ]

  const renderContent = () => {
    switch (alert.title) {
      case "끄기 잊음":
        return (
          <>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-lg-regular">
                야래의 실내기들은 19:00 ~ 20:00에 운전 하였습니다. 퇴실 시 에어컨 전원을 확인하시기 바랍니다.
              </p>
              <p className="text-sm font-lg-regular mt-2">
                당월 다수 검출된 실내기는{" "}
                <span className="text-[#00A9E0] font-medium">
                  707~709/711/713/화장실(23회), 701/702/703/704/7B(21회), 503/506/507/513(15회), 801/802/화장실(15회),
                  705/707/708(13회)
                </span>
                입니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-lg-bold mb-4">2025년 9월</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-muted">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-lg-bold border-r last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  <div className="border-r border-b p-2 min-h-[100px] bg-muted/20"></div>

                  {forgetToTurnOffCalendar.map((day) => (
                    <div
                      key={day.date}
                      className={`border-r border-b last:border-r-0 p-2 min-h-[100px] hover:bg-muted/50 transition-colors ${
                        day.units.length > 0 ? "bg-white" : "bg-muted/20"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{day.date}</div>
                      <div className="space-y-0.5">
                        {day.units.map((unit, idx) => (
                          <div
                            key={idx}
                            className="text-xs px-1.5 py-0.5 bg-[#00A9E0]/10 text-[#00A9E0] rounded truncate"
                            title={unit}
                          >
                            {unit}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )

      case "실내 온도 이상":
        return (
          <>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-lg-regular">
                야래의 실내기들은 운전 중 실내온도가 일정하지 않습니다. 주변 출입문, 창문을 확인하시기 바랍니다.
              </p>
              <p className="text-sm font-lg-regular mt-2">
                해당기간 동안 실내온도 변동이 가장 큰 실내기는{" "}
                <span className="text-[#00A9E0] font-medium">701/702/703/704/7B</span> 입니다.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-3 text-left font-lg-bold">실내기명</th>
                    <th className="border p-3 text-center font-lg-bold">평균실내온도</th>
                    <th className="border p-3 text-center font-lg-bold">평균설정온도</th>
                    <th className="border p-3 text-center font-lg-bold">실내온도변동 최대</th>
                    <th className="border p-3 text-center font-lg-bold">실내온도변동 최소</th>
                    <th className="border p-3 text-center font-lg-bold">* 변동값</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3 text-[#00A9E0] font-medium">701/702/703/704/7B</td>
                    <td className="border p-3 text-center">24.8</td>
                    <td className="border p-3 text-center">20.4</td>
                    <td className="border p-3 text-center">28.0</td>
                    <td className="border p-3 text-center">21.0</td>
                    <td className="border p-3 text-center">7.0</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">707~709/711/713/화장실</td>
                    <td className="border p-3 text-center">25.1</td>
                    <td className="border p-3 text-center">22.3</td>
                    <td className="border p-3 text-center">28.0</td>
                    <td className="border p-3 text-center">21.5</td>
                    <td className="border p-3 text-center">6.5</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">서브라운지/710/712/7A/창고</td>
                    <td className="border p-3 text-center">24.5</td>
                    <td className="border p-3 text-center">20.6</td>
                    <td className="border p-3 text-center">26.5</td>
                    <td className="border p-3 text-center">20.5</td>
                    <td className="border p-3 text-center">6.0</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">801/808/809/8A</td>
                    <td className="border p-3 text-center">25.0</td>
                    <td className="border p-3 text-center">20.5</td>
                    <td className="border p-3 text-center">28.5</td>
                    <td className="border p-3 text-center">22.5</td>
                    <td className="border p-3 text-center">6.0</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">809/810</td>
                    <td className="border p-3 text-center">25.5</td>
                    <td className="border p-3 text-center">23.4</td>
                    <td className="border p-3 text-center">29.5</td>
                    <td className="border p-3 text-center">23.5</td>
                    <td className="border p-3 text-center">6.0</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">705/706/707</td>
                    <td className="border p-3 text-center">25.3</td>
                    <td className="border p-3 text-center">23.5</td>
                    <td className="border p-3 text-center">27.5</td>
                    <td className="border p-3 text-center">22.0</td>
                    <td className="border p-3 text-center">5.5</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">508/509/510/511</td>
                    <td className="border p-3 text-center">23.9</td>
                    <td className="border p-3 text-center">18.4</td>
                    <td className="border p-3 text-center">27.5</td>
                    <td className="border p-3 text-center">22.0</td>
                    <td className="border p-3 text-center">5.5</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">502/504/505/512</td>
                    <td className="border p-3 text-center">23.6</td>
                    <td className="border p-3 text-center">20.8</td>
                    <td className="border p-3 text-center">27.0</td>
                    <td className="border p-3 text-center">22.0</td>
                    <td className="border p-3 text-center">5.0</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">503/506/507/513</td>
                    <td className="border p-3 text-center">23.8</td>
                    <td className="border p-3 text-center">21.8</td>
                    <td className="border p-3 text-center">27.5</td>
                    <td className="border p-3 text-center">22.5</td>
                    <td className="border p-3 text-center">5.0</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">803/804/805/806/807</td>
                    <td className="border p-3 text-center">24.7</td>
                    <td className="border p-3 text-center">21.2</td>
                    <td className="border p-3 text-center">27.5</td>
                    <td className="border p-3 text-center">23.0</td>
                    <td className="border p-3 text-center">4.5</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-2">* 변동값 : 실내온도변동최대 - 실내온도변동최소</p>
            </div>
          </>
        )

      case "잦은 On/Off":
        return (
          <>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-lg-regular">
                야래의 실내기들은 관방법/관난방 상태로 ON, OFF를 반복하고 있습니다. 잦은 사용으로도 쾌적할 수 있으니
                사용시간을 줄여보시기 바랍니다.
              </p>
              <p className="text-sm font-lg-regular mt-2">
                설정온도조절 및 비사용 실내기 OFF를 통해 잦은 ON, OFF 운전을 개선하시기 바랍니다. 가장 개선이 필요한
                실내기는 <span className="text-[#00A9E0] font-medium">801/802/화장실</span> 입니다.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-3 text-left font-lg-bold">실내기명</th>
                    <th className="border p-3 text-center font-lg-bold">잦은 ON, OFF 검출횟수</th>
                    <th className="border p-3 text-center font-lg-bold">끄기잊음 검출횟수</th>
                    <th className="border p-3 text-center font-lg-bold">설정온도과다 검출횟수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3 text-[#00A9E0] font-medium">801/802/화장실</td>
                    <td className="border p-3 text-center">30</td>
                    <td className="border p-3 text-center">15</td>
                    <td className="border p-3 text-center">30</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">609/610/611/612/포지스존</td>
                    <td className="border p-3 text-center">29</td>
                    <td className="border p-3 text-center">5</td>
                    <td className="border p-3 text-center">9</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">508/509/510/511</td>
                    <td className="border p-3 text-center">28</td>
                    <td className="border p-3 text-center">7</td>
                    <td className="border p-3 text-center">28</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">601/602/603/604</td>
                    <td className="border p-3 text-center">28</td>
                    <td className="border p-3 text-center">8</td>
                    <td className="border p-3 text-center">23</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">707~709/711/713/화장실</td>
                    <td className="border p-3 text-center">28</td>
                    <td className="border p-3 text-center">23</td>
                    <td className="border p-3 text-center">27</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">메인라운지/스낵코너/화장실/CM대스크</td>
                    <td className="border p-3 text-center">28</td>
                    <td className="border p-3 text-center">9</td>
                    <td className="border p-3 text-center">9</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">503/506/507/513</td>
                    <td className="border p-3 text-center">27</td>
                    <td className="border p-3 text-center">15</td>
                    <td className="border p-3 text-center">24</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">704/706/713</td>
                    <td className="border p-3 text-center">27</td>
                    <td className="border p-3 text-center">3</td>
                    <td className="border p-3 text-center">22</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">701/702/703/화장실</td>
                    <td className="border p-3 text-center">27</td>
                    <td className="border p-3 text-center">4</td>
                    <td className="border p-3 text-center">26</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">705/707/708</td>
                    <td className="border p-3 text-center">27</td>
                    <td className="border p-3 text-center">13</td>
                    <td className="border p-3 text-center">24</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )

      case "설정 온도 과다":
        return (
          <>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-lg-regular">
                야래의 실내기들은 적정온도 설정이 필요합니다. 여름철 적정온도 26도, 겨울철 적정온도 20도를 맞추시기
                바랍니다.
              </p>
              <p className="text-sm font-lg-regular mt-2">
                당월 다수 검출된 실내기는{" "}
                <span className="text-[#00A9E0] font-medium">
                  801/802/화장실(30회), 508/509/510/511(28회), 707~709/711/713/화장실(27회), 701/702/703/704/7B(26회),
                  701/702/703/화장실(26회)
                </span>
                입니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-lg-bold mb-4">2025년 9월</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-muted">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-lg-bold border-r last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  <div className="border-r border-b p-2 min-h-[100px] bg-muted/20"></div>

                  {excessiveTempCalendar.map((day) => (
                    <div
                      key={day.date}
                      className={`border-r border-b last:border-r-0 p-2 min-h-[100px] hover:bg-muted/50 transition-colors ${
                        day.units.length > 0 ? "bg-white" : "bg-muted/20"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{day.date}</div>
                      <div className="space-y-0.5">
                        {day.units.map((unit, idx) => (
                          <div
                            key={idx}
                            className="text-xs px-1.5 py-0.5 bg-[#00A9E0]/10 text-[#00A9E0] rounded truncate"
                            title={unit}
                          >
                            {unit}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )

      case "에너지 누수":
        return (
          <>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-lg-regular">
                야래의 실내기들은 운전 중 설정온도에 도달하지 못하고 있습니다. 주로 건물 외벽 유리창으로 인한 열손실로
                발생합니다.
              </p>
              <p className="text-sm font-lg-regular mt-2">
                블라인드커튼이나 롤스크린을 사용하시기 바랍니다. 가장 개선이 필요한 실내기는{" "}
                <span className="text-[#00A9E0] font-medium">508/509/510/511</span> 입니다.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-3 text-left font-lg-bold">실내기명</th>
                    <th className="border p-3 text-center font-lg-bold">평균실내온도</th>
                    <th className="border p-3 text-center font-lg-bold">평균설정온도</th>
                    <th className="border p-3 text-center font-lg-bold">* 편차</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3 text-[#00A9E0] font-medium">508/509/510/511</td>
                    <td className="border p-3 text-center">23.9</td>
                    <td className="border p-3 text-center">18.4</td>
                    <td className="border p-3 text-center">5.5</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">801/802/화장실</td>
                    <td className="border p-3 text-center">25.0</td>
                    <td className="border p-3 text-center">19.7</td>
                    <td className="border p-3 text-center">5.3</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">801/808/809/8A</td>
                    <td className="border p-3 text-center">25.0</td>
                    <td className="border p-3 text-center">20.5</td>
                    <td className="border p-3 text-center">4.5</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">701/702/703/704/7B</td>
                    <td className="border p-3 text-center">24.8</td>
                    <td className="border p-3 text-center">20.4</td>
                    <td className="border p-3 text-center">4.4</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">501/5A/화장실</td>
                    <td className="border p-3 text-center">24.4</td>
                    <td className="border p-3 text-center">20.0</td>
                    <td className="border p-3 text-center">4.4</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-2">* 편차 : 평균실내온도 – 평균설정온도</p>
            </div>
          </>
        )

      case "운전 시간 과다":
        return (
          <>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-lg-regular">
                야래의 실내기들은 장시간 운전하는 것으로 보입니다. 에너지 절감을 위해 실내기 사용 패턴을
                확인하시기바랍니다.
              </p>
              <p className="text-sm font-lg-regular mt-2">
                가장 점검이 필요한 실내기는 <span className="text-[#00A9E0] font-medium">707~709/711/713/화장실</span>{" "}
                입니다.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-3 text-left font-lg-bold">실내기명</th>
                    <th className="border p-3 text-center font-lg-bold">끄기 잊음 검출횟수</th>
                    <th className="border p-3 text-center font-lg-bold">설정온도과다 검출횟수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3 text-[#00A9E0] font-medium">707~709/711/713/화장실</td>
                    <td className="border p-3 text-center">23</td>
                    <td className="border p-3 text-center">27</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">801/802/화장실</td>
                    <td className="border p-3 text-center">15</td>
                    <td className="border p-3 text-center">30</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">601/602/603/604</td>
                    <td className="border p-3 text-center">8</td>
                    <td className="border p-3 text-center">23</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">508/509/510/511</td>
                    <td className="border p-3 text-center">7</td>
                    <td className="border p-3 text-center">28</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="border p-3">609/610/611/612/포지스존</td>
                    <td className="border p-3 text-center">5</td>
                    <td className="border p-3 text-center">9</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-lg-bold">
            {alert.title} – {alert.subtitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">{renderContent()}</div>

        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="px-8 bg-[#8B1538] hover:bg-[#8B1538]/90">
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
