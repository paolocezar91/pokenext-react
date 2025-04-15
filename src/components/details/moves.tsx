import { fetchURL } from "@/app/api";
import { capitilize, getIdFromUrlSubstring, kebabToSpace } from "@/pages/pokedex/utils";
import Image from "next/image";
import { IMachine, IMove, IPokemon, IPokemonMoveVersion } from "pokeapi-typescript";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../spinner/spinner";
import Tooltip from "../tooltip/tooltip";
import { getTypeIconById } from "./types";

type Moveset = {
  move: string;
  level_learned_at: number;
  url: string;
  details?: IMove;
  tmDetails?: IMachine;
}

type VersionMoveset = Record<string, {
  id: number,
  moveset: Record<string, Moveset[]>
}>

export default function PokemonMoves({pokemon}: {pokemon: IPokemon}){
  const [moves, setMoves] = useState<VersionMoveset>({});
  const [movesetActive, setMovesetActive] = useState<string>('');
  const [versionGroupActive, setVersionGroupActive] = useState<string>('');
  const [showTable, setShowTable] = useState<boolean>(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    const movesData = pokemon?.moves.reduce((acc, move) => {
      move.version_group_details.forEach((version: IPokemonMoveVersion) => {
        if(!acc[version.version_group.name]) {
          acc = { ...acc,
            [version.version_group.name]: {
              id: Number(getIdFromUrlSubstring(version.version_group.url)),
              moveset: {
                'level-up': [],
                'machine': [],
                'tutor': [],
                'egg': [],
              }
            }
          };
        }

        if(acc[version.version_group.name].moveset[version.move_learn_method.name]){
          acc[version.version_group.name].moveset[version.move_learn_method.name].push({
            move: move.move.name,
            level_learned_at: version.level_learned_at,
            url: move.move.url
          });
        }
      });

      return acc;
    }, {} as VersionMoveset);

    setMoves(movesData);
  }, [pokemon.moves]);

  useEffect(() => {
    const getMovesDetails = async () => {
      if(moves?.[versionGroupActive]?.moveset?.[movesetActive]) {
        const details = await Promise.all(
          moves[versionGroupActive].moveset[movesetActive]
            .map(async (move) => {
              return await fetchURL<IMove>(move.url);
            })
        );

        moves[versionGroupActive].moveset[movesetActive] = moves[versionGroupActive].moveset[movesetActive].map((move, idx) => {
          return {...move, details: details[idx]};
        });

        if(movesetActive === 'machine') {
          const detailsMachine = await Promise.all(
            moves[versionGroupActive].moveset[movesetActive]
              .map(async (move) => {
                const machine = move.details?.machines.find(machine => machine.version_group.name === versionGroupActive);
                return await fetchURL<IMachine>(machine?.machine.url ?? '');
              })
          );

          moves[versionGroupActive].moveset[movesetActive] = moves[versionGroupActive].moveset[movesetActive].map((move, idx) => {
            return {...move, tmDetails: detailsMachine[idx]};
          });
        }

        setMoves(moves);
        setShowTable(true);
      }
    };

    setShowTable(false);
    getMovesDetails();
  }, [versionGroupActive, movesetActive]);

  return <div className="evolution-chain col-span-2 mt-2">
    <h3 className="text-lg font-semibold mb-4">{ t('pokedex.details.moves.title') }</h3>
    <div className="version-picker">
      <p className="text-xs">{t('pokedex.details.moves.chooseVersion')}:</p>
      <div className="flex flex-wrap my-2">
        {!!moves && Object.entries(moves)
          .sort((a, b) => a[1].id - b[1].id)
          .map(([name], idx) => {
            return <button
              key={idx}
              className={`text-xs px-2 py-2 mb-2 border-solid border-2 border-white mr-2 rounded hover:bg-(--pokedex-red) ${name === versionGroupActive ? 'active bg-(--pokedex-red)' : ''}`}
              onClick={() => setVersionGroupActive(name)}
            >
              {capitilize(kebabToSpace(name))}
            </button>;
          })}
      </div>
    </div>
    {versionGroupActive && <div className="moveset-picker">
      <p className="text-xs">{t('pokedex.details.moves.learntBy')}:</p>
      <div className="movesets flex my-2">
        {Object.keys(moves[versionGroupActive].moveset).map((moveset, idx) => {
          return !!moves[versionGroupActive].moveset[moveset].length && <button
            key={idx}
            className={`text-xs px-2 py-2 mb-2 border-solid border-2 border-white mr-2 rounded hover:bg-(--pokedex-red) ${moveset === movesetActive ? 'active bg-(--pokedex-red)' : ''}`}
            onClick={() => setMovesetActive(moveset)}
          >{moveset === 'machine' ? 'TM/HM' : capitilize(kebabToSpace(moveset))}</button>;
        })}
      </div>
    </div>}
    <Suspense fallback={<Spinner />}>
      <div className="tables mb-6">
        {showTable && <table className="w-full">
          <thead>
            <tr className="text-left">
              {movesetActive === 'level-up' && <th className="w-[10%] border-solid border-b-2 border-white align-bottom">
                Lv.
              </th>}
              {movesetActive === 'machine' && <th className="w-[10%] border-solid border-b-2 border-white align-bottom">
                TM/HM
              </th>}
              <th className="border-solid border-b-2 border-white align-bottom">
                {t('pokedex.details.moves.name')}
              </th>
              <th className="border-solid border-b-2 border-white align-bottom">
                {t('pokedex.details.moves.type')}
              </th>
              <th className="border-solid border-b-2 border-white align-bottom">
                {t('pokedex.details.moves.class')}
              </th>
              <th className="border-solid border-b-2 border-white align-bottom">
                {t('pokedex.details.moves.power')}
              </th>
              <th className="border-solid border-b-2 border-white align-bottom">
                {t('pokedex.details.moves.accuracy')}
              </th>
            </tr>
          </thead>
          <tbody>
            {moves?.[versionGroupActive]?.moveset?.[movesetActive]
              .sort((a, b) => {
                if(movesetActive === 'level-up') {
                  return a.level_learned_at - b.level_learned_at;
                } else if(movesetActive === 'machine' && a.tmDetails && b.tmDetails) {
                  return a.tmDetails.id - b.tmDetails.id;
                }
                return 0;
              })
              .map((move, idx) => {
                return move.details && <tr className="border-solid border-b-1 border-white align-middle" key={idx}>
                  {movesetActive === 'level-up' && <td className="py-2">{move.level_learned_at}</td>}
                  {movesetActive === 'machine' && <td className="py-2 uppercase">{(move.tmDetails?.item.name)}</td>}
                  <td className="py-2">
                    {capitilize(kebabToSpace(move.move))}
                  </td>
                  <td className="py-2">
                    <Image
                      width="100"
                      height="20"
                      alt={capitilize(move.details.type.name)}
                      src={getTypeIconById(getIdFromUrlSubstring(move.details.type.url))} />
                  </td>
                  <td className="py-2">
                    <span className="flex">
                      <Tooltip content={capitilize(move.details.damage_class.name)}>
                        <Image
                          width="35"
                          height="35"
                          alt={move.details.damage_class.name}
                          src={`/move-${move.details.damage_class.name}.png`} />
                      </Tooltip>
                    </span>
                  </td>
                  <td className="py-2">{ move.details.power ?? '-' }</td>
                  <td className="py-2">{ move.details.accuracy ?? '-' }</td>
                </tr>;
              })}
          </tbody>
        </table>}
      </div>
    </Suspense>
  </div>;
}