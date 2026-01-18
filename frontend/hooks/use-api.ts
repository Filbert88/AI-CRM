"use client"

import { useState, useEffect } from "react"
import { getLeads, getDashboardSummary, getActions, LeadResponse, DashboardSummary, ActionItem } from "@/lib/api"

/**
 * Hook to fetch all leads from the API
 */
export function useLeads() {
    const [leads, setLeads] = useState<LeadResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchLeads() {
            try {
                setLoading(true)
                const data = await getLeads()
                setLeads(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch leads")
            } finally {
                setLoading(false)
            }
        }
        fetchLeads()
    }, [])

    const refetch = async () => {
        try {
            setLoading(true)
            const data = await getLeads()
            setLeads(data)
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch leads")
        } finally {
            setLoading(false)
        }
    }

    return { leads, loading, error, refetch }
}

/**
 * Hook to fetch dashboard summary from the API
 */
export function useDashboardSummary() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchSummary() {
            try {
                setLoading(true)
                const data = await getDashboardSummary()
                setSummary(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch summary")
            } finally {
                setLoading(false)
            }
        }
        fetchSummary()
    }, [])

    return { summary, loading, error }
}

/**
 * Hook to fetch action items from the API
 */
export function useActions() {
    const [actions, setActions] = useState<ActionItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchActions() {
            try {
                setLoading(true)
                const data = await getActions()
                setActions(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch actions")
            } finally {
                setLoading(false)
            }
        }
        fetchActions()
    }, [])

    return { actions, loading, error }
}
