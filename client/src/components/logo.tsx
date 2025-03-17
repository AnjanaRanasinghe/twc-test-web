import type { FC } from "react"

interface LogoProps {
  className?: string
}

const Logo: FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center">
        <span className="text-red-500 font-bold text-2xl mr-1">M</span>
        <span className="text-white font-bold text-2xl">twc</span>
      </div>
      <div className="text-[#1e3a4c] font-bold text-3xl">contacts</div>
      <div className="text-[#1e3a4c] font-bold text-3xl">portal</div>
    </div>
  )
}

export default Logo

