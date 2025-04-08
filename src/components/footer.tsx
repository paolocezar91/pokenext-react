import Link from "next/link";
import { IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";

export default function Footer({ pokemon }: { pokemon: IPokemon }) {
  const { t } = useTranslation('common');

  const isLast = () => {
    return pokemon ? pokemon.id + 1 <= 1025: false;
  };

  const isFirst = () => {
    return pokemon ? pokemon.id - 1 > 0 : false;
  };

  return (<div className="controls ml-[-2rem] px-6 container fixed bottom-0 mb-6 flex justify-between">
    <div className="previous flex-1 text-left">
      <Link
        href={`/pokedex/${pokemon.id - 1}`}
        className={`px-4 py-2 bg-transparent border-transparent  ${!isFirst() ? 'disable-click' : 'hover:text-gray-800'}`}
      >
        &laquo; { t('actions.prev') }
      </Link>
    </div>
    <div className="flex-1 text-center">
      <Link
        href='/pokedex/'
        className="px-4 py-2 bg-transparent border-transparent hover:text-gray-800"
      >
        { t('actions.backToList') }
      </Link>
    </div>
    <div className="next flex-1 text-right">
      <Link
        href={`/pokedex/${pokemon.id + 1}`}
        className={`px-4 py-2 bg-transparent border-transparent  ${!isLast() ? 'disable-click' : 'hover:text-gray-800'}`}
      >
        { t('actions.next') } &raquo;
      </Link>
    </div>
  </div>);
}
