import { fetchMove, fetchURL } from "@/app/api";
import RootLayout from "@/app/layout";
import { getTypeIconById } from "@/components/details/types";
import { getNumber } from "@/components/thumb/thumb";
import Tooltip from "@/components/tooltip/tooltip";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { GetStaticPropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { IMove, IMoveTarget, INamedApiResource, IPokemon } from "pokeapi-typescript";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { capitilize, getIdFromUrlSubstring, kebabToSpace, normalizePokemonName } from "../pokedex/utils";

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.moveId);
  try {
    const moveData = await fetchMove(id);
    return {
      props: {
        moveData,
      }
    };
  } catch (error) {
    return { props: error };
  }
}

export function getStaticPaths() {
  const ids = Array.from({length: 1025}, (_, i) => String(i + 1));

  return {
    paths: ids.map(moveId => ({ params: { moveId } })),
    fallback: true
  };
}

export default function MoveDetails({
  moveData
}: {
  moveData: IMove & { learned_by_pokemon: [INamedApiResource<IPokemon>]}
}) {
  const [targetData, setTargetData] = useState<IMoveTarget | null>(null);
  const [flavorIdx, setFlavorIdx] = useState(0);
  const { t } = useTranslation('common');

  useEffect(() => {
    const getTarget = async () => {
      if(moveData?.target) {
        setTargetData(await fetchURL<IMoveTarget>(moveData.target.url));
      }
    };

    getTarget();
  }, [moveData]);


  return <RootLayout title={moveData ? `Move: ${capitilize(kebabToSpace(moveData.name))}` : `${t('pokedex.loading')}...`}>
    {moveData &&
      <div className="h-[inherit] p-4 bg-(--pokedex-red) md:overflow-[initial]">
        <div className="mx-auto p-4 overflow-auto bg-background rounded shadow-md h-[-webkit-fill-available]">
          <div className="flex flex-col md:flex-row h-[-webkit-fill-available]">
            <div className="flex flex-col h-[-webkit-fill-available] md:items-start mr-0 md:mr-4 self-center md:self-start">
              <div className="move-data-container w-100">
                <h3 className="text-xl font-semibold mb-4 ">{capitilize(kebabToSpace(moveData.name))}</h3>
                <div className="flex relative pb-8">
                  <button
                    onClick={() => setFlavorIdx(flavorIdx => flavorIdx - 1)}
                    disabled={flavorIdx === 0}
                    className="text-xs mr-2 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
                  >
                    <ChevronLeftIcon className="w-5" />
                  </button>
                  <p>
                    {moveData.flavor_text_entries.filter(entry => entry.language.name === 'en')[flavorIdx]?.flavor_text}
                  </p>
                  <button
                    onClick={() => setFlavorIdx(flavorIdx => flavorIdx + 1)}
                    disabled={moveData.flavor_text_entries.filter(entry => entry.language.name === 'en').length - 1 === flavorIdx}
                    className="text-xs ml-2 rounded hover:bg-(--pokedex-red) disabled:bg-gray-600"
                  >
                    <ChevronRightIcon className="w-5" />
                  </button>
                  <div className="absolute bottom-0 right-0">
                    <small className="mr-2">({ capitilize(kebabToSpace(moveData.flavor_text_entries.filter(entry => entry.language.name === 'en')[flavorIdx].version_group.name)) })</small>
                    {flavorIdx + 1} / {moveData.flavor_text_entries.filter(entry => entry.language.name === 'en').length}
                  </div>
                </div>
              </div>
              <div className="move-data w-100 mt-4">
                <h3 className="text-lg mb-4">Move Data</h3>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <th className="text-left">{t('pokedex.details.moves.type')}</th>
                      <td className="py-1">
                        <Image
                          width="100"
                          height="20"
                          alt={capitilize(moveData.type.name)}
                          src={getTypeIconById(getIdFromUrlSubstring(moveData.type.url))} />
                      </td>
                    </tr>
                    <tr>
                      <th className="text-left">{t('pokedex.details.moves.class')}</th>
                      <td className="py-1">
                        <span className="flex">
                          <Tooltip content={capitilize(moveData.damage_class.name)}>
                            <Image
                              width="35"
                              height="35"
                              alt={moveData.damage_class.name}
                              src={`/move-${moveData.damage_class.name}.png`} />
                          </Tooltip>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th className="text-left">{t('pokedex.details.moves.power')}</th>
                      <td className="py-1">{ moveData.power ?? '-' }</td>
                    </tr>
                    <tr>
                      <th className="text-left">{t('pokedex.details.moves.accuracy')}</th>
                      <td className="py-1">{ moveData.accuracy ?? '-' }</td>
                    </tr>
                    <tr>
                      <th className="text-left">{t('pokedex.details.moves.pp')}</th>
                      <td className="py-1">{ moveData.pp ?? '-' }</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              { targetData && <div className="w-100">
                <h3 className="text-lg font-semibold mb-4">Target</h3>
                <p>
                  { targetData.descriptions.find((d) => d.language.name === 'en')?.description }
                </p>
              </div>}
            </div>
            <div className="details sm:mt-4 sm:mb-4 md:mt-0 md:mb-0 p-4 pt-0 overflow-auto">
              <div className="description mb-4">
                <h3 className="text-lg mb-4">Effect</h3>
                <p>
                  {moveData.effect_entries[0].effect}
                </p>
              </div>
              <div className="learned-by-pokemon bg-background sticky top-0">
                <h3 className="text-lg mb-4">Learned by {moveData.learned_by_pokemon?.length} Pokémon</h3>
                {
                  !!moveData.learned_by_pokemon?.length &&
                  <table className="w-full text-xs mt-4">
                    <thead>
                      <tr className="sticky top-[-1rem] bg-background z-1">
                        {/* <th className="w-[0%] text-white text-center px-2 py-2">Pokémon</th> */}
                        <th className="w-[0%] text-white text-center px-2 py-2">#</th>
                        <th className="w-[5%] text-white text-left px-2 py-2">{t('table.name')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      { moveData.learned_by_pokemon.filter((_, idx) => idx < 100).map((pokemon, idx) => {
                        return <tr key={idx} className="bg-background">
                          {/* <td className={`px-2 py-1 ${idx===0 ? 'pt-4' : ''}`}>
                            <Link href={`/pokedex/${pokemon.name}`}>
                              <PokemonThumb pokemonDataSmall={pokemon} size="xs" hasName={false} />
                            </Link>
                          </td> */}
                          <td className={`${idx < moveData.learned_by_pokemon.length - 1 ? 'border-solid border-b-2 border-foreground text-center': ''} px-2 py-1 ${idx===0 ? 'pt-4' : ''}`}>
                            <Link href={`/pokedex/${pokemon.name}`}>
                              #{getNumber(Number(getIdFromUrlSubstring(pokemon.url)))}
                            </Link>
                          </td>
                          <td className={`${idx < moveData.learned_by_pokemon.length - 1 ? 'border-solid border-b-2 border-foreground': ''} px-2 py-1 ${idx===0 ? 'pt-4' : ''}`}>
                            <Link className="text-bold" href={`/pokedex/${pokemon.name}`}>
                              {normalizePokemonName(pokemon.name)}
                            </Link>
                          </td>
                        </tr>;
                      }) }
                    </tbody>
                  </table>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  </RootLayout>;
}