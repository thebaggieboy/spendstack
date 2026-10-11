"use client"

import useSWR from "swr"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { Activity, ArrowDownToLine, CreditCard, FileText, Users, Eye } from "lucide-react"
import { useState } from "react"
import { fetchWithAuth } from "@/lib/fetcher"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

type Overview = {
    users: {
        total: number
        active_accounts: number
        active_1d: number
        active_7d: number
        active_30d: number
        signups_today: number
        signups_7d: number
        signups_30d: number
    }
    activity: {
        page_views_total: number
        page_views_30d: number
        visitors_30d: number
        top_pages: { path: string; views: number }[]
        daily: { date: string; visits: number; signups: number }[]
    }
    product: {
        statements: number
        transactions: number
        active_pro_subscribers: number
        pro_conversion_percent: number
    }
}

type AnalyticsUser = {
    id: number
    email: string
    first_name: string
    last_name: string
    date_joined: string
    last_login: string | null
    last_activity: string | null
    is_active: boolean
    is_staff: boolean
    is_superuser: boolean
    statements: number
    transactions: number
}

type UserResponse = {
    count: number
    page: number
    pages: number
    results: AnalyticsUser[]
}

type ApiError = Error & { status?: number }

function number(value: number) {
    return value.toLocaleString("en-NG")
}

function dateLabel(value: string | null) {
    if (!value) return "Never"
    return new Date(value).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

function MetricCard({
    title,
    value,
    detail,
    icon: Icon,
}: {
    title: string
    value: number
    detail: string
    icon: typeof Users
}) {
    return (
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">{title}</p>
                    <p className="mt-3 text-2xl font-semibold text-foreground">{number(value)}</p>
                </div>
                <span className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Icon className="h-4 w-4" />
                </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{detail}</p>
        </div>
    )
}

export default function AdminAnalyticsPage() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const overviewUrl = `${API_URL}internal-analytics/overview/`
    const usersUrl = `${API_URL}internal-analytics/users/?page=${page}&search=${encodeURIComponent(search)}`
    const { data, error, isLoading } = useSWR<Overview, ApiError>(overviewUrl, fetchWithAuth, {
        refreshInterval: 60_000,
        revalidateOnFocus: true,
    })
    const {
        data: userData,
        error: usersError,
        isLoading: usersLoading,
    } = useSWR<UserResponse, ApiError>(usersUrl, fetchWithAuth, {
        refreshInterval: 60_000,
        revalidateOnFocus: true,
    })

    const status = error?.status ?? usersError?.status
    if (status === 403) {
        return (
            <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-semibold text-foreground">Administrator access required</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    This internal analytics page is available only to Spendstack administrators.
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl space-y-7 py-2">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                        <Activity className="h-3.5 w-3.5" />
                        PRIVATE ADMIN CONSOLE
                    </p>
                    <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Product analytics</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        User growth, engagement, and product activity across Spendstack.
                    </p>
                </div>
                <p className="text-xs text-muted-foreground">Refreshes automatically every minute</p>
            </header>

            {error || usersError ? (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    Could not load admin analytics. Check your connection and administrator access, then refresh.
                </div>
            ) : null}

            {isLoading || !data ? (
                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
                    Loading product metrics…
                </div>
            ) : (
                <>
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard title="Registered users" value={data.users.total} detail={`${number(data.users.active_accounts)} active accounts`} icon={Users} />
                        <MetricCard title="Active users · 30 days" value={data.users.active_30d} detail={`${number(data.users.active_1d)} in 24 hours · ${number(data.users.active_7d)} in 7 days`} icon={Activity} />
                        <MetricCard title="New signups · 30 days" value={data.users.signups_30d} detail={`${number(data.users.signups_today)} today · ${number(data.users.signups_7d)} in 7 days`} icon={ArrowDownToLine} />
                        <MetricCard title="Page views · 30 days" value={data.activity.page_views_30d} detail={`${number(data.activity.visitors_30d)} unique browsers`} icon={Eye} />
                        <MetricCard title="Statements imported" value={data.product.statements} detail="Total statements uploaded" icon={FileText} />
                        <MetricCard title="Transactions tracked" value={data.product.transactions} detail="Total transactions stored" icon={Activity} />
                        <MetricCard title="Active Plus subscribers" value={data.product.active_pro_subscribers} detail={`${data.product.pro_conversion_percent}% of registered users`} icon={CreditCard} />
                        <MetricCard title="All-time page views" value={data.activity.page_views_total} detail="Tracked app page visits" icon={Eye} />
                    </section>

                    <section className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
                        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                            <div className="mb-4">
                                <h2 className="text-sm font-semibold text-foreground">Signups and page views</h2>
                                <p className="mt-1 text-xs text-muted-foreground">Daily activity over the last 30 days</p>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.activity.daily} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceaf1" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                                            interval={4}
                                            tick={{ fontSize: 10 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <Tooltip labelFormatter={(value) => dateLabel(String(value))} />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Bar dataKey="visits" name="Page views" fill="#8061df" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="signups" name="Signups" fill="#37ad87" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                            <h2 className="text-sm font-semibold text-foreground">Most visited pages</h2>
                            <p className="mt-1 text-xs text-muted-foreground">Last 30 days</p>
                            <div className="mt-5 space-y-4">
                                {data.activity.top_pages.length ? data.activity.top_pages.map((item, index) => {
                                    const maxViews = data.activity.top_pages[0]?.views || 1
                                    return (
                                        <div key={item.path}>
                                            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                                                <span className="min-w-0 truncate font-medium text-foreground">{item.path}</span>
                                                <span className="shrink-0 text-muted-foreground">{number(item.views)}</span>
                                            </div>
                                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, item.views / maxViews * 100)}%`, opacity: 1 - index * 0.07 }} />
                                            </div>
                                        </div>
                                    )
                                }) : <p className="py-6 text-center text-xs text-muted-foreground">No page views recorded yet.</p>}
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">All users</h2>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {userData ? `${number(userData.count)} accounts · newest first` : "Account activity and product usage"}
                                </p>
                            </div>
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value)
                                    setPage(1)
                                }}
                                placeholder="Search email or name"
                                aria-label="Search users"
                                className="h-10 w-full rounded-lg border border-border bg-white px-3 text-xs outline-none transition focus:border-primary sm:max-w-xs"
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-xs">
                                <thead className="bg-muted/40 text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">User</th>
                                        <th className="px-4 py-3 font-medium">Joined</th>
                                        <th className="px-4 py-3 font-medium">Last activity</th>
                                        <th className="px-4 py-3 font-medium">Statements</th>
                                        <th className="px-4 py-3 font-medium">Transactions</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {usersLoading && !userData ? (
                                        <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Loading users…</td></tr>
                                    ) : userData?.results.length ? userData.results.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/20">
                                            <td className="px-5 py-3">
                                                <p className="font-medium text-foreground">{user.first_name || user.last_name ? `${user.first_name} ${user.last_name}`.trim() : user.email}</p>
                                                <p className="mt-1 text-muted-foreground">{user.email}</p>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{dateLabel(user.date_joined)}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{dateLabel(user.last_activity ?? user.last_login)}</td>
                                            <td className="px-4 py-3 text-foreground">{number(user.statements)}</td>
                                            <td className="px-4 py-3 text-foreground">{number(user.transactions)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2 py-1 ${user.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                                                    {user.is_superuser ? "Superuser" : user.is_staff ? "Admin" : user.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No users match your search.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between border-t border-border px-5 py-3">
                            <p className="text-xs text-muted-foreground">Page {userData?.page ?? 1} of {userData?.pages ?? 1}</p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={!userData || userData.page <= 1}
                                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                                    className="rounded-lg border border-border px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    disabled={!userData || userData.page >= userData.pages}
                                    onClick={() => setPage((current) => current + 1)}
                                    className="rounded-lg border border-border px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}
