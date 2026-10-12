"use client"

import AIAdvisor from "@/components/ai/AIAdvisor"
import Link from "next/link"

export default function AdvisorPage() {
    return (
        <div className="min-w-0 space-y-6 py-4 sm:py-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">AI Financial Advisor</h2>
                    <p className="text-muted-foreground mt-1">
                        Personalized insights based on your transaction history powered by Gemini.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 auto-rows-min">
                <AIAdvisor />

                {/* Visual Placeholder for more AI interactions */}
                <div className="rounded-xl border border-border bg-white p-8 text-center mt-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Ask Spendstack AI</h3>
                    <p className="text-muted-foreground mx-auto max-w-lg mb-6">
                        Want deeper analysis? Chat directly with your financial data to find hidden trends or ask specific questions about your spending.
                    </p>
                    <Link
                        href="/dashboard/chat"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                        <span>Start a statement chat</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}
