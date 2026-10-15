import OverviewCards from "@/components/dashboard/OverviewCards"
import TransactionsList from "@/components/dashboard/TransactionsList"
import Link from "next/link"
import { ArrowUpRight, BarChart3, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="mx-auto flex-1 max-w-7xl space-y-8 py-6">

      {/* Page header */}
      <div className="flex flex-col gap-5 border border-border bg-gradient-to-br from-white via-white to-violet-50/70 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            YOUR MONEY, IN FOCUS
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Dashboard</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Current balances, period cash flow, and items that need attention. Explore Analytics for detailed trends and category insights.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
          <Link
            href="/dashboard/analytics"
            className="inline-flex h-11 items-center justify-center gap-2 border border-border bg-white px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <BarChart3 className="h-4 w-4" />
            View analytics
          </Link>
          <Link
            href="/upload"
            className="inline-flex h-11 items-center justify-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Upload statement
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <OverviewCards />

      <TransactionsList />

    </div>
  )
}
