// Register Service Worker for PWA Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('J.A.R.V.I.S. SW Registered:', reg.scope))
            .catch(err => console.error('J.A.R.V.I.S. SW Registration Failed:', err));
    });
}
