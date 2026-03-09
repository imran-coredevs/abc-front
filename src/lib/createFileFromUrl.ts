export async function createFileFromUrl(fileData: UserDocument) {
    // Fetch the file from server
    const response = await fetch(fileData.location)
    const blob = await response.blob()

    // Create a File object
    const file = new File([blob], fileData.name, {
        type: fileData.fileType,
        lastModified: new Date().getTime(),
    })

    return file
}
