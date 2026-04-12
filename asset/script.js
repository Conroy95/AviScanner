const map = L.map('map').setView([52.3676, 4.9041], 7); // Focus op Nederland

// Dark-mode kaartlaag (CartoDB Dark Matter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Icon van icon-icons.com (Vliegtuig)
const planeIcon = L.icon({
    iconUrl: 'https://cdn.icon-icons.com/icons2/1391/PNG/512/airplane_96305.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

let markers = {};

async function updateFlights() {
    try {
        // We gebruiken de OpenSky Network API (Publieke data)
        const response = await fetch('https://opensky-network.org/api/states/all?lamin=50.7&lomin=3.3&lamax=53.5&lomax=7.2');
        const data = await response.json();
        
        document.getElementById('count').innerText = data.states.length;

        data.states.forEach(flight => {
            const [icao, callsign, country, lastPos, lastContact, lon, lat, alt, onGround, velocity, trueTrack] = flight;

            if (lat && lon) {
                if (markers[icao]) {
                    markers[icao].setLatLng([lat, lon]);
                    markers[icao].setRotationAngle(trueTrack); // Vereist extra plugin, of inline CSS
                } else {
                    markers[icao] = L.marker([lat, lon], { icon: planeIcon })
                        .addTo(map)
                        .bindPopup(`<b>Flight: ${callsign}</b><br>Alt: ${Math.round(alt)}m<br>Snelheid: ${Math.round(velocity * 3.6)} km/u`);
                }
            }
        });
    } catch (error) {
        console.error("Data kon niet worden geladen:", error);
    }
}

// Elke 10 seconden verversen
setInterval(updateFlights, 10000);
updateFlights();
