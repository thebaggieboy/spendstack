import OverviewCards from "@/components/dashboard/OverviewCards"
import ExpenseChart from "@/components/dashboard/ExpenseChart"
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown"
import TransactionsList from "@/components/dashboard/TransactionsList"
import TopMerchants from "@/components/dashboard/TopMerchants"
import SpendingInsights from "@/components/dashboard/SpendingInsights"
import MonthlyTrend from "@/components/dashboard/MonthlyTrend"
import AIAdvisor from "@/components/ai/AIAdvisor"
import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="mx-auto flex-1 max-w-7xl space-y-8 py-6">

      {/* Page header */}
      <div className="flex flex-col gap-5 rounded-3xl border border-border bg-gradient-to-br from-white via-white to-violet-50/70 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            YOUR MONEY, IN FOCUS
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            A clear view of your cash flow, spending patterns, and recent activity.
          </p>
        </div>
        <Link
          href="/upload"
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:self-center"
        >
          Upload statement
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Row 1: Key metric cards */}
      <OverviewCards />

      {/* Row 2: Cash flow (daily area) + Category donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <ExpenseChart />
        <CategoryBreakdown />
      </div>

      {/* Row 3: Monthly bar chart + AI Advisor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <MonthlyTrend />
        <AIAdvisor />
      </div>

      {/* Row 4: Smart spending stats */}
      <SpendingInsights />

      {/* Row 5: Recent transactions + Top merchants */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <TransactionsList />
        <TopMerchants />
      </div>

    </div>
  )
}
