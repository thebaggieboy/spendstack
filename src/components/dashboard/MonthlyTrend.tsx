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

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean
    payload?: { dataKey?: string; value?: number | string }[]
    label?: string
}) => {
    if (!active || !payload?.length) return null
    const income = Number(payload.find((p) => p.dataKey === "income")?.value ?? 0)
    const expenses = Number(payload.find((p) => p.dataKey === "expenses")?.value ?? 0)
    const net = income - expenses

    return (
        <div
            className="rounded-xl px-4 py-3 text-sm space-y-1.5"
            style={{
                backgroundColor: "#ffffff",
                border: "1px solid hsl(240 6% 90%)",
                backdropFilter: "blur(12px)",
                color: "#18181b",
                boxShadow: "0 10px 25px -5px rgba(24,24,27,0.12)",
            }}
        >
            <p className="font-semibold text-foreground mb-2">{label}</p>
            <p className="flex justify-between gap-6">
                <span className="text-muted-foreground">Credits</span>
                <span className="text-emerald-400 font-medium">{formatNaira(income)}</span>
            </p>
            <p className="flex justify-between gap-6">
                <span className="text-muted-foreground">Expenses</span>
                <span className="text-rose-400 font-medium">{formatNaira(expenses)}</span>
            </p>
            <div className="border-t border-border pt-1.5 mt-1">
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

    const cardBase = "w-full"

    if (isLoading) {
        return <Card className={`${cardBase} h-[380px] animate-pulse bg-muted`} />
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
            <Card className={`${cardBase} h-[380px] flex flex-col items-center justify-center gap-4 border-dashed`}>
                <div className="p-4 rounded-full bg-muted border border-border">
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
                    <CardDescription>Recorded credits vs spending, excluding transfers and pending transactions</CardDescription>
                </div>

                {/* Summary pills */}
                <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-2 w-2 rounded-sm bg-emerald-400 inline-block" />
                        Credits
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
                            <ReferenceLine y={0} stroke="rgba(24,24,27,0.12)" />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(24,24,27,0.04)" }} />

                            <Bar dataKey="income" name="Credits" radius={[4, 4, 0, 0]} maxBarSize={32}>
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
                                    {formatNaira(row.net)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
