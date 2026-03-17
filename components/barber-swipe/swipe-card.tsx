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
            className="absolute top-16 left-8 rotate-[-15deg] rounded-xl border-[6px] border-primary px-6 py-2"
            style={{ opacity: likeOpacity, scale: useTransform(x, [0, 100], [0.8, 1]) }}
          >
            <span className="text-4xl font-black tracking-tighter text-primary">MATCH</span>
          </motion.div>

          {/* NOPE stamp */}
          <motion.div
            className="absolute top-16 right-8 rotate-[15deg] rounded-xl border-[6px] border-destructive px-6 py-2"
            style={{ opacity: nopeOpacity, scale: useTransform(x, [-100, 0], [1, 0.8]) }}
          >
            <span className="text-4xl font-black tracking-tighter text-destructive">PASS</span>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Info section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-bold text-foreground leading-tight">{barbershop.name}</h2>
          </div>
          
          <div className="mt-2 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="font-bold text-primary">{barbershop.rating}</span>
              {barbershop.user_ratings_total != null && (
                <span className="text-muted-foreground font-normal ml-0.5">({barbershop.user_ratings_total})</span>
              )}
            </div>
            
            {barbershop.price_level && (
              <div className="flex items-center px-2 py-0.5 bg-success/10 rounded-full border border-success/20">
                <span className="text-xs font-bold text-success">
                  {"$".repeat(barbershop.price_level)}
                </span>
              </div>
            )}
          </div>

          {barbershop.address && (
            <div className="mt-3 flex items-start gap-2 bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span className="text-sm text-foreground/80 leading-snug line-clamp-2">
                {barbershop.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
