import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PokeAPI, { IPokemon, IPokemonSpecies, IType } from 'pokeapi-typescript';
import { Image } from 'react-bootstrap';
import { getArtwork, getBackgroundStyle, getNumber } from '@/components/thumb/thumb';
import RootLayout from '@/components/layout/layout';
import Link from 'next/link';
import { GetStaticPropsContext } from 'next';
import './[id].scss';
interface PokeIPokemon extends IPokemon {
  cries: {
    legacy?: string;
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.id) || '1';
  const pokemonData = await PokeAPI.Pokemon.resolve(id)
  const [speciesData, typesData] = await Promise.all([
    PokeAPI.PokemonSpecies.fetch(pokemonData.id),
    Promise.all(pokemonData.types.map(type => 
      PokeAPI.Type.fetch(type.type.name)
    ))
  ]);

  return {
    props: { id, pokemonData, speciesData, typesData }
  }
}

export function getStaticPaths() {
  const ids = Array.from({length: 151}, (_, i) => String(i + 1));

  return {
    paths: ids.map(id => ({ params: { id } })),
    fallback: false
  }
}

export default function PokemonDetails({
  id,
  pokemonData,
  speciesData,
  typesData 
}: {
  id: string,
  pokemonData: PokeIPokemon;
  speciesData: IPokemonSpecies;
  typesData: IType[];
}) {
  const [pokemon, setPokemon] = useState<PokeIPokemon | null>(null);
  const [species, setSpecies] = useState<IPokemonSpecies | null>(null);
  const [types, setTypes] = useState<IType[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const currentId = id || params?.id;

  useEffect(() => {
    if (!currentId) return;
    
    const setPokemonData = () => {
      try {
        // Fetch pokemon data
        setPokemon(pokemonData);
        setSpecies(speciesData);
        setTypes(typesData);
      } catch (err) {
        setError('Failed to fetch Pokémon data');
        console.error(err);
      }
    };
    
    setPokemonData();
  }, [currentId, pokemonData, speciesData, typesData]);
  
  const getFlavorText = () => {
    return species?.flavor_text_entries[0]?.flavor_text.replace('', ' ') || '';
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTypeIcon = (type: any): string => {
    return type['sprites']['generation-iv']['heartgold-soulsilver'].name_icon;
  };
  
  const isNextFirstGen = () => {
    return pokemon ? pokemon.id + 1 <= 151: false;
  };
  
  const isPrevFirstGen = () => {
    return pokemon ? pokemon.id - 1 > 0 : false;
  };
  
  if (error) return <div>Error: {error}</div>;
  if (!pokemon || !species || types.length === 0) return 'Loading...';
  
  return (
    <RootLayout>
      <div className="mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-x-4 divide-[#111]">
          <div className="md:col-span-1 flex flex-col items-start">
            <div 
              className="pokemon-image w-full flex flex-col justify-center items-center p-4 rounded-lg shadow-md"
              style={getBackgroundStyle(pokemon.types)}
            >
                <div className="img-hover-zoom pt-1">
                  <Image
                    className="artwork max-w-full h-auto" 
                    src={getArtwork(pokemon.id)} 
                    alt={pokemon.name} 
                  />
                </div>
              <span className="name capitalize">{pokemon.name}</span>
              <span className="id pb-2">#{getNumber(pokemon.id)}</span>
            </div>
            <div className="pokemon-types w-full mt-4 mb-4 flex flex-wrap gap-2">
              {types.map((type, i) => (
                <Image
                  key={i}
                  src={getTypeIcon(type)}
                  height="100%"
                  alt={type.name} 
                  className="h-5"
                />
              ))}
            </div>
          </div>
        
          <div className="md:col-span-3 pokemon-details p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 border-b-white pb-4 border-b-4">
              About <span className="capitalize">{pokemon.name}</span>
            </h2>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="pokemon-description">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p>{getFlavorText()}</p>
              </div>
          
              <div className="pokemon-size">
                <h3 className="text-lg font-semibold mb-2">Size</h3>
                <p>Height: {pokemon.height / 10} m</p>
                <p>Weight: {pokemon.weight / 10} kg</p>
              </div>
          
              <div className="pokemon-abilities">
                <h3 className="text-lg font-semibold mb-2">Abilities</h3>
                <ul className="list-disc pl-5">
                  {pokemon.abilities.map((ability, i) => (
                    <li key={i} className="capitalize">
                    {ability.ability.name}
                    </li>
                  ))}
                </ul>
              </div>
          
              {pokemon.cries?.legacy && (
                <div className="pokemon-cries">
                <h3 className="text-lg font-semibold mb-2">Cry</h3>
                <audio controls src={pokemon.cries.legacy} className="w-full" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="controls mt-6 flex justify-between">
          <div className="previous">
            <Link
              href={`/pokemon/${pokemon.id - 1}`}
              className={`px-4 py-2 bg-transparent border-transparent  ${!isPrevFirstGen() ? 'disable-click' : 'hover:text-gray-800'}`}
            >
              &lt;&lt; Previous
            </Link>
          </div>
          <div>
            <Link
              href='/'
              className="px-4 py-2 bg-transparent border-transparent hover:text-gray-800"
            >
              Back to List
            </Link>
          </div>
          <div className="next">
            <Link
              href={`/pokemon/${pokemon.id + 1}`}
              className={`px-4 py-2 bg-transparent border-transparent  ${!isNextFirstGen() ? 'disable-click' : 'hover:text-gray-800'}`}
            >
              Next &gt;&gt;
            </Link>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}