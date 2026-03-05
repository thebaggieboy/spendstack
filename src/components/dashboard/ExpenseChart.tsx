"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { LineChart as LineChartIcon } from "lucide-react"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ExpenseChart() {
    const { data: rawData, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}dashboard/cash-flow/`, fetcher)

    if (isLoading) {
        return <Card className="col-span-1 lg:col-span-4 h-[400px] animate-pulse bg-white/5 border border-white/10" />
    }

    if (error) {
        return <Card className="col-span-1 lg:col-span-4 h-[400px] flex items-center justify-center text-red-400">Failed to load cash flow data</Card>
    }

    // Use default mock data if api returns empty temporarily
    const data = rawData && rawData.length > 0 ? rawData : [
        { date: 'Jan 01', income: 4000, expenses: 2400 },
        { date: 'Jan 15', income: 2780, expenses: 3908 },
        { date: 'Jan 31', income: 3490, expenses: 4300 },
    ];

    const formatNairaAxis = (value: number) => {
        if (value >= 1000) {
            return `₦${(value / 1000).toFixed(0)}k`
        }
        return `₦${value}`
    }

    const formatNairaTooltip = (value: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value)
    }

    return (
        <Card className="col-span-1 lg:col-span-4 overflow-hidden relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
            <CardHeader className="relative">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-emerald-400" />
                    Cash Flow Overview
                </CardTitle>
                <CardDescription>Income vs Expenses over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pl-0 relative">
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
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
                                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                                activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0 }}
                                name="Income"
                            />
                            <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke="#f43f5e"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorExpenses)"
                                activeDot={{ r: 6, fill: '#f43f5e', strokeWidth: 0 }}
                                name="Expenses"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
