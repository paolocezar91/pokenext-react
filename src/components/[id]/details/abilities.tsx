import { fetchURL } from "@/app/query";
import { TypeLocale } from "@/components/layout/descriptionLang";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { useLocalStorage } from "@/components/shared/utils";
import { IAbility, IPokemon } from "pokeapi-typescript";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PokemonAbilities({ pokemon }: { pokemon: IPokemon }) {
  const { t } = useTranslation('common');
  const [abilityDetails, setAbilityDetails] = useState<IAbility[] | null>(null);
  const [descriptionLang] = useLocalStorage<TypeLocale>('descriptionLang', 'en');

  useEffect(() => {
    const getAbility = async () => {
      const abilitiesData = await Promise.all(pokemon.abilities.map((ability) => {
        return fetchURL<IAbility>(ability.ability.url);
      }));

      setAbilityDetails(abilitiesData);
    };

    getAbility();
  }, [pokemon.abilities]);

  return abilityDetails && <div className="pokemon-abilities col-span-6 md:col-span-2">
    <h3 className="text-lg font-semibold mb-2">{ t('pokedex.details.abilities.title') }</h3>
    <ul className="list-disc pl-5">
      {pokemon.abilities.map((ability, i) =>
        <li key={i} className="capitalize">
          <Tooltip content={abilityDetails[i].effect_entries.find((entry) => entry.language.name === descriptionLang)?.short_effect}>
            {ability.ability.name}
          </Tooltip>
        </li>
      )}
    </ul>
  </div>;
}
