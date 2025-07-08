import PokeApiQuery from "@/app/query";
import Select from "@/components/shared/select";
import { capitilize, getIdFromUrlSubstring, kebabToSpace, normalizeVersionGroup } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import Image from "next/image";
import Link from "next/link";
import { IMachine, IMove, IPokemon, IPokemonMoveVersion } from "pokeapi-typescript";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../shared/spinner";
import Tooltip from "../../shared/tooltip/tooltip";
import { getTypeIconById } from "./types";

const pokeApiQuery = new PokeApiQuery();

type Moveset = {
  move: string;
  level_learned_at: number;
  url: string;
  details?: IMove;
  tmDetails?: IMachine;
};

type VersionMoveset = Record<string, {
  id: number,
  moveset: Record<string, Moveset[]>
}>;

export default function PokemonMoves({ pokemon }: { pokemon: IPokemon }){
  const [moves, setMoves] = useState<VersionMoveset>({});
  const [movesetActive, setMovesetActive] = useState<string>('');
  const [versionGroupActive, setVersionGroupActive] = useState<string>('');
  const [showTable, setShowTable] = useState<boolean>(false);
  const { t } = useTranslation('common');
  const { settings } = useUser();



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
              return await pokeApiQuery.fetchURL<IMove>(move.url);
            })
        );

        moves[versionGroupActive].moveset[movesetActive] = moves[versionGroupActive].moveset[movesetActive].map((move, idx) => {
          return { ...move, details: details[idx] };
        });

        if(movesetActive === 'machine') {
          const detailsMachine = await Promise.all(
            moves[versionGroupActive].moveset[movesetActive]
              .map(async (move) => {
                const machine = move.details?.machines.find(machine => machine.version_group.name === versionGroupActive);
                return await pokeApiQuery.fetchURL<IMachine>(machine?.machine.url ?? '');
              })
          );

          moves[versionGroupActive].moveset[movesetActive] = moves[versionGroupActive].moveset[movesetActive].map((move, idx) => {
            return { ...move, tmDetails: detailsMachine[idx] };
          });
        }

        setMoves(moves);
        setShowTable(true);
      }
    };

    setShowTable(false);
    getMovesDetails();
  }, [versionGroupActive, movesetActive]);

  return settings && <div className="moves col-span-6 mt-2">
    <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.moves.title') }</h3>
    <div className="flex flex-col sm:flex-row my-2">
      {!!moves && <div className="version-picker">
        <label className=" text-xs flex flex-col">{t('pokedex.details.moves.chooseVersion')}:
          <Select onChange={(event) => setVersionGroupActive(event.target.value)}>
            <option className="bg-gray-300 text-white" value="" disabled selected>Select</option>
            {Object.entries(moves)
              .sort((a, b) => a[1].id - b[1].id)
              .map(([name], idx) => {
                return <option className="bg-white text-black text-black" key={idx} value={name}>
                  {normalizeVersionGroup(name)}
                </option>;
              })}
          </Select>
        </label>
      </div>}
      {versionGroupActive && <div className="moveset-picker">
        <label className="ml-2 text-xs flex flex-col">{t('pokedex.details.moves.learntBy')}:
          <Select
            onChange={(event) => setMovesetActive(event.target.value)}
          >
            <option className="bg-gray-300 text-white" value="" disabled selected>Select</option>
            {Object.keys(moves[versionGroupActive].moveset).map((moveset, idx) => {
              return !!moves[versionGroupActive].moveset[moveset].length && <option
                key={idx}
                value={moveset}
                className="bg-white text-black"
              >{moveset === 'machine' ? 'TM/HM' : capitilize(kebabToSpace(moveset))}</option>;
            })}
          </Select>
        </label>
      </div>}
    </div>

    <div className="tables overflow-x-auto mb-6">
      {versionGroupActive && movesetActive && !showTable && <div className="p-4 flex items-center justify-center">
        <Spinner />
      </div>}
      {showTable && <table className="w-full text-xs">
        <thead>
          <tr className="text-left">
            {movesetActive === 'level-up' && <th className="w-[5%] pr-2 text-right border-solid border-b-2 border-foreground align-bottom">
              Lv.
            </th>}
            {movesetActive === 'machine' && <th className="w-[5%] pr-2 border-solid border-b-2 border-foreground align-bottom">
              TM/HM
            </th>}
            <th className="border-solid border-b-2 border-foreground align-bottom">
              {t('pokedex.details.moves.name')}
            </th>
            <th className="border-solid border-b-2 border-foreground align-bottom">
              {t('pokedex.details.moves.type')}
            </th>
            <th className="border-solid border-b-2 border-foreground align-bottom">
              {t('pokedex.details.moves.class')}
            </th>
            <th className="border-solid border-b-2 border-foreground align-bottom">
              {t('pokedex.details.moves.power')}
            </th>
            <th className="border-solid border-b-2 border-foreground align-bottom">
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
            .map((move, idx, arr) => {
              const isLast = idx === arr.length - 1;
              return move.details && <tr className={`${!isLast ? 'border-solid border-b-1 border-foreground' : ''} align-middle`} key={idx}>
                {movesetActive === 'level-up' && <td className="p-2 text-right">{move.level_learned_at}</td>}
                {movesetActive === 'machine' && <td className="p-2 text-center uppercase">{(move.tmDetails?.item.name)}</td>}
                <td className="p-2">
                  <Link href={`/pokedex/moves/${move.move}`} className="hover:bg-(--pokedex-red-dark) p-1">
                    {capitilize(kebabToSpace(move.move))}
                  </Link>
                </td>
                <td className="p-2">
                  <Image
                    width="100"
                    height="20"
                    alt={capitilize(move.details.type.name)}
                    src={getTypeIconById(getIdFromUrlSubstring(move.details.type.url), settings.typeArtworkUrl)} />
                </td>
                <td className="p-2">
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
                <td className="p-2">{ move.details.power ?? '-' }</td>
                <td className="p-2">{ move.details.accuracy ?? '-' }</td>
              </tr>;
            })}
        </tbody>
      </table>}
    </div>
  </div>;
}