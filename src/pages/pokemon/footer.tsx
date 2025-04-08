import Link from "next/link";
import { IPokemon } from "pokeapi-typescript";

export default function Footer({ pokemon }: { pokemon: IPokemon }) {

  const isLast = () => {
    return pokemon ? pokemon.id + 1 <= 1025: false;
  };

  const isFirst = () => {
    return pokemon ? pokemon.id - 1 > 0 : false;
  };

  return (<div className="controls ml-[-2rem] px-6 container fixed bottom-0 mb-6 flex justify-between">
    <div className="previous flex-1 text-left">
      <Link
        href={`/pokemon/${pokemon.id - 1}`}
        className={`px-4 py-2 bg-transparent border-transparent  ${!isFirst() ? 'disable-click' : 'hover:text-gray-800'}`}
      >
        &laquo; Prev
      </Link>
    </div>
    <div className="flex-1 text-center">
      <Link
        href='/'
        className="px-4 py-2 bg-transparent border-transparent hover:text-gray-800"
      >
        Back to List
      </Link>
    </div>
    <div className="next flex-1 text-right">
      <Link
        href={`/pokemon/${pokemon.id + 1}`}
        className={`px-4 py-2 bg-transparent border-transparent  ${!isLast() ? 'disable-click' : 'hover:text-gray-800'}`}
      >
        Next &raquo;
      </Link>
    </div>
  </div>);
}
