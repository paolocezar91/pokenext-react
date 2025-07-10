import '@/app/globals.css';
import PokeApiQuery from '@/app/query';
import PokedexFilter from '@/components/pokedex/pokedex-list/pokedex-filter';
import PokedexList from '@/components/pokedex/pokedex-list/pokedex-list';
import PokedexTable from '@/components/pokedex/pokedex-table/pokedex-table';
import Spinner from '@/components/shared/spinner';
import Toggle from '@/components/shared/toggle';
import Tooltip from '@/components/shared/tooltip/tooltip';
import { useSnackbar } from '@/context/snackbar';
import { useUser } from '@/context/user-context';
import { IPkmn } from '@/types/types';
import { Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import RootLayout from './layout';

const pokeApiQuery = new PokeApiQuery();
const NUMBERS_OF_POKEMON = 1025;
const STARTING_POKEMON = 0;
const TOTAL_POKEMON = 1025;

export const metadata: Metadata = {
  title: `Pokédex -- Next.js Demo`,
  description: 'By Paolo Pestalozzi with PokeAPI and Next.js.'
};

export async function getStaticProps() {
  const pokemonsData = (await pokeApiQuery.getPokemonList(STARTING_POKEMON, NUMBERS_OF_POKEMON)).results;
  return {
    props: { pokemonsData },
  };
}

export default function Pokedex({ pokemonsData }: { pokemonsData: IPkmn[] }) {
  const { ref, inView } = useInView({ threshold: 1 });
  const [showRef, setShowRef] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowRef(true), 0);
    return () => clearTimeout(timer);
  }, []);
  const [pokemons, setPokemons] = useState<IPkmn[]>(pokemonsData);
  const [pokemonsBackup, setPokemonsBackup] = useState<IPkmn[]>(pokemonsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<boolean>(false);
  const [offset, setOffset] = useState(STARTING_POKEMON + NUMBERS_OF_POKEMON);
  const { settings, upsertSettings } = useUser();
  const { t } = useTranslation('common');
  const { showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    async function loadMorePkmn() {
      setLoading(true);
      showSnackbar(`${t('pokedex.loading')}...`);
      const morePkmn = (await pokeApiQuery.getPokemonList(offset, NUMBERS_OF_POKEMON)).results;
      if (morePkmn.length > 0){
        setPokemons(pkmn => [...pkmn, ...morePkmn]);
        setPokemonsBackup(pokemons);
        setOffset(offset => offset + NUMBERS_OF_POKEMON);
        setTimeout(() => setLoading(false), 0);
      }
      hideSnackbar();
    }

    if (inView && !loading) {
      loadMorePkmn();
    }
  }, [inView]);

  // detect filter changes and query for pokemon
  useEffect(() => {
    if(settings && (settings.filter.name || settings.filter.types) && !loading) {
      setFiltered(true);
      setLoading(true);
      pokeApiQuery.getPokemonList(0, TOTAL_POKEMON, settings.filter).then(({ results }) => {
        setPokemons(results);
      }).finally(() => {
        setTimeout(() => {
          setLoading(false);
          hideSnackbar();
        }, 0);
      });
    }
  }, [settings?.filter]);

  const filterName = (name: string) => {
    setFiltered(!!name);
    upsertSettings({ filter: { name, types: settings?.filter?.types ?? '' }});
    if(!name) {
      setPokemons(pokemonsBackup);
    }
  };

  const filterTypes = (types: string[]) => {
    setFiltered(!!types.length);
    upsertSettings({ filter: { name: settings?.filter?.name ?? '', types: types.join(",") }});
    if(!types.length) {
      setPokemons(pokemonsBackup);
    }
  };

  if (!pokemons) return null;

  const refElement = showRef && !inView && !filtered && <div className="ref" ref={ref}></div>;

  return (
    <RootLayout title="Home">
      {settings &&
        <div className="wrapper h-[inherit] p-4 bg-background relative">
          <div className="flex items-center">
            <div className="flex items-center bg-(--pokedex-red-dark) p-2 md:w-max border-b-2 border-solid border-black rounded-t-lg">
              <PokedexFilter
                className="flex"
                name={settings.filter.name}
                types={settings.filter.types ? settings.filter.types.split(",") : []}
                onFilterName={filterName}
                onFilterTypes={filterTypes}
              />
              <div className="flex-1">
                <Tooltip content={t('settings.toggleView')}>
                  <label className="ml-4 flex">
                    <Squares2X2Icon className="w-7" />
                    <Toggle
                      className="mx-2"
                      id="list-table"
                      value={settings.listTable}
                      onChange={(value: boolean) => upsertSettings({ listTable: value })}
                    />
                    <TableCellsIcon className="w-7" />
                  </label>
                </Tooltip>
              </div>
            </div>
          </div>
          {
            !settings.listTable ?
              <PokedexList pokemons={pokemons}>{refElement}</PokedexList> :
              <PokedexTable pokemons={pokemons}>{refElement}</PokedexTable>
          }
          {loading && <Spinner /> }
          <div className="ml-4 text-xs text-right">
            Displaying {pokemons.length} of {TOTAL_POKEMON} Pokémon
          </div>
        </div>
      }
    </RootLayout>
  );
}
