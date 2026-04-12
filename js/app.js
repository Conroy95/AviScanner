if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker Geregistreerd"))
    .catch(err => console.log("SW fout:", err));
}
