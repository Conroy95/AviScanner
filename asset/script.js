// Initialiseer de kaart op Nederland (coördinaten van je screenshot)
const map = L.map('map', {
    zoomControl: false // Verberg standaard knoppen voor cleaner app-uiterlijk
}).setView([52.07, 4.3], 10);

// OpenFlightMaps Tile Layer
// Let op: vervang 'latest' door de actuele AIRAC cyclus indien nodig
const ofmLayer = L.tileLayer('https://{s}.tile.p-p-h.org/openflightmaps/latest/topo/int/{z}/{x}/{y}.png', {
    maxZoom: 14,
    attribution: '&copy; <a href="https://www.openflightmaps.org">openflightmaps.org</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(map);

// Voorbeeld marker voor een vliegveld (bijv. Rotterdam The Hague)
const rtmIcon = L.icon({
    iconUrl: 'img/airport-icon.png', // Zorg dat je een icoon in je img map hebt
    iconSize: [32, 32],
});

L.marker([51.9569, 4.4372]).addTo(map)
    .bindPopup('<b>Rotterdam The Hague Airport</b><br>TWR: 118.205<br>GND: 121.705');
