const express = require('express');

const app = express();
const port = 4000;

app.get("/", (req, res) => {
    res.send("Rodando Pokedex!");
});

// Lista de Pokémon
app.get("/pokemons", async (req, res) => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    res.json(data.results);
});

// Detalhes do Pokémon
app.get("/pokemon/:id_ou_nome", async (req, res) => {
    const { id_ou_nome } = req.params;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id_ou_nome}`);
    const data = await response.json();

    const detalhes = {
        id: data.id,
        name: data.name,
        types: data.types.map(t => t.type.name),
        stats: data.stats.map(s => ({ name: s.stat.name, base: s.base_stat })),
        image: data.sprites.other['official-artwork'].front_default
    };

    res.json(detalhes);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:4000`);
});
