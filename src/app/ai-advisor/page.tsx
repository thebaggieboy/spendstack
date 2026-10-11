import Link from "next/link"
import {
    ArrowRight,
    BarChart3,
    Check,
    FileSearch,
    Lightbulb,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    WalletCards,
} from "lucide-react"
import { Button } from "@/components/ui/Button"

const advisorUses = [
    {
        icon: BarChart3,
        title: "Spot spending patterns",
        body: "Get a readable summary of trends across the transactions you have imported.",
    },
    {
        icon: Lightbulb,
        title: "Turn patterns into ideas",
        body: "Review practical prompts that can help you reflect on recurring costs and cash flow.",
    },
    {
        icon: FileSearch,
        title: "Ask about your statements",
        body: "Use statement chat to ask questions about your own transaction history and inspect supporting records.",
    },
]

export default function AIAdvisorPage() {
    return (
        <div className="landing-page flex w-full flex-1 flex-col items-center font-sans">
            <section className="w-full px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-10 lg:pb-20">
                <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                    <div>
                        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-primary sm:text-xs">
                            <Sparkles className="h-3.5 w-3.5" />
                            SPENDSTACK AI · PRO
                        </p>
                        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Make your money activity easier to understand.
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Spendstack AI helps turn imported transaction history into useful summaries and questions to explore—so you can spend less time scanning rows and more time deciding what to do next.
                        </p>
                        <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
                            <Link href="/dashboard/advisor">
                                <Button size="lg" className="h-11 w-full rounded-xl px-5 text-sm font-semibold min-[420px]:w-auto">
                                    Open AI Advisor
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/dashboard/chat" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-medium text-foreground transition hover:bg-muted">
                                <MessageCircle className="h-4 w-4" />
                                Ask about a statement
                            </Link>
                        </div>
                        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            AI can make mistakes. Review answers and source transactions; do not treat them as financial or investment advice.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-5 rounded-[2rem] bg-primary/[0.05] blur-2xl" aria-hidden="true" />
                        <div className="relative rounded-3xl border border-border bg-white p-5 shadow-[0_24px_80px_-32px_rgba(35,25,70,0.22)] sm:p-7">
                            <div className="flex items-center gap-3 border-b border-border pb-4">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></span>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Your money, in context</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Illustrative product preview</p>
                                </div>
                            </div>
                            <div className="mt-5 space-y-3">
                                <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-xs leading-relaxed text-white">
                                    What changed in my spending this month?
                                </div>
                                <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3">
                                    <p className="text-xs leading-relaxed text-foreground">
                                        I can compare your imported transactions across periods and highlight categories that changed. You can open the records behind a result to check the details.
                                    </p>
                                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-[10px] text-muted-foreground">
                                        <WalletCards className="h-3.5 w-3.5 text-primary" />
                                        Example response — not based on your account
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/[0.035] p-3 text-xs text-muted-foreground">
                                <FileSearch className="h-4 w-4 shrink-0 text-primary" />
                                Statement chat can include references to matching transaction records.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full border-y border-primary bg-primary px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/80 sm:text-xs">From activity to insight</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">A helpful companion to your records.</h2>
                        <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                            Start with statements you import, then use the advisor and chat to explore them in plain language.
                        </p>
                    </div>
                    <div className="mt-7 grid gap-4 md:grid-cols-3">
                        {advisorUses.map(({ icon: Icon, title, body }, index) => (
                            <article key={title} className="rounded-2xl border border-white/70 bg-white p-5 shadow-lg shadow-black/10">
                                <div className="flex items-center justify-between">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary"><Icon className="h-5 w-5" /></span>
                                    <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="w-full px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
                <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                    <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-primary sm:text-xs">Built around your imported history</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Use AI with a human check.</h2>
                        <div className="mt-5 space-y-3">
                            {[
                                "Bring your own statement data—no bank login required",
                                "Ask about transactions you imported",
                                "Check referenced records before acting",
                                "Treat suggestions as prompts, not professional advice",
                            ].map((item) => (
                                <p key={item} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-5 sm:p-6">
                        <MessageCircle className="h-6 w-6 text-primary" />
                        <h3 className="mt-4 text-base font-semibold text-foreground">Ready to explore your statements?</h3>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            Import a statement, open the advisor for personalized insights, or ask a specific question in statement chat.
                        </p>
                        <div className="mt-5 flex flex-col gap-3 min-[420px]:flex-row">
                            <Link href="/dashboard/advisor" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
                                Open AI Advisor <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-xs font-medium text-foreground transition hover:bg-muted">
                                Get started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
