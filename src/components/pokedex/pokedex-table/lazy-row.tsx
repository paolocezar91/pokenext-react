import { getTypeIconById } from "@/components/pokedex/[id]/details/types";
import PokemonThumb, { getNumber } from "@/components/shared/thumb/thumb";
import { capitilize, getIdFromUrlSubstring, normalizePokemonName } from "@/components/shared/utils";
import { useUser } from "@/context/user-context";
import { IPkmn } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { shouldShowColumn } from "./utils";
import { AnimatePresence, motion } from 'framer-motion';

export default function LazyRow(
  { isFirst, isLast, pokemon }:
  { isFirst: boolean, isLast: boolean, pokemon: IPkmn }
) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' });
  const { settings } = useUser();

  const thumbCell = <td className={`
        pl-16 pr-4
        ${isFirst ? 'pt-4' : ''}
        ${!settings!.showThumbTable ? 'py-4': 'py-2'}
      `}>
    {settings!.showThumbTable && <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <Link href={`/pokedex/${pokemon.name}`}>
        <PokemonThumb pokemonData={pokemon} size="xs" />
      </Link>
    </motion.div>}
  </td>;

  const numberCell = shouldShowColumn(settings!, 0) && <td className={`
        px-4
        ${isFirst ? 'pt-4' : ''}
        ${!isLast ? 'border-solid border-b-2 border-foreground text-center': ''} 
        ${!settings!.showThumbTable ? 'py-4': 'py-2'} 
      `}>
    <Link className="hover:bg-(--pokedex-red-dark) transition-colors p-1" href={`/pokedex/${pokemon.name}`}>
      {getNumber(pokemon.id)}
    </Link>
  </td>;

  const nameCell = shouldShowColumn(settings!, 1) && <td className={`
        px-2 
        ${isFirst ? 'pt-4' : ''}
        ${!isLast ? 'border-solid border-b-2 border-foreground': ''} 
        ${!settings!.showThumbTable ? 'py-4': 'py-2'} 
      `}>
    <Link className="text-bold hover:bg-(--pokedex-red-dark) transition-colors p-1" href={`/pokedex/${pokemon.name}`}>
      {normalizePokemonName(pokemon.name)}
    </Link>
  </td>;

  const typesCell = shouldShowColumn(settings!, 2) && <td className={`
        px-2
        ${isFirst ? 'pt-4' : ''}
        ${!isLast ? 'border-solid border-b-2 border-foreground': ''}
        ${!settings!.showThumbTable ? 'py-4': 'py-2'}
      `}>
    {pokemon.types.map((t, idx) =>
      <Link href={`/type/${t.type.name}`} key={idx}>
        <Image
          width="100"
          height="20"
          className="inline m-1"
          alt={capitilize(t.type.name)}
          src={getTypeIconById(getIdFromUrlSubstring(t.type.url), settings!.typeArtworkUrl)} />
      </Link>
    )}
  </td>;

  const statsCells = pokemon.stats
    .filter((_, idx) => shouldShowColumn(settings!, 3 + idx))
    .map((stat, idx) => {
      return <td key={idx} className={`
            px-4
            text-center
            ${isFirst ? 'pt-4' : ''}
            ${!isLast ? 'border-solid border-b-2 border-foreground': ''} 
            ${!settings!.showThumbTable ? 'py-4': 'py-2'}
            `}>
        { stat.base_stat }
      </td>;
    });

  return <tr ref={ref} className="bg-background">
    <AnimatePresence>
      {inView ? settings && <>
        {thumbCell}
        {numberCell}
        {nameCell}
        {typesCell}
        {statsCells}
        <td></td>
      </> : <td className="p-1" colSpan={11}></td>}
    </AnimatePresence>
  </tr>;
}