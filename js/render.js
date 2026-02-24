/*
 * UITLEG: Dit bestand tekent wat de gebruiker ziet: zoekresultaat-kaartje, volledige
 * Pokemon-kaart, type-matchups, laad- en foutmeldingen. Er wordt met templates en
 * innerHTML gewerkt; geen frameworks.
 *
 * FLOW: main.js roept drawSearchResultCard aan na een geslaagde zoekactie. detail.js
 * roept drawPokemonCard aan als de detailpagina geladen is. showLoading/showError
 * worden gebruikt tijdens het ophalen van data.
 */

// Tekent het kleine zoekresultaat-kaartje met link naar detail.html.
function drawSearchResultCard(pokemonData, template, container) {
  const card = template.content.cloneNode(true);

  let imgUrl = pokemonData.sprites.front_default;
  if (pokemonData.sprites.other && pokemonData.sprites.other["offi cial-artwork"]) {
    if (pokemonData.sprites.other["official-artwork"].front_default) {
      imgUrl = pokemonData.sprites.other["official-artwork"].front_default;
    }
  }

  card.querySelector(".search-result-name").textContent = pokemonData.name;
  card.querySelector(".id-value").textContent = pokemonData.id;
  card.querySelector(".search-result-image").src = imgUrl;
  card.querySelector(".search-result-image").alt = pokemonData.name;

  const typesEl = card.querySelector(".search-result-types");
  let typesHtml = "";
  for (let i = 0; i < pokemonData.types.length; i++) {
    const typeName = pokemonData.types[i].type.name;
    typesHtml +=
      '<span class="type-badge type-' + typeName + '">' + typeName + "</span>";
  }
  typesEl.innerHTML = typesHtml;

  const link = card.querySelector(".search-result-link");
  link.href = "detail.html?id=" + pokemonData.id;

  container.innerHTML = "";
  container.appendChild(card);
}

// Tekent de volledige kaart op de detailpagina (stats, details, types, favoriet-knop).
function drawPokemonCard(pokemonData, speciesData, typeData, template, container, isFavoriteFn, toggleFavoriteFn) {
  const card = template.content.cloneNode(true);

  let imgUrl = pokemonData.sprites.front_default;
  if (pokemonData.sprites.other && pokemonData.sprites.other["official-artwork"]) {
    if (pokemonData.sprites.other["official-artwork"].front_default) {
      imgUrl = pokemonData.sprites.other["official-artwork"].front_default;
    }
  }

  card.querySelector(".pokemon-name").textContent = pokemonData.name;
  card.querySelector(".id-value").textContent = pokemonData.id;
  card.querySelector(".pokemon-image").src = imgUrl;
  card.querySelector(".pokemon-image").alt = pokemonData.name;

  const typesEl = card.querySelector(".pokemon-types");
  let typesHtml = "";
  for (let i = 0; i < pokemonData.types.length; i++) {
    const typeName = pokemonData.types[i].type.name;
    typesHtml +=
      '<span class="type-badge type-' + typeName + '">' + typeName + "</span>";
  }
  typesEl.innerHTML = typesHtml;

  const statsEl = card.querySelector(".pokemon-stats");
  const rowClass = "flex justify-between items-center py-3 border-b border-gray-200 last:border-0";
  let statsHtml = "";
  for (let i = 0; i < pokemonData.stats.length; i++) {
    const stat = pokemonData.stats[i];
    let statLabel = stat.stat.name.replace("-", " ");
    statsHtml += '<div class="' + rowClass + '">';
    statsHtml += '<span class="text-gray-500 capitalize text-sm font-semibold tracking-wide">' + statLabel + "</span>";
    statsHtml += '<span class="font-black text-black text-base">' + stat.base_stat + "</span>";
    statsHtml += "</div>";
  }
  statsEl.innerHTML = statsHtml;

  const heightNum = pokemonData.height / 10;
  const weightNum = pokemonData.weight / 10;
  const heightStr = heightNum.toFixed(1);
  const weightStr = weightNum.toFixed(1);

  let abilityNames = [];
  for (let i = 0; i < pokemonData.abilities.length; i++) {
    let rawName = pokemonData.abilities[i].ability.name;
    rawName = rawName.replace(/-/g, " ");
    const firstLetter = rawName.charAt(0).toUpperCase();
    const rest = rawName.slice(1);
    abilityNames.push(firstLetter + rest);
  }
  const abilityStr = abilityNames.join(", ");

  const detailsEl = card.querySelector(".pokemon-details-content");
  detailsEl.innerHTML =
    "<p class=\"py-1\"><span class=\"font-semibold text-gray-600\">Height</span> " +
    heightStr +
    " m</p>" +
    "<p class=\"py-1\"><span class=\"font-semibold text-gray-600\">Weight</span> " +
    weightStr +
    " kg</p>" +
    "<p class=\"py-1\"><span class=\"font-semibold text-gray-600\">Abilities</span> " +
    abilityStr +
    "</p>";

  const matchupsHtml = buildMatchupsHtml(typeData);
  card.querySelector(".pokemon-type-matchups-content").innerHTML = matchupsHtml;

  const favBtn = card.querySelector(".favorite-btn");
  favBtn.setAttribute("data-pokemon-id", pokemonData.id);
  const isFav = isFavoriteFn(pokemonData.id);
  if (isFav) {
    favBtn.classList.add("is-favorite");
  } else {
    favBtn.classList.remove("is-favorite");
  }
  const btnLabel = favBtn.querySelector(".favorite-text-content");
  if (btnLabel !== null) {
    if (isFav) {
      btnLabel.textContent = "Remove from Favorites";
    } else {
      btnLabel.textContent = "Add to Favorites";
    }
  }
  favBtn.addEventListener("click", function () {
    toggleFavoriteFn(pokemonData.id, pokemonData.name);
  });

  container.innerHTML = "";
  container.appendChild(card);
}

// Maakt HTML voor "Countered by" en "Counters" op basis van typeData.
function buildMatchupsHtml(typeData) {
  const weakTo = [];
  const strongAgainst = [];

  for (let t = 0; t < typeData.length; t++) {
    const typeInfo = typeData[t];
    const relations = typeInfo.damage_relations;

    if (relations.double_damage_from) {
      for (let i = 0; i < relations.double_damage_from.length; i++) {
        const name = relations.double_damage_from[i].name;
        if (weakTo.indexOf(name) === -1) {
          weakTo.push(name);
        }
      }
    }
    if (relations.double_damage_to) {
      for (let i = 0; i < relations.double_damage_to.length; i++) {
        const name = relations.double_damage_to[i].name;
        if (strongAgainst.indexOf(name) === -1) {
          strongAgainst.push(name);
        }
      }
    }
  }

  weakTo.sort();
  strongAgainst.sort();

  let html = "";
  if (weakTo.length > 0) {
    let weakStr = "";
    for (let i = 0; i < weakTo.length; i++) {
      weakStr += '<span class="type-badge type-' + weakTo[i] + '">' + weakTo[i] + "</span> ";
    }
    html +=
      '<p class="mb-2"><span class="font-semibold text-gray-600">Countered by</span> (weak to): ' +
      weakStr +
      "</p>";
  } else {
    html += '<p class="mb-2"><span class="font-semibold text-gray-600">Countered by</span>: —</p>';
  }

  if (strongAgainst.length > 0) {
    let strongStr = "";
    for (let i = 0; i < strongAgainst.length; i++) {
      strongStr +=
        '<span class="type-badge type-' +
        strongAgainst[i] +
        '">' +
        strongAgainst[i] +
        "</span> ";
    }
    html +=
      '<p class="mb-3"><span class="font-semibold text-gray-600">Counters</span> (strong vs): ' +
      strongStr +
      "</p>";
  } else {
    html += '<p class="mb-3"><span class="font-semibold text-gray-600">Counters</span>: —</p>';
  }

  return html;
}

// Toont een laad-spinner in de container.
function showLoading(container) {
  container.innerHTML =
    '<div class="text-center text-gray-500 py-20">' +
    '<div class="inline-block p-10 glass-card">' +
    '<div class="animate-spin rounded-full h-14 w-14 border-4 border-indigo-100 border-t-indigo-600 mx-auto mb-6"></div>' +
    "<p class=\"text-lg font-semibold text-gray-700\">Loading Pokemon...</p>" +
    "</div>" +
    "</div>";
}

// Toont een foutmelding in de container (tekst wordt geëscaped).
function showError(container, message) {
  const safeMessage = escapeHtml(message);
  container.innerHTML =
    '<div class="text-center py-20">' +
    '<div class="inline-block p-10 glass-card border-2 border-red-200 bg-red-50">' +
    "<p class=\"text-lg font-semibold text-red-700\">" +
    safeMessage +
    "</p>" +
    "<p class=\"text-gray-600 mt-2\">Try another name or ID.</p>" +
    "</div>" +
    "</div>";
}

// Maakt tekst veilig voor in HTML (tegen XSS).
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
