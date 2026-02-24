/*
 * DETAILPAGINA (detail.html) – alle logica voor de detailpagina staat hier.
 *
 * UITLEG: Leest het id uit de URL (bijv. detail.html?id=25), haalt de volledige
 * Pokemon-data op en tekent de grote kaart. handleToggleFavorite is de favoriet-knop
 * op deze pagina (toevoegen/verwijderen en knoptekst bijwerken).
 *
 * FLOW: Open detail.html?id=... → id uit URL → showLoading → getPokemon(id) →
 * drawPokemonCard. Klik op favoriet-knop → handleToggleFavorite → updateFavoriteButton.
 */

// Leest een query-parameter uit de URL (bijv. ?id=25 → id = "25").
function getParam(name) {
  const url = window.location.search;
  const parts = url.split("?");
  if (parts.length < 2) return null;
  const pairs = parts[1].split("&");
  for (let i = 0; i < pairs.length; i++) {
    const keyValue = pairs[i].split("=");
    if (keyValue[0] === name) {
      return keyValue[1];
    }
  }
  return null;
}

// Bij klik op favoriet: toggle en knop op de pagina bijwerken.
function handleToggleFavorite(pokemonId, pokemonName) {
  toggleFavorite(pokemonId, pokemonName);
  updateFavoriteButton(pokemonId);
}

const container = document.getElementById("pokemonContainer");
const template = document.getElementById("pokemonCardTemplate");

const id = getParam("id");
if (id === null || id === "") {
  showError(container, "No Pokemon selected. Go back and search for a Pokemon.");
} else {
  showLoading(container);
  getPokemon(id)
    .then(function (result) {
      drawPokemonCard(
        result.pokemonData,
        result.speciesData,
        result.typeData,
        template,
        container,
        isFavorite,
        handleToggleFavorite
      );
    })
    .catch(function (err) {
      showError(container, err.message);
    });
}
