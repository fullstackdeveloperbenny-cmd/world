import { clearElement, createElement } from "../utils/dom.js";

/**
 * Render de lijst van landen in #country_list.
 *
 * @param {Object} config
 * @param {Array} config.countries
 * @param {Array} config.favorites
 * @param {Function} config.onCountryClick (country) => void
 * @param {Function} config.onFavoriteToggle (country) => void
 */
export function renderCountryList({ countries, favorites, onCountryClick, onFavoriteToggle }) {
    const container = document.querySelector("#country_list");
    if (!container) return;

    clearElement(container);

    if (!countries || countries.length === 0) {
        const empty = createElement(
            "div",
            "col-12 alert alert-light border text-center mb-0",
            "Geen landen gevonden voor deze filter."
        );
        container.appendChild(empty);
        return;
    }

    countries.forEach((country) => {
        const col = createElement("div", "col");
        const card = createElement("div", "card h-100 shadow-sm border-0");
        const cardBody = createElement("div", "card-body d-flex flex-column");

        // Vlag
        const flagImg = createElement("img", "flag-img mb-2");
        flagImg.src = country.flags.png;
        flagImg.alt = `Vlag van ${country.name.common}`;

        // Naam
        const nameEl = createElement("h5", "card-title", country.name.common);

        // Regio en populatie
        const regionEl = createElement("p", "card-text mb-0", country.region);
        const popEl = createElement(
            "p",
            "card-text mb-2 text-muted",
            `Populatie: ${country.population.toLocaleString()}`
        );

        // Buttons container
        const btnContainer = createElement("div", "mt-auto d-flex justify-content-between");

        // Details-knop
        const detailsBtn = createElement("button", "btn btn-sm btn-primary", "Details");
        detailsBtn.addEventListener("click", () => onCountryClick(country));

        // Favoriet-knop (hartje)
        const isFav = favorites.some((fav) => fav.cca3 === country.cca3);
        const favBtn = createElement(
            "button",
            `btn btn-sm ${isFav ? "btn-warning" : "btn-outline-warning"}`,
            "★"
        );
        favBtn.addEventListener("click", () => onFavoriteToggle(country));

        btnContainer.appendChild(detailsBtn);
        btnContainer.appendChild(favBtn);

        // Voeg alles toe aan cardBody
        cardBody.appendChild(flagImg);
        cardBody.appendChild(nameEl);
        cardBody.appendChild(regionEl);
        cardBody.appendChild(popEl);
        cardBody.appendChild(btnContainer);

        card.appendChild(cardBody);
        col.appendChild(card);
        container.appendChild(col);
    });
}
