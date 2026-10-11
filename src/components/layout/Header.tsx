"use client"

import { Bell, Search, Menu, CreditCard, Settings2 } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSidebar } from "@/contexts/SidebarContext"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
    const pathname = usePathname()
    const { toggle } = useSidebar()
    const { user } = useAuth()

    // Hide header on public pages (they have LandingNav instead)
    if (pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/tax-engine" || pathname === "/ai-advisor") return null

    const initials = user
        ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "U"
        : "U"

    const displayName = user ? `${user.first_name} ${user.last_name}`.trim() || user.email : "Account"

    return (
        <header className="dashboard-chrome h-16 flex items-center justify-between px-4 sm:px-6 bg-background/90 backdrop-blur-xl border-b border-border sticky top-0 z-40">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger — wires to SidebarContext */}
                <button
                    onClick={toggle}
                    className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
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
                        className="h-9 w-64 lg:w-80 rounded-full bg-muted/60 border border-border pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                </button>

                <Link
                    href="/dashboard/settings"
                    aria-label="Settings"
                    title="Settings"
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <Settings2 className="h-5 w-5" />
                </Link>
                <Link
                    href="/dashboard/billing"
                    aria-label="Billing"
                    title="Billing"
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <CreditCard className="h-5 w-5" />
                </Link>

                {/* User avatar */}
                <Link href="/dashboard/profile" aria-label="Profile" title="Profile" className="flex items-center gap-2 rounded-full border border-border bg-white p-1 pr-3 transition hover:bg-muted">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {initials}
                    </div>
                    <span className="text-sm font-medium hidden sm:block text-foreground">{displayName}</span>
                </Link>
            </div>
        </header>
    )
}
