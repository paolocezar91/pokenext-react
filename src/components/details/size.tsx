import { IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export default function PokemonSize({ pokemon }: { pokemon: IPokemon }) {
  const { t } = useTranslation();

  return (<div className="pokemon-size mt-2">
    <h3 className="text-lg font-semibold mb-4">- {t('pokedex.details.size.title')} -</h3>
    <p>{t('pokedex.details.size.height')}: {pokemon.height / 10} m</p>
    <p>{t('pokedex.details.size.weight')}: {pokemon.weight / 10} kg</p>
  </div>);
}