"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { PieChart as PieChartIcon, ExternalLink } from "lucide-react"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CategoryBreakdown() {
    const { data: rawData, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}dashboard/category-breakdown/`, fetcher)

    if (isLoading) {
        return <Card className="col-span-1 lg:col-span-3 h-[400px] animate-pulse bg-white/5 border border-white/10" />
    }

    if (error) {
        return <Card className="col-span-1 lg:col-span-3 h-[400px] flex items-center justify-center text-red-400">Failed to load data</Card>
    }

    // Use default mock data if api returns empty or fails structure temporarily 
    const data = rawData && rawData.length > 0 ? rawData : [
        { name: 'Housing', value: 1200, color: '#8b5cf6' },
        { name: 'Food & Dining', value: 450, color: '#3b82f6' },
        { name: 'Transportation', value: 300, color: '#10b981' },
    ];

    const totalSpent = data.reduce((acc: number, curr: any) => acc + curr.value, 0);

    const formatNaira = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
    }

    return (
        <Card className="col-span-1 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <PieChartIcon className="h-4 w-4 text-primary" />
                        Spending by Category
                    </CardTitle>
                    <CardDescription>This month's breakdown</CardDescription>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-md transition-colors">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </button>
            </CardHeader>
            <CardContent>
                <div className="h-[280px] w-full relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center flex-col z-0">
                        <span className="text-3xl font-bold">{formatNaira(totalSpent)}</span>
                        <span className="text-sm text-muted-foreground">Total Spent</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%" className={"z-10 relative"}>
                        <PieChart>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white'
                                }}
                                itemStyle={{ color: 'white' }}
                                formatter={(value: number | string | Array<number | string> | undefined) => [`₦${value || 0}`, 'Amount']}
                            />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={110}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {data.map((item: any) => (
                        <div key={item.name} className="flex items-center space-x-2">
                            <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-white truncate max-w-[100px]">{item.name}</span>
                                <span className="text-xs text-muted-foreground">{formatNaira(item.value)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
