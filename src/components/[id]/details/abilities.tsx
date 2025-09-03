import PokeApiQuery from "@/app/poke-api-query";
import SkeletonBlock from "@/components/shared/skeleton-block";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { getIdFromUrlSubstring } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import { useQuery } from "@tanstack/react-query";
import { IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

const pokeApiQuery = new PokeApiQuery();

export default function PokemonAbilities({ pokemon }: { pokemon: IPokemon }) {
  const { t } = useTranslation('common');
  const { settings } = useUser();

  const { data: abilityDetails } = useQuery({
    queryKey: ['abilities', pokemon.name],
    queryFn: () => Promise.all(pokemon.abilities.map((ability) => pokeApiQuery.getAbility(getIdFromUrlSubstring(ability.ability.url)))),
  });

  const renderDetails = () => {
    if(!abilityDetails || !settings) {
      return <>
        <li className="pt-1.5"><SkeletonBlock className="w-full" /></li>
        <li className="pt-1.5"><SkeletonBlock className="w-full" /></li>
      </>;
    }

    return abilityDetails.map((ability, i) =>
      <li key={i} className="capitalize">
        <Tooltip content={abilityDetails[i].effect_entries.find((entry) => entry.language.name === settings.descriptionLang)?.short_effect}>
          {ability.name}
        </Tooltip>
      </li>
    );
  };

  return <div className="pokemon-abilities">
    <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.abilities.title') }</h3>
    <ul className="list-disc pl-5">
      {renderDetails()}
    </ul>
  </div>;
}
