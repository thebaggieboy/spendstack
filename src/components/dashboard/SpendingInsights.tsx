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
} from "lucide-react"
import useSWR from "swr"
import { fetchWithAuth as fetcher } from "@/lib/fetcher"
import { formatNaira } from "@/lib/utils"

interface InsightData {
    avg_daily_spend: number
    avg_transaction_value: number
    busiest_spend_day: string
    largest_expense: number
    largest_expense_name: string
    largest_expense_date: string
    total_txn_count: number
    income_txn_count: number
    expense_txn_count: number
    unique_merchants: number
    no_spend_days: number
}

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
                    <div className="p-1.5 rounded-md bg-white/5 border border-white/10">
                        <Icon className={`h-3.5 w-3.5 ${accent}`} />
                    </div>
                </div>
                <p className={`text-xl font-bold tracking-tight ${accent}`}>{value}</p>
                {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
            </CardContent>
        </Card>
    )
}

export default function SpendingInsights() {
    const { data, error, isLoading } = useSWR<InsightData>(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard/insights/`,
        fetcher
    )

    if (isLoading) {
        return (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="h-[110px] animate-pulse bg-white/5 border border-white/10" />
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
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="border border-dashed border-white/10 h-[110px] flex flex-col items-center justify-center gap-2">
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

    const cards = [
        {
            icon: CalendarDays,
            label: "Avg Daily Spend",
            value: formatNaira(data.avg_daily_spend),
            sub: "On days with spending activity",
            accent: "text-rose-400",
        },
        {
            icon: Receipt,
            label: "Avg Transaction",
            value: formatNaira(data.avg_transaction_value),
            sub: `Across ${data.expense_txn_count} expense transactions`,
            accent: "text-orange-400",
        },
        {
            icon: SunMedium,
            label: "Busiest Spend Day",
            value: data.busiest_spend_day ?? "—",
            sub: "Day of week with highest cumulative outflow",
            accent: "text-amber-400",
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
            sub: `${data.income_txn_count} credits · ${data.expense_txn_count} debits`,
            accent: "text-blue-400",
        },
        {
            icon: Store,
            label: "Unique Merchants",
            value: data.unique_merchants.toLocaleString(),
            sub: "Distinct payees across all transactions",
            accent: "text-violet-400",
        },
        {
            icon: Banknote,
            label: "Income Transactions",
            value: data.income_txn_count.toLocaleString(),
            sub: "Total credit entries recorded",
            accent: "text-emerald-400",
        },
        {
            icon: TrendingDown,
            label: "No-Spend Days",
            value: data.no_spend_days.toLocaleString(),
            sub: "Days with zero outgoing spend in your history",
            accent: "text-sky-400",
        },
    ]

    return (
        <div className="space-y-3">
            <div>
                <h3 className="text-sm font-semibold text-foreground">Spending Insights</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Key metrics derived from your full transaction history</p>
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {cards.map((c) => (
                    <InsightCard key={c.label} {...c} />
                ))}
            </div>
        </div>
    )
}
