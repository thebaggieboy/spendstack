"use client"

import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { requestWithAuth } from "@/lib/fetcher"
import { CreditCard, LogOut, Save, Settings2, UserRound } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

type Profile = {
    id: number
    email: string
    first_name: string
    last_name: string
    is_staff: boolean
    is_superuser: boolean
}

export default function ProfilePage() {
    const { user, updateUser, logout } = useAuth()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        setFirstName(user?.first_name ?? "")
        setLastName(user?.last_name ?? "")
    }, [user])

    async function saveProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSaving(true)
        setMessage("")
        setError("")
        try {
            const profile = await requestWithAuth<Profile>(`${API_URL}users/me/`, {
                method: "PATCH",
                body: JSON.stringify({
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                }),
            })
            updateUser(profile)
            setMessage("Your profile has been updated.")
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Could not update your profile.")
        } finally {
            setSaving(false)
        }
    }

    const initials = `${firstName.trim()[0] ?? ""}${lastName.trim()[0] ?? ""}`.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"

    return (
        <main className="mx-auto w-full max-w-5xl space-y-7">
            <header>
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <UserRound className="h-4 w-4" /> Your account
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Profile</h1>
                <p className="mt-2 text-sm text-muted-foreground">Manage your personal details and current session.</p>
            </header>

            <nav aria-label="Account pages" className="grid gap-3 sm:grid-cols-2">
                <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-sm">
                    <span className="rounded-xl bg-primary/10 p-2.5 text-primary"><Settings2 className="h-4 w-4" /></span>
                    <span><span className="block text-sm font-semibold text-foreground">Settings</span><span className="mt-1 block text-xs text-muted-foreground">Notification preferences and security</span></span>
                </Link>
                <Link href="/dashboard/billing" className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-sm">
                    <span className="rounded-xl bg-primary/10 p-2.5 text-primary"><CreditCard className="h-4 w-4" /></span>
                    <span><span className="block text-sm font-semibold text-foreground">Billing</span><span className="mt-1 block text-xs text-muted-foreground">Plan and subscription details</span></span>
                </Link>
            </nav>

            <section className="rounded-2xl border border-border bg-white shadow-sm">
                <div className="flex items-center gap-4 border-b border-border p-5 sm:p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white">{initials}</div>
                    <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-foreground">{user ? `${user.first_name} ${user.last_name}`.trim() || user.email : "Loading profile…"}</h2>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-primary">Spendstack account</p>
                    </div>
                </div>
                <form onSubmit={saveProfile} className="space-y-5 p-5 sm:p-6">
                    {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{message}</p>}
                    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</p>}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-xs font-medium text-foreground">
                            First name
                            <input value={firstName} onChange={(event) => setFirstName(event.target.value)} maxLength={150} autoComplete="given-name" className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                        </label>
                        <label className="space-y-2 text-xs font-medium text-foreground">
                            Last name
                            <input value={lastName} onChange={(event) => setLastName(event.target.value)} maxLength={150} autoComplete="family-name" className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                        </label>
                        <label className="space-y-2 text-xs font-medium text-foreground sm:col-span-2">
                            Email address
                            <input value={user?.email ?? ""} type="email" disabled className="h-11 w-full cursor-not-allowed rounded-lg border border-input bg-muted px-3 text-sm text-muted-foreground" />
                            <span className="block font-normal text-muted-foreground">Contact support if you need to change your account email.</span>
                        </label>
                    </div>
                    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <button type="button" onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-50">
                            <LogOut className="h-4 w-4" /> Sign out
                        </button>
                        <button type="submit" disabled={saving || !user} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save profile"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}
