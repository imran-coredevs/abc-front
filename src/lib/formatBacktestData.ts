import type { EquityCurvePoint as UIEquityCurvePoint } from '../modules/strategy-management/components/backtesting/types'
import type { EquityCurvePoint as APIEquityCurvePoint } from '../services/backtestService'

/**
 * Converts equity curve timestamps to formatted date labels
 * @param equityCurve - Array of equity curve points from API
 * @param format - Date format: 'month' | 'date' | 'datetime'
 * @returns Formatted equity curve with date labels
 */
export function formatEquityCurve(
    equityCurve: APIEquityCurvePoint[],
): UIEquityCurvePoint[] {
    if (!equityCurve || equityCurve.length === 0) {
        return []
    }

    return equityCurve.map((point) => ({
        timestamp: Number(point.timestamp),
        equity: point.equity,
    }))
}

/**
 * Converts average trade duration from minutes to a human-readable format
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "4h 32m")
 */
export function formatTradeDuration(minutes: number): string {
    if (minutes < 60) {
        return `${Math.round(minutes)}m`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = Math.round(minutes % 60)

    if (hours < 24) {
        return `${hours}h ${remainingMinutes}m`
    }

    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    return `${days}d ${remainingHours}h`
}
