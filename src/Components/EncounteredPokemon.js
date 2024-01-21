import { useState } from "react";
import PokemonCard from "./PokemonCard";
import Battle from "./Battle/Battle";

function EncounteredPokemon({ pokemon, handleReset, usersPokedex, setUsersPokedex }) {

    const [pokemonSelected, setPokemonSelected] = useState(null);

    const sendData = () => {
        // checks if pokemon with which we won already is in not in our pokedex
        if (!usersPokedex.find(pokemonFromPokedex => pokemonFromPokedex.id === pokemon.id)) {
            setUsersPokedex([...usersPokedex, pokemon]);
        }
    }
    function winnerFunction(data, bool) {
        if (bool) {
            pokemon = data;
            sendData();
        }
        else {
            handleReset();
        }
    }

    return (
        <div className="encounteredPokemonContainer">
            <div className="encounteredPokemon">
                <h2>Encountered Pokémon</h2>
                <h3>{pokemon.name}</h3>
                {pokemon.sprites && (
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                )}
                <button onClick={handleReset}>Reset</button>
            </div>

            <div className="pokedex">
                <h2>POKEDEX</h2>
                {usersPokedex && (usersPokedex.map((pokemonData) => (
                    <PokemonCard key={pokemonData.id} pokemon={pokemonData} handleClick={() => setPokemonSelected(pokemonData)} />
                )))}

            </div>
            {pokemonSelected && (
                <Battle enemyPoke={pokemon} ourPoke={pokemonSelected} winnerFunction={winnerFunction} />
            )}

        </div>
    );
}

export default EncounteredPokemon;