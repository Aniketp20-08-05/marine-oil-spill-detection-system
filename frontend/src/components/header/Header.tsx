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
      setCurrentTime(now.getUTCHours().toString().padStart(2, '0') + ":" + 
                    now.getUTCMinutes().toString().padStart(2, '0') + ":" + 
                    now.getUTCSeconds().toString().padStart(2, '0') + " UTC LIVE");
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
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-100 text-2xl shadow-inner dark:bg-slate-800">
           🌊
        </div>

        {/* Center: Title */}
        <h1 style={{ color: 'var(--text-primary)' }} className="text-xl font-black uppercase tracking-[0.2em] md:text-2xl">
          MARINE OIL SPILL DETECTION SYSTEM
        </h1>

        {/* Right: Time & Toggle */}
        <div className="flex items-center gap-6">
          <div className="text-[11px] font-black tracking-widest opacity-60">
            {currentTime || "00:00:00 UTC LIVE"}
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