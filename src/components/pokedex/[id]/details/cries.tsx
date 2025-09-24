import { Pokemon } from "pokeapi-typescript";

interface PokePokemon extends Pokemon {
  cries: {
    legacy?: string;
    latest?: string;
  };
}

export default function PokemonCries({ pokemon }: { pokemon: Pokemon }) {
  const cry = (pokemon as PokePokemon)?.cries?.latest;
  return (
    cry &&
      <div className="pokemon-cries w-full mt-2">
        <audio controls src={cry} className="w-full" />
      </div>

  );
}
