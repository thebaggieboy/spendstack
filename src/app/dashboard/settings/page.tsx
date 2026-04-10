"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Upload, User, Bell, Shield, Wallet, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function SettingsPage() {
    const { user, logout } = useAuth()

    const initials = user
        ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || user.email[0].toUpperCase()
        : "?"

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 overflow-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gradient">Settings</h2>
                <p className="text-muted-foreground mt-1">
                    Manage your account preferences and application settings.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <div className="md:col-span-1 space-y-1 text-sm font-medium">
                    <button className="flex w-full items-center justify-start rounded-lg bg-white/10 px-3 py-2.5 text-white transition-colors">
                        <User className="mr-3 h-4 w-4" /> Account
                    </button>
                    <button className="flex w-full items-center justify-start rounded-lg px-3 py-2.5 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Wallet className="mr-3 h-4 w-4" /> Connected Banks
                    </button>
                    <button className="flex w-full items-center justify-start rounded-lg px-3 py-2.5 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Bell className="mr-3 h-4 w-4" /> Notifications
                    </button>
                    <button className="flex w-full items-center justify-start rounded-lg px-3 py-2.5 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Shield className="mr-3 h-4 w-4" /> Security
                    </button>

                    <div className="pt-4 border-t border-white/10 mt-4">
                        <button
                            onClick={logout}
                            className="flex w-full items-center justify-start rounded-lg px-3 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
                        >
                            <LogOut className="mr-3 h-4 w-4" /> Sign Out
                        </button>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Your personal details tied to your Spendstack account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden relative group cursor-pointer">
                                    <span>{initials}</span>
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg text-white">
                                        {user ? `${user.first_name} ${user.last_name}`.trim() || user.email : "Loading..."}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                    <p className="text-xs text-primary mt-1 font-medium">Free Tier</p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-zinc-300">
                                        First Name
                                    </label>
                                    <input
                                        defaultValue={user?.first_name ?? ""}
                                        className="flex h-10 w-full rounded-md border border-white/20 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none text-zinc-300">
                                        Last Name
                                    </label>
                                    <input
                                        defaultValue={user?.last_name ?? ""}
                                        className="flex h-10 w-full rounded-md border border-white/20 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium leading-none text-zinc-300">
                                        Email Address
                                    </label>
                                    <input
                                        defaultValue={user?.email ?? ""}
                                        type="email"
                                        disabled
                                        className="flex h-10 w-full rounded-md border border-white/20 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <Button variant="gradient" className="mt-4">
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Session Card */}
                    <Card className="border-white/10">
                        <CardHeader>
                            <CardTitle>Session</CardTitle>
                            <CardDescription>Manage your current login session.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-sm text-white">Sign out of Spendstack</h4>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                                        You will be redirected to the login page and your session will be cleared from this device.
                                    </p>
                                </div>
                                <Button
                                    onClick={logout}
                                    variant="outline"
                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 flex items-center gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-500/20 bg-red-500/5">
                        <CardHeader>
                            <CardTitle className="text-red-500">Danger Zone</CardTitle>
                            <CardDescription className="text-red-400/80">
                                Irreversible actions for your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-sm">Delete Account</h4>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
                                        Permanently delete your account and all associated data including uploaded statements.
                                    </p>
                                </div>
                                <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600 text-white border-transparent">
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
