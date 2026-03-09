import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { regex } from '@/utils/regex'
import { usePassword } from '@/hooks/usePassword'
import { TickCircle } from 'iconsax-reactjs'
import { useCallback, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import SettingsWrapper from './wrapper'

type FormValues = {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}

type PasswordValidation = {
    label: string
    test: (value: string) => boolean
}

const PASSWORD_VALIDATIONS: ReadonlyArray<PasswordValidation> = [
    {
        label: 'At least 8 characters',
        test: (value: string) => value.length >= 8,
    },
    {
        label: 'At least 1 uppercase letter',
        test: (value: string) => /[A-Z]/.test(value),
    },
    {
        label: 'At least 1 lowercase letter',
        test: (value: string) => /[a-z]/.test(value),
    },
    {
        label: 'At least 1 number',
        test: (value: string) => /\d/.test(value),
    },
] as const

export default function ManagePassword() {
    const { updatePassword, isUpdating, isSuccess } = usePassword()
    
    const {
        control,
        handleSubmit,
        watch,
        reset,
        trigger,
        formState: { isValid },
    } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    })

    const newPassword = watch('newPassword')

    // Reset form after successful password update
    useEffect(() => {
        if (isSuccess) {
            reset()
        }
    }, [isSuccess, reset])

    useEffect(() => {
        if (newPassword) {
            trigger('confirmNewPassword')
        }
    }, [newPassword, trigger])

    const onSubmit = useCallback(async (data: FormValues) => {
        // Trim passwords to remove accidental whitespace
        const currentPassword = data.oldPassword.trim()
        const newPasswordTrimmed = data.newPassword.trim()
        
        updatePassword({
            currentPassword,
            newPassword: newPasswordTrimmed,
        })
    }, [updatePassword])

    const passwordValidationState = useMemo(() => {
        return PASSWORD_VALIDATIONS.map(validation => ({
            ...validation,
            isValid: newPassword ? validation.test(newPassword) : false
        }))
    }, [newPassword])

    return (
        <SettingsWrapper title="Manage Password" subTitle="Update your login credentials securely">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 rounded-lg bg-neutral-900 p-3 sm:p-4">
                    <InputField
                        control={control}
                        type="password"
                        name="oldPassword"
                        label="Old Password"
                        rules={{
                            required: 'Old Password is required',
                        }}
                    />

                    <InputField
                        control={control}
                        type="password"
                        name="newPassword"
                        label="New Password"
                        rules={{
                            required: 'New Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters',
                            },
                            pattern: {
                                value: regex.password,
                                message:
                                    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                            },
                        }}
                    />
                    <InputField
                        control={control}
                        type="password"
                        name="confirmNewPassword"
                        label="Confirm New Password"
                        rules={{
                            required: 'Confirm New Password is required',
                            validate: (value) => value === newPassword || 'The passwords do not match',
                        }}
                    />

                    <div className="flex flex-col gap-1">
                        {passwordValidationState.map((validation) => (
                            <div key={validation.label} className="flex items-center gap-1">
                                <TickCircle
                                    className="size-4 flex-shrink-0"
                                    color={validation.isValid ? '#22C55E' : '#9098b0'}
                                    variant="Bold"
                                />
                                <span className={cn('overline-1 text-xs sm:text-sm', validation.isValid ? 'text-green-500' : 'text-neutral-300')}>
                                    {validation.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Separator className="bg-neutral-600" />

                    <Button type="submit" className="w-full sm:w-fit" disabled={!isValid || isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </SettingsWrapper>
    )
}
