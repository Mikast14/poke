// Main app – init and event handlers

const form = document.getElementById('pokemonForm');
const pokemonInput = document.getElementById('pokemonInput');
const pokemonContainer = document.getElementById('pokemonContainer');
const favoritesList = document.getElementById('favoritesList');
const template = document.getElementById('pokemonCardTemplate');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = pokemonInput.value.trim().toLowerCase();
    if (!v) return;

    showLoading(pokemonContainer);
    try {
        const { pokemonData, speciesData, typeData } = await fetchPokemon(v);
        renderPokemonCard(pokemonData, speciesData, typeData, template, pokemonContainer, isFavorite, handleToggleFavorite);
    } catch (err) {
        showError(pokemonContainer, err.message);
    }
});

function handleToggleFavorite(pokemonId, pokemonName) {
    toggleFavorite(pokemonId, pokemonName);
    updateFavoritesList(favoritesList, fetchPokemonById, handleToggleFavorite);
    updateFavoriteButton(pokemonId);
}

document.addEventListener('DOMContentLoaded', () => {
    updateFavoritesList(favoritesList, fetchPokemonById, handleToggleFavorite);
});
