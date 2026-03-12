import FromBg from '@/assets/images/forgetbg.png'
import { CheckInboxModal } from '@/components/ui/CheckInboxModal'
import { InputField } from '@/components/ui/InputField'
import { Button } from '@/components/ui/button'
import { usePasswordReset } from '@/hooks/usePasswordReset'
import { ArrowLeft } from 'iconsax-reactjs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Stage } from '../page'

type FormValues = {
    email: string
}

export const SendOtp = ({ setStage }: { setStage: (stage: Stage) => void }) => {
    const [open, setOpen] = useState(false)
    const { control, handleSubmit, getValues } = useForm<FormValues>({
        defaultValues: {
            email: '',
        },
        mode: 'onBlur',
    })

    const { forgotPassword, isSendingEmail, forgotPasswordSuccess } = usePasswordReset()

    const onSubmit = async (data: FormValues) => {
        // Sanitize email by trimming extra spaces
        const sanitizedData = {
            email: data.email.trim(),
        }
        forgotPassword(sanitizedData)
    }

    // Open modal when email sent successfully
    if (forgotPasswordSuccess && !open) {
        setOpen(true)
    }

    return (
        <>
            <div className="relative w-full max-w-120.5 rounded-xl">
                <img
                    src={FromBg}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full object-clip opacity-70"
                />

                <div className="relative z-10 flex w-full flex-col gap-8 p-4 pt-8 sm:p-6 lg:p-8">
                    <div className="flex w-full flex-col gap-3">
                        <div
                            onClick={() => setStage('login')}
                            className="mb-5 flex w-fit cursor-pointer items-center justify-center rounded-lg bg-white/15 p-2"
                        >
                            <ArrowLeft size="24" className="text-neutral-50" />
                        </div>

                        <h2 className="text-xl font-semibold text-neutral-50">Forgot Password</h2>
                        <p className="text-sm sm:text-base text-neutral-400">
                            Enter your registered email, and we'll send you a link to reset your password securely.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
                        <InputField
                            control={control}
                            label="Email"
                            name="email"
                            placeholder="hello@gmail.com"
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

                        <Button className="mt-4 py-3" variant="default" disabled={isSendingEmail}>
                            {isSendingEmail ? 'Sending Link...' : 'Send Link'}
                        </Button>
                    </form>
                </div>
            </div>
            <CheckInboxModal
                open={open}
                onOpenChange={setOpen}
                email={getValues('email')}
                onLogin={() => setStage('login')}
            />
        </>
    )
}
