import Link from "next/link";
import { INamedApiResourceList, IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import Tooltip from "./tooltip/tooltip";
import { capitilize } from "@/pages/pokedex/[id]";
import { getNumber } from "./thumb/thumb";
import { ChevronRight2, ChevronLeft2, List } from "@deemlol/next-icons";



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

  return (<div className="controls ml-[-2rem] px-8 container fixed bottom-15 pt-2 pb-6 flex justify-between pb-2">
    <div className="previous flex-1 text-left">
      <Tooltip
        content={`${capitilize(previousAndAfter.results[0].name)} - #${getNumber(pokemon.id - 1)}`}
        disabled={!isFirst()}
      >
        <Link
          href={`/pokedex/${previousAndAfter.results[0].name}`}
          className={`flex px-2 py-2 bg-transparent border-transparent rounded  ${!isFirst() ? 'disable-click' : 'hover:bg-(--pokedex-red) hover:text-gray-800'}`}
        >
          <ChevronLeft2 className="inline mr-2" /> { t('actions.prev') }
        </Link>
      </Tooltip>
    </div>
    <div className="flex-1 text-center">
      <Tooltip content={t('actions.backToList')}>
        <Link
          href='/pokedex/'
          className="flex px-2 py-2 border-transparent rounded hover:bg-(--pokedex-red)"
        >
          <List className="inline mr-2" /> { t('actions.back') }
        </Link>
      </Tooltip>
    </div>
    <div className="next flex-1 text-right">
      <Tooltip
        content={`${capitilize(previousAndAfter.results[2].name)} - #${getNumber(pokemon.id + 1)}`}
        disabled={!isLast()}
      >
        <Link
          href={`/pokedex/${previousAndAfter.results[2].name}`}
          className={`flex px-2 py-2 bg-transparent border-transparent rounded ${!isLast() ? 'disable-click' : 'hover:bg-(--pokedex-red) hover:text-gray-800'}`}
        >
          { t('actions.next') } <ChevronRight2 className="inline ml-2" />
        </Link>
      </Tooltip>
    </div>
  </div>);
}
