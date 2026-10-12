import Link from "next/link"
import {
    ArrowDown,
    ArrowRight,
    ArrowRightLeft,
    BarChart3,
    BellRing,
    Calculator,
    CheckCircle2,
    FileText,
    LockKeyhole,
    MessageCircle,
    ShieldCheck,
    TrendingUp,
    Upload,
    Zap,
} from "lucide-react"
import { Button } from "@/components/ui/Button"

const useCases = [
    {
        icon: FileText,
        title: "Turn statements into a clear picture",
        description: "Import PDF or CSV statements, review transactions, and see your spending organized by merchant and category.",
        detail: "Statement tracking",
    },
    {
        icon: MessageCircle,
        title: "Ask questions about your money",
        description: "Chat with your statements and get answers grounded in your transaction history, with references to the source records.",
        detail: "Statement chat",
        href: "/ai-advisor",
    },
    {
        icon: BarChart3,
        title: "Understand where it goes",
        description: "Explore income, expenses, cash flow, merchant activity, and period-over-period changes in one dashboard.",
        detail: "Insights",
    },
    {
        icon: Calculator,
        title: "Plan for Nigerian taxes",
        description: "Build an estimate from your income and eligible deductions, then review the assumptions behind the result.",
        detail: "Tax planning",
        href: "/tax-engine",
    },
    {
        icon: BellRing,
        title: "Stay ahead of spending",
        description: "Plan with budgets, spot recurring bills, set spending alerts, and use merchant or description rules to organize transactions.",
        detail: "Money tools · Some Pro",
    },
    {
        icon: LockKeyhole,
        title: "Set money aside with intention",
        description: "Fund your wallet, lock funds for a chosen period, and arrange a scheduled payout to a verified bank account.",
        detail: "Locks & payouts",
    },
]

const workflow = [
    {
        icon: Upload,
        title: "Upload",
        description: "Add a bank-issued PDF or CSV. No bank login or account linking.",
    },
    {
        icon: Zap,
        title: "Make sense of it",
        description: "Review organized transactions, trends, and tools built around your records.",
    },
    {
        icon: TrendingUp,
        title: "Choose your next step",
        description: "Plan a budget, prepare a tax estimate, or set money aside.",
    },
]

export default function LandingPage() {
    return (
        <div id="top" className="landing-page flex w-full flex-1 flex-col items-center font-sans">
            <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-10 lg:pb-20 lg:pt-24">
                <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                    <div>
                      

                        <h1 className="mb-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:mb-6 sm:text-5xl md:text-6xl xl:text-7xl">
                            Make every<br />
                            naira <span className="text-primary">count.</span>
                        </h1>

                        <p className="mb-7 max-w-xl text-xs leading-relaxed text-muted-foreground sm:mb-8 sm:text-base md:text-sm">
                            Bring your statements, spending insights, tax planning, and money tools together so your next financial decision feels clearer.
                        </p>

                        <div className="flex flex-col items-stretch gap-2.5 min-[420px]:flex-row min-[420px]:items-center sm:gap-3">
                        
                              <a href="/signup" className="inline-flex h-11 w-full items-center justify-center gap-2 text-white border border-border bg-primary px-5 text-xs font-medium text-foreground transition  min-[420px]:w-auto sm:h-12 sm:px-6">
                               Create a free accunt
                             
                            </a>
                            <a href="#features" className="inline-flex h-11 w-full items-center justify-center gap-2  border border-border bg-white px-5 text-xs font-medium text-foreground transition hover:bg-muted min-[420px]:w-auto sm:h-12 sm:px-6">
                                Explore what you can do
                                <ArrowDown className="h-4 w-4 primary-button" />
                            </a>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground sm:mt-8 sm:gap-x-6 sm:text-xs">
                            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />No bank login required</span>
                            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />Your data stays yours</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-5 rounded-[2rem] bg-primary/[0.04] blur-2xl" aria-hidden="true" />
                        <div className="hero-preview relative rounded-2xl border border-border bg-white p-4 shadow-[0_24px_80px_-32px_rgba(35,25,70,0.24)] sm:rounded-3xl sm:p-6 lg:p-7">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your overview</p>
                                    <p className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Money, made clear</p>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">This month</span>
                            </div>

                            <div className="mt-5 rounded-xl bg-slate-50 p-4 sm:mt-7 sm:rounded-2xl sm:p-5">
                                <p className="text-xs text-muted-foreground">Monthly cash flow</p>
                                <div className="mt-2 flex items-end justify-between gap-4">
                                    <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">₦842,500</p>
                                    <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Illustrative</span>
                                </div>
                                <div className="mt-5 flex h-20 items-end gap-1.5 sm:mt-6 sm:h-24 sm:gap-2" aria-label="Illustrative monthly cash flow chart">
                                    {[35, 52, 43, 67, 49, 76, 58, 88, 65, 96, 72, 82].map((height, index) => (
                                        <div key={index} className="flex h-full flex-1 items-end gap-0.5">
                                            <div className="hero-chart-bar w-1/2 rounded-t-sm bg-violet-200" style={{ height: `${height}%`, animationDelay: `${index * 35}ms` }} />
                                            <div className="hero-chart-bar w-1/2 rounded-t-sm bg-primary" style={{ height: `${Math.max(16, height * 0.68)}%`, animationDelay: `${index * 35 + 45}ms` }} />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
                                    <span>WEEK 1</span><span>WEEK 2</span><span>WEEK 3</span><span>WEEK 4</span>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
                                <div className="rounded-xl border border-border p-3 sm:rounded-2xl sm:p-4">
                                    <p className="text-xs text-muted-foreground">Income</p>
                                    <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">₦1.24m</p>
                                    <p className="mt-1 text-xs text-emerald-700">Cash flow overview</p>
                                </div>
                                <div className="rounded-xl border border-border p-3 sm:rounded-2xl sm:p-4">
                                    <p className="text-xs text-muted-foreground">Spent</p>
                                    <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">₦397.5k</p>
                                    <p className="mt-1 text-xs text-primary">By category</p>
                                </div>
                            </div>
                            <p className="mt-4 text-center text-[10px] text-muted-foreground">Illustrative dashboard preview</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="w-full scroll-mt-20 border-y border-primary bg-primary py-14 sm:-mx-6 sm:w-[calc(100%_+_3rem)] sm:px-6 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 max-w-2xl sm:mb-10">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/80 sm:text-xs">One place for your money</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">From bank statement to next step.</h2>
                        <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                            Get the essentials at a glance, with practical tools when you need to go deeper.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                        {useCases.map(({ icon: Icon, title, description, detail, href }) => {
                            const content = (
                                <>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-primary/5 text-primary">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="rounded-full  px-2.5 py-1 text-[10px] font-medium text-amber-50">{detail}</span>
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-foreground sm:text-base text-white">{title}</h3>
                                <p className="mt-2 text-xs leading-relaxed sm:text-xs text-gray-200">{description}</p>
                                </>
                            )
                            return href ? (
                                <Link key={title} href={href} className="rounded-2xl p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-5">
                                    {content}
                                </Link>
                            ) : (
                                <article key={title} className="rounded-2xl p-4 shadow-sm sm:p-5">
                                    {content}
                                </article>
                            )
                        })}
                    </div>

                    <div id="how-it-works" className="mt-8 scroll-mt-20 rounded-2xl border border-white/70 bg-white p-4 shadow-lg shadow-black/10 sm:mt-10 sm:p-6">
                        <div className="mb-5 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
                            <h3 className="text-base font-semibold text-foreground">Simple by design</h3>
                            <p className="text-xs text-muted-foreground sm:text-sm">Your records first. Useful actions next.</p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
                            {workflow.map(({ icon: Icon, title, description }, index) => (
                                <div key={title} className="flex gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{String(index + 1).padStart(2, "0")} · {title}</p>
                                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-white/85">
                        <ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                        Transfers stay separate from spending totals. Wallet locks and scheduled payouts require Paystack setup and a verified bank recipient.
                    </p>
                </div>
            </section>

            <section className="w-full px-4 py-14 text-center sm:px-6 sm:py-16 lg:py-20">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Start with the essentials</p>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">A clearer view starts with one statement.</h2>
                <p className="mx-auto mb-6 mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mb-7 sm:text-base">
                    Track transactions and explore your dashboard for free. Upgrade when you want Pro AI insights and advanced tools.
                </p>
                <div className="flex flex-col justify-center gap-2.5 min-[420px]:flex-row">
                    <Link href="/signup">
                        <Button size="lg" className="h-11 w-full px-7 text-sm font-semibold min-[420px]:w-auto sm:h-12 sm:px-8">
                            Create your free account
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-medium text-foreground transition hover:bg-muted sm:h-12">
                        Sign in
                    </Link>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">No bank login required to upload a statement.</p>
            </section>
        </div>
    )
}
