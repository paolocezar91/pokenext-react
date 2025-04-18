import { IPokemon, IPokemonStat, IPokemonType } from "pokeapi-typescript";

export type IPkmn = {
    name: string;
    types: IPokemonType[]
    id: number;
    sprites: unknown;
    stats: IPokemonStat[]
}

export type SpeciesChain = {
    loaded: boolean;
    chain: Record<string, IPokemon[]>
};