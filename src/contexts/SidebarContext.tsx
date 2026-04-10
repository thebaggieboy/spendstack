"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface SidebarContextType {
    isOpen: boolean
    toggle: () => void
    close: () => void
}

const SidebarContext = createContext<SidebarContextType>({
    isOpen: false,
    toggle: () => {},
    close: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen((v) => !v)
    const close = () => setIsOpen(false)
    return (
        <SidebarContext.Provider value={{ isOpen, toggle, close }}>
            {children}
        </SidebarContext.Provider>
    )
}
