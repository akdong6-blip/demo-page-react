"use client"

interface RegionData {
  region: string
  sites: number
  percentage: number
}

interface KoreaMapProps {
  data: RegionData[]
}

export function KoreaMap({ data }: KoreaMapProps) {
  const regionMap = new Map(data.map((d) => [d.region, d]))

  const getRegionData = (region: string) => {
    return regionMap.get(region) || { region, sites: 0, percentage: 0 }
  }

  const getCircleSize = (sites: number) => {
    if (sites >= 1000) return 8
    if (sites >= 500) return 7
    if (sites >= 200) return 6
    if (sites >= 100) return 5
    if (sites >= 50) return 4
    return 3
  }

  const getCircleColor = (sites: number) => {
    if (sites >= 1000) return "#DC2626" // red-600
    if (sites >= 500) return "#EF4444" // red-500
    if (sites >= 200) return "#F87171" // red-400
    if (sites >= 100) return "#FCA5A5" // red-300
    return "#FECACA" // red-200
  }

  // Get data for each region
  const seoul = getRegionData("서울")
  const gyeonggi = getRegionData("경기")
  const incheon = getRegionData("인천")
  const gangwon = getRegionData("강원")
  const chungbuk = getRegionData("충북")
  const chungnam = getRegionData("충남")
  const daejeon = getRegionData("대전")
  const sejong = getRegionData("세종")
  const jeonbuk = getRegionData("전북")
  const jeonnam = getRegionData("전남")
  const gwangju = getRegionData("광주")
  const gyeongbuk = getRegionData("경북")
  const gyeongnam = getRegionData("경남")
  const daegu = getRegionData("대구")
  const ulsan = getRegionData("울산")
  const busan = getRegionData("부산")
  const jeju = getRegionData("제주")

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden border border-border shadow-lg">
      <svg viewBox="0 0 400 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Seoul/Gyeonggi Region */}
        <path
          d="M 180 140 L 200 135 L 220 140 L 235 155 L 240 175 L 235 190 L 220 200 L 200 205 L 180 200 L 165 190 L 160 175 L 165 155 Z"
          fill="#E0E7FF"
          stroke="#6366F1"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Gangwon */}
        <path
          d="M 240 175 L 260 170 L 280 180 L 290 200 L 285 220 L 270 235 L 250 240 L 235 230 L 235 210 L 240 190 Z"
          fill="#FEE2E2"
          stroke="#EF4444"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Chungcheong */}
        <path
          d="M 165 190 L 180 200 L 200 205 L 220 200 L 235 210 L 235 230 L 220 250 L 200 260 L 180 265 L 160 260 L 145 245 L 140 225 L 145 205 Z"
          fill="#DBEAFE"
          stroke="#3B82F6"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Gyeongsang */}
        <path
          d="M 235 230 L 250 240 L 270 235 L 285 250 L 290 270 L 285 290 L 275 310 L 265 330 L 255 350 L 245 370 L 235 385 L 220 395 L 205 390 L 195 375 L 190 355 L 195 335 L 205 315 L 215 295 L 220 275 L 225 255 Z"
          fill="#FECACA"
          stroke="#DC2626"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Jeolla */}
        <path
          d="M 160 260 L 180 265 L 200 260 L 220 275 L 215 295 L 205 315 L 195 335 L 185 350 L 175 365 L 160 375 L 145 380 L 130 375 L 120 360 L 115 340 L 115 320 L 120 300 L 130 280 L 145 270 Z"
          fill="#E0E7FF"
          stroke="#6366F1"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Jeju Island */}
        <ellipse cx="160" cy="450" rx="35" ry="18" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" opacity="0.5" />

        {/* Regional Markers with Real Data */}
        {/* Seoul */}
        <circle cx="200" cy="175" r={getCircleSize(seoul.sites)} fill={getCircleColor(seoul.sites)} />
        <text x="200" y="160" textAnchor="middle" className="text-xs font-lg-bold fill-foreground">
          서울
        </text>
        <text x="200" y="195" textAnchor="middle" className="text-[10px] font-lg-regular fill-foreground">
          {seoul.sites}곳 ({seoul.percentage.toFixed(1)}%)
        </text>

        {/* Gyeonggi */}
        <circle cx="215" cy="185" r={getCircleSize(gyeonggi.sites)} fill={getCircleColor(gyeonggi.sites)} />
        <text x="250" y="180" textAnchor="start" className="text-xs font-lg-bold fill-foreground">
          경기
        </text>
        <text x="250" y="192" textAnchor="start" className="text-[10px] font-lg-regular fill-foreground">
          {gyeonggi.sites}곳 ({gyeonggi.percentage.toFixed(1)}%)
        </text>

        {/* Incheon */}
        <circle cx="165" cy="180" r={getCircleSize(incheon.sites)} fill={getCircleColor(incheon.sites)} />
        <text x="135" y="180" textAnchor="end" className="text-[10px] font-lg-bold fill-foreground">
          인천 {incheon.sites}곳
        </text>

        {/* Gangwon */}
        <circle cx="270" cy="200" r={getCircleSize(gangwon.sites)} fill={getCircleColor(gangwon.sites)} />
        <text x="295" y="200" textAnchor="start" className="text-[10px] font-lg-bold fill-foreground">
          강원 {gangwon.sites}곳
        </text>

        {/* Chungbuk */}
        <circle cx="210" cy="235" r={getCircleSize(chungbuk.sites)} fill={getCircleColor(chungbuk.sites)} />
        <text x="230" y="235" textAnchor="start" className="text-[10px] font-lg-bold fill-foreground">
          충북 {chungbuk.sites}곳
        </text>

        {/* Chungnam */}
        <circle cx="165" cy="235" r={getCircleSize(chungnam.sites)} fill={getCircleColor(chungnam.sites)} />
        <text x="135" y="235" textAnchor="end" className="text-[10px] font-lg-bold fill-foreground">
          충남 {chungnam.sites}곳
        </text>

        {/* Daejeon */}
        <circle cx="185" cy="245" r={getCircleSize(daejeon.sites)} fill={getCircleColor(daejeon.sites)} />
        <text x="185" y="260" textAnchor="middle" className="text-[10px] font-lg-bold fill-foreground">
          대전 {daejeon.sites}곳
        </text>

        {/* Sejong */}
        <circle cx="195" cy="225" r={getCircleSize(sejong.sites)} fill={getCircleColor(sejong.sites)} />
        <text x="195" y="215" textAnchor="middle" className="text-[9px] font-lg-bold fill-foreground">
          세종 {sejong.sites}곳
        </text>

        {/* Jeonbuk */}
        <circle cx="175" cy="295" r={getCircleSize(jeonbuk.sites)} fill={getCircleColor(jeonbuk.sites)} />
        <text x="145" y="295" textAnchor="end" className="text-[10px] font-lg-bold fill-foreground">
          전북 {jeonbuk.sites}곳
        </text>

        {/* Jeonnam */}
        <circle cx="155" cy="340" r={getCircleSize(jeonnam.sites)} fill={getCircleColor(jeonnam.sites)} />
        <text x="125" y="340" textAnchor="end" className="text-[10px] font-lg-bold fill-foreground">
          전남 {jeonnam.sites}곳
        </text>

        {/* Gwangju */}
        <circle cx="165" cy="320" r={getCircleSize(gwangju.sites)} fill={getCircleColor(gwangju.sites)} />
        <text x="165" y="310" textAnchor="middle" className="text-[10px] font-lg-bold fill-foreground">
          광주 {gwangju.sites}곳
        </text>

        {/* Gyeongbuk */}
        <circle cx="250" cy="280" r={getCircleSize(gyeongbuk.sites)} fill={getCircleColor(gyeongbuk.sites)} />
        <text x="280" y="280" textAnchor="start" className="text-[10px] font-lg-bold fill-foreground">
          경북 {gyeongbuk.sites}곳
        </text>

        {/* Gyeongnam */}
        <circle cx="225" cy="350" r={getCircleSize(gyeongnam.sites)} fill={getCircleColor(gyeongnam.sites)} />
        <text x="255" y="350" textAnchor="start" className="text-[10px] font-lg-bold fill-foreground">
          경남 {gyeongnam.sites}곳
        </text>

        {/* Daegu */}
        <circle cx="235" cy="305" r={getCircleSize(daegu.sites)} fill={getCircleColor(daegu.sites)} />
        <text x="260" y="305" textAnchor="start" className="text-[10px] font-lg-bold fill-foreground">
          대구 {daegu.sites}곳
        </text>

        {/* Ulsan */}
        <circle cx="265" cy="325" r={getCircleSize(ulsan.sites)} fill={getCircleColor(ulsan.sites)} />
        <text x="290" y="325" textAnchor="start" className="text-[10px] font-lg-bold fill-foreground">
          울산 {ulsan.sites}곳
        </text>

        {/* Busan */}
        <circle cx="245" cy="375" r={getCircleSize(busan.sites)} fill={getCircleColor(busan.sites)} />
        <text x="275" y="375" textAnchor="start" className="text-[10px] font-lg-bold fill-foreground">
          부산 {busan.sites}곳
        </text>

        {/* Jeju */}
        <circle cx="160" cy="450" r={getCircleSize(jeju.sites)} fill={getCircleColor(jeju.sites)} />
        <text x="160" y="470" textAnchor="middle" className="text-[10px] font-lg-bold fill-foreground">
          제주 {jeju.sites}곳
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
        <div className="text-xs font-lg-bold mb-2 text-foreground">현장 규모</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#DC2626]" />
            <span className="text-xs font-lg-regular text-foreground">1,000곳 이상</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444]" />
            <span className="text-xs font-lg-regular text-foreground">500-999곳</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F87171]" />
            <span className="text-xs font-lg-regular text-foreground">200-499곳</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FCA5A5]" />
            <span className="text-xs font-lg-regular text-foreground">100-199곳</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FECACA]" />
            <span className="text-xs font-lg-regular text-foreground">100곳 미만</span>
          </div>
        </div>
      </div>
    </div>
  )
}
