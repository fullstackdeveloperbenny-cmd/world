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
    flagImg.src = country.flags?.png || "";
    flagImg.alt = `Vlag van ${country.name.common}`;

    // 2. Details leegmaken
    clearElement(detailsDl);
    clearElement(currencyInfo);

    // 3. Helper voor dt/dd
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

    // 4. Landinformatie toevoegen
    addDetail("Hoofdstad", country.capital?.join(", ") || "Onbekend");
    addDetail("Regio", country.region || "Onbekend");
    addDetail("Populatie", country.population?.toLocaleString() || "Onbekend");
    addDetail(
        "Talen",
        country.languages ? Object.values(country.languages).join(", ") : "Onbekend"
    );

    // 5. Valuta
    let valutaString = "Onbekend";
    let valutaCode = null;
    if (country.currencies) {
        const entries = Object.entries(country.currencies);
        valutaCode = entries[0][0]; // bv. SYP
        const c = entries[0][1];
        valutaString = `${valutaCode} – ${c.name}`;
    }
    addDetail("Valuta", valutaString);

    // 6. Wisselkoers informatie
    if (valutaCode) {
        try {
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
        } catch (err) {
            const box = document.createElement("div");
            box.innerHTML = `<p class="text-muted">Wisselkoers niet beschikbaar</p>`;
            currencyInfo.appendChild(box);
        }
    }

    // 7. Favorietenknop aanpassen
    if (favBtn) {
        favBtn.textContent = isFavorite ? "Verwijder uit favorieten" : "Toevoegen aan favorieten";
    }

    // 8. Modal tonen
    modalInstance.show();

    // 9. Kaart en alertBox afhandelen
    setTimeout(() => {
        if (country.latlng && country.latlng.length === 2) {
            // Forceer Leaflet kaart herberekenen
            map.invalidateSize();
            focusCountry(country.latlng[0], country.latlng[1], country.name.common);
            alertBox.classList.add("d-none"); // alert verbergen
        } else {
            alertBox.textContent = "Locatie niet beschikbaar voor dit land";
            alertBox.classList.remove("d-none"); // alert tonen
        }
    }, 0);
}