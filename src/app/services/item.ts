import { gql } from "graphql-request";
import { IItem } from "pokeapi-typescript";
import { formatResultsCount } from "../api/api-utils";
import { queryGraphql } from "./graphql";

export async function getItemById(vars: {
  id?: number | string;
  name?: string;
}) {
  const query = gql`
    query ($id: Int, $name: String) {
      itemById(id: $id, name: $name) {
        id
        name
        cost
        fling_power
        fling_effect {
          name
          url
        }
        attributes {
          name
          url
        }
        category {
          name
        }
        effect_entries {
          effect
          short_effect
          language {
            name
            url
          }
        }
        flavor_text_entries {
          text
          language {
            name
            url
          }
          version_group {
            name
            url
          }
        }
        game_indices {
          game_index
          generation {
            name
            url
          }
        }
        names {
          name
          language {
            name
            url
          }
        }
        sprites {
          default
        }
        held_by_pokemon {
          pokemon {
            name
            url
          }
          version_details {
            rarity
            version {
              name
              url
            }
          }
        }
        baby_trigger_for
        machines {
          machine {
            name
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
    const data = await queryGraphql<{ itemById: IItem }>(query, vars);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getItemByIds(vars: { ids: string }) {
  const query = gql`
    query ($ids: [ID]) {
      itemsByIds(ids: $ids) {
        id
        name
      }
    }
  `;

  try {
    const data = await queryGraphql<{ itemsByIds: IItem[] }>(query, vars);
    return formatResultsCount(data.itemsByIds);
  } catch (err) {
    throw err;
  }
}

export async function getAllItem(vars: {
  limit?: number;
  offset?: number;
  name?: string;
}) {
  const query = gql`
    query ($limit: Int, $offset: Int, $name: String) {
      items(limit: $limit, offset: $offset, name: $name) {
        id
        name
        cost
        category {
          name
        }
      }
    }
  `;

  try {
    const data = await queryGraphql<{ items: IItem[] }>(query, vars);
    return formatResultsCount(data.items);
  } catch (err) {
    throw err;
  }
}
