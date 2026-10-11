"use client"

import { useState } from "react"
import useSWR from "swr"
import { AlertCircle, ArrowDownToLine, CalendarClock, CheckCircle2, Clock3, Loader2, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { fetchWithAuth, requestWithAuth } from "@/lib/fetcher"
import { formatNaira } from "@/lib/utils"

type Payout = {
    id: string
    lock_id: string
    title: string
    amount: string
    payout_amount: string
    scheduled_date: string
    status: "pending" | "processing" | "requires_action" | "completed" | "failed" | "cancelled"
    auto_payout: boolean
    bank_name: string
    account_name: string
    account_last4: string
    reference: string | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const payoutsUrl = `${API_URL}savings/schedules/`

function dateLabel(value: string) {
    return new Date(value).toLocaleString("en-NG", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    })
}

function statusStyle(status: Payout["status"]) {
    if (status === "completed") return "bg-emerald-50 text-emerald-800"
    if (status === "failed" || status === "requires_action") return "bg-red-50 text-red-800"
    if (status === "processing") return "bg-blue-50 text-blue-800"
    return "bg-amber-50 text-amber-800"
}

export default function ScheduledPayoutsPage() {
    const { data: payouts, error, isLoading, mutate } = useSWR<Payout[]>(payoutsUrl, fetchWithAuth, {
        refreshInterval: 15000,
    })
    const [workingId, setWorkingId] = useState("")
    const [actionError, setActionError] = useState("")
    const [notice, setNotice] = useState("")

    async function sendPayout(payout: Payout) {
        if (!window.confirm(`Send ${formatNaira(Number(payout.payout_amount))} to ${payout.bank_name} account ending ${payout.account_last4}? Paystack transfer initiation may not be reversible.`)) return
        setWorkingId(payout.id)
        setActionError("")
        setNotice("")
        try {
            const result = await requestWithAuth<{ message: string }>(`${payoutsUrl}${payout.id}/payout/`, {
                method: "POST",
                body: JSON.stringify({}),
            })
            setNotice(result.message)
            await mutate()
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Could not submit this payout.")
            await mutate()
        } finally {
            setWorkingId("")
        }
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <header>
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <CalendarClock className="h-4 w-4" /> Savings tools
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">Scheduled payouts</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    See when your locked funds mature, where they are going, and the latest Paystack transfer status.
                </p>
            </header>

            {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
            {actionError && <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-4 w-4" />{actionError}</div>}

            <Card>
                <CardHeader>
                    <CardTitle>Payout schedule</CardTitle>
                    <CardDescription>Final completion is confirmed through Paystack webhooks. A payout is not complete just because it was submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading scheduled payouts…</p> : error ? (
                        <p role="alert" className="py-8 text-center text-sm text-red-700">Could not load scheduled payouts.</p>
                    ) : payouts?.length ? (
                        <div className="space-y-3">
                            {payouts.map(payout => {
                                const due = new Date(payout.scheduled_date).getTime() <= Date.now()
                                const canSend = due && ["pending", "failed"].includes(payout.status)
                                return (
                                    <article key={payout.id} className="rounded-xl border border-border bg-white p-4 sm:p-5">
                                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="font-semibold text-foreground">{payout.title}</h2>
                                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusStyle(payout.status)}`}>
                                                        {payout.status.replace("_", " ")}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {payout.bank_name} · {payout.account_name} ·•••• {payout.account_last4}
                                                </p>
                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock3 className="h-3.5 w-3.5" />
                                                    {due ? "Matured" : "Scheduled"} {dateLabel(payout.scheduled_date)}
                                                    {payout.auto_payout && " · automatic"}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 sm:justify-end">
                                                <div className="sm:text-right">
                                                    <p className="text-lg font-semibold text-foreground">{formatNaira(Number(payout.payout_amount))}</p>
                                                    <p className="text-[10px] text-muted-foreground">full payout amount</p>
                                                </div>
                                                {canSend && (
                                                    <button
                                                        type="button"
                                                        disabled={workingId === payout.id}
                                                        onClick={() => void sendPayout(payout)}
                                                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-60"
                                                    >
                                                        {workingId === payout.id ? <Loader2 className="h-4 w-4 animate-spin" /> : payout.status === "failed" ? <RefreshCw className="h-4 w-4" /> : <ArrowDownToLine className="h-4 w-4" />}
                                                        {payout.status === "failed" ? "Retry payout" : "Pay out now"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {payout.status === "requires_action" && (
                                            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                                                Paystack requires additional account approval for this transfer. It was not marked paid; complete the required approval in your Paystack dashboard. Do not retry while this transfer is awaiting action.
                                            </p>
                                        )}
                                        {payout.status === "processing" && (
                                            <p className="mt-3 text-xs text-blue-800">Transfer submitted to Paystack. This schedule will update after a verified transfer event.</p>
                                        )}
                                    </article>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-3 font-medium text-foreground">No payouts scheduled</p>
                            <p className="mt-1 text-sm text-muted-foreground">Create a money lock to schedule a payout for its maturity date.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
