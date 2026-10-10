"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Store, CreditCard, Coffee, ShoppingBag, Zap, Loader2, Building2, ArrowUpRight } from 'lucide-react';
import useSWR from 'swr'
import { fetchWithAuth as fetcher } from '@/lib/fetcher';
import { formatNaira } from '@/lib/utils';

export default function TopMerchants() {
    const { data: merchants, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}dashboard/top-merchants/`, fetcher)

    if (isLoading) {
        return <Card className="col-span-1 lg:col-span-2 h-[400px] animate-pulse bg-muted" />
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
                <button className="text-xs text-primary hover:text-primary/80 transition flex items-center">
                    View All <ArrowUpRight className="h-3 w-3 ml-1" />
                </button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-4">
                    {merchants.map((merchant: any) => (
                        <div key={merchant.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center font-semibold text-sm text-primary group-hover:scale-110 transition-transform">
                                    {merchant.logo}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none text-foreground">{merchant.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                                        {merchant.category}
                                        <span className="h-1 w-1 rounded-full bg-border"></span>
                                        {merchant.count} txns
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-foreground">{formatNaira(merchant.amount)}</p>
                                <div className="w-24 h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
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
