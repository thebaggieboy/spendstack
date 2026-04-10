"use client"

import { usePathname } from "next/navigation"
import LandingNav from "@/components/layout/LandingNav"
import Sidebar from "@/components/layout/Sidebar"

const PUBLIC_PAGES = ["/", "/login", "/signup"]

export default function NavSwitcher() {
    const pathname = usePathname()

    if (PUBLIC_PAGES.includes(pathname)) {
        return <LandingNav />
    }

    return <Sidebar />
}
