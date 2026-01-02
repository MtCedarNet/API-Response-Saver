// Inject the interceptor.js into the main world (to access original fetch/XHR)
const injectInterceptor = () => {
    // Using documentElement for document_start injection
    const target = document.head || document.documentElement;
    if (!target) return;

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('interceptor.js');
    target.appendChild(script);
    script.onload = () => script.remove();
};

injectInterceptor();

// Listen for messages from the injected script
window.addEventListener('API_INTERCEPTED', (event) => {
    const data = event.detail;

    // Get configuration from storage
    chrome.storage.local.get(['targetDomains', 'targetUrlPrefixes', 'isEnabled'], (config) => {
        if (config.isEnabled === false) return; // Default to enabled if not set

        const currentDomain = window.location.hostname;
        const domains = config.targetDomains || [];
        const prefixes = config.targetUrlPrefixes || [];

        // Match domain (fuzzy)
        const isTargetDomain = domains.length === 0 || domains.some(domain => currentDomain.includes(domain));
        // Match prefix
        const matchesPrefix = prefixes.some(prefix => data.url && data.url.startsWith(prefix));

        if (isTargetDomain && matchesPrefix) {
            chrome.runtime.sendMessage({
                type: 'SAVE_RESPONSE',
                payload: data
            });
        }
    });
});
