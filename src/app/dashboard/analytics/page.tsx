"use client"

import useSWR from "swr"
import { BarChart as BarChartIcon, Download, TrendingDown, TrendingUp, Minus, Receipt } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import ExpenseChart from "@/components/dashboard/ExpenseChart"
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown"
import MonthlyTrend from "@/components/dashboard/MonthlyTrend"
import SpendingInsights from "@/components/dashboard/SpendingInsights"
import { fetchWithAuth } from "@/lib/fetcher"

type MonthlyComparison = {
    current_period: { start: string; end: string }
    previous_period: { start: string; end: string }
    expenses: { current: number; previous: number; change: { amount: number; percent: number | null } }
    income: { current: number; previous: number; change: { amount: number; percent: number | null } }
    latest_statement_metrics: {
        filename: string | null
        opening_balance: string | null
        closing_balance: string | null
        total_credits: string | null
        total_debits: string | null
        credit_count: string | null
        debit_count: string | null
        ambiguous_fields: string[]
        incomplete_fields: string[]
        comparison: {
            total_credits: StatementMetricComparison
            total_debits: StatementMetricComparison
            credit_count: StatementMetricComparison
            debit_count: StatementMetricComparison
        }
    }
    transaction_counts: {
        debits: { current: number; previous: number }
        credits: { current: number; previous: number }
    }
    categories: { category: string; current: number; previous: number; change: number }[]
}

type StatementMetricComparison = {
    status: "match" | "mismatch" | "unavailable"
    transaction_rows: string | number
    difference: string | number | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

function money(amount: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
    }).format(amount)
}

function statementMoney(value: string | null) {
    return value === null ? "Not in statement" : money(Number(value))
}

function statementBalance(value: string | null, field: "opening_balance" | "closing_balance", metrics: MonthlyComparison["latest_statement_metrics"]) {
    if (value !== null) return money(Number(value))
    if (metrics.ambiguous_fields.includes(field)) return "Conflicting values"
    if (metrics.incomplete_fields.includes(field)) return "Not in every account sheet"
    return "Not in statement"
}

function statementComparisonText(comparison: StatementMetricComparison, isMoney: boolean) {
    const rows = isMoney
        ? money(Number(comparison.transaction_rows))
        : Number(comparison.transaction_rows).toLocaleString()
    if (comparison.status === "unavailable") {
        return `Statement total unavailable · posted rows: ${rows}`
    }
    if (comparison.status === "match") {
        return `Statement and posted rows match · ${rows}`
    }
    const difference = isMoney
        ? money(Math.abs(Number(comparison.difference)))
        : Math.abs(Number(comparison.difference)).toLocaleString()
    return `Posted rows: ${rows} · mismatch: ${difference}`
}

function periodLabel(start: string, end: string) {
    const from = new Date(`${start}T00:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short" })
    const to = new Date(`${end}T00:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    return `${from} – ${to}`
}

export default function AnalyticsPage() {
    const { data, error, isLoading } = useSWR<MonthlyComparison>(
        `${API_URL}dashboard/monthly-comparison/`,
        fetchWithAuth,
    )
    const currentPeriod = data?.current_period
    const previousPeriod = data?.previous_period
    const latestStatementMetrics = data?.latest_statement_metrics
    const statementMetricCards = latestStatementMetrics ? [
        { label: "Opening Balance", value: statementBalance(latestStatementMetrics.opening_balance, "opening_balance", latestStatementMetrics) },
        { label: "Closing Balance", value: statementBalance(latestStatementMetrics.closing_balance, "closing_balance", latestStatementMetrics) },
        {
            label: "Total Credit",
            value: statementMoney(latestStatementMetrics.total_credits),
            comparison: latestStatementMetrics.comparison.total_credits,
            isMoney: true,
        },
        {
            label: "Total Debit",
            value: statementMoney(latestStatementMetrics.total_debits),
            comparison: latestStatementMetrics.comparison.total_debits,
            isMoney: true,
        },
        {
            label: "Credit Count",
            value: latestStatementMetrics.credit_count ?? "Not in statement",
            comparison: latestStatementMetrics.comparison.credit_count,
            isMoney: false,
        },
        {
            label: "Debit Count",
            value: latestStatementMetrics.debit_count ?? "Not in statement",
            comparison: latestStatementMetrics.comparison.debit_count,
            isMoney: false,
        },
    ] : []
    const exportReport = () => {
        if (!data) return
        const rows = [
            ["Metric", "Current period", "Previous comparable period", "Change"],
            ["Period", periodLabel(data.current_period.start, data.current_period.end), periodLabel(data.previous_period.start, data.previous_period.end), ""],
            ["Debits (NGN)", data.expenses.current, data.expenses.previous, data.expenses.change.amount],
            ["Credits (NGN)", data.income.current, data.income.previous, data.income.change.amount],
            ["Debit transaction count", data.transaction_counts.debits.current, data.transaction_counts.debits.previous, data.transaction_counts.debits.current - data.transaction_counts.debits.previous],
            ["Credit transaction count", data.transaction_counts.credits.current, data.transaction_counts.credits.previous, data.transaction_counts.credits.current - data.transaction_counts.credits.previous],
            ...([
                {
                    label: "Opening Balance",
                    value: statementBalance(data.latest_statement_metrics.opening_balance, "opening_balance", data.latest_statement_metrics),
                },
                {
                    label: "Closing Balance",
                    value: statementBalance(data.latest_statement_metrics.closing_balance, "closing_balance", data.latest_statement_metrics),
                },
                {
                    label: "Total Credit",
                    value: data.latest_statement_metrics.total_credits,
                    comparison: data.latest_statement_metrics.comparison.total_credits,
                },
                {
                    label: "Total Debit",
                    value: data.latest_statement_metrics.total_debits,
                    comparison: data.latest_statement_metrics.comparison.total_debits,
                },
                {
                    label: "Credit Count",
                    value: data.latest_statement_metrics.credit_count,
                    comparison: data.latest_statement_metrics.comparison.credit_count,
                },
                {
                    label: "Debit Count",
                    value: data.latest_statement_metrics.debit_count,
                    comparison: data.latest_statement_metrics.comparison.debit_count,
                },
            ]).flatMap(({ label, value, comparison }) => [
                    [
                        `Latest statement ${label}`,
                        value ?? "Not in statement",
                        data.latest_statement_metrics.filename ?? "",
                        "",
                    ],
                    ...(comparison ? [[
                        `Latest statement ${label} transaction rows`,
                        comparison.transaction_rows,
                        comparison.status,
                        comparison.difference ?? "",
                    ]] : []),
                ]),
            ...data.categories.map(category => [
                `${category.category} spending (NGN)`,
                category.current,
                category.previous,
                category.change,
            ]),
        ]
        const csv = rows
            .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
            .join("\n")
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
        const link = document.createElement("a")
        link.href = url
        link.download = "spendstack-monthly-analytics.csv"
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1> <br />
                    <p className="mt-1 text-muted-foreground text-xs">Explore posted transaction totals and counts, spending categories, monthly trends, and period comparisons. Statement-reported balances and totals are shown separately from parsed transaction rows.</p>
                </div>
                <button
                    type="button"
                    onClick={exportReport}
                    disabled={!data}
                    className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Download className="h-4 w-4" />
                    Export report
                </button>
            </div>
 
            <SpendingInsights />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
                <ExpenseChart />
                <CategoryBreakdown />
            </div>

            <MonthlyTrend />

            <Card>
                <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <BarChartIcon className="h-4 w-4 text-primary" />
                            Month-to-date comparison
                        </CardTitle>
                        <CardDescription>
                            {currentPeriod && previousPeriod
                                ? `Current ${periodLabel(currentPeriod.start, currentPeriod.end)} vs ${periodLabel(previousPeriod.start, previousPeriod.end)}`
                                : "Compares the same number of days in this month and the previous month"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {isLoading ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">Loading your comparison…</p>
                        ) : error || !data ? (
                            <p role="alert" className="py-8 text-center text-sm text-red-700">Could not load your monthly comparison.</p>
                        ) : (
                            <>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        { label: "Debits", metric: data.expenses, icon: data.expenses.change.amount > 0 ? TrendingUp : data.expenses.change.amount < 0 ? TrendingDown : Minus, tone: data.expenses.change.amount > 0 ? "text-red-700" : "text-emerald-700" },
                                        { label: "Credits", metric: data.income, icon: data.income.change.amount > 0 ? TrendingUp : data.income.change.amount < 0 ? TrendingDown : Minus, tone: data.income.change.amount > 0 ? "text-emerald-700" : "text-muted-foreground" },
                                    ].map(({ label, metric, icon: Icon, tone }) => (
                                        <div key={label} className="border border-border bg-white p-4">
                                            <p className="text-sm text-muted-foreground">{label} this period</p>
                                            <p className="mt-1 text-xl font-semibold text-foreground">{money(metric.current)}</p>
                                            <p className={`mt-2 flex items-center gap-1 text-xs ${tone}`}>
                                                <Icon className="h-3.5 w-3.5" />
                                                {metric.change.percent === null
                                                    ? `${money(Math.abs(metric.change.amount))} vs no previous-period activity`
                                                    : `${Math.abs(metric.change.percent)}% ${metric.change.amount > 0 ? "higher" : metric.change.amount < 0 ? "lower" : "unchanged"} (${money(Math.abs(metric.change.amount))})`}
                                                <span className="text-muted-foreground">vs {money(metric.previous)}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        { label: "Debit transactions", counts: data.transaction_counts.debits },
                                        { label: "Credit transactions", counts: data.transaction_counts.credits },
                                    ].map(({ label, counts }) => (
                                        <div key={label} className="border border-border bg-white p-4">
                                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Receipt className="h-4 w-4" /> {label} this period
                                            </p>
                                            <p className="mt-1 text-xl font-semibold text-foreground">{counts.current.toLocaleString()}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {counts.previous.toLocaleString()} in the comparable previous period · posted rows include transfers, pending excluded
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold text-foreground">Largest category changes</h3>
                                    {data.categories.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No categorized spending in these periods.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {data.categories.map(category => (
                                                <div key={category.category} className="flex items-center justify-between gap-3 bg-muted/50 px-3 py-2 text-sm">
                                                    <span className="truncate text-foreground">{category.category}</span>
                                                    <span className={`whitespace-nowrap font-medium ${category.change > 0 ? "text-red-700" : category.change < 0 ? "text-emerald-700" : "text-muted-foreground"}`}>
                                                        {category.change > 0 ? "+" : category.change < 0 ? "−" : ""}{money(Math.abs(category.change))}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Credit/debit totals and counts include posted transfers and exclude pending entries; category changes show non-transfer spending only. Periods compare this month through today with the previous month through the matching calendar day.
                                </p>
                            </>
                        )}
                    </CardContent>
            </Card>
        </div>
    )
}
