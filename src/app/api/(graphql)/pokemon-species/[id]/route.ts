import { idOrName } from "@/app/api/api-utils";
import { queryGraphql } from "@/app/services/graphql";
import { gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { IPokemonSpecies } from "pokeapi-typescript";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vars = idOrName(id);
  const query = gql`
    query ($id: Int, $name: String) {
      pokemonSpecies(id: $id, name: $name) {
        base_happiness
        capture_rate
        color {
          name
          url
        }
        egg_groups {
          name
          url
        }
        evolution_chain {
          url
        }
        evolves_from_species {
          name
          url
        }
        flavor_text_entries {
          flavor_text
          language {
            name
            url
          }
          version {
            name
            url
          }
        }
        form_descriptions {
          description
          language {
            name
            url
          }
        }
        forms_switchable
        gender_rate
        genera {
          genus
          language {
            name
            url
          }
        }
        generation {
          name
          url
        }
        growth_rate {
          name
          url
        }
        habitat {
          name
          url
        }
        has_gender_differences
        hatch_counter
        id
        is_baby
        is_legendary
        is_mythical
        name
        names {
          name
          language {
            name
            url
          }
        }
        shape {
          name
          url
        }
        varieties {
          is_default
          pokemon {
            name
            url
          }
        }
      }
    }
  `;

  try {
    const { pokemonSpecies } = await queryGraphql<{
      pokemonSpecies: IPokemonSpecies;
    }>(query, vars);
    return NextResponse.json(pokemonSpecies, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
