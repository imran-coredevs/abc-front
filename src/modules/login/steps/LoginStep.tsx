import FromBg from '@/assets/images/formBG.png'
import { InputField } from '@/components/ui/InputField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Stage } from '../page'

type FormValues = {
    email: string
    password: string
}

export const LoginStep = ({ setStage }: { setStage: (stage: Stage) => void }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    })

    const { login, isLoggingIn } = useAuth()
    const [rememberMe, setRememberMe] = useState(false)

    const onSubmit = async (data: FormValues) => {
        // Sanitize inputs by trimming extra spaces
        const sanitizedData = {
            email: data.email.trim(),
            password: data.password.trim(),
        }
        login({ ...sanitizedData, rememberMe })
    }

    return (
        <div className="relative w-full overflow-hidden rounded-xl lg:w-120.5">
            <img
                src={FromBg}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-clip opacity-60"
            />

            <div className="relative z-10 flex w-full flex-col gap-8 pt-10 lg:p-8">
                <div className="flex w-full flex-col gap-3">
                    <img src="/full-logo.svg" alt="logo" className="mb-5 h-11" />
                    <h3 className="text-center font-semibold text-neutral-50">Welcome Back</h3>
                    <p className="text-center text-base text-neutral-400">Login to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
                    <InputField
                        control={control}
                        label="Email"
                        name="email"
                        placeholder="Enter your email address"
                        required
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address',
                            },
                            validate: (value) =>
                                value.trim() === value || 'Email should not have leading or trailing spaces',
                        }}
                    />

                    <InputField
                        control={control}
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        rules={{
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters',
                            },
                            validate: (value) =>
                                value.trim() === value || 'Password should not have leading or trailing spaces',
                        }}
                    />

                    <div className="flex w-full items-center justify-between gap-4">
                        <div className="mt-3 flex items-center gap-3">
                            <Checkbox
                                id="rememberMe"
                                className="size-5"
                                checked={rememberMe}
                                handleChecked={setRememberMe}
                            />
                            <Label
                                htmlFor="rememberMe"
                                className="cursor-pointer text-base font-medium text-neutral-50"
                            >
                                Remember me
                            </Label>
                        </div>
                        <button
                            type="button"
                            className="cursor-pointer text-base font-medium text-neutral-50"
                            onClick={() => setStage('sendotp')}
                        >
                            Forgot Password
                        </button>
                    </div>

                    <Button className="mt-4" variant="default" disabled={isLoggingIn}>
                        {isLoggingIn ? 'Signing In...' : 'Sign in'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
