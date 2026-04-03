import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNowStrict } from 'date-fns'

const ASSET_BASE_URL = 'http://localhost:3000'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }
    
    return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function resolveAssetUrl(url?: string | null): string {
    if (!url) return ''
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) {
        return url
    }

    return `${ASSET_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}
