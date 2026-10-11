"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const VISITOR_ID_KEY = "spendstack_visitor_id"

function getVisitorId() {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY)
    if (!visitorId) {
        visitorId = crypto.randomUUID()
        localStorage.setItem(VISITOR_ID_KEY, visitorId)
    }
    return visitorId
}

export default function PageViewTracker() {
    const pathname = usePathname()
    const { loading, token } = useAuth()
    const lastTrackedPath = useRef<string | null>(null)

    useEffect(() => {
        if (loading || !pathname || !API_URL || lastTrackedPath.current === pathname) return
        lastTrackedPath.current = pathname

        const headers: HeadersInit = { "Content-Type": "application/json" }
        if (token) headers.Authorization = `Bearer ${token}`

        fetch(`${API_URL}internal-analytics/track/`, {
            method: "POST",
            headers,
            body: JSON.stringify({ visitor_id: getVisitorId(), path: pathname }),
            keepalive: true,
        }).then((response) => {
            if (!response.ok) {
                console.error(`Page-view tracking failed with status ${response.status}.`)
            }
        }).catch((error: unknown) => {
            console.error("Page-view tracking request failed.", error)
        })
    }, [loading, pathname, token])

    return null
}
