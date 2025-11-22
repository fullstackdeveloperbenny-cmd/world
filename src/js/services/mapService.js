import L from "leaflet";
import "leaflet/dist/leaflet.css";

 export let map;
let marker;

/**
 * Initialiseert de Leaflet-kaart in #country_map.
 */
export function initMap() {
    const mapContainer = document.querySelector("#country_map");
    if (!mapContainer) return;

    // Kaart al bestaat? Niet opnieuw maken.
    if (map) return;

    // Leaflet kaart maken in de container
    map = L.map(mapContainer).setView([20, 0], 2); // Wereldkaart

    // OpenStreetMap tiles toevoegen
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(map);
}

/**
 * Zoomt in op een bepaald land en toont een marker met naam.
 * @param {number} lat
 * @param {number} lng
 * @param {string} name
 */
export function focusCountry(lat, lng, name) {
    if (!map) return;

    if (typeof lat !== "number" || typeof lng !== "number") {
        console.warn("Ongeldige coördinaten voor focusCountry");
        return;
    }

    // Zoom naar de coördinaten zonder animatie om haperen te voorkomen
    map.setView([lat, lng], 6, { animate: false });

    // Marker hergebruiken i.p.v. telkens een nieuwe aan te maken
    if (!marker) {
        marker = L.marker([lat, lng]).addTo(map);
    } else {
        marker.setLatLng([lat, lng]);
    }

    // Update popup-tekst en open
    marker.bindPopup(name).openPopup();
}
