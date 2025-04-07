import './[id].scss';
import PokeAPI, { IPokemon, IPokemonSpecies, IType } from 'pokeapi-typescript';
import { useEffect, useState } from 'react';
import { GetStaticPropsContext } from 'next';
import { Image } from 'react-bootstrap';
import Link from 'next/link';
import PokemonThumb from '@/components/thumb/thumb';
import RootLayout from '@/app/layout';
import { useParams } from 'next/navigation';
interface PokeIPokemon extends IPokemon {
  cries: {
    legacy?: string;
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = String(context?.params?.id) || '1';
  const pokemonData = await PokeAPI.Pokemon.resolve(id);

  return {
    props: { id, pokemonData }
  };
}

export function capitilize(s: string) {
  return String(s[0]).toUpperCase() + String(s).slice(1);
}

export function getStaticPaths() {
  const ids = Array.from({length: 151}, (_, i) => String(i + 1));

  return {
    paths: ids.map(id => ({ params: { id } })),
    fallback: true
  };
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
  const [pokemon, setPokemon] = useState<PokeIPokemon>(pokemonData);
  const [species, setSpecies] = useState<IPokemonSpecies>(speciesData);
  const [types, setTypes] = useState<IType[]>(typesData);  
  const params = useParams();
  const currentId = id || params?.id;

  useEffect(() => {
    if (!currentId) return;
    
    const setPokemonData = () => {
      const getPokemonMetadata = async () => {
        const fetchSpecies = async (id: string) => {
          try {
            return await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)).json();            
          } catch (error) {
            console.error(error);
          }
        };
        const fetchType = async (id: string) => {
          try {
            return await (await fetch(`https://pokeapi.co/api/v2/type/${id}`)).json();
          } catch (error) {
            console.error(error);
          }
        };
        
        const [speciesData, typesData] = await Promise.all([
          fetchSpecies(String(pokemonData.id)),
          Promise.all(pokemonData.types.map(type => fetchType(type.type.name)))
        ]);

        setPokemon(pokemonData);
        setSpecies(speciesData);
        setTypes(typesData);
      };
      
      
      getPokemonMetadata();
      
    };
    
    setPokemonData();
  }, [currentId, pokemon, pokemonData, speciesData, typesData]);
  
  const getFlavorText = () => {
    return species?.flavor_text_entries[0]?.flavor_text.replace('', ' ') || '';
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTypeIcon = (type: any): string => {
    return type['sprites']['generation-vi']['x-y'].name_icon;
  };
  
  const isNextFirstGen = () => {
    return pokemon ? pokemon.id + 1 <= 151: false;
  };
  
  const isPrevFirstGen = () => {
    return pokemon ? pokemon.id - 1 > 0 : false;
  };
  
  if (!pokemon || !species || types.length === 0) return 'Loading...';
  
  return (
    <RootLayout title={`Next.js Pokédex Demo - ${capitilize(pokemon.name)}`}>
      <div className="mx-auto p-4">
        <div className="flex">
          <div className="thumb flex flex-col items-start mr-4">
            <PokemonThumb pokemonData={pokemon} size="large" />            
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
          <div className="pokemon-details sm:mb-4 p-6 bg-white rounded-lg shadow-md">
            <div className="about">  
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
        </div>
        <div className="controls mt-6 flex justify-between">
          <div className="previous flex-1 text-left">
            <Link
              href={`/pokemon/${pokemon.id - 1}`}
              className={`px-4 py-2 bg-transparent border-transparent  ${!isPrevFirstGen() ? 'disable-click' : 'hover:text-gray-800'}`}
            >
              &lt; Prev
            </Link>
          </div>
          <div className="flex-1 text-center">
            <Link
              href='/'
              className="px-4 py-2 bg-transparent border-transparent hover:text-gray-800"
            >
              Back
            </Link>
          </div>
          <div className="next flex-1 text-right">
            <Link
              href={`/pokemon/${pokemon.id + 1}`}
              className={`px-4 py-2 bg-transparent border-transparent  ${!isNextFirstGen() ? 'disable-click' : 'hover:text-gray-800'}`}
            >
              Next &gt;
            </Link>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}