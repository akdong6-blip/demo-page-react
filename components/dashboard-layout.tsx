"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Bell,
  FileBarChart,
  Menu,
  X,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"

const navigation = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "로직", href: "/logic", icon: FileText },
  { name: "현황", href: "/status", icon: MapPin },
  { name: "에너지 리포트", href: "/report", icon: FileBarChart },
]

const energyWasteFactors = [
  {
    id: 1,
    title: "끄기 잊음",
    description: "켜져 있는 실내기가 있습니다.\n에어컨 On/Off를 확인하시길 바랍니다.",
  },
  {
    id: 2,
    title: "단열 불량 알림",
    description: "실내기가 설정온도에 도달하지 못하고 있습니다.\n주위 환경을 점검하세요",
  },
  {
    id: 3,
    title: "설정온도과다",
    description: "적정온도에 맞춰이 필요한 실내기가 있습니다.\n설정온도를 확인하세요",
  },
  {
    id: 4,
    title: "실내온도이상",
    description: "특정실내기 운전중임에도 실내온도가 변동하고 있습니다.\n실내기와 주위 환경 점검이 필요합니다.",
  },
  {
    id: 5,
    title: "운전시간과다",
    description: "실내기의 운전이 장시간 지속되고 있습니다.\n실내기 사용 확인이 필요합니다.",
  },
  {
    id: 6,
    title: "잦은 On/Off",
    description: "설치된 공간은 냉방/난방이 많이 필요하지 않은 공간으로 추정됩니다.\n사용 환경 점검이 필요합니다",
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    if (!autoPlay || !popupOpen) return

    const timer = setTimeout(() => {
      if (currentIndex < energyWasteFactors.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        setAutoPlay(false)
        setPopupOpen(false)
        setCurrentIndex(0)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [autoPlay, popupOpen, currentIndex])

  const showSequentialPopup = () => {
    setCurrentIndex(0)
    setPopupOpen(true)
    setAutoPlay(true)
  }

  const handleNext = () => {
    if (currentIndex < energyWasteFactors.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setAutoPlay(false)
    } else {
      setPopupOpen(false)
      setCurrentIndex(0)
      setAutoPlay(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setAutoPlay(false)
    }
  }

  const currentFactor = energyWasteFactors[currentIndex]

  return (
    <div className="flex h-screen bg-background">
      <Dialog
        open={popupOpen}
        onOpenChange={(open) => {
          setPopupOpen(open)
          if (!open) {
            setCurrentIndex(0)
            setAutoPlay(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              에너지 낭비 알림
            </DialogTitle>
            <DialogDescription>
              {currentIndex + 1} / {energyWasteFactors.length}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-destructive/10">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-foreground">{currentFactor.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {currentFactor.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 pt-4 border-t">
            <Button onClick={handlePrev} variant="outline" size="sm" disabled={currentIndex === 0}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </Button>
            <div className="flex gap-1">
              {energyWasteFactors.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentIndex ? "bg-primary" : "bg-muted",
                  )}
                />
              ))}
            </div>
            <Button
              onClick={handleNext}
              variant={currentIndex === energyWasteFactors.length - 1 ? "default" : "outline"}
              size="sm"
            >
              {currentIndex === energyWasteFactors.length - 1 ? "완료" : "다음"}
              {currentIndex < energyWasteFactors.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      <aside
        className={cn(
          "w-64 bg-sidebar border-r border-sidebar-border flex flex-col",
          "fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-4 lg:p-6 border-b border-sidebar-border">
          <h1 className="text-lg lg:text-xl font-bold text-sidebar-foreground">BECON cloud</h1>
          <div className="mt-2 text-xs lg:text-sm text-sidebar-foreground/70">외부온도 26°C (예년: 29°C)</div>
        </div>

        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 lg:p-4 border-t border-sidebar-border">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 relative bg-transparent text-sm lg:text-base text-white hover:text-white"
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>에너지 낭비 알림</span>
                {energyWasteFactors.length > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {energyWasteFactors.length}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">주요 제공 항목</DialogTitle>
                <DialogDescription>에너지 낭비 요인을 확인하고 개선하세요.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {energyWasteFactors.map((factor) => (
                  <div
                    key={factor.id}
                    className="flex items-start gap-4 p-5 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-lg text-foreground">{factor.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line italic">
                        "{factor.description}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setOpen(false)} size="lg">
                  확인
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-end items-center p-4 border-b border-border bg-background">
          <Button onClick={showSequentialPopup} variant="default" className="gap-2">
            <Bell className="w-4 h-4" />
            팝업
          </Button>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
