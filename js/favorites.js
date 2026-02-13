// Favorites management using localStorage

let favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];

function getFavorites() {
    return favorites;
}

function toggleFavorite(pokemonId) {
    const i = favorites.indexOf(pokemonId);
    if (i > -1) favorites.splice(i, 1);
    else favorites.push(pokemonId);
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
}

function isFavorite(pokemonId) {
    return favorites.includes(pokemonId);
}

const emptyMsg = '<p class="text-gray-500 italic">No favorites yet. Add some Pokemon to your favorites!</p>';

async function updateFavoritesList(favoritesList, fetchPokemonById, toggleFavoriteCallback) {
    if (favorites.length === 0) {
        favoritesList.innerHTML = emptyMsg;
        return;
    }

    const data = await Promise.all(favorites.map(id => fetchPokemonById(id)));
    favoritesList.innerHTML = data.map(({ id, name }) =>
        `<div class="favorite-badge">
            <span>${name[0].toUpperCase() + name.slice(1)}</span>
            <button type="button" class="remove-favorite" data-id="${id}" data-name="${name}" aria-label="Remove ${name}">×</button>
        </div>`
    ).join('');

    favoritesList.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', () => toggleFavoriteCallback(+btn.dataset.id, btn.dataset.name));
    });
}

function updateFavoriteButton(pokemonId) {
    const btn = document.querySelector(`[data-pokemon-id="${pokemonId}"]`);
    if (!btn) return;

    const fav = isFavorite(pokemonId);
    btn.classList.toggle('is-favorite', fav);
    const label = btn.querySelector('.favorite-text-content');
    if (label) label.textContent = fav ? 'Remove from Favorites' : 'Add to Favorites';
}
