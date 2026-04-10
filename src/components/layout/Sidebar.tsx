"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/contexts/SidebarContext"
import {
    LayoutDashboard,
    PieChart,
    Wallet,
    ArrowRightLeft,
    Settings,
    BrainCircuit,
    Upload,
    FileText,
    Receipt,
    BarChart3,
    X,
} from "lucide-react"

const routes = [
    { label: "Dashboard",        icon: LayoutDashboard, href: "/dashboard",              color: "text-primary" },
    { label: "Upload Statement", icon: Upload,           href: "/upload",                color: "text-emerald-500" },
    { label: "Statements",       icon: FileText,         href: "/dashboard/statements",  color: "text-indigo-400" },
    { label: "Transactions",     icon: ArrowRightLeft,   href: "/dashboard/transactions",color: "text-blue-500" },
    { label: "Analytics",        icon: PieChart,         href: "/dashboard/analytics",   color: "text-purple-500" },
    { label: "Tax Calculator",   icon: Receipt,          href: "/dashboard/tax",         color: "text-green-400" },
   // { label: "Budgets",          icon: Wallet,           href: "/dashboard/budgets",     color: "text-pink-500" },
    { label: "AI Advisor",       icon: BrainCircuit,     href: "/dashboard/advisor",     color: "text-amber-500" },
    { label: "Settings",         icon: Settings,         href: "/dashboard/settings",    color: "text-gray-500" },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname()
    return (
        <div className="space-y-0.5">
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    onClick={onNavigate}
                    className={cn(
                        "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition-all duration-150",
                        pathname === route.href ? "bg-white/10 text-white" : "text-zinc-400"
                    )}
                >
                    <div className="flex items-center flex-1 gap-3">
                        <route.icon className={cn("h-4 w-4 shrink-0", route.color)} />
                        {route.label}
                    </div>
                </Link>
            ))}
        </div>
    )
}

const Logo = () => (
    <Link href="/" className="flex items-center gap-3 px-3 mb-10">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-bold text-foreground tracking-tight">Spendstack</span>
    </Link>
)

export default function Sidebar() {
    const pathname = usePathname()
    const { isOpen, close } = useSidebar()

    // Hide entirely on public pages
    if (pathname === "/" || pathname === "/login" || pathname === "/signup") return null

    return (
        <>
            {/* ── Desktop Sidebar (always visible ≥ md) ──────────────── */}
            <aside className="hidden md:flex flex-col h-full w-64 shrink-0 bg-card/30 backdrop-blur-2xl border-r border-white/5 py-6 px-3 z-50 rounded-tr-3xl">
                <Logo />
                <nav className="flex-1 overflow-y-auto">
                    <NavLinks />
                </nav>
            </aside>

            {/* ── Mobile Backdrop ─────────────────────────────────────── */}
            <div
                onClick={close}
                className={cn(
                    "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            />

            {/* ── Mobile Drawer (slides in from left) ─────────────────── */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-[70] w-[260px] bg-card border-r border-border shadow-2xl flex flex-col py-6 px-3 md:hidden transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Close button */}
                <button
                    onClick={close}
                    className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
                    aria-label="Close sidebar"
                >
                    <X className="h-5 w-5" />
                </button>

                <Logo />
                <nav className="flex-1 overflow-y-auto">
                    <NavLinks onNavigate={close} />
                </nav>
            </aside>
        </>
    )
}
