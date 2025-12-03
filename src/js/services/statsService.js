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
<<<<<<< HEAD
/**
 * Bereken statistieken op basis van gefilterde landen en favorieten.
 * @param {Array} countries huidige gefilterde landen
 * @param {Array} favorites lijst van favorieten
 */
export function calculateStats(countries, favorites) {
=======
export function calculateStats(countries, favorites, allCountries) {
>>>>>>> dev
    const totalCountries = countries.length;

<<<<<<< HEAD
    // gemiddelde populatie van alle landen
    const totalPopulation = countries.reduce(
        (sum, country) => sum + (country.population ?? 0),
        0
    );

    const averagePopulation =
        countries.length > 0
            ? Math.ceil(totalPopulation / countries.length)
            : 0;

    // totale populatie van alle favorieten
    const favoritesPopulation = favorites.reduce(
        (sum, fav) => sum + (fav.population ?? 0),
        0
    );

    return {
        totalCountries,
        averagePopulation,
        favoritesPopulation
=======
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
>>>>>>> dev
    };

}
