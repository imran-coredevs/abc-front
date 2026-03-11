import FromBg from '@/assets/images/formBG.png'
import { InputField } from '@/components/ui/InputField'
import { Button } from '@/components/ui/button'
import { usePasswordReset } from '@/hooks/usePasswordReset'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Stage } from '../page'

type FormValues = {
    password: string
    confirmPassword: string
}

export const GeneratePassword = ({ setStage }: { setStage: (stage: Stage) => void }) => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const resetToken = searchParams.get('token') || ''

    const { control, handleSubmit, watch } = useForm<FormValues>({
        mode: 'onBlur',
    })

    const password = watch('password')
    const { resetPassword, isResettingPassword, resetPasswordSuccess } = usePasswordReset()

    // Redirect to login if no token provided
    useEffect(() => {
        if (!resetToken) {
            navigate('/login')
            setStage('login')
        }
    }, [resetToken, setStage, navigate])

    const onSubmit = (data: FormValues) => {
        if (!resetToken) {
            return
        }
        // Sanitize password by trimming extra spaces
        const sanitizedPassword = data.password.trim()

        resetPassword({
            token: resetToken,
            newPassword: sanitizedPassword,
        })
    }

    // Navigate to login after successful password reset
    useEffect(() => {
        if (resetPasswordSuccess) {
            setTimeout(() => {
                navigate('/login')
                setStage('login')
            }, 2000)
        }
    }, [resetPasswordSuccess, setStage, navigate])

    return (
        <div className="relative w-full max-w-120.5 overflow-hidden rounded-xl">
            <img
                src={FromBg}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-clip opacity-70"
            />

            <div className="relative z-10 flex w-full flex-col gap-8 pt-10 lg:p-8">
                <div className="flex w-full flex-col gap-3">
                    <h3 className="text-center font-semibold text-neutral-50">Generate New Password</h3>
                    <p className="text-center text-base text-neutral-400">
                        Please enter your new password below to reset your account password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
                    <InputField
                        control={control}
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter Your Password"
                        required
                        rules={{
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters',
                            },
                            validate: {
                                noWhitespace: (value) =>
                                    value.trim() === value || 'Password should not have leading or trailing spaces',
                                hasLowercase: (value) =>
                                    /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
                                hasUppercase: (value) =>
                                    /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                                hasNumber: (value) =>
                                    /[0-9]/.test(value) || 'Password must contain at least one number',
                            },
                        }}
                    />

                    <InputField
                        control={control}
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Your Password"
                        required
                        rules={{
                            required: 'Please confirm your password',
                            validate: (value) => {
                                // Trim both values before comparison
                                const trimmedValue = value.trim()
                                const trimmedPassword = password?.trim() || ''
                                return trimmedValue === trimmedPassword || 'Passwords do not match'
                            },
                        }}
                    />
                    <Button className="mt-4" variant="default" disabled={isResettingPassword}>
                        {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
