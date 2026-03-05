"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from "lucide-react"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function OverviewCards() {
    const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}dashboard/overview/`, fetcher)

    if (isLoading) {
        return <div className="animate-pulse h-32 bg-white/5 rounded-xl w-full"></div>
    }

    if (error || !data) {
        return <div className="text-red-400">Failed to load overview data</div>
    }

    const formatNaira = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
    }

    const stats = [
        {
            title: "Total Balance",
            value: formatNaira(data.total_balance),
            change: "Overall",
            trend: "neutral",
            icon: Wallet,
            color: "from-blue-500 to-cyan-400",
            iconColor: "text-blue-500"
        },
        {
            title: "Total Income",
            value: formatNaira(data.income_all_time),
            change: "All Time",
            trend: "up",
            icon: TrendingUp,
            color: "from-emerald-400 to-green-500",
            iconColor: "text-emerald-500"
        },
        {
            title: "Total Expenses",
            value: formatNaira(data.expenses_all_time),
            change: "All Time",
            trend: "down",
            icon: TrendingDown,
            color: "from-rose-400 to-red-500",
            iconColor: "text-rose-500"
        },
        {
            title: "Savings Rate",
            value: `${data.savings_rate.toFixed(1)}%`,
            change: "Overall",
            trend: "neutral",
            icon: PiggyBank,
            color: "from-purple-500 to-pink-500",
            iconColor: "text-purple-500"
        },
        {
            title: "Highest Daily Spend",
            value: formatNaira(data.highest_daily_spend || 0),
            change: data.highest_daily_spend_date ? `On ${data.highest_daily_spend_date}` : "N/A",
            trend: "down",
            icon: TrendingDown,
            color: "from-orange-500 to-amber-500",
            iconColor: "text-orange-500"
        },
        {
            title: "Top Payee",
            value: formatNaira(data.top_payee_amount || 0),
            change: data.top_payee ? `Sent to ${data.top_payee}` : "N/A",
            trend: "down",
            icon: Wallet,
            color: "from-indigo-500 to-violet-500",
            iconColor: "text-indigo-500"
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.title} className="relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                {stat.title}
                            </p>
                            <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${stat.iconColor}`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white truncate max-w-[200px]">
                                {stat.value}
                            </h2>
                        </div>
                        <p className={`text-xs mt-2 flex items-center ${stat.trend === 'up' ? 'text-emerald-400' : stat.trend === 'down' ? 'text-rose-400' : 'text-slate-400'}`}>
                            <span className="font-medium mr-1 truncate">{stat.change}</span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
