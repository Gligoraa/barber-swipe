"use client"

import { Home, Heart, User } from "lucide-react"
import { motion } from "framer-motion"

type Tab = "home" | "favorites" | "profile"

interface NavigationBarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const tabs = [
    { id: "home" as Tab, icon: Home, label: "Home" },
    { id: "favorites" as Tab, icon: Heart, label: "Favorites" },
    { id: "profile" as Tab, icon: User, label: "Profile" },
  ]

  return (
    <nav className="sticky bottom-0 z-40 flex items-center justify-around border-t border-white/5 bg-background/60 py-3 backdrop-blur-xl pb-safe-area-inset-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-6 py-1 transition-all ${
              isActive ? "text-primary" : "text-muted-foreground/60"
            }`}
            aria-label={tab.label}
          >
            <div className="relative">
              <Icon
                className={`h-6 w-6 transition-all ${
                  isActive ? "scale-110" : "scale-100"
                }`}
              />
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -inset-2 bg-primary/10 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
              {tab.label}
            </span>
          </motion.button>
        )
      })}
    </nav>
  )
}
