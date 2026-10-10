"use client"

import { useState } from "react"
import useSWR from "swr"
import {
    ArrowLeftRight,
    BellRing,
    CalendarClock,
    Plus,
    Tags,
    Trash2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { formatNaira } from "@/lib/utils"
import { fetchWithAuth, requestWithAuth } from "@/lib/fetcher"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const recurringUrl = `${API_URL}dashboard/recurring-bills/`
const alertsUrl = `${API_URL}transactions/alerts/`
const rulesUrl = `${API_URL}transactions/rules/`

interface RecurringBill {
    merchant: string
    category: string
    average_amount: number
    last_payment_date: string
    next_expected_date: string
    cadence: "weekly" | "biweekly" | "monthly"
    occurrences: number
}

interface SpendingAlert {
    id: number
    name: string
    category_name: string
    threshold: string
    period: "weekly" | "monthly"
    current_spend: string
    is_exceeded: boolean
}

interface TransactionRule {
    id: number
    match_text: string
    match_field: "description" | "merchant" | "either"
    merchant_name: string
    category_name: string
    transfer_action: "automatic" | "transfer" | "not_transfer"
}

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Something went wrong. Please try again."
}

function displayDate(value: string) {
    return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export default function MoneyToolsPage() {
    const { data: bills, error: billsError, isLoading: billsLoading, mutate: refreshBills } =
        useSWR<RecurringBill[]>(recurringUrl, fetchWithAuth)
    const { data: alerts, error: alertsError, isLoading: alertsLoading, mutate: refreshAlerts } =
        useSWR<SpendingAlert[]>(alertsUrl, fetchWithAuth)
    const { data: rules, error: rulesError, isLoading: rulesLoading, mutate: refreshRules } =
        useSWR<TransactionRule[]>(rulesUrl, fetchWithAuth)

    const [category, setCategory] = useState("")
    const [threshold, setThreshold] = useState("")
    const [period, setPeriod] = useState<"weekly" | "monthly">("monthly")
    const [matchText, setMatchText] = useState("")
    const [matchField, setMatchField] = useState<TransactionRule["match_field"]>("either")
    const [merchantName, setMerchantName] = useState("")
    const [categoryName, setCategoryName] = useState("")
    const [transferAction, setTransferAction] = useState<TransactionRule["transfer_action"]>("automatic")
    const [actionError, setActionError] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    async function createAlert(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setActionError("")
        setIsSaving(true)
        try {
            await requestWithAuth(alertsUrl, {
                method: "POST",
                body: JSON.stringify({
                    category_name: category.trim(),
                    threshold,
                    period,
                }),
            })
            setCategory("")
            setThreshold("")
            await refreshAlerts()
        } catch (error) {
            setActionError(errorMessage(error))
        } finally {
            setIsSaving(false)
        }
    }

    async function createRule(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setActionError("")
        setIsSaving(true)
        try {
            await requestWithAuth(rulesUrl, {
                method: "POST",
                body: JSON.stringify({
                    match_text: matchText.trim(),
                    match_field: matchField,
                    merchant_name: merchantName.trim(),
                    category_name: categoryName.trim(),
                    transfer_action: transferAction,
                }),
            })
            setMatchText("")
            setMerchantName("")
            setCategoryName("")
            setTransferAction("automatic")
            await Promise.all([refreshRules(), refreshBills(), refreshAlerts()])
        } catch (error) {
            setActionError(errorMessage(error))
        } finally {
            setIsSaving(false)
        }
    }

    async function removeAlert(id: number) {
        setActionError("")
        try {
            await requestWithAuth(`${alertsUrl}${id}/`, { method: "DELETE" })
            await refreshAlerts()
        } catch (error) {
            setActionError(errorMessage(error))
        }
    }

    async function removeRule(id: number) {
        setActionError("")
        try {
            await requestWithAuth(`${rulesUrl}${id}/`, { method: "DELETE" })
            await Promise.all([refreshRules(), refreshBills(), refreshAlerts()])
        } catch (error) {
            setActionError(errorMessage(error))
        }
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 py-6">
            <header>
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <BellRing className="h-4 w-4" />
                    Personal finance controls
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Money tools</h1>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                    Find repeat bills, set spending limits, and teach Spendstack how to organize transactions from their descriptions.
                </p>
            </header>

            {actionError && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {actionError}
                </div>
            )}

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl border border-primary/10 bg-primary/5 p-2.5 text-primary">
                            <CalendarClock className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle>Recurring bills</CardTitle>
                            <CardDescription className="mt-1">
                                Repeated payments detected from at least three similar transactions.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {billsLoading ? (
                        <p className="text-sm text-muted-foreground">Checking transaction history…</p>
                    ) : billsError ? (
                        <p role="alert" className="text-sm text-red-700">Could not load recurring payments.</p>
                    ) : bills?.length ? (
                        <div className="divide-y divide-border">
                            {bills.map((bill) => (
                                <div key={`${bill.merchant}-${bill.cadence}`} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-medium text-foreground">{bill.merchant}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {bill.category} · {bill.cadence} · {bill.occurrences} payments
                                        </p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="font-semibold text-foreground">{formatNaira(bill.average_amount)} average</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Next expected {displayDate(bill.next_expected_date)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                            No recurring bills detected yet. Upload more statements to reveal regular payments.
                        </p>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-amber-700">
                                <BellRing className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Spending alerts</CardTitle>
                                <CardDescription className="mt-1">Get an in-app warning when actual spending reaches a limit.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <form onSubmit={createAlert} className="space-y-3">
                            <label className="block text-sm font-medium text-foreground">
                                Category <span className="font-normal text-muted-foreground">(leave blank for all spending)</span>
                                <Input value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2" placeholder="e.g. Food & Dining" />
                            </label>
                            <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                                <label className="block text-sm font-medium text-foreground">
                                    Limit (₦)
                                    <Input type="number" min="0.01" step="0.01" required value={threshold} onChange={(event) => setThreshold(event.target.value)} className="mt-2" placeholder="50000" />
                                </label>
                                <label className="block text-sm font-medium text-foreground">
                                    Reset period
                                    <select value={period} onChange={(event) => setPeriod(event.target.value as "weekly" | "monthly")} className="mt-2 h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground">
                                        <option value="monthly">Monthly</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </label>
                            </div>
                            <button type="submit" disabled={isSaving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">
                                <Plus className="h-4 w-4" /> Add alert
                            </button>
                        </form>

                        {alertsLoading ? (
                            <p className="text-sm text-muted-foreground">Loading alerts…</p>
                        ) : alertsError ? (
                            <p role="alert" className="text-sm text-red-700">Could not load spending alerts.</p>
                        ) : alerts?.length ? (
                            <div className="space-y-3">
                                {alerts.map((alert) => {
                                    const spent = Number(alert.current_spend)
                                    const limit = Number(alert.threshold)
                                    const percent = Math.min(100, limit ? spent / limit * 100 : 0)
                                    return (
                                        <div key={alert.id} className="rounded-xl border border-border p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{alert.category_name || "All spending"} · {alert.period}</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {formatNaira(spent)} of {formatNaira(limit)}
                                                        {alert.is_exceeded ? " · Limit reached" : ""}
                                                    </p>
                                                </div>
                                                <button type="button" onClick={() => removeAlert(alert.id)} aria-label={`Delete ${alert.category_name || "all spending"} alert`} className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                                                <div className={`h-full rounded-full ${alert.is_exceeded ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${percent}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No spending alerts set up yet.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-start gap-3">
                            <div className="rounded-xl border border-primary/10 bg-primary/5 p-2.5 text-primary">
                                <Tags className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>Transaction rules</CardTitle>
                                <CardDescription className="mt-1">Match narration or merchant names to rename, categorize, or identify transfers.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <form onSubmit={createRule} className="space-y-3">
                            <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
                                <label className="block text-sm font-medium text-foreground">
                                    Description contains
                                    <Input required value={matchText} onChange={(event) => setMatchText(event.target.value)} className="mt-2" placeholder="e.g. NETFLIX" />
                                </label>
                                <label className="block text-sm font-medium text-foreground">
                                    Match against
                                    <select value={matchField} onChange={(event) => setMatchField(event.target.value as TransactionRule["match_field"])} className="mt-2 h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground">
                                        <option value="either">Either</option>
                                        <option value="description">Description</option>
                                        <option value="merchant">Merchant</option>
                                    </select>
                                </label>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <label className="block text-sm font-medium text-foreground">
                                    Rename merchant <span className="font-normal text-muted-foreground">(optional)</span>
                                    <Input value={merchantName} onChange={(event) => setMerchantName(event.target.value)} className="mt-2" placeholder="Clean display name" />
                                </label>
                                <label className="block text-sm font-medium text-foreground">
                                    Set category <span className="font-normal text-muted-foreground">(optional)</span>
                                    <Input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} className="mt-2" placeholder="e.g. Subscriptions" />
                                </label>
                            </div>
                            <label className="block text-sm font-medium text-foreground">
                                Transfer handling
                                <select value={transferAction} onChange={(event) => setTransferAction(event.target.value as TransactionRule["transfer_action"])} className="mt-2 h-9 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground">
                                    <option value="automatic">Use description detection</option>
                                    <option value="transfer">Always treat as a transfer</option>
                                    <option value="not_transfer">Never treat as a transfer</option>
                                </select>
                            </label>
                            <button type="submit" disabled={isSaving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">
                                <Plus className="h-4 w-4" /> Add rule
                            </button>
                        </form>

                        {rulesLoading ? (
                            <p className="text-sm text-muted-foreground">Loading rules…</p>
                        ) : rulesError ? (
                            <p role="alert" className="text-sm text-red-700">Could not load transaction rules.</p>
                        ) : rules?.length ? (
                            <div className="space-y-3">
                                {rules.map((rule) => (
                                    <div key={rule.id} className="flex items-start justify-between gap-3 rounded-xl border border-border p-4">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-foreground">“{rule.match_text}”</p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {[rule.merchant_name && `Rename to ${rule.merchant_name}`, rule.category_name && `Category: ${rule.category_name}`, rule.transfer_action !== "automatic" && (rule.transfer_action === "transfer" ? "Always transfer" : "Not a transfer")].filter(Boolean).join(" · ")}
                                            </p>
                                        </div>
                                        <button type="button" onClick={() => removeRule(rule.id)} aria-label={`Delete rule for ${rule.match_text}`} className="shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No custom transaction rules yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <ArrowLeftRight className="mt-0.5 h-4 w-4 shrink-0" />
                Transfers detected from descriptions stay visible in history but are excluded from income, expense, cash-flow, and spending-alert totals.
            </p>
        </div>
    )
}
