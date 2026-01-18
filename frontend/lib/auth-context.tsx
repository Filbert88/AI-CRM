"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getMe } from "@/lib/api"

interface User {
    id: string
    email: string
    full_name: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (token: string) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const userData = await getMe()
                    setUser(userData)
                } catch (error) {
                    console.error("Failed to fetch user profile", error)
                    // If token is invalid, clear it
                    localStorage.removeItem("token")
                    localStorage.removeItem("user")
                }
            }
            setIsLoading(false)
        }
        checkAuth()
    }, [])

    const login = async (token: string) => {
        localStorage.setItem("token", token)
        try {
            const userData = await getMe()
            setUser(userData)
            // localStorage.setItem("user", JSON.stringify(userData)) // Optional caching
            router.push("/dashboard")
        } catch (error) {
            console.error("Login failed: could not fetch profile", error)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        router.push("/login")
    }

    useEffect(() => {
        const publicPaths = ["/login", "/register", "/"]
        if (!isLoading && !user && !publicPaths.includes(pathname)) {
            router.push("/login")
        }
        if (!isLoading && user && publicPaths.includes(pathname)) {
            if (pathname === "/login" || pathname === "/register") {
                router.push("/dashboard")
            }
        }
    }, [user, isLoading, pathname, router])

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
