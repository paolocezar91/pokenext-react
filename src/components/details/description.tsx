import { IPokemonSpecies } from "pokeapi-typescript";

const getFlavorText = (species: IPokemonSpecies) => {
  return species?.flavor_text_entries.find((text) => text.language.name === 'en')?.flavor_text.replace('', ' ') || '';
};

export default function PokemonDescription({ species }: { species: IPokemonSpecies }) {
  return (<div className="pokemon-description col-span-2 capitilize">
    <h3 className="text-lg font-semibold mb-2 ">{species.genera.find(g => g.language.name === 'en')?.genus}</h3>
    <p>{getFlavorText(species)}</p>
  </div>);
}