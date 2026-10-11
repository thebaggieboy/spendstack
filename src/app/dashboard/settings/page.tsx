"use client"

import Link from "next/link"
import { useState, useSyncExternalStore } from "react"
import { Bell, CreditCard, LockKeyhole, Save, Settings2, ShieldCheck, UserRound } from "lucide-react"

const SETTINGS_KEY = "spendstack_preferences"

type Preferences = {
    spendingAlerts: boolean
    weeklySummary: boolean
    productUpdates: boolean
}

const DEFAULT_PREFERENCES: Preferences = {
    spendingAlerts: true,
    weeklySummary: true,
    productUpdates: false,
}

const preferenceRows: { key: keyof Preferences; title: string; detail: string }[] = [
    {
        key: "spendingAlerts",
        title: "Spending alert reminders",
        detail: "Show in-app reminders when tracked spending reaches an alert threshold.",
    },
    {
        key: "weeklySummary",
        title: "Weekly activity summary",
        detail: "Keep the weekly spending summary preference enabled for future delivery options.",
    },
    {
        key: "productUpdates",
        title: "Product updates",
        detail: "Opt in to occasional updates about new Spendstack features.",
    },
]

function parsePreferences(stored: string): Preferences {
    try {
        return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES
    } catch {
        return DEFAULT_PREFERENCES
    }
}

function subscribePreferences(onChange: () => void) {
    window.addEventListener("storage", onChange)
    window.addEventListener("spendstack-preferences-changed", onChange)
    return () => {
        window.removeEventListener("storage", onChange)
        window.removeEventListener("spendstack-preferences-changed", onChange)
    }
}

function getPreferencesSnapshot() {
    return localStorage.getItem(SETTINGS_KEY) ?? ""
}

function getServerPreferencesSnapshot() {
    return ""
}

export default function SettingsPage() {
    const storedPreferences = useSyncExternalStore(
        subscribePreferences,
        getPreferencesSnapshot,
        getServerPreferencesSnapshot,
    )
    const [draft, setDraft] = useState<Preferences | null>(null)
    const preferences = draft ?? parsePreferences(storedPreferences)
    const [saved, setSaved] = useState(false)

    function savePreferences() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences))
        setDraft(null)
        window.dispatchEvent(new Event("spendstack-preferences-changed"))
        setSaved(true)
        window.setTimeout(() => setSaved(false), 2500)
    }

    return (
        <main className="mx-auto w-full max-w-5xl space-y-7">
            <header>
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Settings2 className="h-4 w-4" /> Preferences
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Settings</h1>
                <p className="mt-2 text-sm text-muted-foreground">Manage your Spendstack preferences and account links.</p>
            </header>

            <nav aria-label="Account pages" className="grid gap-3 sm:grid-cols-3">
                <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-sm">
                    <span className="rounded-xl bg-primary/10 p-2.5 text-primary"><UserRound className="h-4 w-4" /></span>
                    <span><span className="block text-sm font-semibold text-foreground">Profile</span><span className="mt-1 block text-xs text-muted-foreground">Personal information</span></span>
                </Link>
                <Link href="/dashboard/billing" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-sm">
                    <span className="rounded-xl bg-primary/10 p-2.5 text-primary"><CreditCard className="h-4 w-4" /></span>
                    <span><span className="block text-sm font-semibold text-foreground">Billing</span><span className="mt-1 block text-xs text-muted-foreground">Plan and subscription</span></span>
                </Link>
                <a href="#security" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-sm">
                    <span className="rounded-xl bg-primary/10 p-2.5 text-primary"><ShieldCheck className="h-4 w-4" /></span>
                    <span><span className="block text-sm font-semibold text-foreground">Security</span><span className="mt-1 block text-xs text-muted-foreground">Sign-in and data access</span></span>
                </a>
            </nav>

            <section className="rounded-2xl border border-border bg-white shadow-sm">
                <div className="border-b border-border p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                        <span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Bell className="h-4 w-4" /></span>
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">Notifications and preferences</h2>
                            <p className="mt-1 text-xs text-muted-foreground">Choose which in-app and product reminders you prefer.</p>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-border px-5 sm:px-6">
                    {preferenceRows.map(({ key, title, detail }) => (
                        <label key={key} className="flex cursor-pointer items-center justify-between gap-5 py-4">
                            <span>
                                <span className="block text-sm font-medium text-foreground">{title}</span>
                                <span className="mt-1 block max-w-2xl text-xs leading-relaxed text-muted-foreground">{detail}</span>
                            </span>
                            <input
                                type="checkbox"
                                checked={preferences[key]}
                                onChange={(event) => setDraft((current) => ({ ...(current ?? preferences), [key]: event.target.checked }))}
                                className="h-4 w-4 shrink-0 accent-primary"
                            />
                        </label>
                    ))}
                </div>
                <div className="flex flex-col gap-3 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-xs text-muted-foreground">Preferences are saved in this browser. Email and push delivery are not configured.</p>
                    <button type="button" onClick={savePreferences} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
                        <Save className="h-4 w-4" /> {saved ? "Saved" : "Save preferences"}
                    </button>
                </div>
            </section>

            <section id="security" className="scroll-mt-24 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                    <span className="rounded-xl bg-primary/10 p-2.5 text-primary"><LockKeyhole className="h-4 w-4" /></span>
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Account security</h2>
                        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                            Your account uses a password and an expiring access token. You can sign out from your profile page to clear this browser’s session.
                        </p>
                        <Link href="/dashboard/profile" className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline">Manage your profile and session</Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
