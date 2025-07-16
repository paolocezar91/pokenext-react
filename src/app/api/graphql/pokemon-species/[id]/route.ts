import { gql, request } from 'graphql-request';
import { NextResponse } from 'next/server';

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_, { params }: { params: { id: string }}) {
  const idOrName = (await params).id;
  const isId = !isNaN(Number(idOrName));
  const name = isId ? '' : idOrName;
  const id = isId ? Number(idOrName) : undefined;
  const vars = { name, id };
  const query = gql`
      query ($id: Int, $name: String) {
        pokemonSpecies(id: $id, name: $name) {
          base_happiness
          capture_rate
          color { name url }
          egg_groups { name url }
          evolution_chain { url }
          evolves_from_species { name url }
          flavor_text_entries {
            flavor_text
            language { name url }
            version { name url }
          }
          form_descriptions {
            description
            language { name url }
          }
          forms_switchable
          gender_rate
          genera { genus language { name url } }
          generation { name url }
          growth_rate { name url }
          habitat { name url }
          has_gender_differences
          hatch_counter
          id
          is_baby
          is_legendary
          is_mythical
          name
          names { language { name url } name }
          shape { name url }
          varieties {
            is_default
            pokemon { name url }
          }
        }
      }
    `;

  try {
    const data = await request<{ pokemonSpecies: Record<string, unknown> }>(apiUrl, query, vars);
    return NextResponse.json(data.pokemonSpecies, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}
