"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { LineChart as LineChartIcon, UploadCloud } from "lucide-react"
import { fetchWithAuth as fetcher } from '@/lib/fetcher';
import useSWR from 'swr'

export default function ExpenseChart() {
    const { data: rawData, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}dashboard/cash-flow/`, fetcher)

    const formatNairaAxis = (value: number) => {
        if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`
        if (value >= 1000) return `₦${(value / 1000).toFixed(0)}k`
        return `₦${value}`
    }

    const formatNairaTooltip = (value: number) =>
        new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value)

    const cardBase = "col-span-1 lg:col-span-4"

    if (isLoading) {
        return <Card className={`${cardBase} h-[400px] animate-pulse bg-white/5 border border-white/10`} />
    }

    if (error) {
        return (
            <Card className={`${cardBase} h-[400px] flex items-center justify-center`}>
                <p className="text-rose-400 text-sm">Failed to load cash flow data.</p>
            </Card>
        )
    }

    // Empty state — no mock data; prompt user to upload statements
    if (!rawData || rawData.length === 0) {
        return (
            <Card className={`${cardBase} h-[400px] flex flex-col items-center justify-center gap-4 border border-dashed border-white/10`}>
                <div className="p-4 rounded-full bg-white/5 border border-white/10">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                    <p className="font-medium text-foreground">No cash flow data yet</p>
                    <p className="text-sm text-muted-foreground">Upload a bank statement to see your income vs expenses chart.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className={`${cardBase} overflow-hidden`}>
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-emerald-400" />
                    Cash Flow Overview
                </CardTitle>
                <CardDescription>Income vs Expenses — your actual transaction history</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={rawData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                className="opacity-50"
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatNairaAxis}
                                className="opacity-50"
                                width={60}
                            />
                            <Tooltip
                                formatter={(value: any) => [formatNairaTooltip(value as number), undefined]}
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 10, 10, 0.85)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '10px',
                                    backdropFilter: 'blur(12px)',
                                    color: 'white',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                                activeDot={{ r: 5, fill: '#10b981', strokeWidth: 0 }}
                                name="Income"
                            />
                            <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke="#f43f5e"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorExpenses)"
                                activeDot={{ r: 5, fill: '#f43f5e', strokeWidth: 0 }}
                                name="Expenses"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 px-6 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        Income
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-400" />
                        Expenses
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
