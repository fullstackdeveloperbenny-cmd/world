const COUNTRIES_API_URL =
    "https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,population,capital,languages,currencies,latlng";
/**
 * Haalt alle landen op via de REST Countries API.
 * @returns {Promise<Array>} array van landen
 */
export async function fetchAllCountries() {
// TODO:
// - gebruik fetch om COUNTRIES_API_URL op te halen
// - controleer res.ok
// - parse JSON en geef de array terug
// - gooi een fout bij problemen

    try {
        const res = await fetch(COUNTRIES_API_URL);
        if (!res.ok) {
            throw new Error(`HTTP fout: ${res.status}`);
        }
        const data = await res.json();
        //dit is om te controleren of het echt een array is
        if (!Array.isArray(data)) {
            throw new Error("API antwoord is geen array");
        }
        return data;
    } catch (err) {
        console.error("Fout bij fetchAllCountries():", err);
        throw err;
    }
}


