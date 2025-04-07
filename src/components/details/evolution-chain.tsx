'use server';
import { SpeciesChain } from "@/app/types";
import PokemonThumb from "../thumb/thumb";
import { IChainLink, IEvolutionChain, IPokemon } from "pokeapi-typescript";
import Link from "next/link";

export default function PokemonEvolutionChain({ speciesChain, evolutionChain }: { evolutionChain: IEvolutionChain, speciesChain: SpeciesChain }) {
  const chainColumn = ((chain: IPokemon[], evolves_to: IChainLink[]) =>
    <li className="ml-3">
      <ul className="flex flex-col">
        {
          chain.map((pkmn, idx) => {
            const evolution_details = evolves_to[idx].evolution_details[0];
            console.log(evolution_details);
            return <li className="mb-2 items-center flex text-xs" key={idx}>
              <div className="flex flex-col items-center flex-2 mx-3">
                <span className="flex">
                  {evolution_details.min_level && <span>lvl {evolution_details.min_level}</span>}
                  {evolution_details.item?.name && <span>use {evolution_details.item?.name}</span>}
                  {evolution_details.time_of_day && <span>{evolution_details.time_of_day} time</span>}
                  {evolution_details.location?.name && <span>at {evolution_details.location.name}</span>}
                  {evolution_details.min_happiness && <span>high friendship</span>}
                  {evolution_details.trigger.name === 'trade' && <span>trade {evolution_details.held_item?.name && <span>(holding {evolution_details.held_item?.name})</span>}</span>}
                </span>
                <span className="font-bold text-xl">&mdash;&raquo;</span>
              </div>
              <Link className="flex-1" href={`/pokemon/${pkmn.name}`}>
                <PokemonThumb pokemonData={pkmn} size="tiny" />
              </Link>
            </li>
            ;
          })
        }
      </ul>
    </li>
  );
  return (
    <div className="evolution-chain col-span-2 mt-2">
      <h3 className="text-lg font-semibold mb-2">Evolution Chart</h3>
      {!!speciesChain.loaded && <ul className="flex items-center">
        {speciesChain.chain.first?.length &&
          <li>
            <Link href={`/pokemon/${speciesChain.chain.first[0].name}`}>
              <PokemonThumb pokemonData={speciesChain.chain.first[0]} size="tiny"/>
            </Link>
          </li>
        }
        {!!speciesChain.chain.second?.length && chainColumn(speciesChain.chain.second, evolutionChain.chain.evolves_to)}
        {!!speciesChain.chain.third?.length && chainColumn(speciesChain.chain.third, evolutionChain.chain.evolves_to[0].evolves_to)}
      </ul>
      }
    </div>
  );
}