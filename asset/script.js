// Initialiseer de kaart
const map = L.map('map', {
    zoomControl: false
}).setView([52.10, 4.5], 9); // Gecentreerd op regio Den Haag/Rotterdam

// Betrouwbaardere OpenFlightMaps Layer
const ofmLayer = L.tileLayer('https://{s}.tile.p-p-h.org/openflightmaps/2604/topo/int/{z}/{x}/{y}.png', {
    maxZoom: 14,
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; <a href="https://www.openflightmaps.org">OFM</a>'
}).addTo(map);

// Voeg een backup laag toe voor als OFM offline is (optioneel)
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
