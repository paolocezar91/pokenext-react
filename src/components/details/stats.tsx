import { capitilize } from "@/pages/pokedex/[id]";
import { IPokemon } from "pokeapi-typescript";
import { kebabToSpace } from "./evolution-chart/evolution-chart";
import { useTranslation } from "react-i18next";

export default function PokemonStats({pokemon}: {pokemon: IPokemon}) {
  const { t } = useTranslation('common');

  return (<div className="stats col-span-2">
    <h3 className="text-lg font-semibold mb-4">{ t('pokedex.details.stats.title') }</h3>
    <table className="w-full">
      <thead>
        <tr className="text-left">
          {
            pokemon.stats.map((stat, i) => {
              return(<th className={`px-2 py-2 border-solid border-b-2 border-white align-bottom ${i===0 ?'uppercase w-[5%]':'w-[12%]'}`} key={i}>
                {capitilize(kebabToSpace(stat.stat.name))}
              </th>);})
          }
          <th className={`w-[12%] px-2 py-2 border-solid border-b-2 border-white align-bottom`}>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {pokemon.stats.map((stat, i) => (<td className="px-2 py-2" key={i}>{stat.base_stat}</td>))}
          <td className="px-2 py-2">{pokemon.stats.reduce((acc, stat) => acc += stat.base_stat, 0)}</td>
        </tr>
      </tbody>
    </table>
  </div>);
}