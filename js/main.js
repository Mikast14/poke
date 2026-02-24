/*
 * INDEXPAGINA (index.html) – alleen logica voor de zoekpagina.
 *
 * UITLEG: Luistert naar het zoekformulier, haalt de invoer op, toont laadstatus,
 * roept de API aan en tekent het zoekresultaat of een fout. Bij laden wordt de
 * favorietenlijst gevuld. handleRemoveFromFavoritesList is voor de knop "verwijder"
 * bij een favoriet-badge op deze pagina.
 *
 * FLOW: Pagina laadt → favorietenlijst getekend. Gebruiker zoekt → loading →
 * getPokemon → drawSearchResultCard. Klik op verwijderen bij een badge →
 * handleRemoveFromFavoritesList → lijst opnieuw getekend.
 */

const form = document.getElementById("pokemonForm");
const searchInput = document.getElementById("pokemonInput");
const container = document.getElementById("pokemonContainer");
const favoritesListEl = document.getElementById("favoritesList");
const template = document.getElementById("searchResultTemplate");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const zoekterm = searchInput.value.trim().toLowerCase();
  if (zoekterm === "") return;

  showLoading(container);
  getPokemon(zoekterm)
    .then(function (result) {
      drawSearchResultCard(result.pokemonData, template, container);
    })
    .catch(function (err) {
      showError(container, err.message);
    });
});

// Wordt aangeroepen als je op "verwijder" klikt bij een favoriet-badge op de indexpagina.
function handleRemoveFromFavoritesList(pokemonId, pokemonName) {
  toggleFavorite(pokemonId, pokemonName);
  updateFavoritesList(favoritesListEl, getPokemonById, handleRemoveFromFavoritesList);
}

document.addEventListener("DOMContentLoaded", function () {
  updateFavoritesList(favoritesListEl, getPokemonById, handleRemoveFromFavoritesList);
});
