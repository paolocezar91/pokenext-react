import { IPkmn } from '@/app/types';
import { capitilize } from '@/pages/pokedex/[id]';
import Link from 'next/link';
import PokemonThumb, { getNumber } from '../thumb/thumb';
import "./table.scss";

export default function PokemonTable({
  pokemons,
  children
}: Readonly<{
  pokemons: IPkmn[],
  children: React.ReactNode;
}>) {
  return (
    <div className="table-container p-4 pt-0">
      <table className="w-full">
        <thead>
          <tr className="border-solid border-white border-b-2 sticky top-0 bg-(--pokedex-screen) z-1">
            <th className="text-center px-4 py-4 w-[15%]">Artwork</th>
            <th className="text-center px-4 py-4 w-[7%]">#</th>
            <th className="text-left px-4 py-4 w-[15%]">Name</th>
            <th className="text-left px-4 py-4">Type</th>
          </tr>
        </thead>
        <tbody>
          {
            pokemons.map((pokemon, i) => {
              return <tr key={i}>
                <td className={`px-4 ${i===0 ? 'pt-2 pb-1' : 'py-1'}`}><Link href={`/pokedex/${pokemon.name}`}><PokemonThumb pokemonData={pokemon} size="tiny" title={false} /></Link></td>
                <td className={`px-4 ${i===0 ? 'pt-2 pb-1' : 'py-1'}`}>#{getNumber(pokemon.id)}</td>
                <td className={`px-4 ${i===0 ? 'pt-2 pb-1' : 'py-1'}`}><Link className="underline" href={`/pokedex/${pokemon.name}`}>{capitilize(pokemon.name)}</Link></td>
                <td className={`px-4 ${i===0 ? 'pt-2 pb-1' : 'py-1'}`}>{(pokemon.types.map((t) => capitilize(t.type.name)).join("/"))}</td>
              </tr>;
            })
          }
          <tr>
            <td className="py-2" colSpan={3}>{ children }</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}