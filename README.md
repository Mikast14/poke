# Pokemon Explorer

A simple web app to discover and explore Pokemon. Search by name or ID, view stats and details, and save your favorites.

## Bestandsstructuur / File structure

| Bestand      | Pagina        | Doel |
|-------------|---------------|------|
| `index.html` + `js/main.js`   | Zoekpagina    | Zoeken, zoekresultaat, favorietenlijst (badges met verwijder-knop) |
| `detail.html` + `js/detail.js` | Detailpagina | Volledige Pokemon-kaart, favoriet-knop (toevoegen/verwijderen) |
| `js/api.js`      | Beide         | Ophalen van Pokemon-data (PokeAPI) |
| `js/favorites.js`| Beide         | Favorieten in localStorage, lijst tekenen, knop bijwerken |
| `js/render.js`   | Beide         | Tekenen van kaarten, loading, foutmeldingen |
| `styles.css`     | Beide         | Styling |

## How to run

Use a local dev server (e.g. [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code/Cursor). Open the project folder and run the server.

## What it does

- **Search** — Enter a Pokemon name (e.g. pikachu) or ID (e.g. 25) to look it up
- **View** — See sprite, types, and stats for each Pokemon
- **Favorites** — Add Pokemon to a favorites list (stored in your browser)

Built with HTML, CSS (Tailwind), and vanilla JavaScript. Uses the [PokeAPI](https://pokeapi.co/) for data.
