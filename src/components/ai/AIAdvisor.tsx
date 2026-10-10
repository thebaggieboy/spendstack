"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { BrainCircuit, Sparkles, TrendingDown, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react"
import useSWR from 'swr'
import { fetchWithAuth as fetcher } from '@/lib/fetcher';

export default function AIAdvisor() {
    const { data: insights, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}dashboard/advisor/`, fetcher)

    if (isLoading) {
        return (
            <Card className="col-span-1 lg:col-span-2 bg-primary/[0.03] border-primary/15 h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center animate-pulse text-primary/60">
                    <BrainCircuit className="h-10 w-10 mb-4 animate-spin-slow text-primary" />
                    <p>AI is analyzing your spending patterns...</p>
                </div>
            </Card>
        )
    }

    if (error || !insights || insights.length === 0) {
        return (
            <Card className="col-span-1 lg:col-span-2 bg-primary/[0.03] border-primary/15 h-[400px] flex items-center justify-center text-muted-foreground p-6 text-center">
                <p>Upload a bank statement to receive personalized AI advice.</p>
            </Card>
        )
    }

    return (
        <Card className="col-span-1 lg:col-span-2 bg-primary/[0.03] border-primary/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary text-xl">
                    <BrainCircuit className="h-6 w-6" />
                    Spendstack AI
                </CardTitle>
                <CardDescription className="text-primary/70">Personalized insights based on your spending</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                {insights.map((insight: any, i: number) => {
                    const isAlert = insight.type === 'alert'
                    const Icon = isAlert ? AlertTriangle : CheckCircle2
                    const iconClass = isAlert ? 'text-amber-600' : 'text-emerald-700'

                    return (
                        <div key={i} className="p-4 rounded-xl bg-white border border-border">
                            <div className="flex gap-4 relative z-10">
                                <div className="mt-0.5">
                                    <Icon className={`h-5 w-5 ${iconClass}`} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                                        {insight.title}
                                        {isAlert && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Notice</span>}
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {insight.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}

                <button className="w-full mt-4 flex items-center justify-center p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all group font-medium text-sm border border-primary/20">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Deep Analysis
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

            </CardContent>
        </Card>
    )
}
