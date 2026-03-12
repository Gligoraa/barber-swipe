"use client"

import Image from "next/image"
import { Star, MapPin, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { Barbershop } from "./barber-swipe-app"

interface FavoritesScreenProps {
  favorites: Barbershop[]
  onRemoveFavorite?: (shopId: string) => void
}

export function FavoritesScreen({ favorites, onRemoveFavorite }: FavoritesScreenProps) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl">💈</div>
        <h2 className="mt-4 text-xl font-bold text-foreground">No favorites yet</h2>
        <p className="mt-2 text-muted-foreground">
          Start swiping to find your perfect barbershop!
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <h1 className="mb-4 text-xl font-bold text-foreground">Your Favorites</h1>
      <div className="space-y-4">
        {favorites.map((shop, index) => (
          <motion.div
            key={shop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 overflow-hidden rounded-xl bg-card p-3 shadow-lg"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={shop.images[0]}
                alt={shop.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="font-semibold text-foreground">{shop.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-[#C9A84C] text-[#C9A84C]" />
                <span className="text-foreground">{shop.rating}</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{shop.distance}</span>
              </div>
              {shop.price_level && (
                <div className="mt-1 flex items-center gap-0.5 text-xs">
                  <span className="font-medium text-[#22c55e]">
                    {"$".repeat(shop.price_level)}
                  </span>
                </div>
              )}
            </div>
            {onRemoveFavorite && (
              <button
                onClick={() => onRemoveFavorite(shop.id)}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
