import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowRight, BarChart3, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="flex-1 flex flex-col pt-12 text-center items-center justify-center min-h-[80vh] px-4">

            {/* Hero Section */}
            <div className="relative w-full max-w-4xl mx-auto z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-8 animate-fade-in">
                    <Sparkles className="h-4 w-4" />
                    <span>The intelligent financial copilot for Africa.</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                    Master your money with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary/80 bg-300% animate-gradient">
                        Spendstack AI
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                    Upload any bank statement. Our intelligent engine instantly categorizes transactions, visualizes spending, and generates personalized advice to help you save more.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="gradient" size="lg" className="h-14 px-8 text-base shadow-2xl shadow-primary/20">
                            Open Dashboard
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="h-14 px-8 text-base">
                        View Live Demo
                    </Button>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mt-32 text-left z-10">

                <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-colors group">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">AI Categorization</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Stop sorting spreadsheets manually. Our engine understands NIP transfers, USSD, and POS transactions across all major Nigerian banks flawlessly.
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-purple-500/30 transition-colors group">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                        <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Beautiful Analytics</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        See exactly where your money goes. From granular category breakdowns to historical cash flow charts, visualize your net worth effortlessly.
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-card border border-white/5 hover:border-emerald-500/30 transition-colors group">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Secure & Private</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        We don't need your bank login. Simply upload your encrypted statements for instant, secure analysis. Your financial data never leaves the system.
                    </p>
                </div>

            </div>

        </div>
    )
}
