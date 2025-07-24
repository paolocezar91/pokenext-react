import PokeApiQuery from "@/app/poke-api-query";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { useAsyncQuery } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import { IAbility, IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

const pokeApiQuery = new PokeApiQuery();

export default function PokemonAbilities({ pokemon }: { pokemon: IPokemon }) {
  const { t } = useTranslation('common');
  const { settings } = useUser();

  const { data: abilityDetails } = useAsyncQuery(
    () => Promise.all(pokemon.abilities.map((ability) => {
      return pokeApiQuery.getURL<IAbility>(ability.ability.url);
    })),
    [pokemon.abilities]
  );

  return abilityDetails && settings && <div className="pokemon-abilities">
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
