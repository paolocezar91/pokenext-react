import '@/app/globals.css';
import PokeApiQuery from '@/app/poke-api-query';
import PokedexList from '@/components/pokedex/pokedex-list/pokedex-list';
import PokedexTable from '@/components/pokedex/pokedex-table/pokedex-table';
import { PokedexSettings } from '@/components/pokedex/settings/pokedex-settings';
import LoadingSpinner from '@/components/shared/spinner';
import { useUser } from '@/context/user-context';
import { IPkmn } from '@/types/types';
import { Metadata, NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RootLayout from './layout';
import { NUMBERS_OF_POKEMON, STARTING_POKEMON, TOTAL_POKEMON } from '@/app/const';
import { getAllPokemon } from '@/app/services/pokemon';

const pokeApiQuery = new PokeApiQuery();

export const metadata: Metadata = {
  title: `Pokédex -- Next.js Demo`,
  description: 'By Paolo Pestalozzi with PokeAPI and Next.js.'
};

export async function getServerSideProps(context: NextPageContext) {
  const cookies = parseCookies(context);
  const settings = cookies.user_settings ? JSON.parse(cookies.user_settings) : {};
  // Use settings to filter
  const pokemonsData = (await getAllPokemon({ offset: STARTING_POKEMON, limit: NUMBERS_OF_POKEMON, ...settings.filter })).results;
  return { props: { pokemonsData, filterApplied: settings?.filter ?? { name: '', types: '' }}};
}

export default function Pokedex({ pokemonsData, filterApplied }: { pokemonsData: IPkmn[], filterApplied: { name: string, types: string }}) {
  const [pokemons, setPokemons] = useState<IPkmn[]>(pokemonsData);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<{ name: string, types: string }>(filterApplied);
  const { settings } = useUser();
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.filter]);

  if (!pokemons) return null;

  return (
    <RootLayout title="Home">
      {settings &&
        <div className="wrapper h-[inherit] pt-4 bg-background">
          <div className="flex items-start">
            <PokedexSettings />
            {settings.listTable ?
              <PokedexTable pokemons={pokemons}></PokedexTable>:
              <PokedexList pokemons={pokemons}>
                <div className="p-2 bg-background text-xs text-right sticky right-0 bottom-0">
                  {
                    pokemons.length === NUMBERS_OF_POKEMON ?
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
