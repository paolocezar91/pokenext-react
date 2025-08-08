import { NUMBERS_OF_POKEMON } from "@/app/const";
import PokeApiQuery, { CountResults } from "@/app/poke-api-query";
import { getIdFromUrlSubstring, normalizePokemonName, useAsyncQuery } from "@/components/shared/utils";
import Link from "next/link";
import { IPokemonForm, IPokemonSpecies } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import PokemonThumb from "../../shared/thumb/thumb";
import Tooltip from "../../shared/tooltip/tooltip";

const pokeApiQuery = new PokeApiQuery();

export default function PokemonVarieties({ name, species }: { name: string, species: IPokemonSpecies }) {
  const { t } = useTranslation('common');
  const { data: varieties } = useAsyncQuery(
    () => pokeApiQuery.getPokemonByIds(
      species.varieties
        .filter(({ pokemon }) => pokemon.name !== name)
        .map(({ pokemon }) => Number(getIdFromUrlSubstring(pokemon.url))),
      NUMBERS_OF_POKEMON
    ),
    [species.varieties],
  );

  const { data: forms } = useAsyncQuery(
    () => varieties ?
      pokeApiQuery.getPokemonFormByIds(
        varieties?.results
          .filter(v => v.name !== name)
          .map(v => Number(getIdFromUrlSubstring(v.forms[0].url)))
      ) : new Promise<CountResults<IPokemonForm>>(res => res({ results: [], count: 0 })),
    [varieties?.results, name]
  );

  return varieties && forms && <div className="pokemon-varieties col-span-6 mt-2">
    <h3 className="w-fit text-lg font-semibold mb-2">{t('pokedex.details.varieties.title')}</h3>
    <div className="pokemon-types w-full mt-4 mb-4 flex flex-wrap gap-2">
      {!!forms?.results?.length && varieties?.results?.map((pkmn, i) =>
        <Tooltip key={i} content={normalizePokemonName(pkmn.name)}>
          <Link className="flex-2" href={`/pokedex/${pkmn.name}`}>
            <PokemonThumb
              pokemonData={pkmn}
              size="xs"
              isMega={forms.results[i].is_mega}
            />
          </Link>
        </Tooltip>
      )}
    </div>
  </div>;
}