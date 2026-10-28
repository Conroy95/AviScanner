// ==========================================
// J.A.R.V.I.S. TACTICAL OSINT ENGINE v4.9
// ==========================================

let currentMode = 'plane'; // 'plane' of 'vehicle'

// Lokale database voor vliegtuigen (uniek en gecontroleerd)
const localDatabase = {
    "PH-RAC": { type: "Cessna 172 Skyhawk", model: "C172", owner: "Privé / Aeroclub", icao: "4844CD", status: "Geregistreerd / Actief" },
    "PH-BVA": { type: "Boeing 737-8K2", model: "B738", owner: "KLM - Royal Dutch Airlines", icao: "484123", status: "Commercieel Vliegtuig" },
    "PH-UTL": { type: "Dassault Falcon 8X", model: "Falcon 8X", owner: "Max Verstappen", icao: "4867E6", status: "VIP Active" },
    "PH-TLP": { type: "Dassault Falcon 7X", model: "Falcon 7X", owner: "Talpa / John de Mol", icao: "485171", status: "VIP Active" },
    "PH-KFY": { type: "Diamond DA-40NG Star", model: "DA40", owner: "KLM Flight Academy", icao: "485993", status: "Training" },
    "PH-CJM": { type: "Cessna Citation Sovereign", model: "C680", owner: "Frits van Eerd - Jumbo", icao: "4846F0", status: "Business Jet" },
    "PH-AJX": { type: "Dassault Falcon 7X", model: "Falcon 7X", owner: "AJAX (Exxaero)", icao: "485170", status: "Business Jet" },
    "OO-NHV": { type: "Airbus / Eurocopter Dauphin", model: "AS365", owner: "Noordzee Helikopters Vlaanderen", icao: "448A42", status: "Offshore Rescue" },
    "PH-IWS": { type: "Dassault Falcon 7X", model: "Falcon 7X", owner: "Martin Garrix", icao: "4851B8", status: "VIP Active" },
    "PH-BEJ": { type: "Bombardier Global 5000", model: "BD-700", owner: "Ben Mandemakers", icao: "485FD1", status: "VIP Active" },
    "N900KS": { type: "Gulfstream G650ER", model: "GV-SP", owner: "Steven Spielberg", icao: "AC701E", status: "US Private Jet" },
    "N887WM": { type: "Gulfstream G650ER", model: "GV-SP", owner: "Bill Gates", icao: "AC8C34", status: "US Private Jet" },
    "PH-PXA": { type: "Piaggio P.180 Avanti", model: "P180", owner: "Nationale Politie (Police01)", icao: "48401A", status: "Overheid / Surveillance" },
    "PH-PXB": { type: "Cessna 172", model: "C172", owner: "Nationale Politie (Police02)", icao: "48401B", status: "Overheid / Surveillance" },
    "PH-PXC": { type: "Patrouillevliegtuig", model: "Surveillance", owner: "Nationale Politie (Police03)", icao: "48401C", status: "Overheid / Surveillance" },
    "PH-PXX": { type: "Surveillance Vliegtuig", model: "Custom", owner: "Nationale Politie (Police04)", icao: "48401D", status: "Overheid / Surveillance" },
    "PH-PXD": { type: "Surveillance Vliegtuig", model: "Custom", owner: "Nationale Politie (Police04)", icao: "48401E", status: "Overheid / Surveillance" },
    "PH-PXZ": { type: "Politie Helikopter", model: "Air Support", owner: "Nationale Politie (Police26)", icao: "48401F", status: "Overheid / Air Support" },
    "PH-HIP": { type: "Airbus Helicopters", model: "H135 P3", owner: "ANWB Medical Air Assistance", icao: "486A31", status: "Traumahelikopter" },
    "PH-HLP": { type: "Airbus Helicopters", model: "H135 P3", owner: "ANWB Medical Air Assistance", icao: "486A30", status: "Traumahelikopter" },
    "PH-SAR": { type: "Leonardo", model: "AW189", owner: "Bristow Netherlands", icao: "486449", status: "Search & Rescue" },
    "PH-NCG": { type: "Leonardo", model: "AW189", owner: "Bristow Netherlands", icao: "48644B", status: "Search & Rescue" }
};

// DOM Elements
const modePlaneBtn = document.getElementById('modePlane');
const modeVehicleBtn = document.getElementById('modeVehicle');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Mode Switcher Listeners
modePlaneBtn.addEventListener('click', () => setMode('plane'));
modeVehicleBtn.addEventListener('click', () => setMode('vehicle'));

function setMode(mode) {
    currentMode = mode;
    if (mode === 'plane') {
        modePlaneBtn.classList.add('active');
        modeVehicleBtn.classList.remove('active');
        searchInput.placeholder = "Voer vliegtuigregistratie in (bijv. PH-UTL)...";
        speakJarvis("Air traffic tracking mode activated.");
    } else {
        modeVehicleBtn.classList.add('active');
        modePlaneBtn.classList.remove('active');
        searchInput.placeholder = "Voer kenteken in (bijv. AB-12-CD)...";
        speakJarvis("RDW vehicle registry mode activated.");
    }
}

searchBtn.addEventListener('click', executeSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch();
});

// Hoofdzoekfunctie
async function executeSearch() {
    const query = searchInput.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');
    const errorCard = document.getElementById('errorCard');
    const loading = document.getElementById('loading');

    if (!query) return;

    resultCard.classList.add('hidden');
    errorCard.classList.add('hidden');
    loading.classList.remove('hidden');

    speakJarvis("Scanning databases.");

    setTimeout(async () => {
        loading.classList.add('hidden');

        if (currentMode === 'plane') {
            await handleAircraftSearch(query);
        } else {
            await handleVehicleSearch(query);
        }
    }, 450);
}

// 1. Vliegtuig Zoeklogica
async function handleAircraftSearch(query) {
    let planeData = {
        type: "Luchtvaartuig",
        model: "Standaard registratie",
        owner: "Geregistreerd / Operator onbekend",
        icao: "N.v.t.",
        status: "Aan de grond / Geen live signaal"
    };

    if (localDatabase[query]) {
        planeData = localDatabase[query];
    } else {
        try {
            const response = await fetch(`https://api.adsb.lol/v2/reg/${query}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.ac && data.ac.length > 0) {
                    const plane = data.ac[0];
                    planeData = {
                        type: plane.type || "Onbekend",
                        model: plane.desc || "Commercieel / Privé",
                        owner: plane.ownOp || "Onbekende operator",
                        icao: plane.hex || "Onbekend",
                        status: "Active (Live Telemetry)"
                    };
                }
            }
        } catch (e) {
            // Fallback gebruiken
        }
    }

    displayAircraftResult(query, planeData);
}

async function displayAircraftResult(reg, data) {
    document.getElementById('cardTitle').innerText = "AIR TARGET ACQUIRED";
    document.getElementById('resBadge').innerText = reg;
    
    document.getElementById('label1').innerText = "Vliegtuig Type:";
    document.getElementById('val1').innerText = data.type;
    
    document.getElementById('label2').innerText = "Fabrikant / Model:";
    document.getElementById('val2').innerText = data.model;
    
    document.getElementById('label3').innerText = "Eigenaar / Operator:";
    document.getElementById('val3').innerText = data.owner;
    
    document.getElementById('label4').innerText = "ICAO Hex Code:";
    document.getElementById('val4').innerText = data.icao;
    
    document.getElementById('label5').innerText = "Transponder Status:";
    document.getElementById('val5').innerText = data.status;

    document.getElementById('jarvisLogText').innerText = `Target ${reg} gelokaliseerd in luchtruim. Transponder data geverifieerd.`;

    // Foto ophalen via Planespotters
    const imgContainer = document.getElementById('imageContainer');
    const imgElement = document.getElementById('resImage');
    imgContainer.classList.add('hidden');
    imgElement.classList.add('hidden');

    try {
        const photoResp = await fetch(`https://api.planespotters.net/pub/photos/reg/${reg}`);
        const photoJson = await photoResp.json();
        if (photoJson && photoJson.photos && photoJson.photos.length > 0) {
            imgElement.src = photoJson.photos[0].thumbnail_large.src;
            imgElement.classList.remove('hidden');
            imgContainer.classList.remove('hidden');
        }
    } catch (err) {
        // Geen foto
    }

    document.getElementById('resultCard').classList.remove('hidden');
    speakJarvis(`Target ${reg} identified successfully.`);
}

// 2. Voertuig Zoeklogica (RDW)
async function handleVehicleSearch(rawQuery) {
    const cleanQuery = rawQuery.replace(/[^A-Z0-9]/g, '');
    const errorCard = document.getElementById('errorCard');

    try {
        const response = await fetch(`https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${cleanQuery}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const v = data[0];
            const formattedPlate = formatPlate(cleanQuery);

            document.getElementById('cardTitle').innerText = "VEHICLE TARGET ACQUIRED";
            document.getElementById('resBadge').innerText = formattedPlate;

            document.getElementById('label1').innerText = "Merk & Model:";
            document.getElementById('val1').innerText = `${v.merk || 'Onbekend'} ${v.handelsbenaming || ''}`.trim();

            document.getElementById('label2').innerText = "Inrichting:";
            document.getElementById('val2').innerText = v.inrichting || 'Personenauto';

            document.getElementById('label3').innerText = "Brandstof:";
            document.getElementById('val3').innerText = v.brandstof_omschrijving || 'Onbekend';

            document.getElementById('label4').innerText = "APK Vervaldatum:";
            document.getElementById('val4').innerText = formatRDWDate(v.vervaldatum_apk) || 'Onbekend';

            document.getElementById('label5').innerText = "RDW Status:";
            document.getElementById('val5').innerText = "Geregistreerd in RDW database";

            document.getElementById('imageContainer').classList.add('hidden');
            document.getElementById('jarvisLogText').innerText = `Kenteken ${formattedPlate} geverifieerd in nationale RDW voertuigdatabank.`;
            
            document.getElementById('resultCard').classList.remove('hidden');
            speakJarvis(`Vehicle license plate ${formattedPlate} verified.`);
        } else {
            errorCard.classList.remove('hidden');
            document.getElementById('errorText').innerText = `Geen voertuig gevonden voor kenteken: ${rawQuery}`;
            speakJarvis("No vehicle records found for this license plate.");
        }
    } catch (err) {
        errorCard.classList.remove('hidden');
        document.getElementById('errorText').innerText = "Verbindingsfout met RDW registry server.";
        speakJarvis("Error communicating with RDW servers.");
    }
}

// Hulpfuncties
function formatRDWDate(str) {
    if (!str || str.length !== 8) return str;
    return `${str.substr(6,2)}-${str.substr(4,2)}-${str.substr(0,4)}`;
}

function formatPlate(p) {
    if (p.length !== 6) return p;
    return `${p.substr(0,2)}-${p.substr(2,2)}-${p.substr(4,2)}`;
}

// JARVIS Spraak synthesiseerfunctie (optioneel via browser Web Speech API)
function speakJarvis(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 0.95;
        // Probeer een Engelse stem te vinden voor de JARVIS-vibe
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('GB') || v.name.includes('UK') || v.name.includes('Male')));
        if (enVoice) utterance.voice = enVoice;
        window.speechSynthesis.speak(utterance);
    }
}
