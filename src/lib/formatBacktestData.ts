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
    format: 'month' | 'date' | 'datetime' = 'date',
): UIEquityCurvePoint[] {
    if (!equityCurve || equityCurve.length === 0) {
        return []
    }

    return equityCurve.map((point) => {
        const date = new Date(point.timestamp)
        let label: string

        switch (format) {
            case 'month':
                label = date.toLocaleDateString('en-US', { month: 'short' })
                break
            case 'datetime':
                label = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })
                break
            case 'date':
            default:
                label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                break
        }

        return {
            month: label,
            equity: point.equity,
        }
    })
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
