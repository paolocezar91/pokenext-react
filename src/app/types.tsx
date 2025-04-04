import { IPokemonType } from "pokeapi-typescript";

export type IPkmn = {
    name: string;
    types: IPokemonType[]
    id: number;
}