import SkeletonBlock from "@/components/shared/skeleton-block";
import { capitilize, kebabToSpace } from "@/components/shared/utils";
import { IPokemonSpecies } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

function PokemonMiscSkeleton() {
  const { t } = useTranslation('common');

  return <>
    {
      [
        [t('pokedex.details.misc.eggGroups')],
        [t('pokedex.details.misc.baby')],
        [t('pokedex.details.misc.legendary')],
        [t('pokedex.details.misc.mythical')],
        [t('pokedex.details.misc.growthRate')],
        // [t('pokedex.details.misc.captureRate')],
        [t('pokedex.details.misc.hatchCounter')],
      ].map(([title]) => {
        return <div className="pokemon-misc" key={title}>
          <h3 className="w-fit text-lg font-semibold mb-2">{title}</h3>
          <SkeletonBlock className="mt-1.5" />
        </div>;
      })
    }
  </>;
}

export default function PokemonMisc({
  species
} : {
  species: IPokemonSpecies & { is_legendary?: boolean; is_mythical?: boolean } | null
}) {
  const { t } = useTranslation('common');
  if(!species){
    return <PokemonMiscSkeleton />;
  }

  const normalize = (text: string) => {
    return capitilize(kebabToSpace(text));
  };

  // const captureRate = species.capture_rate / 3;
  return <>
    {
      [
        [t('pokedex.details.misc.eggGroups'), species?.egg_groups.map(eg => normalize(eg.name)).join(', ')],
        [t('pokedex.details.misc.baby'), species.is_baby ? t('pokedex.details.misc.yes') : t('pokedex.details.misc.no')],
        [t('pokedex.details.misc.legendary'), species.is_legendary ? t('pokedex.details.misc.yes') : t('pokedex.details.misc.no')],
        [t('pokedex.details.misc.mythical'), species.is_mythical ? t('pokedex.details.misc.yes'): t('pokedex.details.misc.no')],
        [t('pokedex.details.misc.growthRate'), normalize(species.growth_rate.name) ],
        // [t('pokedex.details.misc.captureRate'), `${species.capture_rate} (${captureRate.toFixed(2)}%)`],
        [t('pokedex.details.misc.hatchCounter'), species.hatch_counter]
      ].map(([title, value]) => {
        return <div className="pokemon-misc" key={title}>
          <h3 className="w-fit text-lg font-semibold mb-2">{title}</h3>
          {value}
        </div>;
      })
    }
  </>;
}