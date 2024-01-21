function PokemonCard({pokemon,handleClick}){

    return(
        <div onClick={() => handleClick(pokemon)}>
            <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            {pokemon.sprites && (
                <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
            )}
        </div>
    );
}
export default PokemonCard;