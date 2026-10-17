"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import useSWR from "swr"
import { AlertCircle, ArrowDownToLine, ArrowUpRight, CalendarClock, CheckCircle2, Loader2, LockKeyhole, Plus, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { fetchWithAuth, requestWithAuth } from "@/lib/fetcher"
import { formatNaira } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const savingsUrl = `${API_URL}savings/`

type WalletData = {
    available_balance: string
    locked_balance: string
    total_balance: string
    currency: string
}

type Bank = { name: string; code: string }
type BankAccount = {
    id: string
    bank_name: string
    account_name: string
    account_last4: string
    is_default: boolean
    payout_provider: "paystack" | "bachs"
    is_usable: boolean
}
type Lock = {
    id: string
    amount: string
    lock_date: string
    unlock_date: string
    interval_days: number
    status: string
    description: string
    payout_provider: "paystack" | "bachs"
    bank_account: {
        bank_name: string
        account_name: string
        account_last4: string
        payout_provider: "paystack" | "bachs"
    }
    schedule: {
        id: string
        payout_amount: string
        remaining_amount: string
        scheduled_date: string
        status: string
        auto_payout: boolean
        recurrence: "daily" | "weekly" | "monthly" | null
        recurrence_day: number | null
        occurrence_count: number
        occurrences_completed: number
        timezone_name: string
    }
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function dateLabel(value: string) {
    return new Date(value).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
}

function minorUnits(value: string) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0
}

export default function LockMoneyPage() {
    const { data: wallet, error: walletError, mutate: refreshWallet } = useSWR<WalletData>(`${savingsUrl}wallet/`, fetchWithAuth)
    const [bankPayoutProvider, setBankPayoutProvider] = useState<"paystack" | "bachs">("paystack")
    const { data: banks, error: banksError } = useSWR<Bank[]>(
        `${savingsUrl}bank-directory/?provider=${bankPayoutProvider}`,
        fetchWithAuth,
    )
    const { data: bankAccounts, error: accountsError, mutate: refreshAccounts } = useSWR<BankAccount[]>(`${savingsUrl}bank-accounts/`, fetchWithAuth)
    const { data: locks, error: locksError, mutate: refreshLocks } = useSWR<Lock[]>(`${savingsUrl}locks/`, fetchWithAuth)

    const [fundAmount, setFundAmount] = useState("")
    const [amount, setAmount] = useState("")
    const [intervalDays, setIntervalDays] = useState("30")
    const [recurrence, setRecurrence] = useState<"" | "daily" | "weekly" | "monthly">("")
    const [occurrenceCount, setOccurrenceCount] = useState("4")
    const [payoutAmount, setPayoutAmount] = useState("")
    const [recurrenceDay, setRecurrenceDay] = useState("4")
    const [description, setDescription] = useState("")
    const [selectedAccount, setSelectedAccount] = useState("")
    const [autoPayout, setAutoPayout] = useState(true)
    const [bankCode, setBankCode] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [notice, setNotice] = useState("")
    const [error, setError] = useState("")
    const [working, setWorking] = useState("")
    const [pendingFundingReference, setPendingFundingReference] = useState("")
    const [pendingFundingGateway, setPendingFundingGateway] = useState<"paystack" | "bachs">("paystack")
    const [fundingGateway, setFundingGateway] = useState<"paystack" | "bachs">("paystack")
    const count = Number(occurrenceCount)
    const totalMinorUnits = minorUnits(amount)
    const suggestedPayoutAmount =
        recurrence && Number.isInteger(count) && count > 1 && totalMinorUnits % count === 0
            ? (totalMinorUnits / count / 100).toFixed(2)
            : ""
    const effectivePayoutAmount = payoutAmount || suggestedPayoutAmount
    const payoutTotalMatches =
        !recurrence ||
        (Number.isInteger(count) &&
            count >= 2 &&
            count <= 520 &&
            minorUnits(effectivePayoutAmount) * count === totalMinorUnits)

    const verifyFunding = useCallback(async (reference: string) => {
        setWorking("verify")
        setError("")
        setNotice("")
        try {
            const result = await requestWithAuth<{ message: string }>(
                `${savingsUrl}fund/verify/?reference=${encodeURIComponent(reference)}`,
            )
            setNotice(result.message)
            setPendingFundingReference("")
            window.history.replaceState({}, "", "/dashboard/lock-money")
            await refreshWallet()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not verify your payment.")
        } finally {
            setWorking("")
        }
    }, [refreshWallet])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const funding = params.get("funding")
        if (funding === "bachs-cancel") {
            setNotice("Bachs checkout was cancelled. Your wallet was not funded.")
            window.history.replaceState({}, "", "/dashboard/lock-money")
            return
        }
        if (funding === "bachs-return") {
            const reference = params.get("reference")
            if (!reference) {
                setError("The Bachs return did not include a payment reference. Check your wallet before trying again.")
                return
            }
            setPendingFundingReference(reference)
            setPendingFundingGateway("bachs")
            setNotice("Payment submitted. Waiting for Bachs to confirm it securely…")
            return
        }
        if (funding !== "return") return
        const reference = params.get("reference") || params.get("trxref")
        if (!reference) {
            setError("The payment return did not include a reference. Contact support before trying to pay again.")
            return
        }
        setPendingFundingReference(reference)
        void verifyFunding(reference)
    }, [refreshWallet, verifyFunding])

    useEffect(() => {
        if (!pendingFundingReference || pendingFundingGateway !== "bachs") return
        let active = true
        let attempts = 0
        let lastStatusError = ""
        let timeout: ReturnType<typeof setTimeout>

        const checkStatus = async () => {
            if (!active) return
            attempts += 1
            try {
                const result = await requestWithAuth<{ status: string; amount: string }>(
                    `${savingsUrl}fund/bachs/status/?reference=${encodeURIComponent(pendingFundingReference)}`,
                )
                if (!active) return
                lastStatusError = ""
                if (result.status === "completed") {
                    setNotice(`Your ${formatNaira(Number(result.amount))} wallet funding was confirmed by Bachs.`)
                    setPendingFundingReference("")
                    window.history.replaceState({}, "", "/dashboard/lock-money")
                    try {
                        await refreshWallet()
                    } catch {
                        setError("Bachs confirmed the payment, but your wallet balance could not be refreshed. Reload the page to see the updated balance.")
                    }
                    return
                }
                if (result.status === "failed") {
                    setError("Bachs could not verify this payment. Your wallet was not credited; contact support before retrying if you were charged.")
                    setPendingFundingReference("")
                    window.history.replaceState({}, "", "/dashboard/lock-money")
                    return
                }
            } catch (err) {
                lastStatusError = err instanceof Error ? err.message : "Unable to reach the payment status service."
            }

            if (attempts >= 24) {
                if (lastStatusError) {
                    setError(`Could not check the Bachs payment status: ${lastStatusError} Your wallet is only credited after server confirmation; contact support if you were charged.`)
                } else {
                    setNotice("Your payment is still awaiting Bachs confirmation. Your wallet will update automatically once the signed payment notice arrives.")
                }
                setPendingFundingReference("")
                window.history.replaceState({}, "", "/dashboard/lock-money")
                return
            }
            timeout = setTimeout(() => void checkStatus(), 5000)
        }

        void checkStatus()
        return () => {
            active = false
            clearTimeout(timeout)
        }
    }, [pendingFundingGateway, pendingFundingReference, refreshWallet])

    async function startFunding(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setNotice("")
        setPendingFundingReference("")
        setWorking("fund")
        try {
            const result = await requestWithAuth<{ authorization_url: string; gateway: "paystack" | "bachs" }>(`${savingsUrl}fund/initialize/`, {
                method: "POST",
                body: JSON.stringify({ amount: fundAmount, gateway: fundingGateway }),
            })
            const expectedHost = result.gateway === "bachs" ? "checkout.bachs.io" : "checkout.paystack.com"
            if (
                !result.authorization_url ||
                new URL(result.authorization_url).hostname !== expectedHost ||
                !result.authorization_url.startsWith("https://")
            ) {
                throw new Error(`${result.gateway === "bachs" ? "Bachs" : "Paystack"} did not return a valid secure checkout link.`)
            }
            window.location.assign(result.authorization_url)
        } catch (err) {
            setError(err instanceof Error ? err.message : `Could not start ${fundingGateway} checkout.`)
            setWorking("")
        }
    }

    async function addBankAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setNotice("")
        const bank = banks?.find(item => item.code === bankCode)
        if (!bank) {
            setError("Select a bank from the list.")
            return
        }
        setWorking("bank")
        try {
            const account = await requestWithAuth<BankAccount>(`${savingsUrl}bank-accounts/`, {
                method: "POST",
                body: JSON.stringify({
                    account_number: accountNumber,
                    bank_code: bank.code,
                    bank_name: bank.name,
                    payout_provider: bankPayoutProvider,
                }),
            })
            setAccountNumber("")
            setBankCode("")
            if (account.is_usable) setSelectedAccount(account.id)
            setNotice(
                account.is_usable
                    ? `Bank account verified and saved for ${account.payout_provider === "bachs" ? "Bachs" : "Paystack"} payouts.`
                    : "Bachs saved this destination for review. You can use it for a lock after it is approved.",
            )
            await refreshAccounts()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not verify that bank account.")
        } finally {
            setWorking("")
        }
    }

    async function createLock(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        setNotice("")
        if (!payoutTotalMatches) {
            setError("The locked amount must exactly equal the payout amount multiplied by the number of payouts.")
            return
        }
        setWorking("lock")
        try {
            await requestWithAuth<Lock>(`${savingsUrl}locks/`, {
                method: "POST",
                body: JSON.stringify({
                    amount,
                    interval_days: intervalDays,
                    payout_amount: recurrence ? effectivePayoutAmount : amount,
                    recurrence: recurrence || null,
                    occurrence_count: recurrence ? count : 1,
                    recurrence_day: recurrence === "weekly" || recurrence === "monthly"
                        ? Number(recurrenceDay)
                        : null,
                    timezone_name: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
                    description,
                    bank_account_id: selectedAccount,
                    auto_payout: autoPayout,
                }),
            })
            setAmount("")
            setDescription("")
            setPayoutAmount("")
            setRecurrence("")
            setNotice(
                recurrence
                    ? `Funds locked. ${count} payouts of ${formatNaira(Number(effectivePayoutAmount))} are scheduled through ${selectedBank?.payout_provider === "bachs" ? "Bachs" : "Paystack"}.`
                    : `Funds locked. Your full payout is scheduled through ${selectedBank?.payout_provider === "bachs" ? "Bachs" : "Paystack"} for the maturity date.`,
            )
            await Promise.all([refreshWallet(), refreshLocks()])
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not create this money lock.")
        } finally {
            setWorking("")
        }
    }

    async function submitPayout(lock: Lock) {
        setError("")
        setNotice("")
        setWorking(`payout-${lock.schedule.id}`)
        try {
            const result = await requestWithAuth<{ message: string }>(
                `${savingsUrl}schedules/${lock.schedule.id}/payout/`,
                { method: "POST" },
            )
            setNotice(result.message)
            await Promise.all([refreshWallet(), refreshLocks()])
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not submit this scheduled payout.")
        } finally {
            setWorking("")
        }
    }

    const selectedBank = bankAccounts?.find(account => account.id === selectedAccount)

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <header>
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <LockKeyhole className="h-4 w-4 text-black" /> Savings tools
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">Lock money</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    Set money aside for a fixed period and schedule the full amount to a verified bank account at maturity. No interest or investment return is included.
                </p>
            </header>

            {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0 text-black" />{notice}</div>}
            {error && <div role="alert" className="flex flex-wrap items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="h-4 w-4 shrink-0 text-black" /><span className="min-w-0 flex-1">{error}</span>{pendingFundingReference && working !== "verify" && <button type="button" onClick={() => void verifyFunding(pendingFundingReference)} className="rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-800 hover:bg-red-100">Retry verification</button>}</div>}

            <section className="grid gap-4 sm:grid-cols-3" aria-label="Wallet balances">
                {[
                    { title: "Available", value: wallet?.available_balance, icon: Wallet, tone: "bg-primary/10 text-primary" },
                    { title: "Locked", value: wallet?.locked_balance, icon: LockKeyhole, tone: "bg-muted text-black" },
                    { title: "Total wallet", value: wallet?.total_balance, icon: ArrowUpRight, tone: "bg-muted text-black" },
                ].map(item => (
                    <Card key={item.title}><CardContent className="flex items-center gap-3 p-5">
                        <span className={`rounded-xl p-3 ${item.tone}`}><item.icon className="h-5 w-5 text-black" /></span>
                        <div><p className="text-xs text-muted-foreground">{item.title}</p><p className="mt-1 text-xl font-semibold text-foreground">{item.value ? formatNaira(Number(item.value)) : walletError ? "Unavailable" : "—"}</p></div>
                    </CardContent></Card>
                ))}
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ArrowDownToLine className="h-5 w-5 text-black" />Add funds</CardTitle>
                        <CardDescription>Choose a payment gateway. Funds appear in your wallet only after the gateway confirms payment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={startFunding} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                            <label className="space-y-1 text-xs font-medium text-foreground">
                                Funding amount
                                <input id="fund-amount" type="number" min="100" max="10000000" step="0.01" required value={fundAmount} onChange={event => setFundAmount(event.target.value)} placeholder="Amount in NGN (min ₦100)" className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm" />
                            </label>
                            <label className="space-y-1 text-xs font-medium text-foreground">
                                Payment gateway
                                <select value={fundingGateway} onChange={event => setFundingGateway(event.target.value as "paystack" | "bachs")} className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm">
                                    <option value="paystack">Paystack</option>
                                    <option value="bachs">Bachs</option>
                                </select>
                            </label>
                            <button type="submit" disabled={working !== ""} className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60">
                                {working === "fund" ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <ArrowUpRight className="h-4 w-4 text-black" />} Continue to {fundingGateway === "bachs" ? "Bachs" : "Paystack"}
                            </button>
                        </form>
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            Paystack and Bachs use hosted secure checkout. Your balance is updated only after server-side payment confirmation.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-black" />Verify payout account</CardTitle>
                        <CardDescription>Choose a payout provider, then verify and save a Nigerian bank destination with that provider. Spendstack stores only the account name and last four digits.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {accountsError && <p role="alert" className="mb-3 text-xs text-red-700">Could not load saved payout accounts.</p>}
                        {bankAccounts && bankAccounts.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {bankAccounts.map(account => (
                                    <label key={account.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3">
                                        <input type="radio" name="bank-account" value={account.id} checked={selectedAccount === account.id} disabled={!account.is_usable} onChange={() => setSelectedAccount(account.id)} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-medium text-foreground">{account.account_name}</span>
                                            <span className="block text-xs text-muted-foreground">{account.bank_name} · •••• {account.account_last4} · {account.payout_provider === "bachs" ? "Bachs" : "Paystack"}{!account.is_usable ? " · Pending approval" : ""}</span>
                                        </span>
                                        {account.is_default && <span className="text-[10px] text-primary">Default</span>}
                                    </label>
                                ))}
                            </div>
                        )}
                        {banksError ? (
                            <p role="alert" className="text-sm text-red-700">Bank list unavailable. Check the {bankPayoutProvider === "bachs" ? "Bachs" : "Paystack"} credentials configured on the server.</p>
                        ) : (
                            <form onSubmit={addBankAccount} className="space-y-3">
                                <label className="block space-y-1 text-xs font-medium text-foreground">
                                    Payout provider
                                    <select
                                        value={bankPayoutProvider}
                                        onChange={event => {
                                            setBankPayoutProvider(event.target.value as "paystack" | "bachs")
                                            setBankCode("")
                                        }}
                                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm"
                                    >
                                        <option value="paystack">Paystack</option>
                                        <option value="bachs">Bachs</option>
                                    </select>
                                </label>
                                <label className="block space-y-1 text-xs font-medium text-foreground">
                                    Bank
                                    <select required value={bankCode} onChange={event => setBankCode(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm">
                                        <option value="">{banks ? "Choose a bank" : "Loading banks…"}</option>
                                        {banks?.map(bank => <option key={bank.code} value={bank.code}>{bank.name}</option>)}
                                    </select>
                                </label>
                                <label className="block space-y-1 text-xs font-medium text-foreground">
                                    10-digit account number
                                    <input required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={accountNumber} onChange={event => setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm" />
                                </label>
                                <button type="submit" disabled={working !== "" || !banks?.length} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 text-sm font-medium text-foreground disabled:opacity-50">
                                    {working === "bank" ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <CheckCircle2 className="h-4 w-4 text-black" />} Verify & save account
                                </button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5 text-black" />Create a money lock</CardTitle>
                        <CardDescription>Choose how much to lock, how long to lock it, and how the payout will be sent when it matures.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={createLock} className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-1.5 text-xs font-medium text-foreground">
                                Amount to lock (₦)
                                <input required type="number" min="0.01" step="0.01" max="10000000" value={amount} onChange={event => setAmount(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm" />
                            </label>
                            <label className="space-y-1.5 text-xs font-medium text-foreground">
                                Lock duration (days)
                                <input required type="number" min="1" max="3650" step="1" value={intervalDays} onChange={event => setIntervalDays(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm" />
                            </label>
                            <label className="space-y-1.5 text-xs font-medium text-foreground">
                                Payout recurrence
                                <select
                                    value={recurrence}
                                    onChange={event => {
                                        const selectedRecurrence = event.target.value as "" | "daily" | "weekly" | "monthly"
                                        setRecurrence(selectedRecurrence)
                                        setPayoutAmount("")
                                        setRecurrenceDay(selectedRecurrence === "monthly" ? "1" : "4")
                                    }}
                                    className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm"
                                >
                                    <option value="">One-time payout</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </label>
                            {recurrence && (
                                <>
                                    <label className="space-y-1.5 text-xs font-medium text-foreground">
                                        Number of payouts
                                        <input
                                            required
                                            type="number"
                                            min="2"
                                            max="520"
                                            step="1"
                                            value={occurrenceCount}
                                            onChange={event => {
                                                setOccurrenceCount(event.target.value)
                                                setPayoutAmount("")
                                            }}
                                            className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm"
                                        />
                                    </label>
                                    <label className="space-y-1.5 text-xs font-medium text-foreground">
                                        Amount per payout (₦)
                                        <input
                                            required
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            max="10000000"
                                            value={effectivePayoutAmount}
                                            onChange={event => setPayoutAmount(event.target.value)}
                                            className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm"
                                        />
                                    </label>
                                    {recurrence !== "daily" && (
                                    <label className="space-y-1.5 text-xs font-medium text-foreground">
                                        {recurrence === "weekly" ? "Payout weekday" : "Payout day of month"}
                                        {recurrence === "weekly" ? (
                                            <select
                                                value={recurrenceDay}
                                                onChange={event => setRecurrenceDay(event.target.value)}
                                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm"
                                            >
                                                {WEEKDAYS.map((day, index) => <option key={day} value={index}>{day}</option>)}
                                            </select>
                                        ) : (
                                            <select
                                                value={recurrenceDay}
                                                onChange={event => setRecurrenceDay(event.target.value)}
                                                className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm"
                                            >
                                                {Array.from({ length: 31 }, (_, index) => index + 1).map(day => (
                                                    <option key={day} value={day}>{day}{day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"}</option>
                                                ))}
                                            </select>
                                        )}
                                    </label>
                                    )}
                                    <p className={`text-xs sm:col-span-2 ${payoutTotalMatches ? "text-muted-foreground" : "text-red-700"}`} role={payoutTotalMatches ? undefined : "alert"}>
                                        {payoutTotalMatches
                                            ? `${formatNaira(Number(effectivePayoutAmount || 0))} × ${count || 0} payouts = ${formatNaira(totalMinorUnits / 100)} locked. The first payout is scheduled on or after maturity; monthly dates past the end of a month use that month’s last day.`
                                            : "The locked amount must exactly equal the payout amount multiplied by the number of payouts."}
                                    </p>
                                </>
                            )}
                            <label className="space-y-1.5 text-xs font-medium text-foreground">
                                Purpose (optional)
                                <input maxLength={255} value={description} onChange={event => setDescription(event.target.value)} placeholder="Emergency fund" className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm" />
                            </label>
                            <label className="space-y-1.5 text-xs font-medium text-foreground">
                                Payout account
                                <select required value={selectedAccount} onChange={event => setSelectedAccount(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm">
                                    <option value="">Select an approved payout account</option>
                                    {bankAccounts?.filter(account => account.is_usable).map(account => <option key={account.id} value={account.id}>{account.bank_name} · •••• {account.account_last4} · {account.payout_provider === "bachs" ? "Bachs" : "Paystack"}</option>)}
                                </select>
                            </label>
                            <label className="flex items-start gap-2 text-sm text-foreground sm:col-span-2">
                                <input className="mt-1 accent-black" type="checkbox" checked={autoPayout} onChange={event => setAutoPayout(event.target.checked)} />
                                <span>Automatically submit each payout when due <span className="block text-xs text-muted-foreground">Requires the backend due-payout scheduler and selected provider payouts to be enabled. Turn this off to submit each due payout yourself.</span></span>
                            </label>
                            {selectedBank && <p className="text-xs text-muted-foreground sm:col-span-2">{recurrence ? `${formatNaira(Number(effectivePayoutAmount || 0))} will be paid ${recurrence}${recurrence === "weekly" ? ` on ${WEEKDAYS[Number(recurrenceDay)]}` : recurrence === "monthly" ? ` on day ${recurrenceDay} of the month` : ""}, ${count || 0} times` : `The full ${amount ? formatNaira(Number(amount)) : "locked amount"} will be paid once`} through {selectedBank.payout_provider === "bachs" ? "Bachs" : "Paystack"} to {selectedBank.account_name} at {selectedBank.bank_name} •••• {selectedBank.account_last4}. The first payout follows the lock duration; no interest is calculated.</p>}
                            <button type="submit" disabled={working !== "" || !selectedAccount || !payoutTotalMatches} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50 sm:col-span-2 sm:justify-self-start">
                                {working === "lock" ? <Loader2 className="h-4 w-4 animate-spin text-black" /> : <LockKeyhole className="h-4 w-4 text-black" />} Lock funds & schedule payout
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <section className="space-y-3">
                <div className="flex items-center gap-2"><CalendarClock className="h-5 w-5 text-black" /><h2 className="font-semibold text-foreground">Your locks</h2></div>
                {locksError ? <p role="alert" className="text-sm text-red-700">Could not load money locks.</p> : locks?.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {locks.map(lock => (
                            <Card key={lock.id}><CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div><p className="font-semibold text-foreground">{formatNaira(Number(lock.amount))}</p><p className="mt-1 text-xs text-muted-foreground">{lock.description || `${lock.interval_days}-day lock`}</p></div>
                                    <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium capitalize text-foreground">{lock.status.replace("_", " ")}</span>
                                </div>
                                <p className="mt-3 text-xs text-muted-foreground">Unlocks {dateLabel(lock.unlock_date)} · {lock.bank_account.bank_name} •••• {lock.bank_account.account_last4}</p>
                                <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3 text-xs">
                                    <p className="font-medium text-foreground">
                                        {lock.schedule.recurrence
                                            ? `${lock.schedule.recurrence[0].toUpperCase()}${lock.schedule.recurrence.slice(1)} payout · ${lock.schedule.occurrences_completed} of ${lock.schedule.occurrence_count} paid`
                                            : "One-time payout"}
                                    </p>
                                    <p className="mt-1 text-muted-foreground">
                                        {formatNaira(Number(lock.schedule.payout_amount))} per payout · Next: {dateLabel(lock.schedule.scheduled_date)}
                                        {lock.schedule.recurrence === "weekly" && lock.schedule.recurrence_day !== null
                                            ? ` · ${WEEKDAYS[lock.schedule.recurrence_day]}`
                                            : lock.schedule.recurrence === "monthly" && lock.schedule.recurrence_day !== null
                                                ? ` · Day ${lock.schedule.recurrence_day} monthly`
                                                : ""}
                                    </p>
                                    <p className="mt-1 text-muted-foreground">Remaining to pay: {formatNaira(Number(lock.schedule.remaining_amount))} · Schedule {lock.schedule.status.replace("_", " ")}</p>
                                </div>
                                {(lock.schedule.status === "failed" || (
                                    !lock.schedule.auto_payout &&
                                    lock.schedule.status === "pending" &&
                                    new Date(lock.schedule.scheduled_date).getTime() <= Date.now()
                                )) && (
                                    <button
                                        type="button"
                                        onClick={() => void submitPayout(lock)}
                                        disabled={working !== ""}
                                        className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground disabled:opacity-50"
                                    >
                                        {working === `payout-${lock.schedule.id}`
                                            ? <Loader2 className="h-4 w-4 animate-spin text-black" />
                                            : <ArrowUpRight className="h-4 w-4 text-black" />}
                                        {lock.schedule.status === "failed" ? "Retry payout" : "Submit due payout"}
                                    </button>
                                )}
                            </CardContent></Card>
                        ))}
                    </div>
                ) : locks ? <p className="text-sm text-muted-foreground">No funds locked yet.</p> : <p className="text-sm text-muted-foreground">Loading locks…</p>}
            </section>
        </div>
    )
}
