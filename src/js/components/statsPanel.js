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

// Kaarten met cijfers
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
// Eenvoudige bar chart
// Container voor verticale bars naast elkaar
    const barContainer = createElement("div", "d-flex align-items-end justify-content-between mt-4");
    barContainer.style.height = "200px"; // totale hoogte van de chart
    barContainer.style.width = "100%"; // volledige breedte gebruiken
    barContainer.style.gap = "1rem"; // ruimte tussen de bars

// Maximale waarden voor schaal
    const maxCountries = 250;
    const maxAvgPop = 32_077_999;
    const maxFavPop = 8_231_613_070;

// Bereken percentages
    const pctCountries = (stats.totalCountries / maxCountries) * 100;
    const pctAvgPop = (stats.averagePopulation / maxAvgPop) * 100;
    const pctFavPop = (stats.favoritesPopulation / maxFavPop) * 100;

    const bars = [
        { label: "Aantal landen", value: stats.totalCountries, percent: pctCountries },
        { label: "Gemiddelde populatie", value: stats.averagePopulation, percent: pctAvgPop },
        { label: "Populatie favorieten", value: stats.favoritesPopulation, percent: pctFavPop },
    ];

    bars.forEach(b => {
        const barWrapper = createElement("div", "d-flex flex-column-reverse align-items-center");
        barWrapper.style.flex = "1";
        barWrapper.style.display = "flex";
        barWrapper.style.flexDirection = "column-reverse";
        barWrapper.style.alignItems = "center";

        const barFill = createElement("div", "bg-primary rounded-top");
        barFill.style.width = "50%";
        barFill.style.height = "0px";
        barFill.style.transition = "height 0.5s";

        const label = createElement("div", "mt-2 fw-bold", `${b.label}\n${b.value.toLocaleString("nl-BE")}`);
        label.style.whiteSpace = "pre-line";
        label.style.textAlign = "center";

        barWrapper.appendChild(barFill);
        barWrapper.appendChild(label);
        barContainer.appendChild(barWrapper);

        // Bereken hoogte in pixels
        const containerHeight = 200; // zelfde als barContainer.style.height
        const barHeight = Math.min(b.percent, 100) / 100 * containerHeight;

        requestAnimationFrame(() => {
            barFill.style.height = `${barHeight}px`;
        });
    });



    panel.appendChild(barContainer);

}
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