(function () {
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest;
    const originalWorker = window.Worker;

    // Helper to send data to content script
    const notifyCapture = (url, body, contentType) => {
        window.dispatchEvent(new CustomEvent('API_INTERCEPTED', {
            detail: { url, body, contentType }
        }));
    };

    // Intercept Fetch with Stream Support
    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);
        const url = typeof args[0] === 'string' ? args[0] : args[0].url;
        const contentType = response.headers.get('content-type') || '';

        // Clone response to read body without consuming original
        const clone = response.clone();

        if (contentType.includes('text/event-stream') || response.body) {
            const reader = clone.body.getReader();
            let accumulated = '';
            const decoder = new TextDecoder();

            // Background task to read the stream
            (async () => {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        accumulated += decoder.decode(value, { stream: true });
                    }
                    notifyCapture(url, accumulated, contentType);
                } catch (e) {
                    console.error('Capture stream error:', e);
                }
            })();
        } else {
            clone.text().then(body => {
                notifyCapture(url, body, contentType);
            }).catch(err => console.error('Capture fetch error:', err));
        }

        return response;
    };

    // Intercept XHR
    function XHRProxy() {
        const xhr = new originalXHR();
        const open = xhr.open;
        let method, url;

        xhr.open = function (m, u) {
            method = m;
            url = u;
            return open.apply(this, arguments);
        };

        xhr.addEventListener('load', function () {
            const contentType = xhr.getResponseHeader('content-type');
            if (xhr.status >= 200 && xhr.status < 300) {
                notifyCapture(url, xhr.responseText, contentType);
            }
        });

        return xhr;
    }
    window.XMLHttpRequest = XHRProxy;

    // Intercept WebWorkers (Experimental/Best effort)
    window.Worker = function (scriptURL, options) {
        if (typeof scriptURL === 'string' && !scriptURL.startsWith('blob:')) {
            // For ChatGPT style obfuscation, we might need a more complex wrapper,
            // but for now we try to proxy the fetch inside the worker if possible.
            // This is a common pattern for "deep" hooks.
            console.log('Worker detected:', scriptURL);
        }
        return new originalWorker(scriptURL, options);
    };

})();
