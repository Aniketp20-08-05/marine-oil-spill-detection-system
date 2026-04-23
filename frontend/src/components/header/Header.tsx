"use client";

import { useThemeMode } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, toggleTheme } = useThemeMode();
  const isDark = theme === "dark";
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // IST = UTC + 5:30
      const istOffset = 5.5 * 60 * 60 * 1000;
      const ist = new Date(now.getTime() + istOffset);
      setCurrentTime(
        ist.getUTCHours().toString().padStart(2, '0') + ":" +
        ist.getUTCMinutes().toString().padStart(2, '0') + ":" +
        ist.getUTCSeconds().toString().padStart(2, '0') + " IST LIVE"
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--highlight)' }}
      className="rounded-[32px] border px-8 py-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        {/* Left: Logo Placeholder */}
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-slate-700 bg-[#0a1e3b] shadow-inner">
           <img src="/assets/images/Logo.png" alt="Marine Oil Spill Detection Logo" className="h-[180%] w-auto max-w-none object-contain" />
        </div>

        {/* Center: Title */}
        <h1 style={{ color: 'var(--text-primary)' }} className="text-xl font-black uppercase tracking-[0.2em] md:text-2xl">
          MARINE OIL SPILL DETECTION SYSTEM
        </h1>

        {/* Right: Time & Toggle */}
        <div className="flex items-center gap-6">
          <div className="text-[11px] font-black tracking-widest opacity-60">
            {currentTime || "00:00:00 IST LIVE"}
          </div>
          
          <button
            type="button"
            onClick={toggleTheme}
            style={{ backgroundColor: 'var(--highlight)' }}
            className="relative flex h-8 w-16 items-center rounded-full p-1 transition-all"
          >
            <div 
               style={{ 
                 backgroundColor: 'var(--bg-card)', 
                 transform: isDark ? 'translateX(32px)' : 'translateX(0px)',
                 color: isDark ? 'var(--secondary)' : 'var(--warning)'
               }}
               className="flex h-6 w-6 items-center justify-center rounded-full shadow-md transition-transform duration-300"
            >
              {isDark ? "🌙" : "☀️"}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}