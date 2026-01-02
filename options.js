document.addEventListener('DOMContentLoaded', () => {
    // Internationalization
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const message = chrome.i18n.getMessage(key);
        if (message) {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = message;
            } else {
                element.textContent = message;
            }
        }
    });

    const isEnabledEl = document.getElementById('isEnabled');
    const domainsEl = document.getElementById('targetDomains');
    const prefixesEl = document.getElementById('targetUrlPrefixes');
    const saveBtn = document.getElementById('save');

    // Load current values
    chrome.storage.local.get(['isEnabled', 'targetDomains', 'targetUrlPrefixes'], (data) => {
        isEnabledEl.checked = data.isEnabled !== false; // Default to true
        domainsEl.value = (data.targetDomains || []).join(', ');
        prefixesEl.value = (data.targetUrlPrefixes || []).join('\n');
    });

    // Save values
    saveBtn.addEventListener('click', () => {
        const isEnabled = isEnabledEl.checked;
        const targetDomains = domainsEl.value.split(',').map(s => s.trim()).filter(s => s);
        const targetUrlPrefixes = prefixesEl.value.split('\n').map(s => s.trim()).filter(s => s);

        chrome.storage.local.set({
            isEnabled,
            targetDomains,
            targetUrlPrefixes
        }, () => {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = chrome.i18n.getMessage('savedMessage') || 'Saved!';
            setTimeout(() => {
                saveBtn.textContent = originalText;
            }, 2000);
        });
    });
});
