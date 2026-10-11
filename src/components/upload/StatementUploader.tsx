"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, FileText, Loader2, Sparkles, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { requestWithAuth } from "@/lib/fetcher"

type PreviewTransaction = {
    index: number
    date: string
    description: string
    merchant: string
    category: string
    is_transfer: boolean
    amount: string
}

type StatementPreview = {
    preview_id: number
    filename: string
    transactions: PreviewTransaction[]
    warnings: string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function StatementUploader() {
    const router = useRouter()
    const [isHovering, setIsHovering] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [summary, setSummary] = useState("")
    const [preview, setPreview] = useState<StatementPreview | null>(null)

    const chooseFile = (candidate?: File) => {
        if (!candidate) return
        if (!/\.(csv|pdf|xlsx|xls)$/i.test(candidate.name)) {
            setError("Choose a CSV, Excel, or PDF statement.")
            return
        }
        if (candidate.size > MAX_FILE_SIZE) {
            setError("Statement files must be 10 MB or smaller.")
            return
        }
        setFile(candidate)
        setPreview(null)
        setError(null)
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        setIsHovering(false)
        chooseFile(event.dataTransfer.files[0])
    }

    const handleProcess = async () => {
        if (!file) return
        setIsProcessing(true)
        setError(null)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const result = await requestWithAuth<StatementPreview>(`${API_URL}analysis/preview/`, {
                method: "POST",
                body: formData,
            })
            setPreview(result)
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Could not analyze the statement.")
        } finally {
            setIsProcessing(false)
        }
    }

    const confirmImport = async () => {
        if (!preview) return
        setIsProcessing(true)
        setError(null)
        try {
            const result = await requestWithAuth<{ message: string }>(
                `${API_URL}analysis/preview/${preview.preview_id}/confirm/`,
                { method: "POST", body: JSON.stringify({}) },
            )
            setSummary(result.message)
            setPreview(null)
            setIsComplete(true)
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Could not import the statement.")
        } finally {
            setIsProcessing(false)
        }
    }

    const cancelPreview = async () => {
        if (preview) {
            try {
                await requestWithAuth<void>(`${API_URL}analysis/preview/${preview.preview_id}/`, { method: "DELETE" })
            } catch {
                setError("Could not discard this preview. It will expire automatically in one hour.")
                return
            }
        }
        setPreview(null)
        setFile(null)
        setError(null)
    }

    if (isComplete) {
        return (
            <Card className="border-primary/30 bg-white">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                        <CheckCircle2 className="h-8 w-8 text-emerald-700" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-foreground">Import complete</h3>
                    <p className="mb-8 max-w-sm text-muted-foreground">{summary}</p>
                    <Button onClick={() => router.push("/dashboard")}>View dashboard</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden border-border bg-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                    <Upload className="h-5 w-5 text-primary" />
                    Upload bank statement
                </CardTitle>
                <CardDescription>
                    Review detected transactions before they are added to your account. CSV, Excel, and PDF files up to 10 MB are supported.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                {error && (
                    <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {!preview && (
                    <div
                        className={`flex min-h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition ${isHovering ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"} ${!file && !isProcessing ? "cursor-pointer" : ""}`}
                        onDragOver={event => { event.preventDefault(); setIsHovering(true) }}
                        onDragLeave={() => setIsHovering(false)}
                        onDrop={handleDrop}
                        onClick={() => !file && !isProcessing && document.getElementById("file-upload")?.click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".csv,.pdf,.xlsx,.xls"
                            onChange={event => chooseFile(event.target.files?.[0])}
                        />
                        {isProcessing ? (
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-sm font-medium text-foreground">Reading and categorizing transactions…</p>
                            </div>
                        ) : file ? (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <FileText className="h-10 w-10 text-primary" />
                                <div>
                                    <p className="font-medium text-foreground">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">Ready to review</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={event => { event.stopPropagation(); setFile(null); setError(null) }}>
                                        Choose another
                                    </Button>
                                    <Button onClick={event => { event.stopPropagation(); void handleProcess() }}>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Analyze statement
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="pointer-events-none flex flex-col items-center gap-4 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                    <Upload className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Click or drag a statement here</p>
                                    <p className="text-sm text-muted-foreground">CSV, Excel, or PDF · Maximum 10 MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {preview && (
                    <section aria-label="Transaction preview" className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h3 className="font-semibold text-foreground">Review {preview.filename}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {preview.transactions.length.toLocaleString()} transactions detected. Nothing is saved until you import.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => void cancelPreview()} disabled={isProcessing}>Discard</Button>
                                <Button onClick={() => void confirmImport()} disabled={isProcessing}>
                                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Import transactions
                                </Button>
                            </div>
                        </div>
                        {preview.warnings.length > 0 && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                                <p className="mb-1 font-medium">{preview.warnings.length} row(s) need attention</p>
                                <ul className="max-h-24 list-inside list-disc overflow-y-auto">
                                    {preview.warnings.slice(0, 20).map((warning, index) => <li key={`${index}-${warning}`}>{warning}</li>)}
                                </ul>
                                {preview.warnings.length > 20 && <p className="mt-1">Showing first 20 warnings.</p>}
                            </div>
                        )}
                        <div className="max-h-[28rem] overflow-auto rounded-xl border border-border">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="sticky top-0 bg-muted text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-3 py-2">Date</th>
                                        <th className="px-3 py-2">Description</th>
                                        <th className="px-3 py-2">Merchant</th>
                                        <th className="px-3 py-2">Category</th>
                                        <th className="px-3 py-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.transactions.map(transaction => (
                                        <tr key={transaction.index} className="border-t border-border">
                                            <td className="whitespace-nowrap px-3 py-2 text-foreground">{transaction.date}</td>
                                            <td className="max-w-64 truncate px-3 py-2 text-foreground" title={transaction.description}>{transaction.description}</td>
                                            <td className="px-3 py-2 text-foreground">{transaction.merchant}</td>
                                            <td className="px-3 py-2 text-foreground">
                                                {transaction.category}
                                                {transaction.is_transfer && <span className="ml-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-800">Transfer</span>}
                                            </td>
                                            <td className={`whitespace-nowrap px-3 py-2 text-right font-medium ${Number(transaction.amount) < 0 ? "text-red-700" : "text-emerald-700"}`}>
                                                {Number(transaction.amount) < 0 ? "−" : "+"}₦{Math.abs(Number(transaction.amount)).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </CardContent>
        </Card>
    )
}
