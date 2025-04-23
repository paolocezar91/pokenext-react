import Link from "next/link";
import { INamedApiResource, IPokemon } from "pokeapi-typescript";
import { getNumber } from "@/components/shared/thumb/thumb";
import { getIdFromUrlSubstring, normalizePokemonName } from "@/components/shared/utils";
import { useTranslation } from "react-i18next";

interface LearnedByPokemonProps {
  learnedByPokemon: INamedApiResource<IPokemon>[];
}

export default function LearnedByPokemon({ learnedByPokemon }: LearnedByPokemonProps) {
  const { t } = useTranslation('common');

  return (
    <div className="learned-by-pokemon w-full flex flex-col flex-1 h-0 mt-2">
      <h3 className="text-lg mb-4">{t('moves.learnedBy.title', { length: learnedByPokemon?.length })}</h3>
      {!!learnedByPokemon?.length &&
      <div className="sm:overflow-initial md:overflow-auto flex-1 pr-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="sticky top-0 bg-background z-1">
              <th className="w-[0%] text-white text-center px-2 py-2">#</th>
              <th className="w-[5%] text-white text-left px-2 py-2">{t('table.name')}</th>
            </tr>
          </thead>
          <tbody>
            {learnedByPokemon
              .filter((_, idx) => idx < 100)
              .map((pokemon, idx) => {
                const isLast = idx === learnedByPokemon.length - 1;
                return <tr key={idx} className={`${!isLast ? 'border-solid border-foreground  border-b-2' : ''}`}>
                  <td className="p-2">
                    {getNumber(Number(getIdFromUrlSubstring(pokemon.url)))}
                  </td>
                  <td className="p-2">
                    <Link className="hover:bg-(--pokedex-red-dark) p-1" href={`/pokedex/${pokemon.name}`} >
                      {normalizePokemonName(pokemon.name)}
                    </Link>
                  </td>
                </tr>;
              }
              )}
          </tbody>
        </table>
      </div>
      }
    </div>
  );
}