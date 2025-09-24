import "pokeapi-typescript";
import { Move, NamedApiResource } from "pokeapi-typescript";

declare module "pokeapi-typescript" {
  interface Type {
    moves: NamedApiResource<Move>[];
  }
}
