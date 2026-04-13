
// Function to copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            console.log('Fallback: Text copied to clipboard');
        } catch (err) {
            console.error('Fallback: Unable to copy text', err);
        }
        document.body.removeChild(textarea);
    }
}
