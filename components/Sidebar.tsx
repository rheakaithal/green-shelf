"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Settings, Leaf } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Impact", path: "/impact", icon: Leaf },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 shrink-0">

      {/* App Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-green-700">
          GreenShelf
        </h1>
        <p className="text-sm text-muted-foreground">
          Inventory assistant
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.path

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition
                ${
                  active
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}