import { capitilize, normalizePokemonName } from "@/components/shared/utils";
import { PokemonType } from "@/types/types";
import { useTranslation } from "react-i18next";
import { typeChart } from "../[id]/details/type-weakness-chart";
import { getBackgroundStyleWithStrings } from "./thumb/thumb";
import Tooltip from "./tooltip/tooltip";


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

function getOffensiveMatchup(types: PokemonType[]): Record<PokemonType, number> {
  const allTypes: PokemonType[] = Object.keys(typeChart) as PokemonType[];
  const result: Record<PokemonType, number> = {} as Record<PokemonType, number>;

  // Initialize all types with neutral (1) multiplier
  allTypes.forEach(type => {
    result[type] = 1;
  });

  allTypes.forEach(defendingType => {
    let multiplier = 1;
    types.forEach(attackingType => {
      multiplier *= typeChart[defendingType][attackingType];
    });
    result[defendingType] = multiplier;
  });

  return result;
}

export function PokemonOffensiveChart({ types, name }: { types: string[], name: string }) {
  const { t } = useTranslation('common');
  const offensiveChart = getOffensiveMatchup(types as PokemonType[]);

  return <div className="offensive-chart col-span-6 md:col-span-3">
    <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.offensiveChart.title', 'Offensive Chart') }</h3>
    <div className="flex flex-wrap text-white">
      {
        Object.keys(typeChart).map((type, idx) => {
          let tooltipContent = '';
          let tooltipChild = '';
          name = normalizePokemonName(name);
          const value = offensiveChart[type as PokemonType];
          if (value === 0) {
            tooltipContent = `${name} cannot hit ${capitilize(type)}`;
            tooltipChild = '0';
          } else if (value > 1) {
            tooltipContent = `${name} is ${getFractionValue(value)}x effective against ${capitilize(type)}`;
            tooltipChild = getFractionValue(value);
          } else if (value < 1 && value > 0) {
            tooltipContent = `${name} is ${getFractionValue(value)} effective against ${capitilize(type)}`;
            tooltipChild = getFractionValue(value);
          } else {
            tooltipContent = `${name} is normally effective against ${capitilize(type)}`;
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