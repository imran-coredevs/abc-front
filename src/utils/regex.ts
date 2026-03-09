export const regex = {
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[0-9\s()-]*$/,
} as const
