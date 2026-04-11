// Kaart setup
const map = L.map('map', { zoomControl: false }).setView([51.95, 4.43], 10);

// Basis laag
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// OpenFlightMaps laag
L.tileLayer('https://{s}.tile.p-p-h.org/openflightmaps/latest/topo/int/{z}/{x}/{y}.png', {
    maxZoom: 14,
    subdomains: ['a', 'b', 'c'],
    attribution: '© OpenFlightMaps'
}).addTo(map);

// Voorbeeld marker
L.marker([51.9569, 4.4372]).addTo(map)
    .bindPopup('<b>EHRD - Rotterdam Tower</b><br>118.205 MHz');

// Navigatie knoppen
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        console.log("Navigeren naar:", this.id);
    });
});
