"use client"

import Image from "next/image"
import { Settings, Bell, HelpCircle, LogOut } from "lucide-react"
import { motion } from "framer-motion"

interface ProfileScreenProps {
  userName: string
  userEmail: string
  favoritesCount: number
  onLogout: () => void
}

export function ProfileScreen({ userName, userEmail, favoritesCount, onLogout }: ProfileScreenProps) {
  const menuItems = [
    { icon: Settings, label: "Settings", action: () => {} },
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
    { icon: LogOut, label: "Log Out", action: onLogout },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#C9A84C] bg-card text-3xl font-bold text-[#C9A84C]">
          {userName.charAt(0).toUpperCase()}
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">{userName}</h2>
        <p className="text-muted-foreground">{userEmail}</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 flex justify-center gap-8"
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C9A84C]">{favoritesCount}</p>
          <p className="text-sm text-muted-foreground">Favorites</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C9A84C]">0</p>
          <p className="text-sm text-muted-foreground">Appointments</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C9A84C]">0</p>
          <p className="text-sm text-muted-foreground">Reviews</p>
        </div>
      </motion.div>

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 space-y-2"
      >
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={item.action}
              className="flex w-full items-center gap-4 rounded-xl bg-card p-4 text-foreground transition-colors hover:bg-secondary"
            >
              <Icon className="h-5 w-5 text-[#C9A84C]" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </motion.div>
    </div>
  )
}
