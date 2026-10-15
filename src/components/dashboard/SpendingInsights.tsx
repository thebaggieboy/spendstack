"use client"

import { Card, CardContent } from "@/components/ui/Card"
import {
    CalendarDays,
    Receipt,
    Store,
    TrendingDown,
    ArrowDownCircle,
    SunMedium,
    Banknote,
    Activity,
    Send,
    Tags,
} from "lucide-react"
import useSWR from "swr"
import { fetchWithAuth as fetcher } from "@/lib/fetcher"
import { formatNaira } from "@/lib/utils"
import { useState } from "react"

interface InsightData {
    has_data: boolean
    avg_daily_spend: number
    avg_transaction_value: number
    busiest_spend_day: string
    largest_expense: number
    largest_expense_name: string
    largest_expense_date: string
    total_txn_count: number
    income_txn_count: number
    expense_txn_count: number
    spending_expense_txn_count: number
    unique_merchants: number
    no_spend_days: number
    top_category: string | null
    top_category_amount: number
    top_category_share_percent: number
    top_recipient: string | null
    top_recipient_transfer_count: number
    top_recipient_transfer_amount: number
}

const PERIODS = [
    { value: "all", label: "All time" },
    { value: "month", label: "This month" },
    { value: "90days", label: "90 days" },
    { value: "year", label: "This year" },
] as const

function InsightCard({
    icon: Icon,
    label,
    value,
    sub,
    accent = "text-foreground",
}: {
    icon: React.ElementType
    label: string
    value: string
    sub?: string
    accent?: string
}) {
    return (
        <Card className="relative overflow-hidden">
            <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                    <div className="p-1.5 rounded-md bg-muted border border-border">
                        <Icon className={`h-3.5 w-3.5 ${accent}`} />
                    </div>
                </div>
                <p className={`break-words text-xl font-bold tracking-tight ${accent}`}>{value}</p>
                {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
            </CardContent>
        </Card>
    )
}

export default function SpendingInsights() {
    const [period, setPeriod] = useState<(typeof PERIODS)[number]["value"]>("all")
    const { data, error, isLoading } = useSWR<InsightData>(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard/insights/?period=${period}`,
        fetcher
    )

    if (isLoading) {
        return (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <Card key={i} className="h-[110px] animate-pulse bg-muted" />
                ))}
            </div>
        )
    }

    if (error || !data || Object.keys(data).length === 0) {
        return (
            <div className="space-y-3">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Spending Insights</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Key metrics derived from your full transaction history</p>
                </div>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Card key={i} className="border-dashed h-[110px] flex flex-col items-center justify-center gap-2">
                            <CardContent className="p-5 flex flex-col items-center justify-center gap-2 text-center">
                                <Activity className="h-4 w-4 text-muted-foreground/40" />
                                <p className="text-xs text-muted-foreground/50">Upload a statement</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (!data.has_data) {
        return (
            <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">Spending Insights</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">Useful patterns from your transactions</p>
                    </div>
                    <PeriodFilters period={period} onChange={setPeriod} />
                </div>
                <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-sm text-muted-foreground">
                        No transactions in this period. Try another range or upload a statement.
                    </CardContent>
                </Card>
            </div>
        )
    }

    const cards = [
        {
            icon: CalendarDays,
            label: "Avg Daily Spend",
            value: formatNaira(data.avg_daily_spend),
            sub: "Average posted outflow on spending days",
            accent: "text-rose-400",
        },
        {
            icon: Receipt,
            label: "Avg Transaction",
            value: formatNaira(data.avg_transaction_value),
            sub: `Across ${data.spending_expense_txn_count} non-transfer debit transactions`,
            accent: "text-orange-400",
        },
        {
            icon: SunMedium,
            label: "Busiest Spend Day",
            value: data.busiest_spend_day ?? "—",
            sub: "Weekday with highest posted outflow",
            accent: "text-black",
        },
        {
            icon: ArrowDownCircle,
            label: "Largest Expense",
            value: formatNaira(data.largest_expense),
            sub: data.largest_expense_name
                ? `${data.largest_expense_name} · ${data.largest_expense_date}`
                : undefined,
            accent: "text-red-400",
        },
        {
            icon: Activity,
            label: "Total Transactions",
            value: data.total_txn_count.toLocaleString(),
            sub: `${data.income_txn_count} credits · ${data.expense_txn_count} debits; posted rows include transfers, pending excluded`,
            accent: "text-black",
        },
        {
            icon: Store,
            label: "Unique Merchants",
            value: data.unique_merchants.toLocaleString(),
            sub: "Distinct payees on non-transfer debits",
            accent: "text-black",
        },
        {
            icon: Banknote,
            label: "Credit Transactions",
            value: data.income_txn_count.toLocaleString(),
            sub: "All posted credit rows, including transfers",
            accent: "text-black",
        },
        {
            icon: TrendingDown,
            label: "No-Spend Days",
            value: data.no_spend_days.toLocaleString(),
            sub: "Between your first and last transaction dates",
            accent: "text-black",
        },
        {
            icon: Tags,
            label: "Top Spending Category",
            value: data.top_category ?? "—",
            sub: data.top_category
                ? `${formatNaira(data.top_category_amount)} · ${data.top_category_share_percent.toFixed(1)}% of spending`
                : "No categorized spending",
            accent: "text-black",
        },
        {
            icon: Send,
            label: "Most Sent To",
            value: data.top_recipient ?? "—",
            sub: data.top_recipient
                ? `${data.top_recipient_transfer_count} transfers · ${formatNaira(data.top_recipient_transfer_amount)} total`
                : "No outgoing transfers with a named recipient",
            accent: "text-black",
        },
    ]

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Spending Insights</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Non-transfer spending metrics for {PERIODS.find((option) => option.value === period)?.label.toLowerCase()}
                    </p>
                </div>
                <PeriodFilters period={period} onChange={setPeriod} />
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {cards.map((c) => (
                    <InsightCard key={c.label} {...c} />
                ))}
            </div>
        </div>
    )
}

function PeriodFilters({
    period,
    onChange,
}: {
    period: (typeof PERIODS)[number]["value"]
    onChange: (period: (typeof PERIODS)[number]["value"]) => void
}) {
    return (
        <div
            className="flex w-fit items-center gap-1 border border-border bg-white p-1"
            role="group"
            aria-label="Filter insights by time period"
        >
            {PERIODS.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    aria-pressed={period === option.value}
                    className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        period === option.value
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}
