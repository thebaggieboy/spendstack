"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Search, ArrowDownRight, ArrowUpRight, ListFilter, Download, Calendar, Loader2 } from "lucide-react"
import useSWR from "swr"
import { formatNaira } from '@/lib/utils';
import { fetchWithAuth as fetcher } from '@/lib/fetcher';
import { useSearchParams } from 'next/navigation'
import { Suspense } from "react"

function TransactionsContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const searchParams = useSearchParams()
    const statementId = searchParams.get('statement_id')

    const endpoint = statementId
        ? `${process.env.NEXT_PUBLIC_API_URL}transactions/?statement_id=${statementId}`
        : `${process.env.NEXT_PUBLIC_API_URL}transactions/`;

    const { data: transactions, isLoading } = useSWR(endpoint, fetcher)

    const filteredTransactions = transactions?.filter((tx: any) =>
        tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Transactions</h1>
                    <p className="text-muted-foreground mt-1">View and manage all your financial activity.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button disabled title="Coming soon" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition text-white disabled:opacity-50 disabled:cursor-not-allowed">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button disabled title="Coming soon" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                        <ListFilter className="h-4 w-4" />
                        Filters
                    </button>
                </div>
            </div>

            <Card className="bg-card/30 backdrop-blur-sm border-white/5">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <CardTitle>History</CardTitle>
                            <CardDescription>All your transactions in one place</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search merchants or categories..."
                                className="pl-9 bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl border border-white/10" />
                            ))}
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="py-12 text-center flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-muted-foreground">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium text-white">No transactions found</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                                {searchQuery ? `No results matching "${searchQuery}"` : "Upload a bank statement to see your transactions here."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar pb-4">
                            <div className="min-w-[700px]">
                                <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-white/10 mb-2">
                                    <div className="col-span-5">Merchant / Details</div>
                                    <div className="col-span-2">Category</div>
                                    <div className="col-span-3 text-right">Date</div>
                                    <div className="col-span-2 text-right">Amount</div>
                                </div>

                                <div className="space-y-2">
                                    {filteredTransactions.map((tx: any) => (
                                        <div key={tx.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10">
                                            <div className="col-span-5 flex items-center gap-3">
                                                <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${tx.amount > 0
                                                    ? "bg-emerald-500/10 text-emerald-500"
                                                    : "bg-rose-500/10 text-rose-500"
                                                    }`}>
                                                    {tx.amount > 0 ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-sm font-medium text-white truncate">{tx.name}</p>
                                                    {tx.status === 'pending' && <p className="text-[10px] uppercase font-bold text-amber-500 mt-0.5 tracking-wider">Pending</p>}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-muted-foreground whitespace-nowrap">
                                                    {tx.category}
                                                </span>
                                            </div>
                                            <div className="col-span-3 flex items-center justify-end text-right text-sm text-muted-foreground whitespace-nowrap">
                                                <Calendar className="h-3 w-3 mr-1.5 opacity-50" />
                                                {tx.date}
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <p className={`text-sm font-bold ${tx.amount > 0 ? "text-emerald-400" : "text-white"}`}>
                                                    {tx.amount > 0 ? "+" : ""}{formatNaira(Math.abs(tx.amount))}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}

export default function TransactionsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <TransactionsContent />
        </Suspense>
    )
}
