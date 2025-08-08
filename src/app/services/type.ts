import { gql } from "graphql-request";
import { IType } from "pokeapi-typescript";
import { requestGraphql } from "./graphql";

export async function getTypeById(vars: { id?: number | string, name?: string }) {
  const query = gql`
    query ($id: Int, $name: String) {
      pokemonType(id: $id, name: $name) {
        id
        name
        pokemon {
          pokemon { name url }
        }
        moves { name url }
      }
    }
  `;

  try {
    return await requestGraphql<{ pokemonType: IType }>(query, vars);
  } catch (err) {
    throw err;
  }
}

export async function getAllTypes() {
  const query = gql`
    query {
      types {
          id
          name
      }
    }
  `;

  try {
    return await requestGraphql<{ types: IType[] }>(query);
  } catch(err) {
    throw err;
  }
}