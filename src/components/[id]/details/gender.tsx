import Tooltip from "@/components/shared/tooltip/tooltip";
import { normalizePokemonName } from "@/components/shared/utils";
import { IPokemonSpecies } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";


export default function PokemonGender({ species }: { species: IPokemonSpecies }) {
  const { t } = useTranslation('common');
  const name = normalizePokemonName(species.name);

  const genderLess = <div className="genderless">
    <Tooltip content={t('pokedex.details.gender.genderless', { name })}>-</Tooltip>
  </div>;

  const femaleRate = species.gender_rate / 8 * 100;
  const maleRate = (8 - species.gender_rate) / 8 * 100;

  const femaleMaleRate = <>
    <div className="female w-full">
      <Tooltip content={t('pokedex.details.gender.femaleRate', { name, rate: femaleRate })}>
        <div className="inline-flex">
          <span className="text-red-500 w-5">♀</span> { femaleRate }%
        </div>
      </Tooltip>
    </div>
    <div className="male w-full">
      <Tooltip content={t('pokedex.details.gender.maleRate', { name: normalizePokemonName(species.name), rate: maleRate })}>
        <div className="inline-flex">
          <span className="text-blue-500 w-5">♂</span> { maleRate }%
        </div>
      </Tooltip>
    </div>
  </>;

  return <div className="pokemon-gender">
    <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.gender.title') }</h3>
    {species.gender_rate < 0 ? genderLess : femaleMaleRate}

  </div>;
}
