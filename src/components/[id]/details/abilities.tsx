import { IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export default function PokemonAbilities({ pokemon }: { pokemon: IPokemon }) {
  const { t } = useTranslation();

  return <div className="pokemon-abilities mt-2 col-span-2 md:col-span-1">
    <h3 className="text-lg font-semibold mb-4">{ t('pokedex.details.abilities.title') }</h3>
    <ul className="list-disc pl-5">
      {pokemon.abilities.map((ability, i) =>
        <li key={i} className="capitalize">
          {ability.ability.name}
        </li>
      )}
    </ul>
  </div>;
}
