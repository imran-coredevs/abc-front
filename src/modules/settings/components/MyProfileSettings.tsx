import { InputField } from '@/components/ui/InputField'
import Separator from '@/components/ui/Separator'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/hooks/useProfile'
import { resolveAssetUrl } from '@/lib/utils'
import { useLoginUserStore } from '@/store'
import { Edit2, Trash } from 'iconsax-reactjs'
import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import SettingsWrapper from './wrapper'

type FormValues = {
    firstName: string
    lastName: string
    email: string
}

export default function MyProfileSettings() {
    const { user } = useLoginUserStore()
    const { updateProfile, isUpdating } = useProfile()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null)
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(resolveAssetUrl(user?.avatarUrl) || null)
    const [avatarRemoved, setAvatarRemoved] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isValid },
    } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        },
    })

    useEffect(() => {
        reset({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        })
        setPendingAvatarFile(null)
        setAvatarPreviewUrl(resolveAssetUrl(user?.avatarUrl) || null)
        setAvatarRemoved(false)
    }, [user?.firstName, user?.lastName, user?.email, user?.avatarUrl, reset])

    useEffect(() => {
        return () => {
            if (avatarPreviewUrl && avatarPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreviewUrl)
            }
        }
    }, [avatarPreviewUrl])

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        if (avatarPreviewUrl && avatarPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(avatarPreviewUrl)
        }
        setPendingAvatarFile(file)
        setAvatarPreviewUrl(URL.createObjectURL(file))
        setAvatarRemoved(false)
        event.target.value = ''
    }

    const handleRemovePhoto = () => {
        if (avatarPreviewUrl && avatarPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(avatarPreviewUrl)
        }

        setPendingAvatarFile(null)
        setAvatarPreviewUrl(null)
        setAvatarRemoved(true)
    }

    const onSubmit = (data: FormValues) => {
        updateProfile({
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            avatar: pendingAvatarFile,
            avatarUrl: avatarRemoved ? '' : undefined,
        })
    }

    const fallbackText = user?.firstName?.[0] || user?.name?.[0] || user?.email?.[0] || 'U'
    const hasPendingChanges = useMemo(
        () => isDirty || !!pendingAvatarFile || avatarRemoved,
        [avatarRemoved, isDirty, pendingAvatarFile],
    )

    return (
        <SettingsWrapper title="Profile Settings" subTitle="Manage your personal information">
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-white/5 p-4 sm:p-5">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <div className="relative h-[104px] w-[104px] rounded-full border border-neutral-500 p-0.5">
                            {avatarPreviewUrl ? (
                                <img
                                    src={avatarPreviewUrl}
                                    alt={`${user?.firstName || 'User'} profile`}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-700 text-3xl font-semibold text-white">
                                    {fallbackText}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleUploadClick}
                                className="absolute right-1 bottom-1 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-500 bg-neutral-900 text-neutral-50 transition hover:border-blue-700"
                                title="Upload photo"
                            >
                                <Edit2 size={16} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={handleRemovePhoto}
                            disabled={!user?.avatarUrl && !pendingAvatarFile}
                            className="w-fit whitespace-nowrap border border-red-500/20 bg-red-500/8 text-red-500 hover:border-red-500/35 hover:bg-red-500/12"
                        >
                            <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                <Trash size={16} />
                                <span>Remove Photo</span>
                            </span>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <InputField
                            control={control}
                            name="firstName"
                            label="First Name"
                            placeholder="Enter your first name"
                            rules={{ required: true }}
                            className="h-12"
                        />
                        <InputField
                            control={control}
                            name="lastName"
                            label="Last Name"
                            placeholder="Enter your last name"
                            rules={{ required: true }}
                            className="h-12"
                        />
                    </div>

                    <InputField
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        disabled
                        className="h-12 bg-neutral-800 text-neutral-600"
                    />

                    <Separator className="bg-neutral-700" />

                    <div>
                        <Button type="submit" disabled={!hasPendingChanges || !isValid || isUpdating}>
                            Update
                        </Button>
                    </div>
                </div>
            </form>
        </SettingsWrapper>
    )
}
