import StatementUploader from "@/components/upload/StatementUploader"

export default function UploadPage() {
    return (
        <div className="flex-1 space-y-6 pt-4 max-w-4xl mx-auto w-full">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Upload Statement</h2>
                <p className="text-muted-foreground mt-2">
                    Securely upload your bank statements. Our AI engine will automatically parse, categorize, and analyze your financial data to provide immediate insights.
                </p>
            </div>

            <div className="mt-8">
                <StatementUploader />
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                <div className="p-6 rounded-2xl bg-card border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">1</div>
                    <h4 className="font-semibold text-white mb-2">Upload</h4>
                    <p className="text-sm text-muted-foreground">Drag and drop your PDF or CSV bank statement directly into the upload zone.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">2</div>
                    <h4 className="font-semibold text-white mb-2">AI Analysis</h4>
                    <p className="text-sm text-muted-foreground">Our intelligent engine securely reads your transactions and categorizes them automatically.</p>
                </div>
                <div className="p-6 rounded-2xl bg-card border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold">3</div>
                    <h4 className="font-semibold text-white mb-2">Insights</h4>
                    <p className="text-sm text-muted-foreground">Instantly view visualizations, top merchants, and personalized advice on your dashboard.</p>
                </div>
            </div>
        </div>
    )
}
