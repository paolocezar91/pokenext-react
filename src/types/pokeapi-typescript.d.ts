import "pokeapi-typescript";
import { IMove, INamedApiResource } from "pokeapi-typescript";

declare module "pokeapi-typescript" {
  interface IType {
    moves: INamedApiResource<IMove>[];
  }
}
