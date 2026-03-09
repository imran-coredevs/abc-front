import { Button } from './button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog'

type Props = {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string | React.ReactNode
    onAccept?: () => void
    onDecline?: () => void
    acceptBtnText?: string
    declineBtnText?: string
}

export default function AlertModal({
    isOpen = false,
    onClose,
    onAccept,
    onDecline,
    title,
    description,
    acceptBtnText = 'Accept',
    declineBtnText = 'Cancel',
}: Props) {
    const handleSuccess = () => {
        if (onAccept) {
            onAccept()
        }
        onClose()
    }

    const handleDecline = () => {
        if (onDecline) {
            onDecline()
        }
        onClose()
    }

    return (
        <Dialog modal open={isOpen} onOpenChange={onClose}>
            <DialogContent
                showCloseButton={false}
                className="flex flex-col gap-8 overflow-clip rounded-2xl border border-neutral-700 bg-neutral-900 p-8"
            >
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center">
                        <h3 className="font-semibold text-neutral-50">{title ? title : 'Are you absolutely sure?'}</h3>
                    </DialogTitle>
                    <DialogDescription className="my-4 text-center text-neutral-200">
                        {description
                            ? description
                            : 'This action cannot be undone. This will permanently remove your data from our servers.'}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex w-full items-center justify-between gap-4">
                    <Button variant="secondary" className="w-1/2" onClick={handleDecline}>
                        {declineBtnText}
                    </Button>
                    <Button variant="default" className="w-1/2" onClick={handleSuccess}>
                        {acceptBtnText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
