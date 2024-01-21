// import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import EncounteredPokemon from './Components/EncounteredPokemon';

function App() {

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [encounteredPoke, setEncounteredPokemon] = useState(null);
  const [usersPokedex, setUsersPokedex] = useState([]);

  // const [usersPokedexUpdated, setUsersPokedexUpdated] = useState([]);

  async function fetchLocations() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/location');
      const data = await response.json();
      const { results } = data;
      setLocations(results.slice(0, 20));
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  async function fetchUsersPokedexAsync() {
    try {
      const startUrls = ["https://pokeapi.co/api/v2/pokemon/bulbasaur", "https://pokeapi.co/api/v2/pokemon/charizard", "https://pokeapi.co/api/v2/pokemon/poliwhirl"];
      const responses = await Promise.all(startUrls.map(url => fetch(url)));
      const data = await Promise.all(responses.map(response => response.json()));
      setUsersPokedex(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchLocations();
    fetchUsersPokedexAsync();
  }, []);

  const handelLocationClick = async (location) => {
    setSelectedLocation(location);
    setEncounteredPokemon(null);

    try {
      const arearesponse = await fetch("https://pokeapi.co/api/v2/location-area/1/");
      const areaData = await arearesponse.json();
      const { pokemon_encounters } = areaData;

      if (pokemon_encounters.length > 0) {
        const randomIndex = Math.floor(Math.random() * pokemon_encounters.length);
        const encounteredPokemonUrl = pokemon_encounters[randomIndex].pokemon.url;
        const pokemonResponse = await fetch(encounteredPokemonUrl);
        const pokemonData = await pokemonResponse.json();
        setEncounteredPokemon(pokemonData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setSelectedLocation(null);
    setEncounteredPokemon(null);
  };

  return (
    <div className="App">
      {!selectedLocation ? (
        <>
          <h2>Locations</h2>
          {locations.map((location) => (
            <h3 key={location.name} onClick={() => handelLocationClick(location)}>
              {location.name}
            </h3>
          ))}
        </>
      ) : encounteredPoke ? (
        <EncounteredPokemon pokemon={encounteredPoke} handleReset={handleReset} usersPokedex={usersPokedex} setUsersPokedex={setUsersPokedex}></EncounteredPokemon>
      ) : (
        <>
          <p>This location doesn't seem to have any Pokémon</p>
          <button onClick={handleReset}>Retry</button>
        </>
      )}
    </div>
  );
}

export default App;
