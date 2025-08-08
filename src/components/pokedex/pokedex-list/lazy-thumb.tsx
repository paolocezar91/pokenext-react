import PokemonThumb from "@/components/shared/thumb/thumb";
import { IPkmn, UserSettings } from "@/types/types";
import { AnimatePresence, motion } from 'framer-motion';
import Link from "next/link";
import { useInView } from "react-intersection-observer";

export default function LazyThumb({
  pokemon,
  settings,
  isMobile
}: {
  pokemon: IPkmn,
  settings: UserSettings,
  isMobile: boolean
}) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' });
  return (
    <AnimatePresence>
      <div ref={ref} style={{ minHeight: 120, minWidth: 120 }}>
        {inView ? <motion.div
          layout
          initial={{ marginLeft: '-0.35rem', opacity: 0 }}
          animate={{ marginLeft: 0, opacity: 1 }}
          exit={{ marginLeft: '-0.35rem', opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href={`/pokedex/${pokemon.name}`} className="link">
            <PokemonThumb
              showName={settings!.thumbLabelList === 'thumbnail'}
              pokemonData={pokemon}
              size={isMobile ? 'xs': settings!.thumbSizeList}
            />
          </Link>
        </motion.div>
          : null}
      </div>
    </AnimatePresence>
  );
}