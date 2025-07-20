import PokeApiQuery from "@/app/poke-api-query";
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
import Table from "@/components/shared/table";

const pokeApiQuery = new PokeApiQuery();

type Moveset = {
  move: string;
  level_learned_at: number;
  url: string;
  details?: IMove;
  tmDetails?: IMachine;
};

type MovesetTypes = "level-up" | "machine" | "tutor" | "egg";

type VersionMoveset = Record<string, {
  id: number,
  moveset: Record<MovesetTypes, Moveset[]>
}>;

export default function PokemonMoves({ pokemon }: { pokemon: IPokemon }){
  const [moves, setMoves] = useState<VersionMoveset>({});
  const [movesetActive, setMovesetActive] = useState<MovesetTypes>();
  const [versionGroupActive, setVersionGroupActive] = useState<string>('');
  const [showTable, setShowTable] = useState<boolean>(false);
  const { t } = useTranslation('common');
  const { settings } = useUser();

  useEffect(() => {
    const movesData = pokemon?.moves.reduce((acc, move) => {
      move.version_group_details.forEach((version: IPokemonMoveVersion) => {
        const versionGroup = version.version_group;
        if(!acc[versionGroup.name]) {
          acc = { ...acc,
            [versionGroup.name]: {
              id: Number(getIdFromUrlSubstring(versionGroup.url)),
              moveset: {
                'level-up': [],
                machine: [],
                tutor: [],
                egg: [],
              }
            }
          };
        }

        const movesetTypeName = version.move_learn_method.name as MovesetTypes;
        if(acc[versionGroup.name].moveset[movesetTypeName]){
          acc[versionGroup.name].moveset[movesetTypeName].push({
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
      if(movesetActive && moves?.[versionGroupActive]?.moveset?.[movesetActive]) {
        const ids = moves[versionGroupActive].moveset[movesetActive]
          .map((move) => Number(getIdFromUrlSubstring(move.url)));

        const details = await pokeApiQuery.getMovesByIds(ids);
        moves[versionGroupActive].moveset[movesetActive] = moves[versionGroupActive].moveset[movesetActive].map((move, idx) => {
          return { ...move, details: details.results.find(d => d.name === move.move) };
        });

        if(movesetActive === 'machine') {
          const detailsMachine = await Promise.all(
            moves[versionGroupActive].moveset[movesetActive]
              .map(async (move) => {
                const machine = move.details?.machines.find(machine => machine.version_group.name === versionGroupActive);
                return await pokeApiQuery.getURL<IMachine>(machine?.machine.url ?? '');
              })
          );

          moves[versionGroupActive].moveset[movesetActive] = moves[versionGroupActive].moveset[movesetActive].map((move, idx) => {
            return { ...move, tmDetails: detailsMachine.find(d => d.move.name === move.move) };
          });
        }

        setMoves(moves);
        setShowTable(true);
      }
    };

    setShowTable(false);
    getMovesDetails();

  }, [versionGroupActive, movesetActive]);

  const headers = <>
    {movesetActive === 'level-up' && <th className="w-[5%] pr-2 border-solid border-b-2 border-foreground align-bottom">
      Lv.
    </th>}
    {movesetActive === 'machine' && <th className="w-[5%] pr-2 border-solid border-b-2 border-foreground align-bottom">
      TM/HM
    </th>}
    <th className="text-left border-solid border-b-2 border-foreground align-bottom pb-2">
      {t('pokedex.details.moves.name')}
    </th>
    <th className="text-left border-solid border-b-2 border-foreground align-bottom pb-2">
      {t('pokedex.details.moves.type')}
    </th>
    <th className="text-left border-solid border-b-2 border-foreground align-bottom pb-2">
      {t('pokedex.details.moves.class')}
    </th>
    <th className="text-left border-solid border-b-2 border-foreground align-bottom pb-2">
      {t('pokedex.details.moves.power')}
    </th>
    <th className="text-left border-solid border-b-2 border-foreground align-bottom pb-2">
      {t('pokedex.details.moves.pp')}
    </th>
    <th className="text-left border-solid border-b-2 border-foreground align-bottom pb-2">
      {t('pokedex.details.moves.accuracy')}
    </th>
  </>;

  const body = settings && movesetActive && moves?.[versionGroupActive]?.moveset?.[movesetActive]
    ?.sort((a, b) => {
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
          <Link href={`/moves/${move.move}`} className="hover:bg-(--pokedex-red-dark) p-1 transition-colors">
            {capitilize(kebabToSpace(move.move))}
          </Link>
        </td>
        <td className="p-2">
          <Link href={`/type/${move.details.type.name}`}>
            <Image
              width="100"
              height="20"
              alt={capitilize(move.details.type.name)}
              src={getTypeIconById(getIdFromUrlSubstring(move.details.type.url), settings.typeArtworkUrl)} />
          </Link>
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
        <td className="p-2">{ move.details.pp ?? '-' }</td>
        <td className="p-2">{ move.details.accuracy ?? '-' }</td>
      </tr>;
    });

  return settings && <div className="moves col-span-6 mt-2">
    <h3 className="w-fit text-lg font-semibold mb-2">{ t('pokedex.details.moves.title') }</h3>
    <div className="flex flex-col sm:flex-row my-2">
      {!!moves && <div className="version-picker">
        <label className=" text-xs flex flex-col">
          <span className="mb-1">
            {t('pokedex.details.moves.chooseVersion')}:
          </span>
          <Select onChange={(event) => setVersionGroupActive(event.target.value)}>
            <option className="bg-gray-300 text-white" value="" disabled selected>{t('actions.select')}</option>
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
        <label className="ml-2 text-xs flex flex-col">
          <span className="mb-1">
            {t('pokedex.details.moves.learntBy')}:
          </span>
          <Select
            onChange={(event) => setMovesetActive(event.target.value as MovesetTypes)}
          >
            <option className="bg-gray-300 text-white" value="" disabled selected>{t('actions.select')}</option>
            {Object.keys(moves[versionGroupActive].moveset).map((moveset, idx) => {
              return !!moves[versionGroupActive].moveset[moveset as MovesetTypes].length && <option
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
      {showTable && <Table headers={headers}>{body}</Table>}
    </div>
  </div>;
}