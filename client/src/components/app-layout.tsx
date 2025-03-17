"use client"

import type React from "react"

import { useAuth } from "./auth-provider"
import BackgroundPattern from "./background-pattern"
import Logo from "./logo"
import { LogOut } from "lucide-react"

export default function AppLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const { logout } = useAuth()

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundPattern />
      <div className="relative z-10 min-h-screen p-8 flex flex-col">
        <header className="mb-8">
          <div className="text-white text-2xl font-bold">{title}</div>
        </header>

        <div className="flex-1 relative">
          <div className="absolute top-4 left-4">
            <Logo className="scale-75 origin-top-left" />
          </div>

          {children}

          <button onClick={logout} className="absolute bottom-4 right-4 text-white flex items-center">
            <LogOut className="mr-2 h-5 w-5" />
            <span>logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

