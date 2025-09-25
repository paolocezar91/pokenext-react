import { useTranslations } from "next-intl";
import { getBackgroundStyleWithStrings } from "./thumb/thumb";
import Tooltip from "./tooltip/tooltip";
import { capitilize, normalizePokemonName } from "@/components/shared/utils";
import { DefensiveMatchup, PokemonTypeEnum } from "@/types/types";
import { typeChart } from "../pokedex/[id]/details/type-weakness-chart";

function getDefensiveMatchup(types: PokemonTypeEnum[]): DefensiveMatchup {
  const result: DefensiveMatchup = {
    weaknesses: {} as Record<PokemonTypeEnum, number>,
    resistances: {} as Record<PokemonTypeEnum, number>,
    immunities: {} as Record<PokemonTypeEnum, boolean>,
  };

  // Initialize all types with neutral (1) multiplier
  const allTypes: PokemonTypeEnum[] = Object.keys(
    typeChart
  ) as PokemonTypeEnum[];
  allTypes.forEach((type) => {
    result.weaknesses[type] = 1;
    result.resistances[type] = 1;
  });

  // Calculate combined multipliers for each attacking type
  allTypes.forEach((attackingType) => {
    let multiplier = 1;

    types.forEach((defendingType) => {
      multiplier *= typeChart[defendingType][attackingType];
    });

    // Categorize the result
    if (multiplier === 0) {
      result.immunities[attackingType] = true;
    } else if (multiplier > 1) {
      result.weaknesses[attackingType] = multiplier;
    } else if (multiplier < 1 && multiplier > 0) {
      result.resistances[attackingType] = multiplier;
    }
    // Neutral (1) is already set by default
  });

  // Clean up neutral values (optional)
  allTypes.forEach((type) => {
    if (result.weaknesses[type] === 1) delete result.weaknesses[type];
    if (result.resistances[type] === 1) delete result.resistances[type];
  });

  return result;
}

const getFractionValue = (value: number) => {
  let rv = "";
  switch (value) {
    case 0.25:
      rv = "1/4";
      break;
    case 0.5:
      rv = "1/2";
      break;
    case undefined:
      rv = "-";
      break;
    default:
      rv = String(value);
      break;
  }
  return rv;
};

export default function PokemonDefensiveChart({
  types,
  name,
}: {
  types: string[];
  name: string;
}) {
  const t = useTranslations();
  const defensiveChart = getDefensiveMatchup(types as PokemonTypeEnum[]);

  return (
    <div className="defensive-chart col-span-6 md:col-span-3">
      <h3 className="w-fit text-lg font-semibold mb-2">
        {t("pokedex.details.defensiveChart.title")}
      </h3>
      <div className="flex flex-wrap text-white">
        {Object.keys(typeChart).map((type) => {
          let tooltipContent = "";
          let tooltipChild = "";
          name = normalizePokemonName(name);
          if (defensiveChart.immunities[type as PokemonTypeEnum]) {
            tooltipContent = `${name} is immune to ${capitilize(type)}`;
            tooltipChild = "0";
          } else if (defensiveChart.resistances[type as PokemonTypeEnum]) {
            tooltipContent = `${name} is ${getFractionValue(
              defensiveChart.resistances[type as PokemonTypeEnum]
            )} resistant to ${capitilize(type)}`;
            tooltipChild = getFractionValue(
              defensiveChart.resistances[type as PokemonTypeEnum]
            );
          } else if (defensiveChart.weaknesses[type as PokemonTypeEnum]) {
            tooltipContent = `${name} is ${getFractionValue(
              defensiveChart.weaknesses[type as PokemonTypeEnum]
            )}x weak to ${capitilize(type)}`;
            tooltipChild = getFractionValue(
              defensiveChart.weaknesses[type as PokemonTypeEnum]
            );
          } else {
            tooltipContent = `${name} is not resistant or weak to ${capitilize(
              type
            )}`;
            tooltipChild = "-";
          }

          return (
            <Tooltip content={tooltipContent} key={type}>
              <a
                href={`/type/${type}`}
                style={getBackgroundStyleWithStrings([type])}
                className="text-xs text-center flex flex-col rounded-sm py-1 m-1 w-14"
              >
                <span className="uppercase font-bold">
                  {type.substring(0, 3)}
                </span>
                <span>{tooltipChild}</span>
              </a>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
