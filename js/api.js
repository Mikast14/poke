/*
 * UITLEG: Dit bestand haalt Pokemon-gegevens op van de PokeAPI.
 * Het bouwt de URL, doet een fetch, en geeft de ruwe data terug (pokemon, species, types).
 * getPokemonById haalt alleen id en naam op (voor de favorietenlijst).
 * searchPokemon haalt de volledige lijst op (gecached), filtert op partial match, en
 * haalt voor de eerste N matches de volledige data op.
 *
 * FLOW: main.js en detail.js roepen getPokemon aan na zoeken of bij openen van de detailpagina.
 * main.js roept searchPokemon aan voor partial search met meerdere resultaten.
 * favorites.js roept getPokemonById aan om namen te tonen bij favorieten-badges.
 */

const apiUrl = "https://pokeapi.co/api/v2";

// Gecachte Pokemon-lijst voor partial search (wordt eenmalig opgehaald).
let cachedPokemonList = null;
const SEARCH_RESULT_LIMIT = 12;

// Haalt de volledige Pokemon-lijst op (eenmalig, daarna uit cache).
async function getPokemonList() {
  if (cachedPokemonList !== null) {
    return cachedPokemonList;
  }
  const url = apiUrl + "/pokemon?limit=10000";
  const response = await fetch(url);
  if (response.ok === false) {
    throw new Error("Could not load Pokemon list");
  }
  const data = await response.json();
  const list = (data.results || []).map(function (item) {
    const id = item.url.replace(/\/$/, "").split("/").pop();
    return { id: id, name: item.name };
  });
  cachedPokemonList = list;
  return list;
}

// Partial search: filtert op naam (includes), haalt volledige data op voor max SEARCH_RESULT_LIMIT resultaten.
// Retourneert een array van hetzelfde formaat als getPokemon: { pokemonData, speciesData, typeData }.
async function searchPokemon(zoekterm) {
  const list = await getPokemonList();
  const term = zoekterm.toLowerCase().trim();
  const matches = list.filter(function (item) {
    return item.name.toLowerCase().includes(term);
  });
  const toFetch = matches.slice(0, SEARCH_RESULT_LIMIT);
  const results = await Promise.all(
    toFetch.map(function (item) {
      return getPokemon(item.id);
    })
  );
  return results;
}

// Haalt volledige data op: basisgegevens, species en type-info (voor detailpagina).
async function getPokemon(naamOfId) {
  const url = apiUrl + "/pokemon/" + naamOfId;
  const response = await fetch(url);
  if (response.ok === false) {
    throw new Error("Pokemon not found");
  }

  const data = await response.json();

  let speciesData = null;
  if (data.species && data.species.url) {
    const speciesResponse = await fetch(data.species.url);
    if (speciesResponse.ok) {
      speciesData = await speciesResponse.json();
    }
  }

  const typeData = [];
  for (let i = 0; i < data.types.length; i++) {
    const typeUrl = data.types[i].type.url;
    const typeResponse = await fetch(typeUrl);
    const typeJson = await typeResponse.json();
    typeData.push(typeJson);
  }

  return {
    pokemonData: data,
    speciesData: speciesData,
    typeData: typeData,
  };
}

// Haalt alleen id en naam op (voor de favorietenlijst op de startpagina).
async function getPokemonById(id) {
  try {
    const url = apiUrl + "/pokemon/" + id;
    const response = await fetch(url);
    const data = await response.json();
    return { id: id, name: data.name };
  } catch (err) {
    return { id: id, name: "Pokemon #" + id };
  }
}
