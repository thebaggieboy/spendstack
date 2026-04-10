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
} from "lucide-react"

export default function LandingPage() {
    return (
        <div className="flex-1 flex flex-col items-center min-h-[80vh] font-sans pt-16">

            {/* ─── Hero ─────────────────────────────────────────────────── */}
            <section className="w-full max-w-4xl mx-auto pt-24 pb-28 px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-medium text-muted-foreground mb-8">
                    <Sparkles className="h-3.5 w-3.5" />
                    The intelligent financial copilot for Africa
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground leading-[1.1]">
                    Master your money.<br />
                    <span className="text-primary">Effortlessly.</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                    Upload your bank statements, automate your tax calculations, and gain
                    deep insight into where every naira goes — all in one place.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/dashboard">
                        <Button size="lg" className="h-12 px-8 text-sm font-semibold w-full sm:w-auto">
                            Get Started Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="h-12 px-8 text-sm font-medium w-full sm:w-auto">
                        View Demo
                    </Button>
                </div>
            </section>

            {/* ─── Stats Bar ────────────────────────────────────────────── */}
            <section className="w-full border-y border-border bg-muted/10 py-10">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: "Bank Formats Supported", value: "20+" },
                        { label: "Transactions Processed", value: "1M+" },
                        { label: "Tax Reports Generated", value: "50K+" },
                        { label: "Average Time Saved", value: "4 hrs/mo" },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── Feature Deep-Dives ───────────────────────────────────── */}
            <section id="features" className="w-full max-w-5xl mx-auto py-28 px-6 space-y-32">

                {/* Tax Calculation Engine */}
                <div id="tax" className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted border border-border text-foreground">
                            <Calculator className="h-5 w-5" />
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight">Smart Tax Calculation Engine</h2>
                        <p className="text-muted-foreground text-base leading-relaxed">
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
                    <div className="bg-muted/20 border border-border rounded-2xl p-8 space-y-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Tax Summary Preview</p>
                        {[
                            { label: "Annual Gross Income", value: "₦4,800,000", color: "text-foreground" },
                            { label: "Total Deductions", value: "− ₦240,000", color: "text-emerald-400" },
                            { label: "Chargeable Income", value: "₦4,560,000", color: "text-foreground" },
                            { label: "Estimated Tax (PIT)", value: "₦799,500", color: "text-rose-400" },
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
                <div id="ai" className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* AI Chat Visual */}
                    <div className="order-2 md:order-1 bg-muted/20 border border-border rounded-2xl p-8 space-y-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">AI Advisor — Sample Conversation</p>
                        {[
                            { role: "user", text: "Where did most of my money go last month?" },
                            { role: "ai", text: "You spent ₦142,500 on food & dining — 31% of your total outflows. That's 18% above your 3-month average." },
                            { role: "user", text: "How can I reduce it?" },
                            { role: "ai", text: "Cutting dining to ₦90k/month would boost your savings rate from 12% to 24%. Want me to set a spending alert?" },
                        ].map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`flex-shrink-0 h-7 w-7 rounded-full border border-border flex items-center justify-center text-xs font-bold
                                    ${msg.role === "ai" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                                    {msg.role === "ai" ? "AI" : "U"}
                                </div>
                                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed
                                    ${msg.role === "ai"
                                        ? "bg-muted/40 border border-border text-foreground"
                                        : "bg-primary text-primary-foreground"
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="order-1 md:order-2 space-y-6">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted border border-border text-foreground">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight">AI Financial Advisor</h2>
                        <p className="text-muted-foreground text-base leading-relaxed">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted border border-border text-foreground">
                            <BrainCircuit className="h-5 w-5" />
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight">Zero-Touch Categorization</h2>
                        <p className="text-muted-foreground text-base leading-relaxed">
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
                    <div className="bg-muted/20 border border-border rounded-2xl p-8 space-y-3">
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
            <section className="w-full border-t border-border bg-muted/10 py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-semibold tracking-tight mb-3">How it works</h2>
                        <p className="text-muted-foreground max-w-md mx-auto text-sm">
                            From raw bank statement to rich financial intelligence in three simple steps.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                            <div key={s.step} className="relative pl-6 border-l border-border space-y-4">
                                <p className="text-xs font-mono text-muted-foreground">{s.step}</p>
                                <div className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center">
                                    <s.icon className="h-4 w-4 text-foreground" />
                                </div>
                                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Feature Grid ─────────────────────────────────────────── */}
            <section className="w-full border-t border-border py-20">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
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
                    ].map((feat) => (
                        <div key={feat.title} className="space-y-3">
                            <div className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center">
                                <feat.icon className="h-4 w-4 text-foreground" />
                            </div>
                            <h3 className="text-sm font-semibold text-foreground">{feat.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CTA ──────────────────────────────────────────────────── */}
            <section className="w-full border-t border-border py-28 px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">Ready to take control?</h2>
                <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto">
                    Join thousands of users who use Spendstack to track their money, understand their taxes, and save smarter.
                </p>
                <Link href="/dashboard">
                    <Button size="lg" className="h-12 px-10 text-sm font-semibold">
                        Start for free
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <p className="text-xs text-muted-foreground mt-4">No credit card required.</p>
            </section>

        </div>
    )
}
