import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BarberSwipeApp } from "@/components/barber-swipe/barber-swipe-app"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  const { data: barbershops } = await supabase
    .from("barbershops")
    .select("*")
    .order("rating", { ascending: false })
  
  const { data: favorites } = await supabase
    .from("favorites")
    .select("barbershop_id")
    .eq("user_id", user.id)
  
  const favoriteIds = favorites?.map(f => f.barbershop_id) || []

  // Ensure images are correctly formatted (handles accidental comma-separated strings from database edits)
  const formattedBarbershops = (barbershops || []).map(shop => {
    let fixedImages: string[] = []
    if (Array.isArray(shop.images)) {
      shop.images.forEach((img: string) => {
        if (typeof img === 'string' && img.includes(',')) {
          fixedImages.push(...img.split(',').map(s => s.trim()))
        } else {
          fixedImages.push(img)
        }
      })
    } else if (typeof shop.images === 'string') {
      fixedImages = (shop.images as string).split(',').map(s => s.trim())
    }
    
    // Filter out empty strings or malformed urls
    fixedImages = fixedImages.filter(img => img && img.length > 5 && (img.startsWith('http') || img.startsWith('/')))
    
    return { ...shop, images: fixedImages }
  })

  return (
    <main className="min-h-screen bg-background">
      <BarberSwipeApp 
        initialBarbershops={formattedBarbershops} 
        initialFavoriteIds={favoriteIds}
        userId={user.id}
        userEmail={user.email || ""}
        userName={user.user_metadata?.full_name || "User"}
      />
    </main>
  )
}
