import { Scissors, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-[375px] text-center">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A84C]">
            <Scissors className="h-10 w-10 text-background" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">BarberSwipe</h1>
        </div>

        {/* Error Message */}
        <div className="rounded-2xl bg-card p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Something went wrong</h2>
          <p className="mb-6 text-muted-foreground">
            There was an error with your authentication. Please try again.
          </p>
          <Link
            href="/auth/login"
            className="inline-block w-full rounded-xl bg-[#C9A84C] py-4 font-semibold text-background transition-colors hover:bg-[#a88a3a]"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
