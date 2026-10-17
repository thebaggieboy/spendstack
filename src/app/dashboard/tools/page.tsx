"use client"

import Link from "next/link"
import {
    ArrowRight,
    ArrowRightLeft,
    BellRing,
    BrainCircuit,
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
    secondaryHref?: string
    secondaryLabel?: string
    example?: string
    note?: string
    icon: LucideIcon
    accent: string
    label: string
}[] = [
    {
        title: "Lock money & schedule payouts",
        description: "Plan to set money aside and receive it in scheduled installments to a verified bank account.",
        href: "/dashboard/lock-money",
        secondaryHref: "/dashboard/payouts",
        secondaryLabel: "View scheduled payouts",
        example: "Example plan: lock ₦100,000 and receive ₦10,000 each week for 10 weeks.",
        note: "Installment plans are not available yet. Current locks schedule one full payout at maturity.",
        icon: LockKeyhole,
        accent: "bg-violet-50 text-violet-700",
        label: "Savings & payouts",
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
        title: "Track subscriptions",
        description: "Monitor your subscription services and manage renewals.",
        href: "/dashboard/subscriptions",
        icon: Tags,
        accent: "bg-cyan-50 text-cyan-700",
        label: "Monitoring",
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
                {tools.map(({ title, description, href, secondaryHref, secondaryLabel, example, note, icon: Icon, accent, label }) => (
                    <article
                        key={title}
                        className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                    >
                        <Link
                            href={href}
                            className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                            {example && (
                                <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-xs font-medium text-violet-800">
                                    {example}
                                </p>
                            )}
                            {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
                        </Link>
                        {secondaryHref && secondaryLabel && (
                            <Link
                                href={secondaryHref}
                                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                {secondaryLabel}
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        )}
                    </article>
                ))}
            </section>
        </main>
    )
}
