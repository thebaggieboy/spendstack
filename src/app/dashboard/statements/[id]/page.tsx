"use client"

import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { fetchWithAuth as fetcher } from "@/lib/fetcher"
import { formatNaira } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import {
    FileText, Calendar, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown,
    Wallet, Store, Search, ArrowLeft, Loader2
} from "lucide-react"
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { useState } from "react"
import Link from "next/link"

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-border rounded-xl p-3 text-sm shadow-lg">
                <p className="font-semibold text-foreground mb-1">{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ color: p.color || p.stroke }}>{p.name}: {formatNaira(Math.abs(p.value))}</p>
                ))}
            </div>
        )
    }
    return null
}

export default function StatementDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [search, setSearch] = useState("")

    const { data, isLoading, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}analysis/statements/${id}/`,
        fetcher
    )

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground opacity-30" />
                <h2 className="text-xl font-semibold text-foreground">Statement not found</h2>
                <Link href="/dashboard/statements" className="text-primary hover:underline text-sm">
                    ← Back to Statements
                </Link>
            </div>
        )
    }

    const { filename, upload_date, stats, transactions, category_breakdown, daily_data } = data

    const filteredTx = transactions?.filter((tx: any) =>
        tx.merchant_name?.toLowerCase().includes(search.toLowerCase()) ||
        tx.raw_description?.toLowerCase().includes(search.toLowerCase()) ||
        tx.category?.toLowerCase().includes(search.toLowerCase())
    ) ?? []

    const balanceData = transactions?.map((tx: any) => ({
        date: tx.date_display,
        "Balance": tx.running_balance,
    })) ?? []

    const statCards = [
        { label: "Total Income", value: formatNaira(stats.total_income), icon: TrendingUp, color: "emerald", colorHex: "#22c55e" },
        { label: "Total Expenses", value: formatNaira(stats.total_expenses), icon: TrendingDown, color: "rose", colorHex: "#f43f5e" },
        { label: "Net Cash Flow", value: formatNaira(Math.abs(stats.net)), sub: stats.net >= 0 ? "positive" : "negative", icon: Wallet, color: stats.net >= 0 ? "emerald" : "rose", colorHex: stats.net >= 0 ? "#22c55e" : "#f43f5e" },
        { label: "Unique Merchants", value: stats.merchant_count, icon: Store, color: "blue", colorHex: "#3b82f6" },
    ]

    return (
        <div className="flex-1 space-y-6 p-4 sm:p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-start gap-4">
                <button
                    onClick={() => router.push("/dashboard/statements")}
                    className="p-2 rounded-xl bg-white border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all mt-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="p-3 bg-indigo-50 rounded-xl">
                            <FileText className="h-6 w-6 text-indigo-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground truncate max-w-md">{filename}</h1>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Uploaded {upload_date}</span>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {stats.transaction_count} transactions
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((c) => (
                    <Card key={c.label}>
                        <CardContent className="p-4 pl-5">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-muted-foreground">{c.label}</p>
                                <c.icon className="h-4 w-4" style={{ color: c.colorHex }} />
                            </div>
                            <p className="text-xl font-bold text-foreground">{c.value}</p>
                            {c.sub && <p className="text-xs mt-0.5" style={{ color: c.colorHex }}>{c.sub}</p>}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Running Balance Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Running Balance Over Time</CardTitle>
                        <CardDescription>Cumulative balance from statement transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={balanceData}>
                                <defs>
                                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} interval="preserveStartEnd" />
                                <YAxis tickFormatter={v => formatNaira(v)} tick={{ fontSize: 10, fill: "#71717a" }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="Balance" stroke="#6366f1" strokeWidth={2} fill="url(#balGrad)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Pie */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Spending by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {category_breakdown?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={category_breakdown}
                                        cx="50%" cy="45%"
                                        innerRadius={50} outerRadius={75}
                                        dataKey="value" paddingAngle={3}
                                    >
                                        {category_breakdown.map((c: any, i: number) => (
                                            <Cell key={i} fill={c.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v: any) => formatNaira(v)}
                                        contentStyle={{ background: "#ffffff", color: "#18181b", border: "1px solid #e4e4e7", borderRadius: "12px", fontSize: "12px" }}
                                    />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">No spending data</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 — Daily Activity */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Daily Income vs Expenses</CardTitle>
                    <CardDescription>Day-by-day cash flow from this statement</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={daily_data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} />
                            <YAxis tickFormatter={v => formatNaira(v)} tick={{ fontSize: 10, fill: "#71717a" }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <CardTitle>All Transactions</CardTitle>
                            <CardDescription>{filteredTx.length} of {transactions?.length ?? 0} transactions</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search transactions..."
                                className="w-full bg-white border border-input rounded-xl py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <div className="min-w-[640px]">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-3 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                                <div className="col-span-5">Description</div>
                                <div className="col-span-2">Category</div>
                                <div className="col-span-2 text-right">Date</div>
                                <div className="col-span-2 text-right">Amount</div>
                                <div className="col-span-1 text-right">Balance</div>
                            </div>

                            <div className="divide-y divide-border">
                                {filteredTx.length === 0 ? (
                                    <div className="text-center text-sm text-muted-foreground py-10">No results found</div>
                                ) : (
                                    filteredTx.map((tx: any) => (
                                        <div key={tx.id} className="grid grid-cols-12 gap-3 items-center px-4 py-3 hover:bg-muted/50 transition-colors rounded-xl group">
                                            <div className="col-span-5 flex items-center gap-3 min-w-0">
                                                <div className={`p-2 rounded-lg flex-shrink-0 ${tx.amount > 0 ? "bg-emerald-50" : "bg-rose-50"}`}>
                                                    {tx.amount > 0
                                                        ? <ArrowDownRight className="h-4 w-4 text-emerald-700" />
                                                        : <ArrowUpRight className="h-4 w-4 text-rose-700" />
                                                    }
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">{tx.merchant_name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{tx.raw_description}</p>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <span
                                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs border border-border text-muted-foreground truncate max-w-full"
                                                    style={{ borderColor: tx.category_color + "40", color: tx.category_color }}
                                                >
                                                    {tx.category}
                                                </span>
                                            </div>
                                            <div className="col-span-2 text-right text-xs text-muted-foreground">{tx.date}</div>
                                            <div className={`col-span-2 text-right text-sm font-bold ${tx.amount > 0 ? "text-emerald-700" : "text-foreground"}`}>
                                                {tx.amount > 0 ? "+" : ""}{formatNaira(Math.abs(tx.amount))}
                                            </div>
                                            <div className="col-span-1 text-right text-xs text-muted-foreground font-mono">
                                                {formatNaira(tx.running_balance)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
