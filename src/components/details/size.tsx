import { IPokemon } from "pokeapi-typescript";

export default function PokemonSize({ pokemon }: { pokemon: IPokemon }) {
  return (<div className="pokemon-size mt-2">
    <h3 className="text-lg font-semibold mb-4">- Size -</h3>
    <p>Height: {pokemon.height / 10} m</p>
    <p>Weight: {pokemon.weight / 10} kg</p>
  </div>);
}