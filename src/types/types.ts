import {
  NamedApiResource,
  Pokemon,
  PokemonForm,
  PokemonStat,
  PokemonType,
} from "pokeapi-typescript";

export type IPkmn = {
  name: string;
  types: PokemonType[];
  id: string;
  sprites: unknown;
  stats: PokemonStat[];
  forms: NamedApiResource<PokemonForm>[];
};

export type SpeciesChain = {
  loaded: boolean;
  chain: Record<string, Pokemon[]>;
};

export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type DefensiveMatchup = {
  weaknesses: Record<PokemonType, number>;
  resistances: Record<PokemonType, number>;
  immunities: Record<PokemonType, boolean>;
};
