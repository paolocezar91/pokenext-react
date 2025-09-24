import SkeletonBlock from "@/components/shared/skeleton-block";
import {
  capitilize,
  kebabToSpace,
  normalizeVersionGroup,
  normalizeGeneration,
} from "@/components/shared/utils";
import { Pokemon, PokemonSpecies } from "pokeapi-typescript";
import { useTranslations } from "next-intl";

export default function PokemonFirstAppearance({
  pokemon,
  species,
}: {
  pokemon: Pokemon;
  species: PokemonSpecies;
}) {
  const normalize = (text: string) => capitilize(kebabToSpace(text));
  const t = useTranslations();
  const versionA = pokemon.game_indices[0]?.version.name;
  const versionB = pokemon.game_indices[1]?.version.name;
  let group = "";

  if (versionB) {
    group = normalizeVersionGroup(`${versionA}-${versionB}`);
  }

  const renderGroup = () => {
    if (!species) {
      return (
        <>
          <SkeletonBlock />
        </>
      );
    }

    if (group) {
      return (
        <>
          {group} ({normalizeGeneration(species.generation.name)})
        </>
      );
    } else {
      return (
        <>
          {normalize(versionA)} ({normalize(species.generation.name)})
        </>
      );
    }
  };

  return (
    pokemon.game_indices.length !== 0 &&
      <div className="pokemon-first-appearance col-span-6 md:col-span-2">
        <h3 className="w-fit text-lg font-semibold mb-2">
          {t("pokedex.details.firstSeen.title")}
        </h3>
        <div className="mt-2">{renderGroup()}</div>
      </div>

  );
}
