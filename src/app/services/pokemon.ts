import { gql } from "graphql-request";
import { Pokemon } from "pokeapi-typescript";
import { formatResultsCount } from "../api/api-utils";
import { queryGraphql } from "./graphql";

export async function getPokemonById(vars: {
  id?: number | string;
  name?: string;
}) {
  const query = gql`
    query ($id: ID, $name: String) {
      pokemonById(id: $id, name: $name) {
        id
        name
        base_experience
        height
        weight
        is_default
        order
        location_area_encounters
        abilities {
          ability {
            name
            url
          }
          is_hidden
          slot
        }
        cries {
          latest
          legacy
        }
        forms {
          name
          url
        }
        game_indices {
          game_index
          version {
            name
            url
          }
        }
        moves {
          move {
            name
            url
          }
          version_group_details {
            level_learned_at
            move_learn_method {
              name
              url
            }
            order
            version_group {
              name
              url
            }
          }
        }
        past_abilities {
          abilities {
            ability {
              name
              url
            }
            is_hidden
            slot
          }
          generation {
            name
            url
          }
        }
        species {
          name
          url
        }
        sprites {
          other {
            dream_world {
              front_default
              front_female
            }
            home {
              front_default
              front_female
              front_shiny
              front_shiny_female
            }
            official_artwork {
              front_default
              front_shiny
            }
            showdown {
              front_default
              front_female
              front_shiny
              front_shiny_female
              back_default
              back_female
              back_shiny
              back_shiny_female
            }
          }
        }
        stats {
          base_stat
          effort
          stat {
            name
            url
          }
        }
        types {
          slot
          type {
            name
            url
          }
        }
      }
    }
  `;

  try {
    const data = await queryGraphql<{ pokemonById: Pokemon }>(query, vars);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getPokemonByIds(vars: { ids: string }) {
  const query = gql`
    query ($ids: [ID]) {
      pokemonsByIds(ids: $ids) {
        id
        name
        types {
          type {
            name
            url
          }
        }
        stats {
          base_stat
          stat {
            name
          }
        }
        forms {
          name
          url
        }
      }
    }
  `;

  try {
    const data = await queryGraphql<{ pokemonsByIds: Pokemon[] }>(query, vars);
    return formatResultsCount(data.pokemonsByIds);
  } catch (err) {
    throw err;
  }
}

export async function getAllPokemon(vars: {
  limit?: number;
  offset?: number;
  name?: string;
  types?: string;
}) {
  const query = gql`
    query ($limit: Int, $offset: Int, $name: String, $types: String) {
      pokemons(limit: $limit, offset: $offset, name: $name, types: $types) {
        id
        name
        types {
          type {
            name
            url
          }
        }
        stats {
          base_stat
          stat {
            name
          }
        }
      }
    }
  `;

  try {
    const data = await queryGraphql<{ pokemons: Pokemon[] }>(query, vars);
    return formatResultsCount(data.pokemons);
  } catch (err) {
    throw err;
  }
}
