const pokemonListEl = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search");
const searchIdInput = document.getElementById("search-id");
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

let allPokemons = [];

function renderPokemons(list) {
    pokemonListEl.innerHTML = "";
    list.forEach(p => {
        const card = document.createElement("div");
        card.className = "pokemon-card";
        card.innerHTML = `
            <img src="${p.sprites.other['official-artwork'].front_default}" alt="${p.name}">
            <h5>${p.name}</h5>
            <div>${p.types.map(t => `<span class="badge-type" style="background-color:${typeColors[t.type.name]}">${t.type.name}</span>`).join("")}</div>
        `;
        card.onclick = () => showModal(p);
        pokemonListEl.appendChild(card);
    });
}

function showModal(p) {
    modalBody.innerHTML = `
        <h2>${p.name} (ID: ${p.id})</h2>
        <img src="${p.sprites.other['official-artwork'].front_default}" alt="${p.name}">
        <div class="modal-types">
            ${p.types.map(t => `<span class="badge-type" style="background-color:${typeColors[t.type.name]}">${t.type.name}</span>`).join("")}
        </div>
        <div class="modal-stats">
            ${p.stats.map(s => `
                <p>${s.stat.name.toUpperCase()}</p>
                <div class="stat-bar">
                    <div class="stat-bar-inner stat-${s.stat.name.replace(' ', '-').toLowerCase()}" style="width:${s.base_stat > 100 ? 100 : s.base_stat}%;"></div>
                </div>
            `).join('')}
        </div>
    `;
    modal.style.display = "flex";
}

closeModalBtn.onclick = () => modal.style.display = "none";
modal.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

searchInput.oninput = () => {
    const term = searchInput.value.toLowerCase();
    renderPokemons(allPokemons.filter(p => p.name.toLowerCase().includes(term)));
};

searchIdInput.onchange = () => {
    const id = searchIdInput.value;
    if (!id) return;
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(r => r.json())
        .then(p => showModal(p))
        .catch(() => alert("Pokémon não encontrado!"));
};

async function loadPokemons() {
    loadingEl.style.display = "block";
    try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await res.json();
        const pokemons = await Promise.all(data.results.map(p => fetch(p.url).then(r => r.json())));
        allPokemons = pokemons;
        loadingEl.style.display = "none";
        renderPokemons(allPokemons);
    } catch (err) {
        loadingEl.textContent = "Erro ao carregar Pokémon.";
        console.error(err);
    }
}

loadPokemons();