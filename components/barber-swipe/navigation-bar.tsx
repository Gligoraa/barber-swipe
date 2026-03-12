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
    <nav className="flex items-center justify-around border-t border-border bg-card py-2">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
              isActive ? "text-[#C9A84C]" : "text-muted-foreground"
            }`}
            aria-label={tab.label}
          >
            <Icon
              className={`h-6 w-6 transition-all ${
                isActive ? "fill-[#C9A84C]/20" : ""
              }`}
            />
            <span className="text-xs font-medium">{tab.label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}
