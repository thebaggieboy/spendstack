"use client"

import Link from "next/link"
import {
    ArrowRight,
    ArrowRightLeft,
    BellRing,
    BrainCircuit,
    CalendarClock,
    ChartNoAxesCombined,
    FileText,
    LockKeyhole,
    MessageCircle,
    Receipt,
    Tags,
    Wallet,
    type LucideIcon,
} from "lucide-react"

const tools: {
    title: string
    description: string
    href: string
    icon: LucideIcon
    accent: string
    label: string
}[] = [
    {
        title: "Lock money",
        description: "Set funds aside for a chosen period and schedule a verified bank payout for maturity.",
        href: "/dashboard/lock-money",
        icon: LockKeyhole,
        accent: "bg-violet-50 text-violet-700",
        label: "Savings",
    },
    {
        title: "Scheduled payouts",
        description: "Review payout dates, destinations, and Paystack transfer status.",
        href: "/dashboard/payouts",
        icon: CalendarClock,
        accent: "bg-blue-50 text-blue-700",
        label: "Payouts",
    },
    {
        title: "Set budgets",
        description: "Create spending limits and keep an eye on how much is left.",
        href: "/dashboard/budgets",
        icon: Wallet,
        accent: "bg-emerald-50 text-emerald-700",
        label: "Planning",
    },
    {
        title: "Recurring bills",
        description: "Spot repeating payments and see when the next one is expected.",
        href: "/dashboard/money-tools#recurring-bills",
        icon: CalendarClock,
        accent: "bg-amber-50 text-amber-700",
        label: "Automation",
    },
    {
        title: "Spending alerts",
        description: "Set weekly or monthly thresholds and get in-app warnings.",
        href: "/dashboard/money-tools#spending-alerts",
        icon: BellRing,
        accent: "bg-rose-50 text-rose-700",
        label: "Alerts",
    },
    {
        title: "Merchant & category rules",
        description: "Automatically rename, categorize, or identify transactions from their description.",
        href: "/dashboard/money-tools#transaction-rules",
        icon: Tags,
        accent: "bg-cyan-50 text-cyan-700",
        label: "Automation",
    },
    {
        title: "Chat with statements",
        description: "Ask questions about your transactions and get answers with source links.",
        href: "/dashboard/chat",
        icon: MessageCircle,
        accent: "bg-indigo-50 text-indigo-700",
        label: "AI",
    },
    {
        title: "Analytics",
        description: "Compare spending and income across equivalent periods.",
        href: "/dashboard/analytics",
        icon: ChartNoAxesCombined,
        accent: "bg-sky-50 text-sky-700",
        label: "Insights",
    },
    {
        title: "Tax calculator",
        description: "Explore an estimate from your income and eligible deductions.",
        href: "/dashboard/tax",
        icon: Receipt,
        accent: "bg-orange-50 text-orange-700",
        label: "Planning",
    },
    {
        title: "Statements",
        description: "Browse imported statements and inspect source transactions.",
        href: "/dashboard/statements",
        icon: FileText,
        accent: "bg-slate-100 text-slate-700",
        label: "Records",
    },
    {
        title: "Transactions",
        description: "Search and review categorized transaction activity.",
        href: "/dashboard/transactions",
        icon: ArrowRightLeft,
        accent: "bg-purple-50 text-purple-700",
        label: "Records",
    },
    {
        title: "AI advisor",
        description: "Review personalized insights from your recorded financial activity.",
        href: "/dashboard/advisor",
        icon: BrainCircuit,
        accent: "bg-yellow-50 text-yellow-800",
        label: "AI",
    },
]

export default function ToolsPage() {
    return (
        <main className="mx-auto w-full max-w-7xl space-y-7">
            <header className="max-w-2xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Spendstack toolkit</p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">Tools for your money</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Choose a tool to plan, understand, and organize your finances.
                </p>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Available tools">
                {tools.map(({ title, description, href, icon: Icon, accent, label }) => (
                    <Link
                        key={title}
                        href={href}
                        className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                                {label}
                            </span>
                        </div>
                        <h2 className="mt-5 flex items-center justify-between font-semibold text-foreground">
                            {title}
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                    </Link>
                ))}
            </section>
        </main>
    )
}
