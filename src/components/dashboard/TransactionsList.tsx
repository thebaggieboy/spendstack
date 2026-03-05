"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { ListFilter, ArrowDownRight, ArrowUpRight } from "lucide-react"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TransactionsList() {
    const { data: transactions, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}dashboard/transactions/recent/`, fetcher)

    if (isLoading) {
        return <Card className="col-span-1 lg:col-span-3 h-[400px] animate-pulse bg-white/5 border border-white/10" />
    }

    if (error || !transactions || transactions.length === 0) {
        return (
            <Card className="col-span-1 lg:col-span-3 h-[400px] flex items-center justify-center text-muted-foreground p-6 text-center">
                <p>No recent transactions. Upload a statement to get started.</p>
            </Card>
        )
    }

    const formatNaira = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
    }

    return (
        <Card className="col-span-1 lg:col-span-3 h-[400px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                <div className="space-y-1">
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activity</CardDescription>
                </div>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                    <ListFilter className="h-4 w-4" />
                    Filter
                </button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto custom-scrollbar pr-2 mt-2">
                <div className="space-y-2">
                    {transactions.map((tx: any) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl flex items-center justify-center ${tx.amount > 0
                                    ? "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-500 group-hover:bg-rose-500/20"
                                    } transition-colors`}>
                                    {tx.amount > 0 ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{tx.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                                        {tx.category}
                                        <span className="h-1 w-1 rounded-full bg-white/20"></span>
                                        {tx.date}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${tx.amount > 0 ? "text-emerald-400" : "text-white"}`}>
                                    {tx.amount > 0 ? "+" : ""}{formatNaira(Math.abs(tx.amount))}
                                </p>
                                {tx.status === 'pending' && (
                                    <p className="text-[10px] uppercase font-bold text-amber-500 mt-1 tracking-wider">Pending</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
