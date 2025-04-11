import { IPokemonSpecies } from "pokeapi-typescript";

const getFlavorText = (species: IPokemonSpecies) => {
  return species?.flavor_text_entries.find((text) => text.language.name === 'en')?.flavor_text.replace('', ' ') || '';
};

export default function PokemonDescription({ species }: { species: IPokemonSpecies }) {
  return (<div className="pokemon-description col-span-2 capitilize">
    <h2 className="text-lg font-semibold mb-4 ">
      <span className="capitalize">{ species.name }</span> -- {species.genera.find(g => g.language.name === 'en')?.genus}
    </h2>
    <p>{getFlavorText(species)}</p>
  </div>);
}