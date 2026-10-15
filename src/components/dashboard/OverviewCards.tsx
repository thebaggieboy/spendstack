"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { AlertTriangle, ArrowDownRight, ArrowUpRight, FileText, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { fetchWithAuth as fetcher } from "@/lib/fetcher"

type CurrencyBalance = {
    currency: string
    amount: string
    account_count: number
    accounts: string[]
}

type CashFlow = {
    currency: string
    income: string
    spending: string
    net: string
    previous_income: string
    previous_spending: string
    previous_net: string
    net_change_percent: string | null
}

type DashboardOverview = {
    period: {
        key: "month" | "90days" | "year"
        start: string
        end: string
        previous_start: string
        previous_end: string
    }
    cash_flow_by_currency: CashFlow[]
    current_balances: CurrencyBalance[]
    total_statements?: number | string
    total_statement_count?: number | string
    statement_count?: number | string
    attention_needed: {
        failed_imports: number
        stale_accounts: number
        uncategorized_transactions: number
    }
}

const PERIODS = [
    { value: "month", label: "This month" },
    { value: "90days", label: "Last 90 days" },
    { value: "year", label: "This year" },
] as const

function money(value: string | number, currency: string) {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency || "NGN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value))
}

function periodDateRange(start: string, end: string) {
    const format = (value: string) =>
        new Date(`${value}T00:00:00`).toLocaleDateString("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    return `${format(start)} – ${format(end)}`
}

export default function OverviewCards() {
    const [period, setPeriod] = useState<(typeof PERIODS)[number]["value"]>("month")
    const { data, error, isLoading } = useSWR<DashboardOverview>(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard/overview/?period=${period}`,
        fetcher,
    )

    if (isLoading) {
        return <div className="h-44 w-full animate-pulse bg-muted" />
    }
    if (error || !data) {
        return <div role="alert" className="text-red-700">Failed to load dashboard overview.</div>
    }

    const attentionTotal =
        data.attention_needed.failed_imports +
        data.attention_needed.stale_accounts +
        data.attention_needed.uncategorized_transactions
    const statementCount = Number(
        data.total_statements ?? data.total_statement_count ?? data.statement_count ?? 0,
    )

    return (
        <section aria-label="Actionable financial overview" className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Your overview</h2>
                    <p className="text-sm text-muted-foreground">
                        {periodDateRange(data.period.start, data.period.end)} · balances remain separate by currency
                    </p>
                </div>
                <label className="text-sm font-medium text-foreground">
                    Cash-flow period
                    <select
                        value={period}
                        onChange={event => setPeriod(event.target.value as typeof period)}
                        className="ml-2 h-10 rounded-md border border-border bg-wh  ite px-3"
                    >
                        {PERIODS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
               

                <Card>
                    <CardContent className="h-full p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xs font-medium text-muted-foreground">Total statements</h3>
                            <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-2xl font-semibold text-foreground">
                            {Number.isFinite(statementCount) ? statementCount.toLocaleString() : "0"} statement{statementCount === 1 ? "" : "s"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="h-full p-5">
                        <h3 className="mb-1 text-xs font-medium text-muted-foreground">Net cash flow</h3>
                        <p className="mb-4 text-xs text-muted-foreground">Income minus spending · previous comparable period</p>
                        {data.cash_flow_by_currency.length ? (
                            <ul className="space-y-3">
                                {data.cash_flow_by_currency.map(flow => {
                                    const difference = Number(flow.net) - Number(flow.previous_net)
                                    return (
                                        <li key={flow.currency}>
                                            <div className="flex items-baseline justify-between gap-2">
                                                <span className="text-xs text-muted-foreground">{flow.currency}</span>
                                                <span className="text-lg font-semibold text-foreground">{money(flow.net, flow.currency)}</span>
                                            </div>
                                            <p className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                                                {difference >= 0
                                                    ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-700" />
                                                    : <ArrowDownRight className="h-3.5 w-3.5 text-rose-700" />}
                                                {money(Math.abs(difference), flow.currency)} {difference >= 0 ? "higher" : "lower"} than previous
                                                {flow.net_change_percent !== null && ` (${Number(flow.net_change_percent).toFixed(1)}%)`}
                                            </p>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground">No posted activity for this period.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="h-full p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xs font-medium text-muted-foreground">Attention needed</h3>
                            <AlertTriangle className={`h-4 w-4 ${attentionTotal ? "text-amber-700" : "text-emerald-700"}`} />
                        </div>
                        {attentionTotal ? (
                            <ul className="space-y-2 text-xs">
                                <li className="flex justify-between gap-2"><span>Failed imports (30 days)</span><strong>{data.attention_needed.failed_imports}</strong></li>
                                <li className="flex justify-between gap-2"><span>Accounts without recent statement data</span><strong>{data.attention_needed.stale_accounts}</strong></li>
                                <li className="flex justify-between gap-2"><span>Uncategorized transactions</span><strong>{data.attention_needed.uncategorized_transactions}</strong></li>
                            </ul>
                        ) : (
                            <p className="text-xs text-muted-foreground">Nothing needs attention right now.</p>
                        )}
                        <Link href="/dashboard/transactions" className="mt-4 inline-block text-xs font-medium text-primary hover:underline">
                            Review transactions
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-5">
                    <h3 className="mb-1 text-xs font-medium text-muted-foreground">Income and spending</h3>
                    <p className="mb-4 text-xs text-muted-foreground">Posted transactions · {PERIODS.find(option => option.value === period)?.label.toLowerCase()}</p>
                    {data.cash_flow_by_currency.length ? (
                        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {data.cash_flow_by_currency.map(flow => (
                                <li key={flow.currency} className="grid min-w-0 grid-cols-2 gap-3">
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Income · {flow.currency}</p>
                                        <p className="break-all font-semibold text-emerald-800">{money(flow.income, flow.currency)}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Spending · {flow.currency}</p>
                                        <p className="break-all font-semibold text-rose-800">{money(flow.spending, flow.currency)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No posted activity for this period.</p>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}
