"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { PieChart as PieChartIcon, ExternalLink, UploadCloud } from "lucide-react"
import useSWR from 'swr'
import { formatNaira } from '@/lib/utils';
import { fetchWithAuth as fetcher } from '@/lib/fetcher';

const cardBase = "col-span-1 lg:col-span-3"
const categoryColors = [
    "#6366f1", "#f97316", "#14b8a6", "#ec4899", "#eab308", "#8b5cf6",
    "#06b6d4", "#ef4444", "#84cc16", "#f43f5e", "#0ea5e9", "#a855f7",
]

const formatNairaTooltip = (value: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value)

export default function CategoryBreakdown() {
    const { data: rawData, error, isLoading } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard/category-breakdown/`,
        fetcher
    )

    if (isLoading) {
        return <Card className={`${cardBase} h-[400px] animate-pulse bg-muted`} />
    }

    if (error) {
        return (
            <Card className={`${cardBase} h-[400px] flex items-center justify-center`}>
                <p className="text-rose-400 text-sm">Failed to load category data.</p>
            </Card>
        )
    }

    // No mock data — show empty state so the chart only shows real user transactions
    if (!rawData || rawData.length === 0) {
        return (
            <Card className={`${cardBase} h-[400px] flex flex-col items-center justify-center gap-4 border-dashed`}>
                <div className="p-4 rounded-full bg-muted border border-border">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                    <p className="font-medium text-foreground">No spending data yet</p>
                    <p className="text-sm text-muted-foreground">
                        Upload a bank statement to see your category breakdown.
                    </p>
                </div>
            </Card>
        )
    }

    const totalSpent = rawData.reduce((acc: number, curr: any) => acc + curr.value, 0)
    const chartData = rawData.map((item: any, index: number) => ({
        ...item,
        color: categoryColors[index % categoryColors.length],
    }))

    return (
        <Card className={cardBase}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <PieChartIcon className="h-4 w-4 text-primary" />
                        Spending by Category
                    </CardTitle>
                    <CardDescription>All-time breakdown from your transactions</CardDescription>
                </div>
                <button className="p-2 hover:bg-muted rounded-md transition-colors">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </button>
            </CardHeader>
            <CardContent>
                <div className="h-[280px] w-full relative flex items-center justify-center">
                    {/* Centre label */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col z-0 pointer-events-none">
                        <span className="text-2xl font-bold">{formatNaira(totalSpent)}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">Total Spent</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%" className="z-10 relative">
                        <PieChart>
                            <Tooltip
                                formatter={(value: any) => [formatNairaTooltip(value as number), 'Amount']}
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid hsl(240 6% 90%)',
                                    borderRadius: '10px',
                                    backdropFilter: 'blur(12px)',
                                    color: '#18181b',
                                    boxShadow: '0 10px 25px -5px rgba(24,24,27,0.12)',
                                }}
                                itemStyle={{ color: '#18181b' }}
                            />
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {chartData.map((item: any) => (
                        <div key={item.name} className="flex items-center space-x-2">
                            <div
                                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium text-foreground truncate">{item.name}</span>
                                <span className="text-xs text-muted-foreground">{formatNaira(item.value)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
