import { useTranslation } from "react-i18next";
import { getBackgroundStyleWithStrings } from "../thumb/thumb";
import Tooltip from "../tooltip/tooltip";
import { capitilize } from "@/pages/pokedex/utils";

type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic'
  | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

type DefensiveMatchup = {
  weaknesses: Record<PokemonType, number>;
  resistances: Record<PokemonType, number>;
  immunities: Record<PokemonType, boolean>;
};

const typeChart: Record<PokemonType, Record<PokemonType, number>> = {
  normal: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 0, dragon: 1, dark: 1, steel: 1, fairy: 1 },
  fire: { normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 0.5 },
  water: { normal: 1, fire: 0.5, water: 0.5, electric: 2, grass: 2, ice: 0.5, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  electric: { normal: 1, fire: 1, water: 1, electric: 0.5, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 2, flying: 0.5, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },
  grass: { normal: 1, fire: 2, water: 0.5, electric: 0.5, grass: 0.5, ice: 2, fighting: 1, poison: 2, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
  ice: { normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 0.5, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
  fighting: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 2, psychic: 2, bug: 0.5, rock: 0.5, ghost: 1, dragon: 1, dark: 0.5, steel: 1, fairy: 2 },
  poison: { normal: 1, fire: 1, water: 1, electric: 1, grass: 0.5, ice: 1, fighting: 0.5, poison: 0.5, ground: 2, flying: 1, psychic: 2, bug: 0.5, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 0.5 },
  ground: { normal: 1, fire: 1, water: 2, electric: 0, grass: 2, ice: 2, fighting: 1, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
  flying: { normal: 1, fire: 1, water: 1, electric: 2, grass: 0.5, ice: 2, fighting: 0.5, poison: 1, ground: 0, flying: 1, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
  psychic: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 0.5, bug: 2, rock: 1, ghost: 2, dragon: 1, dark: 0, steel: 1, fairy: 1 },
  bug: { normal: 1, fire: 2, water: 1, electric: 1, grass: 0.5, ice: 1, fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 1, fairy: 1 },
  rock: { normal: 0.5, fire: 0.5, water: 2, electric: 1, grass: 2, ice: 1, fighting: 2, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },
  ghost: { normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 0.5, rock: 1, ghost: 2, dragon: 1, dark: 2, steel: 1, fairy: 1 },
  dragon: { normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 0.5, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 1, fairy: 2 },
  dark: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 0, bug: 2, rock: 1, ghost: 0.5, dragon: 1, dark: 0.5, steel: 1, fairy: 2 },
  steel: { normal: 0.5, fire: 2, water: 1, electric: 1, grass: 0.5, ice: 0.5, fighting: 2, poison: 0, ground: 2, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, ghost: 1, dragon: 0.5, dark: 0.5, steel: 0.5, fairy: 0.5 },
  fairy: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 2, ground: 1, flying: 1, psychic: 1, bug: 0.5, rock: 1, ghost: 1, dragon: 0, dark: 0.5, steel: 2, fairy: 1 },
};

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

export default function PokemonDefensiveChart({ types, name }: {types: string[], name: string}) {
  const {t} = useTranslation('common');
  const defensiveChart = getDefensiveMatchup(types as PokemonType[]);

  return <div className="defensive-chart col-span-2 md:col-span-1">
    <h3 className="text-lg font-semibold mb-4">{ t('pokedex.details.defensiveChart.title') }</h3>
    <div className="flex flex-wrap">
      {
        Object.keys(typeChart).map((type, idx) => {
          let tooltipContent = '';
          let tooltipChild = '';

          if(defensiveChart.immunities[type as PokemonType]) {
            tooltipContent = `${name} is immune to ${capitilize(type)}`;
            tooltipChild = '0';
          } else if(defensiveChart.resistances[type as PokemonType]) {
            tooltipContent = `${name} is ${getFractionValue(defensiveChart.resistances[type as PokemonType])} resistant to ${capitilize(type)}`;
            tooltipChild = getFractionValue(defensiveChart.resistances[type as PokemonType]);
          } else if(defensiveChart.weaknesses[type as PokemonType]) {
            tooltipContent = `${name} is ${getFractionValue(defensiveChart.weaknesses[type as PokemonType])}x weak to ${capitilize(type)}`;
            tooltipChild = getFractionValue(defensiveChart.weaknesses[type as PokemonType]);
          } else {
            tooltipContent = `${name} is not resistant or weak to ${capitilize(type)}`;
            tooltipChild = '-';
          }

          return <Tooltip content={tooltipContent} key={idx}>
            <span
              style={getBackgroundStyleWithStrings([type])}
              className="text-xs text-center flex flex-col rounded-sm py-1 m-1 w-14"
            >
              <span className="uppercase font-bold">
                { type.substring(0, 3) }
              </span>
              <span>
                {tooltipChild}
              </span>
            </span>
          </Tooltip>;
        })
      }
    </div>
  </div>;
}