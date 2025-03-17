import type React from "react"
import BackgroundPattern from "./background-pattern"
import Logo from "./logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundPattern />
      <div className="relative z-10 flex min-h-screen">
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto">{children}</div>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <Logo />
        </div>
      </div>
    </div>
  )
}

