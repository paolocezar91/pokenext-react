import { INamedApiResource, IPokemon, IPokemonForm, IPokemonStat, IPokemonType } from "pokeapi-typescript";

export type IPkmn = {
  name: string;
  types: IPokemonType[]
  id: number;
  sprites: unknown;
  stats: IPokemonStat[]
  forms: INamedApiResource<IPokemonForm>[]
};

export type SpeciesChain = {
  loaded: boolean;
  chain: Record<string, IPokemon[]>
};

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic'
  | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type DefensiveMatchup = {
  weaknesses: Record<PokemonType, number>;
  resistances: Record<PokemonType, number>;
  immunities: Record<PokemonType, boolean>;
};

export type UserSettings = {
  artworkUrl: string;
  descriptionLang: string;
  listTable: boolean;
  showColumn: boolean[];
  showShowColumn: boolean;
  showThumbTable: boolean;
  thumbLabelList: string;
  thumbSizeList: string;
  typeArtworkUrl: string;
};