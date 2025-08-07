import PokeApiQuery from "@/app/poke-api-query";
import { getIdFromUrlSubstring } from "@/components/shared/utils";
import { SpeciesChain } from "@/types/types";
import { IEvolutionChain, IPokemon, IPokemonSpecies, IType } from "pokeapi-typescript";

const pokeApiQuery = new PokeApiQuery();

export type PokemonState = {
  pokemon: IPokemon;
  speciesChain: SpeciesChain;
  species: IPokemonSpecies & { is_legendary?: boolean; is_mythical?: boolean } | null;
  types: IType[];
  evolutionChain: IEvolutionChain | null;
};

export type PokemonAction =
  | { type: 'SET_POKEMON'; payload: IPokemon }
  | { type: 'SET_SPECIES_CHAIN'; payload: SpeciesChain }
  | { type: 'SET_SPECIES'; payload: IPokemonSpecies & { is_legendary?: boolean; is_mythical?: boolean }}
  | { type: 'SET_TYPES'; payload: IType[] }
  | { type: 'SET_EVOLUTION_CHAIN'; payload: IEvolutionChain }
  | { type: 'RESET_STATE' };

export async function generateSpeciesEvolutionChain(ec: IEvolutionChain): Promise<SpeciesChain> {
  const evolve_to_id = getIdFromUrlSubstring(ec.chain.species.url);
  const chain: { first: IPokemon[], second: IPokemon[], third: IPokemon[] } = {
    first: [await pokeApiQuery.getPokemonById(evolve_to_id)],
    second: [],
    third: [],
  };

  const secondEvo = ec.chain?.evolves_to?.[0];
  if(secondEvo) {
    chain.second = await Promise.all(
      ec.chain.evolves_to.map((evolves_to) => {
        const evolve_to_id = getIdFromUrlSubstring(evolves_to.species.url);
        return pokeApiQuery.getPokemonById(evolve_to_id);
      })
    );

    if(secondEvo.evolves_to[0]) {
      chain.third = await Promise.all(
        secondEvo.evolves_to.map((evolves_to) => {
          const evolve_to_id = getIdFromUrlSubstring(evolves_to.species.url);
          return pokeApiQuery.getPokemonById(evolve_to_id);
        })
      );
    }
  }

  return { loaded: true, chain };
}