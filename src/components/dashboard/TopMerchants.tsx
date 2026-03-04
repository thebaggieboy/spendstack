"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Building2, ArrowUpRight } from "lucide-react"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TopMerchants() {
    const { data: merchants, error, isLoading } = useSWR('http://127.0.0.1:8000/api/dashboard/top-merchants/', fetcher)

    if (isLoading) {
        return <Card className="col-span-1 lg:col-span-2 h-[400px] animate-pulse bg-white/5 border border-white/10" />
    }

    if (error || !merchants || merchants.length === 0) {
        return (
            <Card className="col-span-1 lg:col-span-2 h-[400px] flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                <Building2 className="h-8 w-8 mb-4 opacity-50" />
                <p>No merchant data yet.</p>
                <p className="text-sm mt-2">Upload a bank statement to see where you spend the most.</p>
            </Card>
        )
    }

    const formatNaira = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
    }

    // Find max for the progress bar
    const maxAmount = Math.max(...merchants.map((m: any) => m.amount), 1);

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-400" />
                        Top Merchants
                    </CardTitle>
                    <CardDescription>Where your money goes the most</CardDescription>
                </div>
                <button className="text-xs text-primary hover:text-white transition flex items-center">
                    View All <ArrowUpRight className="h-3 w-3 ml-1" />
                </button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-4">
                    {merchants.map((merchant: any) => (
                        <div key={merchant.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-sm text-white shadow-sm group-hover:scale-110 transition-transform">
                                    {merchant.logo}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none text-white">{merchant.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                                        {merchant.category}
                                        <span className="h-1 w-1 rounded-full bg-white/20"></span>
                                        {merchant.count} txns
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">{formatNaira(merchant.amount)}</p>
                                <div className="w-24 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                                        style={{ width: `${(merchant.amount / maxAmount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
