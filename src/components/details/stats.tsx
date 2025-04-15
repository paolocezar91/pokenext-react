import { capitilize, kebabToSpace } from "@/pages/pokedex/utils";
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

export default function PokemonStats({pokemon}: {pokemon: IPokemon}) {
  const {t} = useTranslation('common');

  const progressBar = (value: number) => {
    return <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${value*100/255}%`}}></div>
    </div>;
  };
  const total = pokemon.stats.reduce((acc, stat) => acc += stat.base_stat, 0);


  return <div className="stats">
    <h3 className="text-lg font-semibold mb-4">{ t('pokedex.details.stats.title') }</h3>
    <table className="w-full">
      <tbody>
        {pokemon.stats.map((stat, i) => {
          return <tr key={i}>
            <td className={`w-[20%] ${i === pokemon.stats.length - 1 ? 'pb-1' : ''}`}>
              { statName(stat.stat.name) }
            </td>
            <td className={`w-[13%] pl-4 ${i === pokemon.stats.length - 1 ? 'pb-1' : ''}`}>{stat.base_stat}</td>
            <td className={`${i === pokemon.stats.length - 1 ? 'pb-1' : ''}`}>{progressBar(stat.base_stat)}</td>
          </tr>;
        })}
        <tr>
          <td className="w-[20%] border-t-1 border-solid border-white pt-1">Total</td>
          <td colSpan={2} className="border-t-1 border-solid border-white  pt-1 pl-4">{total}</td>
        </tr>
      </tbody>
    </table>
  </div>;
}