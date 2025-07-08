import { useTranslation } from "react-i18next";
import { getBackgroundStyleWithStrings } from "./thumb/thumb";
import Tooltip from "./tooltip/tooltip";
import { capitilize, normalizePokemonName } from "@/components/shared/utils";
import { DefensiveMatchup, PokemonType } from "@/types/types";
import { typeChart } from "../[id]/details/type-weakness-chart";



function getDefensiveMatchup(types: PokemonType[]): DefensiveMatchup {
  const result: DefensiveMatchup = {
    weaknesses: {} as Record<PokemonType, number>,
    resistances: {} as Record<PokemonType, number>,
    immunities: {} as Record<PokemonType, boolean>,
  };

  // Initialize all types with neutral (1) multiplier
  const allTypes: PokemonType[] = Object.keys(typeChart) as PokemonType[];
  allTypes.forEach(type => {
    result.weaknesses[type] = 1;
    result.resistances[type] = 1;
  });

  // Calculate combined multipliers for each attacking type
  allTypes.forEach(attackingType => {
    let multiplier = 1;

    types.forEach(defendingType => {
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
  allTypes.forEach(type => {
    if (result.weaknesses[type] === 1) delete result.weaknesses[type];
    if (result.resistances[type] === 1) delete result.resistances[type];
  });

  return result;
}

const getFractionValue = (value: number) => {
  let rv = '';
  switch(value) {
    case 0.25:
      rv = '1/4';
      break;
    case 0.5:
      rv = '1/2';
      break;
    case undefined:
      rv = '-';
      break;
    default:
      rv = String(value);
      break;
  }
  return rv;
};

export default function PokemonDefensiveChart({ types, name }: { types: string[], name: string }) {
  const { t } = useTranslation('common');
  const defensiveChart = getDefensiveMatchup(types as PokemonType[]);

  return <div className="defensive-chart col-span-6 md:col-span-3">
    <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.defensiveChart.title') }</h3>
    <div className="flex flex-wrap text-white">
      {
        Object.keys(typeChart).map((type, idx) => {
          let tooltipContent = '';
          let tooltipChild = '';
          name = normalizePokemonName(name);
          if(defensiveChart.immunities[type as PokemonType]) {
            tooltipContent = `${name} is immune to ${capitilize(type)}`;
            tooltipChild = '0';
          } else if(defensiveChart.resistances[type as PokemonType]) {
            tooltipContent =`${name} is ${getFractionValue(defensiveChart.resistances[type as PokemonType])} resistant to ${capitilize(type)}`;
            tooltipChild = getFractionValue(defensiveChart.resistances[type as PokemonType]);
          } else if(defensiveChart.weaknesses[type as PokemonType]) {
            tooltipContent = `${name} is ${getFractionValue(defensiveChart.weaknesses[type as PokemonType])}x weak to ${capitilize(type)}`;
            tooltipChild = getFractionValue(defensiveChart.weaknesses[type as PokemonType]);
          } else {
            tooltipContent = `${name} is not resistant or weak to ${capitilize(type)}`;
            tooltipChild = '-';
          }

          return <Tooltip content={tooltipContent} key={idx}>
            <a
              href={`/type/${type}`}
              style={getBackgroundStyleWithStrings([type])}
              className="text-xs text-center flex flex-col rounded-sm py-1 m-1 w-14"
            >
              <span className="uppercase font-bold">
                { type.substring(0, 3) }
              </span>
              <span>
                {tooltipChild}
              </span>
            </a>
          </Tooltip>;
        })
      }
    </div>
  </div>;
}