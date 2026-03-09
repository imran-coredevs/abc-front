import { create } from 'zustand'

type ManageProfileStore = {
    editing: boolean
    setEditing: (editing: boolean) => void

    imageFile: File | null
    imageUrl: string | null
    setImage: (file: File) => void
    setImageUrl: (url: string) => void
    clearImage: () => void
}

export const useManageProfileStore = create<ManageProfileStore>((set, get) => ({
    editing: true,
    setEditing: (editing) => set({ editing }),

    imageFile: null,
    imageUrl: null,
    setImage: (file) => {
        const currentUrl = get().imageUrl
        if (currentUrl) {
            URL.revokeObjectURL(currentUrl)
        }

        // Create object URL and set in state
        const url = URL.createObjectURL(file)

        set({ imageFile: file, imageUrl: url })
    },
    setImageUrl: (url) => set({ imageUrl: url }),

    clearImage: () => {
        const currentUrl = get().imageUrl
        if (currentUrl) {
            URL.revokeObjectURL(currentUrl)
        }
        set({ imageUrl: null })
    },
}))
