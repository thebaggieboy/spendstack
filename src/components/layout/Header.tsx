"use client"

import { Bell, Search, User, Menu } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
    const pathname = usePathname();

    // Hide header on landing page
    if (pathname === '/') return null;

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-background/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
            <div className="flex items-center">
                <button className="mr-4 md:hidden text-muted-foreground hover:text-white transition">
                    <Menu className="h-6 w-6" />
                </button>
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="h-9 w-64 md:w-80 rounded-full bg-white/5 border border-white/10 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                </button>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">Demo User</span>
                </button>
            </div>
        </header>
    )
}
