import { Button } from '@/components/ui/button'
import { useManageProfileStore } from '@/store'
import { XIcon } from 'lucide-react'

export default function RemoveImage() {
    const { editing, clearImage, imageUrl } = useManageProfileStore()

    if (!editing) return

    return (
        <Button variant="default" className="flex items-center gap-3" onClick={clearImage} disabled={!imageUrl}>
            <XIcon className="size-6" />
            <span className="p-md font-medium">Remove Photo</span>
        </Button>
    )
}
