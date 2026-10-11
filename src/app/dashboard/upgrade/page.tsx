"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Check, CreditCard, LoaderCircle, Sparkles } from "lucide-react"
import { fetchWithAuth, requestWithAuth } from "@/lib/fetcher"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Plan = {
    name: string
    amount: string
    currency: string
    interval: string
}

type Subscription = {
    plan: "free" | "pro"
    is_pro: boolean
    status: string
    cancel_at_period_end: boolean
    next_payment_date: string | null
}

function formatPrice(plan: Plan) {
    const amount = Number(plan.amount)
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: plan.currency,
        maximumFractionDigits: 0,
    }).format(amount)
}

export default function UpgradePage() {
    const { data: plan, error: planError } = useSWR<Plan>(
        `${API_URL}billing/plans/`,
        fetchWithAuth,
    )
    const { data: subscription, error: subscriptionError, mutate: refreshSubscription } =
        useSWR<Subscription>(`${API_URL}billing/subscription/`, fetchWithAuth)
    const [isStartingCheckout, setIsStartingCheckout] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const reference = new URLSearchParams(window.location.search).get("reference")
        if (!reference) return

        let cancelled = false
        const confirmSubscription = async () => {
            setMessage("Confirming your Paystack payment…")
            setError("")
            try {
                const verification = await requestWithAuth<{ message?: string; is_pro?: boolean }>(
                    `${API_URL}billing/checkout/verify/?reference=${encodeURIComponent(reference)}`,
                )
                if (cancelled) return
                await refreshSubscription()
                if (verification.is_pro) {
                    setMessage("Your Spendstack Pro subscription is active.")
                    return
                }
                setMessage(verification.message ?? "Payment received. Waiting for Paystack to confirm your subscription…")
                for (let attempt = 0; attempt < 8; attempt += 1) {
                    await new Promise(resolve => window.setTimeout(resolve, 2500))
                    if (cancelled) return
                    const updated = await refreshSubscription()
                    if (updated?.is_pro) {
                        setMessage("Your Spendstack Pro subscription is active.")
                        return
                    }
                }
                setMessage("Payment is verified. Subscription activation is still processing; refresh this page shortly.")
            } catch (verificationError) {
                if (!cancelled) {
                    setError(verificationError instanceof Error ? verificationError.message : "Could not verify your payment.")
                    setMessage("")
                }
            }
        }
        void confirmSubscription()
        return () => {
            cancelled = true
        }
    }, [refreshSubscription])

    async function startCheckout() {
        setIsStartingCheckout(true)
        setError("")
        try {
            const checkout = await requestWithAuth<{ authorization_url: string }>(
                `${API_URL}billing/checkout/`,
                { method: "POST", body: JSON.stringify({}) },
            )
            window.location.assign(checkout.authorization_url)
        } catch (checkoutError) {
            setError(checkoutError instanceof Error ? checkoutError.message : "Could not start checkout.")
            setIsStartingCheckout(false)
        }
    }

    async function cancelSubscription() {
        if (!window.confirm("Cancel your Pro renewal? You will keep Pro access until the current paid period ends.")) return
        setIsCancelling(true)
        setError("")
        try {
            await requestWithAuth(`${API_URL}billing/subscription/cancel/`, {
                method: "POST",
                body: JSON.stringify({}),
            })
            await refreshSubscription()
            setMessage("Renewal cancelled. Your current paid access remains available until the period ends.")
        } catch (cancelError) {
            setError(cancelError instanceof Error ? cancelError.message : "Could not cancel your subscription.")
        } finally {
            setIsCancelling(false)
        }
    }

    const features = [
        "AI-powered financial advisor",
        "Advanced period comparisons and report exports",
        "Recurring-bill detection",
        "Automated spending alerts and transaction rules",
    ]

    return (
        <main className="mx-auto w-full max-w-5xl space-y-8">
            <header className="max-w-2xl">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Sparkles className="h-4 w-4" /> Spendstack Pro
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">More insight. Less money admin.</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Keep core transaction tracking free. Upgrade when you want smarter analysis and automated financial tools.
                </p>
            </header>

            {message && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
            {planError && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Pro billing is temporarily unavailable. Please try again later.</p>}
            {subscriptionError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">Could not load your subscription status.</p>}

            {subscription?.is_pro ? (
                <section className="rounded-3xl border border-primary/20 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Current plan</p>
                            <h2 className="mt-2 text-2xl font-semibold text-foreground">Spendstack Pro</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {subscription.cancel_at_period_end
                                    ? `Renewal cancelled${subscription.next_payment_date ? ` · access through ${new Date(subscription.next_payment_date).toLocaleDateString()}` : ""}`
                                    : `Your subscription is ${subscription.status}.`}
                            </p>
                        </div>
                        {!subscription.cancel_at_period_end && (
                            <button
                                type="button"
                                onClick={() => void cancelSubscription()}
                                disabled={isCancelling}
                                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-60"
                            >
                                {isCancelling ? "Cancelling…" : "Cancel renewal"}
                            </button>
                        )}
                    </div>
                </section>
            ) : (
                <section className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="p-6 sm:p-9">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Monthly plan</p>
                        <h2 className="mt-3 text-2xl font-semibold text-foreground">{plan?.name ?? "Spendstack Pro"}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">More confident money decisions, powered by your own financial history.</p>
                        <ul className="mt-7 space-y-4">
                            {features.map(feature => (
                                <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col justify-center bg-slate-50 p-6 sm:p-9">
                        <p className="text-sm font-medium text-muted-foreground">Simple monthly subscription</p>
                        <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
                            {plan ? formatPrice(plan) : "—"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">billed monthly through Paystack</p>
                        <button
                            type="button"
                            onClick={() => void startCheckout()}
                            disabled={!plan || isStartingCheckout || subscription?.is_pro}
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isStartingCheckout ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                            {isStartingCheckout ? "Opening secure checkout…" : "Upgrade with Paystack"}
                        </button>
                        <p className="mt-3 text-xs leading-5 text-muted-foreground">
                            Your subscription is activated only after Paystack confirms payment. Manage or cancel renewal here.
                        </p>
                    </div>
                </section>
            )}

            <section className="rounded-2xl border border-border bg-white p-5 text-sm text-muted-foreground">
                Already on the free plan? Your transactions, statements, and core dashboard remain available.{" "}
                <Link href="/dashboard" className="font-medium text-primary hover:underline">Return to your dashboard</Link>.
            </section>
        </main>
    )
}
