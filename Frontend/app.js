const pokemonListEl = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search");
const searchId = document.getElementById("search-id");
const loadingEl = document.getElementById("loading");
const modal = document.getElementById("pokemon-modal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.getElementById("close-modal");

const typeColors = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
    steel: '#B7B7CE', fairy: '#D685AD'
};

// Array para armazenar todos os Pokémon carregados
let allPokemons = [];

// Renderiza a lista de Pokémon na tela
function renderPokemons(pokemonList) {
    pokemonListEl.innerHTML = "";

    pokemonList.forEach(pokemon => {
        const card = document.createElement("div");
        card.className = "pokemon-card";

        card.innerHTML = `
            <h4>
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
            </h4>
            <br>
            <h5> #${pokemon.id} <br> ${pokemon.name}</h5>
            <div>${pokemon.types.map(typeInfo => `<span class="badge-type" style="background-color:${typeColors[typeInfo.type.name]}">${typeInfo.type.name}</span>`).join("")}</div>
        `;

        card.onclick = () => showPokemonModal(pokemon);

        pokemonListEl.appendChild(card);
    });
}

// Abre o modal com os detalhes de um Pokémon
function showPokemonModal(pokemon) {
    modalBody.innerHTML = `
        <h2>${pokemon.name} (ID: ${pokemon.id})</h2>
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        <div class="modal-types">
            ${pokemon.types.map(typeInfo => `<span class="badge-type" style="background-color:${typeColors[typeInfo.type.name]}">${typeInfo.type.name}</span>`).join("")}
        </div>
        <div class="modal-stats">
            ${pokemon.stats.map(statInfo => `
                <p>${statInfo.stat.name.toUpperCase()}</p>
                <div class="stat-bar">
                    <div class="stat-bar-inner stat-${statInfo.stat.name.replace(' ', '-').toLowerCase()}" style="width:${statInfo.base_stat > 100 ? 100 : statInfo.base_stat}%;"></div>
                </div>
            `).join('')}
        </div>
    `;
    modal.style.display = "flex";
}

// Fecha o modal
closeModalBtn.onclick = () => modal.style.display = "none";
modal.onclick = event => { if (event.target === modal) modal.style.display = "none"; };

// Busca dinâmica por nome enquanto o usuário digita
searchInput.oninput = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm));
    renderPokemons(filteredPokemons);
};

searchId.oninput = () => {
    const searchTerm = searchId.value.toLowerCase(); // pega o valor do input de ID
    const filteredPokemons = allPokemons.filter(pokemon => 
        pokemon.id.toString().includes(searchTerm) // converte id para string
    );
    renderPokemons(filteredPokemons);
};


// Carrega todos os Pokémon da API
async function loadAllPokemons() {
    loadingEl.style.display = "block";

    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();

    const detailedPokemons = [];

    // Busca detalhes de cada Pokémon em ordem
    for (const pokemonSummary of data.results) {
            const pokemonDetails = await fetch(pokemonSummary.url).then(res => res.json());
            detailedPokemons.push(pokemonDetails);
    }

    allPokemons = detailedPokemons;
    loadingEl.style.display = "none";
    renderPokemons(allPokemons);

}

// Inicializa a Pokédex
window.onload = loadAllPokemons;
