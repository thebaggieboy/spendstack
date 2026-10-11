"use client"

import useSWR from "swr"
import { BarChart as BarChartIcon, Download, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import ProFeatureGate from "@/components/billing/ProFeatureGate"
import ExpenseChart from "@/components/dashboard/ExpenseChart"
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown"
import { fetchWithAuth } from "@/lib/fetcher"

type MonthlyComparison = {
    current_period: { start: string; end: string }
    previous_period: { start: string; end: string }
    expenses: { current: number; previous: number; change: { amount: number; percent: number | null } }
    income: { current: number; previous: number; change: { amount: number; percent: number | null } }
    categories: { category: string; current: number; previous: number; change: number }[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

function money(amount: number) {
    return `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`
}

function periodLabel(start: string, end: string) {
    const from = new Date(`${start}T00:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short" })
    const to = new Date(`${end}T00:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    return `${from} – ${to}`
}

function AnalyticsContent() {
    const { data, error, isLoading } = useSWR<MonthlyComparison>(
        `${API_URL}dashboard/monthly-comparison/`,
        fetchWithAuth,
    )
    const currentPeriod = data?.current_period
    const previousPeriod = data?.previous_period
    const exportReport = () => {
        if (!data) return
        const rows = [
            ["Metric", "Current period", "Previous comparable period", "Change"],
            ["Period", periodLabel(data.current_period.start, data.current_period.end), periodLabel(data.previous_period.start, data.previous_period.end), ""],
            ["Spending (NGN)", data.expenses.current, data.expenses.previous, data.expenses.change.amount],
            ["Income (NGN)", data.income.current, data.income.previous, data.income.change.amount],
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
                    <p className="mt-1 text-muted-foreground">Compare spending over equivalent periods, excluding transfers.</p>
                </div>
                <button
                    type="button"
                    onClick={exportReport}
                    disabled={!data}
                    className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Download className="h-4 w-4" />
                    Export report
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <ExpenseChart />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CategoryBreakdown />

                <Card className="col-span-1 lg:col-span-2">
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
                                        { label: "Spending", metric: data.expenses, icon: data.expenses.change.amount > 0 ? TrendingUp : data.expenses.change.amount < 0 ? TrendingDown : Minus, tone: data.expenses.change.amount > 0 ? "text-red-700" : "text-emerald-700" },
                                        { label: "Income", metric: data.income, icon: data.income.change.amount > 0 ? TrendingUp : data.income.change.amount < 0 ? TrendingDown : Minus, tone: data.income.change.amount > 0 ? "text-emerald-700" : "text-muted-foreground" },
                                    ].map(({ label, metric, icon: Icon, tone }) => (
                                        <div key={label} className="rounded-xl border border-border bg-white p-4">
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
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold text-foreground">Largest category changes</h3>
                                    {data.categories.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No categorized spending in these periods.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {data.categories.map(category => (
                                                <div key={category.category} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2 text-sm">
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
                                    Period totals compare this month through today with the previous month through the matching calendar day. Percent change is omitted when the previous period had no activity.
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function AnalyticsPage() {
    return (
        <ProFeatureGate feature="Advanced analytics and report exports">
            <AnalyticsContent />
        </ProFeatureGate>
    )
}
