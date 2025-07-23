import '@/app/globals.css';
import PokeApiQuery from '@/app/poke-api-query';
import PokedexFilter from '@/components/pokedex/pokedex-list/pokedex-filter';
import PokedexList from '@/components/pokedex/pokedex-list/pokedex-list';
import PokedexTable from '@/components/pokedex/pokedex-table/pokedex-table';
import LoadingSpinner from '@/components/shared/spinner';
import Tooltip from '@/components/shared/tooltip/tooltip';
import { useUser } from '@/context/user-context';
import { IPkmn } from '@/types/types';
import { Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/solid';
import { Metadata, NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
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

  const detectFilterChange = () => settings && (settings.filter.name !== filtered.name || settings.filter.types !== filtered.types);

  // detect filter changes to query for pokemon
  useEffect(() => {
    if(!loading && detectFilterChange()) {
      setLoading(true);
      setFiltered(settings!.filter);
      pokeApiQuery.getPokemons(0, TOTAL_POKEMON, settings!.filter)
        .then(({ results }) => {
          setPokemons(results);
          setTimeout(() => {
            setLoading(false);
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
        <div className="wrapper h-[inherit] pt-4 bg-background relative">
          <div className="flex items-start">
            <div className="flex flex-col items-center bg-(--pokedex-red-dark) p-2 md:w-max border-b-2 border-solid border-black rounded-l-lg">
              <PokedexFilter
                name={settings.filter.name}
                types={settings.filter.types ? settings.filter.types.split(",") : []}
                onFilterName={filterName}
                onFilterTypes={filterTypes}
              />
              <Tooltip className="mt-1" content={t('settings.toggleView')}>
                <Button
                  onClick={() => upsertSettings({ listTable: !settings.listTable })}
                  className="
                    cursor-pointer
                    flex
                    p-2
                    rounded
                    transition-colors
                    hover:bg-(--pokedex-red-darker)
                  ">
                  {settings.listTable ?
                    <Squares2X2Icon className="w-6" /> :
                    <TableCellsIcon className="w-6" />}
                </Button>
              </Tooltip>
            </div>
            {settings.listTable ?
              <PokedexTable pokemons={pokemons}></PokedexTable>:
              <PokedexList pokemons={pokemons}>
                <div className="p-2 bg-background text-xs text-right sticky right-0 bottom-0">
                  {
                    pokemons.length === 1025 ?
                      t('pokedex.displayingAllPokemon') :
                      t('pokedex.displayingXofYPokemon', { x: pokemons.length, y: TOTAL_POKEMON })
                  }
                </div>
              </PokedexList>
            }
            {loading && <LoadingSpinner /> }
          </div>
        </div>
      }
    </RootLayout>
  );
}
