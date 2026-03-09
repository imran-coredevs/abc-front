import { useManageProfileStore } from '@/store'
import { Edit2 } from 'iconsax-reactjs'

export default function EditProfileImageUpload() {
    const { editing, setImage } = useManageProfileStore()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        // Validate type
        const validTypes = ['image/jpeg', 'image/png']
        if (!validTypes.includes(selectedFile.type)) {
            alert('Please upload only JPG or PNG images')
            e.target.value = ''
            return
        }

        // Validate size (max 5MB)
        const maxSize = 5 * 1024 * 1024
        if (selectedFile.size > maxSize) {
            alert('File size must be less than 5MB')
            e.target.value = ''
            return
        }

        setImage(selectedFile)
        e.target.value = ''
    }

    if (!editing) return

    return (
        <label className="absolute bottom-0 left-16 cursor-pointer" htmlFor="image-upload">
            <input
                id="image-upload"
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex items-center justify-center rounded-full border-2 border-neutral-600 bg-neutral-900 p-2 shadow-md transition hover:shadow-lg">
                <Edit2 className="text-lime-green-500 size-4" />
            </div>
        </label>
    )
}
