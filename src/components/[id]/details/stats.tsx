import { capitilize, kebabToSpace } from "@/components/shared/utils";
import { IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export const statName = (name: string) => {
  let rv = '';
  switch(name) {
    case 'hp':
      rv = 'HP';
      break;
    case 'special-attack':
      rv = 'Sp.Att';
      break;
    case 'special-defense':
      rv = 'Sp.Def';
      break;
    case 'defense':
      rv = 'Def';
      break;
    case 'attack':
      rv = 'Att';
      break;
    case 'speed':
      rv = 'Spd';
      break;
    default:
      rv = capitilize(kebabToSpace(name));
      break;
  }
  return rv;
};

export default function PokemonStats({ pokemon }: { pokemon: IPokemon }) {
  const { t } = useTranslation('common');

  const progressBar = (value: number, dividedBy: number) => {
    return <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${value*100/dividedBy}%` }}></div>
    </div>;
  };
  const total = pokemon.stats.reduce((acc, stat) => acc += stat.base_stat, 0);


  return <div className="stats col-span-6 md:col-span-3">
    <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.stats.title') }</h3>
    <table className="w-full">
      <tbody>
        {pokemon.stats.map((stat, i) => {
          return <tr key={i} className="pb-1 pt-1">
            <th className={`w-[18%] text-left ${i === pokemon.stats.length - 1 ? 'pb-1' : ''}`}>
              { statName(stat.stat.name) }
            </th>
            <td className={`pr-4 ${i === pokemon.stats.length - 1 ? 'pb-1' : ''}`}>
              {progressBar(stat.base_stat, 255)}
            </td>
            <td className={`w-[5%] text-left pr-4 ${i === pokemon.stats.length - 1 ? 'pb-1' : ''}`}>
              {stat.base_stat}
            </td>
          </tr>;
        })}
        <tr className="pb-1 pt-1">
          <th className="w-[18%] text-left border-t-1 border-solid border-foreground">
            Total
          </th>
          <td className="pr-4 border-t-1 border-solid border-foreground">
            {progressBar(total, 255*6)}
          </td>
          <td className="w-[5%] text-left border-t-1 border-solid border-foreground pr-4">
            {total}
          </td>
        </tr>
      </tbody>
    </table>
  </div>;
}