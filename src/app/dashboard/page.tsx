import OverviewCards from "@/components/dashboard/OverviewCards"
import ExpenseChart from "@/components/dashboard/ExpenseChart"
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown"
import TransactionsList from "@/components/dashboard/TransactionsList"
import TopMerchants from "@/components/dashboard/TopMerchants"
import AIAdvisor from "@/components/ai/AIAdvisor"

export default function Home() {
  return (
    <div className="flex-1 space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* Add date range picker here if needed */}
        </div>
      </div>

      <OverviewCards />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Top section with charts */}
        <ExpenseChart />
        <CategoryBreakdown />

        {/* Middle section with AI & Merchants */}
        <AIAdvisor />
        <div className="col-span-1 lg:col-span-5 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <TransactionsList />
          <TopMerchants />
        </div>
      </div>
    </div>
  )
}
