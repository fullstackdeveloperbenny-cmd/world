import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import { fetchAllCountries } from "./services/countriesService.js";
import { initMap } from "./services/mapService.js";
import { loadFavorites, saveFavorites } from "./services/storageService.js";
import { calculateStats } from "./services/statsService.js";
import { renderCountryList } from "./components/countryList.js";
import { initCountryModal, showCountryDetail } from "./components/countryDetailModal.js";
import { renderStats } from "./components/statsPanel.js";
// Globale state
let allCountries = [];
let filteredCountries = [];
let favorites = [];
// DOM refs
const searchInput = document.querySelector("#search_input");
const regionSelect = document.querySelector("#region_filter");
const statusMessage = document.querySelector("#status_message");
const countriesCount = document.querySelector("#countries_count");
const favoritesPanel = document.querySelector("#favorites_panel");
const favoritesEmpty = document.querySelector("#favorites_empty");
document.addEventListener("DOMContentLoaded", async () => {
    initMap();
    initCountryModal(handleFavoriteToggleFromModal);
    favorites = loadFavorites();
    setupFilterHandlers();
    await loadCountries();
    renderFavorites();
    updateStats();
});
async function loadCountries() {
    setStatus("Landen worden geladen...", "warning");
    try {
        allCountries = await fetchAllCountries();
        filteredCountries = allCountries;
        applyFilters();
        setStatus("Landen succesvol geladen.", "success");
    } catch (error) {
        console.error(error);
        setStatus("Fout bij het laden van landen. Probeer later opnieuw.", "danger");
    }
}
function setupFilterHandlers() {
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            applyFilters();
        });
    }
    if (regionSelect) {
        regionSelect.addEventListener("change", () => {
            applyFilters();
        });
    }
}
function applyFilters() {
    const term = searchInput.value.trim().toLowerCase();
    const selectedRegion = regionSelect.value.trim().toLowerCase();

    // FILTER LOGICA
    filteredCountries = allCountries.filter(country => {

        // naam match
        const name = country.name.common.toLowerCase();
        const matchTerm = name.includes(term);

        // regio logica:
        // "Alle regio's", "all", "", null → gelden als "geen filter"
        const countryRegion = (country.region || "").toLowerCase();
        const matchRegion =
            selectedRegion === "all" ||
            countryRegion === selectedRegion;

       // console.log(matchTerm, '-',matchRegion);

        return matchTerm && matchRegion;

    });
   // console.log(filteredCountries[0].capital[0])

    // RENDEREN VAN LANDEN
    renderCountryList({
        countries: filteredCountries,
        favorites,
        onCountryClick: handleCountryClick,
        onFavoriteToggle: handleFavoriteToggleFromList
    });

    // AANTAL BIJWERKEN
    countriesCount.textContent = `${filteredCountries.length} landen`;

    // STATS UPDATEN
    updateStats();
}



function handleCountryClick(country) {
    showCountryDetail(country, isFavorite(country));
}
function handleFavoriteToggleFromList(country) {
    toggleFavorite(country);
}
function handleFavoriteToggleFromModal(country) {
    toggleFavorite(country);
}
function toggleFavorite(country) {
// TODO:
// - key bepalen (bijv. country.cca3)
// - indien al aanwezig in favorites: verwijderen
// - anders: toevoegen (met minimaal name, region, cca3)
// saveFavorites(favorites);
    renderFavorites();
    updateStats();
}
function isFavorite(country) {
    const key = country.cca3;
    return favorites.some((fav) => fav.cca3 === key);
}
function renderFavorites() {
    if (!favoritesPanel) return;
    favoritesPanel.innerHTML = "";
    if (!favorites || favorites.length === 0) {
        favoritesEmpty.classList.remove("d-none");
        return;
    }
    favoritesEmpty.classList.add("d-none");
    favorites.forEach((fav) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = `${fav.name} (${fav.region})`;
        li.addEventListener("click", () => {
            const country = allCountries.find((c) => c.cca3 === fav.cca3);
            if (country) {
                handleCountryClick(country);
            }
        });
        favoritesPanel.appendChild(li);
    });
}
function updateStats() {
    const stats = calculateStats(filteredCountries, favorites);
    renderStats(stats);
}
function setStatus(message, type = "secondary") {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.className = `alert alert-${type} mb-0 py-2`;
}
