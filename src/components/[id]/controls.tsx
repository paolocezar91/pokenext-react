import { normalizePokemonName } from "@/components/shared/utils";
import { ArrowUturnLeftIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { INamedApiResourceList, IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import { getNumber } from "../shared/thumb/thumb";
import Tooltip from "../shared/tooltip/tooltip";
import { NUMBERS_OF_POKEMON } from "@/app/const";


export default function Controls({
  pokemon,
  previousAndAfter
}: {
  pokemon: IPokemon,
  previousAndAfter: INamedApiResourceList<IPokemon>
}) {
  const { t } = useTranslation('common');

  const isLast = () => {
    return pokemon ? Number(pokemon.id) + 1 <= NUMBERS_OF_POKEMON : false;
  };

  const isFirst = () => {
    return pokemon ? pokemon.id - 1 > 0 : false;
  };

  const goPrev = (name: string, id: number) => <div className="previous flex-1 text-left">
    <Tooltip
      content={`${normalizePokemonName(name)} ${getNumber(id)}`}
      disabled={!isFirst()}

    >
      <Link
        href={`/pokedex/${previousAndAfter.results[0]?.name}`}
        className={`
          flex
          px-2
          py-2
          bg-transparent
          border-transparent
          rounded
          active:bg-white
          active:text-(--pokedex-red-dark) 
          ${!isFirst() ? 'disable-click' : 'hover:bg-(--pokedex-red-dark) transition-colors'}
        `}
      >
        <ChevronDoubleLeftIcon className="w-7" />
      </Link>
    </Tooltip>
  </div>;

  const goList = () => <div className="flex-1 text-center">
    <Tooltip content={t('actions.backToList')}>
      <Link
        href="/"
        className={`
          flex
          px-2
          py-2
          border-transparent
          rounded
          transition-colors
          hover:bg-(--pokedex-red-dark)
          active:bg-white
          active:text-(--pokedex-red-dark)
        `}
      >
        <ArrowUturnLeftIcon className="w-7" />
      </Link>
    </Tooltip>
  </div>;

  const goNext = (name = "", id: number) => <div className="next flex-1 text-right">
    <Tooltip
      content={`${normalizePokemonName(name)} ${getNumber(id)}`}
      disabled={!isLast()}
    >
      <Link
        href={`/pokedex/${name}`}
        className={`
          flex
          px-2
          py-2
          transition-colors
          bg-transparent
          border-transparent
          rounded
          active
          active:bg-white
          active:text-(--pokedex-red-dark) 
          ${!isLast() ? 'disable-click' : 'hover:bg-(--pokedex-red-dark)'}
        `}
      >
        <ChevronDoubleRightIcon className="w-7" />
      </Link>
    </Tooltip>
  </div>;

  return <div className="controls my-2 px-8 w-full flex justify-between">
    {!!previousAndAfter.results[0]?.name && goPrev(previousAndAfter.results[0].name, Number(pokemon.id) - 1)}
    { goList() }
    {
      Number(pokemon.id) > 1 ?
        goNext(previousAndAfter.results?.[2]?.name, Number(pokemon.id) + 1) :
        goNext(previousAndAfter.results?.[1]?.name, Number(pokemon.id) + 1)
    }
  </div>;
}
