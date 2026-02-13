// API functions for fetching Pokemon data

const API = 'https://pokeapi.co/api/v2';

async function fetchPokemon(query) {
    const res = await fetch(`${API}/pokemon/${query}`);
    if (!res.ok) throw new Error('Pokemon not found');

    const pokemonData = await res.json();
    const speciesRes = await fetch(pokemonData.species.url);
    const speciesData = speciesRes.ok ? await speciesRes.json() : null;
    const typeData = await Promise.all(
        pokemonData.types.map(t => fetch(t.type.url).then(r => r.json()))
    );

    return { pokemonData, speciesData, typeData };
}

async function fetchPokemonById(id) {
    try {
        const data = await fetch(`${API}/pokemon/${id}`).then(r => r.json());
        return { id, name: data.name };
    } catch {
        return { id, name: `Pokemon #${id}` };
    }
}
