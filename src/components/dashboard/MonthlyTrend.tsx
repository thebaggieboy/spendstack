"use client"

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine,
    Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { BarChart3, UploadCloud } from "lucide-react"
import useSWR from "swr"
import { fetchWithAuth as fetcher } from "@/lib/fetcher"
import { formatNaira } from "@/lib/utils"

interface MonthRow {
    month: string
    income: number
    expenses: number
    net: number
}

const formatAxis = (value: number) => {
    if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}k`
    return `₦${value}`
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    const income = payload.find((p: any) => p.dataKey === "income")?.value ?? 0
    const expenses = payload.find((p: any) => p.dataKey === "expenses")?.value ?? 0
    const net = income - expenses

    return (
        <div
            className="rounded-xl px-4 py-3 text-sm space-y-1.5"
            style={{
                backgroundColor: "rgba(10,10,10,0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                color: "white",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
            }}
        >
            <p className="font-semibold text-white mb-2">{label}</p>
            <p className="flex justify-between gap-6">
                <span className="text-muted-foreground">Income</span>
                <span className="text-emerald-400 font-medium">{formatNaira(income)}</span>
            </p>
            <p className="flex justify-between gap-6">
                <span className="text-muted-foreground">Expenses</span>
                <span className="text-rose-400 font-medium">{formatNaira(expenses)}</span>
            </p>
            <div className="border-t border-white/10 pt-1.5 mt-1">
                <p className="flex justify-between gap-6">
                    <span className="text-muted-foreground">Net</span>
                    <span className={`font-bold ${net >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {net >= 0 ? "+" : ""}{formatNaira(net)}
                    </span>
                </p>
            </div>
        </div>
    )
}

export default function MonthlyTrend() {
    const { data: rawData, error, isLoading } = useSWR<MonthRow[]>(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard/monthly-trend/`,
        fetcher
    )

    const cardBase = "col-span-1 lg:col-span-4"

    if (isLoading) {
        return <Card className={`${cardBase} h-[380px] animate-pulse bg-white/5 border border-white/10`} />
    }

    if (error) {
        return (
            <Card className={`${cardBase} h-[380px] flex items-center justify-center`}>
                <p className="text-rose-400 text-sm">Failed to load monthly trend data.</p>
            </Card>
        )
    }

    if (!rawData || rawData.length === 0) {
        return (
            <Card className={`${cardBase} h-[380px] flex flex-col items-center justify-center gap-4 border border-dashed border-white/10`}>
                <div className="p-4 rounded-full bg-white/5 border border-white/10">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                    <p className="font-medium text-foreground">No monthly data yet</p>
                    <p className="text-sm text-muted-foreground">Upload a bank statement to see your monthly trend.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className={cardBase}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-violet-400" />
                        Monthly Trend
                    </CardTitle>
                    <CardDescription>Income vs Expenses grouped by month</CardDescription>
                </div>

                {/* Summary pills */}
                <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-2 w-2 rounded-sm bg-emerald-400 inline-block" />
                        Income
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-2 w-2 rounded-sm bg-rose-400 inline-block" />
                        Expenses
                    </span>
                </div>
            </CardHeader>

            <CardContent className="pl-0">
                <div className="h-[280px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={rawData}
                            margin={{ top: 8, right: 24, left: 10, bottom: 0 }}
                            barCategoryGap="30%"
                            barGap={4}
                        >
                            <XAxis
                                dataKey="month"
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                className="opacity-50"
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatAxis}
                                className="opacity-50"
                                width={60}
                            />
                            <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />

                            <Bar dataKey="income" name="Income" radius={[4, 4, 0, 0]} maxBarSize={32}>
                                {rawData.map((_, i) => (
                                    <Cell key={i} fill="#10b981" fillOpacity={0.85} />
                                ))}
                            </Bar>

                            <Bar dataKey="expenses" name="Expenses" radius={[4, 4, 0, 0]} maxBarSize={32}>
                                {rawData.map((_, i) => (
                                    <Cell key={i} fill="#f43f5e" fillOpacity={0.85} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Net row per month */}
                {rawData.length > 0 && (
                    <div className="px-6 mt-4 flex flex-wrap gap-x-6 gap-y-2">
                        {rawData.map((row) => (
                            <div key={row.month} className="flex flex-col items-center">
                                <span className="text-[10px] text-muted-foreground">{row.month}</span>
                                <span
                                    className={`text-xs font-semibold ${
                                        row.net >= 0 ? "text-emerald-400" : "text-rose-400"
                                    }`}
                                >
                                    {row.net >= 0 ? "+" : ""}
                                    {formatAxis(row.net)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
