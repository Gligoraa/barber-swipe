"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Barbershop } from "./barber-swipe-app"

interface MatchScreenProps {
  barbershop: Barbershop
  onKeepSwiping: () => void
}

export function MatchScreen({ barbershop, onKeepSwiping }: MatchScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95 px-6 backdrop-blur-sm"
    >
      {/* Celebratory header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-[#C9A84C]">{"It's a Match!"}</h1>
        <p className="mt-1 text-4xl">💈</p>
      </motion.div>

      {/* Barbershop card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-2xl"
      >
        <div className="relative h-48 w-full">
          <Image
            src={barbershop.images[0]}
            alt={barbershop.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <h2 className="text-xl font-bold text-foreground">{barbershop.name}</h2>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-5 w-5 text-[#C9A84C]" />
              <span>{barbershop.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-[#C9A84C]" />
              <span>{barbershop.address}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 text-[#C9A84C]" />
              <span>{barbershop.hours}</span>
            </div>
            {barbershop.price_level && (
              <div className="flex items-center gap-3 text-sm">
                <span className="flex h-5 w-5 items-center justify-center text-lg font-bold text-[#C9A84C]">$</span>
                <div className="flex items-center gap-0.5">
                  <span className="font-medium text-[#22c55e]">
                    {"$".repeat(barbershop.price_level)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex w-full max-w-sm flex-col gap-3"
      >
        <Button
          className="h-14 w-full rounded-xl bg-[#C9A84C] text-lg font-semibold text-background hover:bg-[#a88a3a]"
        >
          Book Appointment
        </Button>
        <button
          onClick={onKeepSwiping}
          className="py-3 text-center text-muted-foreground transition-colors hover:text-foreground"
        >
          Keep Swiping
        </button>
      </motion.div>
    </motion.div>
  )
}
