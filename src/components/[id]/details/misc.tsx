import { capitilize, kebabToSpace } from "@/components/shared/utils";
import { IPokemonSpecies } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export default function PokemonMisc({
  species
} : {
  species: IPokemonSpecies & { is_legendary?: boolean; is_mythical?: boolean }
}) {
  const { t } = useTranslation('common');
  const normalize = (text: string) => {
    return capitilize(kebabToSpace(text));
  };

  const captureRate = species.capture_rate / 3;
  return <div className="pokemon-misc mt-2">
    <div className="flex flex-wrap gap-4">
      {
        [
          [t('pokedex.details.misc.eggGroups'), species?.egg_groups.map(eg => normalize(eg.name)).join(', ')],
          [t('pokedex.details.misc.baby'), species.is_baby ? t('pokedex.details.misc.yes') : t('pokedex.details.misc.no')],
          [t('pokedex.details.misc.legendary'), species.is_legendary ? t('tpokedex.details.misc.yes') : t('pokedex.details.misc.no')],
          [t('pokedex.details.misc.mythical'), species.is_mythical ? t('pokedex.details.misc.yes'): t('pokedex.details.misc.no')],
          [t('pokedex.details.misc.growthRate'), normalize(species.growth_rate.name) ],
          [t('pokedex.details.misc.captureRate'), `${species.capture_rate} (${captureRate.toFixed(2)}%)`],
          [t('pokedex.details.misc.hatchCounter'), species.hatch_counter]
        ].map(([key, value]) => {
          return <div className="" key={key}>
            <small className="block border-b-2 mb-1">{key}:</small>
            <small>{value}</small>
          </div>;
        })
      }
    </div>
  </div>;
}