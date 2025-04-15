import { normalizePokemonName } from "@/pages/pokedex/utils";
import { ArrowUturnLeftIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { INamedApiResourceList, IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import { getNumber } from "./thumb/thumb";
import Tooltip from "./tooltip/tooltip";



export default function Controls({
  pokemon,
  previousAndAfter
}: {
  pokemon: IPokemon,
  previousAndAfter: INamedApiResourceList<IPokemon>
}) {
  const { t } = useTranslation();

  const isLast = () => {
    return pokemon ? pokemon.id + 1 <= 1025: false;
  };

  const isFirst = () => {
    return pokemon ? pokemon.id - 1 > 0 : false;
  };

  const goPrev = (name: string, id: number) => <div className="previous flex-1 text-left">
    <Tooltip
      content={`${normalizePokemonName(name)} #${getNumber(id)}`}
      disabled={!isFirst()}
    >
      <Link
        href={`/pokedex/${previousAndAfter.results[0]?.name}`}
        className={`flex px-2 py-2 bg-transparent border-transparent rounded ${!isFirst() ? 'disable-click' : 'hover:bg-(--pokedex-red) hover:text-gray-800'}`}
      >
        <ChevronDoubleLeftIcon className="w-7" />
      </Link>
    </Tooltip>
  </div>;

  const goList = () => <div className="flex-1 text-center">
    <Tooltip content={t('actions.backToList')}>
      <Link
        href='/pokedex/'
        className="flex px-2 py-2 border-transparent rounded hover:bg-(--pokedex-red)"
      >
        <ArrowUturnLeftIcon className="w-7" />
      </Link>
    </Tooltip>
  </div>;

  const goNext = (name: string, id: number) => <div className="next flex-1 text-right">
    <Tooltip
      content={`${normalizePokemonName(name)} #${getNumber(id)}`}
      disabled={!isLast()}
    >
      <Link
        href={`/pokedex/${pokemon.id > 1 ? previousAndAfter.results[2].name : previousAndAfter.results[1].name}`}
        className={`flex px-2 py-2 bg-transparent border-transparent rounded ${!isLast() ? 'disable-click' : 'hover:bg-(--pokedex-red) hover:text-gray-800'}`}
      >
        <ChevronDoubleRightIcon className="w-7" />
      </Link>
    </Tooltip>
  </div>;

  return <div className="controls my-2 px-8 w-full flex justify-between">
    {!!previousAndAfter.results[0]?.name && goPrev(previousAndAfter.results[0].name, pokemon.id - 1)}
    { goList() }
    {
      pokemon.id > 1 ?
        !!previousAndAfter.results[2]?.name && goNext(previousAndAfter.results[2].name, pokemon.id + 1) :
        !!previousAndAfter.results[1]?.name && goNext(previousAndAfter.results[1].name, pokemon.id + 1)
    }
  </div>;
}
