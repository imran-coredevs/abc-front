export const truncateString = (string: string | undefined, startLength = 3, endLength = 3): string => {
    if (!string) return ''

    if (string.length <= startLength + endLength) return string

    return `${string.slice(0, startLength)}...${string.slice(-endLength)}`
}
