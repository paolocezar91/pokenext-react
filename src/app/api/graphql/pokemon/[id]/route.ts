import { idOrName } from '@/app/api-utils';
import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vars = idOrName(id);
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
    const data = await request<{ pokemonById: Record<string, unknown> }>(apiUrl, query, vars);
    return NextResponse.json(data.pokemonById, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
