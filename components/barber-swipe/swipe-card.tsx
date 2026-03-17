"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"
import Image from "next/image"
import { Star, MapPin } from "lucide-react"

import { Barbershop } from "./barber-swipe-app"

interface SwipeCardProps {
  barbershop: Barbershop
  onSwipe: (direction: "left" | "right") => void
  isTop: boolean
}

export function SwipeCard({ barbershop, onSwipe, isTop }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      setExitDirection("right")
      setTimeout(() => onSwipe("right"), 200)
    } else if (info.offset.x < -threshold) {
      setExitDirection("left")
      setTimeout(() => onSwipe("left"), 200)
    }
  }

  const handleImageTap = () => {
    setCurrentImageIndex((prev) => (prev + 1) % barbershop.images.length)
  }

  const exitVariants = {
    left: { x: -500, rotate: -30, opacity: 0 },
    right: { x: 500, rotate: 30, opacity: 0 },
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={exitDirection ? exitVariants[exitDirection] : {}}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-card shadow-2xl">
        {/* Photo section */}
        <div 
          className="relative h-[75%] w-full cursor-pointer overflow-hidden"
          onClick={handleImageTap}
        >
          {barbershop.images.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={image}
                alt={`${barbershop.name} - Photo ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
          ))}

          {/* Dot indicators */}
          <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 px-4">
            {barbershop.images.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 max-w-8 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* LIKE stamp */}
          <motion.div
            className="absolute top-20 left-6 rotate-[-20deg] rounded-lg border-4 border-[#22c55e] px-4 py-2"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-3xl font-bold tracking-wider text-[#22c55e]">LIKE</span>
          </motion.div>

          {/* NOPE stamp */}
          <motion.div
            className="absolute top-20 right-6 rotate-[20deg] rounded-lg border-4 border-destructive px-4 py-2"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-3xl font-bold tracking-wider text-destructive">NOPE</span>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />
        </div>

        {/* Info section */}
        <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-card p-5">
          <h2 className="text-xl font-bold text-foreground">{barbershop.name}</h2>
          <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#C9A84C] text-[#C9A84C]" />
              <span className="font-medium text-foreground">{barbershop.rating}</span>
              {barbershop.user_ratings_total != null && (
                <span className="text-muted-foreground">({barbershop.user_ratings_total})</span>
              )}
            </div>
            {barbershop.price_level && (
              <>
                <span>·</span>
                <span className="font-medium text-[#22c55e]">
                  {"$".repeat(barbershop.price_level)}
                </span>
              </>
            )}
          </div>
          {barbershop.address && (
            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#C9A84C]" />
              <span className="line-clamp-2">{barbershop.address}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
