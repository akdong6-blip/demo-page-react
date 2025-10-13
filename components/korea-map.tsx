"use client"

export function KoreaMap() {
  return (
    <div className="relative w-full h-[500px] bg-white rounded-lg overflow-hidden border border-border">
      <svg viewBox="0 0 400 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Clean Korea Map Outline */}
        <g id="korea-outline">
          {/* Seoul/Gyeonggi Region */}
          <path
            d="M 180 140 L 200 135 L 220 140 L 235 155 L 240 175 L 235 190 L 220 200 L 200 205 L 180 200 L 165 190 L 160 175 L 165 155 Z"
            fill="none"
            stroke="#333"
            strokeWidth="1.5"
          />

          {/* Gangwon */}
          <path
            d="M 240 175 L 260 170 L 280 180 L 290 200 L 285 220 L 270 235 L 250 240 L 235 230 L 235 210 L 240 190 Z"
            fill="none"
            stroke="#333"
            strokeWidth="1.5"
          />

          {/* Chungcheong */}
          <path
            d="M 165 190 L 180 200 L 200 205 L 220 200 L 235 210 L 235 230 L 220 250 L 200 260 L 180 265 L 160 260 L 145 245 L 140 225 L 145 205 Z"
            fill="none"
            stroke="#333"
            strokeWidth="1.5"
          />

          {/* Gyeongsang */}
          <path
            d="M 235 230 L 250 240 L 270 235 L 285 250 L 290 270 L 285 290 L 275 310 L 265 330 L 255 350 L 245 370 L 235 385 L 220 395 L 205 390 L 195 375 L 190 355 L 195 335 L 205 315 L 215 295 L 220 275 L 225 255 Z"
            fill="none"
            stroke="#333"
            strokeWidth="1.5"
          />

          {/* Jeolla */}
          <path
            d="M 160 260 L 180 265 L 200 260 L 220 275 L 215 295 L 205 315 L 195 335 L 185 350 L 175 365 L 160 375 L 145 380 L 130 375 L 120 360 L 115 340 L 115 320 L 120 300 L 130 280 L 145 270 Z"
            fill="none"
            stroke="#333"
            strokeWidth="1.5"
          />

          {/* Jeju Island */}
          <ellipse cx="160" cy="450" rx="35" ry="18" fill="none" stroke="#333" strokeWidth="1.5" />
        </g>

        {/* Regional Labels and Markers */}
        {/* Seoul */}
        <circle cx="200" cy="175" r="6" fill="#4F46E5" />
        <text x="200" y="160" textAnchor="middle" className="text-xs font-semibold fill-foreground">
          서울
        </text>
        <text x="200" y="195" textAnchor="middle" className="text-[10px] fill-muted-foreground">
          340곳
        </text>

        {/* Gyeonggi */}
        <circle cx="215" cy="185" r="7" fill="#4F46E5" />
        <text x="240" y="185" textAnchor="start" className="text-xs font-semibold fill-foreground">
          경기 420곳
        </text>

        {/* Incheon */}
        <circle cx="165" cy="180" r="5" fill="#6366F1" />
        <text x="145" y="180" textAnchor="end" className="text-[10px] fill-foreground">
          인천 120곳
        </text>

        {/* Gangwon */}
        <circle cx="270" cy="200" r="4" fill="#818CF8" />
        <text x="295" y="200" textAnchor="start" className="text-[10px] fill-foreground">
          강원 80곳
        </text>

        {/* Chungbuk */}
        <circle cx="210" cy="235" r="4" fill="#818CF8" />
        <text x="230" y="235" textAnchor="start" className="text-[10px] fill-foreground">
          충북 90곳
        </text>

        {/* Chungnam */}
        <circle cx="165" cy="235" r="5" fill="#6366F1" />
        <text x="145" y="235" textAnchor="end" className="text-[10px] fill-foreground">
          충남 110곳
        </text>

        {/* Daejeon */}
        <circle cx="185" cy="245" r="4" fill="#818CF8" />
        <text x="185" y="260" textAnchor="middle" className="text-[10px] fill-foreground">
          대전 85곳
        </text>

        {/* Sejong */}
        <circle cx="195" cy="230" r="3" fill="#A5B4FC" />
        <text x="195" y="220" textAnchor="middle" className="text-[9px] fill-foreground">
          세종 45곳
        </text>

        {/* Jeonbuk */}
        <circle cx="175" cy="295" r="4" fill="#818CF8" />
        <text x="155" y="295" textAnchor="end" className="text-[10px] fill-foreground">
          전북 95곳
        </text>

        {/* Jeonnam */}
        <circle cx="155" cy="340" r="5" fill="#6366F1" />
        <text x="135" y="340" textAnchor="end" className="text-[10px] fill-foreground">
          전남 105곳
        </text>

        {/* Gwangju */}
        <circle cx="165" cy="320" r="4" fill="#818CF8" />
        <text x="165" y="310" textAnchor="middle" className="text-[10px] fill-foreground">
          광주 75곳
        </text>

        {/* Gyeongbuk */}
        <circle cx="250" cy="280" r="5" fill="#6366F1" />
        <text x="275" y="280" textAnchor="start" className="text-[10px] fill-foreground">
          경북 115곳
        </text>

        {/* Gyeongnam */}
        <circle cx="225" cy="350" r="6" fill="#4F46E5" />
        <text x="250" y="350" textAnchor="start" className="text-[10px] fill-foreground">
          경남 130곳
        </text>

        {/* Daegu */}
        <circle cx="235" cy="305" r="4" fill="#818CF8" />
        <text x="255" y="305" textAnchor="start" className="text-[10px] fill-foreground">
          대구 90곳
        </text>

        {/* Ulsan */}
        <circle cx="265" cy="325" r="4" fill="#818CF8" />
        <text x="285" y="325" textAnchor="start" className="text-[10px] fill-foreground">
          울산 60곳
        </text>

        {/* Busan */}
        <circle cx="245" cy="375" r="5" fill="#6366F1" />
        <text x="270" y="375" textAnchor="start" className="text-[10px] fill-foreground">
          부산 100곳
        </text>

        {/* Jeju */}
        <circle cx="160" cy="450" r="4" fill="#818CF8" />
        <text x="160" y="470" textAnchor="middle" className="text-[10px] fill-foreground">
          제주 50곳
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg border border-border shadow-sm">
        <div className="text-xs font-semibold mb-2 text-foreground">현장 규모</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4F46E5]" />
            <span className="text-xs text-foreground">300곳 이상</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
            <span className="text-xs text-foreground">100-299곳</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#818CF8]" />
            <span className="text-xs text-foreground">100곳 미만</span>
          </div>
        </div>
      </div>
    </div>
  )
}
