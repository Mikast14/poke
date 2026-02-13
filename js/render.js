// Rendering functions for Pokemon cards

/** Renders a Pokemon card from template into container. */
function renderPokemonCard(pokemonData, speciesData, typeData, template, container, isFavorite, toggleFavoriteCallback) {
    const card = template.content.cloneNode(true);
    const img = pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default;

    card.querySelector('.pokemon-name').textContent = pokemonData.name;
    card.querySelector('.id-value').textContent = pokemonData.id;
    card.querySelector('.pokemon-image').src = img;
    card.querySelector('.pokemon-image').alt = pokemonData.name;

    const typesEl = card.querySelector('.pokemon-types');
    typesEl.innerHTML = pokemonData.types.map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`).join('');

    const statsEl = card.querySelector('.pokemon-stats');
    const statRow = 'flex justify-between items-center py-3 border-b border-gray-200 last:border-0';
    statsEl.innerHTML = pokemonData.stats.map(s => `
        <div class="${statRow}">
            <span class="text-gray-500 capitalize text-sm font-semibold tracking-wide">${s.stat.name.replace('-', ' ')}</span>
            <span class="font-black text-black text-base">${s.base_stat}</span>
        </div>
    `).join('');

    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.dataset.pokemonId = pokemonData.id;
    const favorited = isFavorite(pokemonData.id);
    favoriteBtn.classList.toggle('is-favorite', favorited);
    const label = favoriteBtn.querySelector('.favorite-text-content');
    if (label) label.textContent = favorited ? 'Remove from Favorites' : 'Add to Favorites';

    favoriteBtn.addEventListener('click', () => toggleFavoriteCallback(pokemonData.id, pokemonData.name));

    container.innerHTML = '';
    container.appendChild(card);
}

/**
 * Shows loading state
 * @param {HTMLElement} container - Container element
 */
function showLoading(container) {
    container.innerHTML = `
        <div class="text-center text-gray-500 py-20">
            <div class="inline-block p-10 glass-card">
                <div class="animate-spin rounded-full h-14 w-14 border-4 border-indigo-100 border-t-indigo-600 mx-auto mb-6"></div>
                <p class="text-lg font-semibold text-gray-700">Loading Pokemon...</p>
            </div>
        </div>
    `;
}


