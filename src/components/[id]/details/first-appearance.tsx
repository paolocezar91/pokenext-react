import SkeletonBlock from "@/components/shared/skeleton-block";
import { capitilize, kebabToSpace, normalizeVersionGroup, normalizeGeneration } from "@/components/shared/utils";
import { IPokemon, IPokemonSpecies } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export default function PokemonFirstAppearance({ pokemon, species }: { pokemon: IPokemon, species: IPokemonSpecies }) {
  const normalize = (text: string) => capitilize(kebabToSpace(text));
  const { t } = useTranslation('common');
  const versionA = pokemon.game_indices[0]?.version.name;
  const versionB = pokemon.game_indices[1]?.version.name;
  let group = '';

  if(versionB) {
    group = normalizeVersionGroup(`${versionA}-${versionB}`);
  }

  return pokemon.game_indices.length !== 0 && <div className="pokemon-first-appearance col-span-6 md:col-span-2">
    <h3 className="w-fit text-lg font-semibold mb-2">{t('pokedex.details.firstSeen.title')}</h3>
    { group ?
      <p>{group} ({species ? normalizeGeneration(species.generation.name):<SkeletonBlock />})</p> :
      <p>{normalize(versionA)} ({species ? normalize(species.generation.name):<SkeletonBlock />})</p>
    }
  </div>;
}