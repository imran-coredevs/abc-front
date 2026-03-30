function formatAmount(value: number | string): string {
    if (value === null || value === undefined) return '0.00'

    const num = Number(value)
    if (isNaN(num)) return '0.00' // Handle invalid number inputs

    // Use toLocaleString for Indian numbering system
    // 'en-IN' locale provides the Indian numbering format (lakhs and crores)
    return num?.toLocaleString('en-IN', {
        minimumFractionDigits: 2, // Ensure two decimal places
        maximumFractionDigits: 2, // Ensure two decimal places
    })
}

export default formatAmount
