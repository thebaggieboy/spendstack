"use client"

import Link from "next/link"
import useSWR from "swr"
import { LockKeyhole, Sparkles } from "lucide-react"
import { fetchWithAuth } from "@/lib/fetcher"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Subscription = {
    is_pro: boolean
}

export default function ProFeatureGate({
    children,
    feature,
}: {
    children: React.ReactNode
    feature: string
}) {
    const { data, error, isLoading } = useSWR<Subscription>(
        `${API_URL}billing/subscription/`,
        fetchWithAuth,
    )

    if (isLoading) {
        return <div className="rounded-2xl border border-border bg-white p-8 text-sm text-muted-foreground">Checking your plan…</div>
    }
    if (error || !data) {
        return <div role="alert" className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700">We couldn’t verify your subscription. Please refresh and try again.</div>
    }
    if (!data.is_pro) {
        return (
            <section className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-border bg-white px-6 py-12 text-center shadow-sm">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <LockKeyhole className="h-7 w-7" />
                </span>
                <p className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Sparkles className="h-4 w-4" />
                    Spendstack Pro
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-foreground">{feature} is a Pro feature</h1>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                    Upgrade to unlock richer insights and financial automation. Your existing statements and transactions stay available on the free plan.
                </p>
                <Link
                    href="/dashboard/upgrade"
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                    Explore Spendstack Pro
                </Link>
            </section>
        )
    }
    return children
}
