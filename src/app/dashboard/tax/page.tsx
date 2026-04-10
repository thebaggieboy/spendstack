"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Calculator, TrendingDown, Wallet, Percent, Info, ChevronDown, ChevronUp } from "lucide-react"
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, TooltipProps
} from "recharts"

// ============================================================
// Nigeria Tax Act 2025 — Effective January 1, 2026
// Source: Nigeria Tax Act 2025 (NTA 2025), signed June 26, 2025
// ============================================================
const TAX_BANDS = [
    { label: "First ₦800,000", min: 0, max: 800_000, rate: 0, color: "#22c55e" },
    { label: "₦800k – ₦3M", min: 800_000, max: 3_000_000, rate: 0.15, color: "#3b82f6" },
    { label: "₦3M – ₦12M", min: 3_000_000, max: 12_000_000, rate: 0.18, color: "#8b5cf6" },
    { label: "₦12M – ₦25M", min: 12_000_000, max: 25_000_000, rate: 0.21, color: "#f59e0b" },
    { label: "₦25M – ₦50M", min: 25_000_000, max: 50_000_000, rate: 0.23, color: "#f97316" },
    { label: "Above ₦50M", min: 50_000_000, max: Infinity, rate: 0.25, color: "#ef4444" },
]

function formatNaira(n: number) {
    if (Math.abs(n) >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`
    if (Math.abs(n) >= 1_000) return `₦${(n / 1_000).toFixed(0)}k`
    return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function formatFull(n: number) {
    return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface TaxBreakdown {
    chargeableIncome: number
    totalTax: number
    netIncome: number
    effectiveRate: number
    bands: { label: string; taxable: number; tax: number; rate: number; color: string }[]
    pensionDeduction: number
    nhfDeduction: number
    rentRelief: number
    totalDeductions: number
}

function calculateTax(
    grossIncome: number,
    annualRent: number,
    includePension: boolean,
    includeNhf: boolean,
    includeRentRelief: boolean
): TaxBreakdown {
    // Allowable deductions (NTA 2025)
    const pensionDeduction = includePension ? grossIncome * 0.08 : 0
    const nhfDeduction = includeNhf ? grossIncome * 0.025 : 0
    // Rent relief: 20% of annual rent, capped at ₦500,000
    const rentRelief = includeRentRelief ? Math.min(annualRent * 0.20, 500_000) : 0

    const totalDeductions = pensionDeduction + nhfDeduction + rentRelief
    const chargeableIncome = Math.max(0, grossIncome - totalDeductions)

    // Apply progressive bands
    const bands = TAX_BANDS.map(band => {
        const taxableInBand = Math.max(0, Math.min(chargeableIncome, band.max) - band.min)
        return {
            label: band.label,
            taxable: taxableInBand,
            tax: taxableInBand * band.rate,
            rate: band.rate,
            color: band.color,
        }
    })

    const totalTax = bands.reduce((sum, b) => sum + b.tax, 0)
    const netIncome = grossIncome - totalTax - totalDeductions
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0

    return { chargeableIncome, totalTax, netIncome, effectiveRate, bands, pensionDeduction, nhfDeduction, rentRelief, totalDeductions }
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1a1a2e] border border-white/20 rounded-xl p-3 text-sm shadow-xl">
                <p className="font-semibold text-white mb-1">{label || payload[0]?.name}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ color: p.color || p.fill }}>{p.name}: {formatFull(p.value)}</p>
                ))}
            </div>
        )
    }
    return null
}

export default function TaxPage() {
    const [grossIncome, setGrossIncome] = useState(5_000_000)
    const [annualRent, setAnnualRent] = useState(1_200_000)
    const [includePension, setIncludePension] = useState(true)
    const [includeNhf, setIncludeNhf] = useState(false)
    const [includeRentRelief, setIncludeRentRelief] = useState(false)
    const [view, setView] = useState<"annual" | "monthly">("annual")
    const [showInfo, setShowInfo] = useState(false)

    const result = useMemo(
        () => calculateTax(grossIncome, annualRent, includePension, includeNhf, includeRentRelief),
        [grossIncome, annualRent, includePension, includeNhf, includeRentRelief]
    )

    const divisor = view === "monthly" ? 12 : 1
    const pieData = [
        { name: "Net Take-Home", value: result.netIncome / divisor, fill: "#22c55e" },
        { name: "Total Tax (PAYE)", value: result.totalTax / divisor, fill: "#ef4444" },
        { name: "Deductions", value: result.totalDeductions / divisor, fill: "#f59e0b" },
    ].filter(d => d.value > 0)

    const barData = result.bands
        .filter(b => b.tax > 0)
        .map(b => ({ name: b.label, "Tax Paid": b.tax / divisor, fill: b.color }))

    const summaryCards = [
        { label: "Total PAYE Tax", value: formatFull(result.totalTax / divisor), sub: view === "monthly" ? "per month" : "per year", color: "from-red-500/20 to-rose-500/20", border: "border-red-500/20", icon: TrendingDown, iconColor: "text-red-400" },
        { label: "Net Take-Home", value: formatFull(result.netIncome / divisor), sub: view === "monthly" ? "per month" : "per year", color: "from-emerald-500/20 to-green-500/20", border: "border-emerald-500/20", icon: Wallet, iconColor: "text-emerald-400" },
        { label: "Effective Tax Rate", value: `${result.effectiveRate.toFixed(2)}%`, sub: "of gross income", color: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/20", icon: Percent, iconColor: "text-purple-400" },
        { label: "Chargeable Income", value: formatFull(result.chargeableIncome / divisor), sub: "after deductions", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20", icon: Calculator, iconColor: "text-blue-400" },
    ]

    return (
        <div className="flex-1 space-y-6 p-6 overflow-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-primary/20 text-primary"><Calculator className="h-6 w-6" /></span>
                        Tax Calculator
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Based on the <span className="text-primary font-semibold">Nigeria Tax Act 2025</span> — effective January 1, 2026
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                    <button onClick={() => setView("annual")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === "annual" ? "bg-primary text-white" : "text-zinc-400 hover:text-white"}`}>Annual</button>
                    <button onClick={() => setView("monthly")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === "monthly" ? "bg-primary text-white" : "text-zinc-400 hover:text-white"}`}>Monthly</button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <button onClick={() => setShowInfo(!showInfo)} className="flex justify-between items-center w-full text-left">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Info className="h-4 w-4" />
                        Nigeria Tax Act 2025 — Key Changes (effective Jan 1, 2026)
                    </div>
                    {showInfo ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
                </button>
                {showInfo && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-300">
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="font-semibold text-white mb-1">CRA Abolished</p>
                            <p>The Consolidated Relief Allowance (₦200k + 1% of gross) has been completely removed under the new Act.</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="font-semibold text-white mb-1">New Rent Relief</p>
                            <p>Employees who pay rent can deduct 20% of annual rent, capped at ₦500,000. Homeowners are not eligible.</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="font-semibold text-white mb-1">Top Rate Raised</p>
                            <p>The maximum PAYE rate increases from 24% to 25% for incomes above ₦50,000,000 per year.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Inputs */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Income Details</CardTitle>
                            <CardDescription>Enter your annual gross income</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div>
                                <label className="text-sm font-medium text-zinc-300 mb-2 block">Annual Gross Income</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">₦</span>
                                    <input
                                        type="number"
                                        value={grossIncome}
                                        onChange={e => setGrossIncome(Math.max(0, Number(e.target.value)))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <input
                                    type="range"
                                    min={0} max={100_000_000} step={100_000}
                                    value={grossIncome}
                                    onChange={e => setGrossIncome(Number(e.target.value))}
                                    className="w-full mt-3 accent-primary"
                                />
                                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                                    <span>₦0</span><span>₦100M</span>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div className="space-y-3 pt-2 border-t border-white/10">
                                <p className="text-sm font-medium text-zinc-300">Allowable Deductions</p>

                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div>
                                        <p className="text-sm text-white group-hover:text-primary transition-colors">Pension (8% of gross)</p>
                                        <p className="text-xs text-zinc-500">Mandatory: ₦{(grossIncome * 0.08).toLocaleString()}</p>
                                    </div>
                                    <div onClick={() => setIncludePension(!includePension)} className={`relative w-11 h-6 rounded-full transition-colors ${includePension ? "bg-primary" : "bg-white/10"}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${includePension ? "left-6" : "left-1"}`} />
                                    </div>
                                </label>

                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div>
                                        <p className="text-sm text-white group-hover:text-primary transition-colors">NHF (2.5% of gross)</p>
                                        <p className="text-xs text-zinc-500">National Housing Fund: ₦{(grossIncome * 0.025).toLocaleString()}</p>
                                    </div>
                                    <div onClick={() => setIncludeNhf(!includeNhf)} className={`relative w-11 h-6 rounded-full transition-colors ${includeNhf ? "bg-primary" : "bg-white/10"}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${includeNhf ? "left-6" : "left-1"}`} />
                                    </div>
                                </label>

                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div>
                                        <p className="text-sm text-white group-hover:text-primary transition-colors">Rent Relief (20%, max ₦500k)</p>
                                        <p className="text-xs text-zinc-500">For rent-paying employees</p>
                                    </div>
                                    <div onClick={() => setIncludeRentRelief(!includeRentRelief)} className={`relative w-11 h-6 rounded-full transition-colors ${includeRentRelief ? "bg-primary" : "bg-white/10"}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${includeRentRelief ? "left-6" : "left-1"}`} />
                                    </div>
                                </label>

                                {includeRentRelief && (
                                    <div className="pl-0 pt-1">
                                        <label className="text-xs font-medium text-zinc-400 mb-1 block">Annual Rent Paid</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₦</span>
                                            <input
                                                type="number"
                                                value={annualRent}
                                                onChange={e => setAnnualRent(Math.max(0, Number(e.target.value)))}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                                            />
                                        </div>
                                        <p className="text-xs text-primary mt-1">Relief granted: {formatFull(Math.min(annualRent * 0.20, 500_000))}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {summaryCards.map(c => (
                            <Card key={c.label} className={`bg-gradient-to-br ${c.color} ${c.border} border`}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs text-zinc-400">{c.label}</p>
                                        <c.icon className={`h-4 w-4 ${c.iconColor}`} />
                                    </div>
                                    <p className="text-lg font-bold text-white">{c.value}</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">{c.sub}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Income Split</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                                            {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Tax by Bracket</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={barData} margin={{ left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#71717a" }} />
                                        <YAxis tickFormatter={v => formatNaira(v)} tick={{ fontSize: 9, fill: "#71717a" }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="Tax Paid" radius={[4, 4, 0, 0]}>
                                            {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Detailed Tax Breakdown</CardTitle>
                    <CardDescription>Tax calculation per band — Nigeria Tax Act 2025</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
                                    <th className="text-left py-3 pr-4">Tax Band</th>
                                    <th className="text-right py-3 pr-4">Rate</th>
                                    <th className="text-right py-3 pr-4">Taxable Amount ({view})</th>
                                    <th className="text-right py-3">Tax Payable ({view})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.bands.map((band, i) => (
                                    <tr key={i} className={`border-b border-white/5 ${band.taxable > 0 ? "" : "opacity-30"}`}>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: band.color }} />
                                                <span className="text-white">{band.label}</span>
                                            </div>
                                        </td>
                                        <td className="text-right py-3 pr-4 font-mono font-semibold text-zinc-300">{(band.rate * 100).toFixed(0)}%</td>
                                        <td className="text-right py-3 pr-4 text-zinc-300 font-mono">{formatFull(band.taxable / divisor)}</td>
                                        <td className="text-right py-3 font-mono font-semibold" style={{ color: band.tax > 0 ? band.color : "#71717a" }}>{formatFull(band.tax / divisor)}</td>
                                    </tr>
                                ))}
                                {result.totalDeductions > 0 && (
                                    <tr className="border-b border-white/5 text-xs text-zinc-500">
                                        <td colSpan={3} className="py-2 pr-4 italic">Total Deductions (Pension + NHF + Rent Relief)</td>
                                        <td className="text-right py-2 font-mono text-yellow-400">{formatFull(result.totalDeductions / divisor)}</td>
                                    </tr>
                                )}
                                <tr className="bg-white/5 font-bold">
                                    <td className="py-3 pr-4 text-white" colSpan={2}>Total PAYE Tax</td>
                                    <td className="text-right py-3 pr-4 text-white font-mono">{formatFull(result.chargeableIncome / divisor)}</td>
                                    <td className="text-right py-3 text-red-400 font-mono">{formatFull(result.totalTax / divisor)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-zinc-600 mt-4">
                        * Calculations based on the Nigeria Tax Act 2025 (NTA 2025), effective January 1, 2026. This is an estimate and does not constitute professional tax advice.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
