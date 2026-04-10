import OverviewCards from "@/components/dashboard/OverviewCards"
import ExpenseChart from "@/components/dashboard/ExpenseChart"
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown"
import TransactionsList from "@/components/dashboard/TransactionsList"
import TopMerchants from "@/components/dashboard/TopMerchants"
import SpendingInsights from "@/components/dashboard/SpendingInsights"
import MonthlyTrend from "@/components/dashboard/MonthlyTrend"
import AIAdvisor from "@/components/ai/AIAdvisor"

export default function Home() {
  return (
    <div className="flex-1 space-y-8 pt-4">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
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
