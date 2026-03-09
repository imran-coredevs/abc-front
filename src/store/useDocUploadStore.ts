import { create } from 'zustand'

export type DocFile = {
    id?: string
    isNew?: boolean
    file: File
}

type DocUploadState = {
    docFiles: DocFile[]
    addDoc: (file: File) => void
    addDocWIthId: (file: DocFile) => void
    removeDoc: (file: File) => void
    clear: () => void
}

export const useDocUploadStore = create<DocUploadState>((set, get) => ({
    docFiles: [],
    docUrls: [],

    addDoc: (file: File) => {
        // Revoke previous URL if same file exists
        const currentFiles = get().docFiles

        // Optional: prevent duplicates
        if (currentFiles.some((f) => f.file.name === file.name && f.file.size === file.size)) return

        set({
            docFiles: [...currentFiles, { file: file, isNew: true }],
        })
    },

    addDocWIthId: (file: DocFile) => {
        // Revoke previous URL if same file exists
        const currentFiles = get().docFiles

        // Optional: prevent duplicates
        if (currentFiles.some((f) => f.file.name === file.file.name && f.file.size === file.file.size)) return

        set({
            docFiles: [...currentFiles, { ...file, isNew: false }],
        })
    },

    removeDoc: (file) => {
        const currentFiles = [...get().docFiles]

        const updateFiles = currentFiles.filter((doc) => doc.file.name !== file.name)

        set({ docFiles: updateFiles })
    },

    clear: () => set({ docFiles: [] }),
}))
