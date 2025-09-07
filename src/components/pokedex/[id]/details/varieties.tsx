import { NUMBERS_OF_POKEMON } from "@/app/const";
import PokeApiQuery, { CountResults } from "@/app/api/poke-api-query";
import { getIdFromUrlSubstring, normalizePokemonName } from "@/components/shared/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "@/components/shared/link";
import { IPokemonForm, IPokemonSpecies } from "pokeapi-typescript";
import { useTranslations } from "next-intl";
import PokemonThumb from "../../../shared/thumb/thumb";
import Tooltip from "../../../shared/tooltip/tooltip";

const pokeApiQuery = new PokeApiQuery();

export default function PokemonVarieties({ name, species }: { name: string, species: IPokemonSpecies }) {
  const t = useTranslations();
  const { data: varieties } = useQuery({
    queryKey: ['varieties', name],
    queryFn: () => pokeApiQuery.getPokemonByIds(
      species.varieties
        .filter(({ pokemon }) => pokemon.name !== name)
        .map(({ pokemon }) => Number(getIdFromUrlSubstring(pokemon.url))),
      NUMBERS_OF_POKEMON)
  });

  const { data: forms } = useQuery({
    queryKey: ['forms', name],
    queryFn: () => varieties ?
      pokeApiQuery.getPokemonFormByIds(
        varieties?.results
          .filter(v => v.name !== name)
          .map(v => Number(getIdFromUrlSubstring(v.forms[0].url)))
      ) : new Promise<CountResults<IPokemonForm>>(res => res({ results: [], count: 0 }))
  });

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