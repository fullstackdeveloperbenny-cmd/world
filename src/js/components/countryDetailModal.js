import * as bootstrap from "bootstrap";
import { clearElement, createElement } from "../utils/dom.js";
import { focusCountry } from "../services/mapService.js";
import { fetchRateToEuro } from "../services/statsService.js";
let modalInstance = null;
let currentCountry = null;
let onFavoriteToggleCallback = null;
/**
 * Initialiseert de modal (één keer aanroepen in main.js)
 */
export function initCountryModal(onFavoriteToggle) {
    const modalElement = document.querySelector("#country_modal");
    if (!modalElement) return;
    modalInstance = new bootstrap.Modal(modalElement);
    onFavoriteToggleCallback = onFavoriteToggle;
    const favBtn = document.querySelector("#favorite_toggle_btn");
    if (favBtn) {
        favBtn.addEventListener("click", () => {
            if (currentCountry && typeof onFavoriteToggleCallback === "function") {
                onFavoriteToggleCallback(currentCountry);
            }
        });
    }
}
/**
 * Toon de modal voor een bepaald land.
 * @param {Object} country
 * @param {boolean} isFavorite
 */
export async function showCountryDetail(country, isFavorite) {
    if (!modalInstance || !country) return;
    currentCountry = country;
    const title = document.querySelector("#country_modal_label");
    const flagImg = document.querySelector("#country_flag");
    const detailsDl = document.querySelector("#country_details");
    const alertBox = document.querySelector("#country_modal_alert");
    const currencyInfo = document.querySelector("#currency_info");
    const favBtn = document.querySelector("#favorite_toggle_btn");
// TODO:
// - titel invullen (country.name.common)
// - vlag src/alt instellen
// - detailsDl leegmaken en opnieuw vullen met dt/dd voor:
// hoofdstad, regio, populatie, talen, valuta
    // Titel invullen
    // titel invullen
    title.textContent = country.name.common;

// vlag instellen
    flagImg.src = country.flags?.png || "";
    flagImg.alt = `Vlag van ${country.name.common}`;

// leegmaken
    clearElement(detailsDl);
    clearElement(currencyInfo);

// juiste Bootstrap layout
    function addDetail(term, value) {
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");

        dt.classList.add("col-sm-4");
        dd.classList.add("col-sm-8");

        dt.textContent = term;
        dd.textContent = value;

        detailsDl.appendChild(dt);
        detailsDl.appendChild(dd);
    }

// Hoofdstad
    addDetail("Hoofdstad", country.capital?.join(", ") || "Onbekend");

// Regio
    addDetail("Regio", country.region || "Onbekend");

// Populatie
    addDetail("Populatie", country.population?.toLocaleString() || "Onbekend");

// Talen
    const talen = country.languages
        ? Object.values(country.languages).join(", ")
        : "Onbekend";
    addDetail("Talen", talen);

// Valuta
    let valutaString = "Onbekend";
    let valutaCode = null;

    if (country.currencies) {
        const entries = Object.entries(country.currencies);
        valutaCode = entries[0][0]; // bijv. SYP
        const c = entries[0][1];    // { name: "...", symbol: "..." }

        valutaString = `${valutaCode} – ${c.name}`;
    }

    addDetail("Valuta", valutaString);

// Valuta-info (zoals rechts op jouw foto)
    if (valutaCode) {
        const rate = await fetchRateToEuro(valutaCode);

        const box = document.createElement("div");

        box.innerHTML = `
        <p class="mb-1">Valuta: ${valutaString}</p>
        ${
            rate
                ? `<p class="mb-1">1 EUR ≈ ${rate.toLocaleString()} ${valutaCode}</p>`
                : `<p class="text-muted">Wisselkoers niet beschikbaar</p>`
        }
    `;

        currencyInfo.appendChild(box);
    }


// TODO: alertBox verbergen of tonen afhankelijk van geodata (lat/lng)
// - lat/lng zoeken in country.latlng
// - als aanwezig: focusCountry(lat, lng, name)
// - anders: nette melding tonen en map eventueel "disable"-stijl geven
// TODO: wisselkoers-info ophalen
// - eerste currency-code bepalen uit country.currencies
// - fetchRateToEuro(code) aanroepen
// - resultaat tonen in currencyInfo
// - foutmeldingen netjes afhandelen
// TODO: tekst/appearance van favBtn aanpassen op basis van isFavorite
    modalInstance.show();
}