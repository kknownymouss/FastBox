import { saveAs } from 'file-saver';


// copies a certain text to clipboard
export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
}

// downloads a certain file url
export const downloadFile = (fileUrl, name) => saveAs(fileUrl, name);

// opens the file in a new tab
export const openInNewTab = (openMenu, openRename, openMove, openInfo, fileUrl) => {
    if (!openMenu && !openRename && !openMove && !openInfo) {
        window.open(fileUrl, '_blank').focus();
    }
}
