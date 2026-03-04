"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    PieChart,
    Wallet,
    ArrowRightLeft,
    Settings,
    BrainCircuit,
    Upload
} from "lucide-react"

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: "text-primary",
    },
    {
        label: 'Upload Statement',
        icon: Upload,
        href: '/upload',
        color: "text-emerald-500",
    },
    {
        label: 'Transactions',
        icon: ArrowRightLeft,
        href: '/dashboard/transactions',
        color: "text-blue-500",
    },
    {
        label: 'Analytics',
        icon: PieChart,
        href: '/dashboard/analytics',
        color: "text-purple-500",
    },
    {
        label: 'Budgets',
        icon: Wallet,
        href: '/dashboard/budgets',
        color: "text-pink-500",
    },
    {
        label: 'AI Advisor',
        icon: BrainCircuit,
        href: '/dashboard/advisor',
        color: "text-amber-500",
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
        color: "text-gray-500",
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    // Hide sidebar on landing page
    if (pathname === '/') return null;

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-card/30 backdrop-blur-2xl border-r border-white/5 w-64 hidden md:flex z-50 rounded-tr-3xl">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <div className="relative h-8 w-8 mr-4 bg-gradient-to-tr from-primary to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gradient">
                        Spendstack
                    </h1>
                </Link>
                <div className="space-y-1 mt-4">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200",
                                pathname === route.href ? "bg-white/10 text-white" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
