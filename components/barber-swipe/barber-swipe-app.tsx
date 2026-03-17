"use client"

import { useState, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { SwipeCard } from "./swipe-card"
import { ActionButtons } from "./action-buttons"
import { MatchScreen } from "./match-screen"
import { NavigationBar } from "./navigation-bar"
import { FavoritesScreen } from "./favorites-screen"
import { ProfileScreen } from "./profile-screen"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Barbershop {
  id: string
  name: string
  rating: number
  distance: string
  images: string[]
  phone: string
  address: string
  hours: string
  city?: string
  price_level?: number
  user_ratings_total?: number
}

function CitySelect({ 
  value, 
  onChange, 
  cities 
}: { 
  value: string
  onChange: (value: string) => void
  cities: string[]
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px] h-10 bg-card border-border shadow-sm">
        <SelectValue placeholder="Select City" />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem key={city} value={city}>
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface BarberSwipeAppProps {
  initialBarbershops: Barbershop[]
  initialFavoriteIds: string[]
  userId: string
  userEmail: string
  userName: string
}

type Tab = "home" | "favorites" | "profile"

export function BarberSwipeApp({ 
  initialBarbershops, 
  initialFavoriteIds,
  userId,
  userEmail,
  userName
}: BarberSwipeAppProps) {
  const [barbershops] = useState<Barbershop[]>(initialBarbershops)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(initialFavoriteIds)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedShop, setMatchedShop] = useState<Barbershop | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [selectedCity, setSelectedCity] = useState("Rijeka")
  const supabase = createClient()
  const router = useRouter()

  const dbCities = Array.from(new Set(barbershops.map(b => b.city).filter(Boolean) as string[]))
  const uniqueCities = Array.from(new Set(["All", "Rijeka", "Zagreb", "Split", ...dbCities]))
  const filteredBarbershops = barbershops.filter(shop => selectedCity === "All" || shop.city === selectedCity)
  const favorites = barbershops.filter(shop => favoriteIds.includes(shop.id))

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (filteredBarbershops.length === 0) return
      const currentShop = filteredBarbershops[currentIndex % filteredBarbershops.length]
      
      if (direction === "right") {
        // Add to favorites in Supabase
        if (!favoriteIds.includes(currentShop.id)) {
          const { error } = await supabase
            .from("favorites")
            .insert({ user_id: userId, barbershop_id: currentShop.id })
          
          if (!error) {
            setFavoriteIds(prev => [...prev, currentShop.id])
          }
        }
        setMatchedShop(currentShop)
        setShowMatch(true)
      }

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredBarbershops.length)
      }, 100)
    },
    [currentIndex, filteredBarbershops, favoriteIds, userId, supabase]
  )

  const handleRemoveFavorite = async (shopId: string) => {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("barbershop_id", shopId)
    
    if (!error) {
      setFavoriteIds(prev => prev.filter(id => id !== shopId))
    }
  }

  const handleKeepSwiping = () => {
    setShowMatch(false)
    setMatchedShop(null)
  }

  const handleSwipeLeft = () => {
    handleSwipe("left")
  }

  const handleSwipeRight = () => {
    handleSwipe("right")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const currentShop = filteredBarbershops.length > 0 ? filteredBarbershops[currentIndex % filteredBarbershops.length] : null
  const nextShop = filteredBarbershops.length > 0 ? filteredBarbershops[(currentIndex + 1) % filteredBarbershops.length] : null

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-[375px] flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-center border-b border-border bg-card py-4">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-foreground">Barber</span>
          <span className="text-[#C9A84C]">Swipe</span>
        </h1>
      </header>

      {/* Main content */}
      {activeTab === "home" && (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-center px-4 pt-4">
            <CitySelect value={selectedCity} onChange={setSelectedCity} cities={uniqueCities} />
          </div>

          {filteredBarbershops.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <span className="mb-4 text-6xl">💈</span>
              <p className="text-lg font-medium text-foreground">No barbershops found in {selectedCity}</p>
              <p className="mt-2 text-sm text-muted-foreground">Try selecting a different city to see available barbershops.</p>
            </div>
          ) : (
            <>
              {/* Card stack */}
              <div className="relative flex-1 overflow-hidden p-4">
                <div className="relative h-full w-full">
                  {/* Next card (behind) */}
                  {nextShop && (
                    <div className="absolute inset-0 scale-[0.95] opacity-50">
                      <div className="h-full w-full overflow-hidden rounded-2xl bg-card shadow-xl">
                        <div className="relative h-[75%] w-full">
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${nextShop.images[0]})` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Current card */}
                  <AnimatePresence mode="wait">
                    {currentShop && (
                      <SwipeCard
                        key={currentShop.id}
                        barbershop={currentShop}
                        onSwipe={handleSwipe}
                        isTop={true}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pb-4 pt-2">
                <ActionButtons
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <FavoritesScreen 
          favorites={favorites} 
          onRemoveFavorite={handleRemoveFavorite}
        />
      )}
      {activeTab === "profile" && (
        <ProfileScreen 
          userName={userName}
          userEmail={userEmail}
          favoritesCount={favorites.length}
          onLogout={handleLogout}
        />
      )}

      {/* Navigation */}
      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Match overlay */}
      <AnimatePresence>
        {showMatch && matchedShop && (
          <MatchScreen barbershop={matchedShop} onKeepSwiping={handleKeepSwiping} />
        )}
      </AnimatePresence>
    </div>
  )
}
