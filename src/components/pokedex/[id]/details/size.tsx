import SkeletonBlock from "@/components/shared/skeleton-block";
import { IPokemon } from "pokeapi-typescript";
import { useTranslations } from "next-intl";

function metersToFeetInches(meters: number): string {
  const totalInches = meters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches.toString().padStart(2, "0")}"`;
}

function kgToLbs(kg: number) {
  return kg * 2.20462;
}

export default function PokemonSize({ pokemon }: { pokemon: IPokemon }) {
  const t = useTranslations();

  const renderSize = () => {
    if (!pokemon) {
      return (
        <>
          <SkeletonBlock className="mb-2" />
          <SkeletonBlock />
        </>
      );
    }

    return (
      <>
        <p>
          {t("pokedex.details.size.height")}: {pokemon.height / 10}m{" "}
          <small>({metersToFeetInches(pokemon.height / 10)})</small>
        </p>
        <p>
          {t("pokedex.details.size.weight")}: {pokemon.weight / 10}kg{" "}
          <small>({kgToLbs(pokemon.weight / 10).toFixed(1)}lbs)</small>
        </p>
      </>
    );
  };

  return (
    <div className="pokemon-size">
      <h3 className="w-fit text-lg font-semibold mb-2">
        {t("pokedex.details.size.title")}
      </h3>
      {renderSize()}
    </div>
  );
}
