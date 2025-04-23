import { capitilize, kebabToSpace, normalizeVersionGroup } from "@/components/shared/utils";
import { IPokemon, IPokemonSpecies } from "pokeapi-typescript";

export default function PokemonFirstAppearance({ pokemon, species }: { pokemon: IPokemon, species: IPokemonSpecies }) {
  const normalize = (text: string) => capitilize(kebabToSpace(text));

  const versionA = pokemon.game_indices[0]?.version.name;
  const versionB = pokemon.game_indices[1]?.version.name;
  let group = '';

  if(versionB) {
    group = normalizeVersionGroup(`${versionA}-${versionB}`);
  }

  return pokemon.game_indices.length !== 0 && <div className="pokemon-first-appearance col-span-6 md:col-span-3">
    <h3 className="text-lg font-semibold mb-2">First seen on</h3>
    { group ?
      <p>{group} ({normalize(species.generation.name)})</p> :
      <p>{normalize(versionA)} ({normalize(species.generation.name)})</p>
    }
  </div>;
}