"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Bot, FileText, Loader2, MessageCircle, Send, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { fetchWithAuth, requestWithAuth } from "@/lib/fetcher"

type Statement = {
    id: number
    filename: string
    transaction_count: number
}

type ChatMessage = {
    role: "user" | "assistant"
    content: string
}

type ChatResponse = {
    answer: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const suggestedQuestions = [
    "What were my biggest expenses?",
    "How much did I spend by category?",
    "Find recurring payments in my statements.",
]

export default function StatementChatPage() {
    const { data: statements, error: statementsError, isLoading: statementsLoading } =
        useSWR<Statement[]>(`${API_URL}analysis/statements/`, fetchWithAuth)
    const [selectedStatement, setSelectedStatement] = useState("")
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [question, setQuestion] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isSending])

    async function sendQuestion(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const trimmedQuestion = question.trim()
        if (!trimmedQuestion || isSending) return

        const previousMessages = messages
        const nextMessages: ChatMessage[] = [
            ...previousMessages,
            { role: "user", content: trimmedQuestion },
        ]
        setMessages(nextMessages)
        setQuestion("")
        setError("")
        setIsSending(true)

        try {
            const response = await requestWithAuth<ChatResponse>(`${API_URL}dashboard/chat/`, {
                method: "POST",
                body: JSON.stringify({
                    question: trimmedQuestion,
                    statement_id: selectedStatement || null,
                    history: previousMessages.slice(-8),
                }),
            })
            setMessages([...nextMessages, { role: "assistant", content: response.answer }])
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Could not get a response. Please try again."
            )
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6">
            <div>
                <div className="mb-2 flex items-center gap-2 text-primary">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">Spendstack AI</span>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Chat with your statements
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Ask questions about your transactions, spending, merchants, categories, and transfers.
                </p>
            </div>

            <Card className="flex min-h-[65vh] flex-1 flex-col overflow-hidden">
                <CardHeader className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Your bank statement data</CardTitle>
                            <CardDescription>Select which records Spendstack AI can use.</CardDescription>
                        </div>
                    </div>
                    <label className="w-full sm:w-72">
                        <span className="sr-only">Choose statements</span>
                        <select
                            value={selectedStatement}
                            onChange={event => setSelectedStatement(event.target.value)}
                            disabled={statementsLoading || Boolean(statementsError)}
                            className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                        >
                            <option value="">All my statements</option>
                            {statements?.map(statement => (
                                <option key={statement.id} value={statement.id}>
                                    {statement.filename} ({statement.transaction_count} transactions)
                                </option>
                            ))}
                        </select>
                    </label>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col p-0">
                    <div
                        className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6"
                        aria-live="polite"
                        aria-label="Chat messages"
                    >
                        {messages.length === 0 ? (
                            <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Bot className="h-7 w-7" />
                                </div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Get answers from your own records
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Try a question below, or ask your own. Transfers are kept separate from income and spending totals.
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    {suggestedQuestions.map(suggestion => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => setQuestion(suggestion)}
                                            className="rounded-full border border-border bg-white px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                                {!statementsLoading && statements?.length === 0 && (
                                    <p className="mt-6 text-sm text-muted-foreground">
                                        No statements uploaded yet.{" "}
                                        <Link href="/upload" className="font-medium text-primary hover:underline">
                                            Upload a statement
                                        </Link>{" "}
                                        to start chatting.
                                    </p>
                                )}
                                {statementsError && (
                                    <p role="alert" className="mt-6 text-sm text-red-700">
                                        Could not load your statements. Refresh the page and try again.
                                    </p>
                                )}
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={`${message.role}-${index}`}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                            message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "border border-border bg-muted/60 text-foreground"
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                    {message.role === "user" && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                            <User className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        {isSending && (
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Bot className="h-4 w-4" />
                                </div>
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Checking your statement data…
                                </span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-border p-4 sm:p-6">
                        {error && (
                            <p role="alert" className="mb-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}
                        <form onSubmit={sendQuestion} className="flex items-end gap-2">
                            <label className="sr-only" htmlFor="statement-question">
                                Ask a question about your statements
                            </label>
                            <textarea
                                id="statement-question"
                                value={question}
                                onChange={event => setQuestion(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === "Enter" && !event.shiftKey) {
                                        event.preventDefault()
                                        event.currentTarget.form?.requestSubmit()
                                    }
                                }}
                                maxLength={2000}
                                rows={2}
                                placeholder="Ask something about your transactions…"
                                className="max-h-36 min-h-12 flex-1 resize-y rounded-xl border border-input bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <button
                                type="submit"
                                disabled={!question.trim() || isSending}
                                aria-label="Send question"
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </button>
                        </form>
                        <p className="mt-3 text-center text-xs text-muted-foreground">
                            AI responses can be inaccurate. Check important financial decisions against your statement.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
