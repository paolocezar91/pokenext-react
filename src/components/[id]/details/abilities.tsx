import PokeApiQuery from "@/app/query";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { useUser } from "@/context/user-context";
import { IAbility, IPokemon } from "pokeapi-typescript";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const pokeApiQuery = new PokeApiQuery();

export default function PokemonAbilities({ pokemon }: { pokemon: IPokemon }) {
  const { t } = useTranslation('common');
  const [abilityDetails, setAbilityDetails] = useState<IAbility[] | null>(null);
  const { settings } = useUser();

  useEffect(() => {
    const getAbility = async () => {
      const abilitiesData = await Promise.all(pokemon.abilities.map((ability) => {
        return pokeApiQuery.fetchURL<IAbility>(ability.ability.url);
      }));

      setAbilityDetails(abilitiesData);
    };

    getAbility();
  }, [pokemon.abilities]);

  return abilityDetails && settings && <div className="pokemon-abilities col-span-6 md:col-span-2">
    <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.abilities.title') }</h3>
    <ul className="list-disc pl-5">
      {pokemon.abilities.map((ability, i) =>
        <li key={i} className="capitalize">
          <Tooltip content={abilityDetails[i].effect_entries.find((entry) => entry.language.name === settings.descriptionLang)?.short_effect}>
            {ability.ability.name}
          </Tooltip>
        </li>
      )}
    </ul>
  </div>;
}
