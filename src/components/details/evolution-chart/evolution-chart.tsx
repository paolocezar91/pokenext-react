import { SpeciesChain } from "@/app/types";
import Link from "next/link";
import { IChainLink, IEvolutionChain, IPokemon } from "pokeapi-typescript";
import { useTranslation } from "react-i18next";
import PokemonThumb from "../../thumb/thumb";
import PokemonEvolutionTrade from "./trade";
import PokemonEvolutionItem from "./item";
import PokemonEvolutionLocation from "./location";
import PokemonEvolutionLevel from "./lvl";
import PokemonEvolutionHappiness from "./happiness";

export const kebabToCapitilize = (name: string) => {
  return name.replaceAll('-',' ');
};

export default function PokemonEvolutionChart({ speciesChain, evolutionChain }: { evolutionChain: IEvolutionChain, speciesChain: SpeciesChain }) {
  const { t } = useTranslation();

  const chainColumn = ((chain: IPokemon[], evolves_to: IChainLink[]) =>
    <ul className="flex flex-col">
      {
        chain.map((pkmn, idx) => {
          const evolution_details = evolves_to[idx].evolution_details[0];
          return <li className="mb-2 items-center flex text-xs" key={idx}>
            <div className="flex flex-col items-center flex-1 mx-3">
              <span className="flex text-center">
                <PokemonEvolutionLevel evolution_details={evolution_details} />
                <PokemonEvolutionItem evolution_details={evolution_details} />
                <PokemonEvolutionLocation evolution_details={evolution_details} />
                <PokemonEvolutionHappiness evolution_details={evolution_details} />
                <PokemonEvolutionTrade evolution_details={evolution_details} />
              </span>
              <span className="font-bold text-xl">&mdash;&raquo;</span>
            </div>
            <Link className="flex-2" href={`/pokedex/${pkmn.name}`}>
              <PokemonThumb pokemonData={pkmn} size="tiny" />
            </Link>
          </li>
          ;
        })
      }
    </ul>
  );
  return (
    <div className="evolution-chain col-span-2 mt-2">
      <h3 className="text-lg font-semibold mb-4">- { t('pokedex.details.evolutionChart.title') } -</h3>
      {!!speciesChain.loaded && <ul className="flex items-start justify-arpund">
        {speciesChain.chain.first?.length &&
          <li>
            <Link className="flex-2" href={`/pokedex/${speciesChain.chain.first[0].name}`}>
              <PokemonThumb pokemonData={speciesChain.chain.first[0]} size="tiny"/>
            </Link>
          </li>
        }
        {!!speciesChain.chain.second?.length && <li>{chainColumn(speciesChain.chain.second, evolutionChain.chain.evolves_to)}</li>}
        {!!speciesChain.chain.third?.length && <li>{chainColumn(speciesChain.chain.third, evolutionChain.chain.evolves_to[0].evolves_to)}</li>}
      </ul>
      }
    </div>
  );
}