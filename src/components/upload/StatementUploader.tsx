"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function StatementUploader() {
    const router = useRouter()
    const [isHovering, setIsHovering] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [summary, setSummary] = useState<string>("")

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsHovering(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && (droppedFile.type === "text/csv" || droppedFile.type === "application/pdf")) {
            setFile(droppedFile)
            setError(null)
        }
    }

    const handleProcess = async () => {
        if (!file) return;

        setIsProcessing(true)
        setError(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const token = localStorage.getItem("accessToken");
            const headers: HeadersInit = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}analysis/upload/`, {
                method: 'POST',
                headers,
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to process statement")
            }

            setSummary(data.message || "Successfully processed your statement.")
            setIsProcessing(false)
            setIsComplete(true)
        } catch (err: any) {
            setError(err.message)
            setIsProcessing(false)
        }
    }

    if (isComplete) {
        return (
            <Card className="border-primary/50 bg-primary/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none" />
                <CardContent className="flex flex-col items-center justify-center py-12 text-center relative z-10">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gradient">Analysis Complete!</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm">
                        {summary}
                    </p>
                    <Button variant="gradient" onClick={() => {
                        setFile(null);
                        setIsComplete(false);
                        router.push('/dashboard')
                    }}>
                        View Dashboard
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Upload Bank Statement
                </CardTitle>
                <CardDescription>
                    Drag and drop your CSV or PDF bank statement. Our AI will automatically categorize your expenses.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${isHovering ? "border-primary bg-primary/5 scale-[1.02]" : "border-white/10 hover:border-white/20 hover:bg-white/5"} ${!file && !isProcessing ? "cursor-pointer" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                    onDragLeave={() => setIsHovering(false)}
                    onDrop={handleDrop}
                    onClick={() => !file && !isProcessing && document.getElementById("file-upload")?.click()}
                >
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".csv,.pdf"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setFile(e.target.files[0])
                                setError(null)
                            }
                        }}
                    />

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 absolute top-4 left-4 right-4 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {isProcessing ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                                <Sparkles className="h-5 w-5 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-medium text-white mb-1">AI Agent Running...</p>
                                <p className="text-sm text-muted-foreground">Categorizing your transactions intelligently</p>
                            </div>
                        </div>
                    ) : file ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-blue-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-medium text-white mb-1">{file.name}</p>
                                <p className="text-sm text-muted-foreground">Ready for AI analysis</p>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button variant="outline" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                                    Cancel
                                </Button>
                                <Button variant="gradient" onClick={(e) => { e.stopPropagation(); handleProcess(); }}>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Analyze with AI
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 pointer-events-none">
                            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-medium text-white mb-1">Click or drag file to this area</p>
                                <p className="text-sm text-muted-foreground">Supports CSV, PDF up to 10MB</p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
