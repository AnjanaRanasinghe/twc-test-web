const BackgroundPattern = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-100 bg-opacity-80 z-0">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="contacts-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M10,10 L20,10 L20,20 L10,20 Z" fill="#000" />
                  <circle cx="50" cy="50" r="10" fill="#000" />
                  <path d="M70,70 Q80,60 90,70 T110,70" fill="none" stroke="#000" strokeWidth="2" />
                  <text x="30" y="40" fontSize="10" fill="#000">
                    @
                  </text>
                  <text x="70" y="30" fontSize="8" fill="#000">
                    📞
                  </text>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#contacts-pattern)" />
            </svg>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[#1e3a4c] z-0"></div>
        <div className="absolute top-0 left-0 w-16 h-16 bg-[#1e3a4c] z-10"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#1e3a4c] z-10"></div>
      </div>
    )
  }
  
  export default BackgroundPattern
  
  