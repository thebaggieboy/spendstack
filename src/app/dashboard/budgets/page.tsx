"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Wallet, Plus, Target, AlertCircle } from "lucide-react"

export default function BudgetsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Budgets</h1>
                    <p className="text-muted-foreground mt-1">Set limits and track your spending goals.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" />
                        New Budget
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* Global Budget Overview */}
                <Card className="col-span-1 lg:col-span-3 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
                    <CardHeader>
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Monthly Target
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-3xl font-bold text-white">₦450,000</p>
                                <p className="text-sm text-muted-foreground">spent of ₦600,000 budget</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-emerald-400">75%</p>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                                style={{ width: '75%' }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
                            <AlertCircle className="h-3 w-3" />
                            You are on track to stay within your budget this month.
                        </p>
                    </CardContent>
                </Card>

                {/* Individual Budgets Mockup */}
                {[
                    { name: 'Food & Dining', spent: 120000, limit: 150000, color: 'emerald' as const },
                    { name: 'Transportation', spent: 85000, limit: 80000, color: 'rose' as const },
                    { name: 'Housing', spent: 200000, limit: 200000, color: 'amber' as const }
                ].map((budget) => {
                    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                    const isOver = budget.spent > budget.limit;

                    return (
                        <Card key={budget.name}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-base font-medium">{budget.name}</CardTitle>
                                    <div className={`p-2 rounded-lg bg-${budget.color}-500/10 text-${budget.color}-500`}>
                                        <Wallet className="h-4 w-4" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className={`font-bold text-${isOver ? 'rose-400' : 'white'}`}>
                                            ₦{budget.spent.toLocaleString()}
                                        </span>
                                        <span className="text-muted-foreground">
                                            of ₦{budget.limit.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${isOver ? 'bg-rose-500' : percentage > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-right mt-1">
                                        {isOver ? (
                                            <span className="text-rose-400">₦{(budget.spent - budget.limit).toLocaleString()} over limit</span>
                                        ) : (
                                            <span>₦{(budget.limit - budget.spent).toLocaleString()} left</span>
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
