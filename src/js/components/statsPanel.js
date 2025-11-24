import { clearElement, createElement } from "../utils/dom.js";

/**
 * Render statistieken in #stats_panel.
 * @param {Object} stats
 * @param {number} stats.totalCountries
 * @param {number} stats.averagePopulation
 * @param {number} stats.favoritesPopulation
 */
export function renderStats(stats) {
    const panel = document.querySelector("#stats_panel");
    if (!panel) return;
    clearElement(panel);

    const { totalCountries, averagePopulation, favoritesPopulation } = stats;

    // -------------------------------
    // KAARTEN MET GROTE GETALLEN
    // -------------------------------
    const cardsRow = createElement("div", "row gy-3 mb-3");

    const card1 = createStatCard("Aantal landen", totalCountries.toString());
    const card2 = createStatCard(
        "Gemiddelde populatie",
        averagePopulation.toLocaleString("nl-BE")
    );
    const card3 = createStatCard(
        "Totale populatie favorieten",
        favoritesPopulation.toLocaleString("nl-BE")
    );

    cardsRow.appendChild(card1);
    cardsRow.appendChild(card2);
    cardsRow.appendChild(card3);
    panel.appendChild(cardsRow);

    // -------------------------------
    // BALKEN: VAN BENEDEN NAAR BOVEN
    // -------------------------------
    const barRow = createElement("div", "row bar-chart-row");
    panel.appendChild(barRow);

    const maxValue = Math.max(totalCountries, averagePopulation, favoritesPopulation);

    createStatBar(barRow, totalCountries, maxValue, "blue", "Aantal landen");
    createStatBar(barRow, averagePopulation, maxValue, "green", "Gem. populatie");
    createStatBar(barRow, favoritesPopulation, maxValue, "yellow", "Populatie favorieten");
}

/** Kaart met een label + groot getal */
function createStatCard(label, valueText) {
    const col = createElement("div", "col-md-4");
    const card = createElement("div", "border rounded p-3 h-100");

    const labelEl = createElement("div", "small text-muted mb-1", label);
    const valueEl = createElement("div", "h5 mb-0", valueText);

    card.appendChild(labelEl);
    card.appendChild(valueEl);
    col.appendChild(card);
    return col;
}

/** Balk voor onderaan - van beneden naar boven vullen */
function createStatBar(container, value, maxValue, colorClass, labelText) {
    const col = createElement("div", "col-md-4 d-flex flex-column align-items-center");

    const percent = (value / maxValue) * 100;

    const barWrapper = createElement("div", "stat-bar-wrapper w-100 mb-2");
    barWrapper.style.height = "150px"; // hoogte van de bar chart
    barWrapper.style.display = "flex";
    barWrapper.style.alignItems = "flex-end"; // zorgt dat bar aan de onderkant start

    const barFill = createElement("div", `stat-bar-fill ${colorClass}`);
    barFill.style.height = percent + "%"; // hoogte ipv breedte
    barFill.style.width = "50%"; // optioneel: breedte van de balk
    barFill.style.transition = "height 0.5s"; // mooi effect bij verandering

    barWrapper.appendChild(barFill);

    const barLabel = createElement("div", "stat-bar-text text-center mt-1", labelText);

    col.appendChild(barWrapper);
    col.appendChild(barLabel);
    container.appendChild(col);
}
