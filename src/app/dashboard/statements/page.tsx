"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { FileText, Calendar, ArrowRight, Loader2, Upload } from "lucide-react"
import useSWR from "swr"
import { fetchWithAuth as fetcher } from '@/lib/fetcher';
import Link from "next/link";

export default function StatementsPage() {
    const { data: statements, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}analysis/statements/`, fetcher)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Bank Statements</h1>
                    <p className="text-muted-foreground mt-1">View your uploaded financial documents.</p>
                </div>
                <Link
                    href="/upload"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20"
                >
                    <Upload className="h-4 w-4" />
                    Upload New
                </Link>
            </div>

            <Card className="bg-card/30 backdrop-blur-sm border-white/5">
                <CardHeader>
                    <CardTitle>Document History</CardTitle>
                    <CardDescription>All your previously uploaded statements</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-400">
                            Failed to load statements. Please try again.
                        </div>
                    ) : !statements || statements.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center border border-white/5 rounded-2xl bg-white/5">
                            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <FileText className="h-8 w-8 text-indigo-400 opacity-50" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No Statements Found</h3>
                            <p className="text-muted-foreground max-w-sm mb-6">
                                Upload your first bank statement to unlock powerful AI insights and expense tracking.
                            </p>
                            <Link
                                href="/upload"
                                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
                            >
                                Upload Statement
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {statements.map((stmt: any) => (
                                <Link key={stmt.id} href={`/dashboard/statements/${stmt.id}`}>
                                    <div className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all hover:scale-[1.02] cursor-pointer">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0" />
                                        </div>

                                        <h3 className="font-semibold text-white mb-1 truncate" title={stmt.filename}>
                                            {stmt.filename}
                                        </h3>

                                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                                            <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                                            {stmt.upload_date}
                                        </div>

                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">Extracted Data</span>
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                                                {stmt.transaction_count} txns
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
