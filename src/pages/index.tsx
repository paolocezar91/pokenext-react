import '@/app/globals.css';
import PokeApiQuery from '@/app/poke-api-query';
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
import { Metadata, NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RootLayout from './layout';

const pokeApiQuery = new PokeApiQuery();
const NUMBERS_OF_POKEMON = 1025;
const STARTING_POKEMON = 0;
const TOTAL_POKEMON = 1025;

export const metadata: Metadata = {
  title: `Pokédex -- Next.js Demo`,
  description: 'By Paolo Pestalozzi with PokeAPI and Next.js.'
};

export async function getServerSideProps(context: NextPageContext) {
  const cookies = parseCookies(context);
  const settings = cookies.user_settings ? JSON.parse(cookies.user_settings) : {};
  // Use settings to filter
  const pokemonsData = (await pokeApiQuery.getPokemons(STARTING_POKEMON, NUMBERS_OF_POKEMON, settings.filter)).results;
  return { props: { pokemonsData, filterApplied: settings?.filter ?? { name: '', types: '' }}};
}

export default function Pokedex({ pokemonsData, filterApplied }: { pokemonsData: IPkmn[], filterApplied: { name: string, types: string }}) {
  const [pokemons, setPokemons] = useState<IPkmn[]>(pokemonsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<{ name: string, types: string }>(filterApplied);
  const { settings, upsertSettings } = useUser();
  const { t } = useTranslation('common');
  const { showSnackbar, hideSnackbar } = useSnackbar();

  // detect filter changes to query for pokemon
  useEffect(() => {
    if(
      !loading &&
      settings &&
      (
        settings.filter.name !== filtered.name ||
        settings.filter.types !== filtered.types
      )
    ) {
      setLoading(true);
      showSnackbar(`${t('pokedex.loading')}...`);
      setFiltered(settings.filter);
      pokeApiQuery.getPokemons(0, TOTAL_POKEMON, settings.filter)
        .then(({ results }) => {
          setPokemons(results);
          setTimeout(() => {
            setLoading(false);
            hideSnackbar();
          }, 0);
        });
    }
  }, [settings?.filter]);

  const filterName = (name: string) => {
    if(name !== settings?.filter.name) {
      const filter = { name, types: settings?.filter?.types ?? '' };
      upsertSettings({ filter });
    }
  };

  const filterTypes = (types: string[]) => {
    if(types.join(',') !== settings?.filter.types) {
      const filter = { name: settings?.filter?.name ?? '', types: types.join(",") };
      upsertSettings({ filter });
    }
  };

  if (!pokemons) return null;

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
              <div className="flex-1 pl-2 border-l-2 border-white">
                <Tooltip content={t('settings.toggleView')}>
                  <label className="flex transition-colors hover:bg-(--pokedex-red-darker) p-2 rounded">
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
              <PokedexList pokemons={pokemons}></PokedexList> :
              <PokedexTable pokemons={pokemons}></PokedexTable>
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
