import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InfoCircle, Sms } from 'iconsax-reactjs'

interface CheckInboxModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    email: string
    onLogin: () => void
}

export const CheckInboxModal = ({ open, onOpenChange, email, onLogin }: CheckInboxModalProps) => {
    const maskedEmail = email.replace(/^(.)(.*)(.@.*)$/, (_, a, b, c) => a + '*'.repeat(b.length) + c)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="lg:max-w-xl! bg-neutral-950 border border-neutral-700 p-6 lg:p-10">
                <DialogHeader>
                    <div className="mx-auto w-max rounded-full bg-linear-to-b from-blue-900 to-blue-800 p-3">
                        <Sms size="40" variant="Bold" />
                    </div>
                    <DialogTitle className="mt-6 text-center text-[28px] leading-9 font-semibold text-neutral-50">
                        Check your inbox
                    </DialogTitle>
                    <DialogDescription className="mt-3 text-center text-neutral-300">
                        We have sent a password reset link to {maskedEmail}. Follow the instruction in that email to
                        create a new password. The link will be expire in 15 minutes for security reasons.
                    </DialogDescription>
                </DialogHeader>
                <div className="mx-auto my-4 flex lg:w-max items-start rounded-lg bg-neutral-800 px-3 py-2 text-center text-sm text-neutral-200">
                    <InfoCircle size="20" className="mr-1" />
                    Didn't receive the email? Go back and re-send the link
                </div>
                <div className="flex justify-center">
                    <Button onClick={onLogin} variant="default" className="px-8">
                        Back to Login
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
