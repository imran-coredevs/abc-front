import { Button } from '@/components/ui/button'
import ImageWrapper from '@/components/ui/ImageWrapper'
import { InputField } from '@/components/ui/InputField'
import Loader from '@/components/ui/loader'
import Separator from '@/components/ui/Separator'
import { useLoginUserStore, useManageProfileStore } from '@/store'
import { useProfile } from '@/hooks/useProfile'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import EditProfileImageUpload from './edit-profile-image-upload'
import SettingsWrapper from './wrapper'

type ManageProfileForm = {
    firstName: string
    lastName: string
    email: string
}

export default function ManageProfile() {
    const { user } = useLoginUserStore()
    const { imageUrl, imageFile, editing, setImageUrl } = useManageProfileStore()
    const { updateProfile, isUpdating, updateImage, isUploadingImage } = useProfile()
    const [isDirty, setIsDirty] = useState(false)

    const initialFirstName = useRef(user?.firstName)
    const initialLastName = useRef(user?.lastName)
    const initialProfileImage = useRef(user?.profileImage)

    const { control, handleSubmit, reset, watch } = useForm<ManageProfileForm>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
    })

    const formFirstName = watch('firstName')
    const formLastName = watch('lastName')

    useEffect(() => {
        if (user) {
            reset({
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
            })
            if (user.profileImage) {
                setImageUrl(user.profileImage)
            }
            initialFirstName.current = user.firstName
            initialLastName.current = user.lastName
            initialProfileImage.current = user.profileImage
        }
    }, [user, reset, setImageUrl])

    useEffect(() => {
        const normalize = (val: string | null | undefined) => (val && val.trim() !== '' ? val : null)

        const firstNameChanged = formFirstName !== initialFirstName.current
        const lastNameChanged = formLastName !== initialLastName.current
        const profileImageChanged = normalize(imageUrl) !== normalize(initialProfileImage.current)

        setIsDirty(firstNameChanged || lastNameChanged || profileImageChanged)
    }, [formFirstName, formLastName, imageUrl, initialProfileImage])

    const onSubmit = async (data: ManageProfileForm) => {
        // Sanitize inputs
        const sanitizedData = {
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
        }
        
        // If image changed, upload it first
        if (imageFile) {
            updateImage(imageFile)
        }
        
        // Update profile data
        updateProfile(sanitizedData)
    }

    return (
        <SettingsWrapper title="Profile Settings" subTitle="Manage your personal information">
            <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 p-3 sm:p-4">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative mb-6">
                        <ImageWrapper
                            src={imageUrl as string}
                            avatar
                            alt="Profile Image"
                            className="size-[6.25rem] overflow-hidden rounded-full bg-neutral-700"
                        />
                        <EditProfileImageUpload />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            control={control}
                            name="firstName"
                            label="First name"
                            placeholder="Enter your first name"
                            disabled={!editing}
                            rules={{
                                required: 'First Name is required',
                                validate: (value) => value.trim() === value || 'Should not have leading or trailing spaces',
                            }}
                        />
                        <InputField
                            control={control}
                            name="lastName"
                            label="Last name"
                            placeholder="Enter your last name"
                            disabled={!editing}
                            rules={{
                                required: 'Last Name is required',
                                validate: (value) => value.trim() === value || 'Should not have leading or trailing spaces',
                            }}
                        />

                        <div className="sm:col-span-2 flex flex-col gap-1">
                            <InputField
                                control={control}
                                name="email"
                                label="Email"
                                placeholder="Enter your email"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <Separator className="bg-neutral-700 my-4" />

                    <div className="flex items-center gap-4">
                        <Button type="submit" className="w-full sm:w-fit" disabled={isUpdating || isUploadingImage || !isDirty}>
                            {isUpdating || isUploadingImage ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="size-4" />
                                    <span>{isUploadingImage ? 'Uploading Image...' : 'Saving...'}</span>
                                </div>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </SettingsWrapper>
    )
}
