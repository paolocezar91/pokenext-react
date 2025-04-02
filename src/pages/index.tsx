import '@/app/globals.css';
import RootLayout from '../components/layout/layout';
import PokeAPI, { IPokemon } from 'pokeapi-typescript';
import PokemonList from '@/components/list/list';

export async function getServerSideProps() {
  const from = 0;
  const to = 151;
  const pokemonList = await PokeAPI.Pokemon.list(to, from);
  const pokemons = await Promise.all(
    pokemonList.results.map(async (pkmn) => 
      await PokeAPI.Pokemon.resolve(pkmn.name)
    )
  )

  return {
    props: { pokemons }
  }
}

export default function Main({ pokemons }: { pokemons: IPokemon[] }) {
  return (
    <RootLayout>
      <PokemonList
        pokemons={pokemons}
      />
    </RootLayout>
  );
}
