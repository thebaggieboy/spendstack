"use client"

import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { fetchWithAuth as fetcher } from "@/lib/fetcher"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import {
    FileText, Calendar, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown,
    Wallet, Store, Search, ArrowLeft, Loader2, AlertTriangle, CheckCircle2, Info
} from "lucide-react"
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { useState } from "react"
import Link from "next/link"

type StatementTransaction = {
    id: number
    date: string
    date_display: string
    raw_description: string
    merchant_name: string
    amount: number
    currency: string
    source_id: string
    category: string
    category_color: string
    cumulative_flow: number
    is_transfer: boolean
    is_pending: boolean
}

type StatementDetail = {
    filename: string
    currency: string
    parser_warnings: string[]
    upload_date: string
    stats: {
        total_credits: number
        total_expenses: number
        net: number
        transaction_count: number
        credit_count: number
        debit_count: number
        pending_transaction_count: number
        merchant_count: number
        highest_daily_spend: number
        highest_daily_spend_date: string | null
    }
    statement_reconciliation: {
        status: "matched" | "mismatch" | "review" | "unavailable"
        statement_summary: {
            opening_balance: string | null
            closing_balance: string | null
            total_credits: string | null
            total_debits: string | null
            credit_count: string | null
            debit_count: string | null
        }
        ambiguous_fields: string[]
        incomplete_fields: string[]
        sheet_summaries: {
            sheet: string
            opening_balance?: string | null
            closing_balance?: string | null
            total_credits?: string | null
            total_debits?: string | null
            credit_count?: string | null
            debit_count?: string | null
            ambiguous_fields?: string[]
        }[]
        checks: Record<string, {
            status: "match" | "mismatch" | "review" | "unavailable"
            reported: number | null
            from_transactions: number
            difference?: number
        }>
        balance_movement: {
            status: "match" | "mismatch" | "review" | "unavailable"
            opening_balance: number | null
            closing_balance: number | null
            reported_movement?: number
            transaction_net?: number
            difference?: number
        }
    }
    transactions: StatementTransaction[]
    category_breakdown: { name: string; value: number; color: string }[]
    daily_data: { date: string; credits: number; expenses: number }[]
}

type TooltipItem = { color?: string; stroke?: string; name?: string; value?: number }

function formatMoney(value: number, currency = "NGN") {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: currency || "NGN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

const CustomTooltip = ({
    active,
    payload,
    label,
    currency,
}: {
    active?: boolean
    payload?: TooltipItem[]
    label?: string | number
    currency?: string
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-border rounded-xl p-3 text-sm shadow-lg">
                <p className="font-semibold text-foreground mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color || p.stroke }}>{p.name}: {formatMoney(Math.abs(Number(p.value ?? 0)), currency)}</p>
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

    const { data, isLoading, error } = useSWR<StatementDetail>(
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

    const { filename, upload_date, stats, transactions, category_breakdown, daily_data, statement_reconciliation, currency } = data

    const filteredTx = transactions?.filter(tx =>
        tx.merchant_name?.toLowerCase().includes(search.toLowerCase()) ||
        tx.raw_description?.toLowerCase().includes(search.toLowerCase()) ||
        tx.category?.toLowerCase().includes(search.toLowerCase())
    ) ?? []

    const flowData = transactions?.map(tx => ({
        date: tx.date_display,
        "Cumulative flow": tx.cumulative_flow,
    })) ?? []

    const reported = statement_reconciliation.statement_summary
    const balanceSummaryText = (field: "opening_balance" | "closing_balance") => {
        if (statement_reconciliation.ambiguous_fields.includes(field)) return "Conflicting values"
        if (statement_reconciliation.incomplete_fields.includes(field)) return "Not available for every account sheet"
        const value = reported[field]
        return value === null ? "Not reported" : formatMoney(Number(value), currency)
    }
    const statCards = [
        { label: "Total Credits", value: reported.total_credits === null ? formatMoney(stats.total_credits, currency) : formatMoney(Number(reported.total_credits), currency), sub: reported.total_credits === null ? "Parsed transaction rows · statement total not found" : "From the uploaded statement", icon: TrendingUp, color: "emerald", colorHex: "#22c55e" },
        { label: "Total Debits", value: reported.total_debits === null ? formatMoney(stats.total_expenses, currency) : formatMoney(Number(reported.total_debits), currency), sub: reported.total_debits === null ? "Parsed transaction rows · statement total not found" : "From the uploaded statement", icon: TrendingDown, color: "rose", colorHex: "#f43f5e" },
        { label: "Opening Balance", value: reported.opening_balance === null ? "Not in statement" : formatMoney(Number(reported.opening_balance), currency), icon: Wallet, color: "blue", colorHex: "#3b82f6" },
        { label: "Closing Balance", value: reported.closing_balance === null ? "Not in statement" : formatMoney(Number(reported.closing_balance), currency), icon: Wallet, color: "blue", colorHex: "#3b82f6" },
        { label: "Credit Count", value: reported.credit_count === null ? stats.credit_count.toLocaleString() : Number(reported.credit_count).toLocaleString(), sub: reported.credit_count === null ? "Parsed posted rows · statement count not found" : "From the uploaded statement", icon: TrendingUp, color: "emerald", colorHex: "#22c55e" },
        { label: "Debit Count", value: reported.debit_count === null ? stats.debit_count.toLocaleString() : Number(reported.debit_count).toLocaleString(), sub: reported.debit_count === null ? "Parsed posted rows · statement count not found" : "From the uploaded statement", icon: TrendingDown, color: "rose", colorHex: "#f43f5e" },
        { label: "Highest Daily Spend", value: formatMoney(stats.highest_daily_spend, currency), sub: stats.highest_daily_spend_date ? `On ${stats.highest_daily_spend_date}` : "No spending", icon: TrendingDown, color: "rose", colorHex: "#f43f5e" },
        { label: "Unique Merchants", value: stats.merchant_count.toLocaleString(), icon: Store, color: "blue", colorHex: "#3b82f6" },
    ]

    const reconciliationTone = {
        matched: "border-emerald-200 bg-emerald-50 text-emerald-800",
        mismatch: "border-rose-200 bg-rose-50 text-rose-800",
        review: "border-amber-200 bg-amber-50 text-amber-800",
        unavailable: "border-slate-200 bg-slate-50 text-slate-700",
    }[statement_reconciliation.status]
    const reconciliationIcon = statement_reconciliation.status === "matched"
        ? CheckCircle2
        : statement_reconciliation.status === "mismatch"
            ? AlertTriangle
            : Info

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
                                    {stats.transaction_count} posted transactions · {stats.pending_transaction_count} pending
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            <p className="text-xs text-muted-foreground">
                Statement totals include all posted debits and credits, including transfers. Category spending and highest daily spend exclude transfers.
            </p>

            <Card>
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <CardTitle>Statement reconciliation</CardTitle>
                            <CardDescription>Statement-reported totals and balances are shown alongside parsed posted-row totals and counts so discrepancies stay visible.</CardDescription>
                        </div>
                        <span className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-medium uppercase ${reconciliationTone}`}>
                            {(() => {
                                const StatusIcon = reconciliationIcon
                                return <StatusIcon className="h-4 w-4" />
                            })()}
                            {statement_reconciliation.status === "matched" ? "Available figures match" : statement_reconciliation.status === "mismatch" ? "Mismatch found" : statement_reconciliation.status === "review" ? "Review needed" : "Summary unavailable"}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.parser_warnings.length > 0 && (
                        <div role="alert" className="border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                            <p className="font-medium">Parser warnings ({data.parser_warnings.length})</p>
                            <ul className="mt-2 max-h-32 list-inside list-disc overflow-y-auto">
                                {data.parser_warnings.slice(0, 50).map((warning, index) => (
                                    <li key={`${index}-${warning}`}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {([
                            ["Total credits", "total_credits", true],
                            ["Total debits", "total_debits", true],
                            ["Credit count", "credit_count", false],
                            ["Debit count", "debit_count", false],
                        ] as const).map(([label, key, isMoney]) => {
                            const check = statement_reconciliation.checks[key]
                            const displayValue = (value: number | null) => value === null
                                ? "Not found"
                                : isMoney ? formatMoney(value, currency) : value.toLocaleString()
                            return (
                                <div key={key} className="border border-border p-3">
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                    <p className="mt-1 font-semibold">Parsed rows: {displayValue(check.from_transactions)}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Printed: {check.reported === null
                                            ? (check.status === "review"
                                                ? statement_reconciliation.ambiguous_fields.includes(key)
                                                    ? "conflicting values"
                                                    : "not available on every account sheet"
                                                : "not found")
                                            : displayValue(check.reported)}
                                    </p>
                                    {check.status === "mismatch" && <p className="mt-1 text-xs text-rose-700">Difference: {displayValue(Math.abs(check.difference ?? 0))}</p>}
                                </div>
                            )
                        })}
                        <div className="border border-border p-3">
                            <p className="text-xs text-muted-foreground">Opening balance</p>
                            <p className="mt-1 font-semibold">{balanceSummaryText("opening_balance")}</p>
                        </div>
                        <div className="border border-border p-3">
                            <p className="text-xs text-muted-foreground">Closing balance</p>
                            <p className="mt-1 font-semibold">{balanceSummaryText("closing_balance")}</p>
                        </div>
                    </div>
                    <div className={`border p-3 text-sm ${reconciliationTone}`}>
                        {statement_reconciliation.balance_movement.status === "match" || statement_reconciliation.balance_movement.status === "mismatch"
                            ? <>Balance movement: {formatMoney(statement_reconciliation.balance_movement.reported_movement ?? 0, currency)}; posted transaction net: {formatMoney(statement_reconciliation.balance_movement.transaction_net ?? 0, currency)}.{statement_reconciliation.balance_movement.status === "mismatch" ? ` Difference: ${formatMoney(Math.abs(statement_reconciliation.balance_movement.difference ?? 0), currency)}.` : " These amounts match."}</>
                            : statement_reconciliation.balance_movement.status === "review"
                                ? "Opening or closing balance appears more than once with conflicting values; balance movement could not be verified."
                                : "Balance movement could not be verified because the statement did not provide both opening and closing balances."}
                    </div>
                    {statement_reconciliation.sheet_summaries.length > 1 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold">Reported totals by account sheet</h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                {statement_reconciliation.sheet_summaries.map(sheet => (
                                    <div key={sheet.sheet} className="border border-border p-3">
                                        <p className="text-sm font-medium">{sheet.sheet}</p>
                                        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                            <span>Opening balance</span>
                                            <span className="text-right">{sheet.opening_balance ? formatMoney(Number(sheet.opening_balance), currency) : "Not reported"}</span>
                                            <span>Closing balance</span>
                                            <span className="text-right">{sheet.closing_balance ? formatMoney(Number(sheet.closing_balance), currency) : "Not reported"}</span>
                                            <span>Credits</span>
                                            <span className="text-right">{sheet.total_credits !== undefined && sheet.total_credits !== null ? formatMoney(Number(sheet.total_credits), currency) : "Not reported"}</span>
                                            <span>Debits</span>
                                            <span className="text-right">{sheet.total_debits !== undefined && sheet.total_debits !== null ? formatMoney(Number(sheet.total_debits), currency) : "Not reported"}</span>
                                            <span>Credit count</span>
                                            <span className="text-right">{sheet.credit_count ?? "Not reported"}</span>
                                            <span>Debit count</span>
                                            <span className="text-right">{sheet.debit_count ?? "Not reported"}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Charts Row 1 */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Cumulative transaction flow chart */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Cumulative Posted Transaction Flow</CardTitle>
                        <CardDescription>All posted transaction amounts, including transfers, added from zero; this is not your account balance because the opening balance is not included.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={flowData}>
                                <defs>
                                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} interval="preserveStartEnd" />
                                <YAxis tickFormatter={v => formatMoney(v, currency)} tick={{ fontSize: 10, fill: "#71717a" }} />
                                <Tooltip content={<CustomTooltip currency={currency} />} />
                                <Area type="monotone" dataKey="Cumulative flow" stroke="#6366f1" strokeWidth={2} fill="url(#balGrad)" dot={false} />
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
                                        {category_breakdown.map((c, i) => (
                                            <Cell key={i} fill={c.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={value => formatMoney(Number(value ?? 0), currency)}
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
                    <CardTitle className="text-sm">Daily Credits vs Debits</CardTitle>
                    <CardDescription>Daily posted credits and debits, including transfers and excluding pending transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={daily_data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#71717a" }} />
                            <YAxis tickFormatter={v => formatMoney(v, currency)} tick={{ fontSize: 10, fill: "#71717a" }} />
                            <Tooltip content={<CustomTooltip currency={currency} />} />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                            <Bar dataKey="credits" name="Credits" fill="#22c55e" radius={[3, 3, 0, 0]} />
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
                                <div className="col-span-1 text-right">Flow</div>
                            </div>

                            <div className="divide-y divide-border">
                                {filteredTx.length === 0 ? (
                                    <div className="text-center text-sm text-muted-foreground py-10">No results found</div>
                                ) : (
                                    filteredTx.map(tx => (
                                        <div id={`transaction-${tx.id}`} key={tx.id} className="grid grid-cols-12 gap-3 items-center px-4 py-3 hover:bg-muted/50 transition-colors rounded-xl group scroll-mt-24">
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
                                                    {tx.is_pending && <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-800">Pending · excluded from totals</span>}
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
                                                {tx.amount > 0 ? "+" : ""}{formatMoney(Math.abs(tx.amount), tx.currency || currency)}
                                            </div>
                                            <div className="col-span-1 text-right text-xs text-muted-foreground font-mono">
                                                {formatMoney(tx.cumulative_flow, tx.currency || currency)}
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
