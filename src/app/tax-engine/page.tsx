import Link from "next/link"
import {
    ArrowRight,
    BadgeCheck,
    Calculator,
    Check,
    FileText,
    Info,
    PiggyBank,
    Receipt,
    ShieldCheck,
    SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/Button"

const planningSteps = [
    {
        icon: FileText,
        title: "Start with your income",
        body: "Enter your gross income and choose whether you want to view the estimate annually or monthly.",
    },
    {
        icon: SlidersHorizontal,
        title: "Add eligible deductions",
        body: "Include the deductions relevant to your situation and see how they affect chargeable income.",
    },
    {
        icon: Receipt,
        title: "Review the breakdown",
        body: "See estimated PAYE, take-home after entered payroll contributions, and the progressive band calculations.",
    },
]

export default function TaxEnginePage() {
    return (
        <div className="landing-page flex w-full flex-1 flex-col items-center font-sans">
            <section className="w-full px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-10 lg:pb-20">
                <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                    <div>
                        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-primary sm:text-xs">
                            <Calculator className="h-3.5 w-3.5" />
                            NIGERIAN TAX PLANNING
                        </p>
                        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Understand your estimate, not just the number.
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Explore an illustrative PAYE estimate with a transparent breakdown of income, eligible deductions, and progressive tax bands. Adjust your inputs and see how the result changes.
                        </p>
                        <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
                            <Link href="/dashboard/tax">
                                <Button size="lg" className="h-11 w-full rounded-xl px-5 text-sm font-semibold min-[420px]:w-auto">
                                    Open tax calculator
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/signup" className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-medium text-foreground transition hover:bg-muted">
                                Create free account
                            </Link>
                        </div>
                        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            Planning estimate only—not tax, legal, or accounting advice. Confirm your circumstances and current rules with a qualified professional.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-5 rounded-[2rem] bg-primary/[0.05] blur-2xl" aria-hidden="true" />
                        <div className="relative rounded-3xl border border-border bg-white p-5 shadow-[0_24px_80px_-32px_rgba(35,25,70,0.22)] sm:p-7">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tax estimate preview</p>
                                    <h2 className="mt-2 text-lg font-semibold text-foreground">A breakdown you can inspect</h2>
                                </div>
                                <span className="rounded-xl bg-primary/10 p-2.5 text-primary">
                                    <PiggyBank className="h-5 w-5" />
                                </span>
                            </div>
                            <div className="mt-6 rounded-2xl bg-slate-50 p-4 sm:p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-xs text-muted-foreground">Chargeable income</p>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Illustrative</span>
                                </div>
                                <p className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">Income − deductions</p>
                                <div className="mt-5 space-y-3">
                                    {[
                                        ["Tax-free band", "0%"],
                                        ["Progressive bands", "Applied by band"],
                                        ["Effective rate", "Tax ÷ gross income"],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex items-center justify-between gap-3 border-t border-border pt-3 text-xs">
                                            <span className="text-muted-foreground">{label}</span>
                                            <span className="font-medium text-foreground">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-800">
                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                Review each entered deduction and assumption before relying on an estimate.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full border-y border-primary bg-primary px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/80 sm:text-xs">Designed for clarity</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">A useful tax estimate is easy to follow.</h2>
                        <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                            Spendstack shows the inputs and intermediate steps so you can check the estimate against your own records.
                        </p>
                    </div>
                    <div className="mt-7 grid gap-4 md:grid-cols-3">
                        {planningSteps.map(({ icon: Icon, title, body }, index) => (
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
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-primary sm:text-xs">What you can review</p>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Keep the assumptions in view.</h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {[
                                "Annual or monthly view",
                                "Income and chargeable income",
                                "Eligible deductions you enter",
                                "Tax per progressive band",
                                "Estimated PAYE and effective rate",
                                "Exportable estimate breakdown",
                            ].map((item) => (
                                <p key={item} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-5 sm:p-6">
                        <BadgeCheck className="h-6 w-6 text-primary" />
                        <h3 className="mt-4 text-base font-semibold text-foreground">Your records are the starting point.</h3>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            Use statement and transaction tracking to keep your financial picture organized, then enter the relevant figures in the calculator. It does not file a return or replace professional review.
                        </p>
                        <Link href="/dashboard/tax" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline">
                            Go to the tax calculator <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
