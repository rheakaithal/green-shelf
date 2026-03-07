import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from 'next/link'

export default function Home() {
  const lowStock = 8
  const expiringSoon = 4

  return (
    <div className="min-h-screen bg-[#f6f8f7] flex flex-col items-center px-6 pt-16">

      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your inventory
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 flex flex-col items-center">
            <p className="text-5xl font-bold">{lowStock}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
              Low Stock
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 flex flex-col items-center">
            <p className="text-5xl font-bold">{expiringSoon}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
              Expiring Soon
            </p>
          </CardContent>
        </Card>

      </div>

      <Button
  variant="outline"
  className="
    group
    w-full h-16 rounded-2xl text-base flex justify-between
    border-2 border-gray-300
    hover:border-green-500
    hover:bg-green-50
    hover:shadow-md
    transition-all
  "
>
  Check on your inventory
  <ArrowRight className="transition-transform group-hover:translate-x-1"/>
</Button>
      </div>
  )
}