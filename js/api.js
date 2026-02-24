/*
 * UITLEG: Dit bestand haalt Pokemon-gegevens op van de PokeAPI.
 * Het bouwt de URL, doet een fetch, en geeft de ruwe data terug (pokemon, species, types).
 * getPokemonById haalt alleen id en naam op (voor de favorietenlijst).
 *
 * FLOW: main.js en detail.js roepen getPokemon aan na zoeken of bij openen van de detailpagina.
 * favorites.js roept getPokemonById aan om namen te tonen bij favorieten-badges.
 */

const apiUrl = "https://pokeapi.co/api/v2";

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
