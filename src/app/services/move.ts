import { gql } from "graphql-request";
import { IMove } from "pokeapi-typescript";
import { formatResultsCount } from "../api/api-utils";
import { queryGraphql } from "./graphql";

export async function getMoveById(vars: {
  id?: number | string;
  name?: string;
}) {
  const query = gql`
    query ($id: Int, $name: String) {
      moveById(id: $id, name: $name) {
        id
        name
        power
        accuracy
        pp
        learned_by_pokemon {
          name
          url
        }
        target {
          name
          url
        }
        flavor_text_entries {
          flavor_text
          language {
            name
          }
          version_group {
            name
          }
        }
        type {
          name
          url
        }
        damage_class {
          name
        }
        effect_entries {
          language {
            name
          }
          effect
        }
      }
    }
  `;
  try {
    return await queryGraphql<{ moveById: IMove }>(query, vars);
  } catch (err) {
    throw err;
  }
}

export async function getMoveByIds(vars: { ids: string }) {
  const query = gql`
    query ($ids: [ID]) {
      movesByIds(ids: $ids) {
        id
        name
        power
        pp
        accuracy
        damage_class {
          name
        }
        type {
          name
          url
        }
        machines {
          machine {
            url
          }
          version_group {
            name
            url
          }
        }
      }
    }
  `;

  try {
    const data = await queryGraphql<{ movesByIds: IMove[] }>(query, vars);
    return formatResultsCount(data.movesByIds);
  } catch (err) {
    throw err;
  }
}

export async function getAllMoves() {
  const query = gql`
    query {
      moves {
        id
        name
      }
    }
  `;
  try {
    const data = await queryGraphql<{ moves: IMove[] }>(query);
    return formatResultsCount(data.moves);
  } catch (err) {
    throw err;
  }
}
