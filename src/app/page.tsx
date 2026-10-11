import Link from "next/link"
import { Button } from "@/components/ui/Button"
import {
    ArrowRight,
    BarChart3,
    BrainCircuit,
    ShieldCheck,
    Sparkles,
    Calculator,
    FileText,
    CheckCircle2,
    MessageSquare,
    TrendingUp,
    Upload,
    Zap,
    PieChart,
    CalendarClock,
    BellRing,
    Tags,
    ArrowRightLeft,
} from "lucide-react"

export default function LandingPage() {
    return (
        <div className="landing-page flex w-full flex-1 flex-col items-center font-sans">

            {/* ─── Hero ─────────────────────────────────────────────────── */}
            <section className="mx-auto w-full max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-10 lg:pt-24 lg:pb-28">
                <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-primary sm:mb-6 sm:px-3.5 sm:py-2 sm:text-xs">
                            <Sparkles className="h-3.5 w-3.5" />
                            Your intelligent financial copilot
                        </div>

                        <h1 className="mb-5 text-4xl font-semibold tracking-tight leading-[1.05] text-foreground sm:mb-6 sm:text-5xl md:text-6xl xl:text-7xl">
                            Make every<br />
                            naira <span className="text-primary">count.</span>
                        </h1>

                        <p className="mb-7 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mb-8 sm:text-base md:text-lg">
                            Turn bank statements into a clear picture of your money. Track spending, understand your taxes, and make confident decisions — all in one place.
                        </p>

                        <div className="flex flex-col items-stretch gap-2.5 min-[420px]:flex-row min-[420px]:items-center sm:gap-3">
                            <Link href="/dashboard" className="w-full min-[420px]:w-auto">
                                <Button size="lg" className="h-11 w-full rounded-xl px-5 text-sm font-semibold sm:h-12 sm:w-auto sm:px-7">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="#features" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-medium text-foreground transition hover:bg-muted min-[420px]:w-auto sm:h-12 sm:px-6">
                                Explore features
                                <ArrowRight className="h-4 w-4" />
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
                                    <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">+12.8%</span>
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
                                    <p className="mt-1 text-xs text-emerald-700">↑ 8.4% this month</p>
                                </div>
                                <div className="rounded-xl border border-border p-3 sm:rounded-2xl sm:p-4">
                                    <p className="text-xs text-muted-foreground">Spent</p>
                                    <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">₦397.5k</p>
                                    <p className="mt-1 text-xs text-primary">Across 6 categories</p>
                                </div>
                            </div>
                            <p className="mt-4 text-center text-[10px] text-muted-foreground">Illustrative dashboard preview</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Stats Bar ────────────────────────────────────────────── */}
            <section className="w-full border-y border-border bg-slate-50/70 py-7 sm:py-9">
                <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-3 gap-y-6 px-4 text-center sm:gap-x-8 sm:gap-y-8 sm:px-6 md:grid-cols-4">
                    {[
                        { label: "Bank Formats Supported", value: "20+" },
                        { label: "Transactions Processed", value: "1M+" },
                        { label: "Tax Reports Generated", value: "50K+" },
                        { label: "Average Time Saved", value: "4 hrs/mo" },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">{stat.value}</p>
                            <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground sm:mt-2 sm:text-xs md:text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Feature Deep-Dives ───────────────────────────────────── */}
            <section id="features" className="mx-auto w-full max-w-6xl space-y-16 px-4 py-16 sm:space-y-24 sm:px-6 sm:py-20 lg:space-y-28 lg:px-10 lg:py-28">

                {/* Tax Calculation Engine */}
                <div id="tax" className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-2 lg:gap-16">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-primary/5 border border-primary/10 text-primary">
                            <Calculator className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">Smart Tax Calculation Engine</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Never dread tax season again. Spendstack automatically estimates your Personal Income
                            Tax (PIT) liability using FIRS-compliant brackets. It surfaces deductible expenses
                            buried in your transactions, so you keep more of what you earn.
                        </p>
                        <ul className="space-y-3 pt-2">
                            {[
                                'Real-time PIT liability estimation',
                                'Automated deduction discovery',
                                'Gross-to-net income breakdown',
                                'Export-ready tax summary reports',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tax Engine Visual */}
                    <div className="space-y-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:space-y-4 sm:rounded-3xl sm:p-7">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Tax Summary Preview</p>
                        {[
                            { label: "Annual Gross Income", value: "₦4,800,000", color: "text-foreground" },
                            { label: "Total Deductions", value: "− ₦240,000", color: "text-emerald-700" },
                            { label: "Chargeable Income", value: "₦4,560,000", color: "text-foreground" },
                            { label: "Estimated Tax (PIT)", value: "₦799,500", color: "text-rose-700" },
                            { label: "Effective Tax Rate", value: "17.5%", color: "text-muted-foreground" },
                        ].map((row) => (
                            <div key={row.label} className="flex justify-between items-center py-2 border-b border-border/60 last:border-0">
                                <span className="text-sm text-muted-foreground">{row.label}</span>
                                <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Financial Advisor */}
                <div id="ai" className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-2 lg:gap-16">
                    {/* AI Chat Visual */}
                    <div className="order-2 space-y-3 rounded-2xl border border-border bg-muted/20 p-4 sm:space-y-4 sm:p-7 md:order-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">AI Advisor — Sample Conversation</p>
                        {[
                            { role: "user", text: "Where did most of my money go last month?" },
                            { role: "ai", text: "You spent ₦142,500 on food & dining — 31% of your total outflows. That's 18% above your 3-month average." },
                            { role: "user", text: "How can I reduce it?" },
                            { role: "ai", text: "Cutting dining to ₦90k/month would boost your savings rate from 12% to 24%. Want me to set a spending alert?" },
                        ].map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-2.5 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`flex-shrink-0 h-7 w-7 rounded-full border border-border flex items-center justify-center text-xs font-bold
                                    ${msg.role === "ai" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                    {msg.role === "ai" ? "AI" : "U"}
                                </div>
                                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed sm:px-4 sm:py-2.5 sm:text-sm
                                    ${msg.role === "ai"
                                        ? "bg-muted/40 border border-border text-foreground"
                                        : "bg-primary text-primary-foreground"
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="order-1 space-y-4 sm:space-y-6 md:order-2">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted border border-border text-foreground">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">AI Financial Advisor</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Ask your finances anything — in plain English. Your AI advisor is trained on
                            your actual transaction history, so every insight is specific to you, not
                            generic advice from a template.
                        </p>
                        <ul className="space-y-3 pt-2">
                            {[
                                'Spending pattern analysis',
                                'Proactive savings recommendations',
                                'Income vs. expense trajectory forecasts',
                                'Actionable budget adjustment tips',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Zero-Touch Categorization */}
                <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-2 lg:gap-16">
                    <div className="space-y-4 sm:space-y-6">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted border border-border text-foreground">
                            <BrainCircuit className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Zero-Touch Categorization</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Upload your statements exactly as you download them. Spendstack intelligently
                            processes NIP transfers, USSD, and POS transactions across all major Nigerian banks,
                            delivering an organized financial breakdown in seconds.
                        </p>
                        <ul className="space-y-3 pt-2">
                            {[
                                'Supports all major Nigerian banks',
                                'Context-aware merchant recognition',
                                'Customizable tagging & rules',
                                'Handles PDF and CSV formats',
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories Visual */}
                    <div className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4 sm:p-7">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">Spending Breakdown</p>
                        {[
                            { label: "Food & Dining", pct: 31, color: "bg-orange-400" },
                            { label: "Transport", pct: 22, color: "bg-blue-400" },
                            { label: "Utilities", pct: 18, color: "bg-violet-400" },
                            { label: "Entertainment", pct: 14, color: "bg-pink-400" },
                            { label: "Healthcare", pct: 9, color: "bg-emerald-400" },
                            { label: "Other", pct: 6, color: "bg-slate-400" },
                        ].map((cat) => (
                            <div key={cat.label} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{cat.label}</span>
                                    <span className="font-medium text-foreground">{cat.pct}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-muted">
                                    <div className={`h-1.5 rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─────────────────────────────────────────── */}
            <section id="how-it-works" className="w-full border-y border-border bg-slate-50/70 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center sm:mb-14 lg:mb-16">
                        <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
                        <p className="mx-auto max-w-md text-xs text-muted-foreground sm:text-sm">
                            From raw bank statement to rich financial intelligence in three simple steps.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: Upload,
                                step: "01",
                                title: "Upload your statement",
                                desc: "Drop your bank-issued PDF or CSV. No credentials, no linking — just a clean file upload.",
                            },
                            {
                                icon: Zap,
                                step: "02",
                                title: "We process instantly",
                                desc: "Our engine parses, categorizes, and enriches every transaction with merchant data and tags.",
                            },
                            {
                                icon: TrendingUp,
                                step: "03",
                                title: "Gain deep insights",
                                desc: "Explore your dashboard, review your tax position, and chat with your AI advisor.",
                            },
                        ].map((s) => (
                            <div key={s.step} className="relative space-y-3 border-l border-border pl-5 sm:space-y-4 sm:pl-6">
                                <p className="text-xs font-mono text-muted-foreground">{s.step}</p>
                                <div className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center">
                                    <s.icon className="h-4 w-4 text-foreground" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground sm:text-base">{s.title}</h3>
                                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Feature Grid ─────────────────────────────────────────── */}
            <section className="w-full border-t border-border py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
                    <div className="mb-8 max-w-xl sm:mb-10 lg:mb-12">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary sm:text-xs">More control, less busywork</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">The details that make money easier</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    {[
                        {
                            icon: BarChart3,
                            title: "Crystal Clear Analytics",
                            desc: "Clean dashboards showing net worth, cash flow trends, and spending habits without visual clutter.",
                        },
                        {
                            icon: ShieldCheck,
                            title: "Bank-Level Privacy",
                            desc: "No credentials required. Secure file uploads processed instantly and never stored unencrypted.",
                        },
                        {
                            icon: PieChart,
                            title: "Tax Reports",
                            desc: "Generate FIRS-ready summaries of deductible expenses and estimated liabilities in one click.",
                        },
                        {
                            icon: FileText,
                            title: "Export Anywhere",
                            desc: "Download categorized data, tax summaries, and financial reports to CSV or PDF for your accountant.",
                        },
                        {
                            icon: BrainCircuit,
                            title: "AI-Powered Insights",
                            desc: "Conversational AI that understands your finances and surfaces actionable recommendations.",
                        },
                        {
                            icon: TrendingUp,
                            title: "Cash Flow Tracking",
                            desc: "Visualize income vs. expense streams over any date range to spot patterns and plan ahead.",
                        },
                        {
                            icon: CalendarClock,
                            title: "Recurring Bill Detection",
                            desc: "Spot subscriptions and repeat payments in your statement history before they catch you by surprise.",
                        },
                        {
                            icon: BellRing,
                            title: "Spending Alerts",
                            desc: "Set spending thresholds for categories or your overall budget and get a heads-up as you approach them.",
                        },
                        {
                            icon: Tags,
                            title: "Custom Merchant & Category Rules",
                            desc: "Create rules to consistently rename merchants and categorize transactions the way that works for you.",
                        },
                        {
                            icon: ArrowRightLeft,
                            title: "Transfer Detection",
                            desc: "Use transaction descriptions to recognize transfers, so moving money is not mistaken for income or spending.",
                        },
                    ].map((feat) => (
                        <div key={feat.title} className="rounded-xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5">
                            <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                                <feat.icon className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-foreground sm:mt-5">{feat.title}</h3>
                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{feat.desc}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ──────────────────────────────────────────────────── */}
            <section className="w-full border-t border-border px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-28">
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Ready to take control?</h2>
                <p className="mx-auto mb-7 max-w-md text-sm text-muted-foreground sm:mb-8 sm:text-base">
                    Join thousands of users who use Spendstack to track their money, understand their taxes, and save smarter.
                </p>
                <Link href="/dashboard">
                    <Button size="lg" className="h-11 px-8 text-sm font-semibold sm:h-12 sm:px-10">
                        Start for free
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-4">No credit card required.</p>
            </section>

        </div>
    )
}
