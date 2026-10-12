import StatementUploader from "@/components/upload/StatementUploader"

export default function UploadPage() {
    return (
        <div className="mx-auto w-full max-w-4xl space-y-7 px-4 py-4 sm:px-0 sm:py-2">
            <header className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Upload Statement</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Securely upload a CSV, Excel, or searchable PDF statement. Transactions are read and categorized locally, then shown for your review before import.
                </p>
            </header>

            <section aria-label="Statement upload" className="w-full">
                <StatementUploader />
            </section>

            <section aria-label="How statement import works" className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">1</div>
                    <h3 className="mb-1 font-semibold text-foreground">Upload</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">Choose a CSV, Excel, or searchable PDF bank statement.</p>
                </article>
                <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">2</div>
                    <h3 className="mb-1 font-semibold text-foreground">Review</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">Check the locally parsed transactions and resolve any rows that need attention.</p>
                </article>
                <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">3</div>
                    <h3 className="mb-1 font-semibold text-foreground">Import</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">Confirm the preview to add transactions to your dashboard.</p>
                </article>
            </section>
        </div>
    )
}
