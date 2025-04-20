import { IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

function metersToFeetInches(meters: number): string {
  const totalInches = meters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches.toString().padStart(2, '0')}"`;
}

function kgToLbs(kg: number){
  return kg * 2.20462;
}

export default function PokemonSize({ pokemon }: { pokemon: IPokemon }) {
  const { t } = useTranslation();

  return <div className="pokemon-size col-span-2 md:col-span-1">
    <h3 className="text-lg font-semibold mb-4">{t('pokedex.details.size.title')}</h3>
    <p>{t('pokedex.details.size.height')}: {pokemon.height / 10} m ({metersToFeetInches(pokemon.height / 10)})</p>
    <p>{t('pokedex.details.size.weight')}: {pokemon.weight / 10} kg ({kgToLbs(pokemon.weight / 10).toFixed(1)}lbs.)</p>
  </div>;
}