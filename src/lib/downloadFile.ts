import envConfig from '@/config/envConfig'

export const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = `${envConfig.API_BASE_URL}${url}`
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
}

export const downloadLocalfile = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}
