import { fetchURL } from "@/app/api";
import { normalizePokemonName } from "@/pages/pokedex/utils";
import Link from "next/link";
import { IPokemon, IPokemonForm, IPokemonSpecies } from "pokeapi-typescript";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PokemonThumb from "../thumb/thumb";
import Tooltip from "../tooltip/tooltip";

export default function PokemonVarieties({ name, species }: { name: string, species: IPokemonSpecies }) {
  const [varieties, setVarieties] = useState<IPokemon[]>([]);
  const [forms, setForms] = useState<IPokemonForm[]>([]);

  const {t} = useTranslation('common');

  useEffect(() => {
    const getVarieties = async () => {
      const pokemonVarieties = await Promise.all(species.varieties.filter(v => v.pokemon.name !== name).map((v) => fetchURL<IPokemon>(v.pokemon.url)));
      setVarieties(pokemonVarieties);
      setForms(await Promise.all(pokemonVarieties.filter(v => v.name !== name).map((v) => fetchURL<IPokemonForm>(v.forms[0].url))));
    };

    getVarieties();
  }, [name, species.varieties]);

  return <div className="pokemon-varieties col-span-2 mt-2">
    <h3 className="text-lg font-semibold mb-4">{t('pokedex.details.varieties.title')}</h3>
    <div className="pokemon-types w-full mt-4 mb-4 flex flex-wrap gap-2">
      {!!forms.length && varieties.map((pkmn, i) =>
        <Tooltip key={i} content={`${normalizePokemonName(pkmn.name)}`}>
          <Link className="flex-2" href={`/pokedex/${pkmn.name}`}>
            <PokemonThumb pokemonData={pkmn} size="sm" hasName={false} isMega={forms[i].is_mega} />
          </Link>
        </Tooltip>
      )}
    </div>
  </div>;
}