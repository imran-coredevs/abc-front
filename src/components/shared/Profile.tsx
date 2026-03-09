import { useLoginUserStore } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import { ArrowDown2, LogoutCurve } from 'iconsax-reactjs'
import { useState } from 'react'
import AlertModal from '../ui/alert-modal'
import ImageWrapper from '../ui/ImageWrapper'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const Profile = () => {
    const { user } = useLoginUserStore()
    const { logout } = useAuth()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    const handleLogout = () => {
        logout()
        setShowLogoutConfirm(false)
    }

    const openLogoutConfirm = () => {
        setShowLogoutConfirm(true)
    }

    const closeLogoutConfirm = () => {
        setShowLogoutConfirm(false)
    }

    return (
        <>
            <Popover>
                <PopoverTrigger className="cursor-pointer">
                    <div className="flex items-center gap-3 rounded-[60px] bg-white/8 px-4 py-2">
                        <ImageWrapper
                            src={user?.profileImage}
                            alt={`Avatar of ${user?.firstName}-${user?.lastName}`}
                            className="size-10 overflow-hidden rounded-full"
                            avatar
                        />
                        <ArrowDown2 size="24" variant="Bold" className="text-neutral-200" />
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="z-999 mt-4 mr-5 flex w-fit cursor-pointer items-center gap-2 rounded-lg border-neutral-700 bg-neutral-950 p-4"
                    onClick={openLogoutConfirm}
                >
                    <LogoutCurve variant="Bold" size={20} />
                    Log Out
                </PopoverContent>
            </Popover>

            <AlertModal
                isOpen={showLogoutConfirm}
                onClose={closeLogoutConfirm}
                title="Are you sure you want to log out?"
                description="You'll be logged out of your admin dashboard and will need to sign in again to access your account."
                acceptBtnText="Log Out"
                declineBtnText="Cancel"
                onAccept={handleLogout}
                onDecline={closeLogoutConfirm}
            />
        </>
    )
}

export default Profile
