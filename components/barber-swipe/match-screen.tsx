"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Phone, MapPin, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Barbershop } from "./barber-swipe-app"

interface MatchScreenProps {
  barbershop: Barbershop
  onKeepSwiping: () => void
}

export function MatchScreen({ barbershop, onKeepSwiping }: MatchScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95 px-6 backdrop-blur-xl"
    >
      {/* Celebratory header */}
      <motion.div
        initial={{ y: -40, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <span className="text-sm font-black uppercase tracking-[0.3em] text-primary/60">Success</span>
        <h1 className="mt-2 text-5xl font-black italic tracking-tighter text-primary">MARCH!</h1>
        <div className="mt-4 flex justify-center gap-2">
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-2xl"
          >
            💈
          </motion.span>
        </div>
      </motion.div>

      {/* Barbershop card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", bounce: 0.3 }}
        className="mt-10 w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-card border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
      >
        <div className="relative h-56 w-full">
          <Image
            src={barbershop.images[0]}
            alt={barbershop.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>
        <div className="px-6 pb-8 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground leading-tight">{barbershop.name}</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full border border-primary/20">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-bold text-primary">{barbershop.rating}</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 text-muted-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 transition-colors hover:bg-muted">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">{barbershop.phone}</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium leading-relaxed line-clamp-2">{barbershop.address}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex w-full max-w-sm flex-col gap-4"
      >
        <Button
          className="h-16 w-full rounded-2xl bg-primary text-lg font-black uppercase tracking-widest text-background shadow-[0_8px_24px_rgba(212,175,55,0.3)] hover:bg-primary/90 hover:scale-[1.02] transition-all active:scale-[0.98]"
        >
          Book Appointment
        </Button>
        <button
          onClick={onKeepSwiping}
          className="py-2 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground/60 transition-all hover:text-foreground active:scale-95"
        >
          Keep Swiping
        </button>
      </motion.div>
    </motion.div>
  )
}
