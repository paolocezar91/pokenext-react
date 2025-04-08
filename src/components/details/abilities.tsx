import { IPokemon } from "pokeapi-typescript";

export default function PokemonAbilities({ pokemon }: { pokemon: IPokemon }) {
  return (<div className="pokemon-abilities mt-2">
    <h3 className="text-lg font-semibold mb-4">- Abilities -</h3>
    <ul className="list-disc pl-5">
      {pokemon.abilities.map((ability, i) => (
        <li key={i} className="capitalize">
          {ability.ability.name}
        </li>
      ))}
    </ul>
  </div>);
}
