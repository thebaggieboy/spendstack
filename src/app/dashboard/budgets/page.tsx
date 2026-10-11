"use client"

import { FormEvent, useState } from "react"
import useSWR from "swr"
import { AlertCircle, Plus, Target, Trash2, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { fetchWithAuth, requestWithAuth } from "@/lib/fetcher"
import { formatNaira } from "@/lib/utils"

type Budget = {
    id: number
    name: string
    category_name: string
    amount: string
    spent: string
    remaining: string
    percent_used: number
    period: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const budgetsUrl = `${API_URL}savings/budgets/`

export default function BudgetsPage() {
    const { data: budgets, error, isLoading, mutate } = useSWR<Budget[]>(budgetsUrl, fetchWithAuth)
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState("")
    const [formError, setFormError] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    async function createBudget(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setFormError("")
        setIsSaving(true)
        try {
            await requestWithAuth(budgetsUrl, {
                method: "POST",
                body: JSON.stringify({
                    name: name.trim(),
                    category_name: category.trim(),
                    amount,
                }),
            })
            setName("")
            setCategory("")
            setAmount("")
            await mutate()
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Could not create the budget.")
        } finally {
            setIsSaving(false)
        }
    }

    async function deleteBudget(id: number) {
        try {
            await requestWithAuth(`${budgetsUrl}${id}/`, { method: "DELETE" })
            await mutate()
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Could not remove the budget.")
        }
    }

    const totalLimit = budgets?.reduce((sum, budget) => sum + Number(budget.amount), 0) ?? 0
    const totalSpent = budgets?.reduce((sum, budget) => sum + Number(budget.spent), 0) ?? 0

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <header>
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Target className="h-4 w-4" />
                    Monthly planning
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">Budgets</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Set a monthly total or category limit. Transfers are excluded from spending.
                </p>
            </header>

            <Card>
                <CardContent className="p-5 sm:p-6">
                    <form onSubmit={createBudget} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
                        <label className="space-y-1.5 text-sm font-medium text-foreground">
                            Budget name
                            <input value={name} onChange={event => setName(event.target.value)} required maxLength={100} placeholder="Monthly essentials" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm font-normal" />
                        </label>
                        <label className="space-y-1.5 text-sm font-medium text-foreground">
                            Category (optional)
                            <input value={category} onChange={event => setCategory(event.target.value)} maxLength={100} placeholder="Food & Dining" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm font-normal" />
                        </label>
                        <label className="space-y-1.5 text-sm font-medium text-foreground">
                            Monthly limit (₦)
                            <input type="number" min="1" step="0.01" value={amount} onChange={event => setAmount(event.target.value)} required placeholder="150000" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm font-normal" />
                        </label>
                        <button type="submit" disabled={isSaving} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60">
                            <Plus className="h-4 w-4" />
                            {isSaving ? "Saving…" : "Create budget"}
                        </button>
                    </form>
                    {formError && <p role="alert" className="mt-3 text-sm text-red-700">{formError}</p>}
                </CardContent>
            </Card>

            {budgets && budgets.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card><CardContent className="flex items-center gap-3 p-5">
                        <span className="rounded-xl bg-primary/10 p-3 text-primary"><Wallet className="h-5 w-5" /></span>
                        <div><p className="text-xs text-muted-foreground">Combined monthly limits</p><p className="text-xl font-semibold text-foreground">{formatNaira(totalLimit)}</p></div>
                    </CardContent></Card>
                    <Card><CardContent className="flex items-center gap-3 p-5">
                        <span className={`rounded-xl p-3 ${totalSpent > totalLimit ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}><Target className="h-5 w-5" /></span>
                        <div><p className="text-xs text-muted-foreground">Combined spend this month</p><p className="text-xl font-semibold text-foreground">{formatNaira(totalSpent)}</p></div>
                    </CardContent></Card>
                </div>
            )}

            {isLoading ? <p className="text-sm text-muted-foreground">Loading budgets…</p> : error ? (
                <p role="alert" className="flex items-center gap-2 text-sm text-red-700"><AlertCircle className="h-4 w-4" />Could not load budgets.</p>
            ) : budgets?.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {budgets.map(budget => {
                        const percent = Math.min(100, budget.percent_used)
                        const over = budget.percent_used >= 100
                        return (
                            <Card key={budget.id}>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-foreground">{budget.name}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">{budget.category_name || "All categories"} · Monthly</p>
                                        </div>
                                        <button type="button" onClick={() => void deleteBudget(budget.id)} aria-label={`Delete ${budget.name}`} className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="mt-5 flex items-baseline justify-between gap-2">
                                        <p className="font-semibold text-foreground">{formatNaira(Number(budget.spent))} <span className="text-xs font-normal text-muted-foreground">spent</span></p>
                                        <p className="text-xs text-muted-foreground">of {formatNaira(Number(budget.amount))}</p>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                                        <div className={`h-full rounded-full transition-all ${over ? "bg-red-600" : percent > 80 ? "bg-amber-500" : "bg-emerald-600"}`} style={{ width: `${percent}%` }} />
                                    </div>
                                    <p className={`mt-2 text-right text-xs ${over ? "font-medium text-red-700" : "text-muted-foreground"}`}>
                                        {over ? `${formatNaira(Number(budget.spent) - Number(budget.amount))} over limit` : `${formatNaira(Number(budget.remaining))} remaining`}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <Card><CardContent className="py-12 text-center">
                    <Target className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-3 font-medium text-foreground">No budgets yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">Create a monthly budget above to start tracking your spending.</p>
                </CardContent></Card>
            )}
        </div>
    )
}
