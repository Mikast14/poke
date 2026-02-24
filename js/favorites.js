/*
 * UITLEG: Hier worden favoriete Pokemon bijgehouden in het geheugen en in localStorage.
 * toggleFavorite voegt toe of haalt weg. De lijst wordt niet met splice gewijzigd maar
 * opnieuw opgebouwd (beginner-vriendelijk). updateFavoritesList tekent de badges op de pagina.
 *
 * FLOW: Bij laden (main.js) wordt de favorietenlijst getekend. Bij zoeken kan de gebruiker
 * op de detailpagina een favoriet toevoegen. Op index.html worden de badges getoond en
 * bij klik op verwijderen wordt toggleFavorite aangeroepen en de lijst opnieuw getekend.
 */

let favorites = [];
const saved = localStorage.getItem("pokemonFavorites");
if (saved) {
  favorites = JSON.parse(saved);
}

// Geeft de lijst met favoriet-id's terug.
function getFavorites() {
  return favorites;
}

// Voegt toe of verwijdert een pokemon uit de favorieten; slaat lijst op in localStorage.
function toggleFavorite(pokemonId) {
  let found = false;
  let index = 0;
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i] === pokemonId) {
      found = true;
      index = i;
      break;
    }
  }

  if (found) {
    const newList = [];
    for (let i = 0; i < favorites.length; i++) {
      if (i !== index) {
        newList.push(favorites[i]);
      }
    }
    favorites = newList;
  } else {
    favorites.push(pokemonId);
  }

  localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));
}

// Controleert of een pokemon in de favorieten zit.
function isFavorite(pokemonId) {
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i] === pokemonId) {
      return true;
    }
  }
  return false;
}

// Tekst als er nog geen favorieten zijn.
const noFavoritesText =
  '<p class="text-gray-500 italic">No favorites yet. Add some Pokemon to your favorites!</p>';

// Eerste letter hoofdletter (voor weergave van namen).
function capitalizeFirst(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Bouwt de favorieten-badges op de pagina en koppelt verwijder-knoppen.
async function updateFavoritesList(listEl, getPokemonByIdFn, toggleFn) {
  if (favorites.length === 0) {
    listEl.innerHTML = noFavoritesText;
    return;
  }

  let html = "";
  for (let i = 0; i < favorites.length; i++) {
    const id = favorites[i];
    const pokemon = await getPokemonByIdFn(id);
    const name = capitalizeFirst(pokemon.name);
    html += '<div class="favorite-badge">';
    html += '<a href="detail.html?id=' + id + '" class="text-white hover:underline">' + name + "</a>";
    html +=
      '<button type="button" class="remove-favorite" data-id="' +
      id +
      '" data-name="' +
      pokemon.name +
      '" aria-label="Remove ' +
      pokemon.name +
      '">';
    html +=
      '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">';
    html +=
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
    html += "</svg></button>";
    html += "</div>";
  }

  listEl.innerHTML = html;

  const buttons = listEl.querySelectorAll(".remove-favorite");
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    btn.addEventListener("click", function () {
      const pokemonId = Number(btn.getAttribute("data-id"));
      toggleFn(pokemonId, btn.getAttribute("data-name"));
    });
  }
}

// Past de favoriet-knop op de detailpagina aan (tekst en class).
function updateFavoriteButton(pokemonId) {
  const btn = document.querySelector('[data-pokemon-id="' + pokemonId + '"]');
  if (btn === null) return;

  const isFav = isFavorite(pokemonId);
  if (isFav) {
    btn.classList.add("is-favorite");
  } else {
    btn.classList.remove("is-favorite");
  }

  const label = btn.querySelector(".favorite-text-content");
  if (label !== null) {
    if (isFav) {
      label.textContent = "Remove from Favorites";
    } else {
      label.textContent = "Add to Favorites";
    }
  }
}
