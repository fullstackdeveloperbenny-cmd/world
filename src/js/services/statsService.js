const EXCHANGE_API_BASE = "https://open.er-api.com/v6/latest";
/**
 * Haal wisselkoers op van EUR naar currencyCode.
 * @param {string} currencyCode bijv. "USD"
 * @returns {Promise<number|null>} wisselkoers of null bij fout
 */
export async function fetchRateToEuro(currencyCode) {
    try {
        // URL opbouwen: we vragen de rates gebaseerd op EUR
        const url = `${EXCHANGE_API_BASE}/EUR`;

        const response = await fetch(url);
        if (!response.ok) return null;

        const data = await response.json();

        // juiste rate eruit halen
        const rate = data.rates?.[currencyCode];

        // check of rate bestaat
        if (typeof rate !== "number") return null;

        return rate;

    } catch (error) {
        console.error("Fout bij ophalen wisselkoers:", error);
        return null;
    }
}
/**
 * Bereken statistieken op basis van gefilterde landen en favorieten.
 * @param {Array} countries huidige gefilterde landen
 * @param {Array} favorites lijst van favorieten
 */
export function calculateStats(countries, favorites, allCountries) {
    const totalCountries = countries.length;
    const populations= []
    for (const country of countries) {
        populations.push(country.population);
    }
    let sum = 0;
    for (const pop of populations) {
        sum += pop;
    }
    const averagePopulation = populations.length > 0
        ? Math.ceil(sum / populations.length)
        : 0;

    let favoritesPopulation = 0;
    for (const fav of favorites) {
        const full = allCountries?.find(c => c.cca3 === fav.cca3);
        if (full && typeof full.population === 'number') {
            favoritesPopulation += full.population;
        }
    }

// TODO:
// - totalCountries V
// - averagePopulation  V
// - favoritesPopulation !!! NOG NIET AFGEWERKT
    return {
        totalCountries,
        averagePopulation,
        favoritesPopulation,
    };
}
