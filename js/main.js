/*
 * INDEXPAGINA (index.html) – alleen logica voor de zoekpagina.
 *
 * UITLEG: Luistert naar het zoekformulier, valideert de invoer (min/max lengte,
 * toegestane tekens), toont laadstatus, roept searchPokemon aan (partial search,
 * meerdere resultaten) en tekent de kaarten of een fout. Bij laden wordt de
 * favorietenlijst gevuld.
 *
 * FLOW: Pagina laadt → favorietenlijst getekend. Gebruiker zoekt → validatie →
 * loading → searchPokemon → drawSearchResultsList of showError.
 */

const form = document.getElementById("pokemonForm");
const searchInput = document.getElementById("pokemonInput");
const container = document.getElementById("pokemonContainer");
const favoritesListEl = document.getElementById("favoritesList");
const template = document.getElementById("searchResultTemplate");

const MIN_NAME_LENGTH = 2;
const MAX_SEARCH_LENGTH = 50;
// Alleen letters, cijfers, spaties en koppelteken (voor namen zoals "ho-oh").
const SEARCH_PATTERN = /^[a-z0-9\s\-]+$/;
// Alleen cijfers = zoeken op ID (mag 1 teken zijn, bv. "1").
const NUMERIC_ID_PATTERN = /^\d+$/;

function getValidationError(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "Vul een zoekterm in.";
  }
  const isNumericId = NUMERIC_ID_PATTERN.test(trimmed);
  if (!isNumericId && trimmed.length < MIN_NAME_LENGTH) {
    return "Voer minstens " + MIN_NAME_LENGTH + " tekens in (of zoek op ID, bv. 1 of 25).";
  }
  if (trimmed.length > MAX_SEARCH_LENGTH) {
    return "Zoekterm mag maximaal " + MAX_SEARCH_LENGTH + " tekens zijn.";
  }
  if (!SEARCH_PATTERN.test(trimmed.toLowerCase())) {
    return "Gebruik alleen letters, cijfers, spaties of een koppelteken.";
  }
  return null;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const rawInput = searchInput.value;
  const zoekterm = rawInput.trim().toLowerCase();

  const validationError = getValidationError(rawInput);
  if (validationError) {
    showError(container, validationError);
    return;
  }

  showLoading(container);

  function showResults(results) {
    if (results.length === 0) {
      showError(container, "Geen Pokemon gevonden voor \"" + zoekterm + "\". Probeer een andere zoekterm.");
      return;
    }
    drawSearchResultsList(results, template, container);
  }

  // Zoeken op ID (alleen cijfers) → exacte match via getPokemon.
  if (NUMERIC_ID_PATTERN.test(zoekterm)) {
    getPokemon(zoekterm)
      .then(function (result) {
        showResults([result]);
      })
      .catch(function (err) {
        showError(container, err.message);
      });
    return;
  }

  // Zoeken op naam → partial search, meerdere resultaten.
  searchPokemon(zoekterm)
    .then(showResults)
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
