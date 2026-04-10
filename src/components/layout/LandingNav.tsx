"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, BarChart3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "Tax Engine", href: "#tax" },
    { label: "AI Advisor", href: "#ai" },
    { label: "Pricing", href: "#pricing" },
]

export default function LandingNav() {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 12)
        window.addEventListener("scroll", handler, { passive: true })
        return () => window.removeEventListener("scroll", handler)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    return (
        <>
            {/* ── Top Bar ──────────────────────────────────────────────── */}
            <header
                className={cn(
                    "fixed top-0 inset-x-0 z-50 transition-all duration-300",
                    scrolled
                        ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
                        : "bg-transparent"
                )}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-base font-bold text-foreground tracking-tight">Spendstack</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-white/5 transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-sm h-9 px-4">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" className="text-sm h-9 px-4 font-semibold">
                                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                Create Account
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
                        onClick={() => setOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* ── Mobile Drawer Overlay ────────────────────────────────── */}
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300",
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setOpen(false)}
            />

            {/* Slide-in panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 z-[70] h-full w-[280px] bg-card border-l border-border shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                            <BarChart3 className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-bold text-foreground">Spendstack</span>
                    </Link>
                    <button
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Drawer links */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {NAV_LINKS.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                {/* Drawer CTAs */}
                <div className="px-4 pb-8 space-y-3 border-t border-border pt-5">
                    <Link href="/login" className="block w-full" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full h-10 text-sm">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/signup" className="block w-full" onClick={() => setOpen(false)}>
                        <Button className="w-full h-10 text-sm font-semibold">
                            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                            Create Account
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
}
