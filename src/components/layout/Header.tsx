"use client"

import { Bell, Search, User, Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/contexts/SidebarContext"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
    const pathname = usePathname()
    const { toggle } = useSidebar()
    const { user } = useAuth()

    // Hide header on public pages (they have LandingNav instead)
    if (pathname === "/" || pathname === "/login" || pathname === "/signup") return null

    const initials = user
        ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "U"
        : "U"

    const displayName = user ? `${user.first_name} ${user.last_name}`.trim() || user.email : "Account"

    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-background/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger — wires to SidebarContext */}
                <button
                    onClick={toggle}
                    className="md:hidden p-2 rounded-md text-muted-foreground hover:text-white hover:bg-white/5 transition"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Search */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="h-9 w-64 lg:w-80 rounded-full bg-white/5 border border-white/10 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                </button>

                {/* User avatar */}
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {initials}
                    </div>
                    <span className="text-sm font-medium hidden sm:block text-foreground">{displayName}</span>
                </button>
            </div>
        </header>
    )
}
