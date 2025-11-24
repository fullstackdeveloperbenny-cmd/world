const STORAGE_KEY = "world-explorer-favorites";
/**
 * Lees favorieten uit localStorage.
 * @returns {Array} lijst van favoriete landen (of lege array)
 */
export function loadFavorites() {

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data): [];
    }catch (error) {
        console.error("Laden van favorities niet gelukt", error);
        return [];
    }
}
// TODO:
// - lees uit localStorage met STORAGE_KEY
// - parse JSON
// - ga veilig om met null / parse errors

/**
 * Schrijf favorieten naar localStorage.
 * @param {Array} favorites
 */
export function saveFavorites(favorites) {
// TODO:
// - stringify favorites
// - schrijf naar localStorage

    // slaan op in JSOn
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}