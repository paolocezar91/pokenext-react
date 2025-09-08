import SkeletonBlock from "@/components/shared/skeleton-block";
import Tooltip from "@/components/shared/tooltip/tooltip";
import { normalizePokemonName } from "@/components/shared/utils";
import { IPokemonSpecies } from "pokeapi-typescript";
import { useTranslations } from "next-intl";

export default function PokemonGender({
  species,
}: {
  species: IPokemonSpecies | null;
}) {
  const t = useTranslations();

  const renderGender = () => {
    // Skeleton
    if (!species) {
      return (
        <>
          <div className="w-full">
            <div className="flex items-center">
              <SkeletonBlock />
            </div>
          </div>
          <div className="w-full mt-1">
            <div className="flex items-center">
              <SkeletonBlock />
            </div>
          </div>
        </>
      );
    }

    const femaleRate = (species.gender_rate / 8) * 100;
    const maleRate = ((8 - species.gender_rate) / 8) * 100;
    const name = normalizePokemonName(species.name);
    if (species.gender_rate < 0) {
      return (
        <div className="genderless">
          <Tooltip content={t("pokedex.details.gender.genderless", { name })}>
            -
          </Tooltip>
        </div>
      );
    } else {
      return (
        <>
          <div className="female w-full">
            <Tooltip
              content={t("pokedex.details.gender.femaleRate", {
                name,
                rate: femaleRate,
              })}
            >
              <div className="inline-flex">
                <span className="text-red-500 w-5">♀</span> {femaleRate}%
              </div>
            </Tooltip>
          </div>
          <div className="male w-full">
            <Tooltip
              content={t("pokedex.details.gender.maleRate", {
                name: normalizePokemonName(species.name),
                rate: maleRate,
              })}
            >
              <div className="inline-flex">
                <span className="text-blue-500 w-5">♂</span> {maleRate}%
              </div>
            </Tooltip>
          </div>
        </>
      );
    }
  };

  return (
    <div className="pokemon-gender">
      <h3 className="w-fit text-lg font-semibold mb-2">
        {t("pokedex.details.gender.title")}
      </h3>
      <div className="pokemon-gender">{renderGender()}</div>
    </div>
  );
}
