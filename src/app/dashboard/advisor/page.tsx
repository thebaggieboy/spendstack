"use client"

import AIAdvisor from "@/components/ai/AIAdvisor"

export default function AdvisorPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 overflow-auto">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gradient">AI Financial Advisor</h2>
                    <p className="text-muted-foreground mt-1">
                        Personalized insights based on your transaction history powered by Gemini.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 auto-rows-min">
                <AIAdvisor />

                {/* Visual Placeholder for more AI interactions */}
                <div className="rounded-xl border border-white/10 bg-card/30 p-8 text-center backdrop-blur-sm mt-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Ask Spendstack AI</h3>
                    <p className="text-muted-foreground mx-auto max-w-lg mb-6">
                        Want deeper analysis? Chat directly with your financial data to find hidden trends or ask specific questions about your spending.
                    </p>
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            disabled
                            placeholder="e.g. How much did I spend on food last month compared to this month?"
                            className="w-full flex h-12 rounded-full border border-white/20 bg-background/50 px-6 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-12"
                        />
                        <button disabled className="absolute right-2 top-2 h-8 w-8 bg-primary text-black rounded-full flex items-center justify-center opacity-50 cursor-not-allowed">
                            <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 uppercase tracking-widest font-semibold">Coming Soon</p>
                </div>
            </div>
        </div>
    )
}
