"use client"

import { X, Check } from "lucide-react"
import { motion } from "framer-motion"

interface ActionButtonsProps {
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export function ActionButtons({ onSwipeLeft, onSwipeRight }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-10 py-6">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSwipeLeft}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 backdrop-blur-md shadow-[0_8px_32px_rgba(255,59,48,0.2)] transition-all hover:bg-destructive/20"
        aria-label="Pass"
      >
        <X className="h-8 w-8 text-destructive" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSwipeRight}
        className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md shadow-[0_8px_32px_rgba(212,175,55,0.2)] transition-all hover:bg-primary/20"
        aria-label="Like"
      >
        <Check className="h-10 w-10 text-primary" />
      </motion.button>
    </div>
  )
}
