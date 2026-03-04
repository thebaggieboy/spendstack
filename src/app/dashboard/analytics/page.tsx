"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { BarChart as BarChartIcon, Download, Zap } from "lucide-react"
import ExpenseChart from "@/components/dashboard/ExpenseChart"
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown"

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Analytics</h1>
                    <p className="text-muted-foreground mt-1">Deep dive into your spending habits.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition text-white">
                        <Download className="h-4 w-4" />
                        Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                        <Zap className="h-4 w-4" />
                        Generate AI Insights
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <ExpenseChart />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CategoryBreakdown />

                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base font-medium">
                            <BarChartIcon className="h-4 w-4 text-primary" />
                            Monthly Comparison
                        </CardTitle>
                        <CardDescription>How this month compares to last month</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl m-4 mt-0 bg-white/5">
                        <p>More detailed charts coming soon...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
