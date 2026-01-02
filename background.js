chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SAVE_RESPONSE') {
        const { url, body, contentType } = message.payload;

        // Parse URL for metadata
        let hostname = 'unknown';
        let pathSnippet = 'response';
        try {
            const urlObj = new URL(url);
            hostname = urlObj.hostname.replace(/[^a-z0-9.-]/gi, '_');
            pathSnippet = urlObj.pathname.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
            if (pathSnippet.startsWith('_')) pathSnippet = pathSnippet.substring(1);
        } catch (e) {
            console.error('URL parsing failed:', e);
        }

        // High resolution timestamp (including milliseconds)
        const now = new Date();
        const timestamp = now.toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_')
            .replace('Z', '');

        // Extension mapping
        const extension = contentType.includes('application/json') ? 'json' : 'txt';

        // Construct filename with folder structure
        // Format: "domain/path_timestamp.ext"
        const filename = `${hostname}/${pathSnippet || 'root'}_${timestamp}.${extension}`;

        const blob = new Blob([body], { type: contentType });
        const reader = new FileReader();

        reader.onload = function () {
            const dataUrl = reader.result;
            chrome.downloads.download({
                url: dataUrl,
                filename: filename,
                saveAs: false, // This ignores the "Save As" dialog if the browser setting permits
                conflictAction: 'uniquify' // In case of collisions, add (1), (2), etc.
            }, (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error('Download failed:', chrome.runtime.lastError);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    sendResponse({ success: true, downloadId });
                }
            });
        };

        reader.readAsDataURL(blob);
        return true;
    }
});
