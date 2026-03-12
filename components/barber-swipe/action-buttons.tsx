"use client"

import { X, Check } from "lucide-react"
import { motion } from "framer-motion"

interface ActionButtonsProps {
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export function ActionButtons({ onSwipeLeft, onSwipeRight }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSwipeLeft}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-destructive bg-background shadow-lg transition-colors hover:bg-destructive/10"
        aria-label="Pass"
      >
        <X className="h-8 w-8 text-destructive" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSwipeRight}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#22c55e] bg-background shadow-lg transition-colors hover:bg-[#22c55e]/10"
        aria-label="Like"
      >
        <Check className="h-8 w-8 text-[#22c55e]" />
      </motion.button>
    </div>
  )
}
