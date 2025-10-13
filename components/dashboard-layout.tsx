"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, MapPin, Bell, FileBarChart, Menu, X } from "lucide-react"
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
import { useState } from "react"

const navigation = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "로직", href: "/logic", icon: FileText },
  { name: "현황", href: "/status", icon: MapPin },
  { name: "에너지 리포트", href: "/report", icon: FileBarChart },
]

const energyAlerts = [
  { id: 1, location: "3번 회의실", message: "끄지 않음", time: "10분 전" },
  { id: 2, location: "2번 사무실", message: "과도한 냉방", time: "25분 전" },
  { id: 3, location: "1층 로비", message: "설정 온도 과다", time: "1시간 전" },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
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
          <h1 className="text-lg lg:text-xl font-bold text-sidebar-foreground">BECON Cloud</h1>
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
                {energyAlerts.length > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {energyAlerts.length}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>에너지 낭비 알림</DialogTitle>
                <DialogDescription>현재 감지된 에너지 낭비 상황입니다.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {energyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/50"
                  >
                    <Bell className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">
                        {alert.location} {alert.message}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setOpen(false)}>확인</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <main className="flex-1 overflow-auto pt-16 lg:pt-0">{children}</main>
    </div>
  )
}
